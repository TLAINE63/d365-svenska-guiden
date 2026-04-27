import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, ExternalLink, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

export interface PartnerStatsSection {
  id: string;
  title: string;
  body: string;
}
export interface PartnerStatsConfig {
  showUniqueVisitors: boolean;
  showPageViews: boolean;
  showTopPages: boolean;
  showRangeTabs: boolean;
  showSalesSummary: boolean;
  sections: PartnerStatsSection[];
}

const DEFAULT_CONFIG: PartnerStatsConfig = {
  showUniqueVisitors: true,
  showPageViews: true,
  showTopPages: true,
  showRangeTabs: true,
  showSalesSummary: true,
  sections: [],
};

const SETTING_KEY = "partner_stats_page_config";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

export default function AdminPartnerStatsTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [config, setConfig] = useState<PartnerStatsConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
            setConfig({ ...DEFAULT_CONFIG, ...parsed, sections: Array.isArray(parsed.sections) ? parsed.sections : [] });
          } catch {
            // keep default
          }
        }
      } catch (e: any) {
        console.error("load config error", e);
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
      toast({ title: "Sparat", description: "Partnerstatistiksidan uppdaterad." });
    } catch (e: any) {
      toast({ title: "Kunde inte spara", description: e?.message || "", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (id: string, patch: Partial<PartnerStatsSection>) => {
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

  if (loading) return <p className="text-sm text-muted-foreground p-6">Laddar…</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Partnerstatistiksidan</CardTitle>
            <CardDescription>
              Styr vad som visas på den dolda sidan{" "}
              <a
                href="/partner-statistik"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline inline-flex items-center gap-1"
              >
                /partner-statistik <ExternalLink className="w-3 h-3" />
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
        {/* Toggles */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Statistikblock</h3>
          {[
            { key: "showUniqueVisitors", label: "Unika besökare (totalsiffra)" },
            { key: "showPageViews", label: "Sidvisningar (totalsiffra)" },
            { key: "showTopPages", label: "Topplista populäraste sidor" },
            { key: "showRangeTabs", label: "Periodväljare 7/30/90 dagar" },
          ].map((row) => (
            <div key={row.key} className="flex items-center justify-between rounded-md border px-3 py-2">
              <Label htmlFor={row.key} className="cursor-pointer">{row.label}</Label>
              <Switch
                id={row.key}
                checked={(config as any)[row.key]}
                onCheckedChange={(v) => setConfig((c) => ({ ...c, [row.key]: !!v }))}
              />
            </div>
          ))}
        </div>

        <Separator />

        {/* Free text sections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Fritextsektioner (visas under statistiken)</h3>
            <Button variant="outline" size="sm" onClick={addSection}>
              <Plus className="w-4 h-4 mr-1" /> Lägg till sektion
            </Button>
          </div>
          {config.sections.length === 0 ? (
            <p className="text-sm text-muted-foreground">Inga sektioner. Lägg till en för att visa egen text under statistiken.</p>
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
