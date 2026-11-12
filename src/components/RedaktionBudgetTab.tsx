import { Fragment, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BudgetNumberInput } from "@/components/BudgetNumberInput";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  BUDGET_KEY, DEFAULT_BUDGET, type Budget, type PartnerForecast, type Forecast,
  forecastRevenue, totals, CATEGORIES, detailByCategory, estimateRevenue, categoryGroupSummary, budgetIsvVendors, currentProducts, mergeCosts, annual, unitFor, successValue, isvRevenue, FUNNEL_PRODUCTS, EXPERT_FUNNEL, ISV_FUNNEL, partnerFunnelRow, expertFunnelRow, isvFunnelRow, funnelTotals, opexCoverage, type FunnelRow, type IsvForecast, type Period,
} from "@/lib/budget2027";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";

interface P { id: string; name: string; is_featured?: boolean | null; agreement_signed?: boolean | null; product_filters?: any; billing_interval?: string | null; discount_percent?: number | null; has_finders_fee?: boolean | null }

const fmt = (n: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n));
const fmtDifference = (detail: number, budget: number) => {
  const difference = Math.round(detail - budget);
  return `${difference > 0 ? "+" : ""}${fmt(difference)}`;
};
const FORECAST_LABEL: Record<Forecast, string> = { none: "Ingen", basic: "Grundprofil", month: "Premium månad", year: "Premium år" };

export default function RedaktionBudgetTab({ token, partners }: { token: string | null; partners: P[] }) {
  const solutions = useIsvSolutions();
  const ISV_VENDORS = useMemo(() => budgetIsvVendors(solutions), [solutions]);
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
  const [openVendors, setOpenVendors] = useState<Record<string, boolean>>({});
  const isvFor = (v: { name: string; apps: number }): IsvForecast => budget.isvs?.[v.name] ?? { presence: false, extraApps: Math.max(0, v.apps - 1), discount: 0, introsStd: 0, introsFscm: 0, successBasis: 0 };
  const setIsv = (v: { name: string; apps: number }, patch: Partial<IsvForecast>) =>
    setBudget((b) => ({ ...b, isvs: { ...(b.isvs ?? {}), [v.name]: { ...isvFor(v), ...patch } } }));
  const isvShown = ISV_VENDORS.filter((v) => {
    const r = isvFor(v);
    if (iq && !v.name.toLowerCase().includes(iq.toLowerCase())) return false;
    if (iFilter === "presence" && !r.presence) return false;
    if (iFilter === "none" && r.presence) return false;
    if (iFilter === "finders" && r.successBasis + (r.consultBasis ?? 0) === 0) return false;
    return true;
  });
  const isvShownTotals = isvShown.reduce((s, v) => { const r = isvRevenue(isvFor(v)); return { subscription: s.subscription + r.subscription, finders: s.finders + r.finders, total: s.total + r.total }; }, { subscription: 0, finders: 0, total: 0 });
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
  const groups = categoryGroupSummary(budget.estimates, det, budget.successValues, budget.funnel);
  const grossBudget = groups.partner.estimate + groups.isv.estimate + t.other;
  const result = grossBudget - t.externalCosts - t.ownTimeCost;

  if (loading) return <p className="text-sm text-muted-foreground">Laddar budget…</p>;
  const sel = "h-9 rounded-md border bg-background px-2 text-sm";

  return (
    <div className="space-y-6 tabular-nums [&_td.text-right]:whitespace-nowrap">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Budget 2027</h2>
          <p className="text-sm text-muted-foreground">Intern prognos per partner. Påverkar aldrig profiler, listor eller ordning. Alla belopp exkl. moms.</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara budget"}</Button>
      </div>

      <nav aria-label="Budgetsektioner" className="flex gap-1 overflow-x-auto border-y py-2">
        {[
          ["budget-result", "Resultat"],
          ["budget-summary", "Summering"],
          ["budget-partner-funnel", "Partnerfunnel"],
          ["budget-expert-funnel", "Expertförmedling"],
          ["budget-isv-funnel", "ISV-funnel"],
          ["budget-subscriptions", "Prenumerationer"],
          ["budget-partner-details", "Partnerdetaljer"],
          ["budget-isv-details", "ISV-detaljer"],
          ["budget-other", "Övriga intäkter"],
          ["budget-costs", "Kostnader och egen tid"],
        ].map(([id, label]) => (
          <Button key={id} variant="ghost" size="sm" asChild className="shrink-0">
            <a href={`#${id}`}>{label}</a>
          </Button>
        ))}
      </nav>

      {(() => { const est = estimateRevenue(budget.estimates, budget.successValues, budget.funnel); const rev = est + t.other; const res = rev - t.externalCosts - t.ownTimeCost; return (
      <div id="budget-result" className="scroll-mt-32 rounded-md border bg-card p-4 space-y-1 text-sm">
        <h3 className="text-lg font-semibold pb-1">Resultat budget 2027</h3>
        <p className="text-xs text-muted-foreground pb-1">Resultatet räknas på den grova budgeten per kategori (detaljintäkt från partner- och ISV-listorna: {fmt(detTotal)} kr).</p>
        <div className="flex justify-between gap-4 [&>span:last-child]:whitespace-nowrap"><span>Prenumerationsintäkter (partners + ISVs)</span><span>{fmt(groups.partner.subscription.estimate + groups.isv.subscription.estimate)} kr</span></div>
        <div className="flex justify-between gap-4 [&>span:last-child]:whitespace-nowrap"><span>Finder’s fee-intäkter (partners + ISVs)</span><span>{fmt(groups.partner.finders.estimate + groups.isv.finders.estimate)} kr</span></div>
        <div className="flex justify-between gap-4 [&>span:last-child]:whitespace-nowrap"><span>Övriga intäkter</span><span>{fmt(t.other)} kr</span></div>
        <div className="flex justify-between gap-4 [&>span:last-child]:whitespace-nowrap font-medium"><span>Intäkter totalt</span><span>{fmt(rev)} kr</span></div>
        <div className="flex justify-between gap-4 [&>span:last-child]:whitespace-nowrap"><span>Externa kostnader</span><span>−{fmt(t.externalCosts)} kr</span></div>
        <div className="flex justify-between gap-4 [&>span:last-child]:whitespace-nowrap font-medium"><span>Resultat före egen tid</span><span>{fmt(rev - t.externalCosts)} kr</span></div>
        <div className="flex justify-between gap-4 [&>span:last-child]:whitespace-nowrap"><span>Egen tid (internkostnad)</span><span>−{fmt(t.ownTimeCost)} kr</span></div>
        <div className="flex justify-between gap-4 [&>span:last-child]:whitespace-nowrap text-base font-semibold border-t pt-2"><span>Resultat</span><span>{fmt(res)} kr</span></div>
        <div className="flex justify-between gap-4 [&>span:last-child]:whitespace-nowrap text-xs text-muted-foreground"><span>Resultat per månad</span><span>{fmt(res / 12)} kr</span></div>
        {(() => { const rec = groups.partner.subscription.estimate + groups.isv.subscription.estimate; const c = opexCoverage(rec, t.externalCosts); return (
        <div className="mt-3 rounded-md border bg-muted/40 p-3 space-y-1">
          <h4 className="font-semibold">Återkommande intäkter vs fasta kostnader</h4>
          <p className="text-xs text-muted-foreground">Bär prenumerationerna (partners + ISV-leverantörer) sajtens externa kostnader utan Finder’s fee? Mål: täckningsgrad över 1,5.</p>
          <div className="flex justify-between gap-4"><span>Återkommande intäkter per månad</span><span className="whitespace-nowrap">{fmt(rec / 12)} kr</span></div>
          <div className="flex justify-between gap-4"><span>Fasta kostnader per månad</span><span className="whitespace-nowrap">{fmt(t.externalCosts / 12)} kr</span></div>
          <div className="flex justify-between gap-4 font-medium"><span>Täckningsgrad</span><span className="whitespace-nowrap">{t.externalCosts > 0 ? c.ratio.toLocaleString("sv-SE", { maximumFractionDigits: 2 }) : "–"}</span></div>
          <p className="text-sm font-medium pt-1">{t.externalCosts <= 0 ? "Lägg in kostnader för att se täckningen." : c.selfFunded ? "Driften är självfinansierad av prenumerationerna." : `Det saknas ${fmt(c.gap / 12)} kr per månad, ungefär ${c.extraPartners} Premiumpartners till (995 kr/mån).`}</p>
        </div>); })()}
      </div>); })()}

      <section id="budget-summary" className="scroll-mt-32 space-y-3" aria-labelledby="budget-summary-title">
        <h3 id="budget-summary-title" className="text-lg font-semibold">Summering av budget 2027</h3>
        <p className="text-sm text-muted-foreground">Budgeten visar dina grova uppskattningar och används i resultatet. Detaljprognosen visar underlaget från namngivna partners och ISV-leverantörer, efter rabatter. Alla belopp per år, exklusive moms. Success fee ingår inte i jämförelsen eller resultatet.</p>
        {([
          { key: "estimate", title: "Budget", total: grossBudget },
          { key: "detail", title: "Detaljprognos", total: detTotal + t.other },
          { key: "difference", title: "Skillnad (detaljprognos − budget)", total: detTotal + t.other - grossBudget },
        ] as const).map((view) => {
          const value = (r: { estimate: number; detail: number }) => view.key === "difference" ? fmtDifference(r.detail, r.estimate) : fmt(r[view.key]);
          const rows = [
            { label: "Partners", subscription: groups.partner.subscription, finders: groups.partner.finders, other: null, sum: groups.partner },
            { label: "ISVs", subscription: groups.isv.subscription, finders: groups.isv.finders, other: null, sum: groups.isv },
            { label: "Övriga intäkter", subscription: null, finders: null, other: { estimate: t.other, detail: t.other }, sum: { estimate: t.other, detail: t.other } },
          ];
          return (
            <div key={view.key} className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <caption className="py-3 text-left font-semibold text-foreground">{view.title}</caption>
                <thead className="text-xs text-muted-foreground"><tr>
                  <th scope="col" className="py-3 pr-3 text-left">Intäktskälla</th>
                  <th scope="col" className="px-3 text-right">Prenumerationer</th>
                  <th scope="col" className="px-3 text-right">Finder’s fee</th>
                  <th scope="col" className="px-3 text-right">Övrigt</th>
                  <th scope="col" className="border-l bg-muted px-3 text-right">Summa</th>
                </tr></thead>
                <tbody>{rows.map((row) => <tr key={row.label} className="border-t">
                  <th scope="row" className="py-3 pr-3 text-left font-medium">{row.label}</th>
                  {[row.subscription, row.finders, row.other].map((amount, i) => <td key={i} className="px-3 text-right whitespace-nowrap">{amount ? `${value(amount)} kr` : <span className="text-muted-foreground" aria-label="Ej tillämpligt">–</span>}</td>)}
                  <td className="border-l bg-muted px-3 text-right whitespace-nowrap font-semibold">{value(row.sum)} kr</td>
                </tr>)}</tbody>
                <tfoot className="border-t-2 border-border font-semibold"><tr>
                  <th scope="row" className="py-3 pr-3 text-left">Totala intäkter</th>
                  <td className="px-3 text-right whitespace-nowrap">{value({ estimate: groups.partner.subscription.estimate + groups.isv.subscription.estimate, detail: groups.partner.subscription.detail + groups.isv.subscription.detail })} kr</td>
                  <td className="px-3 text-right whitespace-nowrap">{value({ estimate: groups.partner.finders.estimate + groups.isv.finders.estimate, detail: groups.partner.finders.detail + groups.isv.finders.detail })} kr</td>
                  <td className="px-3 text-right whitespace-nowrap">{value({ estimate: t.other, detail: t.other })} kr</td>
                  <td className="border-l bg-muted px-3 text-right whitespace-nowrap">{view.key === "difference" ? fmtDifference(detTotal + t.other, grossBudget) : fmt(view.total)} kr</td>
                </tr></tfoot>
              </table>
            </div>
          );
        })}
        <div className="grid gap-3 sm:grid-cols-3 border-y py-4">
          <div><p className="text-xs text-muted-foreground">Externa kostnader per år</p><p className="text-lg font-semibold">{fmt(t.externalCosts)} kr</p></div>
          <div><p className="text-xs text-muted-foreground">Egen tid, internkostnad per år</p><p className="text-lg font-semibold">{fmt(t.ownTimeCost)} kr</p></div>
          <div><p className="text-xs text-muted-foreground">Budgeterat resultat efter egen tid</p><p className="text-lg font-semibold">{fmt(result)} kr</p><p className="text-xs text-muted-foreground">{fmt(result / 12)} kr per månad</p></div>
        </div>
        <details className="text-sm"><summary className="cursor-pointer font-medium">Antal i partner- och ISV-detaljerna</summary><p className="mt-2 text-muted-foreground">Partners: {t.yearCount} årsprenumerationer, {t.monthCount} månadsprenumerationer och {t.products} produktområden. ISV: {t.isvCount} Presence-prenumerationer och {det.isvExtra.count} extra appar. Antalen är detaljprognoser, inte din grova budget.</p></details>
      </section>

      <FunnelBudget budget={budget} setBudget={setBudget} />

      <Card id="budget-subscriptions" className="scroll-mt-32">
        <CardHeader>
          <CardTitle className="text-base">Grov budget per kategori</CardTitle>
          <CardDescription>Årsbudget för 2027, exklusive moms. Din uppskattning ligger till grund för resultatet; partner- och ISV-detaljerna är ett jämförelseunderlag, inte faktiska eller garanterade intäkter.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">Förklaring av kolumnerna</summary>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-muted-foreground">
              {[
                ["Kategori", "Typ av prenumeration eller affärshändelse. Beskrivningen på varje rad anger vad som ska räknas."],
                ["Pris/st (årsbelopp)", "Årspris per prenumeration eller app, alternativt engångsavgift per möte eller avtal. Premium månad visas som månadspris × 12. För expertförmedling anges priset per debiterad timme i stället, och antalet är då budgeterade debiterade timmar."],
                ["Uppskattning antal", "Din grova uppskattning av antal partners, appar, möten eller avtal under 2027, utan krav på namngivna partners."],
                ["Uppskattad årsintäkt", "Din uppskattning antal × pris/st, före eventuella rabatter. Denna summa används i resultatet tillsammans med övriga intäkter."],
                ["Detaljer antal", "Antal från prognoserna i partner- och ISV-listorna, inklusive förifyllda partnerprognoser. Alla räknas, även när detaljlistorna är dolda eller filtrerade."],
                ["Detaljer årsintäkt", "Summa från partner- och ISV-prognoserna, med respektive prenumerationsrabatt. Det är budgeterade, inte fakturerade intäkter."],
                ["Skillnad årsintäkt", "Detaljer årsintäkt minus uppskattad årsintäkt. Plus betyder att detaljerna ligger högre; minus att de ligger lägre. Även rabatter kan skapa skillnader."],
              ].map(([term, description]) => <div key={term}><dt className="font-medium text-foreground">{term}</dt><dd>{description}</dd></div>)}
            </dl>
          </details>
          <p className="text-xs text-muted-foreground">Mötesavgift gäller bara Basic. Basic-avtalsraderna visar ersättningen efter mötesavdrag; Premium har egna avtalsrader med hela ersättningen. Tidigare sparade avtalsuppskattningar ligger kvar på Basic-raderna, så kontrollera fördelningen. Success fee (2,5 %) budgeteras per område med ett antaget snittbelopp per affär och ingår i resultatet; detaljlistorna har inga success fee-rader per område. Expertförmedling budgeteras i debiterade timmar, 50 kr per timme från Premiumpartner och 90 kr per timme från Basicpartner, och saknar detaljunderlag i partnerlistorna.</p>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="text-xs text-muted-foreground text-left">
              <tr><th className="py-2 pr-3 w-80">Kategori</th><th className="text-right px-2">Pris/st<br />(årsbelopp)</th><th className="px-2">Uppskattning<br />antal</th><th className="text-right px-2">Uppskattad<br />årsintäkt</th><th className="text-right px-2">Detaljer<br />antal</th><th className="text-right px-2">Detaljer<br />årsintäkt</th><th className="text-right pl-2">Skillnad<br />årsintäkt</th></tr>
            </thead>
            <tbody>
              {([
                { label: "Partners: prenumerationsintäkter", group: "partner", income: "subscription", ...groups.partner.subscription },
                { label: "ISVs: prenumerationsintäkter", group: "isv", income: "subscription", ...groups.isv.subscription },
              ] as const).map((section) => <Fragment key={section.label}>
                <tr className="border-t bg-muted"><th colSpan={7} scope="colgroup" className="py-3 px-2 text-left font-semibold">{section.label}</th></tr>
                {CATEGORIES.filter((c) => c.group === section.group && c.income === section.income).map((c) => {
                const e = Number(budget.estimates?.[c.key]) || 0; const d = det[c.key];
                const unit = unitFor(c, budget.successValues);
                const diff = d.revenue - e * unit;
                return (
                  <tr key={c.key} className="border-t">
                    <td className="py-3 pr-3"><p className="font-medium">{c.label}</p><p className="mt-1 text-xs text-muted-foreground leading-relaxed">{c.description}</p></td>
                    <td className="text-right whitespace-nowrap pr-2">{c.success ? (
                      <div className="flex flex-col items-end gap-1">
                        <label className="text-xs text-muted-foreground">Snittbelopp/affär</label>
                        <BudgetNumberInput aria-label={`Snittbelopp per affär: ${c.label}`} min={0} step={10000} className="h-8 w-28 text-right" value={successValue(c.key, budget.successValues) || ""} placeholder="0" onValueChange={(value) => setBudget((b) => ({ ...b, successValues: { ...(b.successValues ?? {}), [c.key]: value } }))} />
                        <span>= {fmt(unit)} kr</span>
                      </div>
                    ) : <>{fmt(c.unit)} kr{c.per ? ` per ${c.per}` : ""}</>}</td>
                    <td className="px-2"><BudgetNumberInput aria-label={`Uppskattning antal: ${c.label}`} min={0} className="h-8 w-20" value={(e) || ""} placeholder="0" onValueChange={(value) => setBudget((b) => ({ ...b, estimates: { ...(b.estimates ?? {}), [c.key]: value } }))} /></td>
                    <td className="text-right whitespace-nowrap">{fmt(e * unit)} kr</td>
                    <td className="text-right">{fmt(d.count)}</td>
                    <td className="text-right whitespace-nowrap">{fmt(d.revenue)} kr</td>
                    <td className={`text-right whitespace-nowrap ${diff < 0 ? "text-destructive" : ""}`}>{fmtDifference(d.revenue, e * unit)} kr</td>
                  </tr>
                );
                })}
                <tr className="border-t font-medium"><td className="py-3 pr-3">Delsumma: {section.label}</td><td /><td /><td className="text-right whitespace-nowrap">{fmt(section.estimate)} kr</td><td /><td className="text-right whitespace-nowrap">{fmt(section.detail)} kr</td><td className="text-right whitespace-nowrap">{fmtDifference(section.detail, section.estimate)} kr</td></tr>
              </Fragment>)}
              <tr className="border-t font-semibold">
                <td className="py-2">Summa</td><td /><td />
                <td className="text-right whitespace-nowrap">{fmt(estimateRevenue(budget.estimates, budget.successValues, budget.funnel))} kr</td><td />
                <td className="text-right whitespace-nowrap">{fmt(detTotal)} kr</td>
                <td className="text-right whitespace-nowrap">{fmtDifference(detTotal, estimateRevenue(budget.estimates, budget.successValues, budget.funnel))} kr</td>
              </tr>
            </tbody>
          </table>
          </div>
        </CardContent>
      </Card>

      <Card id="budget-partner-details" className="scroll-mt-32">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base">Intäktsbudget per partner</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowPartners((v) => !v)}>{showPartners ? "Dölj partnerdetaljer" : `Visa partnerdetaljer (${partners.length})`}</Button>
          </div>
          <CardDescription>Prognos 2027 styr avgiften: Grundprofil (Basic) betalar mötesavgift och resterande avtalsersättning efter mötesavdrag. Premium betalar ingen mötesavgift, men hela avtalsersättningen. Mötesfält ignoreras för Premium. Success fee räknas separat på 2,5 % av underlaget när det överstiger 100 000 kr, men ingår inte i den grova budgetens resultat.</CardDescription>
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
              <option value="all">Finder’s fee: alla</option><option value="yes">Med Finder’s fee-budget</option><option value="agreement">Har Finder’s fee-avtal</option>
            </select>
            <span className="text-xs text-muted-foreground self-center">{filtered.length} partners · Prenumerationer: {fmt(ft.subscription)} kr · Finder’s fee: {fmt(ft.finders)} kr · Totalt: {fmt(ft.partnerRevenue)} kr i urvalet</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground text-left">
                <tr><th className="py-2 pr-2">Partner</th><th>Idag</th><th>Prognos 2027</th><th>Produkter</th><th>Rabatt %</th><th>Möten BC/CE</th><th>Avtal BC/CE</th><th>Möten F&amp;SCM</th><th>Avtal F&amp;SCM</th><th>Success-underlag kr</th><th className="text-right px-2">Prenumerationer kr/år</th><th className="text-right px-2">Finder’s fee kr/år</th><th className="text-right">Totalt kr/år</th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const r = rowFor(p); const rev = forecastRevenue(r, budget);
                  const n = (k: keyof PartnerForecast) => (
                    <td className="pr-1"><BudgetNumberInput min={0} className="h-8 w-20" value={(r[k] as number) || ""} placeholder="0" onValueChange={(value) => setRow(p.id, { [k]: value } as any, p)} /></td>
                  );
                  return (
                    <tr key={p.id} className="border-t">
                      <td className="py-1 pr-2 font-medium">{p.name}</td>
                      <td className="text-xs">{status(p) === "premium" ? "Premium" : status(p) === "published" ? "Publicerad" : "Grund"}{p.has_finders_fee ? " · FF" : ""}</td>
                      <td className="pr-1"><select className={sel} value={r.forecast} onChange={(e) => setRow(p.id, { forecast: e.target.value as Forecast }, p)}>{Object.entries(FORECAST_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></td>
                      <td className="pr-1"><select className={sel} value={r.products} onChange={(e) => setRow(p.id, { products: Number(e.target.value) }, p)}>{[1, 2, 3].map((x) => <option key={x}>{x}</option>)}</select></td>
                      <td className="pr-1"><BudgetNumberInput min={0} max={100} className="h-8 w-16" value={(r.discount) || ""} placeholder="0" onValueChange={(value) => setRow(p.id, { discount: Math.min(100, value) }, p)} /></td>
                      {n("meetingsStd")}{n("dealsStd")}{n("meetingsFscm")}{n("dealsFscm")}
                      <td className="pr-1"><BudgetNumberInput min={0} className="h-8 w-28" value={(r.successBasis) || ""} placeholder="0" onValueChange={(value) => setRow(p.id, { successBasis: value }, p)} /></td>
                      <td className="text-right px-2 whitespace-nowrap">{fmt(rev.subscription)} kr</td><td className="text-right px-2 whitespace-nowrap">{fmt(rev.finders)} kr</td><td className="text-right whitespace-nowrap">{fmt(rev.total)} kr</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>}
      </Card>

      <Card id="budget-isv-details" className="scroll-mt-32">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base">ISV-budget 2027</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowIsv((v) => !v)}>{showIsv ? "Dölj ISV-detaljer" : `Visa ISV-detaljer (${ISV_VENDORS.length})`}</Button>
          </div>
          <CardDescription>ISV Presence: 5 990 kr/år per ISV inklusive en app, 995 kr/år per extra app. Appar i katalogen hämtas från den aktuella publicerade katalogen, inte bara den äldre listan. Extra appar är ditt budgeterade antal och kan ändras fritt. Business Referral (Finder’s fee): 5 % av ISV:ns nettointäkter från licenser eller abonnemang under affärens första 12 månader och 2,5 % av ett förmedlat konsultuppdrag. Introduktionspris 2 990 kr första året för de första 20 nya ISV-leverantörerna.</CardDescription>
        </CardHeader>
        {showIsv && <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Sök ISV" value={iq} onChange={(e) => setIq(e.target.value)} className="w-48" />
            <select className={sel} value={iFilter} onChange={(e) => setIFilter(e.target.value)}>
              <option value="all">Alla ISV</option><option value="presence">Med Presence</option><option value="none">Utan Presence</option><option value="finders">Med Finder’s fee-budget</option>
            </select>
            <span className="text-xs text-muted-foreground self-center">{isvShown.length} ISV · Prenumerationer: {fmt(isvShownTotals.subscription)} kr · Finder’s fee: {fmt(isvShownTotals.finders)} kr · Totalt: {fmt(isvShownTotals.total)} kr i urvalet</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground text-left">
                <tr><th className="py-2 pr-2">ISV</th><th>Appar i katalogen</th><th>Grundavgift</th><th>Extra appar</th><th>Rabatt %</th><th>Licensintäkter 12 mån kr (5 %)</th><th>Konsultintäkter kr (2,5 %)</th><th className="text-right px-2">Prenumerationer kr/år</th><th className="text-right px-2">Finder’s fee kr/år</th><th className="text-right">Totalt kr/år</th></tr>
              </thead>
              <tbody>
                {isvShown.map((v) => {
                  const r = isvFor(v);
                  const n = (k: keyof IsvForecast, w = "w-20") => (
                    <td className="pr-1"><BudgetNumberInput min={0} className={`h-8 ${w}`} value={(r[k] as number) || ""} placeholder="0" onValueChange={(value) => setIsv(v, { [k]: k === "discount" ? Math.min(100, value) : value } as any)} /></td>
                  );
                  const open = !!openVendors[v.name];
                  return (
                    <Fragment key={v.name}>
                    <tr className="border-t">
                      <td className="py-1 pr-2 font-medium">
                        <button type="button" className="flex items-center gap-1 text-left hover:underline" aria-expanded={open} onClick={() => setOpenVendors((o) => ({ ...o, [v.name]: !o[v.name] }))}>
                          <span className="text-xs text-muted-foreground w-3">{open ? "▾" : "▸"}</span>{v.name}
                        </button>
                      </td>
                      <td className="text-xs">{fmt(v.apps)}</td>
                      <td className="pr-1"><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={r.presence} onChange={(e) => setIsv(v, { presence: e.target.checked })} /> {r.introPrice === false ? "5 990" : "2 990"} kr</label><label className="flex items-center gap-1 text-[11px] text-muted-foreground"><input type="checkbox" checked={r.introPrice !== false} onChange={(e) => setIsv(v, { introPrice: e.target.checked })} /> Ny (intropris)</label></td>
                      {n("extraApps")}{n("discount", "w-16")}{n("successBasis", "w-28")}{n("consultBasis", "w-28")}
                      <td className="text-right px-2 whitespace-nowrap">{fmt(isvRevenue(r).subscription)} kr</td><td className="text-right px-2 whitespace-nowrap">{fmt(isvRevenue(r).finders)} kr</td><td className="text-right whitespace-nowrap">{fmt(isvRevenue(r).total)} kr</td>
                    </tr>
                    {open && v.products.map((p, i) => (
                      <tr key={p.id} className="bg-muted/40 text-xs text-muted-foreground">
                        <td className="py-1 pl-6 pr-2">{p.name}</td>
                        <td colSpan={10}>{i === 0 ? "Ingår i grundavgiften" : "Extra app, 995 kr/år om den räknas in"}</td>
                      </tr>
                    ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>}
      </Card>

      <Card id="budget-other" className="scroll-mt-32">
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
                  <td className="pr-2"><BudgetNumberInput min={0} className="h-8 w-36" value={(l.amount) || ""} placeholder="0" onValueChange={(value) => setLine("otherRevenue", i, { amount: value })} /></td>
                  <td className="pr-2">{periodSel("otherRevenue", i, l.period)}</td>
                  <td className="text-right">{fmt(annual(l))} kr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card id="budget-costs" className="scroll-mt-32">
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
                  <td className="pr-2"><BudgetNumberInput min={0} className="h-8 w-40" value={(c.amount) || ""} placeholder="0" onValueChange={(value) => setLine("costs", i, { amount: value })} /></td>
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
                    <div><Label className="text-xs">Timmar per år</Label><BudgetNumberInput min={0} className="h-8 w-28" value={(budget.ownHours) || ""} placeholder="0" onValueChange={(value) => setBudget((b) => ({ ...b, ownHours: value }))} /></div>
                    <div><Label className="text-xs">Internkostnad kr/tim</Label><BudgetNumberInput min={0} className="h-8 w-28" value={(budget.hourlyRate) || ""} placeholder="0" onValueChange={(value) => setBudget((b) => ({ ...b, hourlyRate: value }))} /></div>
                    <span className="text-sm">= {fmt(t.ownTimeCost)} kr</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </CardContent>
      </Card>
    </div>
  );
}

function FunnelBudget({ budget, setBudget }: { budget: Budget; setBudget: React.Dispatch<React.SetStateAction<Budget>> }) {
  const f = budget.funnel ?? {};
  const values = budget.successValues ?? {};
  const set = (key: string, patch: FunnelRow) => setBudget((b) => ({ ...b, funnel: { ...(b.funnel ?? {}), [key]: { ...(b.funnel?.[key] ?? {}), ...patch } } }));
  const setValue = (key: string, v: number) => setBudget((b) => ({ ...b, successValues: { ...(b.successValues ?? {}), [key]: v } }));
  const field = (label: string, v: number | undefined, on: (n: number) => void, w = "w-20") => (
    <BudgetNumberInput aria-label={label} min={0} className={`h-8 ${w} text-right ml-auto`} value={v || ""} placeholder="0" onValueChange={(value) => on(value)} />
  );
  const sub = (amount: number) => <p className="mt-1 text-xs text-muted-foreground text-right">{fmt(amount)} kr</p>;
  const ft = funnelTotals(f, values);
  const th = "px-2 text-right font-normal";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Finder’s fee-budget som funnel</CardTitle>
        <CardDescription>Fyll i möten, avtal och affärer per produkt. Summan räknas direkt och ingår i resultatet. Mötesavgift gäller bara Basic; Premium betalar hela avtalsersättningen. Success fee 2,5 % räknas per vunnen affär när snittbeloppet överstiger 100 000 kr.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div id="budget-partner-funnel" className="scroll-mt-32 overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <caption className="pb-2 text-left font-semibold text-foreground">Partners per produkt</caption>
            <thead className="text-xs text-muted-foreground"><tr>
              <th className="py-2 pr-3 text-left font-normal">Produkt</th><th className={th}>Antal möten</th><th className={th}>Antal avtal</th><th className={th}>Antal affärer<br />(success fee)</th><th className="border-l bg-muted px-3 text-right font-normal">Totalt kr/år</th>
            </tr></thead>
            <tbody>{FUNNEL_PRODUCTS.map((p) => <Fragment key={p.key}>
              <tr className="border-t bg-muted/50"><th colSpan={4} className="py-2 pr-3 text-left font-semibold">{p.label}
                <span className="ml-3 text-xs font-normal text-muted-foreground">Snittbelopp/affär <BudgetNumberInput aria-label={`Snittbelopp per affär: ${p.label}`} min={0} step={10000} className="inline-flex h-7 w-28 text-right" value={successValue(p.valueKey, values) || ""} placeholder="0" onValueChange={(value) => setValue(p.valueKey, value)} /> kr</span>
              </th><td className="border-l bg-muted" /></tr>
              {(["basic", "premium"] as const).map((tier) => { const k = `${p.key}_${tier}`; const r = f[k] ?? {}; const x = partnerFunnelRow(p, tier, r, values); return (
                <tr key={k} className="border-t">
                  <td className="py-2 pr-3 pl-4">{tier === "basic" ? "Basic" : "Premium"}</td>
                  <td className="px-2">{field(`Möten ${p.label} ${tier}`, r.meetings, (v) => set(k, { meetings: v }))}{tier === "basic" ? sub(x.meetings) : <p className="mt-1 text-xs text-muted-foreground text-right">ingen mötesavgift</p>}</td>
                  <td className="px-2">{field(`Avtal ${p.label} ${tier}`, r.deals, (v) => set(k, { deals: v }))}{sub(x.deals)}</td>
                  <td className="px-2">{field(`Affärer ${p.label} ${tier}`, r.wins, (v) => set(k, { wins: v }))}{sub(x.wins)}</td>
                  <td className="border-l bg-muted px-3 text-right font-semibold whitespace-nowrap">{fmt(x.total)} kr</td>
                </tr>); })}
            </Fragment>)}</tbody>
            <tfoot className="border-t-2 font-semibold"><tr><th colSpan={4} className="py-2 text-left">Delsumma partners</th><td className="border-l bg-muted px-3 text-right">{fmt(ft.partner)} kr</td></tr></tfoot>
          </table>
        </div>

        <div id="budget-expert-funnel" className="scroll-mt-32 overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <caption className="pb-2 text-left font-semibold text-foreground">CV- och expertförsäljning</caption>
            <thead className="text-xs text-muted-foreground"><tr>
              <th className="py-2 pr-3 text-left font-normal">Uppdragstyp</th><th className={th}>Antal tillsatta<br />uppdrag</th><th className={th}>Avgift<br />kr per timme</th><th className={th}>Snitt antal<br />månader</th><th className={th}>Procent<br />av heltid</th><th className={th}>Debiterade timmar<br />(165 h/mån)</th><th className="border-l bg-muted px-3 text-right font-normal">Totalt kr/år</th>
            </tr></thead>
            <tbody>{EXPERT_FUNNEL.map((e) => { const r = f[e.key] ?? {}; const x = expertFunnelRow(e, r); return (
              <tr key={e.key} className="border-t">
                <td className="py-2 pr-3">{e.label}</td>
                <td className="px-2">{field(`Uppdrag ${e.label}`, r.assignments, (v) => set(e.key, { assignments: v }))}</td>
                <td className="px-2"><BudgetNumberInput aria-label={`Avgift per timme ${e.label}`} min={0} className="h-8 w-20 text-right ml-auto" value={x.rate} onValueChange={(value) => set(e.key, { rate: value })} /></td>
                <td className="px-2"><BudgetNumberInput aria-label={`Snitt månader ${e.label}`} min={0} step={0.5} className="h-8 w-20 text-right ml-auto" value={x.months} onValueChange={(value) => set(e.key, { months: value })} /></td>
                <td className="px-2"><BudgetNumberInput aria-label={`Procent av heltid ${e.label}`} min={0} max={100} step={10} className="h-8 w-20 text-right ml-auto" value={x.percent} onValueChange={(value) => set(e.key, { percent: value })} /></td>
                <td className="px-2 text-right whitespace-nowrap">{fmt(x.hours)} h<div className="text-xs text-muted-foreground">{fmt(x.perAssignment)} h per uppdrag</div></td>
                <td className="border-l bg-muted px-3 text-right font-semibold whitespace-nowrap">{fmt(x.total)} kr</td>
              </tr>); })}</tbody>
            <tfoot className="border-t-2 font-semibold"><tr><th colSpan={6} className="py-2 text-left">Delsumma expertförsäljning</th><td className="border-l bg-muted px-3 text-right">{fmt(ft.expert)} kr</td></tr></tfoot>
          </table>
        </div>

        <div id="budget-isv-funnel" className="scroll-mt-32 overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <caption className="pb-2 text-left font-semibold text-foreground">ISV-leverantörer</caption>
            <thead className="text-xs text-muted-foreground"><tr>
              <th className="py-2 pr-3 text-left font-normal">Område</th><th className={th}>Antal<br />introduktioner</th><th className={th}>Antal genomförda<br />affärer</th><th className="border-l bg-muted px-3 text-right font-normal">Totalt kr/år</th>
            </tr></thead>
            <tbody>{ISV_FUNNEL.map((i) => { const r = f[i.key] ?? {}; const x = isvFunnelRow(i, r, values); return (
              <tr key={i.key} className="border-t">
                <td className="py-2 pr-3">{i.label}
                  <p className="text-xs text-muted-foreground">{(i.rate * 100).toLocaleString("sv-SE")} % = {fmt(x.fee)} kr per affär · nettointäkt <BudgetNumberInput aria-label={`Nettointäkt per affär: ${i.label}`} min={0} step={10000} className="inline-flex h-7 w-28 text-right" value={Number(values[i.key]) || i.value} onValueChange={(value) => setValue(i.key, value)} /> kr</p></td>
                <td className="px-2">{field(`Introduktioner ${i.label}`, r.meetings, (v) => set(i.key, { meetings: v }))}<p className="mt-1 text-xs text-muted-foreground text-right">volym</p></td>
                <td className="px-2">{field(`Avtal ${i.label}`, r.deals, (v) => set(i.key, { deals: v }))}{sub(x.deals)}</td>
                <td className="border-l bg-muted px-3 text-right font-semibold whitespace-nowrap">{fmt(x.total)} kr</td>
              </tr>); })}</tbody>
            <tfoot className="border-t-2 font-semibold"><tr><th colSpan={3} className="py-2 text-left">Delsumma ISV-leverantörer</th><td className="border-l bg-muted px-3 text-right">{fmt(ft.isv)} kr</td></tr></tfoot>
          </table>
        </div>
        <div className="flex justify-between gap-4 [&>span:last-child]:whitespace-nowrap border-t pt-3 text-base font-semibold"><span>Finder’s fee totalt (funnel)</span><span>{fmt(ft.total)} kr</span></div>
      </CardContent>
    </Card>
  );
}
