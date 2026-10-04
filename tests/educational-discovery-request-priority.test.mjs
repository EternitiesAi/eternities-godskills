import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';
import {lexicalQueryEvidence} from '../product/lib/discovery.mjs';

const catalog=JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));
const query='Give a language class movable sentence strips. Students rearrange the subject, verb and object, read the resulting sentence, and account for how the order changes who did what to whom.';
const owner=catalog.skills.find(x=>x.id==='evidence-linked-learning-design');
const schemaOwner=catalog.skills.find(x=>x.id==='structured-output-contracts');

// This is a revealed v4 failure, not an unseen evaluation. Its learning intent
// is recognized already, but incidental schema words beat the fixed bonus.
test('corroborated requested teaching activity precedes incidental higher keyword score',()=>{
  const result=searchCatalog(catalog,query,{limit:20});
  const learning=result.results.find(x=>x.id===owner.id);
  const schema=result.results.find(x=>x.id===schemaOwner.id);
  assert.ok(schema.score>learning.score,'control must retain the demonstrated score collision');
  assert.equal(result.results[0].id,owner.id);
  assert.ok(learning.reasons.some(x=>x.includes('learner-model explanation')));
  assert.equal(result.authority,'none');assert.equal(result.activation,'none');
  assert.equal(result.selection.state,'review-required');
});

test('request priority follows actual matching metadata, not a skill identifier',()=>{
  const renamed={...owner,id:'renamed-learning-owner',entrypoint:'skills/renamed-learning-owner/SKILL.md'};
  const local={...catalog,skills:catalog.skills.map(x=>x.id===owner.id?renamed:x)};
  const result=searchCatalog(local,query,{limit:3});
  assert.equal(result.results[0].id,renamed.id);
});

test('same identifier without corroborating owner metadata receives no priority',()=>{
  const decoy={...owner,summary:schemaOwner.summary,triggers:schemaOwner.triggers};
  const local={...catalog,skills:catalog.skills.map(x=>x.id===owner.id?decoy:x)};
  const result=searchCatalog(local,query,{limit:20});
  const candidate=result.results.find(x=>x.id===owner.id);
  assert.ok(!candidate.reasons.some(x=>x.includes('learner-model explanation')));
  assert.ok(result.results.every((x,i)=>i===0||result.results[i-1].score>=x.score));
});

test('equal-priority equal-score candidates still use deterministic identifier tie breaking',()=>{
  const copies=['z-learning-owner','a-learning-owner'].map(id=>({...owner,id,entrypoint:`skills/${id}/SKILL.md`}));
  const local={...catalog,skills:copies};
  const result=searchCatalog(local,query);
  assert.equal(result.results[0].score,result.results[1].score);
  assert.deepEqual(result.results.map(x=>x.id),['a-learning-owner','z-learning-owner']);
  assert.deepEqual(result,searchCatalog({...local,skills:[...copies].reverse()},query));
});

test('priority cannot bypass host no-need, category, task or anti-trigger exclusions',()=>{
  assert.deepEqual(searchCatalog(catalog,query,{need:'none'}).results,[]);
  for(const options of [{category:'audio'},{taskType:'recover'}]){
    assert.ok(!searchCatalog(catalog,query,{...options,limit:20}).results.some(x=>x.id===owner.id));
  }
  const blocked={...owner,antiTriggers:['movable sentence strips']};
  const local={...catalog,skills:catalog.skills.map(x=>x.id===owner.id?blocked:x)};
  assert.ok(!searchCatalog(local,query,{limit:20}).results.some(x=>x.id===owner.id));
});

// These are disclosed independent code-review probes, not fresh held-out cases.
test('rather-than refusal remains intact through clause preparation',()=>{
  const refused='Rather than prepare a lesson to explain why pressure changes using an adjustable model, summarize the status.';
  assert.ok(!lexicalQueryEvidence(refused).intents.some(x=>x.name==='learner-model explanation'));
});

test('ordinary refusal remains negative while a genuinely affirmative request remains eligible',()=>{
  const topic='a lesson to explain why pressure changes using an adjustable model';
  assert.ok(!lexicalQueryEvidence(`Do not prepare ${topic}; summarize the status.`).intents.some(x=>x.name==='learner-model explanation'));
  assert.ok(lexicalQueryEvidence(`Prepare ${topic}.`).intents.some(x=>x.name==='learner-model explanation'));
});

test('rather-than refusal followed by a separate affirmative request retains only the live teaching request',()=>{
  const live='Rather than prepare a lesson about file formats, summarize the status; instead, prepare a lesson to explain why pressure changes using an adjustable model.';
  assert.ok(lexicalQueryEvidence(live).intents.some(x=>x.name==='learner-model explanation'));
  assert.equal(searchCatalog(catalog,live).results[0].id,owner.id);
});
