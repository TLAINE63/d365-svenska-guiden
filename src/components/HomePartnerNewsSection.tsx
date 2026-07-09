import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePublishedPartnerNews } from "@/hooks/usePartnerNews";
import PartnerNewsCard from "@/components/PartnerNewsCard";

export default function HomePartnerNewsSection() {
  const { data, isLoading } = usePublishedPartnerNews({ showOnHome: true, limit: 6 });

  if (isLoading || !data || data.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Aktuellt från Dynamics 365-partners
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
          <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white">
            <Link to="/partnernytt/">Visa allt partnernytt</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
