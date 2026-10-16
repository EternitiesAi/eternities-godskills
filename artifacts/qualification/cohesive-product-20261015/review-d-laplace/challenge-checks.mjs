// Reviewer-authored synthetic arithmetic only. No product/source code imported.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const results = [];
const t1 = { production: 3600, usage: 700, conflict: false };
const t2 = { production: 2600, usage: 400, conflict: false };
const t3 = { production: 1200, usage: 200, conflict: true };
const v1 = { production: 1800, usage: 300, conflict: false };
const shared = 500;
function price(slate) {
  if (slate.some(c => c.conflict)) return { status: 'ineligible' };
  if (slate.some(c => c.usage == null)) return { status: 'quote_required' };
  const total = shared + slate.reduce((sum, c) => sum + c.production + c.usage, 0);
  return { status: total <= 6000 ? 'feasible_draft' : 'over_budget', total };
}
assert.deepEqual(price([t1, v1]), { status: 'over_budget', total: 6900 });
assert.deepEqual(price([t2, v1]), { status: 'feasible_draft', total: 5600 });
assert.deepEqual(price([t3, v1]), { status: 'ineligible' });
assert.deepEqual(price([{ ...t2, usage: null }, v1]), { status: 'quote_required' });
results.push({ case: 'slate_budget_and_missing_rights', status: 'PASS', preferredCost: 6900, feasibleCost: 5600, budget: 6000, slack: 400 });

const events = [
  { id: 'a', path: '/orders/10', instance: 'i1', outcome: 'ok' },
  { id: 'b', path: '/orders/11', instance: 'i1', outcome: 'ok' },
  { id: 'c', path: '/orders/12', instance: 'i1', outcome: 'timeout' },
  { id: 'd', path: '/orders/13', instance: 'i1', outcome: 'unknown-A' },
  { id: 'e', path: '/orders/14', instance: 'i1', outcome: 'unknown-B' },
  { id: 'f', path: '/orders/15', instance: 'i2', outcome: 'timeout' },
];
const normalize = e => ({
  route: /^\/orders\/\d+$/.test(e.path) ? '/orders/:id' : 'other_route',
  instance: e.instance,
  outcome: ['ok', 'timeout'].includes(e.outcome) ? e.outcome : 'other_error',
});
const normalized = events.map(normalize);
const count = values => new Set(values.map(JSON.stringify)).size;
const beforeErrors = events.filter(e => e.outcome !== 'ok').length;
const afterErrors = normalized.filter(e => e.outcome !== 'ok').length;
assert.equal(normalized.length, 6);
assert.equal(count(normalized), 4);
assert.equal(1 * 2 * 3, 6);
assert.equal(beforeErrors, 4);
assert.equal(afterErrors, beforeErrors);
assert.equal(normalized.filter(e => e.outcome === 'other_error').length, 2);
const hashedIds = events.map(e => createHash('sha256').update(e.id).digest('hex'));
assert.equal(new Set(hashedIds).size, 6);
const nextWindowIds = events.map(e => 'next-' + e.id);
assert.equal(new Set([...events.map(e => e.id), ...nextWindowIds]).size, 12);
assert.equal(count(normalized) * (6 + 2), 32);
assert.equal((1 * 2 * 3) * (6 + 2), 48);
results.push({ case: 'telemetry_normalization', status: 'PASS', events: 6, observedTuples: 4, allowedTupleBound: 6, errorsBefore: beforeErrors, errorsAfter: afterErrors, unknownErrorsRetained: 2, uniqueHashedIds: 6, retainedIdsAcrossTwoWindows: 12, classicHistogramSeriesIfAllEmitted: 32, classicHistogramBound: 48 });

const eventYears = [2017, 2020, 2024].map(year => year - 2020);
assert.deepEqual(eventYears, [-3, 0, 4]);
assert.notDeepEqual(eventYears, [-1, 0, 1]);
assert.equal(42 - 38, 4);
results.push({ case: 'causal_calendar_and_summary_difference', status: 'PASS', eventYears, syntheticAssignmentMeanDifference: 4, estimatorExecuted: false });
console.log(JSON.stringify({ status: 'PASS', groups: results.length, results, claim: 'Reviewer-authored synthetic arithmetic; not a product benchmark, causal estimate, render or study.' }, null, 2));

