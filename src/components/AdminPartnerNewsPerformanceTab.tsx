import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, ExternalLink, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

interface Row {
  news_id: string;
  editorial_title: string | null;
  news_type: string | null;
  news_date: string | null;
  partner_name: string | null;
  partner_slug: string | null;
  views: number;
  card_clicks: number;
  source_clicks: number;
  leads: number;
}

interface Totals {
  articles_with_activity: number;
  views: number;
  card_clicks: number;
  source_clicks: number;
  leads: number;
}

interface Props {
  token: string | null;
  onSessionExpired?: () => void;
}

const RANGE_OPTIONS: { value: string; label: string }[] = [
  { value: "7", label: "Senaste 7 dagarna" },
  { value: "30", label: "Senaste 30 dagarna" },
  { value: "90", label: "Senaste 90 dagarna" },
  { value: "all", label: "All tid" },
];

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

function newsTypeLabel(t: string | null): string {
  switch (t) {
    case "webinar":
      return "Webinar";
    case "linkedin":
      return "LinkedIn";
    case "event":
      return "Event";
    case "news":
      return "Nyhet";
    case "case":
      return "Case";
    case "blog":
      return "Blogg";
    default:
      return t ?? "—";
  }
}

export default function AdminPartnerNewsPerformanceTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<string>("30");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("partner-news-performance", {
        body: { token, days: days === "all" ? "all" : Number(days) },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) {
        if (/session/i.test((data as { error: string }).error)) onSessionExpired?.();
        throw new Error((data as { error: string }).error);
      }
      setRows(((data as { rows?: Row[] })?.rows) ?? []);
      setTotals(((data as { totals?: Totals })?.totals) ?? null);
    } catch (e) {
      toast({
        title: "Kunde inte hämta statistik",
        description: e instanceof Error ? e.message : "Okänt fel",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, token]);

  const filtered = typeFilter === "all" ? rows : rows.filter((r) => (r.news_type ?? "") === typeFilter);

  const distinctTypes = Array.from(new Set(rows.map((r) => r.news_type).filter(Boolean))) as string[];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-pink-500" />
            <CardTitle>Partnernytt – prestanda</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RANGE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla typer</SelectItem>
                {distinctTypes.map((t) => (
                  <SelectItem key={t} value={t}>{newsTypeLabel(t)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Visar hur många visningar, kort-klick, klick vidare till originalartikeln och CTA-leads varje
            Partnernytt-inlägg (inkl. webinarier och LinkedIn-poster) har genererat under vald period.
            Leads attribueras till senaste artikeln som besökaren interagerade med (24h-fönster).
          </p>

          {totals && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              <StatBox label="Artiklar med aktivitet" value={totals.articles_with_activity} />
              <StatBox label="Detaljsidevisningar" value={totals.views} />
              <StatBox label="Kort-klick" value={totals.card_clicks} />
              <StatBox label="Klick till original" value={totals.source_clicks} />
              <StatBox label="Attribuerade leads" value={totals.leads} highlight />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="py-2 pr-3">Artikel</th>
                  <th className="py-2 px-2">Partner</th>
                  <th className="py-2 px-2">Typ</th>
                  <th className="py-2 px-2">Datum</th>
                  <th className="py-2 px-2 text-right">Visningar</th>
                  <th className="py-2 px-2 text-right">Kort-klick</th>
                  <th className="py-2 px-2 text-right">→ Original</th>
                  <th className="py-2 px-2 text-right">Leads</th>
                  <th className="py-2 pl-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-muted-foreground">
                      Ingen aktivitet under vald period.
                    </td>
                  </tr>
                )}
                {filtered.map((r) => (
                  <tr key={r.news_id} className="border-b border-border/50 hover:bg-muted/40">
                    <td className="py-2 pr-3 max-w-[380px]">
                      <Link
                        to={`/partnernytt/artikel/${r.news_id}/`}
                        target="_blank"
                        className="font-medium text-foreground hover:text-[hsl(var(--cta-orange))] line-clamp-2"
                      >
                        {r.editorial_title ?? "(utan rubrik)"}
                      </Link>
                    </td>
                    <td className="py-2 px-2">
                      {r.partner_slug ? (
                        <Link to={`/partner/${r.partner_slug}/`} target="_blank" className="text-[hsl(var(--accent))] hover:underline">
                          {r.partner_name ?? r.partner_slug}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <Badge variant="secondary">{newsTypeLabel(r.news_type)}</Badge>
                    </td>
                    <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">{fmtDate(r.news_date)}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{r.views}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{r.card_clicks}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{r.source_clicks}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-semibold">
                      {r.leads > 0 ? (
                        <span className="text-emerald-600">{r.leads}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="py-2 pl-2">
                      <Link
                        to={`/partnernytt/artikel/${r.news_id}/`}
                        target="_blank"
                        className="text-muted-foreground hover:text-foreground inline-flex"
                        aria-label="Öppna artikel"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? "border-emerald-300 bg-emerald-50" : "border-border bg-card"}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-semibold tabular-nums ${highlight ? "text-emerald-700" : "text-foreground"}`}>
        {value.toLocaleString("sv-SE")}
      </div>
    </div>
  );
}
