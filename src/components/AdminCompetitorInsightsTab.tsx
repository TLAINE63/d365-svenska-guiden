import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Search, FileText, Link2, AlertCircle } from "lucide-react";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

interface Insight {
  domain: string;
  keywords: Array<{ keyword: string; position: number; volume: number; url: string }>;
  topPages: Array<{ url: string; estTraffic: number; keywordCount: number }>;
  refDomains: Array<{ domain: string; authorityScore: number; backlinks: number }>;
  overview: { total: number | null; referringDomains: number | null; authorityScore: number | null };
  errors: string[];
}

const PRIMARY = "d365.se";
const DEFAULT_COMPETITORS = `businesswith.se
herbertnathan.com
microsoft.com
marketplace.microsoft.com`;

const fmt = (n: unknown) =>
  n == null || n === "" ? "—" : new Intl.NumberFormat("sv-SE").format(Number(n));

const pathOf = (u: string) => {
  try { const x = new URL(u); return (x.pathname || "/") + (x.search || ""); } catch { return u; }
};

export default function AdminCompetitorInsightsTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [competitors, setCompetitors] = useState(DEFAULT_COMPETITORS);
  const [database, setDatabase] = useState("se");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Insight[] | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const run = async () => {
    if (!token) return;
    const domains = [PRIMARY, ...competitors.split(/[\n,]/).map((d) => d.trim()).filter(Boolean)];
    setLoading(true);
    setData(null);
    try {
      const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/competitor-insights`;
      const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domains, database }),
      });
      if (res.status === 401) return onSessionExpired();
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Kunde inte hämta data");
      setData(json.results);
      setGeneratedAt(json.generatedAt);
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Beräkna keyword-gap: vad konkurrenter rankar på som vi inte har
  const ourKeywords = new Set(
    (data?.find((d) => d.domain === PRIMARY)?.keywords || []).map((k) => k.keyword.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header / kontroller */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Konkurrentinsikter — vad gör de som inte vi gör?
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Live-data från Semrush (databas SE). Visar topp 25 sökord, mest trafik­drivande sidor och
              starkaste länkkällor per domän. <strong>d365.se</strong> är alltid med som referens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-end">
            <div>
              <Label htmlFor="competitors" className="text-xs">Konkurrenter (en per rad eller komma)</Label>
              <Textarea
                id="competitors"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                rows={4}
                className="font-mono text-sm"
                placeholder="businesswith.se&#10;herbertnathan.com"
              />
            </div>
            <div>
              <Label className="text-xs">Marknad</Label>
              <Select value={database} onValueChange={setDatabase}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="se">Sverige</SelectItem>
                  <SelectItem value="dk">Danmark</SelectItem>
                  <SelectItem value="no">Norge</SelectItem>
                  <SelectItem value="fi">Finland</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                  <SelectItem value="us">USA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={run} disabled={loading || !token}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Hämtar…</> : "Hämta insikter"}
            </Button>
          </div>

          {generatedAt && (
            <p className="text-xs text-muted-foreground">
              Senast hämtad: {new Date(generatedAt).toLocaleString("sv-SE")}
              {" · "}Källa: Semrush (gateway)
            </p>
          )}
        </CardContent>
      </Card>

      {loading && !data && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Hämtar data per domän… (kan ta 10–30 sek)
        </p>
      )}

      {/* Översiktstabell */}
      {data && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-semibold mb-3">Översikt</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b">
                  <tr className="text-left">
                    <th className="py-2 pr-3">Domän</th>
                    <th className="py-2 pr-3 text-right">Authority Score</th>
                    <th className="py-2 pr-3 text-right">Backlinks</th>
                    <th className="py-2 pr-3 text-right">Ref. domäner</th>
                    <th className="py-2 pr-3 text-right">Topp sökord (visade)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d) => (
                    <tr key={d.domain} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-medium">
                        {d.domain}
                        {d.domain === PRIMARY && <Badge variant="secondary" className="ml-2">Du</Badge>}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{fmt(d.overview.authorityScore)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{fmt(d.overview.total)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{fmt(d.overview.referringDomains)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{d.keywords.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per-domän detaljer */}
      {data && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {data.map((d) => (
            <Card key={d.domain} className={d.domain === PRIMARY ? "ring-2 ring-primary/40" : ""}>
              <CardContent className="pt-6 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    {d.domain}
                    {d.domain === PRIMARY && <Badge variant="secondary">Din sajt</Badge>}
                  </h4>
                  {d.errors.length > 0 && (
                    <Badge variant="outline" className="text-amber-600 border-amber-400">
                      <AlertCircle className="h-3 w-3 mr-1" /> {d.errors.length} fel
                    </Badge>
                  )}
                </div>

                {/* Topp sökord */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <Search className="h-3.5 w-3.5" /> Topp sökord
                  </p>
                  {d.keywords.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Ingen data.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="text-muted-foreground border-b">
                          <tr className="text-left">
                            <th className="py-1.5 pr-2">Sökord</th>
                            <th className="py-1.5 pr-2 text-right">Pos</th>
                            <th className="py-1.5 pr-2 text-right">Vol/mån</th>
                            <th className="py-1.5">Gap</th>
                          </tr>
                        </thead>
                        <tbody>
                          {d.keywords.slice(0, 15).map((k, i) => {
                            const isGap = d.domain !== PRIMARY && !ourKeywords.has(k.keyword.toLowerCase());
                            return (
                              <tr key={i} className="border-b last:border-0">
                                <td className="py-1.5 pr-2">{k.keyword}</td>
                                <td className="py-1.5 pr-2 text-right tabular-nums">{k.position}</td>
                                <td className="py-1.5 pr-2 text-right tabular-nums">{fmt(k.volume)}</td>
                                <td className="py-1.5">
                                  {isGap && (
                                    <Badge className="bg-orange-500/10 text-orange-700 border-orange-400/40 text-[10px]" variant="outline">
                                      Vi rankar ej
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Topp sidor */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> Mest trafikdrivande sidor (innehållstyper)
                  </p>
                  {d.topPages.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Ingen data.</p>
                  ) : (
                    <ul className="space-y-1.5 text-xs">
                      {d.topPages.slice(0, 8).map((p, i) => (
                        <li key={i} className="flex items-center justify-between gap-2 border-b last:border-0 pb-1.5">
                          <a href={p.url} target="_blank" rel="noopener noreferrer"
                             className="truncate text-primary hover:underline" title={p.url}>
                            {pathOf(p.url)}
                          </a>
                          <span className="text-muted-foreground tabular-nums whitespace-nowrap">
                            ~{fmt(p.estTraffic)} bes · {p.keywordCount} ord
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Länkkällor */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <Link2 className="h-3.5 w-3.5" /> Starkaste länkkällor
                  </p>
                  {d.refDomains.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Ingen data.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="text-muted-foreground border-b">
                          <tr className="text-left">
                            <th className="py-1.5 pr-2">Domän</th>
                            <th className="py-1.5 pr-2 text-right">AS</th>
                            <th className="py-1.5 pr-2 text-right">Backlinks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {d.refDomains.slice(0, 10).map((r, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-1.5 pr-2 truncate max-w-[220px]" title={r.domain}>{r.domain}</td>
                              <td className="py-1.5 pr-2 text-right tabular-nums">{r.authorityScore}</td>
                              <td className="py-1.5 pr-2 text-right tabular-nums">{fmt(r.backlinks)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {d.errors.length > 0 && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer">Visa fel ({d.errors.length})</summary>
                    <ul className="mt-1 list-disc pl-4 space-y-1">
                      {d.errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
