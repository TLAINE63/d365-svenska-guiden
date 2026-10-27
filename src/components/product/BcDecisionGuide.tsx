import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonQuickLinks from "@/components/ComparisonQuickLinks";

const needs = [
  ["Ekonomi", "Samla redovisning, reskontra och uppföljning i stället för separata register."],
  ["Försäljning", "Knyt ihop offerter, order och fakturering med ekonomi och lager."],
  ["Inköp", "Följ inköpsbehov, leverantörer och varumottagning i samma flöde."],
  ["Lager", "Få en gemensam bild av artiklar, tillgänglighet och lagertransaktioner."],
  ["Projekt", "Följ budget, tid, inköp och resultat per projekt."],
  ["Rapportering", "Samla underlag för uppföljning utan återkommande manuella sammanställningar."],
];

export default function BcDecisionGuide() {
  return (
    <>
      <section id="bc-passform" aria-labelledby="bc-fit-heading" className="scroll-mt-24 border-t border-border bg-background py-8 sm:py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="bc-fit-heading" className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">Passar Business Central oss?</h2>
          <p className="mb-6 max-w-3xl text-muted-foreground">Business Central är värt att undersöka när flera av dessa flöden behöver hänga ihop. Utgå från era processer, inte enbart från antal anställda eller användare.</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {needs.map(([title, text]) => (
              <li key={title} className="flex gap-3">
                <CheckCircle2 aria-hidden className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div><h3 className="font-semibold text-foreground">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p></div>
              </li>
            ))}
          </ul>
          <div className="mt-7 border-t border-border pt-6">
            <h3 className="mb-2 text-lg font-semibold text-foreground">När passar det mindre bra?</h3>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">Om ni främst behöver enkel bokföring och fakturering kan ett enklare ekonomisystem räcka. Om branschkraven kräver många tillägg eller anpassningar, kontrollera helheten innan ni väljer produkt.</p>
            <h3 className="mb-2 mt-5 text-lg font-semibold text-foreground">När bör ni titta på <span className="whitespace-nowrap">Dynamics 365</span> Finance &amp; Supply Chain Management istället?</h3>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">Vid komplex koncernstyrning, stora transaktionsvolymer eller avancerad produktion och försörjningskedja bör ni jämföra alternativen. Flera bolag eller internationell verksamhet innebär inte i sig att Business Central är för litet.</p>
            <Link to="/affarssystem/#comparison" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Jämför Business Central med Finance &amp; Supply Chain <ArrowRight aria-hidden className="h-4 w-4 shrink-0" /></Link>
          </div>
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Button asChild className="h-auto min-h-11 whitespace-normal text-left"><Link to="/businesscentral/matchningstest/">Testa om Business Central passar <ArrowRight aria-hidden className="h-4 w-4 shrink-0" /></Link></Button>
            <Link to="/kom-igang/" className="text-sm font-medium text-primary hover:underline">Testa vilken <span className="whitespace-nowrap">Dynamics 365</span>-lösning som passar</Link>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">BC-testet skiljer på standard, Premium, konfiguration, tillägg och behov som ligger utanför Business Central.</p>
          <div className="mt-6 border-t border-border pt-4 text-sm">
            <h3 className="font-semibold text-foreground">Kommer ni från Navision eller Dynamics NAV?</h3>
            <Link to="/nav-till-business-central/" className="mt-2 inline-flex items-center gap-2 text-primary hover:underline">Bedöm komplexiteten i er NAV-migrering <ArrowRight aria-hidden className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
      <div id="bc-jamforelse" className="scroll-mt-24">
        <section className="border-t border-border bg-secondary/20 pt-8 sm:pt-10">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">Jämför Business Central</h2>
            <p className="mb-4 max-w-3xl text-muted-foreground">Börja med Business Central och Finance &amp; Supply Chain om ni väljer inom Microsofts ERP-utbud. Jämför sedan andra alternativ som är relevanta för era processer.</p>
            <Button asChild variant="outline" className="h-auto min-h-11 whitespace-normal text-left"><Link to="/affarssystem/#comparison">Business Central eller Finance &amp; Supply Chain? <ArrowRight aria-hidden className="h-4 w-4 shrink-0" /></Link></Button>
          </div>
        </section>
        <ComparisonQuickLinks productKeys="bc" heading="Befintliga jämförelser med andra affärssystem" className="border-t-0" />
      </div>
    </>
  );
}

export function BcOptionalDeepDive() {
  return (
    <section className="border-t border-border bg-background py-8 sm:py-10">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">Vill ni gå djupare i Business Central-utvärderingen?</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">På businesscentral.se finns specialiserad fördjupning om Business Central. Det är ett frivilligt komplement. Ni kan bedöma passform, jämföra, räkna på kostnad och hitta partner här på d365.se.</p>
        <Button asChild variant="outline" className="h-auto min-h-11 whitespace-normal text-left"><a href="https://businesscentral.se/?utm_source=d365.se&utm_medium=referral&utm_campaign=bc-fordjupning" target="_blank" rel="noopener noreferrer">Fördjupa utvärderingen på businesscentral.se <ExternalLink aria-hidden className="h-4 w-4 shrink-0" /></a></Button>
      </div>
    </section>
  );
}

export function BcNextSteps() {
  return (
    <section aria-labelledby="bc-next-heading" className="border-t border-border bg-secondary/40 py-8 sm:py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="bc-next-heading" className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">Redo att gå vidare?</h2>
        <p className="mb-5 max-w-3xl text-muted-foreground">Räkna på er kostnadsbild eller undersök partners med erfarenhet av era processer. Ni väljer själva nästa steg, inget skickas till en partner utan ert godkännande.</p>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild className="h-auto min-h-11 whitespace-normal"><Link to="/businesscentral/roi-kalkylator/">Beräkna kostnaden <ArrowRight aria-hidden className="h-4 w-4 shrink-0" /></Link></Button>
          <Button asChild variant="outline" className="h-auto min-h-11 whitespace-normal"><Link to="/business-central-partners-sverige/">Hitta Business Central-partner <ArrowRight aria-hidden className="h-4 w-4 shrink-0" /></Link></Button>
        </div>
        <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-6">
          <Link to="/kom-igang/" className="text-primary hover:underline">Fortfarande osäker? Testa produktvalet</Link>
          <Link to="/kravspecifikation/?produkt=bc" className="text-primary hover:underline">Samla era krav inför partnerdialogen</Link>
        </div>
      </div>
    </section>
  );
}