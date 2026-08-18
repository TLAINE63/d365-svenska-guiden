import { Check, Minus, Tag } from "lucide-react";
import { DatabasePartner } from "@/hooks/usePartners";

interface Props {
  partner: DatabasePartner & {
    ai_summary?: string | null;
    ai_summary_full?: string | null;
    best_fit_for?: string[] | null;
    ai_tags?: string[] | null;
  };
}

function toParagraphs(text?: string | null): string[] {
  const raw = (text || "").trim();
  if (!raw) return [];
  return raw
    .split(/\r?\n+/)
    .map((p) => p.replace(/^\s*(?:[-–—•✅]+\s*|\d+[.)]\s+)/, "").trim())
    .filter(Boolean);
}

const PartnerAiInsights = ({ partner }: Props) => {
  const short = toParagraphs(partner.ai_summary);
  const full = toParagraphs(partner.ai_summary_full);
  const bestFit = (partner.best_fit_for || []).filter((s) => s && s.trim());
  const notFit = (partner.not_a_fit || []).filter((s) => s && s.trim());
  const tags = (partner.ai_tags || []).filter((s) => s && s.trim());

  if (short.length === 0 && full.length === 0 && bestFit.length === 0 && notFit.length === 0 && tags.length === 0)
    return null;

  return (
    <section className="py-8 sm:py-12 bg-muted/40 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              d365.se:s analys av {partner.name}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-[70ch]">
              AI-assisterad analys baserad på partnerdata, publika källor och dokumenterade
              referenser. Analysen är vägledande och ersätter inte en egen utvärdering.
            </p>
          </header>

          {short.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sammanfattning
              </h3>
              <div className="space-y-2">
                {short.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}

          {(bestFit.length > 0 || notFit.length > 0) && (
            <div className="grid gap-5 md:grid-cols-2">
              {bestFit.length > 0 && (
                <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Passar bäst för
                  </h3>
                  <ul className="space-y-2">
                    {bestFit.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {notFit.length > 0 && (
                <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Mindre lämplig för
                  </h3>
                  <ul className="space-y-2">
                    {notFit.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
                    Betyder inte att partnern saknar kompetens inom området, utan att tillgänglig
                    data ger mindre stöd för att rekommendera dem för just dessa behov.
                  </p>
                </article>
              )}
            </div>
          )}

          {full.length > 0 && (
            <details className="group rounded-xl border border-border bg-card p-5 sm:p-6">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:hidden">
                <span className="group-open:hidden">Läs hela analysen</span>
                <span className="hidden group-open:inline">Dölj hela analysen</span>
              </summary>
              <div className="mt-4 space-y-3">
                {full.map((p, i) => (
                  <p key={i} className="text-sm sm:text-base leading-relaxed text-foreground/90">
                    {p}
                  </p>
                ))}
              </div>
            </details>
          )}

          {tags.length > 0 && (
            <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                Kompetensområden
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnerAiInsights;
