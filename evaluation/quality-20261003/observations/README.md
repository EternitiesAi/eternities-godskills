# October 3 synthetic quality observations

This directory freezes 12 completed final answers and two blinded model
assessments. `packet.json`, both judge JSON files and the retrieval observations
retain their original bytes. `execution-summary.json` and
`unblinded-mapping.json` are safe public projections with original-source hashes;
private credentials, raw event streams and hidden reasoning are not included.
`manifest.json` binds these observation files. Human review remains unavailable.

`paired-analysis.json` was recomputed with the independently reviewed scorer;
its pairs, effects and usage exactly match the private original. Its descriptive
point-score ranges do **not** include assessor 2's alternative score ranges.
`assessor-uncertainty-envelope.json` separately includes those recorded ranges
without changing any grade. Neither file supports a universal superiority claim.
Read the [qualified interpretation](../../../docs/product-quality-qualification-20261003.md).

From the repository root, reproduce the point-score arithmetic into a **new**
output path (the scorer refuses to overwrite existing results):

```text
node evaluation/quality-20261003/analysis/score-blind-results-v2.mjs evaluation/quality-20261003/fixtures.json evaluation/quality-20261003/rubric.json evaluation/quality-20261003/observations/packet.json evaluation/quality-20261003/observations/unblinded-mapping.json evaluation/quality-20261003/observations/execution-summary.json evaluation/quality-20261003/observations/judge-1.json evaluation/quality-20261003/observations/judge-2.json <NEW_OUTPUT_JSON>
```

This is deterministic local analysis, not a new model run. Do not execute the
preserved defective v1 scorer as the current method. The final scorer, its initial
REPAIR report and repaired narrow READY report are preserved in `../analysis/`.

Retrieval labels:

- `fresh-retrieval-v1.json`: initial candidate's 30 independently authored
  probes; one extra positive top-1 hit, zero negative abstentions in both arms.
- `development-retrieval-v2.json`: replay after inspecting those probes and
  applying a narrow repair; **not held out**.
- `fresh-boundary-v3.json`: newly authored independent boundary probes; negative
  abstention still failed. Its versioned fixture is `../boundary-holdout-v2.json`.

Root and Linux receipts identify their original environments and source versions.
Absolute paths in those historical receipts are provenance, not runtime
dependencies of the portable product. They are preserved rather than edited into
fresh-machine claims.
