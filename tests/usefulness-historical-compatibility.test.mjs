import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {inspectMethodDirectory} from '../product/lib/method-directory.mjs';
import {
  projectBeforeUsefulnessRelease20261016,
  projectCatalogBeforeUsefulnessRelease20261016,
  projectDirectoryBeforeUsefulnessRelease20261016,
} from './helpers/usefulness-historical-compatibility.mjs';

const load = path => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const valueDigest = value => digest(JSON.stringify(value));
const revision = load('./helpers/usefulness-release-20261016-v1.json');
const catalog = load('../product/catalog.json');
const directory = load('../product/METHODS.v1.json');
const productRoot = fileURLToPath(new URL('../product/', import.meta.url));

// These baseline value digests were independently checked against the exported
// portable93 pack. Tests never need that workstation export or rewrite old gold.
test('only the five declared owner deltas project to the complete portable93 catalog', () => {
  assert.deepEqual(revision.changes.map(row => row.id), [
    'eternities-agora', 'eternities-arcadia', 'eternities-beacon',
    'evidence-linked-learning-design', 'operating-cadence-and-decision-accountability',
  ]);
  const saved = structuredClone(catalog);
  const projected = projectCatalogBeforeUsefulnessRelease20261016(catalog);
  assert.equal(projected.skills.length, 93);
  assert.equal(valueDigest(projected), 'dee02b51eb99bcab3db19b58d855af0309bdc88fb41beab64b7bbb8e6de66487');
  assert.deepEqual(catalog, saved);
});

for (const change of revision.changes) test(`usefulness admission rejects declared-field drift: ${change.id}`, () => {
  const current = catalog.skills.find(row => row.id === change.id);
  const saved = structuredClone(current);
  const projected = projectBeforeUsefulnessRelease20261016(current);
  assert.deepEqual(Object.keys(change.fields), ['triggers', 'entrypointSha256', 'resources']);
  for (const [field, values] of Object.entries(change.fields)) {
    assert.deepEqual(projected[field], values.before);
    const altered = structuredClone(current);
    altered[field] = values.before;
    assert.throws(() => projectBeforeUsefulnessRelease20261016(altered), /Only the declared usefulness/);
    altered[field] = null;
    assert.throws(() => projectBeforeUsefulnessRelease20261016(altered), /Only the declared usefulness/);
  }
  for (const mutate of [
    row => row.triggers.push('unadmitted trigger'),
    row => row.resources[0].sha256 = '0'.repeat(64),
    row => row.resources.at(-1).sha256 = '0'.repeat(64),
    row => row.resources.push({path: 'unknown.md', sha256: '0'.repeat(64)}),
  ]) {
    const altered = structuredClone(current); mutate(altered);
    assert.throws(() => projectBeforeUsefulnessRelease20261016(altered));
  }
  assert.deepEqual(current, saved);
});

test('unlisted owner fields stay visible and the whole-catalog guard rejects their drift', () => {
  for (const change of revision.changes) for (const [field, value] of [
    ['summary', 'Unadmitted summary'], ['antiTriggers', []],
    ['taskTypes', ['unadmitted-task']], ['unlistedField', 'visible'],
  ]) {
    const altered = structuredClone(catalog);
    const owner = altered.skills.find(row => row.id === change.id);
    owner[field] = value;
    assert.deepEqual(projectBeforeUsefulnessRelease20261016(owner)[field], value);
    assert.throws(() => projectCatalogBeforeUsefulnessRelease20261016(altered), /outside the named usefulness/);
  }
  const unrelated = {id: 'unlisted-owner', summary: 'visible'};
  assert.equal(projectBeforeUsefulnessRelease20261016(unrelated), unrelated);
});

test('catalog admission rejects membership, order, envelope and unaffected-owner changes', () => {
  for (const mutate of [
    data => data.skills.pop(),
    data => data.skills.push({...data.skills[0], id: 'unlisted-owner'}),
    data => data.skills.push(data.skills[0]),
    data => data.skills.reverse(),
    data => data.skills.find(row => row.id === 'eternities-atlas').summary += ' Unadmitted.',
    data => data.activation = 'active',
    data => data.authority = 'granted',
    data => data.unlistedField = 'visible',
  ]) {
    const altered = structuredClone(catalog); mutate(altered);
    assert.throws(() => projectCatalogBeforeUsefulnessRelease20261016(altered));
  }
});

test('the eight exact reviewed methods project to all 21 unchanged old rows without mutation', () => {
  const saved = structuredClone(directory);
  const projected = projectDirectoryBeforeUsefulnessRelease20261016(directory);
  assert.equal(revision.newMethods.length, 8);
  assert.equal(directory.methods.length, 29);
  assert.equal(projected.methods.length, 21);
  assert.equal(valueDigest(projected), 'bd1636751f4c1d773af26c17d6c2e2948f917b28c25da8ca1e09a66947cd99d9');
  assert.deepEqual(directory, saved);
});

for (const method of revision.newMethods) test(`method admission binds identity, scope and final review: ${method.id}`, () => {
  for (const mutate of [
    row => row.id += '-unknown',
    row => row.title += ' unadmitted',
    row => row.owner = 'eternities-atlas',
    row => row.resource = 'skills/eternities-atlas/references/methods.md',
    row => row.resourceSha256 = '0'.repeat(64),
    row => row.tasks.push('Unadmitted task'),
    row => row.exclusions = [],
    row => row.documentStatus = 'not-assessed-by-this-overlay',
    row => row.outcomeStatus = 'performance-qualified',
    row => row.executionEvidence = 'Unobserved performance claim',
    row => delete row.review,
    row => row.review.scope += ' unadmitted',
    row => row.review.receipt = 'evidence/method-reviews/unknown.json',
    row => row.review.receiptSha256 = '0'.repeat(64),
    row => row.review.report = 'evidence/method-reviews/unknown.md',
    row => row.review.reportSha256 = '0'.repeat(64),
    row => row.review.resourceBinding.pathPointer = '/methodBindings/99/path',
    row => row.review.resourceBinding.sha256Pointer = '/methodBindings/99/sha256',
    row => row.unlistedField = 'unadmitted',
  ]) {
    const altered = structuredClone(directory);
    mutate(altered.methods.find(row => row.id === method.id));
    assert.throws(() => projectDirectoryBeforeUsefulnessRelease20261016(altered), /Only the declared usefulness/);
  }
});

test('directory admission rejects any old-row drift and unlisted membership or envelope changes', () => {
  for (let index = 0; index < 21; index++) {
    const altered = structuredClone(directory);
    altered.methods[index].tasks.push('Unadmitted historical rewrite');
    assert.throws(() => projectDirectoryBeforeUsefulnessRelease20261016(altered));
  }
  for (const mutate of [
    data => delete data.methods[0].review,
    data => data.methods.shift(),
    data => data.methods.pop(),
    data => data.methods.push({...data.methods.at(-1), id: 'unadmitted-extra'}),
    data => data.methods.push(data.methods.at(-1)),
    data => data.methods.reverse(),
    data => data.authority = 'granted',
    data => data.extra = 'unadmitted',
  ]) {
    const altered = structuredClone(directory); mutate(altered);
    assert.throws(() => projectDirectoryBeforeUsefulnessRelease20261016(altered));
  }
});

test('actual owner and method bytes match admission, with all review bytes checked before projection', async () => {
  // Use the real inspector on the full current directory. Projecting first
  // would omit the eight new review checks and is deliberately not allowed here.
  const inspected = await inspectMethodDirectory(productRoot, catalog);
  projectDirectoryBeforeUsefulnessRelease20261016(inspected);
  for (const change of revision.changes) {
    const owner = catalog.skills.find(row => row.id === change.id);
    assert.equal(digest(readFileSync(join(productRoot, owner.entrypoint))), change.fields.entrypointSha256.after);
  }
  for (const method of revision.newMethods) {
    const owner = catalog.skills.find(row => row.id === method.owner);
    assert.ok(owner.resources.some(row => row.path === method.resource && row.sha256 === method.resourceSha256));
    assert.equal(digest(readFileSync(join(productRoot, method.resource))), method.resourceSha256);
    const metadata = JSON.parse(readFileSync(join(productRoot, 'skills', method.owner, 'skill.json')));
    assert.ok(metadata.resources.includes(method.resource.slice(('skills/' + method.owner + '/').length)));
  }
});
