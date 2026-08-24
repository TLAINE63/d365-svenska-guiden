import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GitCompare, Sparkles } from "lucide-react";
import { usePartners } from "@/hooks/usePartners";
import { pickSuggestedPartners } from "@/lib/suggestPartners";
import { buildCompareUrl } from "@/lib/compareUrl";
import type { ProductKey } from "@/hooks/usePartnerFilters";
import { Button } from "@/components/ui/button";

interface Props {
  product: ProductKey | ProductKey[];
  industry?: string | null;
  /** Kundstorleks-bucket (companySizes) – mjuk rankingfaktor. */
  companySize?: string | null;
  /** Omsättnings-bucket (revenueOptions) – mjuk rankingfaktor. */
  revenue?: string | null;
  /** Rubrik. Default: "Föreslagna partners att kontakta". */
  heading?: string;
  /** Ingress under rubriken. */
  intro?: string;
  className?: string;
}

/**
 * Diskret sektion som visar upp till 3 partners som passar
 * (bransch/produkt-matchning + agreement-signed prioriterat).
 * Med primär CTA som förifyller /jamfor-partners.
 */
const SuggestedPartnersCTA = ({
  product,
  industry,
  companySize,
  revenue,
  heading = "Föreslagna partners att kontakta",
  intro,
  className = "",
}: Props) => {
  const { data: partners = [], isLoading } = usePartners();

  const suggested = useMemo(
    () => pickSuggestedPartners(partners, { product, industry, companySize, revenue, limit: 3 }),
    [partners, product, industry, companySize, revenue],
  );

  if (isLoading || suggested.length === 0) return null;

  const compareUrl = buildCompareUrl(suggested.map((p) => p.slug));
  const productLabel = Array.isArray(product) ? product.join(", ") : product;

  return (
    <section
      className={`border-t border-border bg-secondary/30 py-12 sm:py-16 ${className}`}
      aria-label="Föreslagna partners"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--cta-orange))] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Nästa steg
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {heading}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-3xl">
          {intro ||
            `Utifrån ${industry ? `din bransch (${industry}) och ` : ""}din valda produktinriktning har vi plockat fram tre verifierade partners som matchar det du behöver. Jämför dem sida vid sida innan du tar kontakt – då pressar du både pris och funktion.`}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {suggested.map((p) => (
            <Link
              key={p.slug}
              to={`/partner/${p.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-[hsl(var(--cta-orange))] hover:shadow-md"
            >
              {p.logo_url ? (
                <img
                  src={p.logo_url}
                  alt={`${p.name} logotyp`}
                  loading="lazy"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain rounded bg-white border border-border/60 p-1 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded bg-muted flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground truncate group-hover:text-[hsl(var(--cta-orange))]">
                  {p.name}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {(p as any).positioning_statement ||
                    p.description ||
                    "Se profil för detaljer"}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 group-hover:text-[hsl(var(--cta-orange))] transition-transform" />
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white"
          >
            <Link to={compareUrl} aria-label={`Jämför ${suggested.map((p) => p.name).join(", ")} sida vid sida`}>
              <GitCompare className="w-4 h-4 mr-2" />
              Jämför dessa {suggested.length} sida vid sida
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
<Link to="/valjdynamics365partner/#alla-partners-rubrik">
              Se alla partners
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground italic">
          Urvalet baseras på samma köparsidiga rankning som resten av sajten
          (bransch- och produktprofil, agreement-signed partners först). Detta är
          inte en fullständig lista – gå gärna vidare till jämför-sidan eller
          till fler partners.
          {productLabel ? "" : null}
        </p>
      </div>
    </section>
  );
};

export default SuggestedPartnersCTA;
