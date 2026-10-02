# Independent method-directory review v1

Verdict: **REPAIR — one narrow documentation scope mismatch.**

The method-directory implementation, byte bindings, selected Markdown navigation,
and two-axis status rows passed this bounded review. Finding MD1 concerns the
frozen README's archive-content statement, not a request to remove the intended
review evidence, alter the scorer, relabel DRAFT bodies, or expand a harness.

## Exact reviewed boundary

Worktree: C:/dev/eternities-godskills/.worktrees/product-sprint-20261002.
Canonical main: 55f960847fa2a06a750a1a6e20c4e7f95ea10449.
Observed combined release: dc0475ab124cebbec71d70f6080b2bff1a770e413fbfad78e011f8f9893cad8f, 68 skills and
205 payload files plus release.json.

All six supplied hashes match. They bind product/lib/method-directory.mjs,
product/lib/product.mjs, product/METHODS.v1.json, product/METHODS.v1.md,
product/README.md and tests/product-method-directory.test.mjs. The package
identity is observed context, not whole-product certification. Later combined
releases require their own relevant checks; this review approves no unseen bytes.

Full selected files were read. The actual product.mjs change adds optional
directory inspection/rendering to build/validate, protects the generated
METHODS.v1.md write like other manifest outputs, and verifies exact generated
Markdown. The search scorer is unchanged by source comparison and actual diff.
The legacy directory-absent route is exercised by existing synthetic product
checks without changing their catalog/release behavior.

## MD1 — README excludes artifacts that this package intentionally includes

Location: product/README.md:92–93.
Frozen README SHA-256:
1db4c4ec4e9fae4f72ed8d90ed70a0166ebfae71b4d12285d994a3acb45a3e76.

The guide says "No source warehouse or development artifacts enter the archive."
The retained release manifest instead deliberately declares these seven
historical development-review records:

- evidence/method-reviews/arcadia-v2/cue-plan-packets.md
- evidence/method-reviews/arcadia-v2/receipt.json
- evidence/method-reviews/arcadia-v2/review.md
- evidence/method-reviews/atlas-v3/evidence.json
- evidence/method-reviews/atlas-v3/receipt.json
- evidence/method-reviews/atlas-v3/review.md
- evidence/method-reviews/atlas-v3/routing-matrix.tsv

The receipt/report files were independently compared byte-for-byte with their
original sealed review copies. Report-relative supporting links resolve inside
the receiving pack. These are useful, intentionally bundled historical
artifacts, not an accidental dependency; they should stay. The directory itself
correctly explains their historical/publisher-evidence role. The older blanket
README exclusion is now misleading about delivered contents.

No export re-audit is needed to establish the mismatch: the manifest declares
these payloads, and the already reviewed exporter includes declared payloads.
This review does not assert a new ZIP run or a new authenticity/rights check.

Concrete repair: narrow the README sentence to distinguish the excluded source
warehouse/rest of the development checkout from the *included selected method
review records and bounded supporting data*. For example:

> The standalone pack includes selected historical method-review receipts,
> reports and supporting data as optional evidence. It does not include the
> source warehouse or the rest of the development checkout.

This is proposed wording, not self-applied or approval of changed bytes.
A new scoped receipt should bind the revised README and any regenerated package
identity. The existing six-file freeze and this v1 review remain immutable.
Estimated scope: one documentation edit, with byte/relevant-build verification;
no scorer, method, status, rights or historical-record change is required.

## What passed — G1/G2 support

The four-row selected directory is small and bounded. Two rows are independently
document-reviewed for exact scoped guidance; Oracle and Mnemosyne remain
not-assessed-by-this-overlay. All four outcome states remain
not-performance-qualified. The body DRAFT labels and 68 parent skill maturities
are not promoted. Actual row statements agree with the scoped original reports,
not runtime or human outcome claims.

The three real Markdown caller walks were performed in a product-only copy:

| Caller | Selective path after README -> METHODS.v1.md |
| --- | --- |
| Q1 gameplay states, audio cues, muted alternatives and priority interruption | Complete Arcadia SKILL.md -> game-state-to-audio-cue.md |
| Q2 game-state to audio-cue design | Same complete owner -> conditional cue method |
| Q3 exact artifact author/reviewer/approver/challenger | Complete Oracle SKILL.md -> methods.md#artifact-role-evidence-draft |

The complete owners and conditional references were read, not just summaries.
This is reviewer navigation by actual task, not a new automatic selector.
No review receipt needs to be loaded during routine selection.

Negative boundaries remain usable: supplied DSP-code analysis is not the cue
method; prospect scoring and schema-only checks are not the serving-time trace;
permission to read a report is not formal approval of that report. Source access
and reuse rights remain separately required. The Atlas serving trace still
excludes retrieved-passage reranking and scientific validation. Ordinary lookup
does not become Mnemosyne lifecycle work.

The reviewed rows' receipt/report bytes exactly equal the original copies.
Relative report links to cue packets, routing matrix and evidence resolve in the
portable pack. The typed path/hash pointers select the exact resource identity
inside the original receipt rather than treating an updated body hash alone as
transfer of the old review. Scope/independence/authenticity are publisher evidence
claims, not certified by the pointer parser.

## Independent refusal probes and bounded checks

Nine copied-fixture counterexamples refused as intended:

1. Changed method body with old row digest: Stale method resource.
2. Changed body plus updated row digest but original review retained:
   Stale method review binding.
3. METHODS.v1.json removed while generated Markdown remains:
   Method directory metadata missing.
4. Original report bytes tampered: Stale method review.
5. Owner SKILL.md substituted for an undeclared method resource:
   Invalid or undeclared method resource.
6. Outcome enum changed to performance-qualified:
   Unsupported Method outcome status.
7. Receipt pointer changed to a missing field: Missing Method review pointer.
8. Review attached to an unassessed legacy row:
   Unassessed Method cannot inherit a review.
9. Generated Markdown tampered, then its manifest hashes self-consistently
   updated: exact metadata/render equality still rejects it.

Refusals are actual first-party API calls on copies. No candidate source was
changed. Unsupported outcome enums are checked; arbitrary free-text execution
or scope assertions still need publisher review, not machine truth inference.

Commands/results:

- node artifacts/sprint-20261002/method-directory-review-v1/evidence-probe.mjs
  — exit 0.
- node --test tests/product-method-directory.test.mjs — 6 passed, 0 failed,
  0 skipped, exit 0; invoked once by the probe.
- node --test --test-name-pattern <nine selected product patterns>
  tests/universal-product.test.mjs — 9 passed, 0 failed, 0 skipped, exit 0.
  Exact pattern/command in evidence.json. Installer/rollback cases were not run.
- Product-only copied CLI validate with absolute Node and PATH="" — exit 0,
  exact observed combined release returned.
- Build/validate of the copy reproduces the same release ID and generated
  directory bytes. Legacy absence behavior is covered by selected existing
  fixture tests.
- git diff --check — exit 0.

No full suite, export replay, install or performance trial. The parent's reported
initial red and pointer-setup history were not replayed or counted as independent
red evidence.

## Limits and handoff

Same-host Windows execution, not fresh OS, native-loader UI or agent-quality
measurement. No publisher authenticity, reviewer-identity verification, source
rights, license clearance, source-obligation disposition or terminal-outcome
transfer is claimed. Historical reports remain optional data, not adopted policy
or receiving-machine path requirements.

All six frozen inputs and inspected evidence copies remain unchanged at seal.
No product edits, children, providers, acquisition, acquired-code execution,
commits, merge/push, install, R10 or frozen activation-path access. Curated
Architect/Omnibus guidance kept the binding chain and real selective caller paths
separate from unseen quality and authority claims. Parent owns the one README
repair, relevant exact-byte re-review and integration.
