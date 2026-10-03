import { createHash } from 'node:crypto';
import { readFile, readdir, lstat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=dirname(fileURLToPath(import.meta.url));
const worktree=resolve(root,'../../../..');
const prefix='artifacts/cognitive-workflows-20261003/';
const pinned=[
 ['voice-application-v2/profile.md','actor-profile','f160d35ebb91f15372c3f290601649ed30ea9c49f43d170f2741a68773d80cc6'],
 ['voice-application-v2/notice-draft.md','actor-notice','c4843efb4420c7e50ba4d778b2488caa907cb3204311c3046a93fc6666ae9b65'],
 ['voice-application-v2/application-receipt.md','actor-receipt','a641ff6f61e077a47e28e0a576e8cca6a83e96e276e06b45a76e9b1304cc2caf'],
 ['repairs-v2/voice-style-calibration/SKILL.md','pinned-staged-method','01efcb9a8780efada72d7c6b263f2be51137d5311bedb3aea506f9d131ed308b'],
 ['independent-evaluation/raw/C01-voice-style-calibration.md','preregistered-raw-C01','990923975f82f69b47b05a97eb484e7c24b84567be2df32eca893a4d852a41f7'],
 ['independent-evaluation/assessor/acceptance.md','preregistered-criteria','4f6e002d3c13656a5f112266cde4a110dd75fac1195e8e62c2954e680a1248f5'],
 ['voice-imagination-review-v1/review.md','preserved-dissenting-review','699e5ee554898632bf3e19fff50e2ed6e025c3bee9231c0ed7b8b0e7577e501d'],
 ['independent-evaluation/applications/run-v1/run-manifest.json','sealed-historical-v1-manifest','d3d0ed2cd58c309c4b47e43467065f9df2c131ca26ecd82be3d51c2d94f4fee7'],
];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const assert=(condition,reason)=>{if(!condition)throw new Error(reason);};
try{
 assert(process.argv.length===2||(process.argv.length===3&&process.argv[2]==='--inventory'),'Usage: node verify-voice-v2.mjs [--inventory]');
 const inputs=[];
 for(const [suffix,role,expected]of pinned){
   const path=prefix+suffix;let cursor=worktree;
   for(const part of path.split('/')){cursor=resolve(cursor,part);assert(!(await lstat(cursor)).isSymbolicLink(),`Linked input: ${path}`);}
   assert((await lstat(cursor)).isFile(),`Not a regular file: ${path}`);
   const bytes=await readFile(cursor);assert(hash(bytes)===expected,`Voice input changed: ${path}`);
   inputs.push({path,role,bytes:bytes.length,sha256:expected});
 }
 const entries=await readdir(resolve(worktree,prefix+'voice-application-v2'),{withFileTypes:true});
 const exact=['application-receipt.md','notice-draft.md','profile.md'];
 assert(entries.every(e=>e.isFile())&&JSON.stringify(entries.map(e=>e.name).sort())===JSON.stringify(exact),'Voice application occurrence set changed');
 const notice=(await readFile(resolve(worktree,prefix+'voice-application-v2/notice-draft.md'),'utf8')).trim();
 const profile=await readFile(resolve(worktree,prefix+'voice-application-v2/profile.md'),'utf8');
 const words=notice.split(/\s+/u).length;const paragraphs=notice.split(/\n\s*\n/u).length;
 const rules=[...profile.matchAll(/^\d\. /gmu)].length;
 assert(words>=130&&words<=170,'Voice notice word bound');assert(paragraphs===2,'Voice paragraph bound');assert(rules===5,'Profile rule count');
 assert(notice.endsWith('Ask us for the rollout checklist.'),'Exact final sentence');assert(!/revolutionary|effortless|world-class/iu.test(notice),'Prohibited notice wording');
 const receipt={schemaVersion:1,verifiedIdentities:true,case:'C01-voice-application-v2',inputs,
   exactApplicationOccurrences:exact,
   literalChecks:{noticeWords:words,noticeParagraphs:paragraphs,profileRules:rules,finalSentenceExact:true,prohibitedWordsAbsent:true},
   semanticAndSubjectiveVerdict:'Separate independent assessment required; literal PASS does not approve meaning or voice.',
   originalV1ManifestUnchanged:true,liveProductReadOrRebound:false,externalEffects:'none-read-only-check',
 };
 if(process.argv[2]==='--inventory')console.log(JSON.stringify(receipt,null,2));
 else{const saved=JSON.parse(await readFile(resolve(root,'voice-input-verification.json'),'utf8'));assert(JSON.stringify(saved)===JSON.stringify(receipt),'Voice input receipt mismatch');console.log(JSON.stringify({verified:true,inputCount:inputs.length,literalChecks:receipt.literalChecks,semanticAcceptance:'not-implied',originalV1ManifestUnchanged:true},null,2));}
}catch(error){console.error(error.message);process.exitCode=1;}
