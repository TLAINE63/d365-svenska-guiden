import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { CTA, findPartnerUrl } from "@/data/ctaLabels";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

interface Props {
  /** "article" = efter artiklar/guider, "tool" = efter genomfört verktyg. */
  variant?: "article" | "tool";
  /** Var CTA:n visas – används i mätningen. */
  source: string;
  /** Förval som följer med till partnerväljaren. */
  industry?: string;
  product?: string;
  className?: string;
}

/**
 * Gemensamt CTA-block: en primär väg (Hitta rätt partner) och en sekundär
 * (Starta behovsanalys). Används efter artiklar och efter genomförda verktyg.
 */
const PartnerCtaBlock = ({ variant = "article", source, industry, product, className = "" }: Props) => {
  const to = findPartnerUrl({ industry, product });
  const isTool = variant === "tool";

  const heading = isTool ? "Redo för nästa steg?" : "Behöver du hjälp att välja Dynamics 365-partner?";
  const body = isTool
    ? "Baserat på dina svar kan vi hjälpa dig hitta relevanta Dynamics 365-partners."
    : null;

  const track = (target: string) =>
    trackFunnelEvent({
      event_type: "cta_click",
      event_name: "partner_cta_click",
      metadata: { variant, source, target },
    });

  return (
    <section
      className={`bg-muted/40 border-y border-border py-10 sm:py-14 print:hidden ${className}`}
      aria-label="Nästa steg"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{heading}</h2>
        {body && <p className="text-muted-foreground mb-6 max-w-2xl">{body}</p>}

        {!isTool && (
          <ul className="space-y-2 mb-7">
            {[
              "Jämför leverantörer sida vid sida",
              "Få hjälp att kortlista relevanta partner",
              "Kostnadsfritt och köparorienterat",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[15px] text-muted-foreground">
                <Check className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <Link
            to={to}
            onClick={() => track(to)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[hsl(var(--cta-orange))] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[hsl(var(--cta-orange-hover))] hover:-translate-y-0.5"
          >
            {CTA.findPartner}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={CTA.needsAnalysisTo}
            onClick={() => track(CTA.needsAnalysisTo)}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-[hsl(var(--cta-orange))] hover:text-[hsl(var(--cta-orange))]"
          >
            {CTA.needsAnalysis}
          </Link>
        </div>

        <p className="mt-5 text-[13px] text-muted-foreground">
          Ingen partner ser dina uppgifter innan du själv väljer att ta kontakt.
        </p>
      </div>
    </section>
  );
};

export default PartnerCtaBlock;
