/**
 * Sprint 1.1: publik informationsstatus för partneruppgifter.
 *
 * Tre separata dimensioner hålls isär:
 * - Fit (relevans): bestäms av besökarens filter.
 * - Informationsstatus (verification confidence): sätts bara manuellt av redaktionen.
 * - Kommersiell status (Standard, Premium, Buyer Opportunity Agreement, Outbound):
 *   påverkar aldrig fit, status eller ordning.
 */
export type InformationStatus = "verified" | "compiled";

export const INFORMATION_STATUSES: { value: InformationStatus; label: string; description: string }[] = [
  {
    value: "verified",
    label: "D365 Verifierad",
    description: "Informationen är kvalitetssäkrad.",
  },
  {
    value: "compiled",
    label: "Automatiskt sammanställd",
    description: "Informationen är maskinellt sammanställd och ännu inte verifierad.",
  },
];

export function isInformationStatus(v: unknown): v is InformationStatus {
  return v === "verified" || v === "compiled";
}

/** Okänd eller saknad status behandlas som sammanställd, aldrig som verifierad. */
export function informationStatusOf(p: { information_status?: string | null } | null | undefined): InformationStatus {
  const v = p?.information_status;
  return isInformationStatus(v) ? v : "compiled";
}

export function informationStatusLabel(s: InformationStatus): string {
  return INFORMATION_STATUSES.find((x) => x.value === s)!.label;
}

/** Högre = mer säker information. Används bara som sekundär tiebreaker vid likvärdig fit. */
export const CONFIDENCE_RANK: Record<InformationStatus, number> = { verified: 2, compiled: 1 };

export type PartnerSort = "relevant" | "latest_verified" | "alpha";

export const PARTNER_SORTS: { value: PartnerSort; label: string }[] = [
  { value: "relevant", label: "Mest relevant" },
  { value: "latest_verified", label: "Senast verifierad" },
  { value: "alpha", label: "A–Ö" },
];

export interface SortablePartner {
  name: string;
  information_status?: string | null;
  information_verified_at?: string | null;
}

/**
 * Ordnar en redan neutralt ordnad lista.
 * - relevant: fit först (högre fitScore), vid likvärdig fit informationsstatus som tiebreaker,
 *   annars bevaras den neutrala (seedade) ordningen. Kommersiella fält läses aldrig.
 * - latest_verified: senaste verifieringsdatum först, partners utan datum sist.
 * - alpha: A–Ö med svensk sortering.
 */
export function sortPartners<T extends SortablePartner>(
  neutralList: T[],
  sort: PartnerSort,
  fitScore: (p: T) => number = () => 0,
): T[] {
  const indexed = neutralList.map((p, i) => ({ p, i }));
  if (sort === "alpha") {
    return indexed.sort((a, b) => a.p.name.localeCompare(b.p.name, "sv") || a.i - b.i).map((x) => x.p);
  }
  if (sort === "latest_verified") {
    const d = (p: T) => (informationStatusOf(p) === "verified" && p.information_verified_at ? p.information_verified_at : "");
    return indexed.sort((a, b) => d(b.p).localeCompare(d(a.p)) || a.i - b.i).map((x) => x.p);
  }
  return indexed
    .sort((a, b) =>
      fitScore(b.p) - fitScore(a.p) ||
      CONFIDENCE_RANK[informationStatusOf(b.p)] - CONFIDENCE_RANK[informationStatusOf(a.p)] ||
      a.i - b.i,
    )
    .map((x) => x.p);
}

export function filterByInformationStatus<T extends { information_status?: string | null }>(
  list: T[],
  status: InformationStatus | null,
): T[] {
  return status ? list.filter((p) => informationStatusOf(p) === status) : list;
}
