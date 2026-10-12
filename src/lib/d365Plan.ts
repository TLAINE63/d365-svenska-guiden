import { useSyncExternalStore } from "react";
import { type BuyerContext, getBuyerContext, clearBuyerContext } from "@/lib/buyerContext";
import { type BuyerProfile, clearProfile } from "@/lib/buyerProfile";
import { deriveCompareFilters, filtersToSearch } from "@/lib/underlag";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

export type PlanArea = "erp" | "crm" | "migration" | "partner";
export type PlanPriority = "important" | "investigate";
export interface PlanCalculationRow { label: string; value: string }
export interface PlanCalculation { id: string; product: string; url: string; savedAt: string; rows: PlanCalculationRow[] }
export interface PlanMeta {
  area?: PlanArea;
  needs: string[];
  dimensions: Record<string, PlanPriority>;
  calculations?: PlanCalculation[];
  /** Senaste resultat från Behovsguiden (triage), sparat lokalt. */
  solution?: PlanSolution;
  /** Genomförda fördjupningar, t.ex. "behovsguide". */
  completedSteps?: string[];
}
export interface PlanSolution {
  savedAt: string;
  areaLabel: string;
  knownProduct?: string;
  existingCustomer?: boolean;
  insufficient?: boolean;
  primary?: { label: string; reason: string };
  complements: { label: string; reason: string }[];
  explore: { label: string; path: string; reason: string }[];
  isvNote?: { text: string; path: string };
  aiSummary?: string;
  implementationNote?: string;
  openQuestions: string[];
  nextSteps: { label: string; path: string }[];
}
const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const arr = (v: unknown) => (Array.isArray(v) ? v : []);
function parseSolution(v: any): PlanSolution | undefined {
  if (!v || typeof v !== "object" || typeof v.areaLabel !== "string") return undefined;
  const rec = (r: any) => r && typeof r.label === "string" ? { label: r.label, reason: String(r.reason || "") } : undefined;
  const link = (r: any) => r && typeof r.label === "string" && typeof r.path === "string" && r.path.startsWith("/") ? { label: r.label, path: r.path, reason: String(r.reason || "") } : undefined;
  return {
    savedAt: String(v.savedAt || ""), areaLabel: v.areaLabel, knownProduct: str(v.knownProduct),
    existingCustomer: Boolean(v.existingCustomer), insufficient: Boolean(v.insufficient),
    primary: rec(v.primary), complements: arr(v.complements).map(rec).filter(Boolean).slice(0, 6) as PlanSolution["complements"],
    explore: arr(v.explore).map(link).filter(Boolean).slice(0, 6) as PlanSolution["explore"],
    isvNote: v.isvNote && typeof v.isvNote.text === "string" && String(v.isvNote.path || "").startsWith("/") ? { text: v.isvNote.text, path: v.isvNote.path } : undefined,
    aiSummary: str(v.aiSummary), implementationNote: str(v.implementationNote),
    openQuestions: arr(v.openQuestions).filter((q) => typeof q === "string").slice(0, 8),
    nextSteps: arr(v.nextSteps).map(link).filter(Boolean).slice(0, 6).map((l: any) => ({ label: l.label, path: l.path })),
  };
}
const KEY = "d365_plan_v1";
const EMPTY: PlanMeta = { needs: [], dimensions: {} };
let state = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();
export const isPlanArea = (v: unknown): v is PlanArea => ["erp", "crm", "migration", "partner"].includes(String(v));
export function parsePlan(raw: string | null): PlanMeta {
  try {
    const v = JSON.parse(raw || "{}");
    if (!v || typeof v !== "object") return EMPTY;
    return {
      area: isPlanArea(v.area) ? v.area : undefined,
      needs: Array.isArray(v.needs) ? v.needs.filter((n: unknown) => typeof n === "string").slice(0, 50) : [],
      calculations: Array.isArray(v.calculations) ? v.calculations.filter((c: PlanCalculation) => c && typeof c.id === "string" && typeof c.product === "string" && Array.isArray(c.rows)).slice(0, 10).map((c: PlanCalculation) => ({ id: c.id, product: c.product, url: String(c.url || ""), savedAt: String(c.savedAt || ""), rows: c.rows.filter((r) => r && typeof r.label === "string" && typeof r.value === "string").slice(0, 20) })) : [],
      solution: parseSolution(v.solution),
      completedSteps: arr(v.completedSteps).filter((x) => typeof x === "string").slice(0, 20),
      dimensions: Object.fromEntries(Object.entries(v.dimensions || {}).filter(([k, p]) => /^(erp|crm|partner):/.test(k) && (p === "important" || p === "investigate"))) as Record<string, PlanPriority>,
    };
  } catch { return EMPTY; }
}
function snapshot() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    try { state = parsePlan(localStorage.getItem(KEY)); } catch { /* memory-only fallback */ }
  }
  return state;
}
export function updatePlan(patch: Partial<PlanMeta>) {
  let existed = true;
  try { existed = localStorage.getItem(KEY) !== null; } catch { /* ignore */ }
  state = { ...snapshot(), ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* memory-only fallback */ }
  if (!existed) trackFunnelEvent({ event_type: "engagement", event_name: "plan_created", metadata: { area: state.area || null } });
  listeners.forEach((l) => l());
}
export function setPlanDimension(key: string, priority: PlanPriority | null) {
  const dimensions = { ...snapshot().dimensions };
  if (priority) dimensions[key] = priority; else delete dimensions[key];
  updatePlan({ dimensions });
}
/** Sparar (eller ersätter) en kalkyl per kalkylator i planen. */
export function savePlanCalculation(calc: Omit<PlanCalculation, "savedAt">) {
  const savedAt = new Date().toISOString().slice(0, 10);
  const rest = (snapshot().calculations || []).filter((c) => c.id !== calc.id);
  updatePlan({ calculations: [{ ...calc, savedAt }, ...rest].slice(0, 10) });
}
/** Sparar Behovsguidens resultat i planen och markerar steget som genomfört. */
export function savePlanSolution(solution: Omit<PlanSolution, "savedAt">, needs: string[]) {
  const done = new Set(snapshot().completedSteps || []); done.add("behovsguide");
  updatePlan({ solution: { ...solution, savedAt: new Date().toISOString().slice(0, 10) }, needs, completedSteps: [...done] });
}
export function removePlanCalculation(id: string) {
  updatePlan({ calculations: (snapshot().calculations || []).filter((c) => c.id !== id) });
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function usePlanMeta() { return useSyncExternalStore(subscribe, snapshot, () => EMPTY); }
/** Sant när planen har något sparat innehåll (behov, prioriteringar, kalkyl eller guideresultat). */
export function hasPlanStarted(meta: PlanMeta) {
  return Boolean(meta.area || meta.needs.length || Object.keys(meta.dimensions).length || (meta.calculations?.length ?? 0) > 0 || meta.solution);
}
export function clearD365Plan() {
  clearBuyerContext();
  clearProfile();
  updatePlan({ area: undefined, needs: [], dimensions: {}, calculations: [], solution: undefined, completedSteps: [] });
}

export function planNextStep(profile: BuyerProfile, buyer: BuyerContext, meta: PlanMeta, savedCount: number) {
  if (savedCount && buyer.industry && buyer.size && (meta.area || buyer.product)) return { label: "Få hjälp att matcha rätt partner", to: "/kortlista/" };
  if (savedCount) return { label: "Jämför era sparade partners", to: "/kortlista/" };
  if (meta.solution?.nextSteps[0]) return { label: meta.solution.nextSteps[0].label, to: meta.solution.nextSteps[0].path };
  if (!meta.solution && !meta.area && !buyer.product) return { label: "Starta behovsguiden", to: "/kom-igang/?source=min-d365-plan" };
  const assessed = Boolean(profile.assessment?.fscm_level || (Array.isArray(profile.assessment?.crm_apps) && profile.assessment.crm_apps.length));
  if (assessed && meta.area !== "erp" && meta.area !== "crm" && meta.area !== "migration") return { label: "Se partners för ert underlag", to: `/valjdynamics365partner/?${filtersToSearch(deriveCompareFilters(profile))}` };
  if (meta.area === "migration") return { label: "Kartlägg nuvarande system och beroenden", to: "#komplettera" };
  if (meta.area === "crm") return { label: "Jämför CRM-alternativ och arbetssätt", to: "/crm/" };
  if (meta.area === "erp") return { label: "Jämför möjliga ERP-lösningar", to: "/jamfor/" };
  if (buyer.product) return { label: "Jämför partners för vårt behov", to: planPartnerUrl(buyer) };
  if (meta.area === "partner") return { label: "Kartlägg ert behov inför partnerjämförelsen", to: "#komplettera" };
  return { label: "Jämför möjliga ERP-lösningar", to: "/jamfor/" };
}
export function planPartnerUrl(buyer: BuyerContext = getBuyerContext()) {
  const params = new URLSearchParams();
  if (buyer.product) params.set("product", buyer.product);
  if (buyer.industry) params.set("industry", buyer.industry);
  if (buyer.size) params.set("size", buyer.size);
  params.set("source", "min-d365-plan");
  return `/kom-igang/?${params}`;
}