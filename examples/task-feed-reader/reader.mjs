import { isDeepStrictEqual } from 'node:util';

const has = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const validEvent = (event) => event !== null
  && typeof event === 'object'
  && !Array.isArray(event)
  && has(event, 'id')
  && typeof event.id === 'string'
  && event.id.length > 0
  && has(event, 'payload');
const validEventArray = (events) => {
  if (!Array.isArray(events)) return false;
  for (let index = 0; index < events.length; index += 1) {
    if (!has(events, index) || !validEvent(events[index])) return false;
  }
  return true;
};
const copyEvent = (event) => structuredClone(event);
const validCursor = (cursor) => cursor === null || typeof cursor === 'string';
const copyState = (state) => ({
  cursor: state.cursor,
  events: state.events.map(copyEvent)
});
const result = (status, reason, state, extra = {}) => ({
  status,
  reason,
  state: copyState(state),
  ...extra
});
const positiveSafeInteger = (value) => Number.isSafeInteger(value) && value > 0;

function preflight({ taskId, state, contract, readPage, commit, limits, authority }) {
  if (typeof taskId !== 'string' || taskId.length === 0) return 'invalid-task-id';
  if (!state || typeof state !== 'object' || Array.isArray(state)
      || !has(state, 'cursor') || state.cursor === undefined
      || !validCursor(state.cursor)
      || !Array.isArray(state.events) || !validEventArray(state.events)) {
    return 'invalid-state';
  }

  const savedPayloadById = new Map();
  for (const event of state.events) {
    if (!savedPayloadById.has(event.id)) {
      savedPayloadById.set(event.id, event.payload);
      continue;
    }
    if (!isDeepStrictEqual(savedPayloadById.get(event.id), event.payload)) {
      return 'state-event-id-payload-conflict';
    }
    return 'duplicate-state-event-id';
  }

  if (!contract || typeof contract !== 'object'
      || contract.appendOnly !== true
      || contract.stableEventIds !== true
      || contract.taskScopedCursor !== true
      || (contract.drainGuarantee !== undefined
        && contract.drainGuarantee !== 'final-cursor-equality')) {
    return 'service-contract-not-established';
  }
  if (!authority || typeof authority !== 'object'
      || authority.taskId !== taskId || authority.read !== true || authority.retain !== true) {
    return 'current-task-authority-not-established';
  }
  if (!limits || typeof limits !== 'object'
      || !positiveSafeInteger(limits.maxPages)
      || !positiveSafeInteger(limits.maxEventsPerPage)
      || !positiveSafeInteger(limits.maxTotalEvents)) {
    return 'explicit-positive-limits-required';
  }
  if (typeof readPage !== 'function' || typeof commit !== 'function') {
    return 'adapter-callbacks-required';
  }
  return undefined;
}

function validPage(page, taskId) {
  return page !== null
    && typeof page === 'object'
    && !Array.isArray(page)
    && page.taskId === taskId
    && Array.isArray(page.events)
    && has(page, 'nextCursor')
    && page.nextCursor !== undefined
    && validCursor(page.nextCursor)
    && (!has(page, 'finalCursor') || page.finalCursor === undefined || validCursor(page.finalCursor))
    && (page.taskState === 'running' || page.taskState === 'terminal')
    && typeof page.caughtUp === 'boolean';
}

/**
 * Read a finite number of pages from a caller-authorized synthetic task feed.
 * Callback completion and cursor equality are reported as supplied evidence;
 * this function does not verify adapter storage or a live service.
 */
export async function readNewTaskMessages({
  taskId,
  state,
  contract,
  readPage,
  commit,
  limits,
  authority
}) {
  const invalid = preflight({ taskId, state, contract, readPage, commit, limits, authority });
  if (invalid) {
    const safeState = state && typeof state === 'object'
      && has(state, 'cursor') && Array.isArray(state.events)
      && validEventArray(state.events)
      ? state
      : { cursor: null, events: [] };
    return result('HOLD', invalid, safeState, { pagesRead: 0, eventsAcknowledgedByAdapter: 0, duplicatesIgnored: 0 });
  }

  // Snapshot caller-owned policy values before invoking either callback.
  const maxPages = limits.maxPages;
  const maxEventsPerPage = limits.maxEventsPerPage;
  const maxTotalEvents = limits.maxTotalEvents;
  const drainGuarantee = contract.drainGuarantee;
  let knownState = copyState(state);
  let pagesRead = 0;
  let rawEventsRead = 0;
  let eventsAcknowledgedByAdapter = 0;
  let duplicatesIgnored = 0;
  const knownById = new Map(knownState.events.map((event) => [event.id, event.payload]));
  let terminalFinalCursor;
  let terminalFinalCursorSeen = false;

  for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
    let page;
    pagesRead += 1;
    try {
      page = await readPage({ taskId, after: knownState.cursor, limit: maxEventsPerPage });
    } catch (error) {
      const reason = error?.code === 'CURSOR_EXPIRED'
        ? 'expired-cursor-no-resync'
        : 'page-read-outcome-unknown';
      return result('HOLD', reason, knownState, {
        pagesRead,
        eventsAcknowledgedByAdapter,
        duplicatesIgnored
      });
    }

    if (!validPage(page, taskId)) {
      const isObjectPage = page !== null && typeof page === 'object' && !Array.isArray(page);
      const reason = isObjectPage && has(page, 'taskId') && page.taskId !== taskId
        ? 'wrong-task-response'
        : 'malformed-page';
      return result('HOLD', reason, knownState, {
        pagesRead,
        eventsAcknowledgedByAdapter,
        duplicatesIgnored
      });
    }
    if (!validEventArray(page.events)) {
      return result('HOLD', 'malformed-event', knownState, {
        pagesRead,
        eventsAcknowledgedByAdapter,
        duplicatesIgnored
      });
    }
    const nextCursor = page.nextCursor;
    const taskState = page.taskState;
    const caughtUp = page.caughtUp;
    const hasFinalCursor = has(page, 'finalCursor');
    const finalCursor = page.finalCursor;
    if (page.events.length > maxEventsPerPage) {
      return result('HOLD', 'page-event-limit-exceeded', knownState, {
        pagesRead,
        eventsAcknowledgedByAdapter,
        duplicatesIgnored
      });
    }
    if (rawEventsRead + page.events.length > maxTotalEvents) {
      return result('LIMIT_REACHED', 'total-event-limit-reached', knownState, {
        pagesRead,
        eventsAcknowledgedByAdapter,
        duplicatesIgnored
      });
    }
    rawEventsRead += page.events.length;

    if (taskState === 'terminal' && drainGuarantee === 'final-cursor-equality') {
      if (!hasFinalCursor || finalCursor === undefined) {
        return result('HOLD', 'terminal-final-cursor-missing', knownState, {
          pagesRead,
          eventsAcknowledgedByAdapter,
          duplicatesIgnored
        });
      }
      if (terminalFinalCursorSeen && !Object.is(terminalFinalCursor, finalCursor)) {
        return result('HOLD', 'terminal-final-cursor-changed', knownState, {
          pagesRead,
          eventsAcknowledgedByAdapter,
          duplicatesIgnored
        });
      }
      terminalFinalCursor = finalCursor;
      terminalFinalCursorSeen = true;
    }

    const newUniqueEvents = [];
    const pageIds = new Map();
    for (const event of page.events) {
      const priorPayload = pageIds.has(event.id)
        ? pageIds.get(event.id)
        : knownById.get(event.id);
      const idWasSeen = pageIds.has(event.id) || knownById.has(event.id);
      if (idWasSeen) {
        if (!isDeepStrictEqual(priorPayload, event.payload)) {
          return result('HOLD', 'event-id-payload-conflict', knownState, {
            pagesRead,
            eventsAcknowledgedByAdapter,
            duplicatesIgnored
          });
        }
        duplicatesIgnored += 1;
        continue;
      }
      const copied = copyEvent(event);
      pageIds.set(event.id, copied.payload);
      newUniqueEvents.push(copied);
    }

    const cursorChanged = !Object.is(nextCursor, knownState.cursor);
    if (newUniqueEvents.length > 0 || cursorChanged) {
      const priorKnownState = knownState;
      const transactionEvents = newUniqueEvents.map(copyEvent);
      try {
        await commit({ taskId, events: transactionEvents, cursor: nextCursor });
      } catch {
        return result('HOLD', 'commit-outcome-unknown', priorKnownState, {
          pagesRead,
          eventsAcknowledgedByAdapter,
          duplicatesIgnored,
          reconciliationRequired: true
        });
      }

      knownState = {
        cursor: nextCursor,
        events: [...knownState.events, ...newUniqueEvents.map(copyEvent)]
      };
      for (const event of newUniqueEvents) knownById.set(event.id, event.payload);
      eventsAcknowledgedByAdapter += newUniqueEvents.length;
    }

    if (taskState === 'terminal') {
      if (drainGuarantee !== 'final-cursor-equality') {
        return result('UNKNOWN', 'terminal-without-drain-guarantee', knownState, {
          pagesRead,
          eventsAcknowledgedByAdapter,
          duplicatesIgnored,
          taskState
        });
      }
      if (Object.is(knownState.cursor, terminalFinalCursor)) {
        return result('COMPLETE', 'terminal-final-cursor-equality', knownState, {
          pagesRead,
          eventsAcknowledgedByAdapter,
          duplicatesIgnored,
          taskState
        });
      }
      continue;
    }

    if (caughtUp) {
      const status = newUniqueEvents.length === 0 ? 'IDLE' : 'RUNNING';
      return result(status, status === 'IDLE' ? 'empty-running-page' : 'running-task-feed-caught-up', knownState, {
        pagesRead,
        eventsAcknowledgedByAdapter,
        duplicatesIgnored,
        taskState: 'running'
      });
    }
  }

  return result('LIMIT_REACHED', 'max-pages-reached', knownState, {
    pagesRead,
    eventsAcknowledgedByAdapter,
    duplicatesIgnored
  });
}
