import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  REPORT_STATS,
  REPORT_FAQ,
  REPORT_UPDATED,
  type ReportStat,
} from "@/data/partnerMarketReport2026";
import reportCover from "@/assets/reports/dynamics-365-partner-landscape-sweden-2026.jpg";

const CANONICAL = "/rapporter/dynamics-365-partnersverige-2026/";

const GROUPS: { id: ReportStat["group"]; title: string; intro: string }[] = [
  {
    id: "overblick",
    title: "Överblick",
    intro: "Så stor är den svenska Dynamics 365-partnermarknaden 2026.",
    },
  {
    id: "produkt",
    title: "Partners per produktområde",
    intro:
      "En partner kan finnas i flera kategorier – många täcker både ERP och CRM.",
  },
  {
    id: "bransch",
    title: "Partners per bransch",
    intro: "Branscherna med flest specialiserade partners i Sverige.",
  },
  {
    id: "storlek",
    title: "Partners per storlek",
    intro:
      "Marknaden är tydligt tvådelad: nischade specialister och stora globala aktörer.",
  },
];

const StatRow = ({ stat, max }: { stat: ReportStat; max: number }) => (
  <div className="py-4 border-b border-border last:border-0">
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-medium text-foreground">{stat.label}</span>
      <span className="text-2xl font-bold tabular-nums text-foreground">
        {stat.value}
      </span>
    </div>
    <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full bg-accent"
        style={{ width: `${Math.round((stat.value / max) * 100)}%` }}
      />
    </div>
    <p className="mt-2 text-sm text-muted-foreground">{stat.note}</p>
  </div>
);

export default function PartnerMarketReport2026() {
  const max = Math.max(...REPORT_STATS.map((s) => s.value));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Svenska Dynamics 365-partnermarknaden 2026 – rapport"
        description="Rapport om Dynamics 365-partners i Sverige 2026: 84 identifierade partners fördelat på Business Central, F&SCM, CRM, Power Platform/AI, bransch och bolagsstorlek."
        canonicalPath={CANONICAL}
        ogType="article"
        keywords="Dynamics 365 partners Sverige, partnermarknad 2026, Business Central partner, F&SCM partner, CRM partner"
        breadcrumbs={[
          { name: "Hem", url: "/" },
          { name: "Rapporter", url: "/rapporter/dynamics-365-partnersverige-2026/" },
        ]}
        webPageSchema={false}
      />
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se" },
          {
            name: "Svenska Dynamics 365-partnermarknaden 2026",
            url: `https://d365.se${CANONICAL}`,
          },
        ]}
      />
      <FAQSchema faqs={REPORT_FAQ.map((f) => ({ question: f.q, answer: f.a }))} />
      <Navbar />

      <main className="pt-10">
        <section className="py-10 sm:py-14 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">Rapporter</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">
              Rapport · uppdaterad {REPORT_UPDATED}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Svenska Dynamics 365-partnermarknaden 2026
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              d365.se kartlägger löpande de företag som levererar Microsoft
              Dynamics 365 i Sverige. Här är siffrorna för 2026 – hur många
              partners som finns, hur de fördelar sig mellan Business Central,
              Finance &amp; Supply Chain, CRM och Power Platform/AI, samt vilka
              branscher och bolagsstorlekar som dominerar.
            </p>
            <figure className="mt-8">
              <img
                src={reportCover}
                alt="Dynamics 365 Partner Landscape Sweden 2026 – karta över svenska partners, d365.se"
                width={1600}
                height={900}
                className="w-full rounded-xl border border-border"
              />
              <figcaption className="mt-2 text-xs text-muted-foreground">
                Dynamics 365 Partner Landscape Sweden 2026 – d365.se
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-12">
            {GROUPS.map((g) => {
              const stats = REPORT_STATS.filter((s) => s.group === g.id);
              return (
                <div key={g.id}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                    {g.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">{g.intro}</p>
                  <div className="rounded-xl border border-border bg-card px-5">
                    {stats.map((s) => (
                      <StatRow key={s.label} stat={s} max={max} />
                    ))}
                  </div>
                </div>
              );
            })}

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Så tolkar du siffrorna
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Summan av produktområdena är större än antalet partners
                  eftersom de flesta partners levererar mer än ett område. Samma
                  sak gäller branscher – en partner kan ha upp till tre
                  fokusbranscher plus sekundära branscher.
                </p>
                <p>
                  Skillnaden mellan identifierade och verifierade partners är
                  viktig: identifierade partners är kartlagda utifrån publika
                  källor, medan verifierade partners själva har granskat och
                  godkänt sina uppgifter, inklusive referenser, leveransprofil
                  och AI-erfarenhet.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Vanliga frågor
              </h2>
              <div className="space-y-6">
                {REPORT_FAQ.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-semibold text-foreground mb-1">{f.q}</h3>
                    <p className="text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Utforska vidare
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  { to: "/valjdynamics365partner/", label: "Jämför Dynamics 365-partners" },
                  { to: "/alla-d365-partners/", label: "Alla identifierade partners i Sverige" },
                  { to: "/business-central-partners-sverige/", label: "Business Central-partners i Sverige" },
                  { to: "/dynamics-365-ai-copilot-partners-sverige/", label: "AI- och Copilot-partners i Sverige" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="flex items-center justify-between gap-2 p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                    >
                      <span className="font-medium text-foreground">{l.label}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-6 text-center">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Vill du hitta rätt partner i den här marknaden?
              </h2>
              <p className="text-muted-foreground mb-4">
                Gör en kostnadsfri behovsanalys så matchar vi dig mot partners
                som faktiskt arbetar med din bransch och ditt produktområde.
              </p>
              <Button asChild size="lg">
                <Link to="/kom-igang/">Starta en kostnadsfri behovsanalys</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
