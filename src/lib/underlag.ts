/**
 * Ren logik för köparunderlaget: filter till jämförelsesidan, matchning mot
 * partnerdata (dokumenterat / ej verifierat / saknas), CRM-relevans och
 * frågor att ta vidare. Ingen ranking och ingen poäng.
 */
import type { BuyerProfile } from "@/lib/buyerProfile";
import { findIndustryBySlug, STANDARD_INDUSTRIES } from "@/data/standardIndustries";

export type ProductKey = "fscm" | "sales" | "customer_service" | "field_service" | "customer_insights" | "contact_center";

export interface CompareFilters {
  product: ProductKey[];
  industry?: string; // slug
  size?: string;
  geo?: string[]; // sverige | norden | europa | globalt
  criteria: CriterionKey[];
}

export type CriterionKey = "migration_ax" | "migration_sap" | "migration_nav" | "manufacturing" | "field_service" | "contact_center" | "localization";

export const CRITERION_LABEL: Record<CriterionKey, string> = {
  migration_ax: "Migrering från AX",
  migration_sap: "Migrering från SAP",
  migration_nav: "Migrering från NAV",
  manufacturing: "Manufacturing",
  field_service: "Field\u00A0Service",
  contact_center: "Contact\u00A0Center",
  localization: "Lokalisering utanför Sverige",
};

const APP_TO_PRODUCT: Record<string, ProductKey> = {
  finance: "fscm",
  scm: "fscm",
  sales: "sales",
  customer_service: "customer_service",
  field_service: "field_service",
  customer_insights: "customer_insights",
  contact_center: "contact_center",
};

const GEO_BY_COUNTRIES: Record<string, string[]> = {
  "1": ["sverige"],
  nordic: ["sverige", "norden"],
  europe: ["sverige", "europa"],
  global: ["sverige", "globalt"],
};

export function deriveCompareFilters(p: BuyerProfile): CompareFilters {
  const apps = (p.scope?.apps as string[]) || [];
  const product = Array.from(new Set(apps.map((a) => APP_TO_PRODUCT[a]).filter(Boolean))) as ProductKey[];
  const industry = typeof p.company?.industry === "string" && findIndustryBySlug(p.company.industry) ? (p.company.industry as string) : undefined;
  const size = typeof p.company?.employees === "string" ? (p.company.employees as string) : undefined;
  const countries = p.company?.countries as string | undefined;
  const geo = countries && countries !== "1" ? GEO_BY_COUNTRIES[countries] : undefined;

  const criteria: CriterionKey[] = [];
  const erp = p.current_erp?.erp;
  if (erp === "ax2012") criteria.push("migration_ax");
  if (erp === "sap") criteria.push("migration_sap");
  if (erp === "nav") criteria.push("migration_nav");
  const prod = p.fscm?.production;
  if (prod && prod !== "none") criteria.push("manufacturing");
  if (p.crm?.field_service === "yes" || apps.includes("field_service")) criteria.push("field_service");
  if (apps.includes("contact_center")) criteria.push("contact_center");
  if (geo && product.includes("fscm")) criteria.push("localization");
  return { product, industry, size, geo, criteria };
}

export function filtersToSearch(f: CompareFilters): string {
  const sp = new URLSearchParams();
  if (f.product.length) sp.set("product", f.product.join(","));
  if (f.industry) sp.set("industry", f.industry);
  if (f.size) sp.set("size", f.size);
  if (f.geo?.length) sp.set("geo", f.geo.join(","));
  sp.set("underlag", "1");
  return sp.toString();
}

/** Applikationsnamn som jämförelsesidans filter använder. */
export const PRODUCT_TO_APP: Record<ProductKey, string> = {
  fscm: "Finance & SCM",
  sales: "Sales",
  customer_service: "Customer Service",
  field_service: "Field Service",
  customer_insights: "Customer Insights (Marketing)",
  contact_center: "Contact Center",
};
export const APP_TO_PRODUCT_KEY: Record<string, ProductKey> = Object.fromEntries(
  Object.entries(PRODUCT_TO_APP).map(([k, v]) => [v, k as ProductKey]),
);
export const GEO_LABEL: Record<string, string> = { sverige: "Sverige", norden: "Norden", europa: "Europa", globalt: "Globalt" };
const GEO_ORDER = ["sverige", "norden", "europa", "globalt"];
/** Bredaste geografin används i enkelvalsfiltret (Globalt täcker Europa, Norden och Sverige). */
export const widestGeo = (geo?: string[]) =>
  geo?.length ? GEO_LABEL[[...geo].sort((a, b) => GEO_ORDER.indexOf(b) - GEO_ORDER.indexOf(a))[0]] : undefined;

export const industryNameFromSlug = (slug?: string | null) => (slug ? findIndustryBySlug(slug)?.name : undefined);
export const industrySlugFromName = (name?: string | null) => STANDARD_INDUSTRIES.find((i) => i.name === name)?.slug;

// ---------- Matchning mot partnerdata ----------

export type MatchStatus = "documented" | "unverified" | "missing";
export interface MatchItem { label: string; status: MatchStatus }

interface PartnerLike {
  applications?: string[] | null;
  industries?: string[] | null;
  description?: string | null;
  positioning_statement?: string | null;
  product_filters?: Record<string, { industries?: string[]; companySize?: string[]; geography?: string[] | string; productDescription?: string; whyChoose?: string; keyPoints?: string } | undefined> | null;
}

const PF_KEY: Record<ProductKey, string[]> = {
  fscm: ["fsc"],
  sales: ["sales", "crm"],
  customer_insights: ["sales", "crm"],
  customer_service: ["service", "crm"],
  field_service: ["service", "crm"],
  contact_center: ["service", "crm"],
};

function partnerText(p: PartnerLike): string {
  const pf = Object.values(p.product_filters || {}).filter(Boolean) as Array<Record<string, unknown>>;
  return [p.description, p.positioning_statement, ...pf.flatMap((f) => [f.productDescription, f.whyChoose, f.keyPoints])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

const hasApp = (p: PartnerLike, re: RegExp) => (p.applications || []).some((a) => re.test(a));

/** Tre grupper: dokumenterat i partnerdata, nämns men ej verifierat, saknas i partnerdata. Ingen sortering efter träffar. */
export function matchPartnerToProfile(partner: PartnerLike, f: CompareFilters): MatchItem[] {
  const items: MatchItem[] = [];
  const text = partnerText(partner);
  const pfs = (keys: string[]) => keys.map((k) => partner.product_filters?.[k]).filter(Boolean) as NonNullable<PartnerLike["product_filters"]>[string][];

  for (const prod of f.product) {
    const label = PRODUCT_TO_APP[prod] === "Finance & SCM" ? "Finance & Supply\u00A0Chain\u00A0Management" : PRODUCT_TO_APP[prod];
    const appRe = prod === "fscm" ? /finance|supply chain|f&scm|scm/i : new RegExp(PRODUCT_TO_APP[prod].split(" (")[0], "i");
    const documented = hasApp(partner, appRe) || (prod === "fscm" && !!partner.product_filters?.fsc);
    items.push({ label, status: documented ? "documented" : pfs(PF_KEY[prod]).length ? "unverified" : "missing" });
  }

  if (f.industry) {
    const name = industryNameFromSlug(f.industry)!;
    const inProduct = f.product.some((prod) => pfs(PF_KEY[prod]).some((pf) => pf?.industries?.includes(name)));
    const inGeneral = (partner.industries || []).includes(name);
    items.push({ label: `Bransch: ${name}`, status: inProduct ? "documented" : inGeneral ? "unverified" : "missing" });
  }

  if (f.size) {
    const any = pfs(f.product.flatMap((p) => PF_KEY[p]));
    const sizes = any.flatMap((pf) => pf?.companySize || []);
    items.push({ label: `Kundstorlek ${f.size} anställda`, status: sizes.includes(f.size) ? "documented" : "missing" });
  }

  if (f.geo?.length) {
    const wide = widestGeo(f.geo)!;
    const order = ["Sverige", "Norden", "Europa", "Globalt"];
    const geos = pfs(f.product.flatMap((p) => PF_KEY[p])).flatMap((pf) => (Array.isArray(pf?.geography) ? pf.geography : pf?.geography ? [pf.geography] : []));
    const ok = geos.some((g) => order.indexOf(g) >= order.indexOf(wide));
    items.push({ label: `Leverans: ${wide}`, status: ok ? "documented" : "missing" });
  }

  for (const c of f.criteria) {
    let status: MatchStatus = "missing";
    if (c === "contact_center") status = hasApp(partner, /contact center/i) ? "documented" : /contact center|kontaktcenter/.test(text) ? "unverified" : "missing";
    else if (c === "field_service") status = hasApp(partner, /field service/i) ? "documented" : /field service|fältservice/.test(text) ? "unverified" : "missing";
    else if (c === "manufacturing") status = /tillverkning|manufactur|produktion/.test(text) ? "unverified" : "missing";
    else if (c === "migration_ax") status = /\bax\b|ax 2012|axapta/.test(text) ? "unverified" : "missing";
    else if (c === "migration_sap") status = /\bsap\b/.test(text) ? "unverified" : "missing";
    else if (c === "migration_nav") status = /\bnav\b|navision/.test(text) ? "unverified" : "missing";
    else if (c === "localization") status = /lokaliser|localiz|internationell|global/.test(text) ? "unverified" : "missing";
    items.push({ label: CRITERION_LABEL[c], status });
  }
  return items;
}

// ---------- Bedömningar ----------

export type FscmLevel = "relevant" | "analysis" | "below";
export const FSCM_LEVEL_TEXT: Record<FscmLevel, string> = {
  relevant: "Verkar relevant att utvärdera Finance & Supply\u00A0Chain\u00A0Management vidare",
  analysis: "Kräver vidare analys",
  below: "Kan ligga under Finance & Supply\u00A0Chain\u00A0Management-nivå",
};
export const BC_TEST_URL = "https://businesscentral.se/matchningstest";

export const CRM_APP_LABEL: Record<string, string> = {
  sales: "Dynamics\u00A0365 Sales",
  customer_service: "Dynamics\u00A0365 Customer Service",
  field_service: "Dynamics\u00A0365 Field\u00A0Service",
  customer_insights: "Dynamics\u00A0365 Customer Insights",
  contact_center: "Dynamics\u00A0365 Contact\u00A0Center",
};

/** Vilka CRM-applikationer som verkar relevanta att utvärdera vidare. Ingen rangordning. */
export function relevantCrmApps(p: BuyerProfile): string[] {
  const c = p.crm || {};
  const cc = p.contact_center || {};
  const out: string[] = [];
  if (c.sales_process === "structured" || c.sales_process === "simple") out.push("sales");
  const channels = (c.channels as string[]) || [];
  if (c.service === "yes" || channels.length >= 2) out.push("customer_service");
  if (c.field_service === "yes") out.push("field_service");
  if (c.marketing === "yes") out.push("customer_insights");
  if (cc.voice === "yes" || cc.ai_agents === "yes" || cc.volume === "gt10000" || (channels.includes("phone") && cc.volume === "1000-10000")) out.push("contact_center");
  return out;
}

// ---------- Frågor att ta vidare ----------

export function questionsToTakeForward(p: BuyerProfile): string[] {
  const apps = (p.scope?.apps as string[]) || [];
  const fscm = apps.some((a) => a === "finance" || a === "scm");
  const crm = apps.some((a) => ["sales", "customer_service", "field_service", "customer_insights", "contact_center"].includes(a));
  const q: string[] = [];
  const erp = p.current_erp?.erp;
  if (erp === "ax2012" || erp === "sap") q.push(`Hur ser partnerns metod ut för migrering från ${erp === "sap" ? "SAP" : "AX\u00A02012"}, och vilka data flyttas med?`);
  if (p.company?.countries && p.company.countries !== "1") q.push("Vilken lokalisering finns för varje land vi verkar i, och vem ansvarar för den?");
  if (fscm && crm) q.push("Hur integreras Finance & Supply\u00A0Chain\u00A0Management och CRM via Dataverse eller dual-write?");
  if (apps.includes("contact_center")) q.push("Hur går flödet från växel och kanaler till Customer Service, och hur kopplas det mot affärssystemet?");
  q.push("Vilken supportmodell erbjuds efter driftstart?");
  if (crm) q.push("Vilken licensmodell passar oss, Attach eller Base, och vad bör kontrolleras?");
  return q.slice(0, 5);
}

export type SectionStatus = "Genomförd" | "Påbörjad" | "Saknas";
