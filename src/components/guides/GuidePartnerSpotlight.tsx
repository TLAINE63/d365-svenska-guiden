import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { usePartners } from "@/hooks/usePartners";
import { trackPartnerEvent } from "@/utils/trackPartnerEvent";
import VerifiedPartnerBadge from "@/components/VerifiedPartnerBadge";
import type { PartnerGuide } from "@/data/partnerGuides";

interface Props {
  guide: PartnerGuide;
  className?: string;
}

const MAX = 6;

const intro = (p: {
  positioning_statement?: string | null;
  ai_summary?: string | null;
  description?: string | null;
}) => {
  const raw = p.positioning_statement || p.ai_summary || p.description || "";
  const text = raw.trim();
  if (text.length <= 180) return text;
  const cut = text.slice(0, 180);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "));
  return `${cut.slice(0, stop > 80 ? stop : 180).trim()}…`;
};

/**
 * Partnerverifierade profiler som arbetar med guidens produktområde.
 * Guiden kan därmed peka direkt till en enskild partner.
 */
const GuidePartnerSpotlight = ({ guide, className = "" }: Props) => {
  const { data: partners, isLoading } = usePartners();

  if (isLoading || !partners?.length) return null;

  const matching = guide.apps.length
    ? partners.filter((p) =>
        (p.applications || []).some((a) => guide.apps.includes(a))
      )
    : partners;

  if (!matching.length) return null;

  const shown = matching.slice(0, MAX);
  const heading = guide.apps.length
    ? `Partnerverifierade profiler inom ${guide.shortLabel}`
    : "Partnerverifierade profiler";

  return (
    <section className={`mt-12 ${className}`} aria-label={heading}>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">{heading}</h2>
      <p className="text-[15px] leading-relaxed text-muted-foreground mb-5">
        Profilerna nedan är granskade av d365.se och partnern har själv bekräftat
        uppgifterna. Läs profilen för fördjupad information eller gå direkt till
        partnerns egen webbplats.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {shown.map((p) => (
          <li
            key={p.id ?? p.slug}
            className="flex flex-col rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-tight">{p.name}</h3>
              <VerifiedPartnerBadge size="sm" />
            </div>

            {intro(p) && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {intro(p)}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
              <Link
                to={`/partner/${p.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Läs profilen
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackPartnerEvent({
                      event: "klick_utgaende_partnersajt",
                      partnerSlug: p.slug,
                      partnerId: p.id ?? null,
                      cardType: "verifierad",
                      productArea: guide.apps[0] ?? null,
                      metadata: { via: "guide", target: p.website },
                    })
                  }
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  aria-label={`Till ${p.name}s webbplats (öppnas i ny flik)`}
                >
                  Partnerns webbplats
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GuidePartnerSpotlight;
