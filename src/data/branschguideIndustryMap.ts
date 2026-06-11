/**
 * Mapping between IndustryPage slugs (/branscher/[slug]) and Branschguide
 * article slugs (/artiklar/[slug]). Used for cross-linking between the two
 * to strengthen internal linking and reduce orphan-page risk.
 */
export const INDUSTRY_TO_ARTICLE_SLUG: Record<string, string> = {
  "retail-ehandel": "dynamics-365-retail-ehandel",
  "tillverkning": "dynamics-365-tillverkningsindustri",
  "livsmedel-processindustri": "dynamics-365-livsmedel-processindustri",
  "grossist-distribution": "dynamics-365-grossist-distribution",
  "jordbruk-skogsbruk": "dynamics-365-jordbruk-skogsbruk",
  "bygg-entreprenad": "dynamics-365-bygg-entreprenad",
  "energi-utilities": "dynamics-365-energi-utilities",
  "konsulttjanster": "dynamics-365-konsultbolag-tjansteforetag",
  "finans-forsakring": "dynamics-365-finans-forsakring",
  "offentlig-sektor": "dynamics-365-offentlig-sektor",
  "life-science-medtech": "dynamics-365-life-science-medtech",
  "telekom-it-tjanster": "dynamics-365-telekom-it-tjanster",
  "uthyrning": "dynamics-365-uthyrning",
  "mode-sport-textil": "dynamics-365-mode-sport-textil",
  "fastighet-forvaltning": "dynamics-365-fastighet-forvaltning",
  "logistik-transport": "dynamics-365-transport-logistik",
  "medlemsorganisationer": "dynamics-365-medlemsorganisationer",
};

export const ARTICLE_TO_INDUSTRY_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(INDUSTRY_TO_ARTICLE_SLUG).map(([ind, art]) => [art, ind]),
);
