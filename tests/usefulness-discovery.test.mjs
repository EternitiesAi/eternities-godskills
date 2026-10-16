import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';

const catalog = JSON.parse(await readFile(new URL('../product/catalog.json', import.meta.url), 'utf8'));
const frozen = JSON.parse(await readFile(new URL('../artifacts/qualification/usefulness-20261016/discovery/frozen-cases.json', import.meta.url), 'utf8'));

// Frozen before runtime edits. Detects lost owner recall, adjacent-owner inversion,
// refused/quoted work supplying runtime scope, and loss of no-skill boundaries.
// Expected owners come from current bodies, never from search output or helpers.
for (const item of frozen.cases) {
  test(`${item.id}: ${item.query}`, () => {
    const result = searchCatalog(catalog, item.query, item.options);
    const ids = result.results.map(candidate => candidate.id);
    for (const id of item.expected.includes || []) assert.ok(ids.includes(id), `Missing ${id}: ${ids.join(', ')}`);
    for (const id of item.expected.excludes || []) assert.ok(!ids.includes(id), `Excluded ${id}: ${ids.join(', ')}`);
    for (const [owner, adjacent] of item.expected.precedesIfPresent || []) {
      if (ids.includes(owner) && ids.includes(adjacent)) assert.ok(ids.indexOf(owner) < ids.indexOf(adjacent), `${owner} must precede ${adjacent}: ${ids.join(', ')}`);
    }
    if (item.expected.empty) assert.deepEqual(result.results, []);
    if (item.expected.abstentionReason) assert.equal(result.abstentionReason, item.expected.abstentionReason);
    assert.equal(result.authority, 'none');
    assert.equal(result.activation, 'none');
    assert.equal(result.selection.state, item.expected.empty ? 'abstain' : 'review-required');
  });
}

// Supplemental repair controls, fixed after diagnosing the baseline but before
// the runtime edit. These are development regressions, not new held-out evidence.
// Break caught: adding refusal verbs either misses their gerund/contraction forms
// or consumes separate affirmative work before/after a refusal.
for (const [query, runtimeExpected] of [
  ['Avoid fixing the shader in our browser game; prepare a scheduling note.', false],
  ['Never debug the game simulation loop; write a postponement note.', false],
  ['Fix the shader in our browser game.', true],
  ['Debug the game simulation loop.', true],
  ['Do not fix the shader, but debug the simulation loop in our browser game.', true],
  ["Don't debug the game simulation loop; fix the shader in our browser game.", true],
  ['Debug the game simulation loop, but do not fix the shader.', true],
  ['Fix the game shader, do not debug the simulation loop.', true],
]) {
  test(`repair control: ${query}`, () => {
    const result = searchCatalog(catalog, query, {limit: 20});
    assert.equal(result.results.some(item => item.id === 'eternities-arcadia'), runtimeExpected);
    assert.equal(result.authority, 'none');
    assert.equal(result.activation, 'none');
  });
}
