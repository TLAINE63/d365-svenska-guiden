/**
 * Registered people and their explicit relation to specific pages.
 * Never infer authorship or review: a page shows an expert only when listed in PAGE_CONTRIBUTIONS.
 */
export type ContributionRole = "Författare" | "Skriven av" | "Expertkommentar" | "Faktagranskad av";

export interface ContentContributor {
  id: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  profilePath: string;
  linkedinUrl?: string;
}

export const CONTRIBUTORS: Record<string, ContentContributor> = {
  "thomas-laine": {
    id: "thomas-laine",
    name: "Thomas Laine",
    title: "Grundare, d365.se",
    bio: "Har arbetat i ERP- och CRM-marknaden i snart 40 år, varav nästan 30 år i det ekosystem som i dag är Microsoft Dynamics\u00A0365.",
    expertise: ["ERP", "CRM", "Partnerval"],
    profilePath: "/om-thomas-laine",
  },
  "michael-uhman": {
    id: "michael-uhman",
    name: "Michael Uhman",
    title: "Medgrundare, d365.se",
    bio: "Medgrundare av d365.se.",
    expertise: ["Microsoft Dynamics\u00A0365"],
    profilePath: "/om-michael-uhman",
  },
};

export interface PageContribution {
  contributorId: keyof typeof CONTRIBUTORS | string;
  role: ContributionRole;
  /** YYYY-MM-DD, only when the date is confirmed. */
  date?: string;
  /** Page-specific title, overrides the contributor's default title. */
  title?: string;
}

/** Path (without trailing slash) -> confirmed contributions. Empty until the editor registers them. */
const thomasAuthor = (date?: string): PageContribution[] => [
  { contributorId: "thomas-laine", role: "Författare", date, title: "Redaktör och affärsrådgivare" },
];

// Bekräftat av Thomas Laine 2026-10-19. Utan eget datum används sidans registrerade granskningsdatum (pageReviewDates).
export const PAGE_CONTRIBUTIONS: Record<string, PageContribution[]> = {
  "/finance-supply-chain": thomasAuthor("2026-09-24"),
  ...Object.fromEntries(
    [
      "/businesscentral", "/affarssystem", "/crm", "/d365sales", "/d365marketing",
      "/d365customerservice", "/d365fieldservice", "/d365contactcenter",
      "/d365projectoperations", "/d365humanresources", "/d365commerce",
      "/kostnad", "/priser", "/upphandlingsguiden", "/befintlig-kund",
      "/guider/byta-dynamics-partner", "/second-opinion",
      "/guider/optimera-dynamics-365", "/guider/dynamics-365-support-forvaltning", "/vad-ar-dynamics-365",
    ].map((p) => [p, thomasAuthor()]),
  ),
};

export function contributionsFor(path: string): Array<PageContribution & { person: ContentContributor }> {
  const key = path.replace(/\/+$/, "") || "/";
  return (PAGE_CONTRIBUTIONS[key] ?? [])
    .map((c) => ({ ...c, person: CONTRIBUTORS[c.contributorId] }))
    .filter((c): c is PageContribution & { person: ContentContributor } => !!c.person);
}
