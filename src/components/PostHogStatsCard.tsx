import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Loader2 } from "lucide-react";

interface Row {
  views: number;
  visitors: number;
}
interface Stats {
  totals: { views: number; visitors: number; sessions: number };
  topPages: (Row & { path: string })[];
  referrers: (Row & { source: string })[];
  channels: (Row & { channel: string })[];
  countries: (Row & { country: string })[];
}

const CHANNEL_LABELS: Record<string, string> = {
  "Direct": "Direkt",
  "Organic Search": "Organisk sökning",
  "Paid Search": "Betald sökning",
  "Organic Social": "Sociala medier",
  "Paid Social": "Betald social",
  "Referral": "Hänvisning",
  "Email": "E-post",
  "Cross Network": "Nätverk",
  "Other": "Övrigt",
  "okänd": "Okänd",
};

interface Props {
  token: string | null;
  onSessionExpired?: () => void;
}

export default function PostHogStatsCard({ token, onSessionExpired }: Props) {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!token) return;
    setLoading(true);
    setError(null);
    supabase.functions
      .invoke("posthog-stats", { body: { token, days } })
      .then(({ data: res, error: err }) => {
        if (cancelled) return;
        if (err) {
          setError("Kunde inte hämta PostHog-statistiken just nu.");
        } else if ((res as { error?: string })?.error) {
          const msg = (res as { error: string }).error;
          if (msg.includes("session")) onSessionExpired?.();
          setError(msg);
        } else {
          setData(res as Stats);
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [token, days, onSessionExpired]);

  const nf = new Intl.NumberFormat("sv-SE");

  function list(title: string, rows: { label: string; views: number; visitors: number }[]) {
    return (
      <div>
        <h4 className="text-sm font-semibold mb-2">{title}</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Källa</TableHead>
              <TableHead className="text-right">Besökare</TableHead>
              <TableHead className="text-right">Sidvisningar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground text-sm">
                  Ingen data ännu
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell className="max-w-[320px] truncate">{r.label}</TableCell>
                <TableCell className="text-right">{nf.format(r.visitors)}</TableCell>
                <TableCell className="text-right">{nf.format(r.views)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" /> PostHog: besök och sidvisningar
        </CardTitle>
        <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v) as 7 | 30 | 90)}>
          <TabsList>
            <TabsTrigger value="7">7 dagar</TabsTrigger>
            <TabsTrigger value="30">30 dagar</TabsTrigger>
            <TabsTrigger value="90">90 dagar</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Hämtar statistik
          </div>
        )}
        {error && !loading && <p className="text-sm text-destructive">{error}</p>}
        {data && !loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Besökare", value: data.totals.visitors },
                { label: "Besök", value: data.totals.sessions },
                { label: "Sidvisningar", value: data.totals.views },
              ].map((k) => (
                <div key={k.label} className="rounded-lg border bg-card p-4">
                  <p className="text-sm text-muted-foreground">{k.label}</p>
                  <p className="text-2xl font-bold">{nf.format(k.value)}</p>
                </div>
              ))}
            </div>

            {list(
              "Var besöken kommer från",
              data.referrers.map((r) => ({ label: r.source, views: r.views, visitors: r.visitors })),
            )}
            {list(
              "Kanaler",
              data.channels.map((r) => ({
                label: CHANNEL_LABELS[r.channel] ?? r.channel,
                views: r.views,
                visitors: r.visitors,
              })),
            )}
            {list(
              "Mest besökta sidor",
              data.topPages.map((r) => ({ label: r.path, views: r.views, visitors: r.visitors })),
            )}
            {list(
              "Länder",
              data.countries.map((r) => ({ label: r.country, views: r.views, visitors: r.visitors })),
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
