import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';

// These are bounded real-catalog discovery checks, not semantic applicability
// or evidence that a skill improves an agent. Missing skills or a regression
// that makes these specific user requests undiscoverable must fail.
const cases = [
  ['voice-style-calibration', 'calibrate editorial voice from writing samples'],
  ['voice-style-calibration', 'keep a writing voice consistent across different audience registers'],
  ['imaginative-concept-development', 'develop imaginative concepts with alternative mechanisms'],
  ['imaginative-concept-development', 'explore divergent story ideas before committing to a concept'],
  ['interpersonal-understanding-and-dialogue', 'understand interpersonal conflict and draft respectful dialogue'],
  ['interpersonal-understanding-and-dialogue', 'reflect what participants said before assuming their motives'],
  ['memory-retention-and-recovery', 'recover task memory with stale and conflicting records'],
  ['memory-retention-and-recovery', 'preserve decisions with source pointers after context loss'],
  ['completeness-and-consistency-audit', 'audit requirements coverage omissions and cross artifact consistency'],
  ['completeness-and-consistency-audit', 'find missing obligations and contradictions in delivered artifacts'],
  ['long-horizon-work-continuity', 'continue multi day work after interruption and uncertain effects'],
  ['long-horizon-work-continuity', 'resume a long horizon project without repeating a possibly completed paid job'],
];

for (const [id, query] of cases) {
  test(`real catalog makes ${id} discoverable for: ${query}`, async () => {
    const catalog = JSON.parse(await readFile(new URL('../product/catalog.json', import.meta.url), 'utf8'));
    const result = searchCatalog(catalog, query, {limit: 3});
    assert.ok(result.results.some(item => item.id === id),
      `Missing ${id}; observed ${result.results.map(item => item.id).join(', ')}`);
    assert.equal(result.authority, 'none');
    assert.equal(result.activation, 'none');
  });
}

test('cognitive additions do not displace an established specialist on a concrete DSP task', async () => {
  const catalog = JSON.parse(await readFile(new URL('../product/catalog.json', import.meta.url), 'utf8'));
  const result = searchCatalog(catalog, 'sample rate discontinuity in audio DSP', {limit: 3});
  assert.ok(result.results.some(item => item.id === 'audio-dsp-integrity-review'));
  assert.ok(!result.results.some(item => item.id === 'interpersonal-understanding-and-dialogue'));
});
