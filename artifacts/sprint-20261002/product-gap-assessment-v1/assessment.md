# Product finalization architecture/usability assessment v1

Outcome: **two high-leverage, nonblocking product omissions warrant scoped changes.**
This is an independent architecture/usability assessment, not product authorship,
integration approval, a performance qualification, or another source-intake audit.

## Exact boundary

Canonical main: 55f960847fa2a06a750a1a6e20c4e7f95ea10449.
Canonical release: 61334aee865e67b815cce14dd6dd63078653282dfabac6342f1a31de163a0bfe.
Assessed accepted combination: 8a0b084d2dc08d966299678bceac6bd54343be21d2b215f00b8e0daa7f37d94b;
68 parent skills, 21 categories, 195 payload files plus release.json.

Atlas v3 exact metadata/method, Arcadia v2 exact method, and distribution v2
exporter hashes match their sealed scoped READY inputs. Integration is parent
owned. This snapshot is not a claim that every future combined byte was reviewed.

The parent worktree advanced while evidence was collected. Its copied snapshot
differed from the accepted manifest only in the Phoenix entrypoint, which the
parent identified as separately under review. That one *fixture-only* file was
restored from its canonical Git object using apply_patch. The isolated snapshot
then passed verifyProduct and every payload matched the retained accepted
manifest. No parent product bytes were changed; Phoenix's new fit was not reviewed.
Later parent-authored creative changes are outside this snapshot and this report.

## G1 — bundled methods are difficult to find and the result stops before their load path

Priority: first. Real caller: a Markdown-only user or a CLI-assisted agent trying
to select one method, not read all broad skill bodies.

Observed evidence:

- Q1, "Map gameplay states to audio cues with muted alternatives and priority
  interruption": audio-dsp-integrity-review ranks first at 49.577; Arcadia ranks
  second at 40.916 on both canonical main and the accepted combination.
- Q2, the bundled title "game-state to audio-cue design": DSP review still ranks
  first (49.577), Arcadia second (35.553). This is not a request to inspect supplied
  DSP code; the Arcadia method is the route owned by the actual task.
- Q3, "Who authored, reviewed, approved, or challenged this exact artifact
  version?": Oracle is absent from the top five although Oracle/SKILL.md:25
  explicitly owns the DRAFT artifact-role evidence method. The first match is
  approval-bound-private-session-mining, not that method.
- INDEX.md:75 presents Arcadia's broad summary without its cue method; the
  Oracle entry likewise omits artifact-role vocabulary. All four inspected
  broad owners' index entries omit the exact tested method titles.
- product/lib/product.mjs:81 carries bundled resources into catalog.json;
  :160 drops them from search results. Actual exact-ID result objects for Atlas,
  Arcadia, Oracle and Mnemosyne contain neither resources nor method status.
  Atlas has 14 catalog resources, including executable/checker fixtures, so
  returning the entire list would not by itself solve smallest-reference loading.
- Q4 is a useful positive control: the serving trace changes from no Atlas in
  the canonical top five to Atlas first (191.278) with its accepted scoped
  metadata. Q5's additive migration owner and Q6's DSP specialist remain first.
  Six cases are examples, not a discovery-accuracy benchmark.

Impact: a user can select an adjacent but irrelevant specialist, fail to find a
shipped method, or discover the broad owner but still have to inspect another
metadata layer to identify the conditional method. The agent can compensate by
reading SKILL.md; this is usability friction, not permission to auto-select.

Smallest realistic change, estimated 45–75 minutes:
ship a compact, first-party product/METHODS.v1.md linked beside INDEX.md.
Start with a bounded set: the two newly accepted methods and the already shipped
Oracle artifact-role / Mnemosyne lifecycle DRAFTs, clearly preserving their
distinct review states. Each row gives ordinary task wording, owner entrypoint,
one conditional method link/anchor, exclusions, and a status pointer. Do not
index source obligations or copy source bodies. This solves the Markdown-only
caller without a scorer rewrite or mandatory Node.

Optionally add one bounded method-discovery command or scoped trigger repair
later, but it is not required for this sprint fix. Do not flatten all resources
into mandatory dependencies. A methods directory must still instruct the user
to read the selected complete SKILL.md before the conditional method.

Acceptance: from only portable README -> METHODS -> chosen SKILL -> chosen
method, Q1/Q2 and Q3 reach the declared method without opening unrelated skill
bodies. DSP-code review still leads to DSP review; source-access approval is not
artifact approval; Atlas's trace is not business/prospect scoring, scientific
validation or a schema-only check. These are a few real caller paths, not a new
generic harness.

## G2 — a frozen DRAFT label cannot convey independent document review separately from execution evidence

Priority: alongside G1. Real caller: a recipient deciding whether a shipped
method is usable reviewed guidance or an unreviewed proposal, and whether it
has ever been qualified for outcomes.

Exact support:

- product/README.md:129–134 defines instruction-reviewed at the parent skill
  level, and says a DRAFT remains a proposal until separately reviewed and
  accepted. INDEX.md:3 says all entries are instruction-reviewed.
- Atlas's method :3 remains "DRAFT — independent first-party method candidate";
  Arcadia's method title and final paragraph remain DRAFT. Their frozen reviewed
  bytes should not silently be relabeled.
- Atlas method SHA-256:
  4a4ed718c0879126b1d30cf9c2f2c5f469cbe730e72d4103e9784ee5a7c5a496.
  Its independent READY receipt SHA-256:
  d6acb24533810b956f05ef8aa9f72ca9caba40a83e5ac5992b97664cdff9ffa4.
  READY approves that documented DRAFT trace and scoped lexical routing only,
  not a runtime ranker, relevance, fairness, exposure or performance.
- Arcadia method SHA-256:
  f7eac8b067c0e4d46e2464e22d4d26db28572d24223a7af1114197cb9517935f.
  Its non-author READY receipt SHA-256:
  fceb06922f496de2e2861725f25a3e9d3e24a5840cbe9c68e613099d9b2fed57.
  The receipt expressly records gameOrAudioRuntimeExecuted:false and
  humanPlayOrListeningPerformed:false. Three compact planning packets support
  instruction use, not audibility, play quality or accessibility certification.
- The 68 catalog records have the single parent maturity instruction-reviewed.
  Resources have path/hash, not method review/execution state. The portable pack
  does not contain these sprint review receipts; the evidence is outside the
  receiving pack. Provenance strings are authoring history, not a review-status
  interface (README.md:168–171).
- Atlas's summary does expose DRAFT. Thus the current product is cautious, not
  hiding a performance claim. The omission is the *positive*, narrower fact that
  exact guidance was independently reviewed while runtime qualification remains
  absent; users should not have to reconstruct repository history to learn it.

Warranted narrow versioned change, estimated 30–60 minutes:
add product/METHOD-STATUS.v1.md (or combine its table with METHODS.v1.md).
Keep existing method bodies, parent maturity, source obligations and historical
receipts unchanged. Add only two confirmed method rows initially:

| Method | Document axis | Execution/outcome axis |
| --- | --- | --- |
| Atlas serving-time trace at the exact hash above | Independently document-reviewed for one-decision trace guidance; original body remains DRAFT | Package/lexical checks observed; runtime ranker and performance not qualified by this review |
| Arcadia cue planning at the exact hash above | Independently document-reviewed for bounded design/acceptance planning; original body remains DRAFT | Three planning packets; no game/audio runtime or human listening; outcomes not qualified |

Bind each row to resource content SHA, independent receipt SHA, exact approved
scope and actual evidence limits. A hash is byte consistency, not authenticity.
Display document-reviewed / not-performance-qualified together; do not compress
them into "approved", "production ready" or a score. Package execution, method
application and measured outcomes should remain separately named underneath
the second axis. Unreviewed bundled DRAFTs do not inherit either row's status.

README should explain that the immutable body label describes the original
candidate version, while the versioned status row records later review without
claiming runtime qualification. A changed resource hash makes its row stale
until a new scoped review binds the new bytes. Parent/release review must check
the *new overlay*; this assessment does not itself approve unwritten bytes.

Acceptance: a recipient with only the portable pack can answer (a) which exact
guidance was independently document-reviewed and for what scope, and (b) which
runtime/human/performance claims remain unsupported. Altering a resource makes
the old row visibly non-current. No need to relabel old receipts or add a broad
outcome harness.

## Why there is no third recommended project

Distribution v2 already addresses real transfer/setup friction. Its exporter
implementation hash remains the reviewed 62cb7442...ce0ba3; no export audit or
archive tests were repeated. Markdown-first use, relative bundled references,
explicit provider/authority limits and optional Node remain coherent.

The automated installer exposes all catalog skills; "install --only
eternities-arcadia" is refused before installer execution. This is an omission,
not a broken promise: README.md:19–23 already documents selective folder copy,
retaining references and preserving prior versions. Adding a selective
transactional installer now would expand staging/rollback risk. A one-sentence
"automated install exposes all 68; for a subset use the manual path" clarification
may be folded into onboarding, but it does not merit a third architecture task.

No 49k source obligations were counted as skills, disposed, acquired or cleared.
No standalone root/scope inflation or dependency requirement was found that
justifies another sprint project on this bounded evidence.

## Checks, limits and handoff

Command: node artifacts/sprint-20261002/product-gap-assessment-v1/evidence-probe.mjs
— exit 0. Six canonical/accepted-snapshot queries, three real search CLI calls
with empty PATH, two read-only pack validations, retained manifest-byte checks,
and the invalid selective-option check. git diff --check — exit 0.
No full suite, exporter replay, installer execution, provider or agent trial.

Initial fixture-copy and concurrent-Phoenix validation setup failures, plus an
oversized returned JSON truncation, are recorded in evidence.json as setup
history, not product defects. The final compact evidence is valid and complete;
earlier fixture directories remain recoverable.

Estimated changes are planning estimates, not measured delivery promises.
This same-host assessment does not prove Linux/macOS, native loader UI,
agent-quality improvement or universal routing. Curated Architect/Omnibus
guidance kept each defect tied to a real caller and smallest conditional load.
Parent owns implementation, exact-byte review and integration. No product bytes
authored or edited by this reviewer. Relay these two changes; do not self-apply.
