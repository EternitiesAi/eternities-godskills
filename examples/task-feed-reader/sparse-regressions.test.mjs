import assert from 'node:assert/strict';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const readerUrl = process.env.TASK_FEED_READER_MODULE
  ? pathToFileURL(process.env.TASK_FEED_READER_MODULE).href
  : new URL('./reader.mjs', import.meta.url).href;
const { readNewTaskMessages } = await import(readerUrl);
const taskId = 'T';
const authority = { taskId, read: true, retain: true };
const contract = { appendOnly: true, stableEventIds: true, taskScopedCursor: true };
const limits = { maxPages: 2, maxEventsPerPage: 2, maxTotalEvents: 3 };
const validPage = (events = []) => ({
  taskId,
  events,
  nextCursor: 'ack-1',
  taskState: 'running',
  caughtUp: true
});

test('a sparse saved event array returns HOLD before either callback', async () => {
  const state = { cursor: 'saved', events: new Array(1) };
  const before = structuredClone(state);
  let reads = 0;
  let commits = 0;
  const observed = await readNewTaskMessages({
    taskId,
    state,
    contract,
    authority,
    limits,
    readPage: async () => { reads += 1; return validPage(); },
    commit: async () => { commits += 1; }
  }).then(result => ({ result }), error => ({ error }));

  assert.equal(observed.error, undefined, 'malformed saved state returns a result rather than throwing');
  assert.equal(observed.result.status, 'HOLD');
  assert.equal(observed.result.reason, 'invalid-state');
  assert.equal(reads, 0);
  assert.equal(commits, 0);
  assert.deepEqual(state, before);
  assert.equal(0 in state.events, false);
});

test('a sparse page event array returns HOLD and preserves the prior checkpoint', async () => {
  const state = { cursor: 'saved', events: [] };
  let reads = 0;
  let commits = 0;
  const observed = await readNewTaskMessages({
    taskId,
    state,
    contract,
    authority,
    limits,
    readPage: async () => { reads += 1; return validPage(new Array(1)); },
    commit: async () => { commits += 1; }
  }).then(result => ({ result }), error => ({ error }));

  assert.equal(observed.error, undefined, 'malformed page returns a result rather than throwing');
  assert.equal(observed.result.status, 'HOLD');
  assert.equal(observed.result.reason, 'malformed-event');
  assert.deepEqual(observed.result.state, { cursor: 'saved', events: [] });
  assert.equal(reads, 1);
  assert.equal(commits, 0);
  assert.deepEqual(state, { cursor: 'saved', events: [] });
});

test('a dense saved array with undefined returns HOLD before either callback', async () => {
  let reads = 0;
  let commits = 0;
  const observed = await readNewTaskMessages({
    taskId,
    state: { cursor: 'saved', events: [undefined] },
    contract,
    authority,
    limits,
    readPage: async () => { reads += 1; return validPage(); },
    commit: async () => { commits += 1; }
  }).then(result => ({ result }), error => ({ error }));

  assert.equal(observed.error, undefined);
  assert.equal(observed.result.status, 'HOLD');
  assert.equal(observed.result.reason, 'invalid-state');
  assert.equal(reads, 0);
  assert.equal(commits, 0);
});

test('a dense page array with undefined returns HOLD before commit', async () => {
  let reads = 0;
  let commits = 0;
  const observed = await readNewTaskMessages({
    taskId,
    state: { cursor: 'saved', events: [] },
    contract,
    authority,
    limits,
    readPage: async () => { reads += 1; return validPage([undefined]); },
    commit: async () => { commits += 1; }
  }).then(result => ({ result }), error => ({ error }));

  assert.equal(observed.error, undefined);
  assert.equal(observed.result.status, 'HOLD');
  assert.equal(observed.result.reason, 'malformed-event');
  assert.deepEqual(observed.result.state, { cursor: 'saved', events: [] });
  assert.equal(reads, 1);
  assert.equal(commits, 0);
});
