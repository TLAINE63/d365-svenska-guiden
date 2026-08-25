import { useMemo, useState } from "react";
import { useAdminPartners } from "@/hooks/useAdminPartners";
import type { DatabasePartner, ProductFilterInput } from "@/hooks/usePartners";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Pencil, ShieldCheck, Loader2 } from "lucide-react";
import { geographyOptions, companySizes, revenueOptions } from "@/data/partners";
import { toggleContiguousRange } from "@/lib/segmentRange";

type ProductKey = "bc" | "fsc" | "sales" | "service";

const PRODUCT_LABELS: Record<ProductKey, string> = {
  bc: "Business Central",
  fsc: "Finance & Supply Chain",
  sales: "Sales & Customer Insights",
  service: "Customer Service m.fl.",
};

const PRODUCT_KEYS: ProductKey[] = ["bc", "fsc", "sales", "service"];

interface Props {
  token: string | null;
  onSessionExpired?: () => void;
}

interface Gap {
  label: string;
  severity: "hög" | "medel";
  /** Branschrelaterade brister är partnerns ansvar – inte fixbara av admin. */
  partnerOwned?: boolean;
}

/**
 * Segmentval (antal anställda / omsättning) måste ligga i rad – max 3 steg.
 * Klipper ett urval till det första sammanhängande spannet om max 3 val.
 */
const contiguousRun = (options: string[], values: string[]): string[] => {
  const idx = values
    .map((v) => options.indexOf(v))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  if (idx.length === 0) return [];
  const run: number[] = [idx[0]];
  for (const i of idx.slice(1)) {
    if (i === run[run.length - 1] + 1 && run.length < 3) run.push(i);
    else break;
  }
  return run.map((i) => options[i]);
};

/** Föreslagna omsättningsintervall härleds från vald kundstorlek (samma index-skala). */
const suggestRevenue = (sizes: string[]): string[] => {
  const idx = sizes.map((s) => companySizes.indexOf(s)).filter((i) => i >= 0).sort((a, b) => a - b);
  if (idx.length === 0) return ["25-99 MSEK", "100-499 MSEK", "500-999 MSEK"];
  const start = idx[0];
  const count = Math.min(3, idx.length);
  return Array.from({ length: count }, (_, n) => revenueOptions[start + n]).filter(Boolean);
};


const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

interface Draft {
  industries: string[];
  geography: string[];
  products: Partial<Record<ProductKey, { industries: string[]; geography: string[]; companySize: string[]; revenue: string[] }>>;
}

/** Bygger ett förslag (draft) för en partner utifrån befintlig data.
 *  Branscher föreslås/aldrig ändras av admin – det är partnerns beslut. */
const buildSuggestion = (p: DatabasePartner): Draft => {
  const pf = p.product_filters || {};
  const productGeos = uniq(PRODUCT_KEYS.flatMap((k) => pf[k]?.geography || []));

  const products: Draft["products"] = {};
  for (const k of PRODUCT_KEYS) {
    const f = pf[k];
    if (!f) continue;
    const rawSize =
      (f.companySize || []).length > 0 ? (f.companySize as string[]) : ["50-99", "100-249", "250-999"];
    const size = contiguousRun(companySizes, rawSize);
    const rawRevenue =
      (f.revenue || []).length > 0 ? (f.revenue as string[]) : suggestRevenue(size);
    products[k] = {
      industries: f.industries || [],
      geography: (f.geography || []).length > 0 ? f.geography : ["Sverige"],
      companySize: size,
      revenue: contiguousRun(revenueOptions, rawRevenue),
    };
  }

  return {
    industries: p.industries || [],
    geography: (p.geography || []).length > 0 ? p.geography : (productGeos.length > 0 ? productGeos : ["Sverige"]),
    products,
  };
};

/** Lista de faktiska bristerna för en partner. Bransch-brister markeras partnerOwned. */
const findGaps = (p: DatabasePartner): Gap[] => {
  const gaps: Gap[] = [];
  const pf = p.product_filters || {};
  if ((p.industries || []).length === 0) gaps.push({ label: "Tomt branschfält på toppnivå", severity: "medel", partnerOwned: true });
  if ((p.geography || []).length === 0) gaps.push({ label: "Tom geografi på toppnivå", severity: "medel" });
  for (const k of PRODUCT_KEYS) {
    const f = pf[k];
    if (!f) continue;
    const l = PRODUCT_LABELS[k];
    if ((f.geography || []).length === 0) gaps.push({ label: `${l}: tom geografi`, severity: "hög" });
    if ((f.revenue || []).length === 0) gaps.push({ label: `${l}: saknar omsättning`, severity: "hög" });
    if ((f.companySize || []).length === 0) gaps.push({ label: `${l}: saknar kundstorlek`, severity: "hög" });
    if ((f.industries || []).length < 3) gaps.push({ label: `${l}: ${(f.industries || []).length} av 3 branscher`, severity: "medel", partnerOwned: true });
  }
  return gaps;
};

/** Klickbara chips för multiselect. */
const ChipGroup = ({
  options,
  selected,
  onToggle,
  max,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  max?: number;
}) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map((opt) => {
      const isSelected = selected.includes(opt);
      const blocked = !isSelected && !!max && selected.length >= max;
      return (
        <button
          key={opt}
          type="button"
          disabled={blocked}
          onClick={() => onToggle(opt)}
          className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : blocked
                ? "border-border bg-muted text-muted-foreground opacity-50"
                : "border-border bg-background text-foreground hover:border-primary/60"
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

export default function AdminDataGapsTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: partners = [], isLoading } = useAdminPartners(token);
  const [editing, setEditing] = useState<{ partner: DatabasePartner; draft: Draft } | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [onlyGaps, setOnlyGaps] = useState(true);

  const rows = useMemo(() => {
    return partners
      .filter((p) => p.is_featured)
      .map((p) => ({ partner: p, gaps: findGaps(p) }))
      .filter((r) => (onlyGaps ? r.gaps.length > 0 : true))
      .sort((a, b) => b.gaps.length - a.gaps.length || a.partner.name.localeCompare(b.partner.name, "sv"));
  }, [partners, onlyGaps]);

  const save = async (partner: DatabasePartner, draft: Draft) => {
    setSavingId(partner.id);
    try {
      const product_filters: Record<string, ProductFilterInput> = {
        ...(partner.product_filters as Record<string, ProductFilterInput>),
      };
      for (const k of PRODUCT_KEYS) {
        const d = draft.products[k];
        if (!d || !product_filters[k]) continue;
        // Branscher (industries) skrivs aldrig av admin – partnerns beslut.
        product_filters[k] = {
          ...product_filters[k],
          geography: d.geography,
          companySize: d.companySize,
          revenue: d.revenue,
        };
      }

      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: {
          action: "update",
          token,
          id: partner.id,
          partner: {
            geography: draft.geography,
            product_filters,
          },
        },
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

  const updateDraft = (fn: (d: Draft) => Draft) => {
    setEditing((prev) => (prev ? { ...prev, draft: fn(prev.draft) } : prev));
  };

  const toggleIn = (list: string[], value: string, max?: number) =>
    list.includes(value)
      ? list.filter((v) => v !== value)
      : max && list.length >= max
        ? list
        : [...list, value];

  /** Segmentval måste ligga i rad – visar felmeddelande vid ogiltigt val. */
  const toggleRange = (options: string[], current: string[], value: string): string[] | null => {
    const res = toggleContiguousRange(options, current, value);
    if ("error" in res) {
      toast({ title: "Ogiltigt val", description: res.error, variant: "destructive" });
      return null;
    }
    return res.next;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Datakvalitet – partner för partner
            </CardTitle>
            <CardDescription>
              Går igenom verifierade partners och visar vad som saknas för att de ska kunna
              filtreras fram på bransch, produkt, geografi och storlek. Godkänn förslaget rakt av
              eller justera fält för fält.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOnlyGaps((v) => !v)}>
            {onlyGaps ? "Visa alla partners" : "Visa bara med brister"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Laddar partners…</p>}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Inga brister hittades. </p>
        )}
        {rows.map(({ partner, gaps }) => {
          const suggestion = buildSuggestion(partner);
          const fixableGaps = gaps.filter((g) => !g.partnerOwned);
          const partnerGaps = gaps.filter((g) => g.partnerOwned);
          return (
            <div
              key={partner.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row md:items-start md:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{partner.name}</span>
                  {fixableGaps.length === 0 ? (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Komplett
                    </Badge>
                  ) : (
                    <Badge variant="outline">{fixableGaps.length} brister</Badge>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {fixableGaps.map((g) => (
                    <Badge
                      key={g.label}
                      variant={g.severity === "hög" ? "destructive" : "secondary"}
                      className="font-normal"
                    >
                      {g.label}
                    </Badge>
                  ))}
                  {partnerGaps.map((g) => (
                    <Badge
                      key={g.label}
                      variant="outline"
                      className="border-muted bg-muted/40 font-normal text-muted-foreground"
                    >
                      {g.label} · Partnerns ansvar
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  disabled={savingId === partner.id || fixableGaps.length === 0}
                  onClick={() => save(partner, suggestion)}
                >
                  {savingId === partner.id ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                  )}
                  Godkänn förslag
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing({ partner, draft: suggestion })}
                >
                  <Pencil className="mr-1 h-4 w-4" />
                  Justera
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Justera {editing?.partner.name}</DialogTitle>
            <DialogDescription>
              Fälten är förifyllda med förslaget. Ändra det du vill innan du sparar.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Branscher på toppnivå (partnerns beslut – ej redigerbara)
                </Label>
                {editing.draft.industries.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {editing.draft.industries.map((ind) => (
                      <span
                        key={ind}
                        className="rounded-full border border-muted bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-muted-foreground">Partnern har inte valt några branscher ännu.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Geografi på toppnivå</Label>
                <ChipGroup
                  options={geographyOptions}
                  selected={editing.draft.geography}
                  onToggle={(v) =>
                    updateDraft((d) => ({ ...d, geography: toggleIn(d.geography, v) }))
                  }
                />
              </div>

              {PRODUCT_KEYS.filter((k) => editing.draft.products[k]).map((k) => {
                const d = editing.draft.products[k]!;
                const setProduct = (patch: Partial<typeof d>) =>
                  updateDraft((prev) => ({
                    ...prev,
                    products: { ...prev.products, [k]: { ...prev.products[k]!, ...patch } },
                  }));
                return (
                  <div key={k} className="space-y-3 rounded-lg border border-border p-3">
                    <p className="text-sm font-semibold">{PRODUCT_LABELS[k]}</p>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Fokusbranscher (partnerns beslut – ej redigerbara)
                      </Label>
                      {d.industries.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {d.industries.map((ind) => (
                            <span
                              key={ind}
                              className="rounded-full border border-muted bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
                            >
                              {ind}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs italic text-muted-foreground">Inga branscher valda för denna produkt.</p>
                      )}
                    </div>


                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Geografi</Label>
                      <ChipGroup
                        options={geographyOptions}
                        selected={d.geography}
                        onToggle={(v) => setProduct({ geography: toggleIn(d.geography, v) })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Passande kundstorlek ({d.companySize.length}/3 – i rad)
                      </Label>
                      <ChipGroup
                        options={companySizes}
                        selected={d.companySize}
                        max={3}
                        onToggle={(v) => setProduct({ companySize: toggleRange(companySizes, d.companySize, v) ?? d.companySize })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Omsättning MSEK ({d.revenue.length}/3 – i rad)
                      </Label>
                      <ChipGroup
                        options={revenueOptions}
                        selected={d.revenue}
                        max={3}
                        onToggle={(v) => setProduct({ revenue: toggleRange(revenueOptions, d.revenue, v) ?? d.revenue })}
                      />
                    </div>
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
              disabled={!!savingId}
              onClick={() => editing && save(editing.partner, editing.draft)}
            >
              {savingId ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
              Spara
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
