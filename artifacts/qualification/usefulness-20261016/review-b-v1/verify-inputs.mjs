// Read-only identity audit. No acquired code, HTML scripts or source commands run.
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const lane = 'artifacts/qualification/usefulness-20261016/lane-b/';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFile(resolve(root, path));
const record = async path => {
  const bytes = await read(path);
  return {path, bytes: bytes.length, sha256: hash(bytes), modifiedAt: (await stat(resolve(root, path))).mtime.toISOString()};
};
const metadata = await Promise.all(['proposals.json', 'sources.json'].map(name => record(lane + name)));
const proposals = JSON.parse(await read(lane + 'proposals.json'));
const ledger = JSON.parse(await read(lane + 'sources.json'));
const expectedIds = ['shader-effect-construction', 'lighting-material-calibration', 'animation-interruption-transitions', 'frame-budget-diagnosis'];
assert.deepEqual(proposals.proposals.map(item => item.id), expectedIds);
assert.equal(proposals.baseline, '7c7f2ac98a282ccb2e59c3a4c0424802a4dd72b5');
const drafts = [];
for (const item of proposals.proposals) {
  assert.equal(item.candidateMarkdownPath, lane + item.id + '.md');
  const observed = await record(item.candidateMarkdownPath);
  assert.equal(observed.sha256, item.candidateSha256, item.id);
  assert.equal(observed.sha256, item.proposedMethodDirectoryRow.resourceSha256, item.id);
  for (const source of item.sourceRecords) assert.deepEqual(source, ledger.sources.find(candidate => candidate.id === source.id), `${item.id}/${source.id}`);
  for (const coverage of item.currentCoverageComparison.readset) assert.equal(hash(await read(coverage.path)), coverage.sha256, coverage.path);
  drafts.push({...observed, id: item.id, owner: item.owner, target: item.integration.targetMarkdownPath});
}
const sources = [];
for (const source of ledger.sources) {
  const path = resolve(source.warehousePath, source.relativePath);
  assert.ok(!relative(source.warehousePath, path).startsWith('..'), source.id);
  assert.ok(source.warehousePath.startsWith('D:/03-ARSENAL/warehouse/'), source.id);
  const observed = await record(path);
  assert.equal(observed.sha256, source.sha256, source.id);
  sources.push({...observed, id: source.id,
    portableLocator: `${source.repositoryId}@${source.observedHead}:${source.relativePath}`,
    authority: source.authority, licenseRecord: source.licenseRecord,
    reviewerRead: 'complete inert body; no linked source traversal or execution'});
}
const licenses = [];
for (const notice of ledger.licenses) {
  const observed = await record(notice.path);
  assert.equal(observed.sha256, notice.sha256, notice.id);
  licenses.push({...observed, id: notice.id, observedNotice: notice.observedNotice, copyright: notice.copyright});
}
const repositories = [];
for (const path of [...new Set(ledger.sources.map(source => source.warehousePath))]) {
  const selected = ledger.sources.filter(source => source.warehousePath === path);
  const head = execFileSync('git', ['-C', path, 'rev-parse', 'HEAD'], {encoding: 'utf8', windowsHide: true}).trim();
  assert.ok(selected.every(source => source.observedHead === head && source.indexHead === head), path);
  const status = execFileSync('git', ['-C', path, 'status', '--porcelain', '--', ...selected.map(source => source.relativePath), 'LICENSE'], {encoding: 'utf8', windowsHide: true}).trim();
  assert.equal(status, '', path);
  repositories.push({path, head, selectedPathsStatus: 'clean', scope: 'selected source bodies and root LICENSE only'});
}
const currentCoverage = [];
for (const entry of [...ledger.currentCoverageReadset, ...ledger.taskContractReadset]) {
  const observed = await record(entry.path);
  assert.equal(observed.sha256, entry.sha256, entry.path);
  currentCoverage.push({...observed, reviewerRead: entry.path === 'product/lib/method-directory.mjs' ? 'hash only; not a method-coverage source' : 'complete body'});
}
const warehouseIndex = await record(ledger.warehouseIndex.path);
assert.equal(warehouseIndex.sha256, ledger.warehouseIndex.sha256);
const repositoryHead = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], {encoding: 'utf8', windowsHide: true}).trim();
assert.equal(repositoryHead, proposals.baseline);
console.log(JSON.stringify({schema: 'godskills-review-b-inputs-v1', observedAt: new Date().toISOString(),
  repositoryHead, metadata, drafts, sources, licenses, repositories, currentCoverage,
  warehouseIndex: {...warehouseIndex, reviewerRead: 'digest only; no corpus search'},
  limits: ['Exact source bytes and selected git status do not verify current engine APIs.',
    'Not a whole-repository cleanliness, rights-clearance, renderer or runtime verdict.'],
}, null, 2));
