# V3 portable package and qualified delta

**READY for the scoped package/CLI delta.** This verdict covers the pinned v3 ZIP, consistency with frozen source and release metadata, exact comparison with the preserved v2 extraction, and nine retained CLI checks. Newton's discovery-code review, general applicability, installation and deployment are outside this verdict.

Candidate: `0ef769c45ed059f1db7a8117e8447acc40fe907d`. Archive: `C:/Users/Dom/.codex/operations/godskills-motion-video-20261013/candidate-v3.zip`; SHA-256 `59b0789f9368de925de9a2575b94580f9b6a349dc408128d74dbfbd413095fd7`. Release ID: `87654db51a9f9fd6419c8d0105ab768682e1e7516c7737059cf7880b6c91fa0a`. The separate `release.json` SHA-256 is `33b19f134d75c5382dd576bf8623e74579c4b3ecf061ce51b5041fe03a1518f7`.

The ZIP has 290 regular files and 87 skills under one `godskills/` root. Windows member/path/link safety passed. All ZIP members match source bytes and the release's exact membership/digests. Normal `Expand-Archive` 1.2.6 extraction into the new owned root preserved all 290 files. The independently recalculated release ID matches.

Compared with the exact v2 extraction, **287/290 files are unchanged**. Only these files changed:

| Product path | V2 bytes | V3 bytes |
| --- | ---: | ---: |
| DISCOVERY.md | 7,149 | 7,372 |
| lib/discovery.mjs | 12,958 | 13,385 |
| release.json | 36,317 | 36,317 |

The release manifest changes only the two declared payload digests. All skill payloads are unchanged. V2 extraction bytes, original helpers, reports and other audit evidence still match their pinned receipts, both before and after v3 CLI execution. Exact old/new file hashes are retained in `04-v2-v3-qualified-delta.json`.

**Nine checks passed, zero failed** with existing Node.js v24.18.0 from the empty, unrelated sibling `blank-cwd`. The first five queries/flags exactly match v2: validate, motion search, video search, game-audio search and explicit no-need abstention. Validation returns verified-content, the new release ID and 87 skills; the three positive specialist smokes rank the expected specialist first, and no-need returns no candidates.

Four additional **revealed controls, not holdouts**, also passed. The audio-only request and live interactive scene request do not return the deterministic-video candidate in their maximum-20-result searches. Both plural `videos` and `films` production requests rank that candidate first. Exact wording, argv, cwd, stdout/stderr, output hashes and assertions are in `05-portable-cli-checks.json`. All nine processes exit 0 with empty stderr, and all 46 returned entrypoint digests were checked against extracted bytes.

Post-execution checks confirm source HEAD remains pinned and clean, source/extracted bytes remain frozen, and the working directory stays empty. No full suite, broad challenge iteration, upstream source execution, install, publication, network/provider calls, descendants, native/global edits or consumer-output grading occurred. No installed-deployment check or fresh Windows installation was performed; selected controls do not establish general applicability or whole-product readiness.

One **resolved audit capture failure** is retained. The first inspection used an earlier helper draft with expanded output, causing tool truncation despite process exit 0. Its script and returned output remain in `inspect-package.ps1` and `00-inspection-capture-failure.json`. A separately named compact copy of the actual tested v2 helper produced the complete receipt. No failed evidence was overwritten, and no product repair was performed.
