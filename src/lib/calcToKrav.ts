/**
 * Övergången kalkylator → kravspecifikation.
 * Det besökaren redan angett i kalkylen följer med som utgångsläge via samma URL-parametrar
 * som matchningstesterna använder (bransch, storlek, omraden, produkt) plus kalla=kalkyl.
 * Ingen ny lagring: kravspecen sparar själv tillbaka till köparprofilen (useKravProfileSync).
 */
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

export type CalcProduct =
  | "bc"
  | "finance-scm"
  | "sales"
  | "customer-service"
  | "contact-center"
  | "field-service"
  | "customer-insights";

export type KravTarget = "erp" | "sales" | "service" | "marketing";

interface TargetCfg {
  krav: KravTarget;
  path: string;
  produkt?: "bc" | "fsc";
  /** Område som alltid ingår för produkten. */
  base: string[];
  integrationArea: string;
  /** Antal användare kan översättas till kravspecens storleksfråga (bara CRM-specarna frågar om användare). */
  sizeFromUsers: boolean;
  label: string;
}

const TARGETS: Record<CalcProduct, TargetCfg> = {
  bc: { krav: "erp", path: "/kravspecifikation/", produkt: "bc", base: ["ekonomi"], integrationArea: "integration", sizeFromUsers: false, label: "Business Central" },
  "finance-scm": { krav: "erp", path: "/kravspecifikation/", produkt: "fsc", base: ["ekonomi"], integrationArea: "integration", sizeFromUsers: false, label: "Finance & Supply Chain" },
  sales: { krav: "sales", path: "/kravspecifikation-sales/", base: ["account_contact"], integrationArea: "integration", sizeFromUsers: true, label: "Sales" },
  "customer-service": { krav: "service", path: "/kravspecifikation-kundservice/", base: ["case_mgmt"], integrationArea: "integration_cs", sizeFromUsers: true, label: "Customer Service" },
  "contact-center": { krav: "service", path: "/kravspecifikation-kundservice/", base: ["case_mgmt", "contact_center"], integrationArea: "integration_cs", sizeFromUsers: true, label: "Contact Center" },
  "field-service": { krav: "service", path: "/kravspecifikation-kundservice/", base: ["field_service", "scheduling"], integrationArea: "integration_cs", sizeFromUsers: true, label: "Field Service" },
  "customer-insights": { krav: "marketing", path: "/kravspecifikation-marketing/", base: [], integrationArea: "integration", sizeFromUsers: false, label: "Customer Insights" },
};

/** Kalkylatorns effektiviseringsdrivare till kravspecens funktionsområden (per produkt). */
export const DRIVER_AREAS: Record<CalcProduct, Record<string, string[]>> = {
  bc: {
    "order-entry": ["forsaljning"], ecommerce: ["forsaljning", "integration"], "warehouse-light": ["lager"],
    "ap-automation": ["ekonomi", "inkop"], pos: ["forsaljning"], "price-currency": ["forsaljning", "ekonomi"],
    wms: ["lager"], edi: ["inkop", "integration"], tms: ["transport"], forecast: ["inkop", "lager"],
    production: ["produktion"], quality: ["produktion"], mrp: ["produktion", "inkop"], "service-after": ["service"],
    "project-time": ["projekt"], "tm-billing": ["projekt", "ekonomi"], resource: ["projekt"],
    subscription: ["forsaljning", "ekonomi"], expense: ["ekonomi"], reporting: ["ekonomi"], integration: ["integration"],
  },
  "finance-scm": {
    "supply-planning": ["inkop", "lager"], "finance-close": ["ekonomi"], procurement: ["inkop"],
    warehouse: ["lager"], compliance: ["ekonomi"],
  },
  sales: {
    "lead-conversion": ["lead_mgmt"], "win-rate": ["opportunity"], "seller-productivity": ["activities", "automation"],
    forecast: ["opportunity", "analytics"], "quote-config": ["quotes_orders"], "long-cycle": ["opportunity"],
    channel: ["account_contact"], "service-cross-sell": ["opportunity"], "erp-integration": ["integration", "quotes_orders"],
    "account-coverage": ["account_contact"], "cross-sell": ["opportunity"], "quote-speed": ["quotes_orders"],
    "field-sales": ["activities"], ramp: ["activities"], expansion: ["opportunity"], churn: ["account_contact", "analytics"],
    "advisor-productivity": ["activities", "automation"], compliance: ["activities"], "project-pipeline": ["opportunity"],
    "admin-time": ["activities", "automation"], "marketing-handover": ["lead_mgmt", "email_marketing"],
  },
  "customer-service": {
    deflection: ["self_service", "knowledge"], aht: ["queues_routing", "copilot_ai"], omnichannel: ["channels"], csat: ["analytics_cs"],
  },
  "contact-center": {
    "voice-deflection": ["contact_center", "copilot_ai"], "agent-assist": ["copilot_ai"],
    "platform-consolidation": ["contact_center", "channels"], workforce: ["scheduling"],
  },
  "field-service": {
    "first-time-fix": ["field_service", "knowledge"], "route-optimization": ["scheduling"],
    "remote-assist": ["field_service"], "inventory-truck": ["field_service"],
  },
  "customer-insights": {
    segmentation: ["segments"], journeys: ["journeys"], churn: ["personalization", "analytics"], "unified-data": ["segments", "integration"],
  },
};

/**
 * Kalkylatorernas egna branschval till kravspecens branschnamn.
 * Breda val (Handel, B2B-tjänster, Annan) saknas med flit: de kan inte översättas utan att gissa.
 */
export const CALC_INDUSTRY_TO_NAME: Record<string, string> = {
  Tillverkning: "Tillverkningsindustri",
  Distribution: "Grossist & Distribution",
  "Distribution & grossist": "Grossist & Distribution",
  Tjänster: "Konsulttjänster",
  "Tech & SaaS": "Telekom & IT-tjänster",
  "Finans & försäkring": "Finans & Försäkring",
  "Bygg & installation": "Bygg, Entreprenad & Installation",
};

/** Antal användare till CRM-kravspecarnas storleksval. */
export function usersToTeamSize(users: number): string | undefined {
  if (!Number.isFinite(users) || users <= 0) return undefined;
  if (users <= 5) return "1–5";
  if (users <= 10) return "6–10";
  if (users <= 20) return "11–20";
  if (users <= 50) return "21–50";
  if (users <= 100) return "51–100";
  return "100+";
}

export interface CalcKravInput {
  product: CalcProduct;
  drivers: string[];
  integrations: number;
  users?: number;
  /** Kalkylatorns eget branschval. */
  calcIndustry?: string;
  /** Om köparprofilen redan har en bransch används den (den är mer exakt än kalkylens breda val). */
  profileHasIndustry?: boolean;
}

export interface CalcKravLink {
  href: string;
  krav: KravTarget;
  label: string;
  industry?: string;
  size?: string;
  areas: string[];
  industryFromProfile: boolean;
}

export function calcToKravLink(i: CalcKravInput): CalcKravLink {
  const t = TARGETS[i.product];
  const map = DRIVER_AREAS[i.product];
  const areas = new Set(t.base);
  for (const d of i.drivers) for (const a of map[d] ?? []) areas.add(a);
  if (i.integrations > 0) areas.add(t.integrationArea);

  const industry = !i.profileHasIndustry && i.calcIndustry ? CALC_INDUSTRY_TO_NAME[i.calcIndustry] : undefined;
  const size = t.sizeFromUsers && i.users ? usersToTeamSize(i.users) : undefined;

  const sp = new URLSearchParams();
  if (t.produkt) sp.set("produkt", t.produkt);
  if (industry) sp.set("bransch", industry);
  if (size) sp.set("storlek", size);
  const list = [...areas];
  if (list.length) sp.set("omraden", list.join(","));
  sp.set("kalla", "kalkyl");

  return { href: `${t.path}?${sp}`, krav: t.krav, label: t.label, industry, size, areas: list, industryFromProfile: Boolean(i.profileHasIndustry) };
}

/** Läser förvalda områden för valfri kravspec; okända id:n ignoreras. */
export function readPrefillAreas(search: string, ids: readonly string[]): string[] {
  const raw = new URLSearchParams(search).get("omraden");
  if (!raw) return [];
  return [...new Set(raw.split(",").filter((id) => ids.includes(id)))];
}

export type KravSource = "kalkyl" | "test" | "direct";

/** Var kravspecens förifyllning kommer ifrån. */
export function kravSource(search: string): KravSource {
  const sp = new URLSearchParams(search);
  if (sp.get("kalla") === "kalkyl") return "kalkyl";
  return sp.has("omraden") || sp.has("storlek") ? "test" : "direct";
}

export function prefillSourceText(search: string): string {
  return kravSource(search) === "kalkyl" ? "Förifyllt från din kostnadskalkyl" : "Förifyllt från ditt matchningstest";
}

/** Anonym mätning av kedjan. Inga svar eller personuppgifter skickas, bara produkt, källa och antal. */
export function trackCalcToKrav(product: CalcProduct, link: CalcKravLink) {
  trackFunnelEvent({
    event_type: "journey",
    event_name: "calc_to_kravspec",
    metadata: { product, kravspec: link.krav, industry_carried: Boolean(link.industry) || link.industryFromProfile, size_carried: Boolean(link.size), area_count: link.areas.length },
  });
}

export type KravPartnerTarget = "compare" | "all_partners" | "profile" | "send_underlag";

/** Mätning i kravspecen: startad, slutförd och vidare till partnerurval/förfrågan, en gång per sidvisning. */
export function createKravJourney(krav: KravTarget) {
  const fired = new Set<string>();
  const src = () => (typeof window === "undefined" ? "direct" : kravSource(window.location.search));
  const once = (name: string, metadata: Record<string, unknown>) => {
    if (fired.has(name)) return;
    fired.add(name);
    trackFunnelEvent({ event_type: "journey", event_name: name, metadata: { kravspec: krav, source: src(), ...metadata } });
  };
  return {
    started: () => once("kravspec_started", {}),
    completed: (areaCount: number) => once("kravspec_completed", { area_count: areaCount }),
    toPartners: (target: KravPartnerTarget) => once(`kravspec_to_partners:${target}`, { target }),
  };
}
