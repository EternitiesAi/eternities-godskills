# Conditional product distribution audit v1

Verdict: **READY — for the exact local prepublication distribution snapshot and the bounded checks below.** This does not authorize or prove external publication, installation, product adoption, performance, source rights, or whole-corpus completion.

## Frozen inputs

- Verification record: `docs/product-release-20261002-finalization.md`, 5,429 bytes, SHA-256 `0bf6c4239156fe9da9adaa3d913b3405e58d26efb108c003bb3017ed6718e97e`.
- Root README: `README.md`, SHA-256 `d22b327b92da686d2b273f60d8a1edfceed2f1363b8b4afd85ff41a042d7002c`.
- Candidate product: release `f6d71194e6897118f7ec7dac9bd2a9287479acb3345f347f291958091fd65cdc`, raw `product/release.json` SHA-256 `949de38dd46fe7f6e0e618ff3e5e4ddd1f92acc614acd0f7c0a9991a3d376efd`, 68 skills and 218 payload files.
- Designated archive: `artifacts/releases/godskills-product-20261002-f6d71194.zip`, 1,137,974 bytes, SHA-256 `bcd1d43c815f36e0fc62434dcca180f4b6fe1c2c877f49896508d0fce143a30d`. Its adjacent `.sha256` file contains the same digest and exact archive name.

## Distribution and documentation checks

The finalization record explicitly identifies itself as **before publication/installation**, separates those actions into later records, and states that the ZIP checksum is not publisher authentication. Its release identity/counts match the frozen product manifest. Its local Markdown targets (ZIP, sidecar, guide, index, selected methods, recipes and method verification record) all resolve. The new README paragraph's four links—to the ZIP, sidecar, selected method directory and verification record—also resolve. The “available” wording is accurate for this repository's relative artifact; I did not infer an external release from it or query a remote publication/install target.

I independently opened the ZIP, confirmed 219 unique safe member paths under `godskills/`, and compared the complete path set with the embedded manifest: exactly `godskills/release.json` plus its 218 declared payload paths, with no missing or extra member. I extracted it to the fresh task-owned folder `C:\Users\Dom\AppData\Local\Temp\codex-godskills-dist-audit-f6d71194-411dcb9c03d745a688d927884e191772`. The extracted tree has 219 files; embedded `godskills/release.json` is byte-bound to SHA-256 `949de38dd46fe7f6e0e618ff3e5e4ddd1f92acc614acd0f7c0a9991a3d376efd` and identifies release f6d711 / 68 skills / 218 payloads.

From that extracted copy I ran `godskills/bin/godskills.mjs validate` using absolute Node `C:\Program Files\nodejs\node.exe` v24.18.0 while `PATH` was empty. Exit 0 returned `verified-content`, the exact f6d711 release ID and 68 skills. The packaged validator checked the extracted payload inventory and file digests against the embedded manifest. This is a local package-integrity check, not an installation or fresh-machine qualification. The unique temp extraction is retained for inspection; it can be recreated from the exact ZIP.

The four packaged CLI/library files are byte-identical to pinned core main `84792f9e46b3b6511e7f3c5400dd840a4d658346`:

| File | SHA-256 |
| --- | --- |
| `bin/godskills.mjs` | `2bfd79da8efc81a5c4b65556e042bd89bcbd5b06d75d8e1020dbc9a8ebac5685` |
| `lib/archive.mjs` | `62cb7442554233a93aa7a149e3336830ef02cdfaf905d944e8f2241b07ce0ba3` |
| `lib/method-directory.mjs` | `22e1f0a6c16fcd04a3ff9029cabc3c7390381d3ac6bd89a45a395655f6a44180` |
| `lib/product.mjs` | `1e99a9e68317fa01121f81e363860cd28e17e5b19c7aedc8522d949e7025ad79` |

## Test and evidence attribution

The finalization record reports that 248 root test files were explicitly selected and produced 1,195 TAP tests (1,194 pass, zero fail, one Windows symbolic-link capability skip). I did **not** rerun that suite or independently reconstruct the 248-file enumeration. I parsed the existing TAP summary and confirmed the exact skip line. The working TAP file is 107,571 bytes, raw SHA-256 `28f3ec741ff91962f1046488bb0558090748774ed1e1d21708d94e07352e0487`.

The parent transport note is `artifacts/sprint-20261002/conditional-method-git-transport-v1.md` (SHA-256 `c28f8da9526b34b8ddb2a811683c4498ea80fe53d0ca45ce43949fd19862cfc0`). The exact `.gitattributes` exception is path-specific `-text` for `artifacts/sprint-20261002/conditional-method-full-suite-v1.tap`; `git check-attr` reports `text: unset`. I read the working TAP bytes and the actual staged index blob via `git show :<path>`: each is 107,571 bytes with the same raw SHA-256 above, and the byte buffers are identical. Index blob ID is `49a52fc08b4a46bb5de5f63ba4d4019442d8a284`. This verifies the transport correction without rerunning tests or changing acceptance criteria.

The finalization record distinguishes the selected 33-case regression and its manifest/CLI identity contract from the full repository run. The separate independent regression review `artifacts/sprint-20261002/conditional-method-regression-independent-review-v1/receipt.json` (SHA-256 `92dfdac2f901ea58f5fd28bdf38afc1e9fba9b94dc0ed4f2d4234a041870bf61`) records a 33/33 run against selected release f6d711; the author packet's earlier 33/33 v1-candidate run is not substituted for it. Both are regression evidence, not performance trials or proof of semantic routing.

The claims preserve DRAFT method labels, pending mathematical-domain review, abandoned-not-passed global top-1 evidence, 49,514 open R10 identity obligations and 163 conflicts. They do not claim publication/install completion, universal performance, source-truth or rights clearance, or whole-corpus completion. The documented 248-file enumeration and historical author evidence remain parent-authored inputs; this audit binds their stated summaries without claiming authorship or reproducing them.

## Scope and limits

Bounded actions were local reads/hashes, ZIP path preflight, one fresh extraction, and one packaged `validate` invocation. No export/rebuild, full-suite rerun, product/test/body edit, external publication, installation, provider, acquired-code execution, R10 disposition, merge or push occurred. The README and finalization record were audited as local files; remote publication status was not checked.
