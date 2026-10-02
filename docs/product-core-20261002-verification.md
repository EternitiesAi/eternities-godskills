# October 2 portable core verification

Candidate identity: `2260b471f889f5c25b772fc50d4e83566fe8a4ef28a7748674241c8e80ffc348`.
It contains 68 parent skill entrypoints, 186 managed skill files and 205 runtime
payload files, plus the release manifest. This record currently covers verified
local preparation; combined independent review, remote publication and actual
installation remain distinct subsequent gates.

## Executable checks

An explicit inventory of all 247 real top-level test files was passed to Node's
test runner with concurrency four. The first run had 1,158 passes, three failures
and one skip. All three failures referenced the same absent isolated-worktree
file: the historical receipt's pinned Acorn parser. The already installed
canonical Acorn 8.18.0 was copied into this worktree only after its parser bytes
matched the frozen receipt SHA-256
`953573b8fdab71599749ea5f2b33d3e760c2116178f9423ee7458dbe39d59453`.
No network install, package lifecycle script or historical receipt alteration was
used. The two affected test files then passed all six tests.

The complete repeated suite passed: **1,161 passed, zero failed, one skipped**,
1,162 tests in total. The skipped test could not create a leaf symbolic link on
this Windows account. It is not represented as passing. The separate cross-volume
installation-refusal fixture was enabled on the connected D: volume. TAP receipts:

- Initial failure log SHA-256:
  `10c620cf9367628796f7a59b44c06f31cedb229e30e2914eeae5c852dcb291c6`.
- Complete repaired run SHA-256:
  `2a227269dbaaf12559448f02f63ae0893d184c57702cc1fc08333fc576e6d356`.

The portable product does not include Acorn or any dependency installation.
Its optional CLI uses Node built-ins; Markdown use requires no Node or provider.

## Protected evidence

The three protected files remain byte-identical to the canonical baseline:

| File | SHA-256 |
| --- | --- |
| `src/adaptive-activation.mjs` | `9844aee1147f7129f3e37067424ccebb88ff478de1b7a9a9fb7306d5f2fdbd82` |
| `policies/adaptive-activation.v1.json` | `b87bbfaddecb42417e57202173220bf240204d27b7de5fffc9e609eb18138939` |
| `artifacts/adaptive-activation/evidence.v1.json` | `b55a5cb4f7ff039cc7f4027c165b2f151bad723d9030913076a4225342fbe8c5` |

The frozen source ledger remains 49,514 open identity obligations and 163
conflicts. No projection or newly bundled method closed those obligations.
Exact-body equality never transfers provenance, rights, quality or outcomes.

## Instruction use is not performance evidence

A non-author consumer produced three plans using only relevant product guidance:
factual founder copy, a browser scene and a workbook scenario. An ambiguous scene
brief made the first plan assume an existing project. A separate clarified
blank-workspace brief produced reversible local defaults without asking for
missing-device permission. Both original artifacts are retained; no skill-body
defect or improvement is inferred from the changed prompt.

The clarified plan's report SHA-256 is
`fa9b4ba225d00ba0019327523674b00aefab832170397372d6976fd6b91ae85f`;
its receipt is
`a5cd51393395a518ff732a69b35fb2f1c28ba73f2cc27159e3d81a3cc37ffba0`.
Parent verified all seven input/output/history bindings. These are planning
artifacts, not rendered scenes, completed workbooks, human acceptance or matched
agent-performance results.

See [accepted change scopes](sprint-20261002-accepted-changes.md) for the separate
independent reviews. Math/Hermes routing experiments and later method proposals
are not part of this frozen core candidate.
