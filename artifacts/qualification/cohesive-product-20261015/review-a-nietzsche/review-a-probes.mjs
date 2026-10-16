import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const review=path.dirname(fileURLToPath(import.meta.url));
const root='C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003';
const phase=process.argv.includes('--final')?'final':'current';
const suffix=phase==='final'?'-final':'';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const {searchCatalog}=await import(pathToFileURL(`${root}/product/lib/product.mjs`));
const candidate=JSON.parse(fs.readFileSync(`${review}/snapshots/current/artifacts/qualification/cohesive-product-20261015/lane-a/candidate-v2.json`));
const catalogBytes=fs.readFileSync(`${root}/product/catalog.json`),catalog=JSON.parse(catalogBytes);
const ids=candidate.files.filter(f=>f.path.endsWith('/skill.json')).map(f=>f.path.split('/')[2]);
for(const id of ids){const meta=JSON.parse(fs.readFileSync(`${review}/snapshots/${phase}/product/skills/${id}/skill.json`));const existing=catalog.skills.findIndex(s=>s.id===id);if(existing<0)throw Error(`Missing owner ${id}`);catalog.skills[existing]={...catalog.skills[existing],...meta};}
fs.writeFileSync(`${review}/discovery-input${suffix}.json`,JSON.stringify(catalog,null,2)+'\n');
const cases=[
 ['P-D','eternities-prometheus','Diagnose our revenue change with an MRR bridge separating expansion, reactivation, contraction and churn.'],
 ['P-P','eternities-prometheus','Explain why subscription revenue rose while existing accounts shrank.'],
 ['P-C','eternities-prometheus','Commercial analytics: distinguish traffic mix from declining funnel conversion.'],
 ['B-D','eternities-beacon','Write positioning and landing page copy for our product against the buyer\'s existing workaround.'],
 ['B-P','eternities-beacon','Our offer sounds interchangeable; produce a specific promise and proof for the buyer.'],
 ['B-X','eternities-beacon','Fix the spelling in this headline; no positioning strategy requested.'],
 ['M-D','eternities-muse','Turn our interface art direction into a responsive composition using long titles and missing images.'],
 ['M-P','eternities-muse','Make these mood references into a working layout with real archive content at phone width.'],
 ['M-X','eternities-muse','Change a single margin from 12px to 16px in the approved component.'],
 ['A-D','eternities-arcadia','Playtest the core loop of a quiet constellation game; separate unclear feedback from meaningless choices.'],
 ['A-P','eternities-arcadia','Our playable prototype works but repeating it feels flat; choose what to change before adding content.'],
 ['A-X','eternities-arcadia','Fix a null check in the game asset loader; the game design is settled.'],
 ['O-D','eternities-orpheus','Edit and mix this supplied podcast: the music masks speech and the pauses feel rushed.'],
 ['O-P','eternities-orpheus','A bell obscures a name in the narration. Improve the listening result and check the encoded delivery.'],
 ['O-X','eternities-orpheus','Generate a new song in the style of this singer.'],
 ['L-D','evidence-linked-learning-design','Create contrastive practice and a transfer item that distinguishes understanding from copying a worked example.'],
 ['L-P','evidence-linked-learning-design','Prepare a lesson where learners compare densities, receive feedback, and solve a fresh problem.'],
 ['L-X','evidence-linked-learning-design','Draft a substitute teacher handoff from the existing lesson; do not redesign practice.'],
 ['V-D','voice-style-calibration','Calibrate our team voice from authorized writing samples, then adapt this draft without changing uncertainty.'],
 ['V-P','voice-style-calibration','Our writing sounds like a bundle of mannerisms; derive concrete edits from the samples and check another register.'],
 ['V-X','voice-style-calibration','Make this one sentence friendlier, without a sample-based profile.']
];
const discovery=cases.map(([id,owner,query])=>{const r=searchCatalog(catalog,query,{limit:5});return {id,owner,query,ownerRank:r.results.findIndex(s=>s.id===owner)+1||null,selection:r.selection,results:r.results.map(s=>({id:s.id,score:s.score,reasons:s.reasons}))};});
const proposedTriggerAdditions={
 'eternities-prometheus':['diagnose revenue conversion changes recurring subscription revenue MRR bridge','new expansion reactivation contraction churn opening customer cohort traffic mix'],
 'eternities-beacon':['positioning landing page copy headline buyer alternative workaround promise proof'],
 'eternities-muse':['translate mood references into a working responsive layout composition using real content'],
 'eternities-orpheus':['edit mix supplied podcast narration speech music masking audibility pacing pauses','listen to encoded audio delivery after editorial cuts'],
 'evidence-linked-learning-design':['contrastive practice worked example near miss feedback fresh item transfer retention checks']
};
const hypothetical=structuredClone(catalog);
for(const [id,additions] of Object.entries(proposedTriggerAdditions))hypothetical.skills.find(s=>s.id===id).triggers.push(...additions);
const triggerRepairProbe=cases.map(([id,owner,query])=>{const r=searchCatalog(hypothetical,query,{limit:5});return {id,owner,ownerRank:r.results.findIndex(s=>s.id===owner)+1||null,top:r.results.slice(0,3).map(s=>s.id)};});
const mechanics=[];
for(const owner of ids){
 const prefix=`product/skills/${owner}`,entry=fs.readFileSync(`${review}/snapshots/${phase}/${prefix}/SKILL.md`,'utf8'),meta=JSON.parse(fs.readFileSync(`${review}/snapshots/${phase}/${prefix}/skill.json`));
 const method=candidate.files.find(f=>f.path.startsWith(`${prefix}/references/`));
 assert.ok(method);const relative=method.path.slice(prefix.length+1);
 assert.ok(meta.resources.includes(relative));assert.ok(entry.includes(`](${relative})`));
 assert.equal(new Set(meta.resources).size,meta.resources.length);
 for(const resource of meta.resources)assert.ok(fs.existsSync(`${root}/${prefix}/${resource}`),`${owner}: ${resource}`);
 mechanics.push({owner,method:relative,declared:true,entrypointLink:true,resourcePathsExist:true,metadataIdMatches:meta.id===owner,sourceBodySha256:method.sha256});
}
const arithmetic=[];
function check(name,actual,expected){assert.deepEqual(actual,expected);arithmetic.push({name,actual,expected,pass:true});}
const opening=200,newAccounts=40,expansion=30,reactivation=20,contraction=10,churn=70,closing=210;
check('whole-scope run-rate bridge',opening+newAccounts+expansion+reactivation-contraction-churn,closing);
check('opening-cohort-only excludes entrants',opening+expansion-contraction-churn,150);
check('bridge residual from literal opening-population restriction',closing-(opening+expansion-contraction-churn),60);
check('opening-cohort NRR excludes new/reactivated entrants',(opening+expansion-contraction-churn)/opening,0.75);
const oldRate=(100*0.8+100*0.2)/200,newRate=(20*0.8+180*0.2)/200;
check('stable segment rates can coexist with lower aggregate conversion',[oldRate,newRate],[0.5,0.26]);
check('ordered quantity-price allocation closes',(12-10)*4+12*(5-4),12*5-10*4);
check('density practice key',[100/50,300/300],[2,1]);
check('fresh density item key',[240/120,180/60],[2,3]);
check('rate transfer to unit cost',[6/500*100,8/750*100],[1.2,1.0666666666666667]);
const runtimeFiles=['product/lib/product.mjs','product/lib/discovery.mjs','product/lib/selection-boundary.mjs','product/lib/request-scope.mjs'];
const result={executedAt:new Date().toISOString(),phase,boundary:'Independent reviewer-owned synthetic arithmetic and read-only metadata consumer probes. In-memory seven-owner snapshot overlay on the existing catalog; no build, product write, native packaged CLI validation, model evaluation or real-user outcome. Exclusion queries are observations, not universal expected-empty assertions.',catalogInputSha256:sha(catalogBytes),catalogSkills:catalog.skills.length,runtimeReadHashes:runtimeFiles.map(p=>({path:p,sha256:sha(fs.readFileSync(`${root}/${p}`)),inspection:p==='product/lib/product.mjs'?'selected searchCatalog boundary read and imported':'imported; selected excerpts only; not a whole-file code review'})),mechanics,arithmetic,discovery,proposedTriggerAdditions,triggerRepairProbe,triggerRepairState:'HYPOTHETICAL in-memory evidence only; no product edit; no semantic or general discovery guarantee'};
fs.writeFileSync(`${review}/probe-results${suffix}.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({mechanics:mechanics.length,arithmetic:arithmetic.length,discovery:discovery.map(r=>({id:r.id,ownerRank:r.ownerRank,top:r.results.slice(0,3).map(s=>s.id)})),triggerRepairProbe},null,2));
