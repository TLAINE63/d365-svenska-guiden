import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ExternalLink, FileText } from "lucide-react";

interface KnowledgeArticle {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  slug: string | null;
  category: string;
  content_type: string;
  format: string;
  image_url: string | null;
  target_roles: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const CATEGORIES = ["artikel", "guide", "video", "fordjupning", "behovsanalys", "kravspecifikation"];
const FORMATS = ["artikel", "guide", "video", "behovsanalys", "kravspecifikation", "event"];

const empty = (): Partial<KnowledgeArticle> => ({
  title: "",
  description: "",
  url: "",
  slug: "",
  category: "artikel",
  content_type: "artikel",
  format: "artikel",
  image_url: "",
  target_roles: [],
  is_published: false,
});

const formatDate = (iso: string | null) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
};

export default function AdminKnowledgeArticlesTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<KnowledgeArticle> | null>(null);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-knowledge-articles`;
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
      setArticles(data.articles || []);
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
      toast({ title: "Sparat", description: "Artikeln har sparats." });
      setEditing(null);
      load();
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (a: KnowledgeArticle) => {
    try {
      const res = await fetch(`${baseUrl}?action=toggle-publish`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ id: a.id, is_published: !a.is_published }),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte uppdatera");
      toast({ title: !a.is_published ? "Publicerad" : "Avpublicerad" });
      load();
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ta bort artikeln permanent?")) return;
    try {
      const res = await fetch(`${baseUrl}?action=delete&id=${id}`, {
        method: "DELETE", headers: authHeaders(),
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
              <FileText className="w-5 h-5 text-primary" />
              Kunskapsartiklar
            </CardTitle>
            <CardDescription>
              Skapa, redigera och publicera artiklar i Kunskapscentret. Publicerade artiklar
              visas på /kunskapscenter och inkluderas i sitemap.xml för Google-indexering.
            </CardDescription>
          </div>
          <Button onClick={() => setEditing(empty())} className="gap-2">
            <Plus className="w-4 h-4" /> Ny artikel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Laddar…</p>
        ) : articles.length === 0 ? (
          <p className="text-sm text-muted-foreground">Inga artiklar än. Skapa en med "Ny artikel".</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Publicerad</TableHead>
                <TableHead>Url</TableHead>
                <TableHead className="text-right">Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium max-w-[320px]">
                    <div className="truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(a.published_at || a.created_at)}</div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                  <TableCell>
                    <Switch checked={a.is_published} onCheckedChange={() => togglePublish(a)} />
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {a.url ? (
                      <a href={a.url} target="_blank" rel="noreferrer"
                         className="text-primary inline-flex items-center gap-1 truncate">
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{a.url}</span>
                      </a>
                    ) : <span className="text-muted-foreground text-xs">saknas</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => setEditing(a)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => remove(a.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Redigera artikel" : "Ny artikel"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Titel *</Label>
                <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <Label>Beskrivning</Label>
                <Textarea rows={3} value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <Label>Url * (interna sidor: /artiklar/min-slug, externa: https://...)</Label>
                <Input value={editing.url || ""} onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  placeholder="/artiklar/min-artikel eller https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Kategori</Label>
                  <Select value={editing.category || "artikel"}
                    onValueChange={(v) => setEditing({ ...editing, category: v, format: v, content_type: v === "video" ? "video" : "artikel" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Format</Label>
                  <Select value={editing.format || "artikel"}
                    onValueChange={(v) => setEditing({ ...editing, format: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FORMATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Bild-url (valfritt)</Label>
                <Input value={editing.image_url || ""}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <Switch
                  checked={!!editing.is_published}
                  onCheckedChange={(v) => setEditing({ ...editing, is_published: v })}
                />
                <Label>Publicera direkt (kräver titel + url)</Label>
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
