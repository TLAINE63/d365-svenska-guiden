import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, AlertTriangle, Upload, TrendingUp, FileUp, CheckCircle2 } from "lucide-react";
import { formatDateYYYYMMDD } from "@/lib/utils";

interface TrendRow {
  source: string;
  month: string;
  group: string;
  impressions: number;
  clicks: number;
  avgPosition: number | null;
  queries: number;
}
interface ComparisonRow {
  phrase: string;
  group: string;
  d365: number | null;
  d365Impressions: number;
  competitors: Record<string, number | null>;
}
interface ImportInfo {
  id: string;
  domain: string;
  export_date: string;
  filename: string;
  rows_total: number;
  rows_matched: number;
}
interface RunInfo {
  id: string;
  source: string;
  status: string;
  rows_saved: number | null;
  error: string | null;
  started_at: string;
}
interface Overview {
  trend: TrendRow[];
  comparison: ComparisonRow[];
  imports: ImportInfo[];
  competitors: string[];
  runs: RunInfo[];
}

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const fmtDate = formatDateYYYYMMDD;
const fmtNum = (n: number) => new Intl.NumberFormat("sv-SE").format(Math.round(n));
const GROUPS = ["Generiska", "Produkt", "CE och övriga", "Partner", "Kostnad", "Migrering", "Bransch", "Upphandling", "Copilot", "Övrigt"];

export default function AdminSearchPerfTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [groupFilter, setGroupFilter] = useState<string>("alla");

  // CSV-uppladdning
  const fileRef = useRef<HTMLInputElement>(null);
  const [csvDomain, setCsvDomain] = useState<string>("");
  const [csvDate, setCsvDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [uploading, setUploading] = useState(false);

  const call = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-performance`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 401) { onSessionExpired(); throw new Error("Sessionen har gått ut"); }
    const j = await res.json();
    if (!res.ok) throw new Error(j?.error || "Fel vid anrop");
    return j;
  }, [token, onSessionExpired]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setData(await call({ action: "overview" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Okänt fel");
    } finally {
      setLoading(false);
    }
  }, [token, call]);

  useEffect(() => { load(); }, [load]);

  const runSync = async () => {
    setSyncing(true);
    try {
      const r = await call({ action: "sync", source: "all", days: 5 });
      const parts = Object.entries(r).map(([s, v]: [string, any]) =>
        v?.error ? `${s}: fel (${v.error})` : `${s}: ${fmtNum(v.rows)} rader`);
      toast({ title: "Hämtning klar", description: parts.join(" · ") });
      await load();
    } catch (e) {
      toast({ title: "Hämtningen misslyckades", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  };

  const uploadCsv = async (file: File) => {
    if (!csvDomain) {
      toast({ title: "Välj domän först", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const csv = await file.text();
      const r = await call({ action: "import_csv", domain: csvDomain, export_date: csvDate, filename: file.name, csv });
      toast({
        title: `Import klar: ${csvDomain}`,
        description: `${fmtNum(r.import.rows_total)} fraser lästa, ${fmtNum(r.import.rows_matched)} matchade mot fraslistan.`,
      });
      await load();
    } catch (e) {
      toast({ title: "Importen misslyckades", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // Trend: pivota till månad x grupp per källa
  const months = useMemo(() => [...new Set((data?.trend || []).map((t) => t.month))].sort(), [data]);
  const trendBy = useMemo(() => {
    const m = new Map<string, TrendRow>();
    for (const t of data?.trend || []) m.set(`${t.source}|${t.month}|${t.group}`, t);
    return m;
  }, [data]);

  const comparison = useMemo(() => {
    const rows = data?.comparison || [];
    return groupFilter === "alla" ? rows : rows.filter((r) => r.group === groupFilter);
  }, [data, groupFilter]);

  const lastRun = (src: string) => data?.runs?.find((r) => r.source === src);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold">Sökprestanda</h2>
          <p className="text-sm text-muted-foreground">
            d365.se via Search Console (Sverige, per dygn) och Bing (per vecka, alla länder). Konkurrenter via kvartalsvis Semrush-CSV.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={runSync} disabled={syncing || loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            Hämta ny data nu
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium">Kunde inte hämta översikten</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Senaste hämtningar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(["gsc", "bing"] as const).map((src) => {
          const run = lastRun(src);
          return (
            <Card key={src}>
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {src === "gsc" ? "Google Search Console" : "Bing Webmaster Tools"}
                  </p>
                  <p className="text-sm mt-1">
                    {run ? (
                      <>
                        Senast: {fmtDate(run.started_at)} · {run.status === "ok" ? `${fmtNum(run.rows_saved || 0)} rader` : `fel: ${run.error}`}
                      </>
                    ) : "Ingen hämtning ännu"}
                  </p>
                </div>
                {run?.status === "ok" ? (
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> OK
                  </Badge>
                ) : run ? (
                  <Badge variant="destructive">Fel</Badge>
                ) : (
                  <Badge variant="secondary">Saknas</Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trend per grupp och månad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" /> Utveckling per frasgrupp (visningar per månad)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {months.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ingen data ännu.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grupp</TableHead>
                    {months.map((m) => (
                      <TableHead key={m} className="text-right" colSpan={1}>{m}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(["gsc", "bing"] as const).map((src) => (
                    <>
                      <TableRow key={src} className="bg-muted/40">
                        <TableCell colSpan={months.length + 1} className="font-medium text-xs uppercase tracking-wide">
                          {src === "gsc" ? "Google (Sverige)" : "Bing (alla länder, veckovis)"}
                        </TableCell>
                      </TableRow>
                      {GROUPS.map((g) => {
                        const has = months.some((m) => trendBy.get(`${src}|${m}|${g}`));
                        if (!has) return null;
                        return (
                          <TableRow key={`${src}-${g}`}>
                            <TableCell className="text-sm">{g}</TableCell>
                            {months.map((m) => {
                              const t = trendBy.get(`${src}|${m}|${g}`);
                              return (
                                <TableCell key={m} className="text-right text-xs" title={t ? `${fmtNum(t.clicks)} klick · snittpos ${t.avgPosition ?? "–"} · ${t.queries} fraser` : ""}>
                                  {t ? fmtNum(t.impressions) : "–"}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </>
                  ))}
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground mt-2">Håll muspekaren över en siffra för klick, snittposition och antal fraser.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSV-import av konkurrenter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileUp className="h-4 w-4" /> Konkurrentimport (Semrush Organic Positions, CSV)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Domän</label>
              <Select value={csvDomain} onValueChange={setCsvDomain}>
                <SelectTrigger className="w-56"><SelectValue placeholder="Välj domän" /></SelectTrigger>
                <SelectContent>
                  {(data?.competitors || []).map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Exportdatum</label>
              <Input type="date" value={csvDate} onChange={(e) => setCsvDate(e.target.value)} className="w-40" />
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCsv(f); }}
              />
              <Button onClick={() => fileRef.current?.click()} disabled={uploading || !csvDomain}>
                <Upload className={`h-4 w-4 mr-2 ${uploading ? "animate-pulse" : ""}`} />
                {uploading ? "Importerar…" : "Ladda upp CSV"}
              </Button>
            </div>
          </div>
          {(data?.imports || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data!.imports.map((i) => (
                <Badge key={i.id} variant="secondary" className="text-xs">
                  {i.domain}: export {fmtDate(i.export_date)} · {fmtNum(i.rows_matched)}/{fmtNum(i.rows_total)} matchade
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Jämförelse per fras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base flex-wrap gap-2">
            <span>Position per bevakad fras</span>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="alla">Alla grupper</SelectItem>
                {GROUPS.filter((g) => g !== "Övrigt").map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {comparison.length === 0 ? (
            <p className="text-sm text-muted-foreground">Inga fraser att visa.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fras</TableHead>
                    <TableHead>Grupp</TableHead>
                    <TableHead className="text-right">d365.se (28 d)</TableHead>
                    {(data?.competitors || []).map((d) => (
                      <TableHead key={d} className="text-right">{d.replace(/\.(se|com)$/, "")}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparison.map((r) => (
                    <TableRow key={r.phrase}>
                      <TableCell className="text-xs max-w-xs truncate" title={r.phrase}>{r.phrase}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{r.group}</Badge></TableCell>
                      <TableCell className="text-right text-xs font-medium">
                        {r.d365 != null ? r.d365.toFixed(1) : <span className="text-muted-foreground">ej synlig</span>}
                      </TableCell>
                      {(data?.competitors || []).map((d) => (
                        <TableCell key={d} className="text-right text-xs">
                          {r.competitors[d] != null ? r.competitors[d] : <span className="text-muted-foreground">–</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground mt-2">
                d365.se: snittposition i Google senaste 28 dagarna (kräver minst en visning). Konkurrenter: position från senaste uppladdade CSV-exporten.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
