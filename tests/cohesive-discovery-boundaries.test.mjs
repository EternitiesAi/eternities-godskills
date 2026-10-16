import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';
import {lexicalQueryEvidence,lexicalIntentMatch} from '../product/lib/discovery.mjs';
import {lexicalSelectionBoundary} from '../product/lib/selection-boundary.mjs';

const catalog=JSON.parse(await readFile(new URL('../artifacts/qualification/cohesive-product-20261015/lane-c/catalog.frozen.json',import.meta.url),'utf8'));
const runtime=catalog.skills.find(s=>s.id==='eternities-arcadia');
// Repair comparisons use one exact current-metadata snapshot for both code
// versions, separate from the original historical catalog above.
const repairCatalog=JSON.parse(await readFile(new URL('../artifacts/qualification/cohesive-product-20261015/lane-c-repair-v2/catalog.current-metadata.final.json',import.meta.url),'utf8'));

for(const query of [
  'Implement game controls.',
  'Implement player movement and camera controls for my game.',
  'Balance combat difficulty in our game.',
  'Add checkpoint saves to the game.',
  'Debug Unity input handling.',
  'Implement controller support for my game.',
  'Improve game onboarding and feedback.',
  'Make game controls accessible to players.',
  'Build an accessible cooperative puzzle game.',
  'Create a relaxing turn based strategy game.',
  'Build a small accessible cooperative nonviolent exploration puzzle game for two people.',
])test(`R1 supported game work survives without purpose jargon or modifier limits: ${query}`,()=>{
  assert.ok(searchCatalog(repairCatalog,query,{limit:20,need:'specialist'}).results.some(s=>s.id===runtime.id),query);
});

test('R1 supported shader creation retains default-five recall',()=>{
  const query='Build a real-time Three.js shader flame with sparks and responsive controls';
  assert.ok(searchCatalog(repairCatalog,query,{limit:5}).results.some(s=>s.id===runtime.id));
});

test('R1 current metadata supports the gameplay-camera task without an added scene word',()=>{
  const query='Our character is readable in a turntable but disappears at the gameplay camera; improve its silhouette without changing the art style.';
  assert.ok(searchCatalog(repairCatalog,query,{limit:3}).results.some(s=>s.id===runtime.id));
});

for(const query of [
  'The imported mesh is mirrored and the pivot is wrong after converting coordinate axes.',
  'Textures are missing from the packaged model after import.',
  'The 3D skeleton is broken after import.',
])test(`R1 reported technical faults do not require an imperative work verb: ${query}`,()=>{
  assert.ok(searchCatalog(repairCatalog,query,{limit:20}).results.some(s=>s.id===runtime.id),query);
});

test('R2 an ordinary asset description is not an observed failure or requested work',()=>{
  assert.ok(!lexicalQueryEvidence('The mesh is present.').intents.some(p=>p.name==='game or real-time 3D runtime scope'));
});

for(const query of [
  'Audit the license for this 3D mesh.',
  'Review the license obligations for these mesh assets.',
  'Extract attribution obligations for the textures.',
  'Compare GPU prices for a workstation.',
])test(`R2 non-runtime work cannot gain admission from its asset noun: ${query}`,()=>{
  assert.ok(!searchCatalog(repairCatalog,query,{limit:20}).results.some(s=>s.id===runtime.id));
});

test('R2 object-only navigation never claims corroborated runtime purpose',()=>{
  for(const query of ['mesh','meshes','textures','gpu']){
    const result=searchCatalog(repairCatalog,query,{limit:20});
    assert.ok(result.results.every(s=>!s.reasons.some(r=>r.startsWith('Lexical intent: game or real-time 3D runtime scope'))),query);
  }
});

test('R2 separate live runtime work survives a license or pricing clause',()=>{
  for(const query of [
    'Review the license obligations for the mesh; integrate the mesh into our Unity game.',
    'Compare GPU prices for a workstation. Instead implement game camera controls.',
  ])assert.ok(searchCatalog(repairCatalog,query,{limit:20}).results.some(s=>s.id===runtime.id),query);
});

test('R1/R2 repaired admission follows renamed capability metadata',()=>{
  const original=repairCatalog.skills.find(s=>s.id===runtime.id);
  const item={...original,id:'playable-experience-method',entrypoint:'skills/playable-experience-method/SKILL.md'};
  const input={...repairCatalog,skills:[item]};
  assert.equal(searchCatalog(input,'Implement game controls.').results[0]?.id,item.id);
  assert.deepEqual(searchCatalog(input,'Audit the license for this 3D mesh.').results,[]);
});

test('runtime eligibility follows capability metadata under a different ID',()=>{
  const skill={...runtime,id:'interactive-scene-integration',entrypoint:'skills/interactive-scene-integration/SKILL.md'};
  const local={...catalog,skills:[skill]};
  for(const query of ['Fix the mesh collision in a game scene.','Integrate a glTF exhibit in Three.js and validate material slots.']){
    assert.equal(searchCatalog(local,query).results[0]?.id,skill.id);
  }
  for(const query of ['Repair GIS coordinate axes using independent controls.','Review the 3D asset license agreement.']){
    assert.deepEqual(searchCatalog(local,query).results,[]);
  }
});

test('runtime eligibility never keys on the published owner ID or generic asset overlap',()=>{
  const nonRuntime={...runtime,summary:'Extract license obligations and attribution conditions',triggers:['asset license agreement']};
  assert.equal(searchCatalog({...catalog,skills:[nonRuntime]},'Review the asset license agreement.').results[0]?.id,runtime.id);
});

test('eligibility changes admission without inventing an extra ranking bonus',()=>{
  const match=lexicalIntentMatch(runtime,lexicalQueryEvidence('Check mesh units in an Unreal scene.'));
  assert.equal(match.eligible,true);
  assert.equal(match.score,0);
});

test('quoted and refused runtime work cannot corroborate other live clauses',()=>{
  for(const query of [
    'Do not build a game or import meshes; review license obligations.',
    'Never integrate a Unity scene. Fix the drawer animation with continuous velocity.',
    'The supplied text says "game scene mesh collision"; extract the contract obligations.',
    'The supplied text says ‘game scene mesh collision’; extract the contract obligations.',
  ])assert.ok(!searchCatalog(catalog,query,{limit:20}).results.some(s=>s.id===runtime.id),query);
});

test('a contrast can introduce live runtime work after a refusal',()=>{
  assert.ok(searchCatalog(catalog,'Do not review the license, but integrate the glTF mesh into our game scene.',{limit:3}).results.some(s=>s.id===runtime.id));
});

test('ordinary game creation requests do not require imported-asset jargon',()=>{
  for(const query of ['Build a small game.','Make a playable prototype.','Design our game progression.']){
    assert.ok(searchCatalog(catalog,query,{limit:3}).results.some(s=>s.id===runtime.id),query);
  }
});

test('single-term topic navigation retains recall while requiring host review',()=>{
  for(const query of ['game','animation','assets','model']){
    const result=searchCatalog(catalog,query,{limit:20});
    assert.ok(result.results.some(s=>s.id===runtime.id),query);
    assert.deepEqual(result.selection,{state:'review-required',basis:'lexical-candidates-only'});
  }
});

test('exact IDs, filters, stable ties and host no-need survive eligibility',()=>{
  const before=structuredClone(catalog);
  for(const s of catalog.skills)assert.equal(searchCatalog(catalog,s.id,{limit:1}).results[0]?.id,s.id);
  const query='Integrate a glTF model in a game scene.';
  assert.deepEqual(searchCatalog(catalog,query,{need:'none'}).results,[]);
  assert.ok(!searchCatalog(catalog,query,{category:'legal'}).results.some(s=>s.id===runtime.id));
  assert.ok(!searchCatalog(catalog,query,{taskType:'communicate'}).results.some(s=>s.id===runtime.id));
  const tied={...catalog,skills:['zeta-runtime','alpha-runtime'].map(id=>({...runtime,id}))};
  assert.deepEqual(searchCatalog(tied,query).results.map(s=>s.id),['alpha-runtime','zeta-runtime']);
  assert.deepEqual(searchCatalog(tied,query),searchCatalog({...tied,skills:[...tied.skills].reverse()},query));
  assert.deepEqual(catalog,before);
});

test('a live workflow survives quotes, refusals and a concise output constraint',()=>{
  for(const query of [
    'Avoid auditing assets. Build a word count service and give only the implementation.',
    'Do not compare the proposals, but audit obligations across the documents; give only the findings.',
    'Audit obligations across documents; uppercase the literal text “build a game”. Give only the findings.',
    'Audit obligations across documents, do not build a game. Count the words; give only the findings.',
  ])assert.ok(searchCatalog(catalog,query).results.length>0,query);
});

test('arithmetic exclusions use live text rather than quoted arithmetic data',()=>{
  assert.equal(lexicalSelectionBoundary('The note says "what is 8 plus 4". Give only the findings.'),null);
  assert.equal(lexicalSelectionBoundary('Never calculate 8 plus 4; give only the findings.'),null);
  for(const expression of ['Calculate -1.5 + 2. Only the result.','What is 8 divided by 4? Give only the number.']){
    assert.equal(lexicalSelectionBoundary(expression),'explicit-limited-micro-task');
  }
});
