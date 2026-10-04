# Validation record

This record separates the supplied draft's paper expectations from checks executed against this package. It is not a domain review or learning evaluation.

## Paper expectations from the supplied fixture

- The bin transition begins at `A=3, B=2`, has `B` capacity 4, and accepts a whole integer `k` in `0..3` only when both source and capacity checks pass.
- In particular, initial `k=2` is accepted: `3>=2` and `2+2<=4`, giving `(A=1,B=4)`. Initial `k=3` is rejected because the destination would exceed capacity.
- The spinner has sector values `0,1,1,2`; two independent, equally likely spins yield 16 ordered identity pairs. A success has total at least 3.
- Same-input replay and exact-outcome enumeration are separate evidence. Replay alone is not a distribution check.
- These are supplied toy rules, not empirical or real-world claims.

## Regression reproduction and executed checks

Before the v2 code change, three bounded EOF tests were run against the preserved v1 learner: EOF at the first sector prompt (`5\n`), EOF at the second (`5\nS1\n`), and invalid pair followed by EOF (`5\nBAD\nS1\n`). Each failed with `spawnSync ENOBUFS` under a 2.5-second timeout and 16 KiB output cap. This reproduced the supplied failure report.

After the v2 change, `node --test` was run from this package folder on Windows PowerShell with Node.js v24.18.0 and exited 0: 28 tests passed, 0 failed, 0 skipped. Each child-process interaction has a 3-second timeout and 8 KiB output cap.

The regressions cover both missing-sector prompts, an invalid pair followed by EOF, and EOF at the other learner prompts. The invalid-pair case permits its one expected rejection message, then requires clean termination without a loop. A separate hand-checked test confirms initial `k=2` remains accepted as `(1,4)`; no bin-transition implementation change was made.

## Bounded coverage and limits

- The tests exercise accepted and rejected bin transitions, invalid input/state, non-mutation, reset, the exact 16-case spinner enumeration, deterministic replay of one selected pair, scripted learner flows, and bounded EOF behavior.
- The exact spinner oracle is a full enumeration of this finite toy model, not a statistical sampler check.
- Scripted stdin is not an observed human usability session. Screen-reader use, terminal reflow, other operating systems, and Node versions other than the one recorded above are not verified here.
- No fresh machine or separate copied package was tested. The package does not require installation or a network.
- No learner outcomes, model validity, or efficacy were measured. Parent's independent review remains separate and is not represented by these tests.
