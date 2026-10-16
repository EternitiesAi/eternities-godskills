function record(value, path, fields) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${path} must be an object`);
  }
  if (fields) {
    for (const field of fields) {
      if (!Object.hasOwn(value, field)) throw new TypeError(`${path}.${field} is required`);
    }
    for (const field of Object.keys(value)) {
      if (!fields.includes(field)) throw new TypeError(`${path}.${field} is unknown`);
    }
  }
}

function id(value, path) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${path} must be a nonempty string`);
  }
}

function hours(value, path) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new RangeError(`${path} must be finite nonnegative hours`);
  }
  return value;
}

function count(value, path) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${path} must be a nonnegative safe integer`);
  }
}

/** Reconcile one common planning period's ready effort against shared resources. */
export function analyzeFlow(input) {
  record(input, 'input', ['resources', 'classes']);
  if (!Array.isArray(input.resources) || !Array.isArray(input.classes)) {
    throw new TypeError('resources and classes must be arrays');
  }

  const resources = new Map();
  for (const [i, resource] of input.resources.entries()) {
    const path = `resources[${i}]`;
    record(resource, path, ['id', 'availableHours', 'reworkHours']);
    id(resource.id, `${path}.id`);
    if (resources.has(resource.id)) throw new TypeError(`${path}.id is duplicated`);
    const availableHours = hours(resource.availableHours, `${path}.availableHours`);
    const reworkHours = hours(resource.reworkHours, `${path}.reworkHours`);
    resources.set(resource.id, {
      availableHours,
      result: { id: resource.id, readyHours: 0, blockedHours: 0, reworkHours },
    });
  }

  const classIds = new Set();
  for (const [i, workClass] of input.classes.entries()) {
    const path = `classes[${i}]`;
    record(workClass, path, ['id', 'readyCount', 'blockedCount', 'effortHours']);
    id(workClass.id, `${path}.id`);
    if (classIds.has(workClass.id)) throw new TypeError(`${path}.id is duplicated`);
    classIds.add(workClass.id);
    count(workClass.readyCount, `${path}.readyCount`);
    count(workClass.blockedCount, `${path}.blockedCount`);
    record(workClass.effortHours, `${path}.effortHours`);
    for (const [resourceId, effort] of Object.entries(workClass.effortHours)) {
      const effortPath = `${path}.effortHours[${JSON.stringify(resourceId)}]`;
      if (!resources.has(resourceId)) throw new TypeError(`${effortPath} references an unknown resource`);
      hours(effort, effortPath);
      const { result } = resources.get(resourceId);
      result.readyHours = hours(result.readyHours + hours(workClass.readyCount * effort,
        `${effortPath} ready product`), `${effortPath} ready total`);
      result.blockedHours = hours(result.blockedHours + hours(workClass.blockedCount * effort,
        `${effortPath} blocked product`), `${effortPath} blocked total`);
    }
  }

  return {
    resources: Array.from(resources.values(), ({ availableHours, result }) => {
      const requiredReadyHours = hours(result.readyHours + result.reworkHours,
        `resource ${JSON.stringify(result.id)} requiredReadyHours`);
      return {
        ...result,
        requiredReadyHours,
        shortfallHours: Math.max(0, requiredReadyHours - availableHours),
        spareHours: Math.max(0, availableHours - requiredReadyHours),
      };
    }),
  };
}
