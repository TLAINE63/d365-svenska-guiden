import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { categoryLabelSv } from "@/lib/isvCategoryLabels";

interface ProductStat { solution_id: string; product_name: string; vendor_name: string; category: string; views: number; unique_sessions: number; web_clicks: number; help_requests: number }
interface AreaStat { path: string; views: number; unique_sessions: number }
interface Stats { products: ProductStat[]; areas: AreaStat[]; totals: { product_views: number; area_views: number; unique_sessions: number; web_clicks: number; help_requests: number } }

const PERIODS = [30, 90, 180] as const;

/** Besök per ISV-produkt och tilläggsområde (aggregat, delas av Admin och Redaktion). */
export default function IsvStatsCard({ token, onSessionExpired }: { token: string | null; onSessionExpired: () => void }) {
  const [days, setDays] = useState<number>(90);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [all, setAll] = useState(false);

  useEffect(() => {
    if (!token) return;
    let off = false;
    setError(null);
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-isv-solutions?action=product_stats&days=${days}`, {
      headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    }).then(async (r) => {
      if (r.status === 401) return onSessionExpired();
      if (!r.ok) throw new Error();
      const d = await r.json();
      if (!off) setStats(d);
    }).catch(() => !off && setError("Statistiken kunde inte hämtas."));
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, days]);

  const byCategory = useMemo(() => {
    const m = new Map<string, { views: number; products: number; clicks: number }>();
    for (const p of stats?.products ?? []) {
      const k = p.category ? categoryLabelSv(p.category) : "Okategoriserad";
      const r = m.get(k) ?? { views: 0, products: 0, clicks: 0 };
      r.views += p.views; r.products++; r.clicks += p.web_clicks; m.set(k, r);
    }
    return [...m.entries()].sort((a, b) => b[1].views - a[1].views);
  }, [stats]);

  const products = all ? stats?.products ?? [] : (stats?.products ?? []).slice(0, 15);
  const t = stats?.totals;

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Besök per produkt och tilläggsområde</CardTitle>
        <CardDescription>Sidvisningar av produktsidor och tilläggssidor. Klick och hjälpförfrågningar räknas bara för besökare som godkänt statistik, så de är ett golv.</CardDescription>
        <div className="flex gap-2 pt-2" role="group" aria-label="Period">
          {PERIODS.map((d) => (
            <button key={d} type="button" onClick={() => setDays(d)} aria-pressed={days === d}
              className={`rounded-md border px-3 py-1 text-sm ${days === d ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input"}`}>{d} dagar</button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {!stats && !error && <p className="text-sm text-muted-foreground">Hämtar…</p>}
        {t && (
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[["Produktvisningar", t.product_views], ["Visningar tilläggssidor", t.area_views], ["Klick till leverantör", t.web_clicks], ["Hjälpförfrågningar", t.help_requests]].map(([l, v]) => (
              <div key={l as string} className="rounded-lg border bg-card p-3"><dt className="text-xs text-muted-foreground">{l}</dt><dd className="text-2xl font-semibold">{v}</dd></div>
            ))}
          </dl>
        )}
        {stats && (
          <>
            <section>
              <h3 className="font-semibold mb-2">Produkter</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Produkt</TableHead><TableHead>Leverantör</TableHead><TableHead className="text-right">Visningar</TableHead><TableHead className="text-right">Besök</TableHead><TableHead className="text-right">Klick</TableHead><TableHead className="text-right">Hjälp</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.solution_id}><TableCell>{p.product_name || p.solution_id}</TableCell><TableCell>{p.vendor_name}</TableCell><TableCell className="text-right">{p.views}</TableCell><TableCell className="text-right">{p.unique_sessions}</TableCell><TableCell className="text-right">{p.web_clicks}</TableCell><TableCell className="text-right">{p.help_requests}</TableCell></TableRow>
                    ))}
                    {products.length === 0 && <TableRow><TableCell colSpan={6} className="text-muted-foreground">Inga besök under perioden.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
              {stats.products.length > 15 && <button type="button" className="mt-2 text-sm underline" onClick={() => setAll((a) => !a)}>{all ? "Visa färre" : `Visa alla ${stats.products.length}`}</button>}
            </section>
            <section>
              <h3 className="font-semibold mb-2">Per tilläggsområde (kategori)</h3>
              <Table>
                <TableHeader><TableRow><TableHead>Område</TableHead><TableHead className="text-right">Produkter</TableHead><TableHead className="text-right">Visningar</TableHead><TableHead className="text-right">Klick</TableHead></TableRow></TableHeader>
                <TableBody>{byCategory.map(([k, r]) => <TableRow key={k}><TableCell>{k}</TableCell><TableCell className="text-right">{r.products}</TableCell><TableCell className="text-right">{r.views}</TableCell><TableCell className="text-right">{r.clicks}</TableCell></TableRow>)}</TableBody>
              </Table>
            </section>
            <section>
              <h3 className="font-semibold mb-2">Katalog- och tilläggssidor</h3>
              <Table>
                <TableHeader><TableRow><TableHead>Sida</TableHead><TableHead className="text-right">Visningar</TableHead><TableHead className="text-right">Besök</TableHead></TableRow></TableHeader>
                <TableBody>{stats.areas.slice(0, 20).map((a) => <TableRow key={a.path}><TableCell className="break-all">{a.path}</TableCell><TableCell className="text-right">{a.views}</TableCell><TableCell className="text-right">{a.unique_sessions}</TableCell></TableRow>)}</TableBody>
              </Table>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}
