/**
 * Business Central-modulen i partnermastermodellen (se docs/PARTNER-MASTER-MODEL.md).
 * Stabila nycklar = samma som tabellen bc_attribute_options. Etiketter är endast visning.
 * Används inte för ranking, matchning eller AI.
 */

export type BcAttributeType = "migration" | "competency" | "project_type" | "delivery_model" | "capability";

export interface Option { key: string; label: string }

export const BC_OPTIONS: Record<BcAttributeType, Option[]> = {
  migration: [
    { key: "nav", label: "NAV / Navision" },
    { key: "bc_onprem", label: "Business Central On-Prem" },
    { key: "bc_other_environment", label: "Business Central från annan miljö eller partner" },
    { key: "visma", label: "Visma" },
    { key: "monitor", label: "Monitor ERP" },
    { key: "pyramid", label: "Pyramid" },
    { key: "jeeves", label: "Jeeves" },
    { key: "sap_business_one", label: "SAP Business One" },
    { key: "fortnox", label: "Fortnox" },
    { key: "other_erp", label: "Annat ERP" },
  ],
  competency: [
    { key: "manufacturing", label: "Produktion och tillverkning" },
    { key: "projects", label: "Projektverksamhet" },
    { key: "service_management", label: "Servicehantering" },
    { key: "retail_ecommerce", label: "Retail och e-handel" },
    { key: "edi", label: "EDI" },
    { key: "integrations_api", label: "Integrationer och API" },
    { key: "multi_company", label: "Flerbolagsmiljö" },
    { key: "international", label: "Internationell verksamhet" },
  ],
  project_type: [
    { key: "new_implementation", label: "Nyimplementation" },
    { key: "migration", label: "Migrering" },
    { key: "upgrade", label: "Uppgradering" },
    { key: "maintenance_support", label: "Förvaltning och support" },
    { key: "rescue", label: "Rescue-projekt" },
    { key: "system_consolidation", label: "Konsolidering av flera system" },
    { key: "multi_company_implementation", label: "Flerbolagsimplementation" },
    { key: "international_rollout", label: "Internationell utrullning" },
  ],
  delivery_model: [
    { key: "quickstart_package", label: "Snabbstartspaket till fast pris" },
    { key: "proof_of_concept", label: "Proof of Concept" },
    { key: "phased_implementation", label: "Successiv implementation" },
    { key: "traditional_project", label: "Traditionellt implementationsprojekt" },
    { key: "maintenance_partner", label: "Förvaltningspartner" },
    { key: "managed_services", label: "Managed Services" },
  ],
  // Tvärgående förmågor (sparas som partner_product_capabilities, nyckel = product_catalog.product_key)
  capability: [
    { key: "power-bi", label: "Power BI" },
    { key: "power-platform", label: "Power Platform" },
    { key: "copilot", label: "Copilot" },
    { key: "copilot-studio", label: "Copilot Studio" },
    { key: "ai-agents", label: "AI-agenter" },
  ],
};

export const BC_GROUP_TITLES: Record<BcAttributeType, { title: string; desc: string }> = {
  migration: { title: "Migreringserfarenhet", desc: "Från vilka system har ni migrerat kunder till Business Central?" },
  competency: { title: "Business Central-specialiseringar", desc: "Välj områden utöver den grundläggande ERP-kompetens som alla Business Central-partner förväntas ha." },
  project_type: { title: "Typiska projekt", desc: "Vilka typer av Business Central-projekt gör ni oftast?" },
  delivery_model: { title: "Leveransmodell", desc: "Hur erbjuder ni att starta och leverera?" },
  capability: { title: "Tvärgående förmågor", desc: "Vilka förmågor levererar ni tillsammans med Business Central?" },
};

export const VERIFICATION_STATUSES = [
  { value: "partner_verified", label: "Partnerverifierad" },
  { value: "editorial_verified", label: "Redaktionellt verifierad" },
  { value: "public_source", label: "Publik källa" },
  { value: "legacy_import", label: "Importerad äldre uppgift" },
  { value: "unverified", label: "Ej verifierad" },
] as const;

export const SOLUTION_TYPES = [
  { value: "own", label: "Egenutvecklad" },
  { value: "third_party", label: "Tredjepartslösning" },
  { value: "packaged_offering", label: "Paketerat erbjudande" },
] as const;

export interface IndustrySolution {
  id?: string;
  name: string;
  description: string;
  industry: string;
}

/** Partnerns val i profileringslänken. */
export interface StructuredProfile {
  migration: string[];
  competency: string[];
  project_type: string[];
  delivery_model: string[];
  capability: string[];
  has_industry_solution: boolean | null;
  industry_solutions: IndustrySolution[];
}

export const EMPTY_STRUCTURED_PROFILE: StructuredProfile = {
  migration: [], competency: [], project_type: [], delivery_model: [], capability: [],
  has_industry_solution: null, industry_solutions: [],
};

const pick = (v: unknown, t: BcAttributeType) => {
  const allowed = BC_OPTIONS[t].map((o) => o.key);
  return Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string" && allowed.includes(x)))] : [];
};

export function normalizeStructuredProfile(raw: unknown): StructuredProfile {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const sols = Array.isArray(r.industry_solutions) ? r.industry_solutions : [];
  return {
    migration: pick(r.migration, "migration"),
    competency: pick(r.competency, "competency"),
    project_type: pick(r.project_type, "project_type"),
    delivery_model: pick(r.delivery_model, "delivery_model"),
    capability: pick(r.capability, "capability"),
    has_industry_solution: typeof r.has_industry_solution === "boolean" ? r.has_industry_solution : null,
    industry_solutions: sols
      .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
      .map((s) => ({
        id: typeof s.id === "string" ? s.id : undefined,
        name: String(s.name ?? "").slice(0, 120),
        description: String(s.description ?? "").slice(0, 800),
        industry: String(s.industry ?? "").slice(0, 120),
      })),
  };
}
