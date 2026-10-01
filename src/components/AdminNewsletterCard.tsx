import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, Loader2, Send } from "lucide-react";

interface Result { partner: string; status: string; reason?: string }
interface P { id: string; name: string; has_link: boolean }

const REVIEWER = "thomas.laine@dynamicfactory.se";

export default function AdminNewsletterCard({ token }: { token: string | null }) {
  const { toast } = useToast();
  const [partners, setPartners] = useState<P[]>([]);
  const [subject, setSubject] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [html, setHtml] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("send-partner-outreach", { body: { token, ...body } });
    if (error || (data as any)?.error) {
      toast({ title: "Något gick fel", description: (data as any)?.error || error?.message, variant: "destructive" });
      return null;
    }
    return data as any;
  };

  useEffect(() => {
    if (!token) return;
    call({ action: "newsletter-list" }).then((d) => {
      if (!d) return;
      setPartners(d.partners ?? []);
      setSubject(d.subject ?? "");
      const first = (d.partners ?? []).find((p: P) => p.has_link);
      if (first) setPartnerId(first.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!partnerId) return;
    setHtml("");
    setBusy("preview");
    call({ action: "newsletter-preview", partner_id: partnerId }).then((d) => {
      setBusy(null);
      if (d) setHtml(d.html || "");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId]);

  const send = async (all: boolean) => {
    if (all && !confirm(`Skicka ${partners.filter((p) => p.has_link).length} testmejl till ${REVIEWER}?`)) return;
    setBusy(all ? "all" : "one");
    setResults(null);
    const d = await call({ action: "newsletter-send", ...(all ? {} : { partner_ids: [partnerId] }) });
    setBusy(null);
    if (!d) return;
    setResults(d.results ?? []);
    toast({ title: `Klart: ${d.sent} testmejl skickade till ${REVIEWER}` });
  };

  const selected = partners.find((p) => p.id === partnerId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Månadsbrev till publicerade partners</CardTitle>
        <CardDescription>
          Ersätter de tidigare partnerrapporterna. Varje partner får samma innehåll med sin egen profileringslänk.
          Förhandsgranska per partner och gör testutskick: testmejl går endast till {REVIEWER}, inget skickas till partnerna.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <div className="text-sm font-medium">Förhandsgranska som</div>
            <Select value={partnerId} onValueChange={setPartnerId}>
              <SelectTrigger className="w-72"><SelectValue placeholder="Välj partner" /></SelectTrigger>
              <SelectContent className="max-h-72">
                {partners.map((p) => (
                  <SelectItem key={p.id} value={p.id} disabled={!p.has_link}>
                    {p.name}{p.has_link ? "" : " (saknar länk)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => send(false)} disabled={!token || !selected?.has_link || !!busy}>
            {busy === "one" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Testa denna till mig
          </Button>
          <Button onClick={() => send(true)} disabled={!token || !!busy || partners.length === 0}>
            {busy === "all" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Testa alla till mig
          </Button>
        </div>

        {subject && <div className="text-sm"><span className="text-muted-foreground">Ämnesrad:</span> {subject}</div>}

        <div className="rounded-md border">
          {html ? (
            <iframe title="Förhandsgranskning av månadsbrevet" srcDoc={html} className="w-full h-[70vh] rounded-md" />
          ) : (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
              {busy === "preview" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Eye className="h-5 w-5" />}
              {busy === "preview" ? "Laddar förhandsgranskning" : "Välj en partner för att förhandsgranska"}
            </div>
          )}
        </div>

        {results && (
          <div className="divide-y rounded-md border text-sm">
            {results.map((r) => (
              <div key={r.partner} className="flex items-center gap-3 px-3 py-2">
                <span className="font-medium w-44 truncate">{r.partner}</span>
                <span className={r.status === "sent" ? "text-muted-foreground" : "text-destructive"}>
                  {r.status === "sent" ? "Skickad" : r.status === "failed" ? "Misslyckades" : `Hoppades över: ${r.reason}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
