import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BcIsvCatalog from "@/components/BcIsvCatalog";
import { ArrowLeft } from "lucide-react";
import { ISV_PRODUCTS } from "@/data/isvProfileOptions";

/**
 * Gemensam tilläggskatalog för hela Dynamics 365 (inte bara Business Central).
 * Produktfilter kan förväljas via ?produkt=Finance%20%26%20Supply%20Chain%20Management
 */
const D365TillaggKatalog = () => {
  const [params] = useSearchParams();
  const requested = params.getAll("produkt").flatMap((p) => p.split(","));
  const preselected = requested
    .map((p) => ISV_PRODUCTS.find((o) => o.toLowerCase() === p.trim().toLowerCase()))
    .filter((p): p is string => Boolean(p));
  const solutionId = params.get("losning") || params.get("solution") || undefined;
  const defaultQuery = params.get("q") || params.get("sok") || "";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        breadcrumbs={[{ name: "Hem", url: "/" }, { name: "Kunskapscenter", url: "/kunskapscenter/" }, { name: "Dynamics 365-tillägg", url: "/kunskapscenter/dynamics-365-tillagg/" }]}
        title="Dynamics 365-tillägg: katalog över ISV-lösningar"
        description="Katalog över ISV- och tilläggslösningar för Dynamics 365 – Business Central, Finance & Supply Chain, Sales, Customer Service med flera. Filtrera på produkt, kategori och bransch."
        canonicalPath="/kunskapscenter/dynamics-365-tillagg"
        keywords="dynamics 365 tillägg, isv-lösningar, add-ons, business central appar, finance supply chain tillägg"
      />
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link
            to="/kunskapscenter"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Till Kunskapscenter
          </Link>

          <header className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tilläggslösningar för Dynamics 365
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Här samlar vi ISV-lösningar som kompletterar Dynamics 365 – från fakturahantering och
              WMS till EDI, lokalisering och branschpaket. Filtrera på vilken Dynamics 365-produkt
              lösningen är byggd för, kategori och bransch. Leverantörer med flera produkter visas
              samlade under sitt eget namn.
            </p>
          </header>

          <BcIsvCatalog
            showProductFilter
            defaultProducts={preselected}
            openSolutionId={solutionId}
            defaultQuery={defaultQuery}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default D365TillaggKatalog;
