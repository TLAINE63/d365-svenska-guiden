import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Metric { key: string; label: string; count: number; unique: number; extra?: string }

const LEAD_LABELS: Record<string, string> = {
  partner_contact_request: "Be om introduktion",
  partner_demo_request: "Demoförfrågan",
  partner_quote_request: "Prisindikation",
  lead_magnet: "E-bok",
  requirements_spec: "Kravspecifikation",
  cta: "Allmän kontakt",
};

export default function AdminEngagementMetrics({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [days, setDays] = useState("30");
  const [data, setData] = useState<{ metrics: Metric[]; leads_by_type: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    supabase.functions
      .invoke("funnel-stats", { body: { token, action: "engagement", days: Number(days) } })
      .then(({ data: d, error }) => {
        if (error || d?.error) {
          if (String(d?.error || "").includes("ut")) onSessionExpired?.();
          return;
        }
        setData(d);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, days]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nyckelhandlingar</CardTitle>
        <p className="text-sm text-muted-foreground">
          Antal händelser och unika besök. Klick på e-bok, behovsanalys och kravspec mäts från 2026-09-24.
        </p>
        <div className="flex gap-2 pt-2">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dagar</SelectItem>
              <SelectItem value="30">30 dagar</SelectItem>
              <SelectItem value="90">90 dagar</SelectItem>
            </SelectContent>
          </Select>
          {loading && <Loader2 className="h-5 w-5 animate-spin self-center text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.metrics.map((m) => (
                <div key={m.key} className="rounded-lg border bg-card p-4">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-bold tabular-nums">{m.count}</p>
                  <p className="text-xs text-muted-foreground">{m.unique} unika{m.extra ? ` · ${m.extra}` : ""}</p>
                </div>
              ))}
            </div>
            {Object.keys(data.leads_by_type).length > 0 && (
              <div className="text-sm">
                <p className="mb-1 font-semibold">Kontaktformulär per typ</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                  {Object.entries(data.leads_by_type).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                    <li key={k}>{LEAD_LABELS[k] || k}: <span className="font-semibold text-foreground">{v}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
