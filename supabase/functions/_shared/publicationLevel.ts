export type PublicationLevel = 'premium' | 'basic' | 'hidden';
export interface PartnerPublication { is_featured?: boolean | null; hide_basic_card?: boolean | null }
export function partnerLevel(p: PartnerPublication): PublicationLevel {
  return p.is_featured ? 'premium' : p.hide_basic_card ? 'hidden' : 'basic';
}
export function partnerLevelFields(level: PublicationLevel) {
  return { is_featured: level === 'premium', hide_basic_card: level === 'hidden' };
}
export function hasDatedVerification(p: { information_status?: string | null; information_verified_at?: string | null }) {
  return p.information_status === 'verified' && !!p.information_verified_at;
}
export interface IsvPublication { publish_d365?: boolean | null; publication_status?: string | null; is_published?: boolean | null; premium_vendor?: boolean | null; premium_product?: boolean | null }
export function isvLevel(p: IsvPublication, kind: 'vendor' | 'product'): PublicationLevel {
  if (!p.publish_d365 || (kind === 'vendor' ? p.publication_status !== 'published' : !p.is_published)) return 'hidden';
  return (kind === 'vendor' ? p.premium_vendor : p.premium_product) ? 'premium' : 'basic';
}
export function isvLevelFields(level: PublicationLevel, kind: 'vendor' | 'product') {
  const fields: Record<string, unknown> = { publish_d365: level !== 'hidden' };
  // d365.se visibility is independent of the other publication destinations.
  if (level !== 'hidden') {
    fields[kind === 'vendor' ? 'publication_status' : 'is_published'] = kind === 'vendor' ? 'published' : true;
    fields[kind === 'vendor' ? 'premium_vendor' : 'premium_product'] = level === 'premium';
  }
  return fields;
}
export function premiumProductAllowance(extraProducts: number) {
  return 3 + Math.max(0, Math.floor(extraProducts));
}