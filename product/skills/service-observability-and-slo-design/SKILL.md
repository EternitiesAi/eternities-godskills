---
name: service-observability-and-slo-design
description: Design and implement service reliability measurements, error budgets and actionable alerts using explicit event eligibility, weighted aggregation and telemetry coverage.
---

# Service observability and SLO design

Use to define or repair a service-level indicator, reliability objective,
error-budget calculation, instrumentation or burn alert. Start with the user
outcome that the service must deliver. A generic dashboard facelift, benchmark,
active incident response or contractual SLA determination has a different goal.
Missing telemetry still permits measurement design; it limits claims about
current reliability.

## Procedure

1. Bind the service boundary, user journey, reporting population, objective,
   time window and decision owner. Choose a small set of indicators for useful
   completion, timeliness, freshness or correctness. Treat resource saturation
   as diagnostic evidence unless it directly represents the promised outcome.
   Justify targets from user needs, observed baseline and operational capacity;
   example vendor thresholds are not ready-to-deploy objectives.
2. Define each eligible event, good outcome, bad outcome and exclusion. Specify
   measurement point, units, deadline, retry/deduplication semantics and handling
   of timeouts, partial work and late results. Distinguish a logical transaction
   from an attempt. Count failures that disappear before the application's
   completion counter; a success code alone may not prove useful completion.
3. Inspect existing metrics, logs and traces for coverage, clock behavior,
   reset handling, sampling and identity consistency. Compare expected events
   with collected events using an independent source where available. Separate
   observed zero traffic from absent, delayed or failed collection. Do not fill
   unknown telemetry with zero errors or a healthy result.
4. Calculate a ratio from summed compatible good and eligible event counts.
   Do not average percentages across unequal traffic or time intervals. For
   latency, count events meeting the threshold or combine compatible
   distributions before estimating a percentile; percentiles of percentiles
   do not represent the combined request population. Keep incomplete windows
   and coverage uncertainty visible.
5. Define the budget in the indicator's units. For event-based objectives, use
   allowed bad fraction, observed bad events and eligible counts; do not
   convert them to downtime minutes. Derive burn rate from observed bad fraction
   divided by allowed bad fraction. Name the response, owner, investigation
   context and recovery condition for every alert. Choose windows and thresholds
   that fit traffic, detection needs and response capacity.
6. When implementation is requested, add or repair the bounded instrumentation,
   queries, dashboard or alert rules in the existing stack. Control label
   cardinality and sensitive fields. Test arithmetic and alert behavior on
   representative event records before enabling notifications within the
   authorized scope. Check short and long windows, sparse traffic, resets,
   missing collectors, late data and recovery; fix discrepancies rather than
   adjusting eligibility to improve the score.

Read [methods.md](references/methods.md) for aggregation, coverage, budget and
alert calculations. If inputs cannot support the intended indicator, return
the smallest measurement repair and complete independent design work. Keep
query failure distinct from service failure, and route urgent recovery to the
incident workflow while preserving the measurement defect.

## Output and completion

Deliver an indicator contract, reproducible calculations or queries, telemetry
coverage findings, budget policy and actionable alert specification, plus
performed changes and test results. Finish when the requested design is usable
or the implemented measurements reproduce expected outcomes within the stated
environment. Mark proposed targets and untested notification paths; fixture
success does not establish live reliability or authorize release decisions.
