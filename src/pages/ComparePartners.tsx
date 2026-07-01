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
  typical_length?: string;
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
          {quoteSubmitting ? "Skickar…" : "Ställ en fråga till denna partner"}
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
  c,
  warn = false,
  aName,
  bName,
  cName,
  help,
  showC = false,
}: {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
  c?: React.ReactNode;
  warn?: boolean;
  aName?: string;
  bName?: string;
  cName?: string;
  help?: string;
  showC?: boolean;
}) => {
  const cols = showC ? 3 : 2;
  const gridCls = cols === 3
    ? "grid grid-cols-1 sm:grid-cols-3"
    : "grid grid-cols-1 sm:grid-cols-2";
  return (
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
      <div className={gridCls}>
        <div className="border-r border-[hsl(var(--border))]">
          <Cell mobileLabel={aName || "Partner A"}>{a}</Cell>
        </div>
        <div className={showC ? "border-r border-[hsl(var(--border))]" : ""}>
          <Cell mobileLabel={bName || "Partner B"}>{b}</Cell>
        </div>
        {showC && (
          <div>
            <Cell mobileLabel={cName || "Partner C"}>{c}</Cell>
          </div>
        )}
      </div>
    </div>
  );
};

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

const renderProductInsightCell = (insight?: {
  description: string;
  whyChoose: string;
  keyPoints: string[];
}) => {
  if (!insight) return EMPTY;
  const { description, whyChoose, keyPoints } = insight;
  if (!description && !whyChoose && keyPoints.length === 0) return EMPTY;
  return (
    <div className="space-y-3 text-sm leading-relaxed text-[hsl(var(--foreground))]">
      {description && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Vad vi gör inom lösningen
          </p>
          {splitIntoParagraphs(description).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}
      {whyChoose && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Varför välja oss
          </p>
          {splitIntoParagraphs(whyChoose).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}
      {keyPoints.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Konkreta styrkor
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {keyPoints.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

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
  const cSlug = params.get("c") || "";
  const [quoteFor, setQuoteFor] = useState<{ recipients: Array<{ slug: string; name: string }>; mode: "contact" | "demo" | "quote" } | null>(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  const { data: partners = [], isLoading } = usePartners();

  const sortedPartners = useMemo(
    () => [...partners].sort((x, y) => x.name.localeCompare(y.name, "sv")),
    [partners]
  );

  const a = partners.find((p) => p.slug === aSlug);
  const b = partners.find((p) => p.slug === bSlug);
  const c = partners.find((p) => p.slug === cSlug);

  const setSlot = (key: "a" | "b" | "c", slug: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set(key, slug);
    else next.delete(key);
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
    commerce: {
      label: "Commerce",
      apps: ["Commerce"],
    },
    hr: {
      label: "Human Resources",
      apps: ["Human Resources"],
    },
    sales: {
      label: "Sales & Customer Insights",
      apps: ["Sales", "Customer Insights (Marketing)", "Marketing"],
    },
    service: {
      label: "Customer Service / Field Service / Contact Center",
      apps: ["Customer Service", "Field Service", "Contact Center"],
    },
    po: {
      label: "Project Operations",
      apps: ["Project Operations"],
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
    commerce: "Commerce",
    hr: "Human Resources",
    sales: "Sales & Customer Insights",
    service: "Customer Service / Field Service / Contact Center",
    po: "Project Operations",
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

  type ProductInsight = {
    key: ProductFilterKey;
    label: string;
    description: string;
    whyChoose: string;
    keyPoints: string[];
  };

  const splitKeyPoints = (raw: string): string[] => {
    if (!raw) return [];
    return raw
      .split(/\r?\n+|(?:^|\s)[-•·*]\s+/g)
      .map((s) => s.trim().replace(/^[-•·*]\s*/, ""))
      .filter(Boolean)
      .slice(0, 6);
  };

  const getProductInsights = (
    p: DatabasePartner | undefined,
    apps: string[]
  ): ProductInsight[] => {
    const pf = (p as any)?.product_filters as
      | Record<string, { productDescription?: string; whyChoose?: string; keyPoints?: string }>
      | undefined;
    if (!pf) return [];
    const keys = getProductFilterKeysForApps(apps);
    const out: ProductInsight[] = [];
    for (const key of keys) {
      const description = (pf[key]?.productDescription || "").trim();
      const whyChoose = (pf[key]?.whyChoose || "").trim();
      const keyPoints = splitKeyPoints(pf[key]?.keyPoints || "");
      if (!description && !whyChoose && keyPoints.length === 0) continue;
      out.push({
        key,
        label: PRODUCT_FILTER_KEY_LABEL[key] || key,
        description,
        whyChoose,
        keyPoints,
      });
    }
    return out;
  };

  const PRODUCT_KEY_LABEL: Record<ProductFilterKey, string> = {
    bc: "Business Central",
    fsc: "Finance & Supply Chain Management",
    commerce: "Commerce",
    hr: "Human Resources",
    sales: "Sales & Customer Insights",
    service: "Customer Service / Field Service / Contact Center",
    po: "Project Operations",
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
  ): { length: string; cost: string; methodology: string } => {
    const pp = ((p as any)?.product_profiles || {}) as Record<string, any>;
    const dpGlobal = (p?.delivery_profile || {}) as DeliveryProfile;
    const fallbackMethodology = (dpGlobal.methodology || "").trim();
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
        const methodology =
          (typeof raw.methodology === "string" ? raw.methodology.trim() : "") ||
          fallbackMethodology;
        if (length || cost || methodology) return { length, cost, methodology };
      }
    }
    if (key === "bc") {
      return {
        length: formatBcLength(dpGlobal),
        cost: formatBcCost(dpGlobal),
        methodology: fallbackMethodology,
      };
    }
    return { length: "", cost: "", methodology: fallbackMethodology };
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
    for (const key of Object.keys(PRODUCT_FILTER_GROUP) as ProductFilterKey[]) {
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
      roles: [],
      length: dp.typical_length?.trim() || "",
      bcLength: formatBcLength(dp),
      bcCost: formatBcCost(dp),
      engagement: "",
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
  const C = get(c);
  const hasBoth = !!a && !!b;
  const hasC = !!c;
  const aName = a?.name;
  const bName = b?.name;
  const cName = c?.name;

  const availableProductKeys = (Object.keys(PRODUCT_FILTER_GROUP) as ProductFilterKey[]).sort(
    (x, y) => PRODUCT_FILTER_GROUP[x].label.localeCompare(PRODUCT_FILTER_GROUP[y].label, "sv"),
  );

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

  const industryPartnerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    STANDARD_INDUSTRIES.forEach((ind) => {
      counts[ind.name] = sortedPartners.filter((p) => {
        if (productFilters.length > 0) {
          const keys = partnerProductKeys(p);
          if (!productFilters.some((k) => keys.includes(k))) return false;
        }
        return partnerIndustriesFor(p).includes(ind.name);
      }).length;
    });
    return counts;
  }, [sortedPartners, productFilters]);

  const allIndustryEligibleCount = useMemo(() => {
    if (productFilters.length === 0) return sortedPartners.length;
    return sortedPartners.filter((p) => {
      const keys = partnerProductKeys(p);
      return productFilters.some((k) => keys.includes(k));
    }).length;
  }, [sortedPartners, productFilters]);

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
    if (c && !partnerMatchesFilters(c)) {
      next.delete("c");
      changed = true;
    }
    if (changed) setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFilterRaw, industryFilter, aSlug, bSlug, cSlug]);

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
    commerce: [...PRODUCT_FILTER_GROUP.commerce.apps] as string[],
    hr: [...PRODUCT_FILTER_GROUP.hr.apps] as string[],
    sales: [...PRODUCT_FILTER_GROUP.sales.apps] as string[],
    service: [...PRODUCT_FILTER_GROUP.service.apps] as string[],
    po: [...PRODUCT_FILTER_GROUP.po.apps] as string[],
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
  const CF = applyFilters(C);


  const [showAllRows, setShowAllRows] = useState(false);

  const R = (props: { label: string; a: React.ReactNode; b: React.ReactNode; c?: React.ReactNode; warn?: boolean; help?: string }) => {
    if (!showAllRows && !props.warn) {
      try {
        const sa = JSON.stringify(props.a);
        const sb = JSON.stringify(props.b);
        const sc = hasC ? JSON.stringify(props.c) : sa;
        if (sa && sa === sb && sa === sc) return null;
      } catch {}
    }
    return <Row {...props} aName={aName} bName={bName} cName={cName} showC={hasC} />;
  };

  // Heuristik: bygg 2-4 skillnadspunkter mellan valda partners (utan AI-anrop)
  const diffPoints = useMemo(() => {
    if (!hasBoth) return [] as string[];
    const points: string[] = [];
    const setDiff = (x: string[], y: string[]) => x.filter((v) => !y.includes(v));

    const sides = [
      { P: A, name: A.partner?.name || "Partner A" },
      { P: B, name: B.partner?.name || "Partner B" },
      ...(hasC ? [{ P: C, name: C.partner?.name || "Partner C" }] : []),
    ];

    // Branschtyngdpunkt – lyft fram unika branscher per partner
    const allInd = Array.from(new Set(sides.flatMap((s) => s.P.industries)));
    const uniquePer = sides.map((s) => ({
      name: s.name,
      only: s.P.industries.filter((i) => sides.every((o) => o === s || !o.P.industries.includes(i))).slice(0, 3),
    })).filter((u) => u.only.length > 0);
    if (uniquePer.length > 0) {
      points.push(
        `Branschtyngdpunkt skiljer sig: ` +
          uniquePer.map((u) => `${u.name} har fokus på ${u.only.join(", ")}`).join("; ") + "."
      );
    }

    // Produktbredd – unika appar per partner
    const uniqueApps = sides.map((s) => ({
      name: s.name,
      only: s.P.apps.filter((a) => sides.every((o) => o === s || !o.P.apps.includes(a))).slice(0, 3),
    })).filter((u) => u.only.length > 0);
    if (uniqueApps.length > 0) {
      points.push(
        `Produktbredd: ` + uniqueApps.map((u) => `${u.name} levererar även ${u.only.join(", ")}`).join("; ") + "."
      );
    }

    // Geografi
    const geoTexts = sides.map((s) => `${s.name} ${s.P.geography.join(", ") || "—"}`);
    const distinctGeo = new Set(sides.map((s) => s.P.geography.join(","))).size > 1;
    if (distinctGeo) {
      points.push(`Geografisk täckning: ${geoTexts.join(" vs ")}.`);
    }

    // Teamstorlek
    const teams = sides.filter((s) => s.P.teamSize);
    if (teams.length >= 2 && new Set(teams.map((t) => t.P.teamSize)).size > 1) {
      points.push(`Teamstorlek i Sverige: ${teams.map((t) => `${t.name} ${t.P.teamSize}`).join(", ")}.`);
    }

    // Positionering
    const positionings = sides.map((s) => s.P.positioning).filter(Boolean);
    if (positionings.length >= 2 && new Set(positionings).size > 1) {
      points.push(`Positionering skiljer sig — se "Vi är valet när…" för respektive partner.`);
    }

    return points.slice(0, 6);
  }, [hasBoth, hasC, A, B, C]);


  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Jämför Dynamics 365-partner sida vid sida | d365.se"
        description="Jämför två till tre Microsoft Dynamics 365-partner mot samma beslutsprofil: positionering, leveransbild, fakta och 'när passar vi inte'."
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
                Jämför två till tre partner sida vid sida
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
                Samma rader för valda partner — positionering, snabbfakta,
                kompetens inom Dynamics 365, branscher och kontor. Underlag för
                beslut, inte rangordning.
              </p>
            </header>

            {isLoading ? (
              <div className="text-center text-muted-foreground py-10">Laddar partner…</div>
            ) : (
              <>
                {/* Step 1 — Filter by product and industry */}
                <div className="mb-6">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1.5 ml-1">
                    1. Välj produkt
                  </label>
                  <span className="block text-[11px] text-[hsl(var(--muted-foreground)/0.8)] mb-3 ml-1">
                    Endast partners som levererar vald produkt visas i nästa steg
                  </span>
                  {(() => {
                    const ERP_CHIPS: { label: string; icon: string; key: ProductFilterKey }[] = [
                      { label: "Business Central", icon: bcIcon, key: "bc" },
                      { label: "Finance & Supply Chain", icon: financeIcon, key: "fsc" },
                      { label: "Commerce", icon: commerceIcon, key: "commerce" },
                      { label: "Human Resources", icon: hrIcon, key: "hr" },
                    ];
                    const CRM_CHIPS: { label: string; icon: string; key: ProductFilterKey }[] = [
                      { label: "Sales", icon: salesIcon, key: "sales" },
                      { label: "Customer Insights (Marketing Automation)", icon: marketingIcon, key: "sales" },
                      { label: "Customer Service", icon: csIcon, key: "service" },
                      { label: "Field Service", icon: fsIcon, key: "service" },
                      { label: "Contact Center", icon: ccIcon, key: "service" },
                      { label: "Project Operations", icon: poIcon, key: "po" },
                    ];
                    const renderChip = (c: { label: string; icon: string; key: ProductFilterKey }) => {
                      const selected = productFilters.includes(c.key);
                      return (
                        <button
                          key={c.label}
                          type="button"
                          onClick={() => toggleProductFilter(c.key)}
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                            selected
                              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm"
                              : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.5)]"
                          }`}
                          aria-pressed={selected}
                        >
                          <img src={c.icon} alt="" aria-hidden="true" className="w-5 h-5 shrink-0" />
                          <span>{c.label}</span>
                        </button>
                      );
                    };
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] p-4">
                          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                            ERP
                          </div>
                          <div className="flex flex-wrap gap-2">{ERP_CHIPS.map(renderChip)}</div>
                        </div>
                        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] p-4">
                          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                            CRM & Customer Experience
                          </div>
                          <div className="flex flex-wrap gap-2">{CRM_CHIPS.map(renderChip)}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1.5 ml-1">
                    2. Välj bransch
                  </label>
                  <span className="block text-[11px] text-[hsl(var(--muted-foreground)/0.8)] mb-3 ml-1">
                    Endast partners med vald fokusbransch visas i nästa steg
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-1.5">
                    {/* Alla branscher */}
                    <button
                      type="button"
                      onClick={() => setFilter("industry", "")}
                      className={`group relative flex flex-col rounded-lg border overflow-hidden text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        !industryFilter
                          ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.06)]"
                          : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.5)]"
                      }`}
                      aria-pressed={!industryFilter}
                    >
                      <div className="aspect-[16/5] overflow-hidden bg-muted flex items-center justify-center">
                        <span className="text-[10px] font-medium text-muted-foreground">Alla branscher</span>
                      </div>
                      <div className="p-1">
                        <span className="text-[10px] font-semibold block">Alla branscher</span>
                        <span className="text-[9px] text-muted-foreground">
                          {allIndustryEligibleCount} {allIndustryEligibleCount === 1 ? "partner" : "partners"}
                        </span>
                      </div>
                    </button>

                    {STANDARD_INDUSTRIES.map((ind) => {
                      const img = INDUSTRY_IMAGE_BY_SLUG[ind.slug];
                      const selected = industryFilter === ind.name;
                      const count = industryPartnerCounts[ind.name] || 0;
                      const disabled = count === 0;
                      return (
                        <button
                          key={ind.slug}
                          type="button"
                          onClick={() => setFilter("industry", ind.name)}
                          disabled={disabled}
                          className={`group relative flex flex-col rounded-lg border overflow-hidden text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-45 disabled:cursor-not-allowed ${
                            selected
                              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.06)]"
                              : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.5)]"
                          }`}
                          aria-pressed={selected}
                        >
                          {img && (
                            <div className="aspect-[16/5] overflow-hidden bg-muted">
                              <img
                                src={img}
                                alt={`Bransch ${ind.name}`}
                                loading="lazy"
                                className={`w-full h-full object-cover transition-transform duration-500 ${!disabled ? "group-hover:scale-105" : ""}`}
                              />
                            </div>
                          )}
                          <div className="p-1">
                            <span className={`text-[10px] font-semibold block ${selected ? "text-[hsl(var(--primary))]" : "group-hover:text-[hsl(var(--primary))]"}`}>
                              {ind.short}
                            </span>
                            <span className="text-[9px] text-muted-foreground">
                              {count} {count === 1 ? "partner" : "partners"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {(productActive || industryFilter) && (
                    <div className="mt-3 flex justify-end">
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

                {/* Step 3 — Pick 2-3 partners (filtered by step 1) */}
                <div className="mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] ml-1">
                    3. Välj 2–3 partners att jämföra
                  </p>
                  <p className="text-[11px] text-[hsl(var(--muted-foreground)/0.8)] ml-1 mt-0.5">
                    {productActive || industryFilter
                      ? `${eligiblePartners.length} partner${eligiblePartners.length === 1 ? "" : "s"} matchar urvalet`
                      : "Visar alla publicerade partners — välj produkt och bransch ovan för att smalna av"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
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
                  <PartnerColumnHeader
                    label="Partner C (valfri)"
                    partner={c}
                    partners={eligiblePartners}
                    slug={cSlug}
                    onChange={(s) => setSlot("c", s)}
                    onClear={() => setSlot("c", "")}
                    onRequestQuote={c ? () => setQuoteFor({ recipients: [{ slug: c.slug, name: c.name }], mode: "quote" }) : undefined}
                    quoteSubmitting={isSubmittingQuote}
                  />
                </div>
                {hasBoth && !hasC && eligiblePartners.length > 2 && (
                  <p className="text-[11px] text-[hsl(var(--muted-foreground))] ml-1 mb-4">
                    Tips: lägg till en tredje partner ovan för trevägsjämförelse.
                  </p>
                )}

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
                  <>
                    {/* AI-liknande diff-sammanfattning */}
                    <section className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-5">
                      <h2 className="text-lg font-bold text-foreground mb-2">
                        Vad skiljer partnerna åt?
                      </h2>
                      {diffPoints.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Partnerna liknar varandra mycket på nyckelattributen ovan. Se
                          fullständig jämförelse nedan för fler detaljer.
                        </p>
                      ) : (
                        <ul className="space-y-1.5 text-sm text-foreground/90 list-disc pl-5">
                          {diffPoints.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      )}
                    </section>

                    {/* Toggle skillnader / fullständig jämförelse */}
                    <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                      <p className="text-xs text-muted-foreground">
                        {showAllRows
                          ? "Visar samtliga attribut."
                          : "Visar endast rader där partnerna skiljer sig åt."}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAllRows((v) => !v)}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {showAllRows ? "Visa endast skillnader" : "Visa fullständig jämförelse"}
                      </button>
                    </div>
                  </>
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
                        c={renderPositioningCell(C.positioning)}
                      />

                      {(() => {
                        const aIns = getProductInsights(a, AF.apps);
                        const bIns = getProductInsights(b, BF.apps);
                        const cIns = getProductInsights(c, CF.apps);
                        const keys = Array.from(
                          new Set<ProductFilterKey>([
                            ...aIns.map((d) => d.key),
                            ...bIns.map((d) => d.key),
                            ...cIns.map((d) => d.key),
                          ])
                        ).sort((x, y) =>
                          PRODUCT_FILTER_GROUP[x].label.localeCompare(
                            PRODUCT_FILTER_GROUP[y].label,
                            "sv"
                          )
                        );
                        return keys.map((key) => {
                          const insA = aIns.find((d) => d.key === key);
                          const insB = bIns.find((d) => d.key === key);
                          const insC = cIns.find((d) => d.key === key);
                          return (
                            <R
                              key={key}
                              label={PRODUCT_FILTER_KEY_LABEL[key] || key}
                              a={renderProductInsightCell(insA)}
                              b={renderProductInsightCell(insB)}
                              c={renderProductInsightCell(insC)}
                            />
                          );
                        });
                      })()}

                      <R
                        label="Fokusbranscher"
                        warn={!!industryFilter}
                        a={renderIndustryList(AF.industries)}
                        b={renderIndustryList(BF.industries)}
                        c={renderIndustryList(CF.industries)}
                      />

                      <R
                        label="AI, Copilot & Automation"
                        help="Partnerns samlade AI- och automationsprofil: leveransmodell, förmågor, relevanta områden, use cases, erfarenhet och underlag. Bygger på partnerns egna uppgifter."
                        a={renderAiProfile(((A.partner as any)?.ai_profile) as AiProfile | null)}
                        b={renderAiProfile(((B.partner as any)?.ai_profile) as AiProfile | null)}
                        c={renderAiProfile(((C.partner as any)?.ai_profile) as AiProfile | null)}
                      />

                      {(() => {
                        const renderIA = (list: typeof AF.industryApps) =>
                          list.length > 0 ? (
                            <ul className="space-y-1.5">
                              {list.map((ia, i) => (
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
                          );
                        return (
                          <R
                            label="Branschapplikationer"
                            help="Branschlösningar / vertikala tillägg som partnern erbjuder ovanpå Dynamics 365."
                            a={renderIA(AF.industryApps)}
                            b={renderIA(BF.industryApps)}
                            c={renderIA(CF.industryApps)}
                          />
                        );
                      })()}

                      {(() => {
                        // If a specific industry is selected, always show that row (even if empty across partners)
                        const baseKeys = Array.from(
                          new Set([
                            ...AF.industryPitches.map((ip) => ip.industry),
                            ...BF.industryPitches.map((ip) => ip.industry),
                            ...CF.industryPitches.map((ip) => ip.industry),
                          ])
                        );
                        const keys = (industryFilter && !baseKeys.includes(industryFilter)
                          ? [industryFilter, ...baseKeys]
                          : baseKeys
                        ).sort((x, y) => x.localeCompare(y, "sv"));
                        return keys.map((industry) => (
                          <R
                            key={industry}
                            label={industry}
                            warn={!!industryFilter}
                            a={renderPitchCell(
                              AF.industryPitches.filter((ip) => ip.industry === industry)
                            )}
                            b={renderPitchCell(
                              BF.industryPitches.filter((ip) => ip.industry === industry)
                            )}
                            c={renderPitchCell(
                              CF.industryPitches.filter((ip) => ip.industry === industry)
                            )}
                          />
                        ));
                      })()}

                      <R
                        label="Kompetens inom Dynamics 365"
                        warn
                        help="Dynamics 365-applikationer som partnern arbetar med, filtrerat på de produkter du valt i jämförelsen."
                        a={renderAppList(AF.apps)}
                        b={renderAppList(BF.apps)}
                        c={renderAppList(CF.apps)}
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
                        c={renderValue(C.teamSize)}
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
                        c={
                          C.implementationsPerApp.length > 0
                            ? renderList(C.implementationsPerApp.map((i) => `${i.app}: ${i.count}`))
                            : renderValue(C.implementations)
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
                                  ...getProductFilterKeysForApps(C.apps),
                                ]),
                              ) as ProductFilterKey[]);
                        const rows: JSX.Element[] = [];
                        keysToShow.forEach((key) => {
                          const mA = getProductMetrics(A.partner, key);
                          const mB = getProductMetrics(B.partner, key);
                          const mC = getProductMetrics(C.partner, key);
                          if (
                            !mA.length && !mA.cost && !mA.methodology &&
                            !mB.length && !mB.cost && !mB.methodology &&
                            !mC.length && !mC.cost && !mC.methodology
                          ) return;
                          const label = PRODUCT_KEY_LABEL[key] || key;
                          rows.push(
                            <R
                              key={`method-${key}`}
                              label={`Projektmetodik (${label})`}
                              help="Partnerns arbetssätt och metodik för implementation, t.ex. Sure Step, egen agil metod eller hybrid."
                              a={renderValue(mA.methodology)}
                              b={renderValue(mB.methodology)}
                              c={renderValue(mC.methodology)}
                            />,
                          );
                          rows.push(
                            <R
                              key={`len-${key}`}
                              label={`Typisk projektlängd (${label})`}
                              help="Partnerns egna spann för typisk implementationstid, i veckor från projektstart till driftsättning. Verklig längd beror på scope, datakvalitet och organisationens beslutskraft."
                              a={renderValue(mA.length)}
                              b={renderValue(mB.length)}
                              c={renderValue(mC.length)}
                            />,
                          );
                          rows.push(
                            <R
                              key={`cost-${key}`}
                              label={`Typisk total projektkostnad (${label})`}
                              help="Partnerns egna kostnadsband för typisk implementation (exkl. licenser). Slutpriset beror på scope, integrationer, datamigrering och förändringsledning."
                              a={renderValue(mA.cost)}
                              b={renderValue(mB.cost)}
                              c={renderValue(mC.cost)}
                            />,
                          );
                        });
                        return rows;
                      })()}
                      <R
                        label="Kontor (städer)"
                        a={renderList(A.offices)}
                        b={renderList(B.offices)}
                        c={renderList(C.offices)}
                      />
                      <R
                        label="Geografi"
                        help="Områden där partnern levererar projekt."
                        a={renderList(A.geography)}
                        b={renderList(B.geography)}
                        c={renderList(C.geography)}
                      />
                    </section>



                    {/* Kontakta valda partners */}
                    <section className="space-y-3">
                      <SectionTitle icon={Mail} title="Kontakta valda partners" />
                      {(() => {
                        const selected = [A, B, C].filter((s) => s.partner);
                        const recipients = selected.map((s) => ({ slug: s.partner!.slug, name: s.partner!.name }));
                        if (selected.length >= 2) {
                          const names = selected.map((s) => s.partner!.name);
                          const joined =
                            names.length === 2
                              ? `${names[0]} och ${names[1]}`
                              : `${names.slice(0, -1).join(", ")} och ${names[names.length - 1]}`;
                          const groupLabel =
                            selected.length === 3 ? "Ställ en första fråga till alla tre" : "Ställ en första fråga till båda";
                          return (
                            <div className="rounded-xl border border-slate-200 bg-white p-5">
                              <p className="text-sm text-slate-700 mb-1">
                                Skicka samma förfrågan till <span className="font-semibold">{joined}</span> — du får jämförbara svar.
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
                                  onClick={() => setQuoteFor({ recipients, mode: "contact" })}
                                  disabled={isSubmittingQuote}
                                  className="w-full min-h-[52px] bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90 font-semibold"
                                >
                                  {groupLabel}
                                </Button>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setQuoteFor({ recipients, mode: "demo" })}
                                    disabled={isSubmittingQuote}
                                    className="w-full min-h-[52px]"
                                  >
                                    Boka genomgång eller demo
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setQuoteFor({ recipients, mode: "quote" })}
                                    disabled={isSubmittingQuote}
                                    className="w-full min-h-[52px]"
                                  >
                                    Få en uppskattning av tid och kostnad
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 mt-3">
                                Kostnadsfritt. d365.se säljer inte implementationer — förfrågan går direkt till respektive partner med kopia till dig och d365.se.
                              </p>
                            </div>
                          );
                        }
                        return (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                            Välj minst två partners ovan för att kunna skicka samma förfrågan till alla och få jämförbara svar.
                          </div>
                        );
                      })()}

                      {/* Kontakta enskilt */}
                      {(A.partner || B.partner || C.partner) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
                          {[A, B, C].map((side, idx) =>
                            side.partner ? (
                              <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col justify-between">
                                <div>
                                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                    Endast Partner {["A", "B", "C"][idx]}
                                  </div>
                                  <div className="text-sm font-medium text-foreground mb-3 truncate">
                                    {side.partner.name}
                                  </div>
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
                                    className="text-xs min-h-[40px]"
                                  >
                                    Ställ en fråga till denna partner
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
                                    className="text-xs min-h-[40px]"
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
                                    className="text-xs min-h-[40px]"
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
