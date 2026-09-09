import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PARTNER_GUIDES, guidePath } from "@/data/partnerGuides";

/** Fyra klickbara produktguidekort på huvudguiden. */
const GuideCardsGrid = ({ className = "" }: { className?: string }) => (
  <section className={`my-10 ${className}`} aria-label="Guider per Dynamics 365-system">
    <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-5">
      Välj guide efter vilket Dynamics 365-system ni utvärderar
    </h2>
    <div className="grid gap-4 sm:grid-cols-2">
      {PARTNER_GUIDES.filter((g) => g.key !== "hub").map((g) => (
        <Link
          key={g.key}
          to={guidePath(g)}
          className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--cta-orange))] hover:shadow-md"
        >
          <h3 className="text-base font-bold mb-1.5">{g.shortLabel}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
            {g.cardDescription}
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--cta-orange))]">
            Läs guiden
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  </section>
);

export default GuideCardsGrid;
