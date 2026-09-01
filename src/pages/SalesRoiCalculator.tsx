import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Info, TrendingUp, Clock, Wallet, PiggyBank } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SuggestedPartnersCTA from "@/components/SuggestedPartnersCTA";
import { BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { usePriceMap } from "@/hooks/usePriceMap";
import { usePartners } from "@/hooks/usePartners";
import { pickSuggestedPartners } from "@/lib/suggestPartners";
import { buildCompareUrl } from "@/lib/compareUrl";
import { filterAndSortPartners } from "@/hooks/usePartnerFilters";
import PartnerCard from "@/components/PartnerCard";
import {
  SALES_INDUSTRY_DRIVERS,
  SALES_INDUSTRY_IMPL_FACTOR,
  defaultEnabledSalesDrivers,
  type SalesIndustry,
} from "@/data/salesRoiDrivers";
import RoiPdfDownload from "@/components/RoiPdfDownload";
import type { RoiPdfData } from "@/utils/generateRoiPdf";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Dynamics 365 Sales", url: "https://d365.se/d365sales/" },
  { name: "ROI/TCO-kalkylator", url: "https://d365.se/d365sales/roi-kalkylator/" },
];

type Complexity = "Låg" | "Medel" | "Hög";
type SalesLicense = "Professional" | "Enterprise" | "Premium";

interface Inputs {
  companyName: string;
  industry: SalesIndustry;
  sellers: number;
  salesOps: number;
  license: SalesLicense;
  revenue: number;
  avgDealSize: number;
  complexity: Complexity;
  adminPct: number;
  enabledDrivers: string[];
  integrations: number;
  currentItCost: number;
}

const initialIndustry: SalesIndustry = "B2B-tjänster";
const DEFAULTS: Inputs = {
  companyName: "",
  industry: initialIndustry,
  sellers: 15,
  salesOps: 2,
  license: "Enterprise",
  revenue: 80_000_000,
  avgDealSize: 250_000,
  complexity: "Medel",
  adminPct: 35,
  enabledDrivers: defaultEnabledSalesDrivers(initialIndustry),
  integrations: 2,
  currentItCost: 250_000,
};

const fmtSek = (n: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

const fmtSekInput = (n: number) => new Intl.NumberFormat("sv-SE").format(n);

const parseNum = (s: string): number => {
  const cleaned = s.replace(/\s/g, "").replace(/[^\d-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

export default function SalesRoiCalculator() {
  const priceMap = usePriceMap();
  const { data: partners = [] } = usePartners();
  const [v, setV] = useState<Inputs>(DEFAULTS);
  const [showAssumptions, setShowAssumptions] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const update = <K extends keyof Inputs>(k: K, val: Inputs[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  // ----- Pricing (SEK/mån per säljare från priceMap) -----
  const prof = priceMap.get("sales-professional");
  const ent = priceMap.get("sales-enterprise");
  const prem = priceMap.get("sales-premium");
  const profPrice = prof?.price_sek ?? null;
  const entPrice = ent?.price_sek ?? null;
  const premPrice = prem?.price_sek ?? null;

  const perSellerPrice =
    v.license === "Premium" ? premPrice : v.license === "Enterprise" ? entPrice : profPrice;

  // Sales Ops / power users: räknas som Enterprise-licens som ett konservativt antagande.
  const perOpsPrice = entPrice ?? perSellerPrice;

  // ----- Aktiva drivare för vald bransch -----
  const industryDrivers = SALES_INDUSTRY_DRIVERS[v.industry];
  const activeDrivers = useMemo(
    () => industryDrivers.filter((d) => v.enabledDrivers.includes(d.id)),
    [industryDrivers, v.enabledDrivers]
  );

  // ----- Beräkningar -----
  const calc = useMemo(() => {
    const sellerCost = (perSellerPrice ?? 0) * v.sellers;
    const opsCost = (perOpsPrice ?? 0) * v.salesOps;
    const licenseMonthly = sellerCost + opsCost;
    const licenseYearly = licenseMonthly * 12;

    // Sales-projekt är typiskt lättare än ERP. Bas:
    const complexityImpl: Record<Complexity, number> = {
      Låg: 150_000,
      Medel: 350_000,
      Hög: 750_000,
    };
    const industryFactor = SALES_INDUSTRY_IMPL_FACTOR[v.industry];
    // Skalas mjukt med antal säljare över 15 (baseline för CRM-projekt).
    const usersFactor = 1 + Math.max(0, v.sellers - 15) * 0.015;
    const driverImplCost = activeDrivers.reduce((sum, d) => sum + d.implCost, 0);
    const premiumAddon = v.license === "Premium" ? 150_000 : 0;
    const enterpriseAddon = v.license === "Enterprise" ? 50_000 : 0;
    const implementation =
      complexityImpl[v.complexity] * usersFactor * industryFactor +
      v.integrations * 35_000 +
      driverImplCost +
      premiumAddon +
      enterpriseAddon;

    // CRM-förvaltning ligger ofta lite lägre än ERP – mer konfiguration, mindre tung integration.
    // År 1: ~10 % av implementation (projekt pågår). År 2–5: ~15 %/år.
    const supportYear1 = implementation * 0.1;
    const supportYearly = implementation * 0.15;

    const complexityFactor: Record<Complexity, number> = { Låg: 0.7, Medel: 1, Hög: 1.25 };
    // Hur stor del av säljarens tid som idag går till admin styr hur mycket Copilot/CRM-effektiviseringar slår.
    const adminMultiplier = 0.6 + (v.adminPct / 100) * 1.2; // 0,6 vid 0%, 1,8 vid 100%

    // Användarskala: drivare ger mer ju fler säljare. Baseline 10 säljare = 1,0.
    const userFactor = Math.min(3.5, Math.max(0.4, Math.pow(Math.max(1, v.sellers) / 10, 0.55)));

    const driverSavings = activeDrivers.reduce(
      (sum, d) => sum + d.savings(v.revenue, v.sellers),
      0
    );
    const integrationSavings = v.integrations * 40_000;
    const annualBenefit =
      (driverSavings * adminMultiplier * userFactor + integrationSavings) *
      complexityFactor[v.complexity];

    const netAnnual = annualBenefit + v.currentItCost - licenseYearly - supportYearly;
    const paybackMonths = netAnnual > 0 ? (implementation / netAnnual) * 12 : null;

    const tco5 = implementation + 5 * licenseYearly + supportYear1 + 4 * supportYearly;
    const benefit5 = 5 * annualBenefit + 5 * v.currentItCost;
    const net5 = benefit5 - tco5;
    const roiPct = implementation > 0 ? (net5 / implementation) * 100 : 0;

    // Indikativ pipeline-effekt (för "Vad det motsvarar"-rad).
    const incrementalDealsPerYear = v.avgDealSize > 0 ? annualBenefit / v.avgDealSize : 0;

    return {
      licenseMonthly,
      licenseYearly,
      sellerCost,
      opsCost,
      implementation,
      supportYear1,
      supportYearly,
      annualBenefit,
      netAnnual,
      paybackMonths,
      tco5,
      benefit5,
      net5,
      roiPct,
      incrementalDealsPerYear,
    };
  }, [v, perSellerPrice, perOpsPrice, activeDrivers]);

  const priceMissing = perSellerPrice == null;

  // ----- Relevanta partners (CRM/Sales) -----
  const salesPartners = useMemo(
    () => filterAndSortPartners(partners, "sales", null, null, null, null, true).slice(0, 6),
    [partners]
  );
  usePartnerImpressions("partner_list_impression", salesPartners, { surface: "roi-kalkylator-sales" });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Sales ROI-kalkylator – payback & 5-årig kostnad"
        description="Indikativ ROI- och TCO-kalkyl för Microsoft Dynamics 365 Sales. Räkna licens, implementation, payback och 5-årig totalkostnad utifrån antal säljare, bransch och valda effektiviseringar."
        canonicalPath="/d365sales/roi-kalkylator/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <SoftwareApplicationSchema
        name="Dynamics 365 Sales ROI/TCO-kalkylator"
        description="Räkna fram payback, 5-årig TCO och årlig säljnytta för Microsoft Dynamics 365 Sales – per säljare, bransch och effektiviseringsmål."
        url="https://d365.se/d365sales/roi-kalkylator/"
      />
      <Navbar />

      <main className="pt-10">
        {/* HERO */}
        <section className="border-b border-border bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8 sm:py-12">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to="/d365sales/" className="hover:text-foreground">Dynamics 365 Sales</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">ROI/TCO-kalkylator</span>
            </nav>
            <Badge variant="outline" className="mb-4">
              <Calculator className="w-3 h-3 mr-1" /> Beslutsstöd
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 max-w-3xl">
              Beräkna ROI och TCO för Dynamics 365 Sales
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
              Få en indikativ uppskattning av investering, årlig nytta, payback och 5-årig TCO baserat på antal säljare, bransch och vilka effektiviseringar du satsar på.
            </p>
            <p className="text-xs text-muted-foreground mt-4 max-w-3xl italic">
              Kalkylen är en förenklad uppskattning och bör användas som beslutsstöd – inte som en slutlig offert eller affärskalkyl.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                <a href="#kalkyl">Starta en kalkyl <ArrowRight className="ml-2 w-4 h-4" /></a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setShowAssumptions(true);
                  document.getElementById("antaganden")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Visa antaganden
              </Button>
            </div>
          </div>
        </section>

        {/* KALKYL */}
        <section id="kalkyl" className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* INPUT */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold text-foreground mb-6">Dina förutsättningar</h2>
                <Card>
                  <CardContent className="p-6 space-y-6">
                    {/* Företagsnamn */}
                    <div className="space-y-2">
                      <Label htmlFor="company">Företagsnamn <span className="text-muted-foreground font-normal">(valfritt)</span></Label>
                      <Input
                        id="company"
                        value={v.companyName}
                        onChange={(e) => update("companyName", e.target.value)}
                        placeholder="Ditt företag AB"
                      />
                    </div>

                    {/* Bransch */}
                    <div className="space-y-2">
                      <Label>Bransch</Label>
                      <Select
                        value={v.industry}
                        onValueChange={(val) => {
                          const next = val as SalesIndustry;
                          setV((prev) => ({
                            ...prev,
                            industry: next,
                            enabledDrivers: defaultEnabledSalesDrivers(next),
                          }));
                        }}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.keys(SALES_INDUSTRY_DRIVERS) as SalesIndustry[]).map(i => (
                            <SelectItem key={i} value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Säljare / sales ops */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sellers">Antal säljare</Label>
                        <Input id="sellers" type="number" min={1} value={v.sellers}
                          onChange={(e) => update("sellers", Math.max(1, Number(e.target.value) || 1))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ops">Sales Ops / admin</Label>
                        <Input id="ops" type="number" min={0} value={v.salesOps}
                          onChange={(e) => update("salesOps", Math.max(0, Number(e.target.value) || 0))} />
                      </div>
                    </div>

                    {/* Licensmodell */}
                    <div className="space-y-2">
                      <Label>Licensmodell</Label>
                      <Select value={v.license} onValueChange={(val) => update("license", val as SalesLicense)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professional">Sales Professional</SelectItem>
                          <SelectItem value="Enterprise">Sales Enterprise</SelectItem>
                          <SelectItem value="Premium">Sales Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      {priceMissing && (
                        <p className="text-xs text-destructive">Pris saknas i licensprislistan</p>
                      )}
                    </div>

                    {/* Omsättning */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rev">Omsättning per år</Label>
                        <Input
                          id="rev"
                          inputMode="numeric"
                          value={fmtSekInput(v.revenue)}
                          onChange={(e) => update("revenue", parseNum(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">{fmtSek(v.revenue)}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deal">Genomsnittlig affärsstorlek</Label>
                        <Input
                          id="deal"
                          inputMode="numeric"
                          value={fmtSekInput(v.avgDealSize)}
                          onChange={(e) => update("avgDealSize", parseNum(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">{fmtSek(v.avgDealSize)}</p>
                      </div>
                    </div>

                    {/* Komplexitet */}
                    <div className="space-y-2">
                      <Label>Säljprocessens komplexitet</Label>
                      <ToggleGroup
                        type="single"
                        value={v.complexity}
                        onValueChange={(val) => val && update("complexity", val as Complexity)}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="Låg">Låg</ToggleGroupItem>
                        <ToggleGroupItem value="Medel">Medel</ToggleGroupItem>
                        <ToggleGroupItem value="Hög">Hög</ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    {/* Andel adminstidsspill */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Andel av säljarens tid som idag går till admin</Label>
                        <span className="text-sm font-medium text-foreground">{v.adminPct}%</span>
                      </div>
                      <Slider
                        min={0} max={100} step={5}
                        value={[v.adminPct]}
                        onValueChange={([val]) => update("adminPct", val)}
                      />
                      <p className="text-xs text-muted-foreground">Högre andel admin → större potential från Copilot, CRM-automatisering och Microsoft 365-integration.</p>
                    </div>

                    {/* Branschspecifika drivare */}
                    <div className="space-y-3">
                      <div>
                        <Label>Effektiviseringar för {v.industry.toLowerCase()}</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Bocka i de områden där du ser potential. Estimaten baseras på Microsofts Business Value Assessment och svenska partnerbenchmarks för CRM-införanden.
                        </p>
                      </div>
                      <div className="space-y-2">
                        {industryDrivers.map((d) => {
                          const checked = v.enabledDrivers.includes(d.id);
                          const userFactorUi = Math.min(3.5, Math.max(0.4, Math.pow(Math.max(1, v.sellers) / 10, 0.55)));
                          const annual = d.savings(v.revenue, v.sellers) * userFactorUi;
                          return (
                            <div
                              key={d.id}
                              className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${
                                checked ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/40"
                              }`}
                            >
                              <Checkbox
                                id={`drv-${d.id}`}
                                checked={checked}
                                onCheckedChange={(b) => {
                                  setV((prev) => ({
                                    ...prev,
                                    enabledDrivers: b
                                      ? [...prev.enabledDrivers, d.id]
                                      : prev.enabledDrivers.filter((x) => x !== d.id),
                                  }));
                                }}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <label htmlFor={`drv-${d.id}`} className="cursor-pointer block">
                                  <div className="flex items-baseline justify-between gap-3">
                                    <span className="text-sm font-medium text-foreground">{d.label}</span>
                                    <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                                      ~{fmtSek(annual)}/år
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">{d.hint}</p>
                                </label>
                                <details className="mt-2 group">
                                  <summary className="text-xs text-primary cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                                    <span className="group-open:hidden">Visa förklaring ▾</span>
                                    <span className="hidden group-open:inline">Dölj förklaring ▴</span>
                                  </summary>
                                  <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                                    {d.detail}
                                  </p>
                                </details>
                              </div>
                            </div>

                          );
                        })}
                      </div>
                    </div>

                    {/* Integrationer */}
                    <div className="space-y-2">
                      <Label htmlFor="int">Antal integrationer (ERP, marketing, telefoni etc.)</Label>
                      <Input id="int" type="number" min={0} value={v.integrations}
                        onChange={(e) => update("integrations", Math.max(0, Number(e.target.value) || 0))} />
                    </div>

                    {/* Nuvarande IT-kostnad */}
                    <div className="space-y-2">
                      <Label htmlFor="cur">Nuvarande CRM-/IT-kostnad per år</Label>
                      <Input
                        id="cur"
                        inputMode="numeric"
                        value={fmtSekInput(v.currentItCost)}
                        onChange={(e) => update("currentItCost", parseNum(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">{fmtSek(v.currentItCost)}</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button variant="ghost" onClick={() => setV(DEFAULTS)}>Återställ värden</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* RESULT */}
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-24 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Resultat</h2>
                  <p className="text-xs text-muted-foreground">Live-uppdaterad indikation{v.companyName ? ` för ${v.companyName}` : ""}.</p>

                  <Card className="bg-[hsl(var(--hero-dark,222_47%_11%))] text-primary-foreground border-0">
                    <CardContent className="p-6 space-y-4">
                      <Kpi
                        icon={<TrendingUp className="w-4 h-4" />}
                        label="5-årig ROI"
                        value={`${Math.round(calc.roiPct)}%`}
                        tone={calc.roiPct >= 0 ? "good" : "warn"}
                      />
                      <Kpi
                        icon={<Clock className="w-4 h-4" />}
                        label="Payback"
                        value={calc.paybackMonths == null ? "—" : `${Math.round(calc.paybackMonths)} mån`}
                        sub={calc.paybackMonths == null ? "Nytta täcker inte löpande kostnad" : undefined}
                      />
                      <Kpi
                        icon={<Wallet className="w-4 h-4" />}
                        label="5-årig TCO"
                        value={fmtSek(calc.tco5)}
                      />
                      <Kpi
                        icon={<PiggyBank className="w-4 h-4" />}
                        label="Nettonytta år 1"
                        value={fmtSek(calc.netAnnual)}
                        tone={calc.netAnnual >= 0 ? "good" : "warn"}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-5 text-sm space-y-2">
                      <Row label={`Säljarlicenser (${v.license})`} value={fmtSek(calc.sellerCost)} sub="/mån" />
                      <Row label="Sales Ops-licenser" value={fmtSek(calc.opsCost)} sub="/mån" />
                      <div className="border-t border-border my-2" />
                      <Row label="Licens totalt" value={fmtSek(calc.licenseMonthly)} sub="/mån" strong />
                      <Row label="Licens helår" value={fmtSek(calc.licenseYearly)} />
                      <div className="border-t border-border my-2" />
                      <Row label="Implementation (engångs)" value={fmtSek(calc.implementation)} />
                      <Row label="Förvaltning år 1" value={fmtSek(calc.supportYear1)} />
                      <Row label="Förvaltning år 2+" value={fmtSek(calc.supportYearly)} sub="/år" />
                      <Row label="Estimerad årlig nytta" value={fmtSek(calc.annualBenefit)} />
                      {calc.incrementalDealsPerYear > 0 && v.avgDealSize > 0 && (
                        <Row
                          label="≈ motsvarar"
                          value={`${calc.incrementalDealsPerYear.toFixed(1)} affärer/år`}
                        />
                      )}
                    </CardContent>
                  </Card>

                  <p className="text-xs text-muted-foreground flex gap-2">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Indikativ kalkyl – verkligt utfall beror på avtal, förändringsledning och säljledningens disciplin i CRM-användandet.
                  </p>
                </div>
              </div>
            </div>

            {/* PDF DOWNLOAD */}
            <div className="mt-10 max-w-3xl mx-auto">
              <RoiPdfDownload
                sourceKey="d365sales-roi"
                productLabel="Dynamics 365 Sales"
                buildPdfData={(email): RoiPdfData => {
                  const userFactorUi = Math.min(3.5, Math.max(0.4, Math.pow(Math.max(1, v.sellers) / 10, 0.55)));
                  return {
                    productName: "Dynamics 365 Sales",
                    pageUrl: "d365.se/d365sales/roi-kalkylator/",
                    companyName: v.companyName || undefined,
                    recipientEmail: email,
                    fileName: `d365sales-roi-tco-${v.companyName ? v.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" : ""}${new Date().toISOString().slice(0, 10)}.pdf`,
                    kpis: [
                      { label: "5-årig ROI", value: `${Math.round(calc.roiPct)}%` },
                      { label: "Payback", value: calc.paybackMonths == null ? "—" : `${Math.round(calc.paybackMonths)} mån`, sub: calc.paybackMonths == null ? "Nytta täcker inte löpande kostnad" : undefined },
                      { label: "5-årig TCO", value: fmtSek(calc.tco5) },
                      { label: "Nettonytta år 1", value: fmtSek(calc.netAnnual) },
                    ],
                    inputs: [
                      { label: "Bransch", value: v.industry },
                      { label: "Licensmodell", value: v.license },
                      { label: "Antal säljare", value: String(v.sellers) },
                      { label: "Sales Ops / admin", value: String(v.salesOps) },
                      { label: "Omsättning per år", value: fmtSek(v.revenue) },
                      { label: "Genomsnittlig affärsstorlek", value: fmtSek(v.avgDealSize) },
                      { label: "Säljprocessens komplexitet", value: v.complexity },
                      { label: "Andel adminstid idag", value: `${v.adminPct}%` },
                      { label: "Antal integrationer", value: String(v.integrations) },
                      { label: "Nuvarande CRM-/IT-kostnad/år", value: fmtSek(v.currentItCost) },
                    ],
                    costRows: [
                      { label: `Säljarlicenser (${v.license})`, value: fmtSek(calc.sellerCost), sub: "/mån" },
                      { label: "Sales Ops-licenser", value: fmtSek(calc.opsCost), sub: "/mån" },
                      { divider: true, label: "", value: "" },
                      { label: "Licens totalt", value: fmtSek(calc.licenseMonthly), sub: "/mån", strong: true },
                      { label: "Licens helår", value: fmtSek(calc.licenseYearly) },
                      { divider: true, label: "", value: "" },
                      { label: "Implementation (engångs)", value: fmtSek(calc.implementation) },
                      { label: "Förvaltning år 1", value: fmtSek(calc.supportYear1) },
                      { label: "Förvaltning år 2+", value: fmtSek(calc.supportYearly), sub: "/år" },
                      { label: "Estimerad årlig nytta", value: fmtSek(calc.annualBenefit), strong: true },
                    ],
                    drivers: activeDrivers.map((d) => ({
                      label: d.label,
                      annual: d.savings(v.revenue, v.sellers) * userFactorUi,
                      hint: d.hint,
                      detail: d.detail,
                    })),

                    assumptions: [
                      { title: "Licens", body: "Priser hämtas från d365.se centrala prisregister (Microsofts listpriser för Sales Professional, Enterprise och Premium, SEK/mån exkl. moms). Faktiskt pris beror på avtalsform (EA, CSP), volym och förhandling. Sales Ops antas använda Enterprise-licens." },
                      { title: "Implementation", body: "Bas: Låg 150 000 kr, Medel 350 000 kr, Hög 750 000 kr. Skalas mjukt med antal säljare (+1,5 % per säljare över 15) och med en branschfaktor som speglar typisk projekttyngd för CRM-införanden: Tillverkning 1,3× · Finans & försäkring 1,3× · Distribution 1,1× · Tech & SaaS 1,0× · Bygg 1,0× · B2B-tjänster 0,9× · Annan 1,0×. Därtill + 35 000 kr per integration, + engångskostnad per vald effektiviseringsdrivare (60–150 000 kr beroende på område), + 150 000 kr om Premium krävs och + 50 000 kr för Enterprise (anpassning & Power Platform)." },
                      { title: "Förvaltning", body: "CRM-förvaltning ligger normalt lägre än ERP. År 1 antas cirka 10 % av implementationskostnaden, eftersom huvuddelen av insatsen går till själva projektet. Från år 2 antas normal förvaltningsnivå om cirka 15 % per år." },
                      { title: "Årlig nytta", body: "Nyttan summeras från de drivare du bockat i för din bransch. Varje drivare är en kombination av per säljare-belopp och en liten andel av omsättning (taklagd). Summan skalas med antal säljare – baseline 10 säljare = 1,0×, sublinjärt så att 5 säljare ger ~0,7× och 50 säljare ~2,5×. Den justeras sedan med andelen säljaradminstid (0,6×–1,8×) och komplexitetsfaktor (0,7 / 1,0 / 1,25). Integrationer ger dessutom 40 000 kr/år vardera. Estimaten är baserade på Microsofts Business Value Assessment och svenska partnerbenchmarks för CRM-införanden." },
                      { title: "Payback & TCO", body: "Payback = implementation / (årlig nettonytta inkl. ersatt IT-kostnad). 5-årig TCO = implementation + 5 × licens + förvaltning år 1 + 4 × förvaltning år 2+. 5-årig ROI = (5 × årlig nytta + 5 × ersatt IT-kostnad − TCO) / implementation." },
                      { title: "Vad ingår inte", body: "Förändringsledning, datakvalitet och datamigrering, säljträning, externa marketing automation-licenser, Power Platform-tillägg utöver standard samt integrationsplattform (iPaaS) hanteras separat." },
                      { title: "Disclaimer", body: "Kalkylen är en förenklad uppskattning och bör användas som beslutsstöd – inte som en slutlig offert eller affärskalkyl. Validera alltid utfall med två–tre relevanta partners." },
                    ],
                    ...(() => {
                      const sugg = pickSuggestedPartners(partners, { product: "sales", industry: v.industry, limit: 5 });
                      if (sugg.length === 0) return {};
                      const origin = typeof window !== "undefined" ? window.location.origin : "https://d365.se";
                      return {
                        suggestedPartners: sugg.map((p) => ({
                          name: p.name,
                          slug: p.slug,
                          positioning: (p as any).positioning_statement || p.description || "",
                        })),
                        suggestedCompareUrl: origin + buildCompareUrl(sugg.map((p) => p.slug)),
                        suggestedIndustry: v.industry,
                      };
                    })(),
                  };
                }}
              />
            </div>
          </div>
        </section>

        {/* PARTNERS */}
        <section className="py-12 bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Relevanta Dynamics 365 Sales-partners</h2>
                <p className="text-sm text-muted-foreground mt-1">Publicerade partners med erbjudande inom Sales/CRM.</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/d365sales/#partners">Se alla Sales-partners</Link>
              </Button>
            </div>
            {salesPartners.length === 0 ? (
              <p className="text-sm text-muted-foreground">Laddar partners…</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salesPartners.map((p) => (
                  <PartnerCard
                    key={p.id}
                    partner={p}
                    profileUrl={`/partner/${p.slug}/sales`}
                    productKey="sales"
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ANTAGANDEN */}
        <section id="antaganden" className="py-12 bg-secondary/30 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-2">Antaganden</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Kalkylen är medvetet förenklad. Den ska ge en storleksordning, inte ersätta en business case-analys.
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowAssumptions(s => !s)}>
              {showAssumptions ? "Dölj detaljer" : "Visa detaljer"}
            </Button>
            {showAssumptions && (
              <div className="mt-6 space-y-4 text-sm text-foreground/90">
                <Assumption title="Licens">
                  Priser hämtas från d365.se centrala prisregister (Microsofts listpriser för Sales Professional, Enterprise och Premium, SEK/mån exkl. moms).
                  Faktiskt pris beror på avtalsform (EA, CSP), volym och förhandling. Sales Ops antas använda Enterprise-licens.
                </Assumption>
                <Assumption title="Implementation">
                  Bas: Låg 150 000 kr, Medel 350 000 kr, Hög 750 000 kr. Skalas mjukt med antal säljare (+1,5 % per säljare över 15)
                  och med en <strong>branschfaktor</strong> som speglar typisk projekttyngd för CRM-införanden:
                  Tillverkning 1,3× · Finans & försäkring 1,3× · Distribution 1,1× · Tech & SaaS 1,0× · Bygg 1,0× · B2B-tjänster 0,9× · Annan 1,0×.
                  Därtill + 35 000 kr per integration, + engångskostnad per vald effektiviseringsdrivare (60–150 000 kr beroende på område),
                  + 150 000 kr om Premium krävs och + 50 000 kr för Enterprise (anpassning & Power Platform).
                </Assumption>
                <Assumption title="Förvaltning">
                  CRM-förvaltning ligger normalt lägre än ERP. År 1 antas cirka 10 % av implementationskostnaden,
                  eftersom huvuddelen av insatsen går till själva projektet. Från år 2 antas normal förvaltningsnivå om cirka 15 % per år.
                </Assumption>
                <Assumption title="Årlig nytta">
                  Nyttan summeras från de drivare du bockat i för din bransch. Varje drivare är en kombination av per säljare-belopp och en
                  liten andel av omsättning (taklagd). Summan skalas med <strong>antal säljare</strong> – baseline 10 säljare = 1,0×, sublinjärt
                  så att 5 säljare ger ~0,7× och 50 säljare ~2,5×. Den justeras sedan med andelen säljaradminstid (0,6×–1,8×) och
                  komplexitetsfaktor (0,7 / 1,0 / 1,25). Integrationer ger dessutom 40 000 kr/år vardera. Estimaten är baserade på
                  Microsofts Business Value Assessment och svenska partnerbenchmarks för CRM-införanden.
                </Assumption>
                <Assumption title="Payback &amp; TCO">
                  Payback = implementation / (årlig nettonytta inkl. ersatt IT-kostnad). 5-årig TCO = implementation + 5 × licens + förvaltning år 1 + 4 × förvaltning år 2+.
                  5-årig ROI = (5 × årlig nytta + 5 × ersatt IT-kostnad − TCO) / implementation.
                </Assumption>
                <Assumption title="Vad ingår inte">
                  Förändringsledning, datakvalitet och datamigrering, säljträning, externa marketing automation-licenser,
                  Power Platform-tillägg utöver standard samt integrationsplattform (iPaaS) hanteras separat.
                </Assumption>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Nästa steg</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Validera kalkylen i en kort dialog med två–tre relevanta partners. Eller fördjupa underlaget genom en behovsanalys för sälj & marknad.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                <Link to="/CRMbehovsanalys/">Starta en behovsanalys för CRM</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/kravspecifikation/">Generera en kravspecifikation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/d365sales/#partners">Hitta Sales-partners</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SuggestedPartnersCTA product="sales" industry={v.industry} />
      <Footer />
    </div>
  );
}

// ----- Small helpers -----

function Kpi({
  icon, label, value, sub, tone,
}: { icon: React.ReactNode; label: string; value: string; sub?: string; tone?: "good" | "warn" }) {
  const toneClass =
    tone === "good" ? "text-emerald-300" : tone === "warn" ? "text-amber-300" : "text-primary-foreground";
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm opacity-80">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-right">
        <div className={`text-xl font-bold ${toneClass}`}>{value}</div>
        {sub && <div className="text-xs opacity-70">{sub}</div>}
      </div>
    </div>
  );
}

function Row({ label, value, sub, strong }: { label: string; value: string; sub?: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={`text-muted-foreground ${strong ? "text-foreground font-medium" : ""}`}>{label}</span>
      <span className={`tabular-nums ${strong ? "font-semibold text-foreground" : "text-foreground"}`}>
        {value}{sub && <span className="text-muted-foreground text-xs ml-1">{sub}</span>}
      </span>
    </div>
  );
}

function Assumption({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-md border border-border bg-background">
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
