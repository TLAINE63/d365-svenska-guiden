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
import { EMPTY_BUSINESS_VALUE, evaluateBusinessValue, realizedBenefit, type BusinessValueInput } from "@/lib/businessValue";
import { REALIZATION } from "@/lib/bcInvestmentCase";

const fmt = (n: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

const PRODUCTS = {
  "business-central": { name: "Business\u00A0Central", roi: "/businesscentral/roi-kalkylator/" },
  "finance-scm": { name: "Finance & Supply Chain", roi: "/finance-supply-chain/roi-kalkylator/" },
  sales: { name: "Sales (CRM)", roi: "/d365sales/roi-kalkylator/" },
  "customer-service": { name: "Customer Service (CRM)", roi: "/d365customerservice/roi-kalkylator/" },
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
  const ramp = REALIZATION[model].custom;
  const r = useMemo(() => evaluateBusinessValue(bva), [bva]);
  const five = realizedBenefit(r.total - r.itFees, 5, ramp) + 5 * r.itFees;

  const pdf = async () => {
    setBusy(true);
    try {
      const { generateBusinessValuePdf } = await import("@/utils/generateBusinessValuePdf");
      await generateBusinessValuePdf({ productName: PRODUCTS[product].name, industry, companyName: company || undefined, input: bva, ramp, fiveYear: five });
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Verksamhetsvärdering: vad kostar nuvarande arbetssätt? | d365.se" description="Räkna fram nyttan av ett nytt CRM- eller affärssystem (ERP) utifrån manuellt arbete, förlorade affärer och kostnader som ersätts. Försiktigt räknat, med PDF." canonical="https://d365.se/verksamhetsvardering/" />
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
          <div className="space-y-2"><Label>Bransch</Label><CalculatorIndustryPicker value={industry} onChange={setIndustry} /></div>
          <div className="space-y-2 max-w-sm"><Label htmlFor="bv-company">Företagsnamn (valfritt, visas i PDF:en)</Label><Input id="bv-company" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
        </CardContent></Card>

        <BusinessValueAssessment value={bva} onChange={setBva} productName={PRODUCTS[product].name} productKey={product} industry={model} />

        <section aria-labelledby="bv-sum" className="mt-10 max-w-6xl mx-auto">
          <Card><CardContent className="p-5 grid gap-4 sm:grid-cols-3">
            <div><p className="text-sm text-muted-foreground">Nytta per år, full effekt</p><p id="bv-sum" className="text-2xl font-bold">{fmt(r.total)}</p></div>
            <div><p className="text-sm text-muted-foreground">Frigjord tid per år</p><p className="text-2xl font-bold">{Math.round(r.hoursFreed)} timmar</p></div>
            <div><p className="text-sm text-muted-foreground">Nytta över 5 år ({Math.round(ramp[0] * 100)} % år 1, {Math.round(ramp[1] * 100)} % år 2)</p><p className="text-2xl font-bold">{fmt(five)}</p></div>
          </CardContent></Card>
          <div className="flex flex-wrap gap-3 mt-5">
            <Button onClick={pdf} disabled={busy}><FileDown className="w-4 h-4 mr-2" />{busy ? "Skapar PDF…" : "Ladda ner som PDF"}</Button>
            <Button variant="outline" asChild><Link to={PRODUCTS[product].roi}>Räkna vidare med kostnader och ROI</Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
