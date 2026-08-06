import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import partnerDataJson from "@/data/partnerData.json";

type RawPartner = {
  slug: string;
  name: string;
  description?: string;
  positioning_statement?: string;
  ai_summary?: string;
  logo_url?: string;
  logo_dark_bg?: boolean;
  applications?: string[];
  is_featured?: boolean;
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

const productAreas = (apps: string[] = []) =>
  APP_BADGES.filter((b) => b.match(apps)).map((b) => b.label);

const shortText = (p: RawPartner) => {
  const raw = p.positioning_statement || p.description || p.ai_summary || "";
  const clean = raw.replace(/\s+/g, " ").trim();
  return clean.length > 150 ? `${clean.slice(0, 147).trimEnd()}…` : clean;
};

export default function HomeVerifiedPartnersGrid() {
  const partners = useMemo(() => {
    const list = (partnerDataJson as RawPartner[]).filter((p) => p.is_featured);
    return [...list].sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
          <div>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
              Verifierade partners
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-semibold text-foreground tracking-tight leading-tight max-w-3xl">
              {partners.length} verifierade Dynamics 365-partners
            </h2>
            <p className="text-[15px] text-muted-foreground mt-2 max-w-2xl">
              Publicerade partnerprofiler med produktområden, branscherfarenhet och fördjupning – klicka in på profilen för hela bilden.
            </p>
          </div>
          <Link
            to="/valjdynamics365partner/"
            className="text-sm font-semibold text-[hsl(var(--cta-orange))] inline-flex items-center gap-1.5 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cta-orange))] rounded"
          >
            Jämför och filtrera alla partners <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {partners.map((p) => {
            const areas = productAreas(p.applications);
            return (
              <li key={p.slug}>
                <Link
                  to={`/partner/${p.slug}/`}
                  className="group h-full flex flex-col bg-card border border-border rounded-lg p-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[hsl(var(--cta-orange))]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cta-orange))] focus-visible:ring-offset-2"
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

                  <span className="mt-3 text-[12px] font-semibold text-[hsl(var(--cta-orange))] inline-flex items-center gap-1">
                    Se profil
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
