// Explicit English request boundaries, not a general semantic classifier.
// Domain words in a supplied literal do not necessarily request a workflow.
export function lexicalSelectionBoundary(query) {
  const text=query.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
  if(/\bask (?:one|a|an) clarifying question before (?:selecting|choosing|using) (?:a |an |the )?(?:skill|specialist|workflow)\b/.test(text))return 'clarification-requested-before-selection';
  const workflow=/\b(?:build|implement|develop|design|audit|migrate|evaluate|test|verify|repair)\s+(?:a|an|the|this|our|my)\b/.test(text);
  if(workflow)return null;
  const limited=/\b(?:give only|only the (?:number|result|text|count)|just answer|in one sentence|no rewrite[^.]*additional process)\b/.test(text);
  if(!limited)return null;
  const literalOperation=/\b(?:lowercase|uppercase|capitalize) (?:the |this )?(?:literal text|text|string)\b|\bcount (?:the )?(?:words|characters|letters)\b|\bgrammar question\b|\bexplain (?:the |this |a )?metaphor\b/.test(text);
  const arithmetic=/\b(?:what is|calculate)\s+-?\d+(?:\.\d+)?\s*(?:plus|minus|times|multiplied by|divided by|[+*/−-])\s*-?\d+/.test(text);
  return literalOperation||arithmetic?'explicit-limited-micro-task':null;
}
