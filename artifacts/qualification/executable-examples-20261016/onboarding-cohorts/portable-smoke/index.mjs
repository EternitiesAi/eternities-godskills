const DAY_MS = 86_400_000;
const MAX_DATE_MS = 8_640_000_000_000_000;

function record(value, label, allowed, required = allowed) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  for (const key of Reflect.ownKeys(value)) {
    if (!allowed.includes(key)) throw new TypeError(`${label}.${String(key)} is not supported`);
  }
  for (const key of required) {
    if (!Object.hasOwn(value, key)) throw new TypeError(`${label}.${key} is required`);
  }
}

function utc(value, label) {
  const parts = typeof value === 'string'
    && /^(\d{4}|[+-]\d{6})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/.exec(value);
  if (!parts) throw new TypeError(`${label} must be a UTC timestamp with Z and at most millisecond precision`);
  const time = Date.parse(value);
  const date = new Date(time);
  const expected = [Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]),
    Number(parts[4]), Number(parts[5]), Number(parts[6]), Number((parts[7] ?? '').padEnd(3, '0'))];
  const actual = [date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()];
  if (!Number.isFinite(time) || expected.some((part, i) => part !== actual[i])) {
    throw new RangeError(`${label} must be a real calendar date within the supported date range`);
  }
  return time;
}

export function summarizeOnboarding(input) {
  record(input, 'input', ['cutoff', 'windowDays', 'accounts']);
  const cutoff = utc(input.cutoff, 'cutoff');
  if (typeof input.windowDays !== 'number' || !Number.isFinite(input.windowDays) || input.windowDays <= 0) {
    throw new TypeError('windowDays must be a positive finite number');
  }
  const windowMs = input.windowDays * DAY_MS;
  if (!Number.isFinite(windowMs)) throw new RangeError('windowDays overflows elapsed milliseconds');
  if (!Array.isArray(input.accounts)) throw new TypeError('accounts must be an array');
  const ids = new Set();
  const completedDays = [];
  const result = {
    matureCount: 0,
    pendingCount: 0,
    ineligibleCount: 0,
    acceptedInWindowCount: 0,
    acceptedAfterWindowCount: 0,
    matureNonSuccessCount: 0,
    matureRate: null,
    pendingAcceptedCount: 0,
    completedMedianDays: null,
  };

  for (const [i, account] of input.accounts.entries()) {
    const label = `accounts[${i}]`;
    record(account, label, ['id', 'enteredAt', 'eligible', 'acceptedAt', 'blocker'], ['id', 'enteredAt', 'eligible']);
    if (typeof account.id !== 'string' || !account.id.trim()) throw new TypeError(`${label}.id must be nonempty`);
    if (ids.has(account.id)) throw new TypeError(`${label}: duplicate id ${account.id}`);
    ids.add(account.id);
    if (typeof account.eligible !== 'boolean') throw new TypeError(`${label}.eligible must be boolean`);
    if (Object.hasOwn(account, 'blocker') && account.blocker !== null
      && (typeof account.blocker !== 'string' || !account.blocker.trim())) {
      throw new TypeError(`${label}.blocker must be null or a nonempty string`);
    }
    const entered = utc(account.enteredAt, `${label}.enteredAt`);
    const accepted = !Object.hasOwn(account, 'acceptedAt') || account.acceptedAt === null
      ? null : utc(account.acceptedAt, `${label}.acceptedAt`);
    if (entered > cutoff) throw new RangeError(`${label}.enteredAt must be at or before cutoff`);
    if (accepted !== null && (accepted < entered || accepted > cutoff)) {
      throw new RangeError(`${label}.acceptedAt must be between enteredAt and cutoff inclusive`);
    }
    const elapsed = cutoff - entered;
    const deadline = entered + windowMs;
    if (!Number.isSafeInteger(elapsed)) throw new RangeError(`${label} elapsed milliseconds overflow safe arithmetic`);
    if (!Number.isFinite(deadline) || Math.abs(deadline) > MAX_DATE_MS) {
      throw new RangeError(`${label} window deadline overflows the supported date range`);
    }
    if (!account.eligible) {
      result.ineligibleCount++;
    } else if (elapsed < windowMs) {
      result.pendingCount++;
      if (accepted !== null) result.pendingAcceptedCount++;
    } else {
      result.matureCount++;
      if (accepted !== null && accepted - entered <= windowMs) {
        result.acceptedInWindowCount++;
        completedDays.push((accepted - entered) / DAY_MS);
      } else {
        result.matureNonSuccessCount++;
        if (accepted !== null) result.acceptedAfterWindowCount++;
      }
    }
  }

  if (result.matureCount > 0) {
    result.matureRate = result.acceptedInWindowCount / result.matureCount;
  }
  if (completedDays.length > 0) {
    completedDays.sort((a, b) => a - b);
    const middle = Math.floor(completedDays.length / 2);
    result.completedMedianDays = completedDays.length % 2
      ? completedDays[middle]
      : (completedDays[middle - 1] + completedDays[middle]) / 2;
  }
  return result;
}
