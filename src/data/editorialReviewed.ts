/**
 * Register över partnerprofiler vars d365.se-bedömning granskats redaktionellt.
 * Nyckel = partnerns slug, värde = granskningsdatum (ÅÅÅÅ-MM-DD).
 * Profiler i registret visar den starkare etiketten "Redaktionellt granskad av D365.SE"
 * istället för standardetiketten "AI-assisterad sammanställning".
 * Listan underhålls manuellt av redaktionen.
 */
export const editorialReviewed: Record<string, string> = {
  // Exempel: "acando": "2026-10-05",
};

export const isEditorialReviewed = (slug: string | null | undefined): boolean =>
  !!slug && slug in editorialReviewed;

export const editorialReviewedDate = (slug: string | null | undefined): string | null =>
  (slug && editorialReviewed[slug]) || null;
