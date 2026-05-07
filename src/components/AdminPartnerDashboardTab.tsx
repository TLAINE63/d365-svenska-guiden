import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Users,
  Eye,
  MousePointerClick,
  ClipboardList,
  Building2,
  Filter,
  BookOpen,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";
import { useAdminPartners } from "@/hooks/useAdminPartners";
import { ALL_DEEP_DIVE_ARTICLES } from "@/data/bcArticles";
import { BLOG_ARTICLES } from "@/data/blogArticles";

interface Props {
  token: string | null;
}

interface DashboardData {
  days: number;
  partner: { id: string | null; name: string | null; slug: string | null };
  traffic: {
    uniqueVisitors: number;
    pageViews: number;
    topTopics: { path: string; views: number }[];
  };
  analyses: { startedSessions: number; completed: number };
  partnerStats: {
    profileViews: number;
    clicks: number;
    globalProfileViews: number;
    globalClicks: number;
  };
  filters: {
    topIndustries: { name: string; count: number }[];
    topProducts: { name: string; count: number }[];
  };
  companySegments: { name: string; visits: number }[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: any;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

export default function AdminPartnerDashboardTab({ token }: Props) {
  const { data: partners } = useAdminPartners(token);
  const [partnerId, setPartnerId] = useState<string>("");
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Featured partners only (the ones we have a dialog with)
  const featuredPartners = useMemo(
    () =>
      (partners || [])
        .filter((p: any) => p.is_featured)
        .sort((a: any, b: any) => a.name.localeCompare(b.name, "sv")),
    [partners],
  );

  // Recently published articles (last 6 by publishedAt for blog, plus newest deep-dives)
  const newArticles = useMemo(() => {
    const blog = BLOG_ARTICLES.map((a) => ({
      title: a.title,
      type: "Artikel" as const,
      date: a.publishedAt,
      url: `/artiklar/${a.slug}`,
    }));
    const deepDives = ALL_DEEP_DIVE_ARTICLES.slice(0, 5).map((a) => ({
      title: a.title,
      type: "Fördjupning" as const,
      date: "",
      url: `/kunskapscenter/${a.productSlug}/${a.slug}`,
    }));
    return [...blog.sort((a, b) => b.date.localeCompare(a.date)), ...deepDives].slice(0, 8);
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const { data: res, error: err } = await invokeAdminEdgeWithRetry<DashboardData>(
        "partner-dashboard",
        { token, partnerId: partnerId || null, days },
      );
      if (cancelled) return;
      if (err) {
        setError(err.message);
      } else {
        setData(res);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token, partnerId, days]);

  const selectedPartner = featuredPartners.find((p: any) => p.id === partnerId);

  return (
    <div className="space-y-6">
      {/* Header / controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5" />
            Partnerdashboard – underlag för partnerdialog
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Mix av partner-specifik (profilvisningar, klick) och global statistik (besökare,
            analyser, filter, segment). Bottar och interna IP-adresser filtreras bort.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[240px]">
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">
                Välj partner
              </label>
              <Select value={partnerId || "__none__"} onValueChange={(v) => setPartnerId(v === "__none__" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ingen vald (visar bara global data)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">– Ingen vald (endast global) –</SelectItem>
                  {featuredPartners.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v) as 7 | 30 | 90)}>
              <TabsList>
                <TabsTrigger value="7">7 dagar</TabsTrigger>
                <TabsTrigger value="30">30 dagar</TabsTrigger>
                <TabsTrigger value="90">90 dagar</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {selectedPartner && (
            <div className="rounded-md bg-primary/5 border border-primary/20 px-3 py-2 text-sm">
              Visar partner-specifika siffror för{" "}
              <span className="font-semibold">{selectedPartner.name}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <p className="text-sm text-muted-foreground">Laddar dashboard…</p>
      )}
      {error && (
        <p className="text-sm text-destructive">Kunde inte hämta data: {error}</p>
      )}

      {data && (
        <>
          {/* Top KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={Users}
              label="Unika besökare (sajt)"
              value={data.traffic.uniqueVisitors.toLocaleString("sv-SE")}
              hint={`${data.days} dagar`}
            />
            <StatCard
              icon={Eye}
              label="Sidvisningar (sajt)"
              value={data.traffic.pageViews.toLocaleString("sv-SE")}
            />
            <StatCard
              icon={ClipboardList}
              label="Behovsanalyser startade"
              value={data.analyses.startedSessions.toLocaleString("sv-SE")}
              hint={`${data.analyses.completed} slutförda (lead skickad)`}
            />
            <StatCard
              icon={Eye}
              label={selectedPartner ? "Profilvisningar (vald partner)" : "Profilvisningar (globalt)"}
              value={
                selectedPartner
                  ? data.partnerStats.profileViews.toLocaleString("sv-SE")
                  : data.partnerStats.globalProfileViews.toLocaleString("sv-SE")
              }
              hint={
                selectedPartner
                  ? `Globalt: ${data.partnerStats.globalProfileViews.toLocaleString("sv-SE")}`
                  : "Välj en partner för partner-specifik siffra"
              }
            />
            <StatCard
              icon={MousePointerClick}
              label={selectedPartner ? "Klick till partnersajt (vald)" : "Klick till partnersajter (globalt)"}
              value={
                selectedPartner
                  ? data.partnerStats.clicks.toLocaleString("sv-SE")
                  : data.partnerStats.globalClicks.toLocaleString("sv-SE")
              }
              hint={
                selectedPartner
                  ? `Globalt: ${data.partnerStats.globalClicks.toLocaleString("sv-SE")}`
                  : undefined
              }
            />
          </div>

          {/* Topics + filters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="w-4 h-4" />
                  Mest besökta ämnen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sida / ämne</TableHead>
                      <TableHead className="text-right">Visningar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.traffic.topTopics.map((t) => (
                      <TableRow key={t.path}>
                        <TableCell className="font-mono text-xs">{t.path}</TableCell>
                        <TableCell className="text-right">{t.views}</TableCell>
                      </TableRow>
                    ))}
                    {data.traffic.topTopics.length === 0 && (
                      <TableRow><TableCell colSpan={2} className="text-muted-foreground text-sm">Inga besök i perioden.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="w-4 h-4" />
                  Mest använda filter (från analyser & leads)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs uppercase text-muted-foreground mb-2">Produktområde</div>
                  <div className="flex flex-wrap gap-2">
                    {data.filters.topProducts.map((p) => (
                      <Badge key={p.name} variant="secondary">
                        {p.name} <span className="ml-1 opacity-70">×{p.count}</span>
                      </Badge>
                    ))}
                    {data.filters.topProducts.length === 0 && (
                      <span className="text-sm text-muted-foreground">Inga val i perioden.</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground mb-2">Bransch</div>
                  <div className="flex flex-wrap gap-2">
                    {data.filters.topIndustries.map((i) => (
                      <Badge key={i.name} variant="secondary">
                        {i.name} <span className="ml-1 opacity-70">×{i.count}</span>
                      </Badge>
                    ))}
                    {data.filters.topIndustries.length === 0 && (
                      <span className="text-sm text-muted-foreground">Inga val i perioden.</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company segments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="w-4 h-4" />
                Identifierade företagssegment (anonymiserat, från geo_org)
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Företag/organisationer som besökt sajten enligt IP-uppslag. ISP:er, hosting-leverantörer
                och kända partners filtreras bort. Visas endast för dialog – inte för publik visning.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.companySegments.map((s) => (
                  <Badge key={s.name} variant="outline">
                    {s.name} <span className="ml-1 opacity-60">×{s.visits}</span>
                  </Badge>
                ))}
                {data.companySegments.length === 0 && (
                  <span className="text-sm text-muted-foreground">Inga identifierade organisationer i perioden.</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* New content + upcoming activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="w-4 h-4" />
                  Nya artiklar & guider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {newArticles.map((a) => (
                    <li key={a.url} className="flex items-start justify-between gap-3 border-b last:border-0 pb-2 last:pb-0">
                      <div className="min-w-0">
                        <a href={a.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                          {a.title}
                        </a>
                        <div className="text-xs text-muted-foreground">{a.type}{a.date ? ` · ${a.date.replace(/-/g, "/")}` : ""}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-4 h-4" />
                  Trafikdrivande aktiviteter kommande månad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manuell sektion – bygger vi i nästa steg. Förslag: nya artiklar i pipeline,
                  partnerwebinar, eDM-utskick eller LinkedIn-kampanjer kopplade till d365.se.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
