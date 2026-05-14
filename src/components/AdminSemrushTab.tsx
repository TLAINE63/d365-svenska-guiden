import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ExternalLink, TrendingUp, Eye } from "lucide-react";

interface SemrushStat {
  id: string;
  month: string; // YYYY-MM-DD
  organic_traffic: number | null;
  organic_keywords: number | null;
  authority_score: number | null;
  backlinks: number | null;
  referring_domains: number | null;
  top_keywords: { keyword: string; position?: number; volume?: number }[];
  top_pages: { url: string; traffic?: number; keywords?: number }[];
  notes: string | null;
}

interface PartnerViewRow {
  slug: string;
  name: string;
  total: number;
  last_view: string;
  by_month: number[];
}

interface PartnerViewsResponse {
  months: string[];
  rows: PartnerViewRow[];
  totals: number[];
}

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const empty = (): Partial<SemrushStat> => ({
  month: new Date().toISOString().slice(0, 7),
  organic_traffic: null,
  organic_keywords: null,
  authority_score: null,
  backlinks: null,
  referring_domains: null,
  top_keywords: [],
  top_pages: [],
  notes: "",
});

const fmtMonth = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
};
const fmtNum = (n: number | null | undefined) =>
  n == null ? "—" : new Intl.NumberFormat("sv-SE").format(n);

export default function AdminSemrushTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [stats, setStats] = useState<SemrushStat[]>([]);
  const [views, setViews] = useState<PartnerViewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<SemrushStat> | null>(null);
  const [topKwJson, setTopKwJson] = useState("");
  const [topPgJson, setTopPgJson] = useState("");
  const [monthsRange, setMonthsRange] = useState<number>(6);

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
      const [r1, r2] = await Promise.all([
        fetch(`${baseUrl}?action=list&domain=d365.se`, { headers: headers() }),
        fetch(`${baseUrl}?action=partner-views&months=${monthsRange}`, { headers: headers() }),
      ]);
      if (r1.status === 401 || r2.status === 401) return onSessionExpired();
      const d1 = await r1.json();
      const d2 = await r2.json();
      setStats(d1.stats || []);
      setViews(d2 || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token, monthsRange]);

  const openEdit = (row?: SemrushStat) => {
    const e = row ? { ...row, month: row.month.slice(0, 7) } : empty();
    setEditing(e);
    setTopKwJson(JSON.stringify(row?.top_keywords || [], null, 2));
    setTopPgJson(JSON.stringify(row?.top_pages || [], null, 2));
  };

  const save = async () => {
    if (!editing) return;
    let topKeywords: any = [];
    let topPages: any = [];
    try {
      topKeywords = topKwJson.trim() ? JSON.parse(topKwJson) : [];
      topPages = topPgJson.trim() ? JSON.parse(topPgJson) : [];
    } catch {
      toast({ title: "Ogiltig JSON", description: "Top keywords/pages måste vara giltig JSON-array", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}?action=save`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ ...editing, domain: 'd365.se', top_keywords: topKeywords, top_pages: topPages }),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte spara");
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
    if (!confirm("Ta bort denna månads Semrush-statistik?")) return;
    try {
      const res = await fetch(`${baseUrl}?action=delete&id=${id}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (res.status === 401) return onSessionExpired();
      if (!res.ok) throw new Error("Kunde inte ta bort");
      toast({ title: "Borttagen" });
      load();
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    }
  };

  const latest = stats[0];
  const previous = stats[1];
  const trafficDelta = useMemo(() => {
    if (!latest?.organic_traffic || !previous?.organic_traffic) return null;
    const diff = latest.organic_traffic - previous.organic_traffic;
    const pct = (diff / previous.organic_traffic) * 100;
    return { diff, pct };
  }, [latest, previous]);

  return (
    <div className="space-y-6">
      {/* ============ TOTAL DOMAIN STATS ============ */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-sky-500" />
                Semrush — månadsvis dom&auml;n-statistik
              </h3>
              <p className="text-sm text-muted-foreground">
                Manuell uppföljning av d365.se totalt: organisk trafik, sökord, authority score, backlinks och topplistor.
              </p>
            </div>
            <Button onClick={() => openEdit()}>
              <Plus className="h-4 w-4 mr-2" /> Ny månad
            </Button>
          </div>

          {latest && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <KpiCard label="Organisk trafik" value={fmtNum(latest.organic_traffic)} sub={
                trafficDelta ? `${trafficDelta.diff >= 0 ? "+" : ""}${fmtNum(trafficDelta.diff)} (${trafficDelta.pct.toFixed(1)}%)` : "—"
              } subColor={trafficDelta ? (trafficDelta.diff >= 0 ? "text-emerald-600" : "text-red-600") : ""} />
              <KpiCard label="Sökord" value={fmtNum(latest.organic_keywords)} />
              <KpiCard label="Authority Score" value={latest.authority_score != null ? `${latest.authority_score}` : "—"} />
              <KpiCard label="Backlinks" value={fmtNum(latest.backlinks)} />
              <KpiCard label="Refererande dom&auml;ner" value={fmtNum(latest.referring_domains)} />
            </div>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Laddar…</p>
          ) : stats.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Ingen Semrush-data ännu. Lägg till din första månad — du hittar siffrorna i Semrush "Domain Overview" för d365.se.
            </p>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Månad</TableHead>
                    <TableHead className="text-right">Trafik</TableHead>
                    <TableHead className="text-right">Sökord</TableHead>
                    <TableHead className="text-right">AS</TableHead>
                    <TableHead className="text-right">Backlinks</TableHead>
                    <TableHead className="text-right">Ref. dom.</TableHead>
                    <TableHead className="text-right">Topplistor</TableHead>
                    <TableHead className="text-right">Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="whitespace-nowrap font-medium">{fmtMonth(s.month)}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmtNum(s.organic_traffic)}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmtNum(s.organic_keywords)}</TableCell>
                      <TableCell className="text-right tabular-nums">{s.authority_score ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmtNum(s.backlinks)}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmtNum(s.referring_domains)}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        {(s.top_keywords?.length || 0)} kw / {(s.top_pages?.length || 0)} sidor
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(s.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {latest && (latest.top_keywords?.length > 0 || latest.top_pages?.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              {latest.top_keywords?.length > 0 && (
                <div className="border border-border rounded-lg p-3">
                  <h4 className="text-sm font-semibold mb-2">Top keywords ({fmtMonth(latest.month)})</h4>
                  <ul className="space-y-1 text-sm">
                    {latest.top_keywords.slice(0, 10).map((k, i) => (
                      <li key={i} className="flex justify-between gap-2">
                        <span className="truncate">{k.keyword}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {k.position != null ? `#${k.position}` : ""}{k.volume != null ? ` · ${fmtNum(k.volume)}/mån` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {latest.top_pages?.length > 0 && (
                <div className="border border-border rounded-lg p-3">
                  <h4 className="text-sm font-semibold mb-2">Top pages ({fmtMonth(latest.month)})</h4>
                  <ul className="space-y-1 text-sm">
                    {latest.top_pages.slice(0, 10).map((p, i) => (
                      <li key={i} className="flex justify-between gap-2">
                        <span className="truncate">{p.url}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {p.traffic != null ? `${fmtNum(p.traffic)} bes.` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============ PARTNER PROFILE VIEWS ============ */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5 text-emerald-500" />
                Partner-profilsidor — bes&ouml;k
              </h3>
              <p className="text-sm text-muted-foreground">
                Vilka partnerprofiler bes&ouml;ks p&aring; d365.se och hur ofta. Sorterad fr&aring;n mest bes&ouml;kt.
              </p>
            </div>
            <Select value={String(monthsRange)} onValueChange={(v) => setMonthsRange(Number(v))}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Senaste 3 m&aring;naderna</SelectItem>
                <SelectItem value="6">Senaste 6 m&aring;naderna</SelectItem>
                <SelectItem value="12">Senaste 12 m&aring;naderna</SelectItem>
                <SelectItem value="24">Senaste 24 m&aring;naderna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!views || views.rows.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Inga registrerade profil-bes&ouml;k i perioden.
            </p>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="admin-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead className="text-right">Totalt</TableHead>
                    {views.months.map((m) => (
                      <TableHead key={m} className="text-right whitespace-nowrap">{fmtMonth(`${m}-01`)}</TableHead>
                    ))}
                    <TableHead className="text-right whitespace-nowrap">Senaste bes&ouml;k</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {views.rows.map((r) => (
                    <TableRow key={r.slug}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">{fmtNum(r.total)}</TableCell>
                      {r.by_month.map((n, i) => (
                        <TableCell key={i} className="text-right tabular-nums text-sm">
                          {n > 0 ? <Badge variant="outline">{n}</Badge> : <span className="text-muted-foreground">0</span>}
                        </TableCell>
                      ))}
                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        {fmtDate(r.last_view)}
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={`/partners/${r.slug}/`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:underline text-sm"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {views.totals && (
                  <tfoot>
                    <TableRow className="bg-muted/40 font-semibold">
                      <TableCell>Totalt</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {fmtNum(views.totals.reduce((a, b) => a + b, 0))}
                      </TableCell>
                      {views.totals.map((t, i) => (
                        <TableCell key={i} className="text-right tabular-nums">{fmtNum(t)}</TableCell>
                      ))}
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  </tfoot>
                )}
              </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============ EDIT DIALOG ============ */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Redigera m&aring;nad" : "Ny Semrush-m&aring;nad"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>M&aring;nad *</Label>
                  <Input type="month"
                    value={(editing.month || "").slice(0, 7)}
                    onChange={(e) => setEditing({ ...editing, month: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Organisk trafik</Label>
                  <Input type="number" value={editing.organic_traffic ?? ""}
                    onChange={(e) => setEditing({ ...editing, organic_traffic: e.target.value === "" ? null : Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Sökord (totalt)</Label>
                  <Input type="number" value={editing.organic_keywords ?? ""}
                    onChange={(e) => setEditing({ ...editing, organic_keywords: e.target.value === "" ? null : Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Authority Score (0–100)</Label>
                  <Input type="number" step="0.1" value={editing.authority_score ?? ""}
                    onChange={(e) => setEditing({ ...editing, authority_score: e.target.value === "" ? null : Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Backlinks</Label>
                  <Input type="number" value={editing.backlinks ?? ""}
                    onChange={(e) => setEditing({ ...editing, backlinks: e.target.value === "" ? null : Number(e.target.value) })} />
                </div>
                <div className="col-span-2">
                  <Label>Refererande dom&auml;ner</Label>
                  <Input type="number" value={editing.referring_domains ?? ""}
                    onChange={(e) => setEditing({ ...editing, referring_domains: e.target.value === "" ? null : Number(e.target.value) })} />
                </div>
                <div className="col-span-2">
                  <Label>Top keywords (JSON-array)</Label>
                  <Textarea rows={4} className="font-mono text-xs"
                    placeholder='[{"keyword":"dynamics 365 crm","position":10,"volume":110}]'
                    value={topKwJson}
                    onChange={(e) => setTopKwJson(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>Top pages (JSON-array)</Label>
                  <Textarea rows={4} className="font-mono text-xs"
                    placeholder='[{"url":"/d365-sales/","traffic":120,"keywords":18}]'
                    value={topPgJson}
                    onChange={(e) => setTopPgJson(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>Anteckningar</Label>
                  <Textarea rows={2} value={editing.notes || ""}
                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Avbryt</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KpiCard({ label, value, sub, subColor }: { label: string; value: string; sub?: string; subColor?: string }) {
  return (
    <div className="border border-border rounded-lg p-3 bg-card">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold tabular-nums mt-1">{value}</div>
      {sub && <div className={`text-xs mt-1 ${subColor || "text-muted-foreground"}`}>{sub}</div>}
    </div>
  );
}
