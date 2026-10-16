# Godskills usefulness release implementation plan

> **For agentic workers:** Use `dispatching-parallel-agents` for genuinely independent tasks or `executing-plans` for inline task-by-task execution. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver 8–12 evidence-backed product improvements with usable methods,
fair bounded application comparisons, improved discovery and verified installation.

**Architecture:** Draft methods in disjoint staging lanes; the parent integrates
accepted material into the current portable pack. Keep evaluator tasks and hidden
criteria separate from authors, freeze condition inputs, and reuse existing harnesses.

**Tech Stack:** Portable Markdown/JSON, Node.js 24, existing offline Godskills CLI,
Git and authorized native Codex workers. No new runtime dependencies or API spending.

**Spec:** `docs/superpowers/specs/2026-10-16-usefulness-release.md`.

## Global constraints

Use baseline `7c7f2ac98a282ccb2e59c3a4c0424802a4dd72b5` and its 93-skill pack.
At most two Astra High and two Sol 6.1 XHigh workers; no descendants. Preserve
historical receipts, protected activation bytes, unrelated skills, physical sources
and old untracked archives. No new acquisition, source execution, paid model calls,
R10 terminal updates or installation before acceptance. Parent alone integrates.

## Task 1: Freeze cases and recover a usable comparison path

**Files:** `evaluation/usefulness-20261016/{protocol.md,tasks.json,criteria.json,checks.test.mjs}`
and `artifacts/qualification/usefulness-20261016/evaluation-setup/`.

**Interface:** Task records contain `id`, `family`, `prompt`, `suppliedFiles`,
`outputContract` and `skillIds`. Criteria contain task ID, observable check,
criticality and scoring rule. A task packet contains no answer key.

- [ ] Inspect existing `evaluation/quality-20261003` and available CLI controls.
      Do not rerun old agents or read credential values.
- [ ] Write four frozen tasks and independent discriminating criteria; include
      missing data, interruption/uncertain outcome and ordinary-task boundaries.
- [ ] Verify matching identities and no hidden criteria in task packets with:
      `node --test evaluation/usefulness-20261016/checks.test.mjs`.
- [ ] Record exact isolation, model and instruction conditions before live calls;
      parent launches only admitted pairs, sequentially/counterbalanced within capacity.

## Task 2: Four business/learning refinements

**Files:** New files only under
`artifacts/qualification/usefulness-20261016/lane-a/`.

**Interface:** `proposals.json` contains owner, job, current coverage comparison,
exact source records, disposition, candidate Markdown path, adoption delta and
fresh application-check descriptions. No product edits in this phase.

- [ ] Read complete relevant current owner bodies and selected references.
- [ ] Inspect bounded actual warehouse source bodies for qualification,
      onboarding, operational bottlenecks and adaptive practice.
- [ ] Author only missing mechanisms in original language, with concrete worked
      examples and no invented performance claims or obligatory paperwork.
- [ ] Provide checks that would distinguish each method from existing coverage.

## Task 3: Four interactive/creative refinements

**Files:** New files only under
`artifacts/qualification/usefulness-20261016/lane-b/`.

**Interface:** Same proposal contract as Task 2, disjoint owners/resources proposed
for shader/effects, lighting/materials, animation transitions and frame budgets.

- [ ] Read Arcadia, Muse and performance owners and relevant existing references.
- [ ] Inspect exact inert warehouse sources and separate neutral methods from
      engine-version-specific instructions and unverified code.
- [ ] Produce original useful procedures and small discriminating examples;
      retain adequate existing work instead of duplicating it.
- [ ] State which aspects need a real renderer, engine, device or human judgment.

## Task 4: Challenge discovery on fresh phrasing

**Files:** `tests/usefulness-discovery.test.mjs`, new evidence under
`artifacts/qualification/usefulness-20261016/discovery/`; only confirmed repairs
may touch `product/lib/{discovery,request-scope,selection-boundary}.mjs`.

- [ ] Freeze and run positive, adjacent-owner, exclusion and no-skill queries
      before implementation, using the exact current pack.
- [ ] For any concrete failure add a failing regression, implement the smallest
      coherent repair, and rerun both the new test and affected existing tests.
- [ ] Do not invent a scoring bonus, remove difficult controls or promise semantic
      certainty. No discovered defect means retain, not manufacture an improvement.

## Task 5: Apply, independently review, and release

**Files:** Accepted `product/skills/<owner>/` deltas; current catalog and release
outputs via existing builder; new scoped qualification tests and release record.

- [ ] Parent runs admitted matched comparisons, preserves outputs and usage, and
      identifies task-specific findings without changing the frozen task set.
- [ ] Rotate independent reviews after authors finish. New methods get distinct
      transfer cases; reviewers do not accept their own authored guidance.
- [ ] Integrate only useful accepted methods, source metadata and confirmed
      discovery repairs; update conditional method directory without altering old rows.
- [ ] Run `node product/bin/godskills.mjs build`, `validate`, focused tests and
      full maintained suite. Verify exported ZIP in a relocated minimal environment.
- [ ] Reconcile origin/main; commit/merge/push accepted bytes. Install with a new
      rollback directory and exact native/runtime before/after manifests, preserving
      unrelated content. Final report separates measured results from unproven claims.

## Execution

Parallel work is already authorized. The parent handles scope, input freezing,
comparison admission and final integration inline; workers own disjoint lanes.
The preceding unchanged baseline passed 1,857 tests with two disclosed skips and
zero failures at 06:30 UTC on this same day; fresh pack validation matched it.
No second identical baseline suite or dependency install is needed before edits.

## Checkpoint result

Tasks 2–4 are implemented, independently reviewed and integrated. Task 1's frozen
protocol and portable setup checks are complete, but live admission is HOLD because
the launcher injects instructions that conflict with the intended control condition.
Zero live comparison calls were made; this is not a completed efficacy comparison.
The accepted product work continues under the spec's explicit isolation fallback.
Eight methods and the discovery correction pass the 1,951-test maintained suite
(1,949 pass, two disclosed skips), plus Windows and WSL-Linux relocated export checks.
Task 5's publication and backed-up installation are the remaining transaction gates;
their exact result belongs in `docs/usefulness-product-release-20261016.md`.
