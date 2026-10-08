import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper } from "lucide-react";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";

interface Group { name: string; views: number; visitors: number; sessions: number; topPages: { path: string; views: number }[] }
const RANGES = { d7: 7, d30: 30, d90: 90 } as const;

export default function ContentReadsCard({ token }: { token: string | null }) {
  const [range, setRange] = useState<keyof typeof RANGES>("d30");
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setGroups(null); setFailed(false);
    const start = new Date(Date.now() - RANGES[range] * 86400000).toISOString();
    invokeAdminEdgeWithRetry<{ groups?: Group[] }>("manage-leads", { action: "content-reads", token, startDate: start })
      .then(({ data, error }) => { if (cancelled) return; if (error || !data?.groups) setFailed(true); else setGroups(data.groups); })
      .catch(() => !cancelled && setFailed(true));
    return () => { cancelled = true; };
  }, [token, range]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><Newspaper className="w-5 h-5" />Nyhets- och eventklick</CardTitle>
        <p className="text-xs text-muted-foreground">Hur många som öppnar artiklar (Partnernytt och Kunskapscenter) och enskilda event på d365.se. Alla besökare räknas.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={range} onValueChange={(v) => setRange(v as keyof typeof RANGES)}>
          <TabsList className="grid w-full grid-cols-3 max-w-sm">
            <TabsTrigger value="d7">7 dagar</TabsTrigger>
            <TabsTrigger value="d30">30 dagar</TabsTrigger>
            <TabsTrigger value="d90">90 dagar</TabsTrigger>
          </TabsList>
        </Tabs>
        {failed && <p className="text-sm text-destructive">Kunde inte hämta statistiken.</p>}
        {!failed && !groups && <p className="text-sm text-muted-foreground">Hämtar…</p>}
        {groups && (
          <div className="grid gap-4 md:grid-cols-3">
            {groups.map((g) => (
              <div key={g.name} className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium">{g.name}</p>
                <p className="mt-1 text-2xl font-semibold">{g.views}</p>
                <p className="text-xs text-muted-foreground">visningar · {g.visitors} unika besökare · {g.sessions} besök</p>
                <ul className="mt-3 space-y-1 text-xs">
                  {g.topPages.length ? g.topPages.map((p) => (
                    <li key={p.path} className="flex justify-between gap-2"><span className="truncate text-muted-foreground">{p.path}</span><span>{p.views}</span></li>
                  )) : <li className="text-muted-foreground">Inga visningar ännu.</li>}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
