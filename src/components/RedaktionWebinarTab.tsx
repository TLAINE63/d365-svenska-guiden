import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Users, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CONTENT_INVITE_THEMES } from "@/lib/contentInvite";
import { formatWebinarDate, type PublicWebinar } from "@/lib/webinars";

interface AdminWebinar extends PublicWebinar { registration_count: number; join_url: string | null }
interface Registration { id: string; first_name: string; last_name: string; company: string; title: string; email: string; created_at: string; cancelled_at: string | null; consent_followup: boolean; utm_source: string | null; utm_medium: string | null; utm_campaign: string | null }
interface FormState { id?: string; slug: string; title: string; description: string; body: string; starts_at: string; duration_min: number; theme: string; speakers: string; join_url: string; recording_url: string; status: string }

const blank = (): FormState => ({ slug: "", title: "", description: "", body: "", starts_at: "", duration_min: 45, theme: "partnerval", speakers: "", join_url: "", recording_url: "", status: "utkast" });
const slugify = (value: string) => value.toLowerCase().replace(/å|ä/g, "a").replace(/ö/g, "o").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);

export default function RedaktionWebinarTab({ token, onSessionExpired }: { token: string | null; onSessionExpired: () => void }) {
  const { toast } = useToast();
  const [webinars, setWebinars] = useState<AdminWebinar[]>([]);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [registrationsFor, setRegistrationsFor] = useState<AdminWebinar | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-webinars`;
  const headers = () => ({ Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" });

  const load = useCallback(async () => {
    if (!token) return;
    const response = await fetch(`${base}?action=list`, { headers: headers() });
    if (response.status === 401) return onSessionExpired();
    const data = await response.json();
    if (response.ok) setWebinars(data.webinars || []);
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    const response = await fetch(`${base}?action=save`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({ ...editing, starts_at: new Date(editing.starts_at).toISOString(), duration_min: Number(editing.duration_min) }),
    });
    setLoading(false);
    if (response.status === 401) return onSessionExpired();
    const data = await response.json();
    if (!response.ok) return toast({ title: "Kunde inte spara", description: data.error, variant: "destructive" });
    toast({ title: "Webinaret är sparat" });
    setEditing(null);
    load();
  };

  const openRegistrations = async (webinar: AdminWebinar) => {
    setRegistrationsFor(webinar);
    const response = await fetch(`${base}?action=registrations&webinar_id=${webinar.id}`, { headers: headers() });
    if (response.status === 401) return onSessionExpired();
    const data = await response.json();
    setRegistrations(data.registrations || []);
  };

  const downloadCsv = async () => {
    if (!registrationsFor) return;
    const response = await fetch(`${base}?action=registrations-csv&webinar_id=${registrationsFor.id}`, { headers: headers() });
    if (response.status === 401) return onSessionExpired();
    if (!response.ok) return toast({ title: "CSV kunde inte hämtas", variant: "destructive" });
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = `webinar-${registrationsFor.slug}-anmalningar.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const remove = async (webinar: AdminWebinar) => {
    if (!confirm(`Ta bort ${webinar.title} och alla anmälningar permanent?`)) return;
    const response = await fetch(`${base}?action=delete`, { method: "POST", headers: headers(), body: JSON.stringify({ id: webinar.id }) });
    if (response.status === 401) return onSessionExpired();
    if (response.ok) { toast({ title: "Webinaret är borttaget" }); load(); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div><CardTitle>Webinar</CardTitle><CardDescription>Skapa, ändra och publicera webinar. Deltagarlänken visas aldrig på den publika sidan.</CardDescription></div>
        <Button onClick={() => { setEditing(blank()); setSlugTouched(false); }}><Plus className="h-4 w-4 mr-2" />Nytt webinar</Button>
      </CardHeader>
      <CardContent>
        {webinars.length === 0 ? <p className="text-sm text-muted-foreground">Inga webinar ännu.</p> : (
          <Table><TableHeader><TableRow><TableHead>Webinar</TableHead><TableHead>Tema</TableHead><TableHead>Status</TableHead><TableHead>Anmälda</TableHead><TableHead className="text-right">Åtgärder</TableHead></TableRow></TableHeader>
            <TableBody>{webinars.map((webinar) => (
              <TableRow key={webinar.id}>
                <TableCell><div className="font-medium">{webinar.title}</div><div className="text-xs text-muted-foreground">{formatWebinarDate(webinar)}</div><div className="text-xs text-muted-foreground">/webinar/{webinar.slug}/</div></TableCell>
                <TableCell><Badge variant="outline">{CONTENT_INVITE_THEMES.find((item) => item.value === webinar.theme)?.label}</Badge></TableCell>
                <TableCell><Badge variant={webinar.status === "publicerad" ? "default" : "secondary"}>{webinar.status}</Badge></TableCell>
                <TableCell>{webinar.registration_count}</TableCell>
                <TableCell><div className="flex justify-end gap-1">
                  <Button size="sm" variant="outline" onClick={() => openRegistrations(webinar)} title="Visa anmälningar"><Users className="h-4 w-4" /></Button>
                  {webinar.status !== "utkast" && <Button size="sm" variant="outline" asChild><a href={`/webinar/${webinar.slug}/`} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a></Button>}
                  <Button size="sm" variant="outline" onClick={() => { setEditing({ ...webinar, body: webinar.body || "", speakers: webinar.speakers || "", join_url: webinar.join_url || "", recording_url: webinar.recording_url || "", starts_at: new Date(new Date(webinar.starts_at).getTime() - new Date(webinar.starts_at).getTimezoneOffset() * 60000).toISOString().slice(0, 16) }); setSlugTouched(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline" onClick={() => remove(webinar)}><Trash2 className="h-4 w-4" /></Button>
                </div></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto"><DialogHeader><DialogTitle>{editing?.id ? "Redigera webinar" : "Nytt webinar"}</DialogTitle></DialogHeader>
          {editing && <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><Label>Titel *</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: slugTouched ? editing.slug : slugify(e.target.value) })} /></div>
            <div><Label>Adress *</Label><Input value={editing.slug} onChange={(e) => { setSlugTouched(true); setEditing({ ...editing, slug: e.target.value.toLowerCase() }); }} /></div>
            <div><Label>Status</Label><Select value={editing.status} onValueChange={(status) => setEditing({ ...editing, status })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["utkast", "publicerad", "genomford", "installd"].map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select></div>
            <div className="md:col-span-2"><Label>Kort beskrivning, högst 400 tecken *</Label><Textarea rows={3} maxLength={400} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /><p className="text-xs text-muted-foreground mt-1">{editing.description.length}/400</p></div>
            <div className="md:col-span-2"><Label>Längre text</Label><Textarea rows={6} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></div>
            <div><Label>Startdatum och tid *</Label><Input type="datetime-local" value={editing.starts_at} onChange={(e) => setEditing({ ...editing, starts_at: e.target.value })} required /></div>
            <div><Label>Längd i minuter</Label><Input type="number" min={5} max={480} value={editing.duration_min} onChange={(e) => setEditing({ ...editing, duration_min: Number(e.target.value) })} /></div>
            <div><Label>Tema</Label><Select value={editing.theme} onValueChange={(theme) => setEditing({ ...editing, theme })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CONTENT_INVITE_THEMES.map((theme) => <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Talare</Label><Input value={editing.speakers} onChange={(e) => setEditing({ ...editing, speakers: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Deltagarlänk, visas bara i mejl *</Label><Input type="url" value={editing.join_url} onChange={(e) => setEditing({ ...editing, join_url: e.target.value })} placeholder="https://..." /></div>
            <div className="md:col-span-2"><Label>Inspelningslänk, fyll i efteråt</Label><Input type="url" value={editing.recording_url} onChange={(e) => setEditing({ ...editing, recording_url: e.target.value })} placeholder="https://..." /><p className="text-xs text-muted-foreground mt-1">När länken finns skickar den schemalagda mejlhanteringen inspelningen till anmälda som inte avanmält sig.</p></div>
          </div>}
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Avbryt</Button><Button onClick={save} disabled={loading || !editing?.title || !editing.slug || !editing.description || !editing.starts_at}>{loading ? "Sparar…" : "Spara"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!registrationsFor} onOpenChange={(open) => !open && setRegistrationsFor(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Anmälningar: {registrationsFor?.title}</DialogTitle></DialogHeader>
          <div className="flex justify-end"><Button variant="outline" onClick={downloadCsv}><Download className="h-4 w-4 mr-2" />Hämta CSV</Button></div>
          {registrations.length === 0 ? <p className="text-sm text-muted-foreground">Inga anmälningar ännu.</p> : <Table><TableHeader><TableRow><TableHead>Namn</TableHead><TableHead>Företag och roll</TableHead><TableHead>E-post</TableHead><TableHead>Uppföljning</TableHead><TableHead>UTM</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{registrations.map((row) => <TableRow key={row.id}><TableCell>{row.first_name} {row.last_name}<div className="text-xs text-muted-foreground">{row.created_at.slice(0, 10)}</div></TableCell><TableCell>{row.company}<div className="text-xs text-muted-foreground">{row.title}</div></TableCell><TableCell>{row.email}</TableCell><TableCell>{row.consent_followup ? "Ja" : "Nej"}</TableCell><TableCell className="text-xs">{[row.utm_source, row.utm_medium, row.utm_campaign].filter(Boolean).join(" / ") || "–"}</TableCell><TableCell>{row.cancelled_at ? `Avanmäld ${row.cancelled_at.slice(0, 10)}` : "Anmäld"}</TableCell></TableRow>)}</TableBody></Table>}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
