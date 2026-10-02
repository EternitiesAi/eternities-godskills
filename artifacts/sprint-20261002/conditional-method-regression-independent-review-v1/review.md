# Conditional-method regression v2: independent review

Verdict: **READY — for the staged 33-case regression packet exercised against the exact selected candidate v2 product.** This does not adopt the product, approve method/source truth or rights, qualify routing or runtime capability, or establish CI merge protection.

## Frozen inputs

- Staged test: `artifacts/sprint-20261002/conditional-method-regression-v2/staged/tests/conditional-method-regression.test.mjs`, 23,241 bytes, SHA-256 `54b51de4b28a5d06da64c71021c7b181085e3ec1c39bc0d28960dc9ad3d2f2b1`.
- Core2260 catalog fixture: `artifacts/sprint-20261002/conditional-method-regression-v2/staged/tests/core2260-catalog.json`, 99,289 bytes, SHA-256 `57d47c0a9692dc21caa0e7909ee6c557cd5ef5cc4e09b968df079cc81f86aecf`. It is byte-identical to `product/catalog.json` at pinned main commit `84792f9e46b3b6511e7f3c5400dd840a4d658346`.
- Author packet: `artifacts/sprint-20261002/conditional-method-regression-v2/receipt.json`, SHA-256 `cc03f2d611bd6103c09d48ca123a3104c63066faae3232c9e6cd93214e43cf47`; report SHA-256 `973e5cf896eff2c93884d21ed8e0aac2a5c4206c079f6fdca835919629bbc165`.
- Selected test target: release `f6d71194e6897118f7ec7dac9bd2a9287479acb3345f347f291958091fd65cdc`; raw manifest SHA-256 `949de38dd46fe7f6e0e618ff3e5e4ddd1f92acc614acd0f7c0a9991a3d376efd`; 68 skills / 218 payload entries.

## Review and execution

The v2 test diff against terminal v1 changes only the final validation test: it becomes async, reads the selected product's own `release.json`, calls that product's `verifyProduct(productRoot)`, compares the returned manifest exactly, and binds CLI `releaseId` and `skillCount` to the selected manifest. The provisional `45c5…` release literal is removed. The core catalog fixture is unchanged and independently matched to the pinned core bytes.

The 33 cases comprise six pack/projection/resource/frontmatter/owner/directory/Daedalus checks, 18 frozen Hermes C/R/L/E assertions, eight optional-CI contract assertions, and one selected-product integrity/CLI identity test. I ran only this staged file against the exact candidate-v2 path:

```powershell
$env:GODSKILLS_PRODUCT_ROOT='C:\dev\eternities-godskills\.worktrees\product-sprint-20261002\artifacts\sprint-20261002\conditional-method-candidate-v2\product'
$env:GODSKILLS_REPOSITORY_ROOT='C:\dev\eternities-godskills\.worktrees\product-sprint-20261002'
node --check artifacts\sprint-20261002\conditional-method-regression-v2\staged\tests\conditional-method-regression.test.mjs
node --test artifacts\sprint-20261002\conditional-method-regression-v2\staged\tests\conditional-method-regression.test.mjs
```

Results: syntax check passed; **33 passed, 0 failed, 0 skipped** (0.59 s). The final test invokes the selected candidate's `godskills.mjs validate` and its `verifyProduct`; the latter compares actual product inventory with declared manifest membership and hashes, validates catalog coverage/metadata, and checks the rendered method directory. CLI identity then must equal that validated selected manifest. No author test, fixture, product, or historical v1 packet was edited.

The first five substantive checks preserve ordered 68-skill projection and existing resource bindings, require exactly four new resource paths with matching file hashes and owner metadata, preserve canonical Hermes/Math frontmatter and the Hermes body outside the conditional section, enforce owner-local placement/exclusions (including Daedalus B04 placement), and assert the exact eight selected-method IDs plus full task/exclusion/resource projections for the four new rows. The frozen Hermes and Daedalus checks are static regex-presence assertions over their loaded DRAFT documents; they are regression smoke checks, not semantic execution or proof of behavior.

## Boundaries and limits

The test and author packet do **not** establish a passing global-top-1 route. No top-1 or semantic-routing cases are in this packet; the author report explicitly excludes semantic routing and title-free owner correctness. The existing negative record continues to describe the earlier global-top-1 contract as **abandoned, not passed**. This regression does not revive or weaken that gate.

The test directly invokes `verifyProduct` and the CLI supplied by the selected package. That is a bounded candidate integrity/self-consistency check, not an independent second implementation of the validator. No provider, task-feed service, live-model scenario, full suite, CI workflow, branch protection, merge, or runtime scenario was exercised. The prior manual document applications and domain review were not repeated or upgraded by this test run.
