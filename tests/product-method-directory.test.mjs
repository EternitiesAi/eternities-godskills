import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, cp, unlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {buildProduct, verifyProduct} from '../product/lib/product.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'godskills-method-directory-'));
  const owner = join(root, 'skills', 'example-owner');
  await mkdir(join(owner, 'references'), {recursive: true});
  await writeFile(join(owner, 'SKILL.md'), '---\nname: example-owner\ndescription: Example bounded method owner.\n---\n\n# Example\n');
  const body = '# Example method (DRAFT)\n\nUse only for the declared question.\n';
  await writeFile(join(owner, 'references', 'method.md'), body);
  await writeFile(join(owner, 'skill.json'), JSON.stringify({id: 'example-owner', category: 'engineering', summary: 'Example owner', triggers: ['example'], antiTriggers: [], taskTypes: ['plan'], related: [], resources: ['references/method.md'], maturity: 'instruction-reviewed', provenance: [{kind: 'original', source: 'fixture', note: 'Synthetic'}]}));
  const data = {schema: 'eternities-godskills-method-directory-v1', authority: 'none', activation: 'none', coverage: 'selected-bundled-methods', methods: [{id: 'example-method', title: 'Example method', owner: 'example-owner', resource: 'skills/example-owner/references/method.md', resourceSha256: hash(body), tasks: ['Plan the example boundary'], exclusions: ['Not every engineering question'], documentStatus: 'not-assessed-by-this-overlay', executionEvidence: 'No method execution is asserted by this fixture.', outcomeStatus: 'not-performance-qualified'}]};
  await writeFile(join(root, 'METHODS.v1.json'), JSON.stringify(data));
  return {root, data, body};
}
const save = ({root, data}) => writeFile(join(root, 'METHODS.v1.json'), JSON.stringify(data));

test('selected method directory is portable, lazy, linked and reproducible', async () => {
  const f = await fixture();
  const release = await buildProduct(f.root);
  const md = await readFile(join(f.root, 'METHODS.v1.md'), 'utf8');
  assert.match(md, /selected bundled methods/i);
  assert.match(md, /Read the selected complete SKILL\.md/);
  assert.match(md, /skills\/example-owner\/SKILL\.md/);
  assert.match(md, /skills\/example-owner\/references\/method\.md/);
  assert.match(md, /not-performance-qualified/);
  assert.match(await readFile(join(f.root, 'INDEX.md'), 'utf8'), /METHODS\.v1\.md/);
  assert.equal((await verifyProduct(f.root)).releaseId, release.releaseId);
  const copy = f.root + '-copy';
  await cp(f.root, copy, {recursive: true});
  assert.equal((await buildProduct(copy)).releaseId, release.releaseId);
});

test('method status refuses a stale resource even if a rebuild would bless new pack bytes', async () => {
  const f = await fixture();
  await buildProduct(f.root);
  await writeFile(join(f.root, f.data.methods[0].resource), f.body + 'Changed.\n');
  await assert.rejects(buildProduct(f.root), /Stale method resource/);
});

test('method directory rejects undeclared resources, unsafe links, duplicates and unsupported outcome claims', async () => {
  for (const change of [
    data => {data.methods[0].resource = 'skills/example-owner/SKILL.md';},
    data => {data.methods[0].resource = '../outside.md';},
    data => {data.methods.push({...data.methods[0]});},
    data => {data.methods[0].outcomeStatus = 'production-ready';},
    data => {data.authority = 'granted';},
    data => {data.methods[0].documentStatus = 'independently-document-reviewed';},
  ]) {
    const f = await fixture(); change(f.data); await save(f);
    await assert.rejects(buildProduct(f.root), /method directory|Method|method resource/i);
  }
});

test('document-reviewed status binds bundled independent receipt and report bytes', async () => {
  const f = await fixture();
  await mkdir(join(f.root, 'evidence', 'method-reviews'), {recursive: true});
  const receipt = JSON.stringify({verdict: 'READY', scope: 'Synthetic document fixture, not real independent review', method: {path: 'product/' + f.data.methods[0].resource, sha256: hash(f.body)}}) + '\n';
  const report = '# Synthetic review fixture\nNot real review evidence.\n';
  await writeFile(join(f.root, 'evidence/method-reviews/example.receipt.json'), receipt);
  await writeFile(join(f.root, 'evidence/method-reviews/example.review.md'), report);
  Object.assign(f.data.methods[0], {documentStatus: 'independently-document-reviewed', review: {scope: 'Synthetic fixture only', receipt: 'evidence/method-reviews/example.receipt.json', receiptSha256: hash(receipt), report: 'evidence/method-reviews/example.review.md', reportSha256: hash(report), resourceBinding: {pathPointer: '/method/path', sha256Pointer: '/method/sha256'}}});
  await save(f); await buildProduct(f.root);
  await writeFile(join(f.root, f.data.methods[0].review.report), report + 'Changed.\n');
  await assert.rejects(buildProduct(f.root), /Stale method review/);
});

test('removing method metadata cannot leave an apparently current generated directory', async () => {
  const f = await fixture(); await buildProduct(f.root);
  await unlink(join(f.root, 'METHODS.v1.json'));
  await assert.rejects(buildProduct(f.root), /Method directory metadata missing/);
});

test('a current resource hash cannot transfer an old document review to changed bytes', async () => {
  const f = await fixture();
  await mkdir(join(f.root, 'evidence/method-reviews'), {recursive: true});
  const receipt = JSON.stringify({method: {path: 'product/' + f.data.methods[0].resource, sha256: hash(f.body)}});
  const report = 'Synthetic review fixture, not actual evidence.\n';
  await writeFile(join(f.root, 'evidence/method-reviews/example.receipt.json'), receipt);
  await writeFile(join(f.root, 'evidence/method-reviews/example.review.md'), report);
  Object.assign(f.data.methods[0], {documentStatus: 'independently-document-reviewed', review: {scope: 'Synthetic fixture only', receipt: 'evidence/method-reviews/example.receipt.json', receiptSha256: hash(receipt), report: 'evidence/method-reviews/example.review.md', reportSha256: hash(report), resourceBinding: {pathPointer: '/method/path', sha256Pointer: '/method/sha256'}}});
  await save(f); await buildProduct(f.root);
  const changed = f.body + 'New scope.\n';
  await writeFile(join(f.root, f.data.methods[0].resource), changed);
  f.data.methods[0].resourceSha256 = hash(changed); await save(f);
  await assert.rejects(buildProduct(f.root), /Stale method review binding/);
});
