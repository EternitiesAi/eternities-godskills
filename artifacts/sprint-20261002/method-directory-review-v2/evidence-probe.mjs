import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cp, mkdtemp, readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const outputRoot = dirname(fileURLToPath(import.meta.url));
const root = dirname(dirname(dirname(outputRoot)));
const previousRoot = join(dirname(outputRoot), 'method-directory-review-v1');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const slash = path => path.replaceAll('\\', '/');
async function binding(path) {
  const bytes = await readFile(path);
  return { path: slash(relative(root, path)), bytes: bytes.length, sha256: sha(bytes) };
}
async function unchanged(item) {
  const actual = await binding(item.path);
  assert.equal(actual.sha256, item.sha256, `Changed frozen input: ${item.path}`);
  assert.equal(actual.bytes, item.bytes);
  return actual;
}

const previousBytes = await readFile(join(previousRoot, 'receipt.json'));
assert.equal(sha(previousBytes), 'f832df30650d29f0916fa81a89fad3e343dcb05f7f72b05b31093222d3465fa7');
const previous = JSON.parse(previousBytes);
const historicalBindings = [await binding(join(previousRoot, 'receipt.json'))];
for (const item of previous.artifactBindings) {
  const actual = await binding(join(previousRoot, item.path));
  assert.equal(actual.sha256, item.sha256);
  assert.equal(actual.bytes, item.bytes);
  historicalBindings.push(actual);
}
const frozenInputBindings = [];
for (const item of previous.frozenInputBindings) {
  if (item.relativePath === 'product/README.md') {
    const actual = await binding(item.path);
    assert.equal(actual.sha256, '2b17c2ed8047c94407038bf815244b88b13b8773dd60f69ca607b8be0ef50d2f');
    frozenInputBindings.push(actual);
  } else frozenInputBindings.push(await unchanged(item));
}
const supportingEvidenceBindings = [];
for (const item of previous.supportingEvidenceBindings) supportingEvidenceBindings.push(await unchanged(item));

const oldReadmePath = join(previousRoot, 'run-r9wIW7', 'portable pack', 'README.md');
const oldReadme = await readFile(oldReadmePath, 'utf8');
assert.equal(sha(Buffer.from(oldReadme)), previous.frozenInputBindings.find(x => x.relativePath === 'product/README.md').sha256);
const readme = await readFile(join(root, 'product', 'README.md'), 'utf8');
const removed = 'CLI and release manifest. No source warehouse or development artifacts enter\nthe archive. Stored entries and fixed timestamps make identical pack bytes';
const added = 'CLI and release manifest. Selected historical method-review receipts, reports\nand bounded supporting data are included as optional evidence. The source\nwarehouse and the rest of the development checkout are not included. Stored\nentries and fixed timestamps make identical pack bytes';
assert.ok(oldReadme.includes(removed));
assert.equal(readme, oldReadme.replace(removed, added), 'README changed beyond MD1 repair');

const contextPaths = ['product/catalog.json', 'product/release.json', 'product/INDEX.md'];
const observedContextBindings = await Promise.all(contextPaths.map(path => binding(join(root, path))));
const expectedRelease = JSON.parse(await readFile(join(root, 'product', 'release.json'), 'utf8'));
assert.equal(expectedRelease.releaseId, '2260b471f889f5c25b772fc50d4e83566fe8a4ef28a7748674241c8e80ffc348');
assert.equal(expectedRelease.skillCount, 68);
assert.equal(Object.keys(expectedRelease.files).length, 205);
const reviewPayloads = Object.keys(expectedRelease.files).filter(path => path.startsWith('evidence/method-reviews/'));
assert.deepEqual(reviewPayloads, previous.findings[0].contradictingDeclaredPayloads);
assert.ok(!Object.keys(expectedRelease.files).some(path => path.startsWith('artifacts/') || path.includes('warehouse')));

const fixtureRoot = await mkdtemp(join(outputRoot, 'run-'));
const pack = join(fixtureRoot, 'portable pack');
await cp(join(root, 'product'), pack, { recursive: true, errorOnExist: true, force: false });
const { buildProduct, verifyProduct } = await import(pathToFileURL(join(pack, 'lib/product.mjs')).href);
const { inspectMethodDirectory, renderMethodDirectory } = await import(pathToFileURL(join(pack, 'lib/method-directory.mjs')).href);
const verified = await verifyProduct(pack);
assert.deepEqual(verified, expectedRelease);
const catalog = JSON.parse(await readFile(join(pack, 'catalog.json'), 'utf8'));
const data = await inspectMethodDirectory(pack, catalog);
assert.equal(await readFile(join(pack, 'METHODS.v1.md'), 'utf8'), renderMethodDirectory(data));
const rebuilt = await buildProduct(pack);
// inventory() deliberately returns a null-prototype dictionary; compare the
// actual JSON value and persisted bytes, not that in-memory prototype.
assert.deepEqual(JSON.parse(JSON.stringify(rebuilt)), expectedRelease);
assert.equal(await readFile(join(pack, 'release.json'), 'utf8'), await readFile(join(root, 'product', 'release.json'), 'utf8'));
assert.deepEqual(await verifyProduct(pack), expectedRelease);
const cli = spawnSync(process.execPath, ['bin/godskills.mjs', 'validate'], {
  cwd: pack, env: { ...process.env, PATH: '' }, encoding: 'utf8', timeout: 30000
});
assert.equal(cli.status, 0, cli.stderr);
const cliResult = JSON.parse(cli.stdout);
assert.equal(cliResult.releaseId, expectedRelease.releaseId);
assert.equal(cliResult.skillCount, 68);

for (const item of [...frozenInputBindings, ...supportingEvidenceBindings, ...observedContextBindings, ...historicalBindings]) {
  assert.equal((await binding(join(root, item.path))).sha256, item.sha256, `Changed during review: ${item.path}`);
}
process.stdout.write(JSON.stringify({
  schema: 'godskills.method-directory-repair-review-evidence/v2',
  checkedAtUtc: new Date().toISOString(),
  frozenInputBindings, supportingEvidenceBindings, observedContextBindings, historicalBindings,
  readmeDelta: { oldReadmeBinding: await binding(oldReadmePath), removed, added, onlyMD1Repair: true },
  checks: {
    unchangedDirectoryAndTestInputs: 5, unchangedSupportingBindings: 11,
    previousReceiptAndArtifactsUnchanged: true, reviewPayloads,
    copiedValidation: 'passed', generatedDirectoryExact: true,
    copiedBuildReproducesEntireManifest: true, minimalEnvironmentCli: { exitCode: cli.status, ...cliResult },
    releaseId: expectedRelease.releaseId, skillCount: 68, payloadFiles: 205,
    methodRows: data.methods.length,
    freshFixtureProbes: 0, testsRerun: 0, fullSuiteRun: false, exportRerun: false
  },
  fixturePath: slash(relative(outputRoot, pack)),
  inheritedChecksOnly: 'V1 focused 6 and selected existing 9 tests, nine refusal probes, caller navigation and exclusion checks are not rerun or expanded.',
  probeSetupCorrection: 'First attempt reached rebuild but compared a null-prototype in-memory inventory to a JSON-parsed ordinary object. Only that reviewer assertion was corrected; entire serialized manifest and raw persisted release bytes are now compared. This was not a product defect or an adversarial red.',
  limitations: ['Same-host product-only copy, not a fresh OS.', 'No new method-body approval, runtime, performance, authenticity, rights, source-obligation or whole-product certification.']
}, null, 2) + '\n');
