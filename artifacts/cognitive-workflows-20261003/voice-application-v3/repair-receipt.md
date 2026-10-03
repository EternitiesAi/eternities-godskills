# C01 voice application repair receipt — v3

## File identities and hashes

- C01 fixture input: `artifacts/cognitive-workflows-20261003/independent-evaluation/raw/C01-voice-style-calibration.md` — SHA256 `990923975f82f69b47b05a97eb484e7c24b84567be2df32eca893a4d852a41f7`.
- Reviewed voice instructions applied: `artifacts/cognitive-workflows-20261003/repairs-v2/voice-style-calibration/SKILL.md` — SHA256 `01efcb9a8780efada72d7c6b263f2be51137d5311bedb3aea506f9d131ed308b`.
- Inherited profile, not copied or changed: `artifacts/cognitive-workflows-20261003/voice-application-v2/profile.md` — SHA256 `f160d35ebb91f15372c3f290601649ed30ea9c49f43d170f2741a68773d80cc6`.
- Prior notice preserved: `artifacts/cognitive-workflows-20261003/voice-application-v2/notice-draft.md` — SHA256 `c4843efb4420c7e50ba4d778b2488caa907cb3204311c3046a93fc6666ae9b65`.
- New notice: `artifacts/cognitive-workflows-20261003/voice-application-v3/notice-draft.md` — SHA256 `9edbdba106887bc0b3f66c0e0477d98ea25e4303fc55652a9060ab3a5a8e217b`.

## Repair made

Removed the weather-status update commitment because it appears in sample B but not in the signed maintenance facts. To retain the practical next step and stay above C01's minimum length, replaced “Please make any changes before the window” with a specific instruction to make new bookings or edits before the pause. That instruction follows directly from the signed pause on new bookings and booking edits; it adds no new service commitment.

The resulting notice is 134 whitespace-separated words in exactly two paragraphs. It ends with the required exact sentence, contains none of the prohibited terms, and uses no astronomy metaphor. It retains the signed maintenance window, booking/list continuity, possible late reminders, qualified six-night pilot figures and limitations, private-preview status, and lack of a public signup date.

This receipt records a local draft repair only. It is not an assessment or self-approval. No assessor criteria or reports were read; the correction used the finding supplied in the task. No product files were changed, and nothing was sent or published.
