import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  BUDGET_KEY, DEFAULT_BUDGET, type Budget, type PartnerForecast, type Forecast,
  forecastRevenue, totals, currentProducts,
} from "@/lib/budget2027";

interface P { id: string; name: string; is_featured?: boolean | null; agreement_signed?: boolean | null; product_filters?: any; billing_interval?: string | null; discount_percent?: number | null; has_finders_fee?: boolean | null }

const fmt = (n: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n));
const FORECAST_LABEL: Record<Forecast, string> = { none: "Ingen", basic: "Grundprofil", month: "Premium månad", year: "Premium år" };
const num = (v: string) => Math.max(0, Number(v) || 0);

export default function RedaktionBudgetTab({ token, partners }: { token: string | null; partners: P[] }) {
  const [budget, setBudget] = useState<Budget>(DEFAULT_BUDGET);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState("all");
  const [fForecast, setFForecast] = useState("all");
  const [fProduct, setFProduct] = useState("all");
  const [fFinders, setFFinders] = useState("all");

  const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations`;
  const headers = { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY };

  useEffect(() => {
    if (!token) return;
    fetch(`${base}?action=get-email-template&template_key=${BUDGET_KEY}`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d?.template) {
          try { const p = JSON.parse(d.template); setBudget({ ...DEFAULT_BUDGET, ...p, costs: p.costs?.length ? p.costs : DEFAULT_BUDGET.costs }); } catch { /* default */ }
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch(`${base}?action=update-email-template`, {
        method: "POST", headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ template: JSON.stringify(budget), template_key: BUDGET_KEY }),
      });
      if (!r.ok) throw new Error();
      toast.success("Budgeten sparad");
    } catch { toast.error("Kunde inte spara budgeten"); } finally { setSaving(false); }
  };

  const rowFor = (p: P): PartnerForecast => budget.partners[p.id] ?? {
    forecast: p.agreement_signed ? (p.billing_interval === "year" ? "year" : "month") : p.is_featured ? "month" : "basic",
    products: Math.max(1, currentProducts(p.product_filters)),
    discount: Number(p.discount_percent) || 0,
    meetingsStd: 0, dealsStd: 0, meetingsFscm: 0, dealsFscm: 0, successBasis: 0,
  };
  const setRow = (id: string, patch: Partial<PartnerForecast>, p: P) =>
    setBudget((b) => ({ ...b, partners: { ...b.partners, [id]: { ...rowFor(p), ...patch } } }));

  const status = (p: P) => (p.agreement_signed ? "premium" : p.is_featured ? "published" : "basic");
  const filtered = useMemo(() => partners.filter((p) => {
    const r = rowFor(p);
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (fStatus !== "all" && status(p) !== fStatus) return false;
    if (fForecast !== "all" && r.forecast !== fForecast) return false;
    if (fProduct !== "all" && !(p.product_filters?.[fProduct]?.industries?.length > 0)) return false;
    const ff = r.meetingsStd + r.dealsStd + r.meetingsFscm + r.dealsFscm + r.successBasis > 0;
    if (fFinders === "yes" && !ff) return false;
    if (fFinders === "agreement" && !p.has_finders_fee) return false;
    return true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [partners, budget, q, fStatus, fForecast, fProduct, fFinders]);

  const all = partners.map(rowFor);
  const t = totals(all, budget);
  const ft = totals(filtered.map(rowFor), budget);

  if (loading) return <p className="text-sm text-muted-foreground">Laddar budget…</p>;
  const sel = "h-9 rounded-md border bg-background px-2 text-sm";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Budget 2027</h2>
          <p className="text-sm text-muted-foreground">Intern prognos per partner. Påverkar aldrig profiler, listor eller ordning. Alla belopp exkl. moms.</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara budget"}</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          ["Årsprenumerationer", t.yearCount],
          ["Månadsprenumerationer", t.monthCount],
          ["Produkter totalt", t.products],
          ["Prenumerationsintäkt", `${fmt(t.subscription)} kr`],
          ["Finders fee + success fee", `${fmt(t.finders)} kr`],
          ["Total intäkt", `${fmt(t.revenue)} kr`],
        ].map(([l, v]) => (
          <Card key={l as string}><CardContent className="pt-4"><p className="text-xs text-muted-foreground">{l}</p><p className="text-lg font-semibold">{v}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Intäktsbudget per partner</CardTitle>
          <CardDescription>Välj vad du tror för varje partner, oavsett om de idag är Premium eller grundprofil. Finders fee: möten × mötesavgift + avtal × (avtalsersättning − mötesavgift), success fee 2,5 % av underlaget.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Sök partner" value={q} onChange={(e) => setQ(e.target.value)} className="w-48" />
            <select className={sel} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
              <option value="all">Alla idag</option><option value="premium">Premium (avtal)</option><option value="published">Publicerad utan avtal</option><option value="basic">Grundprofil</option>
            </select>
            <select className={sel} value={fForecast} onChange={(e) => setFForecast(e.target.value)}>
              <option value="all">Alla prognoser</option>{Object.entries(FORECAST_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select className={sel} value={fProduct} onChange={(e) => setFProduct(e.target.value)}>
              <option value="all">Alla produkter</option><option value="bc">Business Central</option><option value="fsc">Finance &amp; SCM</option><option value="sales">Sales</option><option value="service">Customer Service</option>
            </select>
            <select className={sel} value={fFinders} onChange={(e) => setFFinders(e.target.value)}>
              <option value="all">Finders fee: alla</option><option value="yes">Med finders fee-budget</option><option value="agreement">Har finders fee-avtal</option>
            </select>
            <span className="text-xs text-muted-foreground self-center">{filtered.length} partners · {fmt(ft.revenue)} kr i urvalet</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground text-left">
                <tr><th className="py-2 pr-2">Partner</th><th>Idag</th><th>Prognos 2027</th><th>Produkter</th><th>Rabatt %</th><th>Möten BC/CE</th><th>Avtal BC/CE</th><th>Möten F&amp;SCM</th><th>Avtal F&amp;SCM</th><th>Success-underlag kr</th><th className="text-right">Intäkt</th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const r = rowFor(p); const rev = forecastRevenue(r, budget);
                  const n = (k: keyof PartnerForecast) => (
                    <td className="pr-1"><Input type="number" min={0} className="h-8 w-20" value={r[k] as number} onChange={(e) => setRow(p.id, { [k]: num(e.target.value) } as any, p)} /></td>
                  );
                  return (
                    <tr key={p.id} className="border-t">
                      <td className="py-1 pr-2 font-medium">{p.name}</td>
                      <td className="text-xs">{status(p) === "premium" ? "Premium" : status(p) === "published" ? "Publicerad" : "Grund"}{p.has_finders_fee ? " · FF" : ""}</td>
                      <td className="pr-1"><select className={sel} value={r.forecast} onChange={(e) => setRow(p.id, { forecast: e.target.value as Forecast }, p)}>{Object.entries(FORECAST_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></td>
                      <td className="pr-1"><select className={sel} value={r.products} onChange={(e) => setRow(p.id, { products: Number(e.target.value) }, p)}>{[1, 2, 3].map((x) => <option key={x}>{x}</option>)}</select></td>
                      <td className="pr-1"><Input type="number" min={0} max={100} className="h-8 w-16" value={r.discount} onChange={(e) => setRow(p.id, { discount: Math.min(100, num(e.target.value)) }, p)} /></td>
                      {n("meetingsStd")}{n("dealsStd")}{n("meetingsFscm")}{n("dealsFscm")}
                      <td className="pr-1"><Input type="number" min={0} className="h-8 w-28" value={r.successBasis} onChange={(e) => setRow(p.id, { successBasis: num(e.target.value) }, p)} /></td>
                      <td className="text-right whitespace-nowrap">{fmt(rev.total)} kr</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kostnadsbudget 2027</CardTitle>
          <CardDescription>Årsbelopp per kostnadskategori. Namnen på de tre sista raderna går att ändra.</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground text-left"><tr><th className="py-2">Kategori</th><th>Årsbudget kr</th><th className="text-right">Per månad</th></tr></thead>
            <tbody>
              {budget.costs.map((c, i) => (
                <tr key={i} className="border-t">
                  <td className="py-1 pr-2">{c.custom ? <Input className="h-8" value={c.name} placeholder={`Egen kategori ${i - 4}`} onChange={(e) => setBudget((b) => ({ ...b, costs: b.costs.map((x, j) => j === i ? { ...x, name: e.target.value } : x) }))} /> : c.name}</td>
                  <td className="pr-2"><Input type="number" min={0} className="h-8 w-40" value={c.amount} onChange={(e) => setBudget((b) => ({ ...b, costs: b.costs.map((x, j) => j === i ? { ...x, amount: num(e.target.value) } : x) }))} /></td>
                  <td className="text-right">{fmt(c.amount / 12)} kr</td>
                </tr>
              ))}
              <tr className="border-t font-medium"><td className="py-2">Summa externa kostnader</td><td>{fmt(t.externalCosts)} kr</td><td className="text-right">{fmt(t.externalCosts / 12)} kr</td></tr>
              <tr className="border-t">
                <td className="py-2">Egen tid</td>
                <td colSpan={2}>
                  <div className="flex flex-wrap items-end gap-3">
                    <div><Label className="text-xs">Timmar per år</Label><Input type="number" min={0} className="h-8 w-28" value={budget.ownHours} onChange={(e) => setBudget((b) => ({ ...b, ownHours: num(e.target.value) }))} /></div>
                    <div><Label className="text-xs">Internkostnad kr/tim</Label><Input type="number" min={0} className="h-8 w-28" value={budget.hourlyRate} onChange={(e) => setBudget((b) => ({ ...b, hourlyRate: num(e.target.value) }))} /></div>
                    <span className="text-sm">= {fmt(t.ownTimeCost)} kr</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 rounded-md border p-4 space-y-1 text-sm">
            <div className="flex justify-between"><span>Intäkter</span><span>{fmt(t.revenue)} kr</span></div>
            <div className="flex justify-between"><span>Externa kostnader</span><span>−{fmt(t.externalCosts)} kr</span></div>
            <div className="flex justify-between font-medium"><span>Resultat före egen tid</span><span>{fmt(t.revenue - t.externalCosts)} kr</span></div>
            <div className="flex justify-between"><span>Egen tid (internkostnad)</span><span>−{fmt(t.ownTimeCost)} kr</span></div>
            <div className="flex justify-between text-base font-semibold border-t pt-2"><span>Resultat</span><span>{fmt(t.result)} kr</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
