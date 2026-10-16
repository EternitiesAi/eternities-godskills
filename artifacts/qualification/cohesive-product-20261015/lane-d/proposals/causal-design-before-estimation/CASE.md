# Authored decision cases

Synthetic panel: a region starts treatment in 2020. Observed years are 2018, 2020 and 2023. Event times in years are -2, 0 and 3; row offsets -1, 0 and 1 silently change the design. The calendar arithmetic can be checked directly; it does not validate an event-study estimator.

Direct/paraphrase case: “Did the policy cause the improvement?” and “How much would outcomes have changed without the policy?” need the same assignment/estimand examination. A never-treated comparison group plus pre-period records makes a DiD design a candidate, not a demonstrated result. A non-significant pre-period test does not certify the identifying assumption.

Conflict case: treated units have no support among available controls. Trimming them can create an estimate for the supported subset, but cannot silently retain a whole-population ATE label. Comparing matching and weighting on that subset does not recover excluded units or eliminate unmeasured confounding.

Exclusion: “Which model predicts next month's sales best?” does not need this causal method. Boundary: a clean regression coefficient without a defensible assignment story remains an association. A user who asked only for a design memo need not receive a full estimation project.

Source contribution: the selected econometrics entrypoint and two references connect assignment mechanisms with estimator families and state several implementation limitations. Their library was neither read as an implementation nor executed, and its declared limitations are source claims. This proposal rejects the automatic first-yes selection order, universal first-stage threshold, fixed bandwidth recipe, and inference that agreement between matching/IPW establishes robustness. The existing K-Dense statistical-analysis body is a contrast source: it supplies general diagnostics/reporting concerns but does not fill the causal-design gap. No p-value-as-existence claim, normality-triggered automatic test switching or optional-stopping blanket rule is imported.

Primary cross-checks read during this lane: [Callaway and Sant'Anna's did guide](https://bcallaway11.github.io/did/articles/did-basics.html) for group/time targets and staggered-treatment comparisons; [their pre-testing guide](https://bcallaway11.github.io/did/articles/pre-testing.html) for the limits of pre-trend checks. No code from these references was executed. These checks support the design cautions, not performance qualification of this draft.

Integration disposition: a conditional causal-design reference under `diagnostic-statistical-model-inference`, with selective routing from Athena, is preferable to duplicating the full diagnostic workflow. The parent can choose a standalone specialist only if the user-facing discovery benefit warrants it.
