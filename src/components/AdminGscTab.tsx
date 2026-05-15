import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, AlertTriangle, CheckCircle2, FileSearch, TrendingUp } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";

interface Sitemap {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending?: boolean;
  isSitemapsIndex?: boolean;
  warnings?: string;
  errors?: string;
  contents?: { type: string; submitted: string; indexed: string }[];
}
interface Row { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }
interface GscData {
  site: string;
  range: { startDate: string; endDate: string };
  sitemaps: Sitemap[];
  sitemapsError: string | null;
  daily: Row[];
  queries: Row[];
  pages: Row[];
}

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const fmtDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toISOString().slice(0, 10).replace(/-/g, "/");
};
const fmtNum = (n: number) => new Intl.NumberFormat("sv-SE").format(Math.round(n));

export default function AdminGscTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [data, setData] = useState<GscData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gsc-stats`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.status === 401) { onSessionExpired(); return; }
      const body = await res.json();
      if (!res.ok) {
        setError(body?.error || "Kunde inte hämta GSC-data");
      } else {
        setData(body);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Okänt fel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const totals = useMemo(() => {
    if (!data?.daily) return null;
    const t = data.daily.reduce(
      (a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions, position: a.position + r.position * r.impressions, w: a.w + r.impressions }),
      { clicks: 0, impressions: 0, position: 0, w: 0 },
    );
    return {
      clicks: t.clicks,
      impressions: t.impressions,
      ctr: t.impressions ? (t.clicks / t.impressions) * 100 : 0,
      position: t.w ? t.position / t.w : 0,
    };
  }, [data]);

  const chartData = useMemo(
    () => (data?.daily || []).map((r) => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
    })),
    [data],
  );

  const sitemapErrors = (data?.sitemaps || []).reduce(
    (acc, s) => ({ errors: acc.errors + Number(s.errors || 0), warnings: acc.warnings + Number(s.warnings || 0) }),
    { errors: 0, warnings: 0 },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Google Search Console</h2>
          <p className="text-sm text-muted-foreground">
            {data ? `Period: ${fmtDate(data.range.startDate)} – ${fmtDate(data.range.endDate)} · ${data.site}` : "Hämtar data…"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Uppdatera
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium">Kunde inte hämta GSC-data</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Klick (90d)" value={totals ? fmtNum(totals.clicks) : "—"} />
        <KPI label="Visningar (90d)" value={totals ? fmtNum(totals.impressions) : "—"} />
        <KPI label="CTR" value={totals ? `${totals.ctr.toFixed(2)} %` : "—"} />
        <KPI label="Snittposition" value={totals ? totals.position.toFixed(1) : "—"} />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" /> Klick &amp; visningar per dag
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ingen data för perioden.</p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="cClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cImpr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area yAxisId="right" type="monotone" dataKey="impressions" name="Visningar" stroke="hsl(var(--muted-foreground))" fill="url(#cImpr)" />
                  <Area yAxisId="left" type="monotone" dataKey="clicks" name="Klick" stroke="hsl(var(--primary))" fill="url(#cClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sitemaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2"><FileSearch className="h-4 w-4" /> Inskickade sitemaps</span>
            {sitemapErrors.errors > 0 ? (
              <Badge variant="destructive">{sitemapErrors.errors} fel</Badge>
            ) : (
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Inga fel
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.sitemapsError && (
            <p className="text-sm text-destructive mb-3">{data.sitemapsError}</p>
          )}
          {(data?.sitemaps || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Inga sitemaps inskickade ännu.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sitemap</TableHead>
                  <TableHead>Inskickad</TableHead>
                  <TableHead>Senast hämtad</TableHead>
                  <TableHead className="text-right">URL:er</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data!.sitemaps.map((s) => {
                  const submitted = s.contents?.reduce((a, c) => a + Number(c.submitted || 0), 0) || 0;
                  const indexed = s.contents?.reduce((a, c) => a + Number(c.indexed || 0), 0) || 0;
                  const errs = Number(s.errors || 0);
                  const warns = Number(s.warnings || 0);
                  return (
                    <TableRow key={s.path}>
                      <TableCell className="font-mono text-xs max-w-xs truncate" title={s.path}>
                        {s.path.replace(/^https?:\/\/[^/]+/, "")}
                      </TableCell>
                      <TableCell className="text-xs">{fmtDate(s.lastSubmitted || "")}</TableCell>
                      <TableCell className="text-xs">{fmtDate(s.lastDownloaded || "")}</TableCell>
                      <TableCell className="text-right text-xs">
                        {fmtNum(indexed)} / {fmtNum(submitted)}
                      </TableCell>
                      <TableCell>
                        {errs > 0 ? (
                          <Badge variant="destructive">{errs} fel</Badge>
                        ) : warns > 0 ? (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">{warns} varningar</Badge>
                        ) : s.isPending ? (
                          <Badge variant="secondary">Bearbetas</Badge>
                        ) : (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">OK</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Top queries / pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopTable title="Toppsökord (90d)" rows={data?.queries || []} keyLabel="Sökord" />
        <TopTable title="Toppsidor (90d)" rows={data?.pages || []} keyLabel="Sida" stripDomain />
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

function TopTable({ title, rows, keyLabel, stripDomain = false }: { title: string; rows: Row[]; keyLabel: string; stripDomain?: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ingen data.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{keyLabel}</TableHead>
                <TableHead className="text-right">Klick</TableHead>
                <TableHead className="text-right">Visningar</TableHead>
                <TableHead className="text-right">Pos.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 15).map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs max-w-xs truncate" title={r.keys[0]}>
                    {stripDomain ? r.keys[0].replace(/^https?:\/\/[^/]+/, "") : r.keys[0]}
                  </TableCell>
                  <TableCell className="text-right text-xs">{fmtNum(r.clicks)}</TableCell>
                  <TableCell className="text-right text-xs">{fmtNum(r.impressions)}</TableCell>
                  <TableCell className="text-right text-xs">{r.position.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
