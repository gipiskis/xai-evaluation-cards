# Template

The blank XAI Evaluation Card in four formats. The field descriptions are Table 1 of the
paper.

| File | Format |
|---|---|
| [`xai-evaluation-card.md`](xai-evaluation-card.md) | Markdown, for a repository or supplementary material |
| [`xai-evaluation-card.tex`](xai-evaluation-card.tex) | LaTeX table for a paper appendix |
| [`xai-evaluation-card.yaml`](xai-evaluation-card.yaml) | YAML, with comments |
| [`xai-evaluation-card.json`](xai-evaluation-card.json) | JSON |

The [field guide](field-guide.md) explains each field. The
[card builder](https://gipiskis.github.io/xai-evaluation-cards/builder.html) exports all four
formats.

The YAML and JSON formats add optional fields to the twelve fields of the paper's card, such
as `aliases`, `data_modalities`, `explanation_scope` and `sensitivity_analysis`. They can be
checked against the [JSON Schema](../schema/).
