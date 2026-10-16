# Source decisions and adoption boundary

Six new packs were staged, not installed or published. Thirteen entrypoints and three narrowly selected references from those stages were read in full. Two already downloaded comparison entrypoints and their root licenses were also read in full. The machine ledger records all 102 staged entrypoints: 13 material-read and 89 indexed-only/deferred. Hashing the 478 tracked files for byte integrity did not turn the remaining files into material-read or evaluated sources.

Exact HEADs, paths, SHA-256 read-set hashes, Git blob IDs, license hashes, pack hashes and byte counts are in `evidence/source-inventory.json`, `evidence/read-set.json`, and `evidence/entrypoint-decisions.json`. The latter gives a disposition to every staged entrypoint. No whole-pack quality or adoption verdict is inferred from a selected body's usefulness.

## Selected bodies

| Source and exact relative entrypoint | Disposition | Decision-changing contribution and exclusions |
| --- | --- | --- |
| cloutdesk/agents — `skills/proposal-drafting/SKILL.md` | Pattern reference | Establishes the creator-slate job. The body does not contain a substantive matching algorithm; the proposal adds an original aggregate feasibility method. No connector scopes, accounts or fixed slate size imported. |
| cloutdesk/agents — `skills/talent-discovery/SKILL.md` | Pattern reference | Audience/category/performance signals justify a shortlist. Vague scoring is replaced with evidence that affects the actual brief; creator identity is not treated as audience evidence. |
| ericzakariasson/skills — `skills/game-builder-blender-assets/SKILL.md` | Independent implementation | Intended-camera readability and the same mesh in idle and motion change the repair decision. Mandatory Blender, specialist-per-asset roles, fixed polycounts and blanket anti-primitive aesthetics are rejected. |
| ericzakariasson/skills — `skills/game-builder/SKILL.md` | Pattern reference | Comparable current captures and changing an ineffective repair approach are useful. Open-ended critic loops, compulsory role separation and suppression of model identifiers are not product policy. Its referenced critic/runbook bodies were not read. |
| RobLe3/cc-blender-skill — `plugin/skills/blender-modeling/SKILL.md` | Rejected | Rigid modifier order, automatic bevel/subdivision and fixed join overlap are context-dependent prescriptions. No code, naming policy or modeling recipe adopted. |
| RobLe3/cc-blender-skill — `plugin/skills/blender-export/SKILL.md` | Pattern reference | Retain silhouette-versus-normal detail and checking actual target behavior. Reject universal size/texture/poly budgets, automatic transform changes and file-existence-as-export-success. Source helpers and their validation claims were not independently inspected or executed. |
| RobLe3/cc-blender-skill — `plugin/skills/animation-quality-gate/SKILL.md` | Independent implementation | Authoring-tool handlers need a target-compatible representation. Reject autoloop/self-refinement routing and mandatory contact sheets for unrelated requests. |
| xiaomihu1992/econometrics-skill — `SKILL.md` | Independent implementation | Assignment process selects a plausible design, and target population must survive filtering. No bundled library adopted. Its admitted IV/AIPW/event-time defects are preserved as source-declared limitations, not claims from a code audit. |
| triggerdotdev/staff-engineering-skills — `skills/staff-engineering-skills-cardinality/SKILL.md` | Independent implementation | Per-entity allocations and time accumulation change resource use. Correct the presentation by separating observed tuples, potential Cartesian combinations and churn. Reject universal loop triggers, rigid cardinality tiers and vendor-wide failure assertions. |
| haowjy/creative-writing-skills — `cw/skills/information-hierarchy/SKILL.md` | Rejected for this job | Report-oriented answer-first rules add little here and can spoil a fiction reveal. No new generic communication entrypoint. |
| haowjy/creative-writing-skills — `skills/reader-sim/SKILL.md` | Pattern reference | Text-bound reading questions are useful editorial hypotheses. A simulated persona is not observed reader experience, and prior synopsis knowledge cannot be erased by roleplay. |
| haowjy/creative-writing-skills — `skills/writing-principles/SKILL.md` | Pattern reference | Viewpoint knowledge and space for inference motivate a worked revision exercise. Reject punctuation bans, universal two-function prose rules and unverified assertions about model training or universal reader reward. |
| haowjy/creative-writing-skills — `skills/creative-writing-craft/SKILL.md` | Deferred as entrypoint | A router is not itself a new craft method. Only its scene-construction resource was selected; do not add a duplicate router. |

The econometrics `references/method_selection.md` and `references/diagnostic_checklist.md` were read in full. Assignment-based selection and population changes are useful. The proposal rejects automatic first-yes selection, a universal first-stage threshold, an arbitrary fixed bandwidth recipe, and matching/IPW agreement as causal proof. No estimator implementation was read or run. The selected writing `resources/scene-construction.md` was read in full for orientation/transition choices; no universal scene-opening or dialogue rule was inherited.

## Existing source reuse

`coreyhaines31/marketingskills`, existing local HEAD `dda3841f0b294e01e93b1541486beefbfab0915e`, supplies `skills/sales-enablement/SKILL.md`. Its defensible rep-claim distinction is a pattern reference for the slate proposal. Fixed deck/demo formats, company-context paths and tool integrations are not adopted. The full body and root MIT license were read; other pack bodies were merely listed as available.

`K-Dense-AI/scientific-agent-skills`, existing local HEAD `330c8e764435a731eff571e3efdda70b363d0792`, supplies `skills/statistical-analysis/SKILL.md`. Retain it as a comparison showing that generic diagnostics/reporting already exist; it is not a new acquisition or a causal-identification method. No installation, bundled script or API-specific example was executed. Do not inherit its p-value-as-existence wording, automatic normality-triggered test switching, blanket optional-stopping claim or citation instructions as policy. The full body and root MIT license were read; other bodies were not reviewed. API metadata reports this already downloaded repository at 471,131 KiB; it was not refreshed or re-cloned.

Both existing origins were checked and both status commands returned no content changes. Their current HEADs, rather than potentially stale index HEADs, identify the local comparisons. No fetch, checkout, install, source edit or update was performed in either copy.

## Rights and attribution

Root licenses read and retained intact in the inert stages:

- Cloutdesk, Inc., copyright 2026 — MIT.
- Eric Zakariasson, copyright 2026 — MIT.
- RobLe3, copyright 2026 — MIT.
- econometrics-agent, copyright 2025 — MIT.
- Trigger.dev, root copyright notice uses bracketed 2026/Trigger.dev text — Apache-2.0.
- haowjy/creative-writing-skills — Apache-2.0 root license; the appendix contains a template copyright line rather than a named copyright holder. Attribute the repository/author identity without inventing a notice.

No separate `NOTICE` file was found in the pinned trees of these six sources. Existing comparison licenses name Corey Haines (2025, MIT) and K-Dense Inc. (2025, MIT). These observations are source evidence, not a blanket clearance of every asset or embedded third-party material. The proposals use original prose and examples, copy no source code, and preserve attribution here and in the exact-byte ledgers. A parent redistributing upstream bodies must carry their applicable license/notices; this lane grants no broader rights.

Publicly discovered but not acquired: AgentHouse's pack had no API-recognized license; ProkStudio's was `NOASSERTION` and overlapped selected 3D material; ai-analyst-lab overlapped the selected causal source; jtydhr88's primary README explicitly excluded quoted books/scripts from its MIT skill grant. Those are selection/defer decisions based on metadata or a named README excerpt, not full-body judgments. Their untouched public metadata receipts and the frozen rationale remain in the operation.

## Proposed integration, not adoption

1. `brief-to-feasible-creator-slate`: consider a narrowly discoverable business method or Agora reference. Its distinctive work is aggregate rights/budget/deliverable feasibility, beyond generic prospect scoring.
2. `camera-driven-asset-iteration`: prefer an Arcadia authoring reference adjacent to the existing real-time asset-integration method; do not duplicate import verification.
3. `causal-design-before-estimation`: prefer a conditional reference under diagnostic statistical inference, optionally discoverable through Athena. No general causal-performance claim.
4. `telemetry-cardinality-budget`: prefer a conditional method under service observability; preserve the existing SLO contract and arithmetic.
5. `reader-knowledge-and-reveal-revision`: prefer a worked tool inside the existing narrative method. Much of the conceptual territory already exists, so adding another root may be redundant.

All five are drafts with local structural checks and self-reviewed examples. No independent agent evaluation, human reader study, Blender/engine render, causal estimation or production metric benchmark was performed. Parent selection, overlap review with other lanes, product integration, generated metadata and release remain outside this lane.
