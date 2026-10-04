/**
 * First-party, deterministic toy models for the supplied offline lesson.
 * No I/O, randomness, persistence, or external dependencies are used here.
 */

export const BIN_MODEL = Object.freeze({
  initialState: Object.freeze({ A: 3, B: 2 }),
  bCapacity: 4,
  maxTransfer: 3,
  totalTokens: 5,
});

export const SPINNER_SECTORS = Object.freeze([
  Object.freeze({ id: "S0", value: 0 }),
  Object.freeze({ id: "S1", value: 1 }),
  Object.freeze({ id: "S2", value: 1 }),
  Object.freeze({ id: "S3", value: 2 }),
]);

function copyBinState(state) {
  if (state === null || typeof state !== "object" || Array.isArray(state)) {
    return null;
  }
  return { A: state.A, B: state.B };
}

function freezeResult(accepted, reason, state, checks) {
  return Object.freeze({
    accepted,
    reason,
    state: state === null ? null : Object.freeze(state),
    checks: Object.freeze(checks),
  });
}

/** Return a fresh copy of the documented bin starting state. */
export function createInitialBinState() {
  return { A: BIN_MODEL.initialState.A, B: BIN_MODEL.initialState.B };
}

/**
 * Validate the bin model's reachable-state invariants.
 * The two counts must be nonnegative integers totaling five tokens, and B
 * must not exceed its capacity of four tokens.
 */
export function validateBinState(state) {
  const shapeValid =
    state !== null && typeof state === "object" && !Array.isArray(state);
  const A = shapeValid ? state.A : undefined;
  const B = shapeValid ? state.B : undefined;
  const integerCounts = Number.isInteger(A) && Number.isInteger(B);
  const nonnegativeCounts = integerCounts && A >= 0 && B >= 0;
  const totalPreserved = nonnegativeCounts && A + B === BIN_MODEL.totalTokens;
  const withinCapacity = nonnegativeCounts && B <= BIN_MODEL.bCapacity;
  const valid =
    shapeValid && integerCounts && nonnegativeCounts && totalPreserved && withinCapacity;

  let reason = "valid";
  if (!shapeValid) reason = "state-must-be-an-object-with-A-and-B";
  else if (!integerCounts) reason = "counts-must-be-integers";
  else if (!nonnegativeCounts) reason = "counts-must-be-nonnegative";
  else if (!totalPreserved) reason = "total-must-remain-five-tokens";
  else if (!withinCapacity) reason = "B-exceeds-capacity";

  return Object.freeze({
    valid,
    reason,
    integerCounts,
    nonnegativeCounts,
    totalPreserved,
    withinCapacity,
  });
}

/**
 * Propose an all-or-nothing transfer from A to B.
 *
 * @param {{A: number, B: number}} state Current valid state; never mutated.
 * @param {number} k Integer transfer proposal in the inclusive range 0..3.
 * @returns {{accepted: boolean, reason: string, state: {A: number, B: number}|null,
 *            checks: object}} A new result and a new state copy, including on
 *          rejection. Rejections never partially update either bin.
 */
export function transferBins(state, k) {
  const prior = copyBinState(state);
  const stateCheck = validateBinState(state);
  if (!stateCheck.valid) {
    return freezeResult(false, "invalid-state", prior, {
      validState: false,
      enoughInA: null,
      capacityAvailableInB: null,
    });
  }

  if (!Number.isInteger(k) || k < 0 || k > BIN_MODEL.maxTransfer) {
    return freezeResult(false, "invalid-transfer", prior, {
      validState: true,
      enoughInA: null,
      capacityAvailableInB: null,
    });
  }

  // Both conditions read the same old state. Commit both counts only after
  // both checks pass.
  const enoughInA = state.A >= k;
  const capacityAvailableInB = state.B + k <= BIN_MODEL.bCapacity;
  const checks = { validState: true, enoughInA, capacityAvailableInB };

  if (!enoughInA || !capacityAvailableInB) {
    const reason =
      !enoughInA && !capacityAvailableInB
        ? "source-and-capacity"
        : !enoughInA
          ? "source-insufficient"
          : "destination-capacity";
    return freezeResult(false, reason, prior, checks);
  }

  const next = { A: state.A - k, B: state.B + k };
  const nextCheck = validateBinState(next);
  if (!nextCheck.valid) {
    // This indicates an implementation defect, not a learner input error.
    throw new Error(`Accepted transition violated the model invariant: ${nextCheck.reason}`);
  }
  return freezeResult(true, "accepted", next, checks);
}

/**
 * Evaluate one chosen ordered pair of sector identities.
 * This is deterministic arithmetic for an illustrative legal trial; it does
 * not draw a random pair.
 */
export function evaluateSpinnerTrial(firstId, secondId) {
  const first = SPINNER_SECTORS.find((sector) => sector.id === firstId);
  const second = SPINNER_SECTORS.find((sector) => sector.id === secondId);
  if (!first || !second) {
    return Object.freeze({
      valid: false,
      reason: "sector-id-must-be-S0-through-S3",
    });
  }

  const total = first.value + second.value;
  return Object.freeze({
    valid: true,
    first: Object.freeze({ id: first.id, value: first.value }),
    second: Object.freeze({ id: second.id, value: second.value }),
    total,
    success: total >= 3,
  });
}

/** Enumerate all 16 ordered pairs allowed by the spinner's supplied rule. */
export function enumerateSpinnerOutcomes() {
  const outcomes = [];
  for (const first of SPINNER_SECTORS) {
    for (const second of SPINNER_SECTORS) {
      const total = first.value + second.value;
      outcomes.push(
        Object.freeze({
          first: Object.freeze({ id: first.id, value: first.value }),
          second: Object.freeze({ id: second.id, value: second.value }),
          total,
          success: total >= 3,
        }),
      );
    }
  }
  return Object.freeze(outcomes);
}

/**
 * Return the exact finite outcome counts implied by four equally likely,
 * independent spins. The result is derived by enumerating all 16 ordered
 * identity pairs; it is not estimated from a random sample.
 */
export function spinnerDistribution() {
  const outcomes = enumerateSpinnerOutcomes();
  const byTotal = [];
  for (let total = 0; total <= 4; total += 1) {
    const count = outcomes.filter((outcome) => outcome.total === total).length;
    byTotal.push(
      Object.freeze({
        total,
        count,
        trials: outcomes.length,
        numerator: count,
        denominator: outcomes.length,
        proportion: count / outcomes.length,
      }),
    );
  }
  const successCount = outcomes.filter((outcome) => outcome.success).length;
  return Object.freeze({
    totalOutcomes: outcomes.length,
    byTotal: Object.freeze(byTotal),
    successCount,
    failureCount: outcomes.length - successCount,
    successNumerator: successCount,
    successDenominator: outcomes.length,
  });
}
