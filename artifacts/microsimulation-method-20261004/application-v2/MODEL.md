# Model contract, learner check, and provenance

## Lesson 1: atomic token transfer

**Objective and misconception.** Given the current bin counts and an integer proposal `k`, predict acceptance and the resulting counts by applying both constraints. The interaction exposes the idea that a transfer can be partly applied even when the complete proposal fails.

| Name | Unit and initial value | Allowed input or state | Rule and boundary behavior |
| --- | --- | --- | --- |
| `A` | Tokens; initially 3 | Nonnegative integer; together with `B`, totals 5 | On an accepted proposal, `A' = A - k`. |
| `B` | Tokens; initially 2 | Integer from 0 through capacity 4 | On an accepted proposal, `B' = B + k`; otherwise unchanged. |
| `k` | Tokens proposed for transfer; no time interval | Integer from 0 through 3 | Accept the entire proposal exactly when `A >= k` and `B + k <= 4`. Negative, fractional, missing, and out-of-range inputs are rejected before transition. |

The ordered transition reads both checks from the same old state, builds the complete next state, checks its invariant, then returns the new state. A rejected proposal returns a fresh copy of the old state; it does not subtract from `A` first. The invariants are integer nonnegative counts, `A + B = 5` tokens, and `B <= 4` tokens. The only coupled update is the paired transfer; it commits atomically. Reset restores exactly `A=3, B=2` and clears no persisted data because no learner data is stored.

Hand checks: from `(3,2)`, `k=1` passes both checks and yields `(2,3)`; counts remain tokens because token counts are subtracted and added. From `(3,2)`, `k=3` has enough tokens in `A` but would make `B=5`, so it rejects the whole proposal and leaves `(3,2)`. A zero transfer is valid and leaves the state unchanged. No randomness or elapsed time is part of this model.

### Bin transfer answer key

The transfer assessment uses the reachable state `(A=2, B=3)` with `k=2`. The source check passes (`2 >= 2`); the capacity check fails (`3 + 2 > 4`). The answer is rejection with no change: `(2,3)`. A complete explanation names both checks and says they are applied to the old state before either count commits. Score the reasoning against those elements, not merely a yes/no guess.

## Lesson 2: two independent spinner identities

| Sector identity | Value |
| --- | ---: |
| `S0` | 0 |
| `S1` | 1 |
| `S2` | 1 |
| `S3` | 2 |

The supplied fictional rule says each of the four sectors is equally likely on each spin and the two spins are independent. One trial consists of two ordered spins. The total is their value sum; success means total at least 3. The package lets a learner select one pair and replay those same identities, then enumerates the full 4×4 space. It makes no random draw and claims no random-number quality. There is no evolving spinner state to reset; rerunning the command starts the lesson again.

| Total | Ordered identity pairs | Count | Exact proportion |
| ---: | --- | ---: | ---: |
| 0 | `(S0,S0)` | 1 | `1/16` |
| 1 | `(S0,S1)`, `(S0,S2)`, `(S1,S0)`, `(S2,S0)` | 4 | `4/16` |
| 2 | `(S0,S3)`, `(S3,S0)`, and all four pairs from `S1,S2` | 6 | `6/16` |
| 3 | `(S1,S3)`, `(S2,S3)`, `(S3,S1)`, `(S3,S2)` | 4 | `4/16` |
| 4 | `(S3,S3)` | 1 | `1/16` |

There are 16 equally weighted ordered pairs under the supplied rule. Five are successful, so the exact success proportion is `5/16`; eleven are not successful. This result is a mathematical consequence of the toy rule, not an observation about a physical spinner. Replaying one selected pair repeats one arithmetic result; it does not reveal the other 15 outcomes or estimate the full distribution.

### Spinner transfer answer key

The prompt changes the hypothetical spinner to `T0=0`, `T1=1`, `T2=2`, with equal sector chances and independent spins. For the same success threshold (total at least 3), three of the nine ordered pairs succeed: `(T1,T2)`, `(T2,T1)`, and `(T2,T2)`. The exact proportion is `3/9 = 1/3`. A complete explanation distinguishes the result of a single replay from counting all nine legal pairs. This is a constructed transfer item, not learner evidence.

## Implementation and API

[`simulation.mjs`](./simulation.mjs) exports:

- `BIN_MODEL` and `SPINNER_SECTORS`: frozen model constants.
- `createInitialBinState()`: a fresh `{A: 3, B: 2}` state.
- `validateBinState(state)`: named checks for the bin-state invariants.
- `transferBins(state, k)`: a pure all-or-nothing transition. It returns a new result and a new state copy on both acceptance and rejection; it does not mutate the supplied state.
- `evaluateSpinnerTrial(firstId, secondId)`: deterministic arithmetic for one selected legal pair, with sector identities and values in the result.
- `enumerateSpinnerOutcomes()`: the 16 ordered identity pairs.
- `spinnerDistribution()`: exact counts derived from those 16 outcomes.

Example import from another local script:

```js
import { createInitialBinState, transferBins } from "./simulation.mjs";

const before = createInitialBinState();
const result = transferBins(before, 1);
console.log(result.accepted, result.state); // true, { A: 2, B: 3 }
console.log(before); // still { A: 3, B: 2 }
```

## Provenance and evidence limits

All source code, text, and checks in this package are original and were written for the two supplied inputs: the fictional implementation fixture and the procedure draft. No third-party assets, data, code, or dependencies are included. Runtime imports use Node built-ins only. The exact toy rules are the only model authority; no curriculum evidence or outside source was added.

These checks can support claims about the implemented arithmetic, input rejection, state immutability, reset, replay of the same chosen pair, and exact enumeration. They do not establish real-world predictive validity, physical spinner behavior, learning efficacy, or generalization. No learner data is collected. Accessibility beyond the text and keyboard-oriented interaction was not independently assessed.
