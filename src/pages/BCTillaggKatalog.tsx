import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, X, Filter } from "lucide-react";
import {
  CATEGORIES,
  TYPES,
  INDUSTRIES,
  GEOS,
  type IsvSolution,
  type SolutionCategory,
  type SolutionType,
  type SolutionIndustry,
  type SolutionGeo,
} from "@/data/bcIsvSolutions";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import { ISV_COMPARISONS } from "@/data/isvComparisons";

const TYPE_BADGE: Record<SolutionType, string> = {
  "BC-native (ISV)": "bg-primary/10 text-primary border-primary/30",
  "External system": "bg-amber-100 text-amber-900 border-amber-300",
  "Integration layer": "bg-slate-100 text-slate-800 border-slate-300",
};

const TIER_BADGE: Record<string, string> = {
  "Tier 1": "bg-emerald-100 text-emerald-900 border-emerald-300",
  "Tier 2": "bg-sky-100 text-sky-900 border-sky-300",
  Vertikal: "bg-violet-100 text-violet-900 border-violet-300",
};

function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: T[];
  selected: Set<T>;
  onToggle: (v: T) => void;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`text-sm px-3 py-1.5 rounded-full border transition ${
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted"
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
    className="text-left group"
  >
    <Card className="h-full border-border/70 hover:border-primary/50 hover:shadow-md transition bg-card">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition">
              {s.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{s.vendor}</p>
          </div>
          <Badge variant="outline" className={`text-[10px] shrink-0 ${TIER_BADGE[s.tier]}`}>
            {s.tier}
          </Badge>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4 line-clamp-2">
          {s.shortDescription}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="outline" className={`text-[10px] ${TYPE_BADGE[s.type]}`}>
            {s.type}
          </Badge>
          <Badge variant="outline" className="text-[10px] bg-muted/50 text-foreground border-border">
            {s.category}
          </Badge>
        </div>
        <div className="mt-auto pt-2 flex flex-wrap gap-1">
          {s.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-[10px] text-muted-foreground">
              #{t}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  </button>
);

const SolutionDetail = ({ s, onClose }: { s: IsvSolution | null; onClose: () => void }) => (
  <Dialog open={!!s} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      {s && (
        <>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className={`text-[10px] ${TYPE_BADGE[s.type]}`}>
                {s.type}
              </Badge>
              <Badge variant="outline" className={`text-[10px] ${TIER_BADGE[s.tier]}`}>
                {s.tier}
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-muted/50 text-foreground border-border">
                {s.category}
              </Badge>
            </div>
            <DialogTitle className="text-2xl">{s.name}</DialogTitle>
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
                  <h4 className="font-semibold text-foreground mb-2">
                    Jämför sida vid sida
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Gå direkt till beslutsunderlaget – samma struktur, samma fält, så ni kan välja.
                  </p>
                  <ul className="space-y-1.5">
                    {matches.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to={`/compare/${c.slug}`}
                          className="text-sm text-primary hover:underline font-medium"
                        >
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

const BCTillaggKatalog = () => {
  const [cats, setCats] = useState<Set<SolutionCategory>>(new Set());
  const [types, setTypes] = useState<Set<SolutionType>>(new Set());
  const [industries, setIndustries] = useState<Set<SolutionIndustry>>(new Set());
  const [geos, setGeos] = useState<Set<SolutionGeo>>(new Set());
  const [open, setOpen] = useState<IsvSolution | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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
      if (geos.size && !s.geo.some((g) => geos.has(g))) return false;
      return true;
    });
  }, [BC_ISV_SOLUTIONS, cats, types, industries, geos]);

  const activeCount = cats.size + types.size + industries.size + geos.size;

  const clearAll = () => {
    setCats(new Set());
    setTypes(new Set());
    setIndustries(new Set());
    setGeos(new Set());
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Tillägg för Business Central (ISV)"
        description="Interaktiv katalog över ISV-lösningar för Microsoft Dynamics 365 Business Central – AP automation, WMS, EDI, retail, e-handel, branschpaket m.m. Filtrera på kategori, typ, bransch och geografi."
        canonicalPath="/kunskapscenter/business-central-tillagg/katalog/"
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-[hsl(var(--hero-dark))] text-white border-b border-[hsl(var(--line-dark))]">
        <div className="container mx-auto px-4 pt-28 pb-12 max-w-6xl">
          <Link
            to="/kunskapscenter/business-central-tillagg/"
            className="inline-flex items-center text-white/70 hover:text-white text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Tillbaka till BC-tilläggsapplikationer
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Katalog: tilläggsapplikationer för Business Central
          </h1>
          <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
            Interaktiv översikt av ISV-lösningar i BC-ekosystemet. Filtrera fram det som matchar
            er bransch, ert behov och era flöden – och se vilka kombinationer som faktiskt
            återkommer i svenska affärer.
          </p>
          <p className="text-white/60 text-xs mt-3">
            {BC_ISV_SOLUTIONS.length} lösningar i katalogen. Partnerstatus, version och svensk
            lokalisering bör alltid verifieras med ISV:n och er BC-partner inför affär.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Filter bar */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                aria-expanded={showFilters}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border-2 border-primary bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Dölj filter" : "Filtrera lösningar"}
                {activeCount > 0 && (
                  <Badge className="bg-primary-foreground text-primary ml-1">{activeCount}</Badge>
                )}
              </button>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed pt-1">
                Filtrera på kategori, bransch, typ (add-on/extern) eller geografi för att hitta
                lösningar som matchar er BC-miljö.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">
                Visar <strong className="text-foreground">{filtered.length}</strong> av{" "}
                {BC_ISV_SOLUTIONS.length}
              </span>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Rensa
                </button>
              )}
            </div>
          </div>

          {(showFilters || activeCount > 0) && (
            <div className="p-5 bg-muted/30 border border-border rounded-lg space-y-5">
              <FilterGroup
                label="Kategori"
                options={CATEGORIES}
                selected={cats}
                onToggle={toggle(cats, setCats)}
              />
              <FilterGroup
                label="Typ"
                options={TYPES}
                selected={types}
                onToggle={toggle(types, setTypes)}
              />
              <FilterGroup
                label="Bransch"
                options={INDUSTRIES}
                selected={industries}
                onToggle={toggle(industries, setIndustries)}
              />
              <FilterGroup
                label="Geografi"
                options={GEOS}
                selected={geos}
                onToggle={toggle(geos, setGeos)}
              />
            </div>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <SolutionCard key={s.id} s={s} onOpen={() => setOpen(s)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Inga lösningar matchar valda filter.</p>
            <button onClick={clearAll} className="text-primary hover:underline mt-2 text-sm">
              Rensa filter
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-6 bg-secondary/40 border border-border rounded-lg text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Behöver ni hjälp att välja rätt kombination?
          </h2>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto text-sm">
            Många BC-partners är specialiserade på vissa ISV-lösningar. Vi hjälper er hitta
            partners som matchar er kombination av bransch, processer och tilläggsbehov.
          </p>
          <Button asChild>
            <Link to="/businesscentral#partners">Hitta Business Central-partners →</Link>
          </Button>
        </div>
      </div>

      <SolutionDetail s={open} onClose={() => setOpen(null)} />
      <Footer />
    </div>
  );
};

export default BCTillaggKatalog;
