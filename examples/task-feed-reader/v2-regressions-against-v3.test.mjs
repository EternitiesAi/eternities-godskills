import assert from 'node:assert/strict';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const readerUrl = process.env.TASK_FEED_READER_MODULE
  ? pathToFileURL(process.env.TASK_FEED_READER_MODULE).href
  : new URL('./reader.mjs', import.meta.url).href;
const { readNewTaskMessages } = await import(readerUrl);
const taskId = 'T';
const authority = { taskId, read: true, retain: true };
const contract = (overrides = {}) => ({
  appendOnly: true,
  stableEventIds: true,
  taskScopedCursor: true,
  ...overrides
});
const limits = (overrides = {}) => ({
  maxPages: 2,
  maxEventsPerPage: 3,
  maxTotalEvents: 6,
  ...overrides
});
const event = (id, payload) => ({ id, payload });
const terminalPage = (events = []) => ({
  taskId,
  events,
  nextCursor: 'final',
  taskState: 'terminal',
  caughtUp: true,
  finalCursor: 'final'
});

test('conflicting duplicate IDs in saved state hold before any adapter call', async () => {
  const state = {
    cursor: 'saved',
    events: [event('E1', { v: 1 }), event('E1', { v: 2 })]
  };
  const before = structuredClone(state);
  let reads = 0;
  let commits = 0;
  const result = await readNewTaskMessages({
    taskId,
    state,
    contract: contract({ drainGuarantee: 'final-cursor-equality' }),
    authority,
    limits: limits(),
    readPage: async () => { reads += 1; return terminalPage([event('E1', { v: 2 })]); },
    commit: async () => { commits += 1; return { adapterAck: true }; }
  });

  assert.equal(result.status, 'HOLD');
  assert.equal(result.reason, 'state-event-id-payload-conflict');
  assert.equal(result.state.cursor, 'saved');
  assert.deepEqual(result.state.events, before.events);
  assert.deepEqual(state, before);
  assert.equal(reads, 0);
  assert.equal(commits, 0);
});

test('equal duplicate IDs in saved state are explicitly rejected before reading', async () => {
  let reads = 0;
  let commits = 0;
  const result = await readNewTaskMessages({
    taskId,
    state: { cursor: 'saved', events: [event('E1', { v: 1 }), event('E1', { v: 1 })] },
    contract: contract({ drainGuarantee: 'final-cursor-equality' }),
    authority,
    limits: limits(),
    readPage: async () => { reads += 1; return terminalPage([event('E1', { v: 1 })]); },
    commit: async () => { commits += 1; return { adapterAck: true }; }
  });

  assert.equal(result.status, 'HOLD');
  assert.equal(result.reason, 'duplicate-state-event-id');
  assert.equal(result.state.cursor, 'saved');
  assert.equal(reads, 0);
  assert.equal(commits, 0);
});

test('adapter mutation of caller-owned limits cannot expand the preflight page cap', async () => {
  const suppliedLimits = limits({ maxPages: 1 });
  let reads = 0;
  const result = await readNewTaskMessages({
    taskId,
    state: { cursor: 'saved', events: [] },
    contract: contract(),
    authority,
    limits: suppliedLimits,
    readPage: async () => {
      reads += 1;
      suppliedLimits.maxPages = 2;
      return {
        taskId,
        events: [],
        nextCursor: 'page-1',
        taskState: 'running',
        caughtUp: false
      };
    },
    commit: async () => ({ adapterAck: true })
  });

  assert.equal(result.status, 'LIMIT_REACHED');
  assert.equal(result.reason, 'max-pages-reached');
  assert.equal(reads, 1);
  assert.equal(result.pagesRead, 1);
});

test('adapter mutation cannot add a terminal drain guarantee after preflight', async () => {
  const suppliedContract = contract();
  const result = await readNewTaskMessages({
    taskId,
    state: { cursor: 'saved', events: [] },
    contract: suppliedContract,
    authority,
    limits: limits(),
    readPage: async () => {
      suppliedContract.drainGuarantee = 'final-cursor-equality';
      return terminalPage();
    },
    commit: async () => ({ adapterAck: true })
  });

  assert.equal(result.status, 'UNKNOWN');
  assert.equal(result.reason, 'terminal-without-drain-guarantee');
  assert.equal(result.taskState, 'terminal');
});

test('commit mutation of the returned page cannot advance state past the acknowledged cursor', async () => {
  let returnedPage;
  const committedCursors = [];
  const result = await readNewTaskMessages({
    taskId,
    state: { cursor: 'saved', events: [] },
    contract: contract(),
    authority,
    limits: limits(),
    readPage: async () => {
      returnedPage = {
        taskId,
        events: [],
        nextCursor: 'acknowledged-1',
        taskState: 'running',
        caughtUp: true
      };
      return returnedPage;
    },
    commit: async ({ cursor }) => {
      committedCursors.push(cursor);
      returnedPage.nextCursor = 'not-committed-2';
      return { adapterAck: true };
    }
  });

  assert.deepEqual(committedCursors, ['acknowledged-1']);
  assert.equal(result.status, 'IDLE');
  assert.equal(result.state.cursor, 'acknowledged-1');
});

test('mutable object cursors outside the fixture token shape hold before reading', async () => {
  const state = { cursor: { opaque: 'saved' }, events: [] };
  const before = structuredClone(state);
  let reads = 0;
  const result = await readNewTaskMessages({
    taskId,
    state,
    contract: contract(),
    authority,
    limits: limits(),
    readPage: async ({ after }) => {
      reads += 1;
      after.opaque = 'mutated';
      return {
        taskId,
        events: [],
        nextCursor: 'next',
        taskState: 'running',
        caughtUp: true
      };
    },
    commit: async () => ({ adapterAck: true })
  });

  assert.equal(result.status, 'HOLD');
  assert.equal(result.reason, 'invalid-state');
  assert.equal(reads, 0);
  assert.deepEqual(state, before);
});
