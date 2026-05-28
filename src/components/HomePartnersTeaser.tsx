import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import partnerDataJson from "@/data/partnerData.json";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { companySizes } from "@/data/partners";
import PartnerCard from "@/components/PartnerCard";
import type { DatabasePartner } from "@/hooks/usePartners";


type RawPartner = {
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  applications?: string[];
  industries?: string[];
  secondary_industries?: string[];
  office_cities?: string[];
  is_featured?: boolean;
  product_filters?: Record<string, { companySize?: string[]; industries?: string[] }>;
};

const PRODUCT_KEYS = ["bc", "fsc", "sales", "service"] as const;

const FSCM_APPS = new Set(["Finance", "Supply Chain Management"]);
const CRM_APPS = new Set([
  "Sales",
  "Customer Service",
  "Field Service",
  "Contact Center",
  "Customer Insights (Marketing)",
]);

const APP_BADGES: Array<{ match: (a: string[]) => boolean; label: string }> = [
  { match: (a) => a.includes("Business Central"), label: "BC" },
  { match: (a) => a.includes("Finance") || a.includes("Supply Chain Management"), label: "F&SCM" },
  { match: (a) => a.includes("Sales"), label: "Sales" },
  { match: (a) => a.includes("Customer Service"), label: "Customer Service" },
  { match: (a) => a.includes("Field Service"), label: "Field Service" },
  { match: (a) => a.includes("Contact Center"), label: "Contact Center" },
  { match: (a) => a.includes("Customer Insights (Marketing)"), label: "Marketing" },
];

type Quick = "all" | "bc" | "fscm" | "sales" | "marketing" | "customer-service" | "field-service" | "contact-center";

const QUICK_FILTERS: Array<{ id: Quick; label: string }> = [
  { id: "all", label: "Alla" },
  { id: "bc", label: "Business Central" },
  { id: "fscm", label: "Finance & Supply Chain" },
  { id: "sales", label: "Sales" },
  { id: "marketing", label: "Marketing" },
  { id: "customer-service", label: "Customer Service" },
  { id: "field-service", label: "Field Service" },
  { id: "contact-center", label: "Contact Center" },
];


// Deterministic shuffle seeded by date so the row is stable per session but rotates daily
const seededShuffle = <T,>(arr: T[], seed: number): T[] => {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = Math.floor((s / 0x7fffffff) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const initials = (name: string) =>
  name
    .replace(/\b(AB|AS|Oy|Ltd|Inc|Group|Sverige|Sweden)\b/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const AVATAR_GRADIENTS = [
  "from-[hsl(180_55%_38%)] to-[hsl(195_60%_28%)]",
  "from-[hsl(160_50%_38%)] to-[hsl(180_55%_28%)]",
  "from-[hsl(20_85%_55%)] to-[hsl(15_75%_45%)]",
  "from-[hsl(220_45%_42%)] to-[hsl(210_50%_30%)]",
  "from-[hsl(280_40%_45%)] to-[hsl(260_45%_35%)]",
];

const avatarGradient = (slug: string) => {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
};

const partnerMatchesQuick = (p: RawPartner, q: Quick) => {
  const apps = p.applications || [];
  if (q === "all") return true;
  if (q === "bc") return apps.includes("Business Central");
  if (q === "fscm") return apps.some((a) => FSCM_APPS.has(a));
  if (q === "sales") return apps.includes("Sales");
  if (q === "marketing") return apps.includes("Customer Insights (Marketing)");
  if (q === "customer-service") return apps.includes("Customer Service");
  if (q === "field-service") return apps.includes("Field Service");
  if (q === "contact-center") return apps.includes("Contact Center");
  return true;
};

const partnerMatchesIndustry = (p: RawPartner, industry: string) => {
  if (!industry) return true;
  return [...(p.industries || []), ...(p.secondary_industries || [])].includes(industry);
};

const partnerMatchesSize = (p: RawPartner, size: string) => {
  if (!size) return true;
  const pf = p.product_filters || {};
  return Object.values(pf).some((f) => (f?.companySize || []).includes(size));
};

export default function HomePartnersTeaser() {
  const allPartners = (partnerDataJson as RawPartner[]).filter((p) => p.is_featured);
  const totalCount = allPartners.length;

  // Only show industries that have at least one featured partner profiled
  // against them via product_filters (matches /branscher and partner filter).
  const availableIndustries = useMemo(() => {
    const covered = new Set<string>();
    allPartners.forEach((p) => {
      PRODUCT_KEYS.forEach((k) => {
        (p.product_filters?.[k]?.industries || []).forEach((i) => covered.add(i));
      });
    });
    return STANDARD_INDUSTRIES.filter((i) => covered.has(i.name));
  }, [allPartners]);

  const [quick, setQuick] = useState<Quick>("all");
  const [industry, setIndustry] = useState<string>("");
  const [size, setSize] = useState<string>("");

  // Daily seed
  const seed = useMemo(() => {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }, []);

  const filtered = useMemo(() => {
    const matched = allPartners.filter(
      (p) => partnerMatchesQuick(p, quick) && partnerMatchesIndustry(p, industry) && partnerMatchesSize(p, size)
    );
    return seededShuffle(matched, seed).slice(0, 3);
  }, [allPartners, quick, industry, size, seed]);

  const baseChip =
    "px-4 py-2 rounded-full text-[13px] font-semibold border transition-all whitespace-nowrap";
  const activeChip = "bg-primary text-primary-foreground border-primary shadow";
  const inactiveChip =
    "bg-white/10 text-white/80 border-white/20 hover:border-white/40 hover:text-white";

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-br from-[hsl(192_48%_14%)] via-[hsl(192_46%_18%)] to-[hsl(197_42%_22%)] border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex items-end justify-between gap-6 mb-6 flex-wrap">
          <div>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 mb-2">
              Partners
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-semibold text-white tracking-tight leading-tight max-w-3xl">
              Jämför {totalCount} partners på det som faktiskt skiljer dem åt
            </h2>
    <section className="section-divider section-divider-dark py-14 sm:py-20 bg-gradient-to-br from-[hsl(192_48%_14%)] via-[hsl(192_46%_18%)] to-[hsl(197_42%_22%)] border-b border-white/10">

          <Link
            to="/valjdynamics365partner/"
            className="bg-[hsl(var(--cta-orange))] text-white font-semibold text-sm px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 hover:brightness-110 transition-all shadow"
          >
            Se alla partners <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2 flex-wrap mb-7">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setQuick(f.id)}
              className={`${baseChip} ${quick === f.id ? activeChip : inactiveChip}`}
            >
              {f.label}
            </button>
          ))}

          <div className="relative">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={`${baseChip} ${industry ? activeChip : inactiveChip} appearance-none pr-8 cursor-pointer`}
              aria-label="Filtrera på bransch"
            >
              <option value="">Bransch</option>
              {availableIndustries.map((i) => (
                <option key={i.slug} value={i.name}>
                  {i.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">▾</span>
          </div>

          <div className="relative">
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className={`${baseChip} ${size ? activeChip : inactiveChip} appearance-none pr-8 cursor-pointer`}
              aria-label="Filtrera på storlek"
            >
              <option value="">Storlek</option>
              {companySizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">▾</span>
          </div>
        </div>

        {/* Partner cards */}
        {filtered.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-sm text-white/60">
            Inga partners matchar valet just nu.{" "}
            <Link to="/valjdynamics365partner/" className="text-[hsl(var(--cta-orange))] font-semibold hover:underline">
              Se alla partners
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((p) => {
              let productKey: 'bc' | 'fsc' | 'crm' | 'sales' | 'service' | null = null;
              const pf = p.product_filters || {};
              if (quick === "bc" || pf.bc) productKey = 'bc';
              else if (quick === "fscm" || pf.fsc) productKey = 'fsc';
              else if (quick === "sales" || quick === "marketing" || pf.sales) productKey = 'sales';
              else if (quick === "customer-service" || quick === "field-service" || quick === "contact-center" || pf.service) productKey = 'service';

              return (
                <PartnerCard
                  key={p.slug}
                  partner={p as unknown as DatabasePartner}
                  profileUrl={`/partner/${p.slug}/`}
                  colorScheme="primary"
                  productKey={productKey}
                  highlightedIndustry={industry || undefined}
                  highlightedCompanySize={size || undefined}
                />
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
