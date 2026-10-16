import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {browseCatalog,inspectSkill} from '../product/lib/navigation.mjs';

const evidence=new URL('../artifacts/qualification/cohesive-product-20261015/lane-c/',import.meta.url);
const catalog=JSON.parse(await readFile(new URL('catalog.frozen.json',evidence),'utf8'));

test('portable category navigation reaches every frozen entry without omissions or duplicates',()=>{
  const first=browseCatalog(catalog),seen=[];
  assert.equal(first.skillCount,93);assert.equal(first.categories.length,21);
  assert.equal(first.activation,'none');assert.equal(first.authority,'none');
  for(const {category,skillCount} of first.categories){
    const ids=[];let offset=0;
    do{
      const page=browseCatalog(catalog,{category,offset,limit:2});
      assert.equal(page.selection.state,'review-required');
      assert.ok(page.skills.every(s=>s.category===category&&Array.isArray(s.antiTriggers)));
      ids.push(...page.skills.map(s=>s.id));offset=page.nextOffset;
    }while(offset!==null);
    assert.equal(ids.length,skillCount);assert.deepEqual(ids,[...ids].sort());seen.push(...ids);
  }
  assert.equal(new Set(seen).size,93);
  assert.deepEqual(seen.sort(),catalog.skills.map(s=>s.id).sort());
});

test('unknown and invalid navigation cannot silently broaden a category request',()=>{
  for(const options of [{category:'absent'},{category:'../games'},{limit:2},{category:'games',limit:21},{category:'games',offset:999}]){
    assert.throws(()=>browseCatalog(catalog,options));
  }
});

const root=fileURLToPath(new URL('fixtures/pack/',evidence));
const bytes=await readFile(new URL('fixtures/pack/skills/portable-method/SKILL.md',evidence));
const skill={id:'portable-method',category:'research',summary:'Controlled fixture',taskTypes:['research'],antiTriggers:['unrelated work'],related:[],maturity:'instruction-reviewed',
  entrypoint:'skills/portable-method/SKILL.md',entrypointSha256:createHash('sha256').update(bytes).digest('hex'),
  resources:[{path:'skills/portable-method/references/detail.md',sha256:createHash('sha256').update(await readFile(new URL('fixtures/pack/skills/portable-method/references/detail.md',evidence))).digest('hex')}]};
const fixture={schema:catalog.schema,skills:[skill]};

test('inspection returns the complete selected bytes and optional pointers without expanding them',async()=>{
  const result=await inspectSkill(root,fixture,skill.id);
  assert.equal(result.content,bytes.toString('utf8'));
  assert.match(result.content,/Final line: complete entrypoints stay intact\./);
  assert.ok(!result.content.includes('must not be loaded automatically'));
  assert.deepEqual(result.resources,skill.resources);
  assert.equal(result.authority,'none');assert.equal(result.activation,'none');
  assert.equal(result.selection.state,'review-required');
});

test('inspection rejects wrong identities and paths rather than reading a different source',async()=>{
  await assert.rejects(inspectSkill(root,fixture,'../portable-method'));
  await assert.rejects(inspectSkill(root,fixture,'unknown-method'));
  await assert.rejects(inspectSkill(root,{...fixture,skills:[{...skill,entrypointSha256:'0'.repeat(64)}]},skill.id),/changed/);
  await assert.rejects(inspectSkill(root,{...fixture,skills:[{...skill,entrypoint:'../SKILL.md'}]},skill.id),/entrypoint/);
});
