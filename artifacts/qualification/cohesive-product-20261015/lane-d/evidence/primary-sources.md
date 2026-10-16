# Public primary-source discovery

Discovery ran against public GitHub pages and public documentation without paid providers or a new account. Repository API responses are retained under the warehouse operation's `metadata/`; their exact local response hashes are in `read-set.json`. The local read-set ledger covers exact local bytes, not an archived full-text web corpus. The pages below were inspected through web search/open excerpts; do not count those excerpts as a full local skill-body read.

Search families covered sales/discovery/qualification, Blender/game design, science/causal data, engineering/agent idempotency, and creative writing/screenwriting. Search popularity and snippets were discovery hints, not adoption evidence. In particular, no search-result instruction was executed.

| Primary source | What was inspected and why |
| --- | --- |
| [Cloutdesk proposal body](https://github.com/cloutdesk/agents/blob/main/skills/proposal-drafting/SKILL.md) | Search discovery of brief-to-roster proposal job; actual selected bodies subsequently read from the pinned stage. |
| [Eric Zakariasson's pack README](https://github.com/ericzakariasson/skills/blob/main/README.md) | Search discovery of two game/asset skills and stated MIT license; actual bodies and license subsequently read locally. |
| [RobLe3 modeling body](https://github.com/RobLe3/cc-blender-skill/blob/main/plugin/skills/blender-modeling/SKILL.md) | Search discovery of targeted 3D work; actual modeling/export/animation-gate bodies subsequently read locally. |
| [Econometrics source](https://github.com/xiaomihu1992/econometrics-skill/blob/main/SKILL.md) | Search discovery of assignment-based causal design; actual body, two references and license subsequently read locally. |
| [Trigger.dev source pack](https://github.com/triggerdotdev/staff-engineering-skills) | Search discovery of production failure mechanisms; selected cardinality body and license subsequently read locally. |
| [haowjy writing pack README](https://github.com/haowjy/creative-writing-skills/blob/main/README.md) | Search discovery of writing/reader modes; four selected entrypoints, one resource and license subsequently read locally. |
| [AgentHouse pack](https://github.com/agenthouse-org/skills) | Discovery excerpt and API metadata only; deferred for unresolved license metadata and redundancy. |
| [ProkStudio rigging body](https://github.com/ProkStudio/skills/blob/main/skills/blender/blender-rigging-and-animation/SKILL.md) | Discovery excerpt and API metadata only; not acquired or body-reviewed locally. |
| [ai-analyst causal body](https://github.com/ai-analyst-lab/ai-analyst/blob/main/.claude/skills/causal/SKILL.md) | Discovery excerpt exposed a generic confidence ladder; not adopted, not acquired, not a complete body review. |
| [Screenwriting pack](https://github.com/jtydhr88/screenwriting-skills) | README license excerpt explicitly separates quotation rights; not acquired or skill-body reviewed. |
| [Callaway/Sant'Anna did guide](https://bcallaway11.github.io/did/articles/did-basics.html) | Opened primary guide for group/time effects and heterogeneous treatment timing. Guidance was not executed as code. |
| [did pre-testing guide](https://bcallaway11.github.io/did/articles/pre-testing.html) | Opened primary guide for limits of pre-treatment checks. |
| [statsmodels IV2SLS API](https://www.statsmodels.org/stable/generated/statsmodels.sandbox.regression.gmm.IV2SLS.html) | API lookup only; not adopted as an implementation or code-audit finding. |
| [Prometheus instrumentation](https://prometheus.io/docs/practices/instrumentation/#do-not-overuse-labels) | Read labelset resource-cost and dimension-reduction section; example thresholds are not universal acceptance limits. |

The pinned stage identities in `source-inventory.json` supersede moving `main` links for reproducibility. The exact material-read boundary is `entrypoint-decisions.json`, not this discovery list. Other search hits, such as broad screenwriting workflows and skill-format documentation, were triage-only and supplied no proposal mechanism.
