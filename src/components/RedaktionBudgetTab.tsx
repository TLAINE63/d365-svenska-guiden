import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  BUDGET_KEY, DEFAULT_BUDGET, type Budget, type PartnerForecast, type Forecast,
  forecastRevenue, totals, CATEGORIES, detailByCategory, estimateRevenue, currentProducts, mergeCosts, annual, isvRevenue, type IsvForecast, type Period,
} from "@/lib/budget2027";
import { BC_ISV_SOLUTIONS } from "@/data/bcIsvSolutions";

const ISV_VENDORS = (() => {
  const m = new Map<string, number>();
  for (const s of BC_ISV_SOLUTIONS as any[]) { const v = (s.vendor || s.name || "").trim(); if (v) m.set(v, (m.get(v) || 0) + 1); }
  return [...m.entries()].map(([name, apps]) => ({ name, apps })).sort((a, b) => a.name.localeCompare(b.name, "sv"));
})();

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
          try { const p = JSON.parse(d.template); setBudget({ ...DEFAULT_BUDGET, ...p, costs: mergeCosts(p.costs), otherRevenue: p.otherRevenue?.length ? p.otherRevenue : DEFAULT_BUDGET.otherRevenue, isvs: p.isvs ?? {} }); } catch { /* default */ }
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

  const [showPartners, setShowPartners] = useState(false);
  const [showIsv, setShowIsv] = useState(false);
  const [iq, setIq] = useState("");
  const [iFilter, setIFilter] = useState("all");
  const isvFor = (v: { name: string; apps: number }): IsvForecast => budget.isvs?.[v.name] ?? { presence: false, extraApps: Math.max(0, v.apps - 1), discount: 0, introsStd: 0, introsFscm: 0, successBasis: 0 };
  const setIsv = (v: { name: string; apps: number }, patch: Partial<IsvForecast>) =>
    setBudget((b) => ({ ...b, isvs: { ...(b.isvs ?? {}), [v.name]: { ...isvFor(v), ...patch } } }));
  const isvShown = ISV_VENDORS.filter((v) => {
    const r = isvFor(v);
    if (iq && !v.name.toLowerCase().includes(iq.toLowerCase())) return false;
    if (iFilter === "presence" && !r.presence) return false;
    if (iFilter === "none" && r.presence) return false;
    if (iFilter === "finders" && r.introsStd + r.introsFscm + r.successBasis === 0) return false;
    return true;
  });
  const isvShownTotal = isvShown.reduce((s, v) => s + isvRevenue(isvFor(v)).total, 0);
  const setLine = (key: "costs" | "otherRevenue", i: number, patch: any) =>
    setBudget((b) => ({ ...b, [key]: (b[key] ?? []).map((x: any, j: number) => (j === i ? { ...x, ...patch } : x)) }));
  const periodSel = (key: "costs" | "otherRevenue", i: number, v?: Period) => (
    <select className="h-8 rounded-md border bg-background px-2 text-sm" value={v ?? "year"} onChange={(e) => setLine(key, i, { period: e.target.value })}>
      <option value="year">per år</option><option value="month">per månad</option>
    </select>
  );

  const all = partners.map(rowFor);
  const t = totals(all, budget, ISV_VENDORS.map(isvFor));
  const ft = totals(filtered.map(rowFor), budget);
  const det = detailByCategory(all, ISV_VENDORS.map(isvFor));
  const detTotal = Object.values(det).reduce((x, d) => x + d.revenue, 0);

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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          ["Årsprenumerationer", t.yearCount],
          ["Månadsprenumerationer", t.monthCount],
          ["Produkter totalt", t.products],
          ["Prenumerationsintäkt", `${fmt(t.subscription)} kr`],
          ["Finders fee + success fee", `${fmt(t.finders)} kr`],
          ["ISV Presence", `${t.isvCount} st · ${fmt(t.isvSubscription)} kr`],
          ["ISV finders fee", `${fmt(t.isvFinders)} kr`],
          ["Övriga intäkter", `${fmt(t.other)} kr`],
          ["Total intäkt", `${fmt(t.revenue)} kr`],
          ["Intäkt per månad", `${fmt(t.revenue / 12)} kr`],
        ].map(([l, v]) => (
          <Card key={l as string}><CardContent className="pt-4"><p className="text-xs text-muted-foreground">{l}</p><p className="text-lg font-semibold">{v}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Grov budget per kategori</CardTitle>
          <CardDescription>Skriv in hur många du tror per kategori och jämför med summan av partner- och ISV-detaljerna. Detaljintäkten räknar med rabatter; success fee ingår inte i kategorierna.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground text-left">
              <tr><th className="py-2 pr-2">Kategori</th><th className="text-right">Pris/st</th><th>Uppskattning antal</th><th className="text-right">Uppskattad intäkt</th><th className="text-right">Detaljer antal</th><th className="text-right">Detaljer intäkt</th><th className="text-right">Skillnad intäkt</th></tr>
            </thead>
            <tbody>
              {CATEGORIES.map((c) => {
                const e = Number(budget.estimates?.[c.key]) || 0; const d = det[c.key];
                const diff = d.revenue - e * c.unit;
                return (
                  <tr key={c.key} className="border-t">
                    <td className="py-1 pr-2">{c.label}</td>
                    <td className="text-right whitespace-nowrap pr-2">{fmt(c.unit)} kr</td>
                    <td className="pr-1"><Input type="number" min={0} className="h-8 w-20" value={(e) || ""} placeholder="0" onChange={(ev) => setBudget((b) => ({ ...b, estimates: { ...(b.estimates ?? {}), [c.key]: num(ev.target.value) } }))} /></td>
                    <td className="text-right whitespace-nowrap">{fmt(e * c.unit)} kr</td>
                    <td className="text-right">{d.count}</td>
                    <td className="text-right whitespace-nowrap">{fmt(d.revenue)} kr</td>
                    <td className={`text-right whitespace-nowrap ${diff < 0 ? "text-destructive" : ""}`}>{diff > 0 ? "+" : ""}{fmt(diff)} kr</td>
                  </tr>
                );
              })}
              <tr className="border-t font-semibold">
                <td className="py-2">Summa</td><td /><td />
                <td className="text-right whitespace-nowrap">{fmt(estimateRevenue(budget.estimates))} kr</td><td />
                <td className="text-right whitespace-nowrap">{fmt(detTotal)} kr</td>
                <td className="text-right whitespace-nowrap">{fmt(detTotal - estimateRevenue(budget.estimates))} kr</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base">Intäktsbudget per partner</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowPartners((v) => !v)}>{showPartners ? "Dölj partnerdetaljer" : `Visa partnerdetaljer (${partners.length})`}</Button>
          </div>
          <CardDescription>Välj vad du tror för varje partner, oavsett om de idag är Premium eller grundprofil. Finders fee: möten × mötesavgift + avtal × (avtalsersättning − mötesavgift), success fee 2,5 % av underlaget.</CardDescription>
        </CardHeader>
        {showPartners && <CardContent className="space-y-3">
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
            <span className="text-xs text-muted-foreground self-center">{filtered.length} partners · {fmt(ft.partnerRevenue)} kr i urvalet</span>
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
                    <td className="pr-1"><Input type="number" min={0} className="h-8 w-20" value={(r[k] as number) || ""} placeholder="0" onChange={(e) => setRow(p.id, { [k]: num(e.target.value) } as any, p)} /></td>
                  );
                  return (
                    <tr key={p.id} className="border-t">
                      <td className="py-1 pr-2 font-medium">{p.name}</td>
                      <td className="text-xs">{status(p) === "premium" ? "Premium" : status(p) === "published" ? "Publicerad" : "Grund"}{p.has_finders_fee ? " · FF" : ""}</td>
                      <td className="pr-1"><select className={sel} value={r.forecast} onChange={(e) => setRow(p.id, { forecast: e.target.value as Forecast }, p)}>{Object.entries(FORECAST_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></td>
                      <td className="pr-1"><select className={sel} value={r.products} onChange={(e) => setRow(p.id, { products: Number(e.target.value) }, p)}>{[1, 2, 3].map((x) => <option key={x}>{x}</option>)}</select></td>
                      <td className="pr-1"><Input type="number" min={0} max={100} className="h-8 w-16" value={(r.discount) || ""} placeholder="0" onChange={(e) => setRow(p.id, { discount: Math.min(100, num(e.target.value)) }, p)} /></td>
                      {n("meetingsStd")}{n("dealsStd")}{n("meetingsFscm")}{n("dealsFscm")}
                      <td className="pr-1"><Input type="number" min={0} className="h-8 w-28" value={(r.successBasis) || ""} placeholder="0" onChange={(e) => setRow(p.id, { successBasis: num(e.target.value) }, p)} /></td>
                      <td className="text-right whitespace-nowrap">{fmt(rev.total)} kr</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>}
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base">ISV-budget 2027</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowIsv((v) => !v)}>{showIsv ? "Dölj ISV-detaljer" : `Visa ISV-detaljer (${ISV_VENDORS.length})`}</Button>
          </div>
          <CardDescription>ISV Solution Presence: 5 990 kr/år per ISV inklusive en app, 995 kr/år per extra app. Finders fee per accepterad partnerintroduktion: BC/CRM 3 500 kr, F&amp;SCM 7 500 kr vid avtal, plus 2,5 % av första nio månadernas intäkter.</CardDescription>
        </CardHeader>
        {showIsv && <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Sök ISV" value={iq} onChange={(e) => setIq(e.target.value)} className="w-48" />
            <select className={sel} value={iFilter} onChange={(e) => setIFilter(e.target.value)}>
              <option value="all">Alla ISV</option><option value="presence">Med Presence</option><option value="none">Utan Presence</option><option value="finders">Med finders fee-budget</option>
            </select>
            <span className="text-xs text-muted-foreground self-center">{isvShown.length} ISV · {fmt(isvShownTotal)} kr i urvalet</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground text-left">
                <tr><th className="py-2 pr-2">ISV</th><th>Appar i katalogen</th><th>Grundavgift</th><th>Extra appar</th><th>Rabatt %</th><th>Introduktioner BC/CRM</th><th>Introduktioner F&amp;SCM</th><th>Intäkter 9 mån kr</th><th className="text-right">Intäkt</th></tr>
              </thead>
              <tbody>
                {isvShown.map((v) => {
                  const r = isvFor(v);
                  const n = (k: keyof IsvForecast, w = "w-20") => (
                    <td className="pr-1"><Input type="number" min={0} className={`h-8 ${w}`} value={(r[k] as number) || ""} placeholder="0" onChange={(e) => setIsv(v, { [k]: k === "discount" ? Math.min(100, num(e.target.value)) : num(e.target.value) } as any)} /></td>
                  );
                  return (
                    <tr key={v.name} className="border-t">
                      <td className="py-1 pr-2 font-medium">{v.name}</td>
                      <td className="text-xs">{v.apps}</td>
                      <td className="pr-1"><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={r.presence} onChange={(e) => setIsv(v, { presence: e.target.checked })} /> 5 990 kr</label></td>
                      {n("extraApps")}{n("discount", "w-16")}{n("introsStd")}{n("introsFscm")}{n("successBasis", "w-28")}
                      <td className="text-right whitespace-nowrap">{fmt(isvRevenue(r).total)} kr</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Övriga intäkter</CardTitle>
          <CardDescription>Egna intäktsrader, per år eller per månad (månad räknas ×12).</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground text-left"><tr><th className="py-2">Intäkt</th><th>Belopp kr</th><th>Period</th><th className="text-right">Per år</th></tr></thead>
            <tbody>
              {(budget.otherRevenue ?? []).map((l, i) => (
                <tr key={i} className="border-t">
                  <td className="py-1 pr-2"><Input className="h-8" value={l.name} placeholder={`Egen intäkt ${i + 1}`} onChange={(e) => setLine("otherRevenue", i, { name: e.target.value })} /></td>
                  <td className="pr-2"><Input type="number" min={0} className="h-8 w-36" value={(l.amount) || ""} placeholder="0" onChange={(e) => setLine("otherRevenue", i, { amount: num(e.target.value) })} /></td>
                  <td className="pr-2">{periodSel("otherRevenue", i, l.period)}</td>
                  <td className="text-right">{fmt(annual(l))} kr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kostnadsbudget 2027</CardTitle>
          <CardDescription>Belopp per år eller per månad (månad räknas ×12). Namnen på de tre sista raderna går att ändra.</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground text-left"><tr><th className="py-2">Kategori</th><th>Belopp kr</th><th>Period</th><th className="text-right">Per år</th><th className="text-right">Per månad</th></tr></thead>
            <tbody>
              {budget.costs.map((c, i) => (
                <tr key={i} className="border-t">
                  <td className="py-1 pr-2">{c.custom ? <Input className="h-8" value={c.name} placeholder={`Egen kategori ${budget.costs.slice(0, i + 1).filter((x) => x.custom).length}`} onChange={(e) => setBudget((b) => ({ ...b, costs: b.costs.map((x, j) => j === i ? { ...x, name: e.target.value } : x) }))} /> : c.name}</td>
                  <td className="pr-2"><Input type="number" min={0} className="h-8 w-40" value={(c.amount) || ""} placeholder="0" onChange={(e) => setLine("costs", i, { amount: num(e.target.value) })} /></td>
                  <td className="pr-2">{periodSel("costs", i, c.period)}</td>
                  <td className="text-right">{fmt(annual(c))} kr</td>
                  <td className="text-right">{fmt(annual(c) / 12)} kr</td>
                </tr>
              ))}
              <tr className="border-t font-medium"><td className="py-2">Summa externa kostnader</td><td colSpan={2}></td><td className="text-right">{fmt(t.externalCosts)} kr</td><td className="text-right">{fmt(t.externalCosts / 12)} kr</td></tr>
              <tr className="border-t">
                <td className="py-2">Egen tid</td>
                <td colSpan={4}>
                  <div className="flex flex-wrap items-end gap-3">
                    <div><Label className="text-xs">Timmar per år</Label><Input type="number" min={0} className="h-8 w-28" value={(budget.ownHours) || ""} placeholder="0" onChange={(e) => setBudget((b) => ({ ...b, ownHours: num(e.target.value) }))} /></div>
                    <div><Label className="text-xs">Internkostnad kr/tim</Label><Input type="number" min={0} className="h-8 w-28" value={(budget.hourlyRate) || ""} placeholder="0" onChange={(e) => setBudget((b) => ({ ...b, hourlyRate: num(e.target.value) }))} /></div>
                    <span className="text-sm">= {fmt(t.ownTimeCost)} kr</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {(() => { const est = estimateRevenue(budget.estimates); const rev = est + t.other; const res = rev - t.externalCosts - t.ownTimeCost; return (
          <div className="mt-4 rounded-md border p-4 space-y-1 text-sm">
            <p className="text-xs text-muted-foreground pb-1">Resultatet räknas på den grova budgeten per kategori (detaljintäkt från partner- och ISV-listorna: {fmt(detTotal)} kr).</p>
            <div className="flex justify-between"><span>Grov budget per kategori</span><span>{fmt(est)} kr</span></div>
            <div className="flex justify-between"><span>Övriga intäkter</span><span>{fmt(t.other)} kr</span></div>
            <div className="flex justify-between font-medium"><span>Intäkter totalt</span><span>{fmt(rev)} kr</span></div>
            <div className="flex justify-between"><span>Externa kostnader</span><span>−{fmt(t.externalCosts)} kr</span></div>
            <div className="flex justify-between font-medium"><span>Resultat före egen tid</span><span>{fmt(rev - t.externalCosts)} kr</span></div>
            <div className="flex justify-between"><span>Egen tid (internkostnad)</span><span>−{fmt(t.ownTimeCost)} kr</span></div>
            <div className="flex justify-between text-base font-semibold border-t pt-2"><span>Resultat</span><span>{fmt(res)} kr</span></div>
            <div className="flex justify-between text-xs text-muted-foreground"><span>Resultat per månad</span><span>{fmt(res / 12)} kr</span></div>
          </div>); })()}
        </CardContent>
      </Card>
    </div>
  );
}
