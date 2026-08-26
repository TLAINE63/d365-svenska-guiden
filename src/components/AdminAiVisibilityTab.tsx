import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";

interface AiVisibilityData {
  totals: { aiVisits365: number; aiVisits30: number; crawlerHits365: number };
  byMonth: { month: string; total: number; bySource: Record<string, number> }[];
  bySource: { id: string; label: string; visits: number; uniqueVisitors: number }[];
  landingPages: { path: string; views: number }[];
  crawlers: { id: string; label: string; hits: number; lastSeen: string }[];
  citations: CitationRow[];
  citationTrend: { month: string; checks: number; mentions: number }[];
}

interface CitationRow {
  id: string;
  check_month: string;
  engine: string;
  query_text: string;
  mentioned: boolean;
  position_note: string | null;
  source_url: string | null;
  notes: string | null;
}

const ENGINES = ["ChatGPT", "Perplexity", "Microsoft Copilot", "Google Gemini", "Claude", "Google AI Overviews"];

/** Fasta testfrågor att kontrollera varje månad. */
export const STANDARD_QUERIES = [
  "bästa Dynamics 365-partner i Sverige",
  "vilken Dynamics 365-partner passar tillverkande industri",
  "vad kostar Business Central i Sverige",
  "Business Central eller Finance & Supply Chain Management",
  "hur väljer man Dynamics 365-partner",
];

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

interface Props {
  token: string | null;
  onSessionExpired?: () => void;
}

export default function AdminAiVisibilityTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [data, setData] = useState<AiVisibilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    check_month: currentMonth(),
    engine: ENGINES[0],
    query_text: STANDARD_QUERIES[0],
    mentioned: false,
    position_note: "",
    source_url: "",
    notes: "",
  });

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const { data: res, error } = await supabase.functions.invoke("ai-visibility-stats", {
      body: { token, action: "stats" },
    });
    setLoading(false);
    if (error || !res || res.error) {
      if (res?.error?.includes("Sessionen")) onSessionExpired?.();
      toast({ title: "Kunde inte hämta AI-statistik", variant: "destructive" });
      return;
    }
    setData(res as AiVisibilityData);
  }, [token, onSessionExpired, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const saveCitation = async () => {
    if (!token) return;
    setSaving(true);
    const { data: res, error } = await supabase.functions.invoke("ai-visibility-stats", {
      body: { token, action: "save-citation", citation: form },
    });
    setSaving(false);
    if (error || !res || res.error) {
      toast({ title: res?.error || "Kunde inte spara", variant: "destructive" });
      return;
    }
    toast({ title: "Kontroll sparad" });
    setForm((f) => ({ ...f, mentioned: false, position_note: "", source_url: "", notes: "" }));
    load();
  };

  const deleteCitation = async (id: string) => {
    if (!token) return;
    const { error } = await supabase.functions.invoke("ai-visibility-stats", {
      body: { token, action: "delete-citation", id },
    });
    if (error) {
      toast({ title: "Kunde inte ta bort", variant: "destructive" });
      return;
    }
    load();
  };

  const mentionRate = useMemo(() => {
    const t = data?.citationTrend?.[0];
    if (!t || t.checks === 0) return null;
    return Math.round((t.mentions / t.checks) * 100);
  }, [data]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Hämtar AI-synlighet…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> AI-synlighet
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Mäter hur ofta d365.se syns i och får trafik från AI-assistenter. Interna besök är
            exkluderade. Besök från AI-assistenter mäts via referrer; citeringar loggas manuellt
            eftersom AI-tjänsterna inte rapporterar dem.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Uppdatera
        </Button>
      </div>

      {/* KPI:er */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Besök från AI-assistenter (30 dagar)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totals.aiVisits30 ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data?.totals.aiVisits365 ?? 0} senaste 12 månaderna
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AI-crawlers i besöksloggen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totals.crawlerHits365 ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Endast crawlers som kör JavaScript syns här
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Omnämnandegrad senaste kontrollen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mentionRate === null ? "–" : `${mentionRate}%`}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data?.citationTrend?.[0]
                ? `${data.citationTrend[0].mentions} av ${data.citationTrend[0].checks} frågor (${data.citationTrend[0].month})`
                : "Inga kontroller loggade ännu"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Källor */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trafik per AI-tjänst</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.bySource.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tjänst</TableHead>
                    <TableHead className="text-right">Besök</TableHead>
                    <TableHead className="text-right">Unika</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.bySource.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.label}</TableCell>
                      <TableCell className="text-right font-medium">{s.visits}</TableCell>
                      <TableCell className="text-right">{s.uniqueVisitors}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">Inga besök från AI-tjänster ännu.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Landningssidor från AI-trafik</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.landingPages.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sida</TableHead>
                    <TableHead className="text-right">Besök</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.landingPages.map((p) => (
                    <TableRow key={p.path}>
                      <TableCell className="font-mono text-xs">{p.path}</TableCell>
                      <TableCell className="text-right font-medium">{p.views}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">Ingen data ännu.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Månadstrend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI-trafik per månad</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.byMonth.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Månad</TableHead>
                  <TableHead className="text-right">Besök</TableHead>
                  <TableHead>Fördelning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byMonth.map((m) => (
                  <TableRow key={m.month}>
                    <TableCell>{m.month}</TableCell>
                    <TableCell className="text-right font-medium">{m.total}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {Object.entries(m.bySource)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" · ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">Ingen data ännu.</p>
          )}
        </CardContent>
      </Card>

      {/* Crawlers */}
      {!!data?.crawlers.length && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4" /> AI-crawlers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crawler</TableHead>
                  <TableHead className="text-right">Träffar</TableHead>
                  <TableHead>Senast</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.crawlers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.label}</TableCell>
                    <TableCell className="text-right font-medium">{c.hits}</TableCell>
                    <TableCell>{c.lastSeen.slice(0, 10).replace(/-/g, "/")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Citeringslogg */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Citeringslogg</CardTitle>
          <CardDescription>
            Ställ de fasta testfrågorna i respektive AI-tjänst en gång i månaden och registrera om
            d365.se nämns. Ger en trend som går att följa över tid.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="space-y-1.5">
              <Label>Månad</Label>
              <Input
                type="month"
                value={form.check_month}
                onChange={(e) => setForm({ ...form, check_month: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>AI-tjänst</Label>
              <Select value={form.engine} onValueChange={(val) => setForm({ ...form, engine: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {ENGINES.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Testfråga</Label>
              <Select
                value={STANDARD_QUERIES.includes(form.query_text) ? form.query_text : "__custom"}
                onValueChange={(val) =>
                  setForm({ ...form, query_text: val === "__custom" ? "" : val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {STANDARD_QUERIES.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                  <SelectItem value="__custom">Egen fråga…</SelectItem>
                </SelectContent>
              </Select>
              {!STANDARD_QUERIES.includes(form.query_text) && (
                <Input
                  className="mt-2"
                  placeholder="Skriv frågan"
                  value={form.query_text}
                  onChange={(e) => setForm({ ...form, query_text: e.target.value })}
                />
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="mentioned"
                checked={form.mentioned}
                onCheckedChange={(c) => setForm({ ...form, mentioned: !!c })}
              />
              <Label htmlFor="mentioned" className="cursor-pointer">
                d365.se nämndes i svaret
              </Label>
            </div>
            <div className="space-y-1.5">
              <Label>Placering / kontext</Label>
              <Input
                placeholder="t.ex. första källan"
                value={form.position_note}
                onChange={(e) => setForm({ ...form, position_note: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Länkad URL</Label>
              <Input
                placeholder="https://d365.se/…"
                value={form.source_url}
                onChange={(e) => setForm({ ...form, source_url: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notering</Label>
            <Textarea
              rows={2}
              placeholder="Vilka källor nämndes istället? Något att åtgärda?"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <Button onClick={saveCitation} disabled={saving || !form.query_text}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
            Spara kontroll
          </Button>

          {!!data?.citations.length && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Månad</TableHead>
                  <TableHead>Tjänst</TableHead>
                  <TableHead>Fråga</TableHead>
                  <TableHead>Nämnd</TableHead>
                  <TableHead>Placering</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.citations.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{String(c.check_month).slice(0, 7)}</TableCell>
                    <TableCell>{c.engine}</TableCell>
                    <TableCell className="max-w-[280px] truncate">{c.query_text}</TableCell>
                    <TableCell>
                      {c.mentioned ? (
                        <Badge className="bg-accent text-accent-foreground">Ja</Badge>
                      ) : (
                        <Badge variant="outline">Nej</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {c.position_note || "–"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteCitation(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
