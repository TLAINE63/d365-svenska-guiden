import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { 
  isExcludedFromTracking, 
  setExcludeFromTracking 
} from "@/hooks/useVisitorTracking";
import { 
  Users, MapPin, Globe, TrendingUp, Clock, MousePointerClick,
  ChevronDown, ChevronUp, EyeOff, BarChart3
} from "lucide-react";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay, parseISO } from "date-fns";
import { sv } from "date-fns/locale";

interface VisitorStats {
  totalVisitors: number;
  totalPageViews: number;
  swedishVisitors: number;
  nordicVisitors: number;
  europeanVisitors: number;
  otherVisitors: number;
  swedishBounceRate: number;
  avgTimeOnPage: number;
  topPages: { path: string; visits: number }[];
  topCities: { city: string; region: string; visits: number }[];
  partnerProfileStats: { name: string; visits: number }[];
  partnerClickStats: { name: string; clicks: number }[];
  dailyVisitors: { date: string; visitors: number }[];
}

interface AdminVisitorStatsTabProps {
  token: string;
  onSessionExpired: () => void;
}

const NORDIC_COUNTRIES = ["SE", "NO", "DK", "FI", "IS"];
const EUROPEAN_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "EE", "FR", "DE", "GR", "HU", 
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", 
  "SI", "ES", "GB", "CH", "UA", "BY", "RS", "BA", "ME", "MK", "AL"
];

export default function AdminVisitorStatsTab({ token, onSessionExpired }: AdminVisitorStatsTabProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [dateRange, setDateRange] = useState("30");
  const [showAllCities, setShowAllCities] = useState(false);
  const [excludeSelf, setExcludeSelf] = useState(isExcludedFromTracking());
  const [excludePartners, setExcludePartners] = useState(false);

  const handleExcludeToggle = (checked: boolean) => {
    setExcludeFromTracking(checked);
    setExcludeSelf(checked);
    toast({
      title: checked ? "Spårning avstängd" : "Spårning aktiverad",
      description: checked 
        ? "Dina besök kommer inte längre att räknas i statistiken." 
        : "Dina besök kommer nu att räknas i statistiken.",
    });
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const startDate = startOfDay(subDays(new Date(), parseInt(dateRange)));
      
      // Fetch visitor data using edge function with admin token
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            action: "visitor-stats",
            token: token,
            startDate: startDate.toISOString(),
            excludePartnerTraffic: excludePartners,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("gått ut") || data.error?.includes("session")) {
          onSessionExpired();
        }
        throw new Error(data.error || "Kunde inte hämta statistik");
      }

      setStats(data.stats);
    } catch (error: any) {
      console.error("Error fetching visitor stats:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte hämta besökarstatistik",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange, token, excludePartners]);

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
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Ingen besökardata tillgänglig ännu.</p>
            <p className="text-sm mt-1">Data samlas in när besökare navigerar på sajten.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const geographyData = [
    { label: "Sverige", value: stats.swedishVisitors, color: "bg-blue-500" },
    { label: "Norden (exkl. SE)", value: stats.nordicVisitors, color: "bg-sky-400" },
    { label: "Europa", value: stats.europeanVisitors, color: "bg-emerald-500" },
    { label: "Övriga världen", value: stats.otherVisitors, color: "bg-amber-500" },
  ];

  const totalGeo = geographyData.reduce((sum, g) => sum + g.value, 0);

  return (
    <div className="space-y-6">
      {/* Self-exclusion toggle */}
      <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EyeOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <Label htmlFor="exclude-self" className="font-medium">
                  Exkludera mina egna besök
                </Label>
                <p className="text-sm text-muted-foreground">
                  Dina besök på d365.se kommer inte att räknas i statistiken
                </p>
              </div>
            </div>
            <Switch
              id="exclude-self"
              checked={excludeSelf}
              onCheckedChange={handleExcludeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Partner exclusion toggle */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <Label htmlFor="exclude-partners" className="font-medium">
                  Exkludera partnertrafik
                </Label>
                <p className="text-sm text-muted-foreground">
                  Dölj besök från anställda hos publicerade partners (baserat på organisationsdata)
                </p>
              </div>
            </div>
            <Switch
              id="exclude-partners"
              checked={excludePartners}
              onCheckedChange={setExcludePartners}
            />
          </div>
        </CardContent>
      </Card>
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Besökarstatistik (Svenska fokus)
        </h3>
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
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Unika besökare</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalVisitors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Sidvisningar</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalPageViews}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Sverige</span>
            </div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {stats.swedishVisitors}
              <span className="text-sm font-normal ml-1">
                ({totalGeo > 0 ? Math.round((stats.swedishVisitors / totalGeo) * 100) : 0}%)
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MousePointerClick className="h-4 w-4" />
              <span className="text-sm">Bounce rate (SE)</span>
            </div>
            <p className="text-2xl font-bold">{stats.swedishBounceRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Snitt tid (sek)</span>
            </div>
            <p className="text-2xl font-bold">{stats.avgTimeOnPage}</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Visitors Trend Chart */}
      {stats.dailyVisitors && stats.dailyVisitors.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Unika besökare per dag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                visitors: { label: "Besökare", color: "hsl(var(--primary))" },
              }}
              className="h-[280px] w-full"
            >
              <AreaChart data={stats.dailyVisitors} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    try {
                      return format(parseISO(val), "d MMM", { locale: sv });
                    } catch { return val; }
                  }}
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={35} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(val) => {
                        try {
                          return format(parseISO(val as string), "EEEE d MMMM", { locale: sv });
                        } catch { return String(val); }
                      }}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#visitorsGradient)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Geographic Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Geografisk fördelning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {geographyData.map((geo) => (
              <div key={geo.label} className="flex items-center gap-3">
                <div className="w-32 text-sm font-medium">{geo.label}</div>
                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${geo.color} transition-all duration-500`}
                    style={{ width: `${totalGeo > 0 ? (geo.value / totalGeo) * 100 : 0}%` }}
                  />
                </div>
                <div className="w-16 text-right text-sm font-medium">
                  {geo.value} <span className="text-muted-foreground">({totalGeo > 0 ? Math.round((geo.value / totalGeo) * 100) : 0}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Partner Profile Visits */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Profilbesök per partner
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!stats.partnerProfileStats || stats.partnerProfileStats.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                Ingen profildata tillgänglig ännu.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead className="text-right">Besök</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(showAllCities ? stats.partnerProfileStats : stats.partnerProfileStats.slice(0, 10)).map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-right">{p.visits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {stats.partnerProfileStats.length > 10 && (
                  <button
                    onClick={() => setShowAllCities(!showAllCities)}
                    className="w-full mt-2 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                  >
                    {showAllCities ? (
                      <>Visa färre <ChevronUp className="h-4 w-4" /></>
                    ) : (
                      <>Visa alla {stats.partnerProfileStats.length} <ChevronDown className="h-4 w-4" /></>
                    )}
                  </button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Partner Clicks (to partner websites) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MousePointerClick className="h-4 w-4" />
              Klick till partners sidor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!stats.partnerClickStats || stats.partnerClickStats.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                Ingen klickdata tillgänglig ännu.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead className="text-right">Klick</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.partnerClickStats.slice(0, 10).map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-right">{p.clicks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Populära sidor (Sverige)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topPages.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              Ingen siddata tillgänglig ännu.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sida</TableHead>
                  <TableHead className="text-right">Besök</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topPages.slice(0, 10).map((page, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium font-mono text-sm">
                      {page.path === "/" ? "/ (Startsidan)" : page.path}
                    </TableCell>
                    <TableCell className="text-right">{page.visits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
