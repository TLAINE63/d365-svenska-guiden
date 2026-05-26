// Standardiserad lista över branscher (samma som /branschlosningar)
// Slug används i URL: /branscher/<slug>
// `name` matchar partners.industries / secondary_industries i databasen.

export interface StandardIndustry {
  slug: string;
  name: string;
  short: string;
}

export const STANDARD_INDUSTRIES: StandardIndustry[] = [
  { slug: "tillverkning", name: "Tillverkningsindustri", short: "Tillverkning" },
  { slug: "livsmedel-processindustri", name: "Livsmedel & Processindustri", short: "Livsmedel" },
  { slug: "grossist-distribution", name: "Grossist & Distribution", short: "Grossist" },
  { slug: "retail-ehandel", name: "Retail & E-handel", short: "Retail" },
  { slug: "mode-sport-textil", name: "Mode, Sport & Textil", short: "Mode & Textil" },
  { slug: "konsulttjanster", name: "Konsulttjänster", short: "Konsult" },
  { slug: "bygg-entreprenad", name: "Bygg & Entreprenad", short: "Bygg" },
  { slug: "fastighet-forvaltning", name: "Fastighet & Förvaltning", short: "Fastighet" },
  { slug: "energi-utilities", name: "Energi & Utilities", short: "Energi" },
  { slug: "finans-forsakring", name: "Finans & Försäkring", short: "Finans" },
  { slug: "life-science-medtech", name: "Life Science / Medtech", short: "Life Science" },
  { slug: "telekom-it-tjanster", name: "Telekom & IT-tjänster", short: "IT & Telekom" },
  { slug: "logistik-transport", name: "Logistik & Transport", short: "Logistik" },
  { slug: "media-publishing", name: "Media & Publishing", short: "Media" },
  { slug: "jordbruk-skogsbruk", name: "Jordbruk & Skogsbruk", short: "Jordbruk" },
  { slug: "halsa-sjukvard", name: "Hälsa- & sjukvård", short: "Hälsa" },
  { slug: "nonprofit-organisationer", name: "Non-profit / Organisationer", short: "Non-profit" },
  { slug: "medlemsorganisationer", name: "Medlemsorganisationer", short: "Medlemsorg" },
  { slug: "utbildning", name: "Utbildning", short: "Utbildning" },
  { slug: "offentlig-sektor", name: "Offentlig sektor", short: "Offentlig" },
  { slug: "uthyrning", name: "Uthyrningsverksamhet", short: "Uthyrning" },
];

export const findIndustryBySlug = (slug: string) =>
  STANDARD_INDUSTRIES.find((i) => i.slug === slug);
