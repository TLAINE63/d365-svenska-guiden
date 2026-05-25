import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import partnerDataJson from "@/data/partnerData.json";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { companySizes } from "@/data/partners";

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
  product_filters?: Record<string, { companySize?: string[] }>;
};

const ERP_APPS = new Set(["Business Central", "Finance", "Supply Chain Management"]);
const SALES_SERVICE_APPS = new Set([
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

type Quick = "all" | "erp" | "sales" | "ai";

const QUICK_FILTERS: Array<{ id: Quick; label: string }> = [
  { id: "all", label: "Alla" },
  { id: "erp", label: "Affärssystem" },
  { id: "sales", label: "Sälj & Service" },
  { id: "ai", label: "AI / Copilot" },
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
  if (q === "erp") return apps.some((a) => ERP_APPS.has(a));
  if (q === "sales") return apps.some((a) => SALES_SERVICE_APPS.has(a));
  if (q === "ai") {
    const hay = `${p.description || ""}`.toLowerCase();
    return hay.includes("copilot") || hay.includes(" ai ") || hay.includes("ai-") || hay.includes("agent");
  }
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
    "bg-card text-foreground/80 border-border hover:border-primary/40 hover:text-foreground";

  return (
    <section className="py-14 sm:py-20 bg-secondary/30 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex items-end justify-between gap-6 mb-6 flex-wrap">
          <div>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
              Partners
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-semibold text-foreground tracking-tight leading-tight max-w-3xl">
              Jämför {totalCount} partners på det som faktiskt skiljer dem åt
            </h2>
          </div>
          <Link
            to="/valjdynamics365partner/"
            className="text-[hsl(var(--cta-orange))] font-semibold text-sm hover:underline inline-flex items-center gap-1.5"
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
              {STANDARD_INDUSTRIES.map((i) => (
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
          <div className="bg-card border border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Inga partners matchar valet just nu.{" "}
            <Link to="/valjdynamics365partner/" className="text-primary font-semibold hover:underline">
              Se alla partners
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((p) => {
              const apps = p.applications || [];
              const badges = APP_BADGES.filter((b) => b.match(apps))
                .slice(0, 2)
                .map((b) => b.label);
              const city = (p.office_cities || [])[0];
              const desc =
                (p.description || "")
                  .replace(/\s+/g, " ")
                  .trim()
                  .slice(0, 110) + ((p.description || "").length > 110 ? "…" : "");

              return (
                <Link
                  key={p.slug}
                  to={`/partner/${p.slug}/`}
                  className="group bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    {p.logo_url ? (
                      <div className="w-12 h-12 rounded-lg bg-white border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={p.logo_url}
                          alt={`${p.name} logotyp`}
                          loading="lazy"
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${avatarGradient(
                          p.slug
                        )} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                      >
                        {initials(p.name)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      {city && (
                        <p className="text-[12.5px] text-muted-foreground mt-0.5 truncate">{city}</p>
                      )}
                    </div>
                  </div>

                  {badges.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {badges.map((b) => (
                        <span
                          key={b}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {desc && (
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed">{desc}</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
