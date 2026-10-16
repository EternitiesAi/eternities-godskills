---
name: eternities-daedalus
description: Deliver evidence-bounded engineering changes across implementation, refactoring, integration, migration, performance, configuration, and specialist methods.
---

# Eternities Daedalus

Daedalus is the practical engineering route. It can inspect, plan, implement, refactor, or verify a bounded change when the task authorizes that effect. The route is selected by the behavior and proof surface, not by a language or framework name.

For a routine feature or repair, start with the caller and the observable result. Follow the input through the changed logic to the output, state or error the caller receives. Find the existing extension point and complete one usable slice there, including wiring and configuration needed to reach it. A helper that passes its own tests but is never called does not deliver the feature. Use existing project conventions; load a specialist only for a concrete unresolved boundary.

## Choose the route

- **Implementation delivery** turns a settled objective into small slices with interfaces, tests, rollback, and a handoff.
- **Refactoring and quality** improves structure, maintainability, test value, and reviewability while preserving behavior.
- **Language or framework work** keeps runtime, type, lifecycle, and version-specific constraints explicit.
- **Integration and observability** connects components or instrumentation with schemas, ownership, failure behavior, and effect classification.
- **Partial-commit recovery** maps durable effects, uncertain commits, and authorized compensation when a workflow must retain one effect while another fails; use the state-matrix card in [methods.md](references/methods.md).
- **Migration and configuration** validates shape, precedence, compatibility, data movement, rollback, and environment boundaries before use.
- Only when defaults or overrides affect existing durable objects, use [configuration lifecycle](references/configuration-lifecycle.md) to separate creation snapshots, live resolution, cache/refresh, capability and identity effects. A standalone constant with no persisted consumers does not need this reference.
- **Performance and specialist methods** starts from a repeatable baseline and uses only evidence-supported techniques.
- When a task introduces variable-output or potentially paid model scenarios that must remain outside required CI, use [optional model scenarios outside required CI](references/optional-model-scenarios-ci.md). This is a narrow test-selection and execution-boundary method; it does not replace ordinary local unit tests or qualify the repository's merge policy.

## Working method

1. Identify the requested behavior, affected callers and owned files, and a check that can distinguish success from the current behavior. Confirm current changes and existing authority before editing. Add explicit rollback and handoff details when durable state, external effects or another owner make them relevant; a small reversible edit can keep its contract in the task context.
2. Inspect the actual source and callers, plus configuration, dependencies, fixtures, and tests relevant to the change. Preserve evidence for consequential choices and unresolved assumptions in the existing task or repository record; a separate source ledger is not required for every edit.
3. For a behavior defect, identify a failing test or direct probe that detects it before changing the implementation. For new behavior, define an observable acceptance check. Use existing checks for low-impact reversible edits when they suffice; avoid tests that merely mirror the code. Run focused checks, widening to a broader suite when integration risk or repository gates require it. For fixture, oracle, mock-boundary, simulation, or end-to-end choices, use [test design and evidence](references/test-design-and-evidence.md). Load the optional model-scenario method only for its specific separation from required CI.
4. Preserve route-specific contracts: performance needs a workload and resource baseline; configuration needs schema and precedence; integrations need named boundaries; migrations need compatibility and recovery.
5. Inspect generated or unfamiliar code before executing it. Verify the resulting slice through its actual caller when wiring is part of the change; a stub below the changed boundary cannot verify that boundary. Separate author inspection from independent review and use the latter when the risk or project requires it. Record relevant results, uncovered edges, and performed effects.

When a check fails, locate whether the failure is in setup, the changed behavior, or an existing dependency. Repair an in-scope defect and rerun the affected check; do not replace the assertion with the observed wrong result. Widen the change coherently when a local patch cannot preserve the caller's contract. Stop at a demonstrated missing dependency, authority or decision, while completing independent useful work. A failed first attempt or a completed implementation plan is not the finish condition.

## Deliverable and finish

Return the working change and relevant verification, or the bounded plan when planning alone was requested. For a small change, explain what the caller can now do, the check performed and any remaining limit. Use a ledger or handoff when multiple effects, versions or owners need tracing; it is not a required extra artifact for ordinary implementation. Finish when the requested behavior works at the checked boundary and authorized integration is complete; a fixture or static check must not be presented as live integration or production evidence. The nine extension methods are in [methods.md](references/methods.md).
