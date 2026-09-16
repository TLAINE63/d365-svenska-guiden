import { DatabasePartner } from "@/hooks/usePartners";

interface Props {
  partner: DatabasePartner & {
    public_profile_summary?: string | null;
    public_focus_tags?: string[] | null;
    public_topics_12m?: string[] | null;
    public_profile_updated_at?: string | null;
  };
}

function toParagraphs(text?: string | null): string[] {
  const raw = (text || "").trim();
  if (!raw) return [];
  return raw
    .split(/\r?\n+/)
    .map((p) => p.replace(/^\s*(?:[-–•]+\s*|\d+[.)]\s+)/, "").trim())
    .filter(Boolean);
}

function Tags({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((t) => (
        <li
          key={t}
          className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/**
 * Kompletterande, AI-sammanställt informationslager baserat på publika källor.
 * Skriver aldrig över partnerns egna uppgifter, visas alltid tydligt separerat.
 */
const PartnerPublicSourcesSection = ({ partner }: Props) => {
  const paragraphs = toParagraphs(partner.public_profile_summary);
  const focus = (partner.public_focus_tags || []).filter(Boolean);
  const topics = (partner.public_topics_12m || []).filter(Boolean);

  if (paragraphs.length === 0 && focus.length === 0 && topics.length === 0) return null;

  const updated = partner.public_profile_updated_at
    ? new Date(partner.public_profile_updated_at).toISOString().slice(0, 10)
    : null;

  return (
    <section className="py-8 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-5">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Kompletterande information baserad på publika källor
              </h2>
              <p className="rounded-md border border-border bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                Informationen nedan har sammanställts automatiskt av d365.se baserat på publika
                källor såsom partnerns webbplats, artiklar, webinarier, kundcase och andra öppna
                källor. Informationen är ett komplement till partnerns egen profilbeskrivning.
              </p>
            </div>

            {paragraphs.length > 0 && (
              <div className="space-y-3">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-sm sm:text-base leading-relaxed text-foreground/90 max-w-[72ch]">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {focus.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Observerade fokusområden
                </h3>
                <Tags items={focus} label="Observerade fokusområden" />
              </div>
            )}

            {topics.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Observerade ämnen senaste 12 månaderna
                </h3>
                <Tags items={topics} label="Observerade ämnen senaste 12 månaderna" />
              </div>
            )}

            {updated && (
              <p className="text-[11px] leading-snug text-muted-foreground">
                Senast sammanställt {updated}.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerPublicSourcesSection;
