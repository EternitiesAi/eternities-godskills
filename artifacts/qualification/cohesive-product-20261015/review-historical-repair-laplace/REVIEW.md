# Independent historical-compatibility review

Disposition: **READY — bounded test/helper compatibility only.** No actionable finding in the reviewed frozen repair. This does not accept runtime RR1, re-review any A/B/D method body, or replace parent release acceptance.

## Observed verification

On Node v24.18.0, Laplace independently ran the six named test files at 2026-10-16T06:13:08.443Z: **90 passed, 0 failed, 0 skipped**. Sixteen independent audit groups passed. No build, full suite, provider call, dependency install, worker delegation, product edit, or test edit was performed. The focused conditional test invokes the existing read-only validation CLI; it does not build the product or execute optional scenarios.

- All 12 test/helper/fixture input hashes match Nietzsche's final-v1 receipt: five modified tests, new test, two unchanged existing helpers and three new fixtures.
- All 95 protected historical files match the author's before snapshot. All 14 retained source snapshots match their recorded original hashes.
- The new historical package fixture is byte-identical to Git at both canonical `c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d` and certified head `d62ee7e0ee012bb0adc252835904293e83fdb935`. The method-directory fixture is the exact canonical eight-row blob.
- The cohesion map equals the actual canonical-to-current catalog delta: **19 owners, 39 fields**, limited to entrypoint hashes, triggers and resources. Each of the 93 current records inverses exactly to its canonical record. Independent controls retained visibility of 651 unrelated-field mutations and rejected 39 missing admitted fields.
- Original eight method rows remain exact. Thirteen added identities/owners/resource paths/hashes are pinned. Duplicate rows, reordering, owner/path changes, unsupported outcome/document status, missing review binding and old-row review drift fail. The real directory inspector still executes first, validating actual bodies/review hashes/pointers; independent in-memory owner-removal and resource-undeclaration controls fail.
- All **139 directly bound inputs** remained stable across the audit and focused run. Read roles distinguish identity hashing from inspected code and fixture comparisons. Imported dependencies and method resources are additionally exercised by existing focused checks; this is not independent reacceptance of their prose.

## Accepted narrow changes and retained guards

| Repair | Independent assessment |
| --- | --- |
| Historical package receipt | Only the exact package row uses the historical blob. Existing SHA, size, logical digest, receipt-link and certification checks remain. A separate exact inverse permits only the maintained test/check command change; six additional mutations of unrelated package fields/scripts/dependencies fail. |
| Cohesion, Atlas and Arcadia projection | Named inverse validates current values before substitution. Original Atlas/Arcadia helpers remain unchanged. Unlisted fields are retained, not stripped; original equality and resource guards remain. This is a named transition, not permission for future unreviewed changes. |
| Selected directory | Eight historical rows are preserved, thirteen additions admitted by exact identity. Current directory inspection and rendered-directory equality remain. The helper is not a substitute for the inspector's body/review byte checks. |
| Educational v4 transition | Current results explicitly require v4. Only the historical envelope method label maps to v3; unknown versions fail. Existing teaching recognition, actual-owner metadata matching, eligibility/refusal, returned-reason, authority and activation assertions remain. |
| E2-N03 | Full old baseline is pinned by SHA-256 `73f57b95459143c0d10ed3711cd873069970f2e5cc6546c8d490bc9490ec5ddb`. Exactly one reason is appended to the expected clone's rank-five Arcadia row. Original gold remains untouched; the other 15 literal baselines remain exact. Runtime reasons are never stripped. Changed gold, missing/extra/misplaced reasons and altered candidate/score/authority/selection still fail the focused controls. |
| Beacon sponsorship | Exact-once membership replaces an incidental last-element requirement. Chronology, provenance, rights/human-decision boundary, actual discovery, and no-activation assertions are retained. |

The exact admitted E2-N03 reason is:

> Lexical intent: game or real-time 3D runtime scope; cues: game or technical 3D context, independent work action or reported fault

## Starting drift and limits

Two inputs differ from Nietzsche's final-v1 run:

- `product/lib/discovery.mjs`: `ce74e5a9eafac393e8d39230f2d657847beac54a62574dea9df4303f7c0d4926` → `5078f81b1f8a4bb00436a1cc50bfaacb8307e5a852a9820ac0badc9e292f4fd4`.
- `product/release.json`: `5f2638f564460f939f179b33dc558bd0a31f8d41ef74663cecb3dbf0a47aa3a3` → `752e4596352499e2d601833c30a6c9149fa5ebe5ef7e31f11949d57f4251785e`.

These are recorded starting deltas after the parent-reported RR1 repair, not drift during this run. The focused tests reran against these current hashes. **RR1 semantics remain Avicenna's review; they were not investigated or accepted here.**

The parent's full-maintained-v2 result is reported context, not a suite rerun by Laplace. This review did not reproduce the old runtime implementation, certify universal equivalence, cover all possible future drift, accept source rights/performance claims, or reaccept substantive skill guidance. Existing historical failed/intermediate evidence and earlier method-bundle audits were left intact.

## Evidence

- `audit.mjs`: reproducible read-only audit and focused runner; prints results without writing.
- `audit-results.json`: exact read hashes, canonical Git blob hashes, before/current diffs, protected-file comparisons, controls, runtime starting drift and stability.
- `focused.tap`: actual independent six-file run.
- `review.json`: disposition and exact 12-file repair binding.
- `final-bind.json`: final stability check and evidence-file hashes, sealed separately after this report.

The semantic-implementation-diff skill shaped this review: intended version deltas are separated from preserved behavior and unobserved regions. READY applies only to these exact reviewed compatibility bytes.
