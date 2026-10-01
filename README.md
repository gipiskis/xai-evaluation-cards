# XAI Evaluation Cards

A documentation template for explainable AI evaluation metrics.

Rokas Gipiškis and Olga Kurasova. 2026. **Evaluation Cards for XAI Metrics.** In *Proceedings
of the Workshop on Evaluating Evaluations (EvalEval)*, ACL 2026, pages 245–251, San Diego, CA.
Association for Computational Linguistics. [ACL Anthology](https://aclanthology.org/2026.evaleval-1.39/)<br>
Earlier version: *5th Explainable AI for Computer Vision (XAI4CV) Workshop*, CVPR 2026
(non-proceedings track). [arXiv:2605.04410](https://arxiv.org/abs/2605.04410)

This repository contains the templates, a JSON Schema and a card builder for the XAI
Evaluation Card.

Card builder: <https://gipiskis.github.io/xai-evaluation-cards/builder.html>

## Background

The evaluation of explainable AI (XAI) methods is affected by a lack of standardization.
Metrics are inconsistently defined, incompletely reported, and rarely validated against
common baselines. Our meta-review of eleven surveys published between 2021 and 2025 identified
five recurring problems:

1. Metrics are introduced without declaring which properties they target.
2. Results are reported without specifying the evaluation context in which they are valid.
3. Few metrics include sensitivity or stability analysis as part of their original proposal.
4. Metric disagreements are rarely acknowledged and interpreted.
5. Implementation availability is inconsistent, with many metrics remaining at the level of
   theoretical definitions.

The XAI Evaluation Card is designed to address all five.

## The card

The card is analogous to [model cards](https://arxiv.org/abs/1810.03993) (Mitchell et al.,
2019) and [datasheets](https://arxiv.org/abs/1803.09010) (Gebru et al., 2021). Where model
cards document what a model does and for whom, evaluation cards document how the quality of
an explanation is being measured and under what conditions that measurement is valid.

The template (Table 1 in the paper):

<table>
<tr><th colspan="2" align="left">I. Identity</th></tr>
<tr><td width="230">Metric Name</td><td>Unique, descriptive name for the evaluation metric.</td></tr>
<tr><td>Target Property / Properties</td><td>List all explainability properties this metric operationalizes (e.g., fidelity, robustness, clarity), with references to definitions used.</td></tr>
<tr><td>Grounding Level</td><td>One or more of: functionally-grounded / human-grounded / application-grounded (Doshi-Velez and Kim, 2017).</td></tr>
<tr><th colspan="2" align="left">II. Scope and Context</th></tr>
<tr><td>Evaluation Context</td><td>Model architecture, data modality, and explanation scope (local / global) under which results are reported.</td></tr>
<tr><td>Assumptions</td><td>All assumptions required by the metric (e.g., feature independence, locality, linearity, calibrated probabilities, meaningful baselines).</td></tr>
<tr><th colspan="2" align="left">III. Implementation and Validation</th></tr>
<tr><td>Implementation Available?</td><td>Yes / No. If yes, provide URL or repository reference.</td></tr>
<tr><td>Validation Evidence</td><td>Summary of sensitivity analysis, stability analysis, and correlation with related metrics. Report computational cost where relevant.</td></tr>
<tr><td>Gaming Risk</td><td>How a method could achieve a high score on this metric without improving the target explainability property.</td></tr>
<tr><td>Known Failure Cases</td><td>Conditions under which the metric is known to fail or produce misleading results.</td></tr>
<tr><th colspan="2" align="left">IV. Relationships and Limitations</th></tr>
<tr><td>Relationship to Other Metrics</td><td>Metrics targeting the same property. Known agreements or disagreements in results.</td></tr>
<tr><td>Disagreement Handling</td><td>If this metric conflicts with others reported, state which property is prioritised for the target deployment scenario and why.</td></tr>
<tr><td>Limitations</td><td>Main limitations as an operationalization of the target property. Note contexts where the metric should not be used.</td></tr>
</table>

Fields marked N/A require a brief justification. The card is non-prescriptive: it does not
mandate any particular grounding level, metric, or validation procedure.

## Usage

- Fill in a template: [Markdown](template/xai-evaluation-card.md),
  [LaTeX](template/xai-evaluation-card.tex), [YAML](template/xai-evaluation-card.yaml) or
  [JSON](template/xai-evaluation-card.json).
- Or use the [card builder](https://gipiskis.github.io/xai-evaluation-cards/builder.html),
  which exports all four formats.
- The [field guide](template/field-guide.md) explains each field.
- The [Deletion AUC card](examples/deletion-auc.md) is the filled example from Appendix A of
  the paper.
- Cards in YAML or JSON can be checked against the [JSON Schema](schema/) with any standard
  JSON Schema validator.

This repository accompanies the paper and is not actively maintained.

## License

The template, schema, documentation and example are licensed under
[CC BY 4.0](LICENSE-CC-BY-4.0.md). The card builder in `docs/` is licensed under
[MIT](LICENSE).

## Citation

If you use the XAI Evaluation Card, please cite:

> Rokas Gipiškis and Olga Kurasova. 2026. Evaluation Cards for XAI Metrics. In *Proceedings
> of the Workshop on Evaluating Evaluations (EvalEval)*, pages 245–251, San Diego, CA.
> Association for Computational Linguistics.

```bibtex
@inproceedings{gipiskis-kurasova-2026-evaluation,
    title = "Evaluation Cards for {XAI} Metrics",
    author = "Gipi{\v{s}}kis, Rokas  and
      Kurasova, Olga",
    editor = "Akhtar, Mubashara  and
      Batzner, Jan  and
      Choshen, Leshem  and
      Ghosh, Avijit  and
      Gohar, Usman  and
      Mickel, Jennifer  and
      Pant, Ichhya  and
      Talat, Zeerak  and
      Lin, Michelle",
    booktitle = "Proceedings of the Workshop on Evaluating Evaluations ({E}val{E}val)",
    month = jul,
    year = "2026",
    address = "San Diego, CA",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2026.evaleval-1.39/",
    doi = "10.18653/v1/2026.evaleval-1.39",
    pages = "245--251",
    ISBN = "979-8-89176-429-3"
}
```

Correspondence: rokas.gipiskis@protonmail.com
