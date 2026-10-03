import { createHash } from 'node:crypto';
import { readFile, readdir, lstat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const worktree = resolve(root, '../../../../..');
const evalRoot = resolve(root, '../..');
const digest = data => createHash('sha256').update(data).digest('hex');
const frozenCreator = 'cccd291077ec57c6f50ca6529f0f3fb93212da09473effb2fcec808e81b21288';
const expectedOutputs = [
  'RUN.md', 'application-output-freeze.json', 'assessment.md',
  'C01/output.md', 'C02/output.md', 'C03/output.md', 'C04/output.md',
  'C04/retention-readback.json', 'C04/task-state.md', 'C05/output.md', 'C06/output.md',
  'check-output-constraints.mjs', 'dispositions.json', 'document-review.md',
  'input-verification.json', 'manifest-run.mjs', 'output-checks.json',
  'prerequisite-record.json', 'verify-inputs.mjs',
].sort();
const assert = (condition, reason) => { if (!condition) throw new Error(reason); };

async function records(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${prefix}${entry.name}`;
    const target = resolve(directory, entry.name);
    const stat = await lstat(target);
    assert(!stat.isSymbolicLink(), `Linked run artifact: ${path}`);
    if (stat.isDirectory()) result.push(...await records(target, `${path}/`));
    else {
      assert(stat.isFile(), `Non-file run artifact: ${path}`);
      if (path === 'run-manifest.json') continue;
      const bytes = await readFile(target);
      result.push({ path, bytes: bytes.length, sha256: digest(bytes) });
    }
  }
  return result.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}

async function inputRecord(path, role, expectedSha256) {
  const bytes = await readFile(resolve(worktree, path));
  const sha256 = digest(bytes);
  assert(sha256 === expectedSha256, `Inspected input changed: ${path}`);
  return { path, role, inspectedInFull: true, bytes: bytes.length, sha256 };
}

try {
  assert(process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === '--inventory'),
    'Usage: node manifest-run.mjs [--inventory]');
  const pinned = JSON.parse(await readFile(resolve(root, 'input-verification.json'), 'utf8'));
  const preregBytes = await readFile(resolve(evalRoot, 'preregistration-manifest.json'));
  assert(digest(preregBytes) === '6b445b0c493c29f3fa6495b337d4f3f8e54c76ba715a48e8c8a773b2c78c14f4',
    'Preregistration manifest changed');
  const prereg = JSON.parse(preregBytes.toString('utf8'));
  const inspectedInputs = [];
  for (const f of pinned.files) {
    const role = f.path.endsWith('/SKILL.md') ? 'candidate-entrypoint' :
      f.path.endsWith('/skill.json') ? 'candidate-metadata' : 'applicable-bundled-reference';
    inspectedInputs.push(await inputRecord(f.path, role, f.sha256));
  }
  inspectedInputs.push(await inputRecord(pinned.freezePath, 'candidate-freeze', pinned.freezeSha256));
  const evaluationPrefix = 'artifacts/cognitive-workflows-20261003/independent-evaluation/';
  for (const f of prereg.files.filter(f => f.path.startsWith('raw/') ||
      f.path === 'protocol.md' || f.path === 'assessor/acceptance.md')) {
    const role = f.path.startsWith('raw/') ? 'raw-case' :
      f.path.startsWith('assessor/') ? 'criteria-read-after-output-freeze' : 'preregistered-protocol';
    inspectedInputs.push(await inputRecord(`${evaluationPrefix}${f.path}`, role, f.sha256));
  }
  const creatorPath = 'C:/Users/Dom/.codex/skills/.system/skill-creator/SKILL.md';
  const creatorBytes = await readFile(creatorPath);
  assert(digest(creatorBytes) === frozenCreator, 'Skill Creator changed after full read');
  inspectedInputs.push({ path: creatorPath, role: 'expressly-authorized-host-instruction',
    inspectedInFull: true, bytes: creatorBytes.length, sha256: frozenCreator });
  inspectedInputs.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  const outputs = await records(root);
  assert(JSON.stringify(outputs.map(f => f.path)) === JSON.stringify(expectedOutputs),
    'Run artifact occurrence set differs from declared inventory');
  const canonical = [
    ...inspectedInputs.map(f => `input\0${f.path}\0${f.bytes}\0${f.sha256}\n`),
    ...outputs.map(f => `output\0${f.path}\0${f.bytes}\0${f.sha256}\n`),
  ].join('');
  const manifest = {
    schemaVersion: 1, run: 'run-v1', algorithm: 'sha256',
    canonicalEncoding: 'utf8: sorted inspected input records, then sorted output records; domain + NUL + path + NUL + decimal bytes + NUL + lowercase sha256 + LF',
    bundleSha256: digest(Buffer.from(canonical, 'utf8')),
    candidateFreezeSha256: pinned.freezeSha256,
    preregistrationBundleSha256: prereg.bundleSha256,
    inspectedInputs, outputs,
    independence: 'One nonauthor document/application exercise; no blind baseline or true multi-day runtime.',
  };
  if (process.argv[2] === '--inventory') console.log(JSON.stringify(manifest, null, 2));
  else {
    const savedBytes = await readFile(resolve(root, 'run-manifest.json'));
    assert(JSON.stringify(JSON.parse(savedBytes.toString('utf8'))) === JSON.stringify(manifest),
      'Run manifest identity mismatch');
    console.log(JSON.stringify({
      verified: true, bundleSha256: manifest.bundleSha256,
      manifestSha256: digest(savedBytes), inspectedInputCount: inspectedInputs.length,
      frozenCandidateFiles: pinned.files.length, rawCases: 6,
      boundRunArtifacts: outputs.length, allSixOutputsPreserved: true,
      materialMethodDefectsDemonstrated: false,
      evidence: 'local document/application artifacts and one actual fixture-note readback only',
    }, null, 2));
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
