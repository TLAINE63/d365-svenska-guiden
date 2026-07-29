import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import {
  PRODUCT_COMPARISONS,
  PRODUCT_GROUPS,
  getComparisonsByProduct,
} from "@/data/erpComparisons";

const ErpComparisonsHub = () => {
  const breadcrumbs = [
    { name: "Hem", url: "/" },
    { name: "Jämför D365", url: "/jamfor" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Jämför Dynamics 365 mot konkurrenter | d365.se"
        description="Köparsidiga konkurrentjämförelser för Dynamics 365: Business Central, Finance & SCM, Sales, Customer Service, Customer Insights, Contact Center och Field Service mot SAP, Salesforce, HubSpot, Zendesk, ServiceNow, Genesys, NICE, Puzzel, Telia ACE m.fl."
        canonicalPath="/jamfor/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      <main className="pt-10 flex-1">
        <section className="bg-[hsl(var(--hero-dark))] border-b border-primary/20 text-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-8 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3">
              Konkurrentjämförelser
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Jämför Dynamics 365 mot konkurrenter
            </h1>
            <p className="text-base sm:text-lg text-white/85 max-w-3xl">
              Strukturerade köparsidiga jämförelser av Microsoft Dynamics 365 mot etablerade
              alternativ – för ERP, CRM, kundservice, marketing/CDP, kontaktcenter och fältservice.
              Samma rader, samma frågor – och alltid &quot;när passar inte&quot;. {PRODUCT_COMPARISONS.length}{" "}
              jämförelser totalt.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10">
            {PRODUCT_GROUPS.map((group) => {
              const items = getComparisonsByProduct(group.key);
              if (items.length === 0) return null;
              return (
                <div key={group.key}>
                  <div className="mb-5">
                    <h2 className="text-2xl font-bold text-foreground">{group.label}</h2>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-5">
                    {items.map((c) => (
                      <Link key={c.slug} to={`/jamfor/${c.slug}/`} className="group">
                        <Card className="h-full border-border transition group-hover:border-foreground/30">
                          <CardContent className="p-6 flex flex-col h-full">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                              Jämförelse
                            </p>
                            <h3 className="text-lg font-bold text-foreground mb-2">
                              {c.productShort} vs {c.competitor}
                            </h3>
                            <p className="text-sm text-muted-foreground flex-1 line-clamp-4">
                              {c.intro}
                            </p>
                            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--cta-orange))]">
                              Läs jämförelsen <ArrowRight className="h-4 w-4" />
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="rounded-lg border border-border bg-background p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Observera:</strong> Priser, licensvillkor och
                funktionalitet kan ändras över tid. Kontrollera aktuella uppgifter direkt med
                respektive leverantör eller partner innan ni fattar beslut. Jämförelserna är
                köparsidiga vägledningar, inte garantier för att enskilda funktioner eller priser är
                identiska vid ert köptillfälle.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ErpComparisonsHub;
