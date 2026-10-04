# Educational microsimulation design and package procedure

**Scope:** Original procedure for building and checking a bounded learner model. Guidance review is not a validated simulator, domain approval, or evidence of learning efficacy.

## Use this procedure when

A learner should change one or more bounded inputs, observe a model state change, and use that evidence to test or revise a specific mental model. The simulation should add something a static explanation, worked example, table, or diagram cannot provide as clearly.

Do not default to simulation. If interaction adds no meaningful causal feedback, choose a simpler representation. This procedure is not a substitute for a validated scientific, engineering, clinical, legal, or safety model. If a conclusion depends on real-world predictive fidelity that has not been established, stop that claim and obtain an appropriate domain review before presenting it as predictive.

The trigger is educational, not technological: a learner needs to make a prediction or choice, manipulate a model, inspect the consequences, and explain what changed. The procedure does not prescribe a renderer, framework, hosting service, programming language, or build chain.

## Inputs

Collect only what is needed to make the learning and model contract explicit:

- Intended learners, prior knowledge, use context, time available, and any access needs.
- One observable learning objective and the misconception or decision the interaction should expose.
- The supplied, authorized evidence or curriculum rule supporting the model. If there is none, label the model as an illustrative toy rather than silently supplying factual authority.
- Candidate state variables, controls, units, initial values, ranges, transition rules, task-relevant invariants, coupled-state update ordering, and the conditions under which the model is meant to be used. State explicitly when no invariant or coupled update applies.
- Packaging constraints: where it must run, whether offline use matters, and what tools learners already have.
- Any authorized asset, data, privacy, distribution, or accessibility constraints.

If the objective, governing rule, units, or usable bounds are unknown, do not invent them to make a demo look complete. Return a question or a simpler non-predictive representation.

## Required outputs

Deliver a small, portable learning package with these content roles (they need not be separate files or use fixed filenames):

1. A learner-facing start page: objective, controls, how to reset or step, supported environment, and a concise statement of the model's limits.
2. A model contract: named state and control variables; units; defaults and valid ranges; initialization; transition equations or explicit rules; coupled-state ordering and task-relevant invariants (or an explicit none-applicable statement); boundary behavior; assumptions and omissions; and the evidence or toy-model label supporting the rule.
3. The runnable interaction and its assets, packaged so a recipient can find what is required and identify optional components. Prefer the smallest route compatible with the stated use context. Do not require a heavyweight setup when a portable, already-available option can serve the learning objective.
4. A validation note: hand-checkable expected values, invariant and coupled-transition checks, reset/replay results, a separate justified distribution/sampler check when chance is part of the learning claim, accessibility checks, supported-environment coverage, unresolved issues, and who reviewed what.
5. A learner check and a transfer prompt with a short answer key or scoring rubric tied to the objective.
6. An asset/dependency and provenance note: what is included, where each non-original item came from, its use status, and any required version or license information. Do not fetch or include a dependency merely because a renderer commonly uses it.

Use a bundled local asset or an already-authorized environment where practical. If a required external dependency cannot be verified or packaged under the applicable authority, mark that dependency held and provide a simpler offline alternative only if it preserves the learning goal. A successful launch is not evidence that a dependency is licensed, safe, or durable.

## Procedure

### 1. State the learning decision before choosing a display

Write one observable outcome in this form:

> Given **[a defined situation]**, the learner can **[predict, compare, explain, or choose]** using **[an observable reason or rule]**.

Name one likely misconception and the interaction that will make it visible. For example: “A learner predicts that any positive service rate stops a queue growing; compare arrivals with service capacity over several steps.” Do not equate clicking, time-on-task, or a correct guess with understanding.

Ask whether a stateful interaction is necessary. If a static example answers the learning question just as well, route to the lesson, visual, or table owner instead of building a simulation.

### 2. Write the model contract before styling the interaction

Create a compact ledger with one row per state variable and control:

| Field | Record |
| --- | --- |
| Name and meaning | A plain-language definition learners can understand |
| Unit or scale | Physical unit, count, category, probability scale, or “dimensionless” |
| Initial value | Exact starting state and its allowed range |
| Control range | Bounds, increment, default, and whether values are discrete |
| Update rule | Equation or ordered rule, including the update interval |
| Coupled updates | Which variables read the old state, the transition order, and whether an update commits atomically; explicitly state when none applies |
| Invariants | Task-relevant conservation, normalization, count, or other constraints that every permitted transition must preserve; explicitly state when none applies |
| Boundary behavior | What happens at zero, a maximum, an invalid value, or a missing value |
| Evidence and status | Supplied source or explicit “illustrative toy”; unresolved evidence stays visible |

Then state the assumptions in ordinary language. Distinguish a mathematical consequence of the stated rules from an empirical claim about the world. Give each equation an independently hand-calculated example and check that the units on both sides agree. If units do not agree, a range is not defensible, or the boundary rule changes the learning conclusion, repair the model contract before implementation.

For coupled state, define the complete next state before committing it. Check at least one accepted transition and one rejected or boundary transition against the named invariants; verify that an early partial update cannot alter a later decision. If sequential updates are intended, make their order and consequences explicit rather than silently mixing old and new state.

When probability or variability is part of the objective, specify the sampling process and a bounded, independently derived oracle: exact enumeration, an analytic distribution, or another justified reference with its assumptions and tolerance. Check the sampler against that oracle separately from seed replay. A repeated seeded path proves only replay of that path, not correct weights or a distribution claim. If an adequate oracle cannot be justified, narrow the lesson to a labeled illustrative trajectory and withhold the probability claim; do not require a particular library or statistical test.

Keep the model no more detailed than the objective requires. If an omitted factor would reverse a learner-facing conclusion, either add it with adequate support or narrow the claim and show the omission prominently.

### 3. Design a short prediction–action–feedback loop

For each learner action, make clear:

1. What value or choice the learner controls.
2. What state is held fixed and what rule will update it.
3. What outcome the learner should predict before committing.
4. Where the new value appears, in a form that makes the causal change inspectable.
5. What question invites an explanation rather than a lucky guess.

Provide an explicit way to start, pause or step where time matters, and reset. Make default values and units visible; label controls with their effect and valid range. Support keyboard operation and a non-drag alternative for direct manipulation. Do not rely on color, sound, motion, hover, or fine pointer control as the sole carrier of meaning. Provide a text or tabular equivalent for important visual state, and respect reduced-motion preferences where animation is used.

Keep learner data collection off by default. If a task genuinely requires recording work, say what is stored and obtain the required authorization before adding collection or transmission.

### 4. Package for handoff, not just for the author's machine

Include clear open/run instructions and the exact supported environment. Identify whether the package is self-contained, requires a pre-existing tool, or has a held dependency. Include the model contract, assets, checks, and learner instructions in the package or in a plainly linked companion note. A fresh copy should not depend on an undocumented path, personal credential, network fetch, or unlisted local service.

Prefer a lightweight artifact or an existing approved stack. The receiving owner may choose the renderer or framework. If the requested form forces a large toolchain, external account, remote runtime, or fragile service, first check whether a smaller form can meet the same learning objective. Do not install, activate, or fetch a tool as part of this procedure without separate authority.

### 5. Check the model, state changes, replay, and access separately

Record actual results rather than a blanket “works” claim:

- **Equation and units:** Compare representative steps against independent hand calculations, including a zero/boundary case and at least one multi-step path. Confirm units through the update rule and displayed values.
- **Bounds and invalid input:** Try minimum, maximum, and rejected values. Confirm the UI does not silently clamp or relabel a value in a way that changes the model.
- **State changes:** For each control, show that a changed value affects the intended state and that an unrelated variable does not change without a stated rule. Inspect intermediate as well as final values.
- **Invariants and coupled ordering:** Exercise the named constraints on accepted, rejected, and boundary transitions. Compare the complete next state with the documented old-state/read/commit order; check that a rejected operation cannot leave a partial update. Record an explicit none-applicable decision where appropriate.
- **Reset and replay:** Reset to the documented initial state, repeat the same action sequence, and compare results. For a stochastic model, display or record the seed, define what the seed controls, and verify same-seed replay. Do not imply that different seeds must yield different outputs.
- **Probability and sampler:** If chance is part of the learning claim, compare a bounded fixture against its independent exact, analytic, or otherwise justified distribution oracle. Record what sampler behavior was actually checked, assumptions, tolerance, and limits. Keep this result separate from same-seed replay; neither check proves general random-number quality. Without a justified oracle, label an illustrative path and withhold distribution conclusions.
- **Package:** Open a fresh copy using the documented instructions; verify included assets and dependencies; check the declared offline/online behavior and supported environment.
- **Accessibility:** Exercise keyboard-only use, names/units for controls, focus order, text equivalents, contrast/meaning without color alone, zoom or reflow where relevant, and reduced motion. Record any untested assistive technology or device instead of implying universal access.

These checks establish only the behavior they actually exercise. They do not validate a real-world model or show that learners learned.

### 6. Assess the objective and transfer beyond the demonstrated setting

Ask for a prediction before a run, then ask the learner to explain an observed change using the stated rule. Add at least one transfer prompt with changed values or a new but structurally related situation. Provide a short answer key or rubric that evaluates the objective—not visual polish, speed, or number of interactions.

Keep the three evidence types separate:

- Package checks show that the stated implementation and package behavior were observed.
- Domain review addresses whether the model is suitable for the claimed subject and use.
- Learning evaluation addresses whether learners achieved the objective in a defined study.

A playable demo, correct calculation, or completed assessment prompt is not evidence of learning efficacy. Do not claim physical validity, forecast quality, or generalization beyond reviewed assumptions. If efficacy is important, define and run an appropriately authorized learner evaluation separately.

### 7. Handoff and finish

Return the package, model ledger, validation note, learner check/rubric, supported-environment statement, provenance/dependency note, and a short list of open issues. Name the reviewer and scope for each review; “reviewed” without the subject and evidence is insufficient.

The procedure is ready for a bounded implementation handoff only when the learning objective and misconception are explicit; the model rules, units, bounds, assumptions, invariants/coupled-state order (or none-applicable decisions), and limits are visible; expected transitions and reset/replay have recorded results; a separate justified sampler/distribution check supports any probability-bearing objective or that claim is narrowed; the package can be opened as documented in the stated environment; access alternatives have been checked or gaps disclosed; and the learner check includes transfer. Any missing domain, rights, dependency, or accessibility decision remains a named hold. Do not treat this completion condition as a release, a learning result, or an independent approval.

## Recovery and stop conditions

- **Missing governing evidence:** Narrow the claim to an explicitly illustrative model or stop at the model contract. Do not fill a factual gap with an uncited rule.
- **Objective does not need interaction:** Return a static explanation, worked example, table, or diagram and explain why simulation would add little.
- **Equation, unit, or boundary disagreement:** Stop implementation; preserve both interpretations and ask the responsible domain owner to resolve them.
- **Unavailable or unverified dependency:** Remove it, use an already-authorized lightweight alternative, or mark the package held. Do not acquire a replacement automatically.
- **Unrepeatable random behavior:** Make the seed and sampling process inspectable and replayable, or narrow the claim to what can be tested. Do not present one random run as a general result.
- **Invariant, ordering, or distribution disagreement:** Preserve the failing transition or fixture, repair the model or implementation against its independent oracle, and rerun the affected checks. If the oracle or intended rule is unresolved, hold that conclusion; do not relabel replay as distribution validation.
- **Access barrier:** Keep the affected objective out of a “ready” claim until an equivalent interaction or a clearly disclosed limitation is available.
- **Real-world validity or learning efficacy required:** Route to an appropriate independent domain or learning evaluation. This procedure cannot certify either one.
- **Environment too demanding:** Redesign the interaction around a smaller representation; do not silently add a heavy setup requirement.

## Manual illustrative task traces

These are design walkthroughs only. No runnable package, model, empirical claim, or learner study was created or tested here.

### A. Backlog and service capacity

**Objective:** Given fixed arrivals and service capacity per time step, predict whether a simple queue grows, stays level, or clears.  
**Misconception:** Any positive service capacity prevents backlog growth.  
**Toy model:** \(Q_{t+1}=\max(0,Q_t+A-C)\), where \(Q\) is the backlog in jobs, \(A\) is the number of jobs arriving during one step, and \(C\) is service capacity in jobs during that same step. Each update represents exactly one step. Assume fixed arrivals, fixed service capacity, no priorities, no abandonment, no service failures, and no stochastic variation. It is an arithmetic teaching model, not a forecast for a real queue.

Controls could set initial backlog \(Q_0\) from 0–20 jobs, arrivals \(A\) from 0–10 jobs during each step, service capacity \(C\) from 0–10 jobs during each step, and horizon \(H\) from 1–20 steps. An accessible table and optional chart show every step; each control has a numeric entry as well as any visual control.

Hand checks: \(Q_0=3,A=2,C=1\) gives \(Q_1=4\), then with \(A=1,C=4\), \(Q_2=1\), and with \(A=0,C=2\), \(Q_3=0\). Units remain jobs after adding the per-step counts. The backlog remains a nonnegative integer; this one-state model has no coupled-state update. Reset and replay of the same values must reproduce the same table. Ask learners to predict the sign of the per-step change before running, then transfer to a new arrival/capacity pair and explain when an existing backlog reaches zero.

### B. Sampling from a finite set

**Objective:** Explain why a sample proportion can differ from a population proportion, while a full census of the finite set recovers that set's exact proportion.  
**Misconception:** One sample necessarily mirrors the population.  
**Toy model:** A fixed set contains four cards: two orange and two blue. A sample of size \(n\), \(1\le n\le4\), is drawn uniformly without replacement. Population proportion orange is \(2/4=0.5\); sample proportion is orange cards drawn divided by \(n\). Counts have units of cards; proportions are dimensionless. This demonstrates finite sampling only, not polling accuracy or any external population.

Show the fixed population, the sample, the count, and the proportion in text as well as any visual display. A run control can repeat samples with an explicit seed and display individual results rather than hiding variability in a single average. Hand checks: at \(n=4\), every sample contains two orange cards and the proportion is 0.5; at \(n=2\), the possible orange counts are 0, 1, or 2, with 1, 4, or 1 of the six equally likely two-card subsets, respectively. The independent exact oracle is therefore probabilities \(1/6,4/6,1/6\) for those counts. Keep the population unchanged, select distinct card identities, and compute the count and ratio from the completed selection. Validate sample size, no duplicate card within a draw, the ratio calculation, same-seed replay, and the bounded sampler/distribution check against that independent oracle as separate results. These are paper expectations, not executed checks. A finite set of checks cannot prove a random-number generator's quality; record that limit.

Ask the learner to predict what a single sample can show, then transfer to a changed set such as six cards with four orange and two blue. Do not infer that every larger sample is closer in every run; the intended explanation is about the stated sampling process and its variability, not a guarantee from one demonstration.
