# Packaging review v1

Reviewed the five requested checks plus `.gitattributes`, at the exact SHA256
values in `hashes.json`. This review concerns parent integration tooling, not
acceptance of this author's example. No installer, real pack validation, other
author bodies or independent acceptance suite was run or opened. Fixture writes
and receipts are confined to this new review directory. All six handed-off
constraint-diagnosis files retained their before-review hashes.

Parent reports candidate prefix `7f93176c`, 209 focused tests with 208 passes and
one optional-volume skip, and seven Windows relocated commands passing. Those
results were not independently replayed here and do not resolve the gate gaps
below. No current candidate corruption or actual backup loss was observed.

## Findings

1. **P1: Cover the claimed source scope before reporting no changes.**
   `verify-relocated.mjs:9-12,23-25` checks only the original manifest's listed
   files. It excludes `release.json`, newly added files and its own output write
   after the final check. An unchanged copy of this verifier returned `PASS` and
   `sourceChanged:false` for a generated pack whose validation command changed
   manifest bytes and added a file. Separately, `run-check.mjs:13-17,23` returned
   exit 0 and `stableSources:true` after a generated test changed fixture versions
   of `src/adaptive-activation.mjs` and its policy: neither directory is sampled.
   Snapshot complete pack membership, manifest bytes and declared protected inputs
   before/after; keep output outside the pack. Include the protected paths in
   run-check, or explicitly narrow its claim and require a final protected-byte
   gate after execution. These are demonstrated false negatives, not claims that
   the current application code mutates files.

2. **P2: Bind every phase to the same approved candidate.**
   `delivery.mjs:30-42` recomputes the candidate separately in preinstall and after;
   after only requires installed release = then-current candidate. It never
   compares to `preinstall.json` or `integration.json`. `verify-relocated.mjs:7-17`
   likewise compares the pack's validator with the pack's own release ID, without
   an expected candidate/export identity. Thus these checks alone do not reject
   candidate A being tested and candidate B subsequently installed and checked.
   Pin the accepted release ID and reviewed file hashes once, pass that identity
   into relocation and delivery, and require equality across integration,
   preinstall, export/extraction and after receipts. If an outer orchestration
   already enforces this, retain its exact identity/equality receipt; that layer
   was outside this review. This finding is source inspection, not an installer
   reproduction.

3. **P2: Relocation on the same filesystem does not establish checkout independence.**
   `tests/executable-examples-portability.test.mjs:12-27` strips environment and
   relocates files but leaves the original filesystem accessible. All three
   portability tests passed with generated demos/tests importing an absolute
   `file:` helper outside the copied pack. `verify-relocated.mjs:13-20` has the
   same boundary. Preserve the useful minimal-environment check, but narrow its
   claim or add a replay where the source checkout and undeclared packages are
   inaccessible. Do not certify standalone independence from this replay alone.

4. **P2: Check digest contents, not just digest shape.**
   `tests/executable-examples-portability.test.mjs:32-36` accepts any 64 lowercase
   hex characters. Its manifest test passed with all twelve example digests set
   to zeros. Compute each referenced file's SHA256 and compare it to the declared
   value. Other validators may enforce integrity elsewhere; this test currently
   establishes entry presence/format only.

## Preservation and attribute scope

No backup-preservation defect was found in the inspected comparisons:
`delivery.mjs:35-46` checks preinstall native/runtime inventories, then installed
native equality, backup runtime equality and managed-skill backup equality.
The inventory includes file bytes, empty directories and link targets, and `wx`
receipt writes preserve prior records. This is inspection of assertions, not
validation of the installer, rollback execution, ACLs or metadata restoration.

`verify-integration.mjs:12-23` preserves old manifest entries except the two
allowed root documents, restricts new entries to `examples/`, and checks the
three protected hashes. These guarantees depend on `verifyProduct`; its canonical
sibling-checkout implementation is imported by absolute path but was not opened
or independently source-bound in this review. New example additions are not
themselves matched to author/acceptance hashes by this script; finding 2 covers
that remaining identity boundary.

The new `.gitattributes:28-29` rules cover only `product/examples/**` and
`artifacts/qualification/executable-examples-20261016/**`, recursively. Existing
skill bodies and the parent portability test retain `text=auto`. A read-only
`git hash-object --stdin --path=...` probe with `core.autocrlf=true` preserved raw
CRLF bytes for both new scopes and normalized an unrelated test path. Inherited
`eol=lf` does not override explicit `-text`. The scoped whitespace relaxations
affect diagnostics, not byte conversion. No attribute-scope defect found; the
rules do not by themselves prove archive/install identity.

## Reproduction and limits

Run `node reproduce.mjs` from this directory to generate a new, separate fixture
run; prior runs are retained. The observed run is
`fixture-T05BJy/results.json`, with the raw gate receipts and TAP output beside
it. Source transformations are recorded: none for verify-relocated, only root/op
constants for run-check, and only the product-root constant for portability.
OS temp paths were redirected inside the fixture directory. Generated lane
fixtures are not any author's implementation or independent acceptance tests.

The release-script-safety guidance informed effect inventory, immutable receipts,
source gates and identity checks. No delegation workflow was used. This review
requests correction or explicit narrowing of the above gates/claims; it does not
reject the current examples or certify an installation or skill superiority.
