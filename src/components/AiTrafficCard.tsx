import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bot } from "lucide-react";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";

interface Source {
  name: string;
  views: number;
  sessions: number;
  visitors: number;
  viaUtm: number;
  topPages: { path: string; views: number }[];
}

const RANGES = { d7: 7, d30: 30, d90: 90 } as const;

export default function AiTrafficCard({ token }: { token: string | null }) {
  const [range, setRange] = useState<keyof typeof RANGES>("d30");
  const [sources, setSources] = useState<Source[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setSources(null);
    setFailed(false);
    const start = new Date(Date.now() - RANGES[range] * 86400000).toISOString();
    invokeAdminEdgeWithRetry<{ sources?: Source[] }>("manage-leads", { action: "ai-traffic", token, startDate: start })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data?.sources) setFailed(true);
        else setSources(data.sources);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [token, range]);

  const total = sources?.reduce((s, x) => s + x.views, 0) ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="w-5 h-5" />
          AI-trafik (ChatGPT, Perplexity, Copilot, Gemini, Claude)
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Besök som kommer från AI-assistenter. Källan känns igen på utm_source (t.ex. utm_source=chatgpt.com) eller på adressen besökaren kom från. utm_source sparas från 2026-10-05.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={range} onValueChange={(v) => setRange(v as keyof typeof RANGES)}>
          <TabsList className="grid w-full grid-cols-3 max-w-sm">
            <TabsTrigger value="d7">7 dagar</TabsTrigger>
            <TabsTrigger value="d30">30 dagar</TabsTrigger>
            <TabsTrigger value="d90">90 dagar</TabsTrigger>
          </TabsList>
        </Tabs>
        {failed && <p className="text-sm text-destructive">Kunde inte hämta AI-trafiken.</p>}
        {!failed && !sources && <p className="text-sm text-muted-foreground">Hämtar…</p>}
        {sources && (
          <>
            <p className="text-sm">
              Totalt <strong>{total}</strong> sidvisningar från AI-källor.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Källa</TableHead>
                  <TableHead className="text-right">Unika besökare</TableHead>
                  <TableHead className="text-right">Sessioner</TableHead>
                  <TableHead className="text-right">Sidvisningar</TableHead>
                  <TableHead className="text-right">Via utm_source</TableHead>
                  <TableHead>Mest besökta sidor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-right">{s.visitors}</TableCell>
                    <TableCell className="text-right">{s.sessions}</TableCell>
                    <TableCell className="text-right">{s.views}</TableCell>
                    <TableCell className="text-right">{s.viaUtm}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {s.topPages.length ? s.topPages.map((p) => `${p.path} (${p.views})`).join(", ") : "–"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
