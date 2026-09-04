import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useUnprofiledPartners } from "@/hooks/useUnprofiledPartners";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";
import { useBasicPartners, PRODUCT_LABEL, PRODUCT_ORDER } from "@/hooks/useBasicPartners";
import { getBasicPartnerIndustries } from "@/lib/basicPartnerMatch";

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
  /**
   * Om en bransch är vald på sidan filtreras Basic-partners mot samma
   * branschinsikt som visas på basickorten (max 3 per produktområde,
   * ej partnerverifierad).
   */
  industry?: string | null;
}

type ListItem = { id: string; name: string; slug?: string; products?: string[] };

const UnprofiledPartnersList = ({
  variant = "teaser",
  showSeeAllLink = true,
  productKey,
  productLabel,
  industry = null,
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
        // Samma branschinsikt som på basickorten: max 3 observerade branscher
        // per produktområde, trunkerad och deduplicerad.
        if (industry) {
          const inds = getBasicPartnerIndustries(p, productKey ? [productKey] : undefined);
          if (!inds.includes(industry)) return false;
        }
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
    ? `Fler partners som arbetar med ${productLabel}`
    : "Fler Dynamics 365-partners på den svenska marknaden";
  const areaText = productKey && productLabel ? productLabel : "Dynamics 365";
  const intro = `d365.se listar även partners som enligt tillgänglig information arbetar med ${areaText} men som ännu inte har en partnerverifierad profil. Informationen är sammanställd av d365.se utifrån publikt tillgängliga uppgifter och har inte granskats eller bekräftats av partnern.`;

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
            const additional = (p.products || []).filter(
              (label) => !productKey || label !== PRODUCT_LABEL[productKey],
            );
            const content = (
              <>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                    Grundprofil – ej partnerverifierad
                  </p>
                  {additional.length > 0 ? (
                    <div className="mt-2">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {productKey ? "Även dokumenterat" : "Dokumenterade områden"}
                      </p>
                      <ul className="mt-0.5 space-y-0.5 text-sm text-foreground/80">
                        {additional.map((label) => (
                          <li key={label}>{label}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Ingen ytterligare produktinformation dokumenterad.
                    </p>
                  )}
                  {p.slug && (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      Visa grundinformation
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </div>
              </>
            );
            return (
              <li key={p.id}>
                {p.slug ? (
                  <Link
                    to={`/basic/${p.slug}/`}
                    aria-label={`Öppna basickort för ${p.name}`}
                    className="group relative flex h-full items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-muted-foreground/40 transition-colors"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="group relative flex h-full items-start gap-3 p-4 rounded-lg border border-border bg-card">
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
