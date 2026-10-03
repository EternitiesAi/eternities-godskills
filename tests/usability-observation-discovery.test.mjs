import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';
import {lexicalQueryEvidence} from '../product/lib/discovery.mjs';
const catalog=JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));
const target='user-research-and-usability-study';
const profile='usability observation synthesis';
// W4 exposed a real shortlist defect in the earlier caller check. It and these
// parent-authored variations are now DEVELOPMENT examples, not held-out tests.
const cases=[
 'Summarize these fictional checkout observations and recommend a follow-up: four of five participants completed checkout; three hesitated at the delivery-fee step; two missed Continue because a sticky banner covered it at 360px width; one screen-reader user said the fee label was announced after the button. Separate observations from interpretation and do not claim prevalence.',
 'Synthesize the prototype observations: participants struggled with the signup form. Recommend a follow-up without claiming prevalence.',
 'Summarize observed task completion on the library website, keeping findings separate from interpretation and noting participant assistance.',
 'Recommend the next usability study from these observations: two users missed the button in the checkout flow and one hesitated at the fee.',
];
for(const query of cases)test(`corroborated usability observations rank their method first: ${query}`,()=>{
 const result=searchCatalog(catalog,query,{need:'specialist',limit:3});
 assert.equal(result.results[0]?.id,target,result.results.map(x=>x.id).join(', '));
 assert(result.results[0].reasons.some(x=>x.includes(profile)));
 assert.equal(result.selection.state,'review-required');
 assert.equal(result.activation,'none');
});

for(const query of[
 'Summarize the checkout revenue table and recommend next quarter targets.',
 'Participants completed a clinical treatment study; summarize observations and recommend a follow-up page for the report.',
 'Users attended lunch; summarize the observations and recommend a restaurant.',
 'Implement the checkout button based on the approved interface specification.',
 'Do not summarize the usability observations; only correct the spelling in this note.',
])test(`incidental, excluded or missing task cues do not create a usability profile: ${query}`,()=>{
 assert(!lexicalQueryEvidence(query).intents.some(x=>x.name===profile));
});

test('a host-owned no-need decision still returns no candidates for usability vocabulary',()=>{
 assert.deepEqual(searchCatalog(catalog,cases[0],{need:'none'}).results,[]);
});

test('the usability bonus follows matching metadata and respects filters, not a named ID lookup',()=>{
 const original=catalog.skills.find(x=>x.id===target);
 const renamed={...original,id:'observed-interaction-study',entrypoint:'skills/observed-interaction-study/SKILL.md'};
 const local={...catalog,skills:[renamed]};
 const result=searchCatalog(local,cases[0]);
 assert.equal(result.results[0]?.id,renamed.id);
 assert(result.results[0].reasons.some(x=>x.includes(profile)));
 assert.deepEqual(searchCatalog(local,cases[0],{category:'audio'}).results,[]);
 assert.deepEqual(searchCatalog(local,cases[0],{taskType:'build'}).results,[]);
});
