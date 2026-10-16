import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {nextAction} from './recovery-dirac/next-action.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(here,'../../../..');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const json=p=>JSON.parse(fs.readFileSync(path.join(here,p),'utf8'));
const rubric=json('fixtures/acceptance.json');
const rows=fs.readFileSync(path.join(here,'company-avicenna/cash.csv'),'utf8').trim().split(/\r?\n/).slice(1).map(row=>row.split(',').map(Number));
assert.equal(rows.length,4);
assert.deepEqual(rows.map(x=>x[4]),rubric['company-week'].closingCash);
assert.deepEqual(rows.map(x=>x[5]),rubric['company-week'].reserveGap);
for(let i=0;i<rows.length;i++){
  const [week,opening,receipts,payments,closing,gap]=rows[i];
  assert.equal(week,i+1);assert.equal(opening,i?rows[i-1][4]:40000);
  assert.equal(opening+receipts-payments,closing);assert.equal(gap,Math.max(0,15000-closing));
}
let combinations=0;
for(const paused of [false,true])for(const deployment of ['unknown','absent','running','succeeded','failed'])for(const smoke of ['running','passed','failed','not-started'])for(const authorizedEnvironment of ['staging','production']){
  let expected;
  if(authorizedEnvironment==='production')expected='reject-scope';
  else if(paused)expected='observe-only';
  else if(deployment==='unknown')expected='lookup-existing-operation';
  else if(deployment==='running')expected='wait-existing-operation';
  else if(deployment==='failed'||smoke==='failed')expected='repair-after-failure';
  else if(deployment==='absent')expected='submit-staging-once';
  else expected={running:'wait-existing-operation',passed:'complete','not-started':'run-staging-smoke'}[smoke];
  assert.equal(nextAction({paused,deployment,smoke,authorizedEnvironment}),expected);combinations++;
}
assert.equal(combinations,80);
for(const value of [null,{},[],{paused:'false',deployment:'unknown',smoke:'running',authorizedEnvironment:'staging'}])assert.throws(()=>nextAction(value),TypeError);
const study=json('experiment-laplace/next-study.json');
assert.equal(study.status,'PROPOSED_NOT_EXECUTED');
assert.equal(study.allocation_and_limits.initial_runs,study.allocation_and_limits.independent_tasks*2);
assert(study.failure_and_missingness&&study.scoring.blinding&&study.predeclared_adoption_rule);
const sources=[];
function collect(value){
  if(!value||typeof value!=='object')return;
  if(typeof value.path==='string'&&typeof value.sha256==='string'){
    const normalized=value.path.replaceAll('\\','/');
    const at=normalized.indexOf('product/skills/');
    assert(at>=0,'Unexpected consumer method location');
    const relative=normalized.slice(at);
    assert(!relative.split('/').includes('..'));
    assert.equal(hash(path.join(repo,relative)),value.sha256,'Consumer guidance changed: '+relative);
    sources.push({path:relative,sha256:value.sha256});
  }
  for(const child of Object.values(value))if(typeof child==='object')collect(child);
}
for(const name of ['experiment-laplace','recovery-dirac','company-avicenna'])collect(json(name+'/used-methods.json'));
console.log(JSON.stringify({status:'PASS',cashWeeks:4,recoveryValidStates:combinations,invalidStates:4,exactMethodReads:sources.length,study:'proposed-only',boundary:'Arithmetic, state reducer and source hashes only. Semantic acceptance is separately recorded by the parent; no live company/deployment or comparative model outcome.'},null,2));
