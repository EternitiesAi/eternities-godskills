// A bounded lexical model, not semantic applicability or permission inference.
// Each intent requires independent request cues AND a matching metadata profile.
// No query strings or skill IDs are used as lookup keys.
const normalize = text => (text.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).join(' ');
const media = /\b(?:audio|dsp|tts|speech|speaker|microphone|sample rate|plugin|callback|voice clon\w*|synthesi\w*)\b/;

// This profile uses deliberately finite English scoping, not general discourse parsing.
// Balanced, nonnested quotes are omitted; apostrophes inside words are left alone.
const quotedRequestMaterial = /“[^”]*”|‘[^’]*’|(?<![\p{L}\p{N}])'[^']*'(?![\p{L}\p{N}])|"(?:\\.|[^"\\])*"|`[^`]*`/gu;
const refusedTeachingAction = /\b(?:do not|don t|never|no need to|avoid|not to|rather than)\s+(?:teach\w*|train\w*|instruct\w*|educat\w*|prepar\w*|plan\w*|design\w*|creat\w*|build\w*|mak\w*|develop\w*|arrang\w*|devis\w*|provid\w*|giv\w*|offer\w*|organis\w*|organiz\w*|set up|put together|run|use)\b/;
const declinedLearningFormat = /\bno\s+(?:lessons?|workshops?|courses?|training|instruction|learning (?:models?|activities|experiences)|teaching (?:models?|activities|demos?))(?: \w+){0,5}\s+(?:requested|needed|wanted)\b/;
// A learner audience alone is insufficient: it must accompany a teaching format,
// while four separate gates still require requested action, explanation, an
// active representation and manipulation/feedback. These are finite English
// concept families, not a semantic classifier or an exact-query lookup table.
const teachingPurpose = {
  test: text => /\b(?:teach\w*|train\w*|instruct\w*|lesson\w*|workshop\w*|tutorial\w*|courses?|class(?:es)?|classroom|educational|learning (?:models?|tasks?|activit\w*|experiences?))\b|\bhelp (?:\w+ ){0,2}(?:children|students|learners?|novices?|beginners?|trainees?|apprentices?)\b/.test(text) ||
    (/\b(?:students?|pupils?|children|learners?|novices?|beginners?|trainees?|apprentices?|visitors?)\b/.test(text) &&
     /\b(?:activit\w*|exercises?|investigations?|sessions?|demonstrations?)\b/.test(text)),
};
// Require request-verb forms, not nominal mentions such as training or planning.
// A training-simulator appraisal can satisfy several topic cues without asking
// for a new teaching activity; topic evidence must not supply its own action.
const requestedTeachingAction = /\b(?:prepare|plan|design|create|build|make|develop|teach|train|instruct|help|arrange|devise|provide|give|offer|organise|organize|set up|put together|i d like)\b/;
const historicalTeachingClause = /\b(?:last (?:term|year|month|week)|previously|formerly|once|used to)\b(?: \w+)*\b(?:intended|planned|wanted|built|designed|taught|prepared|created|developed)\b/;

function learnerRequestText(query) {
  return query
    .replace(quotedRequestMaterial, ' ')
    // A contrast or sentence boundary may introduce a new live request.
    // Keep the refused phrase "rather than" intact for the filter below.
    .split(/[.!?;]+|\b(?:but|instead|rather(?!\s+than\b))\b/iu)
    .filter(clause => {
      const text = normalize(clause);
      return !refusedTeachingAction.test(text) && !declinedLearningFormat.test(text) && !historicalTeachingClause.test(text);
    })
    .join(' ');
}

const profiles = [
  {
    name: 'learner-model explanation',
    // A corroborated requested activity takes precedence over incidental topic
    // words. This tier is separate from the unchanged keyword/bonus scores and
    // does not select, activate or authorize a skill.
    prioritizeRequestedActivity: true,
    // Scope only this intent to unquoted affirmative request clauses. The finite
    // cues do not resolve nested/escaped quotations or arbitrary negation.
    prepare: learnerRequestText,
    cues: [
      ['teaching purpose or learner goal', teachingPurpose],
      ['requested preparation or teaching action', requestedTeachingAction],
      ['causal or explanatory objective', /\b(?:why|explain\w*|understand\w*|justif\w*|predict\w*|reason\w*|cause\w*|account for|describ\w* how|defend\w*|reconcil\w*|connect\w*|compar\w*|investigat\w*|work out)\b/],
      ['model, lesson, or explorable representation', /\b(?:models?|microsimulat\w*|simulat\w*|traces?|lessons?|workshops?|activit\w*|exercises?|investigations?|representations?|diagrams?|experiments?|plots?|tables?|cards?|boards?|grids?|sections?|panels?|frames?|nets?|arrows?|shapes?|stations?|sandbox\w*|transparenc\w*|strips?|blocks?|tiles?|discs?|objects?|materials?|props?|balance beam|pieces|tokens?|valves?|ramps?|pendul\w*|sliders?|physical|hands on|explorable)\b/],
      // A feedback-bearing small teaching model need not specify its controls yet.
      // Purpose, requested action, explanation and representation are still required;
      // this is ranking evidence, not permission or a proven learner interaction.
      ['learner manipulation or feedback-bearing model', /\b(?:adjust\w*|manipulat\w*|explor\w*|interact\w*|mov\w*|rearrang\w*|vary|alter\w*|chang\w*|pause|control\w*|sliders?|microsimulat\w*|causal feedback|drag\w*|add\w*|remov\w*|reposition\w*|relocat\w*|assembl\w*|step\w*|try|redistribut\w*|rotat\w*|fold\w*|unfold\w*|overlay\w*|rerout\w*|redirect\w*|switch\w*)\b/],
    ],
    // Match meaning-bearing owner metadata, not an ID, query, reference, or path.
    metadata: [
      /\b(?:evidence linked lessons|lesson planning|learning outcomes)\b/,
      /\b(?:teaching handoffs|teaching assessment|assessments?)\b/,
      /\b(?:learner reports|observable goals|achievement evidence)\b/,
    ],
  },
  {
    name: 'usability observation synthesis',
    cues: [
      ['people doing a task', /\b(?:participants?|users?|screen reader|task completion)\b/],
      ['observed interaction', /\b(?:observations?|observed|hesitat\w*|struggl\w*|completed|completion|missed)\b/],
      ['findings action', /\b(?:summariz\w*|synthesi\w*|recommend\w*|follow up|interpretation|findings)\b/],
      ['interface or task artifact', /\b(?:checkout|sign up|signup|page|interface|website|app|usability|button|delivery fee|flow|prototype|form)\b/],
    ],
    exclude: /\b(?:clinical|placebo|drug|treatment|lab assay|waveform|dsp)\b/,
    negated: /\b(?:do not|don t|never) (?:summariz\w*|synthesi\w*|interpret\w*|recommend\w*)(?: \w+){0,5} (?:observations?|usability findings)\b/,
    metadata: [/\busability\b/, /\bobservations?\b/, /\b(?:studies|interviews|research)\b/],
  },
  {
    name: 'written authorial voice',
    cues: [
      ['authorial style', /\b(?:sound|read|write) (?:\w+ ){0,3}like (?:me|us|myself|something i would write)\b|\b(?:my|our|own|team s|brand|authorial) (?:\w+ ){0,2}(?:voice|writing style)\b|\bwriting samples\b/],
      ['text adaptation', /\b(?:sound|read) (?:\w+ ){0,3}like\b|\b(?:rewrite|adapt|draft|announcement|update|text|writing|facts|meaning|claims)\b/],
    ],
    exclude: media,
    // A narrow explicit exclusion must not become positive ranking evidence.
    // This does not claim arbitrary negation or quotation-scope parsing.
    negated: /\b(?:do not|don t|never) (?:rewrite|write|adapt)(?: \w+){0,4} (?:my|our|own|team s|brand) (?:\w+ ){0,2}(?:voice|writing style)\b/,
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
  const intents = profiles.filter(profile => {
    const scopedText = profile.prepare ? normalize(profile.prepare(query)) : text;
    return !profile.exclude?.test(scopedText) && !profile.negated?.test(scopedText) &&
      profile.cues.every(([, pattern]) => pattern.test(scopedText));
  });
  return {intents, writtenVoice: intents.some(profile => profile.name === 'written authorial voice')};
}

export function lexicalIntentMatch(item, evidence) {
  const text = normalize(`${item.summary} ${item.triggers.join(' ')}`);
  const matched = evidence.intents.filter(profile => profile.metadata.every(pattern => pattern.test(text)));
  // Preserve the capped score component. The narrowly corroborated teaching
  // request has a separate ordering tier so arbitrary keyword overlap cannot
  // defeat it. Neither the tier nor score proves semantic applicability.
  return {
    score: matched.length ? 60 : 0,
    prioritizeRequestedActivity: matched.some(profile => profile.prioritizeRequestedActivity),
    reasons: matched.map(profile => `Lexical intent: ${profile.name}; cues: ${profile.cues.map(([name]) => name).join(', ')}${profile.prioritizeRequestedActivity ? '; ordering: corroborated teaching request before incidental keyword matches' : ''}`),
  };
}
