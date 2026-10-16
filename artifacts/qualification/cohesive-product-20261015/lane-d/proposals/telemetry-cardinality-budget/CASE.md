# Authored decision case

Synthetic observed tuples `(region, route)` are `(east, checkout)`, `(east, checkout)`, `(west, search)`. There are two observed series. Two regions times two routes gives a possible upper bound of four, not four measured series. Adding unique request IDs produces one new tuple per event; hashing those IDs does not reduce their count.

For a larger synthetic capacity envelope, 50,000 tenants × 200 route templates × 5 methods × 5 status classes gives 250,000,000 possible label tuples before exporter/instance effects. Removing the tenant dimension gives at most 5,000 combinations for those dimensions. Neither number is a measured active count or an invoice. A backend can support some large-cardinality workloads; the source's vendor-wide failure claim is not adopted.

Conflict: map unfamiliar raw errors to a bounded `other_error` outcome and preserve the error total. Dropping unfamiliar values to pass a series budget changes the alert population. Exclusion: a finite three-item menu loop does not need this workflow. Boundary: a required per-tenant incident question cannot be erased solely to fit a global aggregate.

Source contribution: the selected Trigger.dev cardinality body supplies multiplicative allocation, per-entity growth and time accumulation as failure mechanisms. This proposal narrows its universal loop-level trigger to a real telemetry-budget question and replaces rigid cardinality classes with measured bounds and query preservation. Its cursor-pagination and timer examples were not copied or executed; they do not establish pagination correctness or fairness.

The [Prometheus instrumentation guidance](https://prometheus.io/docs/practices/instrumentation/#do-not-overuse-labels) was checked as a primary source for labelset resource costs and dimension reduction. Its rule-of-thumb thresholds are not adopted as universal limits. The proposal's distinction between an observed tuple count and a Cartesian capacity bound is an independently authored correction to the source's presentation.

Integration disposition: extend the cardinality sentence in `service-observability-and-slo-design` with a lazily read method. Keep SLO event eligibility and burn arithmetic in the existing skill; do not create a rival observability workflow.
