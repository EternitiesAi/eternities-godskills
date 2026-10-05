# Measurement and alert methods

## Eligibility and event accounting

Define the unit before writing a query. A checkout transaction, request attempt
and background job have different denominators. State when eligibility begins,
which event proves completion, and when an unfinished operation becomes bad.
Treat retries consistently: either measure all attempts for an attempt-level
indicator or reconcile them into one outcome for a transaction-level indicator.
Predeclare justified exclusions and apply them to numerator and denominator.
Health probes and synthetic checks can have their own population; silently
mixing them with customer traffic can mask failures.

For scheduled work, derive expected jobs from the schedule or input ledger,
not only the jobs that emitted completion. Match numerator and denominator
scope, timestamps, labels and deadline policy. Check that bad plus good equals
eligible for fully classified events. Pending operations need a stated deadline
and accounting rule, not indefinite omission. Validate error responses against
the user promise: a redirect, rejected legitimate request or incomplete result
may be bad even without a server-error status.

## Aggregation that preserves the population

For disjoint intervals or instances with compatible definitions, calculate
`sum(good) / sum(eligible)`. If one interval has 1 good of 1 event and another
90 good of 100, the combined result is 91/101, about 90.10%, rather than the
95% mean of their percentages. Preserve raw counts alongside the ratio. If only
interval percentages survive and traffic weights are absent, the desired
event-weighted result is unknown. Do not silently replace it with a time-weighted
objective. Count overlapping cohorts only once in an aggregate.

Use compatible counter increments over the requested window. Resolve each
series' resets before aggregation where the metric system requires it. State
estimation from scrapes, gaps or sampling. For latency compliance, count eligible
events at or below the declared deadline, including the chosen timeout policy.
For a percentile, combine raw observations or compatible histogram buckets
over the full population. Align units, boundaries and event filters first.
Per-instance percentiles and percentiles of interval percentiles cannot
reconstruct that distribution. Histogram interpolation is an estimate; label
its resolution and do not manufacture an exact threshold bucket.

## Missing data and no traffic

Represent a healthy collector with observed zero eligible events as no traffic:
the ratio is undefined and no request budget was consumed. A missing series,
failed exporter or uncertain denominator is a measurement gap. Track collection
freshness and coverage separately, with diagnostic alerts when useful. An
unavailable measurement is not evidence of healthy service or confirmed outage.

Where independently known eligible counts include unclassified outcomes,
report known-good and known-bad counts and bound the result by assigning
unknown outcomes first to bad, then to good. Unknown total eligibility prevents
such a bound. Preserve omitted intervals and late-arrival corrections. Do not
allow favorable renormalization over surviving telemetry to certify a whole
window. Sampling assumptions require validation before expanding sample counts.

## Budgets and actionable burn

Let target success fraction be `P`, eligible events `N` and bad events `B`, all
from the same complete population. Allowed bad events are `(1-P)*N`; remaining
budget is that allowance minus `B`. Consumed fraction is `B/((1-P)*N)` and burn
rate in a selected window is `(B/N)/(1-P)`. Retain negative remaining budget
when exhausted. At zero traffic these ratios are undefined. A 100% target has
zero allowance: report bad-event counts and use a separately justified policy
instead of dividing by zero. A time-based objective needs independent time
exposure and downtime semantics.

Pair sustained and recent burn observations when both are needed to avoid
stale pages. For variable traffic, project budget consumption using expected
event volume, not an unexplained wall-time conversion. Derive thresholds from
the acceptable consumption and response interval; do not inherit constants
from a vendor example. Define sparse-traffic behavior explicitly, with direct
failure evidence or synthetic monitoring where appropriate. Test sustained
failure, brief spikes, insufficient traffic, missing telemetry and recovery.
Every notification needs an owner, an investigation path, grouping and clear
resolution behavior. Budget policy informs the responsible release decision;
it is not automatic authority to ship or freeze unrelated work.
