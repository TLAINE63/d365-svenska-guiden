import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Archive, Copy, Eye, Loader2, RotateCcw, Save, Send, X } from "lucide-react";

interface Result { partner: string; status: string; reason?: string }
interface P { id: string; name: string; has_link: boolean }
interface Content { subject: string; summary: string; body: string; stats_month?: string | null }
interface ArchiveItem { month: string; label: string; content: Content; updated_at: string }

const REVIEWER = "thomas.laine@dynamicfactory.se";
const EMPTY: Content = { subject: "", summary: "", body: "", stats_month: null };
const norm = (c: Content): Content => ({ subject: c.subject, summary: c.summary, body: c.body, stats_month: c.stats_month || null });

type Audience = "verified" | "unverified";

/** Två separata brev: verifierade (egen statistik) och ej verifierade (samlade siffror, partnerprogrammet). */
export default function AdminNewsletterCard({ token }: { token: string | null }) {
  const [audience, setAudience] = useState<Audience>("verified");
  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-md border p-1" role="group" aria-label="Mottagare för månadsbrevet">
        {([["verified", "Verifierade partners"], ["unverified", "Ej verifierade partners"]] as const).map(([k, l]) => (
          <Button key={k} size="sm" variant={audience === k ? "default" : "ghost"} aria-pressed={audience === k} onClick={() => setAudience(k)}>{l}</Button>
        ))}
      </div>
      <NewsletterEditor key={audience} token={token} audience={audience} />
    </div>
  );
}

function NewsletterEditor({ token, audience }: { token: string | null; audience: Audience }) {
  const unv = audience === "unverified";
  const { toast } = useToast();
  const [partners, setPartners] = useState<P[]>([]);
  const [partnerId, setPartnerId] = useState("");
  const [content, setContent] = useState<Content>(EMPTY);
  const [saved, setSaved] = useState<Content>(EMPTY);
  const [defaults, setDefaults] = useState<Content | null>(null);
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [viewArchive, setViewArchive] = useState<string | null>(null);
  const [archiveMonth, setArchiveMonth] = useState("");
  const [html, setHtml] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const timer = useRef<number>();

  const dirty = JSON.stringify(norm(content)) !== JSON.stringify(norm(saved));

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("send-partner-outreach", { body: { token, audience, ...body } });
    if (error || (data as any)?.error) {
      toast({ title: "Något gick fel", description: (data as any)?.error || error?.message, variant: "destructive" });
      return null;
    }
    return data as any;
  };

  const load = async () => {
    const d = await call({ action: "newsletter-list" });
    if (!d) return null;
    setPartners(d.partners ?? []);
    setArchives(d.archives ?? []);
    return d;
  };

  useEffect(() => {
    if (!token) return;
    load().then((d) => {
      if (!d) return;
      if (d.content) { setContent(norm(d.content)); setSaved(norm(d.content)); setArchiveMonth(d.content.stats_month || ""); }
      if (d.default_content) setDefaults(norm(d.default_content));
      const first = (d.partners ?? []).find((p: P) => p.has_link);
      if (first) setPartnerId(first.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Live-förhandsgranskning av utkastet eller ett arkiverat brev (fördröjd medan man skriver).
  useEffect(() => {
    if (!partnerId || (!viewArchive && !content.subject)) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setBusy((b) => b ?? "preview");
      const valid = content.subject.trim().length >= 3 && content.summary.trim() && content.body.trim();
      const d = await call({
        action: "newsletter-preview", partner_id: partnerId,
        ...(viewArchive ? { archive_month: viewArchive } : valid ? { content: norm(content) } : {}),
      });
      setBusy((b) => (b === "preview" ? null : b));
      if (d) setHtml(d.html || "");
    }, 600);
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId, content, viewArchive]);

  const save = async () => {
    setBusy("save");
    const d = await call({ action: "newsletter-save", content: norm(content) });
    setBusy(null);
    if (!d) return;
    setSaved(content);
    toast({ title: "Månadsbrevet är sparat" });
  };

  const archive = async () => {
    if (dirty) { toast({ title: "Spara ändringarna först", description: "Arkivet sparar den sparade versionen.", variant: "destructive" }); return; }
    if (!/^\d{4}-\d{2}$/.test(archiveMonth)) { toast({ title: "Välj vilken månad brevet gäller", variant: "destructive" }); return; }
    const existing = archives.find((a) => a.month === archiveMonth);
    if (existing && !confirm(`Det finns redan ett arkiverat brev för ${existing.label}. Ersätta det?`)) return;
    setBusy("archive");
    const d = await call({ action: "newsletter-archive", month: archiveMonth });
    setBusy(null);
    if (!d) return;
    await load();
    toast({ title: "Brevet är arkiverat", description: "Du hittar det under Arkiverade månadsbrev." });
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
  const viewing = archives.find((a) => a.month === viewArchive);
  const set = (k: keyof Content) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setContent((c) => ({ ...c, [k]: e.target.value }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{unv ? "Månadsbrev till ej verifierade partners" : "Månadsbrev till publicerade partners"}</CardTitle>
        <CardDescription>
          {unv ? "Samlade siffror för hela sajten, inga siffror per partner. Knappen leder till partnerprogrammet. " : ""}Redigera brevet, förhandsgranska per partner och gör testutskick. Testmejl går endast till {REVIEWER}, inget skickas till partnerna.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nl-subject">Ämnesrad</label>
              <Input id="nl-subject" value={content.subject} onChange={set("subject")} maxLength={200} />
            </div>
            {!unv && <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nl-month">Statistikmånad (partnerns egen statistik)</label>
              <Input id="nl-month" type="month" className="w-48" value={content.stats_month || ""} onChange={set("stats_month")} />
              <p className="text-xs text-muted-foreground">Varje partner får sina egna siffror för månaden, jämfört med månaden före.</p>
            </div>}
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nl-summary">Sammanfattning överst (visas i rutan ovanför knappen)</label>
              <Textarea id="nl-summary" value={content.summary} onChange={set("summary")} rows={5} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nl-body">Brevtext</label>
              <Textarea id="nl-body" value={content.body} onChange={set("body")} rows={24} className="font-mono text-xs" />
              <p className="text-xs text-muted-foreground">
                <code>## Rubrik</code> ger en rubrik, <code>- text</code> en punkt, <code>**fet**</code> fetstil, <code>[text](https://...)</code> en länk,
                tom rad nytt stycke, <code>[KNAPP]</code> knappen med partnerns profileringslänk, <code>[STATISTIK]</code> partnerns
                egen statistik för statistikmånaden och <code>{"{partner}"}</code> partnerns namn.
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
            {dirty && <p className="text-xs text-destructive">Osparade ändringar. Förhandsgranskningen visar utkastet, testutskick och arkivering kräver att du sparar.</p>}

            <div className="rounded-md border p-4 space-y-3">
              <div>
                <div className="text-sm font-medium">Arkiverade månadsbrev</div>
                <p className="text-xs text-muted-foreground">Spara en kopia av brevet per månad för att kunna jämföra senare.</p>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground" htmlFor="nl-archive-month">Brevet gäller månad</label>
                  <Input id="nl-archive-month" type="month" className="w-48" value={archiveMonth} onChange={(e) => setArchiveMonth(e.target.value)} />
                </div>
                <Button variant="outline" onClick={archive} disabled={!token || !!busy}>
                  {busy === "archive" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Archive className="h-4 w-4 mr-2" />}
                  Arkivera sparat brev
                </Button>
              </div>
              {archives.length === 0 ? (
                <p className="text-xs text-muted-foreground">Inga arkiverade brev ännu.</p>
              ) : (
                <div className="divide-y rounded-md border text-sm">
                  {archives.map((a) => (
                    <div key={a.month} className="flex flex-wrap items-center gap-2 px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium capitalize">{a.label}</div>
                        <div className="truncate text-xs text-muted-foreground">{a.content.subject}</div>
                        <div className="text-xs text-muted-foreground">Senast sparat {a.updated_at.slice(0, 10)}</div>
                      </div>
                      <Button size="sm" variant={viewArchive === a.month ? "default" : "outline"} onClick={() => setViewArchive(a.month)}>
                        <Eye className="h-4 w-4 mr-1" />Visa
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => confirm(`Läsa in ${a.label} i redigeraren? (Sparas först när du klickar Spara)`) && (setContent(norm(a.content)), setViewArchive(null))}>
                        <Copy className="h-4 w-4 mr-1" />Använd som utkast
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              <Button variant="outline" onClick={() => send(false)} disabled={!token || !selected?.has_link || !!busy || !!viewArchive}>
                {busy === "one" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Testa denna till mig
              </Button>
              <Button onClick={() => send(true)} disabled={!token || !!busy || partners.length === 0 || !!viewArchive}>
                {busy === "all" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Testa alla till mig
              </Button>
            </div>
            {viewing && (
              <div className="flex items-center justify-between gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm">
                <span>Visar arkiverat brev: <strong className="capitalize">{viewing.label}</strong></span>
                <Button size="sm" variant="ghost" onClick={() => setViewArchive(null)}><X className="h-4 w-4 mr-1" />Tillbaka till utkastet</Button>
              </div>
            )}
            {(viewing?.content.subject || content.subject) && (
              <div className="text-sm"><span className="text-muted-foreground">Ämnesrad:</span> {viewing ? viewing.content.subject : content.subject}</div>
            )}
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
