/* XAI Evaluation Card builder (Gipiškis and Kurasova, 2026). MIT license. */
(function () {
  "use strict";

  var PAPER_URL = "https://aclanthology.org/2026.evaleval-1.39/";
  var PAPER_CITE =
    "Rokas Gipiškis and Olga Kurasova. 2026. Evaluation Cards for XAI Metrics. " +
    "In Proceedings of the Workshop on Evaluating Evaluations (EvalEval), pages 245–251, " +
    "San Diego, CA. Association for Computational Linguistics.";
  var STORAGE_KEY = "xai-evaluation-card-draft-v1";

  // Fields

  var SPEC = [
    {
      legend: "Card details",
      fields: [
        { id: "card_id", type: "text", label: "Card ID",
          hint: "Lowercase and hyphenated. Used as the file name. Generated from the metric name if left blank.",
          placeholder: "deletion-auc" },
        { id: "card_authors", type: "list", label: "Card authors",
          hint: "People responsible for the contents of this card.",
          placeholder: "Name Surname" },
        { id: "metric_source.citation", type: "text", label: "Metric proposed in",
          placeholder: "Petsiuk et al. (2018)" },
        { id: "metric_source.url", type: "url", label: "Link to the paper",
          placeholder: "https://arxiv.org/abs/1806.07421" },
        { id: "notes", type: "textarea", label: "Notes" }
      ]
    },
    {
      legend: "I. Identity",
      fields: [
        { id: "identity.metric_name", type: "text", req: true, label: "Metric Name",
          hint: "Unique, descriptive name for the evaluation metric.",
          placeholder: "Deletion Area Under the Curve (Deletion AUC / DAUC)" },
        { id: "identity.aliases", type: "list", label: "Aliases",
          hint: "Other names used for the same metric in the literature.",
          placeholder: "DAUC" },
        { id: "identity.target_properties", type: "objlist", req: true,
          label: "Target Property / Properties",
          hint: "List all explainability properties this metric operationalizes (e.g., fidelity, robustness, clarity), with references to definitions used.",
          sub: [
            { id: "name", type: "text", label: "Property", placeholder: "Faithfulness / Fidelity" },
            { id: "reference", type: "text", label: "Definition reference",
              placeholder: "Nauta et al. (2023)" },
            { id: "operationalization", type: "textarea", label: "Operationalization",
              placeholder: "It operationalizes this by measuring if the features identified as \"important\" by the explanation are necessary for the model to maintain its predictive confidence." }
          ] },
        { id: "identity.grounding_level", type: "checks", req: true, label: "Grounding Level",
          hint: "One or more of: functionally-grounded / human-grounded / application-grounded (Doshi-Velez and Kim, 2017).",
          options: [
            ["functionally-grounded", "functionally-grounded"],
            ["human-grounded", "human-grounded"],
            ["application-grounded", "application-grounded"]
          ] },
        { id: "identity.grounding_level_justification", type: "textarea",
          label: "Justification",
          placeholder: "Proxy task." }
      ]
    },
    {
      legend: "II. Scope and Context",
      fields: [
        { id: "scope_and_context.evaluation_context.summary", type: "textarea", req: true,
          label: "Evaluation Context",
          hint: "Model architecture, data modality, and explanation scope (local / global) under which results are reported.",
          placeholder: "Applied to local feature attributions (e.g., saliency maps) across vision and NLP modalities. Requires a model with probability or logit outputs." },
        { id: "scope_and_context.evaluation_context.model_architectures", type: "csv",
          label: "Model architectures", hint: "Comma-separated.",
          placeholder: "CNN, transformer" },
        { id: "scope_and_context.evaluation_context.data_modalities", type: "csv",
          label: "Data modalities", hint: "Comma-separated.",
          placeholder: "image, text, tabular" },
        { id: "scope_and_context.evaluation_context.explanation_scope", type: "checks",
          label: "Explanation scope",
          options: [["local", "local"], ["global", "global"]] },
        { id: "scope_and_context.evaluation_context.explanation_types", type: "csv",
          label: "Explanation types", hint: "Comma-separated.",
          placeholder: "feature attribution, counterfactual" },
        { id: "scope_and_context.assumptions", type: "list", req: true, label: "Assumptions",
          hint: "All assumptions required by the metric (e.g., feature independence, locality, linearity, calibrated probabilities, meaningful baselines). One per entry.",
          multiline: true,
          placeholder: "Assumes the chosen baseline/imputation method (e.g., replacing pixels with zeros, mean values, or blurring) is meaningful and does not artificially break the model." }
      ]
    },
    {
      legend: "III. Implementation and Validation",
      fields: [
        { id: "implementation_and_validation.implementation_available", type: "bool",
          label: "Implementation Available?", def: false,
          hint: "If yes, provide URL or repository reference." },
        { id: "implementation_and_validation.implementation_url", type: "text",
          label: "URL or repository reference", showIf: "implementation_and_validation.implementation_available",
          placeholder: "https://github.com/..." },
        { id: "implementation_and_validation.implementation_notes", type: "textarea",
          label: "Implementation notes",
          hint: "Optional. For example, whether this is the original authors' code, or why no implementation is available." },
        { id: "implementation_and_validation.validation_evidence.summary", type: "textarea", req: true,
          label: "Validation Evidence",
          hint: "Summary of sensitivity analysis, stability analysis, and correlation with related metrics. Report computational cost where relevant.",
          placeholder: "Empirical studies show DAUC is highly sensitive to the choice of the baseline/imputation value (e.g., zero-masking vs. generative inpainting)." },
        { id: "implementation_and_validation.validation_evidence.sensitivity_analysis", type: "textarea",
          label: "Sensitivity analysis", indent: true,
          hint: "How the metric's output varies with its own hyperparameters." },
        { id: "implementation_and_validation.validation_evidence.stability_analysis", type: "textarea",
          label: "Stability analysis", indent: true,
          hint: "How the metric's output varies across re-runs or small changes to the input." },
        { id: "implementation_and_validation.validation_evidence.correlation_with_related_metrics", type: "textarea",
          label: "Correlation with related metrics", indent: true,
          hint: "Agreement with metrics targeting the same property." },
        { id: "implementation_and_validation.validation_evidence.computational_cost", type: "textarea",
          label: "Computational cost", indent: true,
          hint: "For example, the number of forward passes per instance." },
        { id: "implementation_and_validation.gaming_risk", type: "textarea", req: true,
          label: "Gaming Risk",
          hint: "How a method could achieve a high score on this metric without improving the target explainability property.",
          placeholder: "An explanation method could achieve a high DAUC score by intentionally selecting features that, when masked, create severe out-of-distribution (OOD) artifacts." },
        { id: "implementation_and_validation.known_failure_cases", type: "list", req: true,
          label: "Known Failure Cases", multiline: true,
          hint: "Conditions under which the metric is known to fail or produce misleading results. One per entry.",
          placeholder: "Can produce misleading results when features are highly correlated." }
      ]
    },
    {
      legend: "IV. Relationships and Limitations",
      fields: [
        { id: "relationships_and_limitations.related_metrics", type: "objlist", req: true,
          label: "Relationship to Other Metrics",
          hint: "Metrics targeting the same property. Known agreements or disagreements in results.",
          sub: [
            { id: "metric", type: "text", label: "Metric", placeholder: "Insertion AUC" },
            { id: "card_id", type: "text", label: "Card ID of the related metric (optional)", placeholder: "insertion-auc" },
            { id: "notes", type: "textarea", label: "Notes",
              placeholder: "Often paired with the Insertion AUC metric." }
          ] },
        { id: "relationships_and_limitations.disagreement_handling", type: "textarea", req: true,
          label: "Disagreement Handling",
          hint: "If this metric conflicts with others reported, state which property is prioritised for the target deployment scenario and why.",
          placeholder: "If DAUC conflicts with Insertion AUC, DAUC should be prioritized if the deployment scenario strictly requires identifying the features that are necessary for the model to work (e.g., safety auditing for failure modes)." },
        { id: "relationships_and_limitations.limitations", type: "list", req: true,
          label: "Limitations", multiline: true,
          hint: "Main limitations as an operationalization of the target property. Note contexts where the metric should not be used.",
          placeholder: "Should not be used in isolation without an insertion or OOD-compensated baseline." }
      ]
    }
  ];

  // State

  var state = {};
  var els = {};

  function setPath(obj, path, value) {
    var parts = path.split("."), node = obj, i;
    for (i = 0; i < parts.length - 1; i++) {
      if (typeof node[parts[i]] !== "object" || node[parts[i]] === null) node[parts[i]] = {};
      node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = value;
  }

  function allFields() {
    var out = [];
    SPEC.forEach(function (g) { g.fields.forEach(function (f) { out.push(f); }); });
    return out;
  }

  function defaultFor(f) {
    if (f.type === "list" || f.type === "csv" || f.type === "checks") return [];
    if (f.type === "objlist") return [blankSub(f)];
    if (f.type === "bool") return !!f.def;
    return "";
  }

  function blankSub(f) {
    var o = {};
    f.sub.forEach(function (s) { o[s.id] = ""; });
    return o;
  }

  function resetState() {
    // _kept: values from an imported card that have no form field
    state = { _kept: {} };
    allFields().forEach(function (f) { state[f.id] = defaultFor(f); });
  }

  // Form

  function el(tag, attrs, children) {
    var n = document.createElement(tag), k;
    for (k in attrs || {}) {
      if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function fieldShell(f, control, group) {
    var text = f.label + (f.req ? " *" : "");
    var kids = [group ? el("span", { class: "label", id: "l-" + f.id, text: text })
                      : el("label", { text: text, for: "f-" + f.id })];
    if (f.hint) kids.push(el("span", { class: "hint", html: f.hint }));
    if (group) {
      control.setAttribute("role", "group");
      control.setAttribute("aria-labelledby", "l-" + f.id);
    }
    kids.push(control);
    var wrap = el("div", { class: f.indent ? "field field--sub" : "field", "data-field": f.id }, kids);
    els[f.id] = wrap;
    return wrap;
  }

  function textControl(f, value, onChange, idAttr) {
    var multiline = f.type === "textarea" || f.multiline;
    var n = el(multiline ? "textarea" : "input", {
      id: idAttr, type: multiline ? null : (f.type === "url" ? "url" : "text"),
      placeholder: f.placeholder || "", rows: multiline ? 3 : null
    });
    n.value = value || "";
    n.addEventListener("input", function () { onChange(n.value); });
    return n;
  }

  function buildField(f) {
    var id = "f-" + f.id;

    if (f.type === "text" || f.type === "url" || f.type === "textarea") {
      return fieldShell(f, textControl(f, state[f.id], function (v) {
        state[f.id] = v; changed();
      }, id));
    }

    if (f.type === "csv") {
      var csv = el("input", { id: id, type: "text", placeholder: f.placeholder || "" });
      csv.value = (state[f.id] || []).join(", ");
      csv.addEventListener("input", function () {
        state[f.id] = csv.value.split(",").map(function (s) { return s.trim(); })
          .filter(function (s) { return s; });
        changed();
      });
      return fieldShell(f, csv);
    }

    if (f.type === "bool") {
      var box = el("div", { class: "checks" });
      [["yes", true], ["no", false]].forEach(function (o) {
        var r = el("input", { type: "radio", name: id, id: id + "-" + o[0] });
        r.checked = state[f.id] === o[1];
        r.addEventListener("change", function () {
          if (r.checked) { state[f.id] = o[1]; changed(); render(); }
        });
        box.appendChild(el("label", {}, [r, el("span", { text: o[0] === "yes" ? "Yes" : "No" })]));
      });
      return fieldShell(f, box, true);
    }

    if (f.type === "checks") {
      var group = el("div", { class: "checks" });
      f.options.forEach(function (o) {
        var c = el("input", { type: "checkbox", id: id + "-" + o[0] });
        c.checked = state[f.id].indexOf(o[0]) !== -1;
        c.addEventListener("change", function () {
          var arr = state[f.id], i = arr.indexOf(o[0]);
          if (c.checked && i === -1) arr.push(o[0]);
          if (!c.checked && i !== -1) arr.splice(i, 1);
          changed();
        });
        group.appendChild(el("label", {}, [c, el("span", { text: o[1] })]));
      });
      return fieldShell(f, group, true);
    }

    if (f.type === "list") {
      var listBox = el("div", {});
      function redrawList() {
        listBox.innerHTML = "";
        state[f.id].forEach(function (v, i) {
          var input = textControl(f, v, function (nv) { state[f.id][i] = nv; changed(); });
          input.setAttribute("aria-label", f.label + " " + (i + 1));
          listBox.appendChild(el("div", { class: "list-row" }, [
            input,
            el("button", {
              class: "btn btn--sm", type: "button", text: "Remove",
              onclick: function () { state[f.id].splice(i, 1); redrawList(); changed(); }
            })
          ]));
        });
        listBox.appendChild(el("button", {
          class: "btn btn--sm", type: "button", text: "+ Add",
          onclick: function () { state[f.id].push(""); redrawList(); changed(); }
        }));
      }
      redrawList();
      return fieldShell(f, listBox, true);
    }

    if (f.type === "objlist") {
      var objBox = el("div", {});
      function redrawObjs() {
        objBox.innerHTML = "";
        state[f.id].forEach(function (row, i) {
          var kids = [el("div", { class: "subrow__head" }, [
            el("span", { text: "#" + (i + 1) }),
            el("button", {
              class: "btn btn--sm", type: "button", text: "Remove",
              onclick: function () { state[f.id].splice(i, 1); redrawObjs(); changed(); }
            })
          ])];
          f.sub.forEach(function (s) {
            var sid = id + "-" + i + "-" + s.id;
            var ctl = textControl(s, row[s.id], function (v) { row[s.id] = v; changed(); }, sid);
            kids.push(el("div", { class: "field" }, [
              el("label", { for: sid, text: s.label }), ctl
            ]));
          });
          objBox.appendChild(el("div", { class: "subrow" }, kids));
        });
        objBox.appendChild(el("button", {
          class: "btn btn--sm", type: "button", text: "+ Add",
          onclick: function () { state[f.id].push(blankSub(f)); redrawObjs(); changed(); }
        }));
      }
      redrawObjs();
      return fieldShell(f, objBox, true);
    }

    return el("div");
  }

  function render() {
    var form = document.getElementById("card-form");
    form.innerHTML = "";
    SPEC.forEach(function (group) {
      var fs = el("fieldset", {}, [el("legend", { text: group.legend })]);
      group.fields.forEach(function (f) {
        if (f.showIf && !state[f.showIf]) return;
        fs.appendChild(buildField(f));
      });
      form.appendChild(fs);
    });
    changed();
  }

  // Card object

  function clean(s) { return (s || "").replace(/\s+/g, " ").trim(); }

  function cardObject() {
    var card = { schema_version: "1.0" };
    var slug = (clean(state.card_id) || clean(state["identity.metric_name"])).toLowerCase()
      .replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    var kept = state._kept || {};
    if (slug) card.card_id = slug;
    card.card_version = kept.card_version || "1.0";
    card.last_updated = new Date().toISOString().slice(0, 10);
    if (state.card_authors.filter(clean).length) {
      card.card_authors = state.card_authors.map(clean).filter(Boolean);
    }

    var src = {}, keptSrc = kept.metric_source || {};
    ["citation", "title", "authors", "year", "venue", "doi", "url", "bibtex_key"].forEach(function (k) {
      var v = (k === "citation" || k === "url") ? clean(state["metric_source." + k]) : keptSrc[k];
      if (v !== undefined && v !== null && v !== "") src[k] = v;
    });
    if (Object.keys(src).length) card.metric_source = src;

    // I. Identity
    var ident = { metric_name: clean(state["identity.metric_name"]) };
    var aliases = state["identity.aliases"].map(clean).filter(Boolean);
    if (aliases.length) ident.aliases = aliases;
    ident.target_properties = state["identity.target_properties"].map(function (p) {
      var o = { name: clean(p.name) };
      if (clean(p.reference)) o.reference = clean(p.reference);
      if (clean(p.operationalization)) o.operationalization = clean(p.operationalization);
      return o;
    }).filter(function (o) { return o.name; });
    ident.grounding_level = state["identity.grounding_level"].slice();
    if (clean(state["identity.grounding_level_justification"])) {
      ident.grounding_level_justification = clean(state["identity.grounding_level_justification"]);
    }
    card.identity = ident;

    // II. Scope and Context
    var ctx = { summary: clean(state["scope_and_context.evaluation_context.summary"]) };
    [["model_architectures", "scope_and_context.evaluation_context.model_architectures"],
     ["data_modalities", "scope_and_context.evaluation_context.data_modalities"],
     ["explanation_scope", "scope_and_context.evaluation_context.explanation_scope"],
     ["explanation_types", "scope_and_context.evaluation_context.explanation_types"]
    ].forEach(function (pair) {
      if (state[pair[1]] && state[pair[1]].length) ctx[pair[0]] = state[pair[1]].slice();
    });
    card.scope_and_context = {
      evaluation_context: ctx,
      assumptions: state["scope_and_context.assumptions"].map(clean).filter(Boolean)
    };

    // III. Implementation and Validation
    var iav = {
      implementation_available: !!state["implementation_and_validation.implementation_available"]
    };
    if (iav.implementation_available &&
        clean(state["implementation_and_validation.implementation_url"])) {
      iav.implementation_url = clean(state["implementation_and_validation.implementation_url"]);
    }
    if (clean(state["implementation_and_validation.implementation_notes"])) {
      iav.implementation_notes = clean(state["implementation_and_validation.implementation_notes"]);
    }
    var ve = { summary: clean(state["implementation_and_validation.validation_evidence.summary"]) };
    ["sensitivity_analysis", "stability_analysis",
     "correlation_with_related_metrics", "computational_cost"].forEach(function (k) {
      var v = clean(state["implementation_and_validation.validation_evidence." + k]);
      if (v) ve[k] = v;
    });
    iav.validation_evidence = ve;
    iav.gaming_risk = clean(state["implementation_and_validation.gaming_risk"]);
    iav.known_failure_cases =
      state["implementation_and_validation.known_failure_cases"].map(clean).filter(Boolean);
    card.implementation_and_validation = iav;

    // IV. Relationships and Limitations
    card.relationships_and_limitations = {
      related_metrics: state["relationships_and_limitations.related_metrics"].map(function (r) {
        var o = { metric: clean(r.metric) };
        if (clean(r.card_id)) o.card_id = clean(r.card_id);
        if (clean(r.notes)) o.notes = clean(r.notes);
        return o;
      }).filter(function (o) { return o.metric; }),
      disagreement_handling: clean(state["relationships_and_limitations.disagreement_handling"]),
      limitations: state["relationships_and_limitations.limitations"].map(clean).filter(Boolean)
    };

    if (clean(state.notes)) card.notes = clean(state.notes);
    return card;
  }

  // Validation

  var BARE_NA = /^\s*(n\.?\/?a\.?|none|not applicable|tbd|todo|unknown|\?+|-+)\s*$/i;

  /* Keys with enum or identifier values, skipped by the N/A check. */
  var NOT_PROSE = {
    schema_version: 1, card_id: 1, card_version: 1, last_updated: 1,
    card_authors: 1, citation: 1, title: 1, venue: 1, doi: 1, url: 1, bibtex_key: 1,
    aliases: 1, grounding_level: 1, explanation_scope: 1, data_modalities: 1,
    model_architectures: 1, explanation_types: 1
  };

  function lastKey(path) {
    var parts = path.replace(/\[\d+\]$/, "").split(".");
    return parts[parts.length - 1];
  }

  function validate(card) {
    var problems = [];
    allFields().forEach(function (f) {
      if (!f.req) return;
      var v = state[f.id];
      var empty = (typeof v === "string" && !clean(v)) ||
                  (Array.isArray(v) && !v.filter(function (x) {
                    return typeof x === "string" ? clean(x) : clean(x && x.name || x && x.metric);
                  }).length);
      if (empty) problems.push({ field: f.id, msg: f.label + " is required" });
    });

    walkStrings(card, function (path, text) {
      var key = lastKey(path);
      if (NOT_PROSE[key]) return;
      if (BARE_NA.test(text)) {
        problems.push({
          field: null,
          msg: (labelFor(path) || key) + ": fields marked N/A require a brief justification."
        });
      }
    });

    if (card.implementation_and_validation.implementation_available &&
        !card.implementation_and_validation.implementation_url) {
      problems.push({ field: null,
        msg: "A URL or repository reference is required if an implementation is available." });
    }
    if (card.metric_source && card.metric_source.url && !/^https?:\/\/\S+$/.test(card.metric_source.url)) {
      problems.push({ field: "metric_source.url", msg: "Link to the paper must start with http:// or https://." });
    }
    return problems;
  }

  /* Field label for a card path, e.g. "scope_and_context.assumptions[2]" -> "Assumptions". */
  function labelFor(path) {
    var p = path.replace(/\[\d+\]/g, ""), found = null;
    allFields().forEach(function (f) {
      if (p === f.id) found = f.label;
      (f.sub || []).forEach(function (s) { if (p === f.id + "." + s.id) found = f.label; });
    });
    return found;
  }

  function walkStrings(node, fn, path) {
    path = path || "";
    if (typeof node === "string") { fn(path, node); return; }
    if (Array.isArray(node)) {
      node.forEach(function (v, i) { walkStrings(v, fn, path + "[" + i + "]"); });
      return;
    }
    if (node && typeof node === "object") {
      Object.keys(node).forEach(function (k) {
        walkStrings(node[k], fn, path ? path + "." + k : k);
      });
    }
  }

  // Export formats

  function wrapText(text, width) {
    var words = text.split(" "), lines = [], cur = "";
    words.forEach(function (w) {
      if (!cur) { cur = w; }
      else if ((cur + " " + w).length <= width) { cur += " " + w; }
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  /* Values YAML would read as numbers, dates or booleans. These are quoted. */
  var YAML_AMBIGUOUS =
    /^([+-]?\d+(\.\d+)?([eE][+-]?\d+)?|\d{4}-\d{2}-\d{2}([T ].*)?|0[xXoObB][0-9a-fA-F_]+|y|n|yes|no|true|false|on|off|null|~|\.inf|\.nan)$/i;

  function yamlScalar(s, indent) {
    if (s === "") return '""';
    if (s.length > 66) {
      var pad = new Array(indent + 1).join(" ");
      return ">-\n" + wrapText(s, 78 - indent).map(function (l) { return pad + l; }).join("\n");
    }
    if (/^[\p{L}\p{N}][\p{L}\p{N} .,\/()'+-]*$/u.test(s) && !YAML_AMBIGUOUS.test(s)) return s;
    return JSON.stringify(s);
  }

  function toYaml(node, indent) {
    indent = indent || 0;
    var pad = new Array(indent + 1).join(" "), out = [];

    Object.keys(node).forEach(function (k) {
      var v = node[k];
      if (v === undefined || v === null) return;
      if (typeof v === "boolean" || typeof v === "number") {
        out.push(pad + k + ": " + v);
      } else if (typeof v === "string") {
        out.push(pad + k + ": " + yamlScalar(v, indent + 2));
      } else if (Array.isArray(v)) {
        if (!v.length) return;
        out.push(pad + k + ":");
        v.forEach(function (item) {
          if (item && typeof item === "object") {
            var lines = [];
            Object.keys(item).forEach(function (ik) {
              var iv = item[ik];
              if (iv === undefined || iv === null || iv === "") return;
              lines.push(ik + ": " + (typeof iv === "string"
                ? yamlScalar(iv, indent + 6) : String(iv)));
            });
            out.push(pad + "  - " + lines.join("\n" + pad + "    "));
          } else {
            out.push(pad + "  - " + yamlScalar(String(item), indent + 6));
          }
        });
      } else if (typeof v === "object") {
        if (!Object.keys(v).length) return;
        out.push(pad + k + ":");
        out.push(toYaml(v, indent + 2));
      }
    });
    return out.join("\n");
  }

  var SECTION_HEADERS = {
    identity: "I. Identity",
    scope_and_context: "II. Scope and Context",
    implementation_and_validation: "III. Implementation and Validation",
    relationships_and_limitations: "IV. Relationships and Limitations"
  };

  /* Rows for the preview, Markdown and LaTeX. */
  function fieldValues(card) {
    var id = card.identity, sc = card.scope_and_context,
        iv = card.implementation_and_validation, rl = card.relationships_and_limitations;

    function joinPara() {
      return Array.prototype.slice.call(arguments).filter(Boolean).join("\n\n");
    }
    function ctxText(c) {
      var extras = [];
      [["model_architectures", "Architectures"], ["data_modalities", "Modalities"],
       ["explanation_scope", "Scope"], ["explanation_types", "Explanation types"]
      ].forEach(function (p) {
        if (c[p[0]] && c[p[0]].length) extras.push(p[1] + ": " + c[p[0]].join(", "));
      });
      return joinPara(c.summary, extras.join("; "));
    }
    function veText(ve) {
      var parts = [ve.summary];
      [["sensitivity_analysis", "Sensitivity analysis"],
       ["stability_analysis", "Stability analysis"],
       ["correlation_with_related_metrics", "Correlation with related metrics"],
       ["computational_cost", "Computational cost"]].forEach(function (p) {
        if (ve[p[0]]) parts.push(p[1] + ": " + ve[p[0]]);
      });
      return parts.filter(Boolean).join("\n\n");
    }

    var implText = joinPara(
      iv.implementation_available ? "Yes. " + (iv.implementation_url || "") : "No.",
      iv.implementation_notes);

    return [
      [SECTION_HEADERS.identity, [
        ["Metric Name", [joinPara(id.metric_name,
          id.aliases && id.aliases.length ? "Also known as: " + id.aliases.join(", ") : "")]],
        ["Target Property / Properties", (id.target_properties || []).map(function (p) {
          var s = p.name + (p.reference ? " (" + p.reference + ")" : "");
          return p.operationalization ? s + ". " + p.operationalization : s;
        })],
        ["Grounding Level", [joinPara((id.grounding_level || []).join(" / "),
          id.grounding_level_justification)]]
      ]],
      [SECTION_HEADERS.scope_and_context, [
        ["Evaluation Context", [ctxText(sc.evaluation_context || {})]],
        ["Assumptions", sc.assumptions || []]
      ]],
      [SECTION_HEADERS.implementation_and_validation, [
        ["Implementation Available?", [implText]],
        ["Validation Evidence", [veText(iv.validation_evidence || {})]],
        ["Gaming Risk", [iv.gaming_risk]],
        ["Known Failure Cases", iv.known_failure_cases || []]
      ]],
      [SECTION_HEADERS.relationships_and_limitations, [
        ["Relationship to Other Metrics", (rl.related_metrics || []).map(function (r) {
          if (!r.notes) return r.metric;
          return r.notes.toLowerCase().indexOf(r.metric.toLowerCase()) !== -1
            ? r.notes : r.metric + ": " + r.notes;
        })],
        ["Disagreement Handling", [rl.disagreement_handling]],
        ["Limitations", rl.limitations || []]
      ]]
    ];
  }

  // Show < and > as typed rather than as HTML.
  function md(s) { return String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function toMarkdown(card) {
    var out = ["# XAI Evaluation Card: " + md(card.identity.metric_name || "Untitled metric"), ""];
    if (card.metric_source && card.metric_source.citation) {
      out.push("- Metric proposed in: " + (card.metric_source.url
        ? "[" + md(card.metric_source.citation) + "](" + card.metric_source.url + ")"
        : md(card.metric_source.citation)));
    }
    if (card.card_authors) out.push("- Card authors: " + md(card.card_authors.join(", ")));
    out.push("- Last updated: " + card.last_updated, "");

    fieldValues(card).forEach(function (sec) {
      out.push("## " + sec[0], "", "| Field | Entry |", "| --- | --- |");
      sec[1].forEach(function (row) {
        var vals = row[1].filter(Boolean).map(md), cell;
        if (!vals.length) cell = "*(not provided)*";
        else if (vals.length === 1) cell = vals[0];
        else cell = "<ul>" + vals.map(function (v) { return "<li>" + v + "</li>"; }).join("") + "</ul>";
        cell = cell.replace(/\|/g, "\\|").replace(/\n\n/g, "<br><br>").replace(/\n/g, " ");
        out.push("| **" + row[0] + "** | " + cell + " |");
      });
      out.push("");
    });
    if (card.notes) out.push("## Notes", "", md(card.notes), "");

    out.push("---", "", "Template from: " + PAPER_CITE + " " + PAPER_URL, "");
    return out.join("\n");
  }

  var TEX_CHARS = {
    "\\": "\\textbackslash{}", "&": "\\&", "%": "\\%", "$": "\\$", "#": "\\#", "_": "\\_",
    "{": "\\{", "}": "\\}", "~": "\\textasciitilde{}", "^": "\\textasciicircum{}",
    "<": "\\textless{}", ">": "\\textgreater{}", "|": "\\textbar{}",
    "≥": "$\\geq$", "≤": "$\\leq$", "≠": "$\\neq$", "≈": "$\\approx$", "±": "$\\pm$",
    "×": "$\\times$", "→": "$\\rightarrow$", "∞": "$\\infty$",
    "α": "$\\alpha$", "β": "$\\beta$", "γ": "$\\gamma$", "δ": "$\\delta$", "ε": "$\\epsilon$",
    "θ": "$\\theta$", "λ": "$\\lambda$", "μ": "$\\mu$", "π": "$\\pi$", "ρ": "$\\rho$",
    "σ": "$\\sigma$", "τ": "$\\tau$", "φ": "$\\phi$", "ω": "$\\omega$",
    "Δ": "$\\Delta$", "Σ": "$\\Sigma$", "Ω": "$\\Omega$"
  };
  var TEX_RE = /[\\&%$#_{}~^<>|≥≤≠≈±×→∞αβγδεθλμπρστφωΔΣΩ]/g;

  function texEscape(text) {
    var URL_RE = /https?:\/\/[^\s,;)\]]+/g, out = "", last = 0, open = true, m, u;
    function esc(chunk) {
      return chunk.replace(TEX_RE, function (c) { return TEX_CHARS[c]; })
        .replace(/"/g, function () { open = !open; return open ? "''" : "``"; });
    }
    while ((m = URL_RE.exec(text)) !== null) {
      u = m[0].replace(/\.+$/, "");
      out += esc(text.slice(last, m.index));
      // \url fails on these characters inside a table
      out += /[%#&~^{}\\]/.test(u)
        ? "\\texttt{" + esc(u).replace(/\//g, "/\\allowbreak{}") + "}"
        : "\\url{" + u + "}";
      last = m.index + u.length;
    }
    return out + esc(text.slice(last));
  }

  function toLatex(card) {
    var rows = [];
    fieldValues(card).forEach(function (sec) {
      rows.push("\\multicolumn{2}{l}{\\textbf{" + texEscape(sec[0]) + "}} \\\\[2pt]");
      sec[1].forEach(function (row) {
        var vals = row[1].filter(Boolean), body;
        if (!vals.length) body = "\\emph{(not provided)}";
        else if (vals.length === 1) body = texEscape(vals[0]).replace(/\n\n/g, " \\newline ");
        else body = "\\begin{itemize}[leftmargin=*,nosep,topsep=0pt]" +
          vals.map(function (v) { return "\\item " + texEscape(v); }).join("") + "\\end{itemize}";
        rows.push(texEscape(row[0]) + " & " + body + " \\\\[3pt]");
      });
      rows.push("\\addlinespace");
    });
    rows.pop();

    return [
      "% XAI Evaluation Card, generated by the card builder",
      "% Template: " + PAPER_CITE,
      "% " + PAPER_URL,
      "%",
      "% Requires in your preamble:",
      "%   \\usepackage{booktabs, tabularx, enumitem, url}",
      "",
      "\\begin{table*}[t]", "\\centering", "\\small",
      "\\begin{tabularx}{\\textwidth}{@{}l X@{}}",
      "\\toprule",
      "\\multicolumn{2}{c}{\\textbf{XAI Evaluation Card}} \\\\",
      "\\midrule",
      rows.join("\n"),
      "\\bottomrule", "\\end{tabularx}",
      "\\caption{XAI Evaluation Card for " + texEscape(card.identity.metric_name || "") +
        ". Template from~\\cite{gipiskis-kurasova-2026-evaluation}.}",
      "\\label{tab:xai-evaluation-card}",
      "\\end{table*}", ""
    ].join("\n");
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function toPreviewHtml(card) {
    var out = ["<h3>" + esc(card.identity.metric_name || "Untitled metric") + "</h3>"];
    fieldValues(card).forEach(function (sec) {
      out.push("<h4>" + esc(sec[0]) + "</h4><table>");
      sec[1].forEach(function (row) {
        var vals = row[1].filter(Boolean), cell;
        if (!vals.length) cell = '<span class="empty">(not provided)</span>';
        else if (vals.length === 1) cell = esc(vals[0]).replace(/\n\n/g, "<br><br>");
        else cell = "<ul>" + vals.map(function (v) { return "<li>" + esc(v) + "</li>"; }).join("") + "</ul>";
        out.push("<tr><th>" + esc(row[0]) + "</th><td>" + cell + "</td></tr>");
      });
      out.push("</table>");
    });
    if (card.notes) out.push("<h4>Notes</h4><p>" + esc(card.notes) + "</p>");
    return out.join("");
  }

  // Output

  var FORMATS = {
    yaml: { ext: "yaml", render: function (c) { return toYaml(c) + "\n"; } },
    json: { ext: "json", render: function (c) { return JSON.stringify(c, null, 2) + "\n"; } },
    md:   { ext: "md",   render: toMarkdown },
    tex:  { ext: "tex",  render: toLatex },
    preview: { ext: null, render: null }
  };
  var currentFormat = "preview";

  function changed() {
    var card = cardObject();
    var problems = validate(card);
    paintStatus(problems);
    paintFieldErrors(problems);
    paintOutput(card);
    save();
  }

  function paintStatus(problems) {
    var box = document.getElementById("status");
    box.className = "status " + (problems.length ? "status--err" : "status--ok");
    if (!problems.length) {
      box.textContent = "Complete.";
      return;
    }
    var html = "<strong>" + problems.length + " item" + (problems.length > 1 ? "s" : "") +
      " to fix:</strong><ul>";
    problems.slice(0, 8).forEach(function (p) { html += "<li>" + p.msg + "</li>"; });
    box.innerHTML = html + "</ul>";
  }

  function paintFieldErrors(problems) {
    Object.keys(els).forEach(function (k) {
      var ctl = els[k].querySelector("input, textarea");
      if (ctl) ctl.classList.remove("invalid");
    });
    problems.forEach(function (p) {
      if (!p.field || !els[p.field]) return;
      var ctl = els[p.field].querySelector("input, textarea");
      if (ctl) ctl.classList.add("invalid");
    });
  }

  function paintOutput(card) {
    var pre = document.getElementById("output"), prev = document.getElementById("preview");
    if (currentFormat === "preview") {
      pre.hidden = true; prev.hidden = false;
      prev.innerHTML = toPreviewHtml(card);
    } else {
      prev.hidden = true; pre.hidden = false;
      pre.textContent = FORMATS[currentFormat].render(card);
    }
    document.getElementById("btn-download").disabled = currentFormat === "preview";
    document.getElementById("btn-copy").disabled = currentFormat === "preview";
  }

  // Actions

  /* Dialog with OK and Cancel, or only OK if cancelLabel is null. Resolves to true for OK. */
  var pendingModal = null;

  function settleModal(result) {
    var dlg = document.getElementById("modal"), resolve = pendingModal;
    pendingModal = null;
    if (dlg.open) dlg.close();
    if (resolve) resolve(result);
  }

  function modal(opts) {
    var dlg = document.getElementById("modal");
    var body = document.getElementById("modal-body");
    var ok = document.getElementById("modal-confirm");
    var cancel = document.getElementById("modal-cancel");
    if (pendingModal) settleModal(false);

    document.getElementById("modal-title").textContent = opts.title;
    body.innerHTML = "";
    body.appendChild(el("p", { text: opts.text }));
    if (opts.detail) body.appendChild(el("pre", { class: "modal__detail", text: opts.detail }));
    ok.textContent = opts.confirmLabel || "OK";
    cancel.textContent = opts.cancelLabel || "Cancel";
    cancel.hidden = opts.cancelLabel === null;

    dlg.showModal();
    (cancel.hidden ? ok : cancel).focus();
    return new Promise(function (resolve) { pendingModal = resolve; });
  }

  function wireModal() {
    var dlg = document.getElementById("modal"), pressedBackdrop = false;
    document.getElementById("modal-confirm").addEventListener("click", function (e) {
      e.preventDefault(); settleModal(true);
    });
    document.getElementById("modal-cancel").addEventListener("click", function (e) {
      e.preventDefault(); settleModal(false);
    });
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); settleModal(false); });
    dlg.addEventListener("mousedown", function (e) { pressedBackdrop = e.target === dlg; });
    dlg.addEventListener("click", function (e) {
      if (pressedBackdrop && e.target === dlg) settleModal(false);
    });
    dlg.addEventListener("close", function () {
      if (!dlg.open && pendingModal) settleModal(false);
    });
  }

  function copyOut() {
    var text = FORMATS[currentFormat].render(cardObject());
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(copied, function () { legacyCopy(text); });
    } else { legacyCopy(text); }
  }

  function legacyCopy(text) {
    var ta = document.createElement("textarea"), ok = false;
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (ok) copied();
    else modal({ title: "Copy failed", text: "Select the text and copy it manually.", cancelLabel: null });
  }

  function copied() {
    var btn = document.getElementById("btn-copy");
    btn.textContent = "Copied";
    setTimeout(function () { btn.textContent = "Copy"; }, 1500);
  }

  function downloadOut() {
    var card = cardObject(), fmt = FORMATS[currentFormat];
    var blob = new Blob([fmt.render(card)], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (card.card_id || "xai-evaluation-card") + "." + fmt.ext;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function restore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var saved = JSON.parse(raw);
      allFields().forEach(function (f) {
        if (saved[f.id] !== undefined) state[f.id] = saved[f.id];
      });
      if (saved._kept) state._kept = saved._kept;
      return true;
    } catch (e) { return false; }
  }

  function importJson(text) {
    var card = JSON.parse(text);
    // Reject JSON that is not a card before the form is cleared.
    if (!card || typeof card !== "object" || Array.isArray(card) ||
        !card.identity || typeof card.identity !== "object") {
      throw new Error("The file is valid JSON but has no \"identity\" section.");
    }
    resetState();
    function get(path) {
      return path.split(".").reduce(function (n, k) {
        return (n && n[k] !== undefined) ? n[k] : undefined;
      }, card);
    }
    allFields().forEach(function (f) {
      if (f.type === "objlist") return;
      var v = get(f.id);
      if (v !== undefined) state[f.id] = v;
    });
    state._kept = { card_version: card.card_version, metric_source: card.metric_source };
    var tp = get("identity.target_properties");
    if (Array.isArray(tp) && tp.length) {
      state["identity.target_properties"] = tp.map(function (p) {
        return typeof p === "string"
          ? { name: p, reference: "", operationalization: "" }
          : { name: p.name || "", reference: p.reference || "", operationalization: p.operationalization || "" };
      });
    }
    var rm = get("relationships_and_limitations.related_metrics");
    if (Array.isArray(rm) && rm.length) {
      state["relationships_and_limitations.related_metrics"] = rm.map(function (r) {
        return typeof r === "string"
          ? { metric: r, card_id: "", notes: "" }
          : { metric: r.metric || "", card_id: r.card_id || "", notes: r.notes || "" };
      });
    }
    render();
  }

  // Init

  function init() {
    resetState();
    restore();

    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        currentFormat = tab.dataset.format;
        document.querySelectorAll(".tab").forEach(function (t) {
          t.setAttribute("aria-selected", String(t === tab));
        });
        paintOutput(cardObject());
      });
    });

    document.getElementById("btn-copy").addEventListener("click", copyOut);
    document.getElementById("btn-download").addEventListener("click", downloadOut);

    wireModal();

    document.getElementById("btn-reset").addEventListener("click", function () {
      modal({
        title: "Clear the form?",
        text: "This also deletes the draft saved in this browser.",
        confirmLabel: "Clear"
      }).then(function (confirmed) {
        if (!confirmed) return;
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
        resetState(); render();
      });
    });

    document.getElementById("btn-example").addEventListener("click", function () {
      modal({
        title: "Load the example?",
        text: "This replaces the current draft with the Deletion AUC card from Appendix A " +
              "of the paper.",
        confirmLabel: "Load example"
      }).then(function (confirmed) {
        if (!confirmed) return;
        importJson(JSON.stringify(window.XAI_EXAMPLE_CARD));
      });
    });

    document.getElementById("file-import").addEventListener("change", function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try { importJson(reader.result); }
        catch (err) {
          modal({
            title: "Could not import the file",
            text: "\"" + file.name + "\" is not an XAI Evaluation Card in JSON format.",
            detail: err.message,
            cancelLabel: null
          });
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    render();
  }

  init();
})();
