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
    question: "Vad kostar Dynamics 365 per användare och månad?",
    answer:
      "Business Central Essentials kostar 70 USD per användare och månad, Premium 100 USD, Dynamics 365 Sales Enterprise 105 USD och Finance 210 USD (Microsofts listpriser, faktureras normalt i SEK via partner eller CSP). Team Members-licenser för läsande användare ligger klart lägre. Se hela listan på prissidan.",
  },
  {
    question: "Vad kostar det att implementera Business Central i Sverige?",
    answer:
      "Ett litet införande med standardprocesser och få integrationer ligger normalt på 100 000–250 000 kr. Ett medelstort projekt med flera bolag, integrationer och anpassningar landar oftast på 400 000–1 200 000 kr. Stora koncerninföranden går över 1,5 miljoner kr. Intervallen är offertspann från svenska partners, inte snittpriser.",
  },
  {
    question: "Vad kostar Finance & Supply Chain Management jämfört med Business Central?",
    answer:
      "Finance & Supply Chain Management har både högre licenskostnad per användare och ett större implementationsprojekt, eftersom lösningen är byggd för komplexa processer, flera legala enheter och avancerad lagerstyrning. Räkna med en implementationsbudget som är två till fyra gånger så stor som ett jämförbart Business Central-projekt.",
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
  { key: "finance-scm", label: "Finance & Supply Chain", path: "/finance-supply-chain/", licenseKey: "finance", roiPath: "/finance-supply-chain/roi-kalkylator/" },
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
        title="Vad kostar Dynamics 365? Licens + implementation"
        description="Komplett pris- och kostnadsguide för Microsoft Dynamics 365: licenspris per användare och månad, engångskostnad för implementation (S/M/L-intervall i SEK), löpande kostnader efter go-live och en snabb offertfråga som ger ditt kostnadsspann direkt."
        canonicalPath="/kostnad/"
      />

      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={kostnadFaqs} />
      <Navbar />

      <main className="pt-10">
        <section className="py-8 sm:py-12 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">Kostnad</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              På köparens sida
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Vad kostar Dynamics 365 – egentligen?
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              Total­kostnaden består av tre delar: <strong>abonnemang</strong> (licens per
              användare och månad), <strong>implementation</strong> (en engångs­kostnad hos
              din partner) och <strong>löpande kostnader</strong> efter go-live
              (förvaltning, vidareutveckling, AI-konsumtion). Här är typiska intervall för
              svenska införanden – använd dem som sanity-check mot partner­offerterna, inte
              som facit.
            </p>
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
                <li><a href="#licenskostnad" className="underline hover:text-foreground">Licenskostnad – vad abonnemanget kostar</a></li>
                <li><a href="#snabb-offertfraga" className="underline hover:text-foreground">Snabb offertfråga – ditt kostnadsspann direkt</a></li>
                <li><a href="#per-applikation" className="underline hover:text-foreground">Implementationskostnad per applikation</a></li>
                <li><a href="#vanliga-fragor" className="underline hover:text-foreground">Vanliga frågor om kostnad</a></li>
              </ol>
            </nav>
          </div>
        </section>

        <LicenseCostTable />

        <QuickQuoteEstimator />

        {/* Genvägar */}
        <section className="py-8 bg-secondary/30 border-y border-border" id="per-applikation">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
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
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {p.label}
                  </h2>
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
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Behöver du hjälp att tolka offerterna?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              Vi är på köparens sida. Använd vår behovsanalys för att få en mognads­profil
              och konkreta rekommendationer – eller låt partnerfiltret föreslå 2–4 partners
              som matchar ditt behov.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/beslutsmognad/"
                className="inline-flex items-center px-5 py-2.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Skapa en behovsanalys
              </Link>
              <Link
                to="/valjdynamics365partner/"
                className="inline-flex items-center px-5 py-2.5 rounded border border-border bg-card hover:bg-secondary/60 transition-colors"
              >
                Hitta 2–4 matchande partners
              </Link>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12 bg-secondary/30 border-t border-border">
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
      <Footer />
    </div>
  );
}
