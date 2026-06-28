import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/StructuredData";
import { Badge } from "@/components/ui/badge";
import ProductRoiAnalysis from "@/components/ProductRoiAnalysis";
import { PRODUCT_ROI_PAGES } from "@/data/productRoiPages";
import type { ProductRoiKey } from "@/data/productRoiConfigs";

interface Props {
  productKey: ProductRoiKey;
}

/**
 * Generisk ROI/TCO-kalkylator-sida i Kunskapscentret för produkter som inte har
 * en handskriven kalkylator (allt utom Business Central och Sales).
 */
export default function ProductRoiPage({ productKey }: Props) {
  const meta = PRODUCT_ROI_PAGES[productKey];

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
              TCO baserat på era egna nyckeltal — användare, omsättning, bransch och
              komplexitet.
            </p>
            <p className="text-xs text-muted-foreground mt-4 max-w-3xl italic">
              Kalkylen är en förenklad uppskattning och bör användas som beslutsstöd — inte
              som en slutlig offert eller affärskalkyl. Validera alltid utfall med två–tre
              relevanta partners.
            </p>
          </div>
        </section>

        <ProductRoiAnalysis productKey={productKey} />
      </main>

      <Footer />
    </div>
  );
}
