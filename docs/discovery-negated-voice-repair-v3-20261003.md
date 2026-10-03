# Repair of the independent negated-voice finding

The immutable v1 independent review found an introduced regression: `Do not rewrite in my voice; compare implementations and errors` was correctly ranked as implementation comparison at baseline but voice calibration received the new 60-point bonus in candidate v1. Its review remains REPAIR; no historical bytes or disposition were revised.

The parent first added a regression against the real search function. One of two new assertions failed; the affirmative control separating a prohibition on factual invention from positive voice adaptation passed. A narrow per-profile exclusion now prevents explicit `do not`, `don't`, or `never` voice-adaptation wording from providing positive intent evidence. Ordinary weighted search remains, so the affirmative implementation-comparison task is not discarded. The full 58 discovery/boundary development tests passed after the change.

This is deliberately not a general negation parser. Arbitrary quotation, clause scope, other profile families and multilingual wording remain outside this bounded rule. The independently authored v2 boundary holdout was frozen before the parent opened or evaluated it. Fresh evaluation and new independent review concern this repaired candidate; they do not retroactively accept v1.
