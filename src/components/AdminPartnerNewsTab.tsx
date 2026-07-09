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
import { Plus, Pencil, Trash2, Eye, Send, Archive, CheckCircle2, XCircle, Circle, ExternalLink, RefreshCw, Inbox, Tag } from "lucide-react";

interface Props {
  token: string;
  partners: Array<{ id: string; name: string; slug: string; is_featured: boolean; logo_url?: string | null }>;
  onSessionExpired: () => void;
}

const PRODUCT_OPTIONS: PartnerNewsProductArea[] = ["business-central", "finance-scm", "crm", "power-platform", "microsoft-ai", "ovrigt"];
const TYPE_OPTIONS: PartnerNewsType[] = ["kundcase", "event", "webinar", "erbjudande", "artikel", "rapport", "branschlosning", "produktnyhet", "partnernyhet", "analys"];
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
  product_area: PartnerNewsProductArea;
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
  product_area: "business-central",
  news_type: "kundcase",
  industry: "",
  image_url: "",
  news_date: new Date().toISOString().slice(0, 10),
  is_featured: false,
  show_on_home: false,
  show_on_partner_profile: true,
  show_on_product_page: false,
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
      product_area: item.product_area,
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

  const previewFormItem: PartnerNewsItem = useMemo(() => {
    const partner = publishedPartners.find((p) => p.id === form.partner_id);
    return {
      id: form.id ?? "preview",
      partner_id: form.partner_id,
      editorial_title: form.editorial_title || "Redaktionell rubrik",
      summary: form.summary || "Kort sammanfattning kommer att visas här.",
      source_url: form.source_url || "https://example.com",
      source_type: form.source_type,
      product_area: form.product_area,
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
                      {item.is_featured && <Badge className="bg-[hsl(var(--cta-orange))] text-white">Utvald</Badge>}
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
                    <Button variant="outline" size="sm" onClick={() => setPreviewItem(item)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
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
                    <Button variant="outline" size="sm" onClick={() => setStatus(item.id, "archived")}>
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => remove(item.id)} className="text-destructive">
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
            <div>
              <Label>Produktområde</Label>
              <Select value={form.product_area} onValueChange={(v) => setForm({ ...form, product_area: v as PartnerNewsProductArea })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCT_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>{partnerNewsProductLabel(p)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Bransch (valfritt)</Label>
              <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="t.ex. Tillverkning" />
            </div>

            <div className="sm:col-span-2">
              <Label>Bild-URL (valfritt)</Label>
              <Input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              <p className="text-xs text-muted-foreground mt-1">Klistra in en publik bild-URL från partnerns webb, LinkedIn eller pressrum.</p>
            </div>

            <div className="sm:col-span-2 grid grid-cols-2 gap-3 pt-2 border-t">
              <label className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} /> Utvald</label>
              <label className="flex items-center gap-2"><Switch checked={form.show_on_home} onCheckedChange={(v) => setForm({ ...form, show_on_home: v })} /> Visa på startsidan</label>
              <label className="flex items-center gap-2"><Switch checked={form.show_on_partner_profile} onCheckedChange={(v) => setForm({ ...form, show_on_partner_profile: v })} /> Visa på partnerprofil</label>
              <label className="flex items-center gap-2"><Switch checked={form.show_on_product_page} onCheckedChange={(v) => setForm({ ...form, show_on_product_page: v })} /> Visa på produktområdessida</label>
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
    </div>
  );
}
