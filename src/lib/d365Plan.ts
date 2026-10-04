import { useSyncExternalStore } from "react";
import { type BuyerContext, getBuyerContext, clearBuyerContext } from "@/lib/buyerContext";
import { type BuyerProfile, clearProfile } from "@/lib/buyerProfile";
import { deriveCompareFilters, filtersToSearch } from "@/lib/underlag";

export type PlanArea = "erp" | "crm" | "migration" | "partner";
export type PlanPriority = "important" | "investigate";
export interface PlanMeta {
  area?: PlanArea;
  needs: string[];
  dimensions: Record<string, PlanPriority>;
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
  if (!existed) trackFunnelEvent({ event_type: "plan", event_name: "plan_created", metadata: { area: state.area || null } });
  listeners.forEach((l) => l());
}
export function setPlanDimension(key: string, priority: PlanPriority | null) {
  const dimensions = { ...snapshot().dimensions };
  if (priority) dimensions[key] = priority; else delete dimensions[key];
  updatePlan({ dimensions });
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
...
export function planNextStep(profile: BuyerProfile, buyer: BuyerContext, meta: PlanMeta, savedCount: number) {
  if (savedCount && buyer.industry && buyer.size && (meta.area || buyer.product)) return { label: "Få hjälp att matcha rätt partner", to: "/shortlist/" };
  if (savedCount) return { label: "Jämför era sparade partners", to: "/shortlist/" };
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