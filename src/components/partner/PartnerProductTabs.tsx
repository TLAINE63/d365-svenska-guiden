import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Users,
  Briefcase,
  Mail,
  Phone,
  User,
  Sparkles,
  Package,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import type { DatabasePartner } from "@/hooks/usePartners";
import LeadCTA from "@/components/LeadCTA";
import { buildPartnerProductPath } from "@/lib/partnerProductSlug";
import { trackPartnerClick } from "@/utils/trackPartnerClick";

import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";

export type TabKey = "bc" | "fsc" | "crm";

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
}

const GEO_ORDER = ["Sverige", "Norden", "Europa", "Övriga världen"];

function mergeArrays<T>(...arrs: (T[] | undefined | null)[]): T[] {
  const set = new Set<T>();
  arrs.forEach((a) => (a || []).forEach((v) => set.add(v)));
  return Array.from(set);
}

function normalizeGeo(geo: string[]): string[] {
  const normalized = geo.map((g) => (g === "Internationellt" ? "Övriga världen" : g));
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
  apps: string[];
  industryApps: Array<{ name: string; url: string; application: string; industry: string; description: string }>;
  contact: { name?: string; email?: string; phone?: string } | null;
  landingPageUrl: string | null;
}


function buildTabData(partner: DatabasePartner, tab: TabKey): TabData {
  const pf = (partner.product_filters || {}) as Record<string, any>;
  const keys = TAB_META[tab].filterKeys;

  const industries = mergeArrays<string>(
    ...keys.map((k) => pf[k]?.industries),
  );
  const fallbackIndustries = industries.length > 0 ? industries : (partner.industries || []).slice(0, 5);

  const companySize = mergeArrays<string>(...keys.map((k) => pf[k]?.companySize));
  const revenue = mergeArrays<string>(...keys.map((k) => pf[k]?.revenue));

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

  // Product description — first non-empty
  let productDescription: TabData["productDescription"] = null;
  for (const k of keys) {
    const txt = pf[k]?.productDescription?.trim();
    if (txt) {
      productDescription = { text: txt, aiGenerated: !!pf[k]?.productDescriptionAiGenerated };
      break;
    }
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
    const u = pf[k]?.landingPageUrl;
    if (u && u.trim()) {
      landingPageUrl = u.trim();
      break;
    }
  }

  // AI badge — take strongest level across keys
  let aiBadge: TabData["aiBadge"] = null;
  let best = -1;
  for (const k of keys) {
    const caps = pf[k]?.aiCapabilities;
    if (!caps || caps.length === 0) continue;
    const score = calculateProductAiScore(caps, pf[k]?.aiProjectCount, k as any);
    const lvl = getAiLevel(score);
    if (lvl.level === "none") continue;
    const rank = { enabled: 1, integration: 2, advanced: 3, transformation: 4 }[lvl.level] || 0;
    if (rank > best) {
      best = rank;
      const descriptions: Record<string, string> = {
        enabled: "Aktiverar och implementerar Microsofts inbyggda AI",
        integration: "Bygger anpassade AI-agenter och processer",
        advanced: "Utvecklar kundunika AI-lösningar och prediktiva modeller",
        transformation: "Levererar avancerade Azure AI-arkitekturer",
      };
      aiBadge = { label: lvl.label, emoji: lvl.emoji, color: lvl.color, description: descriptions[lvl.level] };
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
    apps,
    industryApps,
    contact,
    landingPageUrl,
    aiBadge,
  };
}

export default function PartnerProductTabs({
  partner,
  initialTab,
  selectedIndustry,
  selectedCompanySize,
  selectedGeography,
  selectedRevenue,
  onActiveTabChange,
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
          <p className="text-xs sm:text-sm text-muted-foreground pt-3 pb-2 text-center">
            Denna partner arbetar med flera Dynamics 365-lösningar. Välj område för att se rätt profil.
          </p>
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
                      ? "bg-foreground text-background border-foreground shadow"
                      : "bg-card text-foreground/70 border-border hover:border-foreground/40 hover:text-foreground"
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
            {/* Filter context */}
            {filterBadges.length > 0 && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Ni tittar på: {tabMeta.label}
                </p>
                <p className="text-sm text-foreground/80">
                  Denna partner matchar er profil baserat på:
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selectedIndustry && (
                    <li>
                      <Badge variant="secondary" className="font-medium">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        Bransch: {selectedIndustry}
                      </Badge>
                    </li>
                  )}
                  <li>
                    <Badge variant="secondary" className="font-medium">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      Lösning: {tabMeta.label}
                    </Badge>
                  </li>
                  {selectedCompanySize && (
                    <li>
                      <Badge variant="secondary" className="font-medium">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        Storlek: {selectedCompanySize} anställda
                      </Badge>
                    </li>
                  )}
                  {selectedGeography && (
                    <li>
                      <Badge variant="secondary" className="font-medium">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        Geografi: {selectedGeography}
                      </Badge>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* 1. Varför välja */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
                Varför välja {partner.name} för {tabMeta.label}?
              </h2>
              {partner.positioning_statement ? (
                <p className="text-base text-muted-foreground mb-5 max-w-[68ch] leading-relaxed">
                  {partner.positioning_statement}
                </p>
              ) : null}

              <ul className="space-y-3">
                {data.industries.length > 0 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-foreground">
                      Stark inom <strong>{data.industries.slice(0, 3).join(", ")}</strong>
                    </span>
                  </li>
                )}
                {data.apps.length > 0 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-foreground">
                      Djup kompetens inom <strong>{data.apps.join(", ")}</strong>
                    </span>
                  </li>
                )}
                {data.geography.length > 0 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-foreground">
                      Levererar i <strong>{data.geography.join(", ")}</strong>
                    </span>
                  </li>
                )}
                {data.aiBadge && (
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[hsl(var(--cta-orange))] mt-0.5 shrink-0" />
                    <span className="text-foreground">
                      AI-nivå: <strong>{data.aiBadge.label}</strong> – {data.aiBadge.description}
                    </span>
                  </li>
                )}
              </ul>

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

            {/* 2. Passar bäst för */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Passar bäst för
              </h2>
              <ul className="space-y-2.5">
                {data.companySize.length > 0 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                    <span className="text-foreground">
                      Företag med <strong>{data.companySize.join(", ")}</strong> anställda
                    </span>
                  </li>
                )}
                {data.revenue.length > 0 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                    <span className="text-foreground">
                      Omsättning: <strong>{data.revenue.join(", ")}</strong>
                    </span>
                  </li>
                )}

                {data.industries.length > 0 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                    <span className="text-foreground">
                      Organisationer inom <strong>{data.industries.slice(0, 3).join(", ")}</strong>
                    </span>
                  </li>
                )}
                {data.customerExamples.length > 0 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                    <span className="text-foreground">
                      Referenser bl.a.: <strong>{data.customerExamples.slice(0, 4).join(", ")}</strong>
                    </span>
                  </li>
                )}
              </ul>
            </section>

            {/* 3. Passar mindre bra för */}
            {partner.not_a_fit && partner.not_a_fit.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                  När passar {partner.name} mindre bra?
                </h2>
                <ul className="space-y-2.5">
                  {partner.not_a_fit.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground italic">
                  Att tydligt visa när en partner inte passar är en del av vår köparsidiga rådgivning.
                </p>
              </section>
            )}

            {/* 4. Kompetenser */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Kompetenser
              </h2>

              {data.apps.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">
                    Primära applikationer
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.apps.map((app) => (
                      <Badge key={app} className="bg-primary text-primary-foreground border-0 py-1.5 px-3 text-sm">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.aiBadge && (
                <div className="mb-4">
                  <Badge variant="outline" className={`text-sm font-semibold ${data.aiBadge.color} border-2`}>
                    <Award className="w-4 h-4 mr-1.5" />
                    {data.aiBadge.emoji} {data.aiBadge.label}
                  </Badge>
                </div>
              )}

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

            {/* 5. Branschfokus */}
            {data.industries.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Branschfokus</h2>
                <div className="flex flex-wrap gap-2">
                  {data.industries.slice(0, 5).map((ind) => (
                    <Badge key={ind} variant="outline" className="bg-card border-border py-1.5 px-3 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                      {ind}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Geografi */}
            {data.geography.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Geografi
                </h2>
                <ul className="space-y-2">
                  {data.geography.map((geo) => (
                    <li key={geo} className="flex items-center gap-2 text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {geo}
                    </li>
                  ))}
                </ul>
              </section>
            )}

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

            {/* 7. CTA */}
            <section className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/40 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Kontakta {partner.name} om {tabMeta.label}
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
                        href={`tel:${data.contact.phone}`}
                        className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-foreground"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {data.contact.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              <LeadCTA
                sourcePage={`partner-profile-${partner.slug}-${active}`}
                partnerName={partner.name}
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
                    Läs mer om {tabMeta.label} på {partner.name}s hemsida
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
