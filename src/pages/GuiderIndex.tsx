import EditorialSource from "@/components/EditorialSource";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import GuideCTA from "@/components/guides/GuideCTA";
import GuideSearch from "@/components/guides/GuideSearch";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PARTNER_GUIDES, guidePath } from "@/data/partnerGuides";
import { nowrapBrand } from "@/lib/nowrapBrand";

const breadcrumbs = [
  { name: "Start", url: "/" },
  { name: "Guider", url: "/guider/" },
];

const GuiderIndex = () => (
  <>
    <SEOHead
      title="Guider för partnerval – Dynamics 365"
      description="Guider för att välja Dynamics 365-partner, med fördjupningar för Business Central, Finance & Supply Chain, Sales och Service samt budget och prognos."
      canonicalPath="/guider/"
      breadcrumbs={breadcrumbs}
    />
    <Navbar />
    <main className="min-h-screen pt-28 lg:pt-32 pb-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <GuideBreadcrumb items={breadcrumbs} className="mb-5" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Guider: välja Dynamics 365-partner
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Huvudguiden täcker urvalsprocessen oavsett applikation. Produktguiderna går
          djupare in på det som skiljer respektive upphandling åt.
        </p>

        <GuideSearch className="mb-8 max-w-xl" />

        <div className="grid gap-4 sm:grid-cols-2">
          {PARTNER_GUIDES.map((g) => (
            <Link
              key={g.key}
              to={guidePath(g)}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--cta-orange))] hover:shadow-md"
            >
              <h2 className="text-base font-bold mb-1.5">{g.cardTitle}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {g.cardDescription}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--cta-orange))]">
                Läs guiden
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-12" aria-labelledby="planering-guider">
          <h2 id="planering-guider" className="text-xl font-bold tracking-tight mb-4">Planering och uppföljning</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/guider/budget-prognos-planering-dynamics-365/"
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--cta-orange))] hover:shadow-md"
            >
              <h3 className="text-base font-bold mb-1.5">{nowrapBrand("Budget, prognos och säljplanering i Dynamics 365")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {nowrapBrand("Rullande prognoser och säljplanering i Business Central, Finance & Supply Chain Management och Dynamics 365 Sales med Power BI och Fabric.")}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--cta-orange))]">
                Läs guiden
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </section>

        <GuideCTA
          variant="final"
          heading="Redo att börja jämföra partners?"
          text="Använd d365.se för att identifiera relevanta Dynamics 365-partners och skapa en kortlista innan du börjar boka möten."
          buttonLabel="Jämför Dynamics 365-partners"
          to="/valjdynamics365partner/#hitta-partners"
          source="/guider/"
        />
      </div>
    </main>
    <EditorialSource sourceType="Partnerguide" />
    <Footer />
  </>
);

export default GuiderIndex;
