import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root='C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003';
const json=p=>JSON.parse(fs.readFileSync(path.join(dir,p)));
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const initial=json('read-set.json');
for(const m of initial.runtime.modules)assert.equal(digest(fs.readFileSync(path.join(dir,m.frozenPath))),m.sha256);
const snapshotPath=path.join(dir,'provenance-update/eternities-beacon.skill.json');
if(!fs.existsSync(snapshotPath)){fs.mkdirSync(path.dirname(snapshotPath));fs.copyFileSync(`${root}/product/skills/eternities-beacon/skill.json`,snapshotPath);}
const latestBytes=fs.readFileSync(snapshotPath),latest=JSON.parse(latestBytes),candidate=json('candidate/product/skills/eternities-beacon/skill.json');
const stripProvenance=({provenance,...rest})=>rest;
assert.deepEqual(stripProvenance(latest),stripProvenance(candidate),'Provenance must be the only current Beacon metadata delta');
assert.deepEqual(latest.provenance.slice(0,candidate.provenance.length),candidate.provenance);
const additions=latest.provenance.slice(candidate.provenance.length);
assert.equal(additions.length,1);
assert.equal(additions[0].source,'coreyhaines31/marketingskills@dda3841f0b294e01e93b1541486beefbfab0915e:skills/sales-enablement/SKILL.md');
assert.ok(additions[0].note.includes('811a8bb462be4e04344a0ed43d485cf124f2a339e3a53f3e6749bc185081a274'));
const catalog=json('prior-evidence/discovery-input-final.json');
for(const row of initial.files.filter(r=>r.path.endsWith('/skill.json'))){const owner=row.path.split('/')[2],i=catalog.skills.findIndex(s=>s.id===owner);assert.ok(i>=0);catalog.skills[i]={...catalog.skills[i],...json(`candidate/${row.path}`)};}
const beacon=catalog.skills.find(s=>s.id==='eternities-beacon');Object.assign(beacon,latest);
const {searchCatalog}=await import(pathToFileURL(path.join(dir,'frozen-runtime/product.mjs')));
function result(row){const r=searchCatalog(catalog,row.query,{limit:5});return {ownerRank:r.results.findIndex(s=>s.id===row.owner)+1||null,selection:r.selection,results:r.results.map(s=>({id:s.id,score:s.score,reasons:s.reasons}))};}
const previous=json('probe-results.json');
const provenanceOnly=previous.cases.map(row=>{const current=result(row);assert.deepEqual(current,row.candidate);return {id:row.id,identical:true};});
const hypotheticalTrigger="homepage value proposition and product promise with proof against the customer's current workaround";
beacon.triggers=[...beacon.triggers,hypotheticalTrigger];
const hypothesis=previous.cases.map(row=>({id:row.id,owner:row.owner,query:row.query,beforeRank:row.candidate.ownerRank,after:result(row)}));
const out={executedAt:new Date().toISOString(),runtimeGraphSha256:initial.runtime.graphSha256,latestBeaconMetadataSha256:digest(latestBytes),provenanceOnlyAdded:additions,provenanceOnlyComparison:provenanceOnly,hypotheticalTrigger,hypothesis,limits:'One original in-memory trigger suggestion only, not a product edit. Added source attribution inspected mechanically; no acquired source body opened, executed or independently accepted; D content acceptance remains Laplace. No guarantee of universal paraphrase recovery.'};
fs.writeFileSync(path.join(dir,'beacon-repair-probe.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({latestBeaconMetadataSha256:out.latestBeaconMetadataSha256,unchangedProvenanceQueries:provenanceOnly.length,hypotheticalTrigger,ranks:hypothesis.filter(r=>r.owner==='eternities-beacon').map(r=>({id:r.id,before:r.beforeRank,after:r.after.ownerRank}))},null,2));
