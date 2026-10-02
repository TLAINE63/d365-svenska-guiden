import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, Loader2, RotateCcw, Save, Send } from "lucide-react";

interface Result { partner: string; status: string; reason?: string }
interface P { id: string; name: string; has_link: boolean }
interface Content { subject: string; summary: string; body: string }

const REVIEWER = "thomas.laine@dynamicfactory.se";
const EMPTY: Content = { subject: "", summary: "", body: "" };

export default function AdminNewsletterCard({ token }: { token: string | null }) {
  const { toast } = useToast();
  const [partners, setPartners] = useState<P[]>([]);
  const [partnerId, setPartnerId] = useState("");
  const [content, setContent] = useState<Content>(EMPTY);
  const [saved, setSaved] = useState<Content>(EMPTY);
  const [defaults, setDefaults] = useState<Content | null>(null);
  const [html, setHtml] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const timer = useRef<number>();

  const dirty = JSON.stringify(content) !== JSON.stringify(saved);

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
      if (d.content) { setContent(d.content); setSaved(d.content); }
      if (d.default_content) setDefaults(d.default_content);
      const first = (d.partners ?? []).find((p: P) => p.has_link);
      if (first) setPartnerId(first.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Live-förhandsgranskning av utkastet (fördröjd medan man skriver).
  useEffect(() => {
    if (!partnerId || !content.subject) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setBusy((b) => b ?? "preview");
      const valid = content.subject.trim().length >= 3 && content.summary.trim() && content.body.trim();
      const d = await call({ action: "newsletter-preview", partner_id: partnerId, ...(valid ? { content } : {}) });
      setBusy((b) => (b === "preview" ? null : b));
      if (d) setHtml(d.html || "");
    }, 600);
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId, content]);

  const save = async () => {
    setBusy("save");
    const d = await call({ action: "newsletter-save", content });
    setBusy(null);
    if (!d) return;
    setSaved(content);
    toast({ title: "Månadsbrevet är sparat" });
  };

  const send = async (all: boolean) => {
    if (dirty) { toast({ title: "Spara ändringarna först", description: "Testutskicket använder den sparade versionen.", variant: "destructive" }); return; }
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
  const set = (k: keyof Content) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setContent((c) => ({ ...c, [k]: e.target.value }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Månadsbrev till publicerade partners</CardTitle>
        <CardDescription>
          Redigera brevet, förhandsgranska per partner och gör testutskick. Testmejl går endast till {REVIEWER}, inget skickas till partnerna.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nl-subject">Ämnesrad</label>
              <Input id="nl-subject" value={content.subject} onChange={set("subject")} maxLength={200} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nl-summary">Sammanfattning överst (visas i rutan ovanför knappen)</label>
              <Textarea id="nl-summary" value={content.summary} onChange={set("summary")} rows={5} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nl-body">Brevtext</label>
              <Textarea id="nl-body" value={content.body} onChange={set("body")} rows={24} className="font-mono text-xs" />
              <p className="text-xs text-muted-foreground">
                <code>## Rubrik</code> ger en rubrik, <code>- text</code> en punkt, <code>**fet**</code> fetstil,
                tom rad nytt stycke, <code>[KNAPP]</code> knappen med partnerns profileringslänk och <code>{"{partner}"}</code> partnerns namn.
                "Hej partnernamn," och den personliga länken läggs till automatiskt.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={save} disabled={!token || !dirty || !!busy}>
                {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Spara
              </Button>
              <Button variant="outline" onClick={() => setContent(saved)} disabled={!dirty || !!busy}>Ångra ändringar</Button>
              {defaults && (
                <Button variant="ghost" onClick={() => confirm("Återställ till originaltexten? (Sparas först när du klickar Spara)") && setContent(defaults)} disabled={!!busy}>
                  <RotateCcw className="h-4 w-4 mr-2" />Originaltext
                </Button>
              )}
            </div>
            {dirty && <p className="text-xs text-destructive">Osparade ändringar. Förhandsgranskningen visar utkastet, testutskick kräver att du sparar.</p>}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">Förhandsgranska som</div>
                <Select value={partnerId} onValueChange={setPartnerId}>
                  <SelectTrigger className="w-64"><SelectValue placeholder="Välj partner" /></SelectTrigger>
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
            {content.subject && <div className="text-sm"><span className="text-muted-foreground">Ämnesrad:</span> {content.subject}</div>}
            <div className="rounded-md border">
              {html ? (
                <iframe title="Förhandsgranskning av månadsbrevet" srcDoc={html} className="w-full h-[80vh] rounded-md" />
              ) : (
                <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
                  {busy === "preview" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Eye className="h-5 w-5" />}
                  {busy === "preview" ? "Laddar förhandsgranskning" : "Välj en partner för att förhandsgranska"}
                </div>
              )}
            </div>
          </div>
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
