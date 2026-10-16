# Lane C: discovery correctness and portable navigation

Lane C is ready for parent integration. The shared product remains intentionally
unreleased: its catalog/release rebuild and the final public CLI gate belong to
the parent. No shared generated metadata was changed by this lane.

## Contract and scope

Starting identity: branch `feat/cohesive-product-20261015`, HEAD
`c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d`. The starting catalog contains 93
skills in 21 categories. This work repairs demonstrated lexical misrouting and
helps users navigate the portable product. Search still returns evidence to
review; no result selects a skill, grants authority or executes an operation.

Only lane-owned library, guide, uniquely prefixed test and lane artifact files
were changed. No agents, providers, dependency installs, skill activation,
Git mutations or external-project changes were used. The original skill bodies,
metadata attribution and historical receipts were left to their owners.
Concurrent changes elsewhere in the shared worktree are not lane-C work.
The three preexisting release archives were not opened or edited.

The requested sovereign-skill-refinery and skill-creator instructions were read
fully. Their concrete contribution was to keep admission tied to capability
metadata, retain useful methods, separate authored regressions from qualification,
and record a disposition for every frozen entry. No acquired code or prose was
used to implement the repair; source rights were not recertified.

## Changes

- `product/lib/request-scope.mjs`: shared finite English scoping for balanced
  inline literals and recognized refused-action tails. Live work before a
  refusal survives; sentence/semicolon/explicit contrast boundaries can introduce
  new live work. Arithmetic operators and decimals remain available.
- `product/lib/selection-boundary.mjs`: a refused audit/build no longer defeats
  a separate explicit limited microtask. Quoted arithmetic is also excluded from
  the arithmetic check. A live workflow still takes precedence over its counting
  or casing substep.
- `product/lib/discovery.mjs`: a matching game-direction/runtime/player-experience
  metadata profile needs context and runtime purpose in a surviving clause for a
  multiword task request. This is eligibility only: no new bonus or ordering
  tier. A renamed matching capability follows the same rule; a published owner
  ID with different capability metadata does not inherit it.
- `product/lib/product.mjs`: method identity advances to
  `offline-lexical-intent-phrases-v4`. Public commands, flags, envelope schemas,
  filters, stable ties, host no-need and authority/activation fields remain.
- `product/DISCOVERY.md`, `product/START-HERE.md`: explain task versus topic
  lookup, browse/inspect fallback, need facts, finite exclusions and recall costs.
- Three new tests: `tests/cohesive-discovery-routing.test.mjs`,
  `tests/cohesive-discovery-boundaries.test.mjs`,
  `tests/cohesive-discovery-navigation.test.mjs`.
- This lane's evidence and controlled inspection fixture live only in this folder.

## Measured retrieval

`matrix.frozen.json` and the byte-identical `catalog.frozen.json` were frozen
before repair. Baseline execution and a later replay of the exact starting Git
source both produced 26/35 passing cases. The final candidate produced 35/35.

| Authored cases | Baseline | Candidate |
| --- | ---: | ---: |
| Explicit limited microtasks | 2/5 | 5/5 |
| Caller-supplied no-need | 2/2 | 2/2 |
| Specific task owner in top three | 16/16 | 16/16 |
| Adjacent/refused/quoted work excludes game owner | 0/6 | 6/6 |
| Ambiguous requests keep review/clarification contract | 4/4 | 4/4 |
| Live workflow survives incidental microtask/refusal | 2/2 | 2/2 |

Ambiguous cases assert the host-review contract, not a correct semantic answer.
The original failing historical text-only N06 is included as frozen N03.
Six exclusions cover GIS repair, UI drawer motion, encoded video, a 3D license,
refused game work, and quoted game work. The specific cases span engineering,
games/3D, audio, data, writing, business, finance, agriculture, memory, education
and API contracts. All original frozen task-owner top-three expectations remain.

The initial gate hid useful one-term topic navigation and ordinary game creation;
counterexamples were added before repairing those regressions. The final nine
topic/creation probes preserve the baseline game-owner ranks: `game` 1,
`animation` 2, `model` 7, `assets` 1, `game direction` 1,
`game accessibility` 1, small-game creation 1, playable prototype 1,
game-progression design 2. Term-only lookup remains broad by design and grants
no corroborated-intent bonus.

The tradeoff is a narrower multiword runtime shortlist. Unrecognized shorthand,
cross-sentence technical references, unsupported negation or other languages may
lose a useful candidate. Browse and exact-ID inspect remain available. Other
lexical false positives remain; for example the small-game probe still contains
an unrelated agriculture candidate in position three. These authored development
cases and nine post-baseline probes do not establish unseen semantic accuracy,
causal skill benefit, superiority, certification or actual downstream skill use.

## Verification and source binding

Final bounded verification: **128/128 tests passed**, no failing assertions.
The run explicitly excludes the shared-CLI caller and temporary-pack build
checks. `readset.candidate-run.json` binds 116 input files before and after this
run, including all 93 live metadata files used by the existing asset regression
test; every digest stayed unchanged during the run. `tests.bound.tap` is its
complete raw output. New tests use frozen inputs and a tiny controlled inspection
fixture, and do not generate product manifests.

Checks cover all 93 exact-ID searches, category/task/anti-trigger boundaries,
host no-need, stable ties, metadata rather than ID dispatch, ordinary game
creation, topic-only recall, live-work precedence, scoped arithmetic, all 21
browse categories without omissions/duplicates, full entrypoint output without
reference expansion, and incorrect inspection identities/paths.

A prior broader run produced **129 passes and one failure**. It included the
existing isolated temporary-pack CLI test, which passed with only SystemRoot
and an empty PATH in its child environment. Its direct shared-CLI caller failed
because the tracked release inventory is stale. The raw failed run is retained
in `tests.preintegration.tap`; it was not converted into a success.
A separate actual shared CLI call also returned exit 1:
`Release file set changed or undeclared files present`.
See `cli.shared-pending.json`. No shared build was attempted and validators
were not bypassed.

The changed modules and unchanged CLI entrypoint passed `node --check`;
`git diff --check` passed. This is self-verification, not independent review.

`readset.baseline.json` records exact initial file-byte hashes, instruction
sources and the historical case-file hash. The frozen catalog hash is
`f20b17c989c188d439c84fa4a8cf5989ccafe550428b2b2577708ba072a39889`,
equal to the initially read shared catalog bytes. Replayed source hashes are
Git-show bytes; final source hashes in `results.candidate.json` are disk bytes.
`skill-dispositions.json` records one routing decision for every entry:
one capability's retrieval eligibility refined, 92 retained. Published body
hashes there are labeled as catalog assertions, not a new body review.

## Reproduce and parent gates

From the repository root, these commands read data and print results:

```text
node artifacts/qualification/cohesive-product-20261015/lane-c/measure.mjs --baseline
node artifacts/qualification/cohesive-product-20261015/lane-c/measure.mjs
node --test --test-skip-pattern "actual search|rebuilt temporary" tests/cohesive-discovery-routing.test.mjs tests/cohesive-discovery-boundaries.test.mjs tests/cohesive-discovery-navigation.test.mjs tests/discovery-quality-20261003.test.mjs tests/discovery-selection-boundary-20261003.test.mjs tests/discovery-need-20261003.test.mjs tests/realtime-asset-discovery.test.mjs
```

The baseline measurement needs the pinned Git object locally; the distributed
product itself still needs only Node and built-in modules, or its Markdown
directory without Node. No provider/account dependency was introduced.

Parent must rebuild the shared catalog/release after all owners finish, run
validation and the direct search/route/browse/inspect public CLI gates, and
review the final merged metadata against these capability signatures.
Those integration/release outcomes are unresolved here. No skill body quality
or performance claim is implied by a discovery pass.
