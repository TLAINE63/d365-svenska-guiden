// Partner-level AI, Copilot & Automation profile
// Replaces the previous per-product AI capability fields.
// AI score and AI confidence are computed INTERNALLY and never shown publicly.

import type { ProductFilters } from "@/hooks/usePartners";

export interface AiProfile {
  delivery_model?: string | null;
  capabilities?: string[];
  relevant_areas?: string[];
  use_cases?: string[];
  experience_level?: string | null;
  project_count_range?: string | null;
  evidence_level?: string[];
  description?: string | null;
  migrated_at?: string;
}

// ===== Options =====
// label-pairs are [value, label]
type Opt = { value: string; label: string; hint?: string };

export const DELIVERY_MODELS: Opt[] = [
  { value: "product-teams", label: "AI-kompetens finns i respektive produktteam" },
  { value: "central-team", label: "AI-kompetens finns i ett centralt/tvärfunktionellt AI-team" },
  { value: "combined", label: "Kombination av produktteam och centralt AI-team" },
  { value: "external-team", label: "Vi samarbetar med koncerninternt eller externt AI-specialistteam" },
  { value: "advisory", label: "Vi erbjuder främst rådgivning kring AI/Copilot" },
  { value: "", label: "Ej angivet" },
];

export const AI_CAPABILITIES: Opt[] = [
  { value: "standard-copilot", label: "Microsoft Standard AI / inbyggd Copilot" },
  { value: "copilot-studio", label: "Copilot Studio / agents" },
  { value: "power-platform", label: "Power Platform-automation med AI" },
  { value: "azure-ai", label: "Azure AI / Foundry / ML" },
  { value: "fabric-bi", label: "Power BI / Fabric och AI-driven analys" },
  { value: "ai-readiness", label: "AI-readiness och datakvalitet" },
  { value: "ai-governance", label: "AI-governance, säkerhet och behörigheter" },
  { value: "ai-adoption", label: "AI-adoption och utbildning" },
  { value: "industry-ai", label: "Branschspecifika AI-lösningar" },
];

export const AI_RELEVANT_AREAS: Opt[] = [
  { value: "Business Central", label: "Business Central" },
  { value: "Dynamics 365 Finance", label: "Dynamics 365 Finance" },
  { value: "Dynamics 365 Supply Chain Management", label: "Dynamics 365 Supply Chain Management" },
  { value: "Dynamics 365 Sales", label: "Dynamics 365 Sales" },
  { value: "Dynamics 365 Customer Service", label: "Dynamics 365 Customer Service" },
  { value: "Dynamics 365 Field Service", label: "Dynamics 365 Field Service" },
  { value: "Dynamics 365 Customer Insights", label: "Dynamics 365 Customer Insights" },
  { value: "Power Platform", label: "Power Platform" },
  { value: "Microsoft 365 Copilot", label: "Microsoft 365 Copilot" },
  { value: "Azure / Fabric", label: "Azure / Fabric" },
  { value: "ERP-processer", label: "ERP-processer" },
  { value: "CRM-processer", label: "CRM-processer" },
  { value: "Supply chain-processer", label: "Supply chain-processer" },
  { value: "Kundserviceprocesser", label: "Kundserviceprocesser" },
];

export const AI_USE_CASES: Opt[] = [
  { value: "readiness", label: "AI-readiness inför Copilot" },
  { value: "data-quality", label: "Datakvalitet och behörigheter inför Copilot" },
  { value: "copilot-studio-agent", label: "Copilot Studio-agent" },
  { value: "sales-automation", label: "Automatisering av säljprocess" },
  { value: "service-ai", label: "AI-stöd för kundservice" },
  { value: "finance-ai", label: "AI-stöd för ekonomi och rapportering" },
  { value: "scm-ai", label: "AI-stöd för inköp, lager eller supply chain" },
  { value: "forecast", label: "Prognos eller prediktiv analys" },
  { value: "anomaly", label: "Avvikelseanalys" },
  { value: "industry-agent", label: "Branschspecifik agent eller automation" },
  { value: "fabric-analytics", label: "Power BI/Fabric-baserad analys" },
  { value: "governance", label: "AI-governance och policy" },
  { value: "training", label: "Utbildning och adoption" },
];

export const MAX_USE_CASES = 8;

export const AI_EXPERIENCE_LEVELS: Opt[] = [
  { value: "", label: "Ej angivet" },
  { value: "advisory", label: "Rådgivning/workshops" },
  { value: "pilot", label: "Pilot/PoC" },
  { value: "delivered", label: "Levererat i kundprojekt" },
  { value: "multiple", label: "Flera kundprojekt" },
  { value: "packaged", label: "Paketerat erbjudande finns" },
  { value: "established", label: "Etablerad AI-leveransmodell" },
];

export const AI_PROJECT_COUNT_RANGES: Opt[] = [
  { value: "", label: "Ej angivet" },
  { value: "1-2", label: "1–2" },
  { value: "3-5", label: "3–5" },
  { value: "6-10", label: "6–10" },
  { value: "10+", label: "10+" },
];

export const AI_EVIDENCE_LEVELS: Opt[] = [
  { value: "self-declared", label: "Självdeklarerat" },
  { value: "packaged", label: "Paketerat erbjudande finns" },
  { value: "anonymized", label: "Anonymiserat exempel finns" },
  { value: "reference-on-request", label: "Kundreferens kan lämnas på förfrågan" },
  { value: "public-case", label: "Publikt kundcase finns" },
  { value: "reviewed", label: "Granskat av d365.se" },
];

export const MAX_DESCRIPTION_LENGTH = 500;

// ===== Lookup helpers =====
function labelFor(list: Opt[], value: string | null | undefined): string {
  if (!value) return "";
  return list.find((o) => o.value === value)?.label ?? value;
}
export const labelForCapability = (v: string) => labelFor(AI_CAPABILITIES, v);
export const labelForArea = (v: string) => labelFor(AI_RELEVANT_AREAS, v);
export const labelForUseCase = (v: string) => labelFor(AI_USE_CASES, v);
export const labelForExperience = (v: string | null | undefined) =>
  labelFor(AI_EXPERIENCE_LEVELS, v || "");
export const labelForProjectCount = (v: string | null | undefined) =>
  labelFor(AI_PROJECT_COUNT_RANGES, v || "");
export const labelForEvidence = (v: string) => labelFor(AI_EVIDENCE_LEVELS, v);
export const labelForDelivery = (v: string | null | undefined) =>
  labelFor(DELIVERY_MODELS, v || "");

// ===== Scoring (internal only) =====
const CAP_POINTS: Record<string, number> = {
  "standard-copilot": 8,
  "copilot-studio": 18,
  "power-platform": 16,
  "azure-ai": 25,
  "fabric-bi": 14,
  "ai-readiness": 12,
  "ai-governance": 12,
  "ai-adoption": 10,
  "industry-ai": 16,
};

const EXPERIENCE_POINTS: Record<string, number> = {
  advisory: 5,
  pilot: 10,
  delivered: 15,
  multiple: 20,
  packaged: 22,
  established: 25,
};

const PROJECT_BONUS: Record<string, number> = {
  "1-2": 0,
  "3-5": 3,
  "6-10": 5,
  "10+": 7,
};

const EVIDENCE_POINTS: Record<string, number> = {
  "self-declared": 3,
  packaged: 6,
  anonymized: 8,
  "reference-on-request": 10,
  "public-case": 13,
  reviewed: 15,
};

const DELIVERY_POINTS: Record<string, number> = {
  advisory: 4,
  "product-teams": 5,
  "central-team": 7,
  "external-team": 7,
  combined: 10,
};

export function calculatePartnerAiScore(p?: AiProfile | null): number {
  if (!p) return 0;
  // A: capabilities (cap 40)
  const aRaw = (p.capabilities || []).reduce((s, c) => s + (CAP_POINTS[c] || 0), 0);
  const A = Math.min(40, aRaw);
  // B: experience + project bonus (cap 25)
  const expPts = EXPERIENCE_POINTS[p.experience_level || ""] || 0;
  const projPts = PROJECT_BONUS[p.project_count_range || ""] || 0;
  const B = Math.min(25, expPts + projPts);
  // C: highest evidence (cap 15)
  const C = (p.evidence_level || []).reduce((max, e) => Math.max(max, EVIDENCE_POINTS[e] || 0), 0);
  // D: relevance breadth (cap 10)
  const n = (p.relevant_areas || []).length;
  const D = n === 0 ? 0 : n === 1 ? 3 : n <= 3 ? 6 : 10;
  // E: delivery model (cap 10)
  const E = DELIVERY_POINTS[p.delivery_model || ""] || 0;
  return Math.min(100, A + B + C + D + E);
}

export type AiConfidence = "low" | "medium" | "high";

export function calculateAiConfidence(p?: AiProfile | null): AiConfidence | null {
  if (!p) return null;
  const caps = p.capabilities || [];
  const useCases = p.use_cases || [];
  const evidence = p.evidence_level || [];
  const exp = p.experience_level || "";
  const projects = p.project_count_range || "";
  const desc = (p.description || "").trim();
  const advanced = caps.includes("azure-ai");
  const hasStrongEvidence = evidence.some((e) =>
    ["reference-on-request", "public-case", "reviewed"].includes(e)
  );
  const onlySelf =
    evidence.length === 0 || (evidence.length === 1 && evidence[0] === "self-declared");

  const highExp = ["delivered", "multiple", "packaged", "established"].includes(exp);

  // High
  if (
    caps.length >= 2 &&
    (p.relevant_areas || []).length >= 1 &&
    useCases.length >= 3 &&
    highExp &&
    hasStrongEvidence &&
    desc.length >= 40
  ) {
    return "high";
  }
  // Medium
  if (
    caps.length >= 2 &&
    useCases.length >= 2 &&
    exp &&
    !onlySelf &&
    desc.length > 0
  ) {
    return "medium";
  }
  // Low triggers
  if (
    (caps.length > 0 && !desc) ||
    !exp ||
    !projects ||
    onlySelf ||
    ((p.relevant_areas || []).length >= 3 && useCases.length === 0) ||
    (advanced && (!desc || onlySelf))
  ) {
    return "low";
  }
  return caps.length === 0 && useCases.length === 0 ? null : "low";
}

export function isAiProfileEmpty(p?: AiProfile | null): boolean {
  if (!p) return true;
  return (
    !(p.capabilities && p.capabilities.length) &&
    !(p.relevant_areas && p.relevant_areas.length) &&
    !(p.use_cases && p.use_cases.length) &&
    !p.experience_level &&
    !p.project_count_range &&
    !(p.evidence_level && p.evidence_level.length) &&
    !p.delivery_model &&
    !(p.description && p.description.trim())
  );
}

// Short summary used on partner cards
export function shortAiSummary(p?: AiProfile | null): string {
  if (!p) return "";
  const caps = (p.capabilities || []).slice(0, 3).map(labelForCapability);
  if (caps.length === 0) return "";
  return caps.join(" · ");
}

// Legacy migration helper (also runs in DB, but kept client-side as fallback)
export function migrateLegacyAi(productFilters?: ProductFilters | null): AiProfile {
  const out: AiProfile = {
    capabilities: [],
    relevant_areas: [],
    use_cases: [],
    evidence_level: ["self-declared"],
  };
  if (!productFilters) return out;
  const caps = new Set<string>();
  const areas = new Set<string>();
  const productLabel: Record<string, string> = {
    bc: "Business Central",
    fsc: "Dynamics 365 Finance",
    sales: "Dynamics 365 Sales",
    service: "Dynamics 365 Customer Service",
  };
  for (const [key, pf] of Object.entries(productFilters)) {
    const list: string[] = (pf as any)?.aiCapabilities || [];
    if (list.length === 0) continue;
    if (productLabel[key]) areas.add(productLabel[key]);
    for (const c of list) {
      if (c.includes("-std-") || c === "ai-standard" || c === "bc-copilot" || c === "ai-assistant") {
        caps.add("standard-copilot");
      } else if (
        c.includes("-partner-") ||
        c === "ai-partner" ||
        c === "bc-agent" ||
        c === "ai-agents"
      ) {
        caps.add("copilot-studio");
        if (c.includes("automation") || c === "ai-automation" || c === "ai-prediction") {
          caps.add("power-platform");
        }
      } else if (c.includes("-adv-") || c === "ai-advanced" || c === "bc-azure" || c === "ai-azure") {
        caps.add("azure-ai");
      }
    }
  }
  out.capabilities = Array.from(caps);
  out.relevant_areas = Array.from(areas);
  return out;
}
