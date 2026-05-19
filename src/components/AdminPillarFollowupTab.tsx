import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";

interface Week { start: string; end: string; label: string; clicks: number; impressions: number; ctr: number; position: number }
interface PillarRow { label: string; path: string; intent: string; weeks: Week[] }
interface Data { generatedAt: string; buckets: { start: string; end: string; label: string }[]; pages: PillarRow[] }

interface Props { token: string | null; onSessionExpired: () => void }

const fmtNum = (n: number) => new Intl.NumberFormat("sv-SE").format(Math.round(n));
const fmtPos = (n: number) => (n > 0 ? n.toFixed(1) : "–");
const fmtPct = (n: number) => (n > 0 ? `${n.toFixed(1)}%` : "–");

/** Trend mellan första och sista veckan. För position: lägre = bättre (inverterat). */
function trend(weeks: Week[], key: "position" | "ctr" | "clicks" | "impressions") {
  const first = weeks[0]?.[key] ?? 0;
  const last = weeks[weeks.length - 1]?.[key] ?? 0;
  if (!first && !last) return { dir: "flat" as const, delta: 0 };
  const delta = last - first;
  const better = key === "position" ? delta < 0 : delta > 0;
  const dir = Math.abs(delta) < 0.05 ? "flat" : better ? "up" : "down";
  return { dir, delta };
}

const TrendCell = ({ dir, delta, suffix = "" }: { dir: "up" | "down" | "flat"; delta: number; suffix?: string }) => {
  if (dir === "flat") return <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><Minus className="h-3 w-3" /> oförändrat</span>;
  const Icon = dir === "up" ? TrendingUp : TrendingDown;
  const color = dir === "up" ? "text-emerald-600" : "text-rose-600";
  return <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}><Icon className="h-3 w-3" />{delta > 0 ? "+" : ""}{delta.toFixed(1)}{suffix}</span>;
};

export default function AdminPillarFollowupTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pillar-seo-followup`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.status === 401) { onSessionExpired(); return; }
      const body = await res.json();
      if (!res.ok) setError(body?.error || "Kunde inte hämta data");
      else setData(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Okänt fel");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Pelarsidor – 6 veckors uppföljning</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Effekt av intent-separationen mellan <code>/</code>, <code>/affarssystem</code>, <code>/erp</code> och <code>/businesscentral</code>.
            Räkna med 2–6 veckor innan ranking och CTR stabiliseras.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Uppdatera
        </Button>
      </CardHeader>
      <CardContent>
        {error && <div className="p-4 bg-rose-50 text-rose-700 rounded mb-4 text-sm">{error}</div>}
        {loading && !data && <div className="p-8 text-center text-muted-foreground">Laddar GSC-data…</div>}

        {data && (
          <div className="space-y-6">
            <div className="text-xs text-muted-foreground">
              Källa: Google Search Console · Mätperiod: {data.buckets[0]?.start} – {data.buckets[data.buckets.length - 1]?.end} (6 veckor)
            </div>

            <div className="admin-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sida</TableHead>
                    <TableHead className="text-right">Position nu</TableHead>
                    <TableHead className="text-right">Position trend</TableHead>
                    <TableHead className="text-right">CTR nu</TableHead>
                    <TableHead className="text-right">CTR trend</TableHead>
                    <TableHead className="text-right">Klick (6v)</TableHead>
                    <TableHead className="text-right">Visningar (6v)</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pages.map((p) => {
                    const last = p.weeks[p.weeks.length - 1];
                    const totalClicks = p.weeks.reduce((a, w) => a + w.clicks, 0);
                    const totalImpr = p.weeks.reduce((a, w) => a + w.impressions, 0);
                    const posTrend = trend(p.weeks, "position");
                    const ctrTrend = trend(p.weeks, "ctr");
                    const sparkData = p.weeks.map((w) => ({ x: w.label, pos: w.position || null }));
                    return (
                      <TableRow key={p.path}>
                        <TableCell>
                          <div className="font-medium">{p.label}</div>
                          <div className="text-xs text-muted-foreground"><code>{p.path}</code> · {p.intent}</div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{fmtPos(last?.position ?? 0)}</TableCell>
                        <TableCell className="text-right"><TrendCell dir={posTrend.dir} delta={-posTrend.delta} /></TableCell>
                        <TableCell className="text-right tabular-nums">{fmtPct(last?.ctr ?? 0)}</TableCell>
                        <TableCell className="text-right"><TrendCell dir={ctrTrend.dir} delta={ctrTrend.delta} suffix="pp" /></TableCell>
                        <TableCell className="text-right tabular-nums">{fmtNum(totalClicks)}</TableCell>
                        <TableCell className="text-right tabular-nums">{fmtNum(totalImpr)}</TableCell>
                        <TableCell className="w-32 h-12">
                          <ResponsiveContainer width="100%" height={40}>
                            <LineChart data={sparkData}>
                              <YAxis hide reversed domain={["dataMin - 1", "dataMax + 1"]} />
                              <Tooltip
                                contentStyle={{ fontSize: 11 }}
                                formatter={(v: number) => [v ? v.toFixed(1) : "–", "Position"]}
                                labelFormatter={(l) => `Vecka ${l}`}
                              />
                              <Line type="monotone" dataKey="pos" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} connectNulls />
                            </LineChart>
                          </ResponsiveContainer>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.pages.map((p) => (
                <Card key={p.path} className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{p.label}</CardTitle>
                    <div className="text-xs text-muted-foreground"><code>{p.path}</code></div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="h-8">Vecka</TableHead>
                          <TableHead className="h-8 text-right">Pos</TableHead>
                          <TableHead className="h-8 text-right">CTR</TableHead>
                          <TableHead className="h-8 text-right">Klick</TableHead>
                          <TableHead className="h-8 text-right">Visn.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {p.weeks.map((w) => (
                          <TableRow key={w.start} className="text-xs">
                            <TableCell className="py-1">
                              <Badge variant="outline" className="font-mono text-[10px]">{w.label}</Badge>
                              <span className="ml-2 text-muted-foreground">{w.start.replace(/-/g, "/")}</span>
                            </TableCell>
                            <TableCell className="py-1 text-right tabular-nums">{fmtPos(w.position)}</TableCell>
                            <TableCell className="py-1 text-right tabular-nums">{fmtPct(w.ctr)}</TableCell>
                            <TableCell className="py-1 text-right tabular-nums">{fmtNum(w.clicks)}</TableCell>
                            <TableCell className="py-1 text-right tabular-nums">{fmtNum(w.impressions)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
