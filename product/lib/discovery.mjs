// A bounded lexical model, not semantic applicability or permission inference.
// Each intent requires independent request cues AND a matching metadata profile.
// No query strings or skill IDs are used as lookup keys.
const normalize = text => (text.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).join(' ');
const media = /\b(?:audio|dsp|tts|speech|speaker|microphone|sample rate|plugin|callback|voice clon\w*|synthesi\w*)\b/;

const profiles = [
  {
    name: 'written authorial voice',
    cues: [
      ['authorial style', /\b(?:sound|read|write) (?:\w+ ){0,3}like (?:me|us|myself|something i would write)\b|\b(?:my|our|own|team s|brand|authorial) (?:\w+ ){0,2}(?:voice|writing style)\b|\bwriting samples\b/],
      ['text adaptation', /\b(?:sound|read) (?:\w+ ){0,3}like\b|\b(?:rewrite|adapt|draft|announcement|update|text|writing|facts|meaning|claims)\b/],
    ],
    exclude: media,
    metadata: [/\bvoice\b/, /\b(?:samples|registers|traits|authorial)\b/],
  },
  {
    name: 'interpersonal clarification',
    cues: [
      ['misunderstanding', /\btalking past\b|\b(?:misunderstand\w*|disagreement|conflict)\b|\bnot hearing each other\b/],
      ['participants', /\b(?:each other|colleague|partner|friend|teammate|someone|participants?|interpersonal|conversation)\b/],
      ['dialogue action', /\b(?:say|reply|respond|dialogue|understand|repair|clarify|respectful\w*)\b/],
    ],
    exclude: media,
    metadata: [/\b(?:interpersonal|reflective listening)\b/, /\b(?:dialogue|conflict|misunderstanding)\b/],
  },
  {
    name: 'task record recovery',
    cues: [
      ['resumption', /\b(?:resume|recover|continuing|continue|pick up|left off)\b/],
      ['prior task record', /\b(?:notes|records|checkpoint|handoff|saved decisions|earlier task|previous task)\b/],
      ['freshness check', /\b(?:old|outdated|stale|current|changed|still right|still valid|check|verify|verifying|reconcile)\b/],
    ],
    metadata: [/\b(?:memory|continuity|task record)\b/, /\b(?:stale|freshness)\b/, /\b(?:recover|resume)\b/],
  },
  {
    name: 'delivery coverage and agreement',
    cues: [
      ['obligation or gap', /\b(?:forget|forgot|missing|omissions?|failed to deliver|promises|promised|requirements|obligations?)\b/],
      ['artifact or delivery', /\b(?:documents?|documentation|readme|implementation|artifacts?|deliver\w*|shipped|outputs?)\b/],
      ['cross artifact comparison', /\b(?:disagree|contradict\w*|consistency|compare|coverage|across|between)\b/],
    ],
    metadata: [/\b(?:obligations?|requirements)\b/, /\b(?:omissions?|missing)\b/, /\b(?:contradictions?|contradictory|consistency)\b/],
  },
  {
    name: 'sustained work and effect reconciliation',
    cues: [
      ['work horizon', /\b(?:days|weeks|this week|multi day|multi stage|several sessions|across sessions|across interruptions|milestones?)\b/],
      ['continued delivery', /\b(?:finish|complete|carry|keep working|continue|resume)\b/],
      ['interruption or effect state', /\b(?:repeat|duplicate|retry\w*|in flight|pending|running|active job|operations?|interruption\w*)\b/],
    ],
    metadata: [/\bmilestones?\b/, /\b(?:resume|interrupted|interruption)\b/, /\b(?:objective|project)\b/],
  },
];

export function lexicalQueryEvidence(query) {
  const text = normalize(query);
  const intents = profiles.filter(profile => !profile.exclude?.test(text) &&
    profile.cues.every(([, pattern]) => pattern.test(text)));
  return {intents, writtenVoice: intents.some(profile => profile.name === 'written authorial voice')};
}

export function lexicalIntentMatch(item, evidence) {
  const text = normalize(`${item.summary} ${item.triggers.join(' ')}`);
  const matched = evidence.intents.filter(profile => profile.metadata.every(pattern => pattern.test(text)));
  // A capped ranking bonus: corroborated phrases outrank incidental word hits.
  // Scores are ordering heuristics, not confidence or applicability probabilities.
  return {
    score: matched.length ? 60 : 0,
    reasons: matched.map(profile => `Lexical intent: ${profile.name}; cues: ${profile.cues.map(([name]) => name).join(', ')}`),
  };
}
