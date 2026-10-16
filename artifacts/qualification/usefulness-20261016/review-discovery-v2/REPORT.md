# Independent discovery closure review v2

**Decision: READY**

The v1 P2 is closed for the exact bytes bound below. No new actionable regression
was found in this bounded closure review. READY means suitable for parent
integration; it is not a full release, installation or general grammar qualification.

## Exact change and test inspection

Compared with baseline `7c7f2ac98a282ccb2e59c3a4c0424802a4dd72b5`, the current request-scope file
adds only `fix(?:ing)?` and `debug(?:ging)?` to the refusal alternatives.
The closure probe reconstructs those insertions from the exact Git object and
asserts equality with the complete current file. All pre-existing alternatives,
quoting, normalization, clause separators and tail handling remain unchanged.
Reconstructing the former broad alternatives also reproduces the exact v1 hash,
binding the reviewed repair to the original finding.

The added `tests/usefulness-refusal-transfer.test.mjs` imports the actual public
`searchCatalog` API and current catalog. It reads the original v1 controls without
copying or rewriting them, filters only rows whose expected Arcadia value is not
null, and checks Arcadia presence plus authority/activation. Thus it executes
exactly 30 scored rows; the three diagnostic observations remain unscored.
The 28-case author test file and original discovery frozen cases are unchanged.

## Checks independently performed

| Check | Result |
| --- | --- |
| `node --test tests/usefulness-discovery.test.mjs tests/usefulness-refusal-transfer.test.mjs` | **58 PASS**, 0 fail, 0 skipped |
| Direct API replay of unchanged v1 controls | **30/30 scored PASS**; three observations remain unscored |
| Direct API checks for eight additional forms | **8/8 PASS** |
| Six former regression outputs | All six complete serialized-output hashes exactly equal their v1-recorded baseline outputs |
| Other 27 v1 outputs | All complete serialized-output hashes unchanged from the v1 candidate |
| Exact source-delta assertion | Only the two bounded additions to baseline |
| Input/freeze verification | All 17 bound files unchanged during probe |

The 30 direct-API controls overlap the new transfer test; they are not counted as
30 additional independent scenarios. Their extra closure evidence is exact output
comparison with v1, surviving-clause traces and return-state checks.

The additional cases were written in additional-controls.json before execution.
They cover uppercase FIX/DEBUG, uppercase FIXING/DEBUGGING, curly contraction
with repeated whitespace, gerunds on both sides of supported mixed requests,
the non-action word fixation, and the suffixed identifier debuggingTools. All
genuine refusals still exclude Arcadia; all specified affirmative work survives.

The three unchanged unscored observations remain: a bare conjunction loses the
later game clause; unsupported `not to debug` retains it; negated avoidance
`do not avoid debugging` loses it. Their behavior is not claimed to be repaired,
and none was converted into a pass to obtain READY.

The parent's RED 24-pass/6-fail report and tool chunk 9f995f are supplied context.
This review did not retrieve that external chunk or rerun the superseded production
variant. The independent current 58-pass rerun and exact baseline-output restoration
provide the closure evidence. The v1 failures and original review remain preserved.

## Exact file bindings

| File | SHA-256 |
| --- | --- |
| product/lib/request-scope.mjs | `1e670b69ce90a275be081a93179b0295ef2bb97d830680582c6201b3d0f3f4f1` |
| tests/usefulness-refusal-transfer.test.mjs | `54e2e14b95adedd5d41c7ac8c2f52ab53e81abedbed27127541ea03116b4a124` |
| tests/usefulness-discovery.test.mjs | `4554b56aa59aed16c9c53bd22a6c441ed09e7c22d2a4127f1d977e6b189bb30b` |
| review-discovery-v1/controls.json | `3ffff4867c26402842fac8215a9ef18f65ee0526734daca5578ff42a9c22361a` |
| discovery/frozen-cases.json | `4fb39b46fb15239c0cf29136c3c82846d1f1275c904467412b569b9b50d93691` |
| product/catalog.json | `adfa5cfed9ac1c6a3ca8db26522e322aa5106ca031884a4de1d8a61dc1a41b36` |
| product/release.json | `752e4596352499e2d601833c30a6c9149fa5ebe5ef7e31f11949d57f4251785e` |
| review-discovery-v2/additional-controls.json | `e36089f07ac4af69879aac1ac21452f0b56e2f99b0c560f4217fbb79f08e288f` |

Baseline request-scope hash:
`e9055f1bfa2a913c1f73e93f5fa652588963e63dd9094e46713786fe400877f2`.

Superseded v1 request-scope hash:
`cc4dd37aa161acbb56d5e7ff19b484e762d4290fb0bdc4716acf964932dc64fb`.

input-bindings.json binds the current review inputs and all eight preserved v1
files, including its manifest. results.json records all 41 direct API calls
(30 scored original controls, three unscored observations and eight new forms),
complete-output hashes, returned IDs, surviving clauses and authority/selection
states. focused-tests.txt retains the actual 58-test output. file-manifest.json
binds all new v2 artifacts except its own self-referential digest.

## Scope and remaining limits

All observed outputs retain authority=none and activation=none. This remains
finite English retrieval scoping, not general intent, arbitrary negation,
historical discourse or nested-quotation understanding. No prior verb family
was broadened or narrowed. No unrelated grammar behavior was tested or repaired.

Only new files under review-discovery-v2 were written. v1 was preserved; no
production or test files were edited. No evaluator tasks/criteria, other lanes,
acquired sources, provider calls, descendants, commits or installation were used.
No full suite, build, export or CLI release validation was performed. The unchanged
release manifest still does not establish a qualified release of the modified
runtime; parent owns subsequent release work.

## Reproduce

From `C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003`:

```text
node --test tests/usefulness-discovery.test.mjs tests/usefulness-refusal-transfer.test.mjs
node artifacts/qualification/usefulness-20261016/review-discovery-v2/closure-probe.mjs
```

The closure probe reads only explicit current inputs, exact baseline Git bytes,
v1 controls/results and the bounded v2 additional controls. It prints the receipt
to stdout and asserts all scored expectations. The three null observations are
recorded but do not fail on Arcadia presence; their authority/activation and
unchanged-output boundaries are still checked.

