# Independent scoring-helper review v2

2026-10-03 — **READY for the narrow guard repair at the hash below.** All four v1 defect reproductions are now rejected, valid nominal inputs still score correctly, and unknown optional counters remain unknown. No new confirmed defect was found within this assigned delta. This is analysis-code review, not outcome grading, study acceptance, or independent qualification of the discovery implementation I authored.

Reviewed source: `C:/Users/Dom/.codex/operations/godskills-quality-20261003/score-blind-results.mjs` — 8,195 bytes, 61 lines.

Exact SHA-256: `1147253ab00c682acb72e1606e82fc11cb4e9488dcc5118480861ef863c314ec`.

## Four-defect recheck

| V1 defect / repaired location | Fresh synthetic check | Result |
| --- | --- | --- |
| Six-pair denominator — line 10 | Six unique tasks with baseline 50 / skill 57 still give mean 7 and gate false. Appending the seventh duplicate task, which formerly inflated the mean to 49/6 and passed, now throws `Exactly six unique fixture tasks required`. Duplicating an ID while retaining six rows is also rejected. | Repaired |
| Fixed 100-point rubric scale — lines 12-14 | Four 30-point criteria (total 120), formerly accepted as an inflated pass, now throw `Four unique finite criteria totaling 100 points required`. Duplicate criterion IDs, a nonpositive weight, and fractional weights with total 100 also reject. | Repaired |
| Execution/scoring cohort — lines 15-18 | Replacing the sixth skill execution row with its baseline counterpart, formerly accepted as 7 baseline / 5 skill runs, now throws `Incomplete or invalid execution cohort`. Key, packet, map, and execution task-ID drift; duplicate packet labels; and duplicate map task/arm pairs also reject. | Repaired |
| Usage domains — lines 19-22, 51-57 | Negative required/optional counters, unsafe/fractional counters, cached input > input, reasoning > output, invalid wall/tool values, and overflowing input/cache-write/wall/tool aggregates all reject. Present valid values are summed; null or missing optional values remain unknown. | Repaired |

Source inspection confirms the finite cohort checks establish six unique fixture/key/packet task IDs, two A/B candidates per task, one mapping per task/label and per task/arm, and exactly the six task IDs crossed with baseline/skill in completed execution rows. The existing exactly-12 unique assessment checks then cover the 12 allowed task/label combinations. The fixed `/6` effect and range denominators are now guarded rather than silently generalized to another sample size. Expected rubrics have four unique criteria with positive safe-integer weights totaling 100; the existing criterion lookup enforces matching score-ID coverage.

## Valid and unknown-counter controls

Six inert tasks used weights `[40,30,16,14]`. Each had one synthetic baseline and skill execution row carrying its `taskId`, `wallMs:100`, and `toolCalls:0`. Both synthetic judges had exactly 12 records, nonempty reasons, and allowed factors only.

- Nominal baseline factors `.5` scored 50; skill factors `1` scored 100. Both assessor means were 50, baseline passes 0, skill passes 6, positive gates true, and mean-delta range `[50,50]`.
- Six runs per arm with `{input:100,cachedInput:40,output:50,reasoningOutput:20,cacheWriteInput:10}` produced `{input:600,cachedInput:240,output:300,reasoningOutput:120,cacheWriteInput:60,wallMs:600,toolCalls:0}`. Reasoning remained separately reported, not added again to output.
- With cached input null and reasoning/cache-write omitted for every run, all three optional aggregates were null; required input/output totals remained 600/300 per arm.
- With just baseline run 1's cached input omitted, skill run 1's reasoning null, and skill run 6's cache-write omitted, optional totals were baseline `[null,120,60]` and skill `[240,null,null]` in cached/reasoning/cache-write order. Unknowns did not propagate to unrelated fields or arms.
- Explicitly reported zero optional counters produced zero totals, not null. Input/output remain required; the repair's unknown behavior applies to optional cached/reasoning/cache-write counters.
- The critical-disagreement regression retained v1 behavior: one synthetic skill assessment with an allowed critical failure had gated score 0 and taskPass false; gates were `[true,false]`, disputed outputs 1, and mean-delta bounds `[33.333333333333336,50]`. There is still no combined adjudicated success verdict. Per-assessor positive gates and a positive lower mean bound do not resolve critical/worst-task disagreement.

The inspected score, effect, critical-zeroing, and disagreement formulas retain the v1 logic; tested control outputs agree. The critical non-regression condition remains task-level failure presence, not an ID-set comparison. No external preregistration/key was read, so exact alignment with its wording is not newly certified. The range remains a descriptive conservative Cartesian bound, not a confidence interval or necessarily either assessor's observed mean.

## Verification and access bounds

Executed `node --experimental-vm-modules --input-type=module -` on Node **v24.18.0**. The unmodified, hash-asserted helper source was evaluated with `node:fs/promises` replaced by seven allowlisted in-memory JSON buffers and an in-memory output sink; real `node:crypto` supplied hashing. Changed synthetic fixture/packet/execution bytes were rebound in the synthetic map before each probe, so rejections exercised the intended guards, not stale outer hashes. All synthetic answers, rubrics, critical IDs, and task IDs were inert authored data.

**31/31 checks passed, exit 0: six accepted controls and 25 expected invalid-input rejections.** Every rejected case was asserted to produce no output write. Output for valid controls used the helper's exclusive `wx` flag. Node's normal experimental VM-module warning was retained. Syntax and final source-hash checks were also required before handoff.

The diagnostic-statistical-model-inference skill guided inclusion/denominator and uncertainty checks; verification-before-completion required fresh concrete evidence for READY. The prior v1 REPAIR remains immutable historical review, not overwritten or reclassified.

Only this new v2 note was written. No helper edits, provider calls, retries, real assessments, answers, fixture/key/packet/map/execution files, formal-call state or outputs, credentials, or existing receipts were read or changed. No synthetic input/output files were written to disk. Parent retains actual evaluation, interpretation, integration, and adoption ownership.
