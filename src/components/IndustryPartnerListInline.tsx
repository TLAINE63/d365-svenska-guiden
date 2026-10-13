import WhyTheseResults from "@/components/WhyTheseResults";
import PartnerSelectionFacts from "@/components/partner/PartnerSelectionFacts";
import { useMemo } from "react";
import PartnerCardHeader from "@/components/partner/PartnerCardHeader";
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
            <PartnerCardHeader partner={p} to={`/partner/${p.slug}/`} compact className="-mx-3 -mt-3 mb-3 w-auto border-b border-border p-3" />
            <PartnerSelectionFacts partner={p} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IndustryPartnerListInline;
