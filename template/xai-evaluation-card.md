<!--
XAI Evaluation Card: blank template (Markdown)

The field descriptions are Table 1 of:
  Rokas Gipiškis and Olga Kurasova. 2026. Evaluation Cards for XAI Metrics.
  Proceedings of the Workshop on Evaluating Evaluations (EvalEval), 245–251.
  https://aclanthology.org/2026.evaleval-1.39/

Replace each description with your entry, then delete this comment.
The field guide (template/field-guide.md) explains each field.
-->

# XAI Evaluation Card: _Metric Name_

- Metric proposed in: _Author et al. (YYYY), link_
- Card authors: _names_
- Last updated: _YYYY-MM-DD_

## I. Identity

| Field | Entry |
| --- | --- |
| **Metric Name** | _Unique, descriptive name for the evaluation metric._ |
| **Target Property / Properties** | _List all explainability properties this metric operationalizes (e.g., fidelity, robustness, clarity), with references to definitions used._ |
| **Grounding Level** | _One or more of: functionally-grounded / human-grounded / application-grounded (Doshi-Velez and Kim, 2017)._ |

## II. Scope and Context

| Field | Entry |
| --- | --- |
| **Evaluation Context** | _Model architecture, data modality, and explanation scope (local / global) under which results are reported._ |
| **Assumptions** | _All assumptions required by the metric (e.g., feature independence, locality, linearity, calibrated probabilities, meaningful baselines)._ |

## III. Implementation and Validation

| Field | Entry |
| --- | --- |
| **Implementation Available?** | _Yes / No. If yes, provide URL or repository reference._ |
| **Validation Evidence** | _Summary of sensitivity analysis, stability analysis, and correlation with related metrics. Report computational cost where relevant._ |
| **Gaming Risk** | _How a method could achieve a high score on this metric without improving the target explainability property._ |
| **Known Failure Cases** | _Conditions under which the metric is known to fail or produce misleading results._ |

## IV. Relationships and Limitations

| Field | Entry |
| --- | --- |
| **Relationship to Other Metrics** | _Metrics targeting the same property. Known agreements or disagreements in results._ |
| **Disagreement Handling** | _If this metric conflicts with others reported, state which property is prioritised for the target deployment scenario and why._ |
| **Limitations** | _Main limitations as an operationalization of the target property. Note contexts where the metric should not be used._ |

Fields marked N/A require a brief justification.

---

Template from: Rokas Gipiškis and Olga Kurasova. 2026. Evaluation Cards for XAI Metrics. In Proceedings of the Workshop on Evaluating Evaluations (EvalEval), pages 245–251, San Diego, CA. Association for Computational Linguistics. https://aclanthology.org/2026.evaleval-1.39/
