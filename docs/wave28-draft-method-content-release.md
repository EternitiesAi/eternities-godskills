# Wave 28 draft-method content release

On 2026-09-27, product commit `8e1294eab98a84511f24289a1fdb8f719e198c7f` was fast-forwarded to and pushed as `main`. The portable 68-skill pack has release ID `61334aee865e67b815cce14dd6dd63078653282dfabac6342f1a31de163a0bfe`.

This release bundles three explicitly **DRAFT** methods inside existing skills:

| Existing owner | Added content | Boundary |
| --- | --- | --- |
| Oracle | Artifact-role evidence tied to the selected artifact/version, distinguishing formal approval from approval of access, a change request, or distribution. | No connector, private-source access, role attribution without evidence, or reuse right. |
| Logos | Supplied-document conversion-fidelity planning across content, structure, appearance, and accessibility. | No URL fetch, converter-success claim, or acceptance without lane-specific evidence and specialist review. |
| Mnemosyne | Evidence-preservation lifecycle that separates source access, snapshot identity, stale conflict, retention authority, and adoption. | Ordinary lookup is not preservation; hashes do not establish truth, currentness, or permission. |

The package guide now states that the catalog's `instruction-reviewed` maturity describes an established skill route; it does **not** accept an individual resource marked DRAFT. The 68 skill IDs, discovery triggers, anti-triggers, executable router, `authority: none`, and `activation: none` are unchanged. Ten parent-run natural-query probes returned the same result IDs, scores, and reasons as the prior release. In particular, this is a content-only improvement, **not** an automatic-selection improvement.

The initial independent changed-tree review found the maturity ambiguity and returned REPAIR (receipt SHA-256 `42c7a882ba1f4048affe2e604a26995cb21d52f57617507cedf072454760723e`). A red-then-green regression test and package-guide repair were followed by a versioned independent READY-to-merge review of the exact 14 changed files (receipt SHA-256 `d29ed286ccbee4e671613dd144774c746dab8a2b5f17469f380bb6f577dd3ba8`). That verdict is narrow: it certifies the reviewed DRAFT content boundary, not agent behavior, source rights, or corpus completion. The review packets remain in the local research worktree, outside the portable product.

The four focused content/maturity test files passed 16/16. The full repository suite on merged `main` passed 1,190 tests, failed zero, and skipped two. Product validation returned `verified-content` for the release ID above. The three protected activation file hashes remained unchanged.

Installation used a new rollback directory `C:/Users/Dom/.agents/godskills-backups/wave28-content-only-20260927`. The completed install receipt is SHA-256 `b8a250cd524abd6104ef78032972193943404a3d4665be6ddb11e491108d240c`. The installed runtime validates the new release; its 68 managed skill directories and 184 files match the release manifest. The backup validates the prior 68-skill release `50484f4c4af2b3fc7ea170082e19979cb2155f4cecd5ce551efa08ff66281f88`, with all 184 previous managed files and 193 previous runtime files matching the receipt. The 56 unrelated skill files matched the saved pre-install inventory before and after installation. No rollback was run. An interrupted install or rollback must be reconciled from its journal and backup, not blindly retried.

This product milestone did not execute acquired upstream code, clear identity-specific rights or access holds, apply an R10 disposition, or finish the acquired-source corpus. The last frozen R10 actual count remains 49,514 open identity obligations and 163 conflicts; concurrent Wave 27–29 research packets are separate, provisional work. Agents with cached catalogs may need a fresh task or reload to discover the installed bytes.
