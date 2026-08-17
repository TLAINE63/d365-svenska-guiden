import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Copy, Mail, Send, Trash2, Check, X } from "lucide-react";
import { BC_ISV_SOLUTIONS } from "@/data/bcIsvSolutions";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
  onApproved?: () => void;
  contacts?: Record<string, { email: string; vendor: string }>;
}

interface Invitation {
  id: string;
  solution_id: string;
  solution_name: string;
  vendor_name: string | null;
  email: string;
  token: string;
  status: string;
  expires_at: string;
  created_at: string;
  submitted_at: string | null;
}

interface Submission {
  id: string;
  invitation_id: string;
  solution_id: string;
  short_description: string | null;
  what: string | null;
  when_fits: string | null;
  use_cases: string[];
  combos: string[];
  products: string[];
  industries: string[];
  vendor_website: string | null;
  contact_name: string | null;
  contact_email: string | null;
  notes: string | null;
  status: string;
  submitted_at: string;
}

const PUBLIC_BASE = "https://www.d365.se";
const fmt = (d?: string | null) => (d ? new Date(d).toISOString().slice(0, 10).replace(/-/g, "/") : "–");

export default function AdminIsvInvitationsTab({ token, onSessionExpired, onApproved, contacts }: Props) {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [solutionId, setSolutionId] = useState("");
  const [email, setEmail] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [review, setReview] = useState<Submission | null>(null);

  // Förifyll leverantör och e-post från sparade kontaktuppgifter i ISV-katalogen
  const selectSolution = (id: string) => {
    setSolutionId(id);
    const sol = BC_ISV_SOLUTIONS.find((s) => s.id === id);
    const c = contacts?.[id];
    setVendorName(c?.vendor || sol?.vendor || "");
    if (c?.email) setEmail(c.email);
  };

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-isv-invitations`;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
    apikey,
    "Content-Type": "application/json",
  });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}?action=list`, { headers: authHeaders() });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte hämta inbjudningar");
      setInvitations(data.invitations || []);
      setSubmissions(data.submissions || []);
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const pending = useMemo(() => submissions.filter((s) => s.status === "pending"), [submissions]);

  const create = async () => {
    const sol = BC_ISV_SOLUTIONS.find((s) => s.id === solutionId);
    if (!sol || !email.trim()) {
      toast({ title: "Fyll i lösning och e-post", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${baseUrl}?action=create`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          solution_id: sol.id,
          solution_name: sol.name,
          vendor_name: vendorName || sol.vendor,
          email: email.trim(),
          send_email: sendEmail,
        }),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte skapa länk");
      await navigator.clipboard.writeText(data.link).catch(() => {});
      toast({
        title: data.emailError ? "Länk skapad (mejl misslyckades)" : "Profileringslänk skapad",
        description: data.emailError || `${data.link} – kopierad till urklipp`,
      });
      setEmail("");
      setVendorName("");
      await load();
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (inv: Invitation) => {
    if (!confirm(`Ta bort inbjudan för ${inv.solution_name}?`)) return;
    const res = await fetch(`${baseUrl}?action=delete&id=${inv.id}`, { method: "DELETE", headers: authHeaders() });
    if (res.status === 401) return onSessionExpired();
    await load();
  };

  const decide = async (submission: Submission, approve: boolean) => {
    setBusy(true);
    try {
      const res = await fetch(`${baseUrl}?action=${approve ? "approve" : "reject"}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ submission_id: submission.id }),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte spara beslut");
      toast({ title: approve ? "Publicerad" : "Avvisad" });
      setReview(null);
      await load();
      if (approve) onApproved?.();
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-[hsl(var(--cta-orange))]" />
            Profileringslänkar till ISV-leverantörer
          </CardTitle>
          <CardDescription>
            Skicka en personlig länk där leverantören själv beskriver lösningen, väljer vilka
            Dynamics 365-produkter den är byggd för och vilka branscher den passar för. Länken är
            giltig i 14 dagar och du granskar innan publicering.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-3 items-end">
            <div>
              <Label>Lösning</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={solutionId}
                onChange={(e) => setSolutionId(e.target.value)}
              >
                <option value="">Välj lösning…</option>
                {BC_ISV_SOLUTIONS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.vendor})</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Leverantör (valfritt)</Label>
              <Input value={vendorName} onChange={(e) => setVendorName(e.target.value)} placeholder="Kontaktnamn/företag" />
            </div>
            <div>
              <Label>E-post</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kontakt@leverantor.se" />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={sendEmail} onCheckedChange={(v) => setSendEmail(!!v)} />
                <Mail className="h-4 w-4" /> Mejla
              </label>
              <Button onClick={create} disabled={busy}>Skapa länk</Button>
            </div>
          </div>

          {pending.length > 0 && (
            <div className="rounded-md border border-[hsl(var(--cta-orange))]/40 bg-[hsl(var(--cta-orange))]/5 p-4">
              <p className="text-sm font-medium mb-2">{pending.length} inskickad(e) beskrivning(ar) att granska</p>
              <div className="flex flex-wrap gap-2">
                {pending.map((s) => (
                  <Button key={s.id} size="sm" variant="outline" onClick={() => setReview(s)}>
                    Granska {invitations.find((i) => i.id === s.invitation_id)?.solution_name || s.solution_id}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Laddar…</p>
          ) : invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Inga länkar skapade ännu.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lösning</TableHead>
                    <TableHead>E-post</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Giltig t.o.m.</TableHead>
                    <TableHead className="text-right">Åtgärd</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.solution_name}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.email}</TableCell>
                      <TableCell><Badge variant="outline">{inv.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{fmt(inv.expires_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(`${PUBLIC_BASE}/isv-profil/${inv.token}`);
                              toast({ title: "Länk kopierad" });
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => remove(inv)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!review} onOpenChange={(o) => !o && setReview(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Granska inskickad beskrivning</DialogTitle>
          </DialogHeader>
          {review && (
            <div className="space-y-4 text-sm">
              <div>
                <Label>Produkter</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {review.products.map((p) => <Badge key={p} variant="outline">{p}</Badge>)}
                </div>
              </div>
              <div>
                <Label>Branscher</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {review.industries.length
                    ? review.industries.map((i) => <Badge key={i} variant="outline">{i}</Badge>)
                    : <span className="text-muted-foreground">Generell</span>}
                </div>
              </div>
              <div><Label>Kort beskrivning</Label><p className="mt-1">{review.short_description}</p></div>
              <div><Label>Vad lösningen är</Label><p className="mt-1 whitespace-pre-line">{review.what}</p></div>
              <div><Label>När den passar</Label><p className="mt-1 whitespace-pre-line">{review.when_fits}</p></div>
              <div>
                <Label>Används till</Label>
                <ul className="list-disc pl-5 mt-1">{review.use_cases.map((u) => <li key={u}>{u}</li>)}</ul>
              </div>
              <div>
                <Label>Kombinationer</Label>
                <ul className="list-disc pl-5 mt-1">{review.combos.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
              <div className="text-muted-foreground">
                {review.contact_name} · {review.contact_email} · {review.vendor_website}
                {review.notes && <p className="mt-2 italic">{review.notes}</p>}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => review && decide(review, false)} disabled={busy}>
              <X className="h-4 w-4 mr-1" /> Avvisa
            </Button>
            <Button onClick={() => review && decide(review, true)} disabled={busy}>
              <Check className="h-4 w-4 mr-1" /> Publicera
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
