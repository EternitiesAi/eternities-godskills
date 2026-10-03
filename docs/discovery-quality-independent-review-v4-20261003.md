# Independent discovery review v4, 2026-10-03

**Disposition: REPAIR.** V4 fixes the confirmed article/quoted-substep false abstentions and retains the negated-voice repair. Its broader workflow guard introduces over-selection on explicit literal case-conversion requests that v3 correctly rejected: workflow words inside the supplied literal bypass the micro-task boundary. This is a narrow regression in a previously supported request format, not a demand for general semantic classification. Preserve the frozen observations and previous REPAIR reports; no source tuning was performed.

## Exact identity and scope

Parent commit: `2ed27d658b3fba15e82965dc6af313fad90d3794`. Snapshot: `C:/Users/Dom/.codex/operations/godskills-quality-20261003/candidate-frozen-v4/godskills`; release ID `abb1cc04e718d5752366cd1d1608fca6da5f616eb16fd255b50a08a90c2f4abb`. The three focused modules match the commit bytes. Discovery and product modules are byte-identical to v3; the reviewed behavioral delta is the selection-boundary workflow-object regex, plus three test cases. The 74-entry catalog is unchanged from baseline `311dd839c273dffb3d994cfc9712374afac61624`. Release identity was recomputed from the manifest file map; full content inventory was not certified.

| Source | SHA-256 |
| --- | --- |
| `product/lib/selection-boundary.mjs` | `dc3b0411968900e9e515159a151062ac5b36ed5f6091f1210d2e8712667e4256` |
| `product/lib/discovery.mjs` | `c6a76c8d27d204d24750ea6e937998a49d1d79d678c1fed0405891116a166652` |
| `product/lib/product.mjs` | `0291b997a8ce9a17225b3b5d43b0f743ddd116af1f5d5c796440bc3b7f89b51d` |
| `tests/discovery-selection-boundary-20261003.test.mjs` | `a1f39b2c996a558c389ac253002c33a9ec444818358e2d5cc9493f17c432e1e8` |
| `tests/discovery-quality-20261003.test.mjs` | `c58636d571580b4f8dc93d9006136efb9e2ed4f2bf0029b2e39c51f09b420fb5` |
| Snapshot `catalog.json` | `02af51a684ac09320f8ec9037c8a543c571ab381b299655b02147309e769009c` |
| Snapshot `release.json` | `3907981e9e27fc8b3a26292493b5f7e26b5f0286295aa21c586c46560e6b8842` |

## Confirmed outcomes

Using the actual frozen v3/v4 functions with identical catalog input on Windows/Node `v24.18.0`, the article-free and article-bearing audits now both select completeness-and-consistency-audit at 108.487. The quoted counting-substep audit selects that owner at 119.544; the expanded release-obligation audit selects it at 131.203. The original negated-voice reproducer retains semantic-implementation-diff first at 90.940. Ordinary arithmetic and literal lowercase controls still abstain, explicit clarification-before-selection still abstains, active word-count implementation and implementation-comparison controls retain results, and all 74 exact IDs remain first-ranked.

**P2 — Supplied literal text is mistaken for an active workflow object.** Minimal control:

```text
Uppercase the literal text "compare requirements". Give only the text.
```

V3 returns no results with `explicit-limited-micro-task`. V4 returns docx-package-redline-and-render-verification first at 40.113 and eternities-architect second at 29.704, with no abstention reason. `Lowercase the literal text "AUDIT OBLIGATIONS". Give only the text.` similarly changes from v3 abstention to v4 selections (DOCX 40.113; completeness audit 34.173). Neither asks to perform the quoted comparison/audit or edit a DOCX package.

`selection-boundary.mjs:8-9` tests a workflow verb followed by any letter anywhere in normalized input, before examining the explicit literal operation. It therefore treats quoted payload words as the request's action and bypasses the unchanged micro-task checks. The same expanded guard also bypasses arithmetic abstention for `Do not compare implementations. Calculate 6 minus 4. Only the result.`, returning semantic-implementation-diff at 42.761. These are introduced over-selections compared with v3; the case-conversion reproducer alone supports the disposition. Before adoption, keep workflow-object evidence separate from explicitly supplied literal payloads while retaining the positive audit controls. A full negation/quotation classifier is not required to characterize this bounded defect; no proposed implementation was tested or tuned here.

## Verification and limits

Thirteen reviewer controls were executed; none was taken from the fresh twelve-case holdout. The two supplied test files were executed against the frozen module/catalog with imports/URLs relocated only in memory: **60 passed, zero failed, one skipped, 61 registered**. The skip is the temporary-pack rebuild/CLI verification test, which writes and inventories the complete pack; parent owns full-pack checks. Other assertions were unchanged. Outputs retain `authority: none` and `activation: none`; over-selection does not itself grant permission or activate a skill.

Parent reports the already-retained fresh holdout observation as six of six positives and zero of six negative abstentions for both baseline and candidate. That aggregate was supplied by the parent, not independently inspected or rerun here, and is not generalized to semantic applicability or abstention reliability. No model output, harness live draft, full repository/context research, providers, agents, acquisition, installation, merge, or push was involved. All original fixtures, fresh holdout bytes, and previous review reports remain unchanged. The report establishes these specific repaired cases and this specific new regression; broader evaluation and the frozen repaired-harness review remain separate.
