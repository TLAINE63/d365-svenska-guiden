import { useState } from "react";
import {
  usePartnerPublicInsights,
  type PublicContentItem,
} from "@/hooks/usePartnerPublicInsights";

interface Props {
  partner: {
    id: string;
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

function isoDate(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function CountCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-center">
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-[11px] leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}

const KIND_LABEL: Record<string, string> = {
  artikel: "Artikel",
  webinarium: "Webinarium",
  kundcase: "Kundcase",
};

function ContentRow({ item }: { item: PublicContentItem }) {
  const date = isoDate(item.date);
  const title = item.url ? (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
    >
      {item.title}
    </a>
  ) : (
    <span className="font-medium text-foreground">{item.title}</span>
  );

  return (
    <li className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
      <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {KIND_LABEL[item.kind] || item.kind}
      </span>
      {title}
      {date && <span className="text-xs text-muted-foreground">{date}</span>}
    </li>
  );
}

/**
 * "Publikt innehåll identifierat" är ett separat informationslager som d365.se
 * sammanställer från publika källor. Det skriver aldrig över partnerns egna
 * uppgifter och visas alltid tydligt separerat från partnerägd information.
 */
const PartnerPublicSourcesSection = ({ partner }: Props) => {
  const { data: insights } = usePartnerPublicInsights(partner.id);
  const [showAllTags, setShowAllTags] = useState(false);

  const profile = toParagraphs(
    insights?.generated_market_profile || partner.public_profile_summary,
  );
  const focus = Array.from(
    new Set(
      [
        ...(partner.public_focus_tags || []),
        ...(insights?.observed_products || []),
        ...(insights?.observed_industries || []),
      ].filter(Boolean),
    ),
  );
  const topics = (insights?.observed_topics?.length
    ? insights.observed_topics
    : partner.public_topics_12m || []
  ).filter(Boolean);

  const articles = insights?.articles_count ?? 0;
  const webinars = insights?.webinars_count ?? 0;
  const cases = insights?.case_studies_count ?? 0;
  const latest = insights?.latest_content || [];
  const hasCounts = articles + webinars + cases > 0;

  if (profile.length === 0 && focus.length === 0 && topics.length === 0 && !hasCounts) {
    return null;
  }

  const updated =
    isoDate(insights?.last_updated) || isoDate(partner.public_profile_updated_at);
  const visibleTags = showAllTags ? focus : focus.slice(0, 12);

  return (
    <section className="py-8 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Publikt innehåll identifierat
              </h2>
              <p className="rounded-md border border-border bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                Informationen nedan har sammanställts av d365.se baserat på publikt tillgängliga
                källor såsom partnerns webbplats, artiklar, webinarier, kundcase och övrigt publikt
                innehåll. Informationen är ett komplement till partnerns egen profil.
              </p>
            </div>

            {(hasCounts || updated) && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <CountCard label="Identifierade artiklar" value={articles} />
                <CountCard label="Identifierade webinarier" value={webinars} />
                <CountCard label="Identifierade kundcase" value={cases} />
                <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-center">
                  <div className="text-sm font-bold text-foreground">{updated || "Ej angivet"}</div>
                  <div className="text-[11px] leading-tight text-muted-foreground">
                    Senast uppdaterad
                  </div>
                </div>
              </div>
            )}

            {focus.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Observerade fokusområden</h3>
                <ul className="flex flex-wrap gap-2" aria-label="Observerade fokusområden">
                  {visibleTags.map((t) => (
                    <li
                      key={t}
                      className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                {focus.length > 12 && (
                  <button
                    type="button"
                    onClick={() => setShowAllTags((v) => !v)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {showAllTags ? "Visa färre" : `Visa fler (${focus.length - 12})`}
                  </button>
                )}
              </div>
            )}

            {profile.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">AI-genererad marknadsprofil</h3>
                {profile.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm sm:text-base leading-relaxed text-foreground/90 max-w-[72ch]"
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}

            {topics.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Vanligast förekommande ämnen
                </h3>
                <ol className="space-y-1 text-sm text-foreground/90">
                  {topics.slice(0, 10).map((t, i) => (
                    <li key={t} className="flex items-baseline gap-2">
                      <span className="w-5 shrink-0 text-xs font-semibold text-muted-foreground">
                        {i + 1}.
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {latest.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Senaste identifierade innehåll
                </h3>
                <ul className="space-y-2">
                  {latest.slice(0, 15).map((item, i) => (
                    <ContentRow key={`${item.title}-${i}`} item={item} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerPublicSourcesSection;
