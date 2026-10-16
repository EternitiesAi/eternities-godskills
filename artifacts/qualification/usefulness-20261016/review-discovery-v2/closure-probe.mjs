// Read-only closure review: unchanged v1 controls and bounded new forms.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {searchCatalog} from '../../../../product/lib/product.mjs';
import {affirmativeRequestClauses} from '../../../../product/lib/request-scope.mjs';
const root=new URL('../../../../',import.meta.url);
const old='artifacts/qualification/usefulness-20261016/review-discovery-v1/';
const own='artifacts/qualification/usefulness-20261016/review-discovery-v2/';
const read=path=>readFile(new URL(path,root));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputs=JSON.parse(await read(own+'input-bindings.json'));
for(const file of inputs.files){const b=await read(file.path);assert.equal(sha(b),file.sha256);assert.equal(b.length,file.bytes);}
const scope=await read('product/lib/request-scope.mjs');
const baseline=execFileSync('git',['show',inputs.baseline+':product/lib/request-scope.mjs'],{cwd:fileURLToPath(root)});
const baseText=baseline.toString('utf8');
assert.equal(baseText.split('|compar\\w*').length,2);
const expected=baseText.replace('|compar\\w*','|fix(?:ing)?|debug(?:ging)?|compar\\w*');
assert.equal(scope.toString('utf8'),expected,'Change exceeds the two bounded additions to baseline');
const reconstructedV1=baseText.replace('|compar\\w*','|fix\\w*|debug\\w*|compar\\w*');
assert.equal(sha(reconstructedV1),'cc4dd37aa161acbb56d5e7ff19b484e762d4290fb0bdc4716acf964932dc64fb');
const controlBytes=await read(old+'controls.json');
assert.equal(sha(controlBytes),'3ffff4867c26402842fac8215a9ef18f65ee0526734daca5578ff42a9c22361a');
const controls=JSON.parse(controlBytes);
const prior=JSON.parse(await read(old+'results.json'));
const catalog=JSON.parse(await read('product/catalog.json'));
const additionalBytes=await read(own+'additional-controls.json');
const additional=JSON.parse(additionalBytes);
const records=[];
function observe(id,query,options,expected,origin){
  const output=searchCatalog(catalog,query,options);
  const ids=output.results.map(x=>x.id),actual=ids.includes('eternities-arcadia');
  assert.equal(output.authority,'none');assert.equal(output.activation,'none');
  assert.ok(['review-required','abstain'].includes(output.selection.state));
  if(expected!==null)assert.equal(actual,expected,id);
  const record={id,origin,query,options,expectedArcadia:expected,scored:expected!==null,
    actualArcadia:actual,rank:actual?ids.indexOf('eternities-arcadia')+1:null,
    returnedIds:ids,clauses:affirmativeRequestClauses(query),selection:output.selection,
    authority:output.authority,activation:output.activation,completeOutputSha256:sha(JSON.stringify(output))};
  records.push(record);return record;
}
for(const row of controls.controls){
  const record=observe(row.id,row.query,row.options,row.expected.arcadia,'unchanged-v1');
  const before=prior.fresh.find(x=>x.id===row.id);assert.ok(before);
  record.v1Regression=before.regression;
  record.matchesBaselineOutput=record.completeOutputSha256===before.completeOutputSha256.baseline;
  record.matchesV1CandidateOutput=record.completeOutputSha256===before.completeOutputSha256.candidate;
  if(before.regression)assert.ok(record.matchesBaselineOutput,'Prefix regression did not restore baseline output: '+row.id);
  else assert.ok(record.matchesV1CandidateOutput,'Unexpected output change outside six regressions: '+row.id);
}
for(const row of additional.cases)observe(row.id,row.query,{limit:20},row.arcadia,'v2-additional');
assert.equal(records.filter(x=>x.origin==='unchanged-v1'&&x.scored).length,30);
assert.equal(records.filter(x=>x.origin==='unchanged-v1'&&!x.scored).length,3);
assert.equal(records.filter(x=>x.v1Regression).length,6);
for(const file of inputs.files)assert.equal(sha(await read(file.path)),file.sha256,'Input changed during closure review');
assert.equal(sha(await read(own+'additional-controls.json')),sha(additionalBytes));
console.log(JSON.stringify({schema:'discovery-closure-results-v2',recordedAt:new Date().toISOString(),node:process.version,
  baseline:inputs.baseline,baselineScopeSha256:sha(baseline),candidateScopeSha256:sha(scope),
  controlsSha256:sha(controlBytes),additionalControlsSha256:sha(additionalBytes),
  exactChange:'Baseline plus only |fix(?:ing)?|debug(?:ging)?; all prior families and other bytes unchanged.',
  summary:{unchangedScoredPass:30,unscoredObservations:3,additionalPass:additional.cases.length,
    priorRegressionsClosed:6,restoredBaselineOutputs:6,otherV1OutputsUnchanged:27,inputBindingsVerified:inputs.files.length},records}));
