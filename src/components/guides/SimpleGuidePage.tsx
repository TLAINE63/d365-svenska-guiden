import type { ReactNode } from "react";
import ContinueEvaluation from "@/components/ContinueEvaluation";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import EditorialSource from "@/components/EditorialSource";
import { Button } from "@/components/ui/button";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

export interface GuideSection { title: string; intro?: string; cards?: { t: string; d: string; h?: string }[]; list?: string[] }
export interface GuideLink { label: string; href: string }
export interface SimpleGuideProps {
  path: string;
  tool: string;
  seoTitle: string;
  /** Endast när en exakt beslutad titel är längre än standardgränsen. */
  seoTitleMaxLength?: number;
  seoDescription: string;
  crumbs: { name: string; url: string }[];
  h1: string;
  /** Valfri ingress direkt under H1, före det korta svaret. */
  intro?: string;
  shortAnswer: string;
  sections: GuideSection[];
  next: { title: string; text: string; links: GuideLink[] };
  /** Valfritt innehåll direkt efter det korta svaret, före första avsnittet. */
  afterIntro?: ReactNode;
  /** Valfritt innehåll direkt efter nästa steg, t.ex. den gemensamma rådgivningsrutan. */
  afterNext?: ReactNode;
  faq: { q: string; a: string }[];
}

const SimpleGuidePage = (p: SimpleGuideProps) => {
  const track = (target: string) =>
    trackFunnelEvent({ event_type: "engagement", event_name: `${p.tool}_next_step`, page_path: p.path, metadata: { tool: p.tool, target } });
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <>
      <SEOHead title={p.seoTitle} titleMaxLength={p.seoTitleMaxLength} description={p.seoDescription} canonicalPath={p.path} breadcrumbs={p.crumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Navbar />
      <main className="min-h-screen pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <GuideBreadcrumb items={p.crumbs} className="mb-5" />
          <header className="max-w-3xl mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">{nowrapBrand(p.h1)}</h1>
            {p.intro && <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-6">{nowrapBrand(p.intro)}</p>}
            <h2 className="text-xl font-bold mb-2">Kort svar</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{nowrapBrand(p.shortAnswer)}</p>
          </header>

          {p.afterIntro && <div className="mb-12">{p.afterIntro}</div>}

          {p.sections.map((s) => (
            <section key={s.title} className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-3">{nowrapBrand(s.title)}</h2>
              {s.intro && <p className="text-muted-foreground mb-4 max-w-3xl">{nowrapBrand(s.intro)}</p>}
              {s.cards && (
                <div className="grid gap-4 md:grid-cols-2">
                  {s.cards.map((c) => (
                    c.h ? (
                      <Link key={c.t} to={c.h} onClick={() => track(c.h!)} className="block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary">
                        <h3 className="font-semibold mb-1 flex items-center gap-2"><span>{nowrapBrand(c.t)}</span> <ArrowRight className="h-4 w-4 text-primary" aria-hidden /></h3>
                        <p className="text-sm text-muted-foreground">{nowrapBrand(c.d)}</p>
                      </Link>
                    ) : (
                    <div key={c.t} className="rounded-lg border border-border bg-card p-5">
                      <h3 className="font-semibold mb-1">{nowrapBrand(c.t)}</h3>
                      <p className="text-sm text-muted-foreground">{nowrapBrand(c.d)}</p>
                    </div>
                    )
                  ))}
                </div>
              )}
              {s.list && (
                <ul className="grid gap-2 sm:grid-cols-2 text-sm">
                  {s.list.map((l) => (
                    <li key={l} className="flex gap-2 rounded-md border border-border bg-card px-3 py-2">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden />{nowrapBrand(l)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="mb-12 rounded-lg border border-border bg-secondary/40 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">{nowrapBrand(p.next.title)}</h2>
            <p className="text-muted-foreground mb-5 max-w-3xl">{nowrapBrand(p.next.text)}</p>
            <div className="flex flex-wrap gap-3">
              {p.next.links.map((l, i) => (
                <Button key={l.href} asChild variant={i === 0 ? "default" : "outline"}>
                  <Link to={l.href} onClick={() => track(l.href)}>{nowrapBrand(l.label)} {i === 0 && <ArrowRight className="h-4 w-4" />}</Link>
                </Button>
              ))}
            </div>
          </section>

          {p.afterNext && <div className="mb-12">{p.afterNext}</div>}

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vanliga frågor</h2>
            <div className="space-y-4">
              {p.faq.map((f) => <div key={f.q}><h3 className="font-semibold">{nowrapBrand(f.q)}</h3><p className="text-sm text-muted-foreground">{nowrapBrand(f.a)}</p></div>)}
            </div>
          </section>

          <ContinueEvaluation path={p.path} className="-mx-4 sm:-mx-6" />
          <EditorialSource sourceType="Köpguide" />
        </div>
      </main>
      <Footer />
    </>
  );
};
export default SimpleGuidePage;
