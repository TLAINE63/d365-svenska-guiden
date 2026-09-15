import { useCallback, useEffect, useState } from "react";
import { Newspaper, Loader2, Plus, Trash2, Link2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PremiumCollapsibleSection } from "@/components/admin/PremiumCollapsibleSection";
import { formatDateYYYYMMDD } from "@/lib/utils";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-partner-news`;

const PRODUCT_AREAS: { value: string; label: string }[] = [
  { value: "business-central", label: "Business Central" },
  { value: "finance-scm", label: "Finance & Supply Chain" },
  { value: "crm-sales", label: "Sales & Customer Insights" },
  { value: "crm-service", label: "Customer Service & Field Service" },
  { value: "microsoft-ai", label: "Copilot & AI" },
  { value: "ovrigt", label: "Övrigt" },
];

const NEWS_TYPES: { value: string; label: string }[] = [
  { value: "kundcase", label: "Kundcase" },
  { value: "produktnyhet", label: "Produktnyhet" },
  { value: "branschlosning", label: "Branschlösning" },
  { value: "artikel", label: "Artikel" },
  { value: "webinar", label: "Webinar" },
  { value: "event", label: "Event" },
  { value: "erbjudande", label: "Erbjudande" },
  { value: "rapport", label: "Rapport" },
  { value: "partnernyhet", label: "Partnernyhet" },
  { value: "analys", label: "Analys" },
];

interface NewsItem {
  id?: string;
  editorial_title: string;
  summary: string;
  source_url: string;
  news_type: string;
  product_areas: string[];
  industry?: string | null;
  image_url?: string | null;
  news_date: string;
  event_date?: string | null;
  status?: string;
}

const emptyNews = (): NewsItem => ({
  editorial_title: "",
  summary: "",
  source_url: "",
  news_type: "kundcase",
  product_areas: [],
  industry: "",
  image_url: "",
  news_date: formatDateYYYYMMDD(new Date()),
  event_date: "",
});

const statusLabel = (status?: string) => {
  switch (status) {
    case "published":
      return { label: "Publicerad", variant: "default" as const };
    case "approved":
      return { label: "Godkänd", variant: "default" as const };
    case "unpublished":
    case "archived":
      return { label: "Arkiverad", variant: "secondary" as const };
    default:
      return { label: "Väntar på granskning", variant: "secondary" as const };
  }
};

interface Props {
  token: string;
  partnerId?: string | null;
}

export function PartnerNewsSubmissionSection({ token, partnerId }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<NewsItem>(emptyNews());

  const call = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, inviteToken: token, ...payload }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Något gick fel");
      return result;
    },
    [token],
  );

  const fetchNews = useCallback(async () => {
    if (!token || !partnerId) return;
    setLoading(true);
    try {
      const result = await call("invitation-list-news");
      setItems(result.news || []);
    } catch (err) {
      console.error("Error fetching partner news:", err);
    } finally {
      setLoading(false);
    }
  }, [call, token, partnerId]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const toggleArea = (value: string) => {
    setDraft((prev) => ({
      ...prev,
      product_areas: prev.product_areas.includes(value)
        ? prev.product_areas.filter((a) => a !== value)
        : [...prev.product_areas, value],
    }));
  };

  const handleImage = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Bilden är för stor (max 5 MB)");
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await call("invitation-upload-image", {
        file_base64: base64,
        content_type: file.type,
      });
      setDraft((prev) => ({ ...prev, image_url: result.image_url }));
      toast.success("Bild uppladdad");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunde inte ladda upp bilden");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!draft.editorial_title.trim() || draft.summary.trim().length < 10 || !draft.source_url.trim()) {
      toast.error("Rubrik, sammanfattning och länk krävs");
      return;
    }
    if (draft.product_areas.length === 0) {
      toast.error("Välj minst ett produktområde");
      return;
    }
    setSaving(true);
    try {
      await call("invitation-save-news", {
        news: {
          ...(draft.id ? { id: draft.id } : {}),
          editorial_title: draft.editorial_title.trim(),
          summary: draft.summary.trim(),
          source_url: draft.source_url.trim(),
          source_type: "partner_web",
          product_areas: draft.product_areas,
          news_type: draft.news_type,
          industry: draft.industry?.trim() || null,
          image_url: draft.image_url || null,
          news_date: draft.news_date,
          event_date: draft.event_date || null,
        },
      });
      toast.success("Tack! Inlägget granskas av redaktionen innan det publiceras.");
      setDraft(emptyNews());
      setShowForm(false);
      fetchNews();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunde inte spara inlägget");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Vill du ta bort detta inlägg?")) return;
    try {
      await call("invitation-delete-news", { id });
      toast.success("Inlägget borttaget");
      fetchNews();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunde inte ta bort inlägget");
    }
  };

  if (!partnerId) return null;

  return (
    <PremiumCollapsibleSection
      title="Nyhet till Partnernytt"
      description="Kundcase, produktnyheter eller artiklar. Redaktionen granskar innan publicering."
      icon={Newspaper}
      accent="crm"
      status={items.length === 0 ? "empty" : "complete"}
      open={open}
      onOpenChange={setOpen}
      badge={items.length > 0 ? <Badge variant="outline">{items.length} inlägg</Badge> : undefined}
    >
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Laddar inlägg...</span>
          </div>
        ) : (
          <>
            {items.length > 0 && (
              <div className="space-y-3">
                {items.map((item) => {
                  const s = statusLabel(item.status);
                  const editable = item.status !== "published";
                  return (
                    <div key={item.id} className="p-4 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-semibold text-foreground truncate">{item.editorial_title}</h4>
                            <Badge variant={s.variant} className="text-xs shrink-0">{s.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                            <span>{formatDateYYYYMMDD(item.news_date)}</span>
                            {item.source_url && (
                              <a
                                href={item.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-foreground"
                              >
                                <Link2 className="w-3.5 h-3.5" />Källa
                              </a>
                            )}
                          </div>
                        </div>
                        {editable && (
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Ta bort inlägg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {showForm ? (
              <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5 space-y-4">
                <h4 className="font-semibold text-foreground">Nytt inlägg</h4>

                <div className="space-y-2">
                  <Label className="text-sm">Rubrik *</Label>
                  <Input
                    placeholder="T.ex. 'Så halverade vi ledtiderna hos NN Industri'"
                    value={draft.editorial_title}
                    onChange={(e) => setDraft((p) => ({ ...p, editorial_title: e.target.value }))}
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Sammanfattning *</Label>
                  <Textarea
                    rows={4}
                    placeholder="Kort sammanfattning, 2 till 4 meningar."
                    value={draft.summary}
                    onChange={(e) => setDraft((p) => ({ ...p, summary: e.target.value }))}
                    maxLength={600}
                  />
                  <p className="text-xs text-muted-foreground">{draft.summary.length}/600 tecken</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Länk till källa *</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={draft.source_url}
                    onChange={(e) => setDraft((p) => ({ ...p, source_url: e.target.value }))}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Datum *</Label>
                    <Input
                      type="date"
                      value={draft.news_date}
                      onChange={(e) => setDraft((p) => ({ ...p, news_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Typ av inlägg *</Label>
                    <Select value={draft.news_type} onValueChange={(v) => setDraft((p) => ({ ...p, news_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {NEWS_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Bransch (valfritt)</Label>
                    <Input
                      placeholder="T.ex. Tillverkning"
                      value={draft.industry || ""}
                      onChange={(e) => setDraft((p) => ({ ...p, industry: e.target.value }))}
                    />
                  </div>
                </div>

                {(draft.news_type === "event" || draft.news_type === "webinar") && (
                  <div className="space-y-2 max-w-xs">
                    <Label className="text-sm">Datum för event (valfritt)</Label>
                    <Input
                      type="date"
                      value={draft.event_date || ""}
                      onChange={(e) => setDraft((p) => ({ ...p, event_date: e.target.value }))}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm">Produktområde *</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_AREAS.map((area) => {
                      const active = draft.product_areas.includes(area.value);
                      return (
                        <button
                          key={area.value}
                          type="button"
                          onClick={() => toggleArea(area.value)}
                          className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:bg-muted"
                          }`}
                        >
                          {area.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Bild (valfritt)</Label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleImage(e.target.files?.[0])}
                      className="max-w-xs"
                    />
                    {uploading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                    {draft.image_url && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ImageIcon className="w-3.5 h-3.5" />Bild vald
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Inlägget skickas för granskning. Redaktionen på d365.se godkänner innan det visas i Partnernytt.
                </p>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setDraft(emptyNews()); }}>
                    Avbryt
                  </Button>
                  <Button type="button" disabled={saving} onClick={handleSave}>
                    {saving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Skickar...</>
                    ) : (
                      "Skicka för granskning"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <Button type="button" variant="outline" onClick={() => setShowForm(true)} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Lägg till nyhet
              </Button>
            )}

            {items.length === 0 && !showForm && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Inga inlägg ännu. Dela ett kundcase, en produktnyhet eller en artikel så kan den synas i Partnernytt på d365.se.
              </p>
            )}
          </>
        )}
      </div>
    </PremiumCollapsibleSection>
  );
}
