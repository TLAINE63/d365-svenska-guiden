import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
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
import { Globe, Users, Eye, Info, TrendingUp, Award, ClipboardCheck, FileText, Building2, MousePointerClick, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Section { id: string; title: string; body: string; }
interface Config {
  showUniqueVisitors: boolean;
  showPageViews: boolean;
  showTopPages: boolean;
  showRangeTabs: boolean;
  showSalesSummary: boolean;
  sections: Section[];
}
interface Window { pageViews: number; uniqueVisitors: number; }
interface Page { path: string; views: number; uniqueVisitors: number; }
interface SalesSummary {
  totalVisitors: number;
  totalPageViews: number;
  valjPartner: number;
  analysisTotal: number;
  komIgang: number;
  partnerProfileVisits: number;
  partnerClicks: number;
  avgTimeOnPage: number;
}
interface Data {
  totals: { d7: Window; d30: Window; d90: Window };
  topPages: { d7: Page[]; d30: Page[]; d90: Page[] };
  salesSummary?: SalesSummary;
  config: Config;
}

const DEFAULT_CONFIG: Config = {
  showUniqueVisitors: true,
  showPageViews: true,
  showTopPages: true,
  showRangeTabs: true,
  showSalesSummary: true,
  sections: [],
};

export default function PartnerStats() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<"d7" | "d30" | "d90">("d30");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: res, error: err } = await supabase.functions.invoke("partner-public-stats", { body: {} });
      if (cancelled) return;
      if (err || !res || res.error) {
        setError(err?.message || res?.error || "Kunde inte ladda statistik");
        setLoading(false);
        return;
      }
      setData(res);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const config = data?.config || DEFAULT_CONFIG;
  const totals = data?.totals?.[range];
  const pages = (data?.topPages?.[range] || []).filter((p) => p.views > 0);

  return (
    <>
      <SEOHead
        title="Partnerstatistik"
        description="Sajtstatistik för d365.se – endast för partners."
        canonicalPath="/partner-statistik"
        noIndex
      />
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container max-w-5xl mx-auto px-4 space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Partnerstatistik – d365.se</h1>
            <p className="text-muted-foreground">
              Övergripande trafikstatistik för d365.se. Sidan är endast avsedd för partners
              och är inte länkad från sajten.
            </p>
          </header>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="w-5 h-5" />
                Om datan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>Statistiken baseras på besök loggade i d365.se:s besöksmätning.</p>
              <p>Bottar, intern trafik och partners egen trafik filtreras automatiskt bort.</p>
            </CardContent>
          </Card>

          {config.showSalesSummary && data?.salesSummary && (() => {
            const s = data.salesSummary;
            const avgMin = Math.floor(s.avgTimeOnPage / 60);
            const avgRest = s.avgTimeOnPage % 60;
            const avgStr = avgMin > 0 ? `${avgMin}m ${avgRest}s` : `${avgRest}s`;
            const boxes = [
              { icon: Users, label: "Unika besökare", value: s.totalVisitors.toLocaleString("sv-SE"), hint: " " },
              { icon: TrendingUp, label: "Sidvisningar", value: s.totalPageViews.toLocaleString("sv-SE"), hint: " " },
              { icon: Award, label: "Välj partner", value: s.valjPartner.toLocaleString("sv-SE"), hint: "besök på /valj-partner" },
              { icon: ClipboardCheck, label: "Behovsanalyser", value: s.analysisTotal.toLocaleString("sv-SE"), hint: "alla olika behovsanalyser" },
              { icon: FileText, label: "Kom igång-guiden", value: s.komIgang.toLocaleString("sv-SE"), hint: "besök på /kom-igang" },
              { icon: Building2, label: "Partnerprofiler", value: s.partnerProfileVisits.toLocaleString("sv-SE"), hint: "besök på partnerprofil" },
              { icon: MousePointerClick, label: "Partnerklick", value: s.partnerClicks.toLocaleString("sv-SE"), hint: "klickat vidare till partner" },
              { icon: BarChart3, label: "Snitt-tid på sida", value: avgStr, hint: "engagemang" },
            ];
            return (
              <Card className="border-primary/40 bg-gradient-to-br from-primary/5 via-background to-background">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Besökarstatistik – senaste 90 dagar
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Exkl. partnertrafik. Sammanställning av nyckeltal för sajtens räckvidd och engagemang.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {boxes.map((b, i) => {
                      const Icon = b.icon;
                      return (
                        <div key={i} className="rounded-lg border bg-card p-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 text-primary mb-1">
                            <Icon className="w-4 h-4" />
                            <span className="text-xs font-medium text-muted-foreground">{b.label}</span>
                          </div>
                          <p className="text-2xl font-bold leading-tight">{b.value}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">{b.hint}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="w-5 h-5" />
                Sajttrafik d365.se
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Laddar trafikstatistik…</p>
              ) : error ? (
                <p className="text-sm text-destructive">Fel: {error}</p>
              ) : (
                <Tabs value={range} onValueChange={(v) => setRange(v as any)}>
                  {config.showRangeTabs && (
                    <TabsList className="grid w-full grid-cols-3 max-w-sm">
                      <TabsTrigger value="d7">7 dagar</TabsTrigger>
                      <TabsTrigger value="d30">30 dagar</TabsTrigger>
                      <TabsTrigger value="d90">90 dagar</TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value={range} className="mt-4 space-y-4">
                    {(config.showUniqueVisitors || config.showPageViews) && totals && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {config.showUniqueVisitors && (
                          <div className="rounded-lg border bg-card p-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              <Users className="w-3.5 h-3.5" />
                              Unika besökare
                            </div>
                            <div className="text-2xl font-bold">{totals.uniqueVisitors.toLocaleString("sv-SE")}</div>
                          </div>
                        )}
                        {config.showPageViews && (
                          <div className="rounded-lg border bg-card p-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              <Eye className="w-3.5 h-3.5" />
                              Sidvisningar
                            </div>
                            <div className="text-2xl font-bold">{totals.pageViews.toLocaleString("sv-SE")}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {config.showTopPages && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Populäraste sidor (topp {Math.min(20, pages.length)})
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
                                {pages.slice(0, 20).map((p, idx) => (
                                  <TableRow key={p.path}>
                                    <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                                    <TableCell><code className="text-xs">{p.path}</code></TableCell>
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
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Admin-redigerbara fritextsektioner */}
          {config.sections?.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle className="text-base">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap">{s.body}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
