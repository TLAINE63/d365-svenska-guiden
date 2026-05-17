import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Trash2, Loader2, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface IndustryPitch {
  industry: string;
  product: string | null;
  text: string;
  generated_at?: string | null;
  edited_by?: string | null;
  updated_at?: string;
}

interface PartnerIndustryPitchesEditorProps {
  /** All industries the partner has selected (across all product areas). */
  industries: string[];
  /** Map: industry name -> list of product labels the partner sells in that industry */
  productsPerIndustry: Record<string, string[]>;
  /** Current pitches value */
  value: IndustryPitch[];
  onChange: (next: IndustryPitch[]) => void;
  /** Auth – use one of these */
  adminToken?: string | null;
  invitationToken?: string | null;
  /** Required for admin path. */
  partnerId?: string | null;
}

const MAX_WORDS = 280;
const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

export function PartnerIndustryPitchesEditor({
  industries,
  productsPerIndustry,
  value,
  onChange,
  adminToken,
  invitationToken,
  partnerId,
}: PartnerIndustryPitchesEditorProps) {
  const [generating, setGenerating] = useState<string | null>(null);

  const uniqueIndustries = useMemo(
    () => Array.from(new Set(industries)).sort((a, b) => a.localeCompare(b, "sv")),
    [industries],
  );

  const getPitch = (industry: string, product: string | null): IndustryPitch | undefined =>
    value.find((p) => p.industry === industry && (p.product || null) === product);

  const upsertPitch = (industry: string, product: string | null, text: string) => {
    const others = value.filter(
      (p) => !(p.industry === industry && (p.product || null) === product),
    );
    const existing = getPitch(industry, product);
    const next: IndustryPitch[] = [
      ...others,
      {
        industry,
        product,
        text,
        generated_at: existing?.generated_at || null,
        edited_by: adminToken ? "admin" : "partner",
        updated_at: new Date().toISOString(),
      },
    ];
    onChange(next);
  };

  const removePitch = (industry: string, product: string | null) => {
    onChange(
      value.filter((p) => !(p.industry === industry && (p.product || null) === product)),
    );
  };

  const handleGenerate = async (industry: string, product: string | null) => {
    const key = `${industry}::${product || ""}`;
    setGenerating(key);
    try {
      const body: Record<string, unknown> = { industry, product: product || undefined };
      if (adminToken) {
        body.adminToken = adminToken;
        body.partnerId = partnerId;
      } else if (invitationToken) {
        body.invitationToken = invitationToken;
      }
      const { data, error } = await supabase.functions.invoke(
        "generate-partner-industry-pitch",
        { body },
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const text = (data?.text as string)?.trim();
      if (!text) throw new Error("Tomt svar");

      const existing = getPitch(industry, product);
      const others = value.filter(
        (p) => !(p.industry === industry && (p.product || null) === product),
      );
      onChange([
        ...others,
        {
          industry,
          product,
          text,
          generated_at: new Date().toISOString(),
          edited_by: existing?.edited_by || (adminToken ? "admin" : "partner"),
          updated_at: new Date().toISOString(),
        },
      ]);
      toast.success("AI-förslag genererat – redigera vid behov och spara längst ner.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Kunde inte generera";
      toast.error(msg);
    } finally {
      setGenerating(null);
    }
  };

  if (uniqueIndustries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Välj branscher per produkt först, så kan ni skriva en kort branschpitch här.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Skriv en kort (max {MAX_WORDS} ord) branschspecifik text som visas när besökare
        listar partners på branschsidor. Behöver ni hjälp – generera ett AI-förslag och
        redigera fritt. Lägg till en produktvariant om texten bör skilja sig per Dynamics 365-applikation.
      </p>

      {uniqueIndustries.map((industry) => {
        const defaultPitch = getPitch(industry, null);
        const overrides = value.filter(
          (p) => p.industry === industry && p.product !== null,
        );
        const availableProducts = (productsPerIndustry[industry] || []).filter(
          (prod) => !overrides.some((o) => o.product === prod),
        );
        const genKeyDefault = `${industry}::`;

        return (
          <div
            key={industry}
            className="rounded-lg border border-border bg-card p-4 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-base">{industry}</h4>
              {defaultPitch?.text?.trim() && (
                <Badge variant="outline" className="text-xs">
                  {wordCount(defaultPitch.text)} ord
                </Badge>
              )}
            </div>

            {/* Default (no product) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Bransch-text (visas som standard)
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={generating === genKeyDefault}
                  onClick={() => handleGenerate(industry, null)}
                >
                  {generating === genKeyDefault ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Generera med AI
                </Button>
              </div>
              <Textarea
                rows={5}
                placeholder={`Kort text om er erfarenhet inom ${industry.toLowerCase()}...`}
                value={defaultPitch?.text || ""}
                onChange={(e) => upsertPitch(industry, null, e.target.value)}
              />
              <p className="text-xs text-muted-foreground text-right">
                {wordCount(defaultPitch?.text || "")} / {MAX_WORDS} ord
              </p>
            </div>

            {/* Product overrides */}
            {overrides.map((ov) => {
              const genKey = `${industry}::${ov.product}`;
              return (
                <div
                  key={ov.product}
                  className="ml-4 pl-4 border-l-2 border-primary/30 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs">{ov.product}</Badge>
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                        Variant
                      </Label>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={generating === genKey}
                        onClick={() => handleGenerate(industry, ov.product)}
                      >
                        {generating === genKey ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        AI
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => removePitch(industry, ov.product)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    rows={4}
                    placeholder={`Variant för ${ov.product} – t.ex. för mindre/medelstora kunder...`}
                    value={ov.text || ""}
                    onChange={(e) => upsertPitch(industry, ov.product, e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {wordCount(ov.text || "")} / {MAX_WORDS} ord
                  </p>
                </div>
              );
            })}

            {/* Add variant */}
            {availableProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      upsertPitch(industry, e.target.value, "");
                    }
                  }}
                >
                  <option value="">+ Lägg till produktvariant…</option>
                  {availableProducts.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PartnerIndustryPitchesEditor;
