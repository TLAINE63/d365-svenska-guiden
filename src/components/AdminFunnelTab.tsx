import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingDown, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface FunnelRow {
  key: string;
  label: string;
  count: number;
}

interface FunnelStats {
  funnel: FunnelRow[];
  by_event_name: Record<string, Record<string, number>>;
  timeseries: { date: string; visits: number; clicks: number; analyses: number; leads: number }[];
  unique_visitors: number;
}

interface Props {
  token: string | null;
  onSessionExpired?: () => void;
}

const PAGE_FILTERS = [
  { value: "", label: "Alla sidor" },
  { value: "/business-central", label: "Business Central" },
  { value: "/finance-supply-chain", label: "Finance & SCM" },
  { value: "/crm", label: "CRM" },
  { value: "/ai-oversikt", label: "AI" },
  { value: "/branschlosningar", label: "Branschlösningar" },
  { value: "/partner/", label: "Partnerprofiler" },
  { value: "/kunskapscenter", label: "Kunskapscenter" },
  { value: "/", label: "Startsida (/)" },
];

export default function AdminFunnelTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [days, setDays] = useState("all");
  const [pageFilter, setPageFilter] = useState("");
  const [stats, setStats] = useState<FunnelStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("funnel-stats", {
        body: { token, days: days === "all" ? null : Number(days), page_filter: pageFilter || null },
      });
      if (error) throw error;
      if (data?.error) {
        if (String(data.error).includes("ut")) onSessionExpired?.();
        throw new Error(data.error);
      }
      setStats(data);
    } catch (e) {
      console.error(e);
      toast({ title: "Kunde inte hämta funnel-data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, days, pageFilter]);

  const top = stats?.funnel?.[0]?.count || 0;
  const maxBarWidth = 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Konverteringsfunnel</CardTitle>
          <p className="text-sm text-muted-foreground">
            Se var besökare faller av i kedjan från sidvisning till partnerklick.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Period</label>
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Totalt</SelectItem>
                  <SelectItem value="7">7 dagar</SelectItem>
                  <SelectItem value="30">30 dagar</SelectItem>
                  <SelectItem value="90">90 dagar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Sidfilter</label>
              <Select value={pageFilter || "__all"} onValueChange={(v) => setPageFilter(v === "__all" ? "" : v)}>
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_FILTERS.map((p) => (
                    <SelectItem key={p.value || "__all"} value={p.value || "__all"}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Uppdatera</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Funnel-steg</CardTitle>
              <p className="text-xs text-muted-foreground">
                Unika besökare per steg. {stats.unique_visitors} unika sessioner i perioden.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.funnel.map((row, idx) => {
                const prev = idx > 0 ? stats.funnel[idx - 1].count : row.count;
                const dropPct = prev > 0 ? Math.round(((prev - row.count) / prev) * 100) : 0;
                const widthPct = top > 0 ? Math.max(2, (row.count / top) * maxBarWidth) : 2;
                const dropColor = dropPct > 70 ? "text-red-600" : dropPct > 40 ? "text-amber-600" : "text-emerald-600";
                return (
                  <div key={row.key} className="flex items-center gap-3 py-1.5">
                    <div className="w-44 text-sm font-medium">{row.label}</div>
                    <div className="flex-1">
                      <div className="h-7 bg-muted rounded-md overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-end pr-2 text-xs font-semibold text-white transition-all"
                          style={{ width: `${widthPct}%` }}
                        >
                          {row.count.toLocaleString("sv-SE")}
                        </div>
                      </div>
                    </div>
                    <div className={`w-24 text-right text-xs font-medium ${dropColor}`}>
                      {idx === 0 ? "—" : (
                        <span className="flex items-center justify-end gap-1">
                          <TrendingDown className="h-3 w-3" />
                          {dropPct}% bortfall
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Daglig utveckling</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.timeseries}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="visits" stroke="#06b6d4" name="Besök" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" name="CTA-klick" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="analyses" stroke="#10b981" name="Slutförd analys" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="leads" stroke="#f59e0b" name="Leads" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {stats.by_event_name && Object.keys(stats.by_event_name).length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Händelser per typ</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(stats.by_event_name).map(([type, names]) => (
                  <div key={type}>
                    <div className="text-sm font-semibold mb-2">{type}</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(names)
                        .sort((a, b) => b[1] - a[1])
                        .map(([name, count]) => (
                          <span key={name} className="text-xs px-2 py-1 rounded-md bg-muted">
                            {name}: <strong>{count}</strong>
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
