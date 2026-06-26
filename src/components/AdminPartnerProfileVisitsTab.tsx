import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, ExternalLink, Users, Eye } from "lucide-react";

interface PartnerRow {
  slug: string;
  name: string;
  session_count: number;
  unique_companies: number;
  last_seen: string | null;
  companies: string[];
}

interface Response {
  period_start: string;
  period_end: string;
  total_partners: number;
  total_sessions: number;
  partners: PartnerRow[];
}

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
};

export default function AdminPartnerProfileVisitsTab({ token }: { token: string | null }) {
  const { toast } = useToast();
  const today = new Date();
  const defaultStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const defaultEnd = today.toISOString().slice(0, 10);

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Response | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const { data: res, error } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action: "partner_profile_visits", token, period_start: start, period_end: end },
    });
    setLoading(false);
    if (error || (res as any)?.error) {
      toast({
        title: "Kunde inte hämta partnerbesök",
        description: (res as any)?.error || error?.message,
        variant: "destructive",
      });
      return;
    }
    setData(res as Response);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const rows = (data?.partners || []).filter(p =>
    !search.trim() || p.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Partnerprofiler · besök från identifierade företag
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Antal Snitcher-sessioner och unika företag som öppnat respektive partners profilsida ({`/partner/<slug>`}).
            Endast publicerade partners visas.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Från</label>
              <Input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-40" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Till</label>
              <Input type="date" value={end} onChange={e => setEnd(e.target.value)} className="w-40" />
            </div>
            <Button onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Uppdatera
            </Button>
            <Input
              placeholder="Sök partner…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64 ml-auto"
            />
          </div>

          {data && (
            <div className="flex flex-wrap gap-4 text-sm">
              <Badge variant="secondary">{data.total_partners} partners med besök</Badge>
              <Badge variant="secondary">{data.total_sessions} sessioner totalt</Badge>
              <span className="text-muted-foreground">
                Period: {fmtDate(data.period_start)} – {fmtDate(data.period_end)}
              </span>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-3 py-2 font-medium">Partner</th>
                  <th className="px-3 py-2 font-medium text-right">Sessioner</th>
                  <th className="px-3 py-2 font-medium text-right">Unika företag</th>
                  <th className="px-3 py-2 font-medium">Senast</th>
                  <th className="px-3 py-2 font-medium">Företag (urval)</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && !loading && (
                  <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Inga besök i perioden.</td></tr>
                )}
                {rows.map(p => (
                  <tr key={p.slug} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{p.session_count}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {p.unique_companies}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{fmtDate(p.last_seen)}</td>
                    <td className="px-3 py-2 text-muted-foreground max-w-md truncate" title={p.companies.join(", ")}>
                      {p.companies.length ? p.companies.join(", ") : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <a
                        href={`/partner/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Profil <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
