# Lane A author qualification receipt

Status: four draft refinements prepared for independent instruction review.
This is author-side structural and arithmetic verification, not an independent
review, model comparison, field application or performance result.

## Identity and ownership

- Worktree: `C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003`.
- Branch: `feat/usefulness-release-20261016`.
- Baseline: `7c7f2ac98a282ccb2e59c3a4c0424802a4dd72b5`.
- Portable93 and installed content hash are spec declarations; no installed
  content inspection or mutation was performed by this lane.
- Only the seven new files in this lane were authored. No descendants, commits,
  branch switches, installs, shared catalog builds, acquisitions, paid model calls,
  source execution, global edits, account/security changes or secret reads occurred.
- The current shared worktree showed a concurrent tracked change to
  `product/lib/request-scope.mjs` at verification. Its content was not inspected
  or edited by this lane. It is not a lane-A output.
- Historical receipts, protected activation files, source files and the three
  pre-existing untracked release archives were not edited, removed or relocated.
  This is an action-scope statement, not a before/after hash audit of every file.
- Evaluator materials and other lanes were not read. The release plan's public
  task descriptions were read as required; no hidden task or criterion files were opened.

## Coverage and source boundaries

Five current owner bodies and their selected relevant references were compared
before authoring. Six warehouse entrypoint bodies and three supporting references
were read fully, all within four repositories already present in current metadata.
The warehouse index SHA-256 is
`8a7444815944c5bc6acca5d6d77d760fe25298f1b07889744e7d0f3a7b12dc54`.
Exact observed heads, byte counts, SHA-256, Git blobs, full root license notices,
selection/rejection reasoning and read repairs are in [evidence.json](evidence.json).
Each selected source's observed bytes matched its recorded HEAD blob.

Refinery guidance led to retaining existing owners and adequately covered
mechanisms; skill-creator guidance led to conditional resources rather than new
entrypoints or obligatory packets. The generic bottleneck checklist and activation
model material were rejected as additions. Existing practice/transfer and
support-transition guidance remains intact. The education source's local CC-BY-SA-4.0
notice and the index's unreviewed label are both preserved; no source hold or
compatibility question is silently cleared.

## Checks actually performed

The read-only PowerShell command below completed with **209 passing assertions**:

- four proposal contracts, unique IDs and review-only disposition;
- lane-contained candidate paths and proposed resource absence;
- exact, unique entrypoint insertion anchors and additive metadata operations;
- 21 current evidence hashes, nine source-file hashes, four license hashes and
  the warehouse index hash;
- agreement between proposal source records and the evidence ledger;
- the worked examples' arithmetic, population conservation, denominator choice,
  shared specialist load, serial-flow limits and valid alternate algebra route;
- all 20 author-created application checks explicitly marked proposed, not executed.

A separate read-only pass over all six then-existing lane files found no trailing
whitespace or merge-conflict markers and calculated the hashes below. This receipt
was added afterward. `git diff --check` also returned no diagnostics, but it does
not validate untracked candidate files; the separate lane pass covered those.
No project suite, catalog builder, source validator, source script, model test or
hidden evaluator was executed.

The mathematical checks verify the invented examples under their stated
assumptions. They do not test whether a model follows the Markdown. The twenty
fresh application checks in [proposals.json](proposals.json) are review material,
not independent evaluator criteria and not twenty passing behavioral tests.

## Exact authored artifact hashes

The receipt excludes its own digest to avoid a circular identity.

| Path relative to lane-a | Bytes | SHA-256 |
| --- | ---: | --- |
| adaptive-practice.md | 4984 | `fd59e825efd7e27718ce02518ed17d011e0d4993b90c7ea93665a825069d9b10` |
| commercial-discovery.md | 4481 | `5ad6fcff45efc590e44e048a4eebced2c1313b89d9ad125644d0661d8db3c588` |
| customer-onboarding.md | 4796 | `1dbd93629607568a717e05d63d1ea6b6c378ca6907d2363b8cb9bee9997fcb01` |
| evidence.json | 27857 | `7cda98699fb1a0a1041543abf5391da6769f9dbeb15f7685db2cfd18e4386dd0` |
| operational-bottleneck.md | 4920 | `70bbb61d77eb77638375d8368a341583fb6c5660828456b5ab69cf2b477f59e1` |
| proposals.json | 54471 | `8334178f939ec211d0f89297f8ec5913c31177fdee133cbf678f31756ce8b918` |

## Remaining gates

Parent-owned adoption requires independent review of the exact candidate bytes,
resolution of relevant source-rights/compatibility questions, rechecking the
proposed owner guards, and additive integration of accepted changes. The exact
resource targets, entrypoint insertions and metadata operations are in proposals.json.
No new maturity claim is applied by this lane. Behavioral utility, comparison with
baseline, discovery, real customer/learner outcomes, regression, export and
installation remain untested here. The education refinement is original author
expression, but that assertion is not a ruling on whether adaptation obligations
apply to its consulted CC-BY-SA sources.

## Reproduction command

Run from the named worktree using PowerShell. It reads evidence and performs
local assertions; it does not load or execute repository or warehouse source code.
Concurrent owner edits may correctly cause the guarded checks to fail later.

```powershell
$ErrorActionPreference = 'Stop'
$lane = 'artifacts/qualification/usefulness-20261016/lane-a'
$laneRoot = [IO.Path]::GetFullPath((Join-Path (Get-Location) $lane)) + [IO.Path]::DirectorySeparatorChar
$p = Get-Content -Raw "$lane/proposals.json" | ConvertFrom-Json
$e = Get-Content -Raw "$lane/evidence.json" | ConvertFrom-Json
$checks = 0
function Assert-Lane($condition, $message) { if (-not $condition) { throw $message }; $script:checks++ }
Assert-Lane ($p.proposals.Count -eq 4) 'Expected four proposals'
Assert-Lane (($p.proposals.id | Select-Object -Unique).Count -eq 4) 'Duplicate IDs'
Assert-Lane ((git rev-parse HEAD) -eq $p.baseline) 'Baseline drift'
Assert-Lane ((git branch --show-current) -eq $p.branch) 'Branch drift'
Assert-Lane ($e.readBoundary.warehouseEntrypointsReadInFull -le 12) 'Source body cap'
Assert-Lane ($e.readBoundary.totalComparativeEntrypoints -eq 11) 'Comparative count'
foreach ($proposal in $p.proposals) {
  foreach ($field in @('owner','job','currentCoverageComparison','exactSourceRecords','disposition','candidateMarkdownPath','adoptionDelta','freshApplicationChecks')) {
    Assert-Lane ($null -ne $proposal.$field) "Missing $field"
  }
  $candidate = [IO.Path]::GetFullPath((Join-Path (Get-Location) $proposal.candidateMarkdownPath))
  Assert-Lane ($candidate.StartsWith($laneRoot, [StringComparison]::OrdinalIgnoreCase)) 'Candidate escaped lane'
  Assert-Lane (Test-Path -LiteralPath $candidate -PathType Leaf) 'Missing candidate'
  Assert-Lane ($proposal.disposition -eq 'refine-existing-owner') 'Unexpected disposition'
  Assert-Lane (-not $proposal.adoptionDelta.applied) 'Proposal claims applied'
  Assert-Lane (-not $proposal.adoptionDelta.newEntrypoint) 'Unneeded entrypoint'
  Assert-Lane ($proposal.status -eq 'draft-for-independent-instruction-review') 'Maturity overstated'
  Assert-Lane ($proposal.freshApplicationChecks.Count -eq 5) 'Missing transfer checks'
  foreach ($check in $proposal.freshApplicationChecks) { Assert-Lane ($check.status -eq 'proposed-not-executed') 'Unexecuted check overstated' }
  $delta = $proposal.adoptionDelta
  Assert-Lane (-not (Test-Path -LiteralPath $delta.addResource.target)) 'Proposed resource already exists'
  $body = Get-Content -Raw -LiteralPath $delta.entrypoint.path
  Assert-Lane (([regex]::Matches($body, [regex]::Escape($delta.entrypoint.anchor))).Count -eq 1) 'Insertion anchor not unique'
  Assert-Lane ((Get-FileHash -LiteralPath $delta.entrypoint.path).Hash.ToLowerInvariant() -eq $delta.entrypoint.expectedSha256) 'Entrypoint hash drift'
  Assert-Lane ((Get-FileHash -LiteralPath $delta.metadata.path).Hash.ToLowerInvariant() -eq $delta.metadata.expectedSha256) 'Metadata hash drift'
  $metadata = Get-Content -Raw -LiteralPath $delta.metadata.path | ConvertFrom-Json
  Assert-Lane ($metadata.id -eq $proposal.owner) 'Wrong metadata owner'
  foreach ($op in $delta.metadata.operations) {
    Assert-Lane ($op.op -eq 'add' -and $op.path -in @('/resources/-','/triggers/-','/provenance/-')) 'Unexpected metadata mutation'
    if ($op.path -eq '/resources/-') { Assert-Lane ($metadata.resources -notcontains $op.value) 'Duplicate resource' }
    if ($op.path -eq '/triggers/-') { Assert-Lane ($metadata.triggers -notcontains $op.value) 'Duplicate trigger' }
  }
  foreach ($source in $proposal.exactSourceRecords) {
    $bound = @($e.sources | Where-Object id -eq $source.id)
    Assert-Lane ($bound.Count -eq 1 -and $bound[0].sha256 -eq $source.sha256 -and $bound[0].identity -eq $source.identity) 'Source record mismatch'
  }
}
foreach ($record in $e.current) {
  Assert-Lane ((Get-FileHash -LiteralPath $record.path).Hash.ToLowerInvariant() -eq $record.sha256) "Current evidence changed: $($record.path)"
}
foreach ($source in $e.sources) {
  $sourcePath = Join-Path $source.repositoryPath $source.relativePath
  Assert-Lane ((Get-FileHash -LiteralPath $sourcePath).Hash.ToLowerInvariant() -eq $source.sha256) "Source bytes changed: $($source.id)"
  Assert-Lane ($source.headBlob -eq $source.observedBlob -and $source.matchesHeadBytes) 'Source blob mismatch'
  Assert-Lane ($source.indexHead -eq $source.observedHead) 'Source index/head mismatch'
}
foreach ($license in $e.licenses) {
  Assert-Lane ((Get-FileHash -LiteralPath $license.path).Hash.ToLowerInvariant() -eq $license.sha256) 'License notice drift'
}
Assert-Lane ((Get-FileHash -LiteralPath $e.index.path).Hash.ToLowerInvariant() -eq $e.index.sha256) 'Warehouse index drift'
# Recompute the invented examples, not a model's behavior.
Assert-Lane ((2 * 30) -eq 60) 'Discovery delay arithmetic'
Assert-Lane ((9 + 2 + 2 + 1) -eq 14 -and (14 + 6) -eq 20) 'Onboarding population conservation'
Assert-Lane ([math]::Round(100 * 9 / 14, 1) -eq 64.3) 'First-value denominator'
Assert-Lane ([math]::Round(100 * 12 / 14, 1) -eq 85.7) 'Setup denominator'
Assert-Lane ((4 * 1 + 2 * 3 + 4) -eq 14 -and (14 - 12) -eq 2) 'Shared specialist demand'
Assert-Lane ((14 - 2) -eq 12) 'Preventable rework scenario'
Assert-Lane ((@(9,10,6,8) | Measure-Object -Minimum).Minimum -eq 6) 'Serial baseline ceiling'
Assert-Lane ((@(9,12,6,8) | Measure-Object -Minimum).Minimum -eq 6) 'Upstream expansion ceiling'
Assert-Lane ((@(9,10,9,8) | Measure-Object -Minimum).Minimum -eq 8) 'Constraint moves downstream'
Assert-Lane ((@(9,10,6,6) | Measure-Object -Minimum).Minimum -eq 6 -and (@(9,10,9,6) | Measure-Object -Minimum).Minimum -eq 6) 'Tied constraint control'
Assert-Lane ((3 * 8) -gt (3 * 5)) '3/5 exceeds 3/8'
Assert-Lane ((2 * 7) -gt (2 * 3)) '2/3 exceeds 2/7'
Assert-Lane ((4 * 9) -gt (4 * 6)) '4/6 exceeds 4/9'
# Fresh algebra counterexample: 4x+8=28 -> x+2=7 -> x=5.
Assert-Lane ((4 * 5 + 8) -eq 28 -and (5 + 2) -eq 7) 'Valid divide-first route'
Assert-Lane ($p.proposals[3].adoptionDelta.rightsGate -match 'CC-BY-SA-4.0') 'Education rights hold missing'
[ordered]@{result='PASS';assertions=$checks;proposals=$p.proposals.Count;proposedTransferChecks=20;currentEvidenceRehashed=$e.current.Count;sourceFilesRehashed=$e.sources.Count;licenseFilesRehashed=$e.licenses.Count;limits='Read-only author structural/identity/arithmetic checks; no candidate behavioral execution or independent evaluation'} | ConvertTo-Json
git diff --check
git diff --name-only
git status --short --untracked-files=all -- artifacts/qualification/usefulness-20261016/lane-a
```

