import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, IdCard, Eye } from "lucide-react";
import type { IndustryPitch } from "@/components/PartnerIndustryPitchesEditor";

interface Props {
  partnerName: string;
  generalDescription?: string;
  industries: string[];
  productsPerIndustry: Record<string, string[]>;
  pitches: IndustryPitch[];
}

/**
 * Live preview that mirrors exactly how `PartnerCard.tsx` renders the
 * industry pitch box (sökresultat) and how the longer pitch appears
 * above kompetenskorten on the partner profile page.
 *
 * Admins pick an industry + optional produktvariant and see both
 * rendering contexts side-by-side in real time.
 */
export function PartnerIndustryPitchPreview({
  partnerName,
  generalDescription,
  industries,
  productsPerIndustry,
  pitches,
}: Props) {
  const sortedIndustries = useMemo(
    () => Array.from(new Set(industries)).sort((a, b) => a.localeCompare(b, "sv")),
    [industries],
  );

  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(
    sortedIndustries[0] || null,
  );
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    if (selectedIndustry && !sortedIndustries.includes(selectedIndustry)) {
      setSelectedIndustry(sortedIndustries[0] || null);
      setSelectedProduct(null);
    } else if (!selectedIndustry && sortedIndustries.length > 0) {
      setSelectedIndustry(sortedIndustries[0]);
    }
  }, [sortedIndustries, selectedIndustry]);

  useEffect(() => {
    setSelectedProduct(null);
  }, [selectedIndustry]);

  if (sortedIndustries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        Välj minst en bransch under Produkter för att se en förhandsvisning.
      </div>
    );
  }

  const products = selectedIndustry ? productsPerIndustry[selectedIndustry] || [] : [];

  // Exakt samma matchningslogik som i PartnerCard.tsx
  const matchOverride = selectedIndustry && selectedProduct
    ? pitches.find((p) => p.industry === selectedIndustry && p.product === selectedProduct)
    : null;
  const matchDefault = selectedIndustry
    ? pitches.find(
        (p) =>
          p.industry === selectedIndustry &&
          (p.product === null || p.product === undefined),
      )
    : null;
  const activePitch = matchOverride || matchDefault;
  const usingFallback = !!matchOverride ? false : !!selectedProduct && !!matchDefault;
  const usingOverride = !!matchOverride;

  return (
    <div className="space-y-4">
      {/* Header & badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <h5 className="text-sm font-semibold">Liveförhandsvisning</h5>
        </div>
        {activePitch ? (
          usingOverride ? (
            <Badge variant="secondary" className="text-xs">
              Visar produktvariant ({selectedProduct})
            </Badge>
          ) : usingFallback ? (
            <Badge variant="outline" className="text-xs">
              Faller tillbaka på bransch-text
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              Visar bransch-text (standard)
            </Badge>
          )
        ) : (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Ingen text registrerad
          </Badge>
        )}
      </div>

      {/* Selector */}
      <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Bransch
          </span>
          {sortedIndustries.map((ind) => {
            const isActive = ind === selectedIndustry;
            return (
              <button
                key={ind}
                type="button"
                onClick={() => setSelectedIndustry(ind)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {ind}
              </button>
            );
          })}
        </div>
        {products.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Produktkontext
            </span>
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                selectedProduct === null
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              (utan produktfilter)
            </button>
            {products.map((p) => {
              const isActive = p === selectedProduct;
              const hasOverride = pitches.some(
                (pi) => pi.industry === selectedIndustry && pi.product === p,
              );
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedProduct(p)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                    isActive
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {p}
                  {hasOverride && (
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-background" : "bg-primary"
                      }`}
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Sökresultat / partnerkort */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sökresultat / partnerkort
            </p>
          </div>
          {/* Mock kortets ram (utan logo etc) — fokus på pitch-rutan */}
          <div className="rounded-lg border border-border/60 p-3 bg-background space-y-3">
            <p className="text-sm font-semibold text-foreground">{partnerName || "Partner"}</p>

            {/* Exakt samma markup som PartnerCard renderar */}
            {activePitch?.text?.trim() ? (
              <div className="p-3 rounded-lg bg-primary/5 border-l-2 border-primary/60">
                <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
                  Inom {selectedIndustry}
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed line-clamp-4">
                  {activePitch.text}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-dashed border-border text-xs text-muted-foreground text-center">
                Ingen branschtext — kortet visar bara den generella beskrivningen.
              </div>
            )}

            {generalDescription?.trim() && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {generalDescription}
              </p>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 italic">
            Visas på branschsidor och i partnerlistor när besökaren filtrerar på {selectedIndustry}.
          </p>
        </div>

        {/* Stor partnerprofil */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <IdCard className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Stor partnerprofil
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-3 bg-background space-y-3">
            <p className="text-sm font-semibold text-foreground">{partnerName || "Partner"}</p>
            {generalDescription?.trim() && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {generalDescription}
              </p>
            )}
            {activePitch?.text?.trim() ? (
              <div className="p-3 rounded-lg bg-primary/5 border-l-2 border-primary/60">
                <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
                  Branschinriktning – {selectedIndustry}
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {activePitch.text}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-dashed border-border text-xs text-muted-foreground text-center">
                Ingen branschtext för {selectedIndustry} — sektionen döljs på profilen.
              </div>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 italic">
            Visas ovanför kompetenskorten på partnerns profilsida.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PartnerIndustryPitchPreview;
