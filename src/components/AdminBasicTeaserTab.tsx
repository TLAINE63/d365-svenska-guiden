import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Send, Eye, Sparkles, Save } from "lucide-react";

interface TeaserDraft {
  id: string;
  partner_slug: string;
  partner_name: string;
  recipient_email: string | null;
  period_start: string;
  period_end: string;
  subject: string;
  intro_text: string | null;
  status: string;
  sent_at: string | null;
  error_message: string | null;
  stats: any;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending_review: "secondary",
  approved: "default",
  sent: "outline",
  failed: "destructive",
};

function previousMonthStart(): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return d.toISOString().slice(0, 10);
}

export default function AdminBasicTeaserTab({ token }: { token: string | null }) {
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<TeaserDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [periodStart, setPeriodStart] = useState(previousMonthStart());
  const [previewHtml, setPreviewHtml] = useState("");
  const [viewing, setViewing] = useState<TeaserDraft | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [testEmail, setTestEmail] = useState(() => localStorage.getItem("basic_teaser_test_email") || "");
  const [intro, setIntro] = useState("");
  const [benefits, setBenefits] = useState("");
  const [emailEdits, setEmailEdits] = useState<Record<string, string>>({});

  const call = async (action: string, body: any = {}) => {
    const { data, error } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action, token, ...body },
    });
    if (error || data?.error) {
      toast({ title: "Fel", description: data?.error || error?.message, variant: "destructive" });
      return null;
    }
    return data;
  };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const data = await call("basic_teaser_list", { period_start: periodStart });
    setLoading(false);
    if (data) setDrafts(data.drafts || []);
  };

  const loadSettings = async () => {
    const data = await call("get_basic_teaser_settings");
    if (data?.settings) {
      setIntro(data.settings.intro || "");
      setBenefits(data.settings.benefits || "");
    }
  };

  useEffect(() => { load(); loadSettings(); /* eslint-disable-next-line */ }, [token]);
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [periodStart]);

  const generate = async () => {
    setBusy("generate");
    const end = new Date(Date.UTC(
      Number(periodStart.slice(0, 4)),
      Number(periodStart.slice(5, 7)),
      0,
    )).toISOString().slice(0, 10);
    const data = await call("basic_teaser_generate", { period_start: periodStart, period_end: end });
    setBusy(null);
    if (data) {
      toast({ title: `${data.count} utkast genererade` });
      load();
    }
  };

  const saveSetting = async (key: string, value: string) => {
    setBusy(key);
    const data = await call("save_basic_teaser_setting", { key, value });
    setBusy(null);
    if (data) toast({ title: "Sparat" });
  };

  const saveEmail = async (d: TeaserDraft) => {
    const value = emailEdits[d.id] ?? d.recipient_email ?? "";
    setBusy(d.id);
    const res = await call("basic_teaser_update", { id: d.id, recipient_email: value || null });
    setBusy(null);
    if (res) { toast({ title: "Mottagare sparad" }); load(); }
  };

  const openPreview = async (d: TeaserDraft) => {
    setViewing(d);
    setPreviewHtml("");
    const data = await call("basic_teaser_preview", { id: d.id });
    if (data?.html) setPreviewHtml(data.html);
  };

  const sendTest = async (d: TeaserDraft) => {
    if (!testEmail) { toast({ title: "Ange en testadress först", variant: "destructive" }); return; }
    localStorage.setItem("basic_teaser_test_email", testEmail);
    setBusy(`test-${d.id}`);
    const data = await call("basic_teaser_send_test", { id: d.id, test_email: testEmail });
    setBusy(null);
    if (data) toast({ title: `Testmejl skickat till ${testEmail}` });
  };

  const sendSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Skicka teaser-mejl till ${selected.size} Basic-partners?`)) return;
    setBusy("send");
    const data = await call("basic_teaser_send", { ids: Array.from(selected) });
    setBusy(null);
    if (data) {
      const ok = (data.results || []).filter((r: any) => r.ok).length;
      toast({ title: `${ok} av ${data.results.length} mejl skickade` });
      setSelected(new Set());
      load();
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const parseEmails = (v: string | null | undefined) =>
    String(v || "").split(/[,;\s]+/).map((e) => e.trim()).filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));

  const recipientsOf = (d: TeaserDraft) => parseEmails(emailEdits[d.id] ?? d.recipient_email);
  const sendable = drafts.filter((d) => d.status !== "sent" && recipientsOf(d).length > 0);
  const totalEmails = drafts
    .filter((d) => selected.has(d.id))
    .reduce((sum, d) => sum + recipientsOf(d).length, 0);

  const importList = async () => {
    const rows = importText.split("\n").map((line) => {
      const parts = line.split(/[\t;,]/);
      const emails = parts.filter((p) => p.includes("@")).join(",");
      const match = parts.find((p) => !p.includes("@"))?.trim() || "";
      return { match, emails };
    }).filter((r) => r.match && r.emails);
    if (rows.length === 0) { toast({ title: "Hittade inga rader", variant: "destructive" }); return; }
    setBusy("import");
    const data = await call("basic_teaser_import_recipients", { period_start: periodStart, rows, mode: importMode });
    setBusy(null);
    if (data) {
      toast({
        title: `${data.updated} partners uppdaterade`,
        description: data.unmatched?.length ? `Matchade inte: ${data.unmatched.slice(0, 8).join(", ")}` : undefined,
      });
      setEmailEdits({});
      load();
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> Basic-teaser
          </CardTitle>
          <CardDescription>
            Månadsöversikt till partners med grundprofil (Basic). Visar deras egna siffror, marknadssiffror
            för d365.se och vad en verifierad profil ger – med länk till /partnerprogram. Skickas alltid manuellt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label htmlFor="teaser-period" className="text-xs">Period (månadens första dag)</Label>
              <Input id="teaser-period" type="date" value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)} className="w-44" />
            </div>
            <Button onClick={generate} disabled={busy === "generate"}>
              {busy === "generate" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Generera utkast
            </Button>
            <Button variant="outline" onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Uppdatera lista
            </Button>
            <div className="ml-auto flex items-end gap-2">
              <div>
                <Label htmlFor="teaser-test" className="text-xs">Testadress</Label>
                <Input id="teaser-test" value={testEmail} onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="din@epost.se" className="w-56" />
              </div>
              <Button onClick={sendSelected} disabled={selected.size === 0 || busy === "send"}>
                {busy === "send" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Godkänn &amp; skicka ({selected.size})
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {drafts.length} utkast · {sendable.length} har mottagaradress
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="p-2 w-8"></th>
                  <th className="p-2">Partner</th>
                  <th className="p-2">Mottagare</th>
                  <th className="p-2 text-right">Visningar</th>
                  <th className="p-2 text-right">Filtermatchningar</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 text-right">Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="p-2">
                      <Checkbox checked={selected.has(d.id)} onCheckedChange={() => toggle(d.id)}
                        disabled={d.status === "sent"} />
                    </td>
                    <td className="p-2 font-medium">{d.partner_name}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Input
                          value={emailEdits[d.id] ?? d.recipient_email ?? ""}
                          onChange={(e) => setEmailEdits({ ...emailEdits, [d.id]: e.target.value })}
                          placeholder="saknas – fyll i"
                          className="h-8 w-56"
                        />
                        <Button size="sm" variant="ghost" onClick={() => saveEmail(d)} disabled={busy === d.id}>
                          <Save className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-2 text-right tabular-nums">{d.stats?.own?.cardViews ?? 0}</td>
                    <td className="p-2 text-right tabular-nums">{d.stats?.own?.filterMatches ?? 0}</td>
                    <td className="p-2">
                      <Badge variant={statusVariant[d.status] || "secondary"}>{d.status}</Badge>
                      {d.error_message && (
                        <div className="text-xs text-destructive mt-1">{d.error_message}</div>
                      )}
                    </td>
                    <td className="p-2 text-right whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => openPreview(d)}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> Förhandsgranska
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => sendTest(d)} disabled={busy === `test-${d.id}`}>
                        {busy === `test-${d.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Testmejl"}
                      </Button>
                    </td>
                  </tr>
                ))}
                {drafts.length === 0 && !loading && (
                  <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">
                    Inga utkast för perioden. Klicka på "Generera utkast".
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Innehåll i teasern</CardTitle>
          <CardDescription>Används för nya utkast. Skriv <code>{"{partner}"}</code> för partnerns namn.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="teaser-intro">Ingress</Label>
            <Textarea id="teaser-intro" rows={3} value={intro} onChange={(e) => setIntro(e.target.value)} />
            <Button size="sm" className="mt-2" onClick={() => saveSetting("basic_teaser_intro", intro)}
              disabled={busy === "basic_teaser_intro"}>Spara ingress</Button>
          </div>
          <div>
            <Label htmlFor="teaser-benefits">Detta missar ni i dag (en punkt per rad)</Label>
            <Textarea id="teaser-benefits" rows={6} value={benefits} onChange={(e) => setBenefits(e.target.value)} />
            <Button size="sm" className="mt-2" onClick={() => saveSetting("basic_teaser_benefits", benefits)}
              disabled={busy === "basic_teaser_benefits"}>Spara punkter</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Förhandsgranskning – {viewing?.partner_name}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-2">
            <Button size="sm" variant={previewDevice === "desktop" ? "default" : "outline"}
              onClick={() => setPreviewDevice("desktop")}>Desktop</Button>
            <Button size="sm" variant={previewDevice === "mobile" ? "default" : "outline"}
              onClick={() => setPreviewDevice("mobile")}>Mobil</Button>
          </div>
          {previewHtml ? (
            <iframe
              title="Förhandsgranskning"
              srcDoc={previewHtml}
              className="w-full border rounded bg-white mx-auto"
              style={{ height: 620, maxWidth: previewDevice === "mobile" ? 390 : "100%" }}
            />
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
