// Author-run structural and synthetic method checks, not agent evaluation.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const packet = resolve(root, 'artifacts/qualification/cohesive-product-20261015/lane-b');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const audit = readJson(resolve(packet, 'audit.json'));
const reads = readJson(resolve(packet, 'read-set.json'));
const candidate = readJson(resolve(packet, 'candidate.json'));

test('audit covers every current metadata-classified lane entrypoint exactly once', () => {
  const expected = readdirSync(resolve(root, 'product/skills'), { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => readJson(resolve(root, 'product/skills', dir.name, 'skill.json')))
    .filter(meta => audit.categories.includes(meta.category))
    .map(meta => meta.id).sort();
  assert.deepEqual(audit.decisions.map(row => row.id).sort(), expected);
  assert.equal(new Set(expected).size, expected.length);
  for (const row of audit.decisions) {
    assert.ok(['retain', 'refine', 'gap'].includes(row.decision));
    assert.ok(row.reason.length > 40);
  }
});

test('baseline hashes bind all audited entrypoints to canonical Git bytes', () => {
  for (const row of audit.decisions) {
    const original = execFileSync('git', ['show', `${audit.canonicalCommit}:${row.path}`], { cwd: root });
    assert.equal(digest(original), row.baselineSha256, row.id);
    assert.equal(reads.sources.find(source => source.path === row.path)?.sha256,
      row.baselineSha256, row.id);
  }
});

test('candidate snapshot names actual changed bytes without transferring baseline review', () => {
  assert.equal(candidate.independentReview, 'pending');
  assert.equal(candidate.agentBehaviorEvaluation, 'not run');
  for (const row of audit.decisions) {
    const current = digest(readFileSync(resolve(root, row.path)));
    assert.equal(current, candidate.entrypoints[row.id], row.id);
    if (row.decision === 'retain') assert.equal(current, row.baselineSha256, row.id);
    if (row.decision === 'refine') assert.notEqual(current, row.baselineSha256, row.id);
  }
});

test('read historical references and attribution metadata remain byte-identical', () => {
  for (const source of reads.sources.filter(s =>
    s.path.startsWith('product/skills/') &&
    (s.path.includes('/references/') || s.path.endsWith('/skill.json')))) {
    assert.equal(digest(readFileSync(resolve(root, source.path))), source.sha256, source.path);
  }
});

test('changed entrypoints and new reference have portable, existing local links', () => {
  for (const file of candidate.changedFiles) {
    const text = readFileSync(resolve(root, file), 'utf8');
    assert.doesNotMatch(text, /(?:[A-Z]:[\\/]|\/Users\/|\/home\/)/);
    for (const [, link] of text.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(?:https?:|#)/.test(link)) continue;
      const target = resolve(root, dirname(file), link.split('#')[0]);
      const within = relative(resolve(root, 'product/skills'), target);
      assert.ok(!within.startsWith(`..${sep}`) && within !== '..', file);
      assert.ok(existsSync(target), `${file}: ${link}`);
    }
  }
});

// Synthetic local application of the new diagnostic experiment: a callback can
// settle after a newer request. No browser, provider or product runtime is used.
function searchView(guardRevision) {
  let latest = 0;
  let display = null;
  return {
    begin() {
      const revision = ++latest;
      return (value, error = false) => {
        if (!guardRevision || revision === latest) display = { value, error };
      };
    },
    read: () => display,
  };
}

test('reverse-completion probe exposes stale-result defect; revision repair preserves controls', () => {
  const broken = searchView(false);
  const oldBroken = broken.begin();
  const newBroken = broken.begin();
  newBroken('new'); oldBroken('old');
  assert.deepEqual(broken.read(), { value: 'old', error: false });
  assert.throws(() => assert.equal(broken.read().value, 'new'), assert.AssertionError);

  const repaired = searchView(true);
  const old = repaired.begin();
  const current = repaired.begin();
  current('new'); old('old');
  assert.deepEqual(repaired.read(), { value: 'new', error: false });
  repaired.begin()('single');
  assert.deepEqual(repaired.read(), { value: 'single', error: false });
  const prior = repaired.begin();
  repaired.begin()('unavailable', true); prior('obsolete');
  assert.deepEqual(repaired.read(), { value: 'unavailable', error: true });
});

test('boundary observations distinguish storage, API cache and client-state explanations', () => {
  const expected = ['persistence', 'server-cache', 'client-state'];
  const observations = [
    { stored: 'old', api: 'old', received: 'old', rendered: 'old' },
    { stored: 'new', api: 'old', received: 'old', rendered: 'old' },
    { stored: 'new', api: 'new', received: 'new', rendered: 'old' },
  ];
  const firstDivergence = x => x.stored !== 'new' ? 'persistence'
    : x.api !== x.stored ? 'server-cache'
      : x.rendered !== x.received ? 'client-state' : 'unresolved';
  assert.deepEqual(observations.map(firstDivergence), expected);
  // A save acknowledgment is identical in all three, so it cannot discriminate.
  assert.equal(new Set(observations.map(() => 'acknowledged')).size, 1);
});

test('task-level pairing prevents repeated easy runs from masking a difficult-task regression', () => {
  const tasks = [
    { baseline: Array(10).fill(0.8), candidate: Array(10).fill(1) },
    { baseline: [1], candidate: [0] },
  ];
  const mean = values => values.reduce((a, b) => a + b, 0) / values.length;
  const pooledDelta = mean(tasks.flatMap(x => x.candidate)) - mean(tasks.flatMap(x => x.baseline));
  const pairedDelta = mean(tasks.map(x => mean(x.candidate) - mean(x.baseline)));
  assert.ok(pooledDelta > 0); // Wrong unit of analysis reverses the conclusion.
  assert.ok(Math.abs(pairedDelta - (-0.4)) < 1e-12);
});

test('binary paired report preserves regressions, neither-success and invalid outcomes', () => {
  const cases = [
    [true, true], [false, true], [true, false], [false, false],
    [true, null], // Invalid candidate output remains missing, not a win or zero-cost run.
  ];
  const counts = { both: 0, candidateOnly: 0, baselineOnly: 0, neither: 0, invalid: 0 };
  for (const [baseline, next] of cases) {
    if (next === null) counts.invalid++;
    else if (baseline && next) counts.both++;
    else if (next) counts.candidateOnly++;
    else if (baseline) counts.baselineOnly++;
    else counts.neither++;
  }
  assert.deepEqual(counts, { both: 1, candidateOnly: 1, baselineOnly: 1, neither: 1, invalid: 1 });
  assert.equal(Object.values(counts).reduce((a, b) => a + b), cases.length);
});

test('dependency-specific revalidation distinguishes schema change from unrelated note', () => {
  const checks = { adapter: ['schema', 'adapter'], parser: ['parser'] };
  const invalidated = changed => Object.entries(checks)
    .filter(([, inputs]) => inputs.some(input => changed.includes(input))).map(([name]) => name);
  assert.deepEqual(invalidated(['notes']), []);
  assert.deepEqual(invalidated(['schema']), ['adapter']);
  assert.deepEqual(invalidated(['parser', 'adapter']), ['adapter', 'parser']);
  // These declared edges are complete only for this toy fixture, not arbitrary repositories.
});
