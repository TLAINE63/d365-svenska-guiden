import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Users, TrendingUp, BarChart3, MousePointerClick, FileText,
  Award, ClipboardCheck, Download, Building2, RefreshCw, Copy, ShieldCheck
} from "lucide-react";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Bar, BarChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format, subDays, startOfDay, parseISO } from "date-fns";
import { sv } from "date-fns/locale";

interface AdminSalesOverviewProps {
  token: string;
  onSessionExpired: () => void;
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Startsidan",
  "/business-central": "Business Central",
  "/crm": "CRM-översikt",
  "/erp": "ERP-översikt",
  "/valj-partner": "Välj Partner",
  "/copilot": "Copilot",
  "/branschlosningar": "Branschlösningar",
  "/kontakt": "Kontakt",
  "/d365-sales": "Dynamics 365 Sales",
  "/d365-customer-service": "Dynamics 365 Customer Service",
  "/d365-marketing": "Dynamics 365 Marketing",
  "/d365-field-service": "Dynamics 365 Field Service",
  "/d365-contact-center": "Dynamics 365 Contact Center",
  "/finance-supply-chain": "Finance & Supply Chain",
  "/behovsanalys": "Behovsanalys ERP",
  "/behovsanalys-salj-marknad": "Behovsanalys Sälj & Marknad",
  "/behovsanalys-kundservice": "Behovsanalys Kundservice",
  "/kravspecifikation": "Kravspecifikation ERP",
  "/kravspecifikation-sales": "Kravspecifikation Sales",
  "/kravspecifikation-customer-service": "Kravspecifikation Customer Service",
  "/kravspecifikation-marketing": "Kravspecifikation Marketing",
  "/ai-oversikt": "AI-översikt",
  "/ai-readiness": "AI Business Impact Assessment",
  "/events": "Events",
  "/fragor-och-svar": "Frågor & Svar",
  "/agents": "AI Agents",
  "/kom-igang": "Kom igång-guiden",
  "/kunskapscenter": "Kunskapscenter",
};

const ANALYSIS_PAGES = [
  { path: "/behovsanalys", label: "Behovsanalys ERP" },
  { path: "/behovsanalys-salj-marknad", label: "Behovsanalys Sälj & Marknad" },
  { path: "/behovsanalys-kundservice", label: "Behovsanalys Kundservice" },
  { path: "/kravspecifikation", label: "Kravspecifikation ERP" },
  { path: "/kravspecifikation-sales", label: "Kravspecifikation Sales" },
  { path: "/kravspecifikation-customer-service", label: "Kravspecifikation Customer Service" },
  { path: "/kravspecifikation-marketing", label: "Kravspecifikation Marketing" },
  { path: "/ai-readiness", label: "AI Business Impact Assessment" },
];

const BAR_COLORS = [
  "hsl(var(--primary))",
  "hsl(210, 80%, 55%)",
  "hsl(190, 70%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(140, 55%, 40%)",
  "hsl(120, 50%, 42%)",
  "hsl(80, 55%, 45%)",
  "hsl(45, 80%, 50%)",
  "hsl(30, 75%, 50%)",
  "hsl(15, 70%, 50%)",
];

function deriveMetrics(stats: any) {
  const topPagesExclHome = (stats.topPages || []).filter((p: any) => p.path !== "/");
  const analysisData = ANALYSIS_PAGES
    .map(a => ({
      ...a,
      visits: (stats.topPages || []).find((p: any) => p.path === a.path)?.visits || 0,
    }))
    .filter(a => a.visits > 0)
    .sort((a, b) => b.visits - a.visits);
  const totalAnalysisVisits = analysisData.reduce((s, a) => s + a.visits, 0);
  const totalPartnerClicks = (stats.partnerClickStats || []).reduce((s: number, p: any) => s + p.clicks, 0);
  const totalPartnerProfileVisits = (stats.partnerProfileStats || []).reduce((s: number, p: any) => s + p.visits, 0);
  return { topPagesExclHome, analysisData, totalAnalysisVisits, totalPartnerClicks, totalPartnerProfileVisits };
}

function buildCopyText(stats: any, dateRange: string, excludePartners: boolean) {
  const m = deriveMetrics(stats);
  const periodLabel = dateRange === "7" ? "senaste 7 dagarna" : dateRange === "30" ? "senaste 30 dagarna" : "senaste 90 dagarna";
  const today = format(new Date(), "d MMMM yyyy", { locale: sv });
  const lines: string[] = [];
  const suffix = excludePartners ? " (exkl. partnertrafik)" : "";

  lines.push(`📊 D365.se – Totalöversikt${suffix}`);
  lines.push(`Period: ${periodLabel} (t.o.m. ${today})`);
  lines.push("");
  lines.push(`🔢 Totalt antal unika besökare: ${stats.totalVisitors}`);
  lines.push(`📄 Totalt antal sidvisningar: ${stats.totalPageViews}`);
  lines.push(`🇸🇪 Varav svenska besökare: ${stats.swedishVisitors}`);
  lines.push("");

  if (m.topPagesExclHome.length > 0) {
    lines.push("─── MEST POPULÄRA SIDOR (exkl. startsidan) ───");
    m.topPagesExclHome.slice(0, 10).forEach((p: any, i: number) => {
      lines.push(`  ${i + 1}. ${PAGE_LABELS[p.path] || p.path} – ${p.visits} besök`);
    });
    lines.push("");
  }

  if (m.analysisData.length > 0) {
    lines.push("─── BEHOVSANALYSER & VERKTYG ───");
    m.analysisData.forEach((a: any, i: number) => {
      lines.push(`  ${i + 1}. ${a.label} – ${a.visits} besök`);
    });
    lines.push(`  Totalt: ${m.totalAnalysisVisits} besök i analysverktyg`);
    lines.push("");
  }

  if (stats.partnerProfileStats?.length > 0) {
    lines.push("─── BESÖK PER PARTNERPROFIL ───");
    stats.partnerProfileStats.forEach((p: any, i: number) => {
      lines.push(`  ${i + 1}. ${p.name} – ${p.visits} besök`);
    });
    lines.push("");
  }

  if (stats.partnerClickStats?.length > 0) {
    lines.push("─── KLICK TILL PARTNERWEBBPLATSER ───");
    lines.push(`Totalt: ${m.totalPartnerClicks} klick`);
    stats.partnerClickStats.forEach((p: any, i: number) => {
      lines.push(`  ${i + 1}. ${p.name} – ${p.clicks} klick`);
    });
    lines.push("");
  }

  lines.push("───────────────");
  lines.push("Källa: d365.se – Sveriges oberoende guide till Microsoft Dynamics 365");
  return lines.join("\n");
}

// ================ Reusable Overview Block ================

interface OverviewBlockProps {
  stats: any;
  periodLabel: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentClass?: string;
  gradientId: string;
}

function OverviewBlock({ stats, periodLabel, title, subtitle, icon, accentClass, gradientId }: OverviewBlockProps) {
  const m = deriveMetrics(stats);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className={accentClass || "border-primary/30 bg-primary/5"}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Unika besökare</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalVisitors.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-muted-foreground mt-1">senaste {periodLabel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Sidvisningar</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalPageViews.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-muted-foreground mt-1">senaste {periodLabel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <ClipboardCheck className="h-4 w-4" />
              <span className="text-xs font-medium">Analysverktyg</span>
            </div>
            <p className="text-3xl font-bold">{m.totalAnalysisVisits.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-muted-foreground mt-1">besök i analyser</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-medium">Profilbesök</span>
            </div>
            <p className="text-3xl font-bold">{m.totalPartnerProfileVisits.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-muted-foreground mt-1">partnerprofiler</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MousePointerClick className="h-4 w-4" />
              <span className="text-xs font-medium">Partnerklick</span>
            </div>
            <p className="text-3xl font-bold">{m.totalPartnerClicks.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-muted-foreground mt-1">till partnerwebbplatser</p>
          </CardContent>
        </Card>
      </div>

      {/* Visitor Trend Chart */}
      {stats.dailyVisitors && stats.dailyVisitors.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Besökstrend – unika besökare per dag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ visitors: { label: "Besökare", color: "hsl(var(--primary))" } }}
              className="h-[250px] w-full"
            >
              <AreaChart data={stats.dailyVisitors} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    try { return format(parseISO(val), "d MMM", { locale: sv }); }
                    catch { return val; }
                  }}
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={35} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(val) => {
                        try { return format(parseISO(val as string), "EEEE d MMMM", { locale: sv }); }
                        catch { return String(val); }
                      }}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Two-column: Top Pages + Analysis Tools */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Mest besökta sidor
            </CardTitle>
            <CardDescription>Exklusive startsidan</CardDescription>
          </CardHeader>
          <CardContent>
            {m.topPagesExclHome.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">Ingen data</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Sida</TableHead>
                    <TableHead className="text-right">Besök</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {m.topPagesExclHome.slice(0, 10).map((page: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground w-8">{i + 1}</TableCell>
                      <TableCell className="font-medium text-sm">
                        {PAGE_LABELS[page.path] || page.path}
                      </TableCell>
                      <TableCell className="text-right font-semibold">{page.visits}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Behovsanalyser & Kravspecifikationer
            </CardTitle>
            <CardDescription>Besökare som aktivt utvärderar sina behov</CardDescription>
          </CardHeader>
          <CardContent>
            {m.analysisData.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">Ingen data</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Verktyg</TableHead>
                      <TableHead className="text-right">Besök</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {m.analysisData.map((a: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-sm">{a.label}</TableCell>
                        <TableCell className="text-right font-semibold">{a.visits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-3 pt-3 border-t flex justify-between text-sm font-semibold">
                  <span>Totalt</span>
                  <span>{m.totalAnalysisVisits}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Two-column: Partner Profiles + Partner Clicks */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Besök per partnerprofil
            </CardTitle>
            <CardDescription>Hur många som besökt respektive partners sida</CardDescription>
          </CardHeader>
          <CardContent>
            {!stats.partnerProfileStats || stats.partnerProfileStats.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">Ingen data</p>
            ) : (
              <>
                <ChartContainer
                  config={{ visits: { label: "Besök", color: "hsl(var(--primary))" } }}
                  className="h-[300px] w-full"
                >
                  <BarChart
                    data={stats.partnerProfileStats.slice(0, 10)}
                    layout="vertical"
                    margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="visits" radius={[0, 4, 4, 0]}>
                      {stats.partnerProfileStats.slice(0, 10).map((_: any, i: number) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <div className="mt-3 pt-3 border-t flex justify-between text-sm font-semibold">
                  <span>Totalt profilbesök</span>
                  <span>{m.totalPartnerProfileVisits}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MousePointerClick className="h-4 w-4" />
              Klick till partnerwebbplatser
            </CardTitle>
            <CardDescription>Besökare som klickat vidare till partners egna sidor</CardDescription>
          </CardHeader>
          <CardContent>
            {!stats.partnerClickStats || stats.partnerClickStats.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">Ingen data</p>
            ) : (
              <>
                <ChartContainer
                  config={{ clicks: { label: "Klick", color: "hsl(210, 80%, 55%)" } }}
                  className="h-[300px] w-full"
                >
                  <BarChart
                    data={stats.partnerClickStats.slice(0, 10)}
                    layout="vertical"
                    margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="clicks" radius={[0, 4, 4, 0]}>
                      {stats.partnerClickStats.slice(0, 10).map((_: any, i: number) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <div className="mt-3 pt-3 border-t flex justify-between text-sm font-semibold">
                  <span>Totalt klick</span>
                  <span>{m.totalPartnerClicks}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ================ Main Component ================

function buildOneLine90d(stats: any): string {
  if (!stats) return "";
  const totalVisitors = stats.totalVisitors || 0;
  const totalPageViews = stats.totalPageViews || 0;
  const swedish = stats.swedishVisitors || 0;
  const swedishPct = totalVisitors > 0 ? Math.round((swedish / totalVisitors) * 100) : 0;
  const pages = stats.topPages || [];
  const findVisits = (path: string) => pages.find((p: any) => p.path === path)?.visits || 0;
  const valjPartner = findVisits("/valj-partner");
  const komIgang = findVisits("/kom-igang");
  const analysisTotal = ANALYSIS_PAGES.reduce((s, a) => s + findVisits(a.path), 0);
  const avgSec = stats.avgTimeOnPage || 0;
  const avgMin = Math.floor(avgSec / 60);
  const avgRest = avgSec % 60;
  const avgStr = avgMin > 0 ? `${avgMin}m ${avgRest}s` : `${avgRest}s`;
  return `D365.se senaste 90 dagar: ${totalVisitors.toLocaleString("sv-SE")} unika besökare · ${totalPageViews.toLocaleString("sv-SE")} sidvisningar · ${swedishPct}% svensk trafik · Välj partner ${valjPartner} besök · Behovsanalyser ${analysisTotal} besök · Kom igång-guiden ${komIgang} besök · snitt-tid ${avgStr}`;
}

export default function AdminSalesOverview({ token, onSessionExpired }: AdminSalesOverviewProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [statsAll, setStatsAll] = useState<any>(null);
  const [statsFiltered, setStatsFiltered] = useState<any>(null);
  const [stats90d, setStats90d] = useState<any>(null);

  const postWithRetry = async (body: any, attempts = 3): Promise<Response> => {
    let lastErr: any;
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        // Retry on transient edge-runtime 5xx
        if (res.status >= 500 && res.status < 600 && i < attempts - 1) {
          await new Promise((r) => setTimeout(r, 600 * (i + 1)));
          continue;
        }
        return res;
      } catch (e) {
        lastErr = e;
        if (i < attempts - 1) {
          await new Promise((r) => setTimeout(r, 600 * (i + 1)));
          continue;
        }
      }
    }
    throw lastErr || new Error("Network error");
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const startDate = startOfDay(subDays(new Date(), parseInt(dateRange)));
      const startDate90 = startOfDay(subDays(new Date(), 90));

      const [allRes, filteredRes, clickRes, ninetyRes] = await Promise.all([
        postWithRetry({ action: "visitor-stats", token, startDate: startDate.toISOString(), excludePartnerTraffic: false }),
        postWithRetry({ action: "visitor-stats", token, startDate: startDate.toISOString(), excludePartnerTraffic: true }),
        postWithRetry({ action: "click-stats", token }),
        postWithRetry({ action: "visitor-stats", token, startDate: startDate90.toISOString(), excludePartnerTraffic: true }),
      ]);

      if (allRes.status >= 500) {
        throw new Error("Backend-tjänsten är tillfälligt otillgänglig. Försök igen om en stund.");
      }

      const allData = await allRes.json().catch(() => ({}));
      const filteredData = await filteredRes.json().catch(() => ({}));
      const clickData = await clickRes.json().catch(() => ({}));
      const ninetyData = await ninetyRes.json().catch(() => ({}));

      if (!allRes.ok) {
        if (allData.error?.includes("gått ut")) onSessionExpired();
        throw new Error(allData.error || "Kunde inte hämta data");
      }

      setStatsAll(allData.stats);
      setStatsFiltered(filteredData.stats || null);
      setStats90d(ninetyData.stats || null);
    } catch (error: any) {
      console.error("Error fetching sales overview:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte hämta översiktsdata",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, token]);

  const handleCopy = async (stats: any, excludePartners: boolean) => {
    const text = buildCopyText(stats, dateRange, excludePartners);
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Kopierat!", description: "Översikten har kopierats till urklipp." });
    } catch {
      toast({ title: "Kunde inte kopiera", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!statsAll) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Ingen data tillgänglig ännu.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const periodLabel = dateRange === "7" ? "7 dagar" : dateRange === "30" ? "30 dagar" : "90 dagar";

  return (
    <div className="space-y-8">
      {/* Shared Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Totalöversikt – Införsäljning
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Nyckeltal för att visa sajtens värde för partners
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Senaste 7 dagar</SelectItem>
              <SelectItem value="30">Senaste 30 dagar</SelectItem>
              <SelectItem value="90">Senaste 90 dagar</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ===== 90-DAY SALES SUMMARY (boxes) ===== */}
      {stats90d && statsAll && (() => {
        const ext = stats90d;
        const all = statsAll; // current dateRange — for partner traffic share
        const extVisitors = ext.totalVisitors || 0;
        const extPageViews = ext.totalPageViews || 0;
        const extSwedish = ext.swedishVisitors || 0;
        const extSwedishPct = extVisitors > 0 ? Math.round((extSwedish / extVisitors) * 100) : 0;
        const allVisitors = all.totalVisitors || 0;
        const partnerShare = allVisitors > 0 ? Math.max(0, allVisitors - extVisitors) : 0;
        const partnerPct = allVisitors > 0 ? Math.round((partnerShare / allVisitors) * 100) : 0;
        const findVisits = (path: string) => (ext.topPages || []).find((p: any) => p.path === path)?.visits || 0;
        const valjPartner = findVisits("/valj-partner");
        const komIgang = findVisits("/kom-igang");
        const analysisTotal = ANALYSIS_PAGES.reduce((s, a) => s + findVisits(a.path), 0);
        const avgSec = ext.avgTimeOnPage || 0;
        const avgMin = Math.floor(avgSec / 60);
        const avgRest = avgSec % 60;
        const avgStr = avgMin > 0 ? `${avgMin}m ${avgRest}s` : `${avgRest}s`;
        const partnerProfileVisits = (ext.partnerProfileStats || []).reduce((s: number, p: any) => s + p.visits, 0);
        const partnerClicks = (ext.partnerClickStats || []).reduce((s: number, p: any) => s + p.clicks, 0);

        const oneLine = `D365.se senaste 90 dagar: ${extVisitors.toLocaleString("sv-SE")} unika besökare · ${extPageViews.toLocaleString("sv-SE")} sidvisningar · Välj partner ${valjPartner} besök · Behovsanalyser ${analysisTotal} besök · Kom igång-guiden ${komIgang} besök · Partnerprofiler ${partnerProfileVisits} besök · Partnerklick ${partnerClicks} · snitt-tid ${avgStr}`;

        const boxes = [
          { icon: Users, label: "Unika besökare", value: extVisitors.toLocaleString("sv-SE"), hint: "exkl. partnertrafik" },
          { icon: TrendingUp, label: "Sidvisningar", value: extPageViews.toLocaleString("sv-SE"), hint: "exkl. partnertrafik" },
          { icon: Award, label: "Välj partner", value: valjPartner.toLocaleString("sv-SE"), hint: "besök på /valj-partner" },
          { icon: ClipboardCheck, label: "Behovsanalyser", value: analysisTotal.toLocaleString("sv-SE"), hint: "alla analysverktyg" },
          { icon: FileText, label: "Kom igång-guiden", value: komIgang.toLocaleString("sv-SE"), hint: "besök på /kom-igang" },
          { icon: Building2, label: "Partnerprofiler", value: partnerProfileVisits.toLocaleString("sv-SE"), hint: "besök på partnerprofil" },
          { icon: MousePointerClick, label: "Partnerklick", value: partnerClicks.toLocaleString("sv-SE"), hint: "vidare till partner" },
          { icon: BarChart3, label: "Snitt-tid på sida", value: avgStr, hint: "engagemang" },
        ];

        return (
          <Card className="border-primary/40 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Säljunderlag – senaste 90 dagar
                  </CardTitle>
                  <CardDescription>
                    Exkl. partnertrafik (svensk %, partner-% och alla nyckeltal). Klicka för att kopiera som textrad.
                  </CardDescription>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(oneLine);
                      toast({ title: "Kopierat!", description: "Säljunderlaget finns i urklipp." });
                    } catch {
                      toast({ title: "Kunde inte kopiera", variant: "destructive" });
                    }
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Kopiera som rad
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {boxes.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={i}
                      className="rounded-lg border bg-card p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <Icon className="h-4 w-4" />
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

      {/* ===== SECTION 1: All traffic ===== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h4 className="text-lg font-semibold">Alla besökare</h4>
            <Badge variant="outline" className="text-xs">Inkl. partnertrafik</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleCopy(statsAll, false)}>
            <Copy className="h-4 w-4 mr-1" />
            Kopiera
          </Button>
        </div>
        <OverviewBlock
          stats={statsAll}
          periodLabel={periodLabel}
          title="Alla besökare"
          subtitle="Inklusive partnertrafik"
          icon={<Users className="h-6 w-6" />}
          gradientId="salesGradientAll"
        />
      </div>

      {/* Divider */}
      <div className="relative py-4">
        <Separator />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Exkl. partnertrafik nedan
          </Badge>
        </div>
      </div>

      {/* ===== SECTION 2: Filtered traffic ===== */}
      {statsFiltered ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-lg font-semibold">Enbart externa besökare</h4>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 text-xs">
                Exkl. partners
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleCopy(statsFiltered, true)}>
              <Copy className="h-4 w-4 mr-1" />
              Kopiera
            </Button>
          </div>
          <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10">
            <CardContent className="py-3">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Dessa siffror exkluderar besök från anställda hos publicerade partners, baserat på organisationsdata (ISP/företag).
                Idealiskt för att visa det faktiska kundintresset på sajten.
              </p>
            </CardContent>
          </Card>
          <OverviewBlock
            stats={statsFiltered}
            periodLabel={periodLabel}
            title="Externa besökare"
            subtitle="Exklusive partnertrafik"
            icon={<ShieldCheck className="h-6 w-6" />}
            accentClass="border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20"
            gradientId="salesGradientFiltered"
          />
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">
              Kunde inte hämta filtrerad data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
