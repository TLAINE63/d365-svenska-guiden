import Navbar from "@/components/Navbar";
import PageOfferBanner from "@/components/PageOfferBanner";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Link } from "react-router-dom";
import CostBreakdown from "@/components/CostBreakdown";
import CostProjectExamples from "@/components/CostProjectExamples";
import CostContactForm from "@/components/CostContactForm";
import { costBreakdowns } from "@/data/costBreakdown";
import SourceNote from "@/components/SourceNote";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kostnad", url: "https://d365.se/kostnad/" },
];

const productOrder: { key: keyof typeof costBreakdowns; label: string; path: string }[] = [
  { key: "business-central", label: "Business Central", path: "/businesscentral/" },
  { key: "finance-scm", label: "Finance & Supply Chain", path: "/finance-supply-chain/" },
  { key: "sales", label: "Sales", path: "/d365sales/" },
  { key: "customer-service", label: "Customer Service", path: "/d365customerservice/" },
  { key: "contact-center", label: "Contact Center", path: "/d365contactcenter/" },
  { key: "field-service", label: "Field Service", path: "/d365fieldservice/" },
  { key: "commerce", label: "Commerce", path: "/d365commerce/" },
  { key: "project-operations", label: "Project Operations", path: "/d365projectoperations/" },
  { key: "human-resources", label: "Human Resources", path: "/d365humanresources/" },
  { key: "marketing", label: "Customer Insights – Journeys", path: "/d365marketing/" },
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
        title="Vad kostar Microsoft Dynamics 365? – prismodell"
        description="Köparvänlig guide till vad Microsoft Dynamics 365 faktiskt kostar: abonnemang per användare/månad, engångskostnad för implementation (S/M/L-intervall i SEK), vanliga kostnadsdrivare och löpande kostnader efter go-live."
        canonicalPath="/kostnad/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
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
          </div>
        </section>

        {/* Genvägar */}
        <section className="py-8 bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Hoppa till applikation
            </h2>
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
              <div className="max-w-5xl flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {p.label}
                </h2>
                <Link to={p.path} className="text-sm text-primary underline">
                  Läs mer om {p.label} →
                </Link>
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
