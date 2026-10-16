# Interrupted animation events

A small offline example applying [Arcadia](../../skills/eternities-arcadia/SKILL.md)
and its [animation interruption method](../../skills/eternities-arcadia/references/animation-interruption-transitions.md).
It separates the active gameplay action, an exclusive pose blend, and the movement
owner. It is a host-native consumer application using synthetic data. Its checks
are author tests, not an independent acceptance or a comparison of agents/skills.

Requires Node.js 24+; no packages or installation. From this directory:

```sh
node --test index.test.mjs
node demo.mjs
```

The demo prints one JSON document with explicitly fictional inputs and results.
The three `.mjs` files run together in any directory; all imports are relative or
Node built-ins. No network, arbitrary input file execution, or subprocesses are
used. The implementation has no I/O or global state and does not mutate input.

## API

```js
import { simulate } from './index.mjs';

const result = simulate({
  events: [
    { at: 0, type: 'attack', id: 'a' },
    { at: 100, type: 'hit', id: 'h' },
    { at: 140, type: 'strike', id: 'a' },
    { at: 250, type: 'complete', id: 'a' },
  ],
  sampleTimes: [0, 100, 150, 250],
});
```

`simulate({ events, sampleTimes })` returns `{ samples, acceptedStrikes }`:

- Each sample has `at`, `activeId` (string or null), `state` (`locomotion`,
  `attack`, or `hit`), `weights` with those three keys, and `movementOwner`,
  always `controller`. Samples preserve the input sample order.
- `acceptedStrikes` contains `{ at, id }` records in chronological order. All
  events are processed, including those after the final sample or with no samples.

Times are finite nonnegative numbers in milliseconds, including fractional
milliseconds. Both arrays may be empty and unsorted. IDs are case-sensitive,
nonempty strings; whitespace-only IDs are invalid and valid IDs are not trimmed.
Every event, even an unknown/stale callback, must have valid `at`, `type`, and `id`.
Additional fields are ignored and never infer gameplay effects.

Invalid input throws `TypeError` with a field or ambiguity explanation. This
includes missing objects/arrays/fields, unknown event types, malformed numbers,
duplicate sample times (including `0` and `-0`), one ID assigned to both attack
and hit, and distinct IDs requesting the same action type at the same timestamp.
Ambiguous attacks are rejected even when a same-time hit would suppress them.
Sparse arrays are invalid. Validation completes before simulation returns results.

## Transition and event policy

Initially the pose is entirely locomotion, the state is `locomotion`, and
`activeId` is null. A new attack/hit becomes the active action immediately. An
attack blends for 250 ms, a hit for 100 ms, and matching completion returns to
locomotion in 100 ms. Blend completion alone does not complete a gameplay action.
Each transition starts from the evaluated weights at the event time, using a
linear exclusive blend: `(1-u) * previousWeight + u * targetWeight`. Weights
sum to one within floating-point precision. This rule is only for this one
exclusive layer; it is inappropriate for additive layers.

Interrupting an action immediately revokes its gameplay authorization, even
while its pose is fading. A strike requires the matching active attack ID and
elapsed time from 140 through 200 ms inclusive. Only its first valid strike is
accepted; an early rejected strike does not consume that allowance. No strike
is generated automatically, even if a coarse sample crosses the event window.
The caller must supply the actual event timestamp. Sampling never advances or
quantizes event times, so changing sample density does not change event results.

The first attack/hit request consumes its ID for the run. Repeating that same
type/ID coalesces with the original request; it cannot restart a blend, reset a
strike window, or revive a retired action. This also applies to an attack
suppressed by a hit: replaying it later cannot start it. Use a fresh ID for a
new action. A stale or unknown strike/completion is ignored; an unknown callback
does not reserve an ID. Matching completion clears the active ID immediately.

Same-time ordering is hit, attack, strike, completion, with samples last. Any hit
request suppresses attacks at that time, including when the hit request itself
coalesces. Input ordering never chooses a winner. Exact duplicate requests are
allowed; distinct same-type/time action IDs are rejected. A hit and its matching
completion at one time therefore finish in locomotion. A strike and matching
completion at one time accept the strike first if its window is open.

In the example above, the sample at 150 ms has locomotion/attack/hit weights
`0.3/0.2/0.5`, state `hit`, and active ID `h`. There is no accepted strike, and
the stale attack completion cannot end `h`. Movement remains controller-owned.

## Adaptation limits

This is a deterministic event and weight model, with no renderer, skeleton,
clip phase, additive layer, root motion, displacement calculation, network
authority, or real-engine adapter. Controller ownership is a declared invariant,
not a measurement of travel. Numeric weights cannot establish smooth motion,
foot placement, silhouette readability, play feel, or correctness in an engine.
The fixed priorities, durations, ID lifetime and strike window belong to this
illustration; callers must adapt policies and verify rendered interruptions and
authoritative effects in their own game. No skill superiority is established.
