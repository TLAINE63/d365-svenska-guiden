import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { ERP_COMPARISONS } from "@/data/erpComparisons";

const ErpComparisonsHub = () => {
  const breadcrumbs = [
    { name: "Hem", url: "/" },
    { name: "Business Central", url: "/businesscentral" },
    { name: "Jämför ERP", url: "/jamfor" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Jämför Business Central med andra svenska affärssystem | d365.se"
        description="Köparsidiga jämförelser mellan Microsoft Dynamics 365 Business Central och svenska ERP-system: Monitor ERP, Visma.net och Jeeves. Funktioner, pris, implementation och när de inte passar."
        canonicalPath="/jamfor/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      <main className="pt-10 flex-1">
        <section className="bg-[hsl(var(--hero-dark))] border-b border-primary/20 text-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-6 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3">
              Konkurrentjämförelser
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Jämför Business Central med andra svenska affärssystem
            </h1>
            <p className="text-base sm:text-lg text-white/85 max-w-3xl">
              Strukturerade köparsidiga jämförelser av Microsoft Dynamics 365 Business Central mot etablerade
              svenska ERP-alternativ. Samma rader, samma frågor – och alltid &quot;när passar inte&quot;.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl grid md:grid-cols-3 gap-5">
            {ERP_COMPARISONS.map((c) => (
              <Link key={c.slug} to={`/jamfor/${c.slug}/`} className="group">
                <Card className="h-full border-border transition group-hover:border-foreground/30">
                  <CardContent className="p-6 flex flex-col h-full">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Jämförelse
                    </p>
                    <h2 className="text-lg font-bold text-foreground mb-2">
                      Business Central vs {c.competitor}
                    </h2>
                    <p className="text-sm text-muted-foreground flex-1">{c.intro}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--cta-orange))]">
                      Läs jämförelsen <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ErpComparisonsHub;
