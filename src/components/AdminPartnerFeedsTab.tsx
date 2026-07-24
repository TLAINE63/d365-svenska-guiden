import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, Plus, Rss, Trash2 } from "lucide-react";

type PartnerLite = { id: string; name: string; slug: string };
type Feed = {
  id: string;
  partner_id: string;
  feed_url: string;
  feed_type: string;
  source_type: string;
  default_news_type: string;
  default_product_areas: string[];
  is_active: boolean;
  last_fetched_at: string | null;
  last_success_at: string | null;
  last_error: string | null;
  items_imported: number;
  partners?: { id: string; name: string; slug: string } | null;
};

const PRODUCT_AREAS = [
  "business-central","finance-scm","crm-sales","crm-service","crm","power-platform","microsoft-ai","ovrigt",
] as const;

const SOURCE_TYPES = ["linkedin","webinar","blog","press","partner_web","event","other"];
const NEWS_TYPES = ["partnernyhet","webinar","event","artikel","kundcase","erbjudande","rapport","branschlosning","produktnyhet","analys"];

interface Props { token: string; partners: PartnerLite[]; onSessionExpired: () => void; }

export default function AdminPartnerFeedsTab({ token, partners, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [form, setForm] = useState({
    partner_id: "",
    feed_url: "",
    source_type: "linkedin",
    default_news_type: "partnernyhet",
    default_product_area: "ovrigt",
    is_active: true,
  });

  async function call(action: string, extra: Record<string, unknown> = {}) {
    const { data, error } = await supabase.functions.invoke("manage-partner-feeds", {
      body: { action, token, ...extra },
    });
    if (error) throw error;
    if (data?.error) {
      if (String(data.error).toLowerCase().includes("session")) onSessionExpired();
      throw new Error(data.error);
    }
    return data;
  }

  async function load() {
    setLoading(true);
    try {
      const r = await call("list");
      setFeeds(r.items ?? []);
    } catch (e) {
      toast({ title: "Kunde inte läsa feeds", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function createFeed() {
    if (!form.partner_id || !form.feed_url) {
      toast({ title: "Fyll i partner och URL", variant: "destructive" });
      return;
    }
    try {
      await call("create", {
        feed: {
          partner_id: form.partner_id,
          feed_url: form.feed_url,
          feed_type: "rss",
          source_type: form.source_type,
          default_news_type: form.default_news_type,
          default_product_areas: [form.default_product_area],
          is_active: form.is_active,
        },
      });
      toast({ title: "Feed tillagd" });
      setForm({ ...form, feed_url: "" });
      load();
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    }
  }

  async function toggleActive(f: Feed) {
    try {
      await call("update", { feed: { ...f, is_active: !f.is_active } });
      load();
    } catch (e) { toast({ title: "Fel", description: (e as Error).message, variant: "destructive" }); }
  }

  async function deleteFeed(id: string) {
    if (!confirm("Ta bort feed?")) return;
    try { await call("delete", { id }); load(); }
    catch (e) { toast({ title: "Fel", description: (e as Error).message, variant: "destructive" }); }
  }

  async function runNow(id?: string) {
    setRunningId(id ?? "all");
    try {
      const r = await call("run-now", id ? { id } : {});
      const imported = r?.result?.imported ?? 0;
      toast({ title: "Inläsning klar", description: `${imported} nya utkast importerade.` });
      load();
    } catch (e) {
      toast({ title: "Fel vid inläsning", description: (e as Error).message, variant: "destructive" });
    } finally { setRunningId(null); }
  }

  const sortedPartners = [...partners].sort((a, b) => a.name.localeCompare(b.name, "sv"));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Rss className="h-5 w-5 text-orange-600" /> Automatisk inläsning av partnernytt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Lägg in en RSS-/Atom-feed per partner för LinkedIn-inlägg, webinarier eller bloggar.
            Nya poster hämtas nattligen och läggs som <strong>utkast</strong> under Partnernytt för granskning innan publicering.
            LinkedIn kräver att företagsfeeden görs tillgänglig via en tredjepart (t.ex. <code>rss.app</code>) eftersom LinkedIn saknar publik RSS.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <Label>Partner</Label>
              <Select value={form.partner_id} onValueChange={(v) => setForm({ ...form, partner_id: v })}>
                <SelectTrigger><SelectValue placeholder="Välj partner" /></SelectTrigger>
                <SelectContent>{sortedPartners.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Feed-URL (RSS/Atom)</Label>
              <Input value={form.feed_url} onChange={(e) => setForm({ ...form, feed_url: e.target.value })} placeholder="https://rss.app/feeds/xxxx.xml" />
            </div>
            <div>
              <Label>Källa</Label>
              <Select value={form.source_type} onValueChange={(v) => setForm({ ...form, source_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SOURCE_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Standard nyhetstyp</Label>
              <Select value={form.default_news_type} onValueChange={(v) => setForm({ ...form, default_news_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{NEWS_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Standard produktområde</Label>
              <Select value={form.default_product_area} onValueChange={(v) => setForm({ ...form, default_product_area: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PRODUCT_AREAS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={createFeed} className="flex-1"><Plus className="h-4 w-4 mr-1" /> Lägg till feed</Button>
              <Button variant="outline" onClick={() => runNow()} disabled={runningId !== null}>
                {runningId === "all" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                <span className="ml-1">Kör alla</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Aktiva feeds ({feeds.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Läser…</div> : (
            <div className="space-y-2">
              {feeds.length === 0 && <p className="text-sm text-muted-foreground">Inga feeds konfigurerade ännu.</p>}
              {feeds.map((f) => (
                <div key={f.id} className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{f.partners?.name ?? "Okänd partner"}</span>
                      <Badge variant="outline">{f.source_type}</Badge>
                      <Badge variant="outline">{f.default_news_type}</Badge>
                      <Badge variant="outline">{f.default_product_areas.join(", ")}</Badge>
                      {!f.is_active && <Badge variant="secondary">Inaktiv</Badge>}
                    </div>
                    <a href={f.feed_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground break-all hover:underline">{f.feed_url}</a>
                    <div className="text-xs text-muted-foreground mt-1">
                      Senast hämtat: {f.last_fetched_at ? new Date(f.last_fetched_at).toLocaleString("sv-SE") : "aldrig"} · Importerat totalt: {f.items_imported}
                      {f.last_error && <span className="text-destructive"> · Fel: {f.last_error}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2"><Switch checked={f.is_active} onCheckedChange={() => toggleActive(f)} /><span className="text-xs">Aktiv</span></div>
                    <Button size="sm" variant="outline" onClick={() => runNow(f.id)} disabled={runningId !== null} aria-label="Kör feed nu">
                      {runningId === f.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteFeed(f.id)} aria-label="Ta bort feed"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
