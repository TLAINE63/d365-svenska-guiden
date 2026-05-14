import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Swords, ArrowDown, ArrowUp, Minus } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

interface Stat {
  id: string;
  domain: string;
  month: string; // YYYY-MM-DD
  organic_traffic: number | null;
  organic_keywords: number | null;
  authority_score: number | null;
  backlinks: number | null;
  referring_domains: number | null;
}

interface CompareResp {
  domains: string[];
  months: string[];
  series: Array<Record<string, number | string | null>>;
}

const PRIMARY = "d365.se";
const COMPETITOR_DEFAULT = "businesswith.se";
const PRIMARY_COLOR = "hsl(217, 91%, 60%)";    // blue
const COMPETITOR_COLOR = "hsl(24, 95%, 53%)";  // orange

const fmtMonth = (ym: string) => {
  const [y, m] = ym.split("-");
  return `${y.slice(2)}/${m}`;
};
const fmtNum = (n: unknown) =>
  n == null || n === "" ? "—" : new Intl.NumberFormat("sv-SE").format(Number(n));
const fmtScore = (n: unknown) => (n == null || n === "" ? "—" : Number(n).toFixed(0));

const empty = (domain: string) => ({
  domain,
  month: new Date().toISOString().slice(0, 7),
  organic_traffic: null as number | null,
  organic_keywords: null as number | null,
  authority_score: null as number | null,
  backlinks: null as number | null,
  referring_domains: null as number | null,
});

export default function AdminCompetitorTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [competitor, setCompetitor] = useState<string>(COMPETITOR_DEFAULT);
  const [months, setMonths] = useState<number>(12);
  const [data, setData] = useState<CompareResp | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-semrush-stats`;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const headers = () => ({
    Authorization: `Bearer ${token}`,
    apikey,
    "Content-Type": "application/json",
  });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const domains = `${PRIMARY},${competitor}`;
      const [r1, r2] = await Promise.all([
        fetch(`${baseUrl}?action=compare&domains=${encodeURIComponent(domains)}&months=${months}`, { headers: headers() }),
        fetch(`${baseUrl}?action=list&domain=${encodeURIComponent(competitor)}`, { headers: headers() }),
      ]);
      if (r1.status === 401 || r2.status === 401) return onSessionExpired();
      const d1: CompareResp = await r1.json();
      const d2 = await r2.json();
      setData(d1);
      setStats(d2.stats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token, months, competitor]);

  const latest = useMemo(() => {
    if (!data?.series.length) return null;
    return data.series[data.series.length - 1];
  }, [data]);

  const earliest = useMemo(() => {
    if (!data?.series.length) return null;
    // Find first month with primary or competitor data
    for (const row of data.series) {
      if (row[`${PRIMARY}__keywords`] != null || row[`${competitor}__keywords`] != null) return row;
    }
    return data.series[0];
  }, [data, competitor]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}?action=save`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(editing),
      });
      if (res.status === 401) return onSessionExpired();
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Kunde inte spara");
      toast({ title: "Sparat" });
      setEditing(null);
      load();
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const renderDelta = (current: unknown, base: unknown) => {
    if (current == null || base == null || current === "" || base === "") return null;
    const c = Number(current);
    const b = Number(base);
    if (b === 0) return null;
    const pct = ((c - b) / b) * 100;
    const Icon = pct > 0 ? ArrowUp : pct < 0 ? ArrowDown : Minus;
    const cls = pct > 0 ? "text-emerald-600" : pct < 0 ? "text-red-600" : "text-muted-foreground";
    return (
      <span className={`inline-flex items-center gap-1 text-xs ${cls}`}>
        <Icon className="h-3 w-3" />
        {pct > 0 ? "+" : ""}{pct.toFixed(0)}%
      </span>
    );
  };

  const Kpi = ({ label, primary, competitorVal, isScore = false }: { label: string; primary: unknown; competitorVal: unknown; isScore?: boolean }) => (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">{label}</p>
      <div className="space-y-3">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-medium" style={{ color: PRIMARY_COLOR }}>{PRIMARY}</span>
            <span className="text-xl font-bold tabular-nums">{isScore ? fmtScore(primary) : fmtNum(primary)}</span>
          </div>
          {earliest && renderDelta(primary, earliest[`${PRIMARY}__${label.toLowerCase().includes("trafik") ? "traffic" : label.toLowerCase().includes("sökord") ? "keywords" : label.toLowerCase().includes("authority") ? "authority" : label.toLowerCase().includes("backlink") ? "backlinks" : "refdomains"}`])}
        </div>
        <div className="border-t pt-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-medium" style={{ color: COMPETITOR_COLOR }}>{competitor}</span>
            <span className="text-xl font-bold tabular-nums">{isScore ? fmtScore(competitorVal) : fmtNum(competitorVal)}</span>
          </div>
          {earliest && renderDelta(competitorVal, earliest[`${competitor}__${label.toLowerCase().includes("trafik") ? "traffic" : label.toLowerCase().includes("sökord") ? "keywords" : label.toLowerCase().includes("authority") ? "authority" : label.toLowerCase().includes("backlink") ? "backlinks" : "refdomains"}`])}
        </div>
      </div>
    </div>
  );

  const chartData = useMemo(() => {
    return (data?.series || []).map((row) => ({
      month: fmtMonth(row.month as string),
      [`${PRIMARY} trafik`]: row[`${PRIMARY}__traffic`] ?? null,
      [`${competitor} trafik`]: row[`${competitor}__traffic`] ?? null,
      [`${PRIMARY} sökord`]: row[`${PRIMARY}__keywords`] ?? null,
      [`${competitor} sökord`]: row[`${competitor}__keywords`] ?? null,
      [`${PRIMARY} AS`]: row[`${PRIMARY}__authority`] ?? null,
      [`${competitor} AS`]: row[`${competitor}__authority`] ?? null,
      [`${PRIMARY} backlinks`]: row[`${PRIMARY}__backlinks`] ?? null,
      [`${competitor} backlinks`]: row[`${competitor}__backlinks`] ?? null,
    }));
  }, [data, competitor]);

  const Chart = ({ title, primaryKey, competitorKey }: { title: string; primaryKey: string; competitorKey: string }) => (
    <Card>
      <CardContent className="pt-6">
        <h4 className="text-sm font-semibold mb-3">{title}</h4>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => new Intl.NumberFormat("sv-SE", { notation: "compact" }).format(v)} />
              <Tooltip formatter={(v: any) => fmtNum(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey={primaryKey} stroke={PRIMARY_COLOR} strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
              <Line type="monotone" dataKey={competitorKey} stroke={COMPETITOR_COLOR} strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                Konkurrentjämförelse — d365.se vs konkurrent
              </h3>
              <p className="text-sm text-muted-foreground">
                Manuell Semrush-data per månad och domän. Källa: Semrush (databas SE). Authority Score och backlinks fylls i manuellt.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Label htmlFor="competitor" className="text-xs">Konkurrent</Label>
                <Input
                  id="competitor"
                  value={competitor}
                  onChange={(e) => setCompetitor(e.target.value.trim().toLowerCase())}
                  className="w-48 h-9"
                  placeholder="t.ex. businesswith.se"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs">Period</Label>
                <Select value={String(months)} onValueChange={(v) => setMonths(Number(v))}>
                  <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 månader</SelectItem>
                    <SelectItem value="12">12 månader</SelectItem>
                    <SelectItem value="18">18 månader</SelectItem>
                    <SelectItem value="24">24 månader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setEditing(empty(competitor))} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Ny månad
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">Laddar…</p>
      ) : (
        <>
          {/* KPIs (latest month) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <Kpi label="Organisk trafik / mån" primary={latest?.[`${PRIMARY}__traffic`]} competitorVal={latest?.[`${competitor}__traffic`]} />
            <Kpi label="Rankande sökord" primary={latest?.[`${PRIMARY}__keywords`]} competitorVal={latest?.[`${competitor}__keywords`]} />
            <Kpi label="Authority Score" primary={latest?.[`${PRIMARY}__authority`]} competitorVal={latest?.[`${competitor}__authority`]} isScore />
            <Kpi label="Backlinks" primary={latest?.[`${PRIMARY}__backlinks`]} competitorVal={latest?.[`${competitor}__backlinks`]} />
            <Kpi label="Refererande domäner" primary={latest?.[`${PRIMARY}__refdomains`]} competitorVal={latest?.[`${competitor}__refdomains`]} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Chart title="Estimerad organisk trafik / månad" primaryKey={`${PRIMARY} trafik`} competitorKey={`${competitor} trafik`} />
            <Chart title="Rankande sökord" primaryKey={`${PRIMARY} sökord`} competitorKey={`${competitor} sökord`} />
            <Chart title="Authority Score" primaryKey={`${PRIMARY} AS`} competitorKey={`${competitor} AS`} />
            <Chart title="Backlinks" primaryKey={`${PRIMARY} backlinks`} competitorKey={`${competitor} backlinks`} />
          </div>

          {/* Competitor data table */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Badge variant="outline" style={{ borderColor: COMPETITOR_COLOR, color: COMPETITOR_COLOR }}>{competitor}</Badge>
                  Månadsdata
                </h4>
                <span className="text-xs text-muted-foreground">{stats.length} rader</span>
              </div>
              {stats.length === 0 ? (
                <p className="text-sm text-muted-foreground">Ingen data för {competitor} ännu. Lägg till en månad ovan.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-muted-foreground border-b">
                      <tr className="text-left">
                        <th className="py-2 pr-3">Månad</th>
                        <th className="py-2 pr-3 text-right">Trafik</th>
                        <th className="py-2 pr-3 text-right">Sökord</th>
                        <th className="py-2 pr-3 text-right">AS</th>
                        <th className="py-2 pr-3 text-right">Backlinks</th>
                        <th className="py-2 pr-3 text-right">Ref. domäner</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((r) => (
                        <tr key={r.id} className="border-b last:border-0">
                          <td className="py-2 pr-3 font-medium">{r.month.slice(0, 7).replace("-", "/")}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{fmtNum(r.organic_traffic)}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{fmtNum(r.organic_keywords)}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{fmtScore(r.authority_score)}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{fmtNum(r.backlinks)}</td>
                          <td className="py-2 pr-3 text-right tabular-nums">{fmtNum(r.referring_domains)}</td>
                          <td className="py-2 text-right">
                            <Button variant="ghost" size="sm" onClick={() => setEditing({ ...r, month: r.month.slice(0, 7) })}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Semrush-månad</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Domän</Label>
                <Input value={editing.domain} onChange={(e) => setEditing({ ...editing, domain: e.target.value.trim().toLowerCase() })} />
              </div>
              <div>
                <Label>Månad (YYYY-MM)</Label>
                <Input value={editing.month} onChange={(e) => setEditing({ ...editing, month: e.target.value })} placeholder="2026-04" />
              </div>
              <div>
                <Label>Organisk trafik / mån</Label>
                <Input type="number" value={editing.organic_traffic ?? ""} onChange={(e) => setEditing({ ...editing, organic_traffic: e.target.value === "" ? null : Number(e.target.value) })} />
              </div>
              <div>
                <Label>Rankande sökord</Label>
                <Input type="number" value={editing.organic_keywords ?? ""} onChange={(e) => setEditing({ ...editing, organic_keywords: e.target.value === "" ? null : Number(e.target.value) })} />
              </div>
              <div>
                <Label>Authority Score</Label>
                <Input type="number" step="0.1" value={editing.authority_score ?? ""} onChange={(e) => setEditing({ ...editing, authority_score: e.target.value === "" ? null : Number(e.target.value) })} />
              </div>
              <div>
                <Label>Backlinks</Label>
                <Input type="number" value={editing.backlinks ?? ""} onChange={(e) => setEditing({ ...editing, backlinks: e.target.value === "" ? null : Number(e.target.value) })} />
              </div>
              <div>
                <Label>Refererande domäner</Label>
                <Input type="number" value={editing.referring_domains ?? ""} onChange={(e) => setEditing({ ...editing, referring_domains: e.target.value === "" ? null : Number(e.target.value) })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>Avbryt</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
