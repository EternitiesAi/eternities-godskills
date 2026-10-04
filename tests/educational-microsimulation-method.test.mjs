import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../product/',import.meta.url));
const owner='evidence-linked-learning-design';
const resource='references/educational-microsimulation.md';
const text=async path=>readFile(join(root,path),'utf8');
const json=async path=>JSON.parse(await text(path));
test('educational microsimulation is a declared existing-owner reference, not an overlapping entrypoint',async()=>{
 const meta=await json(`skills/${owner}/skill.json`),catalog=await json('catalog.json');
 assert(meta.resources.includes(resource));
 assert.equal(catalog.skills.filter(x=>x.id===owner).length,1);
 const entry=catalog.skills.find(x=>x.id===owner);
 assert(entry.resources.some(x=>x.path===`skills/${owner}/${resource}`));
 assert(!catalog.skills.some(x=>x.entrypoint===`skills/${owner}/${resource}`));
});
test('the entrypoint makes the model method conditional and preserves ordinary lesson routing',async()=>{
 const body=await text(`skills/${owner}/SKILL.md`);
 assert(body.includes('[educational microsimulation](references/educational-microsimulation.md)'));
 assert(body.includes('Do not load it for ordinary lesson plans or reporting'));
 assert(body.includes('[handoffs and reporting](references/handoffs-and-reporting.md)'));
});
test('bundled guidance retains the repaired model, probability and evidence boundaries',async()=>{
 const body=await text(`skills/${owner}/${resource}`);
 for(const phrase of ['Coupled updates','Invariants','complete next state','independently derived oracle','separately from seed replay','paper expectations, not executed checks','not evidence of learning efficacy','data collection off by default'])assert(body.includes(phrase),phrase);
 assert(!/[CD]:[\\/]/.test(body),'no author workstation path');
});
test('source provenance stays body-specific and explicitly nonterminal',async()=>{
 const meta=await json(`skills/${owner}/skill.json`);
 const p=meta.provenance.find(x=>x.source.includes('microsim-generator/SKILL.md'));
 assert(p);assert(p.note.includes('02f5da41751f7368757462e025de78ab0fb33b7a441cfc0b5d2bb43c3178789b'));
 assert(p.note.includes('unreviewed'));assert(p.note.includes('nonterminal'));
});
