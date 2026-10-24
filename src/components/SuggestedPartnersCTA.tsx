import WhyTheseResults from "@/components/WhyTheseResults";
import PartnerSelectionFacts from "@/components/partner/PartnerSelectionFacts";
import { useMemo } from "react";
import PartnerCardHeader from "@/components/partner/PartnerCardHeader";
import { Link } from "react-router-dom";
import { ArrowRight, GitCompare, Sparkles } from "lucide-react";
import { usePartners } from "@/hooks/usePartners";
import { pickSuggestedPartners } from "@/lib/suggestPartners";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";
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
  /** Anropas när besökaren går vidare till jämförelse, alla partners eller en profil (anonym mätning). */
  onAction?: (target: "compare" | "all_partners" | "profile") => void;
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
  onAction,
}: Props) => {
  const { data: partners = [], isLoading } = usePartners();

  const suggested = useMemo(
    () => pickSuggestedPartners(partners, { product, industry, companySize, revenue, limit: 5 }),
    [partners, product, industry, companySize, revenue],
  );

  // Nivå 1 – exponering: partners som föreslås efter behovsanalys/kravspecifikation.
  usePartnerImpressions(
    "partner_match_impression",
    suggested,
    {
      surface: "suggested_partners",
      product: Array.isArray(product) ? product.join(",") : product ?? null,
      industry: industry ?? null,
    },
    !isLoading,
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
            `Utifrån ${industry ? `din bransch (${industry}) och ` : ""}din valda produktinriktning har vi plockat fram fem partnerverifierade profiler som matchar det du behöver. Jämför dem sida vid sida innan du tar kontakt – då pressar du både pris och funktion.`}
        </p>

        <WhyTheseResults order="relevance" criteria={[industry]} explanation="Dessa partners är förslag utifrån produkt- och branschprofil. Kundstorlek och omsättning kan förbättra matchningen men bevisar inte projektlämplighet. Urvalet är begränsat, inte en fullständig marknadslista." className="mb-5" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {suggested.map((p) => (
            <article key={p.slug} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary">
              <PartnerCardHeader partner={p} to={`/partner/${p.slug}/`} compact className="-mx-4 -mt-4 w-auto border-b border-border p-4" />
              <p className="text-xs text-muted-foreground line-clamp-2">{p.positioning_statement || p.description || "Se profil för detaljer"}</p>
              <PartnerSelectionFacts partner={p} productKey={Array.isArray(product) ? null : product} />
              <Link to={`/partner/${p.slug}/`} onClick={() => onAction?.("profile")} className="text-sm font-semibold text-primary">Se partnerprofil <ArrowRight className="inline h-4 w-4" /></Link>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white"
          >
            <Link to={compareUrl} onClick={() => onAction?.("compare")} aria-label={`Jämför ${suggested.map((p) => p.name).join(", ")} sida vid sida`}>
              <GitCompare className="w-4 h-4 mr-2" />
              Jämför dessa {suggested.length} sida vid sida
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
<Link to="/valjdynamics365partner/#alla-partners-rubrik" onClick={() => onAction?.("all_partners")}>
              Se alla partners
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground italic">
          Urvalet baseras på samma rankning som resten av sajten
          (bransch- och produktprofil med kompletterande storlekssignaler). Detta är
          inte en fullständig lista – gå gärna vidare till jämför-sidan eller
          till fler partners.
          {productLabel ? "" : null}
        </p>
      </div>
    </section>
  );
};

export default SuggestedPartnersCTA;
