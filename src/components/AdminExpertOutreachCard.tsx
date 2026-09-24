import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, RefreshCw } from "lucide-react";

interface Row { id: string; name: string; email: string | null; has_link: boolean; last_sent_at: string | null }

export default function AdminExpertOutreachCard({ token }: { token: string | null }) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("send-partner-outreach", { body: { token, ...body } });
    if (error || (data as any)?.error) {
      toast({ title: "Fel", description: (data as any)?.error || error?.message, variant: "destructive" });
      return null;
    }
    return data as any;
  };

  const load = async () => {
    setLoading(true);
    const d = await call({ action: "expert-list" });
    setLoading(false);
    if (!d) return;
    setRows(d.partners);
    setSel(new Set(d.partners.filter((r: Row) => r.email && r.has_link && !r.last_sent_at).map((r: Row) => r.id)));
  };

  useEffect(() => { if (token) load(); }, [token]);

  const send = async () => {
    if (!sel.size || !confirm(`Skicka mejlet till ${sel.size} partner(s)?`)) return;
    setSending(true);
    const d = await call({ action: "expert-send", partner_ids: [...sel] });
    setSending(false);
    if (!d) return;
    const r = d.results as Array<{ status: string }>;
    const sent = r.filter((x) => x.status === "sent").length;
    toast({ title: `${sent} mejl skickade`, description: `${r.length - sent} hoppades över eller misslyckades.` });
    load();
  };

  const toggle = (id: string) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expertkompetensprofiler: inbjudan till partners</CardTitle>
        <CardDescription>
          Skickas från "Thomas Laine via d365.se" med svar till thomas.laine@dynamicfactory.se. Varje partner får sin personliga profileringslänk.
          Redan kontaktade partners är inte förvalda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Uppdatera
          </Button>
          <Button size="sm" onClick={send} disabled={sending || !sel.size}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Skicka till {sel.size} valda
          </Button>
        </div>
        <div className="divide-y rounded-md border">
          {rows.map((r) => {
            const ok = !!r.email && r.has_link;
            return (
              <label key={r.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                <Checkbox checked={sel.has(r.id)} disabled={!ok} onCheckedChange={() => toggle(r.id)} />
                <span className="font-medium w-48 truncate">{r.name}</span>
                <span className="text-muted-foreground flex-1 truncate">{r.email || "Saknar e-post"}</span>
                {!r.has_link && <Badge variant="destructive">Saknar länk</Badge>}
                {r.last_sent_at && <Badge variant="outline">Skickad {r.last_sent_at.slice(0, 10)}</Badge>}
              </label>
            );
          })}
          {!rows.length && !loading && <p className="p-3 text-sm text-muted-foreground">Inga verifierade partners hittades.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
