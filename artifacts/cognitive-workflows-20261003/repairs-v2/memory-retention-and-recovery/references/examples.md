# Memory recovery examples

Read this reference when an interruption has made the saved state stale or when records disagree about approval or completion.

## Resume from a changed artifact and conflicting decision notes

An illustrative checkpoint from October 1 says: “Version 3 reviewed; send after approval,” and points to the version 3 digest. On October 3, the current artifact is version 4 with a different digest. One note says version 4 was approved; a later comment says “hold.” Neither includes an approval record, and the named decision owner is unavailable.

Recover the state this way:

- The version 3 review proves nothing about version 4; mark that review stale for the current artifact.
- Keep both dated decision claims with their sources. The later timestamp does not resolve the conflict, and the missing approval record is material.
- Do not send version 4 or report it as approved. Ask for the current decision record or a direct confirmation from the authorized owner.
- Continue unrelated local work if it does not depend on release approval. Record the verified version 4 pointer, the unresolved conflict, the uncertain send state, and the exact condition for resuming distribution.

If the owner or record cannot be reached, checkpoint the gap as unresolved. Do not make the stale “send after approval” instruction current by copying it forward.

## Correct a source-derived fact

A checkpoint says a decision was based on policy revision A. Retrieval finds revision B, which changed the relevant condition, while no record establishes when B took effect for this case. Mark the old conclusion as unsupported for current use, retain its source and as-of date for traceability, and seek the effective date or an authoritative case-specific answer. Do not silently rewrite the old note as though B had always been known.

## An available store does not guarantee a retained checkpoint

A task permits saving a compact handoff to its host store. After saving, the store returns a record locator and a reliable completion receipt; a readback resolves that locator to the intended scoped packet. Record verified retention and the locator. This shows persistence in that store, not that every later agent will find or trust it without checking scope and freshness.

If the store rejects the write, return the same compact packet with `not persisted` and the observed rejection; do not report that it survived the interruption. If the save times out after dispatch, mark `persistence unknown` and keep the operation locator. Check the authoritative store state before retrying where a second write could duplicate a record or effect. If that state is inaccessible, return the packet as an explicitly unverified handoff rather than choosing success or failure on assumption. No particular storage API is implied.
