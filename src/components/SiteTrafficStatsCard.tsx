import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Globe, Users, Eye } from "lucide-react";
import { useSiteTrafficStats } from "@/hooks/useSiteTrafficStats";

interface Props {
  token: string | null;
  variant?: "full" | "compact";
}

export default function SiteTrafficStatsCard({ token, variant = "full" }: Props) {
  const [range, setRange] = useState<"d7" | "d30" | "d90">("d30");
  const stats = useSiteTrafficStats(token, !!token);

  const totals = stats.totals[range];
  const pages = stats.topPages[range];
  const limit = variant === "compact" ? 10 : 20;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="w-5 h-5" />
          Sajttrafik d365.se – totalt antal besökare & populäraste sidor
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Baseras på besök loggade i visitor_analytics. Bottar och interna IP-adresser filtreras bort.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={range} onValueChange={(v) => setRange(v as "d7" | "d30" | "d90")}>
          <TabsList className="grid w-full grid-cols-3 max-w-sm">
            <TabsTrigger value="d7">7 dagar</TabsTrigger>
            <TabsTrigger value="d30">30 dagar</TabsTrigger>
            <TabsTrigger value="d90">90 dagar</TabsTrigger>
          </TabsList>

          <TabsContent value={range} className="mt-4 space-y-4">
            {stats.loading ? (
              <p className="text-sm text-muted-foreground">Laddar trafikstatistik…</p>
            ) : stats.error ? (
              <p className="text-sm text-destructive">Fel: {stats.error}</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      <Users className="w-3.5 h-3.5" />
                      Unika besökare
                    </div>
                    <div className="text-2xl font-bold">{totals.uniqueVisitors.toLocaleString("sv-SE")}</div>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      <Eye className="w-3.5 h-3.5" />
                      Sidvisningar
                    </div>
                    <div className="text-2xl font-bold">{totals.pageViews.toLocaleString("sv-SE")}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Populäraste sidor (topp {Math.min(limit, pages.length)})
                  </h4>
                  {pages.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Ingen trafik registrerad i perioden.</p>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Sökväg</TableHead>
                            <TableHead className="text-right w-[120px]">Sidvisningar</TableHead>
                            <TableHead className="text-right w-[140px]">Unika besökare</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pages.slice(0, limit).map((p, idx) => (
                            <TableRow key={p.path}>
                              <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                              <TableCell>
                                <code className="text-xs">{p.path}</code>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant="secondary">{p.views.toLocaleString("sv-SE")}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline">{p.uniqueVisitors.toLocaleString("sv-SE")}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
