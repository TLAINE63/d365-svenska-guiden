import { useMemo, useState } from "react";
import { useBasicPartners } from "@/hooks/useBasicPartners";
import { filterBasicPartners } from "@/lib/basicPartnerMatch";
import PartnerBasicCard from "@/components/partner/PartnerBasicCard";
import VerifiedOnlyToggle from "@/components/VerifiedOnlyToggle";

interface ProductBasicPartnersSectionProps {
  /** Applikationer som produktsidan gäller, t.ex. ["Business Central"] */
  applications: string[];
  industry?: string | null;
  geography?: string | null;
  companySize?: string | null;
  revenue?: string | null;
  /** Antal verifierade partners som visas ovanför */
  verifiedCount: number;
}

/**
 * Visar ej verifierade profiler (observerad, ej verifierad data) som matchar samma filter
 * som de verifierade partnerkorten på en produktsida. Inkluderar en toggle för
 * att visa endast verifierade partners.
 */
export default function ProductBasicPartnersSection({
  applications,
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

  return (
    <div className="mt-12 border-t border-dashed border-border pt-8">
      <div className="flex justify-center mb-8">
        <VerifiedOnlyToggle checked={verifiedOnly} onChange={setVerifiedOnly} count={verifiedCount} />
      </div>

      {!verifiedOnly && filtered.length > 0 && (
        <>
          <div className="max-w-3xl mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Profiler som matchar din filtrering ({filtered.length})
            </h3>
            <p className="text-sm text-muted-foreground">
              Grundläggande information om partnern baserad på offentligt tillgängliga uppgifter.
              Profilerna har ännu inte verifierats av partnern och innehåller därför varken
              kontaktperson, kontaktuppgifter, kundcase eller detaljerade kompetenser. Vill du komma
              i kontakt med någon av dem, hör av dig till oss så hjälper vi till.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <PartnerBasicCard key={p.id} partner={p} variant="list" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
