# Coverage and discovery refinement: October 3

Baseline: `68c7cd85833aa328c14df1eb889ee476a2ca1d22`, 74 portable entrypoints.
This record concerns a product candidate, not whole-quarry completion.

## Demonstrated gaps and bounded remedies

| Requested capability | Existing body-level coverage | Missing execution method | Candidate |
| --- | --- | --- | --- |
| Hire and evaluate a team | Prometheus prioritization/operations; Agora account/pipeline evidence | Role criteria, anchored assessments, independent candidate debrief and cohort-aware recruiting flow | `structured-hiring-evaluation` |
| Handle customer issues | Agora business-impact/escalation packet; Phoenix diagnosis; Daedalus code repair | Case triage, known-issue comparison, safe support work, truthful updates and separate resolution/confirmation states | `customer-support-triage-and-resolution` |
| Learn from users | Prometheus opportunity/test prioritization; Muse rendered and accessibility acceptance | Neutral interview/usability task design, participant boundaries, assistance-aware observation and findings-to-change synthesis | `user-research-and-usability-study` |

The audit inspected complete current Prometheus/Agora/Muse entrypoints and their
relevant references, not every historical quarry body. These are explicit gaps
within that compared scope, not a claim that no other project ever implemented
them. Adjacent owners remain useful for domain appraisal and implementation.

## Source review

Four complete entrypoint bodies were inspected as inert research in the existing
warehouse copy of `anthropics/knowledge-work-plugins`, revision
`5267cf7bff3031921d4474b8e8f86ad02d2b8f6d`:

| Source path | Exact body SHA-256 | Disposition in this product candidate |
| --- | --- | --- |
| `human-resources/skills/recruiting-pipeline/SKILL.md` | `2b8539f8af09e2c4239c103f6323f24f9a2c169ca2257cc1235857dae1acf676` | Flow/measurement concepts inform original hiring procedure; automatic ATS operations excluded |
| `customer-support/skills/ticket-triage/SKILL.md` | `87a04f698b25feaf20a0f922eacf270d195747ef12f1ca6352f9a0caa5e49363` | Original support synthesis; fixed SLAs, automatic bumps and unperformed-action templates rejected |
| `customer-support/skills/customer-escalation/SKILL.md` | `836571d8300892eaa78b4145d86995fa002703e4ad0d40e5ab4d9a7a759be4af` | Impact/attempt/handoff concepts inform original writing; fixed tiers/cadences and revenue-led technical severity excluded |
| `design/skills/user-research/SKILL.md` | `c72224f47474de011e8523550843ba2a5e5fd1e008c78456b2d166567fa3fac6` | Original study procedure; universal sample counts/schedules excluded |

Root Apache-2.0 notice observed, SHA-256
`1b1689d7864727a02a2682067f9c5328c891518db0a513663ef5a949052bd40b`.
No source prose or response templates were copied. Provenance remains in each
skill. This is not legal clearance or a terminal rights disposition for every
R10 occurrence. No acquired code was executed, no existing repository updated,
and no new external acquisition was needed for these gaps.

## Discovery mechanism

The failed negative-intent evaluations exposed a real caller problem: lexical
domain similarity was being used as a substitute for deciding whether the action
benefits from a skill. The existing optional CLI now takes a host-owned
`need` fact (`none`, `specialist`, `unknown`) in both `search` and `route`.

- None suppresses retrieval and holds the connected-specialist subroute.
- Specialist requests a shortlist to review, never automatic activation.
- Unknown retains browsing/candidate retrieval, explicitly `review-required`.
- Malformed need states fail; scores grant neither applicability nor authority.
- Omnibus performs action/benefit and exclusion checks before selecting a method.

This is a provider-neutral host boundary and portable selection procedure,
not a general semantic classifier, new vector service or claim of solving
arbitrary negation. Plain lexical queries can still retrieve irrelevant matches.

Six new caller tests failed before implementation, then passed. The expanded
145-test run found a genuine metadata regression: the new hiring summary's
incidental `job` term introduced a match for the existing non-task `days job`.
The summary/trigger now describe the specific role assessment instead. The
existing test was not weakened; a focused 50-test rerun passed. Independent
changed-tree review and fresh host-assisted task checks are separate gates.

## Release boundary

All three new methods and Omnibus edits are candidates until independent review
and parent verification. Structural validation or search ranking does not prove
better hiring, customer outcomes, human usability or agent performance. Product
publication and installation require current-main reconciliation, proportionate
tests, preserved activation hashes and a fresh exact rollback backup.

The fixed R10 baseline still has 49,514 open identity-obligation occurrences and
163 conflicts. New native quarry coordinator threads own disjoint source
partitions; no reviewed outcome is transferred among equal-body identities.
Their reservations, actual child admission and accepted source outputs are
separate private operational evidence, not product maturity by association.
