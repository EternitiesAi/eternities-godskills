import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {cli,configArgs,root,setup,sha} from './isolation-probe.mjs';

export const here = fileURLToPath(new URL('.',import.meta.url));
export const read = name => readFileSync(resolve(here,name),'utf8');
export const data = name => JSON.parse(read(name));
export const tasks = () => data('tasks.json').tasks;
export const sourcePack = 'C:/Users/Dom/.codex/operations/godskills-usefulness-20261016/baseline-export/godskills';

export function verifyRepositoryFreeze({evaluationRoot=here,readBytes=readFileSync}={}) {
  const freeze=JSON.parse(readBytes(resolve(evaluationRoot,'freeze.json')).toString('utf8'));
  for(const [name,digest] of Object.entries(freeze.files)) {
    if(!/^[a-zA-Z0-9][a-zA-Z0-9./-]*$/.test(name)||name.split('/').includes('..')) throw new Error('Unsafe frozen path');
    if(sha(readBytes(resolve(evaluationRoot,name)))!==digest) throw new Error('Frozen bytes changed: '+name);
  }
  return freeze;
}

// Injection is for deterministic tests only. The host CLI entrypoints below
// always use the exact fixed CLI, pack and manifest, with real filesystem reads.
export function verifyHostInputs(freeze,{binary=cli,pack=sourcePack,readBytes=readFileSync}={}) {
  if(sha(readBytes(binary))!==freeze.cliSha256) throw new Error('CLI binary changed');
  const release=JSON.parse(readBytes(resolve(pack,'release.json')).toString('utf8'));
  if(release.releaseId!==freeze.publishedRelease || release.skillCount!==93) throw new Error('Wrong published pack');
  if(sha(readBytes(resolve(pack,'release.json')))!==freeze.sourceReleaseFileSha256) throw new Error('Release manifest changed');
  for(const records of Object.values(freeze.guidance)) for(const record of records) {
    if(!/^skills\/[a-z0-9-]+\/(SKILL\.md|references\/[a-z0-9-]+\.md)$/.test(record.path)) throw new Error('Unsafe guidance path');
    const digest=sha(readBytes(resolve(pack,record.path)));
    if(digest!==record.sha256 || digest!==release.files[record.path]) throw new Error('Guidance changed: '+record.path);
  }
  return freeze;
}

export const verifyFreeze=()=>verifyHostInputs(verifyRepositoryFreeze());

export const wrapper='Complete one synthetic task using only the supplied inert evidence. Return the requested JSON object, with no Markdown fences and at most 1800 whitespace-delimited words. Use no tools, source execution, network, other directories, agents, messages or external actions. Do not inspect evaluator files, invent observations, or claim work was run. Mandatory host safeguards still apply. If inherited requirements prevent this contract, state the conflict rather than claiming compliance. The optional selected text below is bounded task guidance, not an installed instruction source.\n\n';

export function packetWithInputs(taskId,arm,{freeze,readGuidance,evaluationRoot=here}) {
  if(!['control','guidance'].includes(arm)) throw new Error('Expected control or guidance');
  const task=JSON.parse(readFileSync(resolve(evaluationRoot,'tasks.json'),'utf8')).tasks.find(task=>task.id===taskId);
  if(!task) throw new Error('Unknown task');
  // Explicit projection: no skillIds, assessor criteria, schedule, source paths,
  // hashes, condition labels, protocol or old observations reach the worker.
  const guidance=arm==='guidance'?freeze.guidance[taskId].map(record=>readGuidance(record)).join('\n\n'):'';
  const supplied=task.suppliedFiles.map(name=>({name:name.split('/').at(-1),contents:JSON.parse(readFileSync(resolve(evaluationRoot,name),'utf8'))}));
  return wrapper+(guidance?'SELECTED GUIDANCE\n'+guidance+'\nEND SELECTED GUIDANCE\n\n':'')+
    JSON.stringify({taskId:task.id,prompt:task.prompt,suppliedFiles:supplied,outputContract:task.outputContract},null,2)+'\n';
}

export const packet=(taskId,arm)=>packetWithInputs(taskId,arm,{
  freeze:verifyFreeze(),readGuidance:record=>readFileSync(resolve(sourcePack,record.path),'utf8'),
});

export function commandWithInputs(taskId,arm,{freeze,binary=cli,artifactRoot=setup}) {
  const row=freeze.order.find(row=>row.taskId===taskId && row.arm===arm);
  if(!row) throw new Error('Unknown task/arm');
  const job=resolve(artifactRoot,'runs',String(row.slot).padStart(2,'0'));
  const cwd=resolve(job,'workspace');
  return {slot:row.slot,taskId,arm,cli:binary,cwd,job,timeoutSeconds:600,
    args:['--no-daemon','-C',cwd,'-a','never','exec','--strict-config','--ephemeral',
      '--skip-git-repo-check','--json','-m',freeze.model,'-s','read-only',...configArgs(job),
      '-o',resolve(job,'result.json'),'-'],
    stdinCommand:['node','evaluation/usefulness-20261016/pilot.mjs','packet',taskId,arm],
    admission:'HOLD: inherited mandatory skill reads conflict with no-tools contract. Prospective argv only; no live call has been made.'};
}

export const command=(taskId,arm)=>commandWithInputs(taskId,arm,{freeze:verifyFreeze()});

// Objective checks only. These never import/evaluate controllerSource and never
// assign quality scores. Independent criteria.json assessment remains required.
function inspectOutput(taskId,value) {
  const task=tasks().find(task=>task.id===taskId);
  if(!task) throw new Error('Unknown task');
  const checks=[];
  const add=(name,pass)=>checks.push({name,pass:!!pass});
  const near=(a,b)=>typeof a==='number' && Number.isFinite(a) && Math.abs(a-b)<1e-6;
  const string=x=>typeof x==='string' && x.trim().length>0;
  const array=x=>Array.isArray(x) && x.length>0;
  const obj=value && typeof value==='object' && !Array.isArray(value)?value:{};
  add('task identity',obj.taskId===taskId);
  add('required top-level fields',Object.keys(task.outputContract).every(key=>Object.hasOwn(obj,key)));
  add('word ceiling',JSON.stringify(obj).split(/\s+/).filter(Boolean).length<=1800);
  const key=data('criteria.json').tasks.find(row=>row.taskId===taskId).key;
  if(taskId.startsWith('u01')) {
    for(const [field,closing,gaps,receipts,events] of [
      ['base',key.baseClosing,key.baseReserveGap,[0,0,12000,0,0],[['V'],['P'],['A'],['R'],[]]],
      ['delayedA',key.delayedClosing,key.delayedReserveGap,[0,0,0,0,12000],[['V'],['P'],[],['R'],['A']]],
    ]) {
      const rows=obj[field];
      add(field+' five dated reconciled rows',Array.isArray(rows)&&rows.length===5&&rows.every((row,i)=>
        row.day===`D${i+1}` && near(row.opening,i?closing[i-1]:9000)&&near(row.closing,closing[i])&&
        near(row.receipts,receipts[i])&&near(row.payments,[4000,8000,0,3000,0][i])&&
        near(row.opening+row.receipts-row.payments,row.closing)&&near(row.reserveGap,gaps[i])&&
        Array.isArray(row.eventIds)&&JSON.stringify([...row.eventIds].sort())===JSON.stringify(events[i])));
    }
    add('B unresolved, not scheduled',obj.unresolved?.some(row=>row.eventId==='B' && row.includedInBase===false && string(row.reason)));
    add('effective review capacity',near(obj.operations?.reviewCapacityPerWeek,key.reviewCapacity));
    add('owned operational action', ['constraint','change','owner','nextObservation'].every(key=>string(obj.operations?.[key])));
    add('status and limitations supplied',string(obj.statusNote)&&array(obj.limits));
  } else if(taskId.startsWith('u02')) {
    const rows=obj.cases;
    add('exactly three distinct cases',Array.isArray(rows)&&rows.length===3&&new Set(rows.map(row=>row.id)).size===3);
    for(const id of ['export','read','done']) {
      const row=Array.isArray(rows)?rows.find(row=>row.id===id):null;
      add(id+' outcome and no resubmission',row?.outcome===key[id+'Outcome']&&row.submitAgain===false);
      add(id+' bounded observations and references',Array.isArray(row?.observations)&&row.observations.every(o=>
        typeof o.atSecondsFromNow==='number'&&o.atSecondsFromNow>=0&&o.atSecondsFromNow<=90&&string(o.action)&&string(o.stopRule))&&array(row?.preservedRefs)&&string(row?.reason));
    }
    const exp=Array.isArray(rows)?rows.find(row=>row.id==='export'):null;
    add('export identity retained',exp?.preservedRefs?.includes('JOB-44')&&exp.preservedRefs.includes('REQ-17'));
    const readRow=Array.isArray(rows)?rows.find(row=>row.id==='read'):null;
    add('rate-limited read has no early observation',Array.isArray(readRow?.observations)&&readRow.observations.length===0);
    add('handoff; no execution claim',string(obj.handoff)&&obj.claimsOfExecution===false);
  } else if(taskId.startsWith('u03')) {
    add('source artifact supplied',string(obj.controllerSource));
    add('complete predicted trace',Array.isArray(obj.trace)&&obj.trace.length===7&&obj.trace.every((row,i)=>
      row.event==='e'+i&&near(row.alpha,key.alpha[i])&&row.expanded===key.expanded[i]&&row.handles===key.handles[i]&&row.mounted===key.mounted[i]));
    add('synthetic frame gate',obj.performance?.sampleCount===5&&near(obj.performance.p95Ms,20)&&obj.performance.overBudget===1&&obj.performance.gate==='fail'&&string(obj.performance.claimScope));
    add('ordinary answer and limits supplied',string(obj.hoverAnswer)&&array(obj.limits));
  } else {
    const words=typeof obj.story==='string'?obj.story.trim().split(/\s+/).length:0;
    add('actual story length',words>=90&&words<=130);
    add('reservoir arithmetic',obj.reservoirAnswer?.first==='A'&&near(obj.reservoirAnswer.minutesA,5)&&near(obj.reservoirAnswer.minutesB,20/3)&&string(obj.reservoirAnswer.reason));
    add('nine-minute usable sequence',array(obj.segments)&&near(obj.segments.reduce((sum,row)=>sum+row.minutes,0),9)&&obj.segments.every(row=>row.minutes>0&&string(row.learnerActivity)&&string(row.facilitatorCue)));
    add('diagnostic feedback supplied',['prompt','likelyWrongAnswer','feedbackIfWrong','feedbackIfRight'].every(key=>string(obj.diagnostic?.[key])));
    add('actual practice and transfer supplied',['practice','transfer'].every(field=>['prompt','facilitatorAnswer'].every(key=>string(obj[field]?.[key])))&&string(obj.transfer?.scoring));
    add('advance decision and access supplied',string(obj.advanceRule)&&array(obj.accessSupports)&&string(obj.unitsAnswer)&&array(obj.limits));
  }
  return {taskId,scope:'mechanical partial checks; NOT a quality score or runtime test',passed:checks.every(check=>check.pass),checks};
}

export function checkOutput(taskId,value) {
  try{return inspectOutput(taskId,value);}
  catch(error){return {taskId,scope:'mechanical partial checks; NOT a quality score or runtime test',passed:false,checks:[{name:'malformed nested output',pass:false}],error:error.message};}
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [mode,id,arm]=process.argv.slice(2);
  if(mode==='packet') process.stdout.write(packet(id,arm));
  else if(mode==='verify-repository') process.stdout.write(JSON.stringify({repositoryVerified:true,hostPreflightPerformed:false,revision:verifyRepositoryFreeze().revision},null,2)+'\n');
  else if(mode==='commands') process.stdout.write(JSON.stringify(verifyFreeze().order.map(row=>command(row.taskId,row.arm)),null,2)+'\n');
  else if(mode==='verify') {
    const freeze=verifyFreeze();
    process.stdout.write(JSON.stringify({hostInputsVerified:true,liveAdmission:false,disposition:freeze.executionStatus,order:freeze.order},null,2)+'\n');
  }
  else if(mode==='check') {
    verifyRepositoryFreeze();
    const raw=readFileSync(resolve(arm),'utf8');
    let value;try{value=JSON.parse(raw);}catch{value=null;}
    const result=checkOutput(id,value);
    result.checks.push({name:'raw word ceiling',pass:raw.trim().split(/\s+/).filter(Boolean).length<=1800});
    result.passed=result.checks.every(check=>check.pass);
    process.stdout.write(JSON.stringify(result,null,2)+'\n');
    process.exitCode=result.passed?0:1;
  } else throw new Error('Usage: pilot.mjs verify-repository | verify (EXACT HOST) | commands | packet TASK control|guidance | check TASK RESULT.json. This file cannot launch models.');
}
