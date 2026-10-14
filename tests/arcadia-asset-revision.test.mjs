import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {projectBeforeArcadiaAssetRevision} from './helpers/arcadia-asset-revision.mjs';
const load=async p=>JSON.parse(await readFile(new URL(p,import.meta.url),'utf8'));
const before=(await load('./fixtures/catalog-before-next-eight-20261004.json')).skills.find(x=>x.id==='eternities-arcadia');
const current=(await load('../product/catalog.json')).skills.find(x=>x.id===before.id);
test('named Arcadia revision projects exactly to immutable historical input without mutation',()=>{
  const saved=structuredClone(current);
  assert.deepEqual(projectBeforeArcadiaAssetRevision(current,before),before);
  assert.deepEqual(current,saved);
});
for(const [name,change] of [
  ['extra trigger',x=>x.triggers.push('unrelated skill')],
  ['summary drift',x=>x.summary+=' Unreviewed claim.'],
  ['body drift',x=>x.entrypointSha256='0'.repeat(64)],
  ['resource drift',x=>x.resources.at(-1).sha256='0'.repeat(64)],
  ['unlisted resource',x=>x.resources.push({path:'skills/eternities-arcadia/extra.md',sha256:'0'.repeat(64)})],
])test(`historical projection refuses ${name}`,()=>{
  const changed=structuredClone(current);change(changed);
  assert.throws(()=>projectBeforeArcadiaAssetRevision(changed,before),/Only the declared Arcadia/);
});
test('projection does not conceal unrelated owner fields',()=>{
  const changed={...current,antiTriggers:[]};
  assert.notDeepEqual(projectBeforeArcadiaAssetRevision(changed,before),before);
  const other={...current,id:'other-owner'};
  assert.equal(projectBeforeArcadiaAssetRevision(other,before),other);
});
