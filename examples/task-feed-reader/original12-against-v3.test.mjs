import assert from 'node:assert/strict';
import test from 'node:test';

const TASK = 'task-A';
const stateAt = (cursor = 'cursor-0', events = []) => ({ cursor, events });
const contract = (overrides = {}) => ({
  appendOnly: true,
  stableEventIds: true,
  taskScopedCursor: true,
  drainGuarantee: undefined,
  ...overrides
});
const authority = (overrides = {}) => ({ taskId: TASK, read: true, retain: true, ...overrides });
const limits = (overrides = {}) => ({ maxPages: 4, maxEventsPerPage: 3, maxTotalEvents: 8, ...overrides });
const event = (id, payload) => ({ id, payload });
const page = (overrides = {}) => ({
  taskId: TASK,
  events: [],
  nextCursor: 'cursor-1',
  taskState: 'running',
  caughtUp: true,
  ...overrides
});

async function invoke(args) {
  let api;
  try {
    api = await import('./reader.mjs');
  } catch (error) {
    if (error?.code === 'ERR_MODULE_NOT_FOUND' && String(error.message).includes('reader.mjs')) {
      assert.fail('reader.mjs must implement and export readNewTaskMessages');
    }
    throw error;
  }
  assert.equal(typeof api.readNewTaskMessages, 'function', 'reader.mjs exports readNewTaskMessages');
  return api.readNewTaskMessages(args);
}

test('passes opaque service cursors exactly and commits only stable-ID unique events per page', async () => {
  const inputState = stateAt('cursor-start', [event('old-1', { n: 0 })]);
  const before = structuredClone(inputState);
  const pages = [
    page({
      events: [event('ev-A', { text: 'a' }), event('ev-A', { text: 'a' }), event('ev-90', { text: 'sparse id' })],
      nextCursor: 'opaque/page:one',
      caughtUp: false
    }),
    page({
      events: [event('ev-90', { text: 'sparse id' }), event('ev-B', { text: 'b' })],
      nextCursor: 'opaque/page:two',
      caughtUp: true
    })
  ];
  const calls = [];
  const commits = [];
  const result = await invoke({
    taskId: TASK,
    state: inputState,
    contract: contract(),
    limits: limits(),
    authority: authority(),
    readPage: async (request) => {
      calls.push(request);
      return pages.shift();
    },
    commit: async (transaction) => {
      commits.push(transaction);
      return { adapterAck: true };
    }
  });

  assert.deepEqual(calls, [
    { taskId: TASK, after: 'cursor-start', limit: 3 },
    { taskId: TASK, after: 'opaque/page:one', limit: 3 }
  ]);
  assert.deepEqual(commits, [
    { taskId: TASK, events: [event('ev-A', { text: 'a' }), event('ev-90', { text: 'sparse id' })], cursor: 'opaque/page:one' },
    { taskId: TASK, events: [event('ev-B', { text: 'b' })], cursor: 'opaque/page:two' }
  ]);
  assert.equal(result.state.cursor, 'opaque/page:two');
  assert.deepEqual(result.state.events, [
    event('old-1', { n: 0 }), event('ev-A', { text: 'a' }), event('ev-90', { text: 'sparse id' }), event('ev-B', { text: 'b' })
  ]);
  assert.equal(result.duplicatesIgnored, 2);
  assert.equal(result.eventsAcknowledgedByAdapter, 3);
  assert.equal(result.status, 'RUNNING');
  assert.deepEqual(inputState, before);
});

test('an empty running page is idle and may checkpoint only its literal returned cursor', async () => {
  const commits = [];
  const result = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0'),
    contract: contract(),
    limits: limits(),
    authority: authority(),
    readPage: async ({ after, limit }) => {
      assert.deepEqual({ after, limit }, { after: 'cursor-0', limit: 3 });
      return page({ events: [], nextCursor: 'opaque-empty-page', taskState: 'running', caughtUp: true });
    },
    commit: async (transaction) => { commits.push(transaction); return { adapterAck: true }; }
  });
  assert.equal(result.status, 'IDLE');
  assert.equal(result.state.cursor, 'opaque-empty-page');
  assert.deepEqual(commits, [{ taskId: TASK, events: [], cursor: 'opaque-empty-page' }]);
});

test('terminal caught-up without a declared drain guarantee is UNKNOWN, not complete', async () => {
  const result = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0'),
    contract: contract(),
    limits: limits(),
    authority: authority(),
    readPage: async () => page({ events: [event('ev-1', { body: 'x' })], nextCursor: 'cursor-terminal', taskState: 'terminal', caughtUp: true }),
    commit: async () => ({ adapterAck: true })
  });
  assert.equal(result.status, 'UNKNOWN');
  assert.equal(result.reason, 'terminal-without-drain-guarantee');
  assert.equal(result.state.cursor, 'cursor-terminal');
  assert.equal(result.taskState, 'terminal');
});

test('terminal completes only after exact equality with the supplied final cursor', async () => {
  const after = [];
  const commits = [];
  const result = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0'),
    contract: contract({ drainGuarantee: 'final-cursor-equality' }),
    limits: limits(),
    authority: authority(),
    readPage: async (request) => {
      after.push(request.after);
      if (after.length === 1) return page({ events: [event('ev-1', { body: 'one' })], nextCursor: 'cursor-1', taskState: 'terminal', caughtUp: true, finalCursor: 'cursor-final' });
      return page({ events: [event('ev-2', { body: 'two' })], nextCursor: 'cursor-final', taskState: 'terminal', caughtUp: true, finalCursor: 'cursor-final' });
    },
    commit: async (transaction) => { commits.push(transaction); return { adapterAck: true }; }
  });
  assert.deepEqual(after, ['cursor-0', 'cursor-1']);
  assert.deepEqual(commits.map(({ cursor }) => cursor), ['cursor-1', 'cursor-final']);
  assert.equal(result.status, 'COMPLETE');
  assert.equal(result.state.cursor, 'cursor-final');
});

test('a declared terminal drain guarantee with no final cursor holds without committing', async () => {
  let commits = 0;
  const result = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0'),
    contract: contract({ drainGuarantee: 'final-cursor-equality' }),
    limits: limits(),
    authority: authority(),
    readPage: async () => page({ events: [event('ev-1', {})], nextCursor: 'cursor-1', taskState: 'terminal', caughtUp: true }),
    commit: async () => { commits += 1; return { adapterAck: true }; }
  });
  assert.equal(result.status, 'HOLD');
  assert.equal(result.reason, 'terminal-final-cursor-missing');
  assert.equal(result.state.cursor, 'cursor-0');
  assert.equal(commits, 0);
});

test('a stable ID with changed payload holds the page and preserves the previous state', async () => {
  let commits = 0;
  const result = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0', [event('same-id', { value: 1 })]),
    contract: contract(),
    limits: limits(),
    authority: authority(),
    readPage: async () => page({ events: [event('same-id', { value: 2 })], nextCursor: 'cursor-1' }),
    commit: async () => { commits += 1; return { adapterAck: true }; }
  });
  assert.equal(result.status, 'HOLD');
  assert.equal(result.reason, 'event-id-payload-conflict');
  assert.equal(result.state.cursor, 'cursor-0');
  assert.equal(commits, 0);
});

test('wrong-task responses and expired cursors hold without invented recovery', async () => {
  let commits = 0;
  const wrongTask = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0'),
    contract: contract(),
    limits: limits(),
    authority: authority(),
    readPage: async () => page({ taskId: 'task-B', events: [event('ev-x', {})], nextCursor: 'cursor-b' }),
    commit: async () => { commits += 1; return { adapterAck: true }; }
  });
  assert.equal(wrongTask.status, 'HOLD');
  assert.equal(wrongTask.reason, 'wrong-task-response');
  assert.equal(wrongTask.state.cursor, 'cursor-0');

  const expiredCursor = await invoke({
    taskId: TASK,
    state: stateAt('expired-cursor'),
    contract: contract(),
    limits: limits(),
    authority: authority(),
    readPage: async () => { throw Object.assign(new Error('synthetic expired cursor'), { code: 'CURSOR_EXPIRED' }); },
    commit: async () => { commits += 1; return { adapterAck: true }; }
  });
  assert.equal(expiredCursor.status, 'HOLD');
  assert.equal(expiredCursor.reason, 'expired-cursor-no-resync');
  assert.equal(expiredCursor.state.cursor, 'expired-cursor');
  assert.equal(commits, 0);
});

test('current exact-task read and retention authority plus all stability declarations are required before reading', async () => {
  const cases = [
    { authority: authority({ read: false }), contract: contract() },
    { authority: authority({ retain: false }), contract: contract() },
    { authority: authority({ taskId: 'task-B' }), contract: contract() },
    { authority: authority(), contract: contract({ appendOnly: false }) },
    { authority: authority(), contract: contract({ stableEventIds: false }) },
    { authority: authority(), contract: contract({ taskScopedCursor: false }) },
    { authority: authority(), contract: undefined }
  ];
  for (const item of cases) {
    let reads = 0;
    const result = await invoke({
      taskId: TASK,
      state: stateAt('cursor-0'),
      contract: item.contract,
      limits: limits(),
      authority: item.authority,
      readPage: async () => { reads += 1; return page(); },
      commit: async () => ({ adapterAck: true })
    });
    assert.equal(result.status, 'HOLD');
    assert.equal(reads, 0);
  }
});

test('explicit positive limits are required and oversized pages are not committed', async () => {
  let reads = 0;
  const missingLimit = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0'),
    contract: contract(),
    limits: { maxPages: 2, maxEventsPerPage: 3 },
    authority: authority(),
    readPage: async () => { reads += 1; return page(); },
    commit: async () => ({ adapterAck: true })
  });
  assert.equal(missingLimit.status, 'HOLD');
  assert.equal(reads, 0);

  let commits = 0;
  const oversizedPage = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0'),
    contract: contract(),
    limits: limits({ maxEventsPerPage: 1 }),
    authority: authority(),
    readPage: async () => page({ events: [event('a', {}), event('b', {})], nextCursor: 'cursor-1' }),
    commit: async () => { commits += 1; return { adapterAck: true }; }
  });
  assert.equal(oversizedPage.status, 'HOLD');
  assert.equal(oversizedPage.reason, 'page-event-limit-exceeded');
  assert.equal(oversizedPage.state.cursor, 'cursor-0');
  assert.equal(commits, 0);

  const totalCap = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0'),
    contract: contract(),
    limits: limits({ maxTotalEvents: 1 }),
    authority: authority(),
    readPage: async () => page({ events: [event('a', {}), event('b', {})], nextCursor: 'cursor-1' }),
    commit: async () => { commits += 1; return { adapterAck: true }; }
  });
  assert.equal(totalCap.status, 'LIMIT_REACHED');
  assert.equal(totalCap.reason, 'total-event-limit-reached');
  assert.equal(totalCap.state.cursor, 'cursor-0');
  assert.equal(commits, 0);
});

test('max pages bounds reads; the reader reports no percent, ETA, or remote cancellation', async () => {
  let reads = 0;
  let cancelCalls = 0;
  const result = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0'),
    contract: contract(),
    limits: limits({ maxPages: 1 }),
    authority: authority(),
    readPage: async () => {
      reads += 1;
      return page({ events: [event('ev-1', {})], nextCursor: 'cursor-1', caughtUp: false });
    },
    commit: async () => ({ adapterAck: true }),
    cancelRemote: async () => { cancelCalls += 1; }
  });
  assert.equal(result.status, 'LIMIT_REACHED');
  assert.equal(result.reason, 'max-pages-reached');
  assert.equal(result.state.cursor, 'cursor-1');
  assert.equal(reads, 1);
  assert.equal(cancelCalls, 0);
  assert.equal('percent' in result, false);
  assert.equal('eta' in result, false);
});

test('an unknown commit outcome preserves last known state and requires reconciliation without retry', async () => {
  let reads = 0;
  let commits = 0;
  let fixtureStorageApplied = false;
  const initial = stateAt('cursor-0', [event('old', {})]);
  const result = await invoke({
    taskId: TASK,
    state: initial,
    contract: contract(),
    limits: limits(),
    authority: authority(),
    readPage: async () => {
      reads += 1;
      return page({ events: [event('new', {})], nextCursor: 'cursor-1', caughtUp: false });
    },
    commit: async ({ events, cursor }) => {
      commits += 1;
      fixtureStorageApplied = events.length === 1 && cursor === 'cursor-1';
      throw new Error('synthetic acknowledgement lost after possible write');
    }
  });
  assert.equal(fixtureStorageApplied, true);
  assert.equal(result.status, 'HOLD');
  assert.equal(result.reason, 'commit-outcome-unknown');
  assert.equal(result.reconciliationRequired, true);
  assert.deepEqual(result.state, initial);
  assert.equal(result.state.cursor, 'cursor-0');
  assert.equal(result.eventsAcknowledgedByAdapter, 0);
  assert.equal(reads, 1);
  assert.equal(commits, 1);
});

test('invalid event shapes hold without checkpoint advancement', async () => {
  let commits = 0;
  const result = await invoke({
    taskId: TASK,
    state: stateAt('cursor-0'),
    contract: contract(),
    limits: limits(),
    authority: authority(),
    readPage: async () => page({ events: [{ id: 'missing-payload' }], nextCursor: 'cursor-1' }),
    commit: async () => { commits += 1; return { adapterAck: true }; }
  });
  assert.equal(result.status, 'HOLD');
  assert.equal(result.reason, 'malformed-event');
  assert.equal(result.state.cursor, 'cursor-0');
  assert.equal(commits, 0);
});
