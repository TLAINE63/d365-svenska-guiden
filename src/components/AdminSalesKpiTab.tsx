import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp, Users, Target, MousePointerClick, Send, RefreshCw,
  Building2, Layers, Percent,
} from "lucide-react";
import { usePartners } from "@/hooks/usePartners";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";

interface AdminSalesKpiTabProps {
  token: string;
  onSessionExpired: () => void;
}

interface Lead {
  id: string;
  status: string;
  source_page: string | null;
  selected_product: string | null;
  assigned_partners: string[] | null;
  created_at: string;
  forwarded_at: string | null;
}

interface ClickStat {
  partner_name: string;
  month: string;
  clicks: number;
}

type RangeKey = "30" | "90" | "all";

const PRODUCT_ALIASES: Record<string, string> = {
  "Business Central": "Business Central",
  "Finance & Supply Chain": "Finance & Supply Chain",
  "Sales": "Sales",
  "Customer Service": "Customer Service",
  "Field Service": "Field Service",
  "Marketing": "Marketing",
  "Contact Center": "Contact Center",
  "Project Operations": "Project Operations",
  "Commerce": "Commerce",
  "Human Resources": "Human Resources",
};

function classifyChannel(sourcePage: string | null): string {
  if (!sourcePage) return "Okänd";
  const p = sourcePage.toLowerCase();
  if (p.startsWith("partner-profile-") || p.includes("partner-profile")) return "Partnerprofil";
  if (p.includes("partner-guide") || p.includes("valj-partner")) return "Välj partner / guide";
  if (p.includes("kom-igang")) return "Kom igång-guide";
  if (p.includes("kravspec")) return "Kravspecifikation";
  if (p.includes("behovsanalys")) return "Behovsanalys";
  if (p.includes("ai-readiness")) return "AI Readiness";
  if (p.includes("branschlos")) return "Branschlösningar";
  if (p === "homepage" || p === "/" || p === "index") return "Startsidan";
  if (p.startsWith("/crm") || p.startsWith("/d365-")) return "CRM-/produktsida";
  if (p.startsWith("/business-central") || p.startsWith("/erp")) return "ERP-sida";
  if (p.includes("kontakt")) return "Kontaktformulär";
  return "Övrigt";
}

function classifyProduct(selected: string | null): string {
  if (!selected) return "Ej angivet";
  for (const key of Object.keys(PRODUCT_ALIASES)) {
    if (selected.toLowerCase().includes(key.toLowerCase())) return key;
  }
  if (/ai/i.test(selected)) return "AI / Copilot";
  if (/erp/i.test(selected)) return "ERP";
  if (/crm|s.lj|service/i.test(selected)) return "CRM";
  return selected.length > 30 ? selected.slice(0, 30) + "…" : selected;
}

export default function AdminSalesKpiTab({ token, onSessionExpired }: AdminSalesKpiTabProps) {
  const { toast } = useToast();
  const { data: featuredPartners } = usePartners();
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>("90");
  const [view, setView] = useState<"channel" | "product">("channel");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clickStats, setClickStats] = useState<ClickStat[]>([]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [leadsRes, clicksRes] = await Promise.all([
        invokeAdminEdgeWithRetry<{ leads?: Lead[]; error?: string }>("manage-leads", { action: "list", token }),
        invokeAdminEdgeWithRetry<{ stats?: ClickStat[]; error?: string }>("manage-leads", { action: "click-stats", token }),
      ]);
      if (leadsRes.error?.message?.includes("401") || clicksRes.error?.message?.includes("401")) {
        onSessionExpired();
        return;
      }
      if (leadsRes.error) throw leadsRes.error;
      if (clicksRes.error) throw clicksRes.error;
      if (leadsRes.data?.error?.includes("gått ut") || clicksRes.data?.error?.includes("gått ut")) {
        onSessionExpired();
        return;
      }
      setLeads(leadsRes.data?.leads || []);
      setClickStats(clicksRes.data?.stats || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Kunde inte läsa säljdata", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredLeads = useMemo(() => {
    if (range === "all") return leads;
    const days = range === "30" ? 30 : 90;
    const cutoff = Date.now() - days * 86400000;
    return leads.filter((l) => new Date(l.created_at).getTime() >= cutoff);
  }, [leads, range]);

  const filteredClicks = useMemo(() => {
    if (range === "all") return clickStats;
    const days = range === "30" ? 30 : 90;
    const cutoff = Date.now() - days * 86400000;
    return clickStats.filter((c) => new Date(c.month).getTime() >= cutoff - 31 * 86400000);
  }, [clickStats, range]);

  const totals = useMemo(() => {
    const total = filteredLeads.length;
    const forwarded = filteredLeads.filter((l) => l.status === "forwarded" || l.forwarded_at).length;
    const conversion = total > 0 ? Math.round((forwarded / total) * 100) : 0;
    const totalClicks = filteredClicks.reduce((s, c) => s + c.clicks, 0);
    const partnersWithLeads = new Set(
      filteredLeads.flatMap((l) => l.assigned_partners || [])
    ).size;
    return { total, forwarded, conversion, totalClicks, partnersWithLeads };
  }, [filteredLeads, filteredClicks]);

  // Aggregate per channel/product
  const channelBreakdown = useMemo(() => {
    const map: Record<string, { leads: number; forwarded: number }> = {};
    filteredLeads.forEach((l) => {
      const key = classifyChannel(l.source_page);
      if (!map[key]) map[key] = { leads: 0, forwarded: 0 };
      map[key].leads++;
      if (l.status === "forwarded" || l.forwarded_at) map[key].forwarded++;
    });
    return Object.entries(map)
      .map(([channel, v]) => ({
        channel,
        leads: v.leads,
        forwarded: v.forwarded,
        conversion: v.leads > 0 ? Math.round((v.forwarded / v.leads) * 100) : 0,
      }))
      .sort((a, b) => b.leads - a.leads);
  }, [filteredLeads]);

  const productBreakdown = useMemo(() => {
    const map: Record<string, { leads: number; forwarded: number }> = {};
    filteredLeads.forEach((l) => {
      const key = classifyProduct(l.selected_product);
      if (!map[key]) map[key] = { leads: 0, forwarded: 0 };
      map[key].leads++;
      if (l.status === "forwarded" || l.forwarded_at) map[key].forwarded++;
    });
    return Object.entries(map)
      .map(([product, v]) => ({
        product,
        leads: v.leads,
        forwarded: v.forwarded,
        conversion: v.leads > 0 ? Math.round((v.forwarded / v.leads) * 100) : 0,
      }))
      .sort((a, b) => b.leads - a.leads);
  }, [filteredLeads]);

  // Per-partner aggregation
  const partnerBreakdown = useMemo(() => {
    const partnerMap: Record<string, {
      name: string;
      leads: number;
      forwarded: number;
      clicks: number;
    }> = {};

    // Init from featured partners
    (featuredPartners || []).forEach((p) => {
      partnerMap[p.name] = { name: p.name, leads: 0, forwarded: 0, clicks: 0 };
    });

    // Aggregate clicks
    filteredClicks.forEach((c) => {
      if (!partnerMap[c.partner_name]) {
        partnerMap[c.partner_name] = { name: c.partner_name, leads: 0, forwarded: 0, clicks: 0 };
      }
      partnerMap[c.partner_name].clicks += c.clicks;
    });

    // Aggregate leads where partner is assigned
    filteredLeads.forEach((l) => {
      const isForwarded = l.status === "forwarded" || !!l.forwarded_at;
      (l.assigned_partners || []).forEach((pName) => {
        if (!partnerMap[pName]) {
          partnerMap[pName] = { name: pName, leads: 0, forwarded: 0, clicks: 0 };
        }
        partnerMap[pName].leads++;
        if (isForwarded) partnerMap[pName].forwarded++;
      });
    });

    return Object.values(partnerMap)
      .map((p) => ({
        ...p,
        conversion: p.leads > 0 ? Math.round((p.forwarded / p.leads) * 100) : 0,
        ctr: p.clicks > 0 && p.leads > 0 ? Math.round((p.leads / p.clicks) * 100) : 0,
      }))
      .filter((p) => p.leads > 0 || p.clicks > 0)
      .sort((a, b) => (b.leads + b.clicks * 0.1) - (a.leads + a.clicks * 0.1));
  }, [filteredLeads, filteredClicks, featuredPartners]);

  const rangeLabel = range === "30" ? "30 dagar" : range === "90" ? "90 dagar" : "all tid";

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="pt-4 pb-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Datakällor:</strong> Leads (alla CTA-formulär), partnerklick och tilldelningar. 
          Mötesbokningar och demo-förfrågningar är inte separata fält i databasen — för att spåra dessa krävs utökad lead-status. 
          <span className="text-foreground"> Konvertering = vidarebefordrade leads / totala leads.</span>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Senaste 30 dagarna</SelectItem>
              <SelectItem value="90">Senaste 90 dagarna</SelectItem>
              <SelectItem value="all">All tid</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-1" /> Uppdatera
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Totala leads</span>
            </div>
            <p className="text-3xl font-bold">{totals.total}</p>
            <p className="text-xs text-muted-foreground mt-1">{rangeLabel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Send className="h-4 w-4" />
              <span className="text-xs font-medium">Vidarebefordrade</span>
            </div>
            <p className="text-3xl font-bold">{totals.forwarded}</p>
            <p className="text-xs text-muted-foreground mt-1">till partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Percent className="h-4 w-4" />
              <span className="text-xs font-medium">Konvertering</span>
            </div>
            <p className="text-3xl font-bold">{totals.conversion}%</p>
            <p className="text-xs text-muted-foreground mt-1">lead → vidarebefordrad</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MousePointerClick className="h-4 w-4" />
              <span className="text-xs font-medium">Partnerklick</span>
            </div>
            <p className="text-3xl font-bold">{totals.totalClicks.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-muted-foreground mt-1">{rangeLabel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-medium">Partners m. leads</span>
            </div>
            <p className="text-3xl font-bold">{totals.partnersWithLeads}</p>
            <p className="text-xs text-muted-foreground mt-1">tilldelade</p>
          </CardContent>
        </Card>
      </div>

      {/* Channel/Product breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" /> Leads per {view === "channel" ? "kanal" : "produkt"}
              </CardTitle>
              <CardDescription>
                Visar varifrån leads kommer och konverteringsgrad mot vidarebefordring
              </CardDescription>
            </div>
            <Tabs value={view} onValueChange={(v) => setView(v as "channel" | "product")}>
              <TabsList>
                <TabsTrigger value="channel">Kanal</TabsTrigger>
                <TabsTrigger value="product">Produkt</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {view === "channel" ? (
            channelBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">Inga leads i vald period.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kanal</TableHead>
                    <TableHead className="text-right">Leads</TableHead>
                    <TableHead className="text-right">Vidarebefordrade</TableHead>
                    <TableHead className="text-right">Konvertering</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelBreakdown.map((row) => (
                    <TableRow key={row.channel}>
                      <TableCell className="font-medium">{row.channel}</TableCell>
                      <TableCell className="text-right">{row.leads}</TableCell>
                      <TableCell className="text-right">{row.forwarded}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={row.conversion >= 50 ? "default" : "outline"}>
                          {row.conversion}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          ) : productBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground">Inga leads med produktval i vald period.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produkt</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Vidarebefordrade</TableHead>
                  <TableHead className="text-right">Konvertering</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productBreakdown.map((row) => (
                  <TableRow key={row.product}>
                    <TableCell className="font-medium">{row.product}</TableCell>
                    <TableCell className="text-right">{row.leads}</TableCell>
                    <TableCell className="text-right">{row.forwarded}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={row.conversion >= 50 ? "default" : "outline"}>
                        {row.conversion}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Per-partner table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Per partner
          </CardTitle>
          <CardDescription>
            Tilldelade leads, klick mot partnerwebbplats och konverteringsgrad
          </CardDescription>
        </CardHeader>
        <CardContent>
          {partnerBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Inga partner-aktiviteter i vald period.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead className="text-right">Klick</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Vidarebefordrade</TableHead>
                  <TableHead className="text-right">Konvertering</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerBreakdown.slice(0, 30).map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right">{p.clicks}</TableCell>
                    <TableCell className="text-right">{p.leads}</TableCell>
                    <TableCell className="text-right">{p.forwarded}</TableCell>
                    <TableCell className="text-right">
                      {p.leads > 0 ? (
                        <Badge variant={p.conversion >= 50 ? "default" : "outline"}>
                          {p.conversion}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
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
