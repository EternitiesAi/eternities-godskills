import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../../../../', import.meta.url);
const read = path => readFile(new URL(path, root));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async path => JSON.parse(await read(path));
const lane = 'artifacts/qualification/cohesive-product-20261015/lane-a/';
const allowed = new Set(['business', 'finance', 'marketing', 'legal', 'design',
  'games', 'audio', 'writing', 'social', 'education', 'agriculture']);

test('lane audit covers the current category membership exactly once', async () => {
  const ledger = await json(`${lane}ledger.json`);
  const actual = [];
  for (const id of await readdir(new URL('product/skills/', root))) {
    const meta = await json(`product/skills/${id}/skill.json`);
    if (allowed.has(meta.category)) actual.push(id);
  }
  assert.deepEqual(ledger.skills.map(s => s.id).sort(), actual.sort());
  assert.equal(new Set(ledger.skills.map(s => s.id)).size, actual.length);
  for (const skill of ledger.skills) {
    assert.ok(allowed.has(skill.category));
    assert.ok(['retain', 'refine', 'gap'].includes(skill.decision));
    assert.ok(skill.reason.length > 0);
    const entry = skill.readSet.find(f => f.path.endsWith('/SKILL.md'));
    assert.equal(entry.inspection, 'full-entrypoint-read');
    assert.equal(entry.sha256, skill.files.find(f => f.path === entry.path).sha256);
  }
});

test('retained skills and every old reference preserve their baseline bytes', async () => {
  const ledger = await json(`${lane}ledger.json`);
  let checked = 0;
  for (const skill of ledger.skills) {
    for (const file of skill.files) {
      if (skill.decision === 'refine' &&
          (file.path.endsWith('/SKILL.md') || file.path.endsWith('/skill.json'))) continue;
      assert.equal(digest(await read(file.path)), file.sha256, file.path);
      checked++;
    }
  }
  assert.ok(checked > 0);
});

test('new methods remain portable declared resources reachable from their owner', async () => {
  const ledger = await json(`${lane}ledger.json`);
  for (const skill of ledger.skills.filter(s => s.decision === 'refine')) {
    const prefix = `product/skills/${skill.id}/`;
    const metadata = await json(`${prefix}skill.json`);
    assert.equal(metadata.category, skill.category);
    assert.ok(metadata.resources.includes(skill.newResource));
    const entry = (await read(`${prefix}SKILL.md`)).toString('utf8');
    const links = [...entry.matchAll(/\]\((references\/[^)#]+)(?:#[^)]*)?\)/g)]
      .map(match => match[1]);
    assert.ok(links.includes(skill.newResource), `${skill.id}: missing conditional link`);
    for (const resource of metadata.resources) {
      assert.ok(resource.startsWith('references/') && !resource.includes('..') &&
        !resource.includes('\\'), `${skill.id}: escaping resource`);
      assert.ok((await read(prefix + resource)).byteLength > 0);
    }
  }
});

test('candidate handoff hashes bind the actual changed files', async () => {
  const candidate = await json(`${lane}candidate-v2.json`);
  const ledger = await json(`${lane}ledger.json`);
  const expected = ledger.skills.filter(s => s.decision === 'refine').flatMap(s =>
    ['SKILL.md', 'skill.json', s.newResource].map(p => `product/skills/${s.id}/${p}`));
  assert.deepEqual(candidate.files.map(f => f.path).sort(), expected.sort());
  assert.equal(candidate.independentReview, 'PENDING');
  for (const file of candidate.files) {
    assert.equal(digest(await read(file.path)), file.sha256, file.path);
  }
});
