# Task 4 discovery result

One demonstrated refusal-scoping defect is repaired. The same frozen challenge
improves from 18/20 to 20/20; the two corrected outputs remove Arcadia from
explicitly refused fix/debug work. All other 18 complete search outputs are
identical. No query or expected result was revised after the baseline.

## Exact implementation

`product/lib/request-scope.mjs`, line 5: add `fix\w*` and `debug\w*` to the
existing refused-action families. The clause boundary behavior and lexical
scores are unchanged. Live work before a refusal and after a sentence, semicolon
or explicit contrast remains discoverable. `discovery.mjs` and
`selection-boundary.mjs` are unchanged.

`tests/usefulness-discovery.test.mjs` exercises the actual public `searchCatalog`
on the unchanged current catalog: 20 original frozen cases and eight supplemental
repair controls. It asserts owner presence/absence, declared relative precedence,
no-skill abstention, and authority/activation boundaries. Reverting either new
refusal family recreates its corresponding retained red failure.

## Evidence identities

- Worktree: `C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003`.
- Branch: `feat/usefulness-release-20261016`; HEAD remains
  `7c7f2ac98a282ccb2e59c3a4c0424802a4dd72b5`.
- Current baseline portable93 release ID:
  `368d5a716bd3b8069ba5ba858f8db8f7fba8b19c36aa373fc62c19d8a2b55efb`.
- Frozen-case SHA-256:
  `4fb39b46fb15239c0cf29136c3c82846d1f1275c904467412b569b9b50d93691`.
- Catalog SHA-256, unchanged:
  `adfa5cfed9ac1c6a3ca8db26522e322aa5106ca031884a4de1d8a61dc1a41b36`.
- Release-manifest SHA-256, unchanged:
  `752e4596352499e2d601833c30a6c9149fa5ebe5ef7e31f11949d57f4251785e`.
- `request-scope.mjs` SHA-256 before:
  `e9055f1bfa2a913c1f73e93f5fa652588963e63dd9094e46713786fe400877f2`;
  after: `cc4dd37aa161acbb56d5e7ff19b484e762d4290fb0bdc4716acf964932dc64fb`.

`baseline.json` and `candidate.json` retain full outputs, request-scope traces,
runtime admission evidence, and SHA-256 identities for the exact spec/plan,
catalog/release, runtime, discovery docs, nine current owner bodies and their
metadata, the inspected practice-and-transfer reference, and three old release
archive/checksum files. The only source identity changed between probes is
`product/lib/request-scope.mjs`. `file-manifest.json` binds every delivered path
except its own self-referential hash.

## Checks actually performed

All commands ran from the worktree above under Node `v24.18.0`.

| Check | Actual result | Retained evidence |
| --- | --- | --- |
| `node artifacts/qualification/usefulness-20261016/discovery/probe.mjs` before runtime edits | 18/20; failures exclusion-01 and exclusion-02 | baseline.json |
| `node --test tests/usefulness-discovery.test.mjs` before runtime edits | 18 passed, 2 failed; then with supplemental controls 24 passed, 4 failed | red-tests.txt; red-tests-with-controls.txt |
| `node product/bin/godskills.mjs validate` on unchanged baseline | verified-content, 93 skills, exact release ID above | baseline-validation.txt |
| `node --test tests/usefulness-discovery.test.mjs` after repair | 28 passed, 0 failed | green-tests.txt |
| Same frozen probe after repair | 20/20; only two outputs differ; freeze unchanged | candidate.json |
| Focused regression command reproduced verbatim in focused-tests.txt | 232 passed, 0 failed across 11 files; one CLI test deliberately filtered out | focused-tests.txt |
| Actual candidate CLI search | exit 1, `Release file digest changed` | candidate-cli-integrity-gate.txt |
| `git diff --check` | exit 0 | checked after runtime repair and at handoff |

The focused run comprises the new 28 checks and 204 existing checks across
runtime admission, historical cohesive routing, request boundaries, host need,
asset discovery, motion/video, learner priority, supplied-data discovery and
cognitive workflows. The single filtered test is `actual search and route
callers carry no-need and reject invalid need flags` in
`tests/discovery-need-20261003.test.mjs`, because it requires a freshly generated
release manifest. Node reports 232 tests and zero skipped for this name filter;
that count does not include the omitted CLI test. The direct CLI integrity
failure is preserved separately rather than weakening its validation.

The initial lane-only probe failed before running queries because its relative
imports traversed one directory too far. It was repaired with apply_patch before
the baseline run; `initial-probe-error.txt` preserves the failure and cause.
No runtime result is attributed to that failed harness invocation.

## Limits and parent handoff

These are deterministic author-visible development challenges, not independent
review, held-out model evaluation, skill execution or measured learning/business
benefit. No independent reviewer or provider was called. Request scoping remains
finite English handling: this repair addresses the demonstrated fix/debug
families, not arbitrary negation, historical discourse, nested quotes or language
understanding. Excluding Arcadia does not eliminate every incidental lexical hit;
host need and final applicability review remain independent.

The candidate source is implemented and focused API checks pass. It is **not a
validated release**: the original release manifest intentionally retains its old
runtime digest. Parent must integrate accepted bytes, perform its authorized
shared release regeneration, then run CLI/full-suite/export verification before
any release or installation claim. The baseline release ID identifies the input,
not this modified runtime. No build, export or install was run in this lane.

Only the runtime path below, the assigned test, and new files in this discovery
directory were written. No commit, branch switch, acquisition, descendants, paid
model calls, global/configuration edits, source execution from the warehouse,
account/security change, catalog/skill-body edit or secret access occurred.
Tracked diff at handoff contains only `product/lib/request-scope.mjs`; the test
and evidence are new untracked files. Initial archives and supplied spec/plan are
preserved. Concurrent untracked usefulness/evaluation directories were visible
only in `git status`; their contents were not opened or modified.

## Exact delivered paths

Every path is relative to the worktree absolute root above. The first path is a
one-line modification; all remaining paths are new.

```text
product/lib/request-scope.mjs
tests/usefulness-discovery.test.mjs
artifacts/qualification/usefulness-20261016/discovery/REPORT.md
artifacts/qualification/usefulness-20261016/discovery/baseline-validation.txt
artifacts/qualification/usefulness-20261016/discovery/baseline.json
artifacts/qualification/usefulness-20261016/discovery/candidate-cli-integrity-gate.txt
artifacts/qualification/usefulness-20261016/discovery/candidate.json
artifacts/qualification/usefulness-20261016/discovery/diagnosis.md
artifacts/qualification/usefulness-20261016/discovery/file-manifest.json
artifacts/qualification/usefulness-20261016/discovery/focused-tests.txt
artifacts/qualification/usefulness-20261016/discovery/frozen-cases.json
artifacts/qualification/usefulness-20261016/discovery/green-tests.txt
artifacts/qualification/usefulness-20261016/discovery/initial-probe-error.txt
artifacts/qualification/usefulness-20261016/discovery/probe.mjs
artifacts/qualification/usefulness-20261016/discovery/protocol.md
artifacts/qualification/usefulness-20261016/discovery/red-tests-with-controls.txt
artifacts/qualification/usefulness-20261016/discovery/red-tests.txt
```
