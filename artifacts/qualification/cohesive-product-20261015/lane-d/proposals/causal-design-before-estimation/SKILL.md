---
name: causal-design-before-estimation
description: Choose or reject an observational treatment-effect design from how treatment was assigned, then preserve its estimand and diagnostic limits through estimation. Use for causal effects from tabular or panel data, not prediction or a generic significance test.
---

# Causal design before estimation

Connect the causal question to the variation the data actually contain. Use supplied data and available analytical tools; this method requires no bundled estimator library or particular service. A design memo can be useful without executing an estimate, but an estimation request needs the requested analysis where the environment supports it.

## Bind the effect to its assignment process

Name the treatment, outcome, unit, eligible population, treatment start and outcome horizon. Distinguish assignment from uptake and say whether the target is an assignment effect, an effect among treated units, a population average or a local effect. Describe why treated and untreated outcomes could differ without a treatment effect. Identify pre-treatment confounders, mediators and selection mechanisms before choosing controls.

Choose a design from the assignment process, not from which function is available:

| Available variation | Candidate design | What could invalidate it |
| --- | --- | --- |
| Documented random assignment | Assignment-based comparison; account for clustering and noncompliance as relevant | Attrition, interference, broken assignment or substituted uptake estimand |
| A known assignment threshold | Discontinuity near the cutoff; distinguish sharp and fuzzy uptake | Sorting, other changes at the same cutoff, poor local support or an unstable first stage |
| An intervention with pre/post and valid comparison periods | Difference in differences for the named cohort/time effect | Anticipation, divergent untreated trends, composition changes or invalid comparison groups |
| A defensible external shift in uptake | Instrumental-variable design with an explicit target | Weak relevance, a direct outcome path, assignment confounding or an unsupported monotonicity argument |
| Plausible adjustment using pre-treatment variables | Matching, weighting or outcome adjustment for the chosen population | Unmeasured confounding, poor overlap or misspecified adjustment |

This is a comparison of possible designs, not a first-matching-row algorithm. If several apply, explain which target and assumptions justify the choice. If none apply, complete the useful descriptive work and identify what extra design evidence would be needed to support the causal claim.

## Carry the design through computation

Check timing and support before fitting. Compute event time from actual period values, rather than row positions; document the time unit and missing periods. For staggered adoption, identify which units can serve as controls at each time. Do not assume an ordinary two-way fixed-effects coefficient is the requested average effect under heterogeneous cohort or duration effects.

Run diagnostics that address the chosen design: adjusted covariate balance and weight concentration, treatment relevance, pre-treatment trend and anticipation evidence, or cutoff density/continuity and bandwidth sensitivity. Passing a diagnostic cannot prove an untestable identifying assumption. In particular, a non-significant pre-trend test does not establish parallel untreated trends, and a strong first stage does not establish exclusion.

Use an estimator and uncertainty calculation appropriate to that design. An implementation that substitutes fitted treatment in a second ordinary regression may produce a coefficient without valid two-stage uncertainty. Do not promote a library's function name or confidence interval to evidence of estimator correctness. Keep the assignment unit and correlated shocks in view when choosing uncertainty estimation.

After trimming, matching, missing-data exclusions or restricted time windows, state who and which periods remain. If the target population changes, label the resulting effect accordingly. Agreement between two estimates that share an invalid assignment assumption does not repair identification.

## Deliver the requested analysis

Show the selected effect, usable comparison, identifying assumptions, diagnostics that could challenge them, estimated result and uncertainty when executed, and the strongest supported interpretation. Include a concrete reason for choosing this design over the nearest alternative. Keep the analysis reproducible with the supplied data revision, transformations and actual estimator; a method-selection table alone does not establish a causal result.
