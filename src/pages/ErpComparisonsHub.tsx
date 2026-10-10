import EditorialSource from "@/components/EditorialSource";
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
        description="Köparsidiga konkurrentjämförelser för Dynamics 365: Business Central, Finance & Supply Chain Management (F&O), Sales, Customer Service, Customer Insights, Contact Center och Field Service mot SAP, Salesforce, HubSpot, Zendesk, ServiceNow, Genesys, NICE, Puzzel, Telia ACE m.fl."
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
            <p className="text-sm text-white/70 mt-3">
              Vill du gå djupare? Se <Link to="/businesscentral/" className="text-white underline hover:text-white/80">Business Central ERP</Link> med priser, funktioner och svenska partners, eller <Link to="/affarssystem/" className="text-white underline hover:text-white/80">ERP-guiden</Link> för jämförelsen mellan BC och Finance & Supply Chain Management.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10">
            <div id="snabbguide" className="scroll-mt-24">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-foreground">Vilket vägval står ni inför?</h2>
                <p className="text-sm text-muted-foreground">
                  De vanligaste jämförelserna bland svenska köpare. Börja med frågan som liknar er situation.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { group: "Affärssystem", q: "Växer ni ur ert nuvarande system och tillverkar själva?", slug: "business-central-vs-monitor-erp", label: "Business Central vs Monitor ERP" },
                  { group: "Affärssystem", q: "Har ni bolag i flera länder och vill ha ett molnsystem?", slug: "business-central-vs-netsuite", label: "Business Central vs NetSuite" },
                  { group: "Affärssystem", q: "Är ni en större koncern som väljer mellan de stora plattformarna?", slug: "fscm-vs-sap-s4hana", label: "Finance & Supply Chain vs SAP S/4HANA" },
                  { group: "Säljstöd", q: "Vill ni ha säljstöd som hänger ihop med Microsoft 365?", slug: "sales-vs-salesforce-sales-cloud", label: "Sales vs Salesforce Sales Cloud" },
                  { group: "Säljstöd", q: "Börjar ni i liten skala och funderar på enklare alternativ?", slug: "sales-vs-hubspot-sales-hub", label: "Sales vs HubSpot Sales Hub" },
                  { group: "Kundservice", q: "Behöver kundtjänsten mer än ett ärendesystem?", slug: "customer-service-vs-zendesk", label: "Customer Service vs Zendesk" },
                ].map((i) => (
                  <Link key={i.slug} to={`/jamfor/${i.slug}/`} className="group">
                    <Card className="h-full border-border transition group-hover:border-foreground/30">
                      <CardContent className="p-5 flex flex-col h-full">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{i.group}</p>
                        <p className="font-semibold text-foreground mb-2">{i.q}</p>
                        <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--cta-orange))]">
                          {i.label} <ArrowRight className="h-4 w-4 shrink-0" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Vill ni se vad helheten kostar över tre år? <Link to="/kostnad/" className="text-primary underline">Räkna totalkostnad</Link>.
              </p>
            </div>

            {PRODUCT_GROUPS.map((group) => {
              const items = getComparisonsByProduct(group.key);
              if (items.length === 0) return null;
              return (
                <div key={group.key} id={group.key === "sales" ? "crm" : group.key} className="scroll-mt-24">
                  {group.key === "sales" && <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">CRM: sälj, marknad, kundservice, kontaktcenter och fältservice</p>}
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
                respektive leverantör eller partner innan du fattar beslut. Jämförelserna är
                köparsidiga vägledningar, inte garantier för att enskilda funktioner eller priser är
                identiska vid ditt köptillfälle.
              </p>
            </div>
          </div>
        </section>
      </main>

      <EditorialSource sourceType="Jämförelse" />
      <Footer />
    </div>
  );
};

export default ErpComparisonsHub;
