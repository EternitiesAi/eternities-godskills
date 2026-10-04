import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildProduct, verifyProduct} from '../product/lib/product.mjs';

// Break caught: accepting an ambiguous/empty frontmatter value lets native
// loaders see a different skill identity or no useful description although
// the portable builder claims a verified, discoverable pack.
async function pack(header) {
  const root=await mkdtemp(join(tmpdir(),'godskills-frontmatter-'));
  await mkdir(join(root,'skills/example'),{recursive:true});
  await writeFile(join(root,'skills/example/SKILL.md'),`---\n${header}\n---\n\n# Example\nUse the supplied comparison method.\n`);
  await writeFile(join(root,'skills/example/skill.json'),JSON.stringify({
    id:'example',category:'science',summary:'Compare supplied evidence',
    triggers:['compare evidence'],antiTriggers:[],taskTypes:['verify'],
    related:[],resources:[],maturity:'instruction-reviewed',
    provenance:[{kind:'original',source:'test fixture',note:'Not performance evidence'}]}));
  return root;
}

for(const [kind,header] of [
  ['empty description','name: example\ndescription:\ncategory: science'],
  ['duplicate description','name: example\ndescription: Compare evidence\ndescription: Unrelated instruction'],
  ['duplicate name','name: example\nname: elsewhere\ndescription: Compare evidence'],
  ['empty folded description','name: example\ndescription: >-\ncategory: science'],
  ['boolean description','name: example\ndescription: true'],
  ['commented boolean description','name: example\ndescription: true # not a string'],
  ['commented null description','name: example\ndescription: null # not a string'],
  ['alias description','name: example\ndescription: *unknown'],
  ['object description','name: example\ndescription: {wrong: value}'],
  ['tagged description','name: example\ndescription: !!str Compare evidence'],
  ['plain continuation','name: example\ndescription: Compare\n  extra undisclosed detail'],
  ['unclosed quotation','name: example\ndescription: "Compare evidence'],
  ['double-quoted name duplicate','name: example\n"name": elsewhere\ndescription: Compare evidence'],
  ['single-quoted name duplicate',"name: example\n'name': elsewhere\ndescription: Compare evidence"],
  ['double-quoted description duplicate','name: example\ndescription: Compare evidence\n"description": Unrelated'],
  ['single-quoted description duplicate',"name: example\ndescription: Compare evidence\n'description': Unrelated"],
  ['hexadecimal description','name: example\ndescription: 0x10'],
  ['exponent description','name: example\ndescription: 1e3'],
  ['nonfinite description','name: example\ndescription: .nan'],
  ['legacy boolean description','name: example\ndescription: yes'],
  ['colon-space plain description','name: example\ndescription: Compare: evidence'],
  ['double-quoted continuation','name: example\ndescription: "Compare evidence"\n  unexpected continuation'],
  ['single-quoted continuation',"name: example\ndescription: 'Compare evidence'\n  unexpected continuation"],
  ['unconsumed root content','name: example\ndescription: Compare evidence\nunexpected content'],
  ['merge-key metadata','name: example\ndescription: Compare evidence\n<<: *unknown'],
  ['inconsistent block indentation','name: example\ndescription: >\n    Compare evidence\n  invalid indentation'],
]) test(`pack build refuses ${kind} instead of manufacturing discoverability`,async()=>{
  await assert.rejects(buildProduct(await pack(header)),/frontmatter|description/i);
});

for(const header of [
  'name: example\ndescription: Compare evidence',
  'name: "example"\ndescription: "Compare evidence"',
  'name: "example" # identity\ndescription: "Compare evidence" # purpose',
  "name: 'example'\ndescription: 'Compare evidence'",
  'name: example\ndescription: >-\n  Compare evidence\n  across supplied studies.',
  'name: example\ndescription: |\n  Compare evidence\n  across supplied studies.',
  'name: example\ndescription: Compare C# evidence # metadata comment',
  'name: example\ndescription: "Compare: evidence"',
  'name: example\ndescription: >\n  Compare evidence\n    with a nested example\ncategory: science',
  'name: example\ndescription: "Compare evidence"\nmetadata:\n  category: science',
]) test('plain, quoted and meaningful block descriptions remain portable',async()=>{
  const root=await pack(header); await buildProduct(root);
  assert.equal((await verifyProduct(root)).skillCount,1);
  const catalog=JSON.parse(await readFile(join(root,'catalog.json'),'utf8'));
  assert.equal(catalog.skills[0].id,'example');
});
