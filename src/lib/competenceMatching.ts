import { deliveryModeLabel, type DeliveryMode } from "@/data/competenceGuides";
import { regionsForCities } from "@/data/competenceGeography";

export interface AssignmentProfilePublic {
  id: string;
  guide_slug: string;
  partner_slug: string;
  partner_name: string;
  logo_url: string | null;
  logo_dark_bg: boolean | null;
  heading: string;
  experience_summary: string;
  typical_assignments: string[];
  products: string[];
  industries: string[];
  /** Härledda regioner (bakåtkompatibelt fält). */
  regions: string[];
  /** Orter där konsulten kan arbeta på plats. */
  onsite_cities?: string[] | null;
  /** Konsulten kan arbeta på distans. */
  remote_available?: boolean | null;
  delivery_modes: string[];
  last_reviewed_at: string | null;
  public_evidence_types: string[];
}

export interface CompetenceFilterState {
  product?: string;
  industry?: string;
  region?: string;
  delivery?: DeliveryMode;
}

export interface MatchResult {
  matches: boolean;
  /** Antal av användarens val som profilen matchar. */
  score: number;
  reasons: string[];
}

const has = (arr: string[] | null | undefined, v: string) =>
  Array.isArray(arr) && arr.some((x) => x?.toLowerCase() === v.toLowerCase());

/**
 * Regioner profilen täcker för arbete på plats. Härleds i första hand från
 * orterna, med fall tillbaka på det äldre regionfältet.
 */
export const profileRegions = (p: AssignmentProfilePublic): string[] => {
  const fromCities = regionsForCities(p.onsite_cities);
  return fromCities.length > 0 ? fromCities : p.regions || [];
};

const isRemote = (p: AssignmentProfilePublic) =>
  p.remote_available === true || has(p.delivery_modes, "remote");

/**
 * Filterlogik enligt kravspecifikationens avsnitt 9.
 * Ingen poäng visas publikt, endast matchningsorsaker och sorteringsordning.
 */
export function matchProfile(
  profile: AssignmentProfilePublic,
  filters: CompetenceFilterState
): MatchResult {
  const reasons: string[] = [];
  let score = 0;

  if (filters.product) {
    if (!has(profile.products, filters.product)) return { matches: false, score: 0, reasons: [] };
    reasons.push(`Erfarenhet av Dynamics 365 ${filters.product}`);
    score++;
  }

  if (filters.industry) {
    if (!has(profile.industries, filters.industry)) return { matches: false, score: 0, reasons: [] };
    reasons.push(`Relevant erfarenhet från ${filters.industry.toLowerCase()}`);
    score++;
  }

  const region = filters.region;
  const delivery = filters.delivery;
  // Regionen avser var konsulten kan arbeta på plats, inte partnerns kontor.
  const coversRegion = (r: string) => has(profileRegions(profile), r);

  if (delivery === "remote") {
    if (!isRemote(profile)) return { matches: false, score: 0, reasons: [] };
    reasons.push("Kan arbeta på distans");
    score++;
  } else if (delivery === "onsite" || delivery === "hybrid") {
    if (!has(profile.delivery_modes, delivery)) return { matches: false, score: 0, reasons: [] };
    if (region && !coversRegion(region)) return { matches: false, score: 0, reasons: [] };
    reasons.push(
      region
        ? `Kan vara ${deliveryModeLabel(delivery).toLowerCase()} i ${region}`
        : `Levererar ${deliveryModeLabel(delivery).toLowerCase()}`
    );
    score++;
    if (region) score++;
  } else if (region) {
    if (!coversRegion(region)) return { matches: false, score: 0, reasons: [] };
    reasons.push(`Kan vara på plats i ${region}`);
    score++;
  }

  return { matches: true, score, reasons };
}

export function filterAndSort(
  profiles: AssignmentProfilePublic[],
  filters: CompetenceFilterState
): Array<AssignmentProfilePublic & { reasons: string[] }> {
  return profiles
    .map((p) => ({ p, m: matchProfile(p, filters) }))
    .filter((x) => x.m.matches)
    .sort(
      (a, b) =>
        b.m.score - a.m.score || a.p.partner_name.localeCompare(b.p.partner_name, "sv")
    )
    .map((x) => ({ ...x.p, reasons: x.m.reasons }));
}

export const EVIDENCE_LABELS: Record<string, string> = {
  customer_case: "Publicerat kundcase",
  customer_reference: "Kundreferens med publiceringstillstånd",
  microsoft_certification: "Microsoft-certifiering",
};

/** "Senast redaktionellt kontrollerad" som månad och år, till exempel 2026-09. */
export const reviewedLabel = (iso: string | null) =>
  iso ? iso.slice(0, 7) : null;
