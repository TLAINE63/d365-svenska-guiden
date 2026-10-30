import { trackCompetenceEvent } from "@/utils/trackCompetenceEvent";

/**
 * Sprint 1.1: partnersökningens flöde (behov → precisering → resultat → två utgångar).
 * Behovet och den interna avsikten sparas bara i sessionStorage under besöket och
 * följer med i anonym mätning. Avsikten visas aldrig publikt och ingen
 * affärsmöjlighet (Opportunity Type) sätts automatiskt.
 */
export const PARTNER_NEEDS = [
  { key: "nytt_projekt", label: "Nytt projekt eller införande" },
  { key: "vidareutveckla", label: "Vidareutveckla en befintlig lösning" },
  { key: "support", label: "Support och förvaltning" },
  { key: "integration", label: "Integrationer och teknisk utveckling" },
  { key: "kompetens", label: "Kompetens och förstärkning" },
  { key: "utvardera", label: "Utvärdera partnersamarbetet" },
  { key: "annat", label: "Annat" },
] as const;

export type PartnerNeedKey = (typeof PARTNER_NEEDS)[number]["key"];
export type PartnerSearchIntent = "PartnerSearch" | "PartnerChange";

const NEED_KEY = "d365_partner_need";
const STARTED_KEY = "d365_partner_search_started";

export function isPartnerNeed(v: unknown): v is PartnerNeedKey {
  return PARTNER_NEEDS.some((n) => n.key === v);
}

export function needLabel(key: PartnerNeedKey | null | undefined): string | null {
  return PARTNER_NEEDS.find((n) => n.key === key)?.label ?? null;
}

/** PartnerChange bara när besökaren själv väljer "Utvärdera partnersamarbetet". */
export function intentForNeed(key: PartnerNeedKey | null | undefined): PartnerSearchIntent {
  return key === "utvardera" ? "PartnerChange" : "PartnerSearch";
}

export function getPartnerNeed(): PartnerNeedKey | null {
  try {
    const v = sessionStorage.getItem(NEED_KEY);
    return isPartnerNeed(v) ? v : null;
  } catch { return null; }
}

export function setPartnerNeed(key: PartnerNeedKey | null) {
  try {
    if (key) sessionStorage.setItem(NEED_KEY, key);
    else sessionStorage.removeItem(NEED_KEY);
  } catch { /* ignoreras */ }
}

export function isPartnerSearchActive(): boolean {
  try { return sessionStorage.getItem(STARTED_KEY) === "1"; } catch { return false; }
}

/** Markerar att partnersökningen startat i besöket (sätts av startsidans val eller partnerväljaren). */
export function markPartnerSearchStarted() {
  try { sessionStorage.setItem(STARTED_KEY, "1"); } catch { /* ignoreras */ }
}

export type PartnerFunnelEvent =
  | "partner_search_started"
  | "partner_need_selected"
  | "partner_filters_applied"
  | "partner_profile_viewed"
  | "partner_compare_started"
  | "partner_selfservice_clicked"
  | "partner_selection_help_requested";

/** Startar flödet en gång per besök, oavsett ingång. */
export function startPartnerSearch(entry: string) {
  if (typeof window === "undefined" || isPartnerSearchActive()) return;
  markPartnerSearchStarted();
  trackCompetenceEvent("partner_search_started", { entry, intent_type: intentForNeed(getPartnerNeed()) });
}

/**
 * Anonym mätning inom partnersökningen. Händelser utanför flödet (t.ex. ett profilbesök
 * utan partnersökning i besöket) registreras inte här, så tratten bara speglar flödet.
 */
export function trackPartnerFunnel(event: PartnerFunnelEvent, props: Record<string, string | number | boolean | null | undefined> = {}) {
  if (typeof window === "undefined" || !isPartnerSearchActive()) return;
  const need = getPartnerNeed();
  const clean: Record<string, string | number | boolean | undefined> = {};
  for (const [k, v] of Object.entries(props)) if (v !== null && v !== undefined && v !== "") clean[k] = v;
  trackCompetenceEvent(event, { need: need ?? undefined, intent_type: intentForNeed(need), ...clean });
}

/**
 * Neutral ordning: sessionsstabil seedad ordning där kommersiell status
 * (avtal, premium, abonnemang, Finder's Fee eller outboundrelation) aldrig påverkar placeringen.
 */
export function neutralPartnerOrder<T>(list: T[], shuffle: (arr: T[], seed: number) => T[], seed: number): T[] {
  return shuffle([...list], seed);
}

interface EvidencePartner {
  customer_examples?: string[] | null;
  product_filters?: Record<string, { customerExamples?: string[] } | undefined> | null;
}

/** Antal registrerade kundcase (unika), från profilen och produktvisa uppgifter. */
export function countPartnerCases(p: EvidencePartner): number {
  const all = [
    ...(p.customer_examples || []),
    ...Object.values(p.product_filters || {}).flatMap((f) => f?.customerExamples || []),
  ].map((s) => String(s).trim().toLowerCase()).filter(Boolean);
  return new Set(all).size;
}
