import { simulate } from './index.mjs';

// Entirely fictional, authored data: no captured player or engine telemetry.
const input = {
  events: [
    { at: 0, type: 'attack', id: 'fictional-attack' },
    { at: 100, type: 'hit', id: 'fictional-hit' },
    { at: 140, type: 'strike', id: 'fictional-attack' },
    { at: 250, type: 'complete', id: 'fictional-attack' },
    { at: 300, type: 'complete', id: 'fictional-hit' },
  ],
  sampleTimes: [0, 100, 150, 250, 300, 350, 400],
};

process.stdout.write(`${JSON.stringify({
  scenario: 'Fictional interrupted attack; illustrative state and weights only',
  timeUnit: 'milliseconds',
  input,
  result: simulate(input),
}, null, 2)}\n`);
