import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Info, AlertTriangle, TrendingUp, Clock, Wallet, PiggyBank } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePriceMap } from "@/hooks/usePriceMap";
import { usePartners } from "@/hooks/usePartners";
import { pickSuggestedPartners } from "@/lib/suggestPartners";
import { buildCompareUrl } from "@/lib/compareUrl";
import { filterAndSortPartners } from "@/hooks/usePartnerFilters";
import PartnerCard from "@/components/PartnerCard";
import { BC_ISV_SOLUTIONS, type SolutionIndustry } from "@/data/bcIsvSolutions";
import { Checkbox } from "@/components/ui/checkbox";
import { INDUSTRY_DRIVERS, defaultEnabledDrivers, type Industry } from "@/data/bcRoiDrivers";
import RoiPdfDownload from "@/components/RoiPdfDownload";
import type { RoiPdfData } from "@/utils/generateRoiPdf";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Business Central", url: "https://d365.se/businesscentral/" },
  { name: "ROI/TCO-kalkylator", url: "https://d365.se/businesscentral/roi-kalkylator/" },
];

type Complexity = "Låg" | "Medel" | "Hög";
type LicenseModel = "Essentials" | "Premium";

interface Inputs {
  companyName: string;
  industry: Industry;
  fullUsers: number;
  teamMembers: number;
  deviceUsers: number;
  license: LicenseModel;
  revenue: number;
  complexity: Complexity;
  manualPct: number;
  enabledDrivers: string[];
  integrations: number;
  currentItCost: number;
}

const initialIndustry: Industry = "Handel";
const DEFAULTS: Inputs = {
  companyName: "",
  industry: initialIndustry,
  fullUsers: 25,
  teamMembers: 10,
  deviceUsers: 0,
  license: "Essentials",
  revenue: 45_000_000,
  complexity: "Medel",
  manualPct: 60,
  enabledDrivers: defaultEnabledDrivers(initialIndustry),
  integrations: 3,
  currentItCost: 300_000,
};

const fmtSek = (n: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

const fmtSekInput = (n: number) => new Intl.NumberFormat("sv-SE").format(n);

const parseNum = (s: string): number => {
  const cleaned = s.replace(/\s/g, "").replace(/[^\d-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

// Map Swedish industries → ISV catalog industries
const INDUSTRY_TO_ISV: Record<Industry, SolutionIndustry[]> = {
  Handel: ["Retail", "Wholesale"],
  Distribution: ["Wholesale", "3PL"],
  Tillverkning: ["Manufacturing"],
  Tjänster: ["Services"],
  Annan: ["Generell"],
};

export default function BcRoiCalculator() {
  const priceMap = usePriceMap();
  const { data: partners = [] } = usePartners();
  const [v, setV] = useState<Inputs>(DEFAULTS);
  const [showAssumptions, setShowAssumptions] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const update = <K extends keyof Inputs>(k: K, val: Inputs[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  // ----- Pricing (SEK/mån per user from priceMap; device fallback) -----
  const ess = priceMap.get("bc-essentials");
  const prem = priceMap.get("bc-premium");
  const team = priceMap.get("bc-team-members");
  const DEVICE_FALLBACK = 380; // SEK/mån — fallback om SKU saknas i prisregistret
  const essPrice = ess?.price_sek ?? null;
  const premPrice = prem?.price_sek ?? null;
  const teamPrice = team?.price_sek ?? null;
  const deviceSku = priceMap.get("bc-device");
  const devicePrice = deviceSku?.price_sek ?? DEVICE_FALLBACK;

  const perFullUser = v.license === "Premium" ? premPrice : essPrice;
  const perFullUserLabel = v.license === "Premium" ? "Premium" : "Essentials";

  // ----- Aktiva drivare för vald bransch -----
  const industryDrivers = INDUSTRY_DRIVERS[v.industry];
  const activeDrivers = useMemo(
    () => industryDrivers.filter((d) => v.enabledDrivers.includes(d.id)),
    [industryDrivers, v.enabledDrivers]
  );
  const activeIsvCategories = useMemo(() => {
    const set = new Set<string>();
    activeDrivers.forEach((d) => d.isvCategories?.forEach((c) => set.add(c)));
    return set;
  }, [activeDrivers]);

  // ----- Beräkningar -----
  const calc = useMemo(() => {
    const fullCost = (perFullUser ?? 0) * v.fullUsers;
    const teamCost = (teamPrice ?? 0) * v.teamMembers;
    const deviceCost = devicePrice * v.deviceUsers;
    const licenseMonthly = fullCost + teamCost + deviceCost;
    const licenseYearly = licenseMonthly * 12;

    const complexityImpl: Record<Complexity, number> = { Låg: 250_000, Medel: 500_000, Hög: 1_000_000 };
    // Branschfaktor på basimplementation: tillverkning/distribution drar tyngre projekt,
    // tjänster lättare, handel/annan i mitten.
    const industryImplFactor: Record<Industry, number> = {
      Tillverkning: 1.4,
      Distribution: 1.2,
      Handel: 1.0,
      Annan: 1.0,
      Tjänster: 0.8,
    };
    const usersFactor = 1 + Math.max(0, v.fullUsers - 25) * 0.012;
    const driverImplCost = activeDrivers.reduce((sum, d) => sum + d.implCost, 0);
    const implementation =
      complexityImpl[v.complexity] * usersFactor * industryImplFactor[v.industry] +
      v.integrations * 30_000 +
      driverImplCost +
      (v.license === "Premium" ? 200_000 : 0);

    // År 1: lägre förvaltning eftersom projektet pågår (~8% av impl).
    // År 2–5: full löpande förvaltning (~18% av impl/år).
    const supportYear1 = implementation * 0.08;
    const supportYearly = implementation * 0.18;

    const complexityFactor: Record<Complexity, number> = { Låg: 0.6, Medel: 1, Hög: 1.3 };
    const manualMultiplier = 0.5 + (v.manualPct / 100); // 0.5 vid 0%, 1.5 vid 100%
    // Användarskala: drivare ger mer nytta ju fler som faktiskt använder systemet.
    // Baseline 25 användare = 1,0. Sublinjär (^0.6) så stora bolag inte blåser upp orimligt.
    const totalUsers = v.fullUsers + v.teamMembers + v.deviceUsers;
    const userFactor = Math.min(3.5, Math.max(0.4, Math.pow(Math.max(1, totalUsers) / 25, 0.6)));
    const driverSavings = activeDrivers.reduce((sum, d) => sum + d.savings(v.revenue) * userFactor, 0);
    const integrationSavings = v.integrations * 50_000;
    const annualBenefit =
      (driverSavings * manualMultiplier + integrationSavings) * complexityFactor[v.complexity];

    // Payback baseras på steady-state (efter år 1)
    const netAnnual = annualBenefit + v.currentItCost - licenseYearly - supportYearly;
    const paybackMonths = netAnnual > 0 ? (implementation / netAnnual) * 12 : null;

    const tco5 = implementation + 5 * licenseYearly + supportYear1 + 4 * supportYearly;
    const benefit5 = 5 * annualBenefit + 5 * v.currentItCost;
    const net5 = benefit5 - tco5;
    const roiPct = implementation > 0 ? (net5 / implementation) * 100 : 0;

    return {
      licenseMonthly,
      licenseYearly,
      fullCost,
      teamCost,
      deviceCost,
      implementation,
      supportYearly,
      annualBenefit,
      netAnnual,
      paybackMonths,
      tco5,
      benefit5,
      net5,
      roiPct,
    };
  }, [v, perFullUser, teamPrice, devicePrice, activeDrivers]);

  const priceMissing = perFullUser == null || teamPrice == null;
  const tillverkningEssentialsWarning = v.industry === "Tillverkning" && v.license === "Essentials";

  // ----- ISV-rekommendationer baserat på bransch/val -----
  const isvSuggestions = useMemo(() => {
    const want = INDUSTRY_TO_ISV[v.industry];
    const all = BC_ISV_SOLUTIONS.filter((s) =>
      s.industries.some((i) => want.includes(i) || i === "Generell")
    );
    const pri = (s: (typeof all)[number]) => {
      let score = 0;
      if (activeIsvCategories.has(s.category)) score += 6;
      if (v.integrations >= 3 && (s.category === "EDI / e-faktura" || s.category === "Integration / iPaaS")) score += 3;
      if (s.category === "AP automation") score += 2;
      if (s.category === "Lokalisering" && s.geo.includes("Sverige")) score += 2;
      if (s.industries.some((i) => want.includes(i))) score += 4;
      if (s.tier === "Tier 1") score += 1;
      return score;
    };
    return all.sort((a, b) => pri(b) - pri(a)).slice(0, 6);
  }, [v.industry, v.integrations, activeIsvCategories]);

  // ----- Relevanta partners -----
  const bcPartners = useMemo(
    () => filterAndSortPartners(partners, "bc", null, null, null, null, true).slice(0, 6),
    [partners]
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Business Central ROI-kalkylator – kostnad & nytta"
        description="Indikativ ROI- och TCO-kalkyl för Microsoft Dynamics 365 Business Central. Räkna licens, implementation, payback och 5-årig totalkostnad utifrån era nyckeltal."
        canonicalPath="/businesscentral/roi-kalkylator/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <SoftwareApplicationSchema
        name="Business Central ROI/TCO-kalkylator"
        description="Räkna fram payback, 5-årig totalkostnad och årlig nytta för Microsoft Dynamics 365 Business Central baserat på antal användare, bransch och effektiviseringsmål."
        url="https://d365.se/businesscentral/roi-kalkylator/"
      />
      <Navbar />

      <main className="pt-10">
        {/* HERO */}
        <section className="border-b border-border bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8 sm:py-12">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to="/businesscentral/" className="hover:text-foreground">Business Central</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">ROI/TCO-kalkylator</span>
            </nav>
            <Badge variant="outline" className="mb-4">
              <Calculator className="w-3 h-3 mr-1" /> Beslutsstöd
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 max-w-3xl">
              Beräkna ROI och TCO för Business Central
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
              Få en indikativ uppskattning av investering, årlig nytta, payback och 5-årig TCO baserat på några enkla nyckeltal.
            </p>
            <p className="text-xs text-muted-foreground mt-4 max-w-3xl italic">
              Kalkylen är en förenklad uppskattning och bör användas som beslutsstöd – inte som en slutlig offert eller affärskalkyl.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                <a href="#kalkyl">Starta kalkyl <ArrowRight className="ml-2 w-4 h-4" /></a>
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
                          const next = val as Industry;
                          setV((prev) => ({
                            ...prev,
                            industry: next,
                            enabledDrivers: defaultEnabledDrivers(next),
                          }));
                        }}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(["Handel","Distribution","Tillverkning","Tjänster","Annan"] as Industry[]).map(i => (
                            <SelectItem key={i} value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Användare */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full">Antal full users</Label>
                        <Input id="full" type="number" min={1} value={v.fullUsers}
                          onChange={(e) => update("fullUsers", Math.max(1, Number(e.target.value) || 1))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team">Antal Team Members</Label>
                        <Input id="team" type="number" min={0} value={v.teamMembers}
                          onChange={(e) => update("teamMembers", Math.max(0, Number(e.target.value) || 0))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dev">Antal Device-licenser</Label>
                        <Input id="dev" type="number" min={0} value={v.deviceUsers}
                          onChange={(e) => update("deviceUsers", Math.max(0, Number(e.target.value) || 0))} />
                      </div>
                    </div>

                    {/* Licensmodell */}
                    <div className="space-y-2">
                      <Label>Licensmodell</Label>
                      <Select value={v.license} onValueChange={(val) => update("license", val as LicenseModel)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Essentials">Essentials</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      {tillverkningEssentialsWarning && (
                        <div className="flex gap-2 p-3 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 text-sm text-amber-900 dark:text-amber-100">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>Tillverkning kräver normalt Business Central Premium. Kontrollera licensbehovet innan kalkylen används som beslutsunderlag.</span>
                        </div>
                      )}
                      {priceMissing && (
                        <p className="text-xs text-destructive">Pris saknas i licensprislistan</p>
                      )}
                    </div>

                    {/* Omsättning */}
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

                    {/* Komplexitet */}
                    <div className="space-y-2">
                      <Label>Affärskomplexitet</Label>
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

                    {/* Manuella processer */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Andel manuella processer</Label>
                        <span className="text-sm font-medium text-foreground">{v.manualPct}%</span>
                      </div>
                      <Slider
                        min={0} max={100} step={5}
                        value={[v.manualPct]}
                        onValueChange={([val]) => update("manualPct", val)}
                      />
                    </div>

                    {/* Branschspecifika effektiviseringsdrivare */}
                    <div className="space-y-3">
                      <div>
                        <Label>Effektiviseringar för {v.industry.toLowerCase()}</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Bocka i de områden där ni ser potential. Estimaten baseras på Microsofts Business Value Assessment och svenska partnerbenchmarks.
                        </p>
                      </div>
                      <div className="space-y-2">
                        {industryDrivers.map((d) => {
                          const checked = v.enabledDrivers.includes(d.id);
                          const totalUsersUi = v.fullUsers + v.teamMembers + v.deviceUsers;
                          const userFactorUi = Math.min(3.5, Math.max(0.4, Math.pow(Math.max(1, totalUsersUi) / 25, 0.6)));
                          const annual = d.savings(v.revenue) * userFactorUi;
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
                                  <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 pl-0">
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
                      <Label htmlFor="int">Antal integrationer</Label>
                      <Input id="int" type="number" min={0} value={v.integrations}
                        onChange={(e) => update("integrations", Math.max(0, Number(e.target.value) || 0))} />
                    </div>

                    {/* Nuvarande IT-kostnad */}
                    <div className="space-y-2">
                      <Label htmlFor="cur">Nuvarande ERP-/IT-kostnad per år</Label>
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
                      <Row label={`Licens (${perFullUserLabel})`} value={fmtSek(calc.fullCost)} sub="/mån" />
                      <Row label="Team Members" value={fmtSek(calc.teamCost)} sub="/mån" />
                      <Row label="Device-licenser" value={fmtSek(calc.deviceCost)} sub="/mån" />
                      <div className="border-t border-border my-2" />
                      <Row label="Licens totalt" value={fmtSek(calc.licenseMonthly)} sub="/mån" strong />
                      <Row label="Licens helår" value={fmtSek(calc.licenseYearly)} />
                      <div className="border-t border-border my-2" />
                      <Row label="Implementation (engångs)" value={fmtSek(calc.implementation)} />
                      <Row label="Förvaltning" value={fmtSek(calc.supportYearly)} sub="/år" />
                      <Row label="Estimerad årlig nytta" value={fmtSek(calc.annualBenefit)} />
                    </CardContent>
                  </Card>

                  <p className="text-xs text-muted-foreground flex gap-2">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Indikativ kalkyl – verkligt utfall beror på avtal, omfattning och förändringsledning.
                  </p>
                </div>
              </div>
            </div>

            {/* PDF DOWNLOAD */}
            <div className="mt-10 max-w-3xl mx-auto">
              <RoiPdfDownload
                sourceKey="businesscentral-roi"
                productLabel="Business Central"
                buildPdfData={(email): RoiPdfData => {
                  const totalUsers = v.fullUsers + v.teamMembers + v.deviceUsers;
                  const userFactorUi = Math.min(3.5, Math.max(0.4, Math.pow(Math.max(1, totalUsers) / 25, 0.6)));
                  return {
                    productName: "Business Central",
                    pageUrl: "d365.se/businesscentral/roi-kalkylator/",
                    companyName: v.companyName || undefined,
                    recipientEmail: email,
                    fileName: `bc-roi-tco-${v.companyName ? v.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" : ""}${new Date().toISOString().slice(0, 10)}.pdf`,
                    kpis: [
                      { label: "5-årig ROI", value: `${Math.round(calc.roiPct)}%` },
                      { label: "Payback", value: calc.paybackMonths == null ? "—" : `${Math.round(calc.paybackMonths)} mån`, sub: calc.paybackMonths == null ? "Nytta täcker inte löpande kostnad" : undefined },
                      { label: "5-årig TCO", value: fmtSek(calc.tco5) },
                      { label: "Nettonytta år 1", value: fmtSek(calc.netAnnual) },
                    ],
                    inputs: [
                      { label: "Bransch", value: v.industry },
                      { label: "Licensmodell", value: perFullUserLabel },
                      { label: "Full users", value: String(v.fullUsers) },
                      { label: "Team Members", value: String(v.teamMembers) },
                      { label: "Device-licenser", value: String(v.deviceUsers) },
                      { label: "Omsättning per år", value: fmtSek(v.revenue) },
                      { label: "Affärskomplexitet", value: v.complexity },
                      { label: "Andel manuella processer", value: `${v.manualPct}%` },
                      { label: "Antal integrationer", value: String(v.integrations) },
                      { label: "Nuvarande IT-kostnad/år", value: fmtSek(v.currentItCost) },
                    ],
                    costRows: [
                      { label: `Licens (${perFullUserLabel})`, value: fmtSek(calc.fullCost), sub: "/mån" },
                      { label: "Team Members", value: fmtSek(calc.teamCost), sub: "/mån" },
                      { label: "Device-licenser", value: fmtSek(calc.deviceCost), sub: "/mån" },
                      { divider: true, label: "", value: "" },
                      { label: "Licens totalt", value: fmtSek(calc.licenseMonthly), sub: "/mån", strong: true },
                      { label: "Licens helår", value: fmtSek(calc.licenseYearly) },
                      { divider: true, label: "", value: "" },
                      { label: "Implementation (engångs)", value: fmtSek(calc.implementation) },
                      { label: "Förvaltning från år 2", value: fmtSek(calc.supportYearly), sub: "/år" },
                      { label: "Estimerad årlig nytta", value: fmtSek(calc.annualBenefit), strong: true },
                    ],
                    drivers: activeDrivers.map((d) => ({
                      label: d.label,
                      annual: d.savings(v.revenue) * userFactorUi,
                      hint: d.hint,
                      detail: d.detail,
                    })),

                    assumptions: [
                      { title: "Licens", body: `Priser hämtas från d365.se centrala prisregister (Microsofts listpriser, SEK/mån exkl. moms). Faktiskt pris beror på avtalsform (EA, CSP), volym och förhandling. Device-licens använder fallback ${fmtSek(DEVICE_FALLBACK)}/mån om SKU saknas i prisregistret.` },
                      { title: "Implementation", body: "Bas: Låg 250 000 kr, Medel 500 000 kr, Hög 1 000 000 kr. Skalas mjukt med antal användare (+1,2 % per användare över 25) och med en branschfaktor som speglar typisk projekttyngd: Tillverkning 1,4× · Distribution 1,2× · Handel 1,0× · Annan 1,0× · Tjänster 0,8×. Därtill + 30 000 kr per integration, + en engångskostnad per vald effektiviseringsdrivare (50–200 000 kr beroende på område), + 200 000 kr om Premium krävs." },
                      { title: "Förvaltning", body: "År 1 antas löpande förvaltning vara cirka 8 % av implementationskostnaden, eftersom huvuddelen av insatsen går till själva projektet. Från år 2 och framåt antas normal förvaltningsnivå om cirka 18 % per år." },
                      { title: "Årlig nytta", body: "Nyttan summeras från de drivare ni bockat i för er bransch. Varje drivare har en grundnivå (fast belopp eller andel av omsättning, taklagd) som skalas med antal användare – baseline 25 användare = 1,0×, sublinjärt så att 10 användare ger ~0,55× och 100 användare ~2,3×. Summan justeras sedan med andelen manuella processer (0,5×–1,5×) och komplexitetsfaktor (0,6 / 1,0 / 1,3). Integrationer ger dessutom 50 000 kr/år vardera. Estimaten är baserade på Microsofts Business Value Assessment (oktober 2025) och svenska partnerbenchmarks." },
                      { title: "Payback & TCO", body: "Payback = implementation / (årlig nettonytta inkl. ersatt IT-kostnad). 5-årig TCO = implementation + 5 × (licens + förvaltning). 5-årig ROI = (5 × årlig nytta + 5 × ersatt IT-kostnad − TCO) / implementation." },
                      { title: "Vad ingår inte", body: "Förändringsledning, datakvalitet, intern tidsåtgång, integrationsplattform (iPaaS), ISV-licenser och hårdvara hanteras separat." },
                      { title: "Disclaimer", body: "Kalkylen är en förenklad uppskattning och bör användas som beslutsstöd – inte som en slutlig offert eller affärskalkyl. Validera alltid utfall med två–tre relevanta partners." },
                    ],
                    ...(() => {
                      const sugg = pickSuggestedPartners(partners, { product: "bc", industry: v.industry, limit: 3 });
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
        <section className="py-12 bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Rekommenderade tilläggslösningar</h2>
                <p className="text-sm text-muted-foreground mt-1">Baserat på bransch ({v.industry}) och dina val.</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/kunskapscenter/business-central-tillagg/katalog/">Hela ISV-katalogen</Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isvSuggestions.map((s) => (
                <Card key={s.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{s.name}</h3>
                      <Badge variant="secondary" className="text-xs">{s.tier}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.category}</p>
                    <p className="text-sm text-foreground/80">{s.shortDescription}</p>
                    <p className="text-xs text-muted-foreground line-clamp-3">{s.whenFits}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNERS */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Relevanta Business Central-partners</h2>
                <p className="text-sm text-muted-foreground mt-1">Publicerade partners med Business Central-erbjudande.</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/business-central-partners-sverige/">Se alla partners</Link>
              </Button>
            </div>
            {bcPartners.length === 0 ? (
              <p className="text-sm text-muted-foreground">Laddar partners…</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bcPartners.map((p) => (
                  <PartnerCard
                    key={p.id}
                    partner={p}
                    profileUrl={`/partner/${p.slug}/business-central`}
                    productKey="bc"
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
                  Priser hämtas från d365.se centrala prisregister (Microsofts listpriser, SEK/mån exkl. moms).
                  Faktiskt pris beror på avtalsform (EA, CSP), volym och förhandling.
                  Device-licens använder fallback {fmtSek(DEVICE_FALLBACK)}/mån om SKU saknas.
                </Assumption>
                <Assumption title="Implementation">
                  Bas: Låg 250 000 kr, Medel 500 000 kr, Hög 1 000 000 kr. Skalas mjukt med antal användare (+1,2 % per användare över 25)
                  och med en <strong>branschfaktor</strong> som speglar typisk projekttyngd:
                  Tillverkning 1,4× · Distribution 1,2× · Handel 1,0× · Annan 1,0× · Tjänster 0,8×.
                  Därtill + 30 000 kr per integration, + en engångskostnad per vald effektiviseringsdrivare (50–200 000 kr beroende på område),
                  + 200 000 kr om Premium krävs.
                </Assumption>
                <Assumption title="Förvaltning">
                  År 1 antas löpande förvaltning vara cirka 8 % av implementationskostnaden, eftersom huvuddelen av insatsen
                  går till själva projektet. Från år 2 och framåt antas normal förvaltningsnivå om cirka 18 % per år.
                </Assumption>
                <Assumption title="Årlig nytta">
                  Nyttan summeras från de drivare ni bockat i för er bransch. Varje drivare har en grundnivå (fast belopp eller andel
                  av omsättning, taklagd) som skalas med <strong>antal användare</strong> – baseline 25 användare = 1,0×, sublinjärt så att
                  10 användare ger ~0,55× och 100 användare ~2,3×. Summan justeras sedan med andelen manuella processer (0,5×–1,5×) och
                  komplexitetsfaktor (0,6 / 1,0 / 1,3). Integrationer ger dessutom 50 000 kr/år vardera. Estimaten är baserade på
                  Microsofts Business Value Assessment (oktober 2025) och svenska partnerbenchmarks.
                </Assumption>
                <Assumption title="Payback &amp; TCO">
                  Payback = implementation / (årlig nettonytta inkl. ersatt IT-kostnad). 5-årig TCO = implementation + 5 × (licens + förvaltning).
                  5-årig ROI = (5 × årlig nytta + 5 × ersatt IT-kostnad − TCO) / implementation.
                </Assumption>
                <Assumption title="Vad ingår inte">
                  Förändringsledning, datakvalitet, intern tidsåtgång, integrationsplattform (iPaaS), ISV-licenser och hårdvara hanteras separat.
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
              Validera kalkylen i en kort dialog med två–tre relevanta partners. Eller fördjupa underlaget genom matchningstestet och en kravspecifikation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                <Link to="/businesscentral/matchningstest/">Starta matchningstest</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/kravspecifikation/">Generera en kravspecifikation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/businesscentral/#partners">Hitta Business Central-partners</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SuggestedPartnersCTA product="bc" industry={v.industry} />
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
