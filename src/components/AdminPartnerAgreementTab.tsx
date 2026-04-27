import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ExternalLink, GripVertical, ArrowUp, ArrowDown, Upload, FileText, Loader2 } from "lucide-react";

export interface AgreementSection {
  id: string;
  title: string;
  body: string;
}
export interface PartnerAgreementConfig {
  heading: string;
  intro: string;
  pdfUrl: string;
  pdfLabel: string;
  sections: AgreementSection[];
}

const DEFAULT_CONFIG: PartnerAgreementConfig = {
  heading: "Partneravtal – d365.se",
  intro:
    "Sammanfattning av villkor för partnersamarbete med d365.se. Fullständigt avtal kan laddas ner som PDF nedan.",
  pdfUrl: "",
  pdfLabel: "Gällande partneravtal (PDF)",
  sections: [
    {
      id: crypto.randomUUID(),
      title: "Avgift och produktområden",
      body:
        "Månadsavgiften är 1 990 kr per produktområde (Sales och Customer Service buntas som en CRM-enhet).\n\nFaktureras månadsvis i förskott. Priserna anges exklusive moms.",
    },
    {
      id: crypto.randomUUID(),
      title: "Avtalstid och uppsägning",
      body:
        "Avtalet löper tills vidare med en månads ömsesidig uppsägningstid.\n\nUppsägning sker skriftligen via e-post till oss på d365.se.",
    },
  ],
};

const SETTING_KEY = "partner_agreement_page_config";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

export default function AdminPartnerAgreementTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [config, setConfig] = useState<PartnerAgreementConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-email-template&template_key=${SETTING_KEY}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        });
        if (res.status === 401) {
          onSessionExpired();
          return;
        }
        const data = await res.json();
        if (data?.template) {
          try {
            const parsed = JSON.parse(data.template);
            setConfig({
              ...DEFAULT_CONFIG,
              ...parsed,
              sections: Array.isArray(parsed.sections) ? parsed.sections : DEFAULT_CONFIG.sections,
            });
          } catch {
            /* keep default */
          }
        }
      } catch (e: any) {
        console.error("load agreement config error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, onSessionExpired]);

  const save = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ template: JSON.stringify(config), template_key: SETTING_KEY }),
      });
      if (res.status === 401) {
        onSessionExpired();
        return;
      }
      if (!res.ok) throw new Error("Kunde inte spara");
      toast({ title: "Sparat", description: "Partneravtalssidan uppdaterad." });
    } catch (e: any) {
      toast({ title: "Kunde inte spara", description: e?.message || "", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (id: string, patch: Partial<AgreementSection>) => {
    setConfig((c) => ({
      ...c,
      sections: c.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };
  const addSection = () => {
    setConfig((c) => ({
      ...c,
      sections: [...c.sections, { id: crypto.randomUUID(), title: "Ny sektion", body: "" }],
    }));
  };
  const removeSection = (id: string) => {
    setConfig((c) => ({ ...c, sections: c.sections.filter((s) => s.id !== id) }));
  };
  const moveSection = (id: string, dir: -1 | 1) => {
    setConfig((c) => {
      const idx = c.sections.findIndex((s) => s.id === id);
      if (idx < 0) return c;
      const target = idx + dir;
      if (target < 0 || target >= c.sections.length) return c;
      const next = [...c.sections];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...c, sections: next };
    });
  };

  const handleUpload = async (file: File) => {
    if (!token) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Endast PDF tillåten", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "Filen får max vara 20MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("token", token);
      fd.append("filename", file.name);
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-partner-document`,
        { method: "POST", body: fd },
      );
      if (res.status === 401) {
        onSessionExpired();
        return;
      }
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Uppladdning misslyckades");
      setConfig((c) => ({ ...c, pdfUrl: data.url }));
      toast({
        title: "Uppladdad",
        description: "URL:en är ifylld. Glöm inte att klicka Spara.",
      });
    } catch (e: any) {
      toast({ title: "Kunde inte ladda upp", description: e?.message || "", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground p-6">Laddar…</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Partneravtalssidan</CardTitle>
            <CardDescription>
              Styr innehållet på den dolda sidan{" "}
              <a
                href="/partner-avtal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline inline-flex items-center gap-1"
              >
                /partner-avtal <ExternalLink className="w-3 h-3" />
              </a>
              . Sidan är inte länkad från menyn och har noindex.
            </CardDescription>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? "Sparar…" : "Spara"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Heading + intro */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="agr-heading">Sidrubrik</Label>
            <Input
              id="agr-heading"
              value={config.heading}
              onChange={(e) => setConfig((c) => ({ ...c, heading: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="agr-intro">Introduktionstext</Label>
            <Textarea
              id="agr-intro"
              value={config.intro}
              rows={3}
              onChange={(e) => setConfig((c) => ({ ...c, intro: e.target.value }))}
            />
          </div>
        </div>

        <Separator />

        {/* PDF link */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Avtals-PDF (valfri)</h3>
          <div>
            <Label htmlFor="agr-pdf-url">PDF-länk (URL)</Label>
            <Input
              id="agr-pdf-url"
              placeholder="https://…/avtal.pdf  – lämna tom för att dölja PDF-knappen"
              value={config.pdfUrl}
              onChange={(e) => setConfig((c) => ({ ...c, pdfUrl: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ladda upp PDF:en i lagring (partner-documents) och klistra in den publika URL:en här.
            </p>
          </div>
          <div>
            <Label htmlFor="agr-pdf-label">Knapp-/etikettext</Label>
            <Input
              id="agr-pdf-label"
              value={config.pdfLabel}
              onChange={(e) => setConfig((c) => ({ ...c, pdfLabel: e.target.value }))}
            />
          </div>
        </div>

        <Separator />

        {/* Sections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Avsnitt (visas som kort på avtalssidan)</h3>
            <Button variant="outline" size="sm" onClick={addSection}>
              <Plus className="w-4 h-4 mr-1" /> Lägg till avsnitt
            </Button>
          </div>
          {config.sections.length === 0 ? (
            <p className="text-sm text-muted-foreground">Inga avsnitt – lägg till för att visa innehåll.</p>
          ) : (
            config.sections.map((s, idx) => (
              <Card key={s.id} className="border-muted">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Input
                      value={s.title}
                      placeholder="Rubrik"
                      onChange={(e) => updateSection(s.id, { title: e.target.value })}
                      className="font-medium"
                    />
                    <Button variant="ghost" size="icon" onClick={() => moveSection(s.id, -1)} disabled={idx === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSection(s.id, 1)}
                      disabled={idx === config.sections.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeSection(s.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <Textarea
                    value={s.body}
                    placeholder="Brytext (radbrytningar bevaras)"
                    onChange={(e) => updateSection(s.id, { body: e.target.value })}
                    rows={5}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara"}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
