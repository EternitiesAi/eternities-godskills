# Historical compatibility repair — frozen for Laplace

Disposition: authored repair complete; focused gate **90/90 PASS**, no skipped tests, no observed input drift, **95/95 protected files unchanged**. Independent Laplace acceptance and the parent full maintained suite are separate pending gates. Source/test/helper edits are frozen at `final-v1-results.json`; only this final evidence packet was added afterward.

Worktree: `C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003`. HEAD remained `c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d`. Node `v24.18.0`. This worker made no product, runtime, metadata, package, protected receipt/fixture, original helper, historical review, warehouse or source-stage edits; no build, full suite, install, commit, provider call or descendant run.

## Exact causes and bounded repairs

| Assigned failure | Cause | Repair and retained boundary |
| --- | --- | --- |
| 129, adaptive-evaluator-compatibility | The aggregate receipt binds the package input at reviewed head `d62ee7e0ee012bb0adc252835904293e83fdb935`, not every future mutable package. Current package changed only the reviewed explicit test/check scopes. | Added the exact 3,874-byte historical package blob, SHA-256 `538531951004f100fd557066ebb274306847f38ba514f4333f735b0dccd9b773`, also identical at canonical c4. Only the package row reads that pinned historical input; every other declared input/output still validates actual bytes, size and declared logical digest. A separate current-package assertion requires the exact maintained test/check scopes and rejects every other package-field drift. Certification and receipt were not refreshed. |
| 260/266, Arcadia asset revision | The earlier inverse projection knows the asset revision but not subsequent admitted cohesive owner changes. | Apply a separately named `cohesive-product-20261015-to-c4e0fd2-v1` inverse before the unchanged Arcadia helper. Each declared current field must match its exact admitted value. Unlisted fields pass through to the original equality checks. Original negative drift controls remain. |
| 546/547, conditional core/resource projections | The historical 68-entry gold predates admitted owner entrypoint, trigger and resource changes. | The same named inverse precedes the unchanged Atlas/Arcadia projections and original comparisons. Nineteen owners have an explicit per-field before/after map; only `entrypointSha256`, `triggers` and `resources` have admissions. Actual method body/review bytes remain checked by `inspectMethodDirectory`. No full catalog substitution or old-gold regeneration. |
| 550, selected methods | The test title said four new methods but its expected array already contained eight original rows. The current directory adds thirteen independently bound methods. | Preserve the complete eight original rows from the exact canonical method-directory blob, then check the thirteen explicitly admitted id/owner/resource/hash bindings, review status and review structure. Existing original-four task/exclusion/body checks remain. Runtime directory inspection validates actual body and review hashes/pointers. Unknown rows, lost/changed original rows and changed new bindings fail. |
| 551, npm test contract | The old test expected unconstrained `node --test`; the reviewed runner deliberately names maintained roots to avoid executing intentionally failing historical artifact tests. | Require the exact tests/examples/evaluation/product globs in both test/check, retaining the prohibition on optional-model scenarios in required commands. The separate package inverse rejects dependency, unrelated script and package-name changes. No package or runner changes made here. |
| 723 and E2/F4 | Historical 77-entry identity comparisons predate the same owner changes. Fifteen negative literal cases differ only in v4/v3 envelope method. E2-N03 additionally exposed a real runtime admission loss, repaired by Dirac, whose final runtime adds one intentional non-teaching explanation. | Historical identity uses the named inverse. Current runtime method is asserted as v4; the only envelope projection is exactly v4 to v3. All sixteen literal inputs/gold stay intact. For E2-N03 alone, the entire old baseline is hash-pinned (`73f57b95459143c0d10ed3711cd873069970f2e5cc6546c8d490bc9490ec5ddb`, SHA-256 of JSON.stringify baseline) and one exact runtime reason is appended to an expected clone, per parent instruction. Runtime output reasons are never stripped. Candidates, scores, every other reason and all literal envelope fields remain exact. Current teaching, eligibility, refusal, filter and authority assertions remain. |
| 1639, Beacon sponsorship | Three required metadata members were incorrectly required to remain the last array elements after later additions. | Require exactly one occurrence of each exact trigger, exclusion and resource, retaining all current content, provenance, discovery and human-authority checks. No owner edits. |

E2-N03's only admitted current reason is:

> Lexical intent: game or real-time 3D runtime scope; cues: game or technical 3D context, independent work action or reported fault

The reason is bound only to the pinned original Arcadia rank-five row. Missing, altered or extra reasons, a reason added to a different owner, a changed score/owner/authority/selection, or changed historical gold fails. This does not claim the current output is byte-identical to old runtime output. Canonical reproduction of all sixteen original literals is Dirac's recorded evidence (`review-runtime-repair-dirac/diagnosis.before.json` and `FINAL.md`), not a new replay claimed by this worker. No historical runtime graph was copied into the product or tests.

## Changed source/test files

Existing tests:

- `tests/adaptive-evaluator-compatibility.test.mjs`
- `tests/arcadia-asset-revision.test.mjs`
- `tests/conditional-method-regression.test.mjs`
- `tests/educational-discovery-revealed-v2.test.mjs`
- `tests/universal-wave25-beacon.test.mjs`

New test-only files:

- `tests/helpers/nietzsche-historical-compatibility.mjs`
- `tests/helpers/nietzsche-cohesive-catalog-v1.json`
- `tests/helpers/nietzsche-adaptive-package-input-v1.json`
- `tests/helpers/nietzsche-method-directory-before-cohesion.json`
- `tests/nietzsche-historical-projection.test.mjs`

All ten exact SHA-256 bindings, plus the two unchanged original helpers and runtime/catalog/package/release inputs, are in `final-v1-results.json.inputs`. The public product does not acquire this historical test harness. Additional authored evidence is confined to this directory.

## Verification and retained failures

- `before-results.json` / `before.tap`: **58 pass, 26 fail / 84**. Preserved original five-test focused reproduction, including generated-file staleness. Exact original source snapshots and 95 protected hashes are in `before.json` and `before/`; the original private parent full-suite TAP remains in place with its digest recorded.
- `after-results.json` / `after.tap`: **86 pass, 3 fail / 89**. Preserved intermediate failures: stale rendered method directory, stale release file set, and the exact extra E2-N03 runtime explanation. No input-run binding was captured in this intermediate collector version; it is not the final runtime binding.
- `final-v1-results.json` / `final-v1.tap`: **90 pass, 0 fail / 90** on the rebuilt parent product, executed `2026-10-16T06:03:02.287Z` through `06:03:03.390Z`. All 24 recorded source/test/generated/runtime input hashes remained unchanged across the run. All 95 protected files remained unchanged from the before snapshot. Includes five new projection-control tests and the separate current-package assertion; no skip pattern.
- Scoped `git diff --check` over the five edited existing tests passed. Imported helper/new-test syntax was exercised by the successful focused run.
- Parent build cleared the two stale generated-file failures; no validator or generated-file assertion was weakened.

The exact final command is recorded as an argument array in `final-v1-results.json`. For a future explicitly authorized replay, the evidence collector accepts a new unique label and refuses to overwrite prior outputs:

```powershell
node artifacts/qualification/cohesive-product-20261015/review-historical-repair-nietzsche/collect.mjs after laplace-verification
```

No further tests were run after the parent requested the stability freeze.

## Remaining gates and limits

No unresolved defect in the assigned focused repair set. Laplace must independently assess the admitted field map and exact E2-N03 exception, and parent owns the full maintained-suite/release disposition. These tests do not independently accept the substantive A/B/D methods or source proposals, prove semantic applicability, or establish performance superiority. Runtime changes and the wave29 causal assertion changes remain Dirac/Avicenna scope. Any source or runtime change after the bound run requires a fresh, separately named verification receipt rather than rewriting these results.
