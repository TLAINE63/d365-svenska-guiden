// Standardiserad lista över branscher (samma som /branschlosningar)
// Slug används i URL: /branscher/<slug>
// `name` matchar partners.industries / secondary_industries i databasen.

export interface StandardIndustry {
  slug: string;
  name: string;
  short: string;
  sniCode?: string;
}

export const STANDARD_INDUSTRIES: StandardIndustry[] = [
  { slug: "jordbruk-skogsbruk", name: "Jordbruk & Skogsbruk", short: "Jordbruk", sniCode: "01" },
  { slug: "livsmedel-processindustri", name: "Livsmedel & Processindustri", short: "Livsmedel", sniCode: "10" },
  { slug: "tillverkning", name: "Tillverkningsindustri", short: "Tillverkning", sniCode: "13" },
  { slug: "life-science-medtech", name: "Life Science / Medtech", short: "Life Science", sniCode: "21" },
  { slug: "energi-utilities", name: "Energi & Utilities", short: "Energi", sniCode: "35" },
  { slug: "bygg-entreprenad", name: "Bygg & Entreprenad", short: "Bygg", sniCode: "41" },
  { slug: "grossist-distribution", name: "Grossist & Distribution", short: "Grossist", sniCode: "46" },
  { slug: "retail-ehandel", name: "Retail & E-handel", short: "Retail", sniCode: "47" },
  { slug: "mode-sport-textil", name: "Mode, Sport & Textil", short: "Mode & Textil", sniCode: "47m" },
  { slug: "logistik-transport", name: "Logistik & Transport", short: "Logistik", sniCode: "49" },
  { slug: "media-publishing", name: "Media & Publishing", short: "Media", sniCode: "58" },
  { slug: "telekom-it-tjanster", name: "Telekom & IT-tjänster", short: "IT & Telekom", sniCode: "61" },
  { slug: "finans-forsakring", name: "Finans & Försäkring", short: "Finans", sniCode: "64" },
  { slug: "fastighet-forvaltning", name: "Fastighet & Förvaltning", short: "Fastighet", sniCode: "68" },
  { slug: "konsulttjanster", name: "Konsulttjänster", short: "Konsult", sniCode: "69" },
  { slug: "uthyrning", name: "Uthyrningsverksamhet", short: "Uthyrning", sniCode: "77" },
  { slug: "offentlig-sektor", name: "Offentlig sektor", short: "Offentlig", sniCode: "84" },
  { slug: "utbildning", name: "Utbildning", short: "Utbildning", sniCode: "85" },
  { slug: "halsa-sjukvard", name: "Hälsa- & sjukvård", short: "Hälsa", sniCode: "86" },
  { slug: "nonprofit-organisationer", name: "Non-profit / Organisationer", short: "Non-profit", sniCode: "94" },
  { slug: "medlemsorganisationer", name: "Medlemsorganisationer", short: "Medlemsorg", sniCode: "94m" },
];

export const findIndustryBySlug = (slug: string) =>
  STANDARD_INDUSTRIES.find((i) => i.slug === slug);
