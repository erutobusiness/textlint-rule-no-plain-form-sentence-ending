const TextLintTester =
  require("textlint-tester").default || require("textlint-tester");
const tester = new TextLintTester();
const rule = require("../index");

tester.run("textlint-rule-no-plain-form-sentence-ending", rule, {
  valid: [
    {
      text: "これは正しいです。",
    },
    {
      text: "問題なく動作しています。",
    },
    {
      // 句点なしの常体は対象外
      text: "これは動作する",
    },
    {
      // 体言止めは対象外
      text: "次の手順。",
    },
    {
      // detectPastTense: false（デフォルト）なら過去形は無視
      text: "処理が完了した。",
    },
  ],
  invalid: [
    {
      // 動詞の基本形
      text: "これは動作する。",
      errors: [
        {
          message:
            'ですます調の文末に常体が使われています: "する。" → 丁寧形にしてください',
        },
      ],
    },
    {
      // 助動詞「だ」
      text: "これは重要だ。",
      errors: [
        {
          message:
            'ですます調の文末に常体が使われています: "だ。" → 丁寧形にしてください',
        },
      ],
    },
    {
      // 形容詞の基本形
      text: "数が少ない。",
      errors: [
        {
          message:
            'ですます調の文末に常体が使われています: "少ない。" → 丁寧形にしてください',
        },
      ],
    },
    {
      // detectPastTense: true で過去形を検出
      text: "処理が完了した。",
      options: {
        detectPastTense: true,
      },
      errors: [
        {
          message:
            'ですます調の文末に常体が使われています: "た。" → 丁寧形にしてください',
        },
      ],
    },
  ],
});
