import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

interface Props {
  /** "inline" = tidig/mitt i guiden, "final" = stort block i slutet. */
  variant?: "inline" | "final";
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
  const track = () =>
    trackFunnelEvent({
      event_type: "cta_click",
      event_name: "guide_cta_click",
      metadata: { variant, source, target: to },
    });

  return (
    <aside
      className={`print:hidden rounded-xl border ${
        isFinal
          ? "border-[hsl(var(--cta-orange))]/30 bg-muted/50 p-6 sm:p-8 my-12"
          : "border-border bg-muted/30 p-5 my-8"
      } ${className}`}
    >
      <h2 className={isFinal ? "text-2xl font-bold tracking-tight mb-2" : "text-lg font-bold mb-1.5"}>
        {heading}
      </h2>
      <p className={`text-muted-foreground ${isFinal ? "mb-6 max-w-2xl" : "text-sm mb-4"}`}>{text}</p>
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
