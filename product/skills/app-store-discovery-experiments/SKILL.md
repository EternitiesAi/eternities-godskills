---
name: app-store-discovery-experiments
description: Use when app-store listing discovery, metadata audits, or bounded listing experiments need dated evidence, one-variable design, and honest result boundaries.
---

# App-store discovery experiments

Use this entrypoint to turn an app-store discovery question into a small, observable experiment. It can produce a real implementation packet or execute an authorized listing change through an available product workflow, but it does not promise ranking, conversion, or review outcomes. Search placement and marketplace behavior are external observations; a metadata edit alone is not proof of causation.

Use the audit route when the question is what to change; use the experiment route when the question is whether a change affected a defined outcome. A copy edit with settled requirements can proceed directly without an experiment, and product usability or paid-campaign attribution needs its own method.

## Freeze the observation context

Bind the app identifier or package, platform and store, country or storefront, locale, observation date and time, release version, and measurement source. Inspect the fields implicated by the question: title, subtitle or short description, keyword field where applicable, long description, icon, screenshots, preview video, category, ratings, review themes, update history or events. Include policy and localization constraints that could change the choice. A first-screenshot test need not audit every field. If live store access is unavailable, use supplied exports or screenshots and mark the evidence as historical or unverified rather than filling the gap from memory.

Build an evidence table with field, current value, intended audience or query, evidence date, confidence, and unknowns. Separate observed listing content from hypotheses about search relevance, ranking, or conversion. Do not state an algorithmic factor as fact merely because a source or competitor appears to use it. Treat competitor observations as examples, not proof of a transferable effect.

## Design one bounded change

Prefer one primary variable for a simple cycle: a title phrase, subtitle, keyword set, first screenshot, icon, preview opening, or localized variant. A supported factorial design can vary several factors when assignment and analysis identify their effects; a bundled launch without that design supports only a bundle-level observation. Write a falsifiable hypothesis for a defined storefront and audience. Define the primary metric, guardrails, exposure or traffic source, observation window, minimum sample or stopping rule, and decision for each result. Avoid attributing a bundled change in price, release, creative and metadata to one field.

Prefer a store-supported experiment or a controlled before/after comparison with stable version and traffic context. If randomization or impression counts are unavailable, say so and downgrade the conclusion to directional observation. Keep a holdout or baseline when the platform permits it. Guard against seasonality, paid-campaign changes, feature launches, rating shocks, review solicitation, and localization mix. A result that changes with storefront, device, or date should remain segmented rather than averaged away.

## Implement and report

For an authorized implementation, edit only the declared listing fields, preserve the prior values, validate character limits and localization, and capture the submitted or published revision identifier. For a prepared packet, include copy or creative variants, field-level diff, experiment hypothesis, measurement plan, guardrails, stop rule, and rollback values without implying that the store change happened. After execution, collect dated impressions, visits, installs or qualified actions, conversion definitions, and review or rating context; note missing denominators and attribution limits.

Report outcome, uncertainty, and next action separately. A lift with no stable baseline, a ranking observation with no controlled exposure, or a fixture authored from synthetic data is not a validated growth result. Do not use reviews or user data outside the authorized privacy and product boundary.

## Common failure modes

- Comparing different storefronts, versions, or windows as if they were one experiment.
- Editing several high-impact fields and claiming one caused the result.
- Presenting competitor metadata or a ranking guess as an algorithm guarantee.
- Omitting the denominator, exposure window, or guardrail metric.
- Reporting a prepared listing packet as a published store change.
- Ignoring localization, policy limits, or rollback values.
