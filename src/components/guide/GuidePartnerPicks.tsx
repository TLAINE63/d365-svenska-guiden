import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Users } from "lucide-react";
import { usePartners } from "@/hooks/usePartners";
import ShortlistButton from "@/components/ShortlistButton";
import { partnerWebsiteUrl } from "@/lib/track";
import { trackPartnerClick } from "@/utils/trackPartnerClick";

type Key = "bc" | "fsc" | "sales" | "service";

interface Group {
  key: Key;
  label: string;
  application: string;
  allHref: string;
}

interface Props {
  id?: string;
  heading: string;
  intro: string;
  groups: Group[];
  pageSource: string;
  perGroup?: number;
}

const shuffle = <T,>(arr: T[], seed: number): T[] => {
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
 * Kontextuell partnerpuff i guider. Varje produktgrupp får lika många platser,
 * så att ERP- och CRM-specialister behandlas likvärdigt. Avtalspartners först.
 */
const GuidePartnerPicks = ({ id = "guide-partners", heading, intro, groups, pageSource, perGroup }: Props) => {
  const { data } = usePartners();
  const seed = useMemo(() => Math.floor(Math.random() * 1e6), []);
  const n = perGroup ?? (groups.length > 1 ? 2 : 3);

  const picks = useMemo(
    () =>
      groups.map((g, gi) => {
        const list = (data || []).filter((p) => p.is_featured === true && p.product_filters?.[g.key]);
        const signed = list.filter((p) => p.agreement_signed);
        const rest = list.filter((p) => !p.agreement_signed);
        return { g, partners: [...shuffle(signed, seed + gi), ...shuffle(rest, seed + gi + 7)].slice(0, n) };
      }),
    [data, groups, seed, n],
  );

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="py-12 sm:py-14 bg-secondary/40 border-t border-border scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="mb-6 max-w-3xl">
          <h2 id={`${id}-heading`} className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{heading}</h2>
          <p className="text-muted-foreground">{intro}</p>
        </div>
        <div className={`grid gap-5 ${groups.length > 1 ? "md:grid-cols-2" : ""}`}>
          {picks.map(({ g, partners }) => (
            <div key={g.key} className="rounded-lg border border-border bg-card p-6 flex flex-col">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
                <Users className="h-5 w-5 text-accent" aria-hidden />
                <span>Verifierade specialister på <span className="whitespace-nowrap">{g.label}</span></span>
              </h3>
              {partners.length === 0 ? (
                <p className="text-sm text-muted-foreground mb-4">Vi kan hjälpa er vidare. Se hela partnerlistan eller kontakta oss.</p>
              ) : (
                <ul className={`grid gap-3 mb-4 ${groups.length > 1 ? "" : "sm:grid-cols-3"}`}>
                  {partners.map((p) => {
                    const url = partnerWebsiteUrl(p.website);
                    return (
                      <li key={p.slug} className="rounded-md border border-border p-3">
                        <Link to={`/partner/${p.slug}/`} className="font-medium text-foreground hover:underline">{p.name}</Link>
                        <div className="mt-2 flex gap-2">
                          {url && (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener"
                              onClick={() => trackPartnerClick(p.name, p.website, pageSource, { product: g.application })}
                              className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-primary px-2 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                              Till webbplats <ExternalLink className="h-3 w-3" aria-hidden />
                            </a>
                          )}
                          <ShortlistButton
                            variant="compact"
                            entry={{ slug: p.slug, name: p.name, url: `/partner/${p.slug}/`, verified: true }}
                            productArea={g.application}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Link to={g.allHref} className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                Se alla partners för <span className="whitespace-nowrap">{g.label}</span> <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuidePartnerPicks;
