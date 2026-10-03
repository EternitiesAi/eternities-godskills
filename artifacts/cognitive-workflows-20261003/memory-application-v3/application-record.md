# C04 memory-method application — v3 precision repair

## Recovery and decision record

This v3 record repairs the event sequence in the v2 application: T7 says the response timed out **after the writer acknowledged the job**. It does not say that the acknowledgement timed out. The corrected sequence is also in the saved v3 checkpoint below. Settings, uncertainty, authority, and no-retry judgments are retained; this is a source-precision repair, not a new fixture event or product-guidance change.

D17 remains the current owner-approved decision: cohort 20 and reminders at 48 hours. It explicitly supersedes D12, which remains history only. Invitation dispatch is held for separate owner approval; T7's desktop keyboard result does not satisfy that gate, and no mobile check is recorded. S3's later file time is from a scheduled copy, and its unsupported D12 summary does not supersede D17. T7 reports EX9 started; the writer acknowledged the job, then the response timed out. The unrefreshed R9 snapshot says EX9 was running with only a `.part` output and no final artifact or checksum, so current effect is unknown. Do not retry or call it failed. N2 acknowledges receipt only; without a digest or readback, the old note's contents and persistence are unknown.

## Scoped checkpoint save and observed readback

Saved and locally read back the new v3 checkpoint at `artifacts/cognitive-workflows-20261003/memory-application-v3/checkpoint.md` (the checkpoint note locator). The readback returned its content; its SHA-256 is `d132324f8d1de49d11d0a254e7bccd7926cb792c9f76683a3e2c6032917e0f91`. It contains 220 whitespace-delimited words. This demonstrates local readability of these scoped bytes after this v3 save only.

The simulated H0 fixture destination `independent-evaluation/applications/<run-id>/C04/task-state.md` was not written. This task permits writes only under `memory-application-v3`, so the actual checkpoint uses the narrower authorized path above. The save/readback does not establish N2's old-note persistence, cross-session recovery, or another host store's behavior.

## Version distinction and method mechanisms

`memory-application-v2/checkpoint.md` and `memory-application-v2/application-record.md` remain unchanged historical files, verified at the hashes below. Their earlier T7 wording was imprecise; this v3 record and checkpoint carry the corrected event order. V3 is the new checkpoint write and readback, not a claim that v2 was rewritten or that its prior persistence observation was repeated.

- Kept owner decision D17 distinct from T7 reports/tests, stale R9 status, N2's receipt-only response, and S3's unreferenced summary.
- Preserved the current invitation approval gate, superseded D12 history, EX9 identity, unknown current effect, and no-retry boundary.
- Kept independent local preview fixes and fixture exports separate from EX9; recorded how to handle a future contradictory EX9 receipt or a newer unreferenced D12 summary without promoting either to authority by timestamp alone.

## Exact source, history, and output hashes

| File | SHA-256 |
| --- | --- |
| `artifacts/cognitive-workflows-20261003/repairs-v2/memory-retention-and-recovery/SKILL.md` | `36c14c3b62bdf72c2b12bf4678ec44223bd0c3064528a7f1b34d7df4fcc966e7` |
| `artifacts/cognitive-workflows-20261003/repairs-v2/memory-retention-and-recovery/references/examples.md` | `e85739b8e8e517545d5862200f78e442dc23f59284f2e74751c7c39af8e5ece2` |
| `artifacts/cognitive-workflows-20261003/independent-evaluation/raw/C04-memory-retention-and-recovery.md` | `7bb272b49e98af768de83026b0f29e8da13d988e139b2bf03b54292d89106350` |
| `artifacts/cognitive-workflows-20261003/memory-application-v2/checkpoint.md` (retained history) | `3b03196a0702585c1db6cbeaff90b2a579f62f2f517c036e8a67301bbb3a83c9` |
| `artifacts/cognitive-workflows-20261003/memory-application-v2/application-record.md` (retained history) | `84b1b2d058c195585ed57ad302f876ca7bf4acbadbaea20288a457d474675b56` |
| `artifacts/cognitive-workflows-20261003/memory-application-v3/checkpoint.md` (new v3 note) | `d132324f8d1de49d11d0a254e7bccd7926cb792c9f76683a3e2c6032917e0f91` |
