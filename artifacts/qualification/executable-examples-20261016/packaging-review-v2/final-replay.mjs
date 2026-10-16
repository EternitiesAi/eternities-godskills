// Final relocation revision only; retain the earlier v2 evidence unchanged.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const repo = 'C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003';
const parentOp = 'C:/Users/Dom/.codex/operations/godskills-executable-examples-20261016';
const review = path.dirname(fileURLToPath(import.meta.url));
const scratch = fs.mkdtempSync(path.join(review, 'final-fixture-'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const priorPath = path.join(review, 'fixture-koS4bs/results.json');
assert.equal(hash(fs.readFileSync(priorPath)), 'fd1a73ed658e9857ac936713e9694b65a069dcd9505a290ed961e59b354f4503');
assert.equal(hash(fs.readFileSync(path.join(review, 'reproduce.mjs'))), '2b99dd8fbf28d1e737b49ab291efd071d4c9bd5e146d886b72d1d6a2f035d6a8');
const prior = JSON.parse(fs.readFileSync(priorPath));
for (const key of ['runCheck', 'portability', 'delivery']) {
  const [file, digest] = prior.sources[key]; assert.equal(hash(fs.readFileSync(file)), digest, key);
}
const sourcePath = `${parentOp}/verify-relocated.mjs`;
const sourceSha256 = '6fb6c84c2de62b04c811bbbb0e98315457901289b0d7484e40d07b90ac02c143';
const source = fs.readFileSync(sourcePath); assert.equal(hash(source), sourceSha256);
function put(file, bytes) {
  assert(path.resolve(file).startsWith(path.resolve(scratch) + path.sep));
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes, { flag: 'wx' });
}
function inventory(base, prefix = '', out = {}) {
  for (const e of fs.readdirSync(path.join(base, prefix), { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    const rel = prefix + e.name;
    if (e.isDirectory()) { out[rel+'/'] = 'directory'; inventory(base, rel+'/', out); }
    else { assert(e.isFile()); out[rel] = hash(fs.readFileSync(path.join(base, rel))); }
  } return out;
}
const script = path.join(scratch, 'verify-relocated.mjs'); put(script, source);
const lanes = ['constraint-diagnosis', 'onboarding-cohorts', 'animation-interruptions'];
const runs = [];
for (const mode of ['clean', 'manifest', 'membership', 'source', 'inside-output', 'wrong-release', 'forged-release', 'undeclared-file']) {
  const pack = path.join(scratch, `pack-${mode}`), files = {};
  const packFile = (rel, text) => { put(path.join(pack, rel), text); files[rel] = hash(Buffer.from(text)); };
  for (const lane of lanes) for (const [file, text] of Object.entries({
    'index.mjs': 'export const fixture = true;\n',
    'demo.mjs': 'console.log(JSON.stringify({fictional:true}));\n',
    'index.test.mjs': "import test from 'node:test'; test('generated fixture only', () => {});\n",
    'README.md': 'Generated packaging fixture.\n',
  })) packFile(`examples/${lane}/${file}`, text);
  const mutation = {
    manifest: "release.fixtureChanged=true; fs.writeFileSync(manifest,JSON.stringify(release));",
    membership: "fs.mkdirSync(new URL('../added-empty-directory/',import.meta.url));",
    source: "fs.writeFileSync(new URL('../examples/constraint-diagnosis/index.mjs',import.meta.url),'export const fixture = false;\\n');",
  }[mode] ?? '';
  packFile('bin/godskills.mjs', `import fs from 'node:fs';
const manifest=new URL('../release.json',import.meta.url);
const release=JSON.parse(fs.readFileSync(manifest));
${mutation}
console.log(JSON.stringify({releaseId:release.releaseId,skillCount:93}));
`);
  const derivedRelease = hash(JSON.stringify(files, null, 2) + '\n');
  const forged = 'b'.repeat(64);
  const declaredRelease = mode === 'forged-release' ? forged : derivedRelease;
  put(path.join(pack, 'release.json'), JSON.stringify({ releaseId: declaredRelease, files }));
  if (mode === 'undeclared-file') put(path.join(pack, 'undeclared.txt'), 'fixture only\n');
  const expectedRelease = mode === 'wrong-release' || mode === 'forged-release' ? forged : derivedRelease;
  const output = mode === 'inside-output' ? path.join(pack, 'receipt.json') : path.join(scratch, `${mode}.json`);
  const result = spawnSync(process.execPath, [script, pack, output, expectedRelease], {
    cwd: scratch, encoding: 'utf8', timeout: 60000, windowsHide: true,
  });
  const text = (result.stdout ?? '') + (result.stderr ?? '');
  put(path.join(scratch, `${mode}.log`), text);
  assert.equal(result.status, mode === 'clean' ? 0 : 1, `${mode}: ${result.error?.message ?? ''}\n${text}`);
  const diagnostic = {
    manifest: /Pack membership or bytes changed during execution/,
    membership: /Pack membership or bytes changed during execution/,
    source: /examples\/constraint-diagnosis\/index\.mjs/,
    'inside-output': /Output must be outside pack/,
    'wrong-release': /Pack differs from approved candidate/,
    'forged-release': /Manifest does not reconstruct approved candidate identity/,
    'undeclared-file': /Pack has undeclared or missing files/,
  }[mode];
  if (diagnostic) assert.match(text, diagnostic);
  if (mode === 'clean') {
    const receipt = JSON.parse(fs.readFileSync(output));
    assert.equal(receipt.expectedRelease, derivedRelease);
    assert.equal(receipt.sourceChanged, false); assert.equal(receipt.filesystemAccessIsolated, false);
    assert.equal(receipt.runs.length, 7);
  } else assert.equal(fs.existsSync(output), false, 'No PASS receipt on a rejected probe');
  if (mode === 'manifest') assert.equal(JSON.parse(fs.readFileSync(path.join(pack,'release.json'))).fixtureChanged, true);
  if (mode === 'membership') assert(fs.existsSync(path.join(pack,'added-empty-directory')));
  if (mode === 'source') assert.equal(fs.readFileSync(path.join(pack,'examples/constraint-diagnosis/index.mjs'),'utf8'), 'export const fixture = false;\n');
  runs.push({ mode, processExitCode: result.status, derivedRelease, expectedRelease,
    requiredDiagnostic: diagnostic?.source ?? null, outputSha256: hash(text), passReceiptWritten: mode === 'clean' });
}
for (const [file, digest] of Object.entries(prior.immutable.frozenAuthorFiles)) assert.equal(hash(fs.readFileSync(path.join(repo,file))), digest);
const v1 = inventory(path.join(repo,'artifacts/qualification/executable-examples-20261016/packaging-review-v1'));
assert.equal(hash(JSON.stringify(v1)), prior.immutable.v1TreeSha256);
const retainedRuns = prior.runs.filter(r => !r.label.startsWith('relocated-'));
assert.equal(retainedRuns.length, 7);
const results = {
  node: process.version, sourcePath, sourceSha256, sourceTransform: 'none', runs,
  priorEvidence: { path: priorPath, sha256: hash(fs.readFileSync(priorPath)), retainedRuns,
    note: 'Retain only seven probes for unchanged sources; six earlier relocation probes are historical, superseded by this final run.' },
  finalApplicableProbes: runs.length + retainedRuns.length,
  immutable: { authorFiles: 6, v1Entries: Object.keys(v1).length, v1TreeSha256: hash(JSON.stringify(v1)), unchanged: true },
  limits: 'Generated fixtures only; no real pack/install/rollback or independent acceptance suite executed.',
};
const output = path.join(scratch,'results.json'); fs.writeFileSync(output, JSON.stringify(results,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ output, finalRelocationProbes: runs.length, retainedUnchangedSourceProbes: retainedRuns.length,
  finalApplicableProbes: results.finalApplicableProbes, immutable: results.immutable },null,2));
