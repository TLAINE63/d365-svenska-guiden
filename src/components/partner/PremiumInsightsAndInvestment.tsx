import { INSIGHT_COLUMNS } from "@/data/premiumValueStory";
import { ORDER_PRICES } from "@/lib/partnerOrder";
import { effectiveMonthly, premiumBreakEvenDealValue } from "@/lib/premiumValue";

const kr = (n: number) => `${n.toLocaleString("sv-SE")}\u00a0kr`;

/** Marknadsinsikter, Grundprofil mot Premium, investering och affärsförmedlingsargumentet. */
export function PremiumInsights() {
  return (
    <>
      <section id="marknadsinsikter" className="py-10 md:py-14 scroll-mt-64">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">d365.se Marknadsinsikter</h2>
          <p className="max-w-3xl lg:max-w-none text-muted-foreground mb-6">Premium ger inte bara synlighet, utan också möjlighet att lära er mer om er marknad. Insikterna är sammanställda och visar aldrig namn på besökande företag.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {([["Marknadsinsikter", "Vad intresserar köparna just nu?", INSIGHT_COLUMNS.market], ["Er egen närvaro", "Hur engagerar sig besökarna i ert erbjudande?", INSIGHT_COLUMNS.own]] as const).map(([title, lead, items]) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{lead}</p>
                <ul className="divide-y divide-border text-sm">{items.map((i) => <li key={i} className="py-2">{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Er egen statistik uppdateras löpande. En gemensam marknadsanalys skickas kvartalsvis.</p>
        </div>
      </section>
      <section className="py-10 md:py-14 bg-secondary/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Att finnas med är inte samma sak som att vara synlig</h2>
          <div className="max-w-3xl lg:max-w-none space-y-3 text-muted-foreground">
            <p>Med Grundprofil finns ert företag representerat i partnerregistret och i relevanta partnerjämförelser.</p>
            <p>Med Premium får ni möjlighet att aktivt presentera det som gör er till en attraktiv partner: er kompetens, era kundcase, era experter och er erfarenhet.</p>
            <p>Ni får dessutom insikter i hur marknaden utvecklas, hur besökarna engagerar sig i ert erbjudande och förmånliga villkor vid affärsförmedling.</p>
            <p>Grundprofil ger er en grundläggande närvaro.</p>
          </div>
          <p className="mt-3 font-semibold">Premium hjälper er att göra närvaron till en del av er marknads- och försäljningsstrategi.</p>
        </div>
      </section>
    </>
  );
}

export function PremiumInvestment() {
  const breakEven = premiumBreakEvenDealValue(1);
  return (
    <section id="premium-investering" className="py-10 md:py-14 scroll-mt-64">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Vad ni investerar</h2>
        <p className="max-w-3xl lg:max-w-none text-muted-foreground mb-6">En närvaro på d365.se kostar mellan {kr(effectiveMonthly(1))} och {kr(effectiveMonthly(3))} per månad vid årsbetalning.</p>
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          {([1, 2, 3] as const).map((n) => (
            <div key={n} className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-muted-foreground">{n} produktområde{n > 1 ? "n" : ""}</p>
              <p className="text-3xl font-bold mt-1 whitespace-nowrap">{kr(ORDER_PRICES.year[n])}</p>
              <p className="text-sm text-muted-foreground">per år</p>
              <p className="text-lg font-semibold mt-3 whitespace-nowrap">{kr(effectiveMonthly(n))}/mån</p>
              <p className="text-sm text-muted-foreground">vid årsbetalning, alternativt {kr(ORDER_PRICES.month[n])} vid månadsbetalning</p>
            </div>
          ))}
        </div>
        <h3 className="text-xl font-bold mb-3">Premium kan betala sig redan vid er första större affär</h3>
        <p className="max-w-3xl lg:max-w-none text-muted-foreground mb-4">Utöver synlighet och marknadsinsikter får Premiumpartners förmånliga villkor vid affärsförmedling. Ni betalar ingen mötesavgift för kvalificerade kundintroduktioner. Först när en förmedlad kontakt leder till affär utgår en ersättning på 2,5 procent, jämfört med 5 procent för partners med Grundprofil. En vunnen affär på {kr(breakEven)} kan därmed täcka hela årsavgiften för Premium genom enbart den lägre ersättningen vid affär.</p>
        <div className="overflow-x-auto border border-border rounded-lg bg-card max-w-2xl">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr><th scope="col" className="text-left px-3 py-2"><span className="sr-only">Villkor</span></th><th scope="col" className="text-right px-3 py-2">Grundprofil</th><th scope="col" className="text-right px-3 py-2">Premium</th></tr></thead>
            <tbody>
              {[["Årsavgift, ett produktområde", kr(0), kr(ORDER_PRICES.year[1])], ["Mötesavgift", kr(3500), kr(0)], ["Ersättning vid affär", "5 %", "2,5 %"]].map(([a, b, c]) => (
                <tr key={a} className="border-t border-border"><th scope="row" className="text-left px-3 py-2 font-normal">{a}</th><td className="text-right px-3 py-2 whitespace-nowrap">{b}</td><td className="text-right px-3 py-2 font-semibold whitespace-nowrap">{c}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Grundprofilens mötesavgift räknas av till 100 % vid affär. Ingen garanterad volym av kundmöten. Priser exklusive moms; ordinarie priser kan indexregleras årligen.</p>
      </div>
    </section>
  );
}
