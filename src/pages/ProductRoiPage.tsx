import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/StructuredData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductRoiAnalysis from "@/components/ProductRoiAnalysis";
import SuggestedPartnersCTA from "@/components/SuggestedPartnersCTA";
import { PRODUCT_ROI_PAGES } from "@/data/productRoiPages";
import { PRODUCT_ROI_CONFIGS, type ProductRoiKey } from "@/data/productRoiConfigs";
import type { ProductKey } from "@/hooks/usePartnerFilters";

const ROI_TO_PARTNER_PRODUCT: Record<ProductRoiKey, ProductKey> = {
  "business-central": "bc",
  "finance-scm": "fsc",
  "sales": "sales",
  "customer-insights": "sales",
  "customer-service": "service",
  "contact-center": "service",
  "field-service": "service",
};

interface Props {
  productKey: ProductRoiKey;
}

const fmtSek = (n: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

/**
 * Generisk ROI/TCO-kalkylator-sida i Kunskapscentret för produkter som inte har
 * en handskriven kalkylator (allt utom Business Central och Sales).
 */
export default function ProductRoiPage({ productKey }: Props) {
  const meta = PRODUCT_ROI_PAGES[productKey];
  const cfg = PRODUCT_ROI_CONFIGS[productKey];
  const [showAssumptions, setShowAssumptions] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fullUrl = `https://d365.se${meta.path}`;
  const breadcrumbs = [
    { name: "Hem", url: "https://d365.se" },
    { name: meta.productShort, url: `https://d365.se${meta.productPath}` },
    { name: "ROI/TCO-kalkylator", url: fullUrl },
  ];

  const title = `${meta.productShort} ROI/TCO-kalkylator – payback & 5-årig totalkostnad`;
  const description = `Indikativ ROI- och TCO-kalkyl för ${meta.productName}. Räkna licens, implementation, payback och 5-årig totalkostnad utifrån era nyckeltal.`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} canonicalPath={meta.path} />
      <BreadcrumbSchema items={breadcrumbs} />
      <SoftwareApplicationSchema
        name={`${meta.productShort} ROI/TCO-kalkylator`}
        description={`Räkna fram payback, 5-årig totalkostnad och årlig nytta för ${meta.productName} baserat på era förutsättningar.`}
        url={fullUrl}
      />
      <Navbar />

      <main className="pt-10">
        <section className="border-b border-border bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8 sm:py-12">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to={meta.productPath} className="hover:text-foreground">{meta.productShort}</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">ROI/TCO-kalkylator</span>
            </nav>
            <Badge variant="outline" className="mb-4">
              <Calculator className="w-3 h-3 mr-1" /> Beslutsstöd
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 max-w-3xl">
              Beräkna ROI och TCO för {meta.productShort}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
              Få en indikativ uppskattning av investering, årlig nytta, payback och 5-årig
              TCO baserat på era egna nyckeltal – användare, omsättning, bransch och
              komplexitet.
            </p>
            <p className="text-xs text-muted-foreground mt-4 max-w-3xl italic">
              Kalkylen är en förenklad uppskattning och bör användas som beslutsstöd – inte
              som en slutlig offert eller affärskalkyl. Validera alltid utfall med två–tre
              relevanta partners.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                asChild
                size="lg"
                className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white"
              >
                <a href="#kalkyl">Starta en kalkyl <ArrowRight className="ml-2 w-4 h-4" /></a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setShowAssumptions(true);
                  document.getElementById("antaganden")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Visa antaganden
              </Button>
            </div>
          </div>
        </section>

        <div id="kalkyl">
          <ProductRoiAnalysis productKey={productKey} />
        </div>

        {/* ANTAGANDEN */}
        <section id="antaganden" className="py-12 bg-secondary/30 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-2">Antaganden</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Kalkylen är medvetet förenklad. Den ska ge en storleksordning, inte ersätta en business case-analys.
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowAssumptions((s) => !s)}>
              {showAssumptions ? "Dölj detaljer" : "Visa detaljer"}
            </Button>
            {showAssumptions && (
              <div className="mt-6 space-y-4 text-sm text-foreground/90">
                <Assumption title="Licens">
                  Priser hämtas från d365.se centrala prisregister (Microsofts listpriser, SEK/mån exkl. moms).
                  Faktiskt pris beror på avtalsform (EA, CSP), volym och förhandling.
                </Assumption>
                <Assumption title="Implementation">
                  Bas: {fmtSek(cfg.baseImplementation)} (Medel). Skalas med komplexitet
                  (Låg 0,6× / Medel 1,0× / Hög 1,5×), användarvolym
                  (+{(cfg.implUserScale * 100).toFixed(1)} % per användare över 25),
                  + 30 000 kr per integration och en engångskostnad per vald drivare.
                </Assumption>
                <Assumption title="Förvaltning">
                  År 1 ≈ {(cfg.supportPctYear1 * 100).toFixed(0)} % av implementationskostnaden
                  (projektet pågår). Från år 2 ≈ {(cfg.supportPctYearly * 100).toFixed(0)} % per år.
                </Assumption>
                <Assumption title="Årlig nytta">
                  Nyttan summeras från de drivare ni bockat i. Varje drivare har en grundnivå
                  (fast belopp eller andel av omsättning) som skalas med antal användare
                  (baseline 25 användare = 1,0×, sublinjärt). Summan justeras med andelen manuella
                  processer (0,5×–1,5×) och komplexitetsfaktor (0,6 / 1,0 / 1,3). Integrationer
                  ger dessutom 50 000 kr/år vardera.
                </Assumption>
                <Assumption title="Payback &amp; TCO">
                  Payback = implementation / (årlig nytta + ersatt IT-kostnad − licens − förvaltning).
                  5-årig TCO = implementation + 5 × licens + förvaltning år 1 + 4 × förvaltning från år 2.
                  5-årig ROI = (5 × årlig nytta + 5 × ersatt IT-kostnad − TCO) / implementation.
                </Assumption>
                <Assumption title="Vad ingår inte">
                  Förändringsledning, datakvalitet, intern tidsåtgång, integrationsplattform (iPaaS),
                  ISV-licenser och hårdvara hanteras separat.
                </Assumption>
              </div>
            )}
          </div>
        </section>
      </main>

      <SuggestedPartnersCTA product={ROI_TO_PARTNER_PRODUCT[productKey]} />
      <Footer />
    </div>
  );
}

function Assumption({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-md border border-border bg-background">
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
