import { summarizeOnboarding } from './index.mjs';

// Every account and acceptance observation below is invented.
const input = {
  cutoff: '2026-10-15T00:00:00Z',
  windowDays: 7,
  accounts: [
    { id: 'fictional-three-days', enteredAt: '2026-10-01T00:00:00Z', eligible: true, acceptedAt: '2026-10-04T00:00:00Z' },
    { id: 'fictional-deadline', enteredAt: '2026-10-01T00:00:00Z', eligible: true, acceptedAt: '2026-10-08T00:00:00Z' },
    { id: 'fictional-immediate', enteredAt: '2026-10-01T00:00:00Z', eligible: true, acceptedAt: '2026-10-01T00:00:00Z' },
    { id: 'fictional-late', enteredAt: '2026-10-01T00:00:00Z', eligible: true, acceptedAt: '2026-10-09T00:00:00Z' },
    { id: 'fictional-permission', enteredAt: '2026-10-01T00:00:00Z', eligible: true, acceptedAt: null, blocker: 'Awaiting administrator import permission' },
    { id: 'fictional-unknown', enteredAt: '2026-10-01T00:00:00Z', eligible: true },
    { id: 'fictional-pending-accepted', enteredAt: '2026-10-10T00:00:00Z', eligible: true, acceptedAt: '2026-10-12T00:00:00Z' },
    { id: 'fictional-pending-waiting', enteredAt: '2026-10-14T00:00:00Z', eligible: true },
    { id: 'fictional-ineligible', enteredAt: '2026-10-01T00:00:00Z', eligible: false, acceptedAt: '2026-10-03T00:00:00Z' },
  ],
};

console.log(JSON.stringify({
  fictional: true,
  scenario: 'An invented inventory service reports its first useful result.',
  outcomeDefinition: 'A warehouse operator accepts a usable pick list from their account\'s own inventory. These fictional records illustrate that event; they are not evidence of customer activation.',
  cutoff: input.cutoff,
  windowDays: input.windowDays,
  summary: summarizeOnboarding(input),
  interpretation: [
    'Three of six mature eligible accounts have an observed acceptance within seven fixed days.',
    'One late acceptance stays outside the window-success numerator and its median.',
    'The permission blocker and missing outcome stay in the mature denominator; neither proves abandonment.',
    'Two eligible accounts are still pending, including one early acceptance. One account is ineligible.',
    'A three-day median among successful completers does not describe all accounts or establish retention.',
  ],
}, null, 2));
