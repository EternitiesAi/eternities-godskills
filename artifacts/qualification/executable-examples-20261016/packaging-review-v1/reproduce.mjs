// Generated fixtures only. Never runs an installer or reads real example bodies.
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
const sources = {
  portability: [`${repo}/tests/executable-examples-portability.test.mjs`, '0e21bc519b5df8ae30430803766f89d6a0ae9cc4d58e41a1871d7f092329176b'],
  relocated: [`${op}/verify-relocated.mjs`, '43eb6b7826349be7b6975b7a0a7fa108b8e7430ee0c055444110f8c730d8037c'],
  runCheck: [`${op}/run-check.mjs`, 'c4428249f0b7b382133835b0119447a440c057790ba5944fac5fdc35d725afb4'],
};
const source = key => {
  const [file, expected] = sources[key];
  const bytes = fs.readFileSync(file);
  assert.equal(hash(bytes), expected, `Reviewed source changed: ${file}`);
  return bytes.toString('utf8');
};
function put(file, text) {
  assert(path.resolve(file).startsWith(path.resolve(scratch) + path.sep));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, { flag: 'wx' });
}
function replaceOnce(text, from, to) {
  assert.equal(text.split(from).length, 2, `Expected one substitution: ${from}`);
  return text.replace(from, to);
}
function run(script, args = [], options = {}) {
  const r = spawnSync(process.execPath, [script, ...args], {
    cwd: scratch, encoding: 'utf8', timeout: 60000, windowsHide: true, ...options,
  });
  assert.equal(r.status, 0, `${script}: ${r.error?.message ?? ''}\n${r.stdout}\n${r.stderr}`);
  return r.stdout;
}
const lanes = ['constraint-diagnosis', 'onboarding-cohorts', 'animation-interruptions'];
const simpleTest = "import test from 'node:test'; test('generated fixture only', () => {});\n";
const results = { node: process.version, scratch, sources, observations: {} };

// Original relocated verifier, unchanged, against a fully generated pack.
const pack = path.join(scratch, 'relocated', 'pack');
const files = {};
function packFile(rel, text) {
  put(path.join(pack, rel), text);
  files[rel] = hash(Buffer.from(text));
}
for (const lane of lanes) {
  packFile(`examples/${lane}/demo.mjs`, 'console.log(JSON.stringify({fictional: true}));\n');
  packFile(`examples/${lane}/index.test.mjs`, simpleTest);
  packFile(`examples/${lane}/index.mjs`, 'export const fixture = true;\n');
  packFile(`examples/${lane}/README.md`, 'Generated packaging fixture.\n');
}
packFile('bin/godskills.mjs', `import fs from 'node:fs';
const manifest = new URL('../release.json', import.meta.url);
const release = JSON.parse(fs.readFileSync(manifest));
release.fixtureChanged = true;
fs.writeFileSync(manifest, JSON.stringify(release));
fs.writeFileSync(new URL('../added-during-run.txt', import.meta.url), 'fixture only');
console.log(JSON.stringify({ releaseId: release.releaseId, skillCount: 93 }));
`);
put(path.join(pack, 'release.json'), JSON.stringify({ releaseId: 'generated-fixture', files }));
const manifestBefore = hash(fs.readFileSync(path.join(pack, 'release.json')));
const relocatedScript = path.join(scratch, 'relocated', 'verify-relocated.mjs');
put(relocatedScript, source('relocated'));
const relocatedReceipt = path.join(scratch, 'relocated', 'receipt.json');
run(relocatedScript, [pack, relocatedReceipt]);
const relocated = JSON.parse(fs.readFileSync(relocatedReceipt));
assert.equal(relocated.sourceChanged, false);
assert.notEqual(hash(fs.readFileSync(path.join(pack, 'release.json'))), manifestBefore);
assert(fs.existsSync(path.join(pack, 'added-during-run.txt')));
results.observations.relocated = {
  status: relocated.status, reportedSourceChanged: relocated.sourceChanged,
  manifestBytesChanged: true, unlistedFileAdded: true,
  sourceTransform: 'none; original script executed only on generated fixture files',
};

// Run-check copy: substitute only the two hardcoded fixture root/output paths.
const checkRoot = path.join(scratch, 'run-check', 'repo');
const checkOp = path.join(scratch, 'run-check', 'receipts');
for (const dir of ['product', 'tests', 'evaluation', 'examples', 'src', 'policies']) {
  fs.mkdirSync(path.join(checkRoot, dir), { recursive: true });
}
fs.mkdirSync(checkOp, { recursive: true });
put(path.join(checkRoot, 'src', 'adaptive-activation.mjs'), 'before\n');
put(path.join(checkRoot, 'policies', 'adaptive-activation.v1.json'), '{"before":true}\n');
put(path.join(checkRoot, 'tests', 'mutate-omitted-files.test.mjs'), `import test from 'node:test';
import fs from 'node:fs';
test('generated fixture changes files omitted by snapshot', () => {
  fs.writeFileSync(new URL('../src/adaptive-activation.mjs', import.meta.url), 'after\\n');
  fs.writeFileSync(new URL('../policies/adaptive-activation.v1.json', import.meta.url), '{"after":true}\\n');
});
`);
let checkSource = replaceOnce(source('runCheck'), `const root='${repo}';`, `const root=${JSON.stringify(checkRoot)};`);
checkSource = replaceOnce(checkSource, `const op='${op}';`, `const op=${JSON.stringify(checkOp)};`);
const checkScript = path.join(scratch, 'run-check', 'run-check.mjs');
put(checkScript, checkSource);
const check = JSON.parse(run(checkScript, ['fixture-source-gate', 'tests/mutate-omitted-files.test.mjs']));
assert.equal(check.stableSources, true);
assert.equal(fs.readFileSync(path.join(checkRoot, 'src', 'adaptive-activation.mjs'), 'utf8'), 'after\n');
assert.equal(JSON.parse(fs.readFileSync(path.join(checkRoot, 'policies', 'adaptive-activation.v1.json'))).after, true);
results.observations.runCheck = {
  exitCode: check.exitCode, reportedStableSources: check.stableSources,
  protectedSourceFixtureChanged: true, protectedPolicyFixtureChanged: true,
  sourceTransform: 'only hardcoded root and op constants redirected into this fixture',
};

// Portability copy: replace only product root. Absolute checkout dependency and
// twelve bogus digest values must both be rejected to prove the stronger claims.
const portableProduct = path.join(scratch, 'portability', 'product');
const helper = path.join(scratch, 'portability', 'checkout-only.mjs');
put(helper, 'export const marker = 7;\n');
const externalImport = `import {marker} from ${JSON.stringify(pathToFileURL(helper).href)};\n`;
const badDigests = {};
put(path.join(portableProduct, 'examples', 'README.md'), 'Generated fixture guide.\n');
for (const lane of lanes) {
  for (const [file, text] of Object.entries({
    'index.mjs': 'export const fixture = true;\n',
    'demo.mjs': externalImport + 'console.log(JSON.stringify({fictional:true, marker}));\n',
    'index.test.mjs': externalImport + "import test from 'node:test'; import assert from 'node:assert/strict'; test('generated external dependency', () => assert.equal(marker, 7));\n",
    'README.md': 'Generated fixture documentation.\n',
  })) {
    put(path.join(portableProduct, 'examples', lane, file), text);
    badDigests[`examples/${lane}/${file}`] = '0'.repeat(64);
  }
}
put(path.join(portableProduct, 'release.json'), JSON.stringify({ files: badDigests }));
const portabilityScript = path.join(scratch, 'portability', 'portability.test.mjs');
put(portabilityScript, replaceOnce(source('portability'),
  "const root=fileURLToPath(new URL('../product/', import.meta.url));",
  `const root=${JSON.stringify(portableProduct)};`));
const fixtureTemp = path.join(scratch, 'portability', 'temp');
fs.mkdirSync(fixtureTemp, { recursive: true });
const portabilityTap = run('--test', ['--test-reporter=tap', portabilityScript], {
  env: { ...process.env, TEMP: fixtureTemp, TMP: fixtureTemp, TMPDIR: fixtureTemp },
});
assert.match(portabilityTap, /^# pass 3$/m);
assert.match(portabilityTap, /^# fail 0$/m);
put(path.join(scratch, 'portability', 'output.tap'), portabilityTap);
results.observations.portability = {
  testsPassed: 3, testsFailed: 0, dependencyOutsideCopiedPack: helper,
  invalidManifestDigestsAccepted: 12,
  sourceTransform: 'only product-root constant redirected; OS temp environment confined to fixture directory',
};

// Read-only Git filter probe: no object write, index update or product mutation.
const raw = Buffer.from('fixture\r\nbytes\r\n');
function gitHash(args) {
  const r = spawnSync('git', ['-c', 'core.autocrlf=true', 'hash-object', '--stdin', ...args], {
    cwd: repo, input: raw, encoding: 'utf8', timeout: 10000, windowsHide: true,
  });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
}
const rawHash = gitHash(['--no-filters']);
const exampleHash = gitHash(['--path=product/examples/constraint-diagnosis/index.mjs']);
const receiptHash = gitHash(['--path=artifacts/qualification/executable-examples-20261016/packaging-review-v1/filter-fixture.txt']);
const controlHash = gitHash(['--path=tests/executable-examples-portability.test.mjs']);
assert.equal(exampleHash, rawHash);
assert.equal(receiptHash, rawHash);
assert.notEqual(controlHash, rawHash);
results.observations.attributes = {
  autocrlf: true, rawHash, exampleHash, qualificationHash: receiptHash, controlHash,
  exactBytesPreservedInBothNewScopes: true, unrelatedTestStillNormalizes: true,
};
const output = path.join(scratch, 'results.json');
fs.writeFileSync(output, JSON.stringify(results, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output, ...results.observations }, null, 2));
