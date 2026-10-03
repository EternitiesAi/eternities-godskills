import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const hash=x=>createHash('sha256').update(x).digest('hex');
const [fixturesPath,keyPath,packetPath,mapPath,executionPath,judge1Path,judge2Path,outPath]=process.argv.slice(2);
if(!outPath)throw Error('Usage: score FIXTURES KEY PACKET PRIVATE_MAP EXECUTION_SUMMARY JUDGE1 JUDGE2 NEW_OUTPUT');
const paths=[fixturesPath,keyPath,packetPath,mapPath,executionPath,judge1Path,judge2Path];
const bytes=await Promise.all(paths.map(path=>readFile(path)));
const [fixtures,key,packet,map,execution,...judges]=bytes.map(buffer=>JSON.parse(buffer.toString('utf8')));
if(map.fixtureSha256!==hash(bytes[0])||map.packetSha256!==hash(bytes[2])||map.summarySha256!==hash(bytes[4]))throw Error('Blinded source identity changed');
if(!Array.isArray(fixtures.tasks)||fixtures.tasks.length!==6||new Set(fixtures.tasks.map(t=>t.id)).size!==6||fixtures.tasks.some(t=>typeof t.id!=='string'||!t.id))throw Error('Exactly six unique fixture tasks required');
const taskIds=new Set(fixtures.tasks.map(t=>t.id));
for(const task of fixtures.tasks){
 if(!Array.isArray(task.rubric)||task.rubric.length!==4||new Set(task.rubric.map(c=>c.id)).size!==4||task.rubric.some(c=>typeof c.id!=='string'||!Number.isSafeInteger(c.points)||c.points<=0)||task.rubric.reduce((n,c)=>n+c.points,0)!==100)throw Error('Four unique finite criteria totaling 100 points required');
}
if(!Array.isArray(key.tasks)||key.tasks.length!==6||new Set(key.tasks.map(t=>t.id)).size!==6||key.tasks.some(t=>!taskIds.has(t.id)))throw Error('Key cohort differs');
if(!Array.isArray(packet.tasks)||packet.tasks.length!==6||new Set(packet.tasks.map(t=>t.id)).size!==6||packet.tasks.some(t=>!taskIds.has(t.id)||!Array.isArray(t.candidates)||t.candidates.length!==2||new Set(t.candidates.map(c=>c.label)).size!==2||t.candidates.some(c=>!['A','B'].includes(c.label))))throw Error('Packet cohort differs');
if(!Array.isArray(map.mapping)||map.mapping.length!==12||new Set(map.mapping.map(m=>m.taskId+'::'+m.label)).size!==12||new Set(map.mapping.map(m=>m.taskId+'::'+m.arm)).size!==12||map.mapping.some(m=>!taskIds.has(m.taskId)||!['A','B'].includes(m.label)||!['baseline','skill'].includes(m.arm)))throw Error('Mapping cohort differs');
if(!Array.isArray(execution.errors)||execution.errors.length||!Array.isArray(execution.results)||execution.results.length!==12||execution.results.some(row=>row.status!=='completed'||!taskIds.has(row.taskId)||!['baseline','skill'].includes(row.arm))||new Set(execution.results.map(r=>r.taskId+'::'+r.arm)).size!==12)throw Error('Incomplete or invalid execution cohort');
const token=value=>Number.isSafeInteger(value)&&value>=0;
for(const row of execution.results){
 if(!row.usage||!token(row.usage.input)||!token(row.usage.output)||['cachedInput','reasoningOutput','cacheWriteInput'].some(field=>row.usage[field]!=null&&!token(row.usage[field]))||(row.usage.cachedInput??0)>row.usage.input||(row.usage.reasoningOutput??0)>row.usage.output||!token(row.wallMs)||!token(row.toolCalls))throw Error('Invalid usage domain');
}
const scores=judges.map((judge,index)=>{
 if(judge.schema!=='godskills-blind-assessment-v1'||!Array.isArray(judge.records)||judge.records.length!==12)throw Error('Expected exactly 12 blinded assessment records');
 const seen=new Set();
 return judge.records.map(record=>{
  const id=record.taskId+'::'+record.anonymousOutputId;
  if(seen.has(id))throw Error('Duplicate assessment');seen.add(id);
  const task=fixtures.tasks.find(task=>task.id===record.taskId),candidate=packet.tasks.find(task=>task.id===record.taskId)?.candidates.find(c=>c.label===record.anonymousOutputId),mapping=map.mapping.find(m=>m.taskId===record.taskId&&m.label===record.anonymousOutputId);
  if(!task||!candidate||!mapping||hash(candidate.answer)!==mapping.answerSha256)throw Error('Unknown or changed blinded answer');
  if(!Array.isArray(record.criterionScores)||record.criterionScores.length!==4||new Set(record.criterionScores.map(c=>c.criterionId)).size!==4)throw Error('Four unique criteria required');
  let rawScore=0;
  for(const expected of task.rubric){const scored=record.criterionScores.find(c=>c.criterionId===expected.id);if(!scored||![0,0.5,1].includes(scored.factor)||typeof scored.reason!=='string'||!scored.reason.trim())throw Error('Malformed criterion');rawScore+=expected.points*scored.factor;}
  const allowed=new Set(key.tasks.find(t=>t.id===task.id).criticalFailures.map(f=>f.id));
  if(!Array.isArray(record.criticalFailureIds)||new Set(record.criticalFailureIds).size!==record.criticalFailureIds.length||record.criticalFailureIds.some(id=>!allowed.has(id)))throw Error('Unknown critical failure');
  return {...record,arm:mapping.arm,assessor:index+1,rawScore,gatedScore:record.criticalFailureIds.length?0:rawScore,taskPass:!record.criticalFailureIds.length&&rawScore>=80,wordCount:candidate.answer.trim().split(/\s+/).filter(Boolean).length};
 });
});
const pairs=fixtures.tasks.map(task=>{
 const assessments=scores.map(rows=>{const baseline=rows.find(r=>r.taskId===task.id&&r.arm==='baseline'),skill=rows.find(r=>r.taskId===task.id&&r.arm==='skill');if(!baseline||!skill)throw Error('Missing paired score');return {baseline,skill,delta:skill.gatedScore-baseline.gatedScore};});
 const range=arm=>[Math.min(...assessments.map(a=>a[arm].gatedScore)),Math.max(...assessments.map(a=>a[arm].gatedScore))];
 const baselineRange=range('baseline'),skillRange=range('skill');
 const disputes=['baseline','skill'].flatMap(arm=>{const [a,b]=assessments.map(row=>row[arm]);return Math.abs(a.rawScore-b.rawScore)>10||JSON.stringify([...a.criticalFailureIds].sort())!==JSON.stringify([...b.criticalFailureIds].sort())?[arm]:[]});
 return {taskId:task.id,assessments,baselineRange,skillRange,deltaRange:[skillRange[0]-baselineRange[1],skillRange[1]-baselineRange[0]],disputedArms:disputes};
});
const assessorEffects=[0,1].map(index=>{
 const rows=pairs.map(p=>p.assessments[index]),meanDelta=rows.reduce((sum,r)=>sum+r.delta,0)/6;
 const positiveGate=meanDelta>=8&&rows.filter(r=>r.delta>=0).length>=4&&rows.every(r=>r.delta>=-10)&&rows.every(r=>!r.skill.criticalFailureIds.length||r.baseline.criticalFailureIds.length);
 return {assessor:index+1,meanDelta,nonnegativeTasks:rows.filter(r=>r.delta>=0).length,baselinePasses:rows.filter(r=>r.baseline.taskPass).length,skillPasses:rows.filter(r=>r.skill.taskPass).length,positiveGate,classification:positiveGate?'bounded-positive':meanDelta>0?'mixed-positive-below-preregistered-gate':meanDelta<0?'negative':'neutral'};
});
const usage=['baseline','skill'].map(arm=>{
 const rows=execution.results.filter(row=>row.arm===arm),sum=field=>{
  if(!rows.every(r=>r.usage?.[field]!=null))return null;
  const total=rows.reduce((n,r)=>n+r.usage[field],0);if(!token(total))throw Error('Usage aggregate is not representable');return total;
 };
 const wallMs=rows.reduce((n,r)=>n+r.wallMs,0),toolCalls=rows.reduce((n,r)=>n+r.toolCalls,0);if(!token(wallMs)||!token(toolCalls))throw Error('Execution aggregate is not representable');
 return {arm,runs:rows.length,input:sum('input'),cachedInput:sum('cachedInput'),output:sum('output'),reasoningOutput:sum('reasoningOutput'),cacheWriteInput:sum('cacheWriteInput'),wallMs,toolCalls};
});
const result={schema:'godskills-paired-quality-analysis-v1',sourceFiles:paths.map((path,i)=>({path,sha256:hash(bytes[i])})),validPairs:6,pairs,assessorEffects,adjudication:{humanAvailable:false,disputedOutputs:pairs.reduce((n,p)=>n+p.disputedArms.length,0),meanDeltaRange:[0,1].map(i=>pairs.reduce((n,p)=>n+p.deltaRange[i],0)/6),scope:'Descriptive model-assessment ranges, not confidence intervals; no human resolution or universal superiority inference'},usage,requested:execution.results[0].requested,servedModel:'unknown',isolation:'captured-preflight-only; factory four descriptors in both arms',overWordCap:scores[0].filter(row=>row.wordCount>1800).map(row=>({taskId:row.taskId,arm:row.arm,wordCount:row.wordCount}))};
await writeFile(outPath,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({validPairs:result.validPairs,assessorEffects,adjudication:result.adjudication,usage,overWordCap:result.overWordCap},null,2));
