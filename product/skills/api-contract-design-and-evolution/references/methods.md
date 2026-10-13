# API contract method cards

Load only cards relevant to the affected operation. These are design and review methods; the illustrations below are original hypothetical examples, not upstream samples or executed service results.

## Directional compatibility and presence

Name versions `C0`/`C1` for old/new consumers and `P0`/`P1` for old/new providers. Define required combinations from the real deployment and rollback plan. Do not require an impossible version pairing merely to fill a table, or omit a pairing that rollout can actually create.

| Pair | Request question | Response and behavior question |
|---|---|---|
| C0 / P0 | What does the current consumer emit? | What does it actually accept and rely on? |
| C0 / P1 | Does the proposed provider accept those requests with the same meaning? | Can the current consumer interpret every reachable response and effect? |
| C1 / P0 | Does a new consumer still emit requests the old provider accepts? | Does it handle old responses and lack of new capabilities? |
| C1 / P1 | Does the new pair satisfy the intended contract? | Are the new transitions and failure outcomes observable as promised? |

For each required pair, distinguish schema acceptance from behavioral preservation. For requests, widening what the provider accepts can help old consumers but does not prove a new consumer works against an old provider. For responses, widening what the provider may emit can harm a consumer that only understands the old set. Extra fields, relaxed required fields, new enum values, and wider numeric ranges are conditional changes, not automatic passes. Inspect unknown-field handling, exhaustive branches, generated decoders, coercion, rounding, units, and defaults in the actual caller. A response's optional field is a provider permission to omit it; it is not proof that a consumer can tolerate its absence.

Original illustration: `C0` accepts only `queued` or `finished` for a job state. `P1` adds `paused`. The shape remains a string, but a C0 branch may fail. A C1 request using a new optional `priority` field can still fail against P0 if P0 rejects extras. A tolerant caller or explicit negotiation may solve either issue, but its behavior needs evidence.

Specify presence independently for each operation and direction:

| Input to an illustrative label update | Declared meaning | Distinguishing observation |
|---|---|---|
| Label field absent | Preserve the stored label | Other changed fields do not clear it |
| Label is null | Clear the label if allowed | Stored label becomes null |
| Label is an empty string | Store empty text or reject, as declared | Empty is not silently treated as absent |
| Label is a nonempty string | Replace the label | Stored value matches the accepted value |

This table defines one possible contract, not universal update semantics. Establish create versus replace versus partial-update defaults separately. Define response omission versus explicit null, whether defaults occur at creation or every read, and whether a legacy client preserves presence during serialization. Test false, zero, and empty collections when relevant. Do not let a serializer, convenience accessor, or request fingerprint collapse values the contract distinguishes.

## Errors, acknowledgement, and retry promises

Use the interface's documented protocol and machine-readable failure identities. Record the transport mapping, error payload, stable fields consumers may branch on, validation detail policy, correlation handle, and safe disclosure. Human-readable wording need not become a stable identifier; check real callers for accidental dependence before changing it. Respect the protocol's method semantics without assuming a method name proves this implementation honors them.

Connect each failure to effect state and caller action:

| Observation | Effect knowledge | Contract must tell the caller |
|---|---|---|
| Rejected before admission | No accepted effect under the declared boundary | What to correct or whether the same request can be attempted later |
| Accepted for later work | Pending; acceptance is not completion | How to observe operation identity and terminal state |
| Completion acknowledgement | The named effect completed at the stated durability boundary | What is durable and when subsequent reads can see it |
| Connection lost or reply malformed after dispatch | Effect may be absent, pending, or committed | How to reconcile or safely replay by the same operation identity |

Define which application failures are final, which can be attempted again, delay-hint units and meaning, retry budget ownership, and cancellation behavior. A client stopping its wait does not cancel accepted work. An overloaded response, timeout, or generic server error alone does not prove that a mutation is safe to repeat. Do not prescribe one status code for every failure; pair the chosen mapping with the documented behavior and actual consumer handling.

For an unknown result, use authoritative operation lookup or a documented replay guarantee. Preserve uncertainty when neither is available. Route backoff, hint parsing, jitter, deadlines, and client admission scheduling to `api-rate-limit-recovery`; this card defines the provider promises on which that recovery depends.

## Scoped replay, collisions, and concurrent ownership

An idempotency header without a storage and effect contract is insufficient. For a replayable mutation, decide:

1. **Scope and identity.** Define the namespace: tenant, authorized caller scope, operation and any version boundary. Decide whether aliases or versions refer to the same operation. Validate current authority before exposing a stored result; a key is not a credential.
2. **Request equivalence.** Bind the key to all effect-relevant inputs and preconditions. Define canonicalization, accepted defaults, absent/null, units, and which transport-only fields are excluded. A fingerprint must not discard meaning; if a digest is used, specify collision handling rather than assuming equal digests prove equal requests.
3. **Collision outcome.** Same scoped key with a different request is a visible conflict before a new effect. It must not overwrite the original request binding or silently replay an unrelated result. Reuse in a different documented namespace is a separate operation.
4. **Lifetime.** State when retention starts, its guaranteed duration, and what happens during execution and after expiry. Do not evict a live reservation merely because a timer elapsed. Decide which completed successes and failures are retained and whether replay returns the original outcome or a current status. A caller outside the guaranteed window needs reconciliation or a separate durable effect identity, not an assumption that replay is still safe.
5. **Concurrency.** Atomically establish one owner for equivalent same-key submissions. Other callers may wait, observe pending, or receive the recorded outcome under a documented policy. Lease expiry needs fencing or equivalent ownership proof so a stale worker cannot create a second effect. Specify bounded waits and the caller-visible state.
6. **Crash boundary.** Identify the point at which effect and replay record become durable. If both share a supported transaction, test that boundary. Otherwise define effect-owner deduplication and reconciliation for a crash between effect completion and result recording. Keep an unknown outcome visible; a local key table cannot promise exactly-once remote effects by itself.

Original illustration: two requests in tenant `birch` use key `k7` to create a seat hold for two seats. They must lead to one hold or one visible pending/unknown operation under the declared contract. A second payload asking for three seats with `k7` conflicts. Tenant `cedar` using its own `k7` cannot receive Birch's result. A replay after retention expiry is not entitled to the earlier guarantee. Check before-effect failure, effect-before-reply failure, record-before-reply failure, concurrent duplicates, changed payload, changed authority, and expiry. These checks need effect counts or authoritative state, not merely matching response bytes.

## Concurrent changes to the same resource

Different keys can represent distinct operations against the same resource. Choose a declared precondition token/revision, supported merge semantics, or intentional last-writer behavior according to the resource requirement. Bind a precondition atomically with the state transition; checking it before an unguarded later write does not prevent a lost update.

Original illustration: two editors read revision 17. One changes the label and commits revision 18. The other's revision-17 update must follow the stated conflict or merge rule rather than silently restoring the old label. Define conflict responses and whether a client may reread and reapply; do not automatically replay a stale replacement. Include create-if-absent, deletion races, and distinct-key duplicates only when the operation makes them relevant. API preconditions describe consumer-visible behavior; database isolation and workflow compensation remain implementation concerns of the engineering owner.

## Cursor position and traversal consistency

Choose pagination from the consumer's coverage need and expected collection changes. A bounded stable collection may work with offset/page pagination; a cursor does not alone make a mutable traversal complete. Specify ordering and tie-breaker, page-size limits, query/filter binding, continuation inclusivity, empty-page and end signals, token version, expiry, and resynchronization.

Declare whether pages share a snapshot/revision, follow an append-only order, or traverse a live changing view. For live views, explain possible omissions, duplicates, and reordering under insertion, deletion, or updates to a sort key. Deduplication removes repeated IDs but cannot recover unseen items. A count may refer to a different instant than a page; it needs its own consistency promise. Do not promise snapshot coverage when no mechanism preserves the snapshot.

Keep cursor representation separate from access control. Encoding hides nothing by itself; signing can protect integrity, and encryption can protect token contents, but neither establishes current permission to the referenced data. Bind position to the appropriate query and tenant and enforce the declared caller/resource authorization on every request. If a protocol deliberately uses a capability, its explicit grant, scope, expiry, and revocation rules are the authorization boundary, not its encoding. Avoid embedding sensitive state without the required protection.

Original illustration: a live list sorted by `(updatedAt, id)` returns item `m` on page one. An update moves unvisited item `n` behind the saved boundary. A perfectly decoded next cursor can now skip `n`. A stable ID tie-breaker solves equal-position ambiguity, not moving sort keys. Use a supported snapshot or another explicit reconciliation design if the caller requires full coverage.

Check tied sort values, insertion around the boundary, deletion, a moved sort key, changed filters, tenant mismatch, permission revocation, malformed/expired continuation, and the declared terminal signal. A reader's durable checkpoint and polling loop belong to the integration owner; this card defines what that reader may rely on.

## Evolution, deprecation, and evidence

For each affected contract row, record old behavior, proposed behavior, required version pairs, schema finding, behavioral finding, distinguishing example, evidence locator, decision, and unresolved input. Prefer a small reviewed matrix to an unweighted design score that conceals a breaking row.

Choose an evolution path based on deployment control and real consumer support. Options include a compatible extension, explicit feature negotiation, a versioned parallel contract, or coordinated migration. A version bump labels a boundary; it does not migrate a consumer. Specify provider-first versus consumer-first rollout, fallback when a capability is absent, mixed-version duration, rollback combinations, and how durable data written by the new version affects rollback. Prevent implicit downgrade from hiding a required behavior.

For deprecation, identify affected consumers, replacement behavior, communication and support owner, migration proof, removal criteria, and recovery path. Separate declared inventory, observed usage, direct consumer acknowledgement, and executed compatibility checks. A quiet observation window is weak evidence for offline, infrequent, or uninstrumented clients; preserve that coverage gap. Choose a justified window and owner-approved criterion rather than inventing a universal sunset period. Check old and new paths during overlap and require evidence that the replacement preserves the promised outcome before removal.

Return proposed versus executed checks separately. Schema validators can support a structural claim; consumer/provider fixtures can support their tested pair; live deployment and actual consumer migration need their own evidence. Missing evidence remains an explicit limit on the change decision.
