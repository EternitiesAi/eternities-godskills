// Read-only authoring validation. This is not a product builder or workflow executor.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile, readdir, lstat} from 'node:fs/promises';
import {dirname, resolve, relative, isAbsolute, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const sidecar = dirname(fileURLToPath(import.meta.url));
const root = resolve(sidecar, '../../..');
const ids = ['completeness-and-consistency-audit', 'long-horizon-work-continuity'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const within = (parent, child) => {
  const rel = relative(parent, child);
  return !isAbsolute(rel) && rel !== '..' && !rel.startsWith('../') && !rel.startsWith('..\\');
};
const safeResource = value => typeof value === 'string' && /^references\/[a-z0-9-]+\.md$/.test(value);
const wordCount = value => value.trim().split(/\s+/u).length;
const permittedTasks = new Set(['research', 'plan', 'build', 'verify', 'recover', 'orchestrate', 'create', 'communicate']);
const expectedResources = {
  'completeness-and-consistency-audit': ['references/coverage-template.md', 'references/worked-audits.md'],
  'long-horizon-work-continuity': ['references/continuity-packet.md', 'references/interruption-cases.md', 'references/uncertain-effect-recovery.md']
};
const report = {
  schema: 'cognitive-workflows-author-checks-v1',
  authorSlice: 'sol-c',
  evidenceLevel: 'Structural checks and source freshness; no independent instruction or behavioral evaluation',
  skills: [],
  sources: [],
  remainingGates: ['Independent exact-byte instruction review', 'Independent raw fixture applications', 'Parent real-catalog discovery checks', 'Parent product integrity, export, release and installation gates']
};

async function walk(dir, prefix = '') {
  const result = [];
  for (const entry of (await readdir(dir, {withFileTypes: true})).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(dir, entry.name);
    const stat = await lstat(path);
    assert(!stat.isSymbolicLink(), `Linked draft resource: ${path}`);
    const local = prefix + entry.name;
    if (stat.isDirectory()) result.push(...await walk(path, local + '/'));
    else {
      assert(stat.isFile(), `Non-file draft resource: ${path}`);
      result.push(local);
    }
  }
  return result;
}

for (const id of ids) {
  const dir = resolve(root, 'product/skills', id);
  assert(!(await lstat(dir)).isSymbolicLink(), `Linked skill: ${id}`);
  const files = await walk(dir);
  assert.equal(new Set(files.map(file => file.toLowerCase())).size, files.length, `Case collision: ${id}`);
  const meta = JSON.parse(await readFile(join(dir, 'skill.json'), 'utf8'));
  assert.equal(meta.id, id);
  assert.equal(meta.category, 'agent-workflows');
  assert.equal(meta.maturity, 'draft', 'Author cannot promote maturity');
  assert(typeof meta.summary === 'string' && meta.summary.trim().length > 0 && meta.summary.length <= 1000);
  for (const key of ['triggers', 'antiTriggers', 'taskTypes', 'related', 'resources']) {
    assert(Array.isArray(meta[key]) && meta[key].length > 0, `${id}: missing ${key}`);
    assert(meta[key].every(value => typeof value === 'string' && value.trim().length > 0 && value.length <= 500));
    assert.equal(new Set(meta[key]).size, meta[key].length, `${id}: duplicate ${key}`);
  }
  assert(meta.taskTypes.every(task => permittedTasks.has(task)), `${id}: unsupported task type`);
  assert(meta.resources.every(safeResource), `${id}: escaping or unsupported resource`);
  assert.deepEqual([...meta.resources].sort(), expectedResources[id]);
  assert.deepEqual([...files].sort(), ['SKILL.md', 'skill.json', ...meta.resources].sort(), `${id}: unexpected or missing file`);
  assert(Array.isArray(meta.provenance) && meta.provenance.length > 0);
  for (const source of meta.provenance) {
    for (const key of ['kind', 'source', 'note']) assert(typeof source[key] === 'string' && source[key].trim());
  }
  for (const relatedId of meta.related) {
    assert(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(relatedId) && relatedId !== id);
    const relatedMeta = JSON.parse(await readFile(resolve(root, 'product/skills', relatedId, 'skill.json'), 'utf8'));
    assert.equal(relatedMeta.id, relatedId, `${id}: missing related owner ${relatedId}`);
  }
  const inspected = [];
  let entrypointWords;
  for (const file of files) {
    const bytes = await readFile(join(dir, file));
    const text = bytes.toString('utf8');
    assert(!/(?:[A-Z]:[\\/]\S|\\\\[^\s\\]+\\|\/(?:Users|home)\/[a-z][^\s/]*\/)/i.test(text), `${id}/${file}: workstation path`);
    assert(!/\[TODO:|\bTBD\b/.test(text), `${id}/${file}: unfinished scaffold`);
    if (file.endsWith('.md')) {
      for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const target = match[1].split('#')[0];
        assert(!/^[a-z]+:/i.test(target), `${id}/${file}: external instruction link`);
        const resolved = resolve(dirname(join(dir, file)), target);
        assert(within(dir, resolved), `${id}/${file}: nonlocal link`);
        assert((await lstat(resolved)).isFile(), `${id}/${file}: missing linked resource`);
        const local = relative(dir, resolved).replaceAll('\\', '/');
        assert(meta.resources.includes(local), `${id}/${file}: undeclared linked resource`);
      }
    }
    if (file === 'SKILL.md') {
      const front = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
      assert(front, `${id}: missing frontmatter`);
      assert(new RegExp(`^name: ${id}$`, 'm').test(front[1]));
      assert(/^description: \S+/m.test(front[1]));
      const description = /^description: (.+)$/m.exec(front[1])[1];
      assert(description.length <= 1024);
      for (const resource of meta.resources) assert(text.includes(`](${resource})`), `${id}: unrouted resource ${resource}`);
      entrypointWords = wordCount(text.slice(front[0].length));
    }
    inspected.push({path: `product/skills/${id}/${file}`, bytes: bytes.length, sha256: digest(bytes), words: file.endsWith('.md') ? wordCount(text) : null});
  }
  report.skills.push({id, maturity: meta.maturity, entrypointBodyWords: entrypointWords, files: inspected, result: 'passed'});
}

const ledger = JSON.parse(await readFile(join(sidecar, 'source-ledger.json'), 'utf8'));
const allowedHostSources = new Set(['host-skill-creator', 'host-sovereign-refinery', 'host-refinery-cards']);
for (const source of ledger.sources) {
  const hostSource = allowedHostSources.has(source.id);
  if (!hostSource) assert(!isAbsolute(source.path) && !/^[A-Z]:/i.test(source.path));
  const path = hostSource ? source.path : resolve(root, source.path);
  if (!hostSource) assert(within(root, path));
  const actual = digest(await readFile(path));
  assert.equal(actual, source.sha256, `Source changed after inspection: ${source.id}`);
  assert(['independent-implementation', 'pattern-reference', 'rejected', 'deferred'].includes(source.disposition));
  assert(typeof source.licenseClass === 'string' && source.licenseClass.length > 0);
  report.sources.push({id: source.id, sha256: actual, result: 'matched'});
}

report.result = 'passed';
process.stdout.write(JSON.stringify(report, null, 2) + '\n');
