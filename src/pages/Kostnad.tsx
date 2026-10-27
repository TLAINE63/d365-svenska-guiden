import { nowrapBrand } from "@/lib/nowrapBrand";
import { priceSources } from "@/lib/guideSources";
import SourcesAndMethod from "@/components/SourcesAndMethod";
import EditorialAssessment from "@/components/EditorialAssessment";
import EditorialSource from "@/components/EditorialSource";
import Navbar from "@/components/Navbar";
import PageOfferBanner from "@/components/PageOfferBanner";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { Link } from "react-router-dom";
import CostBreakdown from "@/components/CostBreakdown";
import CostProjectExamples from "@/components/CostProjectExamples";
import CostContactForm from "@/components/CostContactForm";
import LicenseCostTable from "@/components/LicenseCostTable";
import TcoScenarios from "@/components/TcoScenarios";
import QuickQuoteEstimator from "@/components/QuickQuoteEstimator";
import { Price } from "@/components/Price";
import { costBreakdowns } from "@/data/costBreakdown";
import SourceNote from "@/components/SourceNote";


const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kostnad", url: "https://d365.se/kostnad/" },
];

const kostnadFaqs = [
  {
    question: "Vad ingår i totalkostnaden för Dynamics 365?",
    answer:
      "Totalkostnaden består av tre delar. Licensen betalas löpande per användare och månad. Implementationen är en engångskostnad hos partnern och omfattar förstudie, konfiguration, integrationer, datamigrering, test och utbildning. Efter go-live tillkommer löpande kostnader för förvaltning, vidareutveckling, integrationsdrift och konsumtionsbaserade AI-tjänster. Räkna med alla tre delarna över tre år när du jämför offerter.",
  },
  {
    question: "Vad är skillnaden mellan licenspris och implementationskostnad?",
    answer:
      "Licenspriset är Microsofts abonnemang och beror på vilken applikation och nivå du väljer samt hur många som ska använda systemet. Implementationskostnaden är partnerns arbete med att sätta upp lösningen efter din verksamhet och beror på antal användare, hur nära standard du kan arbeta, antal integrationer och om data ska migreras. Licensen är alltså förutsägbar; implementationen är det som varierar mest mellan offerter.",
  },

  {
    question: "Vad kostar Dynamics 365 per användare och månad?",
    answer:
      "Business Central Essentials kostar 70 USD per användare och månad, Premium 100 USD, Dynamics 365 Sales Enterprise 105 USD och Finance 210 USD (Microsofts listpriser, faktureras normalt i SEK via partner eller CSP). Team Members-licenser för läsande användare ligger klart lägre. Se hela listan på prissidan.",
  },
  {
    question: "Vad kostar det att implementera Business Central i Sverige?",
    answer:
      "Snabbstart till fast pris i standardversion finns från 50 000 kr (Update Rapid Start, cirka 2 veckor; NAB Solutions Business Central Start, 1–3 veckor). Ett traditionellt projekt räknat på 11 600 kr per konsultdag ligger på ca 175 000–465 000 kr för ett litet projekt (15–40 dagar), 465 000 kr–1,2 MSEK för ett medelstort (40–100 dagar) och 1,2–2,9 MSEK för ett stort (100–250 dagar). Beloppen är räkneexempel, inte offerter.",
  },
  {
    question: "Hur påverkar branschen kostnaden för att införa Business Central?",
    answer:
      "Branschen avgör ofta var i spannet projektet hamnar. Ett litet projekt i tjänste-, grossist- eller e-handelsföretag ligger på ca 175 000–350 000 kr (15–30 dagar), i bygg, livsmedel, mode eller fältservice ca 230 000–465 000 kr (20–40 dagar) och i tillverkning ca 290 000–580 000 kr (25–50 dagar). För stora projekt är spannet ca 1,0–2,1 MSEK för tjänsteföretag och 1,7–3,5 MSEK för tillverkning, bygg och livsmedel.",
  },
  {
    question: "Vad kostar Finance & Supply Chain Management jämfört med Business Central?",
    answer:
      "Finance & Supply Chain Management har både högre licenskostnad per användare och ett större implementationsprojekt, eftersom lösningen är byggd för komplexa processer, flera legala enheter och avancerad lagerstyrning. Räkna med 2–6 MSEK för ett litet projekt, 6–15 MSEK för ett medelstort och från 15 MSEK för ett stort, jämfört med Business Central som ofta landar under 1 MSEK.",
  },
  {
    question: "Vilka kostnader tillkommer efter go-live?",
    answer:
      "Löpande kostnader består av licenser, förvaltningsavtal eller supporttimmar, vidareutveckling vid förändrade processer, integrationsdrift samt konsumtionsbaserade kostnader för Copilot, AI-agenter och Azure-tjänster. Budgetera 15–25 procent av implementationskostnaden per år för förvaltning och vidareutveckling.",
  },
  {
    question: "Hur vet jag om en offert är rimlig?",
    answer:
      "Jämför offerten mot intervallen på den här sidan, be om timpris och estimerat antal timmar per roll, och kontrollera att integrationer, datamigrering, utbildning och test finns med som egna poster. Begär också en treårig totalkostnad – inte bara första årets pris. Saknas poster i offerten dyker de upp som tilläggsbeställningar senare.",
  },
  {
    question: "Går det att införa Dynamics 365 stegvis för att sprida kostnaden?",
    answer:
      "Ja. Ett vanligt upplägg är att först driftsätta ekonomi och order, därefter lager, produktion eller CRM i nästa fas. Det sänker den initiala kostnaden och risken, men kräver att partnern har en tydlig faslplan så att grunddata och integrationer inte behöver göras om.",
  },
];

const productOrder: {
  key: keyof typeof costBreakdowns;
  label: string;
  path: string;
  /** Nyckel i prisregistret för instegslicensen. */
  licenseKey?: string;
  /** ROI-kalkylator för produkten, när en sådan finns. */
  roiPath?: string;
}[] = [
  { key: "business-central", label: "Business Central", path: "/businesscentral/", licenseKey: "bc-essentials", roiPath: "/businesscentral/roi-kalkylator/" },
  { key: "finance-scm", label: "Finance & Supply Chain Management (F&O)", path: "/finance-supply-chain/", licenseKey: "finance", roiPath: "/finance-supply-chain/roi-kalkylator/" },
  { key: "sales", label: "Sales", path: "/d365sales/", licenseKey: "sales-professional", roiPath: "/d365sales/roi-kalkylator/" },
  { key: "customer-service", label: "Customer Service", path: "/d365customerservice/", licenseKey: "customer-service-pro", roiPath: "/d365customerservice/roi-kalkylator/" },
  { key: "contact-center", label: "Contact Center", path: "/d365contactcenter/", licenseKey: "contact-center-komplett", roiPath: "/d365contactcenter/roi-kalkylator/" },
  { key: "field-service", label: "Field Service", path: "/d365fieldservice/", licenseKey: "field-service", roiPath: "/d365fieldservice/roi-kalkylator/" },
  { key: "commerce", label: "Commerce", path: "/d365commerce/", licenseKey: "commerce" },
  { key: "project-operations", label: "Project Operations", path: "/d365projectoperations/", licenseKey: "project-operations" },
  { key: "human-resources", label: "Human Resources", path: "/d365humanresources/", licenseKey: "human-resources" },
  { key: "marketing", label: "Customer Insights – Journeys", path: "/d365marketing/", licenseKey: "customer-insights", roiPath: "/d365marketing/roi-kalkylator/" },
  { key: "copilot", label: "Copilot & agenter", path: "/copilot/" },
];


/**
 * Samlad köparvänlig kostnadsguide för Dynamics 365.
 * Återanvänder CostBreakdown-komponenten per produkt.
 */
export default function Kostnad() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Vad kostar Dynamics 365? 3-års TCO och införande"
        description="Totalkostnad över tre år för Dynamics 365 i SEK: Business Central från ca 50 tkr, mindre projekt från ca 175 tkr, Sales från ca 75 tkr. Licens, införande, förvaltning och branschens påverkan."
        canonicalPath="/kostnad/"
      />

      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={kostnadFaqs} />
      <Navbar />

      <main className="pt-10">
        <section className="py-8 sm:py-12 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">Kostnad</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              Kostnadsguide
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {nowrapBrand("Vad kostar Dynamics 365, inklusive införande och förvaltning?")}
            </h1>
            <h2 className="text-xl font-bold mb-3">Kort svar</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              Total­kostnaden består av tre delar: <strong>abonnemang</strong> (licens per
              användare och månad), <strong>implementation</strong> (en engångs­kostnad hos
              din partner) och <strong>löpande kostnader</strong> efter go-live
              (förvaltning, vidareutveckling, AI-konsumtion). Här är typiska intervall för
              svenska införanden – använd dem som sanity-check mot partner­offerterna, inte
              som facit. Intervallen gäller både affärssystem (ERP) och CRM-lösningar.
            </p>
            <p className="mb-4 text-sm text-muted-foreground">Letar ni bara efter licenspriser per användare och månad? <Link to="/priser/" className="font-medium text-primary hover:underline">Se priser och licenser för Dynamics{"\u00A0"}365</Link></p>
            <SourceNote
              className="mb-6"
              source="Microsofts officiella listpriser samt d365.se:s sammanställning av offert- och projektintervall från svenska Dynamics 365-partners"
              updated="2026-06-11"
              method="Intervallen är spann, inte snittpriser: de visar vad partners normalt offererar för respektive omfattning och kan avvika i enskilda projekt."
            />
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                to="/implementationskalkylator/"
                className="inline-flex items-center px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Räkna ut pris och omfattning →
              </Link>
              <Link
                to="/priser/"
                className="inline-flex items-center px-4 py-2 rounded border border-border bg-card hover:bg-secondary/60 transition-colors"
              >
                Se Microsofts officiella listpriser →
              </Link>
              <Link
                to="/upphandlingsguiden/"
                className="inline-flex items-center px-4 py-2 rounded border border-border bg-card hover:bg-secondary/60 transition-colors"
              >
                Upphandlings­guiden →
              </Link>
              <Link
                to="/kravspecifikation/"
                className="inline-flex items-center px-4 py-2 rounded border border-border bg-card hover:bg-secondary/60 transition-colors"
              >
                Generera en kravspecifikation →
              </Link>
            </div>

            <nav aria-label="Innehåll i guiden" className="mt-8 border-t border-border pt-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Innehåll i guiden
              </h2>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm list-decimal pl-5">
                <li><a href="#tco-3-ar" className="underline hover:text-foreground">Totalkostnad över tre år</a></li>
                <li><a href="#snabb-offertfraga" className="underline hover:text-foreground">Snabb offertfråga – ditt kostnadsspann direkt</a></li>
                <li><a href="#per-applikation" className="underline hover:text-foreground">Implementationskostnad per applikation</a></li>
                <li><a href="#licenskostnad" className="underline hover:text-foreground">Licenskostnad – vad abonnemanget kostar</a></li>
                <li><a href="#vanliga-fragor" className="underline hover:text-foreground">Vanliga frågor om kostnad</a></li>
              </ol>
            </nav>
          </div>
        </section>
        <EditorialAssessment assessment="cost" />

        <TcoScenarios />

        <QuickQuoteEstimator />

        {/* Genvägar */}
        <section className="py-8 bg-secondary/30 border-y border-border" id="per-applikation">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              Del 2 av 3
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Implementationskostnad per applikation
            </h2>
            <p className="text-base text-muted-foreground mb-5 max-w-3xl">
              Implementationen är en engångskostnad hos partnern. Nedan finns typiska
              spann per applikation, vad som driver kostnaden och vad som blir löpande
              efter go-live – plus länk till ROI-kalkylatorn där nyttan räknas hem.
            </p>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Hoppa till applikation
            </h3>
            <ul className="flex flex-wrap gap-2 text-sm">
              {productOrder.map((p) => (
                <li key={p.key}>
                  <a
                    href={`#${p.key}`}
                    className="inline-flex items-center px-3 py-1.5 rounded border border-border bg-card hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {productOrder.map((p) => (
          <div key={p.key} id={p.key} className="scroll-mt-24">
            <div className="container mx-auto px-4 sm:px-6 pt-10">
              <div className="max-w-5xl">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {nowrapBrand(p.label)}
                  </h3>
                  <Link to={p.path} className="text-sm text-primary underline">
                    Läs mer om {p.label} →
                  </Link>
                </div>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {p.licenseKey && (
                    <span>
                      Licens från{" "}
                      <strong className="text-foreground">
                        <Price productKey={p.licenseKey} mode="short" />
                      </strong>
                    </span>
                  )}
                  {p.roiPath && (
                    <Link to={p.roiPath} className="text-primary underline">
                      Räkna hem nyttan i ROI-kalkylatorn →
                    </Link>
                  )}
                </p>
              </div>
            </div>
            <CostBreakdown product={p.key} hideOverviewLink />
            <CostProjectExamples product={p.key} />
          </div>
        ))}


        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="rounded-xl border border-primary/40 bg-card p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nästa steg</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Ta med kostnadsbilden in i ert beslutsunderlag
              </h2>
              <p className="text-base text-muted-foreground mb-6">
                Ni vet nu ungefär vad licens, införande och förvaltning kostar. Samla behov och prioriteringar i Din Dynamics-utvärdering, så blir det enklare att jämföra offerter och partners.
              </p>
              <Link
                to="/underlag/"
                className="inline-flex items-center px-5 py-2.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-semibold"
              >
                Skapa ert beslutsunderlag
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Vet ni redan vad ni behöver?{" "}
                <Link to="/valjdynamics365partner/" className="font-medium text-primary hover:underline">Hitta upp till 3 matchande partners</Link>
              </p>
            </div>
          </div>
        </section>

        <LicenseCostTable />

        <section className="py-8 sm:py-12 bg-secondary/30 border-t border-border" id="vanliga-fragor">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Vanliga frågor om vad Dynamics 365 kostar
            </h2>
            <div className="space-y-5">
              {kostnadFaqs.map((faq) => (
                <div key={faq.question} className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CostContactForm />
      </main>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <PageOfferBanner />
        </div>
      </section>
      <SourcesAndMethod externalSources={priceSources} analysis="D365.SE:s sammanställning av offert- och projektintervall från svenska Dynamics 365-partners, uppdaterad 2026-06-11. Intervallen är spann, inte snittpriser eller bindande offerter. Kostnadsresonemang och rekommendationer är redaktionella bedömningar; Microsofts prislista belägger inte implementationskostnaderna." />
      <EditorialSource sourceType="Köpguide" />
      <Footer />
    </div>
  );
}
