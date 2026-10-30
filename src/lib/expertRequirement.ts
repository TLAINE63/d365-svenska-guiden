import { BC_OPTIONS } from "@/data/structuredPartnerProfile";
import { COMPETENCE_GUIDES, DELIVERY_MODES, deliveryModeLabel } from "@/data/competenceGuides";
import { trackCompetenceEvent } from "@/utils/trackCompetenceEvent";

/**
 * Sprint 1.2: expert- och konsultvägen (kompetens → behov → värde → Expert Requirement).
 * Utkastet sparas bara i sessionStorage under besöket och skickas först när besökaren
 * själv skickar formuläret till d365.se. Inget går till partner automatiskt, och ärendet
 * får aldrig status kvalificerat automatiskt (se advisory_cases och partner_introductions).
 */

const ERP_PRODUCTS = ["Business Central", "Finance", "Supply Chain Management"];
const PROJECT_TYPE_KEYS = ["migration", "upgrade"];

export interface SpecialismGroup { label: string; options: { value: string; label: string }[] }

/**
 * Specialistområden återanvänder partnermasterns befintliga taxonomi:
 * processpecialiseringar (endast affärssystem), tvärgående förmågor och projekttyper.
 */
export function specialismGroups(product?: string | null): SpecialismGroup[] {
  const groups: SpecialismGroup[] = [];
  if (!product || ERP_PRODUCTS.includes(product)) {
    groups.push({ label: "Processer i affärssystemet (ERP)", options: BC_OPTIONS.competency.map((o) => ({ value: o.label, label: o.label })) });
  }
  groups.push({ label: "Tvärgående förmågor", options: BC_OPTIONS.capability.map((o) => ({ value: o.label, label: o.label })) });
  groups.push({ label: "Typ av uppdrag", options: BC_OPTIONS.project_type.filter((o) => PROJECT_TYPE_KEYS.includes(o.key)).map((o) => ({ value: o.label, label: o.label })) });
  return groups;
}

export const SENIORITY_OPTIONS = ["Junior", "Erfaren", "Senior", "Spelar ingen roll"] as const;

export interface ExpertDraft {
  role?: string;          // kompetensguidens slug
  product?: string;
  specialism?: string;
  seniority?: string;
  industry?: string;
  region?: string;
  delivery?: string;
  start?: string;
  length?: string;
}

const DRAFT_KEY = "d365_expert_requirement";
const STARTED_KEY = "d365_expert_search_started";

export function getExpertDraft(): ExpertDraft {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    const v = raw ? JSON.parse(raw) : {};
    return v && typeof v === "object" ? v : {};
  } catch { return {}; }
}

export function saveExpertDraft(d: ExpertDraft) {
  try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch { /* ignoreras */ }
}

export function markExpertSearchStarted() {
  try { sessionStorage.setItem(STARTED_KEY, "1"); } catch { /* ignoreras */ }
}

/** Startar sökningen en gång per besök (startsidans val sätter flaggan själv). */
export function startExpertSearch(entry: string) {
  if (typeof window === "undefined") return;
  try { if (sessionStorage.getItem(STARTED_KEY) === "1") return; } catch { /* fortsätt */ }
  markExpertSearchStarted();
  trackCompetenceEvent("expert_search_started", { entry, intent_type: "ExpertRequirement" });
}

export const roleTitle = (slug?: string) => COMPETENCE_GUIDES.find((g) => g.slug === slug)?.title;

/** Sammanställningen som visas för och skickas av besökaren. Bara ifyllda fält. */
export function draftSummary(d: ExpertDraft): { label: string; value: string }[] {
  const rows: [string, string | undefined][] = [
    ["Dynamics-produkt", d.product],
    ["Roll", roleTitle(d.role)],
    ["Specialistområde", d.specialism],
    ["Senioritet", d.seniority],
    ["Branscherfarenhet", d.industry],
    ["Geografiskt behov", d.region],
    ["Leveransform", d.delivery ? deliveryModeLabel(d.delivery) : undefined],
    ["Ungefärlig start", d.start?.trim()],
    ["Omfattning eller längd", d.length?.trim()],
  ];
  return rows.filter((r): r is [string, string] => !!r[1]).map(([label, value]) => ({ label, value }));
}

/** Krav som ofta behöver preciseras. De ej ifyllda fälten listas först. */
export function requirementsToClarify(d: ExpertDraft): string[] {
  const missing: string[] = [];
  if (!d.product) missing.push("Vilken Dynamics\u00A0365-produkt uppdraget gäller.");
  if (!d.specialism) missing.push("Vilket specialistområde som är viktigast.");
  if (!d.seniority) missing.push("Vilken senioritet rollen kräver.");
  if (!d.delivery) missing.push("Om arbetet ska ske på plats, hybrid eller på distans.");
  if (!d.start?.trim()) missing.push("När uppdraget behöver starta.");
  if (!d.length?.trim()) missing.push("Hur länge och hur stor del av tiden ni behöver kompetensen.");
  return [
    ...missing,
    "Vilket ansvar rollen ska ha och vem den rapporterar till.",
    "Om ni behöver en namngiven person eller ett åtagande från partnern.",
    "Hur kunskapen ska föras över till er egen organisation efter uppdraget.",
  ];
}

export const deliveryOptions = DELIVERY_MODES;
