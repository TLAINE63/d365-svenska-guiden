import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import { PREMIUM_REASONS, JOURNEY_PRESENCE, VISIBILITY_QUESTIONS } from "@/data/premiumValueStory";

/** Sex anledningar, närvaro genom köpresan och synlighetsfrågorna. */
export default function PremiumValueStory() {
  return (
    <>
      <section id="varfor-premium" className="py-10 md:py-14 scroll-mt-64">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-2">Premium</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Sex anledningar att välja Premium</h2>
          <p className="max-w-3xl lg:max-w-none text-muted-foreground mb-8">Syns när kunderna utvärderar. Förstå vad marknaden efterfrågar. Gör fler affärer.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PREMIUM_REASONS.map((r) => (
              <article key={r.title} className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
                <img src={r.image} alt="" loading="lazy" width={640} height={360} className="w-full aspect-video object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="narvaro-kopresan" className="py-10 md:py-14 bg-secondary/30 border-y border-border scroll-mt-64">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Er närvaro genom köparens beslutsprocess</h2>
          <p className="max-w-3xl lg:max-w-none text-muted-foreground mb-8">Kunden har ofta inte bestämt vilka leverantörer den vill prata med. Här möter ni köparen i varje skede.</p>
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {JOURNEY_PRESENCE.map((s, i) => {
              const inner = (<><span className="text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span><h3 className="text-lg font-semibold mt-1">{s.title}</h3><p className="text-sm text-muted-foreground mt-1">{s.body}</p><p className="text-sm font-medium mt-3 flex items-center gap-1">{s.where}<ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /></p></>);
              const cls = "block h-full rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors";
              return <li key={s.title}>{s.href.startsWith("#") ? <a href={s.href} className={cls}>{inner}</a> : <Link to={s.href} className={cls}>{inner}</Link>}</li>;
            })}
          </ol>
          <p className="mt-6 font-semibold">En partnerprofil är bara en del av erbjudandet. Värdet ligger i närvaron genom hela köpresan.</p>
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
