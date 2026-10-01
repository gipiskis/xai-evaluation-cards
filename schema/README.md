# Schema

[`xai-evaluation-card.schema.json`](xai-evaluation-card.schema.json) is a JSON Schema
(Draft 2020-12) for cards in YAML or JSON. Section 4.3 of the paper suggests a defined JSON
schema so that completed cards can be parsed and indexed.

The schema is also available at
<https://gipiskis.github.io/xai-evaluation-cards/schema/xai-evaluation-card.schema.json>.

To validate a card in Python:

```python
import json, yaml
from jsonschema import Draft202012Validator

schema = json.load(open("schema/xai-evaluation-card.schema.json", encoding="utf-8"))
card = yaml.safe_load(open("examples/deletion-auc.yaml", encoding="utf-8"))
Draft202012Validator(schema).validate(card)
```

## Structure

The four section objects correspond to the four sections of the card in the paper.

```
schema_version                    "1.0"
identity                          I.   Identity
  metric_name                          Metric Name
  target_properties[]                  Target Property / Properties
  grounding_level[]                    Grounding Level
scope_and_context                 II.  Scope and Context
  evaluation_context.summary           Evaluation Context
  assumptions[]                        Assumptions
implementation_and_validation     III. Implementation and Validation
  implementation_available             Implementation Available?
  validation_evidence.summary          Validation Evidence
  gaming_risk                          Gaming Risk
  known_failure_cases[]                Known Failure Cases
relationships_and_limitations     IV.  Relationships and Limitations
  related_metrics[]                    Relationship to Other Metrics
  disagreement_handling                Disagreement Handling
  limitations[]                        Limitations
```

`schema_version` and the twelve fields are required. Everything else is optional: `card_id`,
`card_version`, `last_updated`, `card_authors`, `metric_source`, `notes`, and the sub-fields
of the section objects, such as `aliases`, `data_modalities`, `explanation_scope` and
`sensitivity_analysis`.

## Validation rules

- Fields marked N/A require a brief justification. In the twelve fields, the schema rejects
  `N/A`, `none`, `TBD`, `TODO`, `unknown`, `?` and `-` on their own.
- `target_properties` and `related_metrics` accept a plain string or an object with more
  detail.
- `implementation_url` is required when `implementation_available` is `true`.
