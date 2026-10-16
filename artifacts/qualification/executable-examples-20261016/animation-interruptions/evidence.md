# Animation interruptions: author evidence

2026-10-16. Node v24.18.0, Windows PowerShell. Starting repository HEAD:
`594a4b7cd294eecfef8b5c9432416d7650ae4d92`, branch
`feat/executable-method-examples-20261016`. Both authorized lane directories
were absent at intake. Historical release archives and untracked parent contract
files were preserved. Only this lane's example and evidence directories were edited.

This is a host-native consumer application with authored synthetic data. It is
not a raw-agent comparison, an independent acceptance, or evidence of skill/model
superiority. No other author implementation or independent tests were read. No
subagents, paid providers, acquired code execution, web acquisitions, global
configuration edits, installation, shared-manifest builds or Git writes were used.
The complete spec and matching plan were read, but parent integration steps remain
outside this author's authority. No inherited parent history was used as evidence.

## Source identity

`source-hashes.json` records exact SHA256 bytes of the shipped skill and method,
the fixed spec/plan, and the installed workflow resources actually read. Installed
Arcadia's entrypoint matches the shipped one. The domain method used was the exact
shipped `animation-interruption-transitions.md`, not an acquired source adapter.

## Test-first observations

All runs below use `node --test product/examples/animation-interruptions/index.test.mjs`
from the worktree root. Observations are compact author receipts, not independent
review results. Expectations use hand-derived weights and literal event results;
there are no mocks or values computed by the implementation for the expected side.

| Stage | Observed outcome | Meaning / repair |
| --- | --- | --- |
| First red | Exit 1; 9 tests, 0 pass, 9 fail. First test: `starts in locomotion and keeps the caller sample order`; `Error: simulate is not implemented` at index.mjs:2. | Tests were written before simulation logic; only a throwing public API shell existed. This was an implementation gap, not an import/runner failure. |
| Core green | Exit 0; 9 pass, 0 fail. | Added chronological processing, current-weight transitions, active identity checks, inclusive strike window, priority and coalescing. |
| Validation red | Exit 1; 48 tests, 17 pass, 31 fail. Unknown types, malformed times, duplicate samples and ambiguous requests were accepted or lacked explicit diagnostics. | Added full validation before simulation, sparse-array rejection, ID/type consistency and ambiguity checks. Six extra behavioral checks and two incidental shape errors already passed on their first observation; no new red claim for those checks. |
| Validation green | Exit 0; 48 pass, 0 fail, 0 skipped/cancelled/todo. | Invalid inputs now fail explicitly; the behavioral tests remain green. |

Covered behavior: cancelled gameplay with lingering pose contributions; 140/200 ms
inclusive boundaries and adjacent invalid times; once-only strike acceptance;
interruption during blend-in and blend-out; stale/unknown callbacks; repeated IDs;
same-time priorities under multiple input orders; coarse/dense/hitch sampling;
frozen unsorted input, independent output weights, chronological accepted strikes;
fractional/extreme finite times; and 33 invalid-input cases. Extra coverage that
passed at first observation is recorded as coverage, not additional red/green proof.

## What the method contributed

| Read method idea | Actual implementation decision and observable consequence |
| --- | --- |
| Separate gameplay state, pose instance and movement owner. | Separate `active` from `blend`; samples can report state `hit` while retaining attack weight. The interruption test accepts no strike despite nonzero attack weight. `movementOwner` is explicitly controller-owned. |
| Retarget from evaluated contributions, using the exclusive-layer formula. | `transition()` evaluates `weightsAt(at)` before replacing the blend. Literal tests cover 0.3/0.2/0.5 during hit blend and a new hit during return-to-locomotion. |
| Bind notify/completion to playback identity; cancel gameplay immediately. | New actions replace the authoritative active ID. Strike/completion must match it. A run-local seen-ID set coalesces repeats and prevents retired actions from reviving. Old completions cannot end a newer action. |
| Declare priority and repetition policy explicitly. | Sorted timestamp/priority processing and explicit same-time ambiguity rejection avoid listener/input-order winners. The spec supplies the particular priority and coalescing rules. |
| Exercise event boundaries and compare update rates/hitches. | Tests replay actual timestamped events with coarse, dense and single-sample schedules; sampling never creates an event or auto-grants a crossed window. This tests sample independence, not a real engine's frame scheduling. |
| Keep visual quality, gameplay correctness and movement evidence separate. | README and demo call the outputs illustrative weights/state. No rendered smoothness, foot placement, travel measurement, engine acceptance or network claim is made. |

The fixed API, blend durations, 140-200 ms strike window, controller ownership and
required output fields come from the spec. Merely loading Arcadia is not credited
for them. Installed TDD contributed literal tests before implementation and a
preserved failing validation stage; the plan/verification workflows contributed
inline scope discipline and checking actual command results. These contributions
were not isolated experimentally and establish no causal superiority claim.

Useful omissions: no additive/partial-body normalization, animation engine APIs,
phase reconstruction, root motion, prediction, rendering, general state-machine
framework, automatic strike scheduler, external data or dependencies. The method's
engine adapter and rendered-observation suggestions are deliberately unperformed:
this lane has no engine. They remain necessary considerations for a real adapter.

## Documented policy details and limits

Every attack/hit request consumes its ID even if suppressed. Same-type repeats
coalesce forever within that run. Any hit request suppresses same-time attacks,
including a coalesced hit request. These are literal implementations of the
contract's no-restart and hit-suppression rules, documented in the README and tested.
Unknown callbacks do not consume IDs. Extra input fields are ignored. The function
processes all supplied events even beyond the final sample and returns accepted
strikes chronologically. Numeric weights use JavaScript floating-point precision.

No unresolved implementation blocker was identified from the fixed contract.
Independent review, parent replay, shared integration and release acceptance remain
pending and outside this author result. Self-tests are not independent acceptance.

## Final checks and handoff identity

- Worktree author tests: exit 0, 48 pass / 0 fail, no skipped/cancelled/todo.
- Copied all four delivery files byte-for-byte with `apply_patch` to this lane's
  `portable-check/` directory. SHA256 comparison matched all four originals.
  Ran `node --test index.test.mjs` with that directory as cwd: exit 0, 48 pass /
  0 fail, no skipped/cancelled/todo. This is a relocated example check, not the
  parent's full exported-pack replay. The temporary duplicate files were then
  removed with `apply_patch`; original deliverables are retained.
- Ran `node demo.mjs` in that relocated directory: exit 0. Stdout parsed as one
  JSON document. Checked literal weights 0.3/0.2/0.5 at 150 ms, zero accepted
  strikes, and final pure locomotion at 400 ms. No install/dependencies needed.
- Recomputed all nine source hashes; every one matched `source-hashes.json`.
  An initial read-only hash-collection command had a PowerShell empty-pipe parser
  error; changing it to an ordinary `ForEach-Object` pipeline succeeded. No product
  change was involved in that tooling repair.
- Branch and HEAD still match intake. Focused Git status reports only the two
  newly added lane directories. `git diff --check` exited 0, but these new files
  are untracked, so that command alone is not claimed as a whitespace check.
- `delivery-hashes.json` identifies the exact four product files tested in both
  locations. Review and integration can refer to those hashes; no commit was made.
