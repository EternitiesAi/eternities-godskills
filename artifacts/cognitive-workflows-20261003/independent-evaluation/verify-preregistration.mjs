import { createHash } from 'node:crypto';
import { lstat, readFile, readdir, realpath } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Read-only, no dependencies, providers, processes, network or output files.
const root = dirname(fileURLToPath(import.meta.url));
const fixedPaths = [
  'README.md',
  'assessor/acceptance.md',
  'protocol.md',
  'raw/C01-voice-style-calibration.md',
  'raw/C02-imaginative-concept-development.md',
  'raw/C03-interpersonal-understanding-and-dialogue.md',
  'raw/C04-memory-retention-and-recovery.md',
  'raw/C05-completeness-and-consistency-audit.md',
  'raw/C06-long-horizon-work-continuity.md',
  'sources.json',
  'verify-preregistration.mjs',
].sort();

function hash(data) {
  return createHash('sha256').update(data).digest('hex');
}

async function readBound(path) {
  if (!fixedPaths.includes(path) && path !== 'preregistration-manifest.json') {
    throw new Error(`Undeclared preregistration path: ${path}`);
  }
  const target = resolve(root, path);
  const rel = relative(root, target);
  if (rel.startsWith(`..${sep}`) || rel === '..' || resolve(target) === resolve(root)) {
    throw new Error(`Path outside preregistration directory: ${path}`);
  }
  let cursor = root;
  for (const part of path.split('/')) {
    cursor = join(cursor, part);
    if ((await lstat(cursor)).isSymbolicLink()) {
      throw new Error(`Linked preregistration path: ${path}`);
    }
  }
  if (!(await lstat(target)).isFile()) throw new Error(`Not a regular file: ${path}`);
  const actual = await realpath(target);
  const actualRel = relative(await realpath(root), actual);
  if (actualRel.startsWith(`..${sep}`) || actualRel === '..') {
    throw new Error(`Resolved preregistration path escaped: ${path}`);
  }
  return readFile(target);
}

async function checkCaseDirectories() {
  for (const directory of ['raw', 'assessor']) {
    const expected = fixedPaths.filter(p => p.startsWith(`${directory}/`));
    const entries = await readdir(join(root, directory), { withFileTypes: true });
    const actual = entries.map(e => `${directory}/${e.name}`).sort();
    if (entries.some(e => !e.isFile()) || JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Unexpected/missing file in sealed ${directory} directory`);
    }
  }
}

try {
  if (process.argv.slice(2).some(arg => arg !== '--inventory') || process.argv.length > 3) {
    throw new Error('Usage: node verify-preregistration.mjs [--inventory]');
  }
  await checkCaseDirectories();
  const files = [];
  for (const path of fixedPaths) {
    const bytes = await readBound(path);
    files.push({ path, bytes: bytes.length, sha256: hash(bytes) });
  }
  // Exact UTF-8 canonical record; sorted ASCII relative paths, decimal byte sizes,
  // lowercase hex digests, NUL field separators and LF record endings.
  const canonical = files.map(f => `${f.path}\0${f.bytes}\0${f.sha256}\n`).join('');
  const inventory = {
    schemaVersion: 1,
    algorithm: 'sha256',
    canonicalEncoding: 'utf8: sorted path + NUL + decimal bytes + NUL + lowercase sha256 + LF',
    bundleSha256: hash(Buffer.from(canonical, 'utf8')),
    files,
  };
  if (process.argv.includes('--inventory')) {
    console.log(JSON.stringify(inventory, null, 2));
  } else {
    const manifestBytes = await readBound('preregistration-manifest.json');
    const manifest = JSON.parse(manifestBytes.toString('utf8'));
    if (JSON.stringify(manifest) !== JSON.stringify(inventory)) {
      throw new Error('Manifest identity/inventory mismatch; preregistration not verified');
    }
    const sources = JSON.parse((await readBound('sources.json')).toString('utf8'));
    const cases = files.filter(f => f.path.startsWith('raw/'));
    if (cases.length !== 6 || sources.candidateBodiesRead !== false ||
        sources.fixtureApplicationsPerformed !== false) {
      throw new Error('Unexpected preregistration phase or case count');
    }
    console.log(JSON.stringify({
      integrity: 'verified',
      bundleSha256: inventory.bundleSha256,
      manifestSha256: hash(manifestBytes),
      rawCases: cases.length,
      criteriaSeparated: true,
      candidateReview: 'not-performed',
      application: 'not-performed',
      skillCreatorPrerequisite: sources.readPrerequisites.skillCreator.state,
      applicationReadiness: 'held-pending-required-instruction-read-and-frozen-candidates',
    }, null, 2));
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
