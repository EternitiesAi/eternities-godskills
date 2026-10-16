# Fictional consumer exercise: decide whether an agent upgrade is supported

Assess the supplied evaluation and produce a corrected next experiment design.
Use the portable Godskills pack selectively. No web search, provider call or
additional experiment is authorized. Treat this as fictional test data.

An author tested a new skill pack on 12 tasks. They chose those tasks after
seeing the pack's failures on a larger pool, removed the four hardest failures,
and rewrote the prompts until the pack won. The reported score was 10/12 for the
pack versus 8/12 raw, but raw ran on model M1 and the pack ran on model M2. The
same author judged both with condition labels visible. Three pack runs exceeded
the time allowance and two reused saved successful outputs; these were all
counted as wins. Those cases overlap but the case IDs were not retained.

Recorded input tokens: raw 20,000; pack 14,000. Only the pack used a different
provider cache policy, and cached-input counters are absent. The team claims
"30% cheaper, universally more capable, ready for autonomous production." The
local package tests and installation hash checks did pass, but no real
production consumer has used this snapshot.

Deliver `assessment.md` separating what those records support from what they
do not, without inventing a corrected win rate from missing overlap data.
Deliver `next-study.json` with a practical matched design: caller/task sampling,
fixed snapshots, randomization/counterbalancing, scorer blinding, failure/time
handling, quality and cost measures, and the actual adoption decision it would
inform. Keep the study finite and proportionate, not a universal proof quest.
Deliver `used-methods.json` listing only the entrypoints and references actually
read. Do not write that a proposed evaluation has happened.
