import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Eye, MousePointerClick, ExternalLink, Globe, Users, ListFilter, BarChart3, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MarketInterestCharts from "@/components/partner/MarketInterestCharts";

interface Own {
  profileVisits30d: number; profileVisits90d: number;
  cardClicks30d: number; cardClicks90d: number;
  websiteClicks30d: number; websiteClicks90d: number;
  exposures30d?: number; exposures90d?: number;
}
interface Week { week: string; profileVisits: number; cardClicks: number; websiteClicks: number }
interface Bc {
  ownExposures30d: number; ownExposures90d: number;
  ownVisits30d: number; ownVisits90d: number;
  siteExposures90d: number; siteCardClicks90d: number;
  sitePageViews90d: number; siteUniqueVisitors90d: number;
}
interface SiteWin { pageViews: number; uniqueVisitors: number }
interface Site {
  totals: { d30: SiteWin; d90: SiteWin };
  salesSummary?: { partnerProfileVisits: number; partnerClicks: number; komIgang: number; valjPartner: number };
}

const fmt = (n: number) => n.toLocaleString("sv-SE");

function Kpi({ icon, label, v30, v90 }: { icon: React.ReactNode; label: string; v30: number; v90: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">{icon}</span>
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums">{fmt(v30)}</span>
        <span className="text-sm text-muted-foreground">senaste 30 dagar</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{fmt(v90)} senaste 90 dagar</p>
    </div>
  );
}

function ShareBar({ label, own, total }: { label: string; own: number; total: number }) {
  const pct = total > 0 ? (own / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-semibold tabular-nums whitespace-nowrap">
          {fmt(own)} av {fmt(total)} ({pct < 0.1 && own > 0 ? "<0,1" : pct.toFixed(1).replace(".", ",")}&nbsp;%)
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${Math.max(pct, own > 0 ? 1.5 : 0)}%` }} />
      </div>
    </div>
  );
}

export default function PartnerStatsDashboard({ token }: { token: string }) {
  const [own, setOwn] = useState<Own | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [site, setSite] = useState<Site | null>(null);
  const [bc, setBc] = useState<Bc | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownError, setOwnError] = useState(false);

  useEffect(() => {
    let alive = true;
    const ownReq = fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-partner-stats&token=${encodeURIComponent(token)}`,
      { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY }, cache: "no-store" },
    ).then(async (r) => (r.ok ? r.json() : null)).catch(() => null);
    const siteReq = supabase.functions.invoke("partner-public-stats", { body: {} }).then(({ data }) => data).catch(() => null);
    Promise.all([ownReq, siteReq]).then(([o, s]) => {
      if (!alive) return;
      if (o?.own) { setOwn(o.own); setWeeks(o.weeks || []); setBc(o.bc || null); } else setOwnError(true);
      if (s?.totals) setSite(s);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Hämtar statistik…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Opening */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-8 text-primary-foreground shadow-lg sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Er synlighet på d365.se</p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Hur köparna möter er</h2>
        <p className="mt-3 max-w-2xl text-sm opacity-90 sm:text-base">
          Era egna siffror bredvid sajtens totala räckvidd, så att ni ser er andel och vad köparna letar efter just nu.
          Siffrorna uppdateras löpande.
        </p>
        {site && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Besökare 90 d", site.totals.d90.uniqueVisitors],
              ["Sidvisningar 90 d", site.totals.d90.pageViews],
              ["Besökare 30 d", site.totals.d30.uniqueVisitors],
              ["Partnerprofilbesök 90 d", site.salesSummary?.partnerProfileVisits ?? 0],
            ].map(([l, v]) => (
              <div key={l as string} className="rounded-2xl bg-background/10 p-4 backdrop-blur">
                <div className="text-2xl font-bold tabular-nums">{fmt(v as number)}</div>
                <div className="mt-1 text-xs opacity-80">{l}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Own KPIs */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold"><BarChart3 className="h-5 w-5 text-accent" /> Era siffror</h3>
        {own ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={<Eye className="h-4 w-4" />} label="Profilbesök" v30={own.profileVisits30d} v90={own.profileVisits90d} />
            <Kpi icon={<MousePointerClick className="h-4 w-4" />} label="Klick på partnerkort" v30={own.cardClicks30d} v90={own.cardClicks90d} />
            <Kpi icon={<ExternalLink className="h-4 w-4" />} label="Klick till er webbplats" v30={own.websiteClicks30d} v90={own.websiteClicks90d} />
            <Kpi icon={<ListFilter className="h-4 w-4" />} label="Med i partnerfiltrering och jämförelser" v30={own.exposures30d ?? 0} v90={own.exposures90d ?? 0} />
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            {ownError ? "Era egna siffror visas när profilen är publicerad och kopplad till länken." : "Inga siffror ännu."}
          </p>
        )}
      </section>

      {/* Trend */}
      {own && weeks.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h3 className="font-semibold">Utveckling vecka för vecka</h3>
          <p className="mb-4 text-xs text-muted-foreground">Senaste 13 veckorna</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeks} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(w: string) => w.slice(5)} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  labelFormatter={(w: string) => `Vecka från ${w}`}
                />
                <Area type="monotone" dataKey="profileVisits" name="Profilbesök" stroke="hsl(var(--accent))" fill="url(#pv)" strokeWidth={2} />
                <Area type="monotone" dataKey="cardClicks" name="Kortklick" stroke="hsl(var(--primary))" fill="url(#cc)" strokeWidth={2} />
                <Area type="monotone" dataKey="websiteClicks" name="Webbplatsklick" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={2} strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Comparison with totals */}
      {own && site?.salesSummary && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h3 className="flex items-center gap-2 font-semibold"><Users className="h-5 w-5 text-accent" /> Er andel av totalen</h3>
          <p className="mb-5 text-xs text-muted-foreground">Senaste 90 dagarna jämfört med alla partners på d365.se</p>
          <div className="space-y-5">
            <ShareBar label="Profilbesök" own={own.profileVisits90d} total={site.salesSummary.partnerProfileVisits} />
            {site.salesSummary.partnerClicks > 0 && (
              <ShareBar label="Klick till partnerwebbplatser" own={own.websiteClicks90d} total={site.salesSummary.partnerClicks} />
            )}
          </div>
        </section>
      )}

      {/* Business Central */}
      {bc && (
        <section className="space-y-5">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="bg-gradient-to-r from-accent to-primary p-6 text-primary-foreground sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80"><span className="whitespace-nowrap">Business Central</span></p>
              <h3 className="mt-1 text-xl font-bold sm:text-2xl">Er synlighet inom <span className="whitespace-nowrap">Business Central</span></h3>
              <p className="mt-2 max-w-2xl text-sm opacity-90">
                Så många köpare som söker <span className="whitespace-nowrap">Business Central</span> just nu, och hur ofta ni syns i just de filtreringarna.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Sidvisningar BC-sidor 90 d", bc.sitePageViews90d],
                  ["Besökare BC-sidor 90 d", bc.siteUniqueVisitors90d],
                  ["BC-filtreringar 90 d", bc.siteExposures90d],
                  ["Kortklick från BC-sidor 90 d", bc.siteCardClicks90d],
                ].map(([l, v]) => (
                  <div key={l as string} className="rounded-2xl bg-background/10 p-4 backdrop-blur">
                    <div className="text-2xl font-bold tabular-nums">{fmt(v as number)}</div>
                    <div className="mt-1 text-xs opacity-80">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Kpi icon={<ListFilter className="h-4 w-4" />} label="Med i BC-filtreringar" v30={bc.ownExposures30d} v90={bc.ownExposures90d} />
                <Kpi icon={<Eye className="h-4 w-4" />} label="Klick till er profil från BC-sidor" v30={bc.ownVisits30d} v90={bc.ownVisits90d} />
              </div>
              {bc.siteExposures90d > 0 && (
                <div className="mt-6">
                  <ShareBar label="Er andel av alla BC-filtreringar (90 d)" own={bc.ownExposures90d} total={bc.siteExposures90d} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Market */}
      <section>
        <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold"><Globe className="h-5 w-5 text-accent" /> Vad intresserar köparna?</h3>
        <p className="mb-4 text-sm text-muted-foreground">Hela d365.se, senaste 90 dagarna</p>
        <MarketInterestCharts />
      </section>
    </div>
  );
}
