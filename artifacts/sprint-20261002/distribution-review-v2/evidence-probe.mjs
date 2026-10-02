// Independent bounded local export review. All generated fixtures stay in this folder.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {syncBuiltinESMExports} from 'node:module';
import {spawnSync} from 'node:child_process';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const reviewRoot = dirname(fileURLToPath(import.meta.url));
const root = await fs.mkdtemp(join(reviewRoot,'run-'));
const repo = 'C:/dev/eternities-godskills/.worktrees/product-sprint-20261002';
const previous = join(repo,'artifacts/sprint-20261002/distribution-review-v1');
const source = join(repo,'product');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const originalRead = fs.readFile;
const originalWrite = fs.writeFile;
const record = async path => {const bytes=await originalRead(path);return {path:resolve(path),bytes:bytes.length,sha256:hash(bytes)};};
const inputs = [];
for (const path of ['product/lib/archive.mjs','product/bin/godskills.mjs','tests/product-archive.test.mjs','README.md','product/README.md','product/CORPUS-SCOPE.md','product/release.json','product/lib/product.mjs']) inputs.push({...await record(join(repo,path)),relativePath:path});
const previousReceiptBytes=await originalRead(join(previous,'receipt.json'));
assert.equal(hash(previousReceiptBytes),'1e9b5a025856545ed952a0b8c58facba1fb19748e222af24ea785a6d2b1f77dd');
const previousReceipt=JSON.parse(previousReceiptBytes);
const lineageInputs=[await record(join(previous,'receipt.json'))];
for(const binding of previousReceipt.artifactBindings){
  const current=await record(join(previous,binding.path));
  assert.equal(current.sha256,binding.sha256);
  lineageInputs.push(current);
}
lineageInputs.push(await record(join(repo,'artifacts/sprint-20261002/distribution-author-v2.md')));
const unchangedPaths=['product/bin/godskills.mjs','README.md','product/README.md','product/CORPUS-SCOPE.md','product/lib/product.mjs'];
for(const path of unchangedPaths){
  assert.equal(inputs.find(x=>x.relativePath===path).sha256,previousReceipt.inputBindings.find(x=>x.relativePath===path).sha256,'Unexpected change outside repair: '+path);
}
const runNode = (pack,args) => {
  const command=[join(pack,'bin/godskills.mjs'),...args];
  const result=spawnSync(process.execPath,command,{cwd:root,encoding:'utf8',env:{SystemRoot:process.env.SystemRoot??'',PATH:''}});
  return {executable:process.execPath,args:command,cwd:root,exitCode:result.status,stdout:result.stdout,stderr:result.stderr};
};
const copyPack = async name => {const pack=join(root,name);await fs.cp(source,pack,{recursive:true,errorOnExist:true,force:false});return pack;};
const api=await import(pathToFileURL(join(source,'lib/product.mjs')).href);
const archive=await import(pathToFileURL(join(source,'lib/archive.mjs')).href);
const release=await api.verifyProduct(source);
assert.equal(release.releaseId,'6e0780ee9580369068ede14c14dd85261fe197a177eede6889e6fdf7d94ecc1b');
assert.equal(release.skillCount,68);
const pack=await copyPack('portable pack');
const first=runNode(pack,['export','--output',join(root,'normal-a.zip')]);
assert.equal(first.exitCode,0,first.stderr);
const receipt=JSON.parse(first.stdout),firstBytes=await originalRead(receipt.output);
assert.equal(hash(firstBytes),receipt.archiveSha256);
const secondPack=await copyPack('second location');
const second=runNode(secondPack,['export','--output',join(root,'normal-b.zip')]);
assert.equal(second.exitCode,0,second.stderr);
assert.deepEqual(await originalRead(join(root,'normal-b.zip')),firstBytes);

const observations=[];
const refusal = async (id,pack,args,expectedPattern,output) => {
  const result=runNode(pack,args);assert.notEqual(result.exitCode,0,id);
  assert.match(result.stderr,expectedPattern,id);
  if(output) {try {await fs.access(output);throw new Error('Unexpected output: '+output);}catch(error){if(error.code!=='ENOENT')throw error;}}
  observations.push({id,kind:'expected-refusal',...result,outputAbsent:output?true:null});
};
await refusal('existing archive',pack,['export','--output',receipt.output],/EEXIST|exist/i);
assert.deepEqual(await originalRead(receipt.output),firstBytes);
await refusal('relative output',pack,['export','--output','relative.zip'],/absolute/i,join(root,'relative.zip'));
await refusal('source-contained output',pack,['export','--output',join(pack,'self.zip')],/outside/i,join(pack,'self.zip'));
await refusal('two-dot source-contained filename',pack,['export','--output',join(pack,'..archive.zip')],/outside/i,join(pack,'..archive.zip'));
await refusal('missing parent directory',pack,['export','--output',join(root,'missing-parent','out.zip')],/ENOENT/i);
await refusal('missing output option',pack,['export'],/absolute/i);
await refusal('duplicate option',pack,['export','--output',join(root,'duplicate.zip'),'--output',join(root,'duplicate2.zip')],/Invalid option/i,join(root,'duplicate.zip'));
await refusal('unknown option',pack,['export','--bad',join(root,'unknown.zip')],/Invalid option/i,join(root,'unknown.zip'));
const sentinel=join(root,'parent-is-a-file');await originalWrite(sentinel,'SENTINEL');
await refusal('parent is a file',pack,['export','--output',join(sentinel,'out.zip')],/directory/i);
assert.equal(await originalRead(sentinel,'utf8'),'SENTINEL');
const linked=join(root,'linked-parent');await fs.symlink(pack,linked,'junction');
await refusal('linked output ancestor',pack,['export','--output',join(linked,'redirected.zip')],/link/i,join(pack,'redirected.zip'));
const linkedLeaf=join(root,'linked-leaf.zip');
try {
  await fs.symlink(receipt.output,linkedLeaf,'file');
  await refusal('linked output leaf',pack,['export','--output',linkedLeaf],/link/i);
} catch(error) {
  if(error.code!=='EPERM')throw error;
  observations.push({id:'linked output leaf',kind:'platform-skip',reason:'This Windows token cannot create file symlinks (EPERM). Junction ancestor refusal was exercised.'});
}
assert.deepEqual(await originalRead(receipt.output),firstBytes);
const tampered=await copyPack('tampered pack');await originalWrite(join(tampered,'README.md'),'TAMPERED');
await refusal('modified declared content',tampered,['export','--output',join(root,'tampered.zip')],/digest|changed/i,join(root,'tampered.zip'));
const extra=await copyPack('undeclared pack');await originalWrite(join(extra,'extra.txt'),'UNDECLARED');
await refusal('undeclared source file',extra,['export','--output',join(root,'undeclared.zip')],/file set|undeclared/i,join(root,'undeclared.zip'));

const powershell=process.argv[2];
assert.ok(powershell,'Pass the current host PowerShell executable as the first argument.');
const quote=value=>"'"+value.replaceAll("'","''")+"'";
const extract = (zip,destination) => {
  const command=`$ErrorActionPreference = 'Stop'; Expand-Archive -LiteralPath ${quote(zip)} -DestinationPath ${quote(destination)}`;
  const result=spawnSync(powershell,['-NoProfile','-NonInteractive','-Command',command],{cwd:root,encoding:'utf8',windowsHide:true});
  assert.equal(result.status,0,result.stderr);
  return {executable:powershell,command,exitCode:result.status,stdout:result.stdout,stderr:result.stderr};
};
const normalExtraction=extract(receipt.output,join(root,'normal extracted'));
const normalValidation=runNode(join(root,'normal extracted','godskills'),['validate']);
assert.equal(normalValidation.exitCode,0,normalValidation.stderr);
assert.equal(JSON.parse(normalValidation.stdout).releaseId,release.releaseId);
const extracted=join(root,'normal extracted','godskills');
for(const path of [...Object.keys(release.files),'release.json']){
  assert.deepEqual(await originalRead(join(extracted,path)),await originalRead(join(source,path)),'Extracted byte mismatch: '+path);
}
const extractedFileCount=Object.keys(release.files).length+1;
const extractedExport=runNode(extracted,['export','--output',join(root,'normal-from-extracted.zip')]);
assert.equal(extractedExport.exitCode,0,extractedExport.stderr);
assert.deepEqual(await originalRead(join(root,'normal-from-extracted.zip')),firstBytes);


// Controlled filesystem interleavings in copied packs, not a modification to
// reviewed code. Pause precisely at the exporter's direct read, restore after
// reading, and let its existing pre/post validation run normally.
const interleave = async (name,file,replacement,outputName) => {
  const copied=await copyPack(name),target=join(copied,file),original=await originalRead(target);
  let observed=false;
  fs.readFile=async function(path,...args){
    const caller=new Error().stack.split('\n')[2]??'';
    if(resolve(String(path))===resolve(target)&&caller.includes('at Module.exportProduct')&&!observed){
      observed=true;
      await originalWrite(target,replacement(original));
      try{return await originalRead(path,...args);}finally{await originalWrite(target,original);}
    }
    return originalRead(path,...args);
  };
  syncBuiltinESMExports();
  let returned=null,error=null;
  try{returned=await archive.exportProduct(copied,join(root,outputName));}
  catch(thrown){error={name:thrown.name,message:thrown.message};}
  finally{fs.readFile=originalRead;syncBuiltinESMExports();}
  assert.ok(observed,'Controlled interleaving did not reach direct exporter read');
  assert.deepEqual(await originalRead(target),original);
  assert.equal((await api.verifyProduct(copied)).releaseId,release.releaseId);
  return {scenario:name,file,observed,sourceRestoredAndValid:true,returned,error,output:join(root,outputName)};
};
const guarded=await interleave('declared-file interleave','README.md',bytes=>Buffer.concat([bytes,Buffer.from('\nTRANSIENT CHANGE\n')]),'declared-interleave.zip');
assert.equal(guarded.returned,null);assert.match(guarded.error.message,/Source changed/i);
try{await fs.access(guarded.output);throw new Error('Guarded interleave wrote an archive');}catch(error){if(error.code!=='ENOENT')throw error;}
const manifestInterleavings=[];
for(const [field,value] of [['skillCount',0],['schema','invalid-schema'],['files',{}],['releaseId','0'.repeat(64)]]){
  const result=await interleave('manifest interleave '+field,'release.json',bytes=>{
    const manifest=JSON.parse(bytes);manifest[field]=value;return Buffer.from(JSON.stringify(manifest,null,2)+'\n');
  },'manifest-interleave-'+field+'.zip');
  assert.equal(result.returned,null,field+' must refuse before output');
  assert.match(result.error.message,/Captured release manifest changed during export/);
  try{await fs.access(result.output);throw new Error('Manifest interleave wrote an archive');}catch(error){if(error.code!=='ENOENT')throw error;}
  manifestInterleavings.push({...result,field,outputAbsent:true});
}

// Final snapshot check: a semantically valid unknown manifest property does not
// change release identity. Inject only into post-capture validation, so refusal
// must come from the final whole-snapshot equality guard, not file/count checks.
const finalPack=await copyPack('final manifest interleave');
const finalTarget=join(finalPack,'release.json'),finalOriginal=await originalRead(finalTarget);
const finalManifest={...JSON.parse(finalOriginal),independentReviewMarker:'FINAL-ONLY-CHANGE'};
const finalChanged=Buffer.from(JSON.stringify(finalManifest,null,2)+'\n');
await originalWrite(finalTarget,finalChanged);
try{
  const accepted=await api.verifyProduct(finalPack);
  assert.equal(accepted.releaseId,release.releaseId);
  assert.equal(accepted.independentReviewMarker,'FINAL-ONLY-CHANGE');
}finally{await originalWrite(finalTarget,finalOriginal);}
let finalReads=0,finalObserved=false;
fs.readFile=async function(path,...args){
  if(resolve(String(path))===resolve(finalTarget)&&++finalReads===4){
    finalObserved=true;await originalWrite(finalTarget,finalChanged);
    try{return await originalRead(path,...args);}finally{await originalWrite(finalTarget,finalOriginal);}
  }
  return originalRead(path,...args);
};
syncBuiltinESMExports();
const finalOutput=join(root,'final-manifest-interleave.zip');
let finalReturned=null,finalError=null;
try{finalReturned=await archive.exportProduct(finalPack,finalOutput);}
catch(error){finalError={name:error.name,message:error.message};}
finally{fs.readFile=originalRead;syncBuiltinESMExports();}
assert.ok(finalObserved,'Post-capture manifest read was not reached');
assert.equal(finalReturned,null);
assert.match(finalError.message,/^Source release manifest changed during export$/);
assert.deepEqual(await originalRead(finalTarget),finalOriginal);
assert.equal((await api.verifyProduct(finalPack)).releaseId,release.releaseId);
try{await fs.access(finalOutput);throw new Error('Final interleave wrote an archive');}catch(error){if(error.code!=='ENOENT')throw error;}
const finalInterleave={scenario:'final validated manifest extra property',field:'independentReviewMarker',observedRead:4,manifestReads:finalReads,semanticallyValidChangedManifest:true,releaseIdentityUnchanged:true,sourceRestoredAndValid:true,returned:finalReturned,error:finalError,output:finalOutput,outputAbsent:true};

const parentTests=spawnSync(process.execPath,['--test','tests/product-archive.test.mjs'],{cwd:repo,encoding:'utf8',env:{...process.env,TEMP:root,TMP:root},maxBuffer:1024*1024});
assert.equal(parentTests.status,0,parentTests.stderr);
for(const input of [...inputs,...lineageInputs])assert.equal((await record(input.path)).sha256,input.sha256,'Reviewed input changed: '+input.path);
const catalog=JSON.parse(await originalRead(join(source,'catalog.json')));
const payloads=[];
for(const name of ['normal-a.zip','normal-b.zip','normal-from-extracted.zip'])payloads.push(await record(join(root,name)));
const output={schema:'godskills.distribution-independent-evidence/v2',observedUtc:new Date().toISOString(),
  inputBindings:inputs,lineageInputs,unchangedPaths,
  environment:{node:process.version,platform:process.platform,architecture:process.arch,nodeExecutable:process.execPath,minimalCliEnvironment:{PATH:'',SystemRoot:process.env.SystemRoot??''}},
  scope:{canonicalMain:'55f960847fa2a06a750a1a6e20c4e7f95ea10449',releaseId:release.releaseId,skillCount:release.skillCount,categories:new Set(catalog.skills.map(item=>item.category)).size,releaseBoundFiles:Object.keys(release.files).length,root},
  normalExports:[first,second],byteReproducible:true,archiveReceipt:receipt,archiveBindings:payloads,
  refusals:observations,normalExtraction,normalValidation,extractedFileCount,allExtractedBytesEqualSource:true,extractedExport,extractedReExportByteReproducible:true,
  controlledInterleavings:{declaredFile:guarded,capturedManifests:manifestInterleavings,finalManifest:finalInterleave},
  parentTests:{command:'node --test tests/product-archive.test.mjs',exitCode:parentTests.status,stdout:parentTests.stdout,stderr:parentTests.stderr},
  documentationContinuity:{sameReviewedDocumentationBytesAsV1:true,priorReviewVerdict:previousReceipt.verdict,priorCorpusAccountingFinding:previousReceipt.documentation,freshR10MetadataReads:0,freshR10LedgerPayloadReads:0},
  allReviewedInputHashesUnchanged:true,
  effects:{outputRoot:root,generatedFixturesOnlyInsideOutputRoot:true,reviewedProductEdits:0,commits:0,installs:0,pushes:0,merges:0,childAgents:0,paidProviders:0,webAcquisition:0,acquiredCodeExecution:0,frozenActivationPathsReadOrWritten:0,r10DispositionApplications:0},
  limitations:['Same Windows host and .NET extraction only; no observed Linux/macOS or fresh OS.',
    'Controlled deterministic interleaving uses a temporary built-in readFile wrapper and actual changes/restoration in copied source packs; no naturally timed race or external adversary claim.',
    'Six author tests passed, including four captured-manifest field changes; independent capture hook is preserved from v1 rather than relying on the author read-count hook.',
    'Documentation is byte-identical to v1; frozen R10 accounting support is inherited from its sealed review, not freshly replayed. No full-ledger reconstruction or source-rights clearance.',
    'File-symlink creation is EPERM on this Windows token; leaf-symlink refusal remains unobserved. Directory-junction ancestor refusal was observed.',
    'No disk-full/interrupted-write or destination-parent-replacement test. These unchanged v1 limitations are not concealed by the snapshot repair.']};
console.log(JSON.stringify(output,null,2));
