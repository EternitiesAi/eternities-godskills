// Read-only replay of the frozen development cases; stdout is the full receipt.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {searchCatalog} from '../../../../product/lib/product.mjs';
import {affirmativeRequestClauses} from '../../../../product/lib/request-scope.mjs';
import {lexicalIntentMatch, lexicalQueryEvidence} from '../../../../product/lib/discovery.mjs';

const root = new URL('../../../../', import.meta.url);
const freezeBytes = await readFile(new URL('frozen-cases.json', import.meta.url));
const frozen = JSON.parse(freezeBytes);
const catalog = JSON.parse(await readFile(new URL('product/catalog.json', root), 'utf8'));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const owners = [...new Set(frozen.cases.flatMap(item => [
  ...(item.expected.includes || []), ...(item.expected.excludes || []),
  ...(item.expected.precedesIfPresent || []).flat(),
]))].sort();
const paths = [
  'docs/superpowers/specs/2026-10-16-usefulness-release.md',
  'docs/superpowers/plans/2026-10-16-usefulness-release.md',
  'product/catalog.json', 'product/release.json', 'product/README.md', 'product/DISCOVERY.md',
  'product/lib/product.mjs', 'product/lib/discovery.mjs',
  'product/lib/request-scope.mjs', 'product/lib/selection-boundary.mjs',
  ...owners.flatMap(id => [`product/skills/${id}/SKILL.md`, `product/skills/${id}/skill.json`]),
  'product/skills/evidence-linked-learning-design/references/practice-and-transfer-v1.md',
  'artifacts/releases/godskills-product-20261013-454091b1.zip',
  'artifacts/releases/godskills-product-20261013-ca5d2adb.zip',
  'artifacts/releases/godskills-product-20261013-ca5d2adb.zip.sha256',
];
const sources = Object.fromEntries(await Promise.all(paths.map(async path => [path, digest(await readFile(new URL(path, root)))])));
const arcadia = catalog.skills.find(item => item.id === 'eternities-arcadia');
const cases = frozen.cases.map(item => {
  const output = searchCatalog(catalog, item.query, item.options);
  const ids = output.results.map(result => result.id);
  const failures = [];
  for (const id of item.expected.includes || []) if (!ids.includes(id)) failures.push(`missing owner: ${id}`);
  for (const id of item.expected.excludes || []) if (ids.includes(id)) failures.push(`excluded owner present: ${id}`);
  for (const [owner, adjacent] of item.expected.precedesIfPresent || []) {
    if (ids.includes(owner) && ids.includes(adjacent) && ids.indexOf(owner) > ids.indexOf(adjacent)) failures.push(`wrong precedence: ${owner} after ${adjacent}`);
  }
  if (item.expected.empty && ids.length) failures.push('expected no candidates');
  if (item.expected.abstentionReason && output.abstentionReason !== item.expected.abstentionReason) failures.push(`abstention: ${output.abstentionReason}`);
  if (output.authority !== 'none' || output.activation !== 'none') failures.push('authority/activation boundary');
  if (output.selection.state !== (item.expected.empty ? 'abstain' : 'review-required')) failures.push('selection boundary');
  const evidence = lexicalQueryEvidence(item.query);
  return {
    id: item.id, kind: item.kind, query: item.query, options: item.options,
    expected: item.expected, basis: item.basis, failures, output,
    diagnostics: {
      affirmativeClauses: affirmativeRequestClauses(item.query),
      intents: evidence.intents.map(profile => profile.name),
      runtimeDomainNavigation: evidence.runtimeDomainNavigation,
      arcadiaIntent: lexicalIntentMatch(arcadia, evidence),
    },
  };
});
console.log(JSON.stringify({
  schema: 'godskills-usefulness-discovery-probe-v1',
  recordedAt: new Date().toISOString(), node: process.version,
  baselineCommit: frozen.baselineCommit, portableReleaseId: frozen.portableReleaseId,
  catalogSkillCount: catalog.skills.length, frozenCasesSha256: digest(freezeBytes),
  sources, summary: {total: cases.length, passed: cases.filter(item => !item.failures.length).length,
    failed: cases.filter(item => item.failures.length).map(item => ({id: item.id, failures: item.failures}))},
  cases,
}, null, 2));
