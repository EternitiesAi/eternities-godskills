---
name: eternities-phoenix
description: Turn failures, incidents, interaction evidence, and performance questions into bounded diagnoses, candidate evaluation cases, recovery plans, or specialist handoffs.
---

# Eternities Phoenix

Phoenix handles bounded diagnosis, recovery, and interaction-based evaluation-case discovery. For diagnosis it protects against urgency-driven guesses by keeping reproduction, baseline, impact, hypotheses, reversible checks, rollback, and acceptance visible. It can implement an authorized local repair when the proof and recovery boundary are clear.

## Choose the route

- **Diagnosis and reproduction** compares supplied or locally reproducible behavior with an expected invariant.
- **Incident triage** classifies impact, scope, timeline, evidence, and owner while preparing a local coordination packet.
- **Recovery planning** chooses the smallest reversible intervention with preconditions, rollback, validation, and stop conditions.
- **Observability** inspects supplied telemetry or designs bounded instrumentation tied to a question.
- **Case discovery from interactions** turns an already supplied or explicitly authorized interaction sample into [candidate evaluation cases](references/trace-to-evaluation-cases.md). Use it when the question is *which behaviors to test*, not for one known bug with a reproducer. Do not fetch private traces or write annotations simply because this route exists.
- **Performance analysis** compares a stable workload and baseline with repeated measurements, units, percentiles, and resource evidence.
- **Specialist handoff** preserves the evidence packet when the cause belongs to a security, data, platform, provider, legal, or regulated boundary.

For case discovery, follow [the case-discovery method](references/trace-to-evaluation-cases.md) instead of the diagnosis workflow below. Select an operation, turn, or conversation as the observation unit before counting, and keep development cases separate from held-out evaluation. Deliver evidence-linked candidate cases and their limits; do not require a reproducer, hypothesis ledger, repair, or rollback owner when no incident exists.

## Diagnosis and recovery working method

1. Bind affected component, scope, authority, impact, timestamps, acceptance condition, reproduction or its absence, baseline, and rollback owner.
2. Read local evidence first. Preserve exact observations and locators; distinguish observed facts, derived values, hypotheses, proposals, and unresolved conflict. When another person or later session must replay the failure, use [reproducible bug packets](references/reproducible-bug-packets.md).
3. Compare a failing case with the nearest passing case. Trace their inputs and state across the actual call path to the first divergence. Keep plausible causes separate, then choose a cheap check whose possible results distinguish them. Predict those results before running it. Change one causal factor per intervention; independent read-only observations may be collected together. Record negative results and their conditions so an eliminated explanation does not silently return. For intermittent failures or competing causes, use [diagnostic experiments v2](references/diagnostic-experiments-v2.md).
4. Repair the responsible boundary when implementation is authorized, then rerun the reproducer and a nearby passing control. Include the caller or state transition that exposed the defect. A failure spanning producer and consumer may require coordinated changes; an arbitrary one-file limit must not preserve the defect. If the repair fails, use the new observation to revise the diagnosis and continue within scope. Repeating the same unsuccessful intervention without new evidence is not another experiment.
5. Treat production mutation, destructive repair, credential use, external systems, and background monitoring as consequential boundaries. Check whether existing authority explicitly covers the exact target and effect, and whether required preconditions and rollback are clear. Do not request approval already supplied. A new decision is needed only when that scope is missing or changed, or an unresolved precondition, material risk, or rollback gap remains. If an external effect is uncertain, reconcile authoritative state before acting; do not retry or compensate merely to resolve that uncertainty. Continue independent authorized diagnosis, local repair, and tests while the affected external action is held.

## Deliverable and finish

For diagnosis, return the supported cause or remaining hypotheses and the decisive observations. For an authorized repair, include the change, reproduction/regression results and any unresolved recovery boundary. A short bug can keep these in the response; use a durable hypothesis ledger when several attempts, an incident or a handoff need it. The historical durable elimination pattern is in [methods.md](references/methods.md); its single current hypothesis describes one intervention at a time, not a requirement to discard competing explanations. Finish at the requested diagnosis or verified repair boundary, or name the evidence/authority gap that prevents it.

If reproduction is unavailable, return the smallest fixture or observation needed to obtain it and stop the affected conclusion at unknown. Do not substitute urgency, a familiar symptom, or a successful restart for causal evidence.

A diagnosis is a checkpoint when the user also requested an authorized local repair. Once the cause and rollback are sufficiently evidenced, apply the bounded fix and rerun the reproducer without requesting permission already supplied. Pause only for missing authority or material safety, rollback, or evidence risk.

An authorized local repair is not proof of production recovery. Record the actual
target and observed effect; a passing mock, local test, or planned rollback cannot
establish what happened in an external system.

Example: reproduce a stale-cache failure, patch the invalidation boundary, rerun cold/warm and recovery cases, and preserve the eliminated hypotheses with the repair receipt.
