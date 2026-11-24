import { ArrowRight, Check, Handshake, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Premium och Finder's fee som två separata, kompletterande erbjudanden. Endast presentation; priser och villkor ändras inte här. */
const PREMIUM = [
  "Fördjupad partnerpresentation",
  "Branschkompetens och specialiseringar per produktområde",
  "Kundcase och expertpresentationer",
  "Möjlighet till video",
  "Utökad information som hjälper köparen att jämföra partners",
  "Profilstatistik, kvartalsvis genomgång och namngiven kontaktperson",
  "Commerce, Human Resources och Project Operations ingår kostnadsfritt",
];

const FINDERS = [
  "Företagssignaler, till exempel besök på sajten, är inte automatiskt leads.",
  "En kvalificerad affärsmöjlighet kräver tillräcklig projektkontext och en uttrycklig avsikt att gå vidare.",
  "Kunden godkänner varje introduktion och väljer själv vilka partners (högst tre) som får kontakt.",
  "Flera partners kan vara relevanta för samma kund.",
  "Ni bedömer varje möjlighet och accepterar villkoren innan introduktionen sker.",
  "Ersättningen regleras i ett separat förmedlingsavtal: mötesavgift och 2,5% vid affär, där betald mötesavgift räknas av.",
];

export default function TwoWaysSection() {
  return (
    <section id="samarbeta" aria-labelledby="samarbeta-rubrik" className="py-14 md:py-20 bg-secondary/30 border-y border-border scroll-mt-64">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl lg:max-w-none mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-3">Samarbete</p>
          <h2 id="samarbeta-rubrik" className="text-2xl md:text-4xl font-bold text-foreground mb-5 leading-tight">Två sätt att samarbeta med d365.se</h2>
          <div className="space-y-3 text-base md:text-lg lg:text-base xl:text-lg text-muted-foreground">
            <p>d365.se hjälper företag att undersöka Dynamics&nbsp;365, jämföra partners och komma vidare i sina projekt.</p>
            <p>Som partner kan ni stärka er presentation med Premium och samarbeta kring kvalificerade kundintroduktioner via ett separat Finder’s fee-avtal.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 items-stretch">
          <article className="rounded-2xl border-2 border-primary bg-card p-6 md:p-8 flex flex-col">
            <Sparkles className="w-7 h-7 text-primary mb-3" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">Erbjudande 1 · Er presentation</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Premium, visa varför ni är rätt partner</h3>
            <p className="text-muted-foreground mb-5">Premium ger er möjlighet att presentera er kompetens mer utförligt, så att köparen förstår när ni passar redan under sin research.</p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-5">
              {PREMIUM.map((t) => <li key={t} className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />{t}</li>)}
            </ul>
            <div className="rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground space-y-1.5 mb-5">
              <p><strong className="font-semibold text-foreground">Verifiering:</strong> möjlig efter separat redaktionell granskning, aldrig automatiskt genom betalning.</p>
              <p><strong className="font-semibold text-foreground">INSIDE:</strong> videointervju som köps separat (4&nbsp;900&nbsp;kr), endast för Premiumpartners.</p>
            </div>
            <p className="text-lg font-semibold text-foreground">Från <span className="whitespace-nowrap">1&nbsp;000&nbsp;kr/mån</span> eller <span className="whitespace-nowrap">8&nbsp;000&nbsp;kr/år</span></p>
            <p className="text-xs text-muted-foreground mb-6">Ett produktområde, exklusive moms. Grundprofilen är kostnadsfri.</p>
            <Button asChild className="mt-auto self-start"><a href="#priser-innehall">Se Premium och priser<ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></a></Button>
          </article>

          <article className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col">
            <Handshake className="w-7 h-7 text-accent mb-3" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">Erbjudande 2 · Kundintroduktioner</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Finder’s fee, när vi hjälper er till en relevant kunddialog</h3>
            <p className="text-muted-foreground mb-5">d365.se arbetar aktivt med att identifiera och utveckla möjliga kundprojekt. När en kund uttryckligen vill gå vidare kan vi introducera lämpliga partners.</p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-5">
              {FINDERS.map((t) => <li key={t} className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />{t}</li>)}
            </ul>
            <div className="rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground mb-6">
              <p><strong className="font-semibold text-foreground">Premium ger lägre mötesavgift</strong> för affärer från 250&nbsp;tkr och vid partnerbyte, enligt prislistan. Exempel: 3&nbsp;000&nbsp;kr i stället för 5&nbsp;000&nbsp;kr för affärer mellan 250&nbsp;tkr och 1&nbsp;Mkr.</p>
            </div>
            <Button asChild variant="outline" className="mt-auto self-start"><a href="#affarsmojligheter">Se hur kundförmedling fungerar<ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></a></Button>
          </article>
        </div>

        <p className="mt-8 max-w-3xl lg:max-w-none text-sm text-muted-foreground">
          Premium köper aldrig högre relevansordning. Partners utan Premium kan också vara relevanta och rekommenderas. Verifiering är ingen automatisk Premiumförmån.
        </p>
      </div>
    </section>
  );
}
