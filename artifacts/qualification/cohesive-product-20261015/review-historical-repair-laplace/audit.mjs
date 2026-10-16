import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,dirname} from 'node:path';
import {isDeepStrictEqual} from 'node:util';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../..');
const author='artifacts/qualification/cohesive-product-20261015/review-historical-repair-nietzsche/';
const canonical='c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d';
const reads=new Map(), gitReads=[], checks=[];
const sha=b=>createHash('sha256').update(b).digest('hex');
function read(p,mode='machine-read'){const b=readFileSync(resolve(root,p));if(!reads.has(p))reads.set(p,{path:p,bytes:b.length,sha256:sha(b),mode});return b;}
const json=p=>JSON.parse(read(p));
const check=(name,fn)=>{try{const detail=fn();checks.push({name,status:'PASS',detail});}catch(e){checks.push({name,status:'FAIL',error:e.message});}};
const imported=async p=>{read(p,'inspected code and executed');return import(pathToFileURL(resolve(root,p)));};
function gitBlob(commit,path){const r=spawnSync('git',['show',commit+':'+path],{cwd:root,timeout:10000,maxBuffer:2e6});assert.equal(r.status,0,r.stderr?.toString());gitReads.push({commit,path,bytes:r.stdout.length,sha256:sha(r.stdout)});return r.stdout;}
const start=new Date().toISOString();
const before=json(author+'before.json'), final=json(author+'final-v1-results.json');
for(const p of ['FINAL.md','collect.mjs','before-results.json','after-results.json'])read(author+p,'inspected evidence; not executed');
const h=await imported('tests/helpers/nietzsche-historical-compatibility.mjs');
const fixtures=['tests/helpers/nietzsche-cohesive-catalog-v1.json','tests/helpers/nietzsche-adaptive-package-input-v1.json','tests/helpers/nietzsche-method-directory-before-cohesion.json'];
fixtures.forEach(p=>read(p,'inspected fixture and machine comparison'));
const snapshotResults=before.initialFiles.map(r=>({path:author+'before/'+r.path,expected:r.sha256,actual:sha(read(author+'before/'+r.path,'snapshot identity'))}));
check('14 original source snapshots match author before receipt',()=>{assert.equal(snapshotResults.length,14);for(const r of snapshotResults)assert.equal(r.actual,r.expected,r.path);return snapshotResults;});
const protectedFiles=before.protectedFiles.map(r=>({path:r.path,expected:r.sha256,actual:sha(read(r.path,'protected-byte identity only'))}));
check('95 historical/protected files unchanged',()=>{assert.equal(protectedFiles.length,95);for(const r of protectedFiles)assert.equal(r.actual,r.expected,r.path);return {count:protectedFiles.length};});
const finalInputComparison=final.inputs.map(r=>({path:r.path,authorSha256:r.sha256,currentSha256:sha(read(r.path,r.path.startsWith('tests/')?'inspected code/fixture':'runtime/input identity only'))}));
check('12 test/helper/fixture inputs still exactly author final-v1',()=>{const rows=finalInputComparison.filter(r=>r.path.startsWith('tests/'));assert.equal(rows.length,12);for(const r of rows)assert.equal(r.currentSha256,r.authorSha256,r.path);return {count:rows.length};});
const runtimeDriftSinceAuthor=finalInputComparison.filter(r=>r.authorSha256!==r.currentSha256);
const current=json('product/catalog.json'), historic=JSON.parse(gitBlob(canonical,'product/catalog.json'));
const expectedChanges=[];
for(const old of historic.skills){
 const now=current.skills.find(r=>r.id===old.id);assert.ok(now);
 const fields={};for(const key of new Set([...Object.keys(old),...Object.keys(now)]))if(!isDeepStrictEqual(old[key],now[key]))fields[key]={before:old[key],after:now[key]};
 if(Object.keys(fields).length)expectedChanges.push({id:old.id,fields});
}
check('cohesive fixture is exactly the canonical-to-current field delta',()=>{assert.equal(h.cohesiveRevision.historicalCommit,canonical);assert.equal(current.skills.length,historic.skills.length);assert.equal(expectedChanges.length,19);assert.deepEqual(h.cohesiveRevision.changes,expectedChanges);assert.deepEqual([...new Set(expectedChanges.flatMap(r=>Object.keys(r.fields)))].sort(),['entrypointSha256','resources','triggers']);return {owners:19,fields:expectedChanges.reduce((n,r)=>n+Object.keys(r.fields).length,0)};});
check('historical method directory fixture is exact canonical Git blob',()=>{assert.deepEqual(read(fixtures[2]),gitBlob(canonical,'product/METHODS.v1.json'));return {rows:h.historicalMethodDirectory.methods.length};});
check('historical package fixture is exact at canonical and certified reviewed head',()=>{for(const c of [canonical,'d62ee7e0ee012bb0adc252835904293e83fdb935'])assert.deepEqual(read(fixtures[1]),gitBlob(c,'package.json'));});
check('all current catalog records invert exactly; arbitrary unlisted drift remains observable',()=>{
 let rejected=0,visible=0;
 for(const old of historic.skills){const now=current.skills.find(r=>r.id===old.id),saved=structuredClone(now);
 assert.deepEqual(h.projectBeforeCohesiveProduct20261015(now),old);
 assert.deepEqual(now,saved);
 for(const field of ['category','summary','antiTriggers','taskTypes','related','maturity','unreviewedField']){
  const altered=structuredClone(now);altered[field]='UNREVIEWED';
  assert.notDeepEqual(h.projectBeforeCohesiveProduct20261015(altered),old);visible++;
 }
 const change=h.cohesiveRevision.changes.find(r=>r.id===old.id);
 for(const field of Object.keys(change?.fields??{})){const altered=structuredClone(now);delete altered[field];assert.throws(()=>h.projectBeforeCohesiveProduct20261015(altered));rejected++;}
 }
 return {records:historic.skills.length,unlistedFieldControls:visible,missingDeclaredFieldRejections:rejected};
});
const directory=json('product/METHODS.v1.json');
check('directory admits exactly 13 pinned additions and preserves original 8 rows',()=>{h.assertSelectedDirectoryEvolution(directory);assert.equal(directory.methods.length,21);assert.equal(h.historicalMethodDirectory.methods.length,8);return {original:8,added:13};});
check('directory rejects duplicate/reorder/owner/path/status/review-boundary drift',()=>{
 const firstNew=directory.methods.findIndex(r=>r.id===h.cohesiveRevision.newMethods[0].id);
 const mutations=[d=>d.methods.push(d.methods[0]),d=>d.methods.reverse(),d=>d.methods[firstNew].owner='eternities-atlas',d=>d.methods[firstNew].resource+='-other',d=>d.methods[firstNew].outcomeStatus='performance-qualified',d=>d.methods[firstNew].documentStatus='not-assessed-by-this-overlay',d=>delete d.methods[firstNew].review.resourceBinding,d=>d.methods[0].review.scope+='unreviewed'];
 for(const mutate of mutations){const d=structuredClone(directory);mutate(d);assert.throws(()=>h.assertSelectedDirectoryEvolution(d));}
 return {rejected:mutations.length};
});
const {inspectMethodDirectory}=await imported('product/lib/method-directory.mjs');
await inspectMethodDirectory(resolve(root,'product'),current);
const owner=directory.methods[8].owner, resource=directory.methods[8].resource;
for(const kind of ['owner-removed','resource-undeclared']){
 const altered=structuredClone(current);
 if(kind==='owner-removed')altered.skills=altered.skills.filter(r=>r.id!==owner);
 else altered.skills.find(r=>r.id===owner).resources=altered.skills.find(r=>r.id===owner).resources.filter(r=>r.path!==resource);
 try{await assert.rejects(inspectMethodDirectory(resolve(root,'product'),altered),/Invalid or undeclared/);checks.push({name:'actual directory inspector rejects '+kind,status:'PASS'});}catch(e){checks.push({name:kind,status:'FAIL',error:e.message});}
}
const v2=json('tests/fixtures/educational-discovery-revealed-v2.json'),v4=json('tests/fixtures/educational-discovery-revealed-v4.json');
check('E2-N03 expected-only single reason; old gold and every other literal stay exact',()=>{
 let baselines=0;
 for(const c of [...v2.cases,...v4.cases])if(c.baseline){
  baselines++;const saved=structuredClone(c.baseline),result=h.expectedEducationalLiteralAfterRuntimeAdmissionV4(c.id,c.baseline),expected=structuredClone(saved);
  if(c.id==='E2-N03'){assert.equal(saved.results[4].id,'eternities-arcadia');expected.results[4].reasons.push(h.rendererAdmissionReasonV4);
   assert.equal(result.results.reduce((n,r)=>n+r.reasons.length,0)-saved.results.reduce((n,r)=>n+r.reasons.length,0),1);
   for(const mutate of [b=>b.results.reverse(),b=>b.envelope.authority='active',b=>b.results[4].reasons.push('extra')]){const b=structuredClone(saved);mutate(b);assert.throws(()=>h.expectedEducationalLiteralAfterRuntimeAdmissionV4(c.id,b));}
  }else assert.equal(result,c.baseline);
  assert.deepEqual(result,expected);assert.deepEqual(c.baseline,saved);
 }
 return {literalBaselines:baselines,changedExpectedCases:1};
});
check('version projection rejects unknown versions and preserves all non-version fields',()=>{
 for(const method of ['offline-lexical-intent-phrases-v3','v5',null,undefined])assert.throws(()=>h.projectDiscoveryV4ToHistoricalV3({method}));
 const actual={method:'offline-lexical-intent-phrases-v4',authority:'active',activation:'active',selection:{state:'unknown'},results:[{id:'changed',score:-3,reasons:['extra']}],newField:123};
 const expected={...actual,method:'offline-lexical-intent-phrases-v3'};
 assert.deepEqual(h.projectDiscoveryV4ToHistoricalV3(actual),expected);
});
check('package inverse accepts only maintained test/check scripts',()=>{
 const manifest=json('package.json');h.assertMaintainedScopePackageRevision(manifest);
 const changes=[p=>p.version='99',p=>p.dependencies.acorn='*',p=>p.scripts.build='unreviewed',p=>p.scripts.test='node --test',p=>delete p.scripts.check,p=>p.extra=true];
 for(const change of changes){const m=structuredClone(manifest);change(m);assert.throws(()=>h.assertMaintainedScopePackageRevision(m));}
 return {rejected:changes.length};
});
const diffs=[];
for(const row of before.initialFiles.filter(r=>/^tests\/[^/]+\.test\.mjs$/.test(r.path))){
 const r=spawnSync('git',['diff','--no-index','--',author+'before/'+row.path,row.path],{cwd:root,encoding:'utf8',timeout:10000,maxBuffer:1e6});
 assert.equal(r.status,1);diffs.push({path:row.path,beforeSha256:row.sha256,afterSha256:sha(read(row.path)),diffSha256:sha(r.stdout),diff:r.stdout});
}
const args=['--test','--test-reporter=tap',...final.command.slice(3)];
assert.equal(args.length,8);
assert.equal(process.env.GODSKILLS_PRODUCT_ROOT,undefined,'No alternate product fixture');
assert.equal(process.env.GODSKILLS_REPOSITORY_ROOT,undefined,'No alternate repository fixture');
const run=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout:60000,maxBuffer:4e6});
const focused={command:[process.execPath,...args],status:run.status,error:run.error?.message??null,stdout:run.stdout,stderr:run.stderr,counts:run.stdout.split(/\r?\n/).filter(l=>/^# (tests|pass|fail|skipped|duration_ms) /.test(l))};
check('six focused test files pass on current bound runtime',()=>{assert.equal(run.error,undefined);assert.equal(run.status,0);assert.match(run.stdout,/# pass 90/);assert.match(run.stdout,/# fail 0/);});
const readSet=[...reads.values()];
const stability=readSet.map(r=>({path:r.path,beforeSha256:r.sha256,afterSha256:sha(readFileSync(resolve(root,r.path)))}));
check('all bound read inputs stable across independent audit and focused run',()=>assert.deepEqual(stability.filter(r=>r.beforeSha256!==r.afterSha256),[]));
console.log(JSON.stringify({schema:'laplace-historical-compatibility-review-v1',startedAt:start,finishedAt:new Date().toISOString(),node:process.version,root,canonical,scope:'test/helper compatibility only; no runtime RR1 review or method-body acceptance',status:checks.every(c=>c.status==='PASS')?'PASS':'REPAIR',checks,runtimeDriftSinceAuthor,finalInputComparison,protectedFiles,readSet,gitReads,stability,diffs,focused},null,2));
process.exitCode=checks.every(c=>c.status==='PASS')?0:1;

