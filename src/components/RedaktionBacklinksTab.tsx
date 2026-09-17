import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis, XAxis } from "recharts";

interface TopDomain {
  domain: string;
  authority: number | null;
  backlinks: number | null;
}

interface Snapshot {
  id: string;
  domain: string;
  captured_at: string;
  referring_domains: number | null;
  backlinks: number | null;
  authority_score: number | null;
  follows: number | null;
  nofollows: number | null;
  top_domains: TopDomain[];
  hidden_domains: string[];
}

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const fmt = (n: number | null) => (n === null || n === undefined ? "–" : new Intl.NumberFormat("sv-SE").format(Math.round(n)));
const asDate = (iso: string) => iso.slice(0, 10);

export default function RedaktionBacklinksTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [savingHidden, setSavingHidden] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-backlink-stats`;
  const headers = () => ({
    Authorization: `Bearer ${token}`,
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
  });

  const latest = snapshots[0] || null;

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}?action=list&domain=d365.se`, { headers: headers() });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte hämta data");
      setSnapshots((data.snapshots || []) as Snapshot[]);
    } catch (e) {
      toast({
        title: "Kunde inte hämta länkdata",
        description: e instanceof Error ? e.message : "Okänt fel",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleFetch = async () => {
    if (!token) return;
    setFetching(true);
    try {
      const res = await fetch(`${baseUrl}?action=fetch&domain=d365.se`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({}),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Hämtningen misslyckades");
      toast({ title: "Länkdata uppdaterad", description: `Hämtat ${asDate(new Date().toISOString())}` });
      await load();
    } catch (e) {
      toast({
        title: "Hämtningen misslyckades",
        description: e instanceof Error ? e.message : "Okänt fel",
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  const toggleHidden = async (domain: string) => {
    if (!token || !latest) return;
    const current = new Set((latest.hidden_domains || []).map((d) => d.toLowerCase()));
    const key = domain.toLowerCase();
    if (current.has(key)) current.delete(key);
    else current.add(key);

    setSavingHidden(true);
    try {
      const res = await fetch(`${baseUrl}?action=hide`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ id: latest.id, hidden_domains: Array.from(current) }),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte spara");
      setSnapshots((prev) =>
        prev.map((s) => (s.id === latest.id ? { ...s, hidden_domains: Array.from(current) } : s)),
      );
    } catch (e) {
      toast({
        title: "Kunde inte spara",
        description: e instanceof Error ? e.message : "Okänt fel",
        variant: "destructive",
      });
    } finally {
      setSavingHidden(false);
    }
  };

  const series = useMemo(
    () =>
      [...snapshots]
        .reverse()
        .map((s) => ({
          d: asDate(s.captured_at),
          refdomains: s.referring_domains ?? null,
          backlinks: s.backlinks ?? null,
        })),
    [snapshots],
  );

  const hidden = new Set((latest?.hidden_domains || []).map((d) => d.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Backlänkar</h2>
          <p className="text-sm text-muted-foreground">
            Antal webbplatser som länkar till d365.se, hämtat från Semrush. Visas publikt på
            /lankar-till-d365.
          </p>
        </div>
        <Button onClick={handleFetch} disabled={fetching || !token}>
          {fetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Hämta från Semrush
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Hämtar...
        </div>
      )}

      {latest && (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Refererande domäner</p>
                <p className="text-2xl font-bold tabular-nums">{fmt(latest.referring_domains)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Backlänkar</p>
                <p className="text-2xl font-bold tabular-nums">{fmt(latest.backlinks)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Auktoritetspoäng</p>
                <p className="text-2xl font-bold tabular-nums">
                  {latest.authority_score === null ? "–" : Math.round(latest.authority_score)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Senast hämtat</p>
                <p className="text-2xl font-bold tabular-nums">{asDate(latest.captured_at)}</p>
              </CardContent>
            </Card>
          </div>

          {series.length > 1 && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-3">Utveckling</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series}>
                      <XAxis dataKey="d" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="refdomains" name="Refererande domäner" stroke="hsl(var(--primary))" dot={false} />
                      <Line type="monotone" dataKey="backlinks" name="Backlänkar" stroke="hsl(var(--accent))" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Länkande domän</TableHead>
                    <TableHead className="text-right">Auktoritet</TableHead>
                    <TableHead className="text-right">Länkar</TableHead>
                    <TableHead className="text-right">Publikt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(latest.top_domains || []).map((d) => {
                    const isHidden = hidden.has(d.domain.toLowerCase());
                    return (
                      <TableRow key={d.domain}>
                        <TableCell className="font-medium">{d.domain}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {d.authority === null ? "–" : Math.round(d.authority)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{fmt(d.backlinks)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={savingHidden}
                            onClick={() => toggleHidden(d.domain)}
                          >
                            {isHidden ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" /> Dold
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" /> Visas
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div>
            <p className="text-sm font-medium mb-2">Historik</p>
            <div className="flex flex-wrap gap-2">
              {snapshots.map((s) => (
                <Badge key={s.id} variant="secondary">
                  {asDate(s.captured_at)}: {fmt(s.referring_domains)} domäner, {fmt(s.backlinks)} länkar
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {!loading && !latest && (
        <p className="text-sm text-muted-foreground">
          Ingen hämtning gjord ännu. Klicka på "Hämta från Semrush" för att fylla sidan.
        </p>
      )}
    </div>
  );
}
