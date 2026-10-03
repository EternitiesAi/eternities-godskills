# Configuration lifecycle across durable objects

Use this conditional engineering method when changing a default, override,
configuration declaration, or resolver could affect existing durable objects.
It is not needed for a standalone constant with no persisted consumers. Daedalus
owns implementation and migration; Architect owns wider identity and contract
consequences. A completed analysis does not authorize a live change.

## Inspect separate dimensions

For each consequential setting, trace the declaration, creation/update writer,
stored representation, resolver, and actual consumer. Record exact revisions and
locators. Do not make snapshot, override, inheritance, and fallback a mutually
exclusive enum: a creation snapshot can be stored as an apparent override, while
an inherited value can itself depend on a legacy fallback.

- **Origin and materialization:** explicit operator choice, creation-time copy,
  derived literal, migration, or unknown. Equal stored values do not reveal origin.
- **Representation:** concrete value, omitted field, null, empty string, false,
  deletion, or another sentinel. Determine each meaning from the real reader and
  validation path rather than truthiness.
- **Resolution:** precedence, context-dependent defaults, fallback branches, and
  transformations. Trace the effective value, not only the accepted input.
- **Evaluation lifetime:** creation, update, process start, cached lookup, each
  request, or another observed boundary. “Inherited” does not prove an immediate
  live change; inspect caching, restart, and refresh behavior.
- **Consumer and capability:** which behavior receives the value, and whether the
  selected adapter or environment can implement it. A parseable but ineffective
  option is not working configuration.
- **Identity and access effects:** routing, membership, privilege, session keys,
  history ownership, and delivery targets affected by a transition. Distinguish
  retained storage from reachable history and unchanged access.

## Compare existing and future objects

Build a small resolution table for an existing concrete value, an existing
inheritance sentinel, and a newly created object. Show the default before/after,
stored value before/after, evaluation boundary, effective result, and evidence.
Include missing, null, empty, explicit false, and deleted overrides only where
those representations exist. Preserve ambiguity instead of assigning an origin
that cannot be observed.

Determine whether the proposal changes future creations, existing objects at
their next resolution, objects only after refresh/restart, or a mixture. Trace
identity-bearing effects separately from the value calculation. For derived
names or patterns, locate materialized copies and compare a rename or re-key;
do not assume the original template remains linked.

## Plan and perform only authorized changes

Do not bulk-rewrite a concrete value whose origin could be an intentional
override. First recover the write/audit evidence or construct a bounded migration
that preserves that distinction. When identity keys change, specify collision,
split/merge, retained-history lookup, access, replay, and reversal behavior before
changing live state. Unknown history or authorization consequences hold that
transition, not independent read-only investigation.

For an authorized change, preserve the exact prior state and a recovery path.
Test an old concrete value, an inherited old object, a future creation, and an
unsupported or invalid combination. Exercise any relevant cache/restart boundary,
rename, identity collision, and prior-history read. Verify both stored values and
the resolved consumer behavior; a successful config write proves neither.

## Deliverable

Return the per-setting evidence table, old/new-object results, refresh conditions,
capability limits, identity/history/access consequences, authorized mutation and
rollback status, and the smallest remaining observation for each unknown. Separate
proposed, written, resolved, exercised, and recovered states. Keep source-specific
commands, fixed paths, named services, and blanket defaults out of the method.
