# Offline microsimulation lessons

This is a small first-party text package for two fictional, low-stakes learning exercises. It runs locally with Node.js and uses only Node built-ins. There is no installation step, server, network access, account, telemetry, or saved learner response.

## Start

From this folder in a terminal:

```text
node learner.mjs bins
node learner.mjs spinner
```

The bins lesson accepts `0`–`3` to propose a transfer, `r` to restore the initial state, `t` to open its transfer check, and `q` to quit. For every valid proposal, enter a prediction before the model commits the action, then explain the observed change.

The spinner lesson asks for a whole-space prediction, lets you select one ordered pair of sector identities, asks for a prediction before revealing its arithmetic result, and offers an exact replay of the same pair. It then prints every permitted pair and the exact distribution, followed by a transfer check. This is a labeled enumeration, not a random sampler: replaying a chosen pair repeats its result but does not estimate the other pairs. The spinner has no evolving state; rerunning `node learner.mjs spinner` starts that lesson again.

To run the included checks:

```text
node --test
```

## Learning goals

- **Bins:** Given a proposed integer transfer, predict whether the complete change is accepted using both the source-count and destination-capacity checks. The exposed misconception is that a transfer can partially succeed when only one condition passes.
- **Spinner:** Explain why one selected or replayed trial answers a different question from an exact distribution over all permitted ordered pairs. The exposed misconception is that replaying one result describes the whole outcome space.

The learner check asks for predictions before feedback and requests explanations tied to the rules. The transfer questions change the current bin state or the spinner's sector set. The answer keys and scoring guidance are in [MODEL.md](./MODEL.md).

## Supported use and limits

The source uses ECMAScript modules and Node's built-in `node:readline` module; Node.js 18 or newer is the intended runtime. This package was exercised here on Windows with Node.js v24.18.0. Other operating systems and Node versions were not run in this trial.

The interaction is keyboard and text based; no color, sound, pointer, or animation carries meaning. The scripted terminal checks do not establish screen-reader compatibility, terminal reflow, or access on other devices. Learner input remains in the running process and is neither written to disk nor transmitted.

This is an illustrative arithmetic model, not a prediction about real bins, spinners, or populations. Correct calculations and a completed prompt are not evidence that a learner learned. No domain review or learner study was performed.

See [MODEL.md](./MODEL.md) for the model contracts and provenance, and [VALIDATION.md](./VALIDATION.md) for observed checks and their limits.
