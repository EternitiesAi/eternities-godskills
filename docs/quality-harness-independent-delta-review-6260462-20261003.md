# Independent harness metadata/portability delta review, October 3, 2026

Disposition: **REPAIR narrowly: scope the new timestamp exclusion to actual message provenance, not an identically named object inside content.** The intended metadata repair and portable controls work, but a bounded synthetic content-field control confirms an introduced weakening of captured-reference comparison. No real capture is alleged to contain that shape, and no provider or execution-output inspection occurred.

## Source identity and scope

Reviewed only `108c7f566bd44a167d9175c852784a18f7e09866` to its direct child `626046258ae9cb1e4011c564d52d9c4446600b00` in `C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003`. The baseline harness SHA-256 is `3bbc6c29bc4b4367ffbb766ec062ba0f56a7ed22088f650db3fc64bd07e85ccb`, identical to the previously reviewed implementation. This delta changes only the canonicalizer, two metadata controls, reviewer-control relocation/hash/import paths, and a launcher amendment.

| Final source | SHA-256 |
| --- | --- |
| `scripts/quality-evaluation-harness.mjs` | `bf3597564b64583223372cc1aef558e77ee795bb731ba52a48a29c0a26e9d08e` |
| `tests/quality-evaluation-harness.test.mjs` | `70ce5065a9ce203166ce1e8b81b3c2fcc876e6257ac0f6e2c4858982d7f3c1be` |
| `tests/helpers/quality-harness-lab.mjs` | `84195803dbdd33f2f50ef12f154e7770b3e1fcd6a5aa3d06a39ad8175e95a638` |
| `tests/quality-harness-independent-review-v2.test.mjs` | `54f0a9939ba10a205777d0cd2691ee2ae882f4208da843e2a858975af0c41808` |
| `evaluation/quality-20261003/review-controls/quality-harness-independent-review-v2.mjs` | `80cf3c57483b832ee61b22f7283b96d8c63dd664840fb8fbda2147083e8f9e6d` |
| `evaluation/quality-20261003/launcher-amendment-v2-20261003.md` | `2d96abbec9503be1b60e18c0d901c4a9bf788913434e5ae2f3b34bf1a8850ea8` |

The six parent files matched the committed bytes. Five executable/archive files were copied into a new disposable temporary root; copied hashes were rechecked after tests. Only this new report is committed in the independent worktree. Semantic-implementation-diff guidance informed matched before/after boundary checks; counterbalanced evaluation guidance preserved the distinction between launcher failure, accepted invocation and scored outcome.

## Confirmed path-scoping defect

At harness lines 40–45, `canonical(value,parentKey)` recursively supplies each property's name as the next `parentKey`. The new filter therefore suppresses `create_time` whenever its immediate container has the name `internal_chat_message_metadata_passthrough`, regardless of where that container occurs. It does not bind the exception to the actual message-level provenance object used by `capturedInput`.

Minimal changed content shape, with otherwise identical valid synthetic captures:

```js
reference[0].content[0].internal_chat_message_metadata_passthrough = {create_time: 100};
capture[0].content[0].internal_chat_message_metadata_passthrough = {create_time: 101};
```

This is inside an `input_text` content item, not the message's provenance metadata. `capturedInput` retains the extra content property; before the repair, full-reference comparison rejects its drift. After the repair, it is silently normalized away.

Matched pure-function controls loaded both exact implementations through Node VM modules, with real spawn forbidden:

| Synthetic comparison | Before valid | After valid | Assessment |
| --- | --- | --- | --- |
| Identical valid capture | true | true | Preserved |
| Actual message metadata `create_time` differs | false | true | Intended repair |
| Direct content-item `create_time` differs | false | false | Preserved |
| Content text containing `create_time` differs | false | false | Preserved |
| Message-level `create_time` outside metadata differs | false | false | Preserved |
| Metadata-named object inside content differs | false | true | Introduced content-comparison weakening |

The actual repaired `runEvaluation`, using the reviewed fake-CLI laboratory, also accepted that last case: **12 completed synthetic jobs, 12 fake exec calls, all isolation records valid**. No real CLI/model call was made. Reproduce from a copied root containing the pinned harness/helper:

```powershell
node --input-type=module -e 'import{probe}from"./tests/helpers/quality-harness-lab.mjs";console.log(JSON.stringify(probe(async lab=>{lab.reference[0].content[0].internal_chat_message_metadata_passthrough={create_time:100};await lab.put(lab.referencePath,lab.reference);lab.control.prefix=structuredClone(lab.reference);lab.control.prefix[0].content[0].internal_chat_message_metadata_passthrough.create_time=101;const states=await lab.run();return{completed:states.filter(s=>s.status==="completed").length,syntheticExecCalls:lab.calls.filter(c=>c.args[0]==="exec").length,isolationValid:states.every(s=>s.isolation.valid)};})));'
```

The repair can remain small: identify the actual message-provenance location for this exception, or fail closed on such content nesting. Do not add `create_time` to a global ignored-key set. Keep actual metadata drift accepted while both direct and nested content drift remain significant. This is a boundary correction, not a request for an adversarial runner or broader redesign.

## What passed and remains preserved

In the copied root, Windows / Node `v24.18.0`:

```powershell
node --test --test-reporter=spec
node --check scripts/quality-evaluation-harness.mjs
node --check tests/quality-harness-independent-review-v2.test.mjs
```

Default root discovery ran **67/67 tests**, zero failed/skipped/cancelled, exit 0; duration 18,394.7109 ms. Both syntax checks exited 0. The archive was not discovered. This exercises checkout-relative resolution without relying on the author-worktree import, but is not a full-repository root-suite certification.

The copied-source root remains at `C:/Users/Dom/AppData/Local/Temp/godskills-harness-delta-6260462-e0f9c039032e43f59299b96c92feb73b`: cleanup was blocked by tool policy, and no alternate deletion mechanism was attempted. It contains only the five pinned source/archive copies, not formal-run artifacts or user task data.

The archived original control file is byte-identical to my prior committed test, including its historical absolute import. The current executable test uses the local helper and checkout-relative URL root, pins the supplied repaired harness hash, and retains all four test/assertion bodies byte-for-byte. The helper is unchanged. No tuning or source edits were performed by this review.

Original findings 1–4 retain unchanged implementation and passing controls: complete identity/receipt-bound replay, exclusive operation ownership and unique ordinals, shared halt/wave settlement with in-flight preservation, and nonblank terminal/result coherence with invalid/retained-outcome handling. Full original task IDs remain bound. Finding 5 retains all prior provenance checks and truthful labels; the exception above prevents accepting its new normalization boundary as fully closed. Ordinary metadata drift is repaired, not a general weakening of all text checks.

## Invocation and evidence limits

The committed amendment describes formal-v1 as six rejected debug preflights, no exec/results or accepted model calls, with the original operation preserved. It requires a new operation and fresh contexts for both members of every pair, not replay or selective retry of accepted answers. These are parent-recorded facts and procedures, **not independently verified live receipts**: no formal-v1 directory, preflight capture, approved reference, task, answer, auth or provider was opened. The report does not turn the passing synthetic metadata case into verification of the six real prefixes.

The amendment retains fixture/source-guidance identities, six-pair denominator, two-wave schedule and outcome thresholds; this delta does not change those implementation gates. The harness hash is identity-bound, so the new version does not silently reuse an old manifest's accepted jobs. No accepted-call retry or formal dispatch was performed here.

All prior reports, fixtures/rubric and original reviewer-control bytes in my worktree remain unchanged. Factory-four baseline, captured-preflight-only scope, requested Luna/max/provider versus unknown served model, live CLI/SQLite uncertainty, soft output limit and absence of a hard token ceiling remain as previously documented. Parent owns repair, integration, immutable inputs, formal dispatch and scoring. READY requires closing this one demonstrated content-path collision; no broader defect or live contamination claim is made.
