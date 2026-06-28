import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, ArrowUp, ArrowDown, Minus, ExternalLink, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis } from "recharts";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

interface Row {
  id: string;
  keyword: string;
  target_url: string | null;
  notes: string | null;
  current_position: number | null;
  current_url: string | null;
  search_volume: number | null;
  estimated_traffic: number | null;
  cpc: number | null;
  last_snapshot: string | null;
  delta_1d: number | null;
  delta_7d: number | null;
  delta_30d: number | null;
  series: { d: string; p: number | null; t: number | null }[];
}

const fmtPos = (n: number | null) => n == null ? "—" : n.toFixed(1).replace(/\.0$/, "");
const fmtNum = (n: number | null) => n == null ? "—" : new Intl.NumberFormat("sv-SE").format(Math.round(n));
const fmtKr = (n: number | null) => n == null ? "—" : `${n.toFixed(2).replace(".", ",")} kr`;

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta == null) return <span className="text-muted-foreground text-xs">—</span>;
  if (Math.abs(delta) < 0.5) {
    return <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Minus className="h-3 w-3" /> 0</span>;
  }
  // Lägre position = bättre. Negativ delta = uppåt i ranking.
  const isUp = delta < 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
      {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {Math.abs(delta).toFixed(1).replace(/\.0$/, "")}
    </span>
  );
}

function Sparkline({ series }: { series: Row["series"] }) {
  const data = series.filter((s) => s.p != null).map((s) => ({ d: s.d, p: Number(s.p) }));
  if (data.length < 2) return <div className="text-xs text-muted-foreground">Inte tillräckligt med data</div>;
  return (
    <div className="h-10 w-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis hide reversed domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ fontSize: 11, padding: 4 }}
            labelFormatter={(d) => String(d)}
            formatter={(v: any) => [`pos ${v}`, ""]}
          />
          <Line type="monotone" dataKey="p" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AdminSemrushDailyTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [snapping, setSnapping] = useState(false);
  const [days, setDays] = useState<number>(30);
  const [filter, setFilter] = useState("");
  const [lastInfo, setLastInfo] = useState<string>("");

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/semrush-daily-rankings`;
  const headers = useMemo(() => ({
    "Authorization": `Bearer ${token || ""}`,
    "Content-Type": "application/json",
    "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
  }), [token]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ action: "list", days }) });
      if (res.status === 401) { onSessionExpired(); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte hämta data");
      setRows(data.rows || []);
      if (data.totalSnapshots === 0) {
        setLastInfo("Inga snapshots ännu — klicka \"Hämta nu\" för att skapa dagens.");
      } else {
        const latest = (data.rows || []).map((r: Row) => r.last_snapshot).filter(Boolean).sort().pop();
        setLastInfo(latest ? `Senaste snapshot: ${latest}` : "");
      }
    } catch (e: any) {
      toast({ title: "Fel", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function snapshot() {
    setSnapping(true);
    try {
      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ action: "snapshot" }) });
      if (res.status === 401) { onSessionExpired(); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Snapshot misslyckades");
      toast({
        title: "Snapshot klar",
        description: `${data.with_position}/${data.inserted} nyckelord har position i SE-databasen.${data.missing?.length ? ` Saknas i top-500: ${data.missing.slice(0, 5).join(", ")}${data.missing.length > 5 ? "…" : ""}` : ""}`,
      });
      await load();
    } catch (e: any) {
      toast({ title: "Fel", description: e.message, variant: "destructive" });
    } finally {
      setSnapping(false);
    }
  }

  useEffect(() => { if (token) load(); /* eslint-disable-next-line */ }, [token, days]);

  const visible = rows.filter((r) => !filter || r.keyword.toLowerCase().includes(filter.toLowerCase()));
  const ranked = visible.filter((r) => r.current_position != null).length;
  const top10 = visible.filter((r) => r.current_position != null && r.current_position <= 10).length;
  const top3 = visible.filter((r) => r.current_position != null && r.current_position <= 3).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-lg font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Semrush — daglig rankning</h2>
            <p className="text-sm text-muted-foreground">Position, estimerad trafik & trend för dina målsökord (SE-databasen, domain_organic på d365.se). {lastInfo}</p>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Period</label>
            <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dagar</SelectItem>
                <SelectItem value="14">14 dagar</SelectItem>
                <SelectItem value="30">30 dagar</SelectItem>
                <SelectItem value="60">60 dagar</SelectItem>
                <SelectItem value="90">90 dagar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Sök</label>
            <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="filtrera nyckelord…" className="w-56" />
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button onClick={snapshot} disabled={snapping}>
            {snapping ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
            Hämta nu
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Bevakade</div><div className="text-2xl font-bold">{visible.length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Rankade (top 100)</div><div className="text-2xl font-bold">{ranked}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Top 10</div><div className="text-2xl font-bold text-emerald-600">{top10}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Top 3</div><div className="text-2xl font-bold text-emerald-700">{top3}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="admin-table-wrap overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nyckelord</TableHead>
                  <TableHead className="text-right">Position</TableHead>
                  <TableHead className="text-right">1d</TableHead>
                  <TableHead className="text-right">7d</TableHead>
                  <TableHead className="text-right">30d</TableHead>
                  <TableHead className="text-right">Volym/mån</TableHead>
                  <TableHead className="text-right">Est. trafik</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead>Trend ({days}d)</TableHead>
                  <TableHead>Sida</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8"><Loader2 className="h-4 w-4 animate-spin inline" /></TableCell></TableRow>
                ) : visible.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    Inga bevakade nyckelord. Lägg till dem under "Nyckelord-trender".
                  </TableCell></TableRow>
                ) : visible.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{r.keyword}</div>
                      {r.target_url && <div className="text-xs text-muted-foreground truncate max-w-[260px]">{r.target_url}</div>}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.current_position == null
                        ? <Badge variant="outline" className="text-muted-foreground">ej i top 500</Badge>
                        : <span className={`font-semibold ${r.current_position <= 3 ? "text-emerald-700" : r.current_position <= 10 ? "text-emerald-600" : r.current_position <= 20 ? "text-amber-600" : "text-rose-600"}`}>{fmtPos(r.current_position)}</span>}
                    </TableCell>
                    <TableCell className="text-right"><DeltaBadge delta={r.delta_1d} /></TableCell>
                    <TableCell className="text-right"><DeltaBadge delta={r.delta_7d} /></TableCell>
                    <TableCell className="text-right"><DeltaBadge delta={r.delta_30d} /></TableCell>
                    <TableCell className="text-right">{fmtNum(r.search_volume)}</TableCell>
                    <TableCell className="text-right">{fmtNum(r.estimated_traffic)}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{fmtKr(r.cpc)}</TableCell>
                    <TableCell><Sparkline series={r.series} /></TableCell>
                    <TableCell>
                      {r.current_url ? (
                        <a href={r.current_url.startsWith("http") ? r.current_url : `https://${r.current_url}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          öppna <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Källa: Semrush <code>domains/domain_organic</code> (SE, top 500). Estimerad trafik är Semrush prognos, inte faktiska klick — för riktiga klick, se Search Console-fliken.
            Position lägre = bättre (1 = topplacering). Snapshot körs dagligen via cron och kan triggas manuellt med "Hämta nu".
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
