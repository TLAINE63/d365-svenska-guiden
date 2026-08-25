// Innehållskvalitet: visar vilka verifierade partners som har tunt eller
// obesvarat innehåll i Leveransprofil, Support & Förvaltning och AI.
// Många partners har AI-genererade utkast (suggestions) sparade men aldrig
// publicerade – här kan de publiceras eller justeras i bulk, partner för partner.

import { useMemo, useState } from "react";
import { useAdminPartners } from "@/hooks/useAdminPartners";
import type { DatabasePartner, ProductFilterInput } from "@/hooks/usePartners";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Pencil, Sparkles, Loader2, FileText } from "lucide-react";
import {
  DELIVERY_PROFILE_FIELDS,
  DELIVERY_PROFILE_MAX,
  SUPPORT_LEVELS,
  SUPPORT_LEVEL_META,
  type DeliveryProfileFieldKey,
  type DeliveryProfileValue,
  type SupportLevel,
} from "@/data/deliveryProfileFields";

type ProductKey = "bc" | "fsc" | "sales" | "service";

const PRODUCT_LABELS: Record<ProductKey, string> = {
  bc: "Business Central",
  fsc: "Finance & Supply Chain",
  sales: "Sales & Customer Insights",
  service: "Customer Service m.fl.",
};

const PRODUCT_KEYS: ProductKey[] = ["bc", "fsc", "sales", "service"];

const FIELD_KEYS = DELIVERY_PROFILE_FIELDS.map((f) => f.key);

interface Props {
  token: string | null;
  onSessionExpired?: () => void;
}

/** Klipper ett AI-utkast till max-längden vid närmaste meningsslut. */
const trimToLimit = (text: string, max = DELIVERY_PROFILE_MAX): string => {
  const clean = (text || "").trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const lastStop = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf(".\n"));
  if (lastStop > max * 0.5) return slice.slice(0, lastStop + 1).trim();
  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 0 ? lastSpace : max).trim()}…`;
};

const getDelivery = (f?: ProductFilterInput): DeliveryProfileValue =>
  ((f as unknown as { deliveryProfile?: DeliveryProfileValue })?.deliveryProfile || {}) as DeliveryProfileValue;

const filledCount = (v: DeliveryProfileValue) =>
  FIELD_KEYS.filter((k) => (v[k] || "").trim().length > 0).length;

const suggestionCount = (v: DeliveryProfileValue) =>
  FIELD_KEYS.filter((k) => (v.suggestions?.[k] || "").trim().length > 0).length;

interface ProductState {
  key: ProductKey;
  value: DeliveryProfileValue;
  filled: number;
  suggestions: number;
}

interface Row {
  partner: DatabasePartner;
  products: ProductState[];
  /** Antal produkter där opublicerade AI-utkast finns. */
  publishable: number;
  gaps: string[];
}

const buildRow = (p: DatabasePartner): Row => {
  const pf = (p.product_filters || {}) as Record<string, ProductFilterInput>;
  const products: ProductState[] = [];
  for (const k of PRODUCT_KEYS) {
    if (!pf[k]) continue;
    const value = getDelivery(pf[k]);
    products.push({ key: k, value, filled: filledCount(value), suggestions: suggestionCount(value) });
  }

  const gaps: string[] = [];
  for (const pr of products) {
    const l = PRODUCT_LABELS[pr.key];
    if (pr.filled === 0) gaps.push(`${l}: leveransprofil saknas`);
    else if (pr.filled < FIELD_KEYS.length) gaps.push(`${l}: ${pr.filled}/${FIELD_KEYS.length} fält ifyllda`);
    if (!pr.value.supportLevel) gaps.push(`${l}: supportnivå ej satt`);
  }
  if (!(p.positioning_statement || "").trim()) gaps.push("Positionering saknas");
  if (!(p.ai_summary_full || "").trim()) gaps.push("AI-sammanfattning saknas");

  return {
    partner: p,
    products,
    publishable: products.filter((pr) => pr.suggestions > 0 && pr.filled < FIELD_KEYS.length).length,
    gaps,
  };
};

type Draft = Record<string, DeliveryProfileValue>;

/** Fyller tomma fält med det sparade AI-utkastet (befintlig text rörs aldrig). */
const applySuggestions = (v: DeliveryProfileValue): DeliveryProfileValue => {
  const next: DeliveryProfileValue = { ...v };
  for (const k of FIELD_KEYS) {
    const current = (next[k] || "").trim();
    const suggested = (v.suggestions?.[k] || "").trim();
    if (!current && suggested) next[k] = trimToLimit(suggested);
  }
  return next;
};

/**
 * Härleder supportnivå ur partnerns egna texter.
 * Både förvaltning och vidareutveckling beskrivna → livscykelpartner.
 * Endast förvaltning → förvaltningserbjudande.
 * Endast leveranstext (ingen förvaltning) → projektfokus.
 * Returnerar null när underlag saknas.
 */
const inferSupportLevel = (v: DeliveryProfileValue): SupportLevel | null => {
  const managed = (v.managedServices || "").trim().length >= 40;
  const further = (v.furtherDevelopment || "").trim().length >= 40;
  if (managed && further) return "lifecycle_partner";
  if (managed || further) return "managed_offering";
  const hasDelivery = (["typicalCustomers", "typicalProjects", "deliveryModel"] as const).some(
    (k) => (v[k] || "").trim().length >= 40,
  );
  return hasDelivery ? "project_focus" : null;
};



export default function AdminContentGapsTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: partners = [], isLoading } = useAdminPartners(token);
  const [editing, setEditing] = useState<{ partner: DatabasePartner; draft: Draft } | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [onlyGaps, setOnlyGaps] = useState(true);
  const [bulkRunning, setBulkRunning] = useState(false);


  const rows = useMemo(
    () =>
      partners
        .filter((p) => p.is_featured)
        .map(buildRow)
        .filter((r) => (onlyGaps ? r.gaps.length > 0 : true))
        .sort(
          (a, b) =>
            b.publishable - a.publishable ||
            b.gaps.length - a.gaps.length ||
            a.partner.name.localeCompare(b.partner.name, "sv"),
        ),
    [partners, onlyGaps],
  );

  const save = async (partner: DatabasePartner, draft: Draft) => {
    setSavingId(partner.id);
    try {
      const product_filters: Record<string, ProductFilterInput> = {
        ...((partner.product_filters || {}) as Record<string, ProductFilterInput>),
      };
      for (const [k, value] of Object.entries(draft)) {
        if (!product_filters[k]) continue;
        product_filters[k] = { ...product_filters[k], deliveryProfile: value } as ProductFilterInput;
      }

      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "update", token, id: partner.id, partner: { product_filters } },
      });
      if (error) throw error;
      if (data?.error) {
        if (String(data.error).toLowerCase().includes("token")) onSessionExpired?.();
        throw new Error(data.error);
      }
      toast({ title: "Sparat", description: `${partner.name} är uppdaterad.` });
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    } catch (err) {
      toast({
        title: "Kunde inte spara",
        description: err instanceof Error ? err.message : "Okänt fel",
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const publishSuggestions = (row: Row) => {
    const draft: Draft = {};
    for (const pr of row.products) draft[pr.key] = applySuggestions(pr.value);
    save(row.partner, draft);
  };

  /** Partners där minst ett produktområde har text men saknar supportnivå. */
  const levelCandidates = useMemo(
    () =>
      partners
        .filter((p) => p.is_featured)
        .map(buildRow)
        .map((row) => {
          const draft: Draft = {};
          for (const pr of row.products) {
            if (pr.value.supportLevel) continue;
            const lvl = inferSupportLevel(pr.value);
            if (lvl) draft[pr.key] = { ...pr.value, supportLevel: lvl };
          }
          return { partner: row.partner, draft };
        })
        .filter((c) => Object.keys(c.draft).length > 0),
    [partners],
  );

  const autoFillLevels = async () => {
    setBulkRunning(true);
    let ok = 0;
    let failed = 0;
    try {
      for (const c of levelCandidates) {
        const product_filters: Record<string, ProductFilterInput> = {
          ...((c.partner.product_filters || {}) as Record<string, ProductFilterInput>),
        };
        for (const [k, value] of Object.entries(c.draft)) {
          if (!product_filters[k]) continue;
          product_filters[k] = { ...product_filters[k], deliveryProfile: value } as ProductFilterInput;
        }
        const { data, error } = await supabase.functions.invoke("manage-partners", {
          body: { action: "update", token, id: c.partner.id, partner: { product_filters } },
        });
        if (error || data?.error) {
          failed++;
          if (String(data?.error || "").toLowerCase().includes("token")) onSessionExpired?.();
        } else {
          ok++;
        }
      }
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast({
        title: "Supportnivåer satta",
        description: `${ok} partners uppdaterade${failed ? `, ${failed} misslyckades` : ""}.`,
        variant: failed && !ok ? "destructive" : "default",
      });
    } finally {
      setBulkRunning(false);
    }
  };



  const openEditor = (row: Row) => {
    const draft: Draft = {};
    for (const pr of row.products) draft[pr.key] = { ...pr.value };
    setEditing({ partner: row.partner, draft });
  };

  const updateField = (product: string, key: DeliveryProfileFieldKey | "supportLevel", value: string) => {
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            draft: {
              ...prev.draft,
              [product]: {
                ...prev.draft[product],
                [key]: key === "supportLevel" ? ((value || null) as SupportLevel | null) : value,
              },
            },
          }
        : prev,
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Innehållskvalitet – leveransprofil, support &amp; AI
            </CardTitle>
            <CardDescription>
              Visar vilka verifierade partners som har tunt innehåll i Leveransprofil, Support &amp;
              Förvaltning och AI. Där ett AI-utkast redan finns sparat kan du publicera det direkt –
              endast tomma fält fylls, befintlig text från partnern rörs aldrig.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={bulkRunning || levelCandidates.length === 0}
              onClick={autoFillLevels}
            >
              {bulkRunning ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-1 h-4 w-4" />
              )}
              Sätt supportnivå automatiskt ({levelCandidates.length})
            </Button>
            <Button variant="outline" size="sm" onClick={() => setOnlyGaps((v) => !v)}>
              {onlyGaps ? "Visa alla partners" : "Visa bara med brister"}
            </Button>
          </div>

        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Laddar partners…</p>}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Allt innehåll är ifyllt.</p>
        )}
        {rows.map((row) => (
          <div
            key={row.partner.id}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row md:items-start md:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{row.partner.name}</span>
                {row.gaps.length === 0 ? (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Komplett
                  </Badge>
                ) : (
                  <Badge variant="outline">{row.gaps.length} brister</Badge>
                )}
                {row.publishable > 0 && (
                  <Badge className="gap-1">
                    <Sparkles className="h-3 w-3" /> AI-utkast klart för {row.publishable} produkt
                    {row.publishable > 1 ? "er" : ""}
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {row.gaps.map((g) => (
                  <Badge key={g} variant="secondary" className="font-normal">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                disabled={savingId === row.partner.id || row.publishable === 0}
                onClick={() => publishSuggestions(row)}
              >
                {savingId === row.partner.id ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1 h-4 w-4" />
                )}
                Publicera AI-utkast
              </Button>
              <Button size="sm" variant="outline" onClick={() => openEditor(row)}>
                <Pencil className="mr-1 h-4 w-4" />
                Granska
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Innehåll – {editing?.partner.name}</DialogTitle>
            <DialogDescription>
              Texterna publiceras på partnerprofilen. Supportnivån är d365.se:s bedömning och sätts
              alltid här i admin.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="space-y-6">
              {Object.keys(editing.draft).map((k) => {
                const value = editing.draft[k];
                return (
                  <div key={k} className="space-y-3 rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{PRODUCT_LABELS[k as ProductKey] || k}</p>
                      {suggestionCount(value) > 0 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setEditing((prev) =>
                              prev
                                ? { ...prev, draft: { ...prev.draft, [k]: applySuggestions(prev.draft[k]) } }
                                : prev,
                            )
                          }
                        >
                          <Sparkles className="mr-1 h-3.5 w-3.5" /> Fyll tomma fält från AI-utkast
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Supportnivå (d365.se:s bedömning)
                      </Label>
                      <div className="flex flex-wrap gap-1.5">
                        {SUPPORT_LEVELS.map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() =>
                              updateField(k, "supportLevel", value.supportLevel === lvl ? "" : lvl)
                            }
                            className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                              value.supportLevel === lvl
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground hover:border-primary/60"
                            }`}
                          >
                            {SUPPORT_LEVEL_META[lvl].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {DELIVERY_PROFILE_FIELDS.map((field) => {
                      const text = value[field.key] || "";
                      const suggestion = (value.suggestions?.[field.key] || "").trim();
                      return (
                        <div key={field.key} className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            {field.label} ({text.length}/{DELIVERY_PROFILE_MAX})
                          </Label>
                          <Textarea
                            rows={4}
                            value={text}
                            placeholder={field.help}
                            onChange={(e) => updateField(k, field.key, e.target.value)}
                          />
                          {!text.trim() && suggestion && (
                            <p className="text-[11px] italic text-muted-foreground">
                              AI-utkast finns: {trimToLimit(suggestion, 160)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Avbryt
            </Button>
            <Button
              disabled={!editing || savingId === editing?.partner.id}
              onClick={() => editing && save(editing.partner, editing.draft)}
            >
              {savingId === editing?.partner.id && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Spara
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
