import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Clock, Info, Wallet, Layers, ArrowRight, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SuggestedPartnersCTA from "@/components/SuggestedPartnersCTA";
import CalculatorDrafts from "@/components/CalculatorDrafts";
import CalculatorCompare from "@/components/CalculatorCompare";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { toast } from "sonner";
import { usePriceMap } from "@/hooks/usePriceMap";
import type { ProductKey } from "@/hooks/usePartnerFilters";
import { generateImplementationPdf } from "@/utils/generateImplementationPdf";
import QuickLeadForm from "@/components/QuickLeadForm";

import {
  SOLUTIONS,
  COMPLEXITY_OPTIONS,
  estimateImplementation,
  type Complexity,
  type SolutionKey,
} from "@/lib/implementationEstimate";

const ASSUMPTIONS = [
  "Grundomfattningen utgår från typiska projekt per lösning och skalas med antal användare (inte linjärt – stora projekt blir effektivare per användare).",
  "Komplexitetsvalet multiplicerar omfattningen med 1,0 / 1,35 / 1,85.",
  "Varje integration räknas som ca 45 timmar, varje extra bolag som ca 60 timmar.",
  "Datamigrering +12 %, egen utveckling +20 %, utbildning tillkommer utifrån antal användare.",
  "Spannet visas som −20 % / +30 % kring mittvärdet. Förvaltning uppskattas till 15 % av implementationskostnaden per år.",
  "Licenskostnaden hämtas från våra publicerade listpriser för Dynamics 365 och antar en licens per användare. Verkliga priser påverkas av avtalsform och mix av licenstyper.",
];


const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kostnad", url: "https://d365.se/kostnad/" },
  { name: "Pris- och omfattningskalkylator", url: "https://d365.se/implementationskalkylator/" },
];

const fmtSek = (n: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

const PARTNER_PRODUCT: Record<SolutionKey, ProductKey> = {
  bc: "bc",
  fscm: "fsc",
  sales: "sales",
  "customer-service": "service",
  "field-service": "service",
  "project-operations": "fsc",
};

export default function ImplementationCalculator() {
  const priceMap = usePriceMap();

  const [solutions, setSolutions] = useState<SolutionKey[]>(["bc"]);
  const [users, setUsers] = useState(25);
  const [premiumLicense, setPremiumLicense] = useState(false);
  const [complexity, setComplexity] = useState<Complexity>("anpassad");
  const [integrations, setIntegrations] = useState(3);
  const [legalEntities, setLegalEntities] = useState(1);
  const [dataMigration, setDataMigration] = useState(true);
  const [customDevelopment, setCustomDevelopment] = useState(false);
  const [training, setTraining] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(1350);

  const priceLookup = useMemo(
    () => (key: string) => {
      const p = priceMap.get(key);
      if (!p || p.is_quote || p.price_sek == null) return null;
      return Number(p.price_sek);
    },
    [priceMap],
  );

  const result = useMemo(
    () =>
      estimateImplementation(
        {
          solutions,
          users,
          premiumLicense,
          complexity,
          integrations,
          legalEntities,
          dataMigration,
          customDevelopment,
          training,
          hourlyRate,
        },
        priceLookup,
      ),
    [
      solutions,
      users,
      premiumLicense,
      complexity,
      integrations,
      legalEntities,
      dataMigration,
      customDevelopment,
      training,
      hourlyRate,
      priceLookup,
    ],
  );

  const toggleSolution = (key: SolutionKey) => {
    setSolutions((prev) =>
      prev.includes(key)
        ? prev.length === 1
          ? prev
          : prev.filter((k) => k !== key)
        : [...prev, key],
    );
  };

  const partnerProducts = useMemo(
    () => Array.from(new Set(solutions.map((s) => PARTNER_PRODUCT[s]))),
    [solutions],
  );

  const [downloading, setDownloading] = useState(false);

  // Redigerbara fält som följer med i PDF-offerten
  const [pdfCompany, setPdfCompany] = useState("");
  const [pdfContact, setPdfContact] = useState("");
  const [pdfReference, setPdfReference] = useState("");
  const [pdfNotes, setPdfNotes] = useState("");

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[åä]/g, "a")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const complexityLabel =
        COMPLEXITY_OPTIONS.find((c) => c.key === complexity)?.label ?? complexity;
      const namePart = slugify(pdfCompany || pdfReference);
      await generateImplementationPdf({
        result,
        solutionsLabel: SOLUTIONS.filter((s) => solutions.includes(s.key))
          .map((s) => s.label)
          .join(", "),
        inputs: [
          { label: "Antal användare", value: `${users} st` },
          {
            label: "Licensnivå",
            value: premiumLicense ? "Premium/Enterprise" : "Standard",
          },
          { label: "Grad av anpassning", value: complexityLabel },
          { label: "Integrationer", value: `${integrations} st` },
          { label: "Bolag / juridiska enheter", value: `${legalEntities} st` },
          { label: "Datamigrering", value: dataMigration ? "Ja" : "Nej" },
          { label: "Egen utveckling", value: customDevelopment ? "Ja" : "Nej" },
          { label: "Utbildning av användare", value: training ? "Ja" : "Nej" },
          { label: "Konsultpris per timme", value: `${fmtSek(hourlyRate)}/tim` },
        ],
        assumptions: ASSUMPTIONS,
        pageUrl: "https://d365.se/implementationskalkylator/",
        meta: {
          company: pdfCompany,
          contact: pdfContact,
          reference: pdfReference,
          notes: pdfNotes,
        },
        fileName: namePart
          ? `d365-prisuppskattning-${namePart}.pdf`
          : "d365-prisuppskattning.pdf",
      });
      toast.success("PDF:en har laddats ned");
    } catch {
      toast.error("Kunde inte skapa PDF:en. Försök igen.");
    } finally {
      setDownloading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Kalkylator: pris & omfattning för Dynamics 365"
        description="Räkna fram en realistisk budget för er Dynamics 365-implementation: licenskostnad per månad, engångskostnad för införandet, tidplan och fasfördelning – baserat på antal användare, integrationer och komplexitet."
        canonicalPath="/implementationskalkylator/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      <main className="pt-10">
        <section className="py-8 sm:py-12 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to="/kostnad/" className="hover:text-foreground">Kostnad</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">Pris- och omfattningskalkylator</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              På köparens sida
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pris- och omfattningskalkylator för Dynamics 365
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
              Ställ in er situation så får ni ett realistiskt spann för
              implementationskostnad, licenskostnad och tidplan – innan ni pratar med
              en enda leverantör. Alla antaganden redovisas öppet längst ned.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl grid gap-6 lg:grid-cols-5">
            {/* Inputs */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-accent" aria-hidden="true" />
                      Vilka lösningar ska införas?
                    </h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      Välj en eller flera. Fler lösningar samtidigt ger viss stordriftsfördel.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SOLUTIONS.map((s) => {
                        const active = solutions.includes(s.key);
                        return (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => toggleSolution(s.key)}
                            aria-pressed={active}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-foreground hover:bg-secondary"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <Label htmlFor="users">Antal användare</Label>
                      <span className="text-sm font-semibold text-foreground">{users} st</span>
                    </div>
                    <Slider
                      id="users"
                      value={[users]}
                      min={5}
                      max={500}
                      step={5}
                      onValueChange={(v) => setUsers(v[0])}
                      aria-label="Antal användare"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                    <div>
                      <Label htmlFor="premium" className="text-sm font-medium">
                        Högre licensnivå (Premium/Enterprise)
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Behövs vid t.ex. tillverkning, service­order eller avancerad försäljning.
                      </p>
                    </div>
                    <Switch id="premium" checked={premiumLicense} onCheckedChange={setPremiumLicense} />
                  </div>

                  <div>
                    <Label className="mb-2 block">Hur nära standard kan ni jobba?</Label>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {COMPLEXITY_OPTIONS.map((c) => {
                        const active = complexity === c.key;
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setComplexity(c.key)}
                            aria-pressed={active}
                            className={`rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                              active
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card hover:bg-secondary"
                            }`}
                          >
                            <span className="block text-sm font-semibold text-foreground">
                              {c.label}
                            </span>
                            <span className="block text-xs text-muted-foreground mt-1">
                              {c.note}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <div className="flex items-baseline justify-between mb-2">
                        <Label htmlFor="integrations">Integrationer</Label>
                        <span className="text-sm font-semibold text-foreground">{integrations} st</span>
                      </div>
                      <Slider
                        id="integrations"
                        value={[integrations]}
                        min={0}
                        max={15}
                        step={1}
                        onValueChange={(v) => setIntegrations(v[0])}
                        aria-label="Antal integrationer"
                      />
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between mb-2">
                        <Label htmlFor="entities">Bolag / juridiska enheter</Label>
                        <span className="text-sm font-semibold text-foreground">{legalEntities} st</span>
                      </div>
                      <Slider
                        id="entities"
                        value={[legalEntities]}
                        min={1}
                        max={20}
                        step={1}
                        onValueChange={(v) => setLegalEntities(v[0])}
                        aria-label="Antal bolag eller juridiska enheter"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        id: "migration",
                        label: "Datamigrering",
                        checked: dataMigration,
                        set: setDataMigration,
                      },
                      {
                        id: "custom",
                        label: "Egen utveckling",
                        checked: customDevelopment,
                        set: setCustomDevelopment,
                      },
                      {
                        id: "training",
                        label: "Utbildning av användare",
                        checked: training,
                        set: setTraining,
                      },
                    ].map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                      >
                        <Label htmlFor={o.id} className="text-sm">{o.label}</Label>
                        <Switch id={o.id} checked={o.checked} onCheckedChange={o.set} />
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <Label htmlFor="rate">Konsultpris per timme</Label>
                      <span className="text-sm font-semibold text-foreground">
                        {fmtSek(hourlyRate)}/tim
                      </span>
                    </div>
                    <Slider
                      id="rate"
                      value={[hourlyRate]}
                      min={900}
                      max={2200}
                      step={50}
                      onValueChange={(v) => setHourlyRate(v[0])}
                      aria-label="Konsultpris per timme"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Marknadsmässigt spann i Sverige 2026 ligger ofta på 1 100–1 700 kr/tim.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24 lg:self-start">
              <Card className="border-primary/30">
                <CardContent className="pt-6 space-y-5">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
                    Er uppskattning
                  </h2>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Implementation (engångskostnad)
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {fmtSek(result.costLow)} – {fmtSek(result.costHigh)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ca {new Intl.NumberFormat("sv-SE").format(result.hours)} konsulttimmar
                      (mittvärde {fmtSek(result.costMid)}).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary/60 p-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Wallet className="h-3.5 w-3.5" aria-hidden="true" /> Licens/mån
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {result.licenseMonthly == null ? "Offert" : fmtSek(result.licenseMonthly)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 p-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Tidplan
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        ca {result.months.toString().replace(".", ",")} mån
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border p-3 text-sm">
                    <p className="flex justify-between py-1">
                      <span className="text-muted-foreground">Licens per år</span>
                      <span className="font-medium text-foreground">
                        {result.licenseYearly == null ? "Offert" : fmtSek(result.licenseYearly)}
                      </span>
                    </p>
                    <p className="flex justify-between py-1">
                      <span className="text-muted-foreground">Förvaltning per år</span>
                      <span className="font-medium text-foreground">{fmtSek(result.supportYearly)}</span>
                    </p>
                    <p className="flex justify-between py-1 border-t border-border mt-1 pt-2">
                      <span className="font-medium text-foreground">Total kostnad 3 år</span>
                      <span className="font-bold text-foreground">
                        {result.threeYearTotal == null ? "Offert" : fmtSek(result.threeYearTotal)}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      Fördelning per fas
                    </p>
                    <ul className="space-y-2">
                      {result.phases.map((p) => (
                        <li key={p.name} className="text-sm">
                          <div className="flex justify-between gap-2">
                            <span className="text-foreground">{p.name}</span>
                            <span className="text-muted-foreground whitespace-nowrap">
                              {fmtSek(p.cost)}
                            </span>
                          </div>
                          <div
                            className="mt-1 h-1.5 w-full rounded-full bg-secondary"
                            role="presentation"
                          >
                            <div
                              className="h-1.5 rounded-full bg-accent"
                              style={{ width: `${Math.round(p.share * 100)}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-border p-3 space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Uppgifter till PDF-offerten
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Frivilligt – fyll i det ni vill ha med överst i PDF:en.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pdf-company" className="text-xs">Företagsnamn</Label>
                      <Input
                        id="pdf-company"
                        value={pdfCompany}
                        onChange={(e) => setPdfCompany(e.target.value)}
                        placeholder="T.ex. Nordic Industri AB"
                        maxLength={80}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pdf-contact" className="text-xs">Kontaktperson</Label>
                      <Input
                        id="pdf-contact"
                        value={pdfContact}
                        onChange={(e) => setPdfContact(e.target.value)}
                        placeholder="T.ex. Anna Andersson, CFO"
                        maxLength={80}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pdf-reference" className="text-xs">Referens / projekt</Label>
                      <Input
                        id="pdf-reference"
                        value={pdfReference}
                        onChange={(e) => setPdfReference(e.target.value)}
                        placeholder="T.ex. ERP-projekt 2026"
                        maxLength={80}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pdf-notes" className="text-xs">Egen notering</Label>
                      <Textarea
                        id="pdf-notes"
                        value={pdfNotes}
                        onChange={(e) => setPdfNotes(e.target.value)}
                        placeholder="T.ex. Underlag inför styrelsemöte i september."
                        maxLength={400}
                        rows={3}
                      />
                    </div>
                  </div>

                  <QuickLeadForm
                    className="border-[hsl(var(--cta-orange))]/30 bg-[hsl(var(--cta-orange))]/5"
                    title="Få prisuppskattningen som PDF"
                    description="Fyll i tre fält så startar nedladdningen direkt – och vi kan matcha er mot rätt partners."
                    sourceType="implementation_calculator_pdf"
                    contextNote={`Kalkyl: ${users} användare, ${integrations} integrationer`}
                    destination={{ type: "pdf", run: handleDownloadPdf, label: "Ladda ned PDF" }}
                  />

                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      size="lg"
                      variant="secondary"
                      onClick={handleDownloadPdf}
                      disabled={downloading}
                    >
                      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                      {downloading ? "Skapar PDF …" : "Ladda ned som PDF"}
                    </Button>
                    <Button asChild size="lg">
                      <Link to="/behovsanalys/">
                        Starta en kostnadsfri behovsanalys
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/kostnad/">Läs mer om vad Dynamics 365 kostar</Link>
                    </Button>
                  </div>


                </CardContent>
              </Card>

              <CalculatorDrafts
                inputs={{
                  solutions,
                  users,
                  premiumLicense,
                  complexity,
                  integrations,
                  legalEntities,
                  dataMigration,
                  customDevelopment,
                  training,
                  hourlyRate,
                }}
                summary={{
                  costLow: result.costLow,
                  costHigh: result.costHigh,
                  hours: result.hours,
                  months: result.months,
                  licenseMonthly: result.licenseMonthly,
                  threeYearTotal: result.threeYearTotal,
                }}
                onLoad={(i) => {
                  setSolutions(i.solutions);
                  setUsers(i.users);
                  setPremiumLicense(i.premiumLicense);
                  setComplexity(i.complexity);
                  setIntegrations(i.integrations);
                  setLegalEntities(i.legalEntities);
                  setDataMigration(i.dataMigration);
                  setCustomDevelopment(i.customDevelopment);
                  setTraining(i.training);
                  setHourlyRate(i.hourlyRate);
                }}
              />

              <CalculatorCompare
                currentInputs={{
                  solutions,
                  users,
                  premiumLicense,
                  complexity,
                  integrations,
                  legalEntities,
                  dataMigration,
                  customDevelopment,
                  training,
                  hourlyRate,
                }}
                priceLookup={priceLookup}
              />
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <Card className="bg-secondary/40">
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-accent" aria-hidden="true" />
                  Så räknar vi – helt öppet
                </h2>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                  <li>
                    Grundomfattningen utgår från typiska projekt per lösning och skalas med
                    antal användare (inte linjärt – stora projekt blir effektivare per användare).
                  </li>
                  <li>
                    Komplexitetsvalet multiplicerar omfattningen med 1,0 / 1,35 / 1,85.
                  </li>
                  <li>
                    Varje integration räknas som ca 45 timmar, varje extra bolag som ca 60 timmar.
                  </li>
                  <li>
                    Datamigrering +12 %, egen utveckling +20 %, utbildning tillkommer utifrån antal
                    användare.
                  </li>
                  <li>
                    Spannet visas som −20 % / +30 % kring mittvärdet. Förvaltning uppskattas till
                    15 % av implementationskostnaden per år.
                  </li>
                  <li>
                    Licenskostnaden hämtas från våra publicerade{" "}
                    <Link to="/priser/" className="text-primary underline underline-offset-2">
                      listpriser för Dynamics 365
                    </Link>{" "}
                    och antar en licens per användare. Verkliga priser påverkas av avtalsform och
                    mix av licenstyper.
                  </li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">Vägledande estimat</Badge>
                  <Badge variant="secondary">Inte en offert</Badge>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Granska varje beräkningssteg
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Öppna ett steg för att se formeln, vilka av era val som driver resultatet och
                    varför regeln ser ut som den gör. Allt uppdateras direkt när ni ändrar
                    inställningarna ovan.
                  </p>
                  <Accordion type="multiple" className="w-full">
                    {result.steps.map((step, i) => (
                      <AccordionItem key={step.label} value={`step-${i}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="flex flex-1 flex-wrap items-center justify-between gap-2 pr-3">
                            <span className="text-sm font-medium text-foreground">
                              {step.label}
                            </span>
                            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                              {step.value}
                            </span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pb-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                Påverkar: {step.impact}
                              </Badge>
                            </div>
                            <div className="rounded-lg border border-border bg-card p-3">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                                Beräkning
                              </p>
                              <p className="text-sm font-medium text-foreground break-words">
                                {step.formula}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                                Datapunkter som driver steget
                              </p>
                              <ul className="space-y-1">
                                {step.drivers.map((d) => (
                                  <li
                                    key={d.label}
                                    className="flex flex-wrap justify-between gap-2 border-b border-border/60 py-1 text-sm last:border-0"
                                  >
                                    <span className="text-muted-foreground">{d.label}</span>
                                    <span className="font-medium text-foreground">{d.value}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <p className="text-sm text-muted-foreground">{step.note}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

              </CardContent>
            </Card>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <SuggestedPartnersCTA
              product={partnerProducts}
              intro="Vill ni stämma av kalkylen mot verkliga offerter? Dessa partners arbetar med de lösningar ni valt."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
