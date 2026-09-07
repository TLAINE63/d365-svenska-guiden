import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, ArrowRight, Search } from "lucide-react";
import {
  CATEGORIES,
  DELIVERY_MODELS,
  RELEVANCE_LABEL,
  deliveryLabel,
  deliveryModelFromType,
  CE_APPS,
  CE_APP_LABEL,
  ceApps,
  ceRelevance,
  type CeApp,
  type DeliveryModel,
  type IsvSolution,
} from "@/data/bcIsvSolutions";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";
import { ISV_COMPARISONS } from "@/data/isvComparisons";
import { ISV_PRODUCTS } from "@/data/isvProfileOptions";

/** Lösningar utan angivna produkter räknas som Business Central-tillägg. */
const solutionProducts = (s: IsvSolution): string[] =>
  s.products?.length ? s.products : ["Business Central"];

const model = (s: IsvSolution): DeliveryModel => s.deliveryModel || deliveryModelFromType(s.type);

/** Presentationstext för leveransform, anpassad efter lösningens produkter. */
const deliveryText = (s: IsvSolution) => deliveryLabel(model(s), solutionProducts(s));

const DELIVERY_BADGE: Record<DeliveryModel, string> = {
  native_isv: "bg-primary/10 text-primary border-primary/30",
  external_saas: "bg-amber-100 text-amber-900 border-amber-300",
  integration_layer: "bg-slate-100 text-slate-800 border-slate-300",
  industry_solution: "bg-violet-50 text-violet-900 border-violet-200",
};

/** Etikett för leveransform i filterraden (produktneutral). */
const DELIVERY_FILTER_LABEL: Record<DeliveryModel, string> = {
  native_isv: "Native (ISV)",
  external_saas: "Externt system (SaaS)",
  integration_layer: "Integrationslager",
  industry_solution: "Branschlösning",
};

type FocusFilter = "finance" | "supply";
const FOCUS_LABEL: Record<FocusFilter, string> = {
  finance: "Finance",
  supply: "Supply Chain",
};


function FilterRow<T extends string>({
  label,
  options,
  selected,
  onToggle,
  onClear,
  labelFor,
}: {
  label: string;
  options: readonly T[];
  selected: Set<T>;
  onToggle: (v: T) => void;
  onClear: () => void;
  /** Visningstext när värdet är internt (t.ex. leveransform). */
  labelFor?: (v: T) => string;
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
              {labelFor ? labelFor(opt) : opt}

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

    <div className="mb-5 min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80 mb-1.5 truncate">
        {s.vendor}
      </p>
      <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
        {s.name}
      </h3>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-5">
      <span className={`px-2 py-0.5 text-[11px] font-medium rounded border ${DELIVERY_BADGE[model(s)]}`}>
        {deliveryText(s)}
      </span>
      <span className="px-2 py-0.5 text-[11px] font-medium bg-muted/60 text-foreground border border-border rounded">
        {s.category}
      </span>
      {ceApps(s).slice(0, 3).map((a) => (
        <span
          key={a}
          className="px-2 py-0.5 text-[11px] font-medium bg-accent/10 text-accent border border-accent/30 rounded"
        >
          {CE_APP_LABEL[a]}
        </span>
      ))}
    </div>

    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3 flex-1">
      {s.shortDescription}
    </p>

    <div className="mt-auto border-t border-border/60 pt-4">
      <div className="flex flex-wrap gap-1.5 mb-4 min-h-[18px]">
        {s.tags.slice(0, 4).map((t) => (
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
              <Badge variant="outline" className={`text-[10px] ${DELIVERY_BADGE[model(s)]}`}>
                {deliveryText(s)}
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-muted/50 text-foreground border-border">
                {s.category}
              </Badge>
              {s.subcategory && (
                <Badge variant="outline" className="text-[10px] bg-muted/30 text-muted-foreground border-border">
                  {s.subcategory}
                </Badge>
              )}
            </div>
            <DialogTitle className="text-2xl font-['Playfair_Display'] font-semibold">{s.name}</DialogTitle>
            <DialogDescription className="text-sm">{s.vendor}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2 text-sm leading-relaxed">
            <section className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Byggd för</h4>
                <div className="flex flex-wrap gap-1.5">
                  {solutionProducts(s).map((p) => (
                    <Badge key={p} variant="outline" className="text-[11px] border-primary/40 text-primary">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
              {(s.financeRelevance || s.supplyChainRelevance) && (
                <div className="flex flex-wrap gap-4">
                  {s.financeRelevance && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Finance:</span>{" "}
                      {RELEVANCE_LABEL[s.financeRelevance]}
                    </p>
                  )}
                  {s.supplyChainRelevance && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Supply Chain:</span>{" "}
                      {RELEVANCE_LABEL[s.supplyChainRelevance]}
                    </p>
                  )}
                </div>
              )}
              {ceApps(s).length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Relevanta CE-applikationer</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {ceApps(s).map((a) => {
                      const r = ceRelevance(s, a);
                      return (
                        <Badge key={a} variant="outline" className="text-[11px] border-accent/40 text-accent">
                          {CE_APP_LABEL[a]}
                          {r === "partial" ? " (delvis)" : ""}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
              {(s.industryFocus?.length || s.industries?.length) ? (
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Branscher</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[...new Set([...(s.industryFocus || []), ...(s.industries || [])])].map((i) => (
                      <Badge key={i} variant="outline" className="text-[11px]">
                        {i}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
            <section>
              <h4 className="font-semibold text-foreground mb-1">Kort beskrivning</h4>
              <p className="text-foreground/80">{s.what || s.shortDescription}</p>
            </section>
            {s.bestFor && (
              <section className="p-4 rounded bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-foreground mb-1">Passar bäst för</h4>
                <p className="text-foreground/80">{s.bestFor}</p>
              </section>
            )}
            {s.considerations && (
              <section className="p-4 rounded bg-muted/40 border border-border">
                <h4 className="font-semibold text-foreground mb-1">Tänk på</h4>
                <p className="text-foreground/80">{s.considerations}</p>
              </section>
            )}
            {s.useCases.length > 0 && (
              <section>
                <h4 className="font-semibold text-foreground mb-1">Vad den används till</h4>
                <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                  {s.useCases.map((u) => <li key={u}>{u}</li>)}
                </ul>
              </section>
            )}
            {s.whenFits && (
              <section>
                <h4 className="font-semibold text-foreground mb-1">När den passar</h4>
                <p className="text-foreground/80">{s.whenFits}</p>
              </section>
            )}

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
                    Gå direkt till beslutsunderlaget – samma struktur, samma fält, så du kan välja.
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
  /** Öppna en specifik lösning direkt (id, namn eller slug från t.ex. AI-sök). */
  openSolutionId?: string;
  /** Förifylld fritextsökning. */
  defaultQuery?: string;
  /** Förvalda kategorier (t.ex. från en kategorilandningssida). */
  defaultCategories?: string[];
  /** Förvalda Customer Engagement-applikationer. */
  defaultCeApps?: string[];
}

const slugify = (v: string) =>
  v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const BcIsvCatalog = ({
  defaultProducts = [],
  showProductFilter = false,
  openSolutionId,
  defaultQuery = "",
  defaultCategories = [],
  defaultCeApps = [],
}: BcIsvCatalogProps = {}) => {
  const [cats, setCats] = useState<Set<string>>(new Set(defaultCategories));
  const [ceSel, setCeSel] = useState<Set<CeApp>>(
    new Set(defaultCeApps.filter((a): a is CeApp => (CE_APPS as readonly string[]).includes(a)))
  );
  const [deliveries, setDeliveries] = useState<Set<DeliveryModel>>(new Set());
  const [industries, setIndustries] = useState<Set<string>>(new Set());
  const [focus, setFocus] = useState<Set<FocusFilter>>(new Set());
  const [products, setProducts] = useState<Set<string>>(new Set(defaultProducts));
  const [query, setQuery] = useState(defaultQuery);
  const [groupByVendor, setGroupByVendor] = useState(true);
  const [open, setOpen] = useState<IsvSolution | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);

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

  // Filteralternativ byggs från det som faktiskt finns i katalogen.
  const options = useMemo(() => {
    const catSet = new Set<string>();
    const indSet = new Set<string>();
    const delSet = new Set<DeliveryModel>();
    const ceSet = new Set<CeApp>();
    for (const s of scoped) {
      for (const a of ceApps(s)) ceSet.add(a);
      if (s.category) catSet.add(s.category);
      for (const i of [...(s.industries || []), ...(s.industryFocus || [])]) {
        // "Alla"/"Generell" är inte egna branscher och krockar med Alla-knappen.
        if (i && !/^(alla|generell)$/i.test(i.trim())) indSet.add(i.trim());
      }

      delSet.add(model(s));
    }
    const catOrder = (c: string) => {
      const i = (CATEGORIES as readonly string[]).indexOf(c);
      return i === -1 ? 999 : i;
    };
    return {
      categories: [...catSet].sort((a, b) => catOrder(a) - catOrder(b) || a.localeCompare(b, "sv")),
      industries: [...indSet].sort((a, b) => a.localeCompare(b, "sv")),
      deliveries: DELIVERY_MODELS.filter((d) => delSet.has(d)),
      ceApps: CE_APPS.filter((a) => ceSet.has(a)),
    };
  }, [scoped]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped.filter((s) => {
      if (cats.size && !cats.has(s.category)) return false;
      if (deliveries.size && !deliveries.has(model(s))) return false;
      if (industries.size) {
        const all = [...(s.industries || []), ...(s.industryFocus || [])];
        if (!all.some((i) => industries.has(i))) return false;
      }
      if (focus.size) {
        const ok =
          (focus.has("finance") && s.financeRelevance && s.financeRelevance !== "no") ||
          (focus.has("supply") && s.supplyChainRelevance && s.supplyChainRelevance !== "no");
        if (!ok) return false;
      }
      if (ceSel.size) {
        const apps = ceApps(s);
        if (!apps.some((a) => ceSel.has(a))) return false;
      }
      if (products.size && !solutionProducts(s).some((p) => products.has(p))) return false;
      if (q) {
        const hay = [
          s.name,
          s.vendor,
          s.category,
          s.subcategory || "",
          deliveryText(s),
          s.shortDescription,
          s.what,
          s.whenFits,
          s.bestFor || "",
          s.considerations || "",
          ...(s.tags || []),
          ...(s.useCases || []),
          ...(s.industries || []),
          ...(s.industryFocus || []),
          ...solutionProducts(s),
          ...ceApps(s).map((a) => CE_APP_LABEL[a]),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [scoped, cats, deliveries, industries, focus, products, ceSel, query]);


  // Djuplänk: öppna en specifik lösning direkt (t.ex. från AI-sök)
  useEffect(() => {
    if (autoOpened || !openSolutionId || !BC_ISV_SOLUTIONS.length) return;
    const key = slugify(openSolutionId);
    const match = BC_ISV_SOLUTIONS.find(
      (s) => slugify(s.id) === key || slugify(s.name) === key
    );
    if (match) {
      setOpen(match);
      setAutoOpened(true);
    }
  }, [openSolutionId, BC_ISV_SOLUTIONS, autoOpened]);

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

  const activeCount =
    cats.size +
    deliveries.size +
    industries.size +
    focus.size +
    ceSel.size +
    (showProductFilter ? products.size : 0) +
    (query.trim() ? 1 : 0);

  const clearAll = () => {
    setCats(new Set());
    setDeliveries(new Set());
    setIndustries(new Set());
    setFocus(new Set());
    setCeSel(new Set());
    setQuery("");
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
              Filtrera fram lösningar som matchar din kategori, leveransform och bransch.
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

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök på lösning, leverantör, funktion eller nyckelord…"
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Rensa sökning"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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
            options={options.categories}
            selected={cats}
            onToggle={toggle(cats, setCats)}
            onClear={() => setCats(new Set())}
          />
          <div className="h-px bg-border/60" />
          <FilterRow
            label="Leveransform"
            options={options.deliveries}
            selected={deliveries}
            onToggle={toggle(deliveries, setDeliveries)}
            onClear={() => setDeliveries(new Set())}
            labelFor={(d) => DELIVERY_FILTER_LABEL[d]}
          />
          <div className="h-px bg-border/60" />
          <FilterRow
            label="Område"
            options={["finance", "supply"] as FocusFilter[]}
            selected={focus}
            onToggle={toggle(focus, setFocus)}
            onClear={() => setFocus(new Set())}
            labelFor={(f) => FOCUS_LABEL[f]}
          />
          {options.ceApps.length > 0 && (
            <>
              <div className="h-px bg-border/60" />
              <FilterRow
                label="CE-applikation"
                options={options.ceApps}
                selected={ceSel}
                onToggle={toggle(ceSel, setCeSel)}
                onClear={() => setCeSel(new Set())}
                labelFor={(a) => CE_APP_LABEL[a]}
              />
            </>
          )}
          <div className="h-px bg-border/60" />
          <FilterRow
            label="Bransch"
            options={options.industries}
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
