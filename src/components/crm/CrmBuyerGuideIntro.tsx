import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { resolvePriceTokens } from "@/lib/productPriceFormat";

const problems = [
  { q: "Affärer tappas mellan säljare och uppföljning", a: "Ni behöver en gemensam pipeline, aktiviteter och prognoser." },
  { q: "Kunder får olika svar beroende på kanal", a: "Ni behöver ärendehantering med gemensam kundhistorik." },
  { q: "Tekniker planeras i Excel och fakturering släpar", a: "Ni behöver fältservice med planering och arbetsorder." },
  { q: "Marknadsföringen når inte rätt kunder", a: "Ni behöver segmentering, kundresor och samlad kunddata." },
  { q: "Telefonköer och chattar hanteras i separata verktyg", a: "Ni behöver ett kontaktcenter som samlar kanalerna." },
];

const platformTypes = [
  { t: "CRM-sviter", d: "Sälj, marknad, service och fältservice på samma plattform, till exempel Dynamics 365 och Salesforce. Passar när flera avdelningar ska dela kunddata och processerna är komplexa." },
  { t: "Säljfokuserade CRM", d: "Enklare system för pipeline och kontakter, ofta nordiska alternativ som Lime och SuperOffice eller HubSpot. Passar mindre säljteam som vill komma igång snabbt." },
  { t: "Marketing-first-plattformar", d: "Börjar i marknadsföring och leadgenerering, till exempel HubSpot. Passar när inflödet av leads är den viktigaste frågan." },
  { t: "Kundservice-first-plattformar", d: "Specialiserade på ärenden och support, till exempel Zendesk och ServiceNow. Passar när kundservice är huvudbehovet och CRM för sälj redan finns." },
];

const decisive = [
  "Vilken kundprocess som ska förbättras först: sälj, service, fältservice eller marknad.",
  "Hur många avdelningar som ska dela kunddata, och hur komplexa processerna är.",
  "Vilka system CRM måste integreras med, särskilt affärssystem och Microsoft 365.",
  "Vem som äger CRM internt efter driftstart och hur mycket ni vill anpassa.",
  "Partnerns erfarenhet av just er process och bransch.",
];

const entries = [
  { need: "CRM för B2B-försäljning och säljpipeline", app: "Dynamics 365 Sales", to: "/d365sales/" },
  { need: "Kundservicesystem och ärendehantering", app: "Dynamics 365 Customer Service", to: "/d365customerservice/" },
  { need: "Kontaktcentersystem (CCaaS) med telefoni", app: "Dynamics 365 Contact Center", to: "/d365contactcenter/" },
  { need: "Fältservicesystem och teknikerplanering", app: "Dynamics 365 Field Service", to: "/d365fieldservice/" },
  { need: "Marketing automation, kundresor och CDP", app: "Dynamics 365 Customer Insights", to: "/d365marketing/" },
];

/** Generisk CRM-köpguide före produktfamiljen på /crm/. Manuellt skriven copy. */
export default function CrmBuyerGuideIntro() {
  return (
    <div className="bg-background">
      <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Vilka problem ska CRM lösa?</h2>
        <p className="mb-5 max-w-3xl text-foreground/80">Börja i problemet, inte i produkten. De flesta CRM-projekt börjar med en av de här situationerna:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {problems.map((p) => (
            <div key={p.q} className="rounded-lg border border-border bg-card p-4">
              <p className="font-semibold text-foreground">{p.q}</p>
              <p className="mt-1 text-sm text-foreground/80">{p.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h2 className="mb-5 text-2xl font-bold text-foreground">Vilka typer av CRM-plattformar finns?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {platformTypes.map((p) => (
            <div key={p.t} className="rounded-lg border border-border bg-card p-4">
              <p className="font-semibold text-foreground">{p.t}</p>
              <p className="mt-1 text-sm text-foreground/80">{nowrapBrand(p.d)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h2 className="mb-3 text-2xl font-bold text-foreground">Hur väljer man CRM?</h2>
        <ul className="list-disc space-y-2 pl-5 text-foreground/85">
          {decisive.map((d) => <li key={d}>{nowrapBrand(d)}</li>)}
        </ul>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h2 className="mb-3 text-2xl font-bold text-foreground">Vad kostar CRM typiskt?</h2>
        <p className="max-w-3xl text-foreground/85">
          {nowrapBrand(resolvePriceTokens("Kostnaden består av licens per användare, införande och förvaltning. Enklare säljfokuserade CRM har ofta lägre licens och kortare införande. För Dynamics 365 börjar Sales på {{price:sales-professional:exact}} och Customer Service på {{price:customer-service-pro:exact}} per användare och månad exkl. moms. Införandet kostar ofta mer än första årets licenser, så jämför alltid totalkostnaden."))}{" "}
          <Link to="/kostnad/" className="text-primary hover:underline">Se hela kostnadsguiden</Link>.
        </p>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-foreground">När passar Dynamics 365, och när bör ni titta på alternativ?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-2 font-semibold text-foreground">{nowrapBrand("Dynamics 365 passar ofta när")}</h3>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/85">
              <li>ni redan arbetar i Microsoft 365 och vill ha CRM i Outlook och Teams</li>
              <li>flera avdelningar ska dela samma kunddata</li>
              <li>processerna är komplexa eller kräver integration mot affärssystemet</li>
              <li>{nowrapBrand("ni vill kunna bygga vidare med Power Platform och Copilot")}</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-2 font-semibold text-foreground">Pröva alternativ när</h3>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/85">
              <li>ett litet team mest behöver kontakter och enkel uppföljning</li>
              <li>marknadsföring och leads är huvudbehovet</li>
              <li>kundservice ska lösas fristående och snabbt</li>
              <li>ni saknar intern ägare för ett större CRM-införande</li>
            </ul>
            <Link to="/jamfor/#crm" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Se CRM-jämförelserna <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h2 className="mb-2 text-2xl font-bold text-foreground">{nowrapBrand("Vilken Dynamics 365-app löser ert problem?")}</h2>
        <p className="mb-4 max-w-3xl text-foreground/80">{nowrapBrand("Dynamics 365 CRM (Customer Engagement) består av flera appar på samma plattform. Välj utifrån behovet:")}</p>
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {entries.map((e) => (
            <li key={e.to}>
              <Link to={e.to} className="flex flex-col gap-1 p-4 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-foreground">{e.need}</span>
                <span className="inline-flex items-center gap-1 text-sm text-primary">{nowrapBrand(e.app)} <ArrowRight className="h-4 w-4" aria-hidden /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
