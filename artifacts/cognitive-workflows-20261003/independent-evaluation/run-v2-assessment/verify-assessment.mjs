import { createHash } from 'node:crypto';
import { readFile, readdir, lstat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=dirname(fileURLToPath(import.meta.url));
const worktree=resolve(root,'../../../..');
const hash=data=>createHash('sha256').update(data).digest('hex');
const assert=(condition,reason)=>{if(!condition)throw new Error(reason);};
const expectedArtifacts=[
 'README.md','assessment-receipt.json','memory-assessment.md','memory-input-verification.json',
 'verify-assessment.mjs','verify-memory-v2.mjs','verify-voice-v2.mjs',
 'voice-assessment.md','voice-input-verification.json',
].sort();
try{
 assert(process.argv.length===2||(process.argv.length===3&&process.argv[2]==='--inventory'),'Usage: node verify-assessment.mjs [--inventory]');
 const records=new Map();
 for(const receiptName of ['memory-input-verification.json','voice-input-verification.json']){
  const receipt=JSON.parse(await readFile(resolve(root,receiptName),'utf8'));
  for(const item of receipt.inputs){
   assert(item.path.startsWith('artifacts/cognitive-workflows-20261003/')&& !item.path.split('/').includes('..'),'Unexpected input path');
   let cursor=worktree;for(const part of item.path.split('/')){cursor=resolve(cursor,part);assert(!(await lstat(cursor)).isSymbolicLink(),`Linked assessment input: ${item.path}`);}
   const bytes=await readFile(cursor);assert(bytes.length===item.bytes&&hash(bytes)===item.sha256,`Inspected input identity mismatch: ${item.path}`);
   const old=records.get(item.path);assert(!old||old.sha256===item.sha256,'Conflicting input bindings');
   if(old){if(!old.roles.includes(item.role))old.roles.push(item.role);old.roles.sort();}
   else records.set(item.path,{path:item.path,roles:[item.role],bytes:item.bytes,sha256:item.sha256});
  }
 }
 const inputs=[...records.values()].sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
 const entries=await readdir(root,{withFileTypes:true});
 const names=entries.filter(e=>e.name!=='assessment-manifest.json').map(e=>e.name).sort();
 assert(entries.every(e=>e.isFile())&&JSON.stringify(names)===JSON.stringify(expectedArtifacts),'Assessment artifact occurrence set changed');
 const artifacts=[];
 for(const path of names){const target=resolve(root,path);assert(!(await lstat(target)).isSymbolicLink(),'Linked assessment artifact');const bytes=await readFile(target);artifacts.push({path,bytes:bytes.length,sha256:hash(bytes)});}
 const disposition=JSON.parse(await readFile(resolve(root,'assessment-receipt.json'),'utf8'));
 assert(disposition.memory.disposition==='acceptable-for-bounded-outcome-with-nonmaterial-source-wording-correction','Memory disposition mismatch');
 assert(disposition.voice.disposition==='repair-needed-application-meaning-preservation','Voice failed finding was changed');
 const canonical=[...inputs.map(f=>`input\0${f.path}\0${f.bytes}\0${f.sha256}\n`),...artifacts.map(f=>`assessment\0${f.path}\0${f.bytes}\0${f.sha256}\n`)].join('');
 const manifest={schemaVersion:1,kind:'sealed-independent-v2-application-assessment',algorithm:'sha256',canonicalEncoding:'utf8: sorted input records then sorted assessment records; domain + NUL + path + NUL + decimal bytes + NUL + lowercase sha256 + LF',bundleSha256:hash(Buffer.from(canonical,'utf8')),inputs,artifacts,memoryDisposition:disposition.memory.disposition,voiceDisposition:disposition.voice.disposition,v1ManifestSha256:disposition.v1History.manifestSha256,liveProductRebound:false,qualityOrSuperiorityClaim:false};
 if(process.argv[2]==='--inventory')console.log(JSON.stringify(manifest,null,2));
 else{const saved=await readFile(resolve(root,'assessment-manifest.json'));assert(JSON.stringify(JSON.parse(saved.toString('utf8')))===JSON.stringify(manifest),'Sealed assessment manifest mismatch');console.log(JSON.stringify({verifiedIdentities:true,bundleSha256:manifest.bundleSha256,manifestSha256:hash(saved),assessmentReceiptSha256:artifacts.find(f=>f.path==='assessment-receipt.json').sha256,inspectedInputCount:inputs.length,assessmentArtifactCount:artifacts.length,memoryDisposition:manifest.memoryDisposition,voiceDisposition:manifest.voiceDisposition,semanticVoiceFailurePreserved:true,v1HistoricalManifestUnchanged:true},null,2));}
}catch(error){console.error(error.message);process.exitCode=1;}
