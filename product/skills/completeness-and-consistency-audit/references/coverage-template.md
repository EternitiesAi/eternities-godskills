# Coverage template

Use for multiple obligations, conflicting artifacts, or a deliverable whose claimed coverage must be explained to another owner. Shrink the table for a narrow audit. Do not create a registry merely to correct a typo.

## Boundary record

- Outcome and intended user; scope authority and requirement revision.
- Artifact inventory with identity/revision and inspected ranges; unavailable or excluded surfaces and the basis for each exclusion.
- Audit-only or authorized repairs, write boundaries, owner, checks available, and finite effort limit.
- Disputed requirements, which decision owner can resolve them, and what can proceed independently.

## Obligation map

| ID | Origin and standing | Independently required detail | Acceptance signal | Actual locator/revision | Disposition and evidence limit | Repair/check/owner |
| --- | --- | --- | --- | --- | --- | --- |
| O1 | Request section; explicit | Observable result | Distinguishing check | File section or symbol | Met/missing/contradicted/unknown with reason | Smallest useful action |
| O2 | Interface clause; derived | Constraint needed for O1 | Boundary or consumer check | Producer and consumer | Preserve conflicting locators | Dependent surfaces and owner |
| P1 | Reviewer suggestion; proposed | Potential enhancement | Benefit to evaluate | Current relevant content | Optional; not counted as required | Decision needed only if scope expands |

`Met` requires the detail and agreement supported at the inspection's evidence level. For a specification-only review, it means the specification supplies the required detail; it does not mean implementation works. An implemented behavior without a runnable check may remain unknown for a requested runtime guarantee. Preserve separate content, agreement, and support findings when one status would hide this distinction.

Do not close a row because an artifact mentions the topic. Quote or paraphrase the decisive detail with a locator. If there is no source for a proposed requirement, mark its standing explicitly. Missing requirement authority is a scope question, not proof that the deliverable failed it.

## Dependency and conflict record

| Upstream obligation/detail | Transformation | Downstream artifact/owner | Meaning to preserve | Evidence and drift | Rows reopened by repair |
| --- | --- | --- | --- | --- | --- |
| O2 canonical field | Conversion/default | Consumer locator | Units/version/error meaning | Both sides at pinned revisions | O1, O2 and consumer checks |

For a contradiction retain the two exact values or behaviors, their sources, practical consequence, and the governing evidence needed to decide. If neither source governs, hold the contested conclusion. A newer timestamp may establish sequence but not correctness.

## Adversarial selection and close-out

Choose probes that could falsify an important claim in this scope: missing input, boundary value, incompatible version, partial delivery, or an uninspected dependent. Record expected observation, actual observation, and skipped checks with reasons. Avoid enumerating irrelevant failure classes.

For nonredundant detail, identify what decision or use each retained detail enables. Merge repeated warnings or explanations only when the references still make the required mechanism accessible to its actual reader.

Close with required rows by disposition, exclusions and proposals separately, repairs actually performed, remaining dependency owners, and the coverage boundary. A useful final statement is: "All six declared specification obligations have located, consistent content; two runtime guarantees remain unknown because only documents were inspected." It does not certify the whole system.
