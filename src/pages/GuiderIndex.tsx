import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import GuideCTA from "@/components/guides/GuideCTA";
import GuideSearch from "@/components/guides/GuideSearch";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PARTNER_GUIDES, guidePath } from "@/data/partnerGuides";

const breadcrumbs = [
  { name: "Start", url: "/" },
  { name: "Guider", url: "/guider/" },
];

const GuiderIndex = () => (
  <>
    <SEOHead
      title="Guider för partnerval – Dynamics 365"
      description="Guideserien Välja Dynamics 365-partner: huvudguide plus fördjupningar för Business Central, Finance & Supply Chain, Sales samt Customer Service och Field Service."
      canonicalPath="/guider/"
      breadcrumbs={breadcrumbs}
    />
    <Navbar />
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
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
    <Footer />
  </>
);

export default GuiderIndex;
