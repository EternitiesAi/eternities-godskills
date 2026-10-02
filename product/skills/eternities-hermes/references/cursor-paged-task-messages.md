# Cursor-paged task messages (DRAFT)

Use this method to follow an authorized task's growing message history and
resume from the reader's durable checkpoint without downloading the full
history again. It applies to repeated, bounded application-level page requests
for a task feed. It does not parse byte chunks within a single open response;
use the incremental byte-to-record route for that transport case.

Use cursor paging only when the exact service and API version document the
feed's stability and continuation semantics. The selected view must be
append-only, or have a documented snapshot/revision and reconciliation
contract that accounts for edits, reordering, and late records. If ordering,
continuation, or recovery is undocumented, stay with the ordinary API-bridge
route and leave feed completeness unresolved. Do not guess whether a cursor is
an offset, sequence number, opaque token, inclusive mark, or snapshot version.

Before reading, bind the task identifier, endpoint and schema version, current
checkpoint, read authority, fixed page and byte limits, request timeout, poll
policy, overall deadline, and cancellation source. Checkpoint scope,
inclusivity, ordering, concurrent appends, expiry, and resynchronization must
come from the service contract. The cursor or continuation must be task-scoped
to that identifier and endpoint. An identifier or cached continuation is not
evidence of access authority. Confirm current caller authority for each read.
Feed-read authority does not automatically authorize local persistence. Confirm
local retention separately, minimize stored fields, and follow the caller's
access, retention, and deletion policy. Never transfer permission between
identities.

For each cycle:

1. Fetch one bounded page using the exact continuation value returned by the
   service. Reject pages that exceed the declared limits or do not match the
   task, schema, or documented feed contract.
2. Deduplicate by stable event ID. Sparse or nonconsecutive IDs do not imply a
   missing event unless the service explicitly promises consecutive numbering.
   Preserve the exact service-returned continuation; never derive or
   manufacture the next cursor from the largest event number.
3. Commit accepted messages and the returned checkpoint atomically as one
   unit. If storage cannot do that, use a replay-safe journal. After a crash
   before commit, replay must not lose a message; after an acknowledged or
   uncertain commit, replay must not expose it twice or advance past
   uncommitted data.
4. Treat an empty page or “caught up” response as idle only. It does not mean
   the task is terminal. Wait according to the poll policy, then resume from
   the durable checkpoint so later messages remain visible.
5. Read task status separately from feed state. If terminal status includes a
   final feed watermark, continue bounded reads until that watermark is
   reached before reporting `complete-and-drained`. Without a documented
   watermark or drain guarantee, preserve terminal task status and report feed
   completeness as `unknown` or `incomplete`.
6. Stop local polling on terminal-and-drained, caller stop, deadline, access
   revocation, or a named failure. A local stop changes observation only. It
   does not cancel the remote task. Remote cancellation is a separate API
   mutation requiring explicit target and effect authority; a cancellation
   request alone is not settlement.

Keep failures bounded and visible. On timeout or throttling, retain the last
committed checkpoint and retry only within the declared policy and documented
service guidance. On a malformed page, wrong task/schema binding, or
unexpected backward checkpoint, stop with a protocol error and do not advance.
If a checkpoint expires, use only a documented resynchronization path and
record its coverage boundary. If none exists, preserve the previous checkpoint
and report incomplete; do not jump to the newest position. For mutable feeds
without a revision or reconciliation contract, return to the ordinary
API-bridge route. Do not infer loss solely from a sequence gap.

Return a receipt that separates task state from feed completeness and records
the task/API binding, redacted start and end checkpoints, pages requested,
messages accepted, duplicates ignored, last observed task state, watermark
status, local stop reason, and any remote mutation (normally none). Report
local event-store writes separately from remote read effects. A fixture proves
only the declared cursor contract, not live service compatibility or complete
remote history.
