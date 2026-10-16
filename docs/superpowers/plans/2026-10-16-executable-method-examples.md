# Executable Method Examples Implementation Plan

> **For agentic workers:** Use `dispatching-parallel-agents` for genuinely independent tasks or `executing-plans` for inline task-by-task execution. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver three portable, independently checked executable applications of shipped Godskills.

**Architecture:** Three disjoint consumer examples use current instruction bodies and a fixed input/output contract. A separate reviewer authors behavioral cases, then reviews the returned implementations. Parent packages only accepted examples using the existing release machinery.

**Tech Stack:** Node.js 24+, ESM, node:test, no added dependency.

**Spec:** `docs/superpowers/specs/2026-10-16-executable-method-examples.md`

## Global Constraints

- Baseline main594a4b7, release6fa86b80; no previous release repeated.
- Three Sol6.1XHigh authors, one AstraHigh independent reviewer, no descendants.
- No acquisition, external paid provider, source execution, quarry disposition or protected-byte edits.
- Preserve historical evidence, user work, unrelated installed skills and existing archives.
- Evidence is host-native synthetic application, not raw comparison or measured business/visual uplift.

### Task1: Consumer implementations and separate acceptance tests

**Files:** Each author owns only its `product/examples/<name>/` plus matching `artifacts/qualification/executable-examples-20261016/<name>/`. Reviewer owns only `artifacts/qualification/executable-examples-20261016/independent/`.

**Interfaces:** `analyzeFlow(input)`, `summarizeOnboarding(input)`, `simulate(input)` exactly as spec. Each demo is runnable via `node product/examples/<name>/demo.mjs`; each test via `node --test product/examples/<name>/index.test.mjs`.

- [ ] Authors read the exact owner and selected method, record SHA256, write literal expectation tests, observe failures, then implement.
- [ ] Independent reviewer writes cases from spec before reading implementations; retains distinct first-run evidence, then reviews code and README.
- [ ] Parent checks method use, replays independent tests, routes concrete defects to author and records any limits without inflating evidence.

### Task2: Portable delivery and exact integration

**Files:** Parent owns `product/examples/README.md`, `product/README.md`, `product/RECIPES.md`, release manifest, release notes and integration receipts. No skill/catalog mechanism change assumed.

- [ ] Link three runnable examples from pack README and composition recipes; label fictional data and non-rendered animation.
- [ ] Build/validate with `node product/bin/godskills.mjs build` then `validate`; all old skill and method bytes must match baseline.
- [ ] Run focused existing product/export/install/navigation checks plus all new tests. Broad suite only if affected contract warrants it; do not repeat unchanged expensive tests by habit.
- [ ] Export to new archive with `node product/bin/godskills.mjs export --output <new-absolute-path>`; extract to isolated operation directory, run all3demos and author/independent tests there. Compare exact release hashes.
- [ ] Reconcile upstream and independently reviewed file hashes, fast-forward canonical, push only verified changes. Preserve failure evidence.
- [ ] Install accepted release with new rollback directory using existing installer; verify managed/runtime exact hashes and unchanged unrelated records. Record final commit/release/backup and report honest finite outcome.
