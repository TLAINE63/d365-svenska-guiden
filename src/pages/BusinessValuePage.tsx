import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import CalculatorIndustryPicker from "@/components/CalculatorIndustryPicker";
import BusinessValueAssessment from "@/components/roi/BusinessValueAssessment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { bcIndustryModel } from "@/lib/calculatorDefaults";
import { EMPTY_BUSINESS_VALUE, evaluateBusinessValue, cashFlow, topPotential, AREAS_TO_EVALUATE, type BusinessValueInput } from "@/lib/businessValue";
import { REALIZATION } from "@/lib/bcInvestmentCase";

const fmt = (n: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

const PRODUCTS = {
  "business-central": { name: "Business\u00A0Central", roi: "/businesscentral/roi-kalkylator/" },
  "finance-scm": { name: "Finance & Supply Chain", roi: "/finance-supply-chain/roi-kalkylator/" },
  sales: { name: "Sales (CRM)", roi: "/d365sales/roi-kalkylator/" },
  "customer-service": { name: "Customer Service", roi: "/d365customerservice/roi-kalkylator/" },
  "contact-center": { name: "Contact Center", roi: "/d365contactcenter/roi-kalkylator/" },
  "field-service": { name: "Field Service", roi: "/d365fieldservice/roi-kalkylator/" },
  "project-operations": { name: "Project Operations", roi: "" },
  commerce: { name: "Commerce", roi: "" },
} as const;
type ProductKey = keyof typeof PRODUCTS;

const breadcrumbs = [
  { name: "Start", url: "/" },
  { name: "Guider", url: "/guider/" },
  { name: "Verksamhetsvärdering", url: "/verksamhetsvardering/" },
];

export default function BusinessValuePage() {
  const [product, setProduct] = useState<ProductKey>("business-central");
  const [industry, setIndustry] = useState("");
  const [company, setCompany] = useState("");
  const [bva, setBva] = useState<BusinessValueInput>(EMPTY_BUSINESS_VALUE);
  const [busy, setBusy] = useState(false);
  const model = bcIndustryModel(industry);
  const [ramp, setRamp] = useState<number[] | null>(null);
  const [implementation, setImplementation] = useState(0);
  const [license, setLicense] = useState(0);
  const [supportPct, setSupportPct] = useState(15);
  const rz = REALIZATION[model].custom;
  const yearsRamp = ramp ?? [rz[0], rz[1], 1, 1, 1];
  const r = useMemo(() => evaluateBusinessValue(bva), [bva]);
  const cf = useMemo(() => cashFlow({ benefit: r.total - r.itFees, replaced: r.itFees, ramp: yearsRamp, implementation, licenseYearly: license, supportPct }), [r, yearsRamp, implementation, license, supportPct]);
  const five = cf.rows.reduce((s, x) => s + x.benefit, 0);
  const top = topPotential(bva);
  const num = (s: string) => { const n = Number(s.replace(/\s/g, "").replace(",", ".")); return Number.isFinite(n) && n >= 0 ? n : 0; };

  const pdf = async () => {
    setBusy(true);
    try {
      const { generateBusinessValuePdf } = await import("@/utils/generateBusinessValuePdf");
      await generateBusinessValuePdf({ productName: PRODUCTS[product].name, industry, companyName: company || undefined, input: bva, ramp: yearsRamp, fiveYear: five, cash: cf, top });
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Verksamhetsvärdering: vad kostar nuvarande arbetssätt? | d365.se" description="Räkna fram nyttan av ett nytt CRM- eller affärssystem (ERP) utifrån manuellt arbete, förlorade affärer och kostnader som ersätts. Försiktigt räknat, med PDF." canonicalPath="/verksamhetsvardering/" />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <GuideBreadcrumb items={breadcrumbs} className="mb-5" />
        <header className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Vad kostar ert nuvarande arbetssätt?</h1>
          <p className="text-muted-foreground">Räkna fram vilken nytta ett CRM- eller affärssystem (ERP) från Microsoft kan ge, utifrån er egen verksamhet. Fyll i tid i manuella moment, förlorade affärer och kostnader som försvinner. Beräkningen är medvetet försiktig och kan sparas som PDF.</p>
        </header>

        <Card className="max-w-6xl mx-auto"><CardContent className="p-5 space-y-5">
          <div className="space-y-2">
            <Label>Vilket system utvärderar ni?</Label>
            <ToggleGroup type="single" value={product} onValueChange={(p) => p && setProduct(p as ProductKey)} className="flex flex-wrap justify-start">
              {(Object.keys(PRODUCTS) as ProductKey[]).map((k) => <ToggleGroupItem key={k} value={k} variant="outline">{PRODUCTS[k].name}</ToggleGroupItem>)}
            </ToggleGroup>
          </div>
          <div className="space-y-2"><Label>Bransch</Label><CalculatorIndustryPicker value={industry} onChange={(i) => { setIndustry(i); setRamp(null); }} /></div>
          <div className="space-y-2 max-w-sm"><Label htmlFor="bv-company">Företagsnamn (valfritt, visas i PDF:en)</Label><Input id="bv-company" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
        </CardContent></Card>

        <BusinessValueAssessment value={bva} onChange={setBva} productName={PRODUCTS[product].name} productKey={product} industry={model} />

        <section aria-labelledby="bv-cost" className="mt-10 max-w-6xl mx-auto">
          <h2 id="bv-cost" className="text-2xl font-bold mb-2">Realiseringstakt och kostnader</h2>
          <p className="text-muted-foreground mb-4 max-w-3xl">Organisationen behöver tid att lära sig det nya systemet. Branschen ger startvärden som du kan ändra. Fyll i kostnaderna för att se kassaflöde, nuvärde och internränta.</p>
          <Card><CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-5 gap-2 max-w-xl">
              {yearsRamp.map((f, i) => (
                <div key={i} className="space-y-1 min-w-0"><Label htmlFor={`rz${i}`} className="text-xs">År {i + 1} (%)</Label>
                  <Input id={`rz${i}`} inputMode="numeric" value={Math.round(f * 100)} onChange={(e) => { const n = Math.min(100, num(e.target.value)) / 100; setRamp(yearsRamp.map((x, j) => (j === i ? n : x))); }} /></div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3 max-w-3xl">
              <div className="space-y-1"><Label htmlFor="bv-impl">Införande (engångs), kr</Label><Input id="bv-impl" inputMode="numeric" value={implementation || ""} onChange={(e) => setImplementation(num(e.target.value))} /></div>
              <div className="space-y-1"><Label htmlFor="bv-lic">Licenser per år, kr</Label><Input id="bv-lic" inputMode="numeric" value={license || ""} onChange={(e) => setLicense(num(e.target.value))} /></div>
              <div className="space-y-1"><Label htmlFor="bv-sup">Förvaltning från år 2, % av införandet</Label><Input id="bv-sup" inputMode="numeric" value={supportPct} onChange={(e) => setSupportPct(Math.min(50, num(e.target.value)))} /></div>
            </div>
          </CardContent></Card>
        </section>

        <section aria-labelledby="bv-cf" className="mt-10 max-w-6xl mx-auto">
          <h2 id="bv-cf" className="text-2xl font-bold mb-4">Kassaflöde år för år</h2>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60"><tr>{["År", "Nytta", "Projekt och förvaltning", "Licenser", "Netto", "Ackumulerat"].map((h) => <th key={h} className="text-left font-semibold p-2 whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>{cf.rows.map((x) => (
                <tr key={x.year} className="border-t border-border"><td className="p-2">{x.year}</td><td className="p-2 whitespace-nowrap">{fmt(x.benefit)}</td><td className="p-2 whitespace-nowrap">{fmt(x.project)}</td><td className="p-2 whitespace-nowrap">{fmt(x.running)}</td><td className="p-2 whitespace-nowrap">{fmt(x.net)}</td><td className="p-2 whitespace-nowrap">{fmt(x.cumulative)}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <dl className="grid gap-4 sm:grid-cols-4 mt-4">
            <div><dt className="text-sm text-muted-foreground">Nuvärde (NPV, 5 %)</dt><dd className="text-xl font-bold">{fmt(cf.npv)}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Internränta (IRR)</dt><dd className="text-xl font-bold">{cf.irr === null ? "–" : `${Math.round(cf.irr * 100)} %`}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Återbetalning</dt><dd className="text-xl font-bold">{cf.paybackMonths === null ? "Inte inom 5 år" : `${Math.max(1, Math.round(cf.paybackMonths))} mån`}</dd></div>
            <div><dt className="text-sm text-muted-foreground">ROI på 5 år</dt><dd className="text-xl font-bold">{cf.roiPct === null ? "–" : `${Math.round(cf.roiPct)} %`}</dd></div>
          </dl>
          {implementation === 0 && license === 0 && <p className="text-sm text-muted-foreground mt-2">Fyll i införande och licenser för att se IRR och återbetalning.</p>}
        </section>

        {top.length > 0 && (
          <section aria-labelledby="bv-top" className="mt-10 max-w-6xl mx-auto">
            <h2 id="bv-top" className="text-2xl font-bold mb-2">Största affärspotential</h2>
            <p className="text-muted-foreground mb-4">Var värdet finns i er verksamhet, full nytta per år, och vad ni bör utvärdera särskilt.</p>
            <ol className="space-y-2">{top.map((t, i) => (
              <li key={t.id} className="flex flex-wrap justify-between gap-2 border-b border-border pb-2"><span><span className="font-semibold">{i + 1}. {t.label}</span>{AREAS_TO_EVALUATE[t.id] && <span className="text-muted-foreground"> · utvärdera: {AREAS_TO_EVALUATE[t.id]}</span>}</span><span className="font-medium whitespace-nowrap">{fmt(t.value)}/år</span></li>
            ))}</ol>
            <p className="text-xs text-muted-foreground mt-2">Vår bedömning utifrån era siffror. Låt en partner kontrollera, vissa områden kan kräva tilläggslösningar.</p>
          </section>
        )}

        <section aria-labelledby="bv-sum" className="mt-10 max-w-6xl mx-auto">
          <Card><CardContent className="p-5 grid gap-4 sm:grid-cols-3">
            <div><p className="text-sm text-muted-foreground">Nytta per år, full effekt</p><p id="bv-sum" className="text-2xl font-bold">{fmt(r.total)}</p></div>
            <div><p className="text-sm text-muted-foreground">Frigjord tid per år</p><p className="text-2xl font-bold">{Math.round(r.hoursFreed)} timmar</p></div>
            <div><p className="text-sm text-muted-foreground">Nytta över 5 år med realiseringstakt</p><p className="text-2xl font-bold">{fmt(five)}</p></div>
          </CardContent></Card>
          <div className="flex flex-wrap gap-3 mt-5">
            <Button onClick={pdf} disabled={busy}><FileDown className="w-4 h-4 mr-2" />{busy ? "Skapar PDF…" : "Ladda ner som PDF"}</Button>
            {PRODUCTS[product].roi && <Button variant="outline" asChild><Link to={PRODUCTS[product].roi}>Räkna vidare med kostnader och ROI</Link></Button>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
