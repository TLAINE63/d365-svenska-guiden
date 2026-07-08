/**
 * Partners that should never be shown in public partner listings or profiles.
 * Add slugs/names here when a partner is a test/draft entry that must remain
 * in the database but not be visible on the site.
 */
export const HIDDEN_PARTNER_SLUGS = new Set(["dynamic-factory"]);
export const HIDDEN_PARTNER_NAMES = new Set(["dynamic factory"]);

export function isPartnerExcluded(name: string, slug?: string): boolean {
  if (slug && HIDDEN_PARTNER_SLUGS.has(slug.trim().toLowerCase())) {
    return true;
  }
  return HIDDEN_PARTNER_NAMES.has(name.trim().toLowerCase());
}
