import type { TabKey } from "./types";
export type { TabKey } from "./types";
import { swedishPossessive, formatSwedishPhone, formatSwedishBand } from "@/lib/utils";
import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Users,
  Briefcase,
  Mail,
  Phone,
  User,
  Sparkles,
  Package,
  ExternalLink,
  ArrowRight,
  MapPin,
  Globe,
} from "lucide-react";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import type { DatabasePartner } from "@/hooks/usePartners";
import LeadCTA from "@/components/LeadCTA";
import PartnerProfileNewsSection from "@/components/PartnerProfileNewsSection";
import AiProfilePublic from "@/components/partner/AiProfilePublic";
import PartnerQuickFacts from "@/components/partner/PartnerQuickFacts";
import { buildPartnerProductPath } from "@/lib/partnerProductSlug";
import { trackPartnerClick } from "@/utils/trackPartnerClick";
import { appToProductFilterKey, type ProductFilterKey } from "@/lib/productFilterGroup";
import ProductDeliveryProfile from "@/components/partner/ProductDeliveryProfile";
import { isDeliveryProfileFilled, type DeliveryProfileValue } from "@/data/deliveryProfileFields";

const BusinessCentralIcon = "/d365-icons/BusinessCentral-new.webp";
const FinanceIcon = "/d365-icons/Finance.svg";
const SalesIcon = "/d365-icons/Sales.svg";
const MarketingIcon = "/d365-icons/Marketing.svg";
const CustomerServiceIcon = "/d365-icons/CustomerService.svg";
const FieldServiceIcon = "/d365-icons/FieldService.svg";
const ContactCenterIcon = "/d365-icons/ContactCenter.svg";
const ProjectOperationsIcon = "/d365-icons/ProjectOperations.svg";
const CommerceIcon = "/d365-icons/Commerce.svg";
const HumanResourcesIcon = "/d365-icons/HumanResources.svg";

const SPECIALTY_APPLICATIONS = ["Project Operations", "Commerce", "Human Resources"];

const COMPANY_SIZE_ORDER = ["1-49", "50-99", "100-249", "250-999", "1.000-4.999", ">5.000"];
const REVENUE_ORDER = ["1-24 MSEK", "25-99 MSEK", "100-499 MSEK", "500-999 MSEK", "1.000-4.999 MSEK", ">5.000 MSEK"];
const GEO_ORDER = ["Sverige", "Norden", "Europa", "Globalt", "Övriga världen", "Internationellt"];

function sortByCanonical(values: string[], order: string[]): string[] {
  return [...values].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

// Safely coerce a value that may be a string, string[] or null/undefined into a trimmed string.
const toText = (v: unknown): string => {
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string").map((x) => (x as string).trim()).filter(Boolean).join("\n");
  return "";
};

const appIconSrc: Record<string, string> = {
  "Business Central": BusinessCentralIcon,
  "Finance": FinanceIcon,
  "Supply Chain Management": FinanceIcon,
  "Finance & SCM": FinanceIcon,
  "Finance & Supply Chain": FinanceIcon,
  "Sales": SalesIcon,
  "Customer Service": CustomerServiceIcon,
  "Field Service": FieldServiceIcon,
  "Contact Center": ContactCenterIcon,
  "Customer Insights": MarketingIcon,
  "Customer Insights (Marketing)": MarketingIcon,
  "Marketing": MarketingIcon,
  "Project Operations": ProjectOperationsIcon,
  "Commerce": CommerceIcon,
  "Human Resources": HumanResourcesIcon,
};


const TAB_META: Record<
  TabKey,
  { label: string; short: string; icon: string; slug: string; filterKeys: Array<"bc" | "fsc" | "sales" | "service" | "crm"> }
> = {
  bc: {
    label: "Business Central",
    short: "Business Central",
    icon: BusinessCentralIcon,
    slug: "business-central",
    filterKeys: ["bc"],
  },
  fsc: {
    label: "Finance & Supply Chain",
    short: "F&SCM",
    icon: FinanceIcon,
    slug: "finance-supply-chain",
    filterKeys: ["fsc"],
  },
  crm: {
    label: "CRM / Customer Engagement",
    short: "CRM",
    icon: SalesIcon,
    slug: "crm",
    filterKeys: ["sales", "service", "crm"],
  },
};

interface Props {
  partner: DatabasePartner;
  initialTab: TabKey;
  selectedIndustry?: string;
  selectedCompanySize?: string;
  selectedGeography?: string;
  selectedRevenue?: string;
  onActiveTabChange?: (tab: TabKey, label: string) => void;
  onRequest?: (mode: "contact" | "demo" | "quote") => void;
}




function mergeArrays<T>(...arrs: (T[] | undefined | null)[]): T[] {
  const set = new Set<T>();
  arrs.forEach((a) => (a || []).forEach((v) => set.add(v)));
  return Array.from(set);
}

import { displayApplicationName, normalizeApplications, sortApplications, FSCM_DISPLAY_NAME } from "@/lib/applicationLabels";

const PRODUCT_FILTER_TO_APP: Record<string, string> = {
  bc: "Business Central",
  fsc: FSCM_DISPLAY_NAME,
  sales: "Sales",
  service: "Customer Service",
  crm: "Sales",
};

/** All product competencies the partner has registered, including both product_filters and explicit applications. */
function getAllProductCompetencies(partner: DatabasePartner): string[] {
  const apps: string[] = [];
  const pf = partner.product_filters || {};
  for (const [key, filter] of Object.entries(pf)) {
    if (filter && PRODUCT_FILTER_TO_APP[key]) {
      apps.push(PRODUCT_FILTER_TO_APP[key]);
    }
  }
  for (const app of partner.applications || []) {
    apps.push(displayApplicationName(app));
  }
  return sortApplications(normalizeApplications(apps));
}

function normalizeGeo(geo: string[]): string[] {
  const normalized = geo.map((g) => (g === "Internationellt" ? "Globalt" : g));
  const idx = normalized
    .map((g) => GEO_ORDER.indexOf(g))
    .filter((i) => i >= 0);
  if (idx.length === 0) return [];
  return GEO_ORDER.slice(0, Math.max(...idx) + 1);
}

function getAvailableTabs(partner: DatabasePartner): TabKey[] {
  const pf = (partner.product_filters || {}) as Record<string, unknown>;
  const apps = partner.applications || [];
  const tabs: TabKey[] = [];
  if (pf.bc || apps.includes("Business Central")) tabs.push("bc");
  if (
    pf.fsc ||
    apps.some((a) =>
      ["Finance", "Supply Chain Management", "Finance & SCM", "Finance & Supply Chain"].includes(a),
    )
  )
    tabs.push("fsc");
  const hasCrm =
    pf.sales ||
    pf.service ||
    pf.crm ||
    apps.some((a) =>
      [
        "Sales",
        "Customer Insights",
        "Customer Insights (Marketing)",
        "Marketing",
        "Customer Service",
        "Field Service",
        "Contact Center",
      ].includes(a),
    );
  if (hasCrm) tabs.push("crm");
  return tabs;
}

interface TabData {
  industries: string[];
  geography: string[];
  companySize: string[];
  revenue: string[];
  customerExamples: string[];
  customerCaseLinks: string[];
  productDescription: { text: string; aiGenerated: boolean } | null;
  whyChoose: string | null;
  keyPoints: string[];
  apps: string[];
  industryApps: Array<{ name: string; url: string; application: string; industry: string; description: string }>;
  contact: { name?: string; email?: string; phone?: string } | null;
  landingPageUrl: string | null;
  deliveryProfile: DeliveryProfileValue | null;
  productProfile: {
    app: string;
    positioning: string | null;
    roles: string[];
    engagement_model: string | null;
    methodology: string | null;
    weeks_min: number | null;
    weeks_max: number | null;
    cost_band: string | null;
  } | null;
}


function buildTabData(partner: DatabasePartner, tab: TabKey): TabData {
  const pf = (partner.product_filters || {}) as Record<string, any>;
  const keys = TAB_META[tab].filterKeys;

  const industries = mergeArrays<string>(
    ...keys.map((k) => pf[k]?.industries),
  );
  const fallbackIndustries = industries.length > 0 ? industries : (partner.industries || []).slice(0, 5);

  const companySize = sortByCanonical(mergeArrays<string>(...keys.map((k) => pf[k]?.companySize)), COMPANY_SIZE_ORDER);
  const revenue = sortByCanonical(mergeArrays<string>(...keys.map((k) => pf[k]?.revenue)), REVENUE_ORDER);

  const geoRaw = mergeArrays<string>(...keys.map((k) => {
    const g = pf[k]?.geography;
    if (!g) return [];
    return Array.isArray(g) ? g : [g];
  }));

  const geography = geoRaw.length > 0 ? normalizeGeo(geoRaw) : normalizeGeo(partner.geography || []);

  const customerExamples = mergeArrays<string>(
    ...keys.map((k) => pf[k]?.customerExamples),
  );
  const customerCaseLinks = mergeArrays<string>(
    ...keys.map((k) => pf[k]?.customerCaseLinks),
  );

  // Product description – first non-empty
  let productDescription: TabData["productDescription"] = null;
  for (const k of keys) {
    const txt = toText(pf[k]?.productDescription);
    if (txt) {
      productDescription = { text: txt, aiGenerated: !!pf[k]?.productDescriptionAiGenerated };
      break;
    }
  }

  // Why choose (per product) – first non-empty
  let whyChoose: string | null = null;
  for (const k of keys) {
    const txt = toText(pf[k]?.whyChoose);
    if (txt) { whyChoose = txt; break; }
  }

  // Key points (per product) – first non-empty, split into lines
  let keyPoints: string[] = [];
  for (const k of keys) {
    const raw = pf[k]?.keyPoints;
    let arr: string[] = [];
    if (Array.isArray(raw)) {
      arr = raw.filter((x: unknown) => typeof x === "string").map((x: string) => x.trim());
    } else if (typeof raw === "string" && raw.trim()) {
      arr = raw.split(/\n/).map((p: string) => p.trim().replace(/^[•\-\*]\s*/, ""));
    }
    arr = arr.filter(Boolean).slice(0, 6);
    if (arr.length) { keyPoints = arr; break; }
  }

  // Apps for this tab
  const appCategoryMap: Record<TabKey, string[]> = {
    bc: ["Business Central"],
    fsc: ["Finance", "Supply Chain Management", "Finance & SCM", "Finance & Supply Chain"],
    crm: [
      "Sales",
      "Customer Insights",
      "Customer Insights (Marketing)",
      "Marketing",
      "Customer Service",
      "Field Service",
      "Contact Center",
    ],
  };
  const apps = (partner.applications || []).filter((a) => appCategoryMap[tab].includes(a));

  const industryApps = (Array.isArray(partner.industry_apps) ? (partner.industry_apps as any[]) : []).filter(
    (a) => appCategoryMap[tab].includes(a.application),
  );

  let contact: TabData["contact"] = null;
  for (const k of keys) {
    const c = pf[k];
    if (c?.contactName || c?.contactEmail || c?.contactPhone) {
      contact = { name: c.contactName, email: c.contactEmail, phone: c.contactPhone };
      break;
    }
  }

  let landingPageUrl: string | null = null;
  for (const k of keys) {
    const u = toText(pf[k]?.landingPageUrl);
    if (u) {
      landingPageUrl = u;
      break;
    }
  }

  // Per-product beslutsprofil – pick first matching app's product_profile
  const productProfilesMap = ((partner as any).product_profiles || {}) as Record<string, any>;
  let productProfile: TabData["productProfile"] = null;
  for (const app of apps) {
    const raw = productProfilesMap[app];
    if (raw && typeof raw === "object") {
      productProfile = {
        app,
        positioning: typeof raw.positioning === "string" ? raw.positioning : null,
        roles: Array.isArray(raw.roles) ? raw.roles : [],
        engagement_model: typeof raw.engagement_model === "string" ? raw.engagement_model : null,
        methodology: typeof raw.methodology === "string" ? raw.methodology : null,
        weeks_min: typeof raw.weeks_min === "number" ? raw.weeks_min : null,
        weeks_max: typeof raw.weeks_max === "number" ? raw.weeks_max : null,
        cost_band: typeof raw.cost_band === "string" ? raw.cost_band : null,
      };
      break;
    }
  }

  // Leveransprofil per produktområde – första ifyllda sektionen för fliken
  let deliveryProfile: DeliveryProfileValue | null = null;
  for (const k of keys) {
    const raw = pf[k]?.deliveryProfile;
    if (raw && typeof raw === "object" && isDeliveryProfileFilled(raw)) {
      deliveryProfile = raw as DeliveryProfileValue;
      break;
    }
  }

  return {
    industries: fallbackIndustries,
    geography,
    companySize,
    revenue,
    customerExamples,
    customerCaseLinks,
    productDescription,
    whyChoose,
    keyPoints,
    apps,
    industryApps,
    contact,
    landingPageUrl,
    deliveryProfile,
    productProfile,
  };
}

function tabToProductKeys(tab: TabKey): ProductFilterKey[] {
  switch (tab) {
    case "bc":
      return ["bc"];
    case "fsc":
      return ["fsc"];
    case "crm":
      return ["sales", "service"];
    default:
      return [];
  }
}

function getIndustryPitchesForTab(
  partner: DatabasePartner,
  tab: TabKey,
  industries: string[],
): { industry: string; text: string }[] {
  const pitches = partner?.industry_pitches;
  if (!Array.isArray(pitches)) return [];
  const keys = new Set(tabToProductKeys(tab));
  return pitches
    .filter((p) => {
      if (!p?.text?.trim()) return false;
      const product = (p.product || "").trim();
      // General pitches without a product are shown whenever the industry is listed.
      if (!product) return true;
      const pitchKey = appToProductFilterKey(product);
      return pitchKey !== null && keys.has(pitchKey);
    })
    .map((p) => ({
      industry: (p.industry || "").trim(),
      text: p.text.trim(),
    }))
    .filter((p) => p.industry && industries.includes(p.industry));
}


export default function PartnerProductTabs({
  partner,
  initialTab,
  selectedIndustry,
  selectedCompanySize,
  selectedGeography,
  selectedRevenue,
  onActiveTabChange,
  onRequest,
}: Props) {

  const availableTabs = useMemo(() => getAvailableTabs(partner), [partner]);
  const fallbackTab: TabKey = availableTabs[0] || "bc";
  const [active, setActive] = useState<TabKey>(
    availableTabs.includes(initialTab) ? initialTab : fallbackTab,
  );

  useEffect(() => {
    if (availableTabs.includes(initialTab)) setActive(initialTab);
  }, [initialTab, availableTabs]);

  // Notify parent of active tab changes (incl. initial)
  useEffect(() => {
    onActiveTabChange?.(active, TAB_META[active].label);
  }, [active, onActiveTabChange]);

  // Update URL without reload when tab changes
  const initialMount = useRef(true);
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    const newPath = buildPartnerProductPath(partner.slug, TAB_META[active].slug);
    if (typeof window !== "undefined" && window.location.pathname !== newPath) {
      window.history.replaceState(null, "", newPath + window.location.search);
    }
  }, [active, partner.slug]);

  const data = useMemo(() => buildTabData(partner, active), [partner, active]);
  const tabMeta = TAB_META[active];

  if (availableTabs.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-12 text-center text-muted-foreground">
        Denna partner har inga registrerade Dynamics 365-områden ännu.
      </div>
    );
  }

  // Filter context badges
  const filterBadges = [selectedIndustry, selectedCompanySize, selectedGeography, selectedRevenue].filter(Boolean) as string[];

  return (
    <>
      {/* Helper text + sticky tabs */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-16 z-30">
        <div className="container mx-auto px-4 sm:px-6">
          {availableTabs.length > 1 && (
            <p className="text-xs sm:text-sm text-muted-foreground pt-3 pb-2 text-center">
              Denna partner arbetar med flera Dynamics 365-lösningar. Välj område för att se rätt profil.
            </p>
          )}
          <nav
            role="tablist"
            aria-label="Dynamics 365-områden"
            className="flex flex-wrap items-center justify-center gap-2 pb-3"
          >
            {availableTabs.map((key) => {
              const meta = TAB_META[key];
              const isActive = key === active;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(key)}
                  className={`group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-transparent text-foreground/80 border-foreground/40 hover:border-primary hover:text-primary hover:bg-muted/30"
                  }`}
                >
                  <img src={meta.icon} alt="" aria-hidden="true" className="w-4 h-4" />
                  <span className="hidden sm:inline">{meta.label}</span>
                  <span className="sm:hidden">{meta.short}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Match profile summary */}
            {filterBadges.length > 0 && (
              <section className="rounded-lg border border-border bg-card/60 p-5 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight mb-4">
                  Denna partner matchar er profil:
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-foreground">
                      <span className="font-semibold">Vald lösning:</span> {tabMeta.label}
                    </span>
                  </li>
                  {selectedIndustry && (
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-foreground">
                        <span className="font-semibold">Bransch:</span> {selectedIndustry}
                      </span>
                    </li>
                  )}
                  {selectedCompanySize && (
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-foreground">
                        <span className="font-semibold">Företagsstorlek:</span> {selectedCompanySize} anställda
                      </span>
                    </li>
                  )}
                  {selectedGeography && (
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-foreground">
                        <span className="font-semibold">Geografi:</span> {selectedGeography}
                      </span>
                    </li>
                  )}
                  {selectedIndustry && (
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-foreground">
                        <span className="font-semibold">Erfarenhet av liknande projekt inom {selectedIndustry}</span>
                      </span>
                    </li>
                  )}
                </ul>
              </section>
            )}

            {/* Lead CTA – auto-fills active product */}
            {onRequest && (
              <section className="w-full">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onRequest("contact")}
                    className="w-full min-h-[52px] bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white font-semibold text-base rounded inline-flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Ställ en fråga till {partner.name}
                  </button>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => onRequest("demo")}
                      className="flex-1 min-h-[52px] border border-slate-300 bg-white hover:bg-slate-50 text-foreground font-medium text-sm rounded inline-flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Boka Demo/Genomgång
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequest("quote")}
                      className="flex-1 min-h-[52px] border border-slate-300 bg-white hover:bg-slate-50 text-foreground font-medium text-sm rounded inline-flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Få en uppskattning av tid och kostnad
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-xs text-center text-muted-foreground">
                  Din förfrågan gäller <span className="font-semibold text-foreground">{tabMeta.label}</span>. Kostnadsfritt – {partner.name} svarar dig direkt, d365.se är kopierad för uppföljning. Inga privata e-postadresser accepteras.
                </p>
              </section>
            )}

            {/* Quick facts – helps customers compare themselves against the partner */}
            <PartnerQuickFacts partner={partner} activeTab={active} />

            {/* 1. Partnerns eget erbjudande */}

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
                {swedishPossessive(partner.name)} erbjudande inom {tabMeta.label}
              </h2>
              {(data.productProfile?.positioning || partner.positioning_statement) ? (
                <p className="text-base text-muted-foreground mb-5 max-w-[68ch] leading-relaxed">
                  {data.productProfile?.positioning || partner.positioning_statement}
                </p>
              ) : null}

              {data.whyChoose && (
                <div className="mt-4 text-[15px] sm:text-base text-foreground leading-relaxed max-w-[72ch] whitespace-pre-line">
                  {data.whyChoose}
                </div>
              )}

              {data.keyPoints.length > 0 && (
                <ul className="mt-5 space-y-2 max-w-[72ch]">
                  {data.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[15px] text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {data.productDescription && (
                <div className="mt-5 border-l-2 border-primary/40 pl-4 py-1 text-[15px] text-foreground/80 leading-relaxed max-w-[72ch]">
                  {data.productDescription.text}
                  {data.productDescription.aiGenerated && (
                    <div className="mt-2 text-[11px] text-muted-foreground inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI-genererad sammanfattning
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* 1b. Leveransprofil per produktområde */}
            {data.deliveryProfile && (
              <ProductDeliveryProfile
                value={data.deliveryProfile}
                productLabel={tabMeta.label}
                partnerName={partner.name}
              />
            )}



            {/* 2. Branscherfarenhet – storlek/omsättning ligger i Partnerfakta */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Branscherfarenhet
              </h2>
              <ul className="space-y-2.5">


                {data.industries.length > 0 && (
                  <li className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {data.industries.map((ind) => {
                        const industrySlug = STANDARD_INDUSTRIES.find((i) => i.name === ind)?.slug;
                        const badge = (
                          <Badge variant="outline" className="bg-card border-border py-1.5 px-3 text-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                            {ind}
                          </Badge>
                        );
                        return industrySlug ? (
                          <Link key={ind} to={`/branscher/${industrySlug}/`} className="inline-block">
                            {badge}
                          </Link>
                        ) : (
                          <span key={ind} className="inline-block">{badge}</span>
                        );
                      })}
                    </div>
                  </li>
                )}
                {data.customerExamples.length > 0 && (() => {
                  // Filtrera bort tomma/platshållar-strängar ("Kundexempel kan ges på förfrågan")
                  const placeholderRe = /^kundexempel\s+kan\s+ges/i;
                  const real = data.customerExamples
                    .map((s) => s.trim())
                    .filter((s) => s && !placeholderRe.test(s));
                  const showPlaceholder = real.length === 0 && data.customerExamples.some((s) => placeholderRe.test(s));
                  if (real.length === 0 && !showPlaceholder) return null;
                  const items = real.slice(0, 4);
                  const label = items.length >= 2 ? "Referenser bl.a." : items.length === 1 ? "Referens" : "Referenser";
                  return (
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                      <span className="text-foreground">
                        {showPlaceholder ? (
                          <em className="text-muted-foreground">Kundexempel kan ges på förfrågan.</em>
                        ) : (
                          <>{label}: <strong>{items.join(", ")}</strong></>
                        )}
                      </span>
                    </li>
                  );
                })()}
              {(() => {
                const pitches = getIndustryPitchesForTab(partner, active, data.industries);
                if (pitches.length === 0) return null;
                return (
                  <li className="flex flex-col gap-2 mt-2">
                    {pitches.map((pitch, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-foreground/90 leading-relaxed border-l-2 border-primary/40 pl-3 py-2 bg-muted/30 rounded-r"
                      >
                        <span className="font-bold text-primary">{pitch.industry}</span>
                        <span className="text-muted-foreground mx-1">·</span>
                        {pitch.text}
                      </div>
                    ))}
                  </li>
                );
              })()}
            </ul>
          </section>

            {/* 3. Kompetenser – max 8 primära, övriga taggar används bara för matchning/sök */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Kompetenser
              </h2>

              {(() => {
                const allApps = getAllProductCompetencies(partner);
                const extraTags = ((partner as unknown as { ai_tags?: string[] }).ai_tags || [])
                  .filter((t) => t && !allApps.includes(t));
                const shown = Array.from(new Set([...allApps, ...extraTags])).slice(0, 8);
                if (shown.length === 0) return null;
                return (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {shown.map((app) => (
                        <Badge key={app} className="bg-primary text-primary-foreground border-0 py-1.5 px-3 text-sm inline-flex items-center gap-1.5">
                          {appIconSrc[app] && (
                            <img src={appIconSrc[app]} alt="" aria-hidden="true" className="w-4 h-4" />
                          )}
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })()}



              {data.industryApps.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2 flex items-center gap-2">
                    <Package className="w-3.5 h-3.5" /> Branschapplikationer (Microsoft Marketplace)
                  </p>
                  <ul className="space-y-2">
                    {data.industryApps.map((app, idx) => (
                      <li key={idx}>
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start gap-3 p-2.5 rounded border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground group-hover:text-primary">
                                {app.name}
                              </span>
                              <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </div>
                            {app.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{app.description}</p>
                            )}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Customer cases */}
            {data.customerCaseLinks.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Kundcase</h2>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {data.customerCaseLinks.map((url, idx) => (
                    <li key={idx}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Läs kundcase {data.customerCaseLinks.length > 1 ? idx + 1 : ""}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Geografi redovisas i Partnerfakta – ingen dubblering här */}

            {/* Kontor */}
            {(() => {
              const cities = (partner as any)?.office_cities as string[] | undefined;
              return cities && cities.length > 0 ? (
                <section>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Kontor
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((city) => (
                      <span
                        key={city}
                        className="inline-flex items-center px-3 py-1.5 rounded bg-white border border-slate-200 text-sm font-semibold text-slate-700"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null;
            })()}

            {/* AI, Copilot & automation – partnerns dokumenterade AI-kompetens */}
            {(partner as any).ai_profile && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  AI, Copilot &amp; automation
                </h2>
                <AiProfilePublic profile={(partner as any).ai_profile} />
              </section>
            )}


            {/* Partner news */}
            <PartnerProfileNewsSection
              partnerId={partner.id}
              partnerName={partner.name}
              partnerSlug={partner.slug}
              partnerLogoUrl={partner.logo_url ?? null}
              variant="inline"
            />

            {/* 7. CTA */}
            <section className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/40 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Ta första dialogen med {partner.name}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-5 max-w-[60ch]">
                Vi förmedlar din förfrågan direkt till {partner.name} – kostnadsfritt och utan
                förpliktelser. Du behåller alltid kontrollen över processen.
              </p>

              {data.contact && (data.contact.name || data.contact.email || data.contact.phone) && (
                <div className="mb-5 p-4 rounded-lg bg-background border border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Kontaktperson för {tabMeta.label}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {data.contact.name && (
                      <span className="text-sm font-semibold text-foreground">{data.contact.name}</span>
                    )}
                    {data.contact.email && (
                      <a
                        href={`mailto:${data.contact.email}`}
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {data.contact.email}
                      </a>
                    )}
                    {data.contact.phone && (
                      <a
                        href={`tel:${data.contact.phone.replace(/[\s\-()]/g, "")}`}
                        className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-foreground"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {formatSwedishPhone(data.contact.phone)}
                      </a>
                    )}
                  </div>
                </div>
              )}

              <LeadCTA
                sourcePage={`partner-profile-${partner.slug}-${active}`}
                partnerName={partner.name}
                partnerSlug={partner.slug}
                selectedProduct={tabMeta.label}
                selectedIndustry={selectedIndustry || partner.industries[0]}
                variant="inline"
              />

              {data.landingPageUrl && (
                <div className="mt-4">
                  <a
                    href={data.landingPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackPartnerClick(
                        partner.name,
                        data.landingPageUrl!,
                        `partner-profile-${partner.slug}-landing-${active}`,
                        { product: tabMeta.label, industry: selectedIndustry },
                      )
                    }
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Läs mer om {tabMeta.label} på {swedishPossessive(partner.name)} hemsida
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </section>

            {/* Switch other areas */}
            {availableTabs.length > 1 && (
              <section className="border-t border-border pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-3">
                  Se {partner.name} inom andra områden
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableTabs
                    .filter((k) => k !== active)
                    .map((k) => (
                      <button
                        key={k}
                        onClick={() => setActive(k)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"
                      >
                        <img src={TAB_META[k].icon} alt="" aria-hidden="true" className="w-4 h-4" />
                        {TAB_META[k].label}
                      </button>
                    ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function resolveInitialTab(
  productFromPath: string | null,
  selectedProduct: string | undefined,
): TabKey {
  const src = (productFromPath || selectedProduct || "").toLowerCase();
  if (src.includes("business central") || src === "bc") return "bc";
  if (src.includes("finance") || src.includes("supply") || src === "fsc" || src === "f&scm") return "fsc";
  if (
    src.includes("crm") ||
    src.includes("customer engagement") ||
    src.includes("sales") ||
    src.includes("marketing") ||
    src.includes("customer insights") ||
    src.includes("customer service") ||
    src.includes("field service") ||
    src.includes("contact center")
  )
    return "crm";
  return "bc";
}
