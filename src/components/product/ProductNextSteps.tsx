import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, ExternalLink, ListChecks, Users } from "lucide-react";
import { usePartners } from "@/hooks/usePartners";
import ShortlistButton from "@/components/ShortlistButton";
import { partnerWebsiteUrl } from "@/lib/track";
import { trackPartnerClick } from "@/utils/trackPartnerClick";
import { productNextSteps } from "@/data/productNextSteps";

interface Props {
  product: keyof typeof productNextSteps;
  pageSource: string;
}

const seededShuffle = <T,>(arr: T[], seed: number): T[] => {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = Math.floor((s / 0x7fffffff) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * "Nästa steg för ert beslut" – symmetrisk avslutning på alla produktsidor.
 * Visar endast publicerade partners med registrerad kompetens för produkten;
 * avtalspartners först, därefter slumpad ordning per besök.
 */
const ProductNextSteps = ({ product, pageSource }: Props) => {
  const cfg = productNextSteps[product];
  const { data } = usePartners();
  const seed = useMemo(() => Math.floor(Math.random() * 1e6), []);

  const partners = useMemo(() => {
    const list = (data || []).filter((p) => p.is_featured === true && p.product_filters?.[cfg.partnerKey]);
    const signed = list.filter((p) => p.agreement_signed);
    const rest = list.filter((p) => !p.agreement_signed);
    return [...seededShuffle(signed, seed), ...seededShuffle(rest, seed + 1)].slice(0, 3);
  }, [data, cfg.partnerKey, seed]);

  const name = <span className="whitespace-nowrap">{cfg.label}</span>;

  return (
    <section aria-labelledby="next-steps-heading" className="py-12 sm:py-16 bg-secondary/40 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <h2 id="next-steps-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Nästa steg för ert beslut om {name}
          </h2>
          <p className="text-muted-foreground">
            Oavsett om ni utvärderar för första gången eller vill bygga vidare på en befintlig lösning finns här tre konkreta vägar framåt.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* 1. Räkna */}
          <div className="rounded-lg border border-border bg-card p-6 flex flex-col">
            <Calculator className="h-6 w-6 text-accent mb-3" aria-hidden />
            <h3 className="text-lg font-semibold text-foreground mb-2">Räkna och analysera</h3>
            <p className="text-sm text-muted-foreground mb-4">{cfg.calc.text}</p>
            <ul className="space-y-2">
              {cfg.calc.links.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    {l.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Partners */}
          <div className="rounded-lg border border-border bg-card p-6 flex flex-col">
            <Users className="h-6 w-6 text-accent mb-3" aria-hidden />
            <h3 className="text-lg font-semibold text-foreground mb-2">Verifierade specialister på {name}</h3>
            {partners.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-4">Vi kan hjälpa er vidare. Se hela partnerlistan nedan eller kontakta oss.</p>
            ) : (
              <ul className="space-y-3 mb-4">
                {partners.map((p) => {
                  const url = partnerWebsiteUrl(p.website);
                  return (
                    <li key={p.slug} className="rounded-md border border-border p-3">
                      <Link to={`/partner/${p.slug}/`} className="font-medium text-foreground hover:underline">
                        {p.name}
                      </Link>
                      <div className="mt-2 flex gap-2">
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener"
                            onClick={() => trackPartnerClick(p.name, p.website, pageSource, { product: cfg.application })}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-primary px-2 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                          >
                            Till webbplats <ExternalLink className="h-3 w-3" aria-hidden />
                          </a>
                        )}
                        <ShortlistButton
                          variant="compact"
                          entry={{ slug: p.slug, name: p.name, url: `/partner/${p.slug}/`, verified: true }}
                          productArea={cfg.application}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <a href="#partners" className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              Se alla partners för {name} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>

          {/* 3. Kontrollfrågor */}
          <div className="rounded-lg border border-border bg-card p-6 flex flex-col">
            <ListChecks className="h-6 w-6 text-accent mb-3" aria-hidden />
            <h3 className="text-lg font-semibold text-foreground mb-2">Tre frågor att ställa innan ni väljer</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              {cfg.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductNextSteps;
