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
import { Plus, Pencil, Trash2, ExternalLink, FileText, Code2 } from "lucide-react";
import { formatDateYYYYMMDD } from "@/lib/utils";
import { BLOG_ARTICLES } from "@/data/blogArticles";

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

const formatDate = formatDateYYYYMMDD;


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

  const normalize = (u: string) => u.replace(/\/+$/, "");
  const dbUrls = new Set(articles.map((a) => normalize(a.url || "")));

  type Row = {
    key: string;
    title: string;
    category: string;
    date: string | null;
    url: string | null;
    published: boolean;
    source: "redaktion" | "kod";
    article?: KnowledgeArticle;
  };

  const rows: Row[] = [
    ...articles.map((a) => ({
      key: a.id,
      title: a.title,
      category: a.category,
      date: a.published_at || a.created_at,
      url: a.url,
      published: a.is_published,
      source: "redaktion" as const,
      article: a,
    })),
    ...BLOG_ARTICLES.filter((b) => !dbUrls.has(`/artiklar/${b.slug}`)).map((b) => ({
      key: `blog-${b.slug}`,
      title: b.title,
      category: b.category,
      date: b.publishedAt,
      url: `/artiklar/${b.slug}`,
      published: true,
      source: "kod" as const,
    })),
  ].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Artiklar
            </CardTitle>
            <CardDescription>
              Alla artiklar på ett ställe: både de du skapar här och de som ligger som färdiga
              sidor på d365.se. Publicerade artiklar visas på /kunskapscenter och ingår i
              sitemap.xml för Google.
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
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Inga artiklar än. Skapa en med "Ny artikel".</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Publicerad</TableHead>
                <TableHead>Url</TableHead>
                <TableHead className="text-right">Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.key}>
                  <TableCell className="font-medium max-w-[320px]">
                    <div className="truncate">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(r.date)}</div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{r.category}</Badge></TableCell>
                  <TableCell>
                    {r.source === "kod" ? (
                      <Badge variant="outline" className="gap-1">
                        <Code2 className="w-3 h-3" /> Publicerad sida
                      </Badge>
                    ) : (
                      <Badge variant="outline">Redaktion</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {r.source === "kod" ? (
                      <span className="text-xs text-muted-foreground">Live</span>
                    ) : (
                      <Switch checked={r.published} onCheckedChange={() => togglePublish(r.article!)} />
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noreferrer"
                         className="text-primary inline-flex items-center gap-1 truncate">
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{r.url}</span>
                      </a>
                    ) : <span className="text-muted-foreground text-xs">saknas</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.source === "kod" ? (
                      <span className="text-xs text-muted-foreground">Redigeras av utvecklare</span>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" onClick={() => setEditing(r.article!)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => remove(r.key)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
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
