// Aktuellt: d365.se:s egen analys av förändringar i Dynamics 365.
// Taxonomin delas med backend (supabase/functions/_shared/aktuellt-taxonomy.ts).
import {
  AKTUELLT_ACTIONS,
  AKTUELLT_AVAILABILITY,
  AKTUELLT_CUSTOMER_STATUS,
  AKTUELLT_PRODUCTS,
  AKTUELLT_STATUSES,
  AKTUELLT_TOPICS,
} from "../../supabase/functions/_shared/aktuellt-taxonomy";
import { industryMatches } from "@/lib/contextualPartnerNews";

export * from "../../supabase/functions/_shared/aktuellt-taxonomy";
export * from "../../supabase/functions/_shared/aktuellt-publish";

export interface AktuelltAnalysis {
  what_happened?: string;
  business_impact?: string;
  for_evaluators?: string | null;
  for_customers?: string | null;
  partner_questions?: string[];
}

export interface AktuelltArticle {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  url: string | null;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  updated_at: string;
  created_at: string;
  editorial_status: string | null;
  analysis: AktuelltAnalysis | null;
  source_name: string | null;
  source_url: string | null;
  source_published_at: string | null;
  extra_sources: { name?: string; url: string }[] | null;
  fact_checked_at: string | null;
  product_keys: string[];
  topic: string | null;
  industry: string | null;
  target_roles: string[];
  customer_status: string | null;
  availability_status: string | null;
  recommended_action: string | null;
  needs_verification: boolean;
  cta_label: string | null;
  cta_url: string | null;
  editorial_priority: number;
  context_until: string | null;
}

/** Fält som är säkra att visa publikt (inga interna bedömningar finns i tabellen). */
export const AKTUELLT_PUBLIC_SELECT =
  "id,title,description,slug,url,image_url,is_published,published_at,updated_at,created_at,editorial_status,analysis,source_name,source_url,source_published_at,extra_sources,fact_checked_at,product_keys,topic,industry,target_roles,customer_status,availability_status,recommended_action,needs_verification,cta_label,cta_url,editorial_priority,context_until";

const labelOf = (list: ReadonlyArray<{ key: string; label: string }>) => (key: string | null | undefined) =>
  list.find((x) => x.key === key)?.label ?? "";

export const aktuelltProductLabel = labelOf(AKTUELLT_PRODUCTS);
export const aktuelltTopicLabel = labelOf(AKTUELLT_TOPICS);
export const aktuelltCustomerStatusLabel = labelOf(AKTUELLT_CUSTOMER_STATUS);
export const aktuelltAvailabilityLabel = labelOf(AKTUELLT_AVAILABILITY);
export const aktuelltActionLabel = labelOf(AKTUELLT_ACTIONS);
export const aktuelltStatusLabel = labelOf(AKTUELLT_STATUSES);

export const aktuelltPath = (slug: string | null | undefined) => `/aktuellt/${slug ?? ""}/`;

/** Högst så många Aktuellt-artiklar visas i ett kontextuellt block. */
export const AKTUELLT_CONTEXT_MAX = 2;
/** Utan eget slutdatum visas en artikel kontextuellt så länge som faktakontrollen är så här färsk. */
export const AKTUELLT_CONTEXT_MAX_AGE_DAYS = 180;

export interface AktuelltContext {
  products?: string[];
  topics?: string[];
  industry?: string;
}

/** Aktuell tillgänglighet som är meningsfull att visa på kortet. */
export function showsAvailability(status: string | null | undefined): boolean {
  return !!status && status !== "not_relevant";
}

function dayDiff(fromIso: string, today: Date): number {
  const d = new Date(fromIso.slice(0, 10));
  return (today.getTime() - d.getTime()) / 86_400_000;
}

/** Är artikeln fortfarande färsk nog att visas automatiskt på andra sidor? */
export function isContextuallyFresh(a: Pick<AktuelltArticle, "context_until" | "fact_checked_at" | "published_at">, today = new Date()): boolean {
  const todayIso = today.toISOString().slice(0, 10);
  if (a.context_until) return a.context_until >= todayIso;
  const ref = a.fact_checked_at || a.published_at;
  if (!ref) return false;
  return dayDiff(ref, today) <= AKTUELLT_CONTEXT_MAX_AGE_DAYS;
}

export function matchesContext(a: Pick<AktuelltArticle, "product_keys" | "topic" | "industry">, ctx: AktuelltContext): boolean {
  const byProduct = (ctx.products ?? []).some((p) => (a.product_keys ?? []).includes(p));
  const byTopic = !!a.topic && (ctx.topics ?? []).includes(a.topic);
  const byIndustry = !!ctx.industry && industryMatches(a.industry, ctx.industry);
  return byProduct || byTopic || byIndustry;
}

/**
 * Väljer högst två publicerade, färska och ämnesmatchade analyser.
 * Manuell prioritering först, sedan senast publicerad. Inga dubbletter.
 */
export function pickContextualAktuellt(
  items: AktuelltArticle[],
  ctx: AktuelltContext,
  today = new Date(),
  limit: number = AKTUELLT_CONTEXT_MAX,
): AktuelltArticle[] {
  const seen = new Set<string>();
  return items
    .filter((a) => a.is_published && a.editorial_status === "published" && !!a.slug)
    .filter((a) => a.availability_status !== "not_relevant")
    .filter((a) => isContextuallyFresh(a, today))
    .filter((a) => matchesContext(a, ctx))
    .sort((a, b) => (b.editorial_priority ?? 0) - (a.editorial_priority ?? 0) || (b.published_at ?? "").localeCompare(a.published_at ?? ""))
    .filter((a) => (seen.has(a.id) ? false : (seen.add(a.id), true)))
    .slice(0, Math.min(limit, AKTUELLT_CONTEXT_MAX));
}

/** Antal matchande analyser totalt (styr om länken till fler visas). */
export function countContextualAktuellt(items: AktuelltArticle[], ctx: AktuelltContext, today = new Date()): number {
  return items
    .filter((a) => a.is_published && a.editorial_status === "published" && !!a.slug)
    .filter((a) => a.availability_status !== "not_relevant")
    .filter((a) => isContextuallyFresh(a, today))
    .filter((a) => matchesContext(a, ctx)).length;
}

/**
 * Alla sidor med ett automatiskt Aktuellt-block och vilket sammanhang de matchar.
 * Sidorna läser sitt sammanhang härifrån, och redaktionen visar samma lista som
 * "Visas automatiskt på", så ingen artikel behöver placeras manuellt.
 */
export const AKTUELLT_PLACEMENTS = {
  businessCentral: { path: "/businesscentral/", label: "Business Central", ctx: { products: ["business-central"] } },
  financeSupplyChain: { path: "/finance-supply-chain/", label: "Finance & Supply Chain Management", ctx: { products: ["finance", "supply-chain"] } },
  affarssystem: { path: "/affarssystem/", label: "Affärssystem (ERP)", ctx: { products: ["business-central", "finance", "supply-chain"], topics: ["erp"] } },
  crm: { path: "/crm/", label: "CRM", ctx: { products: ["sales", "customer-service", "field-service", "customer-insights", "contact-center"], topics: ["crm"] } },
  sales: { path: "/d365sales/", label: "Sales", ctx: { products: ["sales"] } },
  customerService: { path: "/d365customerservice/", label: "Customer Service", ctx: { products: ["customer-service"] } },
  fieldService: { path: "/d365fieldservice/", label: "Field Service", ctx: { products: ["field-service"] } },
  contactCenter: { path: "/d365contactcenter/", label: "Contact Center", ctx: { products: ["contact-center"] } },
  customerInsights: { path: "/d365marketing/", label: "Customer Insights", ctx: { products: ["customer-insights"] } },
  copilot: { path: "/copilot/", label: "Copilot", ctx: { products: ["copilot", "copilot-studio"], topics: ["ai-copilot"] } },
  agents: { path: "/agents/", label: "AI-agenter", ctx: { products: ["copilot-studio"], topics: ["agenter"] } },
  aiOverview: { path: "/aioversikt/", label: "AI-översikt", ctx: { products: ["copilot", "copilot-studio"], topics: ["ai-copilot", "agenter"] } },
  priser: { path: "/priser/", label: "Priser och licenser", ctx: { topics: ["licensiering"] } },
} as const satisfies Record<string, { path: string; label: string; ctx: AktuelltContext }>;

/** Var en artikel visas automatiskt när den är publicerad (utöver /aktuellt/). */
export function aktuelltPlacementsFor(a: Pick<AktuelltArticle, "product_keys" | "topic" | "industry">): string[] {
  const out: string[] = Object.values(AKTUELLT_PLACEMENTS)
    .filter((p) => matchesContext(a, p.ctx as AktuelltContext))
    .map((p) => `${p.label} (${p.path})`);
  if (a.industry) out.push(`Branschsidan för ${a.industry.toLowerCase()}`);
  return out;
}

/** Befintliga produktsidor per produktnyckel (för länken "Läs om produkten"). */
export const AKTUELLT_PRODUCT_PAGES: Record<string, string> = {
  "business-central": "/businesscentral/",
  finance: "/finance-supply-chain/",
  "supply-chain": "/finance-supply-chain/",
  "project-operations": "/d365projectoperations/",
  commerce: "/d365commerce/",
  "human-resources": "/d365humanresources/",
  sales: "/d365sales/",
  "customer-service": "/d365customerservice/",
  "field-service": "/d365fieldservice/",
  "customer-insights": "/d365marketing/",
  "contact-center": "/d365contactcenter/",
  copilot: "/copilot/",
  "copilot-studio": "/agents/",
};

/** Kort förklaring per rekommenderad åtgärd, visas under "Behöver ni agera?". */
export const AKTUELLT_ACTION_HINTS: Record<string, string> = {
  investigate: "Förändringen kan påverka er redan nu. Ta upp den med er partner eller i pågående utvärdering.",
  prepare: "Förändringen är på väg. Planera för hur den påverkar processer, licenser eller kommande beslut.",
  monitor: "Följ utvecklingen. Det finns ännu inget som kräver beslut.",
  wait: "Det finns inget skäl att agera nu. Vänta tills förändringen är tydligare eller tillgänglig.",
};
