// Gemensam taxonomi för Aktuellt (d365.se:s egen analys av förändringar i Dynamics 365).
// Ren TypeScript utan beroenden: används både av backendfunktionen manage-aktuellt
// och av webbplatsen (via src/lib/aktuellt.ts), så att listorna aldrig glider isär.
// Produktnycklar = product_catalog.product_key (partnermastermodellen).
// Branscher = STANDARD_INDUSTRIES (test säkerställer att listorna är identiska).

export const AKTUELLT_PRODUCTS = [
  { key: "business-central", label: "Business Central" },
  { key: "finance", label: "Finance" },
  { key: "supply-chain", label: "Supply Chain Management" },
  { key: "project-operations", label: "Project Operations" },
  { key: "commerce", label: "Commerce" },
  { key: "human-resources", label: "Human Resources" },
  { key: "sales", label: "Sales" },
  { key: "customer-service", label: "Customer Service" },
  { key: "field-service", label: "Field Service" },
  { key: "customer-insights", label: "Customer Insights" },
  { key: "contact-center", label: "Contact Center" },
  { key: "power-platform", label: "Power Platform" },
  { key: "power-bi", label: "Power BI" },
  { key: "fabric", label: "Microsoft Fabric" },
  { key: "copilot", label: "Copilot" },
  { key: "copilot-studio", label: "Copilot Studio och AI-agenter" },
] as const;
export type AktuelltProductKey = (typeof AKTUELLT_PRODUCTS)[number]["key"];

export const AKTUELLT_TOPICS = [
  { key: "ai-copilot", label: "AI och Copilot" },
  { key: "agenter", label: "Agenter" },
  { key: "erp", label: "ERP" },
  { key: "crm", label: "CRM" },
  { key: "automation", label: "Automation" },
  { key: "data-analys", label: "Data och analys" },
  { key: "integration", label: "Integration" },
  { key: "licensiering", label: "Licensiering" },
] as const;
export type AktuelltTopic = (typeof AKTUELLT_TOPICS)[number]["key"];

export const AKTUELLT_CUSTOMER_STATUS = [
  { key: "evaluating", label: "Utvärderar Dynamics 365" },
  { key: "existing", label: "Använder redan Dynamics 365" },
  { key: "both", label: "Båda" },
] as const;
export type AktuelltCustomerStatus = (typeof AKTUELLT_CUSTOMER_STATUS)[number]["key"];

export const AKTUELLT_AVAILABILITY = [
  { key: "planned", label: "Planerad" },
  { key: "preview", label: "Preview" },
  { key: "rolling_out", label: "Under utrullning" },
  { key: "available", label: "Tillgänglig" },
  { key: "changed", label: "Ändrad eller uppdaterad" },
  { key: "not_relevant", label: "Ej relevant" },
  { key: "unclear", label: "Oklar, behöver verifieras" },
] as const;
export type AktuelltAvailability = (typeof AKTUELLT_AVAILABILITY)[number]["key"];

export const AKTUELLT_ACTIONS = [
  { key: "investigate", label: "Undersök nu" },
  { key: "prepare", label: "Förbered" },
  { key: "monitor", label: "Bevaka" },
  { key: "wait", label: "Avvakta" },
] as const;
export type AktuelltAction = (typeof AKTUELLT_ACTIONS)[number]["key"];

export const AKTUELLT_STATUSES = [
  { key: "candidate", label: "Kandidat" },
  { key: "draft", label: "Utkast" },
  { key: "review", label: "Redo för granskning" },
  { key: "approved", label: "Godkänd" },
  { key: "published", label: "Publicerad" },
  { key: "ignored", label: "Ignorerad" },
  { key: "archived", label: "Arkiverad" },
] as const;
export type AktuelltStatus = (typeof AKTUELLT_STATUSES)[number]["key"];

export const AKTUELLT_NOT_PUBLISH_REASONS = [
  { key: "weak_d365_link", label: "Svag koppling till Dynamics 365" },
  { key: "marketing_only", label: "Rent marknadsföringsinnehåll" },
  { key: "no_new_information", label: "Ingen tydlig skillnad mot befintlig information" },
  { key: "no_buyer_impact", label: "Saknar betydelse för köpare eller befintliga kunder" },
  { key: "insufficient_source", label: "Otillräckligt källunderlag" },
  { key: "too_small", label: "För liten förändring" },
  { key: "duplicate", label: "Dubblerar en redan publicerad analys" },
  { key: "uncertain_availability", label: "För osäker tillgänglighetsstatus" },
] as const;

/** Befintliga destinationer på d365.se som en Aktuellt-artikel kan leda vidare till. Inga nya köpresor. */
export const AKTUELLT_CTA_DESTINATIONS = [
  { url: "/kom-igang/", label: "Hitta rätt Dynamics 365-lösning" },
  { url: "/businesscentral/", label: "Läs om Business Central" },
  { url: "/finance-supply-chain/", label: "Läs om Finance & Supply Chain Management" },
  { url: "/crm/", label: "Läs om Dynamics 365 CRM" },
  { url: "/d365sales/", label: "Läs om Dynamics 365 Sales" },
  { url: "/d365customerservice/", label: "Läs om Customer Service" },
  { url: "/d365fieldservice/", label: "Läs om Field Service" },
  { url: "/d365marketing/", label: "Läs om Customer Insights" },
  { url: "/d365contactcenter/", label: "Läs om Contact Center" },
  { url: "/copilot/", label: "Läs om Copilot i Dynamics 365" },
  { url: "/agents/", label: "Läs om AI-agenter" },
  { url: "/ai-readiness/", label: "Gör AI-mognadsanalysen" },
  { url: "/priser/", label: "Se priser och licenser" },
  { url: "/kostnad/", label: "Räkna på kostnaden" },
  { url: "/kravspecifikation/", label: "Skapa kravspecifikation" },
  { url: "/befintlig-kund/", label: "Stöd för er som redan har Dynamics 365" },
  { url: "/alla-d365-partners/", label: "Se Dynamics 365-partners" },
  { url: "/jamfor-partners/", label: "Jämför partners" },
] as const;

/** Startvärden för relevans. Ändras här, inget annat behöver ändras. Visas aldrig publikt. */
export const AKTUELLT_RELEVANCE_THRESHOLDS = { priority: 80, consider: 60 } as const;

export function relevanceBand(score: number | null | undefined): "priority" | "consider" | "low" | "unknown" {
  if (typeof score !== "number" || Number.isNaN(score)) return "unknown";
  if (score >= AKTUELLT_RELEVANCE_THRESHOLDS.priority) return "priority";
  if (score >= AKTUELLT_RELEVANCE_THRESHOLDS.consider) return "consider";
  return "low";
}

/** Samma namn som STANDARD_INDUSTRIES i src/data/standardIndustries.ts. */
export const AKTUELLT_INDUSTRIES = [
  "Jordbruk & Skogsbruk",
  "Livsmedel & Processindustri",
  "Tillverkningsindustri",
  "Life Science / Medtech",
  "Energi & Utilities",
  "Bygg, Entreprenad & Installation",
  "Grossist & Distribution",
  "Retail & E-handel",
  "Mode, Sport & Textil",
  "Transport & Logistik",
  "Media & Publishing",
  "Telekom & IT-tjänster",
  "Finans & Försäkring",
  "Fastighet & Förvaltning",
  "Konsulttjänster",
  "Uthyrningsverksamhet",
  "Offentlig sektor",
  "Utbildning",
  "Hälsa- & sjukvård",
  "Non-profit / Organisationer",
  "Medlemsorganisationer",
] as const;

/** Målgrupper (samma fält target_roles som Artiklar). */
export const AKTUELLT_AUDIENCES = [
  { key: "ledning", label: "Ledning" },
  { key: "ekonomi", label: "Ekonomi" },
  { key: "it", label: "IT" },
  { key: "salj-marknad", label: "Sälj och marknad" },
  { key: "kundservice", label: "Kundservice" },
  { key: "verksamhet", label: "Verksamhet och logistik" },
] as const;

export function aktuelltSlugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/å|ä/g, "a")
    .replace(/ö/g, "o")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const keysOf = <T extends ReadonlyArray<{ key: string }>>(list: T) => list.map((x) => x.key) as string[];

/**
 * Normaliserar en inkommande kandidat (från manuell import eller framtida extern agent).
 * Okända värden släpps, så att ingenting utanför taxonomin kan sparas.
 * Status tvingas alltid till candidate eller draft: en kandidat kan aldrig publiceras.
 */
export function normalizeAktuelltCandidate(input: Record<string, unknown>) {
  const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const oneOf = (v: unknown, allowed: string[]) => (typeof v === "string" && allowed.includes(v) ? v : null);
  const date = (v: unknown) => {
    const s = str(v, 40);
    if (!/^\d{4}-\d{2}-\d{2}/.test(s)) return null;
    const day = s.slice(0, 10);
    const d = new Date(`${day}T00:00:00Z`);
    // Avvisa datum som inte finns (t.ex. 2026-02-31) i stället för att rulla över dem.
    return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== day ? null : day;
  };
  const productKeys = keysOf(AKTUELLT_PRODUCTS);
  const products = Array.isArray(input.products)
    ? (input.products as unknown[]).filter((p): p is string => typeof p === "string" && productKeys.includes(p))
    : [];
  const industry = typeof input.industry === "string" && (AKTUELLT_INDUSTRIES as readonly string[]).includes(input.industry)
    ? input.industry
    : null;
  const scoreNum = typeof input.relevance_score === "number" ? input.relevance_score : Number(input.relevance_score);
  const relevance_score = Number.isFinite(scoreNum) ? Math.max(0, Math.min(100, Math.round(scoreNum))) : null;
  const status = input.status === "draft" ? "draft" : "candidate";
  return {
    source_url: str(input.source_url, 2000),
    source_name: str(input.source_name, 200) || null,
    source_published_at: date(input.source_published_at),
    discovered_at: date(input.discovered_at),
    title: str(input.title, 200),
    lead: str(input.summary ?? input.lead, 600),
    products: Array.from(new Set(products)),
    topic: oneOf(input.topic, keysOf(AKTUELLT_TOPICS)),
    industry,
    customer_status: oneOf(input.customer_status, keysOf(AKTUELLT_CUSTOMER_STATUS)),
    availability_status: oneOf(input.availability_status, keysOf(AKTUELLT_AVAILABILITY)),
    recommended_action: oneOf(input.recommended_action, keysOf(AKTUELLT_ACTIONS)),
    relevance_score,
    relevance_reason: str(input.relevance_reason, 1000) || null,
    status,
  };
}
