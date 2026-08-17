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
import { ISV_COMPARISONS } from "@/data/isvComparisons";

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
            <section>
              <h4 className="font-semibold text-foreground mb-1">
                Partners i Sverige
                {s.partnerSource && (
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    (offentligt listade av {s.partnerSource})
                  </span>
                )}
              </h4>
              {s.partnersSE.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                  {s.partnersSE.map((p) => <li key={p}>{p}</li>)}
                </ul>
              ) : (
                <p className="text-muted-foreground italic text-xs">
                  Levereras direkt av ISV:n eller via BC-partner i varje affär. Verifiera per kund.
                </p>
              )}
            </section>
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
}

const BcIsvCatalog = (_: BcIsvCatalogProps = {}) => {
  const [cats, setCats] = useState<Set<SolutionCategory>>(new Set());
  const [types, setTypes] = useState<Set<SolutionType>>(new Set());
  const [industries, setIndustries] = useState<Set<SolutionIndustry>>(new Set());
  const [open, setOpen] = useState<IsvSolution | null>(null);

  const toggle = <T,>(set: Set<T>, setter: (s: Set<T>) => void) => (v: T) => {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    setter(next);
  };

  const BC_ISV_SOLUTIONS = useIsvSolutions();

  const filtered = useMemo(() => {
    return BC_ISV_SOLUTIONS.filter((s) => {
      if (cats.size && !cats.has(s.category)) return false;
      if (types.size && !types.has(s.type)) return false;
      if (industries.size && !s.industries.some((i) => industries.has(i))) return false;
      return true;
    });
  }, [BC_ISV_SOLUTIONS, cats, types, industries]);

  const activeCount = cats.size + types.size + industries.size;

  const clearAll = () => {
    setCats(new Set());
    setTypes(new Set());
    setIndustries(new Set());
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
              <span className="text-muted-foreground"> / {BC_ISV_SOLUTIONS.length}</span>
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
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <SolutionCard key={s.id} s={s} onOpen={() => setOpen(s)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded">
          <p>Inga lösningar matchar valda filter.</p>
          <button onClick={clearAll} className="text-primary hover:underline mt-2 text-sm">
            Rensa filter
          </button>
        </div>
      )}

      <SolutionDetail s={open} onClose={() => setOpen(null)} />
    </div>
  );
};

export default BcIsvCatalog;
