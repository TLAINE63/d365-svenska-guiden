import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PartnerNewsCard, {
  partnerNewsProductLabel,
  partnerNewsSourceLabel,
  partnerNewsTypeLabel,
} from "@/components/PartnerNewsCard";
import type {
  PartnerNewsItem,
  PartnerNewsProductArea,
  PartnerNewsSourceType,
  PartnerNewsStatus,
  PartnerNewsType,
} from "@/hooks/usePartnerNews";
import { Plus, Pencil, Trash2, Eye, Send, Archive, CheckCircle2, XCircle, Circle, ExternalLink, RefreshCw, Inbox, Tag, Info, Upload, X, Loader2, Crop } from "lucide-react";
import ImageCropDialog from "@/components/ImageCropDialog";

interface Props {
  token: string;
  partners: Array<{ id: string; name: string; slug: string; is_featured: boolean; logo_url?: string | null }>;
  onSessionExpired: () => void;
}

const PRODUCT_OPTIONS: PartnerNewsProductArea[] = ["business-central", "finance-scm", "crm-sales", "crm-service", "power-platform", "microsoft-ai", "ovrigt"];
const TYPE_OPTIONS: PartnerNewsType[] = ["kundcase", "event", "webinar", "erbjudande", "artikel", "rapport", "branschlosning", "produktnyhet", "analys"];
const SOURCE_OPTIONS: PartnerNewsSourceType[] = ["linkedin", "partner_web", "blog", "press", "webinar", "event", "other"];
const STATUS_OPTIONS: PartnerNewsStatus[] = ["draft", "review", "approved", "published", "unpublished", "archived"];

const STATUS_LABEL: Record<PartnerNewsStatus, string> = {
  draft: "Utkast",
  review: "För granskning",
  approved: "Godkänd",
  published: "Publicerad",
  unpublished: "Avpublicerad",
  archived: "Arkiverad",
};

const STATUS_STYLE: Record<PartnerNewsStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  review: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  published: "bg-emerald-100 text-emerald-800",
  unpublished: "bg-orange-100 text-orange-800",
  archived: "bg-gray-200 text-gray-700",
};

type FormState = {
  id?: string;
  partner_id: string;
  editorial_title: string;
  summary: string;
  source_url: string;
  source_type: PartnerNewsSourceType;
  product_areas: PartnerNewsProductArea[];
  news_type: PartnerNewsType;
  industry: string;
  image_url: string;
  news_date: string;
  is_featured: boolean;
  show_on_home: boolean;
  show_on_partner_profile: boolean;
  show_on_product_page: boolean;
  status: PartnerNewsStatus;
};

const emptyForm = (partnerId: string): FormState => ({
  partner_id: partnerId,
  editorial_title: "",
  summary: "",
  source_url: "",
  source_type: "linkedin",
  product_areas: ["business-central"],
  news_type: "kundcase",
  industry: "",
  image_url: "",
  news_date: new Date().toISOString().slice(0, 10),
  is_featured: true,
  show_on_home: true,
  show_on_partner_profile: true,
  show_on_product_page: true,
  status: "draft",
});

export default function AdminPartnerNewsTab({ token, partners, onSessionExpired }: Props) {
  const { toast } = useToast();
  const publishedPartners = useMemo(() => partners.filter((p) => p.is_featured), [partners]);
  const [items, setItems] = useState<PartnerNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [partnerFilter, setPartnerFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(publishedPartners[0]?.id ?? ""));
  const [previewItem, setPreviewItem] = useState<PartnerNewsItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropMime, setCropMime] = useState<string>("image/jpeg");
  const [lastRawImage, setLastRawImage] = useState<string | null>(null);
  const [publishedIndustries, setPublishedIndustries] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("industry_pages")
        .select("name")
        .eq("is_published", true)
        .order("name", { ascending: true });
      if (!error && data) {
        setPublishedIndustries(Array.from(new Set(data.map((r: { name: string }) => r.name).filter(Boolean))));
      }
    })();
  }, []);

  const invoke = useCallback(async (action: string, extra: Record<string, unknown> = {}) => {
    const { data, error } = await supabase.functions.invoke("manage-partner-news", {
      body: { action, token, ...extra },
    });
    if (error) throw error;
    if (data?.error) {
      if (String(data.error).includes("gått ut") || String(data.error).includes("Ogiltig")) onSessionExpired();
      throw new Error(data.error);
    }
    return data;
  }, [token, onSessionExpired]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await invoke("list");
      const rows = (res?.items ?? []) as Array<Record<string, unknown>>;
      const mapped = rows.map((r) => {
        const partner = (r.partners ?? null) as PartnerNewsItem["partner"];
        const { partners: _p, ...rest } = r;
        return { ...(rest as unknown as PartnerNewsItem), partner };
      });
      setItems(mapped);
    } catch (err) {
      toast({ title: "Kunde inte läsa partnernytt", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [invoke, toast]);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (statusFilter === "queue") {
        if (i.status !== "draft" && i.status !== "review") return false;
      } else if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (partnerFilter !== "all" && i.partner_id !== partnerFilter) return false;
      return true;
    });
  }, [items, statusFilter, partnerFilter]);

  const queueCount = useMemo(
    () => items.filter((i) => i.status === "draft" || i.status === "review").length,
    [items],
  );

  const setType = async (item: PartnerNewsItem, news_type: PartnerNewsType) => {
    try {
      await invoke("update", { news: { id: item.id, partner_id: item.partner_id, editorial_title: item.editorial_title, summary: item.summary, source_url: item.source_url, source_type: item.source_type, product_area: item.product_area, news_type, industry: item.industry ?? undefined, image_url: item.image_url ?? undefined, news_date: item.news_date, is_featured: item.is_featured, show_on_home: item.show_on_home, show_on_partner_profile: item.show_on_partner_profile, show_on_product_page: item.show_on_product_page, status: item.status } });
      toast({ title: "Typ uppdaterad", description: partnerNewsTypeLabel(news_type) });
      await refresh();
    } catch (err) {
      toast({ title: "Kunde inte ändra typ", description: (err as Error).message, variant: "destructive" });
    }
  };

  const openNew = () => {
    setForm(emptyForm(publishedPartners[0]?.id ?? ""));
    setDialogOpen(true);
  };

  const openEdit = (item: PartnerNewsItem) => {
    setForm({
      id: item.id,
      partner_id: item.partner_id,
      editorial_title: item.editorial_title,
      summary: item.summary,
      source_url: item.source_url,
      source_type: item.source_type,
      product_areas: (item.product_areas && item.product_areas.length > 0) ? item.product_areas : [item.product_area],
      news_type: item.news_type,
      industry: item.industry ?? "",
      image_url: item.image_url ?? "",
      news_date: item.news_date,
      is_featured: item.is_featured,
      show_on_home: item.show_on_home,
      show_on_partner_profile: item.show_on_partner_profile,
      show_on_product_page: item.show_on_product_page,
      status: item.status,
    });
    setDialogOpen(true);
  };

  const save = async (statusOverride?: PartnerNewsStatus) => {
    if (!form.partner_id) {
      toast({ title: "Välj partner först", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        product_area: form.product_areas[0],
        status: statusOverride ?? form.status,
        industry: form.industry.trim() || undefined,
        image_url: form.image_url.trim() || undefined,
      };
      await invoke(form.id ? "update" : "create", { news: payload });
      toast({ title: form.id ? "Uppdaterad" : "Skapad" });
      setDialogOpen(false);
      await refresh();
    } catch (err) {
      toast({ title: "Kunde inte spara", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (id: string, status: PartnerNewsStatus) => {
    try {
      await invoke("set-status", { id, status });
      await refresh();
    } catch (err) {
      toast({ title: "Kunde inte ändra status", description: (err as Error).message, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ta bort denna partnernyhet?")) return;
    try {
      await invoke("delete", { id });
      await refresh();
    } catch (err) {
      toast({ title: "Kunde inte ta bort", description: (err as Error).message, variant: "destructive" });
    }
  };

  const uploadBlob = async (blob: Blob, filename: string, contentType: string) => {
    setUploadingImage(true);
    try {
      const b64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
        r.onerror = () => reject(new Error("Kunde inte läsa filen"));
        r.readAsDataURL(blob);
      });
      const res = await invoke("upload-image", { file_base64: b64, content_type: contentType, filename });
      if (res?.image_url) {
        setForm((f) => ({ ...f, image_url: res.image_url }));
        toast({ title: "Bild uppladdad" });
      }
    } catch (err) {
      toast({ title: "Kunde inte ladda upp bild", description: (err as Error).message, variant: "destructive" });
    } finally {
      setUploadingImage(false);
    }
  };

  const autoCenterCrop16x9 = async (dataUrl: string, mime: string): Promise<Blob> => {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Kunde inte läsa bilden"));
      i.src = dataUrl;
    });
    const target = 16 / 9;
    const src = img.width / img.height;
    let sw = img.width;
    let sh = img.height;
    if (src > target) {
      // Too wide → crop width, keep full height, center horizontally
      sw = Math.round(img.height * target);
    } else {
      // Too tall → crop height, keep full width, center vertically
      sh = Math.round(img.width / target);
    }
    const sx = Math.round((img.width - sw) / 2);
    const sy = Math.round((img.height - sh) / 2);
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    return new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Kunde inte skapa bild"))), mime, 0.92);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
      toast({ title: "Ogiltigt format", description: "Använd JPG, PNG, WebP eller GIF.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Bilden är för stor", description: "Max 5 MB.", variant: "destructive" });
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error("Kunde inte läsa filen"));
      r.readAsDataURL(file);
    });
    const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
    setCropMime(mime);
    setLastRawImage(dataUrl);
    try {
      const blob = await autoCenterCrop16x9(dataUrl, mime);
      const ext = mime === "image/png" ? "png" : "jpg";
      await uploadBlob(blob, `auto-${Date.now()}.${ext}`, mime);
    } catch (err) {
      toast({ title: "Kunde inte beskära bild", description: (err as Error).message, variant: "destructive" });
    }
  };

  const handleCropped = async (blob: Blob) => {
    const ext = cropMime === "image/png" ? "png" : "jpg";
    setCropSrc(null);
    await uploadBlob(blob, `crop-${Date.now()}.${ext}`, cropMime);
  };

  const openManualCrop = () => {
    if (lastRawImage) setCropSrc(lastRawImage);
  };

  const previewFormItem: PartnerNewsItem = useMemo(() => {
    const partner = publishedPartners.find((p) => p.id === form.partner_id);
    return {
      id: form.id ?? "preview",
      partner_id: form.partner_id,
      editorial_title: form.editorial_title || "Redaktionell rubrik",
      summary: form.summary || "Kort sammanfattning kommer att visas här.",
      source_url: form.source_url || "https://example.com",
      source_type: form.source_type,
      product_area: form.product_areas[0] ?? "business-central",
      product_areas: form.product_areas.length > 0 ? form.product_areas : ["business-central"],
      news_type: form.news_type,
      industry: form.industry || null,
      image_url: form.image_url || null,
      news_date: form.news_date,
      is_featured: form.is_featured,
      show_on_home: form.show_on_home,
      show_on_partner_profile: form.show_on_partner_profile,
      show_on_product_page: form.show_on_product_page,
      status: form.status,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      partner: partner ? { id: partner.id, name: partner.name, slug: partner.slug, logo_url: partner.logo_url ?? null } : null,
    };
  }, [form, publishedPartners]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle>Partnernytt</CardTitle>
              <CardDescription>
                Redaktionellt kuraterade nyheter, kundcase, event och erbjudanden från publicerade partners. Länka alltid till originalkällan – kopiera aldrig hela LinkedIn-inlägg eller externa artiklar.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Uppdatera
              </Button>
              <Button onClick={openNew} className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white">
                <Plus className="w-4 h-4 mr-1" /> Ny partnernytt
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button
              variant={statusFilter === "queue" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("queue")}
              className={statusFilter === "queue" ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}
            >
              <Inbox className="w-4 h-4 mr-1" /> Godkännandekö
              {queueCount > 0 && (
                <Badge className="ml-2 bg-amber-100 text-amber-900 hover:bg-amber-100">{queueCount}</Badge>
              )}
            </Button>
            <Button
              variant={statusFilter === "published" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("published")}
              className={statusFilter === "published" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
            >
              Publicerade
            </Button>
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              Alla
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="min-w-[200px]">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla statusar</SelectItem>
                  <SelectItem value="queue">Godkännandekö (utkast + granskning)</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[240px]">
              <Label className="text-xs">Partner</Label>
              <Select value={partnerFilter} onValueChange={setPartnerFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla partners</SelectItem>
                  {publishedPartners.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Laddar…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">Inga partnernyheter matchar filtret.</p>
          ) : (
            <div className="divide-y divide-border rounded-md border">
              {filtered.map((item) => (
                <div key={item.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge className={STATUS_STYLE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.partner?.name ?? "—"} · {item.news_date} · {partnerNewsTypeLabel(item.news_type)} · {partnerNewsProductLabel(item.product_area)} · {partnerNewsSourceLabel(item.source_type)}
                      </span>
                    </div>
                    <p className="font-medium truncate">{item.editorial_title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                    <a href={item.source_url} target="_blank" rel="noopener nofollow" className="text-xs text-[hsl(var(--cta-orange))] inline-flex items-center gap-1 mt-1">
                      Originalkälla <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={item.news_type} onValueChange={(v) => setType(item, v as PartnerNewsType)}>
                      <SelectTrigger className="h-8 w-[150px] text-xs">
                        <span className="inline-flex items-center gap-1"><Tag className="w-3 h-3" /><SelectValue /></span>
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((t) => (
                          <SelectItem key={t} value={t}>{partnerNewsTypeLabel(t)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => setPreviewItem(item)} aria-label="Visa förhandsvisning"><Eye className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)} aria-label="Redigera nyhet"><Pencil className="w-4 h-4" /></Button>
                    {(item.status === "draft" || item.status === "review") && (
                      <>
                        <Button size="sm" onClick={() => setStatus(item.id, "published")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Godkänn
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setStatus(item.id, "archived")} className="text-destructive border-destructive/40">
                          <XCircle className="w-4 h-4 mr-1" /> Avvisa
                        </Button>
                      </>
                    )}
                    {item.status !== "published" && item.status !== "draft" && item.status !== "review" && (
                      <Button variant="outline" size="sm" onClick={() => setStatus(item.id, "published")} className="text-emerald-700">
                        <Send className="w-4 h-4 mr-1" /> Publicera
                      </Button>
                    )}
                    {item.status === "published" && (
                      <Button variant="outline" size="sm" onClick={() => setStatus(item.id, "unpublished")} className="text-orange-700">
                        Avpublicera
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setStatus(item.id, "archived")} aria-label="Arkivera nyhet">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => remove(item.id)} className="text-destructive" aria-label="Ta bort nyhet">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Redigera partnernytt" : "Ny partnernytt"}</DialogTitle>
          </DialogHeader>

          <div className="rounded-md border-l-4 border-[hsl(var(--cta-orange))] bg-orange-50 p-3 text-xs text-orange-900">
            Partnernytt är ett urval för köpare av Dynamics 365. Publicera bara innehåll som hjälper en köpare att förstå partnerns erbjudande, erfarenhet, branschfokus eller marknadsaktivitet. Kopiera aldrig hela LinkedIn-inlägg eller externa artiklar – skriv en kort redaktionell sammanfattning och länka till originalkällan.
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Partner</Label>
              <Select value={form.partner_id} onValueChange={(v) => setForm({ ...form, partner_id: v })}>
                <SelectTrigger><SelectValue placeholder="Välj partner" /></SelectTrigger>
                <SelectContent>
                  {publishedPartners.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Datum</Label>
              <Input type="date" value={form.news_date} onChange={(e) => setForm({ ...form, news_date: e.target.value })} />
            </div>

            <div className="sm:col-span-2">
              <Label>Redaktionell rubrik</Label>
              <Input value={form.editorial_title} onChange={(e) => setForm({ ...form, editorial_title: e.target.value })} maxLength={200} />
            </div>

            <div className="sm:col-span-2">
              <Label>Kort sammanfattning (max 600 tecken)</Label>
              <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={4} maxLength={600} />
              <p className="text-xs text-muted-foreground mt-1">{form.summary.length}/600</p>
            </div>

            <div className="sm:col-span-2">
              <Label>Länk till originalkälla</Label>
              <Input type="url" value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} placeholder="https://linkedin.com/posts/..." />
            </div>

            <div>
              <Label>Källa</Label>
              <Select value={form.source_type} onValueChange={(v) => setForm({ ...form, source_type: v as PartnerNewsSourceType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{partnerNewsSourceLabel(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nyhetstyp</Label>
              <Select value={form.news_type} onValueChange={(v) => setForm({ ...form, news_type: v as PartnerNewsType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{partnerNewsTypeLabel(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Produktområden (välj ett eller flera)</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRODUCT_OPTIONS.map((p) => {
                  const checked = form.product_areas.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        const next = checked
                          ? form.product_areas.filter((x) => x !== p)
                          : [...form.product_areas, p];
                        setForm({ ...form, product_areas: next.length > 0 ? next : form.product_areas });
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs transition ${
                        checked
                          ? "bg-[hsl(var(--cta-orange))] text-white border-[hsl(var(--cta-orange))]"
                          : "bg-background text-foreground border-border hover:bg-muted"
                      }`}
                      aria-pressed={checked}
                    >
                      {partnerNewsProductLabel(p)}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Det första valda området används som primärt (visas på kort och i filter).</p>
            </div>
            <div>
              <Label>Bransch (valfritt)</Label>
              <Select
                value={form.industry ? form.industry : "__none__"}
                onValueChange={(v) => setForm({ ...form, industry: v === "__none__" ? "" : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Branschoberoende" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Branschoberoende</SelectItem>
                  {publishedIndustries.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Välj bransch om artikeln är riktad. Lämna som "Branschoberoende" annars.</p>
            </div>

            <div className="sm:col-span-2">
              <Label>Bild (valfritt)</Label>
              {form.image_url ? (
                <div className="mt-2 flex items-start gap-3">
                  <div className="relative inline-block">
                    <img src={form.image_url} alt="Förhandsvisning" className="max-h-48 rounded-md border object-cover aspect-[16/9]" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: "" })}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow hover:opacity-90"
                      aria-label="Ta bort bild"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-border cursor-pointer hover:bg-muted text-sm">
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploadingImage ? "Laddar upp…" : "Byt bild (auto-centrerad 16:9)"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageUpload(f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {lastRawImage && (
                      <button
                        type="button"
                        onClick={openManualCrop}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-muted disabled:opacity-50"
                      >
                        <Crop className="w-4 h-4" /> Justera beskärning manuellt
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-border cursor-pointer hover:bg-muted text-sm">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingImage ? "Laddar upp…" : "Ladda upp bild från datorn"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              )}
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground">Eller klistra in en publik bild-URL</Label>
                <Input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP eller GIF, max 5 MB. Ta t.ex. en skärmdump av LinkedIn-inläggets bild.</p>
            </div>


            <div className="sm:col-span-2 pt-2 border-t">
              <Label className="mb-2 block">Synlighet och placering</Label>
              <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground mb-3">
                <p className="flex items-start gap-2 mb-1.5">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>Allt publicerat innehåll visas automatiskt på startsidan, produktområdessidor och partnerprofiler. Placeringsvalen nedan sparas för framtida bruk (när partners själva publicerar) men styr inte visningen just nu.</span>
                </p>
                <p className="flex items-start gap-2 mb-1.5">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span><strong>Visa på startsidan</strong> – inkluderas i sektionen “Aktuellt från Dynamics 365-partners” på startsidan (visar upp till 3 publicerade nyheter).</span>
                </p>
                <p className="flex items-start gap-2 mb-1.5">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span><strong>Visa på partnerprofil</strong> – visas under “Senaste nytt” på partnerns publika profilsida på d365.se.</span>
                </p>
                <p className="flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span><strong>Visa på produktområdessida</strong> – gör att nyheten kan filtreras och visas i arkivet per produktområde. För närvarande syns den i nyhetsarkivet när besökaren väljer motsvarande produktområde.</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2"><Switch checked={form.show_on_home} onCheckedChange={(v) => setForm({ ...form, show_on_home: v })} /> Visa på startsidan</label>
                <label className="flex items-center gap-2"><Switch checked={form.show_on_partner_profile} onCheckedChange={(v) => setForm({ ...form, show_on_partner_profile: v })} /> Visa på partnerprofil</label>
                <label className="flex items-center gap-2"><Switch checked={form.show_on_product_page} onCheckedChange={(v) => setForm({ ...form, show_on_product_page: v })} /> Visa på produktområdessida</label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as PartnerNewsStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Förhandsgranskning</p>
            <div className="max-w-md">
              <PartnerNewsCard item={previewFormItem} />
            </div>
          </div>

          <DialogFooter className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Avbryt</Button>
            <Button variant="outline" onClick={() => save("draft")} disabled={saving}><Circle className="w-4 h-4 mr-1" /> Spara utkast</Button>
            <Button variant="outline" onClick={() => save("review")} disabled={saving}>Skicka för granskning</Button>
            <Button variant="outline" onClick={() => save("approved")} disabled={saving}><CheckCircle2 className="w-4 h-4 mr-1" /> Godkänn</Button>
            <Button onClick={() => save("published")} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Send className="w-4 h-4 mr-1" /> Publicera</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Förhandsgranskning</DialogTitle></DialogHeader>
          {previewItem && <PartnerNewsCard item={previewItem} />}
        </DialogContent>
      </Dialog>
      <ImageCropDialog
        open={!!cropSrc}
        imageSrc={cropSrc}
        aspect={16 / 9}
        onCancel={() => setCropSrc(null)}
        onCropped={handleCropped}
      />
    </div>
  );
}
