import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

interface UnprofiledPartner {
  id: string;
  name: string;
  note: string | null;
  website: string | null;
  display_order: number;
  is_visible: boolean;
}

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const empty = (): Partial<UnprofiledPartner> => ({
  name: "",
  note: "",
  website: "",
  display_order: 100,
  is_visible: true,
});

export default function AdminUnprofiledPartnersTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [partners, setPartners] = useState<UnprofiledPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<UnprofiledPartner> | null>(null);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-unprofiled-partners`;
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
      setPartners(data.partners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}?action=save`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(editing),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte spara");
      toast({ title: "Sparat" });
      setEditing(null);
      load();
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ta bort denna partner permanent?")) return;
    try {
      const res = await fetch(`${baseUrl}?action=delete&id=${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) return onSessionExpired();
      if (!res.ok) throw new Error("Kunde inte radera");
      toast({ title: "Raderad" });
      load();
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Listade men ej profilerade
            </CardTitle>
            <CardDescription>
              Övriga D365-partners som listas på <code>/alla-d365-partners</code> och längst
              ner på Välj Partner. Endast namn visas publikt – ingen logotyp eller länk.
            </CardDescription>
          </div>
          <Button onClick={() => setEditing(empty())} className="gap-2">
            <Plus className="w-4 h-4" /> Ny partner
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Laddar…</p>
        ) : partners.length === 0 ? (
          <p className="text-sm text-muted-foreground">Inga ännu. Lägg till med "Ny partner".</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead>Intern not</TableHead>
                <TableHead>Ordning</TableHead>
                <TableHead>Synlig</TableHead>
                <TableHead className="text-right">Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{p.note || "—"}</TableCell>
                  <TableCell>{p.display_order}</TableCell>
                  <TableCell>{p.is_visible ? "Ja" : "Nej"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(p)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(p.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Redigera partner" : "Ny partner"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="up-name">Namn *</Label>
                <Input
                  id="up-name"
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="up-note">Intern not (visas ej publikt)</Label>
                <Textarea
                  id="up-note"
                  value={editing.note || ""}
                  onChange={(e) => setEditing({ ...editing, note: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="up-website">Webbplats (intern referens, visas ej publikt)</Label>
                <Input
                  id="up-website"
                  value={editing.website || ""}
                  onChange={(e) => setEditing({ ...editing, website: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="up-order">Visningsordning (lägre = först)</Label>
                <Input
                  id="up-order"
                  type="number"
                  value={editing.display_order ?? 100}
                  onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="up-visible"
                  checked={editing.is_visible !== false}
                  onCheckedChange={(v) => setEditing({ ...editing, is_visible: v })}
                />
                <Label htmlFor="up-visible">Synlig publikt</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Avbryt</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
