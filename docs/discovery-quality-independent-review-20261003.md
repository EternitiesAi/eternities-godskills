# Independent discovery review, 2026-10-03

**Disposition: REPAIR.** The candidate reproduces the five intended development fixes and preserves the checked structural and authority boundaries, but its new bonus introduces a confirmed top-1 regression when the request explicitly excludes voice rewriting. Repair that bounded defect before adoption; the parent may retain this exact frozen version for the preregistered evaluation, with the defect disclosed. This report does not authorize changing the frozen comparison, merging, installation, or universal qualification.

## Reviewed identity and scope

Baseline: `311dd839c273dffb3d994cfc9712374afac61624`. Candidate: `d24bc3ec5a74f6e421b4c23ca07d5defb8d42825`. Parent cherry-pick resolves locally to `8a8a35f0f50b81990f455a8103db3d191846c301`; all four changed file bytes match the candidate commit.

Portable snapshot: `C:/Users/Dom/.codex/operations/godskills-quality-20261003/candidate-frozen-v1/godskills`, release ID `914063dad3d3b7acdc9ad527cf720c1ab11f7dfced30ec4fd47674c237fddd0c`. The release ID was recomputed from its manifest's canonical file-map bytes. The actual discovery/product modules match the candidate commit, and the actual 74-entry catalog matches baseline exactly. This is a check of manifest identity and selected bytes, not a full inventory/content certification.

The review read the four changed files and the necessary original search/tokenization, CLI search/route, and authority boundaries. Behavioral controls called the actual baseline and frozen candidate `searchCatalog`/`routeTask`, with identical frozen catalog input, under Node `v24.18.0` on Windows. No substitute scoring implementation was used. Fixture authorship finished before candidate inspection. Fixture commit `02a43b423553ede5da8c72427c24b5eb1bfe9dba` and its four file bytes remain protected. No private evaluation output, repaired-harness live draft, provider, agent, corpus, installed skill, or live installation was accessed or changed.

SHA-256 source receipts:

| Source | SHA-256 |
| --- | --- |
| Candidate `product/lib/discovery.mjs` | `25f1ec494b4c6462331faa5db851bc2b641b488062c510d8bc3a2ce6091657b6` |
| Candidate `product/lib/product.mjs` | `49dd26b6fd1aa83139777de189f2d5e56065ac4d1dcbada7bc48f5de73267d60` |
| Candidate `tests/discovery-quality-20261003.test.mjs` | `b3a15df5ad8ab55e5da8105a190c55a9a3188c85c6fc971fbe4e2895598da9fd` |
| Candidate `docs/discovery-quality-20261003-implementation.md` | `c176d3c2763cf13f35aaec72ad6730ed02b5484ac74f0ae8533e1a1274db0238` |
| Baseline `product/lib/product.mjs` | `1e99a9e68317fa01121f81e363860cd28e17e5b19c7aedc8522d949e7025ad79` |
| Baseline/frozen `product/catalog.json` | `02af51a684ac09320f8ec9037c8a543c571ab381b299655b02147309e769009c` |
| Frozen `release.json` | `cf0d4de8425fee187098105b5dcf6fbda118e7b7e0b6d8e0ddac651a848a3637` |
| Unchanged adjacent `product/bin/godskills.mjs` | `2bfd79da8efc81a5c4b65556e042bd89bcbd5b06d75d8e1020dbc9a8ebac5685` |
| Unchanged adjacent `product/lib/method-directory.mjs` | `22e1f0a6c16fcd04a3ff9029cabc3c7390381d3ac6bd89a45a395655f6a44180` |

## Confirmed finding

**P2 — Negated voice instruction gets a positive intent bonus and displaces the correct adjacent specialist.** Reproducer, with the exact catalog above:

```text
Do not rewrite in my voice; compare implementations and errors.
```

| Implementation | First result | Score | Second result | Score |
| --- | --- | ---: | --- | ---: |
| Baseline | semantic-implementation-diff | 90.940 | voice-style-calibration | 65.824 |
| Candidate | voice-style-calibration | 125.824 | semantic-implementation-diff | 90.940 |

The candidate explicitly reports `Lexical intent: written authorial voice; cues: authorial style, text adaptation`. In `discovery.mjs`, `lexicalQueryEvidence` tests cue existence anywhere in normalized request text; it does not distinguish an excluded instruction from the requested action. `lexicalIntentMatch` then adds 60 points when voice metadata matches. `product.mjs::searchCatalog` applies that bonus after its literal anti-trigger check, whose phrases do not catch this ordinary negation. Thus this is an introduced ranking regression, not merely a pre-existing failure to abstain. It repeats deterministically across five additional calls.

Removing the excluded clause leaves `Compare implementations and errors.` first-ranked as semantic-implementation-diff, 65.477, in both versions. The positive control `Rewrite in my voice.` receives the intended voice bonus (50.926 to 110.926). These controls isolate the faulty treatment of the excluded clause. The implementation note acknowledges general negation/quotation limitations, but acknowledgment does not eliminate this measured regression. Before adopting a repaired version, constrain intent evidence to avoid this excluded action and add a regression covering the competing affirmative task; rerun the positive control. No code was tuned in this review.

## Confirmed behavior and limits

Twenty distinct reviewer control queries were exercised: five fresh positive intent cases, a DSP specialist case, unknown and stop-only cases, misleading/quoted/negated wording, unrelated media terms, an unseen name-based paraphrase, and four minimization controls. The five fresh positives already ranked correctly at baseline and received the intended bonus; they demonstrate execution, not independent quality gains. Separately, replay of the builder's five public development examples changed all five incorrect/absent baseline top-1 results to their stated owners. Those examples remain development evidence, not held-out qualification.

All 74 exact-ID lookups remained first-ranked. Three valid result limits respected their bounds; four invalid query inputs and three invalid limits were rejected. The tested category filter and literal anti-trigger remained effective, the catalog was unchanged, and outputs retained `authority: none` and `activation: none`. Supplied-only Atlas routing remained rejected and incomplete task facts remained on hold. A concrete DSP control returned the same specialist and scores in both versions. Static inspection confirms that the five new profiles use request/metadata regular expressions rather than skill-ID or complete-query lookup keys, retain the existing weighted search path, and cap combined intent bonus at 60.

Two additional limits were observed without treating them as new regressions. `Use Elena's past emails to revise this paragraph so it feels like Elena wrote it, without adding facts.` gets no intent boost and incorrectly ranks workbook engineering first in both versions. `Rewrite our update in my own voice. Preserve the facts about the speech therapy fundraiser.` has its voice boost disabled by the unrelated word `speech`; both versions rank portable speech alignment first in an equal-score tie with voice calibration (50.926). The global media exclusion also suppresses interpersonal evidence when an unrelated event speaker is mentioned. These finite English rules cannot establish semantic applicability or comprehensive paraphrase coverage. Quoted and negated continuity/recovery instructions can also receive boosts; controls showed reinforcement of existing false positives rather than an additional baseline-correct top-1 regression.

The builder's complete 42-test and 103-test counts were not independently rerun. Its final portable-pack test builds/writes a temporary pack, outside this report-only mutation scope. The CLI search boundary calls `verifyProduct`, which inventories and inspects all skill bodies; full CLI/pack validation was deliberately not executed under the restricted read scope. Selected module/catalog/manifest hashes do not substitute for that gate. No latency benchmark, full-suite result, model-outcome score, installation state, or repaired-harness claim is inferred from this review. Parent-owned held-out scoring and full portable verification remain separate gates.
