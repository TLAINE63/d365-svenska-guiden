/**
 * Överlämning från Systemval (/kom-igang/) till produktsidor och kalkylatorer.
 * Sparar bara en kort sammanfattning lokalt (spår-id, tydlighet, komplexitet och
 * antal integrationer), inga svarskombinationer och inga personuppgifter.
 */
import type { SolutionId } from "@/lib/systemval/solutions";

export const SYSTEMVAL_CONTEXT_KEY = "d365_systemval_context_v1";

export type HandoffPage = "bc" | "fscm" | "sales" | "ci" | "cs" | "cc" | "fs" | "po";
export type HandoffComplexity = "low" | "medium" | "high";

export interface SystemvalContext {
  savedAt: string;
  primary: SolutionId[];
  complementary: SolutionId[];
  clarity: "clear" | "multiple" | "limited";
  complexity?: HandoffComplexity;
  integrations?: number;
}

const IDS: SolutionId[] = ["bc", "finance", "scm", "fscm", "sales", "ci", "cs", "cc", "fs", "po"];
const PAGE_OF: Record<string, HandoffPage> = { bc: "bc", finance: "fscm", scm: "fscm", fscm: "fscm", sales: "sales", ci: "ci", cs: "cs", cc: "cc", fs: "fs", po: "po" };
export const SHORT_LABEL: Record<string, string> = {
  bc: "Business Central", finance: "Finance", scm: "Supply Chain Management", fscm: "Finance & Supply Chain Management",
  sales: "Sales", ci: "Customer Insights", cs: "Customer Service", cc: "Contact Center", fs: "Field Service", po: "Project Operations",
};

/** Kalkylatorer och vilka förifyllda parametrar respektive kalkylator faktiskt läser. */
const CALC: Partial<Record<HandoffPage, { path: string; integrations: boolean }>> = {
  bc: { path: "/businesscentral/roi-kalkylator/", integrations: true },
  fscm: { path: "/finance-supply-chain/roi-kalkylator/", integrations: false },
  sales: { path: "/d365sales/roi-kalkylator/", integrations: true },
  ci: { path: "/d365marketing/roi-kalkylator/", integrations: false },
  cs: { path: "/d365customerservice/roi-kalkylator/", integrations: true },
  cc: { path: "/d365contactcenter/roi-kalkylator/", integrations: true },
  fs: { path: "/d365fieldservice/roi-kalkylator/", integrations: true },
  // Project Operations saknar kalkylator.
};
const COMPLEXITY_SV: Record<HandoffComplexity, "Låg" | "Medel" | "Hög"> = { low: "Låg", medium: "Medel", high: "Hög" };

const ids = (v: unknown): SolutionId[] => (Array.isArray(v) ? [...new Set(v.filter((x): x is SolutionId => IDS.includes(x as SolutionId)))] : []);

/** Bygger sammanfattningen från Systemvalets resultat och ev. fördjupning. */
export function toSystemvalContext(
  result: { primaryTracks: { id: SolutionId }[]; complementaryTracks: { id: SolutionId }[]; clarity: SystemvalContext["clarity"] },
  handover?: { complexity: string; integrations: string[] } | null,
  today = new Date().toISOString().slice(0, 10),
): SystemvalContext {
  const ctx: SystemvalContext = {
    savedAt: today,
    primary: ids(result.primaryTracks.map((t) => t.id)),
    complementary: ids(result.complementaryTracks.map((t) => t.id)),
    clarity: result.clarity,
  };
  if (handover) {
    if (handover.complexity in COMPLEXITY_SV) ctx.complexity = handover.complexity as HandoffComplexity;
    ctx.integrations = Math.min(20, handover.integrations.length);
  }
  return ctx;
}

export function parseSystemvalContext(raw: string | null): SystemvalContext | null {
  try {
    const v = JSON.parse(raw || "null");
    if (!v || typeof v !== "object" || !["clear", "multiple", "limited"].includes(v.clarity)) return null;
    const ctx: SystemvalContext = { savedAt: typeof v.savedAt === "string" ? v.savedAt : "", primary: ids(v.primary), complementary: ids(v.complementary), clarity: v.clarity };
    if (v.complexity in COMPLEXITY_SV) ctx.complexity = v.complexity;
    if (Number.isInteger(v.integrations) && v.integrations >= 0 && v.integrations <= 20) ctx.integrations = v.integrations;
    return ctx;
  } catch {
    return null;
  }
}

export function readSystemvalContext(): SystemvalContext | null {
  try { return typeof window === "undefined" ? null : parseSystemvalContext(localStorage.getItem(SYSTEMVAL_CONTEXT_KEY)); } catch { return null; }
}
export function saveSystemvalContext(ctx: SystemvalContext) {
  try { localStorage.setItem(SYSTEMVAL_CONTEXT_KEY, JSON.stringify(ctx)); } catch { /* ignore */ }
}
export function clearSystemvalContext() {
  try { localStorage.removeItem(SYSTEMVAL_CONTEXT_KEY); } catch { /* ignore */ }
}

/** Vilken roll sidans produkt hade i vägledningen, eller null om den inte föreslogs. */
export function handoffFor(ctx: SystemvalContext | null, page: HandoffPage): { role: "primary" | "complement"; id: SolutionId } | null {
  if (!ctx) return null;
  const p = ctx.primary.find((id) => PAGE_OF[id] === page);
  if (p) return { role: "primary", id: p };
  const c = ctx.complementary.find((id) => PAGE_OF[id] === page);
  return c ? { role: "complement", id: c } : null;
}

/** Kalkylatorlänk med de svar kalkylatorn kan ta emot. null om produkten saknar kalkylator. */
export function calcLinkFor(ctx: SystemvalContext | null, page: HandoffPage): { url: string; prefilled: boolean } | null {
  const calc = CALC[page];
  if (!calc) return null;
  const sp = new URLSearchParams();
  if (ctx?.complexity) sp.set("komplexitet", COMPLEXITY_SV[ctx.complexity]);
  if (calc.integrations && ctx?.integrations !== undefined) sp.set("integrationer", String(ctx.integrations));
  const q = sp.toString();
  return { url: q ? `${calc.path}?${q}` : calc.path, prefilled: q.length > 0 };
}

/** Läser komplexitet och antal integrationer från kalkylatorlänken; okända värden ignoreras. */
export function readCalcPrefill(search: string): { complexity?: "Låg" | "Medel" | "Hög"; integrations?: number } {
  const sp = new URLSearchParams(search);
  const out: { complexity?: "Låg" | "Medel" | "Hög"; integrations?: number } = {};
  const k = sp.get("komplexitet");
  if (k === "Låg" || k === "Medel" || k === "Hög") out.complexity = k;
  const i = Number(sp.get("integrationer"));
  if (sp.has("integrationer") && Number.isInteger(i) && i >= 0 && i <= 20) out.integrations = i;
  return out;
}
