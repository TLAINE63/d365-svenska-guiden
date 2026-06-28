import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useMemo } from "react";
import { useUnprofiledPartners } from "@/hooks/useUnprofiledPartners";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";

interface Props {
  /** Show a compact teaser (Välj Partner) vs. full page list */
  variant?: "teaser" | "full";
  /** Optional link to /alla-d365-partners when used as teaser */
  showSeeAllLink?: boolean;
  /**
   * If set, only include DB partners that have product_filters for this product key,
   * and skip the manually-curated unprofiled list (those are not product-specific).
   * Also customizes heading/intro for the product context.
   */
  productKey?: "bc" | "fsc" | "sales" | "service";
  productLabel?: string;
}

const UnprofiledPartnersList = ({
  variant = "teaser",
  showSeeAllLink = true,
  productKey,
  productLabel,
}: Props) => {
  const { data: unprofiled, isLoading: l1 } = useUnprofiledPartners();
  const { data: allNames, isLoading: l2 } = useAllPartnerNames();

  const combined = useMemo(() => {
    const items: { id: string; name: string }[] = [];
    // Non-featured partners in DB (exists in our system but not yet published)
    (allNames || [])
      .filter((p) => !p.is_featured)
      .filter((p) => {
        if (!productKey) return true;
        // Only include if they've self-profiled for this product
        return !!p.product_filters?.[productKey];
      })
      .forEach((p) => items.push({ id: `db-${p.id}`, name: p.name }));
    // Manually curated "listed but not profiled" partners are not product-specific
    if (!productKey) {
      (unprofiled || []).forEach((p) => items.push({ id: `up-${p.id}`, name: p.name }));
    }
    // Dedupe by lowercased name, keep first occurrence
    const seen = new Set<string>();
    const deduped = items.filter((it) => {
      const key = it.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    deduped.sort((a, b) => a.name.localeCompare(b.name, "sv"));
    return deduped;
  }, [unprofiled, allNames, productKey]);

  if (l1 || l2) return null;
  if (combined.length === 0) return null;

  const heading = productKey && productLabel
    ? `Övriga partners som arbetar med ${productLabel}`
    : "Övriga D365-partners på marknaden";
  const intro = productKey && productLabel
    ? `För full transparens listar vi även andra partners som angett att de arbetar med ${productLabel}, men som ännu inte är publicerade med en fullständig profil på d365.se. Vill du veta mer om någon av dem – eller få hjälp att jämföra – kontakta oss så vägleder vi dig vidare.`
    : "För full transparens listar vi även andra Dynamics 365-partners som är verksamma i Sverige. Dessa har vi ännu inte profilerat på d365.se. Vill du veta mer om någon av dem – eller få hjälp att jämföra – kontakta oss så vägleder vi dig vidare.";

  return (
    <section className="py-8 sm:py-12 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {heading}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
            {intro}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {combined.map((p) => (
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
