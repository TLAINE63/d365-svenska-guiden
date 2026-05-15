import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Globe, Building2, ExternalLink, Download } from "lucide-react";

interface Company {
  organisation_uuid: string;
  company_name: string | null;
  company_domain: string | null;
  company_industry: string | null;
  company_size: string | null;
  company_country: string | null;
  company_logo_url: string | null;
  first_seen: string | null;
  last_seen: string | null;
  partner_slugs: string[];
  urls: string[];
  url_count: number;
  session_count: number;
  visited_partner: boolean;
}

const STORAGE_KEY = "admin-included-visitors";

export default function AdminAllVisitorsTab({ token }: { token: string | null }) {
  const { toast } = useToast();
  const today = new Date();
  const defaultStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const defaultEnd = today.toISOString().slice(0, 10);

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [onlyPartner, setOnlyPartner] = useState(false);
  const [included, setIncluded] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });

  const persistIncluded = (next: Set<string>) => {
    setIncluded(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))); } catch {}
  };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action: "list_all_visitors", token, period_start: start, period_end: end },
    });
    setLoading(false);
    if (error || data?.error) {
      toast({ title: "Kunde inte hämta besökare", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    setCompanies(data.companies || []);
  };

  const sync = async () => {
    setSyncing(true);
    const { data, error } = await supabase.functions.invoke("sync-snitcher-visits", { body: { token, maxPages: 30 } });
    setSyncing(false);
    if (error || data?.error) {
      toast({ title: "Snitcher-synk misslyckades", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Snitcher synkad", description: `${data.upserted} företag uppdaterade (${data.orgsScanned} skannade).` });
    await load();
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return companies.filter(c => {
      if (onlyPartner && !c.visited_partner) return false;
      if (!q) return true;
      return [c.company_name, c.company_domain, c.company_industry, c.company_country]
        .filter(Boolean).some(v => String(v).toLowerCase().includes(q));
    });
  }, [companies, search, onlyPartner]);

  const includedCount = filtered.filter(c => included.has(c.organisation_uuid)).length;

  const toggleAll = () => {
    const next = new Set(included);
    const all = filtered.every(c => next.has(c.organisation_uuid));
    for (const c of filtered) {
      if (all) next.delete(c.organisation_uuid);
      else next.add(c.organisation_uuid);
    }
    persistIncluded(next);
  };

  const toggle = (uuid: string) => {
    const next = new Set(included);
    next.has(uuid) ? next.delete(uuid) : next.add(uuid);
    persistIncluded(next);
  };

  const exportCsv = () => {
    const rows = filtered.filter(c => included.has(c.organisation_uuid));
    if (rows.length === 0) {
      toast({ title: "Inga rader markerade", variant: "destructive" });
      return;
    }
    const header = ["Företag","Domän","Bransch","Storlek","Land","Sessioner","Sidor","Partner-besök","Första","Senaste"];
    const csv = [header.join(";")].concat(rows.map(r => [
      r.company_name ?? "",
      r.company_domain ?? "",
      r.company_industry ?? "",
      r.company_size ?? "",
      r.company_country ?? "",
      r.session_count,
      r.url_count,
      r.partner_slugs.join("|"),
      r.first_seen ?? "",
      r.last_seen ?? "",
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(";"))).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `besokare-${start}-${end}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" /> Alla identifierade besökare (Snitcher)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-medium block mb-1">Från</label>
            <Input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-40" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Till</label>
            <Input type="date" value={end} onChange={e => setEnd(e.target.value)} className="w-40" />
          </div>
          <Button onClick={load} disabled={loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Hämta</span>
          </Button>
          <Button onClick={sync} disabled={syncing} size="sm" variant="outline">
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Synka från Snitcher</span>
          </Button>
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs font-medium block mb-1">Sök</label>
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Företag, domän, bransch…" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={onlyPartner} onCheckedChange={(v) => setOnlyPartner(!!v)} />
            Endast partnerbesök
          </label>
          <Button onClick={exportCsv} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" /> Exportera markerade
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
          <div>
            {filtered.length} företag visas • {includedCount} markerade som statistik
          </div>
          <Button variant="ghost" size="sm" onClick={toggleAll}>
            {filtered.every(c => included.has(c.organisation_uuid)) ? "Avmarkera alla" : "Markera alla synliga"}
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline mr-2" />Laddar…</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
            Inga besökare hittades. Klicka <strong>Synka från Snitcher</strong> för att hämta senaste data.
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase">
                <tr>
                  <th className="p-2 w-10"></th>
                  <th className="p-2 text-left">Företag</th>
                  <th className="p-2 text-left">Bransch</th>
                  <th className="p-2 text-left">Storlek</th>
                  <th className="p-2 text-left">Land</th>
                  <th className="p-2 text-right">Sidor</th>
                  <th className="p-2 text-left">Partner</th>
                  <th className="p-2 text-left">Senaste</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.organisation_uuid} className="border-t hover:bg-muted/30">
                    <td className="p-2">
                      <Checkbox
                        checked={included.has(c.organisation_uuid)}
                        onCheckedChange={() => toggle(c.organisation_uuid)}
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {c.company_logo_url ? (
                          <img src={c.company_logo_url} alt="" className="h-6 w-6 rounded object-contain bg-white" />
                        ) : (
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium">{c.company_name || "—"}</div>
                          {c.company_domain && (
                            <a href={c.company_domain.startsWith("http") ? c.company_domain : `https://${c.company_domain}`}
                               target="_blank" rel="noreferrer"
                               className="text-xs text-muted-foreground hover:underline inline-flex items-center gap-1">
                              {c.company_domain.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-muted-foreground">{c.company_industry || "—"}</td>
                    <td className="p-2 text-muted-foreground">{c.company_size || "—"}</td>
                    <td className="p-2 text-muted-foreground">{c.company_country || "—"}</td>
                    <td className="p-2 text-right">{c.url_count}</td>
                    <td className="p-2">
                      {c.partner_slugs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.partner_slugs.slice(0, 3).map(s => (
                            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                          ))}
                          {c.partner_slugs.length > 3 && <span className="text-xs text-muted-foreground">+{c.partner_slugs.length - 3}</span>}
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="p-2 text-xs text-muted-foreground whitespace-nowrap">
                      {c.last_seen ? new Date(c.last_seen).toLocaleDateString("sv-SE") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Markerade företag sparas lokalt och kan exporteras till CSV. Listan inkluderar alla identifierade besökare från Snitcher, inte bara de som besökt en partnerprofil.
        </p>
      </CardContent>
    </Card>
  );
}
