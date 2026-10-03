// Read-only integration checks. No builder, installer, provider, or fixture application.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';

const baseline = '9409eb8f2f10300a316879d042b12159f94ed302';
const candidate = '54688268f540ce974272f4619f88d97adde80a0c058325a5b8f960432370a0dd';
const batch = 'artifacts/cognitive-workflows-20261003/';
const addedIds = [
  'completeness-and-consistency-audit', 'imaginative-concept-development',
  'interpersonal-understanding-and-dialogue', 'long-horizon-work-continuity',
  'memory-retention-and-recovery', 'voice-style-calibration',
];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const readset = new Map();
async function bytes(path, scope) {
  const value = await readFile(path);
  const entry = readset.get(path) ?? {path, sha256: digest(value), scopes: []};
  assert.equal(entry.sha256, digest(value), `Input changed while checking: ${path}`);
  if (!entry.scopes.includes(scope)) entry.scopes.push(scope);
  readset.set(path, entry);
  return value;
}
async function json(path, scope = 'complete JSON') {return JSON.parse(await bytes(path, scope));}
function git(args) {
  const result = spawnSync('git', args, {maxBuffer: 8 * 1024 * 1024});
  assert.equal(result.status, 0, result.stderr.toString());
  return result.stdout;
}
const freeze = await json(batch + 'candidate-freeze-v1.json');
assert.equal(freeze.baselineCommit, baseline);
assert.equal(freeze.files.length, 19);
const snapshots = [];
const changedCandidate = [];
for (const entry of freeze.files) {
  const snapshot = batch + 'original-draft-v1/' + entry.path;
  assert.equal(digest(await bytes(snapshot, 'exact-byte frozen snapshot check; metadata parsed below, bodies not judged')), entry.sha256, snapshot);
  snapshots.push({path: snapshot, sha256: entry.sha256});
  const actual = digest(await bytes(entry.path, entry.path.endsWith('/skill.json') ? 'complete metadata; semantic integration comparison' : 'hash-only binding to independent review; no skill-body self-review'));
  if (actual !== entry.sha256) changedCandidate.push({path: entry.path, frozenSha256: entry.sha256, finalSha256: actual});
}
const bodyRepairs = {
  'product/skills/voice-style-calibration/SKILL.md': '01efcb9a8780efada72d7c6b263f2be51137d5311bedb3aea506f9d131ed308b',
  'product/skills/memory-retention-and-recovery/SKILL.md': '36c14c3b62bdf72c2b12bf4678ec44223bd0c3064528a7f1b34d7df4fcc966e7',
  'product/skills/memory-retention-and-recovery/references/examples.md': 'e85739b8e8e517545d5862200f78e442dc23f59284f2e74751c7c39af8e5ece2',
};
assert.deepEqual(changedCandidate.map(x => x.path).sort(), [
  ...addedIds.map(id => `product/skills/${id}/skill.json`), ...Object.keys(bodyRepairs),
].sort());
for (const [path, expected] of Object.entries(bodyRepairs)) {
  assert.equal(readset.get(path).sha256, expected);
  const staged = batch + 'repairs-v2/' + path.slice('product/skills/'.length);
  assert.equal(digest(await bytes(staged, 'hash-only approved repair binding')), expected);
}

const reviews = {
  'voice-style-calibration': ['voice-imagination-review-v2/review.md', '0bebafb5801baf390874e2224349c3eb119373b39cb2c9755c6662b6f8a68c0b'],
  'imaginative-concept-development': ['voice-imagination-review-v1/review.md', '699e5ee554898632bf3e19fff50e2ed6e025c3bee9231c0ed7b8b0e7577e501d'],
  'interpersonal-understanding-and-dialogue': ['dialogue-memory-review-v2/review.md', '0ef8babe097a62e0f6e96e6b6df8f829abe3205e47ea7e8d66b30c412fc316bc'],
  'memory-retention-and-recovery': ['dialogue-memory-review-v2/review.md', '0ef8babe097a62e0f6e96e6b6df8f829abe3205e47ea7e8d66b30c412fc316bc'],
  'completeness-and-consistency-audit': ['audit-continuity-review-v1/review.md', 'bae15f49f1a6f43c5fab1b42135c4bede0592c2320921cc7862158cb0b513cad'],
  'long-horizon-work-continuity': ['audit-continuity-review-v1/review.md', 'bae15f49f1a6f43c5fab1b42135c4bede0592c2320921cc7862158cb0b513cad'],
};
const metadataDeltas = [];
const initialAuthorNote = 'Fresh method informed by the approved contract and first-party owner boundaries; exact source identities and SHA-256 hashes are in the sidecar. This records initial authoring; later independent review is recorded separately.';
for (const id of addedIds) {
  const path = `product/skills/${id}/skill.json`;
  const original = await json(batch + 'original-draft-v1/' + path);
  const final = await json(path);
  const expected = structuredClone(original);
  assert.equal(original.maturity, 'draft');
  expected.maturity = 'instruction-reviewed';
  const [reviewSuffix, reviewHash] = reviews[id];
  const reviewPath = batch + reviewSuffix;
  const report = (await bytes(reviewPath, 'complete independent instruction decision; exact reviewed identity, not new body judgment')).toString('utf8');
  assert.equal(readset.get(reviewPath).sha256, reviewHash);
  assert.match(report, /READY/);
  const bodyHash = readset.get(`product/skills/${id}/SKILL.md`).sha256;
  assert.ok(report.includes(bodyHash), `Review omits final body hash: ${id}`);
  for (const resource of final.resources) {
    const resourceHash = readset.get(`product/skills/${id}/${resource}`).sha256;
    assert.ok(report.includes(resourceHash), `Review omits final resource hash: ${id}/${resource}`);
  }
  if (id === 'voice-style-calibration' || id === 'imaginative-concept-development') expected.provenance[0].note = initialAuthorNote;
  if (id === 'interpersonal-understanding-and-dialogue') {
    expected.taskTypes = original.taskTypes.map(x => x === 'review' ? 'verify' : x);
    expected.triggers.push('reflect participant statements while keeping motives tentative');
  }
  expected.provenance.push({
    kind: 'instruction-review', source: reviewPath,
    note: `SHA-256 ${reviewHash}. Independent document acceptance of the exact reviewed instructions; limited fixture applications and release checks are separate evidence. No performance superiority or source-rights clearance is implied.`,
  });
  assert.deepEqual(final, expected, `Unexpected metadata delta: ${id}`);
  assert.deepEqual(final.antiTriggers, original.antiTriggers);
  metadataDeltas.push({id, sha256: readset.get(path).sha256, maturity: final.maturity, reviewPath, reviewSha256: reviewHash, changes: [
    'draft -> instruction-reviewed', 'append exact-hash instruction-review provenance',
    ...(['voice-style-calibration', 'imaginative-concept-development'].includes(id) ? ['clarify initial author provenance as authoring, not later review'] : []),
    ...(id === 'interpersonal-understanding-and-dialogue' ? ['taskTypes review -> verify', 'append general reflective-statements / tentative-motives trigger'] : []),
  ]});
}
const stagedDialogue = batch + 'repairs-v2/interpersonal-understanding-and-dialogue/skill.json';
const stagedDialogueMetadata = await json(stagedDialogue);
assert.equal(readset.get(stagedDialogue).sha256, '90bd0aeccbf30c9492d3e8db94c6f289bb52afdd3523231d6877d5988085bc36');
const dialogueBeforePromotion = await json('product/skills/interpersonal-understanding-and-dialogue/skill.json');
dialogueBeforePromotion.maturity = 'draft';
dialogueBeforePromotion.provenance.pop();
assert.deepEqual(dialogueBeforePromotion, stagedDialogueMetadata);

const baselineReleaseBytes = git(['show', `${baseline}:product/release.json`]);
const baselineCatalogBytes = git(['show', `${baseline}:product/catalog.json`]);
const baselineRelease = JSON.parse(baselineReleaseBytes);
const baselineCatalog = JSON.parse(baselineCatalogBytes);
assert.equal(baselineRelease.skillCount, 68);
const authorizedOldChanges = ['INDEX.md', 'README.md', 'RECIPES.md', 'catalog.json'];
const oldFilesPreserved = [];
for (const [path, expected] of Object.entries(baselineRelease.files)) {
  if (authorizedOldChanges.includes(path)) continue;
  const actual = digest(await bytes('product/' + path, 'hash-only preservation against baseline release; no old-body evaluation'));
  assert.equal(actual, expected, `Previously shipped file changed: ${path}`);
  oldFilesPreserved.push({path: 'product/' + path, sha256: actual});
}
const release = await json('product/release.json');
assert.equal(release.releaseId, candidate);
assert.equal(release.skillCount, 74);
assert.deepEqual(Object.keys(release.files).filter(path => !Object.hasOwn(baselineRelease.files, path)).sort(), [
  'HOST-CAPABILITIES.md', ...freeze.files.map(x => x.path.slice('product/'.length)),
].sort());
assert.deepEqual(Object.keys(baselineRelease.files).filter(path => !Object.hasOwn(release.files, path)), []);

const fixturePath = 'tests/core2260-catalog.json';
const fixtureBytes = await bytes(fixturePath, 'immutable core hash and complete ordered scoring projection');
const fixtureHash = '57d47c0a9692dc21caa0e7909ee6c557cd5ef5cc4e09b968df079cc81f86aecf';
assert.equal(digest(fixtureBytes), fixtureHash);
assert.equal(digest(git(['show', `${baseline}:${fixturePath}`])), fixtureHash);
const fixture = JSON.parse(fixtureBytes);
const catalog = await json('product/catalog.json');
const fields = ['id', 'category', 'summary', 'triggers', 'antiTriggers', 'taskTypes', 'related', 'specializes', 'maturity'];
const project = item => Object.fromEntries(fields.filter(key => Object.hasOwn(item, key)).map(key => [key, item[key]]));
const coreIds = new Set(fixture.skills.map(x => x.id));
const guard = proposed => {
  assert.equal(proposed.skills.length, fixture.skills.length + addedIds.length);
  assert.deepEqual(proposed.skills.filter(x => !coreIds.has(x.id)).map(x => x.id), addedIds);
  const core = proposed.skills.filter(x => coreIds.has(x.id));
  assert.deepEqual(core.map(x => x.id), fixture.skills.map(x => x.id));
  assert.deepEqual(core.map(project), fixture.skills.map(project));
};
assert.equal(fixture.skills.length, 68);
guard(catalog);
assert.deepEqual(catalog.skills.filter(x => coreIds.has(x.id)).map(project), baselineCatalog.skills.map(project));
const negativeControls = [];
function rejected(name, change) {
  const proposed = structuredClone(catalog); change(proposed);
  assert.throws(() => guard(proposed), undefined, name);
  negativeControls.push({case: name, result: 'rejected in memory; no input bytes changed'});
}
rejected('unapproved extra ID', x => x.skills.push({...x.skills[0], id: 'unapproved-growth'}));
rejected('replace an admitted new ID by arbitrary ID at total 74', x => {x.skills.find(y => y.id === addedIds[0]).id = 'unapproved-replacement';});
rejected('duplicate old ID in place of another old ID at total 74', x => {const rows = x.skills.filter(y => coreIds.has(y.id)); rows[1].id = rows[0].id;});
rejected('reorder old IDs', x => {const a = x.skills.findIndex(y => coreIds.has(y.id)); const b = x.skills.findIndex((y, i) => i > a && coreIds.has(y.id)); [x.skills[a], x.skills[b]] = [x.skills[b], x.skills[a]];});
rejected('change old scoring trigger', x => {x.skills.find(y => coreIds.has(y.id)).triggers.push('unapproved score change');});
rejected('remove admitted ID', x => {x.skills = x.skills.filter(y => y.id !== addedIds[0]);});

const trackedChanges = git(['diff', '--name-only', baseline]).toString('utf8').trim().split(/\r?\n/).filter(Boolean).sort();
const expectedTrackedChanges = ['product/INDEX.md', 'product/README.md', 'product/RECIPES.md', 'product/catalog.json', 'product/release.json', 'tests/conditional-method-regression.test.mjs', 'tests/universal-owner-refinements-wave17-18.test.mjs'].sort();
assert.deepEqual(trackedChanges, expectedTrackedChanges);
const flags = git(['ls-files', '-v']).toString('utf8').trim().split(/\r?\n/).filter(Boolean);
assert.deepEqual(flags.filter(line => !line.startsWith('H ')), []);
const baselineTrackedPins = [];
for (const path of ['package.json', 'package-lock.json', 'tests/adaptive-evaluator-compatibility.test.mjs', 'tests/aegis-evaluator-v2-shadow.test.mjs']) {
  const currentHash = digest(await bytes(path, 'exact-byte unchanged lock/package or historical failing-test preservation'));
  const baselineHash = digest(git(['show', `${baseline}:${path}`]));
  assert.equal(currentHash, baselineHash, path);
  baselineTrackedPins.push({path, sha256: currentHash});
}

const sharedSurfaces = [...trackedChanges, 'product/HOST-CAPABILITIES.md', 'tests/cognitive-workflows-discovery.test.mjs'].sort();
for (const path of sharedSurfaces) await bytes(path, path.endsWith('.test.mjs') ? 'complete integration test reviewed; actual code delta checked' : 'complete integration documentation or generated metadata reviewed');
const parentLogs = [];
for (const name of ['historical-count-red.tap', 'historical-count-green.tap', 'focused-pre-migration.tap', 'full-suite.tap', 'dependency-repair-focused-green.tap', 'full-suite-repaired.tap']) {
  const path = batch + name;
  const log = (await bytes(path, 'hash and targeted counts/failures/skip inspection; parent-run evidence, not a rerun')).toString('utf8');
  const counts = Object.fromEntries([...log.matchAll(/^(?:# |ℹ )(tests|pass|fail|skipped|cancelled) (\d+)$/gm)].map(x => [x[1], Number(x[2])]));
  const failures = log.split(/\r?\n/).filter(line => /^not ok \d+|^✖ |^  error:|74 !== 68/.test(line));
  const skips = log.split(/\r?\n/).filter(line => /# SKIP/.test(line));
  parentLogs.push({path, sha256: readset.get(path).sha256, counts, failures, skips});
}
const reviewContextFiles = [
  'docs/superpowers/specs/2026-10-03-cognitive-workflows-design.md',
  'docs/superpowers/plans/2026-10-03-cognitive-workflows.md',
  batch + 'run-state.json', batch + 'host-integration-review-v1/review.md',
  batch + 'voice-imagination-review-v1/readset.json', batch + 'voice-imagination-review-v2/readset.json',
  batch + 'dialogue-memory-review-v2/readset.json',
  'product/lib/product.mjs', 'product/lib/archive.mjs', '.gitattributes',
];
for (const path of reviewContextFiles) await bytes(path, 'review context or validator/archive protection boundary read; not evaluator fixtures');
const changedTree = [...freeze.files.map(x => x.path), ...sharedSurfaces].sort().map(path => ({path, sha256: readset.get(path).sha256}));
assert.equal(changedTree.length, 28);
console.log(JSON.stringify({
  schema: 'cognitive-final-integration-readonly-check-v1', result: 'PASS',
  baselineCommit: baseline, baselineReleaseId: baselineRelease.releaseId, candidateReleaseId: candidate,
  localOriginMain: git(['rev-parse', 'origin/main']).toString('utf8').trim(),
  changedTree, frozenSnapshots: snapshots, changedFromFreeze: changedCandidate, metadataDeltas,
  oldFilesPreserved, baselineTrackedPins,
  protectedTrackedState: {trackedChanges, noHiddenIndexFlags: true, limitation: 'Git diff establishes tracked protection outside this explicit change set; not an inventory of arbitrary untracked personal files.'},
  immutableFixture: {path: fixturePath, sha256: fixtureHash, orderedOldIds: 68, allowedAdditionalIds: addedIds, total: 74, negativeControls},
  parentLogs,
  identityBasis: 'Independent receipt decisions and parent cross-review assignment attestation; hashes bind exact content, not cryptographic reviewer identity. Leibniz authored audit/continuity and independently reviewed Einstein dialogue/memory; no new own-body judgment in this integration review.',
  baselineGitObjects: [
    {path: `${baseline}:product/release.json`, sha256: digest(baselineReleaseBytes)},
    {path: `${baseline}:product/catalog.json`, sha256: digest(baselineCatalogBytes)},
  ],
  readset: [...readset.values()].sort((a, b) => a.path.localeCompare(b.path)),
}, null, 2));
