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
import { useToast } from "@/hooks/use-toast";
import {
  Users, TrendingUp, BarChart3, MousePointerClick, FileText,
  Award, ClipboardCheck, Download, Building2, RefreshCw, Copy
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

export default function AdminSalesOverview({ token, onSessionExpired }: AdminSalesOverviewProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [stats, setStats] = useState<any>(null);
  const [clickStats, setClickStats] = useState<any[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const startDate = startOfDay(subDays(new Date(), parseInt(dateRange)));

      const [visitorRes, clickRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "visitor-stats",
            token,
            startDate: startDate.toISOString(),
            excludePartnerTraffic: false,
          }),
        }),
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "click-stats", token }),
        }),
      ]);

      const visitorData = await visitorRes.json();
      const clickData = await clickRes.json();

      if (!visitorRes.ok) {
        if (visitorData.error?.includes("gått ut")) onSessionExpired();
        throw new Error(visitorData.error || "Kunde inte hämta data");
      }

      setStats(visitorData.stats);
      setClickStats(clickData?.stats || []);
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

  const handleCopyText = async () => {
    if (!stats) return;
    const lines: string[] = [];
    const periodLabel = dateRange === "7" ? "senaste 7 dagarna" : dateRange === "30" ? "senaste 30 dagarna" : "senaste 90 dagarna";
    const today = format(new Date(), "d MMMM yyyy", { locale: sv });

    lines.push(`📊 D365.se – Totalöversikt för införsäljning`);
    lines.push(`Period: ${periodLabel} (t.o.m. ${today})`);
    lines.push("");
    lines.push(`🔢 Totalt antal unika besökare: ${stats.totalVisitors}`);
    lines.push(`📄 Totalt antal sidvisningar: ${stats.totalPageViews}`);
    lines.push(`🇸🇪 Varav svenska besökare: ${stats.swedishVisitors}`);
    lines.push("");

    // Top pages excluding start
    const topPagesExclHome = (stats.topPages || []).filter((p: any) => p.path !== "/");
    if (topPagesExclHome.length > 0) {
      lines.push("─── MEST POPULÄRA SIDOR (exkl. startsidan) ───");
      topPagesExclHome.slice(0, 10).forEach((p: any, i: number) => {
        lines.push(`  ${i + 1}. ${PAGE_LABELS[p.path] || p.path} – ${p.visits} besök`);
      });
      lines.push("");
    }

    // Analysis tools
    const analysisData = ANALYSIS_PAGES
      .map(a => ({ ...a, visits: (stats.topPages || []).find((p: any) => p.path === a.path)?.visits || 0 }))
      .filter(a => a.visits > 0)
      .sort((a, b) => b.visits - a.visits);
    if (analysisData.length > 0) {
      lines.push("─── BEHOVSANALYSER & VERKTYG ───");
      analysisData.forEach((a, i) => {
        lines.push(`  ${i + 1}. ${a.label} – ${a.visits} besök`);
      });
      const totalAnalysis = analysisData.reduce((s, a) => s + a.visits, 0);
      lines.push(`  Totalt: ${totalAnalysis} besök i analysverktyg`);
      lines.push("");
    }

    // Partner pages
    if (stats.partnerProfileStats?.length > 0) {
      lines.push("─── BESÖK PER PARTNERPROFIL ───");
      stats.partnerProfileStats.forEach((p: any, i: number) => {
        lines.push(`  ${i + 1}. ${p.name} – ${p.visits} besök`);
      });
      lines.push("");
    }

    // Partner clicks
    if (stats.partnerClickStats?.length > 0) {
      lines.push("─── KLICK TILL PARTNERWEBBPLATSER ───");
      const totalClicks = stats.partnerClickStats.reduce((s: number, p: any) => s + p.clicks, 0);
      lines.push(`Totalt: ${totalClicks} klick`);
      stats.partnerClickStats.forEach((p: any, i: number) => {
        lines.push(`  ${i + 1}. ${p.name} – ${p.clicks} klick`);
      });
      lines.push("");
    }

    lines.push("───────────────");
    lines.push("Källa: d365.se – Sveriges oberoende guide till Microsoft Dynamics 365");

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
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

  if (!stats) {
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

  const periodLabel = dateRange === "7" ? "7 dagar" : dateRange === "30" ? "30 dagar" : "90 dagar";

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <Button variant="outline" size="sm" onClick={handleCopyText}>
            <Copy className="h-4 w-4 mr-1" />
            Kopiera
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-primary/30 bg-primary/5">
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
            <p className="text-3xl font-bold">{totalAnalysisVisits.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-muted-foreground mt-1">besök i analyser</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-medium">Profilbesök</span>
            </div>
            <p className="text-3xl font-bold">{totalPartnerProfileVisits.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-muted-foreground mt-1">partnerprofiler</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MousePointerClick className="h-4 w-4" />
              <span className="text-xs font-medium">Partnerklick</span>
            </div>
            <p className="text-3xl font-bold">{totalPartnerClicks.toLocaleString("sv-SE")}</p>
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
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Two-column: Top Pages + Analysis Tools */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Pages (excl. home) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Mest besökta sidor
            </CardTitle>
            <CardDescription>Exklusive startsidan</CardDescription>
          </CardHeader>
          <CardContent>
            {topPagesExclHome.length === 0 ? (
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
                  {topPagesExclHome.slice(0, 10).map((page: any, i: number) => (
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

        {/* Analysis Tools */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Behovsanalyser & Kravspecifikationer
            </CardTitle>
            <CardDescription>Besökare som aktivt utvärderar sina behov</CardDescription>
          </CardHeader>
          <CardContent>
            {analysisData.length === 0 ? (
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
                    {analysisData.map((a, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-sm">{a.label}</TableCell>
                        <TableCell className="text-right font-semibold">{a.visits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-3 pt-3 border-t flex justify-between text-sm font-semibold">
                  <span>Totalt</span>
                  <span>{totalAnalysisVisits}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Two-column: Partner Profiles + Partner Clicks */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Partner Profile Visits */}
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
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
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
                  <span>{totalPartnerProfileVisits}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Partner Clicks */}
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
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
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
                  <span>{totalPartnerClicks}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
