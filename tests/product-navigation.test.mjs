import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, cp, readFile, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {buildProduct} from '../product/lib/product.mjs';

// This independent three-skill catalog makes omission, duplicate count, wrong
// category, truncation and automatic-reference-loading failures observable.
const root = await mkdtemp(join(tmpdir(), 'godskills-navigation-'));
const pack = join(root, 'portable');
await mkdir(pack);
await cp(resolve('product/bin'), join(pack, 'bin'), {recursive:true});
await cp(resolve('product/lib'), join(pack, 'lib'), {recursive:true});
for (const [id, category, related] of [
  ['repair-method','engineering',['build-method']],
  ['build-method','engineering',['repair-method']],
  ['voice-method','writing',[]],
]) {
  const directory=join(pack,'skills',id);
  await mkdir(join(directory,'references'),{recursive:true});
  await writeFile(join(directory,'SKILL.md'),`---\nname: ${id}\ndescription: A complete ${id} method\n---\n# ${id}\n\nUse only for the actual task.\n\nRead [details](references/details.md) if needed.\n\nEND OF COMPLETE ENTRYPOINT\n`);
  await writeFile(join(directory,'references/details.md'),'OPTIONAL REFERENCE BODY MUST NOT BE LOADED AUTOMATICALLY\n');
  await writeFile(join(directory,'skill.json'),JSON.stringify({id,category,summary:`Use ${id} on relevant tasks`,triggers:[id],antiTriggers:['unrelated tiny task'],taskTypes:['build'],related,resources:['references/details.md'],maturity:'instruction-reviewed',provenance:[{kind:'original',source:'navigation-test-fixture',note:'No skill performance claim'}]}));
}
await buildProduct(pack);
const catalog=JSON.parse(await readFile(join(pack,'catalog.json'),'utf8'));
function cli(...args) {
  return spawnSync(process.execPath,[join(pack,'bin/godskills.mjs'),...args],{cwd:root,encoding:'utf8',env:{SystemRoot:process.env.SystemRoot??'',PATH:''}});
}
function success(...args) {
  const run=cli(...args);assert.equal(run.status,0,run.stderr);return JSON.parse(run.stdout);
}
function noAuthority(value) {
  assert.equal(value.authority,'none');assert.equal(value.activation,'none');
  assert.equal(value.selection.state,'review-required');
}

test('browse lists every category exactly once with correct counts and no skill bodies',()=>{
  const output=success('browse');noAuthority(output);
  assert.deepEqual(output.categories,[{category:'engineering',skillCount:2},{category:'writing',skillCount:1}]);
  assert.equal(output.skillCount,3);
  assert.equal(output.skills,undefined);
  assert.doesNotMatch(JSON.stringify(output),/END OF COMPLETE|OPTIONAL REFERENCE/);
  assert.deepEqual(success('browse'),output,'Stable metadata navigation must be deterministic');
});

test('category browse preserves exact membership and fit metadata without unrelated skills',()=>{
  const output=success('browse','--category','engineering');noAuthority(output);
  assert.equal(output.category,'engineering');assert.equal(output.skillCount,2);
  assert.deepEqual(output.skills.map(x=>x.id),['build-method','repair-method']);
  for(const item of output.skills){
    assert.equal(item.category,'engineering');assert.equal(item.maturity,'instruction-reviewed');
    assert.deepEqual(item.antiTriggers,['unrelated tiny task']);
    assert.match(item.entrypoint,/^skills\/[a-z-]+\/SKILL\.md$/);
    assert.match(item.entrypointSha256,/^[a-f0-9]{64}$/);
    assert.equal(item.content,undefined);
  }
});

test('inspect returns the complete exact entrypoint with optional reference pointers, not their bodies',async()=>{
  const output=success('inspect','voice-method');noAuthority(output);
  const source=await readFile(join(pack,'skills/voice-method/SKILL.md'),'utf8');
  assert.equal(output.skill.id,'voice-method');
  assert.equal(output.content,source);
  assert.equal(output.skill.entrypointSha256,createHash('sha256').update(source).digest('hex'));
  assert.deepEqual(output.resources,catalog.skills.find(x=>x.id==='voice-method').resources);
  assert.doesNotMatch(JSON.stringify(output),/OPTIONAL REFERENCE BODY MUST NOT/);
  assert.match(output.content,/END OF COMPLETE ENTRYPOINT\n$/);
});

test('category pagination is exhaustive, deterministic and explicit about remaining entries',()=>{
  const first=success('browse','--category','engineering','--limit','1');
  assert.deepEqual(first.skills.map(x=>x.id),['build-method']);
  assert.equal(first.skillCount,2);assert.equal(first.offset,0);assert.equal(first.nextOffset,1);
  const second=success('browse','--category','engineering','--limit','1','--offset','1');
  assert.deepEqual(second.skills.map(x=>x.id),['repair-method']);
  assert.equal(second.nextOffset,null);assert.equal(second.skillCount,2);
  for(const flags of [['--limit','0'],['--limit','21'],['--offset','-1'],['--offset','2'],['--offset','1.5'],['--limit','NaN']]){
    const run=cli('browse','--category','engineering',...flags);
    assert.notEqual(run.status,0);assert.equal(run.stdout,'');
  }
});

test('browse and inspect reject unknown identities, ambiguous arguments and path traversal',()=>{
  for(const args of [
    ['browse','--category','not-a-category'],['browse','business'],
    ['browse','--category','engineering','--category','writing'],
    ['browse','--limit','1'],['inspect'],['inspect','voice-method','another'],
    ['inspect','../README.md'],['inspect','C:/private'],['inspect','not-a-skill'],
  ]){
    const run=cli(...args);assert.notEqual(run.status,0,args.join(' '));
    assert.equal(run.stdout,'','Errors must not leak successful-looking content');
    assert.equal(typeof JSON.parse(run.stderr).error,'string');
  }
});

test('navigation refuses an altered pack instead of displaying unverified content',async()=>{
  const altered=join(root,'altered');await cp(pack,altered,{recursive:true});
  await writeFile(join(altered,'skills/voice-method/SKILL.md'),'TAMPERED PRIVATE CONTENT');
  for(const args of [['browse'],['inspect','voice-method']]){
    const run=spawnSync(process.execPath,[join(altered,'bin/godskills.mjs'),...args],{cwd:root,encoding:'utf8'});
    assert.notEqual(run.status,0);assert.equal(run.stdout,'');assert.doesNotMatch(run.stderr,/TAMPERED PRIVATE CONTENT/);
  }
});

test('navigation is read-only and does not rewrite a valid pack manifest',async()=>{
  const before=await readFile(join(pack,'release.json'));
  success('browse');success('browse','--category','writing');success('inspect','repair-method');
  assert.deepEqual(await readFile(join(pack,'release.json')),before);
});
