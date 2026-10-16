// Read-only reproduction: print JSON; redirecting/updating receipts is the
// reviewer's choice. Does not build catalogs/manifests or invoke a provider.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const repo=new URL('../../../../',import.meta.url);
const matrixBytes=await readFile(new URL('matrix.frozen.json',import.meta.url));
const catalogBytes=await readFile(new URL('catalog.frozen.json',import.meta.url));
const matrix=JSON.parse(matrixBytes),catalog=JSON.parse(catalogBytes);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const baseline=process.argv.includes('--baseline');
let searchCatalog,sourceHashes={};
if(baseline){
  // Replay only first-party source at the explicitly authorized base commit.
  // Data-URL imports avoid writing a checkout or a second implementation.
  const load=path=>{
    const bytes=execFileSync('git',['show',`${matrix.baselineCommit}:${path}`],{cwd:fileURLToPath(repo),windowsHide:true});
    sourceHashes[path]=sha(bytes);return bytes.toString('utf8');
  };
  const uri=text=>'data:text/javascript;base64,'+Buffer.from(text).toString('base64');
  const discovery=uri(load('product/lib/discovery.mjs'));
  const boundary=uri(load('product/lib/selection-boundary.mjs'));
  const source=load('product/lib/product.mjs').replace(/from (['"])(\.\/[^'"]+)\1/g,(_,quote,spec)=>{
    const target=spec==='./discovery.mjs'?discovery:spec==='./selection-boundary.mjs'?boundary:new URL(`product/lib/${spec.slice(2)}`,repo).href;
    return `from ${quote}${target}${quote}`;
  });
  ({searchCatalog}=await import(uri(source)));
}else{
  ({searchCatalog}=await import(new URL('product/lib/product.mjs',repo)));
  for(const path of ['product/lib/product.mjs','product/lib/discovery.mjs','product/lib/selection-boundary.mjs','product/lib/request-scope.mjs'])sourceHashes[path]=sha(await readFile(new URL(path,repo)));
}

const cases=matrix.cases.map(row=>{
  const result=searchCatalog(catalog,row.query,{...matrix.options,need:row.need??matrix.options.need});
  const ids=result.results.map(item=>item.id),failures=[];
  if(row.empty&&ids.length)failures.push('expected-empty');
  if(row.owner&&!ids.includes(row.owner))failures.push('owner-missing-top3');
  for(const id of row.exclude??[])if(ids.includes(id))failures.push(`excluded:${id}`);
  if(row.nonempty&&!ids.length)failures.push('expected-candidates');
  return {id:row.id,kind:row.kind,ids,ownerRank:row.owner?ids.indexOf(row.owner)+1:null,abstentionReason:result.abstentionReason??null,failures};
});
const probes=['game','animation','model','assets','game direction','game accessibility','Build a small game.','Make a playable prototype.','Design our game progression.'];
const tradeoffs=probes.map(query=>{
  const results=searchCatalog(catalog,query,{limit:20}).results;
  return {query,runtimeOwnerRank:results.findIndex(item=>item.id==='eternities-arcadia')+1,top3:results.slice(0,3).map(item=>item.id)};
});
console.log(JSON.stringify({schema:'godskills-lane-c-matrix-results-v1',stage:baseline?'baseline-replayed':'candidate',node:process.version,
  matrixSha256:sha(matrixBytes),catalogSha256:sha(catalogBytes),sourceHashes,
  passed:cases.filter(row=>!row.failures.length).length,total:cases.length,cases,tradeoffs},null,2));
