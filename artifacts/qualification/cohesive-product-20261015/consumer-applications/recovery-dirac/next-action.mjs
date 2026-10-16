// Local decision reducer only: no I/O, effects, retries, timers or workers.
const deployments=new Set(['unknown','absent','running','succeeded','failed']);
const smokeStates=new Set(['running','passed','failed','not-started']);

export function nextAction(state){
  if(!state||typeof state!=='object'||Array.isArray(state))throw new TypeError('State must be an object');
  const {paused,deployment,smoke,authorizedEnvironment}=state;
  if(typeof paused!=='boolean'||!deployments.has(deployment)||!smokeStates.has(smoke)||
    !['staging','production'].includes(authorizedEnvironment))throw new TypeError('Invalid recovery state');
  if(authorizedEnvironment!=='staging')return 'reject-scope';
  if(paused)return 'observe-only';
  // Resolve dispatch identity/state before drawing conclusions from smoke.
  if(deployment==='unknown')return 'lookup-existing-operation';
  if(deployment==='running')return 'wait-existing-operation';
  if(deployment==='failed'||smoke==='failed')return 'repair-after-failure';
  if(deployment==='absent')return 'submit-staging-once';
  if(smoke==='running')return 'wait-existing-operation';
  if(smoke==='passed')return 'complete';
  return 'run-staging-smoke';
}
