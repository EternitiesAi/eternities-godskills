// Finite English request scoping for lexical exclusions and runtime admission.
// Balanced, nonnested inline quotes are data. Apostrophes within words survive.
// This does not parse arbitrary negation, historical context or quotation scope.
const quoted=/“[^”]*”|‘[^’]*’|(?<![\p{L}\p{N}])'(?:\\.|[^'\\])*'(?![\p{L}\p{N}])|"(?:\\.|[^"\\])*"|`[^`]*`/gu;
const refusedAction=/\b(?:do not|don t|never|no need to|avoid)\s+(?:build\w*|implement\w*|develop\w*|design\w*|audit\w*|migrat\w*|evaluat\w*|test\w*|verif\w*|repair\w*|fix(?:ing)?|debug(?:ging)?|compar\w*|qualif\w*|integrat\w*|import\w*|render\w*|encod\w*|export\w*|review\w*|calculat\w*|count\w*|lowercase|uppercase|capitalize)\b/u;

export function affirmativeRequestClauses(query){
  return query.replace(quoted,' ')
    // Preserve identifiers such as Three.js; a sentence dot precedes whitespace.
    .split(/[!?;]+|\.(?=\s|$)|\b(?:but|instead)\b/iu)
    .map(clause=>clause.normalize('NFKC').toLowerCase().replace(/['’]/gu,' ').replace(/\s+/g,' ').trim())
    .map(text=>{
      const refusal=refusedAction.exec(text);
      // Keep live work before a refusal, but do not borrow its declined tail.
      // A sentence, semicolon or explicit contrast can introduce new live work.
      return refusal?text.slice(0,refusal.index).trim():text;
    }).filter(Boolean);
}
