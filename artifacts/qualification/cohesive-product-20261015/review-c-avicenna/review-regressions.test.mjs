import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {searchCatalog,routeTask} from '../../../../product/lib/product.mjs';
const catalog=JSON.parse(readFileSync(new URL('../lane-c/catalog.frozen.json',import.meta.url),'utf8'));
const arcadia=query=>searchCatalog(catalog,query,{limit:20}).results.some(row=>row.id==='eternities-arcadia');

test('R1 ordinary game-controls implementation retains its existing game owner',()=>{
 assert.ok(arcadia('Implement game controls.'),'Baseline owner rank 1; candidate must not remove the owner merely for omitting runtime jargon.');
});
test('R1 adding an accessibility modifier does not eliminate game creation',()=>{
 assert.ok(arcadia('Build a cooperative puzzle game.'));
 assert.ok(arcadia('Build an accessible cooperative puzzle game.'),'Baseline owner rank 1; extra useful modifier is not a change of task.');
});
test('R1 parent Three.js shader creation retains baseline owner recall',()=>{
 assert.ok(arcadia('Build a real-time Three.js shader flame with sparks and responsive controls'),'Baseline owner rank 4, within default top5.');
});
test('R2 a mesh licensing request does not itself establish runtime purpose',()=>{
 assert.equal(arcadia('Audit the license for this 3D mesh.'),false,'Mesh is context, not independent evidence of a runtime operation.');
});
test('control: supported runtime asset work remains discoverable',()=>{
 assert.ok(arcadia('Integrate a glTF mesh into the game scene and check collision.'));
});
test('control: explicit IDs and host no-need remain compatible',()=>{
 for(const item of catalog.skills)assert.equal(searchCatalog(catalog,item.id,{limit:1}).results[0]?.id,item.id);
 const out=routeTask(catalog,'Implement game controls.',{need:'none',inputScope:'open',connectedPurpose:'inventory',discovery:'not-prohibited'});
 assert.deepEqual(out.search.results,[]);
 assert.equal(out.atlas.connectedSource.state,'hold');
});
test('control: recognized refusal does not defeat a limited live microtask',()=>{
 assert.deepEqual(searchCatalog(catalog,"Don't build a game; lowercase the literal text RIVER. Give only the text.").results,[]);
});

