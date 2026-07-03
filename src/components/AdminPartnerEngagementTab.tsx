import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, ExternalLink, GitCompareArrows, ListFilter, MousePointerClick } from "lucide-react";

interface CompareRow {
  slug: string;
  name: string;
  is_featured: boolean;
  agreement_signed: boolean;
  exposures: number;
  unique_sessions: number;
  last_seen: string | null;
}

interface ListingRow {
  slug: string;
  name: string;
  is_featured: boolean;
  agreement_signed: boolean;
  total: number;
  by_path: { path: string; count: number }[];
  last_seen: string | null;
}

interface CardRow {
  slug: string;
  name: string;
  is_featured: boolean;
  agreement_signed: boolean;
  card_clicks: number;
  by_source: { source: string; count: number }[];
  last_seen: string | null;
}

interface EngagementResponse {
  period_start: string;
  period_end: string;
  compare: { total_partners: number; total_exposures: number; unique_sessions: number; partners: CompareRow[] };
  listings: { total_partners: number; total_exposures: number; partners: ListingRow[] };
  card_clicks: { total_partners: number; total_clicks: number; partners: CardRow[] };
}

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
};

function StatusBadges({ featured, signed }: { featured: boolean; signed: boolean }) {
  return (
    <span className="inline-flex gap-1 ml-2">
      {signed && <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600">avtal</Badge>}
      {featured && <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">publicerad</Badge>}
    </span>
  );
}

export default function AdminPartnerEngagementTab({ token }: { token: string | null }) {
  const { toast } = useToast();
  const today = new Date();
  const defaultStart = new Date(today.getTime() - 30 * 86400000).toISOString().slice(0, 10);
  const defaultEnd = today.toISOString().slice(0, 10);

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EngagementResponse | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const { data: res, error } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action: "partner_engagement", token, period_start: start, period_end: end },
    });
    setLoading(false);
    if (error || (res as any)?.error) {
      toast({
        title: "Kunde inte hämta engagemang",
        description: (res as any)?.error || error?.message,
        variant: "destructive",
      });
      return;
    }
    setData(res as EngagementResponse);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const filterRows = <T extends { name: string }>(rows: T[]) =>
    rows.filter((r) => !search.trim() || r.name.toLowerCase().includes(search.toLowerCase().trim()));

  const compareRows = data ? filterRows(data.compare.partners) : [];
  const listingRows = data ? filterRows(data.listings.partners) : [];
  const cardRows = data ? filterRows(data.card_clicks.partners) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompareArrows className="h-5 w-5" />
            Partnerengagemang – Jämför, filtreringar & kortklick
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Vilka partners har deltagit i Jämför partners, listats i filtreringar och fått sina partnerkort klickade under vald period.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Från</label>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-40" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Till</label>
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-40" />
            </div>
            <Button onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Uppdatera
            </Button>
            <Input
              placeholder="Sök partner…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 ml-auto"
            />
          </div>

          {data && (
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary">Period: {fmtDate(data.period_start)} – {fmtDate(data.period_end)}</Badge>
              <Badge variant="secondary">Jämför: {data.compare.total_partners} partners · {data.compare.unique_sessions} sessioner</Badge>
              <Badge variant="secondary">Filtreringar: {data.listings.total_partners} partners · {data.listings.total_exposures} visningar</Badge>
              <Badge variant="secondary">Kortklick: {data.card_clicks.total_partners} partners · {data.card_clicks.total_clicks} klick</Badge>
            </div>
          )}

          <Tabs defaultValue="compare" className="mt-2">
            <TabsList>
              <TabsTrigger value="compare" className="gap-1"><GitCompareArrows className="h-3.5 w-3.5" /> Jämför partners</TabsTrigger>
              <TabsTrigger value="listings" className="gap-1"><ListFilter className="h-3.5 w-3.5" /> Filterlistningar</TabsTrigger>
              <TabsTrigger value="cards" className="gap-1"><MousePointerClick className="h-3.5 w-3.5" /> Kortklick</TabsTrigger>
            </TabsList>

            <TabsContent value="compare" className="mt-4">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-medium">Partner</th>
                      <th className="px-3 py-2 font-medium text-right">Visningar</th>
                      <th className="px-3 py-2 font-medium text-right">Unika sessioner</th>
                      <th className="px-3 py-2 font-medium">Senast</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.length === 0 && !loading && (
                      <tr><td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">Inga partners har jämförts i perioden.</td></tr>
                    )}
                    {compareRows.map((p) => (
                      <tr key={p.slug} className="border-t hover:bg-muted/30">
                        <td className="px-3 py-2 font-medium">
                          {p.name}
                          <StatusBadges featured={p.is_featured} signed={p.agreement_signed} />
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{p.exposures}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{p.unique_sessions}</td>
                        <td className="px-3 py-2 text-muted-foreground">{fmtDate(p.last_seen)}</td>
                        <td className="px-3 py-2">
                          <a href={`/partner/${p.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                            Profil <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="listings" className="mt-4">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-medium">Partner</th>
                      <th className="px-3 py-2 font-medium text-right">Totalt</th>
                      <th className="px-3 py-2 font-medium">Per sida</th>
                      <th className="px-3 py-2 font-medium">Senast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listingRows.length === 0 && !loading && (
                      <tr><td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">Inga listningar i perioden.</td></tr>
                    )}
                    {listingRows.map((p) => (
                      <tr key={p.slug} className="border-t hover:bg-muted/30 align-top">
                        <td className="px-3 py-2 font-medium">
                          {p.name}
                          <StatusBadges featured={p.is_featured} signed={p.agreement_signed} />
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{p.total}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">
                          <div className="flex flex-wrap gap-1">
                            {p.by_path.map((bp) => (
                              <span key={bp.path} className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">
                                <code>{bp.path}</code>
                                <span className="tabular-nums">{bp.count}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{fmtDate(p.last_seen)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="cards" className="mt-4">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-medium">Partner</th>
                      <th className="px-3 py-2 font-medium text-right">Kortklick</th>
                      <th className="px-3 py-2 font-medium">Källor</th>
                      <th className="px-3 py-2 font-medium">Senast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cardRows.length === 0 && !loading && (
                      <tr><td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">Inga kortklick i perioden.</td></tr>
                    )}
                    {cardRows.map((p) => (
                      <tr key={p.slug} className="border-t hover:bg-muted/30 align-top">
                        <td className="px-3 py-2 font-medium">
                          {p.name}
                          <StatusBadges featured={p.is_featured} signed={p.agreement_signed} />
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{p.card_clicks}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">
                          <div className="flex flex-wrap gap-1">
                            {p.by_source.slice(0, 8).map((bs) => (
                              <span key={bs.source} className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">
                                <code>{bs.source}</code>
                                <span className="tabular-nums">{bs.count}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{fmtDate(p.last_seen)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
