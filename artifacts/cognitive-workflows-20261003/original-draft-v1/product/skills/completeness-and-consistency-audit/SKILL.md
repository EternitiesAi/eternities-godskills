---
name: completeness-and-consistency-audit
description: Audit a declared deliverable for missing obligations, conflicting details and broken dependencies across its artifacts; use when coverage needs evidence, beyond an ordinary typo or style edit.
---

# Completeness and consistency audit

Produce an inspectable answer to which promised results are delivered, which disagree, and what useful repair remains. Audit the declared scope; neither document length nor a clean checklist establishes completeness.

## Bind the audit

Identify the intended user, outcome, authoritative requirements, artifact set and revisions, excluded surfaces, available checks, and a finite time or effort budget. Distinguish audit-only authority from permission to repair. If the request is a small correction with no disputed coverage, make that correction directly.

Start with the request and governing contracts, then inspect the deliverable's claims for additional commitments. Split compound obligations only where their parts can fail independently. Mark each obligation as explicit, derived from a named contract, or proposed; do not silently promote a plausible improvement into an acceptance requirement. Conflicting requirements retain both sources until the responsible owner resolves them. Missing sources or unspecified scope limit the conclusion rather than inviting an exhaustive search.

## Trace and challenge

1. Give each obligation an ID, required detail, origin locator, and acceptance signal. For coupled artifacts, identify the producer, transformation, consumer, and shared meaning that must agree. Use [the coverage template](references/coverage-template.md) when several obligations or dependencies need tracking.
2. Follow each ID to actual content: path and section, symbol, cell, timestamp, or another retrievable locator at the inspected revision. Inspect the relevant content; a filename, heading, mention, citation count, or test name is only a lead. Record required details separately when one can be present while another is missing.
3. Keep three judgments distinct: whether the required content exists, whether it agrees with the contract and other artifacts, and whether the available evidence supports its claim. Assign `met`, `missing`, `contradicted`, or `unknown`; an uninspected artifact is unknown. An exclusion needs its scope basis and is not a satisfied obligation. A proposal can remain optional without blocking acceptance.
4. Probe the highest-consequence failure seams. Try an absent or boundary input, a counterexample to a broad claim, an old consumer, or a partial failure as appropriate. Follow shared defaults, units, names, ordering, permissions, and versions across dependencies. If execution is unavailable, record the inspection and unperformed check; do not report observed behavior.
5. Challenge the inventory itself: is there an explicit requirement without a row, a dependent artifact outside the inspected set, or an unsupported claim introduced by the deliverable? For important details, ask whether removing them changes a decision, reproduction, interpretation, or downstream use. Merge redundant explanations; retain distinct mechanisms and caveats. Added prose that changes none of these does not repair a gap.

## Repair and close

Rank gaps by their effect on the promised outcome. For each actionable gap name the smallest coherent repair, affected dependents, owner, and a check that could detect the defect. Resolve conflicts against authoritative evidence, not whichever artifact is longer or newer. If repairs are authorized, make them and reopen affected rows; rerun changed obligations and their dependencies. Otherwise deliver the repair proposal.

Stop when the declared inventory has a supported disposition and material dependencies agree, or when a named access, decision, evidence, or budget boundary prevents further coverage. Repeat only for changed evidence or an unresolved meaningful seam. Never pursue literal perfection or add a universal minimum output length.

Return scope and inspected revisions, the obligation map, consequential gaps and repairs, observed checks, and remaining unknown or uninspected coverage. If counts help, count declared obligations by disposition and state exclusions; the denominator is the bounded inventory, not all possible requirements. The conclusion can be complete within scope, incomplete, or unresolved, with the evidence limit attached.

For concrete tracing and repair examples, read [worked audits](references/worked-audits.md). Related architecture, delivery, and diagnosis methods are optional companions; this procedure works without loading them.
