/**
 * Strukturerad partnerdata (Partner Data Enrichment MVP).
 * Lagras i partners.structured_profile (jsonb) + data_verified_at/data_verified_by.
 * Används ännu inte för ranking, matchning eller AI. Se docs/PARTNER-DATA-MODEL.md.
 */

export const MIGRATION_SOURCES = [
  "NAV / Navision", "Business Central On-Prem", "Visma", "Monitor", "Pyramid",
  "Jeeves", "SAP Business One", "Fortnox", "Annat ERP",
] as const;

export const BC_COMPETENCIES = [
  "Ekonomi", "Redovisning", "Inköp", "Order", "Lager", "Distribution", "Produktion",
  "Projekt", "Service", "E-handel", "EDI", "Integrationer", "Power BI",
  "Power Platform", "Copilot", "Flerbolag", "Internationellt",
] as const;

export const PROJECT_TYPES = [
  "Nyimplementation", "Migrering", "Uppgradering", "Förvaltning",
  "Rescue-projekt", "Internationell utrullning",
] as const;

export const DELIVERY_MODELS = [
  "Fastprisstart", "Snabbstartspaket", "Proof of Concept",
  "Successiv implementation", "Förvaltningspartner",
] as const;

export const VERIFIED_BY_OPTIONS = [
  { value: "partner", label: "Partner" },
  { value: "redaktion", label: "d365.se Redaktion" },
  { value: "publik_kalla", label: "Publik källa" },
] as const;

export interface IndustrySolution {
  name: string;
  description: string;
  industry: string;
}

export interface StructuredProfile {
  migration_experience: string[];
  bc_competencies: string[];
  project_types: string[];
  delivery_models: string[];
  has_industry_solution: boolean | null;
  industry_solutions: IndustrySolution[];
}

export const EMPTY_STRUCTURED_PROFILE: StructuredProfile = {
  migration_experience: [],
  bc_competencies: [],
  project_types: [],
  delivery_models: [],
  has_industry_solution: null,
  industry_solutions: [],
};

const pick = (v: unknown, allowed: readonly string[]) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && allowed.includes(x)) : [];

export function normalizeStructuredProfile(raw: unknown): StructuredProfile {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const sols = Array.isArray(r.industry_solutions) ? r.industry_solutions : [];
  return {
    migration_experience: pick(r.migration_experience, MIGRATION_SOURCES),
    bc_competencies: pick(r.bc_competencies, BC_COMPETENCIES),
    project_types: pick(r.project_types, PROJECT_TYPES),
    delivery_models: pick(r.delivery_models, DELIVERY_MODELS),
    has_industry_solution: typeof r.has_industry_solution === "boolean" ? r.has_industry_solution : null,
    industry_solutions: sols
      .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
      .map((s) => ({
        name: String(s.name ?? "").slice(0, 120),
        description: String(s.description ?? "").slice(0, 800),
        industry: String(s.industry ?? "").slice(0, 120),
      })),
  };
}
