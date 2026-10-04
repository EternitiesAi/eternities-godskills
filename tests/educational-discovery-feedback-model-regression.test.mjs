import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {lexicalQueryEvidence} from '../product/lib/discovery.mjs';
import {searchCatalog} from '../product/lib/product.mjs';
const catalog=JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));
const owner='evidence-linked-learning-design';
const intent='learner-model explanation';
// The original miss and parent-authored variants are development regressions,
// not unseen independent qualification or proof of arbitrary semantic parsing.
const positives=[
 ['original known educational-model request','design an educational microsimulation to explain a misconception with causal feedback and a hand-checkable model'],
 ['feedback-bearing novice model','Prepare a short educational model with causal feedback so novices can explain a misconception.'],
 ['small-model teaching without an explicit slider','Teach students why congestion emerges with a hand-checkable microsimulation.'],
];
for(const [label,query] of positives)test(label,()=>{
 const result=searchCatalog(catalog,query,{limit:3});
 assert.equal(result.results[0]?.id,owner);
 assert.ok(result.results[0].reasons.some(x=>x.startsWith(`Lexical intent: ${intent};`)));
 assert.equal(result.authority,'none');assert.equal(result.activation,'none');
});
const negatives=[
 ['production model is not teaching','Design a microsimulation with causal feedback to explain errors in a production model; no lesson or learner activity is requested.'],
 ['appraisal of educational claims is not construction','Assess a scientific paper\'s causal feedback microsimulation that claims educational results; do not build a lesson or learner model.'],
 ['quoted filename material is not a request','Rename "educational microsimulation causal feedback explain misconception model" in the code and report the production file inventory.'],
 ['ordinary lesson is not this profile','Prepare an ordinary lesson to teach students why conservation matters using a static paragraph.'],
];
for(const [label,query] of negatives)test(label,()=>assert.ok(!lexicalQueryEvidence(query).intents.some(x=>x.name===intent)));
test('original request cannot override explicit no-need authority',()=>{
 const result=searchCatalog(catalog,positives[0][1],{need:'none'});
 assert.deepEqual(result.results,[]);assert.equal(result.selection.state,'abstain');
 assert.equal(result.authority,'none');assert.equal(result.activation,'none');
});
