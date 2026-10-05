# Cohort B narrow repair re-review v2

Outcome: READY_INSTRUCTION. B-01 is closed; no active issues were found in the changed reference.

## Exact binding and scope

The procedural methods reference was read in full. Its current SHA256 is `0c177b8ff767044ed412992becb1c78e908efb28b33d2ca7d45a759858381725`, replacing v1 `154500d31d2ec20361ba1ee919572a952a87499c65b131721656ef81e1787187`. Removing only the single added paragraph reproduces the prior body hash exactly. The other 19 reviewed input files, including counterpart entrypoints, metadata, methods and declared owner methods, match the v1 seal byte-for-byte. The 20 current path/hash bindings are in review-b-v2.json.

Preserved prior review: review-b-v1.json, SHA256 `44e6babf155c10faea1e03c79d7cf48b1ffc8ec60f7c924dfc51cd67837fe072`. Its Markdown and all four original consuming applications remain immutable; their receipt hashes are also bound in the JSON.

## Independent judgment

The paragraph fixes the specific omission: positive-width floor decomposition keeps local coordinates in [0,L), whereas truncation toward zero assigns negative positions incorrectly. Requiring agreement among generation, collision, navigation and saves makes this a system invariant rather than a cosmetic seam patch. Checks on each side of zero and positive/negative chunk boundaries, inverse round trips, corners and reversed neighbor ordering are concrete and relevant.

For example, with integer width 16, world -1 decomposes into chunk -1/local 15, and -17 into chunk -2/local 15. The inverse reconstructs each position. These are arithmetic illustrations, not executed engine tests. The instruction permits other internally consistent conventions and does not promise universal floating-point byte identity.

The existing reproducibility, canonical edge ownership, state-aware key/door solvability, bounded retries, explicit inconclusive outcomes, persistence overlays and diversity tradeoffs are untouched. This remains specialist mechanism-level depth beyond Arcadia's broader world-direction remit. All other cohort B findings carry forward from the exactly verified v1 inputs rather than receiving a redundant broad review.

## Provenance and consuming evidence

The frozen manifest hash still matches v1: `0c4bf7164443cbc6e97bc4b09178369ca82e07338a19b32d91562654d183114b`. All reviewed product provenance metadata is unchanged. The seven frozen-source binding checks remain the independently recorded v1 evidence; this addendum does not claim fresh source-body reads or new legal clearance. The paragraph introduces no source identity or acquired execution.

consumer-b-procedural-v2.json contains only the existing procedural request (SHA256 `47ae4d132340a20c17a4d3422e8ed8d2057757715d3bf1401804fb10d771c0f2`) and a fresh 509-word application bound to the current method. The other three outputs remain original consumer-b-v1.json evidence. The earlier accidental exposure to acceptance fields remains disclosed; this pass projected the request only and performed no acceptance self-grading.

## Limits

This is instruction review and non-blinded text application, not live engine validation, demonstrated play quality or comparative superiority. No product bytes, tests, helpers, harnesses, shared build/catalog, source acquisitions, providers, descendants, commits or installs were changed. R10 is unchanged; source obligations are not terminal outcomes. Parent owns integration and release. The handoff includes a final exact-hash check of the bound inputs and preserved v1 receipts.
