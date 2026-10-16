import {readFile, lstat} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

const check = (ok, message) => {if (!ok) throw new Error(message);};
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const id = value => typeof value === 'string' && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value);
const sha = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const text = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 500 && !/[\r\n]/.test(value);
const path = value => typeof value === 'string' && value.split('/').every(part => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(part) && part !== '..' && !/[.]$/.test(part));
const keys = (value, required, optional = []) => value && !Array.isArray(value) && typeof value === 'object' && required.every(key => Object.hasOwn(value, key)) && Object.keys(value).every(key => required.includes(key) || optional.includes(key));
function pointer(record, locator) {
  check(typeof locator === 'string' && /^\/(?:[a-zA-Z0-9_-]+)(?:\/[a-zA-Z0-9_-]+)*$/.test(locator), 'Invalid Method review pointer');
  for (const part of locator.slice(1).split('/')) {
    check(record && typeof record === 'object' && Object.hasOwn(record, part), 'Missing Method review pointer');
    record = record[part];
  }
  return record;
}

export async function inspectMethodDirectory(root, catalog) {
  const file = join(root, 'METHODS.v1.json');
  try {check((await lstat(file)).isFile(), 'Invalid method directory file');}
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    try {await lstat(join(root, 'METHODS.v1.md'));}
    catch (missing) {if (missing.code === 'ENOENT') return null; throw missing;}
    throw new Error('Method directory metadata missing');
  }
  const data = JSON.parse(await readFile(file, 'utf8'));
  check(keys(data, ['schema', 'authority', 'activation', 'coverage', 'methods']) && data.schema === 'eternities-godskills-method-directory-v1' && data.authority === 'none' && data.activation === 'none' && data.coverage === 'selected-bundled-methods', 'Invalid method directory envelope');
  check(Array.isArray(data.methods) && data.methods.length > 0 && data.methods.length <= 500, 'Invalid method directory membership');
  const owners = new Map(catalog.skills.map(skill => [skill.id, skill]));
  const seen = new Set();
  for (const method of data.methods) {
    check(keys(method, ['id', 'title', 'owner', 'resource', 'resourceSha256', 'tasks', 'exclusions', 'documentStatus', 'executionEvidence', 'outcomeStatus'], ['anchor', 'review']), 'Invalid Method fields');
    check(id(method.id) && !seen.has(method.id), 'Invalid or duplicate Method ID'); seen.add(method.id);
    check(text(method.title) && text(method.executionEvidence), 'Invalid Method text');
    for (const field of ['tasks', 'exclusions']) check(Array.isArray(method[field]) && method[field].length > 0 && method[field].length <= 6 && method[field].every(text), 'Invalid Method ' + field);
    const owner = owners.get(method.owner);
    check(owner && path(method.resource) && method.resource.endsWith('.md') && owner.resources.some(resource => resource.path === method.resource), 'Invalid or undeclared method resource');
    check(sha(method.resourceSha256) && digest(await readFile(join(root, method.resource))) === method.resourceSha256, 'Stale method resource: ' + method.id);
    if (method.anchor !== undefined) {
      check(typeof method.anchor === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(method.anchor), 'Invalid Method anchor');
      const body = await readFile(join(root, method.resource), 'utf8');
      const headings = [...body.matchAll(/^#{1,6}\s+(.+)$/gm)].map(match => match[1].trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));
      check(headings.includes(method.anchor), 'Missing Method anchor: ' + method.id);
    }
    check(method.outcomeStatus === 'not-performance-qualified', 'Unsupported Method outcome status');
    check(['independently-document-reviewed', 'not-assessed-by-this-overlay'].includes(method.documentStatus), 'Unsupported Method document status');
    if (method.documentStatus === 'independently-document-reviewed') {
      check(keys(method.review, ['scope', 'receipt', 'receiptSha256', 'report', 'reportSha256', 'resourceBinding']) && text(method.review.scope) && keys(method.review.resourceBinding, ['pathPointer', 'sha256Pointer']), 'Missing Method review binding');
      for (const kind of ['receipt', 'report']) {
        const reference = method.review[kind];
        check(path(reference) && reference.startsWith('evidence/method-reviews/') && reference.endsWith(kind === 'receipt' ? '.json' : '.md') && sha(method.review[kind + 'Sha256']), 'Invalid Method review path or digest');
        check(digest(await readFile(join(root, reference))) === method.review[kind + 'Sha256'], 'Stale method review: ' + method.id);
      }
      const receipt = JSON.parse(await readFile(join(root, method.review.receipt), 'utf8'));
      check(pointer(receipt, method.review.resourceBinding.pathPointer) === 'product/' + method.resource && pointer(receipt, method.review.resourceBinding.sha256Pointer) === method.resourceSha256, 'Stale method review binding: ' + method.id);
    } else check(method.review === undefined, 'Unassessed Method cannot inherit a review');
  }
  return data;
}

const md = value => value.replace(/[\\|[\]`*]/g, char => '\\' + char);
export function renderMethodDirectory(data) {
  const lines = ['# Selected bundled methods', '',
    'This is a compact directory of selected methods, not every skill or source obligation. Read the selected complete SKILL.md before its conditional method. Do not load all owners, references, or review receipts.', '',
    'Choose by the actual task and exclusions, not by a match score. Discovery grants no authority and activates nothing. Use ordinary agent competence when no method fits.', '',
    '| Task | Owner entrypoint | Conditional method | Document status | Outcome status |',
    '| --- | --- | --- | --- | --- |'];
  for (const method of data.methods) lines.push(`| ${method.tasks.map(md).join('; ')} | [${method.owner}](skills/${method.owner}/SKILL.md) | [${md(method.title)}](${method.resource}${method.anchor ? '#' + method.anchor : ''}) | ${method.documentStatus} | ${method.outcomeStatus} |`);
  lines.push('', '## Review and execution are separate', '',
    'An original method body may still say DRAFT. The exact-hash row below records later independent document review without relabeling that historical body or qualifying runtime outcomes. Parent skill maturity does not transfer to every reference. Changed method bytes make the row stale: build/validate must refuse until its identity and status are reconsidered.', '',
    'These are publisher evidence statements. Digests bind bytes, not publisher authenticity, reviewer identity, source rights, or truth. Bundled review records are optional historical evidence, not executable policy; workstation paths inside them describe the review environment and are not receiving-machine dependencies.', '');
  for (const method of data.methods) {
    lines.push(`### ${md(method.title)}`, '',
      `- Exclusions: ${method.exclusions.map(md).join('; ')}.`,
      `- Exact method resource SHA-256: \`${method.resourceSha256}\`.`,
      `- Document axis: ${method.documentStatus}.`,
      `- Execution evidence: ${md(method.executionEvidence)}`,
      `- Outcome axis: ${method.outcomeStatus}.`);
    if (method.review) lines.push(`- Reviewed scope: ${md(method.review.scope)}`, `- Optional independent [report](${method.review.report}) and [receipt](${method.review.receipt}); receipt SHA-256: \`${method.review.receiptSha256}\`.`);
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}
