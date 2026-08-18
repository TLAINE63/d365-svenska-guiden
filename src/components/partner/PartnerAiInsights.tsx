import { Sparkles, ThumbsUp, AlertTriangle, Tag } from "lucide-react";
import { DatabasePartner } from "@/hooks/usePartners";

interface Props {
  partner: DatabasePartner & {
    ai_summary_full?: string | null;
    best_fit_for?: string[] | null;
    ai_tags?: string[] | null;
  };
}

const PartnerAiInsights = ({ partner }: Props) => {
  const full = (partner.ai_summary_full || "").trim();
  const bestFit = (partner.best_fit_for || []).filter((s) => s && s.trim());
  const notFit = (partner.not_a_fit || []).filter((s) => s && s.trim());
  const tags = (partner.ai_tags || []).filter((s) => s && s.trim());

  if (!full && bestFit.length === 0 && notFit.length === 0 && tags.length === 0) return null;

  const paragraphs = full ? full.split(/\r?\n+/).map((p) => p.trim()).filter(Boolean) : [];

  return (
    <section className="py-8 sm:py-10 bg-gradient-to-b from-background to-slate-50/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-5">
          {paragraphs.length > 0 && (
            <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Sparkles className="w-4 h-4 text-[hsl(var(--cta-orange))]" />
                Fördjupad AI-sammanfattning
              </h2>
              <div className="space-y-3">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-sm sm:text-base leading-relaxed text-slate-700">
                    {p}
                  </p>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Sammanställd av d365.se utifrån partnerns publicerade material och profildata.
              </p>
            </article>
          )}

          {(bestFit.length > 0 || notFit.length > 0) && (
            <div className="grid gap-5 md:grid-cols-2">
              {bestFit.length > 0 && (
                <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                  <h2 className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <ThumbsUp className="w-4 h-4 text-[hsl(var(--accent))]" />
                    Passar bäst för
                  </h2>
                  <ul className="space-y-2">
                    {bestFit.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {notFit.length > 0 && (
                <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                  <h2 className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Mindre lämplig för
                  </h2>
                  <ul className="space-y-2">
                    {notFit.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )}
            </div>
          )}

          {tags.length > 0 && (
            <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Tag className="w-4 h-4 text-[hsl(var(--cta-orange))]" />
                Kompetensområden
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
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
