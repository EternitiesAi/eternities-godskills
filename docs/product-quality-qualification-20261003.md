# Godskills quality qualification — October 3, 2026

## Outcome and release scope

This finite batch delivers reviewed discovery repairs and an exact portable
**74-skill, 21-category** pack. It also supplies an honest practical comparison:
preselected guidance showed a modest provisional benefit, but the two blinded
model assessments did not agree that it cleared the preregistered improvement
gate. The strong baseline, ceiling effects and unresolved grading choices matter.
This is content/build qualification with bounded outcome observations, **not**
universal performance certification or completion of the acquired source quarry.

Product content release:
`cc43b99316ef813f86097f3444598e4ec243124d50e6001572a8a190b6e07402`.
The [standalone ZIP](../artifacts/releases/godskills-product-20261003-cc43b993.zip)
has SHA-256
`b5cdbdeab946de83edd1169be2ace02be3616466df1c6ee4da643df22fc38cc6`.
All 74 skill metadata files and 135 skill-body/reference files are unchanged from
the starting pack. This batch repairs selection and packaging documentation;
it does not claim newly improved prose in every skill. The runtime has 241 files,
240 bound by `release.json` plus the release manifest itself.

## Discovery: gain and remaining failure

The independently authored, frozen 30-query test covered 24 positive queries
and six requests that should not load a skill. It covered 19 acceptable skill
identities, not all 74. The first candidate improved top-1 hits **17/24 to 18/24**;
both packs hit 21/24 at three results and abstained on **0/6 negatives**.

Narrow repairs subsequently handled explicit limited requests and balanced
ASCII inline literals. Replay of the original negatives reached 6/6, but that
is development evidence after observation, not a fresh held-out result. A new
independently authored 12-query boundary test had six correct positive top-1
hits in both arms and **0/6 negative abstentions in both**. Preserve that failure:
these finite English cue profiles are not a general negation or semantic-intent
classifier. The caller still decides whether any skill is needed.

Independent reviews rejected successive negated-voice, affirmative-audit and
literal-payload defects before the final narrow READY. Original findings remain
in the repository. [The final discovery review](discovery-quality-independent-review-v5-20261003.md)
defines the accepted scope; the observations directory preserves each tested
candidate's identity rather than treating the initial held-out result as a test
of later tuned bytes.

## Practical matched comparison

The [preregistration](../evaluation/quality-20261003/preregistration.md),
[frozen fixtures](../evaluation/quality-20261003/fixtures.json) and
[assessor key](../evaluation/quality-20261003/rubric.json) were authored before
formal output inspection. Twelve subscription CLI calls were completed in two
waves of six, with fresh contexts, counterbalanced order, no repair calls and
zero observed tool calls. Both arms requested `gpt-6-luna`, OpenAI, max reasoning,
the same 600-second timeout and 1,800-word final-answer contract. Every call
completed within those limits. Maximum output tokens were not configurable in
this CLI; no enforced token ceiling or zero-dollar charge is claimed.

Treatment added only the exact preselected skill body and declared relevant
resources from the frozen starting release
`54688268f540ce974272f4619f88d97adde80a0c058325a5b8f960432370a0dd`.
Those bytes match the new pack. This tests **provided guidance**, not automatic
discovery, proof of reading, tool execution, persistent memory or multi-day work.

Two fresh-context host-native Luna model assessors received synthetic evidence,
rubrics and randomly A/B-labeled final answers, not arms, usage, discovery keys
or skill identities. Neither author graded the outcomes. The arm map was revealed
only after both assessments completed. There was no human adjudicator, and
same-family model judging can share biases.

Scores below are recomputed from four weighted criteria, not copied aggregate
claims. No critical failure was reported in either arm.

| Task | Judge 1 baseline → guided | Judge 2 baseline → guided |
| --- | ---: | ---: |
| Voice and audience adaptation | 70 → 100 | 82.5 → 87.5 |
| Imaginative concept development | 100 → 100 | 100 → 100 |
| Interpersonal repair | 92.5 → 100 | 92.5 → 100 |
| Memory recovery from conflicting records | 100 → 100 | 100 → 100 |
| Detailed completeness audit | 92.5 → 100 | 92.5 → 100 |
| Long-horizon planning and handoff | 92.5 → 100 | 100 → 100 |
| Mean guided-minus-baseline | **+8.75** | **+3.33** |
| Passes, baseline → guided | 5/6 → 6/6 | 6/6 → 6/6 |

Judge 1 clears the preset +8-point gate; judge 2 does not. Both point assessments
have six nonnegative task deltas. Two voice output scores differ by more than
10 points. Judge 2 also supplied alternative score ranges for borderline voice,
fallback and audit-scope interpretations. They are retained verbatim, not
replaced with consensus. Including those alternatives produces a conservative
Cartesian mean envelope **−2.08 to +8.75**, which is neither a confidence interval
nor a demonstrated simultaneous result. No adjudicated superiority verdict is
issued. Both imagination and memory reached the rubric ceiling in both arms,
so these tasks cannot resolve finer quality differences.

| Reported counters, six runs per arm | Baseline | Guided |
| --- | ---: | ---: |
| Input tokens | 63,473 | 73,724 |
| Cached input, included above | 42,496 | 23,808 |
| Output, including reasoning | 32,490 | 40,140 |
| Reasoning, included in output | 28,313 | 35,708 |
| Sum of per-job elapsed milliseconds | 702,042 | 749,930 |

Guidance increased input by 10,251 tokens (16.15%) and output by 7,650 (23.55%).
The observed cache counters are not a causal cache-efficiency experiment; the
parallel overall elapsed time is not the sum of job durations. Actual provider
charge was unavailable. These results justify selective loading, not loading
the entire library for every turn.

## Isolation, testing and independent reviews

Captured CLI preflights showed no local Godskills, global AGENTS, Keel or memory
inheritance; four factory skill descriptions remained in both arms. The actual
execution prefix was not captured and the served model was not attested by the
CLI. Consequently this is a **provisional requested-stack, factory-Codex
comparison**, not a fully isolated raw-model causal result. Native judge host
instructions were also not captured. All 12 executions logged a nonfatal
PowerShell snapshot warning; none logged the earlier pilot's SQLite migration
warning. Pilots are excluded. A failed earlier formal attempt made only six
debug preflights, zero model calls; its receipts and the dated replacement
amendment remain preserved.

- Windows full repository suite: **1,460 passed, 0 failed, 2 skipped** out of
  1,462 registered. Skips were the account's unavailable leaf-symlink creation
  and an unavailable different-volume fixture.
- Final frozen product in isolated same-host Ubuntu WSL, official Node 24.18.0:
  **86/86 passed, no skips**, plus standalone content validation. This is not a
  separate fresh computer, macOS test or live Linux installation.
- Final harness on Windows: **68/68 passed**. A preceding timestamp-normalizer
  version passed 67 Linux controls; that older run is not a Linux qualification
  of the final message-provenance patch.
- Independent packaging audit: 74 skills, 21 categories, 61 reference resources,
  326 related edges, 43 specialization edges and 181 checked local links, none
  broken. This audit did not requalify its author's discovery ranking.
- Independent harness and analysis-code reviews retained their initial REPAIR
  findings; only the narrowed fixes subsequently received READY. The
  [final message-provenance review](quality-harness-independent-delta-review-94b0f88-20261003.md)
  and [31-control scoring-helper review](../evaluation/quality-20261003/analysis/scoring-helper-independent-review-v2.md)
  explain their acceptance boundaries.

## Evidence and application boundary

The [public observation record](../evaluation/quality-20261003/observations/README.md)
contains synthetic final answers, both unedited assessment JSON files, exact
answer/receipt hashes, a safe execution projection, unblinded mapping, arithmetic
analysis, uncertainty envelope and retrieval failures. It excludes credentials,
raw model reasoning and private auth/operation logs. Original private receipts
are retained locally; public projections are labeled and hash-linked to them.

The repaired pack may be integrated as an instruction library under the existing
authorization, based on reviewed code and content integrity—not because a
six-task score authorizes deployment. Native application requires a fresh
rollback backup and exact before/after manifest verification, including unrelated
skills. Installation status is recorded separately, never inferred from tests.
Protected activation bytes, historical receipts, source obligations and the
paused whole-corpus automation remain untouched.

The subsequently verified [native installation record](product-quality-installation-20261003.md)
binds the applied release, rollback backup and exact before/after hashes.

Highest-leverage future qualification is a bounded caller-side selection test
with genuinely new negative intents, then more discriminating real tasks beyond
the present ceiling. That work is not silently added to this completed batch.
