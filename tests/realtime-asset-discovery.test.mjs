import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {searchCatalog, routeTask} from '../product/lib/product.mjs';

// Behavioral retrieval contracts, not assertions about prescribed skill prose.
// These authored cases are regression coverage, not held-out quality evidence.
const root = new URL('../product/skills/', import.meta.url);
const catalog = {schema: 'eternities-godskills-catalog-v1', skills: await Promise.all(
  (await readdir(root)).sort().map(async id => ({
    ...JSON.parse(await readFile(new URL(`${id}/skill.json`, root), 'utf8')),
    entrypoint: `skills/${id}/SKILL.md`, entrypointSha256: '0'.repeat(64),
  })))};

for (const query of [
  'Integrate an imported glTF model into our Three.js scene and verify its materials and scale.',
  'Our Unity character imports but the rig and root motion disagree with the movement controller.',
  'Check an Unreal mesh import: the doorway looks open but its collision blocks the player.',
  'The model works in the editor but textures and decoder files are missing from the packaged build.',
  'Audit UV channel assignments, normal map encoding and material slots on a real-time 3D asset.',
  'The imported mesh is mirrored and the pivot is wrong after converting coordinate axes.',
]) test(`asset integration lookup exposes its owner: ${query}`, () => {
  const result = searchCatalog(catalog, query, {limit: 3, need: 'specialist'});
  assert.ok(result.results.some(row => row.id === 'eternities-arcadia'), JSON.stringify(result.results.map(row => row.id)));
  assert.equal(result.authority, 'none');
  assert.equal(result.activation, 'none');
  assert.equal(result.selection.state, 'review-required');
});

test('asset terminology never overrides a caller decision that no specialist is needed', () => {
  const result = routeTask(catalog, 'Unity Unreal Three.js mesh import materials collision root motion', {need: 'none'});
  assert.deepEqual(result.search.results, []);
  assert.equal(result.selection.state, 'abstain');
});

for (const [query, owner] of [
  ['Compare map coordinate reference systems and reproject GIS layers without moving their locations', 'geospatial-coordinate-integrity'],
  ['Design deterministic procedural world chunks with shared edges and validate reachable progression', 'procedural-world-generation-and-validation'],
  ['Render a deterministic video composition from supplied clips with exact frame timing', 'deterministic-video-composition-and-rendering'],
]) test(`adjacent lookup keeps relevant owner: ${owner}`, () => {
  assert.ok(searchCatalog(catalog, query, {limit: 3}).results.some(row => row.id === owner));
});
