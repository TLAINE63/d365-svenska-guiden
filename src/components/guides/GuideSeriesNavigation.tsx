import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { PARTNER_GUIDES, PartnerGuideKey, guidePath } from "@/data/partnerGuides";

interface Props {
  current: PartnerGuideKey;
  className?: string;
}

/**
 * Liten serienavigering ovanför H1 som binder ihop guideserien
 * för både läsare och sökmotorer.
 */
const GuideSeriesNavigation = ({ current, className = "" }: Props) => (
  <nav aria-label="Guide i serien: Välja Dynamics 365-partner" className={className}>
    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">
      Guide i serien: Välja Dynamics 365-partner
    </p>
    <ul className="flex flex-wrap gap-2">
      {PARTNER_GUIDES.map((g) => {
        const active = g.key === current;
        const content = (
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            {g.shortLabel}
          </span>
        );
        return (
          <li key={g.key}>
            {active ? (
              <span
                aria-current="page"
                className="inline-flex rounded-full border border-[hsl(var(--cta-orange))] bg-[hsl(var(--cta-orange))]/10 px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                {content}
              </span>
            ) : (
              <Link
                to={guidePath(g)}
                className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[hsl(var(--cta-orange))] hover:text-foreground"
              >
                {content}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

export default GuideSeriesNavigation;
