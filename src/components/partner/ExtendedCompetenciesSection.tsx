// Publik sektion: "AI, Automation & Power Platform"
// Visar d365.se:s bedömda nivå per kompetensområde – aldrig interna poäng eller underlag.

import { Sparkles, Info } from "lucide-react";
import {
  COMPETENCY_AREAS,
  LEVEL_META,
  ASSESSMENT_DISCLAIMER,
  competencyNarrative,
  hasAnyCompetency,
  normalizeCompetencies,
} from "@/lib/extendedCompetencies";

interface Props {
  competencies: unknown;
  partnerName?: string;
  compact?: boolean;
}

export default function ExtendedCompetenciesSection({
  competencies,
  partnerName,
  compact = false,
}: Props) {
  const c = normalizeCompetencies(competencies);
  if (!hasAnyCompetency(c)) return null;

  const narrative = competencyNarrative(c, partnerName);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: partnerName,
    knowsAbout: COMPETENCY_AREAS.filter((a) => c[a.key]).map((a) => ({
      "@type": "DefinedTerm",
      name: `Microsoft ${a.label}`,
      description: `${a.description} Bedömd nivå enligt d365.se: ${LEVEL_META[c[a.key]!].label}.`,
      inDefinedTermSet: "d365.se kompetensbedömning",
    })),
  };

  return (
    <section
      id="ai-automation-power-platform"
      className={`rounded-lg border border-border bg-card ${compact ? "p-4" : "p-5 sm:p-6"} space-y-4`}
      aria-labelledby="extended-competencies-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
        <h2 id="extended-competencies-heading" className="text-base sm:text-lg font-semibold">
          AI, Automation &amp; Power Platform
        </h2>
      </header>

      <p className="text-sm text-muted-foreground">
        Utöver kompetensen inom Dynamics 365 bedömer d365.se partnerns förmåga inom Power Platform,
        Copilot &amp; AI samt Copilot Studio och agenter. Dynamics 365-kompetensen är alltid den
        primära faktorn – dessa områden är kompletterande.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {COMPETENCY_AREAS.map((area) => {
          const level = c[area.key];
          if (!level) return null;
          const meta = LEVEL_META[level];
          return (
            <div key={area.key} className="rounded-md border border-border bg-muted/20 p-3 space-y-2">
              <h3 className="text-sm font-semibold">{area.label}</h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${meta.className}`}
                title={meta.description}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
                {meta.label}
              </span>
              <p className="text-xs text-muted-foreground leading-snug">{area.description}</p>
            </div>
          );
        })}
      </div>

      {narrative && (
        <div className="rounded-md border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            d365.se:s bedömning
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">{narrative}</p>
        </div>
      )}

      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <span>{ASSESSMENT_DISCLAIMER} Nivåerna sätts av d365.se, inte av partnern.</span>
      </p>
    </section>
  );
}
