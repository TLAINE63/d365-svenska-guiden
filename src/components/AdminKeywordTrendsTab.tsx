import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, RefreshCw, TrendingUp, ArrowUp, ArrowDown, Minus, LineChart as LineIcon } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis, XAxis } from "recharts";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

interface Keyword {
  id: string;
  keyword: string;
  target_url: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

interface WeekRow {
  week_start: string;
  clicks: number;
  impressions: number;
  ctr: number | null;
  position: number | null;
}

interface KeywordTrend extends Keyword {
  series: WeekRow[];
  latest: WeekRow | null;
  previous: WeekRow | null;
  oldest: WeekRow | null;
  week_over_week: {
    position: { current: number; previous: number; change: number } | null;
    clicks: { current: number; previous: number; change: number } | null;
    impressions: { current: number; previous: number; change: number } | null;
    ctr: { current: number; previous: number; change: number } | null;
  };
  period_change: {
    position: { current: number; previous: number; change: number } | null;
    clicks: { current: number; previous: number; change: number } | null;
  };
}

const fmtInt = (n: unknown) =>
  n == null || n === "" ? "—" : new Intl.NumberFormat("sv-SE").format(Math.round(Number(n)));
const fmtPct = (n: unknown) =>
  n == null || n === "" ? "—" : `${(Number(n) * 100).toFixed(1)}%`;
const fmtPos = (n: unknown) =>
  n == null || n === "" ? "—" : Number(n).toFixed(1);
const fmtWeek = (s: string) => {
  const d = new Date(s + "T00:00:00Z");
  const y = d.getUTCFullYear().toString().slice(2);
  const onejan = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const w = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getUTCDay() + 1) / 7);
  return `v${w}/${y}`;
};

function DeltaCell({
  delta,
  isPosition = false,
}: {
  delta: { current: number; previous: number; change: number } | null;
  isPosition?: boolean;
}) {
  if (!delta) return <span className="text-muted-foreground">—</span>;
  const change = delta.change;
  // För position: lägre = bättre (negativ change = bra → grön)
  const isGood = isPosition ? change < 0 : change > 0;
  const isNeutral = Math.abs(change) < 0.05;
  const Icon = isNeutral ? Minus : change > 0 ? ArrowUp : ArrowDown;
  const cls = isNeutral
    ? "text-muted-foreground"
    : isGood
    ? "text-emerald-600"
    : "text-red-600";
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${cls}`}>
      <Icon className="h-3 w-3" />
      {isPosition
        ? `${change > 0 ? "+" : ""}${change.toFixed(1)}`
        : `${change > 0 ? "+" : ""}${new Intl.NumberFormat("sv-SE").format(Math.round(change))}`}
    </span>
  );
}

export default function AdminKeywordTrendsTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<KeywordTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [snapshotting, setSnapshotting] = useState(false);
  const [editing, setEditing] = useState<Partial<Keyword> | null>(null);
  const [saving, setSaving] = useState(false);
  const [weeks, setWeeks] = useState(12);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-keywords-weekly`;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const callApi = async (body: unknown) => {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      onSessionExpired();
      throw new Error("Sessionen har gått ut");
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Något gick fel");
    return data;
  };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await callApi({ action: "trends", weeks });
      setKeywords(data.keywords || []);
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token, weeks]);

  const save = async () => {
    if (!editing?.keyword?.trim()) {
      toast({ title: "Sökord krävs", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await callApi({ action: "save", ...editing });
      toast({ title: "Sparat" });
      setEditing(null);
      load();
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ta bort sökordet och all spårningshistorik?")) return;
    try {
      await callApi({ action: "delete", id });
      toast({ title: "Borttaget" });
      load();
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    }
  };

  const snapshot = async () => {
    setSnapshotting(true);
    try {
      const data = await callApi({ action: "snapshot", weeks });
      toast({
        title: "Snapshot klar",
        description: `${data.keywords_processed} sökord, ${data.weeks_inserted} veckorader uppdaterade${
          data.errors?.length ? `. ${data.errors.length} fel.` : "."
        }`,
      });
      load();
    } catch (err: any) {
      toast({ title: "Fel vid snapshot", description: err.message, variant: "destructive" });
    } finally {
      setSnapshotting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Spårning av nyckelord — vecka för vecka
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Position, klick, visningar och CTR per vecka från Google Search Console.
                Lägg till sökord du vill övervaka, kör snapshot för att hämta de senaste {weeks} veckorna.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Period</Label>
              <select
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value={4}>4 veckor</option>
                <option value={8}>8 veckor</option>
                <option value={12}>12 veckor</option>
                <option value={26}>26 veckor</option>
              </select>
              <Button variant="outline" size="sm" onClick={snapshot} disabled={snapshotting}>
                {snapshotting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                Hämta snapshot
              </Button>
              <Button size="sm" onClick={() => setEditing({ keyword: "", target_url: "", notes: "", is_active: true })}>
                <Plus className="h-4 w-4 mr-1" /> Nytt sökord
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar trender…
        </p>
      ) : keywords.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            Inga sökord spåras ännu. Lägg till ditt första med <strong>Nytt sökord</strong> och kör sedan <strong>Hämta snapshot</strong>.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b">
                  <tr className="text-left">
                    <th className="py-2 pr-3">Sökord</th>
                    <th className="py-2 pr-3 text-right">Position</th>
                    <th className="py-2 pr-3 text-right">Δ vecka</th>
                    <th className="py-2 pr-3 text-right">Klick</th>
                    <th className="py-2 pr-3 text-right">Δ vecka</th>
                    <th className="py-2 pr-3 text-right">CTR</th>
                    <th className="py-2 pr-3 text-right">Visningar</th>
                    <th className="py-2 pr-3 w-[140px]">Trend</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((kw) => {
                    const chartData = kw.series.map((s) => ({
                      week: fmtWeek(s.week_start),
                      position: s.position,
                      clicks: s.clicks,
                    }));
                    return (
                      <tr key={kw.id} className={`border-b last:border-0 ${!kw.is_active ? "opacity-50" : ""}`}>
                        <td className="py-2 pr-3">
                          <div className="font-medium">{kw.keyword}</div>
                          {kw.target_url && (
                            <div className="text-xs text-muted-foreground truncate max-w-[260px]" title={kw.target_url}>
                              {kw.target_url}
                            </div>
                          )}
                          {!kw.is_active && <Badge variant="outline" className="text-[10px] mt-1">Pausad</Badge>}
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums font-medium">
                          {fmtPos(kw.latest?.position)}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          <DeltaCell delta={kw.week_over_week.position} isPosition />
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmtInt(kw.latest?.clicks)}</td>
                        <td className="py-2 pr-3 text-right">
                          <DeltaCell delta={kw.week_over_week.clicks} />
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmtPct(kw.latest?.ctr)}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{fmtInt(kw.latest?.impressions)}</td>
                        <td className="py-2 pr-3">
                          {chartData.length > 1 ? (
                            <div className="h-[40px] w-[140px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
                                  <YAxis reversed domain={["auto", "auto"]} hide />
                                  <XAxis dataKey="week" hide />
                                  <Tooltip
                                    contentStyle={{ borderRadius: 6, fontSize: 11, padding: "4px 8px" }}
                                    formatter={(v: any, name) => [name === "position" ? fmtPos(v) : fmtInt(v), name === "position" ? "Pos" : "Klick"]}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="position"
                                    stroke="hsl(217, 91%, 60%)"
                                    strokeWidth={2}
                                    dot={false}
                                    connectNulls
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <LineIcon className="h-3 w-3" /> behöver mer data
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-right whitespace-nowrap">
                          <Button variant="ghost" size="sm" onClick={() => setEditing(kw)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => remove(kw.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Δ vecka = förändring vs. föregående vecka. För position betyder lägre värde bättre ranking (grön = uppåt på Google).
              Källa: Google Search Console (sc-domain:d365.se), 2–3 dagars datafördröjning.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Redigera sökord" : "Nytt sökord att spåra"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label>Sökord *</Label>
                <Input
                  value={editing.keyword || ""}
                  onChange={(e) => setEditing({ ...editing, keyword: e.target.value })}
                  placeholder="t.ex. business central pris"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Matchas exakt mot sökfrågor i Google Search Console (gemener).
                </p>
              </div>
              <div>
                <Label>Mål-URL (valfritt)</Label>
                <Input
                  value={editing.target_url || ""}
                  onChange={(e) => setEditing({ ...editing, target_url: e.target.value })}
                  placeholder="https://d365.se/businesscentral"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Om angiven filtreras GSC-data till just denna sida. Lämna tom för hela domänen.
                </p>
              </div>
              <div>
                <Label>Anteckning</Label>
                <Input
                  value={editing.notes || ""}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  placeholder="t.ex. konverteringskeyword för BC-pelaren"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editing.is_active !== false}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
                <Label>Aktiv (hämta data vid snapshot)</Label>
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
