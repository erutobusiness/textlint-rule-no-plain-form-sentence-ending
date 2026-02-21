# textlint-rule-no-plain-form-sentence-ending

[![npm](https://img.shields.io/npm/v/textlint-rule-no-plain-form-sentence-ending.svg)](https://www.npmjs.com/package/textlint-rule-no-plain-form-sentence-ending)
[![test](https://github.com/erutobusiness/textlint-rule-no-plain-form-sentence-ending/actions/workflows/test.yml/badge.svg)](https://github.com/erutobusiness/textlint-rule-no-plain-form-sentence-ending/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

textlint rule to detect plain form (常体) sentence endings in desumasu-style (敬体) documents.

[analyze-desumasu-dearu](https://github.com/azu/analyze-desumasu-dearu) does not detect certain plain form patterns. This rule complements it by catching:

- Verb in dictionary form: 「動作する。」
- Auxiliary 「だ」: 「重要だ。」
- Adjective in dictionary form: 「少ない。」
- (Optional) Past tense 「た」: 「完了した。」

## Installation

```bash
npm install textlint-rule-no-plain-form-sentence-ending
```

## Usage

Add this rule to your `.textlintrc` (or `.textlintrc.json`).

```json
{
    "rules": {
        "no-plain-form-sentence-ending": true
    }
}
```

## Configuration

| Option | Type | Default | Description |
|---|---|---|---|
| `detectPastTense` | `boolean` | `false` | Detect past tense endings like 「した。」「された。」 |

### Example

To also detect past tense endings:

```json
{
    "rules": {
        "no-plain-form-sentence-ending": {
            "detectPastTense": true
        }
    }
}
```

## Recommended Combination

Use this rule together with [textlint-rule-no-mix-dearu-desumasu](https://github.com/textlint-ja/textlint-rule-no-mix-dearu-desumasu) for comprehensive style checking.

```json
{
    "rules": {
        "no-mix-dearu-desumasu": {
            "preferInBody": "ですます"
        },
        "no-plain-form-sentence-ending": true
    }
}
```

## Development

1.  Clone the repository:
    ```bash
    git clone https://github.com/erutobusiness/textlint-rule-no-plain-form-sentence-ending.git
    cd textlint-rule-no-plain-form-sentence-ending
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run tests & lint:
    ```bash
    npm test
    npm run lint
    npm run format
    ```

## License

MIT © [erutobusiness](https://github.com/erutobusiness)
