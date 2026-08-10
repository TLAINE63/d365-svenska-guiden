import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeftRight, Check } from "lucide-react";
import partnerDataJson from "@/data/partnerData.json";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";

type RawPartner = {
  slug: string;
  name: string;
  description?: string;
  positioning_statement?: string;
  ai_summary?: string;
  logo_url?: string;
  logo_dark_bg?: boolean;
  applications?: string[];
  industries?: string[];
  secondary_industries?: string[];
  is_featured?: boolean;
  product_filters?: Record<string, { industries?: string[] } | null>;
  industry_apps?: Record<string, unknown> | unknown[];
};

const APP_BADGES: Array<{ match: (a: string[]) => boolean; label: string }> = [
  { match: (a) => a.includes("Business Central"), label: "Business Central" },
  { match: (a) => a.includes("Finance") || a.includes("Supply Chain Management"), label: "Finance & SCM" },
  { match: (a) => a.includes("Sales"), label: "Sales" },
  { match: (a) => a.includes("Customer Service"), label: "Customer Service" },
  { match: (a) => a.includes("Field Service"), label: "Field Service" },
  { match: (a) => a.includes("Contact Center"), label: "Contact Center" },
  { match: (a) => a.includes("Customer Insights (Marketing)"), label: "Marketing" },
];

type ProductId =
  | "all"
  | "bc"
  | "fscm"
  | "sales"
  | "customer-service"
  | "field-service"
  | "contact-center"
  | "marketing";

const PRODUCT_FILTERS: Array<{ id: ProductId; label: string }> = [
  { id: "all", label: "Alla lösningar" },
  { id: "bc", label: "Business Central" },
  { id: "fscm", label: "Finance & Supply Chain" },
  { id: "sales", label: "Sales" },
  { id: "customer-service", label: "Customer Service" },
  { id: "field-service", label: "Field Service" },
  { id: "contact-center", label: "Contact Center" },
  { id: "marketing", label: "Marketing" },
];

const matchesProduct = (apps: string[] = [], id: ProductId) => {
  if (id === "all") return true;
  if (id === "bc") return apps.includes("Business Central");
  if (id === "fscm") return apps.includes("Finance") || apps.includes("Supply Chain Management");
  if (id === "sales") return apps.includes("Sales");
  if (id === "customer-service") return apps.includes("Customer Service");
  if (id === "field-service") return apps.includes("Field Service");
  if (id === "contact-center") return apps.includes("Contact Center");
  if (id === "marketing") return apps.includes("Customer Insights (Marketing)");
  return true;
};

const productAreas = (apps: string[] = []) =>
  APP_BADGES.filter((b) => b.match(apps)).map((b) => b.label);

const shortText = (p: RawPartner) => {
  const raw = p.positioning_statement || p.description || p.ai_summary || "";
  const clean = raw.replace(/\s+/g, " ").trim();
  return clean.length > 150 ? `${clean.slice(0, 147).trimEnd()}…` : clean;
};

const partnerIndustries = (p: RawPartner) => {
  const set = new Set<string>([...(p.industries || []), ...(p.secondary_industries || [])]);
  Object.values(p.product_filters || {}).forEach((f) =>
    (f?.industries || []).forEach((i) => set.add(i))
  );
  if (p.industry_apps && !Array.isArray(p.industry_apps)) {
    Object.keys(p.industry_apps).forEach((i) => set.add(i));
  }
  return [...set];
};

export default function HomeVerifiedPartnersGrid() {
  const { selected, isSelected, toggle, clear, max } = usePartnerCompare();
  const [product, setProduct] = useState<ProductId>("all");
  const [industry, setIndustry] = useState<string>("");

  const allPartners = useMemo(
    () =>
      (partnerDataJson as RawPartner[])
        .filter((p) => p.is_featured)
        .sort((a, b) => a.name.localeCompare(b.name, "sv")),
    []
  );

  const availableIndustries = useMemo(() => {
    const covered = new Set<string>();
    allPartners.forEach((p) => partnerIndustries(p).forEach((i) => covered.add(i)));
    return STANDARD_INDUSTRIES.filter((i) => covered.has(i.name));
  }, [allPartners]);

  const filtered = useMemo(
    () =>
      allPartners.filter(
        (p) =>
          matchesProduct(p.applications, product) &&
          (!industry || partnerIndustries(p).includes(industry))
      ),
    [allPartners, product, industry]
  );

  if (allPartners.length === 0) return null;

  const chipBase =
    "px-3.5 py-2 rounded text-[13px] font-semibold border transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cta-orange))]";

  return (
    <section className="py-12 sm:py-16 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
          <div>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
              Verifierade partners
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-semibold text-foreground tracking-tight leading-tight max-w-3xl">
              {allPartners.length} verifierade Dynamics 365-partners
            </h2>
            <p className="text-[15px] text-muted-foreground mt-2 max-w-2xl">
              Publicerade partnerprofiler med produktområden, branscherfarenhet och fördjupning – markera upp till {max} partners och jämför dem sida vid sida.
            </p>
          </div>
          <Link
            to="/valjdynamics365partner/"
            className="text-sm font-semibold text-[hsl(var(--cta-orange))] inline-flex items-center gap-1.5 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cta-orange))] rounded"
          >
            Se alla partners med fler filter <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8">
          {/* Industry filter – left column */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">
              Bransch
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setIndustry("")}
                aria-pressed={industry === ""}
                className={`text-left px-3 py-2 rounded text-[13px] font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cta-orange))] ${
                  industry === ""
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-foreground border-border hover:border-foreground/40"
                }`}
              >
                Alla branscher
              </button>
              {availableIndustries.map((i) => (
                <button
                  key={i.slug}
                  type="button"
                  onClick={() => setIndustry(i.name === industry ? "" : i.name)}
                  aria-pressed={industry === i.name}
                  className={`text-left px-3 py-2 rounded text-[13px] font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cta-orange))] ${
                    industry === i.name
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-foreground border-border hover:border-foreground/40"
                  }`}
                >
                  {i.name}
                </button>
              ))}
            </div>
          </aside>

          <div>
            {/* Product filter – top */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {PRODUCT_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setProduct(f.id)}
                  aria-pressed={product === f.id}
                  className={`${chipBase} ${
                    product === f.id
                      ? "bg-[hsl(var(--cta-orange))] text-white border-[hsl(var(--cta-orange))] shadow"
                      : "bg-card text-foreground border-border hover:border-[hsl(var(--cta-orange))]/60"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Compare bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 rounded border border-border bg-muted/40 px-4 py-3">
              <p className="text-[13px] text-muted-foreground">
                {selected.length === 0
                  ? `Markera upp till ${max} partners för att jämföra dem sida vid sida.`
                  : `${selected.length} av ${max} valda: ${selected.map((s) => s.name).join(", ")}`}
              </p>
              <div className="flex items-center gap-2">
                {selected.length > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="text-[13px] font-semibold text-muted-foreground hover:text-foreground underline"
                  >
                    Rensa
                  </button>
                )}
                <Link
                  to="/jamfor-partners/"
                  aria-disabled={selected.length < 2}
                  onClick={(e) => {
                    if (selected.length < 2) e.preventDefault();
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded text-[13px] font-semibold transition-all ${
                    selected.length >= 2
                      ? "bg-[hsl(var(--cta-orange))] text-white hover:brightness-110"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Jämför sida vid sida
                </Link>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Inga partners matchar valet just nu.{" "}
                <Link to="/valjdynamics365partner/" className="text-[hsl(var(--cta-orange))] font-semibold hover:underline">
                  Se alla partners
                </Link>
                .
              </div>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {filtered.map((p) => {
                  const areas = productAreas(p.applications);
                  const active = isSelected(p.slug);
                  return (
                    <li key={p.slug} className="relative">
                      <Link
                        to={`/partner/${p.slug}/`}
                        className="group h-full flex flex-col bg-card border border-border rounded-lg p-4 pb-14 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[hsl(var(--cta-orange))]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cta-orange))] focus-visible:ring-offset-2"
                      >
                        <div
                          className={`h-14 flex items-center justify-center rounded mb-3 px-2 ${
                            p.logo_dark_bg ? "bg-[hsl(var(--hero-dark))]" : "bg-muted/40"
                          }`}
                        >
                          {p.logo_url ? (
                            <img
                              src={p.logo_url}
                              alt={`${p.name} logotyp`}
                              loading="lazy"
                              className="max-h-10 max-w-full object-contain"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-foreground">{p.name}</span>
                          )}
                        </div>

                        <div className="mb-1.5">
                          <VerifiedPartnerBadge />
                        </div>

                        <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-1.5">
                          {p.name}
                        </h3>


                        {areas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {areas.slice(0, 3).map((a) => (
                              <span
                                key={a}
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20"
                              >
                                {a}
                              </span>
                            ))}
                            {areas.length > 3 && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                +{areas.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-[12.5px] text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                          {shortText(p)}
                        </p>
                      </Link>

                      <button
                        type="button"
                        onClick={() => toggle({ slug: p.slug, name: p.name })}
                        aria-pressed={active}
                        aria-label={`Markera ${p.name} för jämförelse`}
                        className={`absolute bottom-3 left-4 right-4 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-[11.5px] font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cta-orange))] ${
                          active
                            ? "bg-[hsl(var(--cta-orange))] text-white border-[hsl(var(--cta-orange))]"
                            : "bg-transparent text-foreground border-border hover:border-[hsl(var(--cta-orange))] hover:text-[hsl(var(--cta-orange))]"
                        }`}
                      >
                        {active ? <Check className="w-3.5 h-3.5" /> : <ArrowLeftRight className="w-3.5 h-3.5" />}
                        {active ? "Vald" : "Jämför"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
