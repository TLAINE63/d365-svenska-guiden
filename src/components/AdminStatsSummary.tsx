import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";
import { Copy, FileText, RefreshCw } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { sv } from "date-fns/locale";

interface AdminStatsSummaryProps {
  token: string;
  onSessionExpired: () => void;
}

interface SummaryData {
  visitors: {
    total: number;
    swedish: number;
    topCities: { city: string; visits: number }[];
    topPages: { path: string; visits: number }[];
    avgTimeOnPage: number;
  };
  clicks: {
    total: number;
    byPartner: { name: string; clicks: number }[];
  };
  period: string;
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Startsidan",
  "/business-central": "Business Central",
  "/crm": "CRM",
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
  "/ai-readiness": "AI Assessment",
  "/events": "Events",
  "/fragor-och-svar": "Frågor & Svar",
  "/integritetspolicy": "Integritetspolicy",
  "/agents": "AI Agents",
  "/partner-events (portaler)": "Partner Event-portaler",
};

// Sections for "visits per menu area"
const MENU_SECTIONS: { label: string; paths: string[] }[] = [
  { label: "Startsidan", paths: ["/"] },
  { label: "Branschlösningar", paths: ["/branschlosningar"] },
  { label: "Det kritiska partnervalet", paths: ["/valj-partner"] },
  { label: "Affärssystem (ERP)", paths: ["/erp", "/business-central", "/finance-supply-chain", "/behovsanalys", "/kravspecifikation"] },
  { label: "Marknad & Sälj", paths: ["/crm", "/d365-sales", "/d365-marketing", "/behovsanalys-salj-marknad", "/kravspecifikation-sales", "/kravspecifikation-marketing"] },
  { label: "Kundservice", paths: ["/d365-customer-service", "/d365-field-service", "/d365-contact-center", "/behovsanalys-kundservice", "/kravspecifikation-customer-service"] },
  { label: "Microsoft AI", paths: ["/copilot", "/ai-oversikt", "/ai-readiness", "/agents"] },
  { label: "Events", paths: ["/events"] },
  { label: "Kontakt", paths: ["/kontakt"] },
];

function getPageLabel(path: string): string {
  return PAGE_LABELS[path] || path;
}

export default function AdminStatsSummary({ token, onSessionExpired }: AdminStatsSummaryProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [summaryText, setSummaryText] = useState("");

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      const isAll = dateRange === "all";
      const startDate = isAll ? null : startOfDay(subDays(new Date(), parseInt(dateRange)));
      const periodLabel = isAll
        ? "totalt sedan start"
        : dateRange === "7" ? "senaste 7 dagarna" : dateRange === "30" ? "senaste 30 dagarna" : "senaste 90 dagarna";

      // Fetch visitor stats
      const { data: visitorData, error: visitorError } = await invokeAdminEdgeWithRetry<{ stats?: any; error?: string }>("manage-leads", {
        action: "visitor-stats",
        token,
        startDate: startDate ? startDate.toISOString() : null,
      });
      if (visitorError) throw visitorError;
      if (visitorData?.error) {
        if (visitorData.error.includes("gått ut")) onSessionExpired();
        throw new Error(visitorData.error || "Kunde inte hämta besökardata");
      }

      // Fetch click stats and published partners in parallel
      const [{ data: clickData, error: clickError }, partnersRes] = await Promise.all([
        invokeAdminEdgeWithRetry<{ stats?: any[]; excludedClicks?: number; error?: string }>("manage-leads", { action: "click-stats", token }),
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-partners`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get-full", token }),
        }),
      ]);
      if (clickError) throw clickError;
      if (clickData?.error) throw new Error(clickData.error || "Kunde inte hämta klickdata");
      const partnersData = await partnersRes.json();
      const publishedPartners: { name: string; slug: string }[] = (partnersData?.partners || [])
        .filter((p: any) => p.is_featured)
        .map((p: any) => ({ name: p.name, slug: p.slug }));

      // Build a map of lowercase partner name -> current published name for merging
      const nameMap = new Map<string, string>();
      for (const p of publishedPartners) {
        nameMap.set(p.name.toLowerCase(), p.name);
      }
      // Add common aliases for known renames
      const ALIASES: Record<string, string> = {
        "4ps sweden": "4PS Construction Software AB",
        "bisqo": "Bisqo AB",
        "nexer": "Nexer Group",
      };
      for (const [alias, canonical] of Object.entries(ALIASES)) {
        if (nameMap.has(canonical.toLowerCase())) {
          nameMap.set(alias.toLowerCase(), canonical);
        }
      }

      const stats = visitorData.stats;
      const clickStats = clickData?.stats || [];

      // Build text
      const today = format(new Date(), "d MMMM yyyy", { locale: sv });
      const lines: string[] = [];

      lines.push(`📊 Statistiksammanfattning för D365.se`);
      lines.push(`Period: ${periodLabel} (t.o.m. ${today})`);
      lines.push("");
      lines.push("─── BESÖKARE ───");
      lines.push(`Unika besökare: ${stats.totalVisitors}`);
      lines.push(`Sidvisningar: ${stats.totalPageViews || 'N/A'}`);
      lines.push(`Varav från Sverige: ${stats.swedishVisitors} (${stats.totalVisitors > 0 ? Math.round((stats.swedishVisitors / stats.totalVisitors) * 100) : 0}%)`);
      if (stats.nordicVisitors > 0) lines.push(`Norden (exkl. Sverige): ${stats.nordicVisitors}`);
      if (stats.europeanVisitors > 0) lines.push(`Övriga Europa: ${stats.europeanVisitors}`);
      lines.push(`Snittid på sidan: ${stats.avgTimeOnPage} sekunder`);


      // Build allPages lookup from topPages
      const allPages: Record<string, number> = {};
      if (stats.topPages) {
        for (const p of stats.topPages) {
          if (p.path.startsWith("/partner-events/")) {
            allPages["/partner-events (portaler)"] = (allPages["/partner-events (portaler)"] || 0) + p.visits;
          } else {
            allPages[p.path] = (allPages[p.path] || 0) + p.visits;
          }
        }
      }
      const getVisits = (path: string) => allPages[path] || 0;

      // Top pages (aggregated)
      if (stats.topPages?.length > 0) {
        const aggregated = Object.entries(allPages).map(([path, visits]) => ({ path, visits }));
        aggregated.sort((a, b) => b.visits - a.visits);

        lines.push("");
        lines.push("📄 Mest besökta sidor:");
        aggregated.slice(0, 10).forEach((p, i) => {
          lines.push(`  ${i + 1}. ${getPageLabel(p.path)} – ${p.visits} besök`);
        });
      }

      // Behovsanalyser, Kravspec & AI Assessment
      const toolPages = [
        "/behovsanalys",
        "/behovsanalys-salj-marknad",
        "/behovsanalys-kundservice",
        "/kravspecifikation",
        "/kravspecifikation-sales",
        "/kravspecifikation-customer-service",
        "/kravspecifikation-marketing",
        "/ai-readiness",
      ];
      const toolData = toolPages.map(p => ({ path: p, visits: getVisits(p) })).filter(t => t.visits > 0);
      if (toolData.length > 0) {
        lines.push("");
        lines.push("─── VERKTYG & ANALYSER ───");
        toolData.sort((a, b) => b.visits - a.visits);
        toolData.forEach((t, i) => {
          lines.push(`  ${i + 1}. ${getPageLabel(t.path)} – ${t.visits} besök`);
        });
        const toolTotal = toolData.reduce((s, t) => s + t.visits, 0);
        lines.push(`  Totalt: ${toolTotal} besök`);
      }

      // Visits per menu section
      lines.push("");
      lines.push("─── BESÖK PER MENYSEKTION ───");
      for (const section of MENU_SECTIONS) {
        const sectionTotal = section.paths.reduce((sum, p) => sum + getVisits(p), 0);
        if (sectionTotal > 0) {
          lines.push(`  ${section.label}: ${sectionTotal} besök`);
        }
      }

      if (stats.partnerProfileStats?.length > 0) {
        lines.push("");
        lines.push("─── PROFILBESÖK PER PARTNER ───");
        lines.push("(exkl. admin och partnerinterna besök)");
        stats.partnerProfileStats.forEach((p: any, i: number) => {
          lines.push(`  ${i + 1}. ${p.name} – ${p.visits} besök`);
        });
      }

      if (clickStats.length > 0) {
        // Aggregate clicks per partner, merging aliases and filtering to published only
        const partnerTotals: Record<string, number> = {};
        for (const cs of clickStats) {
          const key = cs.partner_name.toLowerCase();
          const resolvedName = nameMap.get(key);
          if (!resolvedName) continue; // Skip non-published / test partners
          partnerTotals[resolvedName] = (partnerTotals[resolvedName] || 0) + cs.clicks;
        }
        const sorted = Object.entries(partnerTotals).sort((a, b) => b[1] - a[1]);
        const totalClicks = sorted.reduce((s, [, c]) => s + c, 0);

        lines.push("");
        lines.push("─── PARTNERKLICK ───");
        lines.push(`Totalt antal klick till partnerwebbplatser: ${totalClicks}`);
        const excludedClicks = clickData?.excludedClicks || 0;
        if (excludedClicks > 0) {
          lines.push(`(${excludedClicks} klick exkluderade – admin och partnerinternt)`);
        }
        lines.push("");
        lines.push("Klick per publicerad partner:");
        sorted.forEach(([name, clicks], i) => {
          lines.push(`  ${i + 1}. ${name} – ${clicks} klick`);
        });
      }

      lines.push("");
      lines.push("───────────────");
      lines.push("Källa: d365.se – Din guide till Dynamics 365 i Sverige");

      setSummaryText(lines.join("\n"));
    } catch (error: any) {
      console.error("Error generating summary:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte generera sammanfattning",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      toast({ title: "Kopierat!", description: "Statistiksammanfattningen har kopierats till urklipp." });
    } catch {
      // Fallback
      const textarea = document.querySelector<HTMLTextAreaElement>("#stats-summary-textarea");
      if (textarea) {
        textarea.select();
        document.execCommand("copy");
        toast({ title: "Kopierat!" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generera statistiksammanfattning för email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Välj tidsperiod och generera en textsammanfattning med nyckeltal som du kan kopiera och klistra in i ett email till partners.
          </p>

          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Totalt (sedan start)</SelectItem>
                <SelectItem value="7">Senaste 7 dagar</SelectItem>
                <SelectItem value="30">Senaste 30 dagar</SelectItem>
                <SelectItem value="90">Senaste 90 dagar</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateSummary} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Generera sammanfattning
            </Button>
          </div>

          {summaryText && (
            <div className="space-y-3">
              <Textarea
                id="stats-summary-textarea"
                value={summaryText}
                readOnly
                rows={Math.min(summaryText.split("\n").length + 2, 30)}
                className="font-mono text-sm bg-muted/30"
              />
              <Button onClick={handleCopy} variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Kopiera till urklipp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
