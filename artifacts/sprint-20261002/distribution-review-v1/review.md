# Independent distribution review v1

Verdict: **REPAIR** for the exact frozen parent-authored delta. Normal export, reproducibility, independent extraction, documentation and the exercised refusal boundaries pass. One controlled source interleaving produces an invalid standalone pack while export reports success. This blocks package/export approval until repaired.

This is a non-author review of package/export/documentation scope only. It does not approve the 68 individual methods, source rights, licensing, publisher authenticity, whole-corpus completion, integration, publication or installation. Arcadia v1 remains separately sealed; Arcadia v2, Atlas, Math and Hermes were not reviewed.

## Exact inputs

Worktree: `C:/dev/eternities-godskills/.worktrees/product-sprint-20261002`; canonical main/HEAD `55f960847fa2a06a750a1a6e20c4e7f95ea10449`.

Candidate package identity: `570aa62fb01e04047e44d62b9c061afce276461db17b20f7813672b1b0d31e36`; 68 skills, 21 primary categories, 193 release-bound files plus `release.json`. The catalog and skill bodies retain the canonical main bytes. The package delta comprises the new archive library, CLI export branch, portable README and CORPUS-SCOPE changes, and regenerated manifest. Root README and tests are outside the exported pack. Dirty parent ownership was inspected and preserved. All eight inspected input hashes remained unchanged through the completed probe.

| File | SHA-256 |
|---|---|
| `product/lib/archive.mjs` | `7e827b3162724bb3415a571286543d607281f82d65d9136e65a3757848e4191e` |
| `product/bin/godskills.mjs` | `2bfd79da8efc81a5c4b65556e042bd89bcbd5b06d75d8e1020dbc9a8ebac5685` |
| `tests/product-archive.test.mjs` | `9e9e9446c61ab358f10d6bb226d9805fe0d9724e39c71bcc4cd53ee8b21c0793` |
| `README.md` | `ca2fcb97e4ea44864b11a92b7c22910a49bdfb93c72ce30d43976e71b78a69d3` |
| `product/README.md` | `f2d578abc821c253042fb40118b3d04029ef7bea6d4905f5d4898a2851d77b7a` |
| `product/CORPUS-SCOPE.md` | `f67fd28074a6fbcb90b9d773db67845a37a58eacfabeba694b187f3433425f32` |
| `product/release.json` | `c718d3395daa67710bf0d40251c3cdb09c331dbeeaddf77245670d45e27ab34d` |

The unchanged `product/lib/product.mjs` is also bound in the receipt at `50bab545b02d947e27f9ddf3db38e7910d5b0bf341de0c0a15bf63c6d61a39af`. User instructions, the previously inspected worktree/ancestor instructions, curated semantic implementation diff guidance, and release script safety guided this bounded review. No Keel or unrelated history intake was needed.

## Blocking finding D1: archive manifest bytes are not the validated snapshot

Location: `product/lib/archive.mjs:64-71`, especially line 67.

The exporter verifies the source pack, then rereads each archive entry. Declared files are checked against the validated digest map, but `release.json` is explicitly exempt. Final source verification compares only the release ID, which excludes the manifest's own bytes. Neither check validates the particular manifest bytes already captured for the ZIP.

Concrete observed counterexample, entirely inside a copied fixture: at the direct archive read of `release.json`, change `skillCount` from 68 to 0, read those bytes into the archive, and restore the original source manifest immediately afterward. Both real source validations see the valid original package. Export returns `status: exported`, skillCount 68 and the candidate release ID. The resulting ZIP contains `release.json` with skillCount 0.

Independent PowerShell `Expand-Archive` extraction succeeds; the extracted CLI then exits 1 with:

```text
{"error":"Catalog count mismatch"}
```

The source fixture is restored and validates, and the returned archive digest correctly matches the broken ZIP bytes. Thus the receipt is internally honest about the ZIP digest but incorrectly signals a verified usable export.

Broken ZIP: [manifest-interleave.zip](run-TDvIx3/manifest-interleave.zip), 851,841 bytes; SHA-256 `2a70be0edfaa03411fd5e85462bc8008415374dac5567b8a3339c91fe8c43215`. It is a deliberately invalid test artifact, not a distributable pack.

The same controlled interleaving on `README.md` is correctly refused with `Source changed during export`, before an output archive appears. This contrast isolates the manifest exemption. The probe temporarily intercepts the built-in filesystem read to choose the interleaving and performs actual writes/restoration in copied packs; reviewed product files are never changed. This is a deterministic integrity counterexample, not a naturally timed race, external attack, or general concurrency guarantee.

**Required repair:** bind the exact manifest captured for export to the validated snapshot, including schema, count, file map and release identity; or validate the complete assembled in-memory pack snapshot before creating the archive. Comparing release IDs alone is insufficient. Preserve the exact-pack promise when deciding whether to capture original manifest bytes or serialize a validated object. Add one bounded regression for this counterexample. No new runtime, provider or distribution service is needed.

## Verification and refusal results

Executed from the sprint worktree:

```text
node --test tests/product-archive.test.mjs
node artifacts/sprint-20261002/distribution-review-v1/evidence-probe.mjs <observed-current-PowerShell-executable>
```

The receipt/evidence records the exact executable path and arguments. The five author tests passed, with zero failures/skips; no full suite was run.

Two normal exports from differently located product-only copies were byte-identical: 851,842 bytes; SHA-256 `d30db275add02ab8dd15c585858e61414a935a34ad30429f1d4c658aab042356`. [normal-a.zip](run-TDvIx3/normal-a.zip) and [normal-b.zip](run-TDvIx3/normal-b.zip) contain the same 194 pack entries. Independent `Expand-Archive` extraction followed by validation returned verified-content, the exact candidate release ID and 68 skills. CLI export and validation used an empty PATH with only Windows SystemRoot retained. No dependencies were installed.

Twelve independent refusal probes exited 1 as expected: existing archive; relative destination; source-contained destination; source-contained `..archive.zip`; missing parent directory; missing output option; duplicate option; unknown option; parent that is a file; junction output ancestor; changed declared content; undeclared source file. Existing archive/sentinel bytes were preserved, and no archive appeared for the tampered/undeclared/source-contained cases. The separate declared-file interleaving was also refused.

Leaf file-symlink creation returned EPERM under this Windows token, so that particular leaf-refusal scenario remains unobserved; junction-ancestor refusal was exercised. The first probe stopped at that setup issue, and a second used legacy Windows PowerShell whose Archive module could not load. Partial fixtures remain recoverably in this review folder. The completed run uses the observed current PowerShell host in a fresh run directory; no product bytes, privilege settings, or existing fixture files were overwritten to resolve those environment issues.

## Documentation and frozen accounting

The root README's 68-skill / 21-domain statement agrees with the verified catalog. New-machine onboarding points to the actual product-only export, extraction, local validation and optional installation workflow. The portable guide clearly preserves Markdown-only use, no installation/activation from export, non-overwrite and outside-pack requirements, and trusted-channel digest handling. Hash consistency is explicitly distinguished from publisher authenticity; existing provenance guidance does not waive upstream obligations.

Only the three small frozen R10 metadata documents were inspected, without applying dispositions or reading ledger/source payloads:

- Summary SHA-256 `75dab55310dddae3a0cd4d7f70ff2044aba632185c56f365aed2ffe4c5fd800d`.
- Manifest SHA-256 `419b6a770cec296e26c6a0d4d1a59ed70297d1258cee92f264157cd556e01026`.
- Parent receipt SHA-256 `308495ac6e78bb94bf1206e8affe9cca915ca80780f43202d6096c873762d9d2`.

All new CORPUS-SCOPE counts match: 49,974 rows; 37,529 identities; 20,737 valid declared-body groups; 51,006 obligations; 49,514 outstanding obligations; 163 conflicting identities; 588 reviewed bodies; 746 reviewed source-body identities. These remain frozen historical metadata accounting, not fresh source-body review or clean-machine reconstruction. The new text preserves equal-body rights/provenance/outcome boundaries and does not subtract provisional later packets. No documentation repair is required in this delta.

## Limits and handoff

Evidence covers this Node 24.18.0 Windows host, first-party CLI/library execution, real local ZIP extraction and the specified deterministic interleavings. Linux/macOS, fresh OS installation, Node-free agent use, disk-full/interrupted writes and concurrent destination-parent replacement were not exercised. These are limits, not observed additional defects.

All new review files, archives and fixtures are confined to `artifacts/sprint-20261002/distribution-review-v1/`. No product edits, commits, children agents, providers, web acquisition, acquired code, installation, merge/push, frozen activation-file access, R10 disposition application or other-project changes occurred. Parent owns D1 repair and any later integration. Keep this v1 and the separate Arcadia v1 sealed; repaired export bytes require a new versioned review.
