import test from 'node:test';
import assert from 'node:assert/strict';
import {nextAction} from './next-action.mjs';

const initial={paused:true,deployment:'unknown',smoke:'running',authorizedEnvironment:'staging'};
test('the supplied paused handoff permits observation only',()=>{
  assert.equal(nextAction(initial),'observe-only');
});
test('resume reconciles the dispatched operation instead of obeying the stale retry note',()=>{
  assert.equal(nextAction({...initial,paused:false}),'lookup-existing-operation');
});
test('the old unit-test success never establishes deployed R2',()=>{
  assert.notEqual(nextAction({...initial,paused:false,smoke:'passed'}),'complete');
});

// Explicit decision table from the supplied task's state contract. Rows are
// observations, not implementations of a deployment client or provider mock.
const smokeStates=['running','passed','failed','not-started'];
const expected={
  unknown:['lookup-existing-operation','lookup-existing-operation','lookup-existing-operation','lookup-existing-operation'],
  absent:['submit-staging-once','submit-staging-once','repair-after-failure','submit-staging-once'],
  running:['wait-existing-operation','wait-existing-operation','wait-existing-operation','wait-existing-operation'],
  succeeded:['wait-existing-operation','complete','repair-after-failure','run-staging-smoke'],
  failed:['repair-after-failure','repair-after-failure','repair-after-failure','repair-after-failure'],
};
test('all 80 valid combinations preserve scope, pause and reconciliation precedence',()=>{
  let checked=0;
  for(const authorizedEnvironment of ['staging','production'])for(const paused of [true,false]){
    for(const [deployment,actions] of Object.entries(expected))for(const [index,smoke] of smokeStates.entries()){
      const state=Object.freeze({authorizedEnvironment,paused,deployment,smoke});
      const wanted=authorizedEnvironment==='production'?'reject-scope':paused?'observe-only':actions[index];
      assert.equal(nextAction(state),wanted,JSON.stringify(state));checked++;
    }
  }
  assert.equal(checked,80);
});
test('completion has both staging deployment and staging smoke evidence',()=>{
  assert.equal(nextAction({paused:false,deployment:'succeeded',smoke:'passed',authorizedEnvironment:'staging'}),'complete');
  for(const smoke of ['running','failed','not-started']){
    assert.notEqual(nextAction({paused:false,deployment:'succeeded',smoke,authorizedEnvironment:'staging'}),'complete');
  }
});
test('a known failure requests a repair decision rather than launching a blind repeat',()=>{
  assert.equal(nextAction({...initial,paused:false,deployment:'failed'}),'repair-after-failure');
  assert.equal(nextAction({...initial,paused:false,deployment:'succeeded',smoke:'failed'}),'repair-after-failure');
  assert.equal(nextAction({...initial,paused:false,deployment:'absent',smoke:'failed'}),'repair-after-failure');
});
test('repeat decisions are pure intent and leave supplied state untouched',()=>{
  const state=Object.freeze({paused:false,deployment:'absent',smoke:'not-started',authorizedEnvironment:'staging'});
  assert.equal(nextAction(state),'submit-staging-once');
  assert.equal(nextAction(state),'submit-staging-once');
  assert.deepEqual(state,{paused:false,deployment:'absent',smoke:'not-started',authorizedEnvironment:'staging'});
});
test('malformed state cannot silently turn into completion or submission',()=>{
  for(const state of [null,undefined,[],{}, {...initial,paused:'false'}, {...initial,deployment:'pending'}, {...initial,smoke:'unknown'}, {...initial,authorizedEnvironment:'dev'}]){
    assert.throws(()=>nextAction(state),TypeError);
  }
});
