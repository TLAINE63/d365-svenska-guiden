import { useEffect, useMemo, useState } from "react";
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
  Sparkles,
  Globe2,
  Mail,
} from "lucide-react";


import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import PartnerRequestDialog from "@/components/PartnerRequestDialog";
import { usePartners, DatabasePartner } from "@/hooks/usePartners";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import {
  AiProfile,
  labelForDelivery,
  labelForCapability,
  labelForArea,
  labelForUseCase,
  labelForExperience,
  labelForProjectCount,
  labelForEvidence,
  isAiProfileEmpty,
} from "@/lib/aiProfile";

import bcIcon from "@/assets/icons/BusinessCentral-new.webp";
import financeIcon from "@/assets/icons/Finance.svg";
import scmIcon from "@/assets/icons/SupplyChain.svg";
import salesIcon from "@/assets/icons/Sales.svg";
import marketingIcon from "@/assets/icons/Marketing.svg";
import csIcon from "@/assets/icons/CustomerService.svg";
import fsIcon from "@/assets/icons/FieldService.svg";
import ccIcon from "@/assets/icons/ContactCenter.svg";
import poIcon from "@/assets/icons/ProjectOperations.svg";
import hrIcon from "@/assets/icons/HumanResources.svg";
import commerceIcon from "@/assets/icons/Commerce.svg";

const APP_ICON_MAP: Record<string, string> = {
  "business central": bcIcon,
  "finance": financeIcon,
  "supply chain management": scmIcon,
  "finance & supply chain management": financeIcon,
  "sales": salesIcon,
  "customer insights (marketing)": marketingIcon,
  "customer insights": marketingIcon,
  "marketing": marketingIcon,
  "customer service": csIcon,
  "field service": fsIcon,
  "contact center": ccIcon,
  "project operations": poIcon,
  "human resources": hrIcon,
  "commerce": commerceIcon,
};

const getAppIcon = (name: string): string | null =>
  APP_ICON_MAP[name.trim().toLowerCase()] ?? null;

// Industry icons (same source set as /branscher)
import tillverkningImg from "@/assets/industries/tillverkning.webp";
import livsmedelsImg from "@/assets/industries/livsmedel.webp";
import handelDistributionImg from "@/assets/industries/handel-distribution.webp";
import detaljhandelImg from "@/assets/industries/detaljhandel.webp";
import modeSportTextilImg from "@/assets/industries/mode-sport-textil.webp";
import konsultforetagImg from "@/assets/industries/konsultforetag.webp";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.webp";
import fastigheterImg from "@/assets/industries/fastigheter.webp";
import energiImg from "@/assets/industries/energi.webp";
import finansForsakringImg from "@/assets/industries/finans-forsakring.webp";
import lakemedelImg from "@/assets/industries/lakemedel-life-science.webp";
import itTechImg from "@/assets/industries/it-tech.webp";
import transportLogistikImg from "@/assets/industries/transport-logistik.webp";
import mediaPublishingImg from "@/assets/industries/media-publishing.webp";
import jordbrukImg from "@/assets/industries/jordbruk-skogsbruk.webp";
import halsaImg from "@/assets/industries/halsa-sjukvard.webp";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.webp";
import utbildningImg from "@/assets/industries/utbildning.webp";
import offentligSektorImg from "@/assets/industries/offentlig-sektor.webp";
import uthyrningImg from "@/assets/industries/uthyrning.webp";

const INDUSTRY_IMAGE_BY_SLUG: Record<string, string> = {
  "tillverkning": tillverkningImg,
  "livsmedel-processindustri": livsmedelsImg,
  "grossist-distribution": handelDistributionImg,
  "retail-ehandel": detaljhandelImg,
  "mode-sport-textil": modeSportTextilImg,
  "konsulttjanster": konsultforetagImg,
  "bygg-entreprenad": byggEntreprenadImg,
  "fastighet-forvaltning": fastigheterImg,
  "energi-utilities": energiImg,
  "finans-forsakring": finansForsakringImg,
  "life-science-medtech": lakemedelImg,
  "telekom-it-tjanster": itTechImg,
  "logistik-transport": transportLogistikImg,
  "media-publishing": mediaPublishingImg,
  "jordbruk-skogsbruk": jordbrukImg,
  "halsa-sjukvard": halsaImg,
  "nonprofit-organisationer": medlemsorganisationerImg,
  "medlemsorganisationer": medlemsorganisationerImg,
  "utbildning": utbildningImg,
  "offentlig-sektor": offentligSektorImg,
  "uthyrning": uthyrningImg,
};

const getIndustryIcon = (name: string): string | null => {
  const match = STANDARD_INDUSTRIES.find(
    (i) => i.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
  return match ? INDUSTRY_IMAGE_BY_SLUG[match.slug] ?? null : null;
};



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
  onRequestQuote?: () => void;
  quoteSubmitting?: boolean;
}

const PartnerColumnHeader = ({ partner, partners, slug, onChange, onClear, label, onRequestQuote, quoteSubmitting }: ColProps) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    {partner ? (
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          {partner.logo_url ? (
            <img
              src={partner.logo_url}
              alt={`${partner.name} logotyp`}
              width="56"
              height="56"
              className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-100 p-1.5"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
              <span className="text-lg font-bold text-muted-foreground/60">{partner.name.slice(0, 2).toUpperCase()}</span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            {label}
          </div>
          <Link
            to={`/partner/${partner.slug}`}
            className="group flex items-center gap-1 text-lg sm:text-xl font-bold text-foreground hover:text-[hsl(var(--cta-orange))] transition-colors"
          >
            <span className="truncate">{partner.name}</span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
          </Link>
        </div>
        <button
          onClick={onClear}
          className="mt-0.5 text-slate-400 hover:text-slate-700 shrink-0"
          aria-label="Rensa val"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ) : (
      <div className="space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </div>
        <div className="h-14 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-500">
          Välj partner nedan
        </div>
      </div>
    )}

    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
      <Select value={slug || undefined} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-sm bg-slate-50 border-slate-200 hover:border-slate-300">
          {slug ? (
            <span className="text-slate-600 flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Byt partner
            </span>
          ) : (
            <SelectValue placeholder="Välj partner…" />
          )}
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {partners.map((p) => (
            <SelectItem key={p.slug} value={p.slug}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {partner && onRequestQuote && (
        <Button
          type="button"
          size="sm"
          onClick={onRequestQuote}
          disabled={quoteSubmitting}
          aria-busy={quoteSubmitting}
          className="w-full h-9 bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Mail className="w-4 h-4 mr-1.5" />
          {quoteSubmitting ? "Skickar…" : "Ställ en fråga"}
        </Button>
      )}
    </div>
  </div>
);


const Cell = ({ children, mobileLabel }: { children: React.ReactNode; mobileLabel?: string }) => (
  <div className="p-3 sm:p-4 text-sm text-[hsl(var(--foreground))] min-h-[56px] sm:min-h-[64px]">
    {mobileLabel && (
      <div className="md:hidden text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
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
      tone === "warn" ? "text-[hsl(var(--warning))]" : "text-[hsl(var(--muted-foreground))]"
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
  <div className="rounded border border-[hsl(var(--border))] overflow-hidden bg-[hsl(var(--card))]">
    <div
      className={`px-4 py-2.5 border-l-4 ${
        warn
          ? "bg-[hsl(var(--warning))] border-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]"
          : "bg-[hsl(var(--card-dark))] border-[hsl(var(--cta-orange))] text-[hsl(var(--primary-foreground))]"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
        {help && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-label={`Vad betyder ${label}?`} className="opacity-70 hover:opacity-100">
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
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div className="border-r border-[hsl(var(--border))]">
        <Cell mobileLabel={aName || "Partner A"}>{a}</Cell>
      </div>
      <div>
        <Cell mobileLabel={bName || "Partner B"}>{b}</Cell>
      </div>
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

const renderAppList = (items: string[]) =>
  items.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {items.map((r, i) => {
        const icon = getAppIcon(r);
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs"
          >
            {icon && (
              <img
                src={icon}
                alt=""
                aria-hidden="true"
                className="w-3.5 h-3.5 object-contain shrink-0"
                loading="lazy"
              />
            )}
            {r}
          </span>
        );
      })}
    </div>
  ) : (
    EMPTY
  );

const renderIndustryList = (items: string[]) =>
  items.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {items.map((r, i) => {
        const icon = getIndustryIcon(r);
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs"
          >
            {icon && (
              <img
                src={icon}
                alt=""
                aria-hidden="true"
                className="w-5 h-5 rounded object-cover shrink-0"
                loading="lazy"
              />
            )}
            {r}
          </span>
        );
      })}
    </div>
  ) : (
    EMPTY
  );

const renderAiProfile = (profile?: AiProfile | null) => {
  if (isAiProfileEmpty(profile)) return EMPTY;
  const p = profile!;
  const caps = (p.capabilities || []).map(labelForCapability).filter(Boolean);
  const areas = (p.relevant_areas || []).map(labelForArea).filter(Boolean);
  const cases = (p.use_cases || []).map(labelForUseCase).filter(Boolean);
  const evidence = (p.evidence_level || []).map(labelForEvidence).filter(Boolean);

  const chips = (items: string[], cls: string) => (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t, i) => (
        <span key={i} className={`px-2 py-0.5 rounded text-xs ${cls}`}>
          {t}
        </span>
      ))}
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="text-xs text-slate-700">{children}</div>
    </div>
  );

  return (
    <div className="space-y-3">
      {p.delivery_model && (
        <Field label="AI-leveransmodell">{labelForDelivery(p.delivery_model)}</Field>
      )}
      {caps.length > 0 && (
        <Field label="AI-förmågor">
          {chips(caps, "bg-violet-50 text-violet-700 border border-violet-200")}
        </Field>
      )}
      {areas.length > 0 && (
        <Field label="Relevant för">
          {chips(areas, "bg-slate-100 text-slate-700 border border-slate-200")}
        </Field>
      )}
      {cases.length > 0 && (
        <Field label="Typiska use cases">
          {chips(cases, "bg-slate-100 text-slate-700 border border-slate-200")}
        </Field>
      )}
      {p.experience_level && (
        <Field label="Erfarenhetsnivå">{labelForExperience(p.experience_level)}</Field>
      )}
      {p.project_count_range && (
        <Field label="AI-projekt (24 mån)">{labelForProjectCount(p.project_count_range)}</Field>
      )}
      {evidence.length > 0 && <Field label="Underlag">{evidence.join(" · ")}</Field>}
      {p.description && (
        <Field label="Kort beskrivning">
          <p className="leading-relaxed italic">"{p.description}"</p>
        </Field>
      )}
    </div>
  );
};

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

const renderPositioningCell = (positioning: string) => {
  if (!positioning) return EMPTY;
  return (
    <p className="font-medium leading-relaxed text-[hsl(var(--foreground))]">
      {positioning}
    </p>
  );
};

const renderProductDescCell = (text: string) => (
  <div className="space-y-2 text-sm leading-relaxed text-[hsl(var(--foreground))]">
    {splitIntoParagraphs(text).map((para, i) => (
      <p key={i}>{para}</p>
    ))}
  </div>
);

const renderPitchCell = (
  pitches: Array<{ industry: string; product: string | null; text: string }>
) => {
  if (pitches.length === 0) return EMPTY;
  return (
    <div className="space-y-3">
      {pitches.map((p, i) => (
        <div key={i} className="space-y-1">
          {p.product && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              {p.product}
            </p>
          )}
          <p className="text-sm leading-relaxed text-[hsl(var(--foreground))] whitespace-pre-line">
            {p.text}
          </p>
        </div>
      ))}
    </div>
  );
};

const ComparePartners = () => {
  const [params, setParams] = useSearchParams();
  const aSlug = params.get("a") || "";
  const bSlug = params.get("b") || "";
  const [quoteFor, setQuoteFor] = useState<{ recipients: Array<{ slug: string; name: string }>; mode: "contact" | "demo" | "quote" } | null>(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

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

  const PRODUCT_FILTER_GROUP = {
    bc: {
      label: "Business Central",
      apps: ["Business Central"],
    },
    fsc: {
      label: "Finance & Supply Chain Management",
      apps: ["Finance", "Supply Chain Management", "Finance & Supply Chain Management"],
    },
    sales: {
      label: "Sales & Customer Insights",
      apps: ["Sales", "Customer Insights (Marketing)", "Marketing"],
    },
    service: {
      label: "Customer Service / Field Service / Contact Center",
      apps: ["Customer Service", "Field Service", "Contact Center"],
    },
  } as const;
  type ProductFilterKey = keyof typeof PRODUCT_FILTER_GROUP;

  const appToGroupKey = (app: string): ProductFilterKey | null => {
    const a = app.trim();
    for (const [key, group] of Object.entries(PRODUCT_FILTER_GROUP) as [ProductFilterKey, (typeof PRODUCT_FILTER_GROUP)[ProductFilterKey]][]) {
      if ((group.apps as readonly string[]).includes(a)) return key;
    }
    return null;
  };

  const PRODUCT_FILTER_KEY_LABEL: Record<ProductFilterKey, string> = {
    bc: "Business Central",
    fsc: "Finance & Supply Chain Management",
    sales: "Sales & Customer Insights",
    service: "Customer Service / Field Service / Contact Center",
  };

  const getProductFilterKeysForApps = (apps: string[]): ProductFilterKey[] => {
    const keys = new Set<ProductFilterKey>();
    for (const app of apps) {
      const key = appToGroupKey(app);
      if (key) keys.add(key);
    }
    return Array.from(keys);
  };

  const getProductDescriptions = (
    p: DatabasePartner | undefined,
    apps: string[]
  ): { key: ProductFilterKey; label: string; text: string }[] => {
    const pf = (p as any)?.product_filters as
      | Record<string, { productDescription?: string }>
      | undefined;
    if (!pf) return [];
    const keys = getProductFilterKeysForApps(apps);
    const out: { key: ProductFilterKey; label: string; text: string }[] = [];
    for (const key of keys) {
      const text = pf[key]?.productDescription?.trim();
      if (!text) continue;
      out.push({ key, label: PRODUCT_FILTER_KEY_LABEL[key] || key, text });
    }
    return out;
  };

  const PRODUCT_KEY_LABEL: Record<ProductFilterKey, string> = {
    bc: "Business Central",
    fsc: "Finance & Supply Chain Management",
    sales: "Sales & Customer Insights",
    service: "Customer Service / Field Service / Contact Center",
  };

  const formatWeeksRange = (min: number | null, max: number | null): string => {
    if (min != null && max != null) return `${min}–${max} veckor`;
    if (min != null) return `Från ${min} veckor`;
    if (max != null) return `Upp till ${max} veckor`;
    return "";
  };

  const getProductMetrics = (
    p: DatabasePartner | undefined,
    key: ProductFilterKey,
  ): { length: string; cost: string } => {
    const pp = ((p as any)?.product_profiles || {}) as Record<string, any>;
    for (const app of PRODUCT_FILTER_GROUP[key].apps) {
      const raw = pp[app];
      if (raw && typeof raw === "object") {
        const length = formatWeeksRange(
          typeof raw.weeks_min === "number" ? raw.weeks_min : null,
          typeof raw.weeks_max === "number" ? raw.weeks_max : null,
        );
        const cost =
          typeof raw.cost_band === "string" && raw.cost_band
            ? COST_BAND_LABELS[raw.cost_band] || raw.cost_band
            : "";
        if (length || cost) return { length, cost };
      }
    }
    if (key === "bc") {
      const dp = (p?.delivery_profile || {}) as DeliveryProfile;
      return { length: formatBcLength(dp), cost: formatBcCost(dp) };
    }
    return { length: "", cost: "" };
  };

  type AiPerProduct = {
    productKey: string;
    productLabel: string;
    capabilities: string[];
    projectCount: string;
    caseDescription: string;
    businessImpact: string;
  };

  const getAiPerProduct = (p?: DatabasePartner): AiPerProduct[] => {
    const pf = (p as any)?.product_filters as Record<string, any> | undefined;
    if (!pf) return [];
    const out: AiPerProduct[] = [];
    for (const key of ["bc", "fsc", "sales", "service"]) {
      const f = pf[key];
      if (!f) continue;
      const caps: string[] = Array.isArray(f.aiCapabilities) ? f.aiCapabilities : [];
      const proj = (f.aiProjectCount || "").trim();
      const cd = (f.aiCaseDescription || "").trim();
      const bi = (f.aiBusinessImpact || "").trim();
      if (caps.length === 0 && !proj && !cd && !bi) continue;
      out.push({
        productKey: key,
        productLabel: PRODUCT_KEY_LABEL[key] || key,
        capabilities: caps,
        projectCount: proj,
        caseDescription: cd,
        businessImpact: bi,
      });
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
    const pfAll = ((p as any)?.product_filters || {}) as Record<string, { industries?: string[] }>;
    const pfIndustries = Object.values(pfAll).flatMap((f) => (Array.isArray(f?.industries) ? f.industries : []));
    const allIndustries = Array.from(
      new Set(
        [
          ...(p?.industries || []),
          ...(p?.secondary_industries || []),
          ...pfIndustries,
          ...industryAppsRaw.map((ia) => ia.industry),
        ]
          .map((s) => (s || "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, "sv"));
    const industryApps = industryAppsRaw;
    // Positionering: primärt partnerns globala "Vi är valet när…", annars
    // fallback till AI-genererade product_profiles[app].positioning för aktiva
    // produkter (eller alla produkter om inget filter är valt).
    const ppForPositioning = ((p as any)?.product_profiles || {}) as Record<string, any>;
    const activeKeysForPositioning: ProductFilterKey[] =
      productFilters.length > 0
        ? productFilters
        : (Object.keys(PRODUCT_FILTER_GROUP) as ProductFilterKey[]);
    const fallbackPositioning = Array.from(
      new Set(
        activeKeysForPositioning
          .flatMap((k) => PRODUCT_FILTER_GROUP[k].apps)
          .map((app) => (ppForPositioning[app]?.positioning || "").trim())
          .filter(Boolean),
      ),
    ).join(" · ");
    return {
      partner: p,
      description: p?.description?.trim() || "",
      positioning: (p?.positioning_statement?.trim() || fallbackPositioning) || "",
      apps: sortApps(p?.applications || []),
      industries: allIndustries,
      industryApps,
      geography: Array.from(new Set([
        ...cleanList(p?.geography),
        ...Object.values(pfAll).flatMap((f: any) => Array.isArray(f?.geography) ? f.geography : []),
      ].map((s) => (s || "").trim()).filter(Boolean))),
      roles: cleanList(dp.roles),
      length: dp.typical_length?.trim() || "",
      bcLength: formatBcLength(dp),
      bcCost: formatBcCost(dp),
      engagement: dp.engagement_model?.trim() || "",
      methodology: dp.methodology?.trim() || "",
      teamSize: p?.team_size_sweden?.trim() || "",
      implementations: p?.implementations_done?.trim() || "",
      implementationsPerApp: perApp,
      offices: officeCities,
      agreement: p ? (p.agreement_signed ? "Ja" : "Nej") : "",
      ai: getAiPerProduct(p),
      notAFit: cleanList(p?.not_a_fit),
      industryPitches: (Array.isArray((p as any)?.industry_pitches) ? (p as any).industry_pitches : [])
        .map((ip: any) => ({
          industry: (ip?.industry || "").trim(),
          product: (ip?.product || "").trim() || null,
          text: (ip?.text || "").trim(),
        }))
        .filter((ip: any) => ip.industry && ip.text),
    };
  };


  const industryFilter = params.get("industry") || "";
  const productFilterRaw = params.get("product") || "";
  const normalizeProductFilterKey = (raw: string): string => {
    const k = raw.trim() as ProductFilterKey;
    if (PRODUCT_FILTER_GROUP[k]) return k;
    const fromApp = appToGroupKey(raw);
    return fromApp || raw;
  };
  const productFilters = productFilterRaw
    ? (Array.from(
        new Set(
          productFilterRaw
            .split(",")
            .map((s) => normalizeProductFilterKey(s))
            .filter((s) => s in PRODUCT_FILTER_GROUP)
        )
      ) as ProductFilterKey[])
    : [];

  const setFilter = (key: "industry" | "product", val: string) => {
    const next = new URLSearchParams(params);
    if (val && val !== "__all__") next.set(key, val);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const toggleProductFilter = (opt: ProductFilterKey) => {
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

  // Filters drive partner picker — full standard taxonomy, not derived from selection
  const industryOptions = STANDARD_INDUSTRIES.map((i) => i.name).sort((x, y) =>
    x.localeCompare(y, "sv"),
  );
  const availableProductKeys = (Object.keys(PRODUCT_FILTER_GROUP) as ProductFilterKey[]).sort(
    (x, y) => PRODUCT_FILTER_GROUP[x].label.localeCompare(PRODUCT_FILTER_GROUP[y].label, "sv"),
  );

  const productOptions = availableProductKeys.map((key) => ({
    key,
    label: PRODUCT_FILTER_GROUP[key].label,
  }));

  // Eligibility for picker: partner must deliver any selected product AND cover selected industry
  const partnerIndustriesFor = (p: DatabasePartner): string[] => {
    const pfAll = ((p as any)?.product_filters || {}) as Record<string, { industries?: string[] }>;
    const pfIndustries = Object.values(pfAll).flatMap((f) =>
      Array.isArray(f?.industries) ? f.industries : [],
    );
    const iaInd = (p.industry_apps || []).map((ia: any) => (ia?.industry || "").trim());
    return Array.from(
      new Set(
        [
          ...(p.industries || []),
          ...(p.secondary_industries || []),
          ...pfIndustries,
          ...iaInd,
        ]
          .map((s) => (s || "").trim())
          .filter(Boolean),
      ),
    );
  };

  const partnerProductKeys = (p: DatabasePartner): ProductFilterKey[] => {
    const fromApps = getProductFilterKeysForApps(p.applications || []);
    const pfAll = ((p as any)?.product_filters || {}) as Record<string, unknown>;
    const fromPf = Object.keys(pfAll).filter(
      (k): k is ProductFilterKey => (k as ProductFilterKey) in PRODUCT_FILTER_GROUP,
    );
    return Array.from(new Set<ProductFilterKey>([...fromApps, ...fromPf]));
  };

  const partnerMatchesFilters = (p: DatabasePartner): boolean => {
    if (productFilters.length > 0) {
      const keys = partnerProductKeys(p);
      if (!productFilters.some((k) => keys.includes(k))) return false;
    }
    if (industryFilter) {
      const inds = partnerIndustriesFor(p);
      if (!inds.includes(industryFilter)) return false;
    }
    return true;
  };

  const eligiblePartners = useMemo(
    () => sortedPartners.filter(partnerMatchesFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortedPartners, productFilterRaw, industryFilter],
  );

  // Auto-clear picked partner if it no longer matches the active filters
  useEffect(() => {
    const next = new URLSearchParams(params);
    let changed = false;
    if (a && !partnerMatchesFilters(a)) {
      next.delete("a");
      changed = true;
    }
    if (b && !partnerMatchesFilters(b)) {
      next.delete("b");
      changed = true;
    }
    if (changed) setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFilterRaw, industryFilter, aSlug, bSlug]);

  useEffect(() => {
    const invalid = productFilters.filter((f) => !availableProductKeys.includes(f));
    if (invalid.length === 0) return;
    const remaining = productFilters.filter((f) => availableProductKeys.includes(f));
    const next = new URLSearchParams(params);
    if (remaining.length > 0) next.set("product", remaining.join(","));
    else next.delete("product");
    setParams(next, { replace: true });
  }, [productFilters, availableProductKeys, params, setParams]);

  const productActive = productFilters.length > 0;
  

  const matchesProduct = (app: string) => {
    if (!productActive) return true;
    const key = appToGroupKey(app);
    if (!key) return false;
    return productFilters.includes(key);
  };

  const productKeyMatchesFilter = (key: string): boolean => {
    if (!productActive) return true;
    return productFilters.includes(key as ProductFilterKey);
  };

  const PITCH_LABELS_BY_KEY: Record<ProductFilterKey, string[]> = {
    bc: [...PRODUCT_FILTER_GROUP.bc.apps] as string[],
    fsc: [...PRODUCT_FILTER_GROUP.fsc.apps] as string[],
    sales: [...PRODUCT_FILTER_GROUP.sales.apps] as string[],
    service: [...PRODUCT_FILTER_GROUP.service.apps] as string[],
  };
  const selectedPitchLabels = productActive
    ? Array.from(new Set(productFilters.flatMap((sel) => PITCH_LABELS_BY_KEY[sel] || [])))
    : [];

  const applyFilters = (data: ReturnType<typeof get>) => ({
    ...data,
    apps: productActive ? data.apps.filter(matchesProduct) : data.apps,
    industries: industryFilter ? data.industries.filter((x) => x === industryFilter) : data.industries,
    industryApps: data.industryApps.filter(
      (ia) =>
        matchesProduct(ia.application) &&
        (!industryFilter || ia.industry === industryFilter)
    ),
    ai: data.ai.filter((a) => productKeyMatchesFilter(a.productKey)),
    industryPitches: data.industryPitches.filter((ip) =>
      (!industryFilter || ip.industry === industryFilter) &&
      (!productActive || !ip.product || selectedPitchLabels.includes(ip.product))
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

      <main className="pt-10 pb-12">
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
                {/* Step 1 — Filter by product and industry */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] gap-3 mb-6">
                  <div className="group relative">
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1.5 ml-1">
                      1. Välj produkt
                    </label>
                    <span className="block text-[11px] text-[hsl(var(--muted-foreground)/0.8)] mb-1.5 ml-1">
                      Endast partners som levererar vald produkt visas i nästa steg
                    </span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="relative flex h-14 w-full items-center justify-between rounded-lg border border-[hsl(var(--border-on-dark)/15)] bg-[hsl(var(--card-dark))] px-4 py-3 text-left transition-all duration-300 hover:border-[hsl(var(--primary)/40)] hover:shadow-[0_8px_24px_-12px_hsl(var(--card-dark)/0.4)]"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-[hsl(var(--primary-foreground))] truncate">
                              {productFilters.length === 0
                                ? "Alla produkter"
                                : productFilters.length === 1
                                ? PRODUCT_FILTER_GROUP[productFilters[0]].label
                                : `${productFilters.length} valda`}
                            </span>
                            <span className="block text-[11px] text-[hsl(var(--muted-dark))]">
                              {productFilters.length === 0 ? "Välj produktkategori" : "Filtrering aktiv"}
                            </span>
                          </div>
                          <div className="ml-3 flex shrink-0 items-center justify-center rounded-md bg-[hsl(var(--primary-foreground)/0.08)] p-1.5 transition-colors group-hover:bg-[hsl(var(--primary)/0.15)]">
                            <ChevronDown className="w-4 h-4 text-[hsl(var(--primary))]" />
                          </div>
                          <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--primary)/0.4)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-[260px] p-2 max-h-80 overflow-auto">
                        {productFilters.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setFilter("product", "")}
                            className="w-full text-left text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] underline px-2 py-1 mb-1"
                          >
                            Rensa val
                          </button>
                        )}
                        <div className="space-y-1">
                          {productOptions.map((opt) => {
                            const checked = productFilters.includes(opt.key);
                            return (
                              <label
                                key={opt.key}
                                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[hsl(var(--muted))] cursor-pointer text-sm"
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() => toggleProductFilter(opt.key)}
                                />
                                <span className="flex-1">{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="hidden md:block" aria-hidden="true" />

                  <div className="group relative">
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1.5 ml-1">
                      2. Välj bransch
                    </label>
                    <span className="block text-[11px] text-[hsl(var(--muted-foreground)/0.8)] mb-1.5 ml-1">
                      Endast partners med vald fokusbransch visas i nästa steg
                    </span>
                    <Select
                      value={industryFilter || "__all__"}
                      onValueChange={(v) => setFilter("industry", v)}
                    >
                      <SelectTrigger className="relative h-14 w-full rounded-lg border border-[hsl(var(--border-on-dark)/15)] bg-[hsl(var(--card-dark))] px-4 py-3 text-left transition-all duration-300 hover:border-[hsl(var(--primary)/40)] hover:shadow-[0_8px_24px_-12px_hsl(var(--card-dark)/0.4)] [&>span:last-child]:hidden">
                        <div className="flex-1 min-w-0">
                          <span className="block text-sm font-medium text-[hsl(var(--primary-foreground))] truncate">
                            {industryFilter || "Alla branscher"}
                          </span>
                          <span className="block text-[11px] text-[hsl(var(--muted-dark))]">
                            {industryFilter ? "Bransch vald" : "Välj branschområde"}
                          </span>
                        </div>
                        <div className="ml-3 flex shrink-0 items-center justify-center rounded-md bg-[hsl(var(--primary-foreground)/0.08)] p-1.5 transition-colors group-hover:bg-[hsl(var(--primary)/0.15)]">
                          <ChevronDown className="w-4 h-4 text-[hsl(var(--primary))]" />
                        </div>
                        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--primary)/0.4)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
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
                    <div className="md:col-span-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const next = new URLSearchParams(params);
                          next.delete("product");
                          next.delete("industry");
                          setParams(next, { replace: true });
                        }}
                        className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] underline self-start"
                      >
                        Rensa filter
                      </button>
                    </div>
                  )}
                </div>

                {/* Step 2 — Pick two partners (filtered by step 1) */}
                <div className="mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] ml-1">
                    3. Välj två partners att jämföra
                  </p>
                  <p className="text-[11px] text-[hsl(var(--muted-foreground)/0.8)] ml-1 mt-0.5">
                    {productActive || industryFilter
                      ? `${eligiblePartners.length} partner${eligiblePartners.length === 1 ? "" : "s"} matchar urvalet`
                      : "Visar alla publicerade partners — välj produkt och bransch ovan för att smalna av"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] gap-3 mb-6">
                  <PartnerColumnHeader
                    label="Partner A"
                    partner={a}
                    partners={eligiblePartners}
                    slug={aSlug}
                    onChange={(s) => setSlot("a", s)}
                    onClear={() => setSlot("a", "")}
                    onRequestQuote={a ? () => setQuoteFor({ recipients: [{ slug: a.slug, name: a.name }], mode: "quote" }) : undefined}
                    quoteSubmitting={isSubmittingQuote}
                  />
                  <div className="flex items-center justify-center md:pt-10">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={swap}
                      disabled={!hasBoth}
                      className="h-auto w-full min-h-[3rem] flex-col gap-1 px-2 py-2"
                      title="Byt plats"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                      <span className="text-xs leading-tight">Byt plats</span>
                    </Button>
                  </div>
                  <PartnerColumnHeader
                    label="Partner B"
                    partner={b}
                    partners={eligiblePartners}
                    slug={bSlug}
                    onChange={(s) => setSlot("b", s)}
                    onClear={() => setSlot("b", "")}
                    onRequestQuote={b ? () => setQuoteFor({ recipients: [{ slug: b.slug, name: b.name }], mode: "quote" }) : undefined}
                    quoteSubmitting={isSubmittingQuote}
                  />
                </div>

                {eligiblePartners.length === 0 && (productActive || industryFilter) && (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 mb-6">
                    Inga partners matchar er kombination av produkt och bransch. Bredda urvalet ovan.
                  </div>
                )}

                {!hasBoth && eligiblePartners.length > 0 && (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 mb-6">
                    Välj två partner ovan för att se jämförelsen.
                  </div>
                )}


                {hasBoth && (
                  <div className="space-y-8">
                    {/* Positionering */}
                    <section className="space-y-3">
                      <SectionTitle icon={Target} title="Positionering" />
                      <R
                        label="Vi är valet när…"
                        a={renderPositioningCell(A.positioning)}
                        b={renderPositioningCell(B.positioning)}
                      />

                      {(() => {
                        const aDescs = getProductDescriptions(a, AF.apps);
                        const bDescs = getProductDescriptions(b, BF.apps);
                        const keys = Array.from(
                          new Set<ProductFilterKey>([
                            ...aDescs.map((d) => d.key),
                            ...bDescs.map((d) => d.key),
                          ])
                        ).sort((x, y) =>
                          PRODUCT_FILTER_GROUP[x].label.localeCompare(
                            PRODUCT_FILTER_GROUP[y].label,
                            "sv"
                          )
                        );
                        return keys.map((key) => {
                          const descA = aDescs.find((d) => d.key === key);
                          const descB = bDescs.find((d) => d.key === key);
                          return (
                            <R
                              key={key}
                              label={PRODUCT_FILTER_KEY_LABEL[key] || key}
                              a={descA ? renderProductDescCell(descA.text) : EMPTY}
                              b={descB ? renderProductDescCell(descB.text) : EMPTY}
                            />
                          );
                        });
                      })()}

                      <R
                        label="Kompetens inom Dynamics 365"
                        help="Alla Dynamics 365-applikationer partnern arbetar med. ERP-appar listas först, därefter CE/CRM — båda i bokstavsordning."
                        a={renderAppList(AF.apps)}
                        b={renderAppList(BF.apps)}
                      />
                      <R
                        label="Fokusbranscher"
                        a={renderIndustryList(AF.industries)}
                        b={renderIndustryList(BF.industries)}
                      />

                      {(() => {
                        const keys = Array.from(
                          new Set([
                            ...AF.industryPitches.map((ip) => ip.industry),
                            ...BF.industryPitches.map((ip) => ip.industry),
                          ])
                        ).sort((x, y) => x.localeCompare(y, "sv"));
                        return keys.map((industry) => (
                          <R
                            key={industry}
                            label={industry}
                            a={renderPitchCell(
                              AF.industryPitches.filter((ip) => ip.industry === industry)
                            )}
                            b={renderPitchCell(
                              BF.industryPitches.filter((ip) => ip.industry === industry)
                            )}
                          />
                        ));
                      })()}

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
                      {(() => {
                        const keysToShow: ProductFilterKey[] =
                          productFilters.length > 0
                            ? productFilters
                            : (Array.from(
                                new Set([
                                  ...getProductFilterKeysForApps(A.apps),
                                  ...getProductFilterKeysForApps(B.apps),
                                ]),
                              ) as ProductFilterKey[]);
                        const rows: JSX.Element[] = [];
                        keysToShow.forEach((key) => {
                          const mA = getProductMetrics(A.partner, key);
                          const mB = getProductMetrics(B.partner, key);
                          if (!mA.length && !mA.cost && !mB.length && !mB.cost) return;
                          const label = PRODUCT_KEY_LABEL[key] || key;
                          rows.push(
                            <R
                              key={`len-${key}`}
                              label={`Typisk projektlängd (${label})`}
                              help="Partnerns egna spann för typisk implementationstid, i veckor från projektstart till driftsättning. Verklig längd beror på scope, datakvalitet och organisationens beslutskraft."
                              a={renderValue(mA.length)}
                              b={renderValue(mB.length)}
                            />,
                          );
                          rows.push(
                            <R
                              key={`cost-${key}`}
                              label={`Typisk total projektkostnad (${label})`}
                              help="Partnerns egna kostnadsband för typisk implementation (exkl. licenser). Slutpriset beror på scope, integrationer, datamigrering och förändringsledning."
                              a={renderValue(mA.cost)}
                              b={renderValue(mB.cost)}
                            />,
                          );
                        });
                        return rows;
                      })()}
                      <R
                        label="Kontor (städer)"
                        a={renderList(A.offices)}
                        b={renderList(B.offices)}
                      />
                      <R
                        label="Geografi"
                        help="Områden där partnern levererar projekt."
                        a={renderList(A.geography)}
                        b={renderList(B.geography)}
                      />
                    </section>

                    {/* AI & automatisering */}
                    <section className="space-y-3">
                      <SectionTitle icon={Sparkles} title="AI & automatisering" />
                      <R
                        label="AI, Copilot & Automation"
                        help="Partnerns samlade AI- och automationsprofil: leveransmodell, förmågor, relevanta områden, use cases, erfarenhet och underlag. Bygger på partnerns egna uppgifter."
                        a={renderAiProfile(((A.partner as any)?.ai_profile) as AiProfile | null)}
                        b={renderAiProfile(((B.partner as any)?.ai_profile) as AiProfile | null)}
                      />
                    </section>

                    {/* Kontakta valda partners */}
                    <section className="space-y-3">
                      <SectionTitle icon={Mail} title="Kontakta valda partners" />
                      {A.partner && B.partner ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                          <p className="text-sm text-slate-700 mb-1">
                            Skicka samma förfrågan till <span className="font-semibold">{A.partner.name}</span> och <span className="font-semibold">{B.partner.name}</span> — du får jämförbara svar.
                          </p>
                          <p className="text-xs text-slate-500 mb-4">
                            Varje partner kontaktas separat och ser bara sin egen förfrågan — aldrig samma tråd.
                          </p>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Hur vill du gå vidare?
                          </p>
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              onClick={() =>
                                setQuoteFor({
                                  recipients: [
                                    { slug: A.partner!.slug, name: A.partner!.name },
                                    { slug: B.partner!.slug, name: B.partner!.name },
                                  ],
                                  mode: "contact",
                                })
                              }
                              disabled={isSubmittingQuote}
                              className="w-full min-h-[48px] bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90 font-semibold"
                            >
                              Ställ en första fråga till båda
                            </Button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  setQuoteFor({
                                    recipients: [
                                      { slug: A.partner!.slug, name: A.partner!.name },
                                      { slug: B.partner!.slug, name: B.partner!.name },
                                    ],
                                    mode: "demo",
                                  })
                                }
                                disabled={isSubmittingQuote}
                                className="w-full min-h-[44px]"
                              >
                                Boka genomgång eller demo
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  setQuoteFor({
                                    recipients: [
                                      { slug: A.partner!.slug, name: A.partner!.name },
                                      { slug: B.partner!.slug, name: B.partner!.name },
                                    ],
                                    mode: "quote",
                                  })
                                }
                                disabled={isSubmittingQuote}
                                className="w-full min-h-[44px]"
                              >
                                Få en uppskattning av tid och kostnad
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-3">
                            Kostnadsfritt. d365.se säljer inte implementationer — förfrågan går direkt till respektive partner med kopia till dig och d365.se.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                          Välj två partners ovan för att kunna skicka samma förfrågan till båda och få jämförbara svar.
                        </div>
                      )}

                      {/* Kontakta enskilt */}
                      {(A.partner || B.partner) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[A, B].map((side, idx) =>
                            side.partner ? (
                              <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3">
                                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                  Endast {idx === 0 ? "Partner A" : "Partner B"}
                                </div>
                                <div className="text-sm font-medium text-foreground mb-2 truncate">
                                  {side.partner.name}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setQuoteFor({
                                        recipients: [{ slug: side.partner!.slug, name: side.partner!.name }],
                                        mode: "contact",
                                      })
                                    }
                                    disabled={isSubmittingQuote}
                                    className="text-xs"
                                  >
                                    Ställ en fråga
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setQuoteFor({
                                        recipients: [{ slug: side.partner!.slug, name: side.partner!.name }],
                                        mode: "demo",
                                      })
                                    }
                                    disabled={isSubmittingQuote}
                                    className="text-xs"
                                  >
                                    Boka genomgång
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setQuoteFor({
                                        recipients: [{ slug: side.partner!.slug, name: side.partner!.name }],
                                        mode: "quote",
                                      })
                                    }
                                    disabled={isSubmittingQuote}
                                    className="text-xs"
                                  >
                                    Offertindikering
                                  </Button>
                                </div>
                              </div>
                            ) : null,
                          )}
                        </div>
                      )}
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

      {quoteFor && (
        <PartnerRequestDialog
          open={!!quoteFor}
          onOpenChange={(o) => { if (!o) setQuoteFor(null); }}
          partnerSlug={quoteFor.recipients[0].slug}
          partnerName={quoteFor.recipients[0].name}
          recipients={quoteFor.recipients.length > 1 ? quoteFor.recipients : undefined}
          mode={quoteFor.mode}
          selectedProduct={
            productFilters.length === 1
              ? PRODUCT_FILTER_GROUP[productFilters[0]].label
              : undefined
          }
          industry={industryFilter || undefined}
          onSubmitting={setIsSubmittingQuote}
        />
      )}

      <Footer />
    </div>
  );
};

export default ComparePartners;
