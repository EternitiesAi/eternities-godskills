# C04 memory-method application

## Recovery explanation

D17 is the current owner-approved decision: cohort 20 and 48-hour reminders. It explicitly supersedes D12, which remains history only. Invitation dispatch is held for separate owner approval; the desktop keyboard result in T7 does not satisfy that gate, and no mobile check is recorded. S3's later file time comes from a scheduled copy and its unsupported D12 summary does not supersede D17. T7 reports EX9 was started and its acknowledgment timed out. R9 is an unrefreshed snapshot showing EX9 running with only a `.part` output and no final artifact or checksum, so present status is unknown. Do not retry or call it failed. N2 acknowledges receipt only; it has no digest or readback and proves neither the old note's content nor persistence.

The saved [checkpoint](checkpoint.md) preserves the approved settings, invitation gate, report/test distinction, stale and unknown records, operation identity, and safe next checks. If a new EX9 receipt conflicts with R9, append and verify it against the operation and output, preserve R9 as stale history, then revise dependent state. If a newer unreferenced summary repeats D12, retain it as unverified; only an authorized superseding owner decision changes the current setting.

## Checkpoint save and observed readback

Saved the 215-whitespace-delimited-word checkpoint to `artifacts/cognitive-workflows-20261003/memory-application-v2/checkpoint.md`, then read that file back locally. The readback returned the checkpoint content and SHA-256 `3b03196a0702585c1db6cbeaff90b2a579f62f2f517c036e8a67301bbb3a83c9`. This establishes that these scoped bytes were readable after this local save. The raw fixture's simulated H0 destination under `independent-evaluation/applications/<run-id>/C04/task-state.md` was not written: the task-level write boundary confines artifacts to `memory-application-v2`. This observation does not establish the old N2 record's persistence, cross-session recovery, or behavior of another host store.

## Method mechanisms used

- Scoped the record to C04 and used source IDs/dates to keep owner decisions separate from task reports, snapshots, and unreferenced summaries.
- Retained only current settings, invitation authority, accessibility evidence, EX9 identity/status, N2's persistence gap, and next checks; kept D12 as superseded history.
- Marked stale/unknown state rather than letting S3's modification time resolve authority or R9's old `running` status imply current completion/failure.
- Preserved the no-retry boundary for EX9, allowed independent local work, and recorded conditional rules for future conflicting evidence.

## Exact input and output hashes

| File | SHA-256 |
| --- | --- |
| `artifacts/cognitive-workflows-20261003/repairs-v2/memory-retention-and-recovery/SKILL.md` | `36c14c3b62bdf72c2b12bf4678ec44223bd0c3064528a7f1b34d7df4fcc966e7` |
| `artifacts/cognitive-workflows-20261003/repairs-v2/memory-retention-and-recovery/references/examples.md` | `e85739b8e8e517545d5862200f78e442dc23f59284f2e74751c7c39af8e5ece2` |
| `artifacts/cognitive-workflows-20261003/independent-evaluation/raw/C04-memory-retention-and-recovery.md` | `7bb272b49e98af768de83026b0f29e8da13d988e139b2bf03b54292d89106350` |
| `artifacts/cognitive-workflows-20261003/memory-application-v2/checkpoint.md` | `3b03196a0702585c1db6cbeaff90b2a579f62f2f517c036e8a67301bbb3a83c9` |
