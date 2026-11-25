import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import { PREMIUM_REASONS, JOURNEY_PRESENCE, VISIBILITY_QUESTIONS } from "@/data/premiumValueStory";

/** 6 anledningar (med länk till respektive steg i köpresan) och synlighetsfrågorna. */
export default function PremiumValueStory() {
  return (
    <>
      <section id="varfor-premium" className="py-10 md:py-14 scroll-mt-64">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-2">Premium</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">6 anledningar att välja Premium</h2>
          <p className="max-w-3xl lg:max-w-none text-muted-foreground mb-8">Var med när kunderna utvärderar. Förstå vad marknaden efterfrågar. Gör fler affärer.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PREMIUM_REASONS.map((r, i) => {
              const step = JOURNEY_PRESENCE[i];
              const link = step && <>{step.where}<ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /></>;
              const linkCls = "mt-auto px-5 pb-5 text-sm font-medium text-primary flex items-center gap-1 hover:underline";
              return (
              <article key={r.title} className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
                <img src={r.image} alt="" loading="lazy" width={640} height={360} className="w-full aspect-video object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.body}</p>
                </div>
                {step && (step.href.startsWith("#") ? <a href={step.href} className={linkCls}>{link}</a> : <Link to={step.href} className={linkCls}>{link}</Link>)}
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="synlighetsfragor" className="py-10 md:py-14 scroll-mt-64">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Hur synliga är ni när nästa kund börjar sin utvärdering?</h2>
          <ul className="grid gap-3 md:grid-cols-2 mb-6">
            {VISIBILITY_QUESTIONS.map((q) => (
              <li key={q} className="flex gap-3 rounded-lg border border-border bg-card p-4 text-sm"><HelpCircle className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />{q}</li>
            ))}
          </ul>
          <p className="text-muted-foreground">Med d365.se Premium får ni ytterligare en kanal för synlighet, marknadsinsikter och nya affärsmöjligheter.</p>
          <p className="mt-2 font-semibold">Kunderna utvärderar sina alternativ. Se till att de har ett bra underlag för att utvärdera även er.</p>
        </div>
      </section>
    </>
  );
}
