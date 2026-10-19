/**
 * Registered people and their explicit relation to specific pages.
 * Never infer authorship or review: a page shows an expert only when listed in PAGE_CONTRIBUTIONS.
 */
export type ContributionRole = "Skriven av" | "Expertkommentar" | "Faktagranskad av";

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
}

/** Path (without trailing slash) -> confirmed contributions. Empty until the editor registers them. */
export const PAGE_CONTRIBUTIONS: Record<string, PageContribution[]> = {};

export function contributionsFor(path: string): Array<PageContribution & { person: ContentContributor }> {
  const key = path.replace(/\/+$/, "") || "/";
  return (PAGE_CONTRIBUTIONS[key] ?? [])
    .map((c) => ({ ...c, person: CONTRIBUTORS[c.contributorId] }))
    .filter((c): c is PageContribution & { person: ContentContributor } => !!c.person);
}
