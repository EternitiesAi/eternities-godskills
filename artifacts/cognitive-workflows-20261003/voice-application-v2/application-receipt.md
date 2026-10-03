# Voice application receipt — C01 rerun

## Scope and provenance

- Fixture read and applied: `artifacts/cognitive-workflows-20261003/independent-evaluation/raw/C01-voice-style-calibration.md` — SHA256 `990923975f82f69b47b05a97eb484e7c24b84567be2df32eca893a4d852a41f7`.
- Instruction applied: `artifacts/cognitive-workflows-20261003/repairs-v2/voice-style-calibration/SKILL.md` — SHA256 `01efcb9a8780efada72d7c6b263f2be51137d5311bedb3aea506f9d131ed308b`.
- Output profile: `artifacts/cognitive-workflows-20261003/voice-application-v2/profile.md` — SHA256 `f160d35ebb91f15372c3f290601649ed30ea9c49f43d170f2741a68773d80cc6`.
- Output notice draft: `artifacts/cognitive-workflows-20261003/voice-application-v2/notice-draft.md` — SHA256 `c4843efb4420c7e50ba4d778b2488caa907cb3204311c3046a93fc6666ae9b65`.

## Mechanisms used

- Treated the three approved current notices as evidence, separated planning, maintenance, and incident register choices, and excluded the older unapproved fragment. Kept confidence bounded because the sample is small and covers few contexts.
- Kept the operational meaning explicit: the signed date and time window, paused booking actions, intact existing bookings and lists, possible late reminders, private-preview status, no public signup date, and checklist availability.
- Included the pilot counts only with their six-night, single-observatory scope, non-randomized design, varying weather and booking load, and lack of evidence for other observatories. The figures therefore do not assert a causal reduction or a general rate.
- Used no astronomy metaphor in the notice; the one-time sample phrase was not promoted into a signature. Kept the draft visibly a draft and added no author attribution or approval.

## Constraint checks and limits

The notice has two paragraphs and 139 whitespace-separated words, ends with the exact requested final sentence, and does not contain any of the three prohibited terms. These are structural checks only; they are not a judgment that the voice match or rewrite is successful.

This is a local fixture draft only. It was not sent, published, or submitted to a service. The C01 raw input was exposed after the original freeze and targeted instruction repair, so this is a rerun—not a new held-out benchmark or a matched superiority trial. No other evaluator raw fixture, assessor output, Harvey output, or prior assessment was read for this application.

## Separate review status

The independent instruction review at `artifacts/cognitive-workflows-20261003/voice-imagination-review-v2/review.md` remains `READY` — SHA256 `0bebafb5801baf390874e2224349c3eb119373b39cb2c9755c6662b6f8a68c0b`.

That verdict concerns the repaired skill instructions, not this application. This receipt does not self-approve the profile or notice; Sol's evaluator is responsible for assessing the application against the preregistered criteria.
