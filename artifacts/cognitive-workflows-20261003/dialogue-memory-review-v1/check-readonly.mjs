// Scoped read-only review checks. No builder, product write or fixture access.
import {readFile, readdir, lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve, dirname, relative, isAbsolute, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const ids = ['interpersonal-understanding-and-dialogue', 'memory-retention-and-recovery'];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const idPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const safeRel = path => typeof path === 'string' && path.length > 0 && !path.includes('\\') && !path.includes(':') && !path.startsWith('/') && path.split('/').every(part => part && part !== '.' && part !== '..' && !/[. ]$|[<>"|?*\x00-\x1f]/.test(part) && !/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part));
const load = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const freezePath = 'artifacts/cognitive-workflows-20261003/candidate-freeze-v1.json';
const freezeBytes = await readFile(resolve(root, freezePath));
const freeze = JSON.parse(freezeBytes.toString('utf8'));
const taxonomy = await load('product/taxonomy.json');
const report = {
  schema: 'dialogue-memory-instruction-review-checks-v1',
  scope: ids,
  evidence: 'Frozen identity and scoped structural checks only; no independent raw fixture applications',
  freeze: {path: freezePath, sha256: sha256(freezeBytes)},
  skills: [],
  expectedDraftMaturity: true,
  productBuilderInvoked: false,
  providersOrDescendantsInvoked: false,
  evaluationDirectoriesRead: false
};

for (const id of ids) {
  const dir = resolve(root, 'product/skills', id);
  const meta = await load(`product/skills/${id}/skill.json`);
  const frozen = freeze.files.filter(file => file.path.startsWith(`product/skills/${id}/`));
  const issues = [];
  const inspected = [];
  const add = (kind, detail) => issues.push({kind, detail});
  if (frozen.length !== 3) add('inventory', 'Expected three frozen candidate files');
  if (meta.id !== id) add('metadata-id', meta.id);
  if (!idPattern.test(meta.id)) add('metadata-id-pattern', meta.id);
  for (const field of ['category', 'summary']) {
    if (typeof meta[field] !== 'string' || !meta[field].trim().length || meta[field].length > 1000) add('metadata-text', field);
  }
  if (!idPattern.test(meta.category)) add('category-pattern', meta.category);
  if (!taxonomy.categories.includes(meta.category)) add('category', meta.category);
  if (meta.maturity !== 'draft') add('maturity', 'Frozen stage expects draft');
  const unsupportedTaskTypes = meta.taskTypes.filter(task => !taxonomy.taskTypes.includes(task));
  for (const task of unsupportedTaskTypes) add('unsupported-task-type', task);
  for (const key of ['triggers', 'antiTriggers', 'taskTypes', 'related', 'resources']) {
    if (!Array.isArray(meta[key]) || meta[key].some(value => typeof value !== 'string' || !value.trim() || value.length > 500) || new Set(meta[key]).size !== meta[key].length) add('metadata-array', key);
  }
  if (!meta.triggers.length || !meta.taskTypes.length) add('missing-trigger-or-task', id);
  if (!Array.isArray(meta.provenance) || !meta.provenance.length || !meta.provenance.every(source => source && ['kind', 'source', 'note'].every(key => typeof source[key] === 'string' && source[key].length > 0))) add('provenance-fields', id);
  if (!(await lstat(dir)).isDirectory() || (await lstat(dir)).isSymbolicLink()) add('skill-directory', id);
  const actualInventory = [];
  async function inventory(current, prefix = '') {
    for (const entry of await readdir(current, {withFileTypes: true})) {
      const file = join(current, entry.name);
      if ((await lstat(file)).isSymbolicLink()) {add('linked-file', prefix + entry.name); continue;}
      if (entry.isDirectory()) await inventory(file, prefix + entry.name + '/');
      else {
        if (!(await lstat(file)).isFile()) add('nonregular-file', prefix + entry.name);
        if (!safeRel(prefix + entry.name)) add('unsafe-file-path', prefix + entry.name);
        actualInventory.push(`product/skills/${id}/${prefix}${entry.name}`);
      }
    }
  }
  await inventory(dir);
  if (actualInventory.length > 100) add('file-count', actualInventory.length);
  if (new Set(actualInventory.map(path => path.toLowerCase())).size !== actualInventory.length) add('case-collision', id);
  if (JSON.stringify(actualInventory.sort()) !== JSON.stringify(frozen.map(file => file.path).sort())) add('inventory', 'Current files differ from freeze membership');
  for (const file of frozen) {
    const bytes = await readFile(resolve(root, file.path));
    const text = bytes.toString('utf8');
    const actual = sha256(bytes);
    inspected.push({path: file.path, bytes: bytes.length, expectedSha256: file.sha256, actualSha256: actual, matched: actual === file.sha256});
    if (actual !== file.sha256) add('frozen-identity', file.path);
    if (/(?:[A-Z]:[\\/]\S|\\\\[^\s\\]+\\|\/(?:Users|home)\/[a-z][^\s/]*\/)/i.test(text)) add('workstation-path', file.path);
    if (/\[TODO:|\bTBD\b/.test(text)) add('unfinished-scaffold', file.path);
    if (file.path.endsWith('/SKILL.md')) {
      const front = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
      if (!front || !new RegExp(`^name: ${id}$`, 'm').test(front[1]) || !/^description: \S/m.test(front[1])) add('frontmatter', file.path);
    }
    if (file.path.endsWith('.md')) for (const link of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = link[1].split('#')[0];
      const resolved = resolve(dirname(resolve(root, file.path)), target);
      const local = relative(dir, resolved).replaceAll('\\', '/');
      if (isAbsolute(local) || local.startsWith('../') || /^[a-z]+:/i.test(target) || !meta.resources.includes(local)) add('resource-link', target);
      else if (!(await lstat(resolved)).isFile()) add('missing-resource', local);
    }
  }
  for (const resource of meta.resources) {
    if (!safeRel(resource)) add('unsafe-resource-path', resource);
    if (!frozen.some(file => file.path === `product/skills/${id}/${resource}`)) add('undeclared-resource', resource);
  }
  for (const related of [...meta.related, ...(meta.specializes ? [meta.specializes] : [])]) {
    if (!idPattern.test(related)) add('related-id-pattern', related);
    if (related === id || !(await lstat(resolve(root, 'product/skills', related, 'SKILL.md'))).isFile()) add('related-owner', related);
  }
  const sourcePins = [];
  for (const source of meta.provenance) {
    if (!source.source.startsWith('product/skills/') || source.source.includes('..') || isAbsolute(source.source)) throw new Error('Unexpected provenance path');
    const expected = /SHA-256 ([0-9a-f]+)/.exec(source.note)?.[1];
    const actual = sha256(await readFile(resolve(root, source.source)));
    const matched = expected === actual && expected.length === 64;
    sourcePins.push({path: source.source, expectedSha256: expected, actualSha256: actual, matched});
    if (!matched) add('source-pin', source.source);
  }
  report.skills.push({id, frozenFiles: inspected, category: meta.category, maturity: meta.maturity, unsupportedTaskTypes, sourcePins, checkedProductSchema: ['ID and category patterns', 'Category/summary string bounds', 'Array types, member bounds and uniqueness', 'Nonempty triggers and tasks', 'Supported task types', 'Draft-stage maturity exception', 'Required provenance fields', 'File count, ordinary files, symlink and case collision checks', 'Safe resource paths, links and inventory', 'Frontmatter ID/description', 'Existing related/specialization owners', 'Workstation paths', 'Frozen hashes', 'Source pins'], structuralIssues: issues, structuralDisposition: issues.length ? 'REPAIR' : 'READY'});
}

report.structuralDisposition = report.skills.some(skill => skill.structuralDisposition === 'REPAIR') ? 'REPAIR' : 'READY';
report.note = 'Manual instruction findings in review.md additionally determine semantic readiness; structural READY alone is not instruction acceptance.';
process.stdout.write(JSON.stringify(report, null, 2) + '\n');
