# Transition, concurrency and recovery methods

## Compatibility is a matrix

List old and new applications against each schema phase, separating reads
from writes. Include workers, direct database clients, imports and delayed
messages. For a field split or rename, state which representation is authoritative
and how the other is derived. An additive column can still introduce a costly
rewrite or lock; establish this on the actual engine/version. Test constraints,
defaults, generated values, indexes and permissions, not only whether the
application starts. Choose a coordinated window when online compatibility is
unavailable rather than asserting zero downtime.

Switch writers before relying on new reads, or provide a verified synchronization
path for remaining old writers. Dual writes within one database should share
the appropriate atomic boundary. If effects span stores, specify ordering,
deduplication and reconciliation; do not imply a database transaction includes
both. Run shadow comparisons where practical, using a defined source version
or snapshot so legitimate concurrent change is not mistaken for divergence.

## Preserve live updates

Suppose a backfill reads a value at version 8, then a user changes the row to
version 9 before the derived value is written. An unconditional write can
publish stale data. A conditional update must compare the source version and
the relevant target state atomically. On conflict, reread and recompute or
record pending reconciliation under a bounded retry policy. Alternatively,
derive from the authoritative row inside a supported atomic statement or hold
the required lock while reading and writing. Check isolation and affected-row
semantics; application-level checks before a write do not provide atomicity.

This protocol protects one update, not all future updates. An old writer that
later changes only the old column can make the new column stale again. Keep
compatible writers, reliable change capture, reconciliation or a write pause
active until the read switch is safe. For change capture, bind the snapshot
to a known change position and handle duplicates, ordering, deletes and lag
without a gap. Preserve tombstones where required so retries cannot resurrect
deleted rows. A failed dual write or lost acknowledgement needs authoritative
state inspection, not blind replay. Multiple backfill workers need disjoint
ranges or a supported claim protocol and the same conflict rules.

## Restartable execution

Use stable key ordering and range checkpoints instead of offsets on changing
data. Declare an initial range boundary and how inserts outside or behind it
are handled; a high-water mark alone is not complete coverage. Track source
and transformation versions, last committed range, rows examined, changed,
already valid, conflicting, invalid and unresolved. Persist work and checkpoint
in one transaction when supported. Otherwise demonstrate safe overlap/replay
and inspect possible commit before advancing progress after interruption.

Bound a batch by rows and elapsed time, with short transactions and measured
throttling. Define retry limits and stop thresholds from the target's capacity.
Keep an explicit ledger for skipped locks, conflicts and invalid inputs, plus
a catch-up pass that revisits them. Cursor exhaustion does not establish
completion while that ledger or late-write population remains open. Test a
crash before commit, after commit before acknowledgement, and between work and
checkpoint storage. Replaying completed ranges must preserve newer writes and
avoid duplicate side effects.

## Validate and recover by phase

Verify counts under compatible snapshots, key uniqueness, referential integrity,
null policy, transformed semantics and old/new read agreement. Totals can
match while every value is wrong, so combine count reconciliation with invariant
checks and representative boundary values. Exercise malformed and lossy
transforms, concurrent deletes and writes, rollback to the still-supported
application and constraint validation. Keep production lock/lag observations
separate from an empty local fixture.

Before contraction, establish that old applications, jobs, cached queries and
delayed messages cannot access removed fields. Define the remaining reversion
window and retain originals when inverse conversion is lossy. A `down()` that
adds an empty column or drops a populated table does not restore data. A copied
table may lack constraints, indexes, triggers or privileges and omit writes
after its snapshot. A real restore procedure must address those objects and
post-snapshot writes within the recovery objective. Prefer compatible
application reversion or forward repair when it preserves authoritative data;
record destructive restore as a distinct effect with explicit prerequisites.
