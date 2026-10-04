import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const product = new URL('../product/', import.meta.url);
for (const [owner, resource] of [
  ['eternities-athena', 'references/prospective-comparison-design.md'],
  ['user-research-and-usability-study', 'references/experience-mapping.md'],
  ['evidence-linked-learning-design', 'references/support-transition.md'],
]) test(`catalog consumers can resolve ${owner}/${resource} to its released bytes`, async () => {
  const metadata = JSON.parse(await readFile(new URL(`skills/${owner}/skill.json`, product), 'utf8'));
  const catalog = JSON.parse(await readFile(new URL('catalog.json', product), 'utf8'));
  const release = JSON.parse(await readFile(new URL('release.json', product), 'utf8'));
  const skill = await readFile(new URL(`skills/${owner}/SKILL.md`, product), 'utf8');
  const path = `skills/${owner}/${resource}`;
  const declared = catalog.skills.find(x => x.id === owner).resources.find(x => x.path === path);
  assert.ok(declared, 'optional method is missing from the consumer catalog');
  const body = await readFile(new URL(declared.path, product));
  const actual = createHash('sha256').update(body).digest('hex');
  assert.equal(declared.sha256, actual);
  assert.equal(release.files[path], actual);
  assert.ok(metadata.resources.includes(resource));
  assert.ok(skill.includes(`](${resource})`));
  assert.equal(metadata.id, owner);
  assert.equal(metadata.maturity, 'instruction-reviewed');
});
