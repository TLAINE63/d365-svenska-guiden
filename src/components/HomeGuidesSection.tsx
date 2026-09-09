import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import GuideSearch from "@/components/guides/GuideSearch";
import { PARTNER_GUIDES, guidePath } from "@/data/partnerGuides";

/**
 * Startsidesektion som lyfter guideserien "Välja Dynamics 365-partner"
 * med snabbsök till guider och partnerprofiler.
 */
const HomeGuidesSection = () => (
  <section className="section-divider py-14 sm:py-20 bg-background border-b border-border" aria-labelledby="guider-heading">
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
      <div className="max-w-2xl mb-8">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--signature))] mb-3">
          Guider
        </span>
        <h2 id="guider-heading" className="text-2xl sm:text-3xl md:text-[34px] font-bold text-foreground tracking-tight mb-3 leading-tight">
          Välja Dynamics 365-partner
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          Huvudguiden täcker hela urvalsprocessen. Produktguiderna går djupare in på
          det som skiljer respektive upphandling åt. Sök direkt efter en guide eller en partner.
        </p>
      </div>

      <GuideSearch className="mb-8 max-w-xl" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNER_GUIDES.map((g) => (
          <Link
            key={g.key}
            to={guidePath(g)}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--cta-orange))] hover:shadow-md"
          >
            <BookOpen className="h-5 w-5 text-primary mb-3" />
            <h3 className="text-base font-semibold leading-tight mb-2">{g.cardTitle}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {g.cardDescription}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Läs guiden
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <Link
        to="/guider/"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        Se alla guider
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  </section>
);

export default HomeGuidesSection;
