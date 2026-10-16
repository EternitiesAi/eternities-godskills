# Runnable method examples

These small, dependency-free examples turn three methods into code you can inspect,
test and adapt. They use fictional data and explicit policies. They are not a live
company integration, a rendering engine, or evidence that skills outperform an
unguided model. Nothing runs automatically when an agent reads the pack.

With Node.js 24 or newer, from the pack root:

```text
node examples/constraint-diagnosis/demo.mjs
node examples/onboarding-cohorts/demo.mjs
node examples/animation-interruptions/demo.mjs
node --test examples/constraint-diagnosis/index.test.mjs examples/onboarding-cohorts/index.test.mjs examples/animation-interruptions/index.test.mjs
```

| Example | Useful decision | Boundary |
| --- | --- | --- |
| [Constraint diagnosis](constraint-diagnosis/README.md) | Reconcile ready workload, blocked work and rework against shared resource hours before adding capacity | Deterministic effort arithmetic, not a scheduling solver or throughput forecast |
| [Onboarding cohorts](onboarding-cohorts/README.md) | Measure timely recipient-accepted first value without dropping blocked accounts or mixing immature entrants into the denominator | Caller must establish the event's meaning; no causal retention or conversion claim |
| [Animation interruptions](animation-interruptions/README.md) | Keep cancelled gameplay events separate from fading visual contributions and ignore stale completions | Pure state simulation; no rendered pose, network authority or engine integration |

Read the chosen example's input contract before substituting real data. Keep any
source-specific consent, accounting policy, acceptance evidence and engine behavior
outside these illustrations explicit. Erroring on contradictory input is preferable
to silently turning it into a convincing metric or gameplay event.

The matching instruction resources are
[constraint diagnosis](../skills/operating-cadence-and-decision-accountability/references/constraint-diagnosis-v1.md),
[customer onboarding](../skills/eternities-beacon/references/customer-onboarding-v1.md),
and [animation interruption](../skills/eternities-arcadia/references/animation-interruption-transitions.md).
These are three examples, not three new skill entrypoints.
