# XAI Evaluation Card: Deletion Area Under the Curve (Deletion AUC / DAUC)

- Metric proposed in: [Petsiuk et al. (2018)](https://arxiv.org/abs/1806.07421)
- Card authors: Rokas Gipiškis, Olga Kurasova
- Last updated: 2026-09-24

## I. Identity

| Field | Entry |
| --- | --- |
| **Metric Name** | Deletion Area Under the Curve (Deletion AUC / DAUC) (Petsiuk et al., 2018) |
| **Target Property / Properties** | Faithfulness / Fidelity. It operationalizes this by measuring if the features identified as "important" by the explanation are necessary for the model to maintain its predictive confidence. |
| **Grounding Level** | Functionally-grounded (proxy task). |

## II. Scope and Context

| Field | Entry |
| --- | --- |
| **Evaluation Context** | Applied to local feature attributions (e.g., saliency maps) across vision (both classification and segmentation tasks (Gipiškis et al., 2024)) and NLP modalities. Requires a model with probability or logit outputs. |
| **Assumptions** | Assumes that iteratively masking top-rated features will degrade model performance if the explanation is faithful. Assumes the chosen baseline/imputation method (e.g., replacing pixels with zeros, mean values, or blurring) is meaningful and does not artificially break the model. |

## III. Implementation and Validation

| Field | Entry |
| --- | --- |
| **Implementation Available?** | Yes. https://github.com/eclique/RISE/blob/master/evaluation.py. |
| **Validation Evidence** | Empirical studies show DAUC is highly sensitive to the choice of the baseline/imputation value (e.g., zero-masking vs. generative inpainting). It carries a moderate-to-high computational cost, requiring multiple forward passes per instance as features are incrementally removed. |
| **Gaming Risk** | An explanation method could achieve a high DAUC score by intentionally selecting features that, when masked, create severe out-of-distribution (OOD) artifacts. The model's confidence drops because the input looks unnatural (like adversarial noise), not because the true explanatory features were removed. |
| **Known Failure Cases** | Can produce misleading results when features are highly correlated. The model might rely on a redundant, unmasked feature, making the DAUC score artificially low despite a good explanation. |

## IV. Relationships and Limitations

| Field | Entry |
| --- | --- |
| **Relationship to Other Metrics** | Conceptually similar to comprehensiveness (used in NLP). Often paired with the Insertion AUC metric. May disagree with Faithfulness Correlation if the model's response to feature removal is highly non-linear. |
| **Disagreement Handling** | If DAUC conflicts with Insertion AUC, DAUC should be prioritized if the deployment scenario strictly requires identifying the features that are necessary for the model to work (e.g., safety auditing for failure modes). |
| **Limitations** | The main limitation is the OOD problem. The metric might evaluate the model's robustness to missing data rather than the explanation's true fidelity. Should not be used in isolation without an insertion or OOD-compensated baseline. |

## Notes

From Appendix A (Table 2) of Gipiškis and Kurasova (2026).

---

Template from: Rokas Gipiškis and Olga Kurasova. 2026. Evaluation Cards for XAI Metrics. In Proceedings of the Workshop on Evaluating Evaluations (EvalEval), pages 245–251, San Diego, CA. Association for Computational Linguistics. https://aclanthology.org/2026.evaleval-1.39/
