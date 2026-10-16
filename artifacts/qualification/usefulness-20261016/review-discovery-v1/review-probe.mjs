// Independent, read-only public-API comparison. Only stdout receives results.
// Exact baseline modules are read from Git objects, never checked out or patched.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {posix, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {SourceTextModule, SyntheticModule} from 'node:vm';
import assert from 'node:assert/strict';
import {searchCatalog as directSearch} from '../../../../product/lib/product.mjs';
import {affirmativeRequestClauses as directClauses} from '../../../../product/lib/request-scope.mjs';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const own = 'artifacts/qualification/usefulness-20261016/review-discovery-v1/';
const author = 'artifacts/qualification/usefulness-20261016/discovery/';
const baseline = '7c7f2ac98a282ccb2e59c3a4c0424802a4dd72b5';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const bytesAt = path => readFile(resolve(root, path));
const gitBytes = path => execFileSync('git', ['show', `${baseline}:${path}`], {cwd:root,maxBuffer:8*1024*1024});
const controlBytes = await bytesAt(own+'controls.json');
const controls = JSON.parse(controlBytes);
const frozenBytes = await bytesAt(author+'frozen-cases.json');
const frozen = JSON.parse(frozenBytes);
const catalogBytes = await bytesAt('product/catalog.json');
const oldCatalogBytes = gitBytes('product/catalog.json');
assert.equal(sha(catalogBytes),sha(oldCatalogBytes),'Catalog changed from exact baseline');
const catalog = JSON.parse(catalogBytes);
const whitelist = new Set(['product/lib/product.mjs','product/lib/method-directory.mjs',
  'product/lib/skill-frontmatter.mjs','product/lib/discovery.mjs',
  'product/lib/selection-boundary.mjs','product/lib/request-scope.mjs']);

async function loadGraph(mode) {
  const cache = new Map(), identities = {};
  async function getModule(id) {
    if(cache.has(id)) return cache.get(id);
    if(id.startsWith('node:')) {
      const exports = await import(id);
      const module = new SyntheticModule(Object.keys(exports), function(){
        for(const key of Object.keys(exports)) this.setExport(key,exports[key]);
      },{identifier:id});
      cache.set(id,module);return module;
    }
    assert.ok(whitelist.has(id),`Unexpected module access: ${id}`);
    const bytes = mode==='baseline'?gitBytes(id):await bytesAt(id);
    identities[id]={sha256:sha(bytes),bytes:bytes.length};
    const module = new SourceTextModule(bytes.toString('utf8'),{identifier:id});
    cache.set(id,module);return module;
  }
  const entry = await getModule('product/lib/product.mjs');
  await entry.link((specifier,referencing)=>getModule(specifier.startsWith('node:')?
    specifier:posix.normalize(posix.join(posix.dirname(referencing.identifier),specifier))));
  await entry.evaluate();
  return {search:entry.namespace.searchCatalog,
    clauses:cache.get('product/lib/request-scope.mjs').namespace.affirmativeRequestClauses,
    identities};
}
const old = await loadGraph('baseline');
const current = await loadGraph('candidate');
const graphChanges = Object.keys(old.identities).filter(path=>old.identities[path].sha256!==current.identities[path].sha256);
assert.deepEqual(graphChanges,['product/lib/request-scope.mjs']);

function frozenFailures(item,output) {
  const ids=output.results.map(x=>x.id),fail=[];
  for(const id of item.expected.includes||[]) if(!ids.includes(id)) fail.push(`missing:${id}`);
  for(const id of item.expected.excludes||[]) if(ids.includes(id)) fail.push(`excluded:${id}`);
  for(const [a,b] of item.expected.precedesIfPresent||[]) if(ids.includes(a)&&ids.includes(b)&&ids.indexOf(a)>ids.indexOf(b)) fail.push(`precedence:${a}`);
  if(item.expected.empty && ids.length) fail.push('not-empty');
  if(item.expected.abstentionReason && output.abstentionReason!==item.expected.abstentionReason) fail.push('abstention-reason');
  if(output.authority!=='none'||output.activation!=='none') fail.push('authority-activation');
  if(output.selection.state!==(item.expected.empty?'abstain':'review-required')) fail.push('selection-state');
  return fail;
}
const historicOld=JSON.parse(await bytesAt(author+'baseline.json'));
const historicCurrent=JSON.parse(await bytesAt(author+'candidate.json'));
let directParity=0,historicParity=0;
const frozenReplay=frozen.cases.map(item=>{
  const a=old.search(catalog,item.query,item.options),b=directSearch(catalog,item.query,item.options);
  assert.equal(JSON.stringify(b),JSON.stringify(current.search(catalog,item.query,item.options)));
  directParity++;
  assert.equal(JSON.stringify(a),JSON.stringify(historicOld.cases.find(x=>x.id===item.id).output));
  assert.equal(JSON.stringify(b),JSON.stringify(historicCurrent.cases.find(x=>x.id===item.id).output));
  historicParity+=2;
  return {id:item.id,baselineFailures:frozenFailures(item,a),candidateFailures:frozenFailures(item,b),
    outputChanged:JSON.stringify(a)!==JSON.stringify(b)};
});
function summarize(output,clauses){const hit=output.results.find(x=>x.id==='eternities-arcadia');return {ids:output.results.map(x=>x.id),
  arcadia:hit?{id:hit.id,score:hit.score,reasons:hit.reasons}:null,
  authority:output.authority,activation:output.activation,
  selection:output.selection,abstentionReason:output.abstentionReason??null,clauses};}
const fresh=controls.controls.map(item=>{
  const a=old.search(catalog,item.query,item.options),b=directSearch(catalog,item.query,item.options);
  assert.equal(JSON.stringify(b),JSON.stringify(current.search(catalog,item.query,item.options)));
  assert.equal(JSON.stringify(directClauses(item.query)),JSON.stringify(current.clauses(item.query)));
  directParity++;
  const satisfies=out=>out.authority==='none'&&out.activation==='none'&&
    (item.expected.arcadia===null||out.results.some(x=>x.id==='eternities-arcadia')===item.expected.arcadia);
  const baselinePass=satisfies(a),candidatePass=satisfies(b);
  return {id:item.id,kind:item.kind,query:item.query,expected:item.expected,
    scored:item.expected.arcadia!==null,baselinePass,candidatePass,
    regression:baselinePass&&!candidatePass,
    baseline:summarize(a,old.clauses(item.query)),candidate:summarize(b,directClauses(item.query)),
    completeOutputSha256:{baseline:sha(JSON.stringify(a)),candidate:sha(JSON.stringify(b))}};
});
const delivered=JSON.parse(await bytesAt(author+'file-manifest.json'));
const deliveredChecks=[];
for(const file of delivered.files){
  assert.ok(file.path.startsWith(author)||['product/lib/request-scope.mjs','tests/usefulness-discovery.test.mjs'].includes(file.path),'Manifest path outside review scope');
  const bytes=await bytesAt(file.path);
  deliveredChecks.push({path:file.path,bytes:bytes.length,sha256:sha(bytes),matches:sha(bytes)===file.sha256&&bytes.length===file.bytes});
}
assert.ok(deliveredChecks.every(x=>x.matches),'Author delivery hash drift');
const protectedPaths=['product/catalog.json','product/release.json',
  'product/lib/request-scope.mjs','tests/usefulness-discovery.test.mjs',
  author+'frozen-cases.json',author+'file-manifest.json'];
const identities={};for(const path of protectedPaths) identities[path]=sha(await bytesAt(path));
assert.equal(sha(await bytesAt(own+'controls.json')),sha(controlBytes),'Reviewer controls changed during probe');
assert.equal(sha(await bytesAt(author+'frozen-cases.json')),sha(frozenBytes),'Author frozen controls changed during probe');
for(const [path,id] of Object.entries(current.identities)) assert.equal(sha(await bytesAt(path)),id.sha256,'Module changed during probe');
console.log(JSON.stringify({schema:'independent-discovery-review-results-v1',recordedAt:new Date().toISOString(),
  node:process.version,baseline,controlsSha256:sha(controlBytes),identities,
  baselineModuleIdentities:old.identities,candidateModuleIdentities:current.identities,graphChanges,
  parity:{nativeCandidateVsVmQueries:directParity,exactHistoricalOutputMatches:historicParity},
  frozenReplay,summary:{frozenBaselinePass:frozenReplay.filter(x=>!x.baselineFailures.length).length,
    frozenCandidatePass:frozenReplay.filter(x=>!x.candidateFailures.length).length,
    freshScored:fresh.filter(x=>x.scored).length,freshCandidatePass:fresh.filter(x=>x.scored&&x.candidatePass).length,
    regressions:fresh.filter(x=>x.regression).map(x=>x.id),diagnosticOnly:fresh.filter(x=>!x.scored).map(x=>x.id)},
  fresh,deliveredChecks}));
