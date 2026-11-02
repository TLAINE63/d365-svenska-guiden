/**
 * Redaktionellt val (Thomas Laine 2026-11-02): tillägg som är vanliga hos svenska
 * kunder och därför visas först som exempel på produktsidorna, i angiven ordning.
 * Bara ordning bland exempel, aldrig ranking i katalogen. Kommersiell status
 * (avtal, premium) får aldrig styra listan.
 */
export const ISV_COMMON_EXAMPLES: Record<string, string[]> = {
  "Business Central": ["swebase", "exflow", "continia-document-capture", "golden-edi"],
  "Finance & Supply Chain Management": ["truvio-exflow-ap"],
};

/** Lägre tal = visas tidigare; lösningar utanför listan får Infinity. */
export const commonExampleRank = (product: string, solutionId: string): number => {
  const i = (ISV_COMMON_EXAMPLES[product] || []).indexOf(solutionId);
  return i === -1 ? Infinity : i;
};
