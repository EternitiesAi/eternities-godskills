# Constraint diagnosis: shared effort and readiness

A small, offline worked application of the shipped
`operating-cadence-and-decision-accountability` skill and its
`constraint-diagnosis-v1` method. The example uses fictional data to reconcile
class-specific effort against shared resource hours. It supplies evidence for
considering a constraint; it does not diagnose a bottleneck from backlog size.

Requires Node.js 24+; no dependencies, installation or build step. From this
directory (including a relocated copy), run:

```sh
node --test index.test.mjs
node demo.mjs
```

The demo writes one JSON document to stdout and performs no file, network or
subprocess operations. It compares a baseline with a separate input that prevents
two review rework hours. Review's shortfall moves from two hours to zero; the
downstream acceptance resource still has no spare hours. Twenty blocked items
remain visible as future effort. The JSON includes readiness, downstream,
quality and observation checks to make before a real intervention.

## API

```js
import { analyzeFlow } from './index.mjs';

const result = analyzeFlow({
  resources: [{ id: 'review', availableHours: 12, reworkHours: 4 }],
  classes: [
    { id: 'standard', readyCount: 4, blockedCount: 0, effortHours: { review: 1 } },
    { id: 'complex', readyCount: 2, blockedCount: 0, effortHours: { review: 3 } },
  ],
});
// { resources: [{ id: 'review', readyHours: 10, blockedHours: 0,
//   reworkHours: 4, requiredReadyHours: 14, shortfallHours: 2, spareHours: 0 }] }
```

Inputs are JSON-shaped records. All shown fields are required. IDs are nonempty
strings, unique within resources and within classes; resource and class ID
namespaces are separate. IDs are preserved exactly and matched case-sensitively.
Whitespace-only IDs fail. Unknown fields on input, resource and class records
fail rather than silently ignoring a supplied observation.

`readyCount` and `blockedCount` must be nonnegative safe integers. Each hour value
must be a finite nonnegative number; fractional hours and zero are valid. No
strings are coerced and no absent values are imputed. `effortHours` is a mapping
from known resource IDs to hours per item of that class. An omitted resource key
means that class requires no effort from that resource, not that its effort is
unknown. If effort is unknown, resolve or state that uncertainty before calling;
this scalar API cannot encode a range. Empty lists and empty effort maps are
valid when all remaining references are valid. Even a zero-count class must have
valid efforts and resource references.

Every resource is reconciled once across all classes, in input resource order:

| Output | Meaning for this resource |
| --- | --- |
| `readyHours` | Sum of ready count times per-item effort across classes |
| `blockedHours` | Sum of blocked count times per-item effort across classes; future effort only |
| `reworkHours` | Resource's separate, presently required correction effort, counted once |
| `requiredReadyHours` | Ready hours plus rework hours |
| `shortfallHours` | Positive excess of required ready hours over available hours; otherwise zero |
| `spareHours` | Positive excess of available hours over required ready hours; otherwise zero |

All counts and hours must refer to the same planning period and flow boundary.
`availableHours` means usable hours after absences and other obligations, **before
subtracting the rework represented here**. Do not also include that rework in
class effort or subtract it from capacity: it is added separately exactly once.
`blockedHours` includes only the supplied class effort; the API has no separate
blocked-rework field.

`analyzeFlow` returns fresh records without mutating its input. Structural errors,
missing fields, duplicate IDs and unknown references throw `TypeError`; invalid
hour/count values and nonfinite calculated products or totals throw `RangeError`.
Errors include the affected input path or resource. JavaScript floating-point
arithmetic is used without rounding; decimal precision and estimates remain the
caller's responsibility. No total combines ready and blocked hours into demand.

## What this can support

The method contributes three concrete choices: translate mixed classes into
effort, share each resource's capacity across classes, and keep ready work,
blocked effort and correction effort distinct before considering a lever. The
demo's prevented-rework scenario is a candidate calculation, not evidence that
more cases will ship. The tests assert hand-calculated behavior, validation and
nonmutation using Node's built-in test runner, without mocks.

This is a host-native application with synthetic data. It is not a raw-agent
comparison or proof of skill superiority. The scalar totals cannot infer arrival
timing, queue age, precedence, preventability of rework, approval authority,
downstream acceptance, utilization or throughput. They cannot distinguish missing
inputs from work blocked after processing; callers need item-level traces and
acceptance/release evidence. Do not sum effort across resources to rank them or
turn a local shortfall directly into an automatic staffing action. Before an
intervention, identify an authorized owner, observation window, expected accepted
outcome, quality guardrail and reversal condition. Actual method-use notes and
source hashes are kept in the separate qualification evidence, outside this
portable product example. Independent acceptance and parent integration are
separate steps.
