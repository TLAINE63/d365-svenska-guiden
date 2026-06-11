import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Users, Target, Eye, MousePointerClick, Globe, Sparkles, Copy, RefreshCw, Mail } from "lucide-react";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";

interface AdminSalesPitchTabProps {
  token: string;
  onSessionExpired: () => void;
}

interface SalesStats {
  visitors30d: number;
  visitors90d: number;
  pageViews30d: number;
  pageViews90d: number;
  swedishShare: number;
  avgTimeSec: number;
  guideVisits30d: number;
  analysisVisits30d: number;
  partnerSelectorVisits30d: number;
  leadsTotal: number;
  leads90d: number;
  publishedPartners: number;
  profileViews90d: number;
  partnerClicks90d: number;
  topCities: Array<{ city: string; visits: number }>;
}

const DEFAULT_EMAIL_TEMPLATE = `Hej [NAMN],

Jag vill kort dela några siffror från d365.se – Beslutsstöd för dig som ska välja Microsoft Dynamics 365 och rätt partner.

Plattformen är där svenska företag aktivt jämför partners innan de tar kontakt:

• {{VISITORS_90D}} unika besökare senaste 90 dagarna ({{PAGEVIEWS_90D}} sidvisningar)
• {{SWEDISH_SHARE}}% är svenska besökare – ren beslutsfattartrafik
• {{PARTNER_SELECTOR_30D}} besök på "Välj partner" och {{ANALYSIS_30D}} genomförda behovsanalyser senaste 30 dagarna
• {{LEADS_TOTAL}} leads har genererats via plattformen totalt
• {{PROFILE_VIEWS_90D}} profilvisningar och {{PARTNER_CLICKS_90D}} klick mot partners senaste 90 dagarna
• 140+ statiskt prerendrade sidor – varje partnerprofil indexeras direkt av Google

Vill ni synas där köparen jämför? Avgiften är 995 kr/mån för 1 produktområde, 1 595 kr för 2 och 1 995 kr för 3 – och vi tar er online inom en vecka.

Vänliga hälsningar,
Thomas Laine
thomas.laine@dynamicfactory.se`;

const STORAGE_KEY = "admin_sales_pitch_template_v1";

export default function AdminSalesPitchTab({ token, onSessionExpired }: AdminSalesPitchTabProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [template, setTemplate] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_EMAIL_TEMPLATE;
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_EMAIL_TEMPLATE;
  });
  const [recipientName, setRecipientName] = useState("");

  const loadStats = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const now = new Date();
      const d30 = new Date(now.getTime() - 30 * 86400000).toISOString();
      const d90 = new Date(now.getTime() - 90 * 86400000).toISOString();

      const [stats30Res, stats90Res, leadsRes] = await Promise.all([
        invokeAdminEdgeWithRetry<{ stats?: any; error?: string }>("manage-leads", { action: "visitor-stats", token, startDate: d30, excludePartnerTraffic: true }),
        invokeAdminEdgeWithRetry<{ stats?: any; error?: string }>("manage-leads", { action: "visitor-stats", token, startDate: d90, excludePartnerTraffic: true }),
        invokeAdminEdgeWithRetry<{ leads?: Array<{ created_at: string }>; error?: string }>("manage-leads", { action: "list", token }),
      ]);

      if (stats30Res.error?.message?.includes("401") || stats90Res.error?.message?.includes("401") || leadsRes.error?.message?.includes("401")) {
        onSessionExpired();
        return;
      }
      if (stats30Res.error) throw stats30Res.error;
      if (stats90Res.error) throw stats90Res.error;
      if (leadsRes.error) throw leadsRes.error;
      if (stats30Res.data?.error?.includes("gått ut") || stats90Res.data?.error?.includes("gått ut") || leadsRes.data?.error?.includes("gått ut")) {
        onSessionExpired();
        return;
      }

      const s30 = stats30Res.data?.stats || {};
      const s90 = stats90Res.data?.stats || {};
      const leads = leadsRes.data?.leads || [];
      const leads90d = leads.filter((lead) => new Date(lead.created_at).getTime() >= new Date(d90).getTime()).length;
      const topCities = (s90.topCities || [])
        .slice(0, 8)
        .map((c: any) => ({ city: c.city, visits: c.visits }));

      setStats({
        visitors30d: s30.totalVisitors || 0,
        visitors90d: s90.totalVisitors || 0,
        pageViews30d: s30.totalPageViews || 0,
        pageViews90d: s90.totalPageViews || 0,
        swedishShare: s30.totalVisitors > 0 ? Math.round(((s30.swedishVisitors || 0) / s30.totalVisitors) * 100) : 0,
        avgTimeSec: s30.avgTimeOnPage || 0,
        guideVisits30d: s30.komIgangCount || 0,
        analysisVisits30d: s30.analysisCount || 0,
        partnerSelectorVisits30d: s30.valjPartnerCount || 0,
        leadsTotal: leads.length,
        leads90d,
        publishedPartners: s90.publishedPartners || 0,
        profileViews90d: (s90.partnerProfileStats || []).reduce((sum: number, p: any) => sum + (p.visits || 0), 0),
        partnerClicks90d: (s90.partnerClickStats || []).reduce((sum: number, p: any) => sum + (p.clicks || 0), 0),
        topCities,
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Kunde inte läsa statistik", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const fillTemplate = () => {
    if (!stats) return template;
    return template
      .replace(/\[NAMN\]/g, recipientName || "[NAMN]")
      .replace(/\{\{VISITORS_30D\}\}/g, stats.visitors30d.toLocaleString("sv-SE"))
      .replace(/\{\{VISITORS_90D\}\}/g, stats.visitors90d.toLocaleString("sv-SE"))
      .replace(/\{\{PAGEVIEWS_30D\}\}/g, stats.pageViews30d.toLocaleString("sv-SE"))
      .replace(/\{\{PAGEVIEWS_90D\}\}/g, stats.pageViews90d.toLocaleString("sv-SE"))
      .replace(/\{\{SWEDISH_SHARE\}\}/g, String(stats.swedishShare))
      .replace(/\{\{ANALYSIS_30D\}\}/g, String(stats.analysisVisits30d))
      .replace(/\{\{PARTNER_SELECTOR_30D\}\}/g, String(stats.partnerSelectorVisits30d))
      .replace(/\{\{GUIDE_30D\}\}/g, String(stats.guideVisits30d))
      .replace(/\{\{LEADS_TOTAL\}\}/g, String(stats.leadsTotal))
      .replace(/\{\{LEADS_90D\}\}/g, String(stats.leads90d))
      .replace(/\{\{PROFILE_VIEWS_90D\}\}/g, String(stats.profileViews90d))
      .replace(/\{\{PARTNER_CLICKS_90D\}\}/g, String(stats.partnerClicks90d))
      .replace(/\{\{PUBLISHED_PARTNERS\}\}/g, String(stats.publishedPartners));
  };

  const saveTemplate = () => {
    localStorage.setItem(STORAGE_KEY, template);
    toast({ title: "Mall sparad" });
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(fillTemplate());
    toast({ title: "Mail kopierat", description: "Klistra in i ditt e-postprogram" });
  };

  const openInMail = () => {
    const subject = encodeURIComponent("d365.se – relevanta siffror för er som Dynamics 365-partner");
    const body = encodeURIComponent(fillTemplate());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const Stat = ({ icon: Icon, label, value, sublabel, accent }: any) => (
    <Card className="border-l-4" style={{ borderLeftColor: accent || "hsl(var(--cta-orange))" }}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-3xl font-bold text-foreground">{value}</div>
            <div className="text-sm font-medium text-foreground mt-1">{label}</div>
            {sublabel && <div className="text-xs text-muted-foreground mt-0.5">{sublabel}</div>}
          </div>
          <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading || !stats) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" style={{ color: "hsl(var(--cta-orange))" }} />
                <h2 className="text-xl font-bold">Säljunderlag för partnerinförsäljning</h2>
              </div>
              <p className="text-slate-300 text-sm max-w-2xl">
                Live-siffror från plattformen. Använd dessa när du ringer eller mailar prospekts. Mallen nedan plockar siffrorna automatiskt.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={loadStats}>
              <RefreshCw className="h-4 w-4 mr-2" /> Uppdatera siffror
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Trafik & räckvidd</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={Users} value={stats.visitors90d.toLocaleString("sv-SE")} label="Unika besökare" sublabel="senaste 90 dagar" />
          <Stat icon={Eye} value={stats.pageViews90d.toLocaleString("sv-SE")} label="Sidvisningar" sublabel="senaste 90 dagar" />
          <Stat icon={Users} value={stats.visitors30d.toLocaleString("sv-SE")} label="Unika besökare" sublabel="senaste 30 dagar" />
          <Stat icon={Globe} value={`${stats.swedishShare}%`} label="Svensk trafik" sublabel="ren målgrupp" accent="hsl(142 76% 36%)" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Köpintention (senaste 30 dagar)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={Target} value={stats.partnerSelectorVisits30d} label="Välj partner" sublabel="aktiva utvärderare" />
          <Stat icon={Target} value={stats.analysisVisits30d} label="Behovsanalyser" sublabel="& kravspec" />
          <Stat icon={Target} value={stats.guideVisits30d} label="Kom igång-guiden" sublabel="strukturerade köpresor" />
          <Stat icon={Mail} value={stats.leadsTotal} label="Leads totalt" sublabel={`varav ${stats.leads90d} senaste 90d`} accent="hsl(142 76% 36%)" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Partnerexponering (90 dagar)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={Users} value={stats.publishedPartners} label="Publicerade partners" />
          <Stat icon={Eye} value={stats.profileViews90d} label="Partnerprofilvisningar" />
          <Stat icon={MousePointerClick} value={stats.partnerClicks90d} label="Klick till partners" />
          <Stat icon={TrendingUp} value={formatTime(stats.avgTimeSec)} label="Snitt-tid på sida" sublabel="min:sek" accent="hsl(142 76% 36%)" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO & synlighet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">140+ prerendrade sidor</Badge>
            <Badge variant="secondary">Lighthouse 90+</Badge>
            <Badge variant="secondary">Optimerad för LCP</Badge>
            <Badge variant="secondary">Strukturerad data (JSON-LD)</Badge>
            <Badge variant="secondary">Branschspecifika landningssidor</Badge>
          </div>
          {stats.topCities.length > 0 && (
            <div>
              <div className="font-medium text-foreground mb-2">Topp-städer i besökarbasen (90d)</div>
              <div className="flex flex-wrap gap-2">
                {stats.topCities.map((c) => (
                  <Badge key={c.city} variant="outline">{c.city} <span className="ml-1 text-muted-foreground">{c.visits}</span></Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" /> E-postmall med dynamiska siffror
          </CardTitle>
          <CardDescription>
            Använd platshållare som <code className="text-xs">{`{{VISITORS_90D}}`}</code>, <code className="text-xs">{`{{LEADS_TOTAL}}`}</code> osv. samt <code className="text-xs">[NAMN]</code> för mottagarens namn.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <Label htmlFor="recip-name">Mottagarens förnamn</Label>
              <Input id="recip-name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="t.ex. Anna" />
            </div>
          </div>
          <div>
            <Label htmlFor="tpl">Mall (sparas i din webbläsare)</Label>
            <Textarea id="tpl" value={template} onChange={(e) => setTemplate(e.target.value)} rows={14} className="font-mono text-xs" />
          </div>
          <div>
            <Label>Förhandsvisning</Label>
            <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap font-sans max-h-80 overflow-auto">
              {fillTemplate()}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={copyEmail}><Copy className="h-4 w-4 mr-2" /> Kopiera mail</Button>
            <Button variant="secondary" onClick={openInMail}><Mail className="h-4 w-4 mr-2" /> Öppna i e-postprogram</Button>
            <Button variant="outline" onClick={saveTemplate}>Spara mall</Button>
            <Button variant="ghost" onClick={() => setTemplate(DEFAULT_EMAIL_TEMPLATE)}>Återställ mall</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
