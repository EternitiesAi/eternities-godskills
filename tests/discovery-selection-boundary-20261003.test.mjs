import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';
const catalog=JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));

// Development regressions after the frozen v1 evaluation exposed over-selection.
// These are not a fresh held-out evaluation of the repair.
for(const query of [
  'What is 17 plus 26? Give only the number.',
  'Calculate 8 multiplied by 4. Only the result.',
  'Lowercase the literal text RIVER ROOM. No rewrite, interpretation, or additional process.',
  'Uppercase the string quiet garden. Give only the text.',
  "In the phrase 'the river remembers', is remembers a verb? Just answer the grammar question.",
  'Help with recovery. Ask one clarifying question before selecting a specialist.',
  "My accountant called the office a 'memory palace'. Explain the metaphor in one sentence; there is no software memory or archive task.",
  "Count the words in the exact sentence 'The voice crossed the river'. Give only the count; no voice analysis, audio work, or workshop design.",
])test(`explicit limited task does not acquire a workflow: ${query}`,()=>{
  const result=searchCatalog(catalog,query,{limit:3});
  assert.deepEqual(result.results,[]);
  assert.equal(result.authority,'none');assert.equal(result.activation,'none');
  assert.match(result.abstentionReason,/explicit|clarification/);
});

for(const query of [
  'Build a word count service with multilingual tokenization and source-bound validation.',
  'Design a lowercase transformation pipeline that preserves identifiers and checks its output contract.',
  'Implement a parser that determines whether tokens are verbs and verify its grammar rules.',
  'Audit an API integration that returns only the number but corrupts invoice totals.',
  'Write a public update in my own voice using these samples.',
])test(`a real workflow is not hidden by a literal micro-task word: ${query}`,()=>{
  const result=searchCatalog(catalog,query,{limit:3});
  assert.ok(result.results.length>0);
  assert.equal(result.abstentionReason,undefined);
});

test('all exact catalog IDs remain addressable',()=>{
  for(const item of catalog.skills)assert.equal(searchCatalog(catalog,item.id,{limit:1}).results[0]?.id,item.id);
});

for(const literal of ['"compare requirements"',"'AUDIT OBLIGATIONS'",'`design a service`'])test(`quoted casing input is data, not an active workflow: ${literal}`,()=>{
  assert.deepEqual(searchCatalog(catalog,`Uppercase the literal text ${literal}. Give only the text.`,{limit:3}).results,[]);
});

test('an affirmative workflow outside a literal remains discoverable',()=>{
  assert.ok(searchCatalog(catalog,'Audit obligations across documents; the quoted input is "count the words". Give only the findings.',{limit:3}).results.length>0);
});

for(const query of [
  'Audit obligations across documents and count the words; give only the findings.',
  'Audit the obligations across documents and count the words; give only the findings.',
  'Compare requirements across documents; the quoted checklist says "count the words". Give only the audit findings.',
])test(`a concise audit is not mistaken for its incidental counting substep: ${query}`,()=>{
  assert.equal(searchCatalog(catalog,query,{limit:3}).results[0]?.id,'completeness-and-consistency-audit');
});
