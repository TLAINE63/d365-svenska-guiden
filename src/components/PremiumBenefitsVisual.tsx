import { BadgeCheck, BarChart3, Check, Minus, PlayCircle, Users } from "lucide-react";
import openingShot from "@/assets/truvio-exflow-profil-oppning.webp.asset.json";
import industryShot from "@/assets/truvio-exflow-profil-behov.webp.asset.json";
import insideShot from "@/assets/inside-intervju-4ps.webp.asset.json";

const COMPARE: { label: string; basic: boolean; premium: boolean }[] = [
  { label: "Produktområden och branscher", basic: true, premium: true },
  { label: "Fördjupad företagspresentation", basic: false, premium: true },
  { label: "Specialiseringar och era beskrivningar av typiska kunder", basic: false, premium: true },
  { label: "Kundcase och experter", basic: false, premium: true },
  { label: "Redaktionell granskning inför verifiering", basic: false, premium: true },
  { label: "Profilstatistik, kvartalsvis genomgång och namngiven kontakt", basic: false, premium: true },
];

/** Visual, concrete Premium benefits. Only lists benefits included in the published offer. */
export default function PremiumBenefitsVisual() {
  return (
    <section id="premium-formaner" className="py-12 md:py-16 bg-secondary/30 border-y border-border scroll-mt-64">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold text-primary mb-2">Premium</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 max-w-3xl">Premium hjälper kunden att förstå varför ni kan vara rätt partner</h2>
        <blockquote className="max-w-3xl border-l-4 border-accent pl-4 text-lg text-foreground mb-10">
          Premium handlar inte om att köpa fler rekommendationer. Det handlar om att ge köparen ett bättre underlag för att förstå och välja er.
        </blockquote>

        {/* 1. Kompetens */}
        <div className="grid gap-8 lg:grid-cols-2 items-center mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-2"><Users className="w-4 h-4" aria-hidden="true" />1. Visa er kompetens</span>
            <h3 className="text-xl font-bold mb-3">En profil som visar vad ni faktiskt gör</h3>
            <p className="text-muted-foreground mb-5">Så här kan en utökad och verifierad presentation se ut på d365.se, här med Truvios ExFlow. En Premiumprofil för en Dynamics-partner samlar på samma sätt specialiseringar, branscherfarenhet, kundcase, experter och en fördjupad företagspresentation på ett ställe.</p>
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full text-sm">
                <caption className="sr-only">Jämförelse mellan Grundprofil och Premium</caption>
                <thead className="bg-muted/50"><tr><th scope="col" className="text-left px-3 py-2">Innehåll</th><th scope="col" className="px-3 py-2">Grundprofil</th><th scope="col" className="px-3 py-2 text-primary">Premium</th></tr></thead>
                <tbody>
                  {COMPARE.map((r) => (
                    <tr key={r.label} className="border-t border-border">
                      <th scope="row" className="text-left px-3 py-2 font-normal">{r.label}</th>
                      {[r.basic, r.premium].map((v, i) => (
                        <td key={i} className="px-3 py-2 text-center">{v ? <Check className="inline w-4 h-4 text-accent" aria-label="Ingår" /> : <Minus className="inline w-4 h-4 text-muted-foreground" aria-label="Ingår inte" />}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <a href="#profiljamforelse" className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">Jämför med er egen profil</a>
          </div>
          <figure className="space-y-3">
            <img src={openingShot.url} alt="Skärmbild av inledningen på Truvios produktsida för ExFlow Business Central på d365.se, med märket Verifierad tilläggslösning, utökad presentation och produktkontakt" loading="lazy" decoding="async" width={1160} height={610} className="w-full rounded-lg border border-border shadow-md" />
            <img src={industryShot.url} alt="Skärmbild av avsnitten om vad ExFlow Business Central löser och när lösningen kan passa" loading="lazy" decoding="async" width={1160} height={585} className="w-full rounded-lg border border-border shadow-md" />
            <figcaption className="text-xs text-muted-foreground">Riktiga skärmbilder från Truvios publicerade, verifierade presentation av ExFlow Business Central på d365.se (2026-11-17).</figcaption>
          </figure>
        </div>

        {/* 2. Förtroende */}
        <div className="grid gap-8 lg:grid-cols-2 items-center mb-14">
          <figure className="lg:order-2">
            <img src={insideShot.url} alt="Bild från d365.se INSIDE-intervjun med 4PS om hur bygg- och projektbolag väljer affärssystem" loading="lazy" decoding="async" width={1280} height={720} className="w-full rounded-lg border border-border shadow-md" />
            <figcaption className="mt-2 text-xs text-muted-foreground">Bild från en genomförd d365.se INSIDE-intervju (med 4PS).</figcaption>
          </figure>
          <div className="lg:order-1">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-2"><BadgeCheck className="w-4 h-4" aria-hidden="true" />2. Bygg förtroende före första mötet</span>
            <h3 className="text-xl font-bold mb-3">Köparen bildar sig en uppfattning innan ni ses</h3>
            <p className="text-muted-foreground mb-4">Kundcase, experter och era egna beskrivningar gör att köparen förstår era erfarenheter och ert arbetssätt redan innan första kontakten.</p>
            <div className="rounded-lg border border-border bg-card p-4 mb-4">
              <p className="flex items-center gap-2 font-semibold mb-1"><PlayCircle className="w-4 h-4 text-primary" aria-hidden="true" />d365.se INSIDE, separat tjänst</p>
              <p className="text-sm text-muted-foreground">En redaktionell intervju där era experter berättar om specialisering, kundbehov och erfarenheter. Köps separat och endast av Premiumpartners: <strong className="text-foreground whitespace-nowrap">4&nbsp;900&nbsp;kr</strong>, exklusive moms. Ingår inte i Premiumpriset.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-semibold mb-1">Verifiering är en separat granskning</p>
              <p className="text-sm text-muted-foreground">Redaktionen går igenom produktområden, branscher, kundcase och experter innan märket Verifierad partner publiceras. Betalning för Premium garanterar inte verifiering.</p>
            </div>
          </div>
        </div>

        {/* 3. Närvaro */}
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-2"><BarChart3 className="w-4 h-4" aria-hidden="true" />3. Utveckla er närvaro</span>
          <h3 className="text-xl font-bold mb-3">Följ upp och förbättra presentationen över tid</h3>
          <ul className="grid gap-4 md:grid-cols-3">
            {[
              { t: "Profilstatistik", d: "Se hur ofta profilen visas och vilka åtgärder besökarna tar, i ert månadsbrev med egna siffror." },
              { t: "Kvartalsvis genomgång", d: "Ingår i Premium: vi går igenom statistik och innehåll tillsammans och föreslår förbättringar." },
              { t: "Egen profileringslänk", d: "Uppdatera kundcase, experter och beskrivningar när ni vill, med en namngiven kontaktperson hos oss." },
            ].map((x) => (
              <li key={x.t} className="rounded-lg border border-border bg-card p-4"><p className="font-semibold mb-1">{x.t}</p><p className="text-sm text-muted-foreground">{x.d}</p></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
