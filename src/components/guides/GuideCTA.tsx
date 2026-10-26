import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { nowrapBrand } from "@/lib/nowrapBrand";

interface Props {
  /** "inline" = tidig/mitt i guiden, "highlight" = framhävd ruta efter introduktionen, "final" = stort block i slutet. */
  variant?: "inline" | "highlight" | "final";
  heading: string;
  text: string;
  buttonLabel: string;
  to: string;
  /** Var CTA:n visas – används i mätningen. */
  source: string;
  className?: string;
}

/** Standardiserat CTA-block för guideserien. */
const GuideCTA = ({
  variant = "inline",
  heading,
  text,
  buttonLabel,
  to,
  source,
  className = "",
}: Props) => {
  const isFinal = variant === "final";
  const isHighlight = variant === "highlight";
  const track = () =>
    trackFunnelEvent({
      event_type: "cta_click",
      event_name: "guide_cta_click",
      metadata: { variant, source, target: to },
    });

  const frame = isFinal
    ? "border-[hsl(var(--cta-orange))]/30 bg-muted/50 p-6 sm:p-8 my-12"
    : isHighlight
      ? "border-[hsl(var(--cta-orange))]/40 border-l-4 border-l-[hsl(var(--cta-orange))] bg-card shadow-sm p-6 sm:p-7 my-10"
      : "border-border bg-muted/30 p-5 my-8";

  return (
    <aside className={`print:hidden rounded-xl border ${frame} ${className}`}>
      <h2 className={isFinal ? "text-2xl font-bold tracking-tight mb-2" : isHighlight ? "text-xl font-bold tracking-tight mb-2" : "text-lg font-bold mb-1.5"}>
        {nowrapBrand(heading)}
      </h2>
      <p className={`text-muted-foreground ${isFinal ? "mb-6 max-w-2xl" : isHighlight ? "text-[15px] leading-relaxed mb-5 max-w-2xl" : "text-sm mb-4"}`}>{nowrapBrand(text)}</p>
      <Link
        to={to}
        onClick={track}
        className={`inline-flex items-center gap-2 rounded-md bg-[hsl(var(--cta-orange))] font-bold text-white transition-all hover:bg-[hsl(var(--cta-orange-hover))] hover:-translate-y-0.5 ${
          isFinal ? "px-7 py-4 text-base" : "px-5 py-2.5 text-sm"
        }`}
      >
        {buttonLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  );
};

export default GuideCTA;
