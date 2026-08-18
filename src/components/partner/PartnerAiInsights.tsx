import { Check, Minus } from "lucide-react";
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

/** Kort analys: max ca 3 meningar. Resten ligger i den fördjupade analysen. */
function shortenToSentences(paragraphs: string[], maxSentences = 3): string {
  const text = paragraphs.join(" ").replace(/\s+/g, " ").trim();
  if (!text) return "";
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!sentences) return text;
  return sentences.slice(0, maxSentences).join("").trim();
}

const PRODUCT_LABELS: Array<{ match: string[]; label: string }> = [
  { match: ["Finance", "Supply Chain Management", "Finance & SCM", "Finance & Supply Chain"], label: "Dynamics 365 F&SCM" },
  { match: ["Business Central"], label: "Dynamics 365 Business Central" },
  { match: ["Sales"], label: "Dynamics 365 Sales" },
  { match: ["Customer Service"], label: "Dynamics 365 Customer Service" },
  { match: ["Field Service"], label: "Dynamics 365 Field Service" },
  { match: ["Customer Insights", "Customer Insights (Marketing)", "Marketing"], label: "Dynamics 365 Customer Insights" },
];

const SIZE_ORDER = ["1-49", "50-99", "100-249", "250-999", "1.000-4.999", ">5.000"];

function sizeSummary(sizes: string[]): string | null {
  const ordered = sizes
    .filter((s) => SIZE_ORDER.includes(s))
    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  if (ordered.length === 0) return null;
  const first = ordered[0].split("-")[0].replace(/[^\d.]/g, "");
  const lastRaw = ordered[ordered.length - 1];
  const last = lastRaw.startsWith(">") ? "5.000+" : lastRaw.split("-")[1];
  return `${first}–${last} anställda`;
}

/** Centrala matchningsfakta – kort, faktabaserat, utan värderande språk. */
function buildMatchFacts(partner: DatabasePartner): string[] {
  const facts: string[] = [];
  const apps = partner.applications || [];
  const products = PRODUCT_LABELS.filter((p) => p.match.some((m) => apps.includes(m))).map((p) => p.label);
  facts.push(...products.slice(0, 2));

  const industries = (partner.industries || []).slice(0, 2);
  facts.push(...industries);

  const pf = (partner.product_filters || {}) as Record<string, { companySize?: string[] } | undefined>;
  const sizes = Array.from(
    new Set(Object.values(pf).flatMap((f) => f?.companySize || [])),
  );
  const size = sizeSummary(sizes);
  if (size) facts.push(size);


  const geo = (partner.geography || []).filter(Boolean);
  if (geo.length > 0) facts.push(geo.slice(0, 2).join(" / "));

  return Array.from(new Set(facts.filter(Boolean)));
}

const PartnerAiInsights = ({ partner }: Props) => {
  const shortText = shortenToSentences(toParagraphs(partner.ai_summary));
  const full = toParagraphs(partner.ai_summary_full);
  const bestFit = (partner.best_fit_for || []).filter((s) => s && s.trim());
  const notFit = (partner.not_a_fit || []).filter((s) => s && s.trim());
  const matchFacts = buildMatchFacts(partner);

  if (!shortText && full.length === 0 && bestFit.length === 0 && notFit.length === 0) return null;

  const hasDeepDive = full.length > 0 || bestFit.length > 0 || notFit.length > 0;

  return (
    <section className="py-8 sm:py-10 bg-muted/40 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              d365.se:s analys
            </h2>

            {shortText && (
              <p className="text-base leading-relaxed text-foreground max-w-[72ch]">{shortText}</p>
            )}

            {matchFacts.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Centrala matchningsfakta">
                {matchFacts.map((fact) => (
                  <li
                    key={fact}
                    className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            )}

            <p className="text-[11px] leading-snug text-muted-foreground">
              AI-assisterad analys baserad på partnerdata, publika källor och dokumenterade referenser.
            </p>

            {hasDeepDive && (
              <details className="group border-t border-border pt-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:hidden">
                  <span className="group-open:hidden">Visa fördjupad analys</span>
                  <span className="hidden group-open:inline">Dölj fördjupad analys</span>
                </summary>

                <div className="mt-4 space-y-6">
                  {full.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Fördjupad analys
                      </h3>
                      {full.map((p, i) => (
                        <p key={i} className="text-sm sm:text-base leading-relaxed text-foreground/90 max-w-[72ch]">
                          {p}
                        </p>
                      ))}
                    </div>
                  )}

                  {(bestFit.length > 0 || notFit.length > 0) && (
                    <div className="grid gap-5 md:grid-cols-2">
                      {bestFit.length > 0 && (
                        <article>
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
                        <article>
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
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerAiInsights;
