const { getTokenizer } = require("kuromojin");

/**
 * ですます調の文書で、文末が plain form（常体）になっている箇所を検出する。
 *
 * analyze-desumasu-dearu が検出しない以下のパターンを補完する:
 * - 動詞の基本形: 「している。」「できる。」「する。」「なる。」
 * - 助動詞「だ」: 「重要だ。」「〜のだ。」
 * - 助動詞「た」: 「完了した。」
 * - 形容詞の基本形: 「ない。」「少ない。」
 */

const defaultOptions = {
  // 「した。」「〜された。」等の過去形を検出するか
  detectPastTense: false,
};

/**
 * 句点（。!?）のトークンか判定
 */
function isPunctuation(token) {
  return /^[。！？!?]$/.test(token.surface_form);
}

/**
 * 文末トークンが plain form かどうかを判定
 */
function isPlainFormEnding(token, options) {
  const { pos, conjugated_type, conjugated_form } = token;

  // 基本形でなければ対象外
  if (conjugated_form !== "基本形") return false;

  // 助動詞「だ」(特殊・ダ) の基本形 → 「重要だ。」
  if (pos === "助動詞" && conjugated_type === "特殊・ダ") return true;

  // 助動詞「た」(特殊・タ) の基本形 → 「完了した。」
  if (options.detectPastTense) {
    if (pos === "助動詞" && conjugated_type === "特殊・タ") return true;
  }

  // 動詞の基本形 → 「している。」「できる。」「する。」「なる。」
  if (pos === "動詞") return true;

  // 形容詞の基本形 → 「ない。」「少ない。」
  if (pos === "形容詞") return true;

  return false;
}

/**
 * トークン列から sentence-ending のペア (plainToken, punctuationToken) を抽出
 */
function findPlainFormEndings(tokens, options) {
  const results = [];

  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];

    if (!isPunctuation(nextToken)) continue;
    if (!isPlainFormEnding(token, options)) continue;

    results.push({
      token,
      value: token.surface_form + nextToken.surface_form,
      index: token.word_position - 1,
    });
  }

  return results;
}

module.exports = function noPlainFormSentenceEnding(
  context,
  options = defaultOptions,
) {
  const { Syntax, getSource, RuleError, report } = context;
  const detectPastTense =
    options.detectPastTense !== undefined
      ? options.detectPastTense
      : defaultOptions.detectPastTense;
  const ruleOptions = { detectPastTense };

  let queue = Promise.resolve();

  return {
    [Syntax.Str](node) {
      queue = queue.then(() => {
        const text = getSource(node);
        return getTokenizer().then((tokenizer) => {
          const tokens = tokenizer.tokenizeForSentence(text);
          const hits = findPlainFormEndings(tokens, ruleOptions);

          for (const hit of hits) {
            const ruleError = new RuleError(
              `ですます調の文末に常体が使われています: "${hit.value}" → 丁寧形にしてください`,
              { index: hit.index },
            );
            report(node, ruleError);
          }
        });
      });
    },
    [`${Syntax.Document}:exit`]() {
      return queue;
    },
  };
};
