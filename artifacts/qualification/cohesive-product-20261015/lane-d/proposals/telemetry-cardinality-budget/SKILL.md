---
name: telemetry-cardinality-budget
description: Diagnose or design metric labels by separating observed series, possible combinations, churn and backend cost, then preserve the queries operators need. Use when instrumentation growth or label choices threaten a concrete resource budget, not for every loop or dashboard edit.
---

# Telemetry cardinality budget

Make the needed operational question affordable in the existing telemetry system. This method works from a schema, exported sample or local data; it does not require an account or a particular metrics vendor.

## Count the actual allocation

Identify the metric family, complete label set, reporting instances, representation and time window. Find where each label value comes from and what bounds its growth. A route template and a raw URL are different dimensions; hashing a user identifier usually changes its spelling without reducing its number of distinct values.

Count observed distinct tuples when records are available. Separately calculate a possible-combination bound from allowed values, describing which combinations can actually occur. Multiplying label counts assumes all combinations are possible and does not measure their occurrence. Include metric-type expansion, exporter defaults and instance labels where applicable; do not multiply the same dimension twice.

Distinguish concurrently active series from new series created over a retention window. A request ID that is unique for every event can create a churn problem even if few requests run at once. Samples over time are another storage factor, not an extra label dimension. Report sample scope when the full population is unavailable.

## Change the representation without losing the question

Tie the proposed labels to the actual alert or diagnostic query. Remove or normalize a dimension only after naming which distinctions the consumer will lose. Typical choices include a route template instead of an ID-bearing URL, an explicit bounded outcome category instead of raw error text, or aggregate metrics plus a trace/log lookup for individual events. Define how unseen values are classified; silent drops can improve the series count while hiding failures.

If per-tenant or per-entity diagnosis is required, compare the existing backend's actual capacity and indexing model with a separate bounded diagnostic route. Do not declare every high-dimensional metric forbidden or prescribe migration to a new vendor. Preserve necessary isolation and access boundaries for identifiable records.

Use measured series counts and available resource/cost evidence to set the relevant budget. A theoretical product is a useful warning, not a memory or invoice measurement. If costs are unknown, deliver the count change and the measurement needed to price it.

## Verify the consumer

For an implementation request, exercise representative bounded values, novel identifiers, raw paths, unexpected errors and expired dimensions. Check both allocation growth and the alert/query the change is meant to preserve. A bounded fixture should reconcile event totals before and after normalization; a low series count achieved by losing errors is a defect.

Deliver the label change or requested design with observed counts, projected bounds, churn assumptions and a query-equivalence explanation. Keep fixture arithmetic, production resource measurements and live notification behavior distinct.
