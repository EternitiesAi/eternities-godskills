import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog, routeTask} from '../product/lib/product.mjs';

const catalog = JSON.parse(await readFile(new URL('../product/catalog.json', import.meta.url), 'utf8'));
// Authored development cases, not held-out semantic evaluation.
// Break caught: broad visual/media owners hide a requested specialist method.
const cases = [
  ['motion-design-and-animation-engineering', 'Design interruptible spring choreography for an interactive drag gesture and layout animation.'],
  ['motion-design-and-animation-engineering', 'Make a drawer reverse smoothly when tapped twice, without trapping keyboard focus or ignoring reduced motion.'],
  ['motion-design-and-animation-engineering', 'Coordinate staggered UI transitions with easing and safe cancellation when their targets change.'],
  ['deterministic-video-composition-and-rendering', 'Render data-driven MP4 clips from a seekable frame-based composition and recover failed render jobs.'],
  ['deterministic-video-composition-and-rendering', 'Export the same scene after random-order seeks, with exact cue timing and frozen fonts, rather than a live playback recording.'],
  ['deterministic-video-composition-and-rendering', 'Verify encoded programmatic video at the first, transition and final frames with synchronized audio.'],
];
for (const [id, query] of cases) test(`${id} is discoverable for ${query}`, () => {
  const result = searchCatalog(catalog, query, {limit:3, need:'specialist'});
  assert(result.results.some(item=>item.id===id), JSON.stringify(result.results.map(item=>item.id)));
  assert.equal(result.activation,'none');
  assert.equal(result.authority,'none');
});
// Break caught: adding a method implicitly bypasses host discovery prohibition.
for (const [,query] of [cases[0],cases[3]]) test(`no-specialist request abstains for ${query}`,()=>{
  const result=routeTask(catalog,query,{need:'none',inputScope:'supplied-only',discovery:'prohibited',connectedPurpose:'none'});
  assert.deepEqual(result.search.results,[]);
  assert.equal(result.selection.state,'abstain');
});
// Break caught: a concrete adjacent method is displaced by generic media terms.
for (const [id,query] of [
  ['scene-continuity-and-coverage','Storyboard camera coverage and prop geography across film cuts'],
  ['audio-dsp-integrity-review','Inspect sample-rate discontinuity and unstable feedback in an audio DSP callback'],
  ['accessibility-audit-and-remediation','Repair keyboard trap and screen reader errors in an accessible dialog'],
]) test(`adjacent specialist still owns ${query}`,()=>{
  assert.equal(searchCatalog(catalog,query,{limit:3,need:'specialist'}).results[0]?.id,id);
});
for (const [id,query] of [
  ['motion-design-and-animation-engineering','Simple one-property CSS transition: change a hover color only'],
  ['deterministic-video-composition-and-rendering','Transcription only: extract speech from supplied video without a new composition'],
]) test(`explicit adjacent task excludes ${id}`,()=>{
  assert(!searchCatalog(catalog,query,{limit:20}).results.some(item=>item.id===id));
});
