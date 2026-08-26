import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Download, FileSpreadsheet } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  generateMarketReportPdf,
  downloadMarketReportCsv,
} from "@/utils/generateMarketReportPdf";
import {
  REPORT_FAQ,
  type ReportStat,
} from "@/data/partnerMarketReport2026";
import { useMarketReportStats } from "@/hooks/useMarketReportStats";
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

type SortMode = "storlek" | "namn" | "minst";

const SORTS: { id: SortMode; label: string }[] = [
  { id: "storlek", label: "Flest partners" },
  { id: "minst", label: "Färst partners" },
  { id: "namn", label: "A–Ö" },
];

export default function PartnerMarketReport2026() {
  const { stats: reportStats, updated: reportUpdated } = useMarketReportStats();
  const max = Math.max(...reportStats.map((s) => s.value));
  const [query, setQuery] = useState("");
  const [activeGroups, setActiveGroups] = useState<ReportStat["group"][]>([]);
  const [sort, setSort] = useState<SortMode>("storlek");

  const visibleStats = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = reportStats.filter((s) => {
      const groupOk = activeGroups.length === 0 || activeGroups.includes(s.group);
      const textOk =
        !q ||
        s.label.toLowerCase().includes(q) ||
        s.note.toLowerCase().includes(q);
      return groupOk && textOk;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "namn") return a.label.localeCompare(b.label, "sv");
      if (sort === "minst") return a.value - b.value;
      return b.value - a.value;
    });
  }, [reportStats, query, activeGroups, sort]);

  const toggleGroup = (id: ReportStat["group"]) =>
    setActiveGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );

  const [pdfLoading, setPdfLoading] = useState(false);

  const exportStats = visibleStats.length > 0 ? visibleStats : reportStats;

  const handlePdf = async () => {
    setPdfLoading(true);
    try {
      await generateMarketReportPdf(exportStats);
      toast.success("Rapporten laddas ner som PDF.");
    } catch {
      toast.error("Kunde inte skapa PDF:en. Försök igen.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleCsv = () => {
    downloadMarketReportCsv(exportStats);
    toast.success("Statistiken laddas ner som CSV.");
  };


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

      <main className="pt-24 sm:pt-28">
        <section className="py-10 sm:py-14 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">Rapporter</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">
              Rapport · uppdaterad {reportUpdated}
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
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handlePdf} disabled={pdfLoading} size="lg">
                <Download className="mr-2 h-4 w-4" />
                {pdfLoading ? "Skapar PDF …" : "Ladda ner rapporten (PDF)"}
              </Button>
              <Button onClick={handleCsv} variant="outline" size="lg">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Ladda ner data (CSV)
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Exporten följer dina filter nedan – {visibleStats.length} av{" "}
              {reportStats.length} nyckeltal.
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
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Sök i statistiken, t.ex. Business Central eller tillverkning"
                  aria-label="Sök i partnerstatistiken"
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {GROUPS.map((g) => {
                  const active = activeGroups.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGroup(g.id)}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {g.title}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Sortera:</span>
                {SORTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSort(s.id)}
                    aria-pressed={sort === s.id}
                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      sort === s.id
                        ? "border-accent text-foreground font-medium"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
                {(query || activeGroups.length > 0 || sort !== "storlek") && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveGroups([]);
                      setSort("storlek");
                    }}
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    Rensa filter
                  </button>
                )}
                <span className="ml-auto text-sm text-muted-foreground">
                  {visibleStats.length} av {reportStats.length} nyckeltal
                </span>
              </div>
            </div>

            {visibleStats.length === 0 && (
              <p className="text-muted-foreground">
                Inga nyckeltal matchar din sökning. Prova ett bredare sökord
                eller rensa filtren – eller hör av dig till oss så tar vi fram
                underlaget.
              </p>
            )}

            {GROUPS.map((g) => {
              const stats = visibleStats.filter((s) => s.group === g.id);
              if (stats.length === 0) return null;
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
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Vanliga frågor om rapporten
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Hur siffrorna samlas in, vilka källor som används och hur statistiken
                beräknas.
              </p>
              <Accordion
                type="single"
                collapsible
                className="rounded-xl border border-border bg-card px-5"
              >
                {REPORT_FAQ.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`}>
                    <AccordionTrigger className="text-left text-foreground">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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

            <div id="citera" className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Metod och så här citerar du rapporten
              </h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-foreground">Utgivare</dt>
                  <dd className="text-muted-foreground">d365.se (Dynamic Factory AB), Sverige</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Publicerad</dt>
                  <dd className="text-muted-foreground">2026</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Metod</dt>
                  <dd className="text-muted-foreground">
                    Siffrorna bygger på d365.se:s egen kartläggning av Microsoft
                    Dynamics 365-partners med verksamhet i Sverige. Varje partner
                    klassificeras utifrån produktområden, fokusbranscher, kontorsorter
                    och storlek. Underlaget uppdateras löpande när partners
                    tillkommer eller uppdaterar sina uppgifter, vilket innebär att
                    enskilda siffror kan förändras över tid.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Källhänvisning</dt>
                  <dd className="text-muted-foreground">
                    d365.se (2026).{" "}
                    <em>Svenska Dynamics 365-partnermarknaden 2026.</em>{" "}
                    https://d365.se{CANONICAL}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Öppna data</dt>
                  <dd className="text-muted-foreground">
                    Underliggande partnerdata finns maskinläsbar på{" "}
                    <a
                      href="/partner-data.json"
                      className="text-primary underline underline-offset-2"
                    >
                      /partner-data.json
                    </a>
                    .
                  </dd>
                </div>
              </dl>
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
