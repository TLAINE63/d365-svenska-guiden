import Navbar from "@/components/Navbar";
import PageOfferBanner from "@/components/PageOfferBanner";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Link } from "react-router-dom";
import { FALLBACK_PRICES } from "@/data/productPricesFallback";
import { useProductPrices, formatPrice } from "@/hooks/useProductPrices";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Prislista", url: "https://d365.se/priser/" },
];

/**
 * Fristående, fullt prerendererad prislista för Microsoft Dynamics 365.
 * Använder FALLBACK_PRICES vid SSR/initial render så att hela tabellen
 * finns i HTML:en som crawlers ser. Klienten hydratiserar med live-data
 * från `product_prices` när den är redo.
 */
export default function Priser() {
  const { data: livePrices } = useProductPrices();

  const prices = (livePrices && livePrices.length > 0 ? livePrices : FALLBACK_PRICES) as Array<{
    product_name: string;
    category: string;
    price_sek: number | null;
    price_unit: string;
    price_note: string | null;
    is_quote: boolean;
  }>;

  const erp = prices.filter((p) => p.category === "ERP");
  const crm = prices.filter((p) => p.category === "CRM");

  const Section = ({ title, rows }: { title: string; rows: typeof prices }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">Produkt</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Pris</th>
              <th className="px-4 py-3 font-semibold">Kommentar</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={p.product_name + i} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{p.product_name}</td>
                <td className="px-4 py-3 whitespace-nowrap font-medium">{formatPrice(p)}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.price_note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Microsoft Dynamics 365 prislista 2026 – ERP & CRM"
        description="Komplett prislista för Microsoft Dynamics 365 (ERP & CRM) i SEK exkl. moms. Business Central, Finance, Supply Chain, Sales, Customer Service, Field Service och Contact Center."
        canonicalPath="/priser/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      <main className="pt-10">
        <section className="py-8 sm:py-12 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to="/kunskapscenter/" className="hover:text-foreground">Kunskapscenter</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">Prislista</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Microsofts listpriser – och vad de faktiskt säger
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Officiella listpriser för Dynamics 365 (SEK exkl. moms). Det faktiska priset beror på avtalsform (EA, CSP), volym och förhandling – och utgör bara en del av totalkostnaden. Implementation, integration och förvaltning står normalt för en betydligt större andel över tid.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <Section title="ERP – Business Central, Finance & Supply Chain" rows={erp} />
            <Section title="CRM – Sales, Service, Customer Insights m.fl." rows={crm} />
            <p className="text-xs text-muted-foreground mt-6">
              Källa: Microsofts officiella prislista. Snapshot uppdaterad 2026-06-11.
              Se även produktsidorna för{" "}
              <Link to="/businesscentral/" className="underline">Business Central</Link>,{" "}
              <Link to="/finance-supply-chain/" className="underline">Finance &amp; Supply Chain</Link>{" "}
              och <Link to="/crm/" className="underline">CRM</Link>.
            </p>
          </div>
        </section>
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
