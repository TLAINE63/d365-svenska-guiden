/**
 * Centrala branschgrupper för att filtrera bort uppenbart irrelevanta
 * frågor/alternativ i behovsanalyser och kravspecar.
 *
 * Värdena matchar `allIndustries` i `src/data/partners.ts` samt de lokala
 * `industryOptions`-listorna i analyserna.
 */

const SERVICES_INDUSTRIES = new Set<string>([
  "Konsulttjänster",
  "Finans & Försäkring",
  "Telekom & IT-tjänster",
  "Media & Publishing",
  "Hälsa- & sjukvård",
  "Non-profit / Organisationer",
  "Medlemsorganisationer",
  "Utbildning",
  "Offentlig sektor",
  "Fastighet & Förvaltning",
]);

const B2C_ORIENTED_INDUSTRIES = new Set<string>([
  "Retail & E-handel",
  "Mode, Sport & Textil",
]);

const PRODUCT_INDUSTRIES = new Set<string>([
  "Tillverkningsindustri",
  "Livsmedel & Processindustri",
  "Grossist & Distribution",
  "Retail & E-handel",
  "Mode, Sport & Textil",
  "Life Science / Medtech",
  "Transport & Logistik",
  "Jordbruk & Skogsbruk",
  "Energi & Utilities",
  "Bygg, Entreprenad & Installation",
  "Uthyrningsverksamhet",
]);

/** Ren tjänste-/kunskapsverksamhet utan fysiska produkter eller lager. */
export const isServicesIndustry = (industry?: string | null): boolean =>
  !!industry && SERVICES_INDUSTRIES.has(industry);

/** Bransch med stor andel slutkundsförsäljning (B2C/retail-mönster). */
export const isB2COrientedIndustry = (industry?: string | null): boolean =>
  !!industry && B2C_ORIENTED_INDUSTRIES.has(industry);

/** Bransch som hanterar fysiska produkter, lager, distribution eller produktion. */
export const isProductIndustry = (industry?: string | null): boolean =>
  !!industry && PRODUCT_INDUSTRIES.has(industry);
