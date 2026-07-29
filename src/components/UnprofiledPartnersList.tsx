import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useUnprofiledPartners } from "@/hooks/useUnprofiledPartners";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";
import { useBasicPartners, PRODUCT_LABEL, PRODUCT_ORDER } from "@/hooks/useBasicPartners";

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

type ListItem = { id: string; name: string; slug?: string; products?: string[] };

const UnprofiledPartnersList = ({
  variant = "teaser",
  showSeeAllLink = true,
  productKey,
  productLabel,
}: Props) => {
  const { data: unprofiled, isLoading: l1 } = useUnprofiledPartners();
  const { data: allNames, isLoading: l2 } = useAllPartnerNames();
  const { data: basicPartners, isLoading: l3 } = useBasicPartners();

  const combined = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    // Basic partners first – they have a real basic-profile page, so they win
    // dedupe over name-only entries and can be linked.
    (basicPartners || [])
      .filter((p) => {
        if (!productKey) return true;
        // Include if the product is either explicitly observed OR has any
        // observed data (industries/sizes/revenue/geo) for that product key.
        return (
          !!p.observed_products?.[productKey] ||
          !!p.observed_industries?.[productKey]?.length ||
          !!p.observed_company_sizes?.[productKey]?.length ||
          !!p.observed_revenue?.[productKey]?.length ||
          !!p.observed_delivery_geo?.[productKey]?.length
        );
      })
      .forEach((p) => {
        // Derive product areas from the union of all observed_* maps so that
        // partners that only have e.g. industries populated still show badges.
        const products = PRODUCT_ORDER.filter(
          (k) =>
            !!p.observed_products?.[k] ||
            !!p.observed_industries?.[k]?.length ||
            !!p.observed_company_sizes?.[k]?.length ||
            !!p.observed_revenue?.[k]?.length ||
            !!p.observed_delivery_geo?.[k]?.length,
        ).map((k) => PRODUCT_LABEL[k]);
        items.push({ id: `basic-${p.id}`, name: p.name, slug: p.slug, products });
      });
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
    // Dedupe by lowercased name, keep first occurrence (basic wins).
    const seen = new Set<string>();
    const deduped = items.filter((it) => {
      const key = it.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    deduped.sort((a, b) => a.name.localeCompare(b.name, "sv"));
    return deduped;
  }, [unprofiled, allNames, basicPartners, productKey]);

  if (l1 || l2 || l3) return null;
  if (combined.length === 0) return null;

  const heading = productKey && productLabel
    ? `Övriga partners som arbetar med ${productLabel}`
    : "Övriga Dynamics 365-partners på den svenska marknaden";
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

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {combined.map((p) => {
            const content = (
              <>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate mb-2">
                    {p.name}
                  </h3>
                  {p.products && p.products.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {p.products.map((label) => (
                        <Badge
                          key={label}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 border-accent/30 text-accent bg-accent/5"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center">
                  <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>

              </>
            );
            return (
              <li key={p.id}>
                {p.slug ? (
                  <Link
                    to={`/basic/${p.slug}/`}
                    aria-label={`Öppna basickort för ${p.name}`}
                    className="group relative flex items-center justify-between gap-3 p-4 rounded-lg border border-dashed border-border bg-card hover:border-muted-foreground/40 hover:shadow-sm transition-all"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="group relative flex items-center justify-between gap-3 p-4 rounded-lg border border-dashed border-border bg-card">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
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
