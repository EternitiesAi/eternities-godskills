// Mechanical evidence audit only. Does not import product code or run the assembler.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const cohort = 'artifacts/qualification/cohesive-product-20261015/';
const bundle = 'product/evidence/method-reviews/cohesive-v1/';
const baseline = 'c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d';
const reads = new Map(), failures = [];
const sha = b => createHash('sha256').update(b).digest('hex');
function read(p, mode = 'JSON/evidence inspection') {
  const bytes = fs.readFileSync(path.resolve(root, p));
  const digest = sha(bytes);
  if (reads.has(p) && reads.get(p).sha256 !== digest) throw Error('Concurrent input drift: ' + p);
  reads.set(p, { path: p, sha256: digest, mode });
  return bytes;
}
const json = p => JSON.parse(read(p));
const text = p => read(p, 'text evidence; not executed').toString('utf8');
const hash = p => sha(read(p, 'byte hashing only; no substantive re-review'));
const gitBytes = p => {
  const bytes = execFileSync('git', ['show', baseline + ':' + p], { cwd: root, maxBuffer: 4 * 1024 * 1024 });
  reads.set('git:' + baseline + ':' + p, { path: p, revision: baseline, sha256: sha(bytes), mode: 'canonical Git object byte comparison' });
  return bytes;
};
const check = (ok, message) => { if (!ok) failures.push(message); return !!ok; };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const pointer = (object, p) => p.split('/').slice(1).reduce((o,k) => o?.[k.replaceAll('~1','/').replaceAll('~0','~')], object);
text(cohort + 'assemble-reviewed-methods.mjs'); // inspection only; never execute
const definitions = json(cohort + 'new-method-directory.json');
const directory = json('product/METHODS.v1.json');
const currentDirectoryBytes = read('product/METHODS.v1.json');
const originalBytes = gitBytes('product/METHODS.v1.json');
const original = JSON.parse(originalBytes);
const oldRows = original.methods.map((row, i) => ({
  id: row.id, samePositionAndValue: check(eq(row, directory.methods[i]), 'Original row changed: ' + row.id),
  canonicalSerializedSha256: sha(JSON.stringify(row)),
  currentSerializedSha256: sha(JSON.stringify(directory.methods[i]))
}));
check(original.methods.length === 8 && directory.methods.length === 21 && definitions.length === 13, '8 + 13 = 21 membership mismatch');
check(new Set(directory.methods.map(m => m.id)).size === 21, 'Duplicate method IDs');
const lastClose = originalBytes.toString('utf8').lastIndexOf('\n  ]');
const prefixPreserved = lastClose >= 0 && currentDirectoryBytes.subarray(0, lastClose).equals(originalBytes.subarray(0, lastClose));
check(prefixPreserved, 'Original serialized directory prefix changed');
const receipt = json(bundle + 'receipt.json'), report = text(bundle + 'report.md');
const copies = receipt.evidence.map(e => {
  const bundled = read(bundle + e.file);
  const source = read(cohort + e.repositorySource);
  return { file: e.file, source: cohort + e.repositorySource, expected: e.sha256,
    bundledSha256: sha(bundled), sourceSha256: sha(source),
    match: check(sha(bundled) === e.sha256 && bundled.equals(source), 'Bundled/source evidence mismatch: ' + e.file) };
});
const a = json(bundle + 'a-bindings.json'), b = json(bundle + 'b-decision.json');
const d = json(bundle + 'd-repair-recheck.json'), ds = json(bundle + 'd-owner-bindings.json');
const sourceBindings = {
  a: a.files.filter(x => x.role === 'A-method-or-original-owner').map(x => ({ path: x.path, sha256: x.finalSha256 })),
  b: b.reviewedFiles,
  d: ds.currentProductBindings
};
const aReport = text(bundle + 'a-review.md');
text(bundle + 'b-review.md'); text(bundle + 'd-review.md');
check(aReport.includes('All seven A method bodies are instruction-level READY'), 'A body acceptance not explicit');
check(b.decision === 'ACCEPT_BODY_AND_METADATA_SNAPSHOT_PENDING_PARENT_RELEASE_CHECKS', 'B acceptance mismatch');
check(d.finalVerdict === 'READY' && ds.disposition === 'READY_UNCHANGED_FOR_D5', 'D acceptance mismatch');
check(receipt.methodBindings.length === 13, 'Collation binding count');
const rows = directory.methods.slice(8).map((m,i) => {
  const def = definitions[i], p = 'product/' + m.resource;
  const binding = receipt.methodBindings[i];
  const source = sourceBindings[def.reviewLane]?.find(x => x.path === p);
  const actual = hash(p);
  const metaPath = 'product/skills/' + m.owner + '/skill.json';
  const entryPath = 'product/skills/' + m.owner + '/SKILL.md';
  const metadata = json(metaPath);
  const entry = read(entryPath, 'hash and selected lazy-reference link context only').toString('utf8');
  const relative = 'references/' + def.file;
  const paragraphs = entry.split(/\r?\n\r?\n/);
  const contexts = paragraphs.filter(t => t.includes('](' + relative + ')'));
  const insideOwner = m.resource === 'skills/' + def.owner + '/' + relative && !m.resource.includes('..') && m.owner === def.owner && metadata.id === def.owner;
  const identityMatch = m.id === 'cohesive-' + def.file.replace(/\.md$/,'') && m.title === def.title && eq(m.tasks,[def.task]) && eq(m.exclusions,[def.exclusion]);
  const hashChain = !!source && source.sha256 === actual && actual === m.resourceSha256 && binding.path === p && binding.sha256 === actual && binding.independentLane === def.reviewLane;
  const pointers = pointer(receipt,m.review.resourceBinding.pathPointer) === p && pointer(receipt,m.review.resourceBinding.sha256Pointer) === actual;
  const evidenceHashes = m.review.receipt === 'evidence/method-reviews/cohesive-v1/receipt.json' &&
    m.review.report === 'evidence/method-reviews/cohesive-v1/report.md' &&
    m.review.receiptSha256 === hash('product/' + m.review.receipt) &&
    m.review.reportSha256 === hash('product/' + m.review.report);
  const statusBoundary = m.documentStatus === 'independently-document-reviewed' && m.outcomeStatus === 'not-performance-qualified' &&
    m.executionEvidence.includes('No general performance or live-domain result is asserted.');
  const route = metadata.resources.includes(relative) && contexts.length > 0;
  const pass = [insideOwner,identityMatch,hashChain,pointers,evidenceHashes,statusBoundary,route].every(Boolean);
  check(pass, 'Method integration mismatch: ' + m.id);
  return { id:m.id, owner:m.owner, resource:p, sha256:actual, reviewLane:def.reviewLane,
    insideOwner, identityMatch, independentReviewHashChain:hashChain, pointers, evidenceHashes, statusBoundary,
    declaredAndLinked:route, lazyLinkContexts:contexts, pass };
});
check(directory.authority === 'none' && directory.activation === 'none' && directory.coverage === 'selected-bundled-methods', 'Directory authority/coverage changed');
check(receipt.authority === 'none' && receipt.activation === 'none' && receipt.scope.includes('not a new independent review, source-rights clearance or performance qualification'), 'Collation claim boundary');
check(report.includes('not a blind comparison') && report.includes('They do not establish'), 'Report evidence boundary');

const coverage = json(cohort + 'coverage-verification.json');
check(coverage.baseline === baseline, 'Coverage baseline differs');
const actualIds = fs.readdirSync(path.join(root,'product/skills'),{withFileTypes:true})
  .filter(d => d.isDirectory() && fs.existsSync(path.join(root,'product/skills',d.name,'SKILL.md'))).map(d=>d.name).sort();
const declaredIds = coverage.entries.map(e=>e.id).sort();
check(eq(actualIds,declaredIds) && new Set(declaredIds).size === 93, 'Coverage entry inventory mismatch');
const coverageRows = coverage.entries.map(e => {
  const p = 'product/skills/' + e.id + '/SKILL.md';
  const current = hash(p), old = sha(gitBytes(p));
  const pass = current === e.currentSha256 && old === e.baselineSha256 && e.changed === (current !== old);
  check(pass,'Coverage byte/changed mismatch: '+e.id);
  return { id:e.id, baselineSha256:old, currentSha256:current, changed:current!==old, pass };
});
const categories = new Set(actualIds.map(id=>json('product/skills/'+id+'/skill.json').category));
const changed = coverageRows.filter(r=>r.changed).length;
const lanes = Object.fromEntries(['a','b'].map(l=>[l,coverage.entries.filter(e=>e.authorLane===l).length]));
check(actualIds.length === 93 && changed === 19 && coverageRows.length-changed === 74 && categories.size === 21, 'Coverage aggregate mismatch');
check(eq(lanes,{a:37,b:56}) && eq(coverage.completeEntrypointReadsReported,lanes), 'Reported A/B inventory mismatch');
// Author full-read claims are not converted to independent semantic reviews.

const finalAReport = text(cohort + 'review-a-final-nietzsche/REVIEW.md');
const finalAReview = json(cohort + 'review-a-final-nietzsche/review.json');
const finalABind = json(cohort + 'review-a-final-nietzsche/final-bind.json');
const finalA = finalABind.files.filter(f=>f.role==='A-method-or-original-owner').map(f=>({
  path:f.path, expected:f.sha256, actual:hash(f.path), match:check(hash(f.path)===f.sha256,'Final A binding drift: '+f.path)
}));
check(finalA.length===21 && finalAReport.includes('A-R2-B is closed'), 'Final A closure incomplete');
const finalAAlreadyBundled = receipt.evidence.some(e=>e.repositorySource.startsWith('review-a-final-nietzsche/'));
const stability = [...reads.values()].filter(r=>!r.revision).map(r=>({
  path:r.path, sha256:r.sha256, stable:sha(fs.readFileSync(path.resolve(root,r.path)))===r.sha256
}));
check(stability.every(r=>r.stable), 'Inputs changed during audit');
console.log(JSON.stringify({
  schema:'cohesive-integration-audit-v1',status:failures.length?'REPAIR':'PASS',failures,
  baseline,contextReleaseSuppliedByParent:'9f63c0a4cd105d03a7988ace2206b7cf9474a728b513ad98b528ba7186967503',
  directory:{sha256:sha(currentDirectoryBytes),total:directory.methods.length,original:oldRows.length,added:rows.length,originalSerializedPrefixPreserved:prefixPreserved,oldRows},
  rows,copiedEvidence:copies,
  coverage:{receiptSha256:hash(cohort+'coverage-verification.json'),entrypoints:actualIds.length,categories:categories.size,changed,retained:coverageRows.length-changed,reportedAuthorLaneCounts:lanes,rows:coverageRows},
  finalA:{reportSha256:hash(cohort+'review-a-final-nietzsche/REVIEW.md'),decision:finalAReview,bindings:finalA,alreadyBundled:finalAAlreadyBundled,
    publicationNote:'Parent announced additive final A closure evidence and review-directory/manifest rebinding after suite. That future assembly is not certified by this snapshot.'},
  inputStability:{checked:stability.length,allStable:stability.every(r=>r.stable),changed:stability.filter(r=>!r.stable)},
  readSet:[...reads.values()],
  limits:['No assembler/build/suite/product-code execution.','Hashes and selected routing contexts only; no method-body reacceptance or A self-review.','A/B/D independent content judgments are attributed to their actual source reports, not this mechanical reviewer.','Parent release identity and 334-file count are context, not independently recomputed release acceptance.','Reported 13/13 public CLI cases are not rerun or adopted here.','Coverage proves body identity and changed counts, not every historical author reading event or corpus/reference coverage.','No performance, rights, deployment, universal retrieval or global release qualification.']
}));

