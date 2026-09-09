import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PARTNER_GUIDES, PartnerGuideKey, guidePath } from "@/data/partnerGuides";

interface Props {
  current: PartnerGuideKey;
  className?: string;
}

/** "Relaterade guider" – hela serien, aktuell guide markerad och ej klickbar. */
const RelatedGuides = ({ current, className = "" }: Props) => (
  <section className={`border-t border-border pt-8 ${className}`} aria-label="Relaterade guider">
    <h2 className="text-xl font-bold tracking-tight mb-4">Relaterade guider</h2>
    <ul className="space-y-2">
      {PARTNER_GUIDES.map((g) => {
        const active = g.key === current;
        return (
          <li key={g.key}>
            {active ? (
              <span aria-current="page" className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
                {g.cardTitle}
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Du läser den här
                </span>
              </span>
            ) : (
              <Link
                to={guidePath(g)}
                className="group flex items-center gap-2 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {g.cardTitle}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  </section>
);

export default RelatedGuides;
