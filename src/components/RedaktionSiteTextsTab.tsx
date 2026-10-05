import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_TEXT_DEFAULTS } from "@/data/siteTextDefaults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Row = { key: string; value: string; updated_at: string };

export default function RedaktionSiteTextsTab({ token, onSessionExpired }: { token: string; onSessionExpired?: () => void }) {
  const [saved, setSaved] = useState<Record<string, Row>>({});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("site-texts", { body: { token, ...body } });
    if (error) {
      if ((error as any)?.context?.status === 401) onSessionExpired?.();
      throw error;
    }
    return data;
  };

  const load = async () => {
    const d = await call({ action: "list" });
    const map: Record<string, Row> = {};
    (d?.texts ?? []).forEach((r: Row) => (map[r.key] = r));
    setSaved(map);
    setDraft(Object.fromEntries(SITE_TEXT_DEFAULTS.map((t) => [t.key, map[t.key]?.value ?? t.value])));
  };
  useEffect(() => { load().catch(() => toast.error("Kunde inte hämta textbanken")); }, []);

  const groups = useMemo(() => {
    const g: Record<string, typeof SITE_TEXT_DEFAULTS> = {};
    SITE_TEXT_DEFAULTS.forEach((t) => (g[t.group] ||= []).push(t));
    return g;
  }, []);

  const save = async (key: string, value: string) => {
    setBusy(key);
    try {
      await call({ action: "save", key, value });
      toast.success("Sparat. Syns på sajten efter nästa publicering.");
      await load();
    } catch { toast.error("Kunde inte spara"); } finally { setBusy(null); }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Texterna här används på alla sidor där de förekommer (startsida, /om-oss/, /agande-och-intressen/, /qa/, sökdata och kontaktuppgifter).
        Ändringar syns i förhandsvisningen efter nästa bygge och på d365.se vid nästa publicering. Tom rad mellan stycken, **fet** för fetstil.
      </p>
      {Object.entries(groups).map(([group, items]) => (
        <Card key={group}>
          <CardHeader><CardTitle className="text-lg">{group}</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {items.map((t) => {
              const value = draft[t.key] ?? "";
              const current = saved[t.key]?.value ?? t.value;
              const dirty = value !== current;
              return (
                <div key={t.key} className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <label className="text-sm font-medium text-foreground">{t.label}</label>
                    <span className="text-xs text-muted-foreground">
                      {saved[t.key] ? `Ändrad ${saved[t.key].updated_at.slice(0, 10)}` : "Standardtext"}
                    </span>
                  </div>
                  {t.multiline ? (
                    <Textarea rows={Math.min(10, Math.max(3, Math.ceil(value.length / 90)))} value={value} onChange={(e) => setDraft({ ...draft, [t.key]: e.target.value })} />
                  ) : (
                    <Input value={value} onChange={(e) => setDraft({ ...draft, [t.key]: e.target.value })} />
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" disabled={!dirty || busy === t.key} onClick={() => save(t.key, value)}>Spara</Button>
                    {dirty && <Button size="sm" variant="ghost" onClick={() => setDraft({ ...draft, [t.key]: current })}>Ångra</Button>}
                    {saved[t.key] && <Button size="sm" variant="ghost" disabled={busy === t.key} onClick={() => save(t.key, "")}>Återställ standardtext</Button>}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
