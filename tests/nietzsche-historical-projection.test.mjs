import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {cohesiveRevision,projectBeforeCohesiveProduct20261015,assertSelectedDirectoryEvolution,projectDiscoveryV4ToHistoricalV3,expectedEducationalLiteralAfterRuntimeAdmissionV4,rendererAdmissionReasonV4,assertMaintainedScopePackageRevision} from './helpers/nietzsche-historical-compatibility.mjs';
import {projectCatalogBeforeUsefulnessRelease20261016,projectDirectoryBeforeUsefulnessRelease20261016} from './helpers/usefulness-historical-compatibility.mjs';
const load=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
const catalog=projectCatalogBeforeUsefulnessRelease20261016(load('../product/catalog.json'));

test('Nietzsche named cohort projection retains all unlisted fields and rejects declared-field tampering',()=>{
  for(const revision of cohesiveRevision.changes){
    const current=catalog.skills.find(row=>row.id===revision.id),saved=structuredClone(current);
    const projected=projectBeforeCohesiveProduct20261015(current);
    for(const [field,values]of Object.entries(revision.fields)){
      assert.deepEqual(projected[field],values.before);
      const altered=structuredClone(current);altered[field]=null;
      assert.throws(()=>projectBeforeCohesiveProduct20261015(altered),/Only the declared cohesive/);
    }
    const unrelated={...current,antiTriggers:['UNREVIEWED'],unlistedField:'UNREVIEWED'};
    const visible=projectBeforeCohesiveProduct20261015(unrelated);
    assert.deepEqual(visible.antiTriggers,['UNREVIEWED']);assert.equal(visible.unlistedField,'UNREVIEWED');
    assert.notDeepEqual(visible,projected);assert.deepEqual(current,saved);
  }
  const other={id:'not-in-this-revision',summary:'untouched'};
  assert.equal(projectBeforeCohesiveProduct20261015(other),other);
});

test('Nietzsche selected directory rejects original-row drift, changed added bindings, missing reviews and unknown rows',()=>{
  const directory=projectDirectoryBeforeUsefulnessRelease20261016(load('../product/METHODS.v1.json'));assertSelectedDirectoryEvolution(directory);
  for(const mutate of [
    d=>d.methods[0].tasks.push('UNREVIEWED'),
    d=>d.methods.shift(),
    d=>d.methods.find(r=>r.id===cohesiveRevision.newMethods[0].id).resourceSha256='0'.repeat(64),
    d=>delete d.methods.find(r=>r.id===cohesiveRevision.newMethods[0].id).review,
    d=>d.methods.push({...d.methods.at(-1),id:'unreviewed-extra-method'}),
  ]){const changed=structuredClone(directory);mutate(changed);assert.throws(()=>assertSelectedDirectoryEvolution(changed));}
});

test('Nietzsche v4-to-v3 projection changes only the named version label',()=>{
  const current={method:'offline-lexical-intent-phrases-v4',authority:'none',activation:'none',selection:{state:'review-required'},results:[{id:'owner',score:17,reasons:['actual reason']}],extra:'visible'};
  const saved=structuredClone(current),old=projectDiscoveryV4ToHistoricalV3(current);
  assert.deepEqual(old,{...current,method:'offline-lexical-intent-phrases-v3'});assert.deepEqual(current,saved);
  assert.throws(()=>projectDiscoveryV4ToHistoricalV3({...current,method:'unknown-v5'}),/Unexpected current discovery version/);
  for(const mutate of [r=>r.results[0].score++,r=>r.results[0].reasons.push('UNREVIEWED'),r=>r.activation='active',r=>r.selection.state='abstain',r=>r.results[0].id='different-owner']){
    const changed=structuredClone(current);mutate(changed);assert.notDeepEqual(projectDiscoveryV4ToHistoricalV3(changed),old);
  }
});

test('Nietzsche package transition rejects dependency, unrelated script and required-scope drift',()=>{
  const manifest=load('../package.json'),saved=structuredClone(manifest);assertMaintainedScopePackageRevision(manifest);assert.deepEqual(manifest,saved);
  for(const mutate of [p=>p.dependencies.acorn='0.0.0',p=>p.scripts.test+=' --test-name-pattern=skip',p=>p.scripts.check='node --test',p=>p.scripts.extra='provider-call',p=>p.name='unreviewed-package']){
    const changed=structuredClone(manifest);mutate(changed);assert.throws(()=>assertMaintainedScopePackageRevision(changed));
  }
});

test('Nietzsche E2-N03 admits only the exact current renderer explanation against untouched old gold',()=>{
  const baseline=load('./fixtures/educational-discovery-revealed-v2.json').cases.find(c=>c.id==='E2-N03').baseline;
  const saved=structuredClone(baseline);
  const expected=expectedEducationalLiteralAfterRuntimeAdmissionV4('E2-N03',baseline);
  const explicit=structuredClone(baseline);explicit.results[4].reasons.push(rendererAdmissionReasonV4);
  assert.deepEqual(expected,explicit);assert.deepEqual(baseline,saved);
  assert.equal(expectedEducationalLiteralAfterRuntimeAdmissionV4('OTHER-CASE',baseline),baseline);
  const changedGold=structuredClone(baseline);changedGold.results[4].score++;
  assert.throws(()=>expectedEducationalLiteralAfterRuntimeAdmissionV4('E2-N03',changedGold),/historical literal must remain exact/);
  for(const mutate of [
    r=>r.results[4].reasons.pop(),
    r=>r.results[4].reasons[1]='UNREVIEWED',
    r=>r.results[4].reasons.push('UNREVIEWED'),
    r=>r.results[0].reasons.push(rendererAdmissionReasonV4),
    r=>r.results[4].score++,
    r=>r.results[4].id='eternities-atlas',
    r=>r.envelope.authority='active',
    r=>r.envelope.selection.state='abstain',
  ]){const changed=structuredClone(expected);mutate(changed);assert.throws(()=>assert.deepEqual(changed,expected));}
});
