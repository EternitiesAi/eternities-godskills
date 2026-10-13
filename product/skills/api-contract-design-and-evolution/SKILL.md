---
name: api-contract-design-and-evolution
description: Design or review API contracts and changes across consumer/provider versions, presence and null semantics, errors, safe replay, concurrency, pagination consistency, and deprecation evidence.
---

# API contract design and evolution

Use when an interface must survive independently changing callers and providers, or when an apparently compatible change may alter observable behavior. Cover service APIs and public module interfaces in the protocol they actually use. A small interface change needs only its affected contract rows and distinguishing examples.

Ordinary implementation stays with `eternities-daedalus`; adapter execution and workflow coordination stay with `eternities-hermes`. Use `structured-output-contracts` for record validation and bounded output repair, and `api-rate-limit-recovery` for implementing a client's retry schedule. This specialist defines the promises those implementations must preserve.

## Bind the interface and its consumers

Identify the operation, current and proposed contracts, caller/provider versions, deployment order, real consumer behavior, and permitted effects. Ask which combinations must work during rollout and rollback. Separate documented promises, observed dependencies, assumptions, and missing evidence. Missing consumers or fixtures leave compatibility unresolved rather than safe by default.

Record accepted requests and emitted responses separately: types, absent versus null, defaults, unknown fields and variants, units, ordering, limits, authorization context, and state transitions. If a field is optional, establish what omission means instead of treating it as a synonym for null, false, zero, or an empty value.

## Evaluate shape and behavior separately

Build a change matrix for old consumer/new provider and new consumer/old provider; include the baseline and candidate pair as controls where applicable. Determine what the consumer can emit and accept, then what the provider can accept and emit. An extra response field may fail a strict decoder; a newly nullable response may fail a caller even when making the corresponding request nullable is acceptable. Version names and a passing schema diff do not establish behavioral compatibility.

Include effects, error classification, acknowledgement timing, replay guarantees, preconditions, visibility, and traversal consistency when they are affected. Use the conditional cards in [methods.md](references/methods.md) for the relevant boundary:

- Errors: separate rejection, known completion, pending work, and an unknown outcome; bind retry advice to the operation's effect state.
- Replay: define key scope, request equivalence, collision response, lifetime, concurrent ownership, result retention, and crash reconciliation.
- Concurrent writes: define the resource precondition or merge rule; deduplication of one operation does not prevent another operation from overwriting it.
- Lists: define ordering, continuation, mutation visibility, expiry, and recovery. Cursor encoding or signing does not establish access authorization.
- Evolution: connect rollout, fallback, deprecation, and removal to consumer evidence and an owner-approved exit condition.

## Deliver a contract that can be checked

Return the affected contract/change matrix with each row's version direction, request/response example, expected observable result, evidence, and unresolved dependency. Choose compatible extension, explicit negotiation/parallel support, migration, or a justified rejection of the change based on those rows. Preserve the interface's established conventions; do not impose a framework, one versioning scheme, naming recipe, or universal status-code table.

Provide the smallest checks that distinguish the proposal from the suspected failure. Use real consumer decoders and provider behavior where available, and include relevant timeout-after-effect, collision, concurrent-write, or mutable-page cases. Mark proposed checks, inspected fixtures, and executed results separately. Continue into implementation only within the task's authority. Finish when the requested contract or change decision is concrete, its evidence boundary is stated, and any required implementation has its own verified result.
