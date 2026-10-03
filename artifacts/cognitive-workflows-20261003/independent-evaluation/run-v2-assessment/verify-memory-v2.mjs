import { createHash } from 'node:crypto';
import { readFile, readdir, lstat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const worktree = resolve(root, '../../../..');
const prefix = 'artifacts/cognitive-workflows-20261003/';
const pinned = [
  ['memory-application-v2/application-record.md','actor-application','84b1b2d058c195585ed57ad302f876ca7bf4acbadbaea20288a457d474675b56'],
  ['memory-application-v2/checkpoint.md','actual-retained-note','3b03196a0702585c1db6cbeaff90b2a579f62f2f517c036e8a67301bbb3a83c9'],
  ['repairs-v2/memory-retention-and-recovery/SKILL.md','pinned-staged-method','36c14c3b62bdf72c2b12bf4678ec44223bd0c3064528a7f1b34d7df4fcc966e7'],
  ['repairs-v2/memory-retention-and-recovery/references/examples.md','pinned-staged-resource','e85739b8e8e517545d5862200f78e442dc23f59284f2e74751c7c39af8e5ece2'],
  ['independent-evaluation/raw/C04-memory-retention-and-recovery.md','preregistered-raw-C04','7bb272b49e98af768de83026b0f29e8da13d988e139b2bf03b54292d89106350'],
  ['independent-evaluation/assessor/acceptance.md','preregistered-criteria','4f6e002d3c13656a5f112266cde4a110dd75fac1195e8e62c2954e680a1248f5'],
  ['independent-evaluation/applications/run-v1/run-manifest.json','sealed-historical-v1-manifest','d3d0ed2cd58c309c4b47e43467065f9df2c131ca26ecd82be3d51c2d94f4fee7'],
  ['dialogue-memory-review-v1/review.md','preserved-dissenting-review','060094fae9af2c78c1c8999d4ef3831fd1916ad43df4d4e2cbedc3933e70d28c'],
  ['voice-imagination-review-v1/review.md','preserved-dissenting-review','699e5ee554898632bf3e19fff50e2ed6e025c3bee9231c0ed7b8b0e7577e501d'],
];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const assert = (condition, reason) => { if (!condition) throw new Error(reason); };

try {
  assert(process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === '--inventory'),
    'Usage: node verify-memory-v2.mjs [--inventory]');
  const inputs = [];
  for (const [suffix, role, expected] of pinned) {
    const path = `${prefix}${suffix}`;
    let cursor = worktree;
    for (const part of path.split('/')) {
      cursor = resolve(cursor, part);
      assert(!(await lstat(cursor)).isSymbolicLink(), `Linked input: ${path}`);
    }
    assert((await lstat(cursor)).isFile(), `Not a file: ${path}`);
    const bytes = await readFile(cursor);
    assert(hash(bytes) === expected, `Pinned v2/historical input changed: ${path}`);
    inputs.push({ path, role, bytes: bytes.length, sha256: expected });
  }
  const applicationEntries = await readdir(resolve(worktree, `${prefix}memory-application-v2`), {withFileTypes:true});
  assert(applicationEntries.every(e=>e.isFile()) &&
    JSON.stringify(applicationEntries.map(e=>e.name).sort()) === JSON.stringify(['application-record.md','checkpoint.md']),
    'Memory application exact occurrence set changed');
  const note = await readFile(resolve(worktree, `${prefix}memory-application-v2/checkpoint.md`), 'utf8');
  const record = await readFile(resolve(worktree, `${prefix}memory-application-v2/application-record.md`), 'utf8');
  const words = note.trim().split(/\s+/u).length;
  const claimedWords = Number(record.match(/Saved the (\d+)-whitespace-delimited-word checkpoint/u)?.[1]);
  assert(words <= 230 && words === claimedWords, 'Checkpoint size/word-count claim mismatch');
  assert(record.includes('3b03196a0702585c1db6cbeaff90b2a579f62f2f517c036e8a67301bbb3a83c9'),
    'Actor readback digest does not identify current note');
  const receipt = {
    schemaVersion:1, verified:true, case:'C04-memory-application-v2', inputs,
    exactApplicationOccurrences:['application-record.md','checkpoint.md'],
    assessorActualLocalReadback:{path:`${prefix}memory-application-v2/checkpoint.md`,words,bytes:Buffer.byteLength(note,'utf8'),sha256:hash(Buffer.from(note,'utf8'))},
    actorSaveReadbackEvidence:'Actor application record and explicit parent attestation; no independent replay of actor save.',
    originalV1ManifestUnchanged:true,
    originalV1CandidatePaths:'historical only; not rebound to intentionally changed live product',
    voiceV2AtMemoryCapture:'in-flight-not-inspected-or-duplicated',
    effects:'read-only verification; no live service, global memory or product mutation',
  };
  if(process.argv[2]==='--inventory') console.log(JSON.stringify(receipt,null,2));
  else {
    const saved = JSON.parse(await readFile(resolve(root,'memory-input-verification.json'),'utf8'));
    assert(JSON.stringify(saved)===JSON.stringify(receipt),'Memory input receipt mismatch');
    console.log(JSON.stringify({verified:true,inputCount:inputs.length,noteWords:words,noteSha256:receipt.assessorActualLocalReadback.sha256,originalV1ManifestUnchanged:true,voiceV2:'not-inspected'},null,2));
  }
} catch(error){console.error(error.message);process.exitCode=1;}
