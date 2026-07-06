// Shared helper: compute a weighted relevance between a user query/criteria
// and a partner's extended_content ("fördjupning"). Used by AI search and
// partner matching to boost the fördjupning-text's influence when it clearly
// matches the user's terms (industries, workloads, ISV-lösningar etc.).

const SV_STOPWORDS = new Set([
  'och','eller','men','att','som','det','den','de','ett','en','är','har','för','med','på','av','till','från','i','om','ska','kan','vi','ni','jag','du','han','hon','vad','var','vår','vårt','våra','vilka','vilken','vilket','samt','där','här','när','så','inte','ej','man','vid','under','över','mellan','efter','före','via','per','the','and','or','for','with','of','to','a','an','is','are','be','by','in','on','at','it','this','that','was','were'
]);

export function tokenize(input: string): string[] {
  if (!input) return [];
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-zåäö0-9\s\-]/gi, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !SV_STOPWORDS.has(t));
}

export interface RelevanceResult {
  score: number;         // 0..1 normalized overlap
  level: 'HÖG' | 'MEDEL' | 'LÅG' | 'INGEN';
  matchedTerms: string[]; // unique tokens that hit
  snippetChars: number;   // recommended snippet length
  weightHint: number;     // 0..1 hint the AI should use to weight fördjupning
}

/**
 * Weighted overlap between query tokens and extended_content tokens.
 * Returns level/snippet size/weight hint so callers can scale prompt injection.
 */
export function scoreExtendedRelevance(
  queryText: string,
  extended: string,
): RelevanceResult {
  const ext = (extended || '').trim();
  if (!ext) return { score: 0, level: 'INGEN', matchedTerms: [], snippetChars: 0, weightHint: 0 };

  const qTokens = new Set(tokenize(queryText));
  if (qTokens.size === 0) {
    // No query terms → default LÅG relevance (still include a short snippet)
    return { score: 0, level: 'LÅG', matchedTerms: [], snippetChars: 500, weightHint: 0.15 };
  }

  const extTokens = tokenize(ext);
  const extSet = new Set(extTokens);
  const matched: string[] = [];
  for (const t of qTokens) if (extSet.has(t)) matched.push(t);

  // Coverage: how many of the query's distinct terms show up
  const coverage = matched.length / qTokens.size;

  // Density: frequency of hits relative to text length
  const hitCount = extTokens.reduce((n, t) => n + (qTokens.has(t) ? 1 : 0), 0);
  const density = extTokens.length > 0 ? Math.min(1, (hitCount / extTokens.length) * 25) : 0;

  const score = Math.min(1, coverage * 0.7 + density * 0.3);

  let level: RelevanceResult['level'] = 'LÅG';
  let snippetChars = 500;
  let weightHint = 0.2;
  if (score >= 0.5) {
    level = 'HÖG';
    snippetChars = 1800;
    weightHint = 1;
  } else if (score >= 0.25) {
    level = 'MEDEL';
    snippetChars = 1100;
    weightHint = 0.6;
  } else if (score > 0) {
    level = 'LÅG';
    snippetChars = 700;
    weightHint = 0.3;
  } else {
    level = 'LÅG';
    snippetChars = 500;
    weightHint = 0.15;
  }

  return { score, level, matchedTerms: matched.slice(0, 8), snippetChars, weightHint };
}

/** Squeeze whitespace + cap length safely (word-boundary). */
export function cleanSnippet(text: string, max: number): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.substring(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.7 ? cut.substring(0, lastSpace) : cut) + '…';
}
