import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Table2,
  ArrowLeftRight,
  ExternalLink,
  X,
  Info,
  ChevronDown,
} from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { usePartners, DatabasePartner } from "@/hooks/usePartners";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";


const TEAM_SIZE_HELP =

  "Många partners förstärker leveransteamet med kollegor från nordiska/europeiska kontor. Fråga partnern hur många som faktiskt arbetar med er valda applikation och bransch — det är mer relevant än totalsiffran i Sverige.";

type DeliveryProfile = {
  roles?: string[];
  typical_length?: string;
  engagement_model?: string;
  methodology?: string;
  bc_project_weeks_min?: number | null;
  bc_project_weeks_max?: number | null;
  bc_project_cost_band?: string | null;
};

const COST_BAND_LABELS: Record<string, string> = {
  "<250k": "< 250 000 kr",
  "250k–500k": "250 000 – 500 000 kr",
  "500k–1M": "500 000 kr – 1 MSEK",
  "1M–2.5M": "1 – 2,5 MSEK",
  "2.5M–5M": "2,5 – 5 MSEK",
  "5M–10M": "5 – 10 MSEK",
  ">10M": "> 10 MSEK",
};

const formatBcLength = (dp?: DeliveryProfile | null): string => {
  if (!dp) return "";
  const min = typeof dp.bc_project_weeks_min === "number" ? dp.bc_project_weeks_min : null;
  const max = typeof dp.bc_project_weeks_max === "number" ? dp.bc_project_weeks_max : null;
  if (min != null && max != null) return `${min}–${max} veckor`;
  if (min != null) return `Från ${min} veckor`;
  if (max != null) return `Upp till ${max} veckor`;
  return "";
};

const formatBcCost = (dp?: DeliveryProfile | null): string => {
  const band = dp?.bc_project_cost_band;
  if (!band) return "";
  return COST_BAND_LABELS[band] || band;
};

const EMPTY = <span className="text-slate-400 italic">—</span>;

const cleanList = (arr?: string[] | null): string[] =>
  (arr || []).map((s) => (s || "").trim()).filter(Boolean);

interface ColProps {
  partner: DatabasePartner | undefined;
  partners: DatabasePartner[];
  slug: string;
  onChange: (slug: string) => void;
  onClear: () => void;
  label: string;
}

const PartnerColumnHeader = ({ partner, partners, slug, onChange, onClear, label }: ColProps) => (
  <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
      {label}
    </div>
    <Select value={slug || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-10">
        <SelectValue placeholder="Välj partner…" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {partners.map((p) => (
          <SelectItem key={p.slug} value={p.slug}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {partner && (
      <div className="mt-3 flex items-center justify-between gap-2">
        <Link
          to={`/partner/${partner.slug}`}
          className="text-sm font-semibold text-foreground hover:underline truncate flex items-center gap-1 min-w-0"
        >
          <span className="truncate">{partner.name}</span>
          <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
        </Link>
        <button
          onClick={onClear}
          className="text-slate-400 hover:text-slate-700 shrink-0"
          aria-label="Rensa val"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
);

const Cell = ({ children, mobileLabel }: { children: React.ReactNode; mobileLabel?: string }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4 text-sm text-slate-800 min-h-[56px] sm:min-h-[64px]">
    {mobileLabel && (
      <div className="md:hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
        {mobileLabel}
      </div>
    )}
    {children}
  </div>
);

const SectionTitle = ({
  icon: Icon,
  title,
  tone = "default",
}: {
  icon: any;
  title: string;
  tone?: "default" | "warn";
}) => (
  <div
    className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
      tone === "warn" ? "text-amber-700" : "text-slate-500"
    }`}
  >
    <Icon
      className={`w-4 h-4 ${
        tone === "warn" ? "" : "text-[hsl(var(--cta-orange))]"
      }`}
    />
    {title}
  </div>
);

const Row = ({
  label,
  a,
  b,
  warn = false,
  aName,
  bName,
  help,
}: {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
  warn?: boolean;
  aName?: string;
  bName?: string;
  help?: string;
}) => (
  <div className="md:grid md:grid-cols-[180px_1fr_1fr] md:gap-3 md:items-stretch">
    <div
      className={`text-xs font-semibold uppercase tracking-wider ${
        warn ? "text-amber-700" : "text-slate-500"
      } mb-2 md:mb-0 md:pt-4 md:normal-case md:font-medium md:tracking-normal flex items-center gap-1.5`}
    >
      {label}
      {help && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label={`Vad betyder ${label}?`} className="text-slate-400 hover:text-slate-600">
                <Info className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
              {help}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:contents">
      <Cell mobileLabel={aName || "Partner A"}>{a}</Cell>
      <Cell mobileLabel={bName || "Partner B"}>{b}</Cell>
    </div>
  </div>
);

const renderValue = (v: string | null | undefined) =>
  v && v.trim() ? <span>{v}</span> : EMPTY;

const renderList = (items: string[]) =>
  items.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {items.map((r, i) => (
        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
          {r}
        </span>
      ))}
    </div>
  ) : (
    EMPTY
  );

const renderNotAFit = (items: string[]) =>
  items.length > 0 ? (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  ) : (
    EMPTY
  );

const splitIntoParagraphs = (text: string): string[] => {
  return text
    .split(/\n+/)
    .flatMap((block) => {
      const sentences = block.match(/[^.!?]+[.!?]+(\s|$)/g) || [block];
      const paras: string[] = [];
      for (let i = 0; i < sentences.length; i += 2) {
        paras.push(sentences.slice(i, i + 2).join("").trim());
      }
      return paras.filter(Boolean);
    });
};

const renderPositioningCell = (
  positioning: string,
  productDescriptions: { app: string; text: string }[]
) => {
  if (!positioning && productDescriptions.length === 0) return EMPTY;
  return (
    <div className="space-y-4">
      {positioning && (
        <p className="font-medium leading-relaxed text-slate-900">{positioning}</p>
      )}
      {productDescriptions.map((pd, idx) => (
        <div
          key={idx}
          className={`space-y-2 ${
            positioning || idx > 0 ? "pt-3 border-t border-slate-200" : ""
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {pd.app}
          </p>
          <div className="space-y-2 text-[14px] leading-[1.7] text-slate-700">
            {splitIntoParagraphs(pd.text).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ComparePartners = () => {
  const [params, setParams] = useSearchParams();
  const aSlug = params.get("a") || "";
  const bSlug = params.get("b") || "";

  const { data: partners = [], isLoading } = usePartners();

  const sortedPartners = useMemo(
    () => [...partners].sort((x, y) => x.name.localeCompare(y.name, "sv")),
    [partners]
  );

  const a = partners.find((p) => p.slug === aSlug);
  const b = partners.find((p) => p.slug === bSlug);

  const setSlot = (key: "a" | "b", slug: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set(key, slug);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const swap = () => {
    const next = new URLSearchParams(params);
    if (aSlug) next.set("b", aSlug);
    else next.delete("b");
    if (bSlug) next.set("a", bSlug);
    else next.delete("a");
    setParams(next, { replace: true });
  };

  const ERP_APPS = new Set([
    "Business Central",
    "Finance",
    "Supply Chain Management",
    "Finance & Supply Chain Management",
    "Commerce",
    "Human Resources",
    "Project Operations",
  ]);

  const sortApps = (apps: string[]): string[] => {
    const uniq = Array.from(new Set(apps.map((a) => (a || "").trim()).filter(Boolean)));
    const erp = uniq.filter((a) => ERP_APPS.has(a)).sort((a, b) => a.localeCompare(b, "sv"));
    const ce = uniq.filter((a) => !ERP_APPS.has(a)).sort((a, b) => a.localeCompare(b, "sv"));
    return [...erp, ...ce];
  };

  const APP_TO_PF_KEY = (app: string): "bc" | "fsc" | "crm" | null => {
    const a = app.trim();
    if (a === "Business Central") return "bc";
    if (
      a === "Finance" ||
      a === "Supply Chain Management" ||
      a === "Finance & Supply Chain Management"
    )
      return "fsc";
    if (
      a === "Sales" ||
      a === "Customer Service" ||
      a === "Field Service" ||
      a === "Contact Center" ||
      a === "Customer Insights (Marketing)" ||
      a === "Marketing"
    )
      return "crm";
    return null;
  };

  const getProductDescriptions = (
    p: DatabasePartner | undefined,
    apps: string[]
  ): { app: string; text: string }[] => {
    const pf = (p as any)?.product_filters as
      | Record<string, { productDescription?: string }>
      | undefined;
    if (!pf) return [];
    const seen = new Set<string>();
    const out: { app: string; text: string }[] = [];
    for (const app of apps) {
      const key = APP_TO_PF_KEY(app);
      if (!key || seen.has(key)) continue;
      const text = pf[key]?.productDescription?.trim();
      if (!text) continue;
      seen.add(key);
      const label =
        key === "bc"
          ? "Business Central"
          : key === "fsc"
          ? "Finance & Supply Chain Management"
          : "Sales, Service & Marketing (CE/CRM)";
      out.push({ app: label, text });
    }
    return out;
  };

  const get = (p?: DatabasePartner) => {
    const dp = (p?.delivery_profile || {}) as DeliveryProfile;
    const officeCities = cleanList(p?.office_cities).sort((a, b) => a.localeCompare(b, "sv"));
    const perApp = Object.entries(((p as any)?.implementations_per_app || {}) as Record<string, string>)
      .filter(([, v]) => typeof v === "string" && v.trim())
      .map(([app, count]) => ({ app, count: (count as string).trim() }));
    const industryAppsRaw = (p?.industry_apps || []).map((ia) => ({
      name: (ia.name || "").trim(),
      application: (ia.application || "").trim(),
      industry: (ia.industry || "").trim(),
      url: (ia.url || "").trim(),
    })).filter((ia) => ia.name);
    const allIndustries = Array.from(
      new Set(
        [
          ...(p?.industries || []),
          ...(p?.secondary_industries || []),
          ...industryAppsRaw.map((ia) => ia.industry),
        ]
          .map((s) => (s || "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, "sv"));
    const industryApps = industryAppsRaw;
    return {
      partner: p,
      positioning: p?.positioning_statement?.trim() || "",
      apps: sortApps(p?.applications || []),
      industries: allIndustries,
      industryApps,
      roles: cleanList(dp.roles),
      length: dp.typical_length?.trim() || "",
      bcLength: formatBcLength(dp),
      engagement: dp.engagement_model?.trim() || "",
      methodology: dp.methodology?.trim() || "",
      teamSize: p?.team_size_sweden?.trim() || "",
      implementations: p?.implementations_done?.trim() || "",
      implementationsPerApp: perApp,
      offices: officeCities,
      agreement: p ? (p.agreement_signed ? "Ja" : "Nej") : "",

      notAFit: cleanList(p?.not_a_fit),
    };
  };

  const industryFilter = params.get("industry") || "";
  const productFilterRaw = params.get("product") || "";
  const productFilters = productFilterRaw
    ? productFilterRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const setFilter = (key: "industry" | "product", val: string) => {
    const next = new URLSearchParams(params);
    if (val && val !== "__all__") next.set(key, val);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const toggleProductFilter = (opt: string) => {
    const set = new Set(productFilters);
    if (set.has(opt)) set.delete(opt);
    else set.add(opt);
    const next = new URLSearchParams(params);
    if (set.size > 0) next.set("product", Array.from(set).join(","));
    else next.delete("product");
    setParams(next, { replace: true });
  };

  const A = get(a);
  const B = get(b);
  const hasBoth = !!a && !!b;
  const aName = a?.name;
  const bName = b?.name;

  const partnerIndustries = Array.from(new Set([...A.industries, ...B.industries]));
  const industryOptions = (
    partnerIndustries.length > 0
      ? partnerIndustries
      : STANDARD_INDUSTRIES.map((i) => i.name)
  ).sort((x, y) => x.localeCompare(y, "sv"));
  const productOptions = sortApps([...A.apps, ...B.apps]);

  const productActive = productFilters.length > 0;
  const matchesProduct = (app: string) => !productActive || productFilters.includes(app);

  const applyFilters = (data: ReturnType<typeof get>) => ({
    ...data,
    apps: productActive ? data.apps.filter(matchesProduct) : data.apps,
    industries: industryFilter ? data.industries.filter((x) => x === industryFilter) : data.industries,
    industryApps: data.industryApps.filter(
      (ia) =>
        matchesProduct(ia.application) &&
        (!industryFilter || ia.industry === industryFilter)
    ),
  });

  const AF = applyFilters(A);
  const BF = applyFilters(B);


  const R = (props: { label: string; a: React.ReactNode; b: React.ReactNode; warn?: boolean; help?: string }) => (
    <Row {...props} aName={aName} bName={bName} />
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Jämför Dynamics 365-partner sida vid sida | d365.se"
        description="Jämför två Microsoft Dynamics 365-partner mot samma beslutsprofil: positionering, leveransbild, fakta och 'när passar vi inte'."
        canonicalPath="/jamfor-partners"
        noIndex
      />
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <header className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Jämförelsevy
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                Jämför två partner sida vid sida
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
                Samma rader för båda partner — positionering, snabbfakta,
                kompetens inom Dynamics 365, branscher och kontor. Underlag för
                beslut, inte rangordning.
              </p>
            </header>

            {isLoading ? (
              <div className="text-center text-muted-foreground py-10">Laddar partner…</div>
            ) : (
              <>
                {/* Picker row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[180px_1fr_1fr] gap-3 mb-4">
                  <div className="order-last md:order-first flex md:items-end md:pb-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={swap}
                      disabled={!hasBoth}
                      className="h-9 w-full"
                    >
                      <ArrowLeftRight className="w-4 h-4 mr-1.5" />
                      Byt plats
                    </Button>
                  </div>
                  <PartnerColumnHeader
                    label="Partner A"
                    partner={a}
                    partners={sortedPartners}
                    slug={aSlug}
                    onChange={(s) => setSlot("a", s)}
                    onClear={() => setSlot("a", "")}
                  />
                  <PartnerColumnHeader
                    label="Partner B"
                    partner={b}
                    partners={sortedPartners}
                    slug={bSlug}
                    onChange={(s) => setSlot("b", s)}
                    onClear={() => setSlot("b", "")}
                  />
                </div>

                {!hasBoth && (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 mb-6">
                    Välj två partner ovan för att se jämförelsen.
                  </div>
                )}

                {hasBoth && (productOptions.length > 0 || industryOptions.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Filtrera produkt
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                          >
                            <span className="truncate text-left">
                              {productFilters.length === 0
                                ? "Alla produkter"
                                : productFilters.length === 1
                                ? productFilters[0]
                                : `${productFilters.length} valda`}
                            </span>
                            <ChevronDown className="w-4 h-4 opacity-50 shrink-0 ml-2" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[260px] p-2 max-h-80 overflow-auto">
                          {productFilters.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setFilter("product", "")}
                              className="w-full text-left text-xs text-slate-500 hover:text-slate-800 underline px-2 py-1 mb-1"
                            >
                              Rensa val
                            </button>
                          )}
                          <div className="space-y-1">
                            {productOptions.map((opt) => {
                              const checked = productFilters.includes(opt);
                              return (
                                <label
                                  key={opt}
                                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer text-sm"
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={() => toggleProductFilter(opt)}
                                  />
                                  <span className="flex-1">{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Filtrera bransch
                      </label>
                      <Select
                        value={industryFilter || "__all__"}
                        onValueChange={(v) => setFilter("industry", v)}
                      >
                        <SelectTrigger className="h-9 bg-white">
                          <SelectValue placeholder="Alla branscher" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          <SelectItem value="__all__">Alla branscher</SelectItem>
                          {industryOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {(productActive || industryFilter) && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = new URLSearchParams(params);
                          next.delete("product");
                          next.delete("industry");
                          setParams(next, { replace: true });
                        }}
                        className="sm:col-span-2 text-xs text-slate-500 hover:text-slate-800 underline self-start"
                      >
                        Rensa filter
                      </button>
                    )}
                  </div>
                )}

                {hasBoth && (
                  <div className="space-y-8">
                    {/* Positionering */}
                    <section className="space-y-3">
                      <SectionTitle icon={Target} title="Positionering" />
                      <R
                        label="Vi är valet när…"
                        a={renderPositioningCell(A.positioning, getProductDescriptions(a, AF.apps))}
                        b={renderPositioningCell(B.positioning, getProductDescriptions(b, BF.apps))}
                      />
                      <R
                        label="Kompetens inom Dynamics 365"
                        help="Alla Dynamics 365-applikationer partnern arbetar med. ERP-appar listas först, därefter CE/CRM — båda i bokstavsordning."
                        a={renderList(AF.apps)}
                        b={renderList(BF.apps)}
                      />
                      <R
                        label="Branscher"
                        a={renderList(AF.industries)}
                        b={renderList(BF.industries)}
                      />
                      <R
                        label="Branschapplikationer"
                        help="Branschlösningar / vertikala tillägg som partnern erbjuder ovanpå Dynamics 365."
                        a={
                          AF.industryApps.length > 0 ? (
                            <ul className="space-y-1.5">
                              {AF.industryApps.map((ia, i) => (
                                <li key={i} className="text-sm">
                                  <span className="font-medium">{ia.name}</span>
                                  {(ia.application || ia.industry) && (
                                    <span className="text-slate-500">
                                      {" — "}
                                      {[ia.application, ia.industry].filter(Boolean).join(" · ")}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            EMPTY
                          )
                        }
                        b={
                          BF.industryApps.length > 0 ? (
                            <ul className="space-y-1.5">
                              {BF.industryApps.map((ia, i) => (
                                <li key={i} className="text-sm">
                                  <span className="font-medium">{ia.name}</span>
                                  {(ia.application || ia.industry) && (
                                    <span className="text-slate-500">
                                      {" — "}
                                      {[ia.application, ia.industry].filter(Boolean).join(" · ")}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            EMPTY
                          )
                        }
                      />
                    </section>


                    {/* Snabbfakta */}
                    <section className="space-y-3">
                      <SectionTitle icon={Table2} title="Snabbfakta" />
                      <R
                        label="Lokal teamstorlek (Sverige)"
                        help={TEAM_SIZE_HELP}
                        a={renderValue(A.teamSize)}
                        b={renderValue(B.teamSize)}
                      />
                      <R
                        label="Genomförda implementationer"
                        help="Antal genomförda D365-implementationer per applikation. Säger något om volym, inte om kvalitet eller branschpassning — be alltid om referenser i den bransch ni befinner er i."
                        a={
                          A.implementationsPerApp.length > 0
                            ? renderList(A.implementationsPerApp.map((i) => `${i.app}: ${i.count}`))
                            : renderValue(A.implementations)
                        }
                        b={
                          B.implementationsPerApp.length > 0
                            ? renderList(B.implementationsPerApp.map((i) => `${i.app}: ${i.count}`))
                            : renderValue(B.implementations)
                        }
                      />
                      <R
                        label="Typisk BC-projektlängd"
                        help="Partnerns egna spann för typisk implementationstid av Business Central, mätt i veckor från projektstart till driftsättning. Verklig längd beror på scope, datakvalitet och organisationens beslutskraft."
                        a={renderValue(A.bcLength)}
                        b={renderValue(B.bcLength)}
                      />
                      <R
                        label="Geografisk närvaro"
                        a={renderList(A.offices)}
                        b={renderList(B.offices)}
                      />
                    </section>




                    <p className="text-xs text-slate-500 text-center pt-4">
                      Innehåll i beslutsprofilen är skrivet av partnern själv. d365.se redigerar inte.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComparePartners;
