// Explicit English request boundaries, not a general semantic classifier.
// Domain words in a supplied literal do not necessarily request a workflow.
import {affirmativeRequestClauses} from './request-scope.mjs';

export function lexicalSelectionBoundary(query) {
  // Use only unquoted live clauses to test workflow precedence. Preserve
  // arithmetic operators and decimals for the narrow arithmetic check below.
  const text=affirmativeRequestClauses(query).join(' ');
  if(/\bask (?:one|a|an) clarifying question before (?:selecting|choosing|using) (?:a |an |the )?(?:skill|specialist|workflow)\b/.test(text))return 'clarification-requested-before-selection';
  // Keep affirmative workflow verbs with an object, including plural objects
  // without an article. A concise answer/counting substep is not the whole task.
  const workflow=/\b(?:build|implement|develop|design|audit|migrate|evaluate|test|verify|repair|compare)\s+\p{L}/u.test(text);
  if(workflow)return null;
  const limited=/\b(?:give only|only the (?:number|result|text|count)|just answer|in one sentence|no rewrite[^.]*additional process)\b/.test(text);
  if(!limited)return null;
  const literalOperation=/\b(?:lowercase|uppercase|capitalize) (?:the |this )?(?:literal text|text|string)\b|\bcount (?:the )?(?:words|characters|letters)\b|\bgrammar question\b|\bexplain (?:the |this |a )?metaphor\b/.test(text);
  const arithmetic=/\b(?:what is|calculate)\s+-?\d+(?:\.\d+)?\s*(?:plus|minus|times|multiplied by|divided by|[+*/−-])\s*-?\d+/.test(text);
  return literalOperation||arithmetic?'explicit-limited-micro-task':null;
}
