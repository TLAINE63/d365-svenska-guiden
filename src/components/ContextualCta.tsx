import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildKomIgangUrl, type KomIgangContext } from "@/lib/komIgangUrl";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

interface ContextualCtaProps extends KomIgangContext {
  eyebrow?: string;
  heading: string;
  text: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  className?: string;
}

const ContextualCta = ({
  eyebrow = "Nästa steg",
  heading,
  text,
  primaryLabel = "Starta Kom igång-guiden",
  secondaryLabel,
  secondaryTo,
  industry,
  product,
  goal,
  source,
  className = "",
}: ContextualCtaProps) => {
  const safeEyebrow = eyebrow.split("Dynamics 365").join("Dynamics\u00A0365");
  const safeHeading = heading.split("Dynamics 365").join("Dynamics\u00A0365");
  const safeText = text.split("Dynamics 365").join("Dynamics\u00A0365");
  const primaryTo = buildKomIgangUrl({ industry, product, goal, source });
  const track = (target: string, action: "primary" | "secondary") =>
    trackFunnelEvent({
      event_type: "cta_click",
      event_name: "contextual_cta_click",
      metadata: { source, target, action, industry, product, goal },
    });

  return (
    <aside className={`border-y border-border bg-secondary/40 py-9 sm:py-11 print:hidden ${className}`} aria-label="Rekommenderat nästa steg">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {safeEyebrow}
            </p>
            <h2 className="mb-2 text-xl font-bold leading-tight text-foreground sm:text-2xl">{safeHeading}</h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{safeText}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
            <Button asChild size="lg" className="min-h-12 whitespace-normal text-center font-bold">
              <Link to={primaryTo} onClick={() => track(primaryTo, "primary")}>
                {primaryLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            {secondaryLabel && secondaryTo && (
              <Button asChild size="lg" variant="outline" className="min-h-12 whitespace-normal text-center">
                <Link to={secondaryTo} onClick={() => track(secondaryTo, "secondary")}>{secondaryLabel}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ContextualCta;