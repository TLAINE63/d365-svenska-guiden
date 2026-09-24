import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, RefreshCw, Check } from "lucide-react";

interface Row { id: string; name: string; email: string | null; has_link: boolean; link: string | null; last_sent_at: string | null }

const SUBJECT = "Lägg upp era expertkompetensprofiler på d365.se";

function bodyText(name: string, link: string): string {
  return `Hej ${name},

Vi har lanserat en ny funktion på d365.se.

EXPERTKOMPETENSPROFILER

Besökare som söker kompetens inom Dynamics 365 kan nu hitta partners utifrån den roll de behöver. De kan även filtrera på produkt, bransch, geografiskt täckningsområde och distansarbete.

Ni kan beskriva de funktioner ni erbjuder, till exempel applikationskonsult, utvecklare eller lösningsarkitekt. Profilerna ska beskriva kompetensen, inte namngivna personer.

Alla profiler granskas av d365.se innan de publiceras.

Lägg upp era expertkompetensprofiler här (personlig länk för ${name}):
${link}

Frågor? Svara gärna på detta mejl.

Vänliga hälsningar,
Thomas Laine
d365.se`;
}

export default function AdminExpertOutreachCard({ token }: { token: string | null }) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);

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
  };

  useEffect(() => { if (token) load(); }, [token]);

  const mailto = (r: Row) =>
    `mailto:${r.email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(bodyText(r.name, r.link || ""))}`;

  const markSent = async (r: Row) => {
    setMarking(r.id);
    const d = await call({ action: "expert-mark-sent", partner_ids: [r.id] });
    setMarking(null);
    if (!d) return;
    toast({ title: `${r.name} markerad som skickad` });
    load();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expertkompetensprofiler: inbjudan till partners</CardTitle>
        <CardDescription>
          Mejlen skickas från din egen inkorg (thomas.laine@dynamicfactory.se), inte via sajten. Klicka på "Öppna mejl" så öppnas ett färdigt mejl i din e-post med mottagare, ämne, text och partnerns personliga länk ifyllt. Skicka det därifrån och markera det sedan som skickat här.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Uppdatera
        </Button>
        <div className="divide-y rounded-md border">
          {rows.map((r) => {
            const ok = !!r.email && r.has_link;
            return (
              <div key={r.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                <span className="font-medium w-44 truncate">{r.name}</span>
                <span className="text-muted-foreground flex-1 truncate">{r.email || "Saknar e-post"}</span>
                {!r.has_link && <Badge variant="destructive">Saknar länk</Badge>}
                {r.last_sent_at && <Badge variant="outline">Skickad {r.last_sent_at.slice(0, 10)}</Badge>}
                <Button size="sm" variant="outline" asChild disabled={!ok}>
                  <a href={ok ? mailto(r) : undefined} aria-disabled={!ok}>
                    <Mail className="h-4 w-4 mr-1" /> Öppna mejl
                  </a>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => markSent(r)} disabled={!ok || marking === r.id}>
                  {marking === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                  Markera skickad
                </Button>
              </div>
            );
          })}
          {!rows.length && !loading && <p className="p-3 text-sm text-muted-foreground">Inga verifierade partners hittades.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
