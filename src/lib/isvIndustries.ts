import { STANDARD_INDUSTRIES, type StandardIndustry } from "@/data/standardIndustries";

/**
 * Översätter tilläggslösningarnas fria branschtaggar (ofta engelska, från
 * leverantören) till samma 21 standardbranscher som /branscher/.
 * Taggar som inte är branscher (t.ex. "Alla", "Enterprise", "SMB") mappas inte.
 * Ändrar aldrig lagrad data – används bara för filter och visning.
 */
const TAG_TO_SLUG: Record<string, string> = {
  // Tillverkning
  manufacturing: "tillverkning", eto: "tillverkning", "industrial equipment": "tillverkning",
  engineering: "tillverkning", "configurable products": "tillverkning", packaging: "tillverkning",
  furniture: "tillverkning", industrial: "tillverkning", "outsourced production": "tillverkning",
  aerospace: "tillverkning", defense: "tillverkning", "project manufacturing": "tillverkning",
  automotive: "tillverkning", "trucks & buses": "tillverkning", "heavy equipment": "tillverkning",
  print: "tillverkning",
  // Grossist & distribution
  wholesale: "grossist-distribution", distribution: "grossist-distribution", b2b: "grossist-distribution",
  dealers: "grossist-distribution", "equipment dealers": "grossist-distribution",
  // Retail & e-handel
  retail: "retail-ehandel", "e-commerce": "retail-ehandel", b2c: "retail-ehandel", d2c: "retail-ehandel",
  hospitality: "retail-ehandel", restaurants: "retail-ehandel",
  // Mode
  fashion: "mode-sport-textil", apparel: "mode-sport-textil", textile: "mode-sport-textil",
  // Livsmedel
  food: "livsmedel-processindustri", beverage: "livsmedel-processindustri", "fresh produce": "livsmedel-processindustri",
  // Bygg
  construction: "bygg-entreprenad", "modular construction": "bygg-entreprenad", installation: "bygg-entreprenad",
  "civil engineering": "bygg-entreprenad", interior: "bygg-entreprenad",
  // Energi
  utilities: "energi-utilities",
  // Logistik
  "3pl": "logistik-transport", warehouse: "logistik-transport", logistics: "logistik-transport",
  // Konsult
  services: "konsulttjanster", "professional services": "konsulttjanster", consulting: "konsulttjanster",
  projects: "konsulttjanster", "project-centric": "konsulttjanster",
  // IT
  technology: "telekom-it-tjanster", saas: "telekom-it-tjanster", software: "telekom-it-tjanster",
  csp: "telekom-it-tjanster", "managed services": "telekom-it-tjanster",
  // Övriga
  "equipment rental": "uthyrning", rental: "uthyrning",
  nonprofit: "nonprofit-organisationer",
  membership: "medlemsorganisationer", memberships: "medlemsorganisationer",
  "public sector": "offentlig-sektor",
  "financial services": "finans-forsakring",
  property: "fastighet-forvaltning", "real estate": "fastighet-forvaltning", "property management": "fastighet-forvaltning",
  agriculture: "jordbruk-skogsbruk", livestock: "jordbruk-skogsbruk",
  medical: "life-science-medtech", "life sciences": "life-science-medtech", pharma: "life-science-medtech",
};

const BY_SLUG = new Map(STANDARD_INDUSTRIES.map((i) => [i.slug, i]));
const BY_NAME = new Map(STANDARD_INDUSTRIES.map((i) => [i.name.toLowerCase(), i]));

/** Standardbransch för en tagg, eller null om taggen inte är en bransch. */
export const standardIndustryForTag = (tag: string): StandardIndustry | null => {
  const k = tag.trim().toLowerCase();
  if (!k) return null;
  return BY_NAME.get(k) || BY_SLUG.get(k) || BY_SLUG.get(TAG_TO_SLUG[k] || "") || null;
};

/** Unika standardbranscher (i /branscher/-ordning) för en lösnings taggar. */
export const standardIndustriesFor = (tags: (string | null | undefined)[]): StandardIndustry[] => {
  const slugs = new Set<string>();
  for (const t of tags) {
    if (!t) continue;
    const ind = standardIndustryForTag(t);
    if (ind) slugs.add(ind.slug);
  }
  return STANDARD_INDUSTRIES.filter((i) => slugs.has(i.slug));
};
