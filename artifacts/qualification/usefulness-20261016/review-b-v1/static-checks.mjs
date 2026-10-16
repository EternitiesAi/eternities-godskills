// Reviewer-authored arithmetic only. Imports no product/upstream implementation.
// Results check stipulated examples, not images, poses, engine APIs or devices.
import assert from 'node:assert/strict';

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
const vectorNear = (actual, expected) => actual.forEach((value, index) => near(value, expected[index]));
const smoothstep = (lo, hi, value) => {
  assert.ok(hi > lo);
  const t = Math.max(0, Math.min(1, (value - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};
const mask = (rho, radius, halfWidth, edgeWidth) => 1 - smoothstep(-edgeWidth, edgeWidth, Math.abs(rho - radius) - halfWidth);
const checks = [];

{
  const aspect = 1600 / 900;
  const horizontalRho = (0.6125 - 0.5) * aspect;
  const verticalRho = 0.7 - 0.5;
  near(horizontalRho, 0.2); near(verticalRho, 0.2);
  near((0.6125 - 0.5) * 1600, 180); near((0.7 - 0.5) * 900, 180);
  checks.push({id: 'pulse-aspect', horizontalRho, verticalRho, projectedRadiusPx: 180});
}
{
  const values = [0.2, 0.175, 0.225, 0.22].map(rho => mask(rho, 0.2, 0.02, 0.005));
  vectorNear(values, [1, 0, 0, 0.5]);
  checks.push({id: 'pulse-band', radii: [0.2, 0.175, 0.225, 0.22], masks: values});
}
{
  const centerline = mask(0.2, 0.2, 0.001, 0.005);
  near(centerline, 0.648);
  checks.push({id: 'pulse-thin-band', centerline, interpretation: 'Visible but not opaque; the draft promises visibility, not unit alpha for every thickness.'});
}
{
  const straight = [0.8, 0.2, 0.1], alpha = 0.25, background = [0.1, 0.1, 0.1];
  const premultiplied = straight.map(value => value * alpha);
  const correct = premultiplied.map((value, index) => value + (1 - alpha) * background[index]);
  const doubleMultiplied = premultiplied.map((value, index) => value * alpha + (1 - alpha) * background[index]);
  vectorNear(correct, [0.275, 0.125, 0.1]);
  vectorNear(doubleMultiplied, [0.125, 0.0875, 0.08125]);
  checks.push({id: 'transfer-shader-alpha', premultiplied, correct, doubleMultiplied});
}
{
  const weights = [0.6 * 0.5, 0.4 * 0.5, 0.5];
  vectorNear(weights, [0.3, 0.2, 0.5]); near(weights.reduce((a, b) => a + b, 0), 1);
  checks.push({id: 'author-exclusive-weights', weights});
}
{
  const weights = [0.2 * 0.75, 0.8 * 0.75, 0.25];
  vectorNear(weights, [0.15, 0.6, 0.25]); near(weights.reduce((a, b) => a + b, 0), 1);
  const separateAdditiveWeight = 0.4;
  checks.push({id: 'transfer-animation-layers', exclusiveWeights: weights, separateAdditiveWeight,
    interpretation: 'No normalization across exclusive and additive layers; no quaternion/pose interpolation is simulated.'});
}
{
  const rootBeforeHandoff = 2 * 0.12;
  const controllerAfterHandoff = 3 * (0.2 - 0.12);
  const correctTravel = rootBeforeHandoff + controllerAfterHandoff;
  const doubleAppliedTravel = correctTravel + 2 * (0.2 - 0.12);
  near(correctTravel, 0.48); near(doubleAppliedTravel, 0.64);
  checks.push({id: 'transfer-animation-travel', rootBeforeHandoff, controllerAfterHandoff, correctTravel, doubleAppliedTravel});
}
{
  const budgetMs = 1000 / 90;
  const fullGpuMs = 13.6, quarterPixelsGpuMs = 8.2;
  const pixelCostMs = (fullGpuMs - quarterPixelsGpuMs) / 0.75;
  const fixedCostMs = fullGpuMs - pixelCostMs;
  near(pixelCostMs, 7.2); near(fixedCostMs, 6.4);
  const sixteenthPixelsGpuMs = fixedCostMs + pixelCostMs / 16;
  near(sixteenthPixelsGpuMs, 6.85);
  const cpuActiveMs = 8.5;
  // Stipulated ideal pipeline and fixed-refresh pacing, not a universal engine equation.
  const present = gpuMs => Math.ceil(Math.max(cpuActiveMs, gpuMs) / budgetMs) * budgetMs;
  near(present(fullGpuMs), 200 / 9); near(present(quarterPixelsGpuMs), 100 / 9);
  near(present(sixteenthPixelsGpuMs), 100 / 9);
  checks.push({id: 'transfer-frame-limiting-stage', budgetMs, pixelCostMs, fixedCostMs, sixteenthPixelsGpuMs,
    fullPresentMs: present(fullGpuMs), quarterPixelsPresentMs: present(quarterPixelsGpuMs),
    sixteenthPixelsPresentMs: present(sixteenthPixelsGpuMs),
    interpretation: 'CPU becomes limiting after first resolution probe; further pixel reduction does not improve stipulated cadence.'});
}
console.log(JSON.stringify({schema: 'godskills-review-b-static-arithmetic-v1',
  evidence: 'synthetic reviewer arithmetic; no upstream execution, renderer or measurement',
  passed: checks.length, checks}, null, 2));
