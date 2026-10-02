# Provider-free independent task-plan applications

These are actual reviewer-written planning outputs from the complete staged Daedalus owner, its new conditional reference, and the exact canonical Daedalus/Herald evidence boundaries. They are not provider executions, implemented CI workflows, agent-behavior experiments or performance observations.

## P1 — Stable local checks plus genuinely optional experiments

Caller: “Keep parser/recovery regressions and a fixed model-shaped fixture in required CI; add optional prompt exploration and live-response experiments, off by default.”

Declared in-scope inventory: `R-parser`, `R-offline-model-fixture`, `R-recovery`, `O-prompt-exploration`, `O-provider-response`. Required selection is exactly the three `R-` IDs; optional selection is exactly the two `O-` IDs. The fixed model-shaped fixture is still deterministic and provider-free, so it stays required rather than moving merely because its data resembles a model response. Inspect setup and fixtures too; a setup provider call would defeat the required class. Required command receives no provider credentials and must fail closed at the call boundary; block egress where supported. Do not claim this isolation was tested here.

Do not enable the optional job yet. Record its specific maintainer authorization, selected revision/scenarios/provider, permitted invocation/time/spend effects and observability. Hand the exact target CI/policy files and revision to Herald. Until actual required-status mapping is inspected, merge qualification remains unresolved and the optional job stays disabled.

Membership counterexamples: selecting `O-prompt-exploration` in both lists is an overlap; dropping `O-provider-response` is an omission; duplicating `R-parser` is a duplicate; a newly discovered `N-new-model-setup` is unclassified, not silently selected by a wildcard. The literal set audit in [evidence.json](evidence.json) actually detected these plus an undeclared selection. No actual project's discovery or runner was exercised. Ordinary deterministic tests without an optional scenario need only the existing test-design method.

## P2 — Ambiguous spending authority and uncertain paid acceptance

Caller A: “Run the optional tests; I haven't said which provider, revision, scenarios or cost limits, and cost might be unobservable.” Output: all optional IDs remain `not-run`. This statement does not satisfy the method's specific authority/effect/limit fields or its explicit acceptance of unknown spend. Request the missing material authority; do not invent a budget, infer acceptance of cost uncertainty, switch provider or use this skill as spending permission.

Caller B: authority explicitly names one scenario, revision, provider/environment, invocation/time/spend boundary and accepts unobservable cost. A later interruption leaves acceptance unknown. Planning output: that attempt is `incomplete`, request acceptance is `unknown`, and usage/spend is `unknown`; preserve the request/run identity and protect sensitive material. No automatic retry, silent model/provider/fixture substitution, duplicate potentially paid request or invented zero-cost result. Additional activity requires the matching remaining authority and limits; the uncertainty is not a pass. No paid request or recovery was performed in this review.

## P3 — Required paid/live acceptance is not optional

Caller: “A real provider handoff is a required acceptance gate before merge. Also add a separate exploratory optional prompt job. Do not replace the handoff with a mock.”

Preserve `G-live-handoff` as a required task/release acceptance gate. Its current evidence is `not-run` and acceptance is unresolved. The full Daedalus owner establishes the objective and acceptance signal first and forbids fixture/static evidence being called live integration; the existing test-design method binds the real boundary to the claim. A canned response may test handling but cannot satisfy this gate.

Do not apply the optional method's provider-free two-list partition to the whole project's acceptance inventory: that would conflict with the caller's required paid case. Restrict it to genuinely optional scenarios and their already-stable local check workflow, or do not use it if that separation is not valid. Never move `G-live-handoff` to optional or omit it to make a disjoint-union check pass. Missing execution/spend authority leaves it unresolved, not downgraded. Keep that exact outstanding gate visible to the acceptance owner.

Herald must inspect the real mapping. If the live handoff is a required status/dependency, the new method's “deterministic required checks alone” merge-safe condition is not established; do not delete the status to meet it, do not call the whole CI merge-safe, and leave optional enablement unresolved/disabled. If policy permits merge before the required user acceptance, a green policy alone still does not satisfy the user's contract. This is a negative-fit boundary of the documented optional method, not approval to redesign required release gates.
