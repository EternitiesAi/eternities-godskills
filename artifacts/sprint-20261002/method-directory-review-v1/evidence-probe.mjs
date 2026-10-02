// Independent bounded method-directory review; all fixtures stay in this new folder.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {dirname,join,resolve,relative} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const reviewRoot=dirname(fileURLToPath(import.meta.url));
const run=await fs.mkdtemp(join(reviewRoot,'run-'));
const repo='C:/dev/eternities-godskills/.worktrees/product-sprint-20261002';
const source=join(repo,'product');
const hash=b=>createHash('sha256').update(b).digest('hex');
const record=async path=>{const b=await fs.readFile(path);return {path:resolve(path),bytes:b.length,sha256:hash(b)};};
const frozen=[
 ['product/lib/method-directory.mjs','22e1f0a6c16fcd04a3ff9029cabc3c7390381d3ac6bd89a45a395655f6a44180'],
 ['product/lib/product.mjs','1e99a9e68317fa01121f81e363860cd28e17e5b19c7aedc8522d949e7025ad79'],
 ['product/METHODS.v1.json','c722fa517eb82757daf2baec7901e487e1cac757487be2559862ee5e71040abb'],
 ['product/METHODS.v1.md','365932e8f48c77c15d364ccefc3c4d37a60921de9768ae367133bece70c077af'],
 ['product/README.md','1db4c4ec4e9fae4f72ed8d90ed70a0166ebfae71b4d12285d994a3acb45a3e76'],
 ['tests/product-method-directory.test.mjs','7415c0c9af6eef9377c89ea2935abc554964de1234841fc44252a250d2d21c76']
];
const inputs=[];
for(const [path,sha256] of frozen){const r=await record(join(repo,path));assert.equal(r.sha256,sha256);inputs.push({...r,relativePath:path,role:'parent-frozen review input'});}
for(const path of ['product/catalog.json','product/release.json','product/INDEX.md','tests/universal-product.test.mjs'])inputs.push({...await record(join(repo,path)),relativePath:path,role:'observed context'});
const copy=async name=>{const dest=join(run,name);await fs.cp(source,dest,{recursive:true,errorOnExist:true,force:false});return dest;};
const pack=await copy('portable pack');
const api=await import(pathToFileURL(join(pack,'lib/product.mjs')).href);
const methods=await import(pathToFileURL(join(pack,'lib/method-directory.mjs')).href);
const release=await api.verifyProduct(pack);
const catalog=JSON.parse(await fs.readFile(join(pack,'catalog.json'),'utf8'));
const data=await methods.inspectMethodDirectory(pack,catalog);
assert.equal(data.methods.length,4);
assert.equal(data.methods.filter(x=>x.documentStatus==='independently-document-reviewed').length,2);
assert.equal(data.methods.filter(x=>x.documentStatus==='not-assessed-by-this-overlay').length,2);
assert.ok(data.methods.every(x=>x.outcomeStatus==='not-performance-qualified'));
assert.equal(await fs.readFile(join(pack,'METHODS.v1.md'),'utf8'),methods.renderMethodDirectory(data));

const evidenceBindings=[],copiedEvidence=[];
for(const row of data.methods){
 evidenceBindings.push(await record(join(source,row.resource)));
 if(!row.review)continue;
 const originals=row.owner==='eternities-atlas'?join(repo,'artifacts/sprint-20261002/atlas-review-v3'):'C:/dev/eternities-godskills/.worktrees/sprint-arcadia-v2-20261002/artifacts/sprint-20261002/arcadia-review-v2';
 for(const name of ['receipt.json','review.md']){
  const received=await fs.readFile(join(pack,dirname(row.review.receipt),name));
  const original=await fs.readFile(join(originals,name));assert.deepEqual(received,original);
  const binding=await record(join(source,dirname(row.review.receipt),name));
  evidenceBindings.push(binding);copiedEvidence.push({...binding,original:join(originals,name),originalBytesIdentical:true});
 }
}
const links=async(file,pack)=>{
 const content=await fs.readFile(file,'utf8'),found=[];
 for(const m of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
  const target=m[1].split('#')[0];if(!target||/^(?:https?:|mailto:)/.test(target))continue;
  const resolved=resolve(dirname(file),target);assert.ok(!relative(pack,resolved).startsWith('..'));
  await fs.access(resolved);found.push({target,exists:true});
 }
 return found;
};
const reportLinks=[];
for(const row of data.methods.filter(x=>x.review)){
 const report=join(pack,row.review.report);
 reportLinks.push({report:row.review.report,links:await links(report,pack)});
 for(const link of reportLinks.at(-1).links){
  const file=resolve(dirname(join(source,row.review.report)),link.target);
  evidenceBindings.push(await record(file));
 }
}
const readme=await fs.readFile(join(pack,'README.md'),'utf8'),directory=await fs.readFile(join(pack,'METHODS.v1.md'),'utf8');
assert.match(readme,/selected smaller-method directory.*METHODS\.v1\.md/);
assert.match(directory,/Read the selected complete SKILL\.md before its conditional method/);
const callerPaths=[];
for(const [caseId,query,id] of [
 ['Q1','Map gameplay states to audio cues with muted alternatives and priority interruption','arcadia-game-state-audio-cues'],
 ['Q2','game-state to audio-cue design','arcadia-game-state-audio-cues'],
 ['Q3','Who authored, reviewed, approved, or challenged this exact artifact version?','oracle-artifact-role-evidence']
]){
 const row=data.methods.find(x=>x.id===id),owner='skills/'+row.owner+'/SKILL.md';
 const entry=await fs.readFile(join(pack,owner),'utf8');
 const body=await fs.readFile(join(pack,row.resource),'utf8');
 assert.ok(entry.length>500&&body.length>1000);
 assert.ok(directory.includes(']('+owner+')'));
 assert.ok(directory.includes(']('+row.resource+(row.anchor?'#'+row.anchor:'')+')'));
 callerPaths.push({caseId,query,selection:'Reviewer matched actual task and exclusions, not an automated selector',path:['README.md','METHODS.v1.md',owner,row.resource+(row.anchor?'#'+row.anchor:'')],completeOwnerRead:true,conditionalReferenceRead:true,ownerBytes:Buffer.byteLength(entry),methodBytes:Buffer.byteLength(body),documentStatus:row.documentStatus,outcomeStatus:row.outcomeStatus});
}
const negativeBoundaries=[
 {caseId:'N1',query:'Inspect supplied DSP code for sample-rate discontinuities',rejectedMethod:'arcadia-game-state-audio-cues',nextOwner:'audio-dsp-integrity-review',reason:data.methods[0].exclusions[0]},
 {caseId:'N2',query:'Score sales prospects from account records',rejectedMethod:'atlas-serving-time-decision-trace',nextOwner:'eternities-agora',reason:data.methods[1].exclusions[0]},
 {caseId:'N3',query:'Validate the serialized trace schema only',rejectedMethod:'atlas-serving-time-decision-trace',nextOwner:'structured-output-contracts',reason:data.methods[1].exclusions[0]},
 {caseId:'N4',query:'Permission to read report v3 is asserted; who formally approved that report?',method:'oracle-artifact-role-evidence',result:'No verified artifact approval from read-access permission alone',reason:data.methods[2].exclusions[0]}
];
const originalApi=await import(pathToFileURL('C:/dev/eternities-godskills/product/lib/product.mjs').href);
assert.equal(api.searchCatalog.toString(),originalApi.searchCatalog.toString());
const cli=spawnSync(process.execPath,[join(pack,'bin/godskills.mjs'),'validate'],{cwd:run,encoding:'utf8',env:{SystemRoot:process.env.SystemRoot??'',PATH:''}});
assert.equal(cli.status,0,cli.stderr);assert.equal(JSON.parse(cli.stdout).releaseId,release.releaseId);
const rebuilt=await api.buildProduct(pack);
assert.equal(rebuilt.releaseId,release.releaseId,'Build should reproduce the observed exact pack');
assert.equal((await api.verifyProduct(pack)).releaseId,release.releaseId);

const refusals=[];
const refuse=async(name,change,pattern)=>{
 const dest=await copy(name),json=join(dest,'METHODS.v1.json'),value=JSON.parse(await fs.readFile(json,'utf8'));
 await change(dest,value);
 let error=null;
 try{await api.buildProduct(dest);}catch(e){error=e.message;}
 assert.ok(error,'Expected refusal: '+name);assert.match(error,pattern);
 refusals.push({caseId:name,result:'refused',error});
};
await refuse('stale-body',async(dest,value)=>{await fs.appendFile(join(dest,value.methods[0].resource),'\nCHANGED METHOD BYTES\n');},/Stale method resource/);
await refuse('old-review-transfer',async(dest,value)=>{const target=join(dest,value.methods[0].resource);await fs.appendFile(target,'\nCHANGED SCOPE\n');value.methods[0].resourceSha256=hash(await fs.readFile(target));await fs.writeFile(join(dest,'METHODS.v1.json'),JSON.stringify(value));},/Stale method review binding/);
await refuse('missing-json-with-md',async(dest)=>{await fs.unlink(join(dest,'METHODS.v1.json'));},/Method directory metadata missing/);
await refuse('report-tamper',async(dest,value)=>{await fs.appendFile(join(dest,value.methods[0].review.report),'\nMODIFIED REVIEW\n');},/Stale method review/);
await refuse('undeclared-resource',async(dest,value)=>{value.methods[0].resource='skills/eternities-arcadia/SKILL.md';await fs.writeFile(join(dest,'METHODS.v1.json'),JSON.stringify(value));},/undeclared method resource/);
await refuse('unsupported-performance-enum',async(dest,value)=>{value.methods[0].outcomeStatus='performance-qualified';await fs.writeFile(join(dest,'METHODS.v1.json'),JSON.stringify(value));},/Unsupported Method outcome status/);
await refuse('bad-review-pointer',async(dest,value)=>{value.methods[0].review.resourceBinding.sha256Pointer='/candidateIdentity/absent';await fs.writeFile(join(dest,'METHODS.v1.json'),JSON.stringify(value));},/Missing Method review pointer/);
await refuse('unassessed-review-inheritance',async(dest,value)=>{value.methods[2].review=value.methods[0].review;await fs.writeFile(join(dest,'METHODS.v1.json'),JSON.stringify(value));},/Unassessed Method cannot inherit/);

const tampered=await copy('self-consistent-generated-md-tamper');
await fs.appendFile(join(tampered,'METHODS.v1.md'),'\nUNDECLARED STATUS TEXT\n');
const manifest=JSON.parse(await fs.readFile(join(tampered,'release.json'),'utf8'));
manifest.files['METHODS.v1.md']=hash(await fs.readFile(join(tampered,'METHODS.v1.md')));
manifest.releaseId=hash(JSON.stringify(manifest.files,null,2)+'\n');
await fs.writeFile(join(tampered,'release.json'),JSON.stringify(manifest,null,2)+'\n');
let generatedError;
try{await api.verifyProduct(tampered);}catch(e){generatedError=e.message;}
assert.match(generatedError,/Method directory does not match its exact metadata/);
refusals.push({caseId:'self-consistent-generated-md-tamper',result:'refused',error:generatedError});

const pattern='portable content identity|specialist discovery works|changed bytes and extra undeclared|missing resources, dangling relations|real product CLI works|self-consistent hashes cannot|exact declared negative phrases|portable metadata rejects|portable reference URLs';
const testEnv={...process.env,TEMP:run,TMP:run};
const focused=spawnSync(process.execPath,['--test','tests/product-method-directory.test.mjs'],{cwd:repo,encoding:'utf8',env:testEnv});
assert.equal(focused.status,0,focused.stderr);
const existing=spawnSync(process.execPath,['--test','--test-name-pattern',pattern,'tests/universal-product.test.mjs'],{cwd:repo,encoding:'utf8',env:testEnv});
assert.equal(existing.status,0,existing.stderr);
const scopeMismatch={readmeClaim:'No source warehouse or development artifacts enter the archive.',claimLine:92,bundledReviewEvidence:Object.keys(release.files).filter(x=>x.startsWith('evidence/method-reviews/')),historicalReportBytesMatchOriginal:true};
assert.equal(scopeMismatch.bundledReviewEvidence.length,7);
for(const input of inputs.filter(x=>x.role==='parent-frozen review input'))assert.equal((await record(input.path)).sha256,input.sha256);
for(const input of evidenceBindings)assert.equal((await record(input.path)).sha256,input.sha256);
console.log(JSON.stringify({
 schema:'godskills.method-directory-independent-evidence/v1',observedUtc:new Date().toISOString(),
 scope:{canonicalMain:'55f960847fa2a06a750a1a6e20c4e7f95ea10449',observedReleaseId:release.releaseId,skillCount:release.skillCount,payloadFiles:Object.keys(release.files).length,wholeProductCertification:false,run},
 inputBindings:inputs,evidenceBindings,copiedEvidence,reportLinks,callerPaths,negativeBoundaries,
 searchScorerSourceUnchanged:true,methodRows:4,documentReviewedRows:2,notAssessedRows:2,allOutcomesNotPerformanceQualified:true,
 minimalEnvironmentCli:{executable:process.execPath,args:[join(pack,'bin/godskills.mjs'),'validate'],exitCode:cli.status,stdout:cli.stdout,stderr:cli.stderr,PATH:''},
 copiedBuildReproducesIdentity:true,refusals,
 tests:{focused:{command:'node --test tests/product-method-directory.test.mjs',exitCode:focused.status,stdout:focused.stdout,stderr:focused.stderr},existing:{command:'node --test --test-name-pattern '+JSON.stringify(pattern)+' tests/universal-product.test.mjs',exitCode:existing.status,stdout:existing.stdout,stderr:existing.stderr}},
 scopeMismatch,allFrozenInputAndEvidenceHashesUnchanged:true,
 effects:{outputRoot:reviewRoot,productEdits:0,fixtureWritesOnlyInsideOutputRoot:true,childAgents:0,providers:0,acquisition:0,acquiredCodeExecution:0,installs:0,commits:0,merges:0,pushes:0,R10Dispositions:0,frozenActivationPathAccess:0},
 limitations:['Same-host Windows product-only copy, not fresh OS/native host UI or agent-performance evidence.',
 'Caller selections and exclusions are independent manual application of Markdown, not new semantic-routing code or automatic classification.',
 'Byte/pointer checks establish consistency, not authenticity, independence, truthful scope, reviewer identity or rights; evidence claims remain publisher statements.',
 'Unsupported performance enum is rejected; free-text execution statements still require publisher review rather than machine truth certification.',
 'No export replay, installer tests, full suite, source-obligation review or runtime/human quality qualification.']
},null,2));
