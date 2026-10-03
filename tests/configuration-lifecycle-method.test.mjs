import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../product/',import.meta.url));
const owner='eternities-daedalus';
const resource='references/configuration-lifecycle.md';
const productPath=`skills/${owner}/${resource}`;
const json=async p=>JSON.parse(await readFile(join(root,p),'utf8'));
const text=async p=>readFile(join(root,p),'utf8');
const hash=b=>createHash('sha256').update(b).digest('hex');

test('configuration lifecycle is a packaged optional owner reference, not a new top-level skill',async()=>{
 const metadata=await json(`skills/${owner}/skill.json`);
 assert(metadata.resources.includes(resource));
 const catalog=await json('catalog.json');
 assert.equal(catalog.skills.length,77);
 const entry=catalog.skills.find(s=>s.id===owner);
 const declared=entry.resources.find(r=>r.path===productPath);
 assert(declared,'catalog exposes the selected resource');
 const bytes=await readFile(join(root,productPath));
 assert.equal(declared.sha256,hash(bytes));
 const release=await json('release.json');
 assert.equal(release.files[productPath],hash(bytes));
});

test('Daedalus offers the configuration reference only for the matching durable-consumer task',async()=>{
 const entry=await text(`skills/${owner}/SKILL.md`);
 assert.match(entry,/configuration-lifecycle\.md/);
 assert.match(entry,/existing durable objects|persisted consumers/i);
 assert.match(entry,/only (?:when|for)|conditional/i);
});

test('configuration method preserves separate resolution, lifetime, capability and identity proof boundaries',async()=>{
 const method=await text(productPath);
 assert.match(method,/Equal stored values do not reveal origin/i);
 assert.match(method,/cache.*restart.*refresh/is);
 assert.match(method,/parseable.*ineffective.*not working/is);
 assert.match(method,/retained storage.*reachable history/is);
 assert.match(method,/not needed.*standalone constant/is);
 assert.match(method,/collision.*split\/merge.*history.*access.*replay.*reversal/is);
 assert.match(method,/stored values.*resolved consumer behavior/is);
 assert.doesNotMatch(method,/C:\\|D:\\|C:\/Users\/|D:\/03-ARSENAL\//);
});
