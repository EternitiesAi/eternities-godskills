import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');

const positivePrompts = [
  'For a game, design the player-experience sound cue for each named state transition; record when it starts or stops, how overlaps are prioritized, what mute or pause recovery does, and the equivalent non-audio signal.',
  'In my game, decide how each state change tells the player what happened through sound, how competing feedback yields, and how mute, interruption, and visual alternatives behave.',
];

const specialistPrompts = [
  {
    owner: 'eternities-orpheus',
    query: 'Transcribe supplied dialogue audio and align caption timestamps to speakers.',
  },
  {
    owner: 'audio-dsp-integrity-review',
    query: 'Review supplied audio plugin callback code for realtime allocation, feedback stability, and channel routing.',
  },
  {
    owner: 'accessibility-audit-and-remediation',
    query: 'Audit keyboard focus, screen-reader labels, contrast, and reduced motion for a pause menu.',
  },
];

test('Arcadia exposes the state-to-cue method as a packaged DRAFT reference, not a new skill', async () => {
  const [skill, metadata] = await Promise.all([
    read('product/skills/eternities-arcadia/SKILL.md'),
    read('product/skills/eternities-arcadia/skill.json').then(JSON.parse),
  ]);
  const resource = 'references/game-state-to-audio-cue.md';
  const method = await read(`product/skills/eternities-arcadia/${resource}`);

  assert.equal(metadata.id, 'eternities-arcadia');
  assert.ok(metadata.resources.includes(resource));
  assert.match(skill, /DRAFT[^\n]*game-state[^\n]*audio.cue/i);
  assert.match(method, /^# .*DRAFT/im);
  assert.match(method, /provider.neutral.*engine.independent/i);
  assert.match(method, /no network or named service/i);
});

test('direct and paraphrased game-state cue requests surface Arcadia without activating it', async () => {
  const catalog = JSON.parse(await read('product/catalog.json'));
  for (const query of positivePrompts) {
    const result = searchCatalog(catalog, query, {limit: 5});
    assert.equal(result.results[0]?.id, 'eternities-arcadia', query);
    assert.equal(result.authority, 'none');
    assert.equal(result.activation, 'none');
  }
});

test('media, DSP-integrity, and interface-accessibility requests keep their specialist owner first', async () => {
  const catalog = JSON.parse(await read('product/catalog.json'));
  for (const {owner, query} of specialistPrompts) {
    const result = searchCatalog(catalog, query, {limit: 5});
    assert.equal(result.results[0]?.id, owner, query);
    assert.equal(result.authority, 'none');
    assert.equal(result.activation, 'none');
  }
});
