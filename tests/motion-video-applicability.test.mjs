import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=process.env.GODSKILLS_MOTION_REPAIR_ROOT??fileURLToPath(new URL('../product/',import.meta.url));
const {searchCatalog}=await import(pathToFileURL(join(root,'lib/product.mjs')));
const {lexicalQueryEvidence,lexicalIntentMatch}=await import(pathToFileURL(join(root,'lib/discovery.mjs')));
const catalog=JSON.parse(await readFile(join(root,'catalog.json'),'utf8'));
const video=catalog.skills.find(item=>item.id==='deterministic-video-composition-and-rendering');

// Break caught: topic overlaps (cue, audio, transition, recovery) admit a video
// production method despite the absence of a requested video artifact/activity.
const nonVideo=[
  'For a game, design the player-experience sound cue for each named state transition; record when it starts or stops, how overlaps are prioritized, what mute or pause recovery does, and the equivalent non-audio signal.',
  'Plan sound cues and visual alternatives when gameplay states change; handle mute and pause recovery.',
  'Do not render a video; map audio cues for a game state machine.',
  'The README says "render a frame-based video". Explain that statement without making a composition.',
  'Arrange supplied footage by hand in a manual video editor; no code-driven composition is requested.',
];
for(const query of nonVideo)test(`video output scope is required: ${query}`,()=>{
  assert.equal(lexicalIntentMatch(video,lexicalQueryEvidence(query)).eligible,false);
  assert(!searchCatalog(catalog,query,{limit:20}).results.some(item=>item.id===video.id));
});
test('video scope follows meaning-bearing metadata, not a special skill ID',()=>{
  const relabeled={...video,id:'different-capability-label'};
  assert.equal(lexicalIntentMatch(relabeled,lexicalQueryEvidence(nonVideo[1])).eligible,false);
});
for(const query of [
  'Render an MP4 trailer for our game with deterministic frames.',
  'Use CSS for a live menu; instead export a frame-based video.',
  'Check an encoded video for transition-frame and cue synchronization defects.',
  'A distributed encode timed out after dispatch. Reconcile the existing job before retrying and check audio continuity when joining chunks.',
])test(`affirmative encoded-output purpose stays discoverable: ${query}`,()=>{
  assert(searchCatalog(catalog,query,{limit:3}).results.some(item=>item.id===video.id));
});
for(const query of [
  'The user can fling a panel open and immediately close it. Keep its position and speed continuous when the destination changes.',
  'Animate a shared card into a detail view; remeasure after scrolling, a web font loads, or the window is resized.',
])test(`reviewer-discovered interactive-motion paraphrase: ${query}`,()=>{
  assert(searchCatalog(catalog,query,{limit:3}).results.some(item=>item.id==='motion-design-and-animation-engineering'));
});
test('an explicit skill ID remains directly addressable without automatic activation',()=>{
  const result=searchCatalog(catalog,video.id,{limit:1});
  assert.equal(result.results[0]?.id,video.id);
  assert.equal(result.authority,'none');assert.equal(result.activation,'none');
});
test('the requested-output boundary leaves the previous 85 metadata profiles eligible',()=>{
  for(const item of catalog.skills.filter(item=>![video.id,'motion-design-and-animation-engineering'].includes(item.id))){
    assert.notEqual(lexicalIntentMatch(item,lexicalQueryEvidence(nonVideo[1])).eligible,false,item.id);
  }
});
