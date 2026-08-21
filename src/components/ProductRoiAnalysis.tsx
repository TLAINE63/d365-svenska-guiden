import { useMemo, useState } from "react";
import {
  Calculator,
  Info,
  TrendingUp,
  Clock,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePriceMap } from "@/hooks/usePriceMap";
import RoiPdfDownload from "@/components/RoiPdfDownload";
import type { RoiPdfData } from "@/utils/generateRoiPdf";
import {
  PRODUCT_ROI_CONFIGS,
  defaultEnabledDrivers,
  type ProductRoiKey,
} from "@/data/productRoiConfigs";

type Complexity = "Låg" | "Medel" | "Hög";

interface Props {
  productKey: ProductRoiKey;
  /** Anchor-id, default "roi-tco". */
  id?: string;
  className?: string;
}

const fmtSek = (n: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(
    Math.round(n)
  ) + " kr";

const fmtSekInput = (n: number) => new Intl.NumberFormat("sv-SE").format(n);
const parseNum = (s: string): number => {
  const cleaned = s.replace(/\s/g, "").replace(/[^\d-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

export default function ProductRoiAnalysis({
  productKey,
  id = "roi-tco",
  className = "",
}: Props) {
  const cfg = PRODUCT_ROI_CONFIGS[productKey];
  const priceMap = usePriceMap();

  const [companyName, setCompanyName] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(cfg.licenseLines.map((l) => [l.skuKey, l.defaultCount]))
  );
  const [revenue, setRevenue] = useState(cfg.defaultRevenue);
  const [complexity, setComplexity] = useState<Complexity>("Medel");
  const [manualPct, setManualPct] = useState(60);
  const [integrations, setIntegrations] = useState(cfg.defaultIntegrations);
  const [currentItCost, setCurrentItCost] = useState(cfg.defaultCurrentItCost);
  const [enabled, setEnabled] = useState<string[]>(() =>
    defaultEnabledDrivers(productKey)
  );

  const updateCount = (sku: string, val: number) =>
    setCounts((p) => ({ ...p, [sku]: Math.max(0, val || 0) }));

  // ----- Prices -----
  const licenseRows = cfg.licenseLines.map((l) => {
    const sku = priceMap.get(l.skuKey);
    const unitPrice = sku?.price_sek ?? l.fallbackPrice ?? null;
    const qty = counts[l.skuKey] ?? l.defaultCount;
    const monthly =
      unitPrice == null ? 0 : l.perTenant ? unitPrice * Math.max(1, qty) : unitPrice * qty;
    return {
      ...l,
      unitPrice,
      qty,
      monthly,
      missing: unitPrice == null,
    };
  });
  const licenseMonthly = licenseRows.reduce((s, r) => s + r.monthly, 0);
  const licenseYearly = licenseMonthly * 12;
  const totalUsers = licenseRows
    .filter((r) => !r.perTenant)
    .reduce((s, r) => s + r.qty, 0);

  // ----- Active drivers -----
  const activeDrivers = useMemo(
    () => cfg.drivers.filter((d) => enabled.includes(d.id)),
    [cfg, enabled]
  );

  // ----- Calc -----
  const calc = useMemo(() => {
    const complexityImplFactor: Record<Complexity, number> = {
      Låg: 0.6,
      Medel: 1,
      Hög: 1.5,
    };
    const usersFactor = 1 + Math.max(0, totalUsers - 25) * cfg.implUserScale;
    const driverImplCost = activeDrivers.reduce((s, d) => s + d.implCost, 0);
    const implementation =
      cfg.baseImplementation * complexityImplFactor[complexity] * usersFactor +
      integrations * 30_000 +
      driverImplCost;

    const supportYear1 = implementation * cfg.supportPctYear1;
    const supportYearly = implementation * cfg.supportPctYearly;

    const complexityFactor: Record<Complexity, number> = {
      Låg: 0.6,
      Medel: 1,
      Hög: 1.3,
    };
    const manualMultiplier = 0.5 + manualPct / 100;
    const userFactor = Math.min(
      3.5,
      Math.max(0.4, Math.pow(Math.max(1, totalUsers) / 25, 0.6))
    );
    const driverSavings = activeDrivers.reduce(
      (s, d) => s + d.savings({ revenue }) * userFactor,
      0
    );
    const integrationSavings = integrations * 50_000;
    const annualBenefit =
      (driverSavings * manualMultiplier + integrationSavings) *
      complexityFactor[complexity];

    const netAnnual =
      annualBenefit + currentItCost - licenseYearly - supportYearly;
    const paybackMonths = netAnnual > 0 ? (implementation / netAnnual) * 12 : null;

    const tco5 =
      implementation + 5 * licenseYearly + supportYear1 + 4 * supportYearly;
    const benefit5 = 5 * annualBenefit + 5 * currentItCost;
    const net5 = benefit5 - tco5;
    const roiPct = implementation > 0 ? (net5 / implementation) * 100 : 0;

    return {
      implementation,
      supportYear1,
      supportYearly,
      annualBenefit,
      netAnnual,
      paybackMonths,
      tco5,
      roiPct,
      userFactor,
    };
  }, [
    cfg,
    activeDrivers,
    complexity,
    integrations,
    manualPct,
    revenue,
    currentItCost,
    licenseYearly,
    totalUsers,
  ]);

  return (
    <section
      id={id}
      className={`py-12 sm:py-16 bg-gradient-to-br from-secondary/40 to-background border-y border-border ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <Badge variant="outline" className="mb-3">
            <Calculator className="w-3 h-3 mr-1" /> ROI &amp; TCO
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            ROI- &amp; TCO-analys för {cfg.productName}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Räkna fram licenskostnad, implementation, 5-årig totalkostnad, payback och årlig
            nytta utifrån dina nyckeltal. Kalkylen är medvetet förenklad – den ska ge
            storleksordning, inte ersätta en business case-analys.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* INPUT */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-5 sm:p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-company`}>
                    Företagsnamn{" "}
                    <span className="text-muted-foreground font-normal">(valfritt)</span>
                  </Label>
                  <Input
                    id={`${id}-company`}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ditt företag AB"
                  />
                </div>

                {/* Licenser */}
                <div className="space-y-3">
                  <Label>{cfg.licenseHeading}</Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {licenseRows.map((l) => (
                      <div key={l.skuKey} className="space-y-1">
                        <Label
                          htmlFor={`${id}-${l.skuKey}`}
                          className="text-xs font-normal text-muted-foreground"
                        >
                          {l.label}
                          {l.perTenant ? " (tenant)" : ""}
                        </Label>
                        <Input
                          id={`${id}-${l.skuKey}`}
                          type="number"
                          min={0}
                          value={l.qty}
                          onChange={(e) =>
                            updateCount(l.skuKey, Number(e.target.value))
                          }
                        />
                        <p className="text-[11px] text-muted-foreground">
                          {l.unitPrice == null
                            ? "Pris saknas – ange via kontakt"
                            : `${fmtSek(l.unitPrice)} ${l.perTenant ? "/tenant/mån" : "/användare/mån"}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Omsättning */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-rev`}>Omsättning per år</Label>
                  <Input
                    id={`${id}-rev`}
                    inputMode="numeric"
                    value={fmtSekInput(revenue)}
                    onChange={(e) => setRevenue(parseNum(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">{fmtSek(revenue)}</p>
                </div>

                {/* Komplexitet */}
                <div className="space-y-2">
                  <Label>Affärskomplexitet</Label>
                  <ToggleGroup
                    type="single"
                    value={complexity}
                    onValueChange={(val) => val && setComplexity(val as Complexity)}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="Låg">Låg</ToggleGroupItem>
                    <ToggleGroupItem value="Medel">Medel</ToggleGroupItem>
                    <ToggleGroupItem value="Hög">Hög</ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Manuella processer */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <Label>Andel manuella processer i dag</Label>
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      {manualPct}%
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[manualPct]}
                    onValueChange={([v]) => setManualPct(v)}
                  />
                </div>

                {/* Drivare */}
                <div className="space-y-3">
                  <div>
                    <Label>Effektiviseringsdrivare</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bocka i de områden där du ser potential. Värdena är konservativa
                      och skalas med antal användare ({totalUsers} st →{" "}
                      {calc.userFactor.toFixed(2)}×).
                    </p>
                  </div>
                  <div className="space-y-2">
                    {cfg.drivers.map((d) => {
                      const checked = enabled.includes(d.id);
                      const annual = d.savings({ revenue }) * calc.userFactor;
                      return (
                        <div
                          key={d.id}
                          className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${
                            checked
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-secondary/40"
                          }`}
                        >
                          <Checkbox
                            id={`${id}-drv-${d.id}`}
                            checked={checked}
                            onCheckedChange={(b) =>
                              setEnabled((prev) =>
                                b
                                  ? [...prev, d.id]
                                  : prev.filter((x) => x !== d.id)
                              )
                            }
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={`${id}-drv-${d.id}`}
                              className="cursor-pointer block"
                            >
                              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                                <span className="text-sm font-medium text-foreground">
                                  {d.label}
                                </span>
                                <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                                  ~{fmtSek(annual)}/år
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {d.hint}
                              </p>
                            </label>
                            <details className="mt-2 group">
                              <summary className="text-xs text-primary cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="group-open:hidden">Visa förklaring ▾</span>
                                <span className="hidden group-open:inline">
                                  Dölj förklaring ▴
                                </span>
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

                {/* Integrationer / nuvarande IT */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-int`}>Antal integrationer</Label>
                    <Input
                      id={`${id}-int`}
                      type="number"
                      min={0}
                      value={integrations}
                      onChange={(e) =>
                        setIntegrations(Math.max(0, Number(e.target.value) || 0))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-cur`}>Nuvarande IT-kostnad/år</Label>
                    <Input
                      id={`${id}-cur`}
                      inputMode="numeric"
                      value={fmtSekInput(currentItCost)}
                      onChange={(e) => setCurrentItCost(parseNum(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">{fmtSek(currentItCost)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RESULT */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Resultat{companyName ? ` – ${companyName}` : ""}
              </h3>

              <Card className="bg-[hsl(var(--hero-dark,222_47%_11%))] text-primary-foreground border-0">
                <CardContent className="p-5 pr-20 sm:pr-6 sm:p-6 space-y-4">
                  <Kpi
                    icon={<TrendingUp className="w-4 h-4" />}
                    label="5-årig ROI"
                    value={`${Math.round(calc.roiPct)}%`}
                    tone={calc.roiPct >= 0 ? "good" : "warn"}
                  />
                  <Kpi
                    icon={<Clock className="w-4 h-4" />}
                    label="Payback"
                    value={
                      calc.paybackMonths == null
                        ? "—"
                        : `${Math.round(calc.paybackMonths)} mån`
                    }
                    sub={
                      calc.paybackMonths == null
                        ? "Nytta täcker inte löpande kostnad"
                        : undefined
                    }
                  />
                  <Kpi
                    icon={<Wallet className="w-4 h-4" />}
                    label="5-årig TCO"
                    value={fmtSek(calc.tco5)}
                  />
                  <Kpi
                    icon={<PiggyBank className="w-4 h-4" />}
                    label="Årlig nytta"
                    value={fmtSek(calc.annualBenefit)}
                    tone={calc.annualBenefit > 0 ? "good" : undefined}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 text-sm space-y-2">
                  {licenseRows.map((r) => (
                    <Row
                      key={r.skuKey}
                      label={r.label}
                      value={fmtSek(r.monthly)}
                      sub="/mån"
                    />
                  ))}
                  <div className="border-t border-border my-2" />
                  <Row label="Licens totalt" value={fmtSek(licenseMonthly)} sub="/mån" strong />
                  <Row label="Licens helår" value={fmtSek(licenseYearly)} />
                  <div className="border-t border-border my-2" />
                  <Row label="Implementation (engångs)" value={fmtSek(calc.implementation)} />
                  <Row label="Förvaltning från år 2" value={fmtSek(calc.supportYearly)} sub="/år" />
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground flex gap-2">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Indikativ kalkyl – verkligt utfall beror på avtal, omfattning och förändringsledning.
              </p>
            </div>
          </div>
        </div>

        {/* PDF */}
        <div className="mt-10 max-w-3xl mx-auto">
          <RoiPdfDownload
            sourceKey={`${cfg.fileSlug}-roi`}
            productLabel={cfg.productName}
            buildPdfData={(email): RoiPdfData => ({
              productName: cfg.productName,
              pageUrl: `d365.se#${id}`,
              companyName: companyName || undefined,
              recipientEmail: email,
              fileName: `${cfg.fileSlug}-roi-tco-${
                companyName
                  ? companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-"
                  : ""
              }${new Date().toISOString().slice(0, 10)}.pdf`,
              kpis: [
                { label: "5-årig ROI", value: `${Math.round(calc.roiPct)}%` },
                {
                  label: "Payback",
                  value:
                    calc.paybackMonths == null
                      ? "—"
                      : `${Math.round(calc.paybackMonths)} mån`,
                  sub:
                    calc.paybackMonths == null
                      ? "Nytta täcker inte löpande kostnad"
                      : undefined,
                },
                { label: "5-årig TCO", value: fmtSek(calc.tco5) },
                { label: "Årlig nytta", value: fmtSek(calc.annualBenefit) },
              ],
              inputs: [
                ...licenseRows.map((r) => ({
                  label: r.label,
                  value: `${r.qty} ${r.perTenant ? "tenant" : "st"}`,
                })),
                { label: "Omsättning per år", value: fmtSek(revenue) },
                { label: "Affärskomplexitet", value: complexity },
                { label: "Andel manuella processer", value: `${manualPct}%` },
                { label: "Antal integrationer", value: String(integrations) },
                { label: "Nuvarande IT-kostnad/år", value: fmtSek(currentItCost) },
              ],
              costRows: [
                ...licenseRows.map((r) => ({
                  label: r.label,
                  value: fmtSek(r.monthly),
                  sub: "/mån",
                })),
                { divider: true, label: "", value: "" },
                {
                  label: "Licens totalt",
                  value: fmtSek(licenseMonthly),
                  sub: "/mån",
                  strong: true,
                },
                { label: "Licens helår", value: fmtSek(licenseYearly) },
                { divider: true, label: "", value: "" },
                { label: "Implementation (engångs)", value: fmtSek(calc.implementation) },
                {
                  label: "Förvaltning från år 2",
                  value: fmtSek(calc.supportYearly),
                  sub: "/år",
                },
                {
                  label: "Estimerad årlig nytta",
                  value: fmtSek(calc.annualBenefit),
                  strong: true,
                },
              ],
              drivers: activeDrivers.map((d) => ({
                label: d.label,
                annual: d.savings({ revenue }) * calc.userFactor,
                hint: d.hint,
                detail: d.detail,
              })),
              assumptions: [
                {
                  title: "Licens",
                  body: `Priser hämtas från d365.se centrala prisregister (Microsofts listpriser, SEK/mån exkl. moms). Faktiskt pris beror på avtalsform (EA, CSP), volym och förhandling.`,
                },
                {
                  title: "Implementation",
                  body: `Bas: ${fmtSek(cfg.baseImplementation)} (Medel). Skalas med komplexitet (Låg 0,6× / Medel 1,0× / Hög 1,5×), användarvolym (+${(
                    cfg.implUserScale * 100
                  ).toFixed(1)} % per användare över 25), + 30 000 kr per integration och en engångskostnad per vald drivare.`,
                },
                {
                  title: "Förvaltning",
                  body: `År 1 ≈ ${(cfg.supportPctYear1 * 100).toFixed(
                    0
                  )} % av implementation (projektet pågår). Från år 2 ≈ ${(
                    cfg.supportPctYearly * 100
                  ).toFixed(0)} % per år.`,
                },
                {
                  title: "Årlig nytta",
                  body: "Nyttan summeras från valda drivare. Varje drivare har en grundnivå som skalas med antal användare (baseline 25 = 1,0×, sublinjärt). Summan justeras med andelen manuella processer (0,5×–1,5×) och komplexitetsfaktor (0,6 / 1,0 / 1,3). Integrationer ger 50 000 kr/år vardera.",
                },
                {
                  title: "Payback & TCO",
                  body: "Payback = implementation / (årlig nytta + ersatt IT-kostnad − licens − förvaltning). 5-årig TCO = implementation + 5 × licens + förvaltning år 1 + 4 × förvaltning från år 2. 5-årig ROI = (5 × årlig nytta + 5 × ersatt IT-kostnad − TCO) / implementation.",
                },
                {
                  title: "Vad ingår inte",
                  body: "Förändringsledning, datakvalitet, intern tidsåtgång, integrationsplattform (iPaaS), ISV-licenser och hårdvara hanteras separat.",
                },
                {
                  title: "Disclaimer",
                  body: "Kalkylen är en förenklad uppskattning och bör användas som beslutsstöd – inte som en slutlig offert eller affärskalkyl. Validera alltid utfall med två–tre relevanta partners.",
                },
              ],
            })}
          />
        </div>

      </div>
    </section>
  );
}

// ---------- Small subcomponents ----------
function Kpi({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone?: "good" | "warn";
}) {
  const color =
    tone === "good"
      ? "text-emerald-300"
      : tone === "warn"
        ? "text-amber-300"
        : "text-white";
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 text-white/70 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-right">
        <div className={`text-2xl font-bold tabular-nums ${color}`}>{value}</div>
        {sub && <div className="text-[11px] text-white/60">{sub}</div>}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
  strong,
}: {
  label: string;
  value: string;
  sub?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={`text-sm ${strong ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${strong ? "font-bold text-foreground" : "text-foreground"}`}
      >
        {value}
        {sub && <span className="text-xs text-muted-foreground ml-1">{sub}</span>}
      </span>
    </div>
  );
}
