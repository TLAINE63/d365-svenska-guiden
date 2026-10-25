import { useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, FileUp, ImagePlus, Loader2 } from "lucide-react";
import { BLOG_ARTICLES } from "@/data/blogArticles";
import { ARTICLE_BODY_CLASS } from "@/lib/articleBodyClass";
import { convertWordFile, fixTitleTypography, uploadImageBlob, type ImageUploader } from "@/lib/wordArticle";

export interface WordArticleRecord {
  id?: string;
  title: string;
  slug: string;
  description: string;
  meta_title: string;
  meta_description: string;
  article_section: string;
  tags: string[];
  image_url: string;
  hero_caption: string;
  body_html: string;
  source_filename: string;
  is_published: boolean;
  published_at?: string | null;
}

interface Props {
  open: boolean;
  initial: WordArticleRecord | null;
  token: string | null;
  takenSlugs: string[];
  onClose: () => void;
  onSaved: () => void;
  onSessionExpired: () => void;
}

const STATIC_SLUGS = new Set(BLOG_ARTICLES.map((a) => a.slug));
const SECTIONS = Array.from(new Set(BLOG_ARTICLES.map((a) => a.category))).sort((a, b) => a.localeCompare(b, "sv"));

export function slugifyArticle(s: string): string {
  return s
    .toLowerCase()
    .replace(/å|ä/g, "a")
    .replace(/ö/g, "o")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

const blank = (): WordArticleRecord => ({
  title: "",
  slug: "",
  description: "",
  meta_title: "",
  meta_description: "",
  article_section: "",
  tags: [],
  image_url: "",
  hero_caption: "",
  body_html: "",
  source_filename: "",
  is_published: false,
});

export default function RedaktionWordArticleDialog({ open, initial, token, takenSlugs, onClose, onSaved, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState<WordArticleRecord>(blank());
  const [tagsText, setTagsText] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [converting, setConverting] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [saving, setSaving] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-knowledge-articles`;
  const headers = () => ({
    Authorization: `Bearer ${token}`,
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
  });

  useEffect(() => {
    if (!open) return;
    const start = initial ?? blank();
    setForm(start);
    setTagsText(start.tags.join(", "));
    setSlugTouched(!!initial?.slug);
    setWarnings([]);
  }, [open, initial]);

  const upload: ImageUploader = async ({ base64, contentType }) => {
    const res = await fetch(`${baseUrl}?action=upload-image`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ data_base64: base64, content_type: contentType }),
    });
    if (res.status === 401) {
      onSessionExpired();
      throw new Error("Sessionen har gått ut");
    }
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || "Bilden kunde inte laddas upp");
    return data.url as string;
  };

  const set = <K extends keyof WordArticleRecord>(key: K, value: WordArticleRecord[K]) =>
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "title" && !slugTouched) next.slug = slugifyArticle(String(value));
      return next;
    });

  async function handleWordFile(file: File | undefined) {
    if (!file) return;
    if (!/\.docx$/i.test(file.name)) {
      toast({ title: "Välj en Word-fil (.docx)", variant: "destructive" });
      return;
    }
    setConverting(true);
    try {
      const draft = await convertWordFile(file, upload);
      setForm((f) => {
        const title = f.title || draft.title;
        return {
          ...f,
          title,
          slug: slugTouched ? f.slug : slugifyArticle(title),
          description: f.description || draft.ingress,
          meta_description: f.meta_description || draft.ingress,
          image_url: draft.heroImage || f.image_url,
          hero_caption: draft.heroImage ? draft.heroCaption : f.hero_caption,
          body_html: draft.bodyHtml,
          source_filename: file.name,
        };
      });
      setWarnings(draft.warnings);
      toast({
        title: "Word-filen är inläst",
        description: `${draft.imageCount} bild${draft.imageCount === 1 ? "" : "er"} uppladdade. Granska texten innan du sparar.`,
      });
    } catch (e) {
      toast({ title: "Kunde inte läsa Word-filen", description: (e as Error).message, variant: "destructive" });
    } finally {
      setConverting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleHeroFile(file: File | undefined) {
    if (!file) return;
    setUploadingHero(true);
    try {
      const url = await uploadImageBlob(file, upload);
      set("image_url", url);
    } catch (e) {
      toast({ title: "Bilden kunde inte laddas upp", description: (e as Error).message, variant: "destructive" });
    } finally {
      setUploadingHero(false);
      if (heroRef.current) heroRef.current.value = "";
    }
  }

  const slugError = useMemo(() => {
    if (!form.slug) return "Adress krävs";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) return "Bara små bokstäver a–z, siffror och bindestreck";
    if (STATIC_SLUGS.has(form.slug)) return "Adressen används redan av en annan artikel på d365.se";
    if (takenSlugs.includes(form.slug)) return "Adressen används redan av en annan artikel i redaktionen";
    return null;
  }, [form.slug, takenSlugs]);

  const canSave = !!form.title.trim() && !!form.body_html && !slugError && !converting && !uploadingHero;
  const metaTitle = form.meta_title || form.title;
  const metaDesc = form.meta_description || form.description;

  async function save() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        title: fixTitleTypography(form.title.trim()),
        description: fixTitleTypography(form.description.trim()),
        tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const res = await fetch(`${baseUrl}?action=save`, { method: "POST", headers: headers(), body: JSON.stringify(payload) });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte spara");
      toast({
        title: form.is_published ? "Artikeln är publicerad" : "Utkastet är sparat",
        description: form.is_published
          ? `Den finns nu på /artiklar/${form.slug}/ och i Kunskapscentret.`
          : "Den syns inte på sajten förrän du publicerar den.",
      });
      onSaved();
    } catch (e) {
      toast({ title: "Kunde inte spara", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Redigera Word-artikel" : "Ny artikel från Word"}</DialogTitle>
          <DialogDescription>
            Ladda upp en Word-fil så läses text, rubriker, listor, länkar och bilder in. Första bilden blir huvudbild
            och ett inledande stycke i fetstil blir ingress. Inget visas på sajten förrän du publicerar.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            aria-label="Välj Word-fil"
            onChange={(e) => handleWordFile(e.target.files?.[0])}
          />
          <Button type="button" onClick={() => fileRef.current?.click()} disabled={converting} className="gap-2">
            {converting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            {form.body_html ? "Ersätt med ny Word-version" : "Välj Word-fil (.docx)"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {converting ? "Läser in text och laddar upp bilder…" : form.source_filename || "Ingen fil vald"}
          </span>
        </div>

        {warnings.length > 0 && (
          <ul className="space-y-1 rounded-lg border border-border bg-muted/40 p-3 text-sm">
            {warnings.map((w) => (
              <li key={w} className="flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" /> {w}
              </li>
            ))}
          </ul>
        )}

        {form.body_html && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="wa-title">Titel *</Label>
                <Input id="wa-title" value={form.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="wa-ingress">Ingress (visas under titeln och på artikelkortet)</Label>
                <Textarea id="wa-ingress" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="wa-slug">Adress *</Label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground shrink-0">/artiklar/</span>
                  <Input
                    id="wa-slug"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value.toLowerCase());
                    }}
                  />
                  <span className="text-sm text-muted-foreground">/</span>
                </div>
                {slugError && <p className="text-xs text-destructive mt-1">{slugError}</p>}
                {initial?.is_published && initial.slug !== form.slug && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Artikeln är redan publicerad. Byter du adress slutar den gamla länken att fungera.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="wa-section">Kategori</Label>
                <Input
                  id="wa-section"
                  list="wa-sections"
                  value={form.article_section}
                  placeholder="t.ex. Partnerval"
                  onChange={(e) => set("article_section", e.target.value)}
                />
                <datalist id="wa-sections">
                  {SECTIONS.map((s) => <option key={s} value={s} />)}
                </datalist>
              </div>
              <div>
                <Label htmlFor="wa-meta-title">SEO-titel (lämna tomt för att använda titeln)</Label>
                <Input id="wa-meta-title" value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)} />
                <p className={`text-xs mt-1 ${metaTitle.length > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                  {metaTitle.length}/60 tecken
                </p>
              </div>
              <div>
                <Label htmlFor="wa-tags">Taggar (separera med komma)</Label>
                <Input id="wa-tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Business Central, Bygg, Partnerval" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="wa-meta-desc">Metabeskrivning för Google (lämna tomt för att använda ingressen)</Label>
                <Textarea id="wa-meta-desc" rows={2} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} />
                <p className={`text-xs mt-1 ${metaDesc.length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                  {metaDesc.length}/160 tecken{metaDesc.length > 160 ? ", kortas automatiskt vid en hel mening" : ""}
                </p>
              </div>
              <div className="md:col-span-2 grid gap-3 sm:grid-cols-[200px_1fr] items-start">
                <div className="aspect-[2/1] w-full overflow-hidden rounded border border-border bg-muted">
                  {form.image_url ? (
                    <img src={form.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Ingen huvudbild</div>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    ref={heroRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    aria-label="Välj huvudbild"
                    onChange={(e) => handleHeroFile(e.target.files?.[0])}
                  />
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => heroRef.current?.click()} disabled={uploadingHero}>
                    {uploadingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                    {form.image_url ? "Byt huvudbild" : "Välj huvudbild"}
                  </Button>
                  <Label htmlFor="wa-caption" className="block">Bildtext</Label>
                  <Input id="wa-caption" value={form.hero_caption} onChange={(e) => set("hero_caption", e.target.value)} />
                </div>
              </div>
            </div>

            <section aria-label="Förhandsvisning" className="rounded-lg border border-border bg-background p-5 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Förhandsvisning av texten
              </p>
              <h1 className="text-xl md:text-3xl font-bold text-foreground leading-tight tracking-tight text-balance">
                {form.title || "Titel saknas"}
              </h1>
              {form.description && (
                <p className="text-muted-foreground mt-3 text-base md:text-lg leading-relaxed">{form.description}</p>
              )}
              {form.image_url && (
                <figure className="mt-6">
                  <img src={form.image_url} alt="" className="w-full rounded aspect-[2/1] object-cover" />
                  {form.hero_caption && (
                    <figcaption className="mt-2 text-sm italic text-muted-foreground">{form.hero_caption}</figcaption>
                  )}
                </figure>
              )}
              <div className={`mt-8 max-w-3xl ${ARTICLE_BODY_CLASS}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form.body_html) }} />
            </section>
          </>
        )}

        <DialogFooter className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={form.is_published} onCheckedChange={(v) => set("is_published", v)} disabled={!form.body_html} />
            Publicera på d365.se
          </label>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button onClick={save} disabled={!canSave || saving}>
              {saving ? "Sparar…" : form.is_published ? "Spara och publicera" : "Spara utkast"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
