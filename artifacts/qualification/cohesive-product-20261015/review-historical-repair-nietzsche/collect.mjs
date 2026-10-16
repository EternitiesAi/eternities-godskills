import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root='C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const mode=process.argv[2];
const runLabel=process.argv[3]??mode;
if(!/^[a-z0-9-]+$/.test(runLabel??''))throw Error('Use a simple unique run label');
const tests=['adaptive-evaluator-compatibility','arcadia-asset-revision','conditional-method-regression','educational-discovery-revealed-v2','universal-wave25-beacon'].map(s=>`tests/${s}.test.mjs`);
function save(p,b){const out=path.join(dir,p);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,Buffer.isBuffer(b)||typeof b==='string'?b:JSON.stringify(b,null,2)+'\n');}
if(mode==='before'){
 if(fs.existsSync(path.join(dir,'before.json')))throw Error('Preserve first evidence');
 const r=JSON.parse(fs.readFileSync(path.join(root,'receipts/adaptive-evaluator-packages-v1.json')));
 const protectedPaths=new Set(['receipts/adaptive-evaluator-packages-v1.json','docs/adaptive-evaluator-packages-v1-certification.md','tests/core2260-catalog.json','tests/fixtures/catalog-before-next-eight-20261004.json','tests/fixtures/educational-discovery-revealed-v2.json','tests/fixtures/educational-discovery-revealed-v4.json','tests/fixtures/hermes-pre-refinement-20261004.md']);
 const frozenSource=fs.readFileSync(path.join(root,tests[0]),'utf8').split('async function assertHashes')[0];
 for(const m of frozenSource.matchAll(/"([^"\n]+)":\s*"[a-f0-9]{64}"/g))protectedPaths.add(m[1]);
 for(const row of [r.parent,r.evaluatorPackage,r.shadowReplay,r.runtime,r.taskDefinition,r.oracle,...r.sources,...r.archivedInputs,...r.outputs])if(row.path!=='package.json')protectedPaths.add(row.path);
 const protectedFiles=[...protectedPaths].sort().map(p=>({path:p,sha256:hash(fs.readFileSync(path.join(root,p)))}));
 const initialFiles=[...tests,'tests/helpers/arcadia-asset-revision.mjs','tests/helpers/atlas-discovery-revision.mjs','product/catalog.json','product/METHODS.v1.json','package.json','product/lib/product.mjs','product/lib/discovery.mjs','product/lib/selection-boundary.mjs','product/lib/request-scope.mjs'].map(p=>{const b=fs.readFileSync(path.join(root,p));save(`before/${p}`,b);return {path:p,sha256:hash(b),bytes:b.length};});
 const tapPath='C:/Users/Dom/.codex/operations/godskills-cohesive-20261015/full-maintained-v1.tap';
 save('before.json',{capturedAt:new Date().toISOString(),initialFiles,protectedFiles,fullMaintainedTap:{path:tapPath,sha256:hash(fs.readFileSync(tapPath))}});
}
if(['before','after'].includes(mode)){
 for(const suffix of ['.tap','-stderr.txt','-results.json'])if(fs.existsSync(path.join(dir,runLabel+suffix)))throw Error(`Preserve existing run: ${runLabel}`);
 const files=mode==='after'?[...tests,'tests/nietzsche-historical-projection.test.mjs']:tests;
 const inputPaths=[...files,'tests/helpers/arcadia-asset-revision.mjs','tests/helpers/atlas-discovery-revision.mjs','tests/helpers/nietzsche-historical-compatibility.mjs','tests/helpers/nietzsche-cohesive-catalog-v1.json','tests/helpers/nietzsche-adaptive-package-input-v1.json','tests/helpers/nietzsche-method-directory-before-cohesion.json','package.json','product/catalog.json','product/METHODS.v1.json','product/METHODS.v1.md','product/release.json','product/lib/product.mjs','product/lib/discovery.mjs','product/lib/selection-boundary.mjs','product/lib/request-scope.mjs','product/lib/method-directory.mjs','product/lib/skill-frontmatter.mjs','product/bin/godskills.mjs'].filter(p=>fs.existsSync(path.join(root,p)));
 const inputs=inputPaths.map(p=>{const b=fs.readFileSync(path.join(root,p));return {path:p,bytes:b.length,sha256:hash(b)};});
 const startedAt=new Date().toISOString();
 const args=['--test','--test-reporter=tap',...files];
 const r=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout:60000,maxBuffer:8*1024*1024});
 save(`${runLabel}.tap`,r.stdout??'');save(`${runLabel}-stderr.txt`,r.stderr??'');
 const initial=JSON.parse(fs.readFileSync(path.join(dir,'before.json')));
 const drift=initial.protectedFiles.filter(row=>hash(fs.readFileSync(path.join(root,row.path)))!==row.sha256);
 const inputDrift=inputs.filter(row=>hash(fs.readFileSync(path.join(root,row.path)))!==row.sha256);
 const summary={startedAt,executedAt:new Date().toISOString(),nodeVersion:process.version,command:[process.execPath,...args],status:r.status,error:r.error?.message??null,counts:(r.stdout??'').split(/\r?\n/).filter(s=>/^# (tests|pass|fail|duration_ms) /.test(s)),failures:[...(r.stdout??'').matchAll(/^not ok \d+ - (.*)$/gm)].map(m=>m[1]),inputs,inputDrift,protectedFileCount:initial.protectedFiles.length,protectedDrift:drift};
 save(`${runLabel}-results.json`,summary);console.log(JSON.stringify(summary,null,2));
 if(drift.length||inputDrift.length||r.error||r.status!==0)process.exitCode=1;
}else throw Error('Use before or after');
