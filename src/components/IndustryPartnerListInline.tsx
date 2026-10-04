import WhyTheseResults from "@/components/WhyTheseResults";
import PartnerSelectionFacts from "@/components/partner/PartnerSelectionFacts";
import { useMemo } from "react";
import { optimizedLogo } from "@/lib/optimizedLogo";
import { Link } from "react-router-dom";
import { usePartners } from "@/hooks/usePartners";
import { collectPartnerIndustries } from "@/lib/partnerIndustries";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";

interface Props {
  industry: string;
}

/**
 * Renders all currently published (is_featured=true) partners for a given
 * industry as a compact card grid. Pulls live from the database so the list
 * always reflects current agreements – used as a backup at the bottom of each
 * branschguide article in Kunskapscentret.
 */
const IndustryPartnerListInline = ({ industry }: Props) => {
  const { data: partners, isLoading } = usePartners();

  const matching = useMemo(
    () =>
      (partners || [])
        .filter((p) => p.is_featured === true)
        .filter((p) => collectPartnerIndustries(p).has(industry))
        .sort((a, b) => a.name.localeCompare(b.name, "sv")),
    [partners, industry],
  );

  // Nivå 1 – exponering: partners som listas i branschguiden i Kunskapscentret.
  usePartnerImpressions(
    "partner_filter_impression",
    matching,
    { industry, surface: "knowledge_industry_guide" },
    !isLoading,
  );

  if (isLoading) return null;
  if (matching.length === 0) return null;

  return (
    <section className="not-prose my-10 border-y border-border py-6">
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        Publicerade partners för {industry} ({matching.length})
      </h3>
      <p className="mb-5 text-sm text-muted-foreground">
        Dessa partners har registrerad branschinriktning inom {industry.toLowerCase()}.
      </p>
      <WhyTheseResults order="alphabetical" criteria={[industry]} className="mb-5" />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matching.map((p) => (
          <li key={p.id} className="rounded-lg border border-border bg-card p-3">
            <Link
              to={`/partner/${p.slug}/`}
              className="flex items-center gap-3 p-3 text-foreground transition hover:text-primary"
            >
              {p.logo_url ? (
                <img
                  src={optimizedLogo(p.logo_url)}
                  alt={`${p.name} logotyp`}
                  loading="lazy"
                  className="h-10 w-10 flex-shrink-0 rounded object-contain"
                />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-muted text-xs font-semibold text-muted-foreground">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-foreground">
                {p.name}
              </span>
            </Link>
            <PartnerSelectionFacts partner={p} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IndustryPartnerListInline;
