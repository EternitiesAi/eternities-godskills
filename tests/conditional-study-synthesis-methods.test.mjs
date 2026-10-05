import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../product/',import.meta.url));
const text=p=>readFile(join(root,p),'utf8');
const json=async p=>JSON.parse(await text(p));
const additions=[
 ['user-research-and-usability-study','references/accessible-user-study.md','accessible user study'],
 ['eternities-logos','references/staged-literature-synthesis.md','staged literature synthesis']
];
for(const [owner,resource,label] of additions){
 test(`${label} is conditional within its existing owner, not a new entrypoint`,async()=>{
  const meta=await json(`skills/${owner}/skill.json`),catalog=await json('catalog.json');
  assert(meta.resources.includes(resource));
  assert((await text(`skills/${owner}/SKILL.md`)).includes(`[${label}](${resource})`));
  // Pack-wide membership is owned by the exact admitted-ID regression. This
  // test rejects promotion of these conditional references into entrypoints.
  assert(!catalog.skills.some(x=>['accessible-user-study','staged-literature-synthesis'].includes(x.id)));
  assert(catalog.skills.find(x=>x.id===owner).resources.some(x=>x.path===`skills/${owner}/${resource}`));
  assert(!catalog.skills.some(x=>x.entrypoint===`skills/${owner}/${resource}`));
 });
}
test('accessible study guidance retains stop/data disposition, assistance and missing-context boundaries',async()=>{
 const body=await text('skills/user-research-and-usability-study/references/accessible-user-study.md');
 assert.equal(createHash('sha256').update(body).digest('hex'),'a2d5726407966adc2846b21ac9174ee0d21014769a6739a1cd876413fa58de0a');
 for(const phrase of ['Accountable study owner','participant-select','Stopping a session is not deciding the fate of earlier data','DATA_USE_HOLD','not attempted','Qualitative recurrence is not a population percentage','Two tiny fictional examples'])assert(body.includes(phrase),phrase);
 assert(!/[A-Z]:[\\/]/.test(body));
});
test('staged synthesis retains read scope, dependence, anchored versions and reverse counterevidence checks',async()=>{
 const body=await text('skills/eternities-logos/references/staged-literature-synthesis.md');
 assert.equal(createHash('sha256').update(body).digest('hex'),'ce55918cf0966beab0c4103a8cc2de69c517c7581c22320bfa2009d86b145c78');
 for(const phrase of ['locator','secondary','version','counterevidence','abstract','introduction','conclusion','fictional'])assert(body.includes(phrase),phrase);
 assert(body.includes('does not make the linked contents available'));
 assert(!/[A-Z]:[\\/]/.test(body));
});
test('new method provenance is source-body-specific, nonterminal and not rights clearance',async()=>{
 for(const [owner,resource] of additions){
  const meta=await json(`skills/${owner}/skill.json`);
  const record=meta.provenance.find(x=>x.kind==='conditional-method-review'&&x.note.includes(resource));
  assert(record,resource);assert(record.note.includes('nonterminal'));assert(record.note.includes('rights'));
 }
});
