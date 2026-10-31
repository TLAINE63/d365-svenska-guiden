import WhyTheseResults from "@/components/WhyTheseResults";
import { useMemo, useState } from "react";
import { useBasicPartners, type ProductKey } from "@/hooks/useBasicPartners";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";
import { filterBasicPartners } from "@/lib/basicPartnerMatch";
import PartnerBasicCard from "@/components/partner/PartnerBasicCard";
import VerifiedOnlyToggle from "@/components/VerifiedOnlyToggle";
import BasicPartnersReveal from "@/components/partner/BasicPartnersReveal";
import { nowrapBrand } from "@/lib/nowrapBrand";

interface ProductBasicPartnersSectionProps {
  /** Applikationer som produktsidan gäller, t.ex. ["Business Central"] */
  applications: string[];
  /** Läsbar etikett för produktområdet, t.ex. "Business Central" */
  productLabel?: string;
  /** Produktområde som redan är känt av sidan och inte upprepas på korten */
  excludeProductKey?: ProductKey;
  industry?: string | null;
  geography?: string | null;
  companySize?: string | null;
  revenue?: string | null;
  /** Antal partnerverifierade profiler som visas ovanför */
  verifiedCount: number;
}

/**
 * Visar grundprofiler (observerad, ej verifierad data) som matchar samma filter
 * som de verifierade partnerkorten på en produktsida. Öppna från start
 * (Thomas 2026-10-31) och döljs med rutan för endast verifierade partners.
 */
export default function ProductBasicPartnersSection({
  applications,
  productLabel,
  excludeProductKey,
  industry = null,
  geography = null,
  companySize = null,
  revenue = null,
  verifiedCount,
}: ProductBasicPartnersSectionProps) {
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const { data: basicPartners } = useBasicPartners();

  const filtered = useMemo(
    () =>
      filterBasicPartners(basicPartners || [], {
        applications,
        industry,
        companySize,
        revenue,
        geography,
      }),
    [basicPartners, applications, industry, companySize, revenue, geography],
  );

  // Nivå 1 – exponering: övriga (ej verifierade) profiler på produktsidan.
  usePartnerImpressions(
    "partner_filter_impression",
    filtered,
    {
      surface: "product_page_basic",
      products: applications.join(","),
      industry: industry ?? null,
    },
    !verifiedOnly,
  );

  if (filtered.length === 0) return null;

  return (
    <div className="mt-12 border-t border-dashed border-border pt-8">
      <div className="mb-6">
        <VerifiedOnlyToggle checked={verifiedOnly} onChange={setVerifiedOnly} count={verifiedCount} />
      </div>

      {!verifiedOnly && (
        <>
          <div className="max-w-3xl mb-5">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {filtered.length === 1 ? "1 övrig partner" : `${filtered.length} övriga partners`}
              {productLabel ? <> inom {nowrapBrand(productLabel)}</> : null}
            </h3>
            <p className="text-sm text-muted-foreground">
              Grundprofiler sammanställda av d365.se utifrån publikt tillgängliga uppgifter.
              Informationen har inte granskats eller bekräftats av partnern och profilerna saknar
              därför kontaktuppgifter och detaljerade kompetenser. Hör av dig till oss så hjälper
              vi dig vidare.
            </p>
          </div>
          <WhyTheseResults basic order="alphabetical" criteria={[...applications, industry, geography]} className="mb-5" />
          <BasicPartnersReveal count={filtered.length}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <PartnerBasicCard key={p.id} partner={p} variant="list" excludeProductKey={excludeProductKey} />
              ))}
            </div>
          </BasicPartnersReveal>
        </>
      )}
    </div>
  );
}
