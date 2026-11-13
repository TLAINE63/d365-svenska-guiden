import ContextualCta from "@/components/ContextualCta";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BcIsvCatalog from "@/components/BcIsvCatalog";
import { BadgeCheck, Layers, ShieldCheck } from "lucide-react";
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
  const defaultCategories = params
    .getAll("kategori")
    .flatMap((c) => c.split(","))
    .map((c) => c.trim())
    .filter(Boolean);
  const defaultCeApps = params
    .getAll("ce")
    .flatMap((c) => c.split(","))
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        breadcrumbs={[{ name: "Hem", url: "/" }, { name: "Tilläggslösningar", url: "/kunskapscenter/dynamics-365-tillagg/" }]}
        title="Dynamics 365-tillägg: katalog över ISV-lösningar"
        description="Katalog över ISV- och tilläggslösningar för Dynamics 365 – Business Central, Finance & Supply Chain Management (F&O), Sales, Customer Service med flera. Filtrera på produkt, kategori och bransch."
        canonicalPath="/kunskapscenter/dynamics-365-tillagg"
        keywords="dynamics 365 tillägg, isv-lösningar, add-ons, business central appar, finance supply chain tillägg"
      />
      <Navbar />

      <main className="plan-premium pb-16">
        <section className="plan-opening">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-28 sm:pt-36 pb-12 sm:pb-16">
            <p className="plan-eyebrow mb-3">ISV-katalog · Microsoft&nbsp;Dynamics&nbsp;365</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Tilläggslösningar för <span className="whitespace-nowrap">Dynamics&nbsp;365</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              Lösningar som kompletterar <span className="whitespace-nowrap">Dynamics&nbsp;365</span>, från fakturahantering och
              WMS till EDI, lokalisering och branschpaket. Välj ert system, vad ni behöver lösa och gärna bransch eller leverantör.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-foreground">
              {[
                [Layers, "Sorterat per system och behov"],
                [BadgeCheck, "Informationsstatus på varje lösning"],
                [ShieldCheck, "Inget delas med leverantörer utan ert godkännande"],
              ].map(([Icon, label]) => {
                const I = Icon as typeof ShieldCheck;
                return <li key={label as string} className="flex items-center gap-2"><I aria-hidden="true" className="h-4 w-4 text-accent" />{label as string}</li>;
              })}
            </ul>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-10 sm:py-14">
          <h2 className="sr-only">Tilläggslösningar</h2>
          <BcIsvCatalog
            key={params.toString()}
            showProductFilter
            defaultProducts={preselected}
            openSolutionId={solutionId}
            defaultQuery={defaultQuery}
            defaultCategories={defaultCategories}
            defaultCeApps={defaultCeApps}
            defaultVendor={params.get("leverantor") || ""}
          />
        </div>
      <ContextualCta source="next-step:tillagg-katalog" heading="Hittat tillägg ni behöver?" text="Tillägg installeras nästan alltid av en partner. Se vilka partners som passar er lösning och bransch." primaryLabel="Få rekommenderad partnerlista" links={[{ label: "Business Central-tillägg per kategori", to: "/business-central/tillagg/" }, { label: "Jämför relevanta partners", to: "/jamfor-partners/" }, { label: "Fråga d365.se", to: "/fraga/" }]} />
</main>

      <Footer />
    </div>
  );
};

export default D365TillaggKatalog;
