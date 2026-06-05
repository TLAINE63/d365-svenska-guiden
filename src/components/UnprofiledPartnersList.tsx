import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useUnprofiledPartners } from "@/hooks/useUnprofiledPartners";

interface Props {
  /** Show a compact teaser (Välj Partner) vs. full page list */
  variant?: "teaser" | "full";
  /** Optional link to /alla-d365-partners when used as teaser */
  showSeeAllLink?: boolean;
}

const UnprofiledPartnersList = ({ variant = "teaser", showSeeAllLink = true }: Props) => {
  const { data: partners, isLoading } = useUnprofiledPartners();

  if (isLoading) return null;
  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Övriga D365-partners på marknaden
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
            För full transparens listar vi även andra Dynamics 365-partners som är verksamma i Sverige.
            Dessa har vi ännu inte profilerat på d365.se. Vill du veta mer om någon av dem
            – eller få hjälp att jämföra – kontakta oss så vägleder vi dig vidare.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {partners.map((p) => (
            <Badge
              key={p.id}
              variant="outline"
              className="text-sm sm:text-base px-3 py-1.5 bg-card text-foreground border-border font-medium"
            >
              {p.name}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white">
            <Link to="/kontakt/">
              <MessageSquare className="w-4 h-4 mr-2" />
              Kontakta oss för matchning
            </Link>
          </Button>
          {variant === "teaser" && showSeeAllLink && (
            <Button asChild variant="outline" size="lg">
              <Link to="/alla-d365-partners/">Se hela listan</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default UnprofiledPartnersList;
