import { Link } from "react-router-dom";
import { usePublishedPartnerNews } from "@/hooks/usePartnerNews";
import PartnerNewsCard from "@/components/PartnerNewsCard";
import { ArrowRight } from "lucide-react";

interface Props {
  partnerId: string;
  partnerName: string;
  partnerSlug: string;
  partnerLogoUrl?: string | null;
}

export default function PartnerProfileNewsSection({ partnerId, partnerName, partnerSlug, partnerLogoUrl }: Props) {
  const { data, isLoading } = usePublishedPartnerNews({
    partnerId,
    showOnPartnerProfile: true,
    limit: 3,
  });

  if (isLoading || !data || data.length === 0) return null;

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Senaste nytt från {partnerName}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Redaktionellt utvalt av d365.se – länkat till originalkällan.
            </p>
          </div>
          <Link
            to={`/partnernytt/?partner=${encodeURIComponent(partnerSlug)}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--cta-orange))] hover:underline"
          >
            Se allt partnernytt <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {data.map((item) => (
            <PartnerNewsCard
              key={item.id}
              item={item}
              partnerName={partnerName}
              partnerSlug={partnerSlug}
              partnerLogoUrl={partnerLogoUrl}
              hidePartnerLink
              layout="horizontal"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
