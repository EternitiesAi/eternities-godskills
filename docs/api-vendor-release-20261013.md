# API-contract and vendor-decision refinement — 2026-10-13

## Scope

This published and locally installed release grows the portable product from 91 to 93 entrypoints.
It adds two focused methods without changing the previous 91 skill payloads:

- **API contract design and evolution:** reason about consumer/provider version
  pairs, absent versus null values, response variants, uncertain mutation
  outcomes, scoped replay keys, concurrent writes, pagination and migration.
- **Vendor evaluation and exit planning:** separate mandatory eligibility from
  preferences; compare demand, costs and commitments across one horizon; test
  portability and plan trials, renewal and exit without inventing evidence.

Each entrypoint links deeper methods only when useful. The root README places
the current download and setup before its collapsible release history. Neither
method requires Codex, a provider, the warehouse, the Keel or Godagents.

## Exact release and checks

Baseline: `7c11bb315c1db73415ef468748bf67cec59f17a1`, release
`213c0d2180e5613ba9b29dc0ea4732456f43e1a314874792e0f2e915014854c0`.
Corrected candidate: `af98f321c1497f6876b597a1bd21068fc5d62146`.
Content release: `27152ee22940ee5cb31958eebd34bec48213564d37acaf1c49d2c85a79a62ebc`.

- Six new positive routing cases initially failed; six no-need/neighbor controls
  passed. The first built candidate passed 63 focused checks.
- Its first full suite exposed a real false match: the isolated phrase
  `old right` selected the new API method solely through `old`. That result
  remains preserved: 1,735 passed, one failed and two existing skips; TAP SHA-256
  `5f2b323e5b9ce59f36ebc2bf1808565b51fac68be497e0d2ccccb347bab813a7`.
- A focused rerun reproduced the defect. Two new trigger phrases were narrowed
  to version terminology; no runtime, prior skill or assertion was changed.
  All 107 relevant checks then passed.
- Corrected full suite: **1,736 passed, zero failed, two existing Windows skips**
  out of 1,738 registered tests, in 134.3 seconds. TAP SHA-256:
  `2e781be4f74d177e5f181de4f25147ece4ed19f4d13c5cc6bc313175ca6db1de`.
  The skips cover unavailable symbolic-link creation and a cross-volume case;
  they are not newly verified behavior.
- Parent checked all 268 prior skill payload hashes, three protected activation
  files and two preserved user-experiment files: unchanged.
- A fresh ZIP extraction matched all 308 entries to the exact release manifest.
  From an empty unrelated directory, the extracted CLI validated the pack,
  found both specialists for paraphrased requests, honored `--need none`, and
  returned no match for the isolated-cue regression.

Archive: `godskills-product-20261013-27152ee2.zip`, 1,714,238 bytes, SHA-256
`9a642694c6f31525580874c3765ddf2ea98050e5e13ed3b6f3e2b8d2af4014a0`.
The superseded `ca5d2adb` candidate and its negative results remain private
historical evidence, not the current download.

## Independent review and applications

Separate GPT-6.1 Sol xhigh authors cross-reviewed the opposite lane. James's
vendor review accepted the unchanged three vendor files at `49338ae` (receipt
SHA-256 `27f36b1b26cf85b2408134a7e807eeb07c416f703c74ac59fc1e640ad2af7a14`).
Ohm's first API review retained **REPAIR** for the reproduced trigger defect
(receipt `70d4e6a327b54407fb3a5941186ca5adfe9ae978017218eb90cda0a058de5014`).
His separate delta review accepted `af98f32` after testing the correction and
rehashing the unchanged content and provenance (receipt
`8ac675f5723bfe9ced9f856bc6508995cd8b19e5190c3715ae362360a12d0f94`).
No historical receipt was rebound to changed bytes. Parent checked their exact
input/output records and the actual application artifacts, not only verdicts.

The parent specified two fictional briefs and expected observations before
dispatch. Each reviewer consumed the opposite-authored method and their assigned
brief without the parent expectation file. Both bounded applications met the
21 planned observations (12 API and nine vendor); this is not a statistical
quality score or a blinded comparison.

- The API application separated required-input and exhaustive-enum breaks,
  null/omission semantics, payload collisions, tenant isolation, duplicate
  ownership, expired replay guarantees and stale resource revisions. A concrete
  moving-sort-key example showed why an opaque cursor and tie-breaker alone do
  not guarantee full traversal. Contract/runtime checks remained proposed.
- The vendor application excluded a supplier that failed required export,
  kept another's promised export unresolved, excluded sunk spending and counted
  the incumbent's unavoidable commitment once. Operating totals were
  A $23,040 / B $30,900 / C $23,800; separate end-exit totals were
  $25,040 / $31,650 / $23,800. Independent monthly arithmetic and parent formula
  and component checks agreed. It recommended A on the supplied assumptions,
  with meaningful conditional price/evidence thresholds and no invented trial,
  purchase, notice, contract change or vendor contact.

These are source/content reviews and nonblinded instruction applications.
They do not establish live behavior or improvement over a raw model.

## Publication and local installation

Accepted integration commit `22d1ecedc50f1f9fef910eb7973d129f3ed9ab00` was
fast-forwarded into main after upstream reconciliation, then pushed and confirmed
as remote main. A second full run on that exact merged commit in the isolated
checkout passed **1,736 tests, zero failures, two existing skips** in 127.8 seconds;
TAP SHA-256 `06a4c6de05e0f128fc751be9abe96979609a30ccf33cc5c54088ec370af32cb6`.
This does not claim a separate full run in the canonical checkout path. Exporting
from canonical main reproduced the same archive hash as the reviewed worktree.

The journaled installer then upgraded the local native skills and runtime to the
exact 93-skill release. Parent before/after inventories verified **274 native
skill files and 308 runtime files**, and all **81 unrelated file/directory/link
records remained unchanged**. The fresh rollback backup matched the complete
previous **91-skill / 268-native-file / 302-runtime-file** installation, including
file membership and bytes. No material content was discarded.

Actual installed CLI validation returned the accepted release and 93 skills;
independently worded API and vendor requests selected their respective specialist
first, and both the isolated-cue and explicit no-need checks returned no matches.
The installer did not change model settings, global instructions or automation.
The historical automation remained paused. The user experiment and protected
activation files remained byte-exact. File installation and CLI discovery do not
prove that an already-open agent refreshed its cached skill catalog.

Subsequent closeout edits affect only documentation, not reviewed product bytes.
Detailed private before/after manifests, rollback journal, review receipts,
application artifacts and preserved negative TAP captures remain available to
the task owner; none is represented as a public third-party deployment audit.

## Evidence boundaries

Four complete existing source bodies informed original methods; exact body and
notice hashes, available revision identity, rejected recipes and unresolved
archive provenance are recorded in each specialist's `skill.json`. Research
inputs were inert: no acquired scripts ran and no source prose, examples or code
were imported. Original writing and observed notices do not certify rights.

Automated checks test package behavior and bounded discovery, not general
expertise. Application cases are authored fictional tasks, not blinded raw-agent
comparisons or live API, procurement, commercial or clean-OS qualification.
The wider quarry remains unfinished: frozen R10 still has 49,514 open identity
obligations and 163 conflicts; this release does not apply that ledger or claim
whole-corpus completion. Historical evidence and the paused automation remain
preserved.
