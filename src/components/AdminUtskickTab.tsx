import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";
import { Loader2, RefreshCw, Send, Eye, CheckCircle2, Undo2, Trash2, Users } from "lucide-react";

type ReportKind = "verified" | "basic";

interface Draft {
  id: string;
  partner_slug: string;
  partner_name: string;
  recipient_email: string | null;
  period_start: string;
  period_end: string;
  subject: string;
  status: string;
  sent_at: string | null;
  error_message: string | null;
}

interface Recipient {
  id: string;
  report_kind: ReportKind;
  partner_slug: string;
  partner_id: string | null;
  email: string;
  contact_name: string | null;
  is_active: boolean;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending_review: "secondary",
  approved: "default",
  sent: "outline",
  failed: "destructive",
};

const statusLabel: Record<string, string> = {
  pending_review: "Väntar på granskning",
  approved: "Godkänd",
  sent: "Skickad",
  failed: "Misslyckades",
};

function previousMonthStart(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)).toISOString().slice(0, 10);
}

function periodEndFor(start: string): string {
  return new Date(Date.UTC(Number(start.slice(0, 4)), Number(start.slice(5, 7)), 0)).toISOString().slice(0, 10);
}

export default function AdminUtskickTab({ token }: { token: string | null }) {
  const { toast } = useToast();
  const { data: allPartners = [] } = useAllPartnerNames();

  const [kind, setKind] = useState<ReportKind>("verified");
  const [periodStart, setPeriodStart] = useState(previousMonthStart());
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewHtml, setPreviewHtml] = useState("");
  const [viewing, setViewing] = useState<Draft | null>(null);

  // Formulär för ny mottagare
  const [newSlug, setNewSlug] = useState("");
  const [newEmails, setNewEmails] = useState("");
  const [newName, setNewName] = useState("");
  const [newMode, setNewMode] = useState<"append" | "replace">("append");

  const call = async (action: string, body: Record<string, unknown> = {}) => {
    const { data, error } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action, token, ...body },
    });
    if (error || (data as any)?.error) {
      toast({ title: "Fel", description: (data as any)?.error || error?.message, variant: "destructive" });
      return null;
    }
    return data as any;
  };

  const partnerOptions = useMemo(
    () => allPartners.filter((p) => (kind === "verified" ? p.is_featured : !p.is_featured)),
    [allPartners, kind],
  );

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const [d, r] = await Promise.all([
      call(kind === "verified" ? "list" : "basic_teaser_list", { period_start: periodStart }),
      call("recipients_list", { report_kind: kind }),
    ]);
    setLoading(false);
    setSelected(new Set());
    if (d) setDrafts(d.drafts || []);
    if (r) setRecipients(r.recipients || []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [token, kind, periodStart]);

  const generateNow = async () => {
    setBusy("generate");
    const res = await call("auto_generate", { period_start: periodStart, period_end: periodEndFor(periodStart) });
    setBusy(null);
    if (res) {
      toast({ title: "Utkast genererade", description: `Partnerverifierade: ${res.verified?.created ?? 0}, grundprofiler: ${res.basic?.created ?? 0}` });
      load();
    }
  };

  const applyRecipients = async () => {
    setBusy("apply");
    const res = await call("recipients_apply", { report_kind: kind, period_start: periodStart });
    setBusy(null);
    if (res) { toast({ title: `${res.updated} utkast uppdaterade med mottagarlistan` }); load(); }
  };

  const saveRecipient = async () => {
    if (!newSlug || !newEmails.trim()) {
      toast({ title: "Välj partner och ange minst en adress", variant: "destructive" });
      return;
    }
    const partner = allPartners.find((p) => p.slug === newSlug);
    setBusy("recipient");
    const res = await call("recipients_save", {
      report_kind: kind,
      partner_slug: newSlug,
      partner_id: partner?.id ?? null,
      emails: newEmails,
      contact_name: newName || null,
      mode: newMode,
    });
    setBusy(null);
    if (res) {
      toast({ title: `${res.saved} adress(er) sparade` });
      setNewEmails(""); setNewName("");
      load();
    }
  };

  const toggleRecipient = async (r: Recipient) => {
    setBusy(r.id);
    const res = await call("recipients_toggle", { id: r.id, is_active: !r.is_active });
    setBusy(null);
    if (res) load();
  };

  const deleteRecipient = async (r: Recipient) => {
    setBusy(r.id);
    const res = await call("recipients_delete", { id: r.id });
    setBusy(null);
    if (res) load();
  };

  const openPreview = async (d: Draft) => {
    setViewing(d);
    setPreviewHtml("");
    const res = await call(kind === "verified" ? "preview-html" : "basic_teaser_preview", { id: d.id });
    if (res) setPreviewHtml(res.html || "");
  };

  const setApproval = async (approved: boolean) => {
    const ids = [...selected];
    if (ids.length === 0) return;
    setBusy("approve");
    const res = await call("approve_drafts", { ids, approved });
    setBusy(null);
    if (res) { toast({ title: approved ? `${res.count} utkast godkända` : `${res.count} utkast återkallade` }); load(); }
  };

  const sendApproved = async () => {
    const ids = drafts.filter((d) => selected.has(d.id) && d.status === "approved").map((d) => d.id);
    if (ids.length === 0) {
      toast({ title: "Inga godkända utkast valda", description: "Godkänn utkasten först.", variant: "destructive" });
      return;
    }
    if (!confirm(`Skicka ${ids.length} rapport(er)?`)) return;
    setBusy("send");
    const res = await call(kind === "verified" ? "send" : "basic_teaser_send", { ids, require_approved: true });
    setBusy(null);
    if (res) { toast({ title: "Utskick klart" }); load(); }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const recipientsBySlug = useMemo(() => {
    const map = new Map<string, Recipient[]>();
    for (const r of recipients) {
      const list = map.get(r.partner_slug) || [];
      list.push(r);
      map.set(r.partner_slug, list);
    }
    return map;
  }, [recipients]);

  const pending = drafts.filter((d) => d.status !== "sent").length;
  const approved = drafts.filter((d) => d.status === "approved").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Utskick av rapporter</CardTitle>
          <CardDescription>
            Utkast skapas automatiskt den 1:a varje månad för föregående månad. Du granskar, godkänner och skickar här.
            Mottagarna hämtas från de fasta listorna nedan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label>Rapporttyp</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as ReportKind)}>
              <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">Partnerverifierade profiler</SelectItem>
                <SelectItem value="basic">Grundprofiler (teaser)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Period (månadens första dag)</Label>
            <Input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className="w-48" />
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Uppdatera
          </Button>
          <Button variant="outline" onClick={generateNow} disabled={busy === "generate"}>
            {busy === "generate" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Generera nu (om något saknas)
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="drafts">
        <TabsList>
          <TabsTrigger value="drafts">Granska &amp; skicka ({pending})</TabsTrigger>
          <TabsTrigger value="recipients">Mottagare ({recipients.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="drafts" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setApproval(true)} disabled={busy === "approve" || selected.size === 0}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Godkänn valda
            </Button>
            <Button variant="outline" onClick={() => setApproval(false)} disabled={busy === "approve" || selected.size === 0}>
              <Undo2 className="mr-2 h-4 w-4" /> Återkalla godkännande
            </Button>
            <Button variant="outline" onClick={applyRecipients} disabled={busy === "apply"}>
              <Users className="mr-2 h-4 w-4" /> Tillämpa mottagarlistan
            </Button>
            <Button onClick={sendApproved} disabled={busy === "send" || approved === 0}>
              {busy === "send" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Skicka godkända
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="p-3 w-10"></th>
                      <th className="p-3">Partner</th>
                      <th className="p-3">Mottagare</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Åtgärd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drafts.map((d) => (
                      <tr key={d.id} className="border-t">
                        <td className="p-3">
                          <Checkbox checked={selected.has(d.id)} onCheckedChange={() => toggleSelect(d.id)} disabled={d.status === "sent"} />
                        </td>
                        <td className="p-3 font-medium">{d.partner_name}</td>
                        <td className="p-3 text-muted-foreground">
                          {d.recipient_email || <span className="text-destructive">Saknas</span>}
                        </td>
                        <td className="p-3">
                          <Badge variant={statusVariant[d.status] || "secondary"}>{statusLabel[d.status] || d.status}</Badge>
                          {d.error_message ? <div className="text-xs text-destructive mt-1">{d.error_message}</div> : null}
                        </td>
                        <td className="p-3 text-right">
                          <Button size="sm" variant="ghost" onClick={() => openPreview(d)}>
                            <Eye className="mr-1 h-4 w-4" /> Förhandsgranska
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {drafts.length === 0 && !loading ? (
                      <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Inga utkast för perioden.</td></tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lägg till mottagare</CardTitle>
              <CardDescription>Flera adresser kan anges separerade med komma, semikolon eller radbrytning.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Partner</Label>
                <Select value={newSlug} onValueChange={setNewSlug}>
                  <SelectTrigger><SelectValue placeholder="Välj partner" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {partnerOptions.map((p) => (
                      <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Kontaktnamn (valfritt)</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>E-postadresser</Label>
                <Textarea rows={3} value={newEmails} onChange={(e) => setNewEmails(e.target.value)} placeholder="namn@partner.se, annan@partner.se" />
              </div>
              <div className="space-y-1">
                <Label>Läge</Label>
                <Select value={newMode} onValueChange={(v) => setNewMode(v as "append" | "replace")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="append">Lägg till</SelectItem>
                    <SelectItem value="replace">Ersätt partnerns lista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={saveRecipient} disabled={busy === "recipient"}>
                  {busy === "recipient" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Spara mottagare
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="p-3">Partner</th>
                      <th className="p-3">Adresser</th>
                      <th className="p-3 text-right">Åtgärd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...recipientsBySlug.entries()].map(([slug, list]) => (
                      <tr key={slug} className="border-t align-top">
                        <td className="p-3 font-medium">
                          {allPartners.find((p) => p.slug === slug)?.name || slug}
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            {list.map((r) => (
                              <div key={r.id} className="flex items-center gap-2">
                                <span className={r.is_active ? "" : "line-through text-muted-foreground"}>{r.email}</span>
                                {r.contact_name ? <span className="text-xs text-muted-foreground">({r.contact_name})</span> : null}
                                {!r.is_active ? <Badge variant="outline">Inaktiv</Badge> : null}
                                <Button size="sm" variant="ghost" onClick={() => toggleRecipient(r)} disabled={busy === r.id}>
                                  {r.is_active ? "Inaktivera" : "Aktivera"}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => deleteRecipient(r)} disabled={busy === r.id}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-3" />
                      </tr>
                    ))}
                    {recipients.length === 0 ? (
                      <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">Inga mottagare sparade ännu.</td></tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewing?.partner_name} – förhandsgranskning</DialogTitle>
          </DialogHeader>
          {previewHtml ? (
            <iframe title="Förhandsgranskning" srcDoc={previewHtml} className="w-full h-[70vh] border rounded" />
          ) : (
            <div className="flex justify-center p-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
