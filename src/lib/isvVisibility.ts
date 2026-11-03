/**
 * Vad en ISV-produkt eller leverantör får visa publikt.
 * Ej verifierad: ingen logotyp, ingen länk till leverantörens webbplats, inga kontaktuppgifter.
 * Verifierad produkt med aktiv ISV Presence: logotyp, webblänk och kontaktväg (båda krävs).
 * Leverantör är verifierad om den själv är verifierad eller motsvarar en publicerad (verifierad) partner.
 */
export interface FeaturedPartnerLite {
  slug: string;
  name: string;
  is_featured: boolean;
  logo_url?: string | null;
  website?: string | null;
  contact_person?: string | null;
}

const norm = (v: string) =>
  v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

/** Hittar en publicerad partner som är samma bolag som leverantören (t.ex. 4PS). */
export function matchVerifiedPartner(
  vendorName: string | undefined,
  vendorSlug: string | undefined,
  partners: FeaturedPartnerLite[],
): FeaturedPartnerLite | undefined {
  const n = vendorName ? norm(vendorName) : "";
  const s = vendorSlug?.toLowerCase();
  return partners.find((p) => {
    if (!p.is_featured) return false;
    if (s && (p.slug === s || p.slug.startsWith(`${s}-`))) return true;
    if (!n) return false;
    const pn = norm(p.name);
    return pn === n || pn.startsWith(`${n} `);
  });
}

export function isVendorVerified(vendorStatus: string | null | undefined, partnerMatch?: FeaturedPartnerLite): boolean {
  return vendorStatus === "verified" || !!partnerMatch;
}

export interface IsvExposure {
  showLogo: boolean;
  showWebsite: boolean;
  showContact: boolean;
}

/** Produktens egen status styr logotyp, länk och kontakt på produktnivå. */
export function productExposure(productStatus: string | null | undefined, hasPresence = false): IsvExposure {
  // Kräver både D365 Verifierad och aktiv ISV Presence.
  const v = productStatus === "verified" && hasPresence;
  return { showLogo: v, showWebsite: v, showContact: v };
}

/** Leverantörsdelen visar kontakt och länk bara när leverantören är verifierad. */
export function vendorExposure(vendorVerified: boolean): IsvExposure {
  return { showLogo: vendorVerified, showWebsite: vendorVerified, showContact: vendorVerified };
}

/** ISV Presence: årspris inkluderar en app, varje extra verifierad app kostar extra. */
export const ISV_PRESENCE_BASE_SEK = 5990;
export const ISV_PRESENCE_EXTRA_APP_SEK = 995;
export function isvPresenceYearlyPrice(verifiedApps: number): number {
  if (verifiedApps <= 0) return 0;
  return ISV_PRESENCE_BASE_SEK + (verifiedApps - 1) * ISV_PRESENCE_EXTRA_APP_SEK;
}
