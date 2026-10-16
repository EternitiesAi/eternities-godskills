import assert from 'node:assert/strict';
import {readFile,readdir,lstat,readlink,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {verifyProduct} from "file:///C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003/artifacts/qualification/executable-examples-20261016/packaging-review-v2/fixture-koS4bs/fixture-verify-product.mjs";
const op="C:\\dev\\eternities-godskills\\.worktrees\\quality-qualification-20261003\\artifacts\\qualification\\executable-examples-20261016\\packaging-review-v2\\fixture-koS4bs\\delivery\\op";
const root="C:\\dev\\eternities-godskills\\.worktrees\\quality-qualification-20261003\\artifacts\\qualification\\executable-examples-20261016\\packaging-review-v2\\fixture-koS4bs\\delivery\\repo";
const native="C:\\dev\\eternities-godskills\\.worktrees\\quality-qualification-20261003\\artifacts\\qualification\\executable-examples-20261016\\packaging-review-v2\\fixture-koS4bs\\delivery\\native",runtime="C:\\dev\\eternities-godskills\\.worktrees\\quality-qualification-20261003\\artifacts\\qualification\\executable-examples-20261016\\packaging-review-v2\\fixture-koS4bs\\delivery\\runtime";
const baseline='6fa86b80b1a2bb015ea3d747f990da14c763b359912c3a7954499be66817d574';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const json=async path=>JSON.parse(await readFile(path,'utf8'));
async function inventory(base,prefix='',result={}){
  for(const e of (await readdir(join(base,prefix),{withFileTypes:true})).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0)){
    const rel=prefix+e.name,path=join(base,rel),stat=await lstat(path);
    if(stat.isSymbolicLink())result[rel]={link:await readlink(path)};
    else if(stat.isDirectory()){result[rel+'/']={directory:true};await inventory(base,rel+'/',result);}
    else{assert(stat.isFile());result[rel]=hash(await readFile(path));}
  }return result;
}
const phase=process.argv[2];assert(['before','preinstall','after'].includes(phase));
const release=await verifyProduct(runtime),nativeFiles=await inventory(native),runtimeFiles=await inventory(runtime);
for(const [path,digest] of Object.entries(release.files).filter(([p])=>p.startsWith('skills/')))
  assert.equal(nativeFiles[path.slice(7)],digest,`native diverges: ${path}`);
const record={phase,observedUtc:new Date().toISOString(),releaseId:release.releaseId,native:nativeFiles,runtime:runtimeFiles};
if(phase==='before'){
  assert.equal(release.releaseId,baseline);
  record.managedIds=(await json(runtime+'/catalog.json')).skills.map(x=>x.id);
  record.release=release;
}else{
  const before=await json(op+'/before.json'),candidate=await verifyProduct(root+'/product');
  const accepted=await json(op+'/accepted-candidate.json'),integration=await json(op+'/integration.json');
  assert.equal(candidate.releaseId,accepted.releaseId,'Candidate changed after independent acceptance');
  assert.equal(candidate.releaseId,integration.releaseId,'Candidate differs from integration check');
  for(const file of accepted.reviewedFiles)assert.equal(hash(await readFile(join(root,file.path))),file.sha256,`Reviewed bytes changed: ${file.path}`);
  assert.deepEqual((await json(root+'/product/catalog.json')).skills.map(x=>x.id),before.managedIds,'Unexpected ID change');
  const unmanaged=x=>Object.fromEntries(Object.entries(x).filter(([p])=>!before.managedIds.includes(p.split('/')[0])));
  assert.deepEqual(unmanaged(nativeFiles),unmanaged(before.native),'Unrelated installed records changed');
  record.unrelatedRecords=Object.keys(unmanaged(nativeFiles)).length;record.candidateRelease=candidate.releaseId;
  if(phase==='preinstall'){
    assert.deepEqual(nativeFiles,before.native,'Native changed during work');
    assert.deepEqual(runtimeFiles,before.runtime,'Runtime changed during work');
  }else{
    const preinstall=await json(op+'/preinstall.json');
    assert.equal(preinstall.candidateRelease,accepted.releaseId,'Installed candidate differs from preinstall');
    assert.equal(release.releaseId,candidate.releaseId);
    assert.deepEqual(nativeFiles,before.native,'This release should not alter native skill bytes');
    const receipt=await json(op+'/rollback-backup/install-receipt.json');
    assert.equal(receipt.status,'installed');assert.equal(receipt.releaseId,candidate.releaseId);
    assert.equal(receipt.completed.length,before.managedIds.length);
    assert.deepEqual(await inventory(op+'/rollback-backup/previous-runtime'),before.runtime);
    const managed=Object.fromEntries(Object.entries(before.native).filter(([p])=>before.managedIds.includes(p.split('/')[0])));
    assert.deepEqual(await inventory(op+'/rollback-backup/previous-skills'),managed);
    record.backupVerified=true;record.receiptSha256=hash(await readFile(op+'/rollback-backup/install-receipt.json'));
  }
}
await writeFile(op+'/'+phase+'.json',JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({phase,releaseId:record.releaseId,candidateRelease:record.candidateRelease,managed:record.managedIds?.length??93,unrelatedRecords:record.unrelatedRecords,backupVerified:record.backupVerified}));
