import { analyzeFlow } from './index.mjs';

// Entirely fictional work and capacities for one common weekly planning period.
const baselineInput = {
  resources: [
    { id: 'review', availableHours: 12, reworkHours: 4 },
    { id: 'acceptance', availableHours: 4, reworkHours: 0 },
  ],
  classes: [
    { id: 'standard', readyCount: 4, blockedCount: 0,
      effortHours: { review: 1, acceptance: 0.5 } },
    { id: 'complex', readyCount: 2, blockedCount: 0,
      effortHours: { review: 3, acceptance: 1 } },
    { id: 'missing-inputs', readyCount: 0, blockedCount: 20,
      effortHours: { review: 1, acceptance: 0.5 } },
  ],
};
const preventedReworkInput = structuredClone(baselineInput);
preventedReworkInput.resources[0].reworkHours = 2;

console.log(JSON.stringify({
  fictional: true,
  period: 'One fictional week; all counts and hours share this boundary.',
  baseline: { input: baselineInput, result: analyzeFlow(baselineInput) },
  preventedRework: { input: preventedReworkInput, result: analyzeFlow(preventedReworkInput) },
  interpretation: 'Preventing two review rework hours removes the modeled two-hour review shortfall. The 20 blocked items are future effort, not presently ready demand. Acceptance has no modeled spare hours.',
  beforeIntervention: [
    'Confirm the correction is preventable without reducing quality, and do not include it again in class effort.',
    'Trace missing prerequisites and ready arrival times; blocked counts cannot explain where or why work waits.',
    'Check downstream acceptance and release timestamps and capacity before expecting more completed work.',
    'Choose an authorized owner, observation window, quality guardrail and reversal condition. If accepted completions do not improve, revisit the diagnosis.',
  ],
  limitation: 'A synthetic effort reconciliation is not a throughput forecast, staffing recommendation or observed business improvement.',
}, null, 2));
