import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { usePublishedPartnerNews, type PartnerNewsProductArea } from "@/hooks/usePartnerNews";
import PartnerNewsCard from "@/components/PartnerNewsCard";

interface Props {
  productArea: PartnerNewsProductArea;
  productLabel: string;
  className?: string;
}

export default function ProductPartnerNewsSection({ productArea, productLabel, className }: Props) {
  const { data, isLoading } = usePublishedPartnerNews({
    productArea,
    showOnProductPage: true,
    limit: 6,
  });

  if (isLoading || !data || data.length === 0) return null;

  return (
    <section className={`py-12 sm:py-16 bg-background ${className ?? ""}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Aktuellt från {productLabel}-partners
          </h2>
          <p className="mt-3 text-muted-foreground">
            Redaktionellt utvalda nyheter, kundcase och event från publicerade partners på d365.se.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {data.map((item) => (
            <PartnerNewsCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link to={`/partnernytt/?produkt=${productArea}`} className="inline-flex items-center gap-1">
              Visa allt partnernytt för {productLabel} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
