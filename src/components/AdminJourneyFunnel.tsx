import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingDown } from "lucide-react";

const STEP_LABELS: Record<string, string> = {
  landing: "Landning",
  cta_view: "CTA sedd",
  cta_click: "CTA klick",
  tool_start: "Verktygsstart",
  tool_step_1: "Steg 1 klart",
  tool_result: "Resultat",
  shortlist_add: "Shortlist",
  compare_open: "Jämförelse",
  intro_open: "Be om introduktion",
  intro_sent: "Skickad förfrågan",
};

const SOURCES = [
  { v: "all", l: "Alla källor" },
  { v: "seo", l: "SEO (sökmotor)" },
  { v: "geo_ai", l: "GEO / AI-assistent" },
  { v: "direct", l: "Direkt" },
  { v: "social", l: "Sociala medier" },
  { v: "email", l: "E-post" },
  { v: "referral", l: "Hänvisning" },
  { v: "paid", l: "Annonser" },
];

interface Data {
  sessions: number;
  steps: { key: string; count: number }[];
  sub_conversions: { key: string; label: string; from: number; to: number; rate: number }[];
  top_landings: { landing: string; sessions: number; cta_click: number; tool_start: number; tool_result: number; intro_sent: number }[];
  tools: string[];
}

export default function AdminJourneyFunnel({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [days, setDays] = useState("30");
  const [source, setSource] = useState("all");
  const [device, setDevice] = useState("all");
  const [tool, setTool] = useState("all");
  const [landing, setLanding] = useState("all");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    supabase.functions
      .invoke("funnel-stats", {
        body: {
          token,
          action: "journey",
          days: Number(days),
          source: source === "all" ? null : source,
          device: device === "all" ? null : device,
          tool: tool === "all" ? null : tool,
          landing: landing === "all" ? null : landing,
        },
      })
      .then(({ data: d, error }) => {
        if (error || d?.error) {
          if (String(d?.error || "").includes("ut")) onSessionExpired?.();
          return;
        }
        setData(d);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, days, source, device, tool, landing]);

  const top = data?.steps[0]?.count || 0;
  // Största relativa tapp mellan två steg i följd (med minst 5 sessioner i föregående steg)
  let worstIdx = -1;
  let worstDrop = 0;
  data?.steps.forEach((s, i) => {
    if (i === 0) return;
    const prev = data.steps[i - 1].count;
    if (prev < 5) return;
    const drop = 1 - s.count / prev;
    if (drop > worstDrop) {
      worstDrop = drop;
      worstIdx = i;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Köparresan steg för steg</CardTitle>
        <p className="text-sm text-muted-foreground">
          Unika sessioner som nått varje steg. Alla besök räknas. Mätningen startade 2026-09-24.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dagar</SelectItem>
              <SelectItem value="30">30 dagar</SelectItem>
              <SelectItem value="90">90 dagar</SelectItem>
            </SelectContent>
          </Select>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>{SOURCES.map((s) => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={device} onValueChange={setDevice}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla enheter</SelectItem>
              <SelectItem value="mobile">Mobil</SelectItem>
              <SelectItem value="tablet">Surfplatta</SelectItem>
              <SelectItem value="desktop">Dator</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tool} onValueChange={setTool}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla verktyg</SelectItem>
              {data?.tools.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={landing} onValueChange={setLanding}>
            <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla landningssidor</SelectItem>
              {data?.top_landings.map((p) => <SelectItem key={p.landing} value={p.landing}>{p.landing}</SelectItem>)}
            </SelectContent>
          </Select>
          {loading && <Loader2 className="h-5 w-5 animate-spin self-center text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.sub_conversions.map((c) => (
                <div key={c.key} className="rounded-lg border bg-card p-4">
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold">{c.rate}%</p>
                  <p className="text-xs text-muted-foreground">{c.to} av {c.from}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {data.steps.map((s, i) => {
                const pct = top > 0 ? (s.count / top) * 100 : 0;
                const prev = i > 0 ? data.steps[i - 1].count : 0;
                const stepRate = i > 0 && prev > 0 ? Math.round((s.count / prev) * 100) : null;
                const worst = i === worstIdx;
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <div className="w-40 shrink-0 text-sm">{STEP_LABELS[s.key] || s.key}</div>
                    <div className="h-7 flex-1 rounded bg-muted">
                      <div
                        className={worst ? "h-7 rounded bg-destructive" : "h-7 rounded bg-primary"}
                        style={{ width: `${Math.max(pct, s.count > 0 ? 1 : 0)}%` }}
                      />
                    </div>
                    <div className="w-44 shrink-0 text-right text-sm tabular-nums">
                      <span className="font-semibold">{s.count}</span>
                      <span className="text-muted-foreground"> · {Math.round(pct)}%</span>
                      {stepRate !== null && <span className="text-muted-foreground"> ({stepRate}% av föreg.)</span>}
                    </div>
                    {worst && <TrendingDown className="h-4 w-4 text-destructive" aria-label="Största tappet" />}
                  </div>
                );
              })}
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Topp 20 landningssidor</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground">
                    <tr>
                      <th className="py-1 pr-3">Sida</th>
                      <th className="py-1 pr-3 text-right">Sessioner</th>
                      <th className="py-1 pr-3 text-right">CTA-klick</th>
                      <th className="py-1 pr-3 text-right">Starter</th>
                      <th className="py-1 pr-3 text-right">Resultat</th>
                      <th className="py-1 text-right">Förfrågningar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.top_landings.map((p) => (
                      <tr key={p.landing} className="border-t">
                        <td className="max-w-[320px] truncate py-1 pr-3">{p.landing}</td>
                        <td className="py-1 pr-3 text-right tabular-nums">{p.sessions}</td>
                        <td className="py-1 pr-3 text-right tabular-nums">{p.cta_click}</td>
                        <td className="py-1 pr-3 text-right tabular-nums">{p.tool_start}</td>
                        <td className="py-1 pr-3 text-right tabular-nums">{p.tool_result}</td>
                        <td className="py-1 text-right tabular-nums">{p.intro_sent}</td>
                      </tr>
                    ))}
                    {data.top_landings.length === 0 && (
                      <tr><td colSpan={6} className="py-3 text-muted-foreground">Inga sessioner ännu för valda filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
