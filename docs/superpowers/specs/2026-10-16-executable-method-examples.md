# Executable method examples

## Decision and finite deliverable

Can three consumers turn the current Godskills methods into small, useful,
portable implementations that survive independently authored behavioral tests?
Ship accepted implementations as optional worked examples in the standalone pack.
This is a host-native application test with synthetic data, not a raw-agent
comparison, field trial, or evidence of general model superiority.

Baseline: canonical commit `594a4b7cd294eecfef8b5c9432416d7650ae4d92`, release
`6fa86b80b1a2bb015ea3d747f990da14c763b359912c3a7954499be66817d574`.
Three fresh Sol 6.1 XHigh consumers author disjoint examples. Astra High authors
independent acceptance tests from this contract before reading their solutions,
then reviews their behavior, documentation and limitations. Parent owns integration.
Inherited host instructions and native skill discovery remain present; no raw
isolation or randomized comparison is claimed. Calls are authorized native agents,
not a paid external provider. Token/cache counters are unknown unless reported.

## Common delivery contract

Each example has `index.mjs`, `index.test.mjs`, `demo.mjs`, `README.md` and no
external dependencies. Node 24+, offline, no machine-local paths, no input mutation,
no network or subprocesses in its implementation. Demo uses clearly fictional data
and prints JSON. Tests use Node's built-in runner. Errors for invalid/ambiguous
input are explicit; do not silently discard observations. No arbitrary input files
are executed. APIs below fix only the public behavior needed for independent tests.
Additional output fields are allowed if documented. Keep the code small enough
to inspect and adapt; this is not a workflow engine or general analytics platform.

Authors keep a separate evidence record of exact skill/resource hashes read,
red/green test observations, practical method contributions, departures and limits.
They do not edit their source skill, shared metadata, manifests or other lanes.

### A. Constraint diagnosis

Directory: `product/examples/constraint-diagnosis/`.
Use operating-cadence-and-decision-accountability and its constraint-diagnosis-v1
resource. Export `analyzeFlow(input)` with:

```json
{"resources":[{"id":"review","availableHours":12,"reworkHours":4}],
 "classes":[{"id":"standard","readyCount":4,"blockedCount":0,"effortHours":{"review":1}},
            {"id":"complex","readyCount":2,"blockedCount":0,"effortHours":{"review":3}}]}
```

Return `resources`, an array with `id`, `readyHours`, `blockedHours`,
`reworkHours`, `requiredReadyHours`, `shortfallHours`, `spareHours`.
Above: ready=10, blocked=0, required=14, shortfall=2, spare=0.
Resource capacity is shared across all classes, never cloned per class. Rework is
additional and counted once; README must state not to also include it in effort.
Blocked work contributes future effort but not presently ready demand. Count-based
classes are nonnegative safe integers, hours are finite nonnegative numbers;
duplicates, missing fields, unknown resource references and nonfinite calculations
fail. An empty class/resource list is permitted only if references remain valid.
No backlog-size-only diagnosis, promised throughput or automatic staffing action.
Demo compares an added-capacity or prevented-rework scenario using a separate input
and explains downstream/readiness checks before a real intervention.

### B. Customer onboarding cohorts

Directory: `product/examples/onboarding-cohorts/`.
Use Beacon and customer-onboarding-v1. Export `summarizeOnboarding(input)`:

```json
{"cutoff":"2026-10-15T00:00:00.000Z","windowDays":7,
 "accounts":[{"id":"a","enteredAt":"2026-10-01T00:00:00.000Z","eligible":true,
 "acceptedAt":"2026-10-04T00:00:00.000Z","blocker":null}]}
```

One row per account. `acceptedAt` is optional/null, and means a recipient-accepted
useful result from real customer input, not setup completion or demo data. Caller
owns establishing that event meaning. `blocker` is optional/null or a nonempty
string; absence of acceptance is not proof of abandonment. Other fields rejected
or documented as ignored; never infer acceptance from e.g. `setupAt`.
Return `matureCount`, `pendingCount`, `ineligibleCount`, `acceptedInWindowCount`,
`acceptedAfterWindowCount`, `matureNonSuccessCount`, `matureRate`,
`pendingAcceptedCount`, `completedMedianDays`.
Only eligible accounts whose full fixed elapsed window ends by cutoff enter the
mature denominator. Accepted at exactly the window deadline counts in-window.
Late acceptance stays outside the window-success numerator, reported separately.
Pending early acceptances do not enter mature numerator/denominator. The median is
elapsed days for mature in-window successes only; null when none. Mature rate is
null when denominator zero. Ineligible rows are separately counted. All absent,
blocked and unknown mature outcomes remain in the denominator. Validate unique
nonempty IDs, boolean eligibility, positive finite window, valid UTC timestamps
with explicit Z (real calendar dates), entry<=cutoff and entry<=acceptance<=cutoff.
Do not mutate input. Reject overflow. README explains fixed 24-hour days, censoring,
missing observations, median selection and that this is not retention inference.

### C. Interrupted animation events

Directory: `product/examples/animation-interruptions/`.
Use Arcadia and animation-interruption-transitions. Export `simulate(input)`:

```json
{"events":[{"at":0,"type":"attack","id":"a"},
           {"at":100,"type":"hit","id":"h"},
           {"at":140,"type":"strike","id":"a"},
           {"at":250,"type":"complete","id":"a"}],
 "sampleTimes":[0,100,150,250]}
```

Return `samples` in input sample order, each with `at`, `activeId` (null initially),
`state` (`locomotion`, `attack`, `hit`), `weights` with those three keys,
`movementOwner` (`controller`); also `acceptedStrikes`, an array of
`{at,id}`. Initial pose is locomotion. Attack blends for250ms, hit for100ms,
linear exclusive weights. New transitions start from evaluated current weights.
Cancellation immediately removes strike authorization independently of pose.
Strike is accepted exactly once per active attack, from140ms inclusive through
200ms inclusive after its start. Complete affects only matching active instance
and returns to locomotion in100ms. Every new attack/hit ID is unique for the run;
repeated same-type same-ID requests coalesce and cannot restart, reuse retired
IDs or reauthorize strikes. Reusing an ID for another type is invalid.
Same-time arbitration is hit before attack before strike before complete; a hit
suppresses same-time attack requests. Multiple distinct action requests with the
same type/time are ambiguous and rejected. Input order must not decide winners.
Samples evaluate after all events at their timestamp. Events/samples are finite
nonnegative times; unsorted inputs accepted. Unknown event type, missing ID,
duplicate sample times, malformed numbers fail explicitly. A stale unknown
strike/complete is ignored, not authorized. Input immutable.
For the example at150ms weights are0.3 locomotion,0.2 attack,0.5 hit; no accepted
strike. No renderer, skeleton, root motion, networking or real-engine claim. Explain
that this state model is illustrative and policies must be adapted by the caller.

## Acceptance and scope

Independent tests cover hand-derived outputs, boundary cases, invalid inputs,
nonmutation and the domain failure each method is intended to prevent. Record
initial failures and repairs. Authors' own tests alone are not independent review.
Ship only if independent review and parent replay accept exact final files.
Relocated pack must run examples/tests without the source checkout or dependencies.
Existing skills, method evidence, protected activation bytes, source quarry and
unrelated installed content remain unchanged. Refine prose only for a demonstrated
mechanism ambiguity, with fresh separate review; no claim that a model failure
automatically indicts the skill. No new acquisitions or providers.
