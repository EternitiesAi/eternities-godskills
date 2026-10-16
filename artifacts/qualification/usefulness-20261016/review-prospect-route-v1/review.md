# Prospect-route disposition

**READY** for one narrowly scoped test expectation update: in tests/wave29-atlas-serving-time-ranking-trace-v2.test.mjs, change the prospect case's expected owner from eternities-prometheus to eternities-agora and replace its historical comment with the evidence note below. Preserve product behavior, the Atlas exclusion assertion and every other case. No product or test file was edited here.

## Why this is evolution, not a regression

Agora's actual entrypoint already owned prospect assessment before this release: rapid or multidimensional screening, target/dimensions/weights/coverage before ranking, and explicit inputs, normalization, contributions and effective denominators. Prometheus is the broader product-operations classifier and commercial-analytics route. Prioritizing prospective enterprise accounts by commercial fit and buying intent is therefore a direct Agora job, not a reason to force its broad router first.

The v2 test itself says the historical canonical result missed Agora and that the guard protected against Atlas intrusion. Existing tests corroborate this contract: the original wave29 test expects Agora for weighted business-prospect scoring; v3 expects Agora for direct prospect assessment and, for this exact paraphrase, protects only against Atlas displacing the owner.

The observed change comes from the intentionally added, general Agora trigger "commercial discovery questions that distinguish problem fit and adoption feasibility." It is not a query-specific override or a newly invented ownership rule. Baseline Prometheus scored 27.025 on "commercial"; candidate Agora scores 46.579 on "commercial, fit." Historical first place was tied with unrelated lexical hits, not evidence that Prometheus uniquely owned the task. Atlas is absent from the top ten in both versions for the failing case.

## Bounded comparison

Baseline commit: 7c7f2ac98a282ccb2e59c3a4c0424802a4dd72b5. Candidate is release ID 6fa86b80b1a2bb015ea3d747f990da14c763b359912c3a7954499be66817d574, confirmed in product/release.json and the parent receipt; it is not a Git commit. Node v24.18.0.

| Case | Baseline top | Candidate top |
| --- | --- | --- |
| Exact failing prospect paraphrase | Prometheus | Agora |
| Existing direct prospect assessment | Agora | Agora |
| Existing weighted prospect scoring | Agora | Agora |
| Fresh sales-discovery prospect paraphrase | app-store-discovery-experiments | Agora |
| Commercial-driver explanation | Prometheus | Prometheus |
| Search-result reranking | retrieval-grounded-answering | retrieval-grounded-answering |
| Per-request recommendation trace | Atlas | Atlas |
| Literal lowercasing, no workflow requested | abstain | abstain |
| Explicit host need=none | abstain | abstain |

Nine fixtures were replayed in five in-memory configurations (45 observations): baseline runtime/catalog, current runtime/catalog, each cross-pair, and current with only Agora's added trigger removed. Cross-pairs follow the catalog, not the runtime. Removing that trigger restores both historical prospect-paraphrase misses. The search/discovery/selection implementations are byte-identical; the separate request-scope change only adds refused fix/debug verbs and did not cause these observations. All observations retain authority=none and activation=none; ordinary hits remain review-required candidates, not automatically selected skills.

A focused name-filtered run of the three wave29 files executed four tests: three passed and the one historical v2 expectation failed with actual Agora versus expected Prometheus. The other six cases in that failing test completed before its final prospect assertion. The parent full-suite receipt reports 1951 tests, 1948 pass, 1 fail, 2 skip; that suite was not rerun. Exact commands, observations and file identities are bound in receipt.json.

## Suggested replacement comment

"Baseline 7c7f2ac returned Prometheus for this paraphrase despite Agora's existing prospect-assessment ownership. The usefulness release's general commercial-discovery metadata makes Agora first. Preserve the Atlas exclusion guard; independent disposition and exact catalog/runtime bindings are in artifacts/qualification/usefulness-20261016/review-prospect-route-v1/."

Change only the expected owner and this evidence comment. This review has not applied the edit or produced a green rerun after it. No broad routing fix, ranking change or full-suite rerun is justified by this failure.

Limits: a small lexical comparison cannot prove every paraphrase or semantic selection correct. No real prospect assessment, buying-intent inference, external account action, source research, evaluator task, provider or descendant was performed. The semantic-diff skill kept runtime and catalog effects separate; verification guidance kept the existing red test and parent's suite result explicit. This READY applies to the expectation disposition, not a release-wide pass.
