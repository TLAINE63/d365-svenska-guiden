/**
 * Guideserien "Välja Dynamics 365-partner".
 *
 * Huvudguiden är nav, produktguiderna är fördjupningar. Varje guide leder
 * vidare till partnerlistan med rätt produktfilter förvalt.
 */

export type PartnerGuideKey =
  | "hub"
  | "bc"
  | "fscm"
  | "sales"
  | "service";

export interface PartnerGuide {
  key: PartnerGuideKey;
  /** Slug under /guider/ */
  slug: string;
  /** Kort etikett i serienavigering och brödsmulor. */
  shortLabel: string;
  /** Titel på kort och i "Relaterade guider". */
  cardTitle: string;
  cardDescription: string;
  seoTitle: string;
  seoDescription: string;
  /** Applikationsnamn som används för att matcha partners (som i partnerdata). */
  apps: string[];
  /** Kanoniska filternamn i partnerlistan, om de skiljer sig från apps. */
  filterApps?: string[];
  /** Etikett på CTA mitt i guiden. */
  midCtaLabel: string;
  faq?: { q: string; a: string }[];
}

export const GUIDE_BASE_PATH = "/guider";

export const PARTNER_GUIDES: PartnerGuide[] = [
  {
    key: "hub",
    slug: "valja-dynamics-365-partner",
    shortLabel: "Huvudguide",
    cardTitle: "Hur hittar du rätt Dynamics 365-partner?",
    cardDescription:
      "Urvalsprocessen i stort: longlist, gallring, frågor och hur svaren ska bedömas – oavsett applikation.",
    seoTitle: "Välja Dynamics 365-partner i Sverige – guide för köpare",
    seoDescription:
      "Så väljer du rätt Dynamics 365-partner i Sverige: longlist, gallring på bransch och storlek, frågor att ställa och hur du bedömer svaren.",
    apps: [],
    midCtaLabel: "Jämför Dynamics 365-partners",
  },
  {
    key: "bc",
    slug: "valja-business-central-partner",
    shortLabel: "Business Central",
    cardTitle: "Hur väljer du Business Central-partner?",
    cardDescription:
      "För företag som söker nytt affärssystem eller vill byta Business Central-partner.",
    seoTitle: "Välja partner för Business Central – guide för köpare",
    seoDescription:
      "Så väljer du rätt Business Central-partner: storleksmatchning, appar och ägarskap, anpassningar, uppdateringscykler och frågor som skiljer partners åt.",
    apps: ["Business Central"],
    midCtaLabel: "Visa Business Central-partners",
  },
  {
    key: "fscm",
    slug: "valja-finance-supply-chain-partner",
    shortLabel: "Finance & SCM",
    cardTitle: "Hur väljer du F&SCM-partner?",
    cardDescription:
      "För större företag och koncerner med komplex ekonomi, logistik eller produktion.",
    seoTitle: "Välja partner för Finance & Supply Chain Management – guide",
    seoDescription:
      "Så väljer du partner för Dynamics 365 Finance & Supply Chain Management: lösningsarkitekt, leveransmodell mellan länder, migrering och förvaltning.",
    apps: ["Finance", "Supply Chain Management", "F&SCM", "Finance & SCM"],
    filterApps: ["Finance & SCM"],
    midCtaLabel: "Visa F&SCM-partners",
  },
  {
    key: "sales",
    slug: "valja-dynamics-365-sales-partner",
    shortLabel: "Sales",
    cardTitle: "Hur väljer du Dynamics 365 Sales-partner?",
    cardDescription:
      "För företag som vill införa eller utveckla CRM och säljarbete.",
    seoTitle: "Välja partner för Dynamics 365 Sales – guide för köpare",
    seoDescription:
      "Så väljer du partner för Dynamics 365 Sales: användning och adoption, standard eller egen app, integration mot affärssystemet och vad som händer efter lansering.",
    apps: ["Sales"],
    midCtaLabel: "Visa Dynamics 365 Sales-partners",
  },
  {
    key: "service",
    slug: "valja-customer-service-field-service-partner",
    shortLabel: "Customer Service & Field Service",
    cardTitle: "Hur väljer du Customer Service & Field Service-partner?",
    cardDescription:
      "För kundserviceorganisationer, tekniker och serviceprocesser.",
    seoTitle: "Välja partner för Customer Service & Field Service – guide",
    seoDescription:
      "Så väljer du partner för Dynamics 365 Customer Service och Field Service: SLA, schemaläggning, fältappen, drift vid avbrott och test inför uppdateringar.",
    apps: ["Customer Service", "Field Service"],
    midCtaLabel: "Visa servicepartners",
  },
];

export const getGuide = (key: PartnerGuideKey) =>
  PARTNER_GUIDES.find((g) => g.key === key)!;

export const guidePath = (guide: PartnerGuide) =>
  `${GUIDE_BASE_PATH}/${guide.slug}/`;

/** Partnerlistan med rätt produktfilter förvalt. */
export const guidePartnerListUrl = (guide: PartnerGuide) => {
  const filterApps = guide.filterApps ?? guide.apps;
  if (filterApps.length === 0) return "/valjdynamics365partner/#hitta-partners";
  const qs = new URLSearchParams({ apps: filterApps.join(",") });
  return `/valjdynamics365partner/?${qs.toString()}#hitta-partners`;
};

/** Logisk sekvens: huvudguide → BC → F&SCM → Sales → Service. */
export const nextGuide = (key: PartnerGuideKey): PartnerGuide | null => {
  const order: PartnerGuideKey[] = ["hub", "bc", "fscm", "sales", "service"];
  const i = order.indexOf(key);
  if (i < 0 || i === order.length - 1) return null;
  return getGuide(order[i + 1]);
};
