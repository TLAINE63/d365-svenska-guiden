import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, ArrowRight } from "lucide-react";
import {
  CATEGORIES,
  TYPES,
  INDUSTRIES,
  type IsvSolution,
  type SolutionCategory,
  type SolutionType,
  type SolutionIndustry,
} from "@/data/bcIsvSolutions";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";
import { ISV_COMPARISONS } from "@/data/isvComparisons";
import { ISV_PRODUCTS } from "@/data/isvProfileOptions";

/** Lösningar utan angivna produkter räknas som Business Central-tillägg. */
const solutionProducts = (s: IsvSolution): string[] =>
  s.products?.length ? s.products : ["Business Central"];

const TYPE_BADGE: Record<SolutionType, string> = {
  "BC-native (ISV)": "bg-primary/10 text-primary border-primary/30",
  "External system": "bg-amber-100 text-amber-900 border-amber-300",
  "Integration layer": "bg-slate-100 text-slate-800 border-slate-300",
};

const TIER_BADGE: Record<string, string> = {
  "Tier 1": "bg-[hsl(var(--cta-orange))]/10 text-[hsl(var(--cta-orange))] border-[hsl(var(--cta-orange))]/30",
  "Tier 2": "bg-stone-100 text-stone-700 border-stone-200",
  Vertikal: "bg-violet-50 text-violet-900 border-violet-200",
};

function FilterRow<T extends string>({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: T[];
  selected: Set<T>;
  onToggle: (v: T) => void;
  onClear: () => void;
}) {
  const allActive = selected.size === 0;
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-5">
      <div className="md:w-24 shrink-0 pt-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 flex-1">
        <button
          type="button"
          onClick={onClear}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all ${
            allActive
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-muted-foreground border-border hover:border-primary/40"
          }`}
        >
          Alla
        </button>
        {options.map((opt) => {
          const active = selected.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all ${
                active
                  ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                  : "bg-background text-foreground border-border hover:border-primary/40 hover:bg-muted/50"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const SolutionCard = ({ s, onOpen }: { s: IsvSolution; onOpen: () => void }) => (
  <button
    type="button"
    onClick={onOpen}
    className="text-left group relative bg-gradient-to-b from-card to-muted/20 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col p-7 overflow-hidden"
  >
    {/* Top accent bar */}
    <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary opacity-80 group-hover:opacity-100 transition-opacity" />

    <div className="flex justify-between items-start gap-3 mb-5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80 mb-1.5 truncate">
          {s.vendor}
        </p>
        <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
          {s.name}
        </h3>
      </div>
      <span
        className={`shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] border rounded-sm ${TIER_BADGE[s.tier]}`}
      >
        {s.tier}
      </span>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-5">
      <span className={`px-2 py-0.5 text-[11px] font-medium rounded border ${TYPE_BADGE[s.type]}`}>
        {s.type}
      </span>
      <span className="px-2 py-0.5 text-[11px] font-medium bg-muted/60 text-foreground border border-border rounded">
        {s.category}
      </span>
    </div>

    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3 flex-1">
      {s.shortDescription}
    </p>

    <div className="mt-auto border-t border-border/60 pt-4">
      <div className="flex flex-wrap gap-1.5 mb-4 min-h-[18px]">
        {s.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 border border-border/60 rounded-sm"
          >
            #{t}
          </span>
        ))}
      </div>
      <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
        Visa lösningen
        <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </div>
  </button>
);

/** Återförsäljare/partners som ISV:n själv angett (slugs mot partnerdatabasen). */
const IsvResellers = ({ slugs }: { slugs: string[] }) => {
  const { data: partners = [] } = useAllPartnerNames();
  if (!slugs.length) return null;
  const names = slugs.map((slug) => partners.find((p) => p.slug === slug) || { slug, name: slug, is_featured: false });
  return (
    <section>
      <h4 className="font-semibold text-foreground mb-1">Återförsäljare / partners</h4>
      <div className="flex flex-wrap gap-1.5">
        {names.map((p) => (
          <Badge key={p.slug} variant="outline" className="text-[11px] bg-muted/50 text-foreground border-border">
            {p.name}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-1">Angivet av leverantören.</p>
    </section>
  );
};

const SolutionDetail = ({ s, onClose }: { s: IsvSolution | null; onClose: () => void }) => (
  <Dialog open={!!s} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      {s && (
        <>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className={`text-[10px] ${TYPE_BADGE[s.type]}`}>{s.type}</Badge>
              <Badge variant="outline" className={`text-[10px] ${TIER_BADGE[s.tier]}`}>{s.tier}</Badge>
              <Badge variant="outline" className="text-[10px] bg-muted/50 text-foreground border-border">
                {s.category}
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-['Playfair_Display'] font-semibold">{s.name}</DialogTitle>
            <DialogDescription className="text-sm">{s.vendor}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2 text-sm leading-relaxed">
            {Boolean(s.products?.length || s.industryFocus?.length) && (
              <section className="space-y-3">
                {s.products?.length ? (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Byggd för</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {s.products.map((p) => (
                        <Badge key={p} variant="outline" className="text-[11px] border-primary/40 text-primary">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
                {s.industryFocus?.length ? (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Branschinriktning</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {s.industryFocus.map((i) => (
                        <Badge key={i} variant="outline" className="text-[11px]">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            )}
            <section>
              <h4 className="font-semibold text-foreground mb-1">Vad lösningen är</h4>
              <p className="text-foreground/80">{s.what}</p>
            </section>
            <section>
              <h4 className="font-semibold text-foreground mb-1">Vad den används till</h4>
              <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                {s.useCases.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-foreground mb-1">När den passar</h4>
              <p className="text-foreground/80">{s.whenFits}</p>
            </section>
            {s.combos.length > 0 && (
              <section className="p-4 rounded bg-muted/40 border border-border">
                <h4 className="font-semibold text-foreground mb-2">Vanliga kombinationer</h4>
                <ul className="space-y-1 text-foreground/80">
                  {s.combos.map((c) => <li key={c}>→ {c}</li>)}
                </ul>
              </section>
            )}
            <IsvResellers slugs={s.partnerSlugs || []} />
            <section className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
              {s.tags.map((t) => (
                <span key={t} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </section>
            {(() => {
              const matches = ISV_COMPARISONS.filter((c) => c.solutionIds.includes(s.id));
              if (matches.length === 0) return null;
              return (
                <section className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-foreground mb-2">Jämför sida vid sida</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Gå direkt till beslutsunderlaget – samma struktur, samma fält, så ni kan välja.
                  </p>
                  <ul className="space-y-1.5">
                    {matches.map((c) => (
                      <li key={c.slug}>
                        <Link to={`/compare/${c.slug}`} className="text-sm text-primary hover:underline font-medium">
                          → {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })()}
            <div className="pt-3">
              <Button asChild variant="outline" className="w-full">
                <Link to="/valjdynamics365partner/">Hitta BC-partner som arbetar med liknande tillägg →</Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);

interface BcIsvCatalogProps {
  defaultFiltersOpen?: boolean;
  showCta?: boolean;
  /** Förvalda Dynamics 365-produkter. Tom = alla produkter. */
  defaultProducts?: string[];
  /** Visa produktfiltret överst (gemensam D365-katalog). */
  showProductFilter?: boolean;
}

const BcIsvCatalog = ({ defaultProducts = [], showProductFilter = false }: BcIsvCatalogProps = {}) => {
  const [cats, setCats] = useState<Set<SolutionCategory>>(new Set());
  const [types, setTypes] = useState<Set<SolutionType>>(new Set());
  const [industries, setIndustries] = useState<Set<SolutionIndustry>>(new Set());
  const [products, setProducts] = useState<Set<string>>(new Set(defaultProducts));
  const [groupByVendor, setGroupByVendor] = useState(true);
  const [open, setOpen] = useState<IsvSolution | null>(null);

  const toggle = <T,>(set: Set<T>, setter: (s: Set<T>) => void) => (v: T) => {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    setter(next);
  };

  const BC_ISV_SOLUTIONS = useIsvSolutions();

  // När produktfiltret visas är defaultProducts bara ett förval, inte en hård avgränsning.
  const scoped = useMemo(() => {
    if (showProductFilter || !defaultProducts.length) return BC_ISV_SOLUTIONS;
    return BC_ISV_SOLUTIONS.filter((s) =>
      solutionProducts(s).some((p) => defaultProducts.includes(p))
    );
  }, [BC_ISV_SOLUTIONS, defaultProducts, showProductFilter]);

  const filtered = useMemo(() => {
    return scoped.filter((s) => {
      if (cats.size && !cats.has(s.category)) return false;
      if (types.size && !types.has(s.type)) return false;
      if (industries.size && !s.industries.some((i) => industries.has(i))) return false;
      if (products.size && !solutionProducts(s).some((p) => products.has(p))) return false;
      return true;
    });
  }, [scoped, cats, types, industries, products]);

  // Leverantörer med fler än en lösning grupperas under egen rubrik
  const { vendorGroups, singles } = useMemo(() => {
    const map = new Map<string, IsvSolution[]>();
    for (const s of filtered) {
      const key = s.vendor.trim() || "Övriga";
      map.set(key, [...(map.get(key) || []), s]);
    }
    const groups = [...map.entries()]
      .filter(([, list]) => list.length > 1)
      .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], "sv"));
    const rest = [...map.entries()]
      .filter(([, list]) => list.length === 1)
      .flatMap(([, list]) => list);
    return { vendorGroups: groups, singles: rest };
  }, [filtered]);

  const activeCount = cats.size + types.size + industries.size + (showProductFilter ? products.size : 0);

  const clearAll = () => {
    setCats(new Set());
    setTypes(new Set());
    setIndustries(new Set());
    if (showProductFilter) setProducts(new Set());
  };

  return (
    <div>
      {/* Editorial filter module */}
      <div className="border-y border-border bg-gradient-to-b from-muted/20 via-background to-background py-8 px-6 md:px-8 mb-8">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary block mb-1.5">
              Förfina urvalet
            </span>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Filtrera fram lösningar som matchar er kategori, leveransform och bransch.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs shrink-0">
            <span className="text-muted-foreground hidden sm:inline">
              <strong className="text-foreground text-sm font-semibold">{filtered.length}</strong>
              <span className="text-muted-foreground"> / {scoped.length}</span>
            </span>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium"
              >
                <X className="w-3.5 h-3.5" /> Rensa
              </button>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {showProductFilter && (
            <>
              <FilterRow
                label="Dynamics 365-produkt"
                options={ISV_PRODUCTS}
                selected={products}
                onToggle={toggle(products, setProducts)}
                onClear={() => setProducts(new Set())}
              />
              <div className="h-px bg-border/60" />
            </>
          )}
          <FilterRow
            label="Kategori"
            options={CATEGORIES}
            selected={cats}
            onToggle={toggle(cats, setCats)}
            onClear={() => setCats(new Set())}
          />
          <div className="h-px bg-border/60" />
          <FilterRow
            label="Typ"
            options={TYPES}
            selected={types}
            onToggle={toggle(types, setTypes)}
            onClear={() => setTypes(new Set())}
          />
          <div className="h-px bg-border/60" />
          <FilterRow
            label="Bransch"
            options={INDUSTRIES}
            selected={industries}
            onToggle={toggle(industries, setIndustries)}
            onClear={() => setIndustries(new Set())}
          />
        </div>

        {vendorGroups.length > 0 && (
          <div className="mt-5 pt-4 border-t border-border/60">
            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={groupByVendor}
                onChange={(e) => setGroupByVendor(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-[hsl(var(--cta-orange))]"
              />
              Gruppera per leverantör
            </label>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded">
          <p>Inga lösningar matchar valda filter.</p>
          <button onClick={clearAll} className="text-primary hover:underline mt-2 text-sm">
            Rensa filter
          </button>
        </div>
      ) : groupByVendor && vendorGroups.length > 0 ? (
        <div className="space-y-10">
          {vendorGroups.map(([vendor, list]) => (
            <section key={vendor}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4 pb-2 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  {vendor}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {list.length} lösningar
                  </span>
                </h3>
                {list[0]?.vendorWebsite && (
                  <a
                    href={list[0].vendorWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Leverantörens webbplats
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {list.map((s) => (
                  <SolutionCard key={s.id} s={s} onOpen={() => setOpen(s)} />
                ))}
              </div>
            </section>
          ))}

          {singles.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between gap-2 mb-4 pb-2 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Övriga lösningar
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {singles.length} st
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {singles.map((s) => (
                  <SolutionCard key={s.id} s={s} onOpen={() => setOpen(s)} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <SolutionCard key={s.id} s={s} onOpen={() => setOpen(s)} />
          ))}
        </div>
      )}

      <SolutionDetail s={open} onClose={() => setOpen(null)} />
    </div>
  );
};

export default BcIsvCatalog;
