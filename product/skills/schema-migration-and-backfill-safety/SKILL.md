---
name: schema-migration-and-backfill-safety
description: Plan and implement schema transitions and resumable data backfills with mixed-version compatibility, concurrent-write protection, validation and explicit recovery limits.
---

# Schema migration and backfill safety

Use when a schema change must coexist with active readers and writers, or a
data transformation needs bounded, recoverable execution. Work from the actual
database engine, application versions and data invariants. Ordinary query
tuning, schema sketching without a transition, backup administration and a
database engine upgrade alone do not require this method. Do not promise
uninterrupted service or reversible data conversion from a migration filename.

## Procedure

1. Inspect current schema, constraints, indexes, row volume, keys and all
   readers/writers, including jobs, imports and older deployed versions. Bind
   the target representation, invariant, database/driver versions, migration
   authority and acceptance conditions. Identify engine-specific locks,
   transactional DDL, rewrite costs and replication effects rather than
   importing another database's behavior.
2. Draw the compatibility sequence: additive expansion, compatible writers,
   backfill, validated read switch and eventual contraction. For each phase,
   state which application versions can read and write, the authoritative
   representation, synchronization mechanism and recovery route. Separate
   application reversion, uncommitted transaction rollback, forward repair and
   restore; a destructive reverse migration is not a recovery guarantee.
3. Define how live writes remain authoritative during backfill and afterward.
   Use an appropriate atomic transform, row lock, conditional version update,
   ordered change capture or bounded write pause. A null target predicate alone
   cannot prevent stale source data or keep later old-version writes synchronized.
   Define conflict retries, deletes, newly inserted rows and competing workers.
   Reconcile uncertain commits before repeating their effects.
4. Make execution resumable with stable key ranges, finite batch size and time,
   committed progress, transformation version and a conflict/error ledger.
   Couple progress with committed work, or make replay demonstrably safe.
   Bound retries and throttle against actual lock duration, latency, replication
   lag and resource limits. Preserve malformed rows for explicit resolution;
   advancing a cursor must not silently declare skipped work complete.
5. Implement the requested migration and backfill in the existing project.
   Test old/new reader and writer combinations, transformed values, nulls,
   duplicates, boundaries, interrupted batches, replay and concurrent updates.
   Verify schema metadata and engine behavior on the authorized test target.
   Reconcile counts, invariants, remaining eligible rows and transformation
   errors before switching reads. Keep fixture evidence distinct from a live run.
6. Contract only after dependent versions and delayed work no longer need the
   old representation, synchronization is caught up and the recovery window
   is understood. Validate constraints and switch behavior before removing
   fields or tables. Preserve required originals and recovery artifacts through
   the declared retention period. Identify any point after which a lossless
   inverse or application reversion is impossible.

Read [methods.md](references/methods.md) for concurrency protocols, restart
accounting and phase-specific recovery. On a failed invariant, lock limit or
unexplained divergence, stop affected batches and preserve progress, then repair
the cause within scope. If destructive contraction lacks its prerequisites,
complete the compatible phases and return the exact remaining gate; do not
recreate tables to manufacture recovery.

## Output and completion

Deliver the phase/compatibility map, migration artifacts, batch and conflict
records, validation results and recovery procedure with performed effects.
Finish at the requested phase only when its invariants and operational limits
are checked. Distinguish a tested local transition from production execution,
and preserve irreversible transitions and unfinished contraction explicitly.
