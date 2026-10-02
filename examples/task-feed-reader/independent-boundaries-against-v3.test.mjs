import assert from 'node:assert/strict';
import test from 'node:test';
import { readNewTaskMessages } from './reader.mjs';

const taskId = 'T';
const policy = (overrides = {}) => ({
  taskId,
  state: { cursor: 'saved', events: [] },
  authority: { taskId, read: true, retain: true },
  contract: { appendOnly: true, stableEventIds: true, taskScopedCursor: true },
  limits: { maxPages: 2, maxEventsPerPage: 2, maxTotalEvents: 3 },
  ...overrides
});
const page = (overrides = {}) => ({
  taskId, events: [], nextCursor: 'ack-1', taskState: 'running', caughtUp: true,
  ...overrides
});
const event = (id, v) => ({ id, payload: { v } });

test('independent: returned page cursor/status/final fields cannot manufacture completion during commit', async () => {
  const p = page();
  const tx = [];
  const initial = { cursor: 'saved', events: [] };
  const got = await readNewTaskMessages(policy({
    state: initial,
    contract: { appendOnly: true, stableEventIds: true, taskScopedCursor: true, drainGuarantee: 'final-cursor-equality' },
    readPage: async () => p,
    commit: async transaction => {
      tx.push(structuredClone(transaction));
      p.nextCursor = 'forged-final';
      p.taskState = 'terminal';
      p.caughtUp = false;
      p.finalCursor = 'forged-final';
    }
  }));
  assert.equal(got.status, 'IDLE');
  assert.equal(got.taskState, 'running');
  assert.equal(got.state.cursor, 'ack-1');
  assert.deepEqual(tx, [{ taskId, events: [], cursor: 'ack-1' }]);
  assert.deepEqual(initial, { cursor: 'saved', events: [] });
});

test('independent: page snapshot retains terminal decision when mutable response is rewritten as running', async () => {
  const p = page({ taskState: 'terminal', finalCursor: 'ack-1' });
  const got = await readNewTaskMessages(policy({
    contract: { appendOnly: true, stableEventIds: true, taskScopedCursor: true, drainGuarantee: 'final-cursor-equality' },
    readPage: async () => p,
    commit: async () => { p.taskState = 'running'; p.nextCursor = 'different'; p.finalCursor = 'different'; }
  }));
  assert.equal(got.status, 'COMPLETE');
  assert.equal(got.taskState, 'terminal');
  assert.equal(got.state.cursor, 'ack-1');
});

test('independent: changing maxEventsPerPage cannot admit an oversized page', async () => {
  const limits = { maxPages: 2, maxEventsPerPage: 1, maxTotalEvents: 3 };
  let commits = 0;
  const got = await readNewTaskMessages(policy({
    limits,
    readPage: async ({ limit }) => {
      assert.equal(limit, 1);
      limits.maxEventsPerPage = 20;
      return page({ events: [event('A', 1), event('B', 2)] });
    },
    commit: async () => { commits++; }
  }));
  assert.equal(got.status, 'HOLD');
  assert.equal(got.reason, 'page-event-limit-exceeded');
  assert.equal(got.state.cursor, 'saved');
  assert.equal(commits, 0);
});

test('independent: changing maxTotalEvents cannot enlarge invocation acceptance after a prior ack', async () => {
  const limits = { maxPages: 2, maxEventsPerPage: 2, maxTotalEvents: 1 };
  let reads = 0;
  let commits = 0;
  const got = await readNewTaskMessages(policy({
    limits,
    readPage: async () => {
      reads++;
      limits.maxTotalEvents = 20;
      return page({ events: [event(String(reads), reads)], nextCursor: 'c' + reads, caughtUp: false });
    },
    commit: async () => { commits++; }
  }));
  assert.equal(got.status, 'LIMIT_REACHED');
  assert.equal(got.reason, 'total-event-limit-reached');
  assert.equal(got.state.cursor, 'c1');
  assert.deepEqual(got.state.events, [event('1', 1)]);
  assert.equal(reads, 2);
  assert.equal(commits, 1);
});

test('independent: plain transaction-event mutation does not rewrite the reader snapshot', async () => {
  const p = page({ events: [event('A', 1)] });
  const got = await readNewTaskMessages(policy({
    readPage: async () => p,
    commit: async ({ events }) => { events[0].payload.v = 99; events.push(event('injected', 7)); p.events[0].payload.v = 88; }
  }));
  assert.deepEqual(got.state.events, [event('A', 1)]);
  assert.equal(got.eventsAcknowledgedByAdapter, 1);
});

test('independent: a second uncertain commit preserves the first acknowledged checkpoint without retry', async () => {
  let reads = 0;
  let commits = 0;
  const got = await readNewTaskMessages(policy({
    readPage: async () => { reads++; return page({ events: [event(String(reads), reads)], nextCursor: 'c' + reads, caughtUp: false }); },
    commit: async () => { commits++; if (commits === 2) throw new Error('synthetic lost ack'); }
  }));
  assert.equal(got.status, 'HOLD');
  assert.equal(got.reason, 'commit-outcome-unknown');
  assert.equal(got.reconciliationRequired, true);
  assert.equal(got.state.cursor, 'c1');
  assert.deepEqual(got.state.events, [event('1', 1)]);
  assert.equal(got.eventsAcknowledgedByAdapter, 1);
  assert.equal(reads, 2);
  assert.equal(commits, 2);
});

test('independent: a changed terminal final cursor holds the second page before commit', async () => {
  let reads = 0;
  let commits = 0;
  const got = await readNewTaskMessages(policy({
    contract: { appendOnly: true, stableEventIds: true, taskScopedCursor: true, drainGuarantee: 'final-cursor-equality' },
    readPage: async () => { reads++; return page({ nextCursor: 'c' + reads, taskState: 'terminal', finalCursor: reads === 1 ? 'f1' : 'f2' }); },
    commit: async () => { commits++; }
  }));
  assert.equal(got.status, 'HOLD');
  assert.equal(got.reason, 'terminal-final-cursor-changed');
  assert.equal(got.state.cursor, 'c1');
  assert.equal(commits, 1);
});

test('independent: a sparse returned event array is malformed and holds before commit', async () => {
  let reads = 0;
  let commits = 0;
  const initial = { cursor: 'saved', events: [] };
  const got = await readNewTaskMessages(policy({
    state: initial,
    readPage: async () => { reads++; return page({ events: new Array(1) }); },
    commit: async () => { commits++; }
  }));
  assert.equal(got.status, 'HOLD');
  assert.equal(got.reason, 'malformed-event');
  assert.deepEqual(got.state, initial);
  assert.equal(reads, 1);
  assert.equal(commits, 0);
});

test('independent: a sparse saved event array is invalid and holds before either callback', async () => {
  let reads = 0;
  let commits = 0;
  const initial = { cursor: 'saved', events: new Array(1) };
  const got = await readNewTaskMessages(policy({
    state: initial,
    readPage: async () => { reads++; return page(); },
    commit: async () => { commits++; }
  }));
  assert.equal(got.status, 'HOLD');
  assert.equal(got.reason, 'invalid-state');
  assert.equal(reads, 0);
  assert.equal(commits, 0);
});
