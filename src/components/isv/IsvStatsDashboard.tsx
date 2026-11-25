import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Eye, Users, Package, BarChart3, Loader2, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MarketInterestCharts from "@/components/partner/MarketInterestCharts";

interface Stats {
  own: { views30d: number; views90d: number; visitors90d: number; productCount: number };
  products: { id: string; name: string; views30d: number; views90d: number }[];
  weeks: { week: string; views: number }[];
  site: { productViews90d: number; productVisitors90d: number; catalogViews90d: number };
}
interface SiteWin { pageViews: number; uniqueVisitors: number }

const fmt = (n: number) => n.toLocaleString("sv-SE");

function Kpi({ icon, label, main, mainLabel, sub }: { icon: React.ReactNode; label: string; main: number; mainLabel: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">{icon}</span>
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums">{fmt(main)}</span>
        <span className="text-sm text-muted-foreground">{mainLabel}</span>
      </div>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function IsvStatsDashboard({ token }: { token: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [site, setSite] = useState<{ d30: SiteWin; d90: SiteWin } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const own = fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isv-profile?action=stats&token=${encodeURIComponent(token)}`, {
      headers: { apikey, Authorization: `Bearer ${apikey}` },
    }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const siteReq = supabase.functions.invoke("partner-public-stats", { body: {} }).then(({ data }) => data?.totals ?? null).catch(() => null);
    Promise.all([own, siteReq]).then(([o, s]) => { setStats(o); setSite(s); setLoading(false); });
  }, [token]);

  if (loading) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Hämtar statistiken…</div>;

  const share = stats && stats.site.productViews90d > 0 ? (stats.own.views90d / stats.site.productViews90d) * 100 : 0;

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-lg sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-80">d365.se totalt</p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Räckvidd på sajten och i tilläggskatalogen</h2>
        <p className="mt-2 max-w-2xl text-sm opacity-90">Överst ser ni sajtens och katalogens totala räckvidd. Nedanför följer era egna siffror, er andel och vad köparna letar efter just nu.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {([
            ["Besökare på sajten 90 d", site?.d90.uniqueVisitors],
            ["Sidvisningar på sajten 90 d", site?.d90.pageViews],
            ["Visningar av tilläggsprodukter 90 d", stats?.site.productViews90d],
            ["Visningar av tilläggskatalogen 90 d", stats?.site.catalogViews90d],
          ] as const).filter(([, v]) => typeof v === "number").map(([l, v]) => (
            <div key={l} className="rounded-2xl bg-background/15 p-4 backdrop-blur">
              <div className="text-2xl font-bold tabular-nums">{fmt(v as number)}</div>
              <div className="mt-1 text-xs opacity-85">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {stats ? (
        <>
          <section>
            <h2 className="mb-4 text-xl font-semibold">Era siffror</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Kpi icon={<Eye className="h-4 w-4" />} label="Visningar av era produktsidor" main={stats.own.views30d} mainLabel="senaste 30 dagar" sub={`${fmt(stats.own.views90d)} senaste 90 dagar`} />
              <Kpi icon={<Users className="h-4 w-4" />} label="Besökare" main={stats.own.visitors90d} mainLabel="senaste 90 dagar" />
              <Kpi icon={<Package className="h-4 w-4" />} label="Produkter i katalogen" main={stats.own.productCount} mainLabel={stats.own.productCount === 1 ? "produkt" : "produkter"} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-1 flex items-center gap-2 font-semibold"><BarChart3 className="h-4 w-4 text-accent" /> Utveckling vecka för vecka</h3>
            <p className="mb-4 text-sm text-muted-foreground">Visningar av era produktsidor, senaste 13 veckorna.</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weeks}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={30} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="views" name="Visningar" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-semibold"><Globe className="h-4 w-4 text-accent" /> Er andel av alla visningar av tilläggsprodukter</h3>
            <div className="mb-1.5 flex justify-between gap-3 text-sm">
              <span>Senaste 90 dagar</span>
              <span className="whitespace-nowrap font-semibold tabular-nums">{fmt(stats.own.views90d)} av {fmt(stats.site.productViews90d)} ({share.toFixed(1).replace(".", ",")}&nbsp;%)</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${Math.max(share, stats.own.views90d > 0 ? 1.5 : 0)}%` }} />
            </div>
          </section>

          {stats.products.length > 1 && (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-semibold">Per produkt</h3>
              <ul className="divide-y divide-border">
                {stats.products.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-4 py-2 text-sm">
                    <span>{p.name}</span>
                    <span className="whitespace-nowrap tabular-nums text-muted-foreground"><strong className="text-foreground">{fmt(p.views30d)}</strong> 30 d · {fmt(p.views90d)} 90 d</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Era egna siffror kunde inte hämtas just nu.</p>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold">Vad intresserar köparna just nu</h2>
        <MarketInterestCharts />
      </section>
    </div>
  );
}
