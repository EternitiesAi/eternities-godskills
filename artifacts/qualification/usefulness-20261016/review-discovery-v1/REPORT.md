# Independent discovery review v1

**Decision: REPAIR**

Reviewed Dewey's discovery change against exact Git baseline
`7c7f2ac98a282ccb2e59c3a4c0424802a4dd72b5` on
`feat/usefulness-release-20261016`. The intended refusal repair is real and
reproduces, but its two unbounded verb prefixes introduce a recall regression.
No production or test repair is applied by this review.

## Actionable finding

**[P2] Match fix/debug actions without consuming unrelated words**
Location: `product/lib/request-scope.mjs:5`.

Adding `fix\\w*` and `debug\\w*` to `refusedAction` makes nouns,
adjectives and different verbs match as though the user refused fixing/debugging.
The existing `text.slice(0, refusal.index)` then discards the remainder of the
clause. When the false refusal occurs at the beginning, the live game work is
erased entirely and runtime admission removes Arcadia. This is a new regression:
the exact baseline returns Arcadia within its first two results in each case;
the candidate excludes it from all 20 returned candidates.

| Fresh frozen control | Baseline Arcadia rank | Candidate result |
| --- | ---: | --- |
| Do not fixate on naming while you debug player input in the browser game. | 1 | Absent; surviving clauses = [] |
| Avoid fixating on shader naming while you debug our browser game. | 1 | Absent; surviving clauses = [] |
| Avoid fixed camera angles when you design our browser game. | 1 | Absent; surviving clauses = [] |
| Avoid fixtures from the old prototype when you build the browser game. | 1 | Absent; surviving clauses = [] |
| Avoid debugger breakpoints when you test the game simulation loop. | 2 | Absent; surviving clauses = [] |
| Do not debugprint every frame when you build the browser game. | 1 | Absent; surviving clauses = [] |

The first five are ordinary language controls; the last is a synthetic identifier
prefix stress case. They expose one boundary defect, not six unrelated bugs.
The live actions are debug, design, build or test; avoiding fixation, fixed camera
angles, old fixtures or debugger breakpoints does not refuse those actions.

Recommended repair: recognize bounded action forms, accounting for the applicable
refusal prefix where necessary, rather than every word beginning with fix/debug.
Preserve actual fix/debug and fixing/debugging refusals, contractions, quotation
handling, and live work before or after supported clause separators. Merely
dropping gerunds to pass these positives would regress the intended repair.
No exact patch is endorsed without rerunning the original frozen cases, existing
repair controls and these unchanged independent controls. No general natural-language
parser is required to stop matching fixate, fixtures and debugger as these verbs.

## What is correct

The production diff is one line and exactly two added alternatives. No ranking
bonus, owner metadata, catalog or clause-separator change is present in the
compared module graph. Six exact Git baseline modules were loaded from Git objects
into an in-memory VM graph. Only request-scope differs from current bytes.
The catalog hash is identical to baseline.

The original frozen case outputs reproduce byte-for-byte as serialized JSON
against the author's retained baseline/candidate outputs: **40 exact output
matches** across 20 cases and two conditions. Baseline passes 18/20; candidate
passes 20/20; only exclusion-01 and exclusion-02 change. Thus the original
fix/debug omission was demonstrated and repaired for those cases.

The current VM graph and normally imported public `searchCatalog` produced
identical complete serialized outputs for **53 queries** (20 author-frozen plus
33 reviewer controls). Current request-clause traces also matched the direct
import for all reviewer controls. This parity check limits harness distortion;
the candidate observations use the actual direct public API, not a substitute
routing implementation.

## Checks actually executed

| Check | Result |
| --- | --- |
| `node --test tests/usefulness-discovery.test.mjs` | 28 PASS, 0 fail, 0 skipped |
| `node --test tests/discovery-selection-boundary-20261003.test.mjs tests/cohesive-discovery-runtime-repair.test.mjs` | 39 PASS, 0 fail, 0 skipped |
| Independent exact-baseline/current frozen replay | 18/20 baseline, 20/20 candidate; 40 matches to retained full outputs |
| Fresh reviewer controls | 24/30 scored candidate controls pass; six introduced recall failures |
| Additional grammar-boundary observations | Three unscored diagnostic controls |
| Author delivery manifest | All 16 declared file hashes and byte counts match |

All 67 focused tests passed, including exact-ID addressability and authority/
activation checks. They do not cover the newly identified prefix collisions.
The 30 scored controls were fixed in controls.json before their first execution;
they include affirmative, refusal, mixed-clause, quotation and no-need cases.
The three diagnostic controls were declared unscored from the start and were
not removed or relabeled after observation.

Commands, complete focused test output and harness-capture repairs are retained
in focused-tests.txt and run-record.json. Two probe executions completed with
exit 0 but their stdout was truncated by collection limits; JSON capture failed.
The review harness was repaired first to retain bounded traces plus full-output
hashes, then to emit compact JSON. The third execution produced a complete
parseable receipt. Controls and expectations were unchanged across those runs.

## Exact input identities

| Input | SHA-256 |
| --- | --- |
| Baseline request-scope.mjs | `e9055f1bfa2a913c1f73e93f5fa652588963e63dd9094e46713786fe400877f2` |
| Candidate request-scope.mjs | `cc4dd37aa161acbb56d5e7ff19b484e762d4290fb0bdc4716acf964932dc64fb` |
| tests/usefulness-discovery.test.mjs | `4554b56aa59aed16c9c53bd22a6c441ed09e7c22d2a4127f1d977e6b189bb30b` |
| Author frozen-cases.json | `4fb39b46fb15239c0cf29136c3c82846d1f1275c904467412b569b9b50d93691` |
| Reviewer controls.json | `3ffff4867c26402842fac8215a9ef18f65ee0526734daca5578ff42a9c22361a` |
| Unchanged product/catalog.json | `adfa5cfed9ac1c6a3ca8db26522e322aa5106ca031884a4de1d8a61dc1a41b36` |
| product/release.json | `752e4596352499e2d601833c30a6c9149fa5ebe5ef7e31f11949d57f4251785e` |
| Author file-manifest.json | `38af889cda55fc701475373da969de834285de2a505879e3e1e82c2d31b7a731` |

results.json records the exact six-module identities for each condition, all
fresh queries and expectations, returned IDs, Arcadia score/reasons, surviving
clauses, authority/activation and selection states, and digests of complete
API outputs. It also binds all 16 author delivery paths to their observed hashes.
Raw full candidate objects are omitted from fresh traces to bound receipt size;
the public API returned them and the complete serialized-output hashes are retained.

## Behavior and authority limits

The finding is a loss of applicable retrieval, not automatic activation or an
authorization bypass. All inspected outputs retain authority=none and activation=none.
Incidental non-Arcadia lexical matches can remain even when runtime scope is absent.

The documented parser is finite English handling. Bare conjunctions, nested or
negated avoidance, unsupported refusal forms, historical discourse and arbitrary
quotation scope are not solved by this patch. Our unscored controls show:
- the bare `and` case changes from Arcadia present to absent;
- `not to debug` leaves Arcadia present in both conditions;
- `do not avoid debugging` changes from present to absent.

These are recorded limitations, not added to the six scored prefix regressions.
The actionable finding does not ask the patch to solve all three constructions.

The unchanged release manifest still binds the pre-repair runtime. The author's
retained CLI receipt reports `Release file digest changed`. This review did not
rerun CLI release validation, rebuild the manifest, or infer release readiness
from API success. Parent owns eventual release regeneration and verification.
No full suite, build, installation, provider call, acquisition, descendant or
commit was performed.

The review is independent of Dewey's authoring and the parent's 28-pass rerun,
but it is an informed code review, not blind held-out model evaluation or a
claim of statistical coverage. No evaluation/usefulness-20261016 tasks/criteria
or lane-b content was read. Lane-A drafts were kept frozen. All new review files
are confined to review-discovery-v1; input artifacts and tests are unchanged.

## Reproduce

From the named worktree, run the two focused commands above and:

```text
node --experimental-vm-modules artifacts/qualification/usefulness-20261016/review-discovery-v1/review-probe.mjs
```

The probe only reads an explicit module whitelist, exact Git objects, the assigned
discovery artifacts and reviewer controls. It prints a receipt; it never modifies
production, tests, author cases, shared metadata or lane-A files. The probe exits
successfully when receipt generation and parity checks succeed even when semantic
controls fail; inspect summary.regressions and this REPAIR decision.

