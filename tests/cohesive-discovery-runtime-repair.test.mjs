import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';
import {lexicalIntentMatch, lexicalQueryEvidence} from '../product/lib/discovery.mjs';

const catalog=JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));
const owner='eternities-arcadia';
const arcadia=catalog.skills.find(item=>item.id===owner);
const positives=[
  'Hidden tab resumes with a huge simulation delta and pressed keys stay stuck',
  'When browser focus returns, the simulation advances too far and held input remains active',
  'Repair pointer input after page visibility changes interrupt the animation loop',
  "Fix the shader and rotation handles in the exhibit's existing interactive crystal scene; the educator's prompts and all explanatory rules must stay exactly as they are.",
  'Debug the fragment shader in an interactive scene',
];

// These fail if runtime admission drops supported lifecycle or shader work;
// they exercise current shipped metadata and the public search function.
for(const query of positives)test(`runtime repair retains supported technical work: ${query}`,()=>{
  const result=searchCatalog(catalog,query,{limit:3});
  assert.ok(result.results.some(item=>item.id===owner),JSON.stringify(result.results.map(item=>item.id)));
  assert.equal(lexicalIntentMatch(arcadia,lexicalQueryEvidence(query)).score,0,'Admission must not add a ranking bonus');
  assert.equal(result.activation,'none');assert.equal(result.authority,'none');
});

for(const query of [
  'Summarize this browser tab newsletter',
  'Repair keyboard focus on the sign-up page input fields',
  'Repair keyboard focus on a sign-up page with a CSS animation.',
  'Repair pointer input after page visibility changes interrupt the animation',
  'Explain how the simulated policy changes affect retention',
  'Price GPU hardware for a shader workstation',
  'Extract redistribution clauses from a shader license',
  'Do not repair the browser simulation; write only a postponement notice',
  'The report quotes "Hidden tab resumes with a huge simulation delta and pressed keys stay stuck"; write a postponement notice',
])test(`runtime repair preserves exclusion: ${query}`,()=>{
  assert.ok(!searchCatalog(catalog,query,{limit:20}).results.some(item=>item.id===owner));
});

test('a browser lifecycle topic does not manufacture independent work evidence',()=>{
  const intent=lexicalIntentMatch(arcadia,lexicalQueryEvidence('browser simulation input'));
  assert.equal(intent.eligible,true);
  assert.deepEqual(intent.reasons,[]);
  assert.equal(intent.score,0);
});

test('runtime recall respects host need, filters, and literal anti-triggers',()=>{
  const query=positives[0];
  assert.deepEqual(searchCatalog(catalog,query,{need:'none'}).results,[]);
  for(const options of [{category:'science'},{taskType:'research'}]){
    assert.ok(!searchCatalog(catalog,query,{...options,limit:20}).results.some(item=>item.id===owner));
  }
  assert.ok(!searchCatalog(catalog,query+'; routine isolated code edit',{limit:20}).results.some(item=>item.id===owner));
});

test('current causal evidence owner precedes incidental interatomic and serving matches',()=>{
  const query='Judge whether a measured home-feed retention lift supports a causal claim; inspect randomization, exposure, confounders, uncertainty, and guardrails, not one serving request.';
  const ids=searchCatalog(catalog,query,{limit:20}).results.map(item=>item.id);
  assert.ok(['diagnostic-statistical-model-inference','eternities-athena'].includes(ids[0]),ids.join(', '));
  const athena=ids.indexOf('eternities-athena'),atlas=ids.indexOf('eternities-atlas');
  assert.ok(athena>=0&&(atlas<0||athena<atlas));
  const interatomic=ids.indexOf('interatomic-model-validation');
  assert.ok(interatomic<0||interatomic>0,'Materials validation must not displace causal appraisal');
});

test('material-specific validation still discovers the interatomic owner',()=>{
  const query='Evaluate a learned interatomic potential for a declared material phase surface and check energy force stress errors';
  assert.equal(searchCatalog(catalog,query,{limit:3}).results[0]?.id,'interatomic-model-validation');
});
