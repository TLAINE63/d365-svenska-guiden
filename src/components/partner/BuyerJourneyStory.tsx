import scene1 from "@/assets/journey/scene1-research.jpg";
import scene2 from "@/assets/journey/scene2-discussion.jpg";
import scene3 from "@/assets/journey/scene3-compare.jpg";
import scene4 from "@/assets/journey/scene4-advice.jpg";
import scene5 from "@/assets/journey/scene5-partner.jpg";
import scene6 from "@/assets/journey/scene6-agreement.jpg";
import scene7 from "@/assets/journey/scene7-project.jpg";
import { Check, Info } from "lucide-react";

/**
 * Illustrativ köpresa i sju scener med samma fiktiva kundföretag och återkommande personer.
 * Ren presentation: ingen logik, inga priser, inga kontaktflöden.
 */
type Scene = {
  img: string;
  alt: string;
  stage: string;
  title: string;
  text: string;
  roleTitle: string;
  role: string[] | string;
};

const SCENES: Scene[] = [
  {
    img: scene1,
    alt: "Ekonomichef gör research om affärssystem vid sin dator på ett nordiskt kontor",
    stage: "Den första researchen",
    title: "Vi behöver förstå våra alternativ",
    text: "Köpresan börjar ofta med frågor. Vad behöver vi förändra? Vilka alternativ finns? Vad kostar ett nytt system?",
    roleTitle: "d365.se:s roll",
    role: ["Guider och artiklar", "Produktinformation", "Svar på vanliga frågor"],
  },
  {
    img: scene2,
    alt: "Ekonomichef, IT-ansvarig och vd diskuterar behov runt ett mötesbord med dokument och datorer",
    stage: "Intern diskussion",
    title: "Vad behöver vår verksamhet egentligen?",
    text: "Företaget börjar diskutera behov, problem, prioriteringar och möjliga investeringar.",
    roleTitle: "d365.se:s roll",
    role: ["Behovsanalyser", "Checklistor och kravställning", "Beslutsunderlag"],
  },
  {
    img: scene3,
    alt: "Två kollegor jämför lösningar och partners på en gemensam skärm",
    stage: "Fördjupad research och jämförelse",
    title: "Vilka lösningar och partners passar oss?",
    text: "Köparen undersöker kostnader, risker, lösningar och möjliga leverantörer, och vilka tilläggslösningar som kan behövas. Mycket av utvärderingen kan ske utan kontakt med en säljare.",
    roleTitle: "d365.se:s roll",
    role: ["Kalkylatorer och jämförelser", "Partnerprofiler och kundcase", "Kompletterande tilläggslösningar (ISV), till exempel för lager, e-handel eller dokumenthantering"],
  },
  {
    img: scene4,
    alt: "Rådgivare från d365.se i ett lugnt samtal med två personer från kundföretaget",
    stage: "Rådgivning med d365.se",
    title: "Vi skulle behöva diskutera nästa steg",
    text: "När kunden vill ha stöd erbjuder d365.se ett kostnadsfritt rådgivningssamtal på 20 minuter. Det är inget säljmöte med en partner, utan ett samtal för att:",
    roleTitle: "Samtalet hjälper kunden att",
    role: ["Klargöra behov", "Diskutera möjliga lösningar", "Förstå nästa steg", "Resonera om lämpliga partnerkompetenser"],
  },
  {
    img: scene5,
    alt: "Kundföretaget träffar en konsult från en Dynamics-partner som skissar ett processflöde",
    stage: "Möte med en relevant partner",
    title: "Nu vill vi träffa rätt kompetens",
    text: "När kunden vill gå vidare kan d365.se hjälpa till att introducera en eller flera relevanta partners.",
    roleTitle: "Viktigt att veta",
    role: "Kunden avgör själv vilka partners den vill träffa. Ingen kontakt förmedlas utan kundens samtycke.",
  },
  {
    img: scene6,
    alt: "Kund och partner går igenom ett projektavtal vid ett mötesbord",
    stage: "Beslut och avtal",
    title: "Vi har valt hur vi vill gå vidare",
    text: "Efter fortsatt dialog, utvärdering och förhandling kan kunden välja att gå vidare med en partner.",
    roleTitle: "Viktigt att veta",
    role: "d365.se garanterar inte att en introduktion leder till avtal. Beslutet är alltid kundens.",
  },
  {
    img: scene7,
    alt: "Gemensamt projektteam med kundens medarbetare och konsulter i en workshop om processer",
    stage: "Projekt och genomförande",
    title: "Nu börjar det verkliga arbetet",
    text: "Köpresans mål är inte ett möte eller en förfrågan. Kundens mål är att lyckas med sin investering. Det kräver rätt partner, tydliga mål och ett genomtänkt genomförande.",
    roleTitle: "d365.se:s roll",
    role: "Vår roll är främst att hjälpa kunden fram till ett välgrundat val och en relevant introduktion, inte att automatiskt delta i genomförandet.",
  },
];

export default function BuyerJourneyStory() {
  return (
    <section id="kopresan" aria-labelledby="kopresan-rubrik" className="py-14 md:py-20 bg-secondary/30 border-y border-border scroll-mt-64">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl lg:max-w-none mb-10 md:mb-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-3">Den moderna köpresan</p>
          <h2 id="kopresan-rubrik" className="text-2xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
            Köparen gör allt mer själv. Vi hjälper till längs vägen.
          </h2>
          <div className="space-y-3 text-base md:text-lg text-muted-foreground">
            <p>Att välja affärssystem eller CRM är en process som ofta börjar långt innan kunden vill prata med en leverantör.</p>
            <p>Köparen söker information, undersöker kostnader, jämför lösningar och diskuterar alternativen internt.</p>
            <p>d365.se hjälper företag genom hela denna resa, från de första frågorna till rådgivning, partnerval och ett möjligt projekt.</p>
          </div>
        </div>

        <div className="mb-12 flex gap-3 rounded-xl border border-border bg-card p-4 md:p-5 text-sm text-muted-foreground max-w-3xl lg:max-w-none">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            <strong className="font-semibold text-foreground">En illustrativ kundresa.</strong> Vi följer ett fiktivt, medelstort svenskt grossistföretag som överväger att byta affärssystem: ekonomichefen, IT-ansvarig, verksamhetschefen, en rådgivare från d365.se och konsulter från en Dynamics-partner. Bilderna är AI-genererade illustrationer, inte dokumentation av verkliga kundmöten eller projekt. Alla köpare går inte igenom samtliga steg. Köparen kan gå framåt, tillbaka eller avbryta, välja partner utan rådgivningssamtal och göra stora delar av resan på egen hand. d365.se finns tillgängligt under hela vägen.
          </p>
        </div>

        <ol className="relative space-y-12 md:space-y-20">
          <span aria-hidden="true" className="absolute left-4 md:left-1/2 top-2 bottom-2 w-px md:-translate-x-1/2 border-l-2 border-dashed border-accent/40" />
          {SCENES.map((s, i) => {
            const reverse = i % 2 === 1;
            return (
              <li key={s.title} className="relative pl-12 md:pl-0">
                <span aria-hidden="true" className="absolute left-0 md:left-1/2 top-0 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-4 ring-background">
                  {i + 1}
                </span>
                <div className="grid gap-6 md:grid-cols-2 md:gap-16 items-center">
                  <figure className={reverse ? "md:order-2" : ""}>
                    <img
                      src={s.img}
                      alt={s.alt}
                      width={1280}
                      height={896}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto rounded-xl border border-border object-cover aspect-[10/7] shadow-sm"
                    />
                  </figure>
                  <div className={reverse ? "md:order-1" : ""}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">Scen {i + 1} · {s.stage}</p>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">”{s.title}”</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{s.text}</p>
                    <div className="rounded-lg border-l-4 border-accent bg-card p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">{s.roleTitle}</p>
                      {Array.isArray(s.role) ? (
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                          {s.role.map((r) => (
                            <li key={r} className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />{r}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">{s.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-14 max-w-3xl lg:max-w-none text-base md:text-lg text-foreground font-medium border-l-4 border-primary pl-4">
          Er egen webbplats är viktig när kunden redan känner till er. d365.se har en annan roll:{" "}<span className="lg:whitespace-nowrap">att hjälpa företag som fortfarande försöker förstå vilka lösningar och partners som är relevanta.</span>
        </p>

        <div className="mt-8 max-w-3xl rounded-xl border border-border bg-card p-4 md:p-5 text-sm text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">Så arbetar d365.se med köparen</p>
          <p>Köparen kan göra research, jämföra lösningar och partners och använda verktygen helt utan säljkontakt. Rådgivning är frivillig, och kunden väljer själv om och när den vill träffa en partner.</p>
          <p>d365.se kan också arbeta aktivt med att upptäcka och följa upp relevanta behov. En företagssignal, till exempel att ett företag besökt sajten, är inte samma sak som en identifierad person eller ett kvalificerat kundprojekt.</p>
        </div>

        <div className="mt-12 rounded-2xl border-2 border-primary/30 bg-card p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">Varför spelar detta roll för er som Dynamics-partner?</h3>
          <ul className="grid gap-4 md:grid-cols-2 text-muted-foreground">
            {[
              "Kunden kan ha undersökt både lösningar och partners långt innan ni får möjlighet att träffas.",
              "Därför behöver er kompetens vara tydlig och begriplig redan under kundens research.",
              "Med Premium kan ni ge köparen ett bättre underlag för att bedöma er.",
              "När kunden är redo att gå vidare arbetar d365.se för att hjälpa rätt kund att hitta rätt partner.",
            ].map((t) => <li key={t} className="flex gap-2"><Check className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />{t}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
