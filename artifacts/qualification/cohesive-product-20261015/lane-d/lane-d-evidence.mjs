import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const lane=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const operation='D:/03-ARSENAL/warehouse/_operations/godskills-expansion-20261015';
const worktree='C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003';
export const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const gitBlob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const readJson=p=>JSON.parse(fs.readFileSync(p));
function write(name,value){const target=path.join(lane,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(value,null,2)+'\n');}

const selections={
 'cloutdesk/agents':[
  ['skills/proposal-drafting/SKILL.md','pattern-reference','Brief-to-roster-to-proposal job; thin mechanism; replace connector scopes with supplied records.','brief-to-feasible-creator-slate'],
  ['skills/talent-discovery/SKILL.md','pattern-reference','Audience and category-fit evidence; do not inherit vague scoring or assume audience from creator identity.','brief-to-feasible-creator-slate']
 ],
 'ericzakariasson/skills':[
  ['skills/game-builder-blender-assets/SKILL.md','independent-implementation','Retain intended-camera inspection and same mesh in idle/motion; reject mandatory Blender, specialist roles, anti-primitive rules and fixed budgets.','camera-driven-asset-iteration'],
  ['skills/game-builder/SKILL.md','pattern-reference','Comparable current captures and changing a stalled approach are useful; reject unlimited critic loops, role policy and model-identifier suppression.','camera-driven-asset-iteration']
 ],
 'RobLe3/cc-blender-skill':[
  ['plugin/skills/blender-modeling/SKILL.md','rejected','Rigid stack order, automatic embellishment and fixed overlap distances are context-dependent recipes; no recipe or code adopted.',null],
  ['plugin/skills/blender-export/SKILL.md','pattern-reference','Keep silhouette-versus-normal distinction and actual target validation; reject universal file/texture/poly limits and automatic transform repair.','camera-driven-asset-iteration'],
  ['plugin/skills/animation-quality-gate/SKILL.md','independent-implementation','Use target-reproducibility of handler-based effects; reject self-refining autoloop and mandatory contact sheets for unrelated work.','camera-driven-asset-iteration']
 ],
 'xiaomihu1992/econometrics-skill':[
  ['SKILL.md','independent-implementation','Select from assignment process and preserve target; library is not adopted. Its declared IV/AIPW/event-time limitations remain source claims, not a code audit.','causal-design-before-estimation']
 ],
 'triggerdotdev/staff-engineering-skills':[
  ['skills/staff-engineering-skills-cardinality/SKILL.md','independent-implementation','Multiplicative allocation and per-entity/time growth are useful; distinguish observed tuples from possible product, narrow trigger and preserve consumer queries.','telemetry-cardinality-budget']
 ],
 'haowjy/creative-writing-skills':[
  ['cw/skills/information-hierarchy/SKILL.md','rejected','Answer-first reporting guidance is redundant with host competence and can spoil fiction; no new universal communication skill.',null],
  ['skills/reader-sim/SKILL.md','pattern-reference','Use text-bound reader-question tracking, while treating simulated reactions as editorial hypotheses and acknowledging spoiler contamination.','reader-knowledge-and-reveal-revision'],
  ['skills/writing-principles/SKILL.md','pattern-reference','Viewpoint knowledge and inference-space motivate a revision tool; reject punctuation bans, universal two-job prose rules and unverified model-training claims.','reader-knowledge-and-reveal-revision'],
  ['skills/creative-writing-craft/SKILL.md','deferred','Router only; selected scene-construction resource read separately. Do not add a duplicate craft router.','reader-knowledge-and-reveal-revision']
 ]
};
const readset=[];
function record(file,role,extra={}){const b=fs.readFileSync(file);const row={path:file,sha256:sha256(b),bytes:b.length,role,...extra};readset.push(row);return row;}
const sources=[];
const entrypoints=[];
for(const [canonical,selected] of Object.entries(selections)){
 const stem=canonical.replace('/','__'),receipt=readJson(`${operation}/receipts/${stem}.json`),tree=readJson(`${operation}/trees/${stem}.json`),root=receipt.target;
 if(receipt.state!=='verified-stage')throw Error(`Unverified stage: ${canonical}`);
 const license=tree.find(e=>/^LICENSE(?:\.md|\.txt)?$/i.test(e.path));
 const licenseRecord=record(`${root}/${license.path}`,'license-full-read',{source:canonical});
 const notices=tree.filter(e=>/(^|\/)NOTICE(?:\.[^/]*)?$/i.test(e.path));
 if(notices.length)throw Error(`Read source notices before proceeding: ${canonical}`);
 for(const [relative,disposition,rationale,proposal] of selected){
  const object=tree.find(e=>e.path===relative);if(!object)throw Error(`Missing selected body ${relative}`);
  const file=`${root}/${relative}`,b=fs.readFileSync(file);
  if(gitBlob(b)!==object.oid)throw Error(`Working bytes differ from source Git object: ${file}`);
  record(file,'skill-body-full-read',{source:canonical,gitBlobOid:object.oid,head:receipt.head.stdout.trim()});
 }
 for(const object of tree.filter(e=>e.path.endsWith('SKILL.md'))){
  const decision=selected.find(s=>s[0]===object.path);
  entrypoints.push({source:canonical,path:object.path,head:receipt.head.stdout.trim(),gitBlobOid:object.oid,bytes:object.bytes,readState:decision?'material-read':'indexed-only',disposition:decision?.[1]??'deferred',rationale:decision?.[2]??'Outside the frozen material-read set; path and Git object indexed only. No method or quality judgment inferred.',proposal:decision?.[3]??null});
 }
 const packRoot=`${root}/.git/objects/pack`,packs=fs.existsSync(packRoot)?fs.readdirSync(packRoot).filter(n=>/\.(pack|idx)$/.test(n)).map(n=>{const b=fs.readFileSync(`${packRoot}/${n}`);return {path:`.git/objects/pack/${n}`,bytes:b.length,sha256:sha256(b)};}):[];
 sources.push({canonical,url:`https://github.com/${canonical}`,stage:root,origin:receipt.origin.stdout.trim(),head:receipt.head.stdout.trim(),clean:receipt.clean.status===0&&!receipt.clean.stdout,shallow:receipt.shallow.stdout.trim()==='true',treeSha256:receipt.tree.sha256,trackedFiles:tree.length,trackedBlobBytes:receipt.tree.totalBlobBytes,largestBlob:receipt.tree.largest[0],submodules:receipt.tree.submodules,license:{path:license.path,sha256:licenseRecord.sha256,classification:['triggerdotdev/staff-engineering-skills','haowjy/creative-writing-skills'].includes(canonical)?'Apache-2.0':'MIT'},separateNoticePaths:notices.map(e=>e.path),materialReadEntrypoints:selected.length,indexedEntrypoints:tree.filter(e=>e.path.endsWith('SKILL.md')).length,packs});
}
const extras=[
 ['xiaomihu1992__econometrics-skill/references/method_selection.md','reference-full-read'],
 ['xiaomihu1992__econometrics-skill/references/diagnostic_checklist.md','reference-full-read'],
 ['haowjy__creative-writing-skills/skills/creative-writing-craft/resources/scene-construction.md','reference-full-read']
];
for(const [relative,role] of extras){const file=`${operation}/stage/${relative}`,stem=relative.split('/')[0],repo=sources.find(s=>s.canonical.replace('/','__')===stem),rel=relative.slice(stem.length+1),tree=readJson(`${operation}/trees/${stem}.json`),oid=tree.find(e=>e.path===rel)?.oid,b=fs.readFileSync(file);if(gitBlob(b)!==oid)throw Error(`Reference differs from pinned source ${file}`);record(file,role,{source:repo.canonical,head:repo.head,gitBlobOid:oid});}
for(const relative of ['product/START-HERE.md','product/INDEX.md','product/skills/eternities-agora/SKILL.md','product/skills/eternities-arcadia/SKILL.md','product/skills/eternities-arcadia/references/realtime-asset-integration.md','product/skills/diagnostic-statistical-model-inference/SKILL.md','product/skills/structured-output-contracts/SKILL.md','product/skills/service-observability-and-slo-design/SKILL.md','product/skills/narrative-structure-and-revision/SKILL.md','product/skills/narrative-structure-and-revision/references/methods.md'])record(`${worktree}/${relative}`,relative.endsWith('INDEX.md')?'product-directory-partial-read':'product-comparison-full-read');
for(const [file,role] of [
 ['C:/Users/Dom/.agents/skills/sovereign-skill-refinery/SKILL.md','curated-method-full-read'],
 ['C:/Users/Dom/.codex/skills/.system/skill-creator/SKILL.md','curated-method-full-read'],
 ['C:/Users/Dom/.codex/skills/.system/skill-creator/scripts/quick_validate.py','validator-full-read-and-executed'],
 ['D:/03-ARSENAL/warehouse/catalog-c/agent-skills/marketingskills/skills/sales-enablement/SKILL.md','reused-skill-body-full-read'],
 ['D:/03-ARSENAL/warehouse/catalog-c/agent-skills/marketingskills/LICENSE','license-full-read'],
 ['D:/03-ARSENAL/warehouse/hunt/agent-skills-universal-wave-2-2026-08-28/K-Dense-AI__scientific-agent-skills/skills/statistical-analysis/SKILL.md','reused-skill-body-full-read'],
 ['D:/03-ARSENAL/warehouse/hunt/agent-skills-universal-wave-2-2026-08-28/K-Dense-AI__scientific-agent-skills/LICENSE.md','license-full-read'],
 ['D:/03-ARSENAL/warehouse/REPOSITORY-INDEX.json','identity-index-parsed-no-source-body-coverage'],
 ['D:/03-ARSENAL/warehouse/00-INDEX.md','warehouse-overview-partial-read']
])record(file,role);
for(const file of fs.readdirSync(`${operation}/metadata`))record(`${operation}/metadata/${file}`,'public-api-metadata-only');
for(const file of ['cohort.freeze.json','discovery.json','OPERATION.md'])record(`${operation}/${file}`,'operation-scope-and-identity-evidence');
const discovery=readJson(`${operation}/discovery.json`);
const currentIndexRow=readset.find(r=>r.role==='identity-index-parsed-no-source-body-coverage');
const currentIndex=readJson(currentIndexRow.path);
const canonicalize=v=>(v??'').toLowerCase().replace(/^.*github\.com[:/]/,'').replace(/\.git$/,'').replace(/\/$/,'');
const currentMatches=sources.map(source=>{
 const numericId=readJson(`${operation}/metadata/${Object.keys(Object.fromEntries(Object.entries(selections))).find(n=>n===source.canonical).replace('/','__')}.json`).id;
 return {canonical:source.canonical,matches:currentIndex.filter(r=>r.githubRepositoryId===numericId||[r.id,r.full_name,r.canonicalGitHubFullName,r.remote].some(v=>canonicalize(v)===source.canonical.toLowerCase())).map(r=>({id:r.id,path:r.path,head:r.head}))};
});
const indexReconciliation={frozen:{...discovery.index},current:{path:currentIndexRow.path,sha256:currentIndexRow.sha256,count:currentIndex.length},drifted:currentIndexRow.sha256!==discovery.index.sha256,currentMatches,publicationState:'parent-only current-index check required immediately before publication; original freeze not changed'};
function diskBytes(dir){let total=0;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())total+=diskBytes(p);else if(e.isFile())total+=fs.statSync(p).size;}return total;}
const bytes=diskBytes(operation);
if(bytes>readJson(`${operation}/cohort.freeze.json`).operationBudgetBytes)throw Error('Operation storage budget exceeded');
write('evidence/read-set.json',{recordedAt:new Date().toISOString(),boundary:'Exact local source/comparison/guidance bytes. Stage full reads additionally checked against pinned Git blob IDs; metadata and merely indexed entrypoints do not imply material reading. Product comparisons are snapshots, not parent integration authority.',historicalObservations:[{path:discovery.index.path,sha256:discovery.index.sha256,count:discovery.index.count,role:'original frozen identity-index read; digest retained in immutable discovery receipt'}],files:readset});
write('evidence/index-reconciliation.json',indexReconciliation);
write('evidence/source-inventory.json',{recordedAt:new Date().toISOString(),publication:'staged-only; warehouse global index and from-stars not written',indexReconciliation,operationBytes:bytes,operationBudgetBytes:268435456,sources});
write('evidence/entrypoint-decisions.json',{materialRead:entrypoints.filter(e=>e.readState==='material-read').length,indexedOnly:entrypoints.filter(e=>e.readState==='indexed-only').length,entrypoints});
console.log(JSON.stringify({sources:sources.length,readSetFiles:readset.length,materialReadEntrypoints:entrypoints.filter(e=>e.readState==='material-read').length,indexedOnlyEntrypoints:entrypoints.filter(e=>e.readState==='indexed-only').length,operationBytes:bytes},null,2));
