# Prospective comparison design

Status: original instruction-reviewed conditional procedure for the existing Athena study-design route. This is not an experiment launcher, sample-size calculator, analysis result or professional approval.

## Use and boundary

Use when a consequential comparison needs its assignment, measurement and decision rules agreed before outcomes are examined: for example, a product variant, a teaching method or an operational change. A/B is one possible design, not a requirement. Use Athena claim appraisal for interpreting completed evidence; use `diagnostic-statistical-model-inference` when actual model analysis, diagnostics or uncertainty evaluation is needed. Use qualitative research when the question is how or why people behave and a measured treatment contrast would not answer it. A low-volume or high-risk setting may require a different design rather than a long, underpowered experiment.

This method produces a reviewable local design packet. Starting a live experiment, altering service behavior, recruiting people, collecting personal data or using a paid service requires its own authority and operational owner. App-store experiments remain a listing-specific implementation route; this general design contract does not assume that platform's controls or attribution.

## Bind the decision, unit and effect

Write the actual decision and who owns it. State the target population, intervention and comparator, outcome definition, observation horizon and contrast the decision needs. Identify the assignment unit, observation unit and analysis unit separately. Repeated visits are not automatically independent people; assigning by person and analyzing page views without an appropriate dependence model can answer a different question. Record possible cross-variant exposure, spillover, account sharing or clustered assignment. Resolve these or narrow the interpretation before claiming a causal effect.

Describe what each variant changes and what is held comparable. A bundled intervention can estimate the bundle's effect but cannot isolate each component. Multiple variants or factors require a comparison and interaction plan rather than a universal one-variable rule. Preserve version, rollout and assignment records so the implemented contrast can be checked against the planned one.

Choose a primary outcome because it represents the decision, not because it looks favorable after inspection. Define its unit, denominator, eligibility, event window, repeated-event handling and calculation. Distinguish assignment, actual exposure and measured outcome. Missing instrumentation, cross-variant exposure and nonparticipation cannot silently become successful zeros or be excluded because that improves results.

## Make the precision and feasibility plan explicit

Record the smallest decision-relevant effect and the baseline estimate or range supporting the design. A baseline from another population or period is an assumption, with its transfer limits visible. Choose an uncertainty/error framework and a precision, power or other justified decision criterion appropriate to the estimand, dependence, costs and consequences. Do not impose universal confidence, power or duration defaults.

To calculate sample requirements, identify the supported statistical model, assumptions, allocation ratio, outcome type, planned comparison count and the actual calculator or computation. Verify its inputs, units and outputs separately. If that computation or necessary inputs are unavailable, mark the sample requirement UNKNOWN: an effect target alone does not supply a sample size. A rough planning scenario must not masquerade as a validated calculation.

Compare the resulting requirement with achievable eligible assignment, actual exposure and completed follow-up. Include relevant cycles, delayed outcomes, attrition, novelty and carryover when they affect the question. Duration follows the design and feasible coverage; it is not automatically a fixed number of weeks. If the design cannot support the desired decision, propose a narrower decision or another method and record the limitation rather than silently lowering the standard.

## Freeze measurement, checks and stopping

Before launch, keep these records together:

| Design item | Required record |
| --- | --- |
| Assignment | Unit, eligibility, allocation, implementation owner, reproducible assignment record and exposure crossover policy |
| Outcomes | Primary definition, denominators, time window, supporting metrics and guardrails |
| Integrity | Assignment-balance, delivery/exposure, instrumentation, missingness and interference checks; action if a check fails |
| Analysis | Contrast, uncertainty approach, dependence handling, intended confirmatory comparison/subgroup family and its uncertainty or multiplicity treatment (including repeated looks when relevant), subgroup rationale and missing-data treatment |
| Monitoring | Who can inspect which information, frequency, safety/service guardrails and authority to intervene |
| Stopping | Fixed-horizon or supported sequential rule, follow-up completeness, harm/integrity stops and amendment procedure |
| Governance | Accountable owner, privacy/access/retention limits, approvals still needed and planned effects |

Do not repeatedly inspect outcomes and stop at the first favorable result under a fixed-horizon plan. A sequential design is possible when its valid monitoring and decision procedure is specified and supported; it is not an exception invented after peeking. Safety or service-integrity stops can be appropriate even when the effect estimate is inconclusive. Keep such a stop, its reason and resulting interpretive limit separate from a success decision. New metrics, subgroup splits or stopping changes are dated amendments or exploratory analyses, not retroactive preregistration. Record what outcome information was available to decision-makers when each amendment was chosen and the resulting inference class. Outcome-informed changes remain exploratory unless a separately justified inference basis applies; dating an amendment does not restore confirmatory validity.

## Dry-run the contract before activating anything

Use synthetic or otherwise authorized fixtures to check assignment logging, version labels, eligibility, event definitions, denominator accounting and analysis plumbing. Include a repeated unit, missing exposure, missing outcome, crossover and failed guardrail. Inspect how each case would be handled rather than simply checking that a script exits. Fixture checks verify software and bookkeeping only; they do not establish that real assignment worked, assumptions hold, the study is adequately powered or the intervention benefits anyone.

Keep planned and implemented design in a crosswalk. At the eventual analysis, retain the actual exposure, deviations, incomplete follow-up and missingness beside estimates and uncertainty. A small threshold statistic is not practical value, generalization or freedom from bias. An imprecise or integrity-compromised result remains inconclusive where required; an exploratory pattern may guide another test without being presented as a confirmed subgroup effect.

## Deliverable, recovery and finish

Return the design packet, requirement/unknowns register, measurement dictionary, assignment/exposure plan, precision and feasibility computation or explicit missing calculation, stopping/amendment plan, fixture observations and accountable owner. It must be usable for a review decision even if live launch is held.

If units, denominators or measurement cannot be reconciled, hold the affected inference and repair that contract before launch or interpretation. If a study is already running, preserve the observed deviation and obtain the authorized owner's decision; do not rewrite logs or retrospectively choose a more favorable plan. Do not discard negative or unhelpful results to make the procedure seem successful.

Finish local planning when another reviewer can identify the intended contrast, check every material assumption and see exactly what is ready, missing or not authorized. Launch readiness requires the unresolved design, safety, privacy and operational gates relevant to that actual setting—not merely completion of this document.

## Fictional miniature

A small team wants to compare two onboarding guides on seven-day task completion. It plans assignment by account, one outcome per eligible account, and records actual guide exposure separately. The old guide's 40% rate is from an earlier period, not a guaranteed current baseline. The team considers four percentage points practically relevant but has not supplied an appropriate sample calculation or eligible-volume forecast. This partial packet contains a contrast and outcome outline, with detailed measurement and guardrail definitions still to supply; sample requirement and launch feasibility remain UNKNOWN. It does not invent a required number of accounts or call an arbitrary fortnight sufficient.

A second login from the same account is not a new independently assigned unit. A missing completion event is investigated under the prespecified instrumentation/missingness policy, not silently credited or dropped. If a delivery fault exposes both guides, the deviation is retained. Any later exploratory subgroup story is separated from the agreed primary decision.

## Checks to use during independent review

- Direct request: a supplied prospective variant comparison should yield a concrete design packet, not only a generic experiment checklist.
- Paraphrase: "What evidence would justify rolling out the new workflow?" should bind the decision, unit, contrast and uncertainty before choosing machinery.
- Exclusion: a completed observational dataset must not be described as randomized by this method; a qualitative why-question may need another route.
- Conflict: incompatible person/session denominators or fixed-horizon monitoring changes must remain unresolved or explicitly amended, not averaged away.
- Boundary: missing baseline, calculator or exposure volume stays unknown; planning can continue without claiming launch readiness.
- Portability: no platform, local folder, API, fixed numerical threshold, statistical library or provider is mandatory.

These are review cases, not results already observed from a live study or agent trial.
