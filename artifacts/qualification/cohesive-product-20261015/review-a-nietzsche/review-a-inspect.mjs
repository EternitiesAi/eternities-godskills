import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const review=path.dirname(fileURLToPath(import.meta.url));
const root='C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003';
const prefix='artifacts/qualification/cohesive-product-20261015/lane-a';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const mode=process.argv[2];
function save(relative,bytes){const target=path.join(review,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
if(mode==='snapshot'){
 if(fs.existsSync(path.join(review,'read-set.json')))throw Error('Initial snapshot exists; do not replace review evidence');
 const candidate=JSON.parse(fs.readFileSync(`${root}/${prefix}/candidate-v2.json`));
 const ledger=JSON.parse(fs.readFileSync(`${root}/${prefix}/ledger.json`));
 const files=[...['HANDOFF.md','ledger.json','parent-candidate-v2.md','candidate-v2.json'].map(name=>`${prefix}/${name}`),...candidate.files.map(f=>f.path)];
 const rows=[];
 for(const relative of files){const b=fs.readFileSync(`${root}/${relative}`),expected=candidate.files.find(f=>f.path===relative);save(`snapshots/current/${relative}`,b);rows.push({path:relative,sha256:sha(b),bytes:b.length,candidateV2Sha256:expected?.sha256??null,candidateV2Matches:expected?sha(b)===expected.sha256:null});}
 for(const skill of ledger.skills.filter(s=>s.decision==='refine'))for(const file of skill.files.filter(f=>/\/(SKILL\.md|skill\.json)$/.test(f.path))){const r=spawnSync('git',['--no-optional-locks','show',`${ledger.baselineCommit}:${file.path}`],{cwd:root,encoding:null,maxBuffer:1024*1024});if(r.status!==0)throw Error(`Cannot read canonical baseline ${file.path}`);save(`snapshots/baseline/${file.path}`,r.stdout);rows.push({path:file.path,role:'canonical-baseline',sha256:sha(r.stdout),ledgerSha256:file.sha256,ledgerMatches:sha(r.stdout)===file.sha256,bytes:r.stdout.length});}
 const record={snapshotAt:new Date().toISOString(),baseline:ledger.baselineCommit,scope:'Seven A methods and seven owner SKILL.md/skill.json pairs. D-method substance excluded; any D links inspected mechanically only. Author self-applications and answers not opened.',files:rows};
 save('read-set.json',JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify({files:rows.length,currentV2Drift:rows.filter(r=>r.candidateV2Matches===false),baselineMismatches:rows.filter(r=>r.ledgerMatches===false)},null,2));
}else if(mode==='read'){
 for(const relative of process.argv.slice(3)){
  const file=path.join(review,'snapshots/current',relative),b=fs.readFileSync(file);
  console.log(`FILE ${relative}\nSHA256 ${sha(b)}\n${b.toString('utf8')}\nEND FILE`);
 }
}else if(mode==='final-bind'){
 const initial=JSON.parse(fs.readFileSync(path.join(review,'read-set.json')));
 const rows=initial.files.filter(r=>!r.role&&r.candidateV2Sha256).map(r=>{const b=fs.readFileSync(`${root}/${r.path}`);save(`snapshots/final/${r.path}`,b);return {path:r.path,reviewedSha256:r.sha256,thenCurrentSha256:sha(b),bytes:b.length,unchanged:sha(b)===r.sha256};});
 const aWiring=rows.filter(r=>r.path.endsWith('/skill.json')).map(r=>{
  const owner=r.path.split('/')[2],meta=JSON.parse(fs.readFileSync(`${root}/${r.path}`)),body=fs.readFileSync(`${root}/product/skills/${owner}/SKILL.md`,'utf8');
  const method=initial.files.find(f=>!f.role&&f.candidateV2Sha256&&f.path.startsWith(`product/skills/${owner}/references/`));
  const relative=method.path.slice(`product/skills/${owner}/`.length);
  return {owner,method:relative,declared:meta.resources.includes(relative),linked:body.includes(`](${relative})`),exists:fs.existsSync(`${root}/product/skills/${owner}/${relative}`)};
 });
 const ownMethodMap={
  'eternities-beacon':'creator-slate',
  'eternities-arcadia':'camera-driven',
  'diagnostic-statistical-model-inference':'causal-design',
  'service-observability-and-slo-design':'telemetry-cardinality',
  'narrative-structure-and-revision':'reader-knowledge'
 };
 const selfAuthoredWiring=Object.entries(ownMethodMap).map(([owner,stem])=>{
  const dir=`${root}/product/skills/${owner}`,metaBytes=fs.readFileSync(`${dir}/skill.json`),bodyBytes=fs.readFileSync(`${dir}/SKILL.md`),meta=JSON.parse(metaBytes),body=bodyBytes.toString('utf8');
  const resource=meta.resources.find(p=>p.includes(stem))??null;
  return {owner,entrypointSha256:sha(bodyBytes),metadataSha256:sha(metaBytes),resource,declared:Boolean(resource),linked:resource?body.includes(`](${resource})`):false,exists:resource?fs.existsSync(`${dir}/${resource}`):false,scope:'MECHANICAL ONLY: target existence, declaration and link. Body not opened, copied or substantively accepted; Astra owns independent content review.'};
 });
 const record={boundAt:new Date().toISOString(),scope:initial.scope,files:rows,drift:rows.filter(r=>!r.unchanged),aWiring,selfAuthoredWiring};
 save('final-bind.json',JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify({files:rows.length,drift:record.drift},null,2));
}else throw Error('Use snapshot, read or final-bind');
