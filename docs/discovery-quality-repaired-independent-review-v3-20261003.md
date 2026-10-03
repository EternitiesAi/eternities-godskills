# Independent repaired-discovery review v3, 2026-10-03

**Disposition: REPAIR.** The prior introduced negated-voice ranking regression is fixed. The explicit selection boundary introduces a separate confirmed false abstention on a legitimate cross-document audit: adding only an article to the same request changes no-results into the intended audit selection. Repair this bounded issue before adoption. Preserve the frozen candidate and existing evaluation records; this review does not authorize source tuning, merge, installation, or replacement of the preregistered comparison.

## Identity and verification scope

Reviewed parent commit `613bb20869ca60d5af0dd6480dffca8461e40bbc`, inclusive of the original d24 implementation, explicit-boundary change, and negated-voice repair. Snapshot: `C:/Users/Dom/.codex/operations/godskills-quality-20261003/candidate-frozen-v3/godskills`; release ID `083bf1a63e357db964123f670803f066d4afc341f551f968f50405bad73e402f`. Its three changed modules match that commit byte-for-byte. Its 74-entry catalog matches baseline `311dd839c273dffb3d994cfc9712374afac61624`. Release identity was recomputed from the manifest's canonical file map; this is selected-byte/manifest verification, not full-pack verification.

| Source | SHA-256 |
| --- | --- |
| `product/lib/discovery.mjs` | `c6a76c8d27d204d24750ea6e937998a49d1d79d678c1fed0405891116a166652` |
| `product/lib/selection-boundary.mjs` | `7a1f1310bdfd83e876b0ffd1079e51a2741b22aa147ae6f17048327bdc67791d` |
| `product/lib/product.mjs` | `0291b997a8ce9a17225b3b5d43b0f743ddd116af1f5d5c796440bc3b7f89b51d` |
| `tests/discovery-quality-20261003.test.mjs` | `c58636d571580b4f8dc93d9006136efb9e2ed4f2bf0029b2e39c51f09b420fb5` |
| `tests/discovery-selection-boundary-20261003.test.mjs` | `b3284a09e21182d566ab54018ee2b0acc0360c138d1bca71d463b4c893e96994` |
| Snapshot `catalog.json` | `02af51a684ac09320f8ec9037c8a543c571ab381b299655b02147309e769009c` |
| Snapshot `release.json` | `379563efeeaa99be31f9fc0374950d924dd6b2f8cf07c1ddacb4d0e2f1987910` |

Read scope was the three focused modules, their two test files, and necessary original search/authority boundaries. Actual baseline, frozen v1, and frozen v3 search functions received identical catalog data under Windows/Node `v24.18.0`. Twelve reviewer controls were run separately from the fresh twelve-case boundary holdout; that holdout was not executed here. No private model outputs or repaired-harness draft were inspected.

## Confirmed repair and new finding

The prior reproducer, `Do not rewrite in my voice; compare implementations and errors.`, now ranks semantic-implementation-diff first at 90.940 and voice-style-calibration second at 65.824, without a written-voice intent reason. V1 incorrectly ranked voice first at 125.824. `Don't` and `Never` variants also recover baseline ordering. `Do not invent facts; rewrite this in my own voice using the samples.` retains its legitimate voice bonus and top result at 136.389. The new `discovery.mjs` negated-pattern guard therefore fixes the specific prior defect without suppressing this separate positive request. Arbitrary negation/quotation understanding remains unproven.

**P2 — Selection boundary hides an affirmative audit when its verb is followed by a plural object rather than a determiner.** Minimal observed pair:

```text
Audit obligations across documents and count the words; give only the findings.
Audit the obligations across documents and count the words; give only the findings.
```

| Request | Baseline top-1 | V1 top-1 | V3 |
| --- | --- | --- | --- |
| Without `the` | completeness-and-consistency-audit, 48.487 | completeness-and-consistency-audit, 108.487 | No results; `explicit-limited-micro-task` |
| With `the` | completeness-and-consistency-audit, 48.487 | completeness-and-consistency-audit, 108.487 | completeness-and-consistency-audit, 108.487 |

`selection-boundary.mjs:6-12` recognizes a workflow verb only when immediately followed by one of `a/an/the/this/our/my`. Without that determiner it proceeds to the limited-output and literal-operation checks. `give only` plus the subordinate `count the words` then classifies the entire substantive audit as a micro-task. `product.mjs::searchCatalog` returns early, so the valid audit intent and metadata are never examined. Output brevity and a counting substep do not remove the obligation/coverage workflow.

The stronger request `Audit obligations across the release documents, identify missing deliverables, and count the words in every mandatory section. Give only the findings.` likewise abstains; baseline and v1 select the audit at 71.203 and 131.203. A source-quotation variant, `Compare requirements across documents; the quoted checklist says "count the words". Give only the audit findings.`, also abstains, whereas baseline/v1 select the audit. The minimal false abstention was deterministic across five additional calls. These are introduced false negatives, not failures of the original lexical shortlist. Before adoption, preserve affirmative workflow selection when an incidental count or concise-output instruction is present, and add the article pair alongside a genuinely trivial counting control. No implementation change was made here.

## Tests, preserved boundaries, and limitations

The two supplied files register 58 tests. Executed them against the actual frozen v3 module/catalog by relocating only imports/URLs in memory; **57 passed, zero failed, one skipped**. The skipped test rebuilds and writes a temporary complete pack and invokes CLI verification. Its body was inspected but not executed; parent owns full-pack checks. Test assertions otherwise remained unchanged. Passing the supplied tests does not cover the new false-abstention controls above.

Checked behavior includes all 74 exact-ID lookups, filtering, literal anti-triggers, stable ties, immutable catalog input, query/limit validation, five development-owner fixes, and supplied positive/micro-task examples. Independent controls confirmed arithmetic and explicit clarification abstention, a genuine implementation-plan request retaining results, and unchanged concrete DSP selection. Outputs remain `authority: none` and `activation: none`; supplied-only Atlas routing is rejected and incomplete task facts remain on hold, including when search abstains.

The v1 REPAIR report, four original fixtures, and two fresh boundary-holdout files remain byte-identical to accepted commits/hashes. The fresh holdout, model scoring, full CLI/pack inventory, installation, and repaired-harness review remain parent-owned separate gates. No providers, new agents, model calls, source tuning, acquisitions, merge, push, or installation occurred. This bounded source/function review establishes the specific repair and specific regression, not broad performance superiority or complete semantic selection.
