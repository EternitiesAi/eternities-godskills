---
name: eternities-forge
description: Coordinate multi-stage engineering delivery from settled intent through implementation, review, verification, and explicit integration.
---

# Eternities Forge

Forge is the coordination route for changes that need more than one engineering phase or cross-boundary proof. It composes a small chain of planning, execution, review, and verification; it does not make an unresolved design, permission, or deployment decision disappear.

Use one execution plan for the actual dependency chain. Do not turn each phase
into a separate skill ceremony or require parallel workers: one agent can carry
the slices serially with the same acceptance checks. A routine change with one
clear caller and a focused check can go directly through ordinary implementation.

## Choose the route

- **Feature delivery** carries a settled outcome through implementation, tests, review, and integration.
- **Regression repair** keeps reproduction, root-cause evidence, fix, and regression proof in one chain.
- **Refactor** protects behavior with a baseline while structure changes.
- **Risky integration** adds isolation, dependency closure, rollback, review, and fresh integration state.
- **Closure review** is an optional adversarial pass when the user names a specific defect shape or ideal-bar question. It returns the bounded state supported by evidence, not literal perfection.
- **Model-feedback refinement** uses a bounded generator/reviewer loop when critique can improve an artifact; the optional card in [methods.md](references/methods.md) keeps model judgments separate from verified acceptance.

## Working method

1. Bind outcome, repository, authority, exclusions, acceptance evidence, rollback, integration destination, and owners.
2. Resolve ambiguity that changes the implementation contract before dependent edits; a reversible local probe can supply the missing evidence. Delegate only when authorized and only independent slices with disjoint paths, explicit inputs, outputs, budgets, and termination conditions.
3. Establish the baseline: current behavior, tests, working-tree state, relevant interfaces, and any known failure. Preserve unrelated changes.
4. Bind each slice to its observable result, distinguishing checks and rollback boundary. Several checks may be needed for one result. Reuse the task's existing plan or issue to track dependencies and outcomes. Prioritize a thin end-to-end slice so interface assumptions meet a real caller early; add parallel branches only when their contracts are settled and their ownership is disjoint. A collection of passing isolated helpers leaves the integration result open.
5. Review correctness, security, performance, failure behavior, compatibility, maintainability, test honesty, and diff scope in proportion to risk. Recheck integration state immediately before combining work.
6. On failure, preserve exact evidence and return to the smallest responsible slice, including its producer or consumer when the defect crosses the seam. When a scoped effect is already authorized and its preconditions and rollback are clear, execute it within the declared target and verify the result. Hand off a payload only when another owner holds that stage or a real authority, resource or unresolved precondition prevents execution. A prepared payload does not close an authorized integration stage.

## Deliverable and finish

Return the delivered result, relevant verification and review disposition, actual integration state, unresolved risks and any next owner. Use a stage ledger when dependencies or ownership would otherwise be lost; existing plan entries can serve that role without another report. Finish only when fresh relevant verification covers the acceptance contract and required authorized integration is complete. Use [methods.md](references/methods.md) for slice and closure templates.

A stage ledger is a checkpoint, not automatically the end of the user's task. If implementation, verification, or another scoped stage was already requested and authorized, continue through it without asking for separate permission. Pause only for missing authority or material unresolved risk.

Example: after settling a migration slice, apply the authorized local schema change, run compatibility and rollback fixtures, and record the integration result instead of returning only the plan.
