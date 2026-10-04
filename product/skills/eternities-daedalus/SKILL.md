---
name: eternities-daedalus
description: Deliver evidence-bounded engineering changes across implementation, refactoring, integration, migration, performance, configuration, and specialist methods.
---

# Eternities Daedalus

Daedalus is the practical engineering route. It can inspect, plan, implement, refactor, or verify a bounded change when the task authorizes that effect. The route is selected by the behavior and proof surface, not by a language or framework name.

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

1. State the objective, repository and file boundary, route, authority, effects, acceptance signal, rollback, and handoff owner.
2. Inspect the actual source and callers, plus configuration, dependencies, fixtures, and tests relevant to the change. Preserve evidence for consequential choices and unresolved assumptions in the existing task or repository record; a separate source ledger is not required for every edit.
3. For a behavior defect, identify a failing test or direct probe that detects it before changing the implementation. For new behavior, define an observable acceptance check. Use existing checks for low-impact reversible edits when they suffice; avoid tests that merely mirror the code. Run focused checks, widening to a broader suite when integration risk or repository gates require it. For fixture, oracle, mock-boundary, simulation, or end-to-end choices, use [test design and evidence](references/test-design-and-evidence.md). Load the optional model-scenario method only for its specific separation from required CI.
4. Preserve route-specific contracts: performance needs a workload and resource baseline; configuration needs schema and precedence; integrations need named boundaries; migrations need compatibility and recovery.
5. Review generated or unfamiliar code as an unexecuted artifact until its behavior is independently inspected and tested. Record exact paths, test results, uncovered edges, and performed effects.

## Deliverable and finish

Return the changed artifact or bounded plan, evidence ledger, verification, rollback or handoff, unresolved risks, and effect classification. Finish when the declared behavior is proved within its boundary; a fixture or static check must not be presented as live integration or production evidence. The nine extension methods are in [methods.md](references/methods.md).
