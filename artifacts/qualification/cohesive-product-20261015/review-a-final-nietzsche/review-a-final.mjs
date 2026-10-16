import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root='C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003';
const v3=`${root}/artifacts/qualification/cohesive-product-20261015/review-a-v3-nietzsche`;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const reads=[];
function read(p,role){const b=fs.readFileSync(p);reads.push({path:p,sha256:hash(b),bytes:b.length,role});return b;}
function save(p,v){const out=path.resolve(dir,p);assert.ok(out.startsWith(dir+path.sep));fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,Buffer.isBuffer(v)?v:JSON.stringify(v,null,2)+'\n');}
assert.ok(!fs.existsSync(path.join(dir,'final-bind.json')),'Preserve existing final receipt');
const bindingBytes=read(`${v3}/supplemental-final-bind.json`,'prior authoritative binding');
assert.equal(hash(bindingBytes),'efb29a48638342195e80980a73951ad3c10edfc0b3de0fa30a90b126243eaa4f');
const previous=JSON.parse(bindingBytes);
const priorProbes=JSON.parse(read(`${v3}/probe-results.json`,'unchanged 27-case set'));
const runtime=JSON.parse(read(`${v3}/read-set.json`,'frozen runtime identity')).runtime;
const catalog=JSON.parse(read(`${v3}/prior-evidence/discovery-input-final.json`,'identical 93-skill base'));
save('inputs/prior-binding.json',bindingBytes);save('inputs/prior-probes.json',priorProbes);save('inputs/catalog-base.json',catalog);
const rows=previous.files.map(r=>{const b=read(`${root}/${r.path}`,'binding only; bodies not re-audited');save(`snapshots/${r.path}`,b);return {path:r.path,role:r.role,priorSha256:r.finalSha256,sha256:hash(b),bytes:b.length,changed:hash(b)!==r.finalSha256};});
assert.equal(rows.length,23);assert.equal(rows.filter(r=>r.role==='A-method-or-original-owner').length,21);
const changes=rows.filter(r=>r.changed);assert.deepEqual(changes.map(r=>r.path),['product/skills/eternities-beacon/skill.json']);
const beaconPath='product/skills/eternities-beacon/skill.json';
assert.equal(changes[0].sha256,'64b3dbde0cfd6f0d658d4baa125f1920b54723ed6911ad42bdb087d40d6cc303');
const oldBeaconBytes=read(`${v3}/supplemental-final/${beaconPath}`,'pre-repair Beacon metadata');
assert.equal(hash(oldBeaconBytes),rows.find(r=>r.path===beaconPath).priorSha256);save('inputs/beacon-before.json',oldBeaconBytes);
const oldBeacon=JSON.parse(oldBeaconBytes),beacon=JSON.parse(fs.readFileSync(path.join(dir,'snapshots',beaconPath)));
const trigger="homepage value proposition and product promise with proof against the customer's current workaround";
const {triggers:oldTriggers,...oldOther}=oldBeacon,{triggers:newTriggers,...newOther}=beacon;
assert.deepEqual(newOther,oldOther);assert.equal(newTriggers.filter(t=>t===trigger).length,1);assert.deepEqual(newTriggers.filter(t=>t!==trigger),oldTriggers);
for(const r of rows.filter(r=>r.path.endsWith('/skill.json'))){const metadata=JSON.parse(fs.readFileSync(path.join(dir,'snapshots',r.path)));const i=catalog.skills.findIndex(s=>s.id===metadata.id);assert.ok(i>=0);catalog.skills[i]={...catalog.skills[i],...metadata};}
assert.equal(catalog.skills.length,93);
const before=structuredClone(catalog);Object.assign(before.skills.find(s=>s.id===oldBeacon.id),oldBeacon);
for(const r of runtime.modules){const b=read(`${v3}/${r.frozenPath}`,'same frozen first-party runtime');assert.equal(hash(b),r.sha256);save(r.frozenPath,b);}
const {searchCatalog}=await import(pathToFileURL(path.join(dir,'frozen-runtime/product.mjs')));
function run(c,row){const r=searchCatalog(c,row.query,{limit:5});return {ownerRank:r.results.findIndex(s=>s.id===row.owner)+1||null,selection:r.selection,results:r.results.map(s=>({id:s.id,score:s.score,reasons:s.reasons}))};}
assert.equal(priorProbes.cases.length,27);
const probes=priorProbes.cases.map(row=>{const baseline=run(before,row),result=run(catalog,row);const previousResult=previous.fixedProbeComparison.find(r=>r.id===row.id).result;assert.deepEqual(baseline,previousResult,'Same runtime and pre-repair metadata must reproduce v3');return {id:row.id,owner:row.owner,query:row.query,before:baseline,after:result,ownerRankUnchanged:baseline.ownerRank===result.ownerRank};});
const repairs=probes.filter(r=>['B-N1','B-N2'].includes(r.id));assert.deepEqual(repairs.map(r=>r.before.ownerRank),[null,null]);assert.deepEqual(repairs.map(r=>r.after.ownerRank),[2,1]);
const other=probes.filter(r=>!['B-N1','B-N2'].includes(r.id));assert.equal(other.length,25);assert.ok(other.every(r=>r.ownerRankUnchanged));assert.ok(probes.every(r=>r.after.selection.state===r.before.selection.state));
const hostNeedNone=priorProbes.hostNeedNone.map(row=>{const q=probes.find(r=>r.id===row.id);const r=searchCatalog(catalog,q.query,{limit:5,need:'none'});assert.equal(r.results.length,0);assert.equal(r.selection.state,'abstain');return {id:row.id,state:r.selection.state,results:0};});
for(const r of rows)assert.equal(hash(fs.readFileSync(`${root}/${r.path}`)),r.sha256,'Source changed during final closure');
for(const r of reads.filter(r=>r.path.startsWith(v3+'/')))assert.equal(hash(fs.readFileSync(r.path)),r.sha256,'Prior evidence changed during closure');
const at=new Date().toISOString();
save('probe-results.json',{executedAt:at,runtimeGraphSha256:runtime.graphSha256,caseSet:'Same 27 v3 queries; no additions or wording changes',cases:probes,baseline27ReproducedExactly:true,beaconRepairs:repairs.map(r=>({id:r.id,before:r.before.ownerRank,after:r.after.ownerRank})),other25OwnerRanksUnchanged:true,hostNeedNone,selectionStatesUnchanged:true});
save('final-bind.json',{boundAt:at,files:rows,aFileCount:21,runnerFileCount:2,changesFromV3:changes,runtime,limits:'Per-file inherited A acceptance plus narrow final trigger closure only. D substance excluded; final combined routing and release remain parent-owned.'});
save('read-set.json',{readAt:at,files:reads,reviewScriptSha256:hash(fs.readFileSync(fileURLToPath(import.meta.url))),v3EvidenceUnchanged:true});
save('review.json',{disposition:'READY',scope:'Final A-R2-B closure on fixed 27-case set; seven A bodies and original routes retain prior bounded acceptance at unchanged hashes',closedFinding:'A-R2-B',beaconSha256:changes[0].sha256,baseline27ReproducedExactly:true,beaconRanks:[2,1],other25OwnerRanksUnchanged:true,previousHostNeedNoneChecksPassed:hostNeedNone.length,binding:'final-bind.json',aFiles:21,runnerFiles:2,runnerScope:'Prior independent red/green acceptance retained at identical two file hashes; no harness rerun',bodyReaudit:false,newCases:0,productWrites:false,v3Writes:false,remainingDefects:[],limits:'D substantive acceptance remains Laplace; broader Arcadia behavior remains Avicenna; final combined C routing and release gate remain parent-owned.'});
console.log(JSON.stringify({disposition:'READY',baseline27ReproducedExactly:true,beaconRanks:[2,1],other25OwnerRanksUnchanged:true,hostNeedNonePassed:hostNeedNone.length,aFiles:21,runnerFiles:2,changedFile:changes[0],bindingSha256:hash(fs.readFileSync(path.join(dir,'final-bind.json'))),v3EvidenceUnchanged:true},null,2));
