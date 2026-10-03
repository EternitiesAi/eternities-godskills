import { createHash } from 'node:crypto';
import { readFile, lstat, readdir, realpath } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Local, read-only verification of the exact candidate trees; no discovery/build.
const runRoot = dirname(fileURLToPath(import.meta.url));
const worktree = resolve(runRoot, '../../../../..');
const freezePath = 'artifacts/cognitive-workflows-20261003/candidate-freeze-v1.json';
const methods = [
  'voice-style-calibration', 'imaginative-concept-development',
  'interpersonal-understanding-and-dialogue', 'memory-retention-and-recovery',
  'completeness-and-consistency-audit', 'long-horizon-work-continuity',
];
const roots = methods.map(id => `product/skills/${id}`);
const digest = data => createHash('sha256').update(data).digest('hex');

async function assertRegular(path) {
  let cursor = worktree;
  for (const part of path.split('/')) {
    cursor = resolve(cursor, part);
    if ((await lstat(cursor)).isSymbolicLink()) throw new Error(`Linked path: ${path}`);
  }
  if (!(await lstat(cursor)).isFile()) throw new Error(`Not a regular file: ${path}`);
}

async function inventory(directory, result) {
  if ((await lstat(resolve(worktree, directory))).isSymbolicLink()) {
    throw new Error(`Linked directory: ${directory}`);
  }
  result.directories.push(directory);
  for (const entry of await readdir(resolve(worktree, directory), { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    const stat = await lstat(resolve(worktree, path));
    if (stat.isSymbolicLink()) throw new Error(`Linked occurrence: ${path}`);
    if (stat.isDirectory()) await inventory(path, result);
    else if (stat.isFile()) result.files.push(path);
    else throw new Error(`Non-file occurrence: ${path}`);
  }
}

try {
  if (process.argv.length !== 2) throw new Error('Usage: node verify-inputs.mjs');
  await assertRegular(freezePath);
  const freezeBytes = await readFile(resolve(worktree, freezePath));
  const freeze = JSON.parse(freezeBytes.toString('utf8'));
  const freezeSha256 = digest(freezeBytes);
  if (freeze.schema !== 'cognitive-candidate-freeze-v1' || freeze.files.length !== 19) {
    throw new Error('Unexpected freeze schema or count');
  }
  const declaredPaths = new Set();
  const foldedPaths = new Set();
  for (const record of freeze.files) {
    if (typeof record.path !== 'string' || record.path.includes('\\') ||
        record.path.split('/').some(p => !p || p === '..' || p === '.') ||
        !roots.some(root => record.path.startsWith(`${root}/`)) ||
        !/^[0-9a-f]{64}$/.test(record.sha256)) throw new Error('Invalid freeze record');
    if (declaredPaths.has(record.path) || foldedPaths.has(record.path.toLowerCase())) {
      throw new Error(`Duplicate declared occurrence: ${record.path}`);
    }
    declaredPaths.add(record.path);
    foldedPaths.add(record.path.toLowerCase());
  }
  const occurrences = [];
  const verifiedFiles = [];
  const realRoots = new Set();
  for (const root of roots) {
    const actualRoot = await realpath(resolve(worktree, root));
    if (realRoots.has(actualRoot.toLowerCase())) throw new Error('Aliased candidate root');
    realRoots.add(actualRoot.toLowerCase());
    const expectedFiles = freeze.files.filter(f => f.path.startsWith(`${root}/`))
      .map(f => f.path).sort();
    if (!expectedFiles.includes(`${root}/SKILL.md`) || !expectedFiles.includes(`${root}/skill.json`)) {
      throw new Error(`Incomplete declared candidate tree: ${root}`);
    }
    const expectedDirectories = new Set([root]);
    for (const path of expectedFiles) {
      const parts = path.split('/');
      for (let n = root.split('/').length + 1; n < parts.length; n++) {
        expectedDirectories.add(parts.slice(0, n).join('/'));
      }
    }
    const actual = { files: [], directories: [] };
    await inventory(root, actual);
    actual.files.sort(); actual.directories.sort();
    if (JSON.stringify(actual.files) !== JSON.stringify(expectedFiles) ||
        JSON.stringify(actual.directories) !== JSON.stringify([...expectedDirectories].sort())) {
      throw new Error(`Directory occurrence set mismatch: ${root}`);
    }
    occurrences.push({ root, exactFileOccurrences: actual.files, exactDirectoryOccurrences: actual.directories });
  }
  for (const record of [...freeze.files].sort((a, b) => a.path.localeCompare(b.path, 'en'))) {
    await assertRegular(record.path);
    const bytes = await readFile(resolve(worktree, record.path));
    const sha256 = digest(bytes);
    if (sha256 !== record.sha256) throw new Error(`Candidate hash mismatch: ${record.path}`);
    verifiedFiles.push({ path: record.path, bytes: bytes.length, sha256 });
  }
  // Once pinned, a later successful check cannot silently accept a new freeze.
  try {
    const pinned = JSON.parse(await readFile(resolve(runRoot, 'input-verification.json'), 'utf8'));
    if (pinned.freezeSha256 !== freezeSha256) throw new Error('Parent freeze changed after initial verification');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  console.log(JSON.stringify({
    schemaVersion: 1, verified: true, freezePath, freezeSha256,
    candidateFiles: verifiedFiles.length, candidateDirectories: roots.length,
    exactOccurrenceSetsVerified: true, linkedOrAliasedCandidatePaths: false,
    baselineCommit: freeze.baselineCommit, stage: freeze.stage,
    draftMetadataTreatment: 'expected-process-state-not-a-defect',
    files: verifiedFiles, occurrences,
  }, null, 2));
} catch (error) {
  console.error(error.message); process.exitCode = 1;
}
