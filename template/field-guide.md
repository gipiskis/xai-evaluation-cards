# Field guide

What each field of the XAI Evaluation Card asks for. The field descriptions are from Table 1
and the examples from Appendix A of
[Gipiškis and Kurasova (2026)](https://aclanthology.org/2026.evaleval-1.39/).

The card is non-prescriptive. It does not mandate any particular grounding level, metric, or
validation procedure. Fields that are not applicable may be marked N/A with a brief
justification, e.g., "N/A: the metric has no free hyperparameters".

## I. Identity

### Metric Name

> Unique, descriptive name for the evaluation metric.

The same metric names appear under different definitions across papers, and the same
underlying properties can be named differently by different research groups. If the metric
is known under other names, list them. The YAML and JSON formats have an `aliases` field for
this.

Appendix A example: Deletion Area Under the Curve (Deletion AUC / DAUC) (Petsiuk et al.,
2018)

### Target Property / Properties

> List all explainability properties this metric operationalizes (e.g., fidelity, robustness,
> clarity), with references to definitions used.

Properties are conceptual qualities such as fidelity, robustness, or clarity. Metrics
operationalize them into measurable quantities. The mapping from properties to metrics is
neither unique nor exact: multiple metrics may target the same property while giving
different conclusions. Declaring the target properties addresses the conflation of
properties and metrics observed across the surveyed literature.

Give a reference for each property definition. Property names are not used consistently
across papers, e.g., "faithfulness" in one paper may or may not correspond to "fidelity" in
another.

Appendix A example: Faithfulness / Fidelity. It operationalizes this by measuring if the
features identified as "important" by the explanation are necessary for the model to
maintain its predictive confidence.

### Grounding Level

> One or more of: functionally-grounded / human-grounded / application-grounded (Doshi-Velez
> and Kim, 2017).

The three levels are functionally-grounded (proxy tasks), human-grounded (user studies), and
application-grounded (domain experts in deployment settings).

Explicit grounding declarations prevent a common failure mode: drawing human-centered
conclusions from purely technical metrics. Evaluation practice is heavily skewed toward
functionally-grounded proxy tasks, while human-grounded and application-grounded methods
remain underrepresented despite being more directly informative about real-world utility.

Appendix A example: Functionally-grounded (proxy task).

## II. Scope and Context

### Evaluation Context

> Model architecture, data modality, and explanation scope (local / global) under which
> results are reported.

Metric validity is highly context-dependent, yet contextual information is routinely omitted
from publications (Coroama and Groza, 2022). Without it, reported metric scores are not
interpretable and cannot be meaningfully compared across studies.

The YAML and JSON formats also have structured fields for model architectures, data
modalities, explanation scope, and explanation types.

Appendix A example: Applied to local feature attributions (e.g., saliency maps) across
vision (both classification and segmentation tasks (Gipiškis et al., 2024)) and NLP
modalities. Requires a model with probability or logit outputs.

### Assumptions

> All assumptions required by the metric (e.g., feature independence, locality, linearity,
> calibrated probabilities, meaningful baselines).

In the YAML and JSON formats, each assumption is a separate entry.

Appendix A example: Assumes that iteratively masking top-rated features will degrade model
performance if the explanation is faithful. Assumes the chosen baseline/imputation method
(e.g., replacing pixels with zeros, mean values, or blurring) is meaningful and does not
artificially break the model.

## III. Implementation and Validation

### Implementation Available?

> Yes / No. If yes, provide URL or repository reference.

Many proposed metrics remain theoretical constructs without practical instantiation (Coroama
and Groza, 2022).

Appendix A example: Yes. https://github.com/eclique/RISE/blob/master/evaluation.py.

### Validation Evidence

> Summary of sensitivity analysis, stability analysis, and correlation with related metrics.
> Report computational cost where relevant.

Few metrics include sensitivity or stability analysis (e.g., investigation of how the
metric's output varies with its own hyperparameters) as part of their original proposal.

Mark parts that do not apply as N/A with a justification. The YAML and JSON formats have
separate fields for sensitivity analysis, stability analysis, correlation with related
metrics, and computational cost.

Appendix A example: Empirical studies show DAUC is highly sensitive to the choice of the
baseline/imputation value (e.g., zero-masking vs. generative inpainting). It carries a
moderate-to-high computational cost, requiring multiple forward passes per instance as
features are incrementally removed.

### Gaming Risk

> How a method could achieve a high score on this metric without improving the target
> explainability property.

This field highlights a class of validity threat that is rarely made explicit in evaluation
papers.

Appendix A example: An explanation method could achieve a high DAUC score by intentionally
selecting features that, when masked, create severe out-of-distribution (OOD) artifacts. The
model's confidence drops because the input looks unnatural (like adversarial noise), not
because the true explanatory features were removed.

### Known Failure Cases

> Conditions under which the metric is known to fail or produce misleading results.

Appendix A example: Can produce misleading results when features are highly correlated. The
model might rely on a redundant, unmasked feature, making the DAUC score artificially low
despite a good explanation.

## IV. Relationships and Limitations

### Relationship to Other Metrics

> Metrics targeting the same property. Known agreements or disagreements in results.

Note known agreements or disagreements empirically where feasible, by running related
metrics in the same evaluation context, or by reference to prior literature otherwise.
Pawlicki et al. (2024) find a large diversity of metrics without consensus on their
properties, making inter-metric relationships a critical missing element of most
publications.

Appendix A example: Conceptually similar to comprehensiveness (used in NLP). Often paired
with the Insertion AUC metric. May disagree with Faithfulness Correlation if the model's
response to feature removal is highly non-linear.

### Disagreement Handling

> If this metric conflicts with others reported, state which property is prioritised for the
> target deployment scenario and why.

Appendix A example: If DAUC conflicts with Insertion AUC, DAUC should be prioritized if the
deployment scenario strictly requires identifying the features that are necessary for the
model to work (e.g., safety auditing for failure modes).

### Limitations

> Main limitations as an operationalization of the target property. Note contexts where the
> metric should not be used.

Appendix A example: The main limitation is the OOD problem. The metric might evaluate the
model's robustness to missing data rather than the explanation's true fidelity. Should not be
used in isolation without an insertion or OOD-compensated baseline.

## Superficial completion

The flexibility of the template might result in superficial completion, in which
low-information entries satisfy requirements without improving substantive transparency.
Mitigating this would require review rubrics that assess the content of individual fields
rather than their mere presence.

## Citation

If you use this template, please cite:

> Rokas Gipiškis and Olga Kurasova. 2026. Evaluation Cards for XAI Metrics. In *Proceedings
> of the Workshop on Evaluating Evaluations (EvalEval)*, pages 245–251, San Diego, CA.
> Association for Computational Linguistics.
> <https://aclanthology.org/2026.evaleval-1.39/>
