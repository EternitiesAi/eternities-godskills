// Bounded regression probes for the v1 findings; generated local fixtures only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = 'C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003';
const op = 'C:/Users/Dom/.codex/operations/godskills-executable-examples-20261016';
const review = path.dirname(fileURLToPath(import.meta.url));
const scratch = fs.mkdtempSync(path.join(review, 'fixture-'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const approved = 'a'.repeat(64), other = 'b'.repeat(64);
const sources = {
  relocated: [`${op}/verify-relocated.mjs`, '3bd2b054eb627a1729d0d53aa2ca4683dfd10200dd475ac4028f744fc5f85ad9'],
  runCheck: [`${op}/run-check.mjs`, '7e648e32587c6c4761f99079e88963f35b2daea933e0d533efe5348f8a38ca95'],
  portability: [`${repo}/tests/executable-examples-portability.test.mjs`, 'e8783e3257cd44b062c55cb55f6b9be52b36ebbd8281dc93bcc5cc8eaf019cf7'],
  delivery: [`${op}/delivery.mjs`, '81471c67ff272477d1e026ec48680d055749e78f2897b0ab6ea40bcd9707f032'],
};
function source(key) {
  const [file, digest] = sources[key];
  const bytes = fs.readFileSync(file);
  assert.equal(hash(bytes), digest, `Reviewed source changed: ${file}`);
  return bytes.toString('utf8');
}
function put(file, text, overwrite = false) {
  assert(path.resolve(file).startsWith(path.resolve(scratch) + path.sep));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, { flag: overwrite ? 'w' : 'wx' });
}
function replaceOnce(text, from, to) {
  assert.equal(text.split(from).length, 2, `Expected one replacement: ${from}`);
  return text.replace(from, to);
}
const runs = [];
function run(label, args, expectedStatus, requiredDiagnostic, options = {}) {
  const result = spawnSync(process.execPath, args, {
    cwd: scratch, encoding: 'utf8', timeout: 60000, windowsHide: true, ...options,
  });
  const output = (result.stdout ?? '') + (result.stderr ?? '');
  put(path.join(scratch, `${label}.log`), output);
  assert.equal(result.status, expectedStatus, `${label}: ${result.error?.message ?? ''}\n${output}`);
  if (requiredDiagnostic) assert.match(output, requiredDiagnostic, label);
  const receipt = { label, processExitCode: result.status, error: result.error?.message ?? null,
    requiredDiagnostic: requiredDiagnostic?.source ?? null, outputSha256: hash(output) };
  runs.push(receipt);
  return { ...result, output, receipt };
}
function inventory(base, prefix = '', out = {}) {
  for (const entry of fs.readdirSync(path.join(base, prefix), { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    const rel = prefix + entry.name;
    if (entry.isDirectory()) { out[rel + '/'] = 'directory'; inventory(base, rel + '/', out); }
    else { assert(entry.isFile()); out[rel] = hash(fs.readFileSync(path.join(base, rel))); }
  }
  return out;
}
const frozenFiles = [
  'product/examples/constraint-diagnosis/index.mjs',
  'product/examples/constraint-diagnosis/index.test.mjs',
  'product/examples/constraint-diagnosis/demo.mjs',
  'product/examples/constraint-diagnosis/README.md',
  'artifacts/qualification/executable-examples-20261016/constraint-diagnosis/evidence.json',
  'artifacts/qualification/executable-examples-20261016/constraint-diagnosis/method-use.md',
];
const frozenBefore = Object.fromEntries(frozenFiles.map(p => [p, hash(fs.readFileSync(path.join(repo, p)))]));
const v1Root = path.join(repo, 'artifacts/qualification/executable-examples-20261016/packaging-review-v1');
const v1Before = inventory(v1Root);
const lanes = ['constraint-diagnosis', 'onboarding-cohorts', 'animation-interruptions'];
const simpleTest = "import test from 'node:test'; test('generated fixture only', () => {});\n";

// Relocation: original script, valid third argument in every case, no adapter changes.
const relocatedScript = path.join(scratch, 'verify-relocated.mjs');
put(relocatedScript, source('relocated'));
const relocatedResults = [];
for (const mode of ['clean', 'manifest', 'membership', 'source', 'inside-output', 'wrong-release']) {
  const pack = path.join(scratch, `pack-${mode}`), files = {};
  function packFile(rel, text) { put(path.join(pack, rel), text); files[rel] = hash(Buffer.from(text)); }
  for (const lane of lanes) {
    packFile(`examples/${lane}/demo.mjs`, 'console.log(JSON.stringify({fictional:true}));\n');
    packFile(`examples/${lane}/index.test.mjs`, simpleTest);
    packFile(`examples/${lane}/index.mjs`, 'export const fixture = true;\n');
    packFile(`examples/${lane}/README.md`, 'Generated fixture.\n');
  }
  const mutation = {
    manifest: "release.fixtureChanged = true; fs.writeFileSync(manifest, JSON.stringify(release));",
    membership: "fs.mkdirSync(new URL('../added-empty-directory/', import.meta.url));",
    source: "fs.writeFileSync(new URL('../examples/constraint-diagnosis/index.mjs', import.meta.url), 'export const fixture = false;\\n');",
  }[mode] ?? '';
  packFile('bin/godskills.mjs', `import fs from 'node:fs';
const manifest = new URL('../release.json', import.meta.url);
const release = JSON.parse(fs.readFileSync(manifest));
${mutation}
console.log(JSON.stringify({releaseId:release.releaseId,skillCount:93}));
`);
  put(path.join(pack, 'release.json'), JSON.stringify({ releaseId: approved, files }));
  const output = mode === 'inside-output' ? path.join(pack, 'receipt.json') : path.join(scratch, `relocated-${mode}.json`);
  const diagnostic = {
    manifest: /Pack membership or bytes changed during execution/,
    membership: /Pack membership or bytes changed during execution/,
    source: /examples\/constraint-diagnosis\/index\.mjs/,
    'inside-output': /Output must be outside pack/,
    'wrong-release': /Pack differs from approved candidate/,
  }[mode];
  const result = run(`relocated-${mode}`, [relocatedScript, pack, output, mode === 'wrong-release' ? other : approved], mode === 'clean' ? 0 : 1, diagnostic);
  if (mode === 'clean') {
    const receipt = JSON.parse(fs.readFileSync(output));
    assert.equal(receipt.expectedRelease, approved);
    assert.equal(receipt.sourceChanged, false);
    assert.equal(receipt.filesystemAccessIsolated, false);
    assert.equal(receipt.runs.length, 7);
  } else assert.equal(fs.existsSync(output), false, 'Failed gate must not write a PASS receipt');
  if (mode === 'manifest') assert.equal(JSON.parse(fs.readFileSync(path.join(pack, 'release.json'))).fixtureChanged, true);
  if (mode === 'membership') assert(fs.existsSync(path.join(pack, 'added-empty-directory')));
  if (mode === 'source') assert.equal(fs.readFileSync(path.join(pack, 'examples/constraint-diagnosis/index.mjs'), 'utf8'), 'export const fixture = false;\n');
  relocatedResults.push({ mode, ...result.receipt, passReceiptWritten: mode === 'clean' });
}

// Run-check: all three protected fixture files exist before both runs.
const checkRoot = path.join(scratch, 'run-check', 'repo'), checkOp = path.join(scratch, 'run-check', 'receipts');
for (const dir of ['product', 'tests', 'evaluation', 'examples']) fs.mkdirSync(path.join(checkRoot, dir), { recursive: true });
fs.mkdirSync(checkOp, { recursive: true });
const protectedPaths = ['src/adaptive-activation.mjs', 'policies/adaptive-activation.v1.json', 'artifacts/adaptive-activation/evidence.v1.json'];
for (const p of protectedPaths) put(path.join(checkRoot, p), 'fixture before\n');
put(path.join(checkRoot, 'tests', 'clean.test.mjs'), simpleTest);
put(path.join(checkRoot, 'tests', 'mutate.test.mjs'), `import test from 'node:test'; import fs from 'node:fs';
test('generated protected mutations', () => {
  for (const p of ${JSON.stringify(protectedPaths)}) fs.writeFileSync(new URL('../' + p, import.meta.url), 'fixture after\\n');
});\n`);
let checkSource = replaceOnce(source('runCheck'), `const root='${repo}';`, `const root=${JSON.stringify(checkRoot)};`);
checkSource = replaceOnce(checkSource, `const op='${op}';`, `const op=${JSON.stringify(checkOp)};`);
const checkScript = path.join(scratch, 'run-check.mjs'); put(checkScript, checkSource);
const cleanCheck = JSON.parse(run('run-check-clean', [checkScript, 'fixture-clean', 'tests/clean.test.mjs'], 0).stdout);
assert.equal(cleanCheck.stableSources, true);
const mutatedCheck = JSON.parse(run('run-check-protected', [checkScript, 'fixture-protected', 'tests/mutate.test.mjs'], 2, /"stableSources": false/).stdout);
assert.equal(mutatedCheck.exitCode, 0, 'The fixture test must pass; the source gate must cause process exit 2');
const protectedReceipt = JSON.parse(fs.readFileSync(path.join(checkOp, 'fixture-protected.tap.json')));
for (const p of protectedPaths) assert.notEqual(protectedReceipt.before.protected[p], protectedReceipt.after.protected[p]);

// Portability: genuine hashes pass; one well-shaped but false hash fails equality.
const portableProduct = path.join(scratch, 'portability', 'product'), digests = {};
const helper = path.join(scratch, 'portability', 'checkout-only.mjs');
put(helper, 'export const marker = 7;\n');
const externalImport = `import {marker} from ${JSON.stringify(pathToFileURL(helper).href)};\n`;
put(path.join(portableProduct, 'examples', 'README.md'), 'Generated fixture guide.\n');
for (const lane of lanes) for (const [name, text] of Object.entries({
  'index.mjs': 'export const fixture = true;\n',
  'demo.mjs': externalImport + 'console.log(JSON.stringify({fictional:true, marker}));\n',
  'index.test.mjs': externalImport + "import test from 'node:test'; import assert from 'node:assert/strict'; test('generated dependency', () => assert.equal(marker, 7));\n",
  'README.md': 'Generated fixture documentation.\n',
})) { put(path.join(portableProduct, 'examples', lane, name), text); digests[`examples/${lane}/${name}`] = hash(Buffer.from(text)); }
const manifestPath = path.join(portableProduct, 'release.json');
put(manifestPath, JSON.stringify({ files: digests }));
const portableScript = path.join(scratch, 'portability.test.mjs');
put(portableScript, replaceOnce(source('portability'), "const root=fileURLToPath(new URL('../product/', import.meta.url));", `const root=${JSON.stringify(portableProduct)};`));
const temp = path.join(scratch, 'temp'); fs.mkdirSync(temp);
const portableOptions = { env: { ...process.env, TEMP: temp, TMP: temp, TMPDIR: temp } };
const portableClean = run('portability-clean', ['--test', '--test-reporter=tap', portableScript], 0, /^# pass 3$/m, portableOptions);
const corruptedFile = 'examples/constraint-diagnosis/index.mjs';
digests[corruptedFile] = '0'.repeat(64);
put(manifestPath, JSON.stringify({ files: digests }), true);
const portableBad = run('portability-digest', ['--test', '--test-reporter=tap', portableScript], 1,
  /examples\/constraint-diagnosis\/index\.mjs differs from manifest/, portableOptions);
assert.match(portableBad.output, /^# pass 2$/m); assert.match(portableBad.output, /^# fail 1$/m);
assert.match(portableBad.output, /ERR_ASSERTION/);

// Bounded delivery probes. All native/runtime paths point to fixture directories;
// the verifyProduct adapter reads fixture JSON. No installer or host state used.
const deliveryRoot = path.join(scratch, 'delivery', 'repo'), deliveryOp = path.join(scratch, 'delivery', 'op');
const native = path.join(scratch, 'delivery', 'native'), runtime = path.join(scratch, 'delivery', 'runtime');
for (const dir of [native, runtime, deliveryOp]) fs.mkdirSync(dir, { recursive: true });
const runtimeRelease = JSON.stringify({ releaseId: '6fa86b80b1a2bb015ea3d747f990da14c763b359912c3a7954499be66817d574', files: {} });
put(path.join(runtime, 'release.json'), runtimeRelease);
const candidatePath = path.join(deliveryRoot, 'product', 'release.json');
put(candidatePath, JSON.stringify({ releaseId: approved, files: {} }));
put(path.join(deliveryRoot, 'product', 'catalog.json'), '{"skills":[]}');
const reviewedFiles = [];
for (let i = 0; i < 15; i++) {
  const rel = `product/fixture-reviewed-${i}.txt`, text = `fixture ${i}\n`;
  put(path.join(deliveryRoot, rel), text); reviewedFiles.push({ path: rel, sha256: hash(Buffer.from(text)) });
}
put(path.join(deliveryOp, 'before.json'), JSON.stringify({ managedIds: [], native: {}, runtime: { 'release.json': hash(runtimeRelease) } }));
put(path.join(deliveryOp, 'accepted-candidate.json'), JSON.stringify({ releaseId: approved, reviewedFiles }));
put(path.join(deliveryOp, 'integration.json'), JSON.stringify({ releaseId: approved }));
const adapter = path.join(scratch, 'fixture-verify-product.mjs');
put(adapter, "import fs from 'node:fs/promises'; export async function verifyProduct(root) { return JSON.parse(await fs.readFile(root+'/release.json','utf8')); }\n");
let deliverySource = replaceOnce(source('delivery'), "'file:///C:/dev/eternities-godskills/product/lib/product.mjs'", JSON.stringify(pathToFileURL(adapter).href));
deliverySource = replaceOnce(deliverySource, `const root='${repo}';`, `const root=${JSON.stringify(deliveryRoot)};`);
deliverySource = replaceOnce(deliverySource, `const op='${op}';`, `const op=${JSON.stringify(deliveryOp)};`);
deliverySource = replaceOnce(deliverySource, "const native='C:/Users/Dom/.agents/skills',runtime='C:/Users/Dom/.agents/godskills';", `const native=${JSON.stringify(native)},runtime=${JSON.stringify(runtime)};`);
const deliveryScript = path.join(scratch, 'delivery.mjs'); put(deliveryScript, deliverySource);
const deliveryClean = JSON.parse(run('delivery-preinstall-control', [deliveryScript, 'preinstall'], 0).stdout);
assert.equal(deliveryClean.candidateRelease, approved);
put(candidatePath, JSON.stringify({ releaseId: other, files: {} }), true);
run('delivery-candidate-mismatch', [deliveryScript, 'preinstall'], 1, /Candidate changed after independent acceptance/);
put(candidatePath, JSON.stringify({ releaseId: approved, files: {} }), true);
fs.renameSync(path.join(deliveryOp, 'preinstall.json'), path.join(deliveryOp, 'preinstall-control.json'));
put(path.join(deliveryOp, 'preinstall.json'), JSON.stringify({ candidateRelease: other }));
run('delivery-preinstall-mismatch', [deliveryScript, 'after'], 1, /Installed candidate differs from preinstall/);
assert.equal(fs.existsSync(path.join(deliveryOp, 'after.json')), false);

const frozenAfter = Object.fromEntries(frozenFiles.map(p => [p, hash(fs.readFileSync(path.join(repo, p)))]));
assert.deepEqual(frozenAfter, frozenBefore, 'Frozen author files changed');
assert.deepEqual(inventory(v1Root), v1Before, 'Immutable v1 review changed');
const result = {
  node: process.version, scratch, sources, approvedFixtureRelease: approved, runs,
  relocatedResults, protectedPathsChecked: protectedPaths,
  protectedMutation: { fixtureTestExit: mutatedCheck.exitCode, sourceGateProcessExit: 2, stableSources: mutatedCheck.stableSources, changedProtectedPaths: 3 },
  digestCorruption: { changedDigests: 1, shapeValid: true, actualHashAssertionFailed: true, testsPassed: 2, testsFailed: 1 },
  isolationClaim: { filesystemAccessIsolated: false, generatedExternalDependencyStillAccessible: true, claimExplicitlyNarrowed: true },
  transformations: {
    relocated: 'none; original script and valid 64-hex expectedRelease argument for every case',
    runCheck: 'only hardcoded root/op constants redirected; all three protected files present',
    portability: 'only product-root constant redirected; OS temp writes kept inside fixture',
    delivery: 'root/op/native/runtime redirected; verifyProduct replaced with a fixture JSON reader; all delivery assertions retained',
  },
  immutable: { frozenAuthorFiles: frozenAfter, v1TreeSha256: hash(JSON.stringify(v1Before)), v1Entries: Object.keys(v1Before).length, unchanged: true },
  limits: 'Generated fixtures only; no real installer, rollback, archive export or acceptance suite executed. pin-candidate and verify-integration source-inspected only.',
};
const output = path.join(scratch, 'results.json');
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output, successfulProbes: runs.length, protectedMutation: result.protectedMutation,
  digestCorruption: result.digestCorruption, immutable: { unchanged: true, v1Entries: result.immutable.v1Entries } }, null, 2));
