import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root='C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003';
const prior=`${root}/artifacts/qualification/cohesive-product-20261015/review-a-nietzsche`;
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=p=>JSON.parse(fs.readFileSync(p));
function save(relative,value){const p=path.join(dir,relative);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof value==='string'||Buffer.isBuffer(value)?value:JSON.stringify(value,null,2)+'\n');}
const mode=process.argv[2];
if(mode==='snapshot'){
 if(fs.existsSync(`${dir}/read-set.json`))throw Error('Do not overwrite initial review snapshots');
 const binding=json(`${prior}/final-bind.json`),rows=[],deltas=[];
 for(const row of binding.files){
  const old=fs.readFileSync(`${prior}/snapshots/final/${row.path}`);assert.equal(digest(old),row.thenCurrentSha256,'Immutable prior evidence mismatch');
  const current=fs.readFileSync(`${root}/${row.path}`);
  save(`baseline/${row.path}`,old);save(`candidate/${row.path}`,current);
  const record={path:row.path,baselineSha256:digest(old),candidateSha256:digest(current),bytes:current.length,changed:digest(old)!==digest(current)};
  rows.push(record);if(record.changed)deltas.push(record);
 }
 for(const p of ['package.json','tests/test-runner-scope.test.mjs']){const b=fs.readFileSync(`${root}/${p}`);save(`candidate/${p}`,b);rows.push({path:p,candidateSha256:digest(b),bytes:b.length,role:'test-runner-scope-review'});}
 const priorRead=[];
 for(const p of ['review.json','final-bind.json','probe-results-final.json','discovery-input-final.json','review-a-cases.md']){const b=fs.readFileSync(`${prior}/${p}`);save(`prior-evidence/${p}`,b);priorRead.push({path:`review-a-nietzsche/${p}`,sha256:digest(b),bytes:b.length});}
 const modules=new Map();
 function capture(p){
  p=path.resolve(p);if(modules.has(p))return;
  assert.ok(p.startsWith(path.resolve(`${root}/product/lib`)+path.sep),'Runtime escaped product/lib');
  const b=fs.readFileSync(p);modules.set(p,b);
  for(const m of b.toString('utf8').matchAll(/\bfrom\s*['"]([^'"]+)['"]/g)){
   if(m[1].startsWith('.'))capture(path.resolve(path.dirname(p),m[1]));
   else assert.ok(m[1].startsWith('node:'),`Unexpected runtime dependency ${m[1]}`);
  }
 }
 capture(`${root}/product/lib/product.mjs`);
 const runtime=[];
 for(const [p,b] of modules){assert.equal(digest(fs.readFileSync(p)),digest(b),'Runtime changed during snapshot: retry into a new version, preserving this receipt');const relative=path.relative(`${root}/product/lib`,p).replaceAll('\\','/');save(`frozen-runtime/${relative}`,b);runtime.push({path:`product/lib/${relative}`,frozenPath:`frozen-runtime/${relative}`,sha256:digest(b),bytes:b.length});}
 runtime.sort((a,b)=>a.path.localeCompare(b.path));
 const record={snapshottedAt:new Date().toISOString(),files:rows,priorRead,runtime:{node:process.version,modules:runtime,graphSha256:digest(Buffer.from(JSON.stringify(runtime)))},scope:'A-R1/A-R2 repairs only; prior six READY bodies retained only at matching hashes; D method substance excluded'};
 save('read-set.json',record);console.log(JSON.stringify({deltas,runtime:record.runtime},null,2));
 for(const owner of ['eternities-beacon','eternities-muse','eternities-orpheus']){const p=`product/skills/${owner}/skill.json`,old=json(`${dir}/baseline/${p}`),next=json(`${dir}/candidate/${p}`);console.log(JSON.stringify({owner,addedTriggers:next.triggers.filter(s=>!old.triggers.includes(s)),nonTriggerChanges:Object.keys(next).filter(key=>key!=='triggers'&&JSON.stringify(old[key])!==JSON.stringify(next[key]))},null,2));}
}else if(mode==='probes'){
 const readset=json(`${dir}/read-set.json`);
 for(const m of readset.runtime.modules)assert.equal(digest(fs.readFileSync(`${dir}/${m.frozenPath}`)),m.sha256);
 const {searchCatalog}=await import(pathToFileURL(`${dir}/frozen-runtime/product.mjs`));
 const original=json(`${dir}/prior-evidence/discovery-input-final.json`),old=structuredClone(original),next=structuredClone(original);
 const owners=readset.files.filter(r=>r.path.endsWith('/skill.json')).map(r=>r.path.split('/')[2]);
 for(const owner of owners)for(const [catalog,version] of [[old,'baseline'],[next,'candidate']]){const index=catalog.skills.findIndex(s=>s.id===owner);assert.ok(index>=0);catalog.skills[index]={...catalog.skills[index],...json(`${dir}/${version}/product/skills/${owner}/skill.json`)};}
 const existing=json(`${dir}/prior-evidence/probe-results-final.json`).discovery.map(r=>({id:r.id,owner:r.owner,query:r.query,kind:'preserved challenge'}));
 const added=[
  ['B-N1','eternities-beacon','Draft a homepage opening that helps a small workshop choose us over its current spreadsheet; tie the claim to a demonstrable capability.'],
  ['B-N2','eternities-beacon','We sound like every rival. Turn the customer\'s present workaround into a concrete product promise, with evidence beside it.'],
  ['M-N1','eternities-muse','Make the mood board usable: show a phone layout for records with long headlines, dates and missing images.'],
  ['M-N2','eternities-muse','Use the same real archive content to choose responsive composition rules rather than just changing palettes.'],
  ['O-N1','eternities-orpheus','Our spoken interview is hard to follow because the background bed covers quiet words; plan the local edit and listen to the finished export.'],
  ['O-N2','eternities-orpheus','Preserve the speaker\'s meaning while tightening an existing episode, then check transitions and narration audibility in the exported file.']
 ].map(([id,owner,query])=>({id,owner,query,kind:'new paraphrase'}));
 const cases=[...existing,...added];
 function run(catalog,row){const r=searchCatalog(catalog,row.query,{limit:5});return {ownerRank:r.results.findIndex(s=>s.id===row.owner)+1||null,selection:r.selection,results:r.results.map(s=>({id:s.id,score:s.score,reasons:s.reasons}))};}
 const results=cases.map(row=>({...row,baseline:run(old,row),candidate:run(next,row)}));
 const abstentions=added.map(row=>{const r=searchCatalog(next,row.query,{limit:5,need:'none'});assert.equal(r.results.length,0);assert.equal(r.selection.state,'abstain');return {id:row.id,state:r.selection.state,results:r.results.length};});
 const arithmetic=[];function check(name,actual,expected){assert.deepEqual(actual,expected);arithmetic.push({name,actual,expected,pass:true});}
 check('preserved whole-business bridge',200+40+30+20-10-70,210);
 check('preserved opening-cohort close',200+30-10-70,150);
 check('preserved opening-cohort retention',150/200,0.75);
 check('preserved entrants outside opening cohort',40+20,60);
 check('new bridge with entrants',300+20+15+10-5-25,315);
 check('new opening-cohort close',300+15-5-25,285);
 check('new opening-cohort retention',285/300,0.95);
 check('new whole/opening ratio is a different quantity',315/300,1.05);
 check('preserved segment-mix challenge',[(100*0.8+100*0.2)/200,(20*0.8+180*0.2)/200],[0.5,0.26]);
 check('preserved ordered quantity-price bridge',(12-10)*4+12*(5-4),12*5-10*4);
 const wiring=owners.map(owner=>{const p=`product/skills/${owner}`,meta=json(`${dir}/candidate/${p}/skill.json`),body=fs.readFileSync(`${dir}/candidate/${p}/SKILL.md`,'utf8'),method=readset.files.find(r=>r.path.startsWith(`${p}/references/`)),relative=method.path.slice(p.length+1);assert.ok(meta.resources.includes(relative));assert.ok(body.includes(`](${relative})`));return {owner,method:relative,declared:true,linked:true};});
 const output={executedAt:new Date().toISOString(),runtime:readset.runtime,metadataOnlyComparison:true,catalogBase:'immutable prior discovery-input-final.json; identical 93-skill base in both conditions',cases:results,hostNeedNone:abstentions,arithmetic,wiring,limits:'One frozen local lexical runtime. No final combined C routing acceptance, shared build, native package verification or broad paraphrase guarantee. Source bodies of self-authored D methods excluded.'};
 save('probe-results.json',output);console.log(JSON.stringify({arithmetic:arithmetic.length,wiring:wiring.length,abstentions:abstentions.length,cases:results.map(r=>({id:r.id,kind:r.kind,baselineRank:r.baseline.ownerRank,candidateRank:r.candidate.ownerRank}))},null,2));
}else if(mode==='final-bind'){
 const initial=json(`${dir}/read-set.json`),rows=initial.files.map(r=>{const b=fs.readFileSync(`${root}/${r.path}`);save(`final/${r.path}`,b);return {...r,finalSha256:digest(b),unchangedDuringReview:digest(b)===r.candidateSha256};});
 const runtimeDrift=initial.runtime.modules.filter(r=>digest(fs.readFileSync(`${root}/${r.path}`))!==r.sha256).map(r=>({path:r.path,frozenSha256:r.sha256,thenCurrentSha256:digest(fs.readFileSync(`${root}/${r.path}`))}));
 const record={boundAt:new Date().toISOString(),files:rows,drift:rows.filter(r=>!r.unchangedDuringReview),frozenRuntimeGraphSha256:initial.runtime.graphSha256,liveRuntimeDrift:runtimeDrift,limits:'D-reference substance excluded; combined final routing deferred to parent after C freeze'};
 save('final-bind.json',record);console.log(JSON.stringify({files:rows.length,aFiles:rows.filter(r=>!r.role).length,drift:record.drift,liveRuntimeDrift:runtimeDrift},null,2));
}else throw Error('Use snapshot, probes or final-bind');
