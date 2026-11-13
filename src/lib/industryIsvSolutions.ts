import type { IsvSolution } from "@/data/bcIsvSolutions";
import { standardIndustriesFor } from "@/lib/isvIndustries";

/** Lösningar utan angivna produkter räknas som Business Central-tillägg. */
const productsOf = (s: IsvSolution): string[] => (s.products?.length ? s.products : ["Business Central"]);

/**
 * Tilläggslösningar som leverantören själv taggat för en standardbransch
 * (namn eller slug), valfritt avgränsat till en Dynamics 365-produkt.
 * Sorteras alfabetiskt – kommersiell status påverkar aldrig ordningen.
 */
export function isvSolutionsForIndustry(all: IsvSolution[], industry: string, product?: string): IsvSolution[] {
  const key = industry.trim().toLowerCase();
  if (!key) return [];
  return all
    .filter((s) => !product || productsOf(s).includes(product))
    .filter((s) => standardIndustriesFor(s.industryFocus || []).some((i) => i.slug === key || i.name.toLowerCase() === key))
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));
}

/**
 * Mjuk prioritering: partners som ISV:n själv angett som återförsäljare lyfts
 * först, övriga behåller sin ordning. Ingen partner tas bort.
 */
export function prioritizeResellers<T extends { slug: string }>(partners: T[], solution: IsvSolution | null | undefined): T[] {
  const slugs = new Set(solution?.partnerSlugs || []);
  if (!slugs.size) return partners;
  return [...partners.filter((p) => slugs.has(p.slug)), ...partners.filter((p) => !slugs.has(p.slug))];
}

export const isResellerOf = (slug: string, solution: IsvSolution | null | undefined) =>
  !!solution?.partnerSlugs?.includes(slug);
