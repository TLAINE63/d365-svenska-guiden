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
  X,
  Info,
  Sparkles,
  Globe2,
  Mail,
  BadgeCheck,
} from "lucide-react";



import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import PartnerRequestDialog from "@/components/PartnerRequestDialog";
import CompareStickyCTA from "@/components/CompareStickyCTA";
import AiCompareInsights from "@/components/AiCompareInsights";
import { describeAiCapabilities } from "@/utils/aiScoring";
import { usePartners, DatabasePartner } from "@/hooks/usePartners";
import { useTrackFilterExposure } from "@/hooks/useTrackFilterExposure";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import {
  AiProfile,
  labelForDelivery,
  labelForCapability,
  labelForArea,
  labelForUseCase,
  labelForExperience,
  labelForProjectCount,
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
import hrIcon from "@/assets/icons/HumanResources.svg?url";
import commerceIcon from "@/assets/icons/Commerce.svg?url";

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

  "Många partners förstärker leveransteamet med kollegor från nordiska/europeiska kontor. Fråga partnern hur många som faktiskt arbetar med er valda applikation och bransch – det är mer relevant än totalsiffran i Sverige.";

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

const EMPTY = <span className="text-slate-600 italic">—</span>;

/** Basic-profiler saknar partnerbekräftade uppgifter – visas neutralt, aldrig som brist. */
const BASIC_MISSING_LABEL = "Uppgift saknas i Basic-profil";
const BASIC_UNVERIFIED_LABEL = "Inte verifierad uppgift";

const BasicMissing = ({ label = BASIC_MISSING_LABEL }: { label?: string }) => (
  <span className="inline-flex items-start gap-2 text-xs text-slate-500">
    <span className="mt-[1px] inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-400 shrink-0">
      <Info className="w-3 h-3" />
    </span>
    <span>{label}</span>
  </span>
);

const isBasicPartner = (p?: DatabasePartner | null): boolean =>
  Boolean((p as any)?.is_basic_profile);

/** Observerade produktnycklar → applikationsnamn som resten av sidan förstår. */
const BASIC_PRODUCT_APPS: Record<string, string[]> = {
  bc: ["Business Central"],
  fsc: ["Finance & Supply Chain Management"],
  sales: ["Sales"],
  service: ["Customer Service"],
};


const cleanList = (arr?: string[] | null): string[] =>
  (arr || []).map((s) => (s || "").trim()).filter(Boolean);

interface ColProps {
  partner: DatabasePartner | undefined;
  partners: DatabasePartner[];
  slug: string;
  onChange: (slug: string) => void;
  onClear: () => void;
  onRequestQuote?: () => void;
  quoteSubmitting?: boolean;
}

const PartnerColumnHeader = ({ partner, partners, slug, onChange, onClear, onRequestQuote, quoteSubmitting }: ColProps) => {
  const basic = isBasicPartner(partner);
  return (
  <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
    {partner ? (
      <div className="relative flex flex-col items-center justify-center text-center">
        <Link
          to={`/partner/${partner.slug}`}
          className="group block"
          aria-label={`Gå till ${partner.name}s profil`}
        >
          {partner.logo_url && !basic ? (
            <img
              src={partner.logo_url}
              alt={`${partner.name} logotyp`}
              width="176"
              height="176"
              className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 object-contain rounded-lg bg-white border border-slate-100 p-2 transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-lg bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-muted-foreground/60">{partner.name.slice(0, 2).toUpperCase()}</span>
            </div>
          )}
        </Link>
        <p className="mt-2 text-sm font-semibold text-slate-800">{partner.name}</p>
        {basic ? (
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
            <Info className="w-3 h-3" />
            Basic-profil
          </span>
        ) : (
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/10 px-2.5 py-0.5 text-[11px] font-medium text-[hsl(var(--accent))]">
            <BadgeCheck className="w-3 h-3" />
            Verifierad partner
          </span>
        )}
        <button
          onClick={onClear}
          className="absolute top-0 right-0 text-slate-600 hover:text-slate-900 shrink-0 p-1"
          aria-label="Rensa val"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ) : (
      <div className="space-y-1.5">
        <div className="h-28 sm:h-36 lg:h-44 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-500">
          Välj partner nedan
        </div>
      </div>
    )}

    <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5">
      <Select value={slug || undefined} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-sm bg-slate-50 border-slate-200 hover:border-slate-300 px-2">
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
              {isBasicPartner(p) ? " · Basic-profil" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {partner && basic && (
        <p className="text-[11px] leading-relaxed text-slate-500">
          Kontaktväg via d365.se är ännu inte aktiverad för denna partner. Uppgifterna nedan är
          sammanställda av d365.se från publika källor.
        </p>
      )}
      {partner && !basic && onRequestQuote && (
        <Button
          type="button"
          size="sm"
          onClick={onRequestQuote}
          disabled={quoteSubmitting}
          aria-busy={quoteSubmitting}
          className="w-full h-8 bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Mail className="w-4 h-4 mr-1.5" />
          {quoteSubmitting ? "Skickar…" : "Ställ en fråga till denna partner"}
        </Button>
      )}
    </div>
  </div>
  );
};



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
  subtitle,
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
  subtitle?: string;
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
        <div className="flex flex-col gap-0.5">
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
          {subtitle && (
            <p className={`text-sm leading-relaxed ${warn ? "text-[hsl(var(--warning-foreground))]/90" : "text-[hsl(var(--muted-dark))]"}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className={gridCls}>
        <div className="border-r border-[hsl(var(--border))]">
          <Cell mobileLabel={aName}>{a}</Cell>
        </div>
        <div className={showC ? "border-r border-[hsl(var(--border))]" : ""}>
          <Cell mobileLabel={bName}>{b}</Cell>
        </div>
        {showC && (
          <div>
            <Cell mobileLabel={cName}>{c}</Cell>
          </div>
        )}
      </div>
    </div>
  );
};

const renderValue = (v: string | null | undefined) =>
  v && v.trim() ? <span>{v}</span> : EMPTY;

const renderEmptyLabel = (label: string) => (
  <span className="inline-flex items-center gap-2 text-xs text-slate-600 italic">
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-700">
      —
    </span>
    {label}
  </span>
);

const renderList = (items: string[], emptyLabel?: string) =>
  items.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {items.map((r, i) => (
        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
          {r}
        </span>
      ))}
    </div>
  ) : (
    emptyLabel ? renderEmptyLabel(emptyLabel) : EMPTY
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

const renderAppList = (items: string[], emptyLabel?: string) =>
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
    emptyLabel ? renderEmptyLabel(emptyLabel) : EMPTY
  );

const renderIndustryList = (items: string[], emptyLabel?: string) =>
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
    emptyLabel ? renderEmptyLabel(emptyLabel) : EMPTY
  );

const renderAiProfile = (profile?: AiProfile | null) => {
  if (isAiProfileEmpty(profile)) return EMPTY;
  const p = profile!;
  const caps = (p.capabilities || []).map(labelForCapability).filter(Boolean);
  const areas = (p.relevant_areas || []).map(labelForArea).filter(Boolean);
  const cases = (p.use_cases || []).map(labelForUseCase).filter(Boolean);

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

  // Compact summary line at top so det syns direkt vad partnern erbjuder inom AI
  const summaryBits: string[] = [];
  if (p.delivery_model) summaryBits.push(labelForDelivery(p.delivery_model));
  if (p.experience_level) summaryBits.push(labelForExperience(p.experience_level));
  if (p.project_count_range) summaryBits.push(`${labelForProjectCount(p.project_count_range)} AI-projekt (24 mån)`);

  return (
    <div className="space-y-3">
      {summaryBits.length > 0 && (
        <div className="rounded-md border border-violet-200 bg-violet-50/60 px-2.5 py-1.5 text-xs text-violet-900">
          {summaryBits.join(" · ")}
        </div>
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
  const reasonText = whyChoose.trim() || description.trim();
  if (!reasonText && keyPoints.length === 0) return EMPTY;
  return (
    <div className="space-y-3 text-sm leading-relaxed text-[hsl(var(--foreground))]">
      {reasonText && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Varför välja denna partner
          </p>
          {splitIntoParagraphs(reasonText).map((para, i) => (
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
  const { data: basicPartners = [] } = useBasicPartners();

  /**
   * Basic-partners görs jämförbara genom att endast observerade uppgifter
   * mappas in. Övriga fält lämnas tomma och visas neutralt i tabellen.
   */
  const basicAsPartners = useMemo(
    () =>
      basicPartners.map((bp) => {
        const productKeys = Object.entries(bp.observed_products || {})
          .filter(([, v]) => v === true)
          .map(([k]) => k);
        const applications = Array.from(
          new Set(productKeys.flatMap((k) => BASIC_PRODUCT_APPS[k] || [])),
        );
        const industries = Array.from(
          new Set(
            Object.values(bp.observed_industries || {})
              .flatMap((arr) => arr || [])
              .map((s) => (s || "").trim())
              .filter(Boolean),
          ),
        );
        const geography = Array.from(
          new Set(
            Object.values(bp.observed_delivery_geo || {})
              .flatMap((arr) => arr || [])
              .map((s) => (s || "").trim())
              .filter(Boolean),
          ),
        );
        return {
          id: bp.id,
          slug: bp.slug,
          name: bp.name,
          logo_url: null,
          description: "",
          applications,
          industries,
          secondary_industries: [],
          geography,
          office_cities: bp.observed_locations || [],
          industry_apps: [],
          is_basic_profile: true,
        } as unknown as DatabasePartner;
      }),
    [basicPartners],
  );

  const allPartners = useMemo(
    () => [...partners, ...basicAsPartners],
    [partners, basicAsPartners],
  );

  const sortedPartners = useMemo(
    () => [...allPartners].sort((x, y) => x.name.localeCompare(y.name, "sv")),
    [allPartners]
  );


  const a = allPartners.find((p) => p.slug === aSlug);
  const b = allPartners.find((p) => p.slug === bSlug);
  const c = allPartners.find((p) => p.slug === cSlug);

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

  const normalizeAppName = (app: string): string => {
    const a = (app || "").trim().toLowerCase().replace(/\s+/g, " ");
    if (
      a === "f&scm" ||
      a === "fscm" ||
      a === "finance & scm" ||
      a === "finance & supply chain" ||
      a === "finance and supply chain management" ||
      a === "finance & scm management"
    ) {
      return "Finance & Supply Chain Management";
    }
    return app.trim();
  };

  const sortApps = (apps: string[]): string[] => {
    const normalized = Array.from(
      new Set(apps.map((a) => normalizeAppName(a || "")).filter(Boolean))
    );
    const erp = normalized.filter((a) => ERP_APPS.has(a)).sort((a, b) => a.localeCompare(b, "sv"));
    const ce = normalized.filter((a) => !ERP_APPS.has(a)).sort((a, b) => a.localeCompare(b, "sv"));
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

  const safeText = (value: unknown): string =>
    typeof value === "string" ? value.trim() : "";

  const splitKeyPoints = (raw: unknown): string[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .map((item) => safeText(item))
        .filter(Boolean)
        .slice(0, 6);
    }
    const text = safeText(raw);
    if (!text) return [];
    return text
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
      | Record<string, { productDescription?: unknown; whyChoose?: unknown; keyPoints?: unknown }>
      | undefined;
    if (!pf) return [];
    // Only show products that match the active filter. If no product filter is
    // active, fall back to all products the partner has profiled.
    const keys = productActive
      ? getProductFilterKeysForApps(apps)
      : (Object.keys(PRODUCT_FILTER_KEY_LABEL) as ProductFilterKey[]);
    const out: ProductInsight[] = [];
    for (const key of keys) {
      const entry = pf[key];
      if (!entry) continue;
      const description = safeText(entry.productDescription);
      const whyChoose = safeText(entry.whyChoose);
      const keyPoints = splitKeyPoints(entry.keyPoints);
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
    // Per-product industri-scoping: union av product_filters[key].industries,
    // industry_apps kopplade till produktens appar, samt industry_pitches
    // vars product-fält matchar. Används för att visa endast branscher inom
    // vald produkt i Fokusbranscher-raden.
    const pitchesRaw = Array.isArray((p as any)?.industry_pitches) ? (p as any).industry_pitches : [];
    const productIndustries: Record<string, string[]> = {};
    (Object.keys(PRODUCT_FILTER_GROUP) as ProductFilterKey[]).forEach((key) => {
      const apps = PRODUCT_FILTER_GROUP[key].apps as readonly string[];
      const pfInds = Array.isArray(pfAll[key]?.industries) ? (pfAll[key]!.industries as string[]) : [];
      const iaInds = industryAppsRaw
        .filter((ia) => apps.includes(ia.application))
        .map((ia) => ia.industry);
      const pitchInds = pitchesRaw
        .filter((ip: any) => ip?.product && apps.includes(String(ip.product).trim()))
        .map((ip: any) => (ip?.industry || "").trim());
      productIndustries[key] = Array.from(
        new Set([...pfInds, ...iaInds, ...pitchInds].map((s) => (s || "").trim()).filter(Boolean)),
      ).sort((x, y) => x.localeCompare(y, "sv"));
    });
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
      focusIndustries: Array.from(
        new Set(
          [
            ...(p?.industries || []),
            ...(p?.secondary_industries || []),
            ...industryAppsRaw.map((ia) => ia.industry),
          ]
            .map((s) => (s || "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, "sv")),
      industries: allIndustries,
      productIndustries,
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

  // Clear selected industry if it no longer has any published partners
  useEffect(() => {
    if (industryFilter && (industryPartnerCounts[industryFilter] || 0) === 0) {
      const next = new URLSearchParams(params);
      next.delete("industry");
      setParams(next, { replace: true });
    }
  }, [industryFilter, industryPartnerCounts, params, setParams]);

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

  // Track which partners are actually compared (2-3 selected) so admin can see participation
  const comparedPartners = useMemo(
    () => [a, b, c].filter((p): p is DatabasePartner => Boolean(p)),
    [a, b, c]
  );
  useTrackFilterExposure({
    partners: comparedPartners.map((p) => ({ slug: p.slug, id: p.id })),
    pagePath: "/jamfor-partners",
    filterContext: {
      product: productFilters.join(",") || null,
      industry: industryFilter || null,
      compared_count: comparedPartners.length,
    },
    enabled: !isLoading && comparedPartners.length >= 2,
  });


  

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

  const scopedFocusIndustries = (data: ReturnType<typeof get>): string[] => {
    if (!productActive) return data.industries;
    const union = Array.from(
      new Set(productFilters.flatMap((k) => data.productIndustries[k] || [])),
    );
    return union.sort((x, y) => x.localeCompare(y, "sv"));
  };


  const AF = applyFilters(A);
  const BF = applyFilters(B);
  const CF = applyFilters(C);


  const [showAllRows, setShowAllRows] = useState(false);

  const R = (props: { label: string; a: React.ReactNode; b: React.ReactNode; c?: React.ReactNode; warn?: boolean; help?: string; subtitle?: string }) => {
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

  // Heuristik: bygg skillnadspunkter mellan valda partners (utan AI-anrop).
  // När produkt- eller branschfilter är aktivt fokuseras punkterna på just
  // det valet: branschlösningar, projektlängd, kostnad, AI-kompetens och
  // geografi för vald produkt/bransch.
  const diffPoints = useMemo(() => {
    if (!hasBoth) return [] as React.ReactNode[];
    const points: React.ReactNode[] = [];
    const sides = [
      { P: A, F: AF, name: A.partner?.name || "Partner 1", partner: a },
      { P: B, F: BF, name: B.partner?.name || "Partner 2", partner: b },
      ...(hasC ? [{ P: C, F: CF, name: C.partner?.name || "Partner 3", partner: c }] : []),
    ];


    const filterLabel = (() => {
      const parts: string[] = [];
      if (productActive) {
        parts.push(
          productFilters
            .map((k) => PRODUCT_KEY_LABEL[k] || k)
            .join(" / "),
        );
      }
      if (industryFilter) parts.push(industryFilter);
      return parts.join(" i ");
    })();

    // 1) Produktportfölj (D365) – vilka produktgrupper varje partner har profilerat
    const allKeys = Object.keys(PRODUCT_FILTER_GROUP) as ProductFilterKey[];
    const shortLabel: Record<ProductFilterKey, string> = {
      bc: "Business Central",
      fsc: "F&SCM",
      commerce: "Commerce",
      hr: "HR",
      sales: "Sales/CI",
      service: "Service (CS/FS/CC)",
      po: "Project Ops",
    };
    const portfolio = sides.map((s) => {
      const pf = (s.partner as any)?.product_filters || {};
      const keys = allKeys.filter((k) => pf[k]);
      return { name: s.name, keys };
    });
    const portfolioSigs = portfolio.map((p) => p.keys.slice().sort().join(","));
    if (new Set(portfolioSigs).size > 1) {
      points.push(
        `Produktportfölj (Dynamics 365): ` +
          portfolio
            .map((p) =>
              `${p.name} ${p.keys.length} områden (${p.keys.map((k) => shortLabel[k]).join(", ") || "—"})`,
            )
            .join("; ") + ".",
      );
    }

    // 2) Branschfokus inom vald produkt – bredd vs specialisering
    if (productActive) {
      productFilters.forEach((key) => {
        const label = PRODUCT_KEY_LABEL[key] || key;
        const focus = sides
          .map((s) => ({
            name: s.name,
            inds: s.P.productIndustries[key] || [],
          }))
          .filter((x) => x.inds.length > 0);
        if (focus.length >= 2 && new Set(focus.map((f) => f.inds.length)).size > 1) {
          const min = Math.min(...focus.map((f) => f.inds.length));
          points.push(
            `Branschfokus (${label}): ` +
              focus
                .map((f) => {
                  const tag = f.inds.length <= 3 ? "specialist" : f.inds.length >= 8 ? "bred" : "fokuserad";
                  return `${f.name} ${f.inds.length} branscher (${tag})`;
                })
                .join(", ") + ".",
          );
        }

        // 3) Övriga branscher inom vald produkt utöver filtret
        if (industryFilter) {
          const others = sides
            .map((s) => ({
              name: s.name,
              list: (s.P.productIndustries[key] || []).filter((i) => i !== industryFilter),
            }))
            .filter((s) => s.list.length > 0);
          if (others.length > 0) {
            const sigs = others.map((o) => o.list.slice().sort().join("|"));
            if (new Set(sigs).size > 1 || others.length < sides.length) {
              points.push(
                `Övriga branscher inom ${label}: ` +
                  others
                    .map((o) => `${o.name} ${o.list.slice(0, 4).join(", ")}${o.list.length > 4 ? ` +${o.list.length - 4}` : ""}`)
                    .join("; ") + ".",
              );
            }
          }
        }
      });
    }

    // 4) Branschlösningar för valt filter – nämn endast partners som HAR lösningar
    if (productActive || industryFilter) {
      const withSolutions = sides.filter((s) => s.F.industryApps.length > 0);
      if (withSolutions.length > 0) {
        const iaTexts = withSolutions.map((s) => {
          const list = s.F.industryApps;
          const names = list.slice(0, 3).map((ia) => ia.name).join(", ");
          return `${s.name} har ${list.length} branschlösning${list.length === 1 ? "" : "ar"} (${names})`;
        });
        points.push(`Branschlösningar${filterLabel ? ` för ${filterLabel}` : ""}: ${iaTexts.join("; ")}.`);
      }
    }

    // 5) Projektlängd + kostnad per vald produkt – endast partners med data
    if (productActive) {
      productFilters.forEach((key) => {
        const label = PRODUCT_KEY_LABEL[key] || key;
        const metrics = sides.map((s) => ({
          name: s.name,
          ...getProductMetrics(s.partner, key),
        }));
        const lens = metrics.filter((m) => m.length);
        if (lens.length >= 2 && new Set(lens.map((m) => m.length)).size > 1) {
          points.push(
            `Typisk projektlängd (${label}): ` +
              lens.map((m) => `${m.name} ${m.length}`).join(", ") + ".",
          );
        }
        const costs = metrics.filter((m) => m.cost);
        if (costs.length >= 2 && new Set(costs.map((m) => m.cost)).size > 1) {
          points.push(
            `Typisk kostnadsnivå (${label}): ` +
              costs.map((m) => `${m.name} ${m.cost}`).join(", ") + ".",
          );
        }
      });
    }

    // 6) AI-förmågor – bryt ut förmågor, projektvolym och impact
    const aiSides = sides.map((s) => {
      const relevant = productActive
        ? s.P.ai.filter((x) => productFilters.includes(x.productKey as ProductFilterKey))
        : s.P.ai;
      const caps = Array.from(new Set(relevant.flatMap((x) => x.capabilities)));
      const projCounts = Array.from(new Set(relevant.map((x) => x.projectCount).filter(Boolean)));
      const hasImpact = relevant.some((x) => x.businessImpact || x.caseDescription);
      return { name: s.name, caps, projCounts, hasImpact, count: relevant.length };
    });
    const withAi = aiSides.filter((s) => s.caps.length > 0 || s.projCounts.length > 0 || s.hasImpact);
    if (withAi.length > 0) {
      // Förmågor – översätt slugs till begripliga svenska tier-etiketter med
      // förklarande tooltip. Hoppa över partners som inte har registrerat några
      // AI-förmågor (tomt = säger inget för besökaren).
      const aiSidesLabeled = aiSides.map((s) => ({
        ...s,
        labels: describeAiCapabilities(s.caps),
      }));
      const withCaps = aiSidesLabeled.filter((s) => s.labels.length > 0);
      const capsSigs = aiSidesLabeled.map((s) =>
        s.labels.map((l) => l.label).sort().join(","),
      );
      if (withCaps.length >= 2 && new Set(capsSigs).size > 1) {
        // Samla unika förklaringar för legend under bullet
        const legendMap = new Map<string, string>();
        for (const s of withCaps) {
          for (const l of s.labels) {
            if (l.help && !legendMap.has(l.label)) legendMap.set(l.label, l.help);
          }
        }
        points.push(
          <div key="ai-caps">
            <div>
              <span className="font-medium">AI-förmågor{productActive ? ` (${filterLabel})` : ""}:</span>{" "}
              {withCaps.map((s, i) => {
                const shown = s.labels.slice(0, 3);
                const extra = s.labels.length - shown.length;
                return (
                  <span key={s.name}>
                    {i > 0 ? "; " : ""}
                    {s.name} –{" "}
                    {shown.map((l, j) => (
                      <span key={l.label}>
                        {j > 0 ? ", " : ""}
                        <span
                          title={l.help}
                          className="underline decoration-dotted decoration-muted-foreground/60 underline-offset-2 cursor-help"
                        >
                          {l.label}
                        </span>
                      </span>
                    ))}
                    {extra > 0 ? ` +${extra}` : ""}
                  </span>
                );
              })}
              .
            </div>
            {legendMap.size > 0 && (
              <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground list-none pl-0">
                {Array.from(legendMap.entries()).map(([label, help]) => (
                  <li key={label}>
                    <span className="font-medium text-foreground/80">{label}:</span> {help}
                  </li>
                ))}
              </ul>
            )}
          </div>,
        );
      }
      // Projektvolym
      const projSigs = aiSides.map((s) => s.projCounts.slice().sort().join(","));
      if (new Set(projSigs).size > 1 && aiSides.some((s) => s.projCounts.length > 0)) {
        points.push(
          `AI-projektvolym: ` +
            aiSides
              .filter((s) => s.projCounts.length > 0)
              .map((s) => `${s.name} ${s.projCounts.join(" / ")} projekt`)
              .join(", ") + ".",
        );
      }
    }

    // 7) Geografi – endast partners med angiven geografi
    const geoSides = sides.filter((s) => s.P.geography.length > 0);
    if (
      geoSides.length >= 2 &&
      new Set(geoSides.map((s) => s.P.geography.slice().sort().join(","))).size > 1
    ) {
      const geoTexts = geoSides.map((s) => `${s.name} ${s.P.geography.join(", ")}`);
      points.push(`Geografisk täckning: ${geoTexts.join("; ")}.`);
    }

    // 8) Teamstorlek som kompletterande signal
    const teams = sides.filter((s) => s.P.teamSize);
    if (teams.length >= 2 && new Set(teams.map((t) => t.P.teamSize)).size > 1) {
      points.push(`Teamstorlek i Sverige: ${teams.map((t) => `${t.name} ${t.P.teamSize}`).join(", ")}.`);
    }

    return points.slice(0, 10);
  }, [hasBoth, hasC, A, B, C, AF, BF, CF, a, b, c, productActive, productFilterRaw, industryFilter]);


  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Jämför Dynamics 365-partner sida vid sida | d365.se"
        description="Jämför två till tre Microsoft Dynamics 365-partner mot samma beslutsprofil: positionering, leveransbild, fakta och 'när passar vi inte'."
        canonicalPath="/jamfor-partners"
      />
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <header className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Jämförelsevy
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  Hitta rätt Dynamics 365-partner
                </h1>
                <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
                  Alla partner i jämförelsen är relevanta kandidater. Här ser ni var de skiljer sig åt och vilken typ av företag de passar bäst för.
                </p>
            </header>

            {isLoading ? (
              <div className="text-center text-muted-foreground py-10">Laddar partner…</div>
            ) : (
              <>
                {/* Step 1 – Filter by product and industry */}
                <div className="mb-6">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1.5 ml-1">
                    1. Välj produkt
                  </label>
                  <span className="block text-sm text-[hsl(var(--muted-foreground))] mb-3 ml-1">
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
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                            selected
                              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm"
                              : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.5)]"
                          }`}
                          aria-pressed={selected}
                        >
                          <img src={c.icon} alt="" aria-hidden="true" className="w-4 h-4 shrink-0" />
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
                  <span className="block text-sm text-[hsl(var(--muted-foreground))] mb-3 ml-1">
                    Endast partners med vald fokusbransch visas i nästa steg
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
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
                        <span className="text-[11px] font-medium text-muted-foreground">Alla branscher</span>
                      </div>
                      <div className="p-1">
                        <span className="text-[10px] font-semibold block">Alla branscher</span>
                        <span className="text-[9px] text-muted-foreground">
                          {allIndustryEligibleCount} {allIndustryEligibleCount === 1 ? "partner" : "partners"}
                        </span>
                      </div>
                    </button>

                    {STANDARD_INDUSTRIES.filter((ind) => (industryPartnerCounts[ind.name] || 0) > 0).map((ind) => {
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

                {/* Step 3 – Pick 2-3 partners (filtered by step 1) */}
                <div className="mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] ml-1">
                    3. Välj 2–3 partners att jämföra
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] ml-1 mt-0.5">
                    {productActive || industryFilter
                      ? `${eligiblePartners.length} partner${eligiblePartners.length === 1 ? "" : "s"} matchar urvalet`
                      : "Visar alla publicerade partners – välj produkt och bransch ovan för att smalna av"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <PartnerColumnHeader
                    partner={a}
                    partners={eligiblePartners}
                    slug={aSlug}
                    onChange={(s) => setSlot("a", s)}
                    onClear={() => setSlot("a", "")}
                    onRequestQuote={a ? () => setQuoteFor({ recipients: [{ slug: a.slug, name: a.name }], mode: "quote" }) : undefined}
                    quoteSubmitting={isSubmittingQuote}
                  />
                  <PartnerColumnHeader
                    partner={b}
                    partners={eligiblePartners}
                    slug={bSlug}
                    onChange={(s) => setSlot("b", s)}
                    onClear={() => setSlot("b", "")}
                    onRequestQuote={b ? () => setQuoteFor({ recipients: [{ slug: b.slug, name: b.name }], mode: "quote" }) : undefined}
                    quoteSubmitting={isSubmittingQuote}
                  />
                  <PartnerColumnHeader
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
                    Välj minst två partner ovan för att se jämförelsen.
                  </div>
                )}


                {hasBoth && (
                  <>
                    {(() => {
                      const aiPartners = [a, b, ...(c ? [c] : [])].filter(
                        (p): p is DatabasePartner => !!p,
                      );
                      return aiPartners.length >= 2 ? (
                        <AiCompareInsights
                          partners={aiPartners}
                          productFilters={productFilters}
                          industry={industryFilter || ""}
                        />
                      ) : null;
                    })()}
                    {/* Heuristisk diff-sammanfattning (regelbaserad, faktakontroll) */}
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

                    {/* Positionering: partnerns beslutsprofil (visas alltid ovanför toggle) */}
                    <section className="space-y-3 mb-6">
                      <SectionTitle icon={Target} title="Positionering" />
                      <R
                        label="Vi är valet när…"
                        help="Partnerns egen beslutsprofil: när de är rätt val för kunden."
                        a={renderPositioningCell(A.positioning)}
                        b={renderPositioningCell(B.positioning)}
                        c={renderPositioningCell(C.positioning)}
                      />
                    </section>

                    {/* Fokus & kompetens: alltid synligt ovanför toggle */}
                    <section className="space-y-3 mb-6">
                      <SectionTitle icon={Target} title="Fler partnerdetaljer" />

                      <R
                        label="Fokusbranscher"
                        subtitle="Branscher där partnern har valt att bygga särskild djupkompetens – ofta baserat på referensprojekt och branschspecifika lösningar."
                        a={renderIndustryList(scopedFocusIndustries(A), "Inga fokusbranscher uppgivna")}
                        b={renderIndustryList(scopedFocusIndustries(B), "Inga fokusbranscher uppgivna")}
                        c={renderIndustryList(scopedFocusIndustries(C), "Inga fokusbranscher uppgivna")}
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
                                      {" – "}
                                      {[ia.application, ia.industry].filter(Boolean).join(" · ")}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            renderEmptyLabel("Inga branschapplikationer uppgivna")
                          );
                        return (
                          <R
                            label="Speciella Branschapplikationer"
                            subtitle="Certifierade tillägg från Microsoft Marketplace som partnern erbjuder för specifika branscher eller verksamheter."
                            help="Branschlösningar / vertikala tillägg som partnern erbjuder ovanpå Dynamics 365."
                            a={renderIA(AF.industryApps)}
                            b={renderIA(BF.industryApps)}
                            c={renderIA(CF.industryApps)}
                          />
                        );
                      })()}

                      <R
                        label="Kompetens inom Dynamics 365"
                        subtitle="Överblick över samtliga Dynamics 365-applikationer som partnern arbetar med."
                        warn
                        help="Alla Dynamics 365-applikationer som partnern arbetar med – oavsett vilka produkter som är valda i jämförelsen."
                        a={renderAppList(A.apps, "Inga Dynamics 365-applikationer uppgivna")}
                        b={renderAppList(B.apps, "Inga Dynamics 365-applikationer uppgivna")}
                        c={renderAppList(C.apps, "Inga Dynamics 365-applikationer uppgivna")}
                      />
                    </section>

                    {/* Toggle: fördjupning */}

                    <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                      <p className="text-xs text-muted-foreground">
                        {showAllRows
                          ? "Visar fördjupade partnerdetaljer nedan."
                          : "Positioneringen och fokus ovan räcker ofta för ett första beslut. Öppna mer om ni vill fördjupa."}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAllRows((v) => !v)}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {showAllRows ? "Dölj partnerdetaljer" : "Visa mer partnerdetaljer"}
                      </button>
                    </div>

                  </>
                )}

                {hasBoth && (
                  <div className="space-y-8">
                    {showAllRows && (
                    <>
                    <section className="space-y-3">
                      <SectionTitle icon={Target} title="Ytterligare fördjupning" />




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

                      {/* Längre innehåll längst ned – AI-profil, produktbeskrivningar och branschpitchar */}
                      <R
                        label="AI, Copilot & Automation"
                        help="Partnerns samlade AI- och automationsprofil: leveransmodell, förmågor, relevanta områden, use cases, erfarenhet och underlag. Bygger på partnerns egna uppgifter."
                        a={renderAiProfile(((A.partner as any)?.ai_profile) as AiProfile | null)}
                        b={renderAiProfile(((B.partner as any)?.ai_profile) as AiProfile | null)}
                        c={renderAiProfile(((C.partner as any)?.ai_profile) as AiProfile | null)}
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
                      {(() => {
                        const allowedApps = productFilters.length > 0
                          ? new Set(productFilters.flatMap((k) => PRODUCT_FILTER_GROUP[k].apps as readonly string[]))
                          : null;
                        const filterPerApp = (list: { app: string; count: string }[]) =>
                          allowedApps ? list.filter((i) => allowedApps.has(i.app)) : list;
                        const renderCell = (perApp: { app: string; count: string }[], fallback: string) => {
                          const filtered = filterPerApp(perApp);
                          if (filtered.length > 0) {
                            return renderList(filtered.map((i) => `${i.app}: ${i.count}`));
                          }
                          // If a product filter is active, don't fall back to the global count
                          // (it isn't scoped to the selected product).
                          if (allowedApps) return renderValue("");
                          return renderValue(fallback);
                        };
                        const helpText = allowedApps
                          ? "Antal genomförda implementationer för den valda produktens applikationer. Säger något om volym, inte om kvalitet eller branschpassning – be alltid om referenser i den bransch ni befinner er i."
                          : "Antal genomförda D365-implementationer per applikation. Säger något om volym, inte om kvalitet eller branschpassning – be alltid om referenser i den bransch ni befinner er i.";
                        return (
                          <R
                            label="Genomförda implementationer"
                            help={helpText}
                            warn={!!allowedApps}
                            a={renderCell(A.implementationsPerApp, A.implementations)}
                            b={renderCell(B.implementationsPerApp, B.implementations)}
                            c={renderCell(C.implementationsPerApp, C.implementations)}
                          />
                        );
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
                    </>
                    )}



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
                                Skicka samma förfrågan till <span className="font-semibold">{joined}</span> – du får jämförbara svar.
                              </p>
                              <p className="text-xs text-slate-500 mb-4">
                                Varje partner kontaktas separat och ser bara sin egen förfrågan – aldrig samma tråd.
                              </p>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-2">
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
                                    Boka Demo/Genomgång
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
                                Kostnadsfritt. d365.se säljer inte implementationer – förfrågan går direkt till respektive partner med kopia till dig och d365.se.
                              </p>
                            </div>
                          );
                        }
                        return (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 space-y-2">
                            <p>Välj minst två anslutna partners ovan för att kunna skicka samma förfrågan till alla och få jämförbara svar.</p>
                          </div>
                        );
                      })()}

                      {/* Kontakta enskilt */}
                      {(A.partner || B.partner || C.partner) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
                          {[A, B, C].map((side, idx) => {
                            if (!side.partner) return null;
                            return (
                              <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col justify-between">
                                <div>
                                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    Endast Partner {["A", "B", "C"][idx]}
                                  </div>
                                  <div className="text-xs sm:text-sm font-medium text-foreground mb-3 break-words">
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
                                    Boka Demo/Genomgång
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
                                    Få en Prisindikation
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>


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

      <CompareStickyCTA
        partners={[a, b, c].filter(Boolean).map((p: any) => ({ slug: p.slug, name: p.name }))}
        selectedProduct={productFilters.length === 1 ? PRODUCT_FILTER_GROUP[productFilters[0]].label : undefined}
        selectedIndustry={industryFilter || undefined}
        sourcePage="compare-partners"
      />

      <Footer />
    </div>
  );
};

export default ComparePartners;
