import type { ReactNode } from "react";
import { ArrowDown, Calculator, Check, ShieldCheck } from "lucide-react";
import { TIDSGRANSER } from "@/utils/programTerms";
import { PREMIUM_MEETING_TERMS, FINDERS_FEE_VARIANTS, FINDERS_FEE_AFFAR } from "@/lib/partnerOrder";
import adviceImg from "@/assets/journey/scene4-advice.jpg";
import discussionImg from "@/assets/journey/scene2-discussion.jpg";
import partnerImg from "@/assets/journey/scene5-partner.jpg";
import agreementImg from "@/assets/journey/scene6-agreement.jpg";

/** Finder's fee som egen sektion: tratt, räkneexempel, kvalitetsgaranti och priser. Endast presentation; beloppen följer prislistan. */
const STEPS = [
  { img: adviceImg, alt: "Köpare i rådgivningssamtal om sitt Dynamics 365-projekt", who: "Köparen", title: "Verklig efterfrågan", text: "Ett företag använder guider, kalkyler och rådgivning på d365.se för att förstå sitt behov.", filter: "Inga kalla listor. Ett sajtbesök är aldrig ett lead." },
  { img: discussionImg, alt: "Rådgivare går igenom behov, tidplan och budget med ett företag", who: "d365.se", title: "Vi kvalificerar", text: "Vi går igenom behov, omfattning, tidplan och budget tillsammans med köparen.", filter: "Bara konkreta projekt med tydlig avsikt att välja partner går vidare." },
  { img: partnerImg, alt: "Partner bedömer en beskriven affärsmöjlighet", who: "Ni", title: "Ni avgör om ni vill gå vidare", text: "Vi presenterar affärsmöjligheten för partners med rätt kompetens.", filter: "Ni bedömer projektet och accepterar villkoren innan vi går vidare med introduktionen." },
  { img: agreementImg, alt: "Kundmöte mellan köpare och partner runt ett mötesbord", who: "Köparen", title: "Kundmötet bokas", text: "Köparen väljer själv vilka partners som får kontakt och lämnar sitt samtycke.", filter: "Högst tre partners. Ni möter en köpare som redan vet vilka ni är." },
];


const nb = (s: string) => s.replace(/ /g, "\u00A0");

export default function FindersFeeSection({ cta }: { cta: ReactNode }) {
  return (
    <section id="affarsmojligheter" aria-labelledby="ff-rubrik" className="py-12 md:py-16 bg-secondary/30 border-y border-border scroll-mt-64">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-2">Erbjudande 2 · Finder’s fee</p>
        <h2 id="ff-rubrik" className="text-2xl md:text-3xl font-bold mb-4">Vi hittar och kvalificerar kunder. Ni väljer affärsmöjligheterna.</h2>
        <p className="max-w-3xl lg:max-w-none text-muted-foreground mb-10">Vi identifierar företag med konkreta behov, kvalificerar deras projekt och hjälper dem att hitta rätt partner. Ni betalar för genomförda kundmöten: 1 000 kr med Premium eller 3 500 kr med Grundprofil, oavsett produktområde. Blir det affär tillkommer 2,5 % av fakturerat konsult- och projektvärde under de första 12 månaderna, med mötesavgiften avräknad.</p>

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex flex-col rounded-xl border border-border bg-card overflow-hidden">
              <img src={s.img} alt={s.alt} loading="lazy" className="h-36 w-full object-cover" />
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">{s.who}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{s.text}</p>
                <p className="mt-auto flex gap-2 rounded-md bg-secondary/60 p-2 text-xs text-foreground"><Check className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />{s.filter}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="grid gap-6 lg:grid-cols-2 mb-12">
          <div className="rounded-xl border-2 border-primary bg-card p-6">
            <Calculator className="w-7 h-7 text-primary mb-3" aria-hidden="true" />
            <h3 className="text-xl font-bold mb-1">Så ser kalkylen ut</h3>
            <p className="text-sm text-muted-foreground mb-4">Exempel (Premium, CRM): en vunnen affär där partnern fakturerar {nb("600 000 kr")} i konsult- och projektvärde under de första 12 månaderna.</p>
            <dl className="text-sm divide-y divide-border">
              <div className="flex justify-between py-2"><dt>Mötesavgift efter kundmötet</dt><dd className="font-semibold">{nb("1 000 kr")}</dd></div>
              <div className="flex justify-between py-2"><dt>Avgift vid affär (2,5 %)</dt><dd className="font-semibold">{nb("15 000 kr")}</dd></div>
              <div className="flex justify-between py-2"><dt>Avräkning av betald mötesavgift</dt><dd className="font-semibold text-accent">{nb("−1 000 kr")}</dd></div>
              <div className="flex justify-between py-2 text-base"><dt className="font-semibold">Slutbetalning vid affär</dt><dd className="font-bold">{nb("14 000 kr")}</dd></div>
            </dl>
            <p className="mt-4 rounded-md bg-secondary/60 p-3 text-sm text-foreground">Exempel (Premium, CRM): en vunnen affär där partnern fakturerar 600 000 kr i konsult- och projektvärde under de första 12 månaderna. Mötesavgiften är 1 000 kr och avgiften vid affär 15 000 kr. Efter avräkning blir slutbetalningen 14 000 kr. Totalkostnaden är <strong>15 000 kr</strong>.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <ShieldCheck className="w-7 h-7 text-accent mb-3" aria-hidden="true" />
            <h3 className="text-xl font-bold mb-3">Tryggt för er</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" /><span><strong className="text-foreground">Kvalitetsgaranti:</strong> håller mötet inte den avtalade nivån kan ni reklamera kvalificeringen inom 5 arbetsdagar.</span></li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" /><span><strong className="text-foreground">Ni väljer:</strong> ni tackar ja eller nej till varje möjlighet innan introduktionen sker.</span></li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" /><span><strong className="text-foreground">Ingen affär, ingen avgift vid affär:</strong> betald mötesavgift räknas alltid av i sin helhet.</span></li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" /><span><strong className="text-foreground">Neutralt:</strong> introduktioner påverkar aldrig relevansordningen i partnersökningen.</span></li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" /><span><strong className="text-foreground">Premium sänker mötesavgiften</strong> för alla produktområden. Premium innehåller inga utlovade möten.</span></li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" /><span><strong className="text-foreground">Köparens fria val:</strong> köparen träffar högst tre partners per förfrågan och väljer själv vilka. Köparen kan alltid kontakta vilken partner som helst i katalogen direkt, utan att någon avgift tas ut.</span></li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3"><ArrowDown className="w-4 h-4 text-accent" aria-hidden="true" />Priser för Finder’s fee</div>
        <div className="overflow-x-auto border border-border rounded-lg bg-card mb-4">
          <table className="w-full text-sm">
            <caption className="text-left px-3 pt-3 font-semibold text-foreground">Samma mötesavgift för alla produktområden (nya projekt, partnerbyte och expertförmedling)</caption>
            <thead className="bg-muted/50"><tr><th scope="col" className="text-left px-3 py-2">Produktområde</th><th scope="col" className="text-right px-3 py-2">Premium</th><th scope="col" className="text-right px-3 py-2">Grundprofil</th></tr></thead>
            <tbody>
              {FINDERS_FEE_VARIANTS.map((b) => (
                <tr key={b.name} className="border-t border-border"><th scope="row" className="text-left px-3 py-2 font-normal">{b.name}</th><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">{nb(`${b.premium.toLocaleString("sv-SE")} kr`)}</td><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">{nb(`${b.grund.toLocaleString("sv-SE")} kr`)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mb-4 text-sm text-muted-foreground"><strong className="text-foreground">Produkter och produktområden:</strong> {FINDERS_FEE_VARIANTS[0].scope}</p>
        <ul className="mb-4 space-y-1 text-sm text-muted-foreground list-disc pl-5">
          <li>{PREMIUM_MEETING_TERMS}</li>
          <li>Samma mötesavgift gäller även när affären omfattar flera produktområden.</li>
          <li>Vid expertförmedling tas mötesavgiften ut när kunden har haft intervju med experten, inte när ett CV skickas. Avgiften gäller per expert.</li>
        </ul>
        <p className="mb-4 text-sm text-foreground">{FINDERS_FEE_AFFAR}</p>
        <details className="mb-6 text-xs text-muted-foreground">
          <summary className="cursor-pointer text-sm font-medium text-foreground py-2">Villkor och tidsgränser</summary>
          <div className="space-y-2 pt-2">
            <p><strong className="text-foreground">Kvalificerat möte:</strong> ett genomfört möte där d365.se före introduktionen har identifierat ett konkret behov, bedömt att det är relevant för partnern, haft kontakt med en beslutsfattare eller projektansvarig, dokumenterat nuläge, behov, tidsram och uppskattad omfattning, fått kundens önskemål om att träffa partnern och partnerns accept av villkoren. Avbokade eller uteblivna möten debiteras inte.</p>
            <p><strong className="text-foreground">Köparens fria val:</strong> Finder’s fee gäller endast när d365.se har genomfört behovsanalysen och introduktionen.</p>
            <p><strong className="text-foreground">Uppföljning:</strong> d365.se följer upp med köparen efter mötet. Partnern lämnar på begäran underlag för rapporterat konsult- och projektvärde.</p>
            <p><strong className="text-foreground">Tidsgränser:</strong> {TIDSGRANSER.join(" ")}</p>
            <p>Licenser, molnförbrukning, hårdvara, resor och vidarefakturerade tredjepartskostnader ingår inte. Alla belopp är exklusive moms. Samma villkor för alla partners inom respektive nivå. Fullständiga villkor regleras i förmedlingsavtalet.</p>
          </div>
        </details>
        {cta}
      </div>
    </section>
  );
}
