import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, ArrowRight, Search, Check, Building2, Globe, Users } from "lucide-react";
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
import { useIsvSolutions, useIsvVendors, type IsvVendorPublic } from "@/hooks/useIsvSolutions";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";
import { useBasicPartners } from "@/hooks/useBasicPartners";
import { ISV_COMPARISONS } from "@/data/isvComparisons";
import { ISV_PRODUCTS } from "@/data/isvProfileOptions";
import { isvPartnerDestination } from "@/lib/isvPartnerDestination";
import InformationStatusBadge from "@/components/partner/InformationStatusBadge";
import {
  ISV_INFORMATION_STATUSES,
  isvHelpLines,
  isvInformationStatusOf,
  matchesIsvStatusFilter,
  trackIsv,
  type IsvInformationStatus,
} from "@/lib/isvInformationStatus";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

const withUtm = (url: string) => {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "d365.se");
    u.searchParams.set("utm_medium", "referral");
    u.searchParams.set("utm_campaign", "isv-katalog");
    return u.toString();
  } catch {
    return url;
  }
};

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

const SolutionCard = ({ s, onOpen }: { s: IsvSolution; onOpen: () => void }) => {
  const products = solutionProducts(s);
  const industries = (s.industryFocus?.length ? s.industryFocus : s.industries) || [];
  const partnerCount = (s.partnerSlugs?.length || 0) || s.partnersSE?.length || 0;
  const useCases = (s.useCases || []).slice(0, 3);
  const initials = s.vendor.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left group relative bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Premium header – mörk gradient med glaseffekt */}
      <div className="relative px-7 pt-7 pb-6 bg-[linear-gradient(135deg,hsl(30_14%_9%)_0%,hsl(24_20%_13%)_55%,hsl(14_60%_18%)_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.25),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--primary-glow)))]" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 shrink-0 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center font-['Playfair_Display'] text-lg font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60 truncate">
              {s.vendor}
            </p>
            <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-white leading-tight group-hover:text-[hsl(var(--primary-glow))] transition-colors">
              {s.name}
            </h3>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-1.5 mt-4">
          <span className="px-2 py-0.5 text-[11px] font-medium rounded border border-white/25 bg-white/10 text-white backdrop-blur-sm">
            {deliveryText(s)}
          </span>
          <span className="px-2 py-0.5 text-[11px] font-medium rounded border border-white/15 bg-white/5 text-white/80">
            {s.category}
          </span>
        </div>
      </div>

      <div className="px-7 py-5 flex flex-col flex-1 gap-4">
        <InformationStatusBadge kind="isv" partner={{ information_status: s.informationStatus }} className="self-start" />
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{s.shortDescription}</p>

        {useCases.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1.5">Används till</p>
            <ul className="space-y-1">
              {useCases.map((u) => (
                <li key={u} className="flex gap-2 text-xs text-foreground leading-snug">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent" />
                  <span className="line-clamp-2">{u}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {s.bestFor && (
          <div className="rounded-lg bg-muted/40 border border-border/60 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Passar bäst för</p>
            <p className="text-xs text-foreground leading-snug line-clamp-2">{s.bestFor}</p>
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className="col-span-2 flex flex-wrap gap-1">
            {[...products, ...ceApps(s).map((a) => CE_APP_LABEL[a])]
              .filter((v, i, arr) => arr.indexOf(v) === i)
              .slice(0, 4)
              .map((p) => (
                <span key={p} className="px-2 py-0.5 text-[11px] font-medium bg-[hsl(var(--accent-light))] text-accent border border-accent/30 rounded whitespace-nowrap">
                  {p}
                </span>
              ))}
          </div>
          {industries.length > 0 && (
            <div className="flex items-start gap-1.5 col-span-2 text-muted-foreground">
              <Building2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{industries.slice(0, 3).join(", ")}</span>
            </div>
          )}
          {s.geo?.length > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{s.geo.join(", ")}</span>
            </div>
          )}
          {partnerCount > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{partnerCount} {partnerCount === 1 ? "partner" : "partners"} i Sverige</span>
            </div>
          )}
        </dl>

        <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between gap-2">
          <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            Visa lösningen
            <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          {(s.vendorUpdatedAt || s.verifiedAt) && (
            <span className="text-[10px] text-muted-foreground">
              Uppdaterad {(s.vendorUpdatedAt || s.verifiedAt || "").slice(0, 10)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

/** Återförsäljare/partners som ISV:n själv angett (slugs mot partnerdatabasen). */
export const IsvResellers = ({ slugs, products }: { slugs: string[]; products?: string[] }) => {
  const destination = isvPartnerDestination(products);
  const { data: partners = [] } = useAllPartnerNames();
  const { data: basicPartners = [] } = useBasicPartners();
  if (!slugs.length) {
    return (
      <section>
        <h4 className="font-semibold text-foreground mb-1">Återförsäljare / partners</h4>
        <p className="text-sm text-muted-foreground">
          Leverantören har inte angett några partners ännu. Söker ni en partner som kan hjälpa er att införa tillägget?{" "}
          <Link to={destination.to} className="text-primary underline underline-offset-2">
            {destination.label} →
          </Link>
        </p>
      </section>
    );
  }
  const names = slugs.map((slug) => partners.find((p) => p.slug === slug) || { slug, name: slug, is_featured: false });
  return (
    <section>
      <h4 className="font-semibold text-foreground mb-1">Återförsäljare / partners</h4>
      <div className="flex flex-wrap gap-1.5">
        {names.map((p) => {
          const basicPartner = basicPartners.find((partner) => partner.slug === p.slug);
          const profileUrl = p.is_featured
            ? `/partner/${p.slug}/`
            : basicPartner ? `/basic/${basicPartner.slug}/` : null;
          const badge = (
            <Badge variant="outline" className="text-[11px] bg-muted/50 text-foreground border-border">
              {basicPartner && !p.is_featured ? basicPartner.name : p.name}
            </Badge>
          );
          return profileUrl ? (
            <Link
              key={p.slug}
              to={profileUrl}
              className="rounded-sm underline underline-offset-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {badge}
            </Link>
          ) : <span key={p.slug}>{badge}</span>;
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-1">Angivet av leverantören.</p>
    </section>
  );
};

const SolutionDetail = ({
  s,
  onClose,
  vendor,
  onHelp,
}: {
  s: IsvSolution | null;
  onClose: () => void;
  vendor?: IsvVendorPublic;
  onHelp: (s: IsvSolution) => void;
}) => (
  <Dialog open={!!s} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 overflow-x-hidden">
      {s && (
        <>
          <DialogHeader className="relative text-left px-7 pt-8 pb-6 bg-[linear-gradient(135deg,hsl(30_14%_9%)_0%,hsl(24_20%_13%)_55%,hsl(14_60%_18%)_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.25),transparent_60%)]" />
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--primary-glow)))]" />
            <div className="relative flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-2 py-0.5 text-[11px] font-medium rounded border border-white/25 bg-white/10 text-white backdrop-blur-sm">
                {deliveryText(s)}
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium rounded border border-white/15 bg-white/5 text-white/80">
                {s.category}
              </span>
              {s.subcategory && (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded border border-white/15 bg-white/5 text-white/60">
                  {s.subcategory}
                </span>
              )}
            </div>
            <DialogTitle className="relative text-3xl font-['Playfair_Display'] font-semibold text-white">{s.name}</DialogTitle>
            <DialogDescription className="relative text-sm text-white/60">{s.vendor}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-7 py-6 text-sm leading-relaxed">
            <section aria-label="Informationsstatus för produkten" className="flex flex-wrap items-center gap-2">
              <InformationStatusBadge
                kind="isv"
                showDate
                partner={{ information_status: s.informationStatus, information_verified_at: s.lastVerifiedDate }}
              />
              <span className="text-xs text-muted-foreground">Gäller produkten. Leverantörens status visas separat nedan.</span>
            </section>
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
            <IsvResellers slugs={s.partnerSlugs || []} products={solutionProducts(s)} />
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
            <details
              className="rounded-lg border border-border bg-muted/30 p-4"
              onToggle={(e) => {
                if ((e.currentTarget as HTMLDetailsElement).open) {
                  trackIsv("isv_vendor_viewed", {
                    vendor_slug: s.vendorSlug || null,
                    information_status: isvInformationStatusOf(vendor?.information_status),
                    source_page: typeof window !== "undefined" ? window.location.pathname : null,
                  });
                }
              }}
            >
              <summary className="cursor-pointer font-semibold text-foreground">Om leverantören {vendor?.name || s.vendor}</summary>
              <div className="mt-3 space-y-2">
                <InformationStatusBadge
                  kind="isv"
                  showDate
                  partner={{ information_status: vendor?.information_status, information_verified_at: vendor?.last_verified_date }}
                />
                <p className="text-foreground/80">
                  {vendor?.description || "Leverantören har ännu inte beskrivit sin verksamhet på d365.se."}
                </p>
                <p className="text-xs text-muted-foreground">
                  Leverantörens och produktens status sätts var för sig. En verifierad leverantör gör inte produkten verifierad.
                </p>
              </div>
            </details>

            <section className="space-y-2 pt-3 border-t border-border" aria-label="Nästa steg">
              {s.vendorWebsite && (
                <Button asChild className="w-full h-auto min-h-10 whitespace-normal">
                  <a
                    href={withUtm(s.vendorWebsite)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackIsv("isv_product_selfservice_clicked", {
                        product_id: s.id,
                        vendor_slug: s.vendorSlug || null,
                        information_status: isvInformationStatusOf(s.informationStatus),
                        conversion_type: "self_service",
                      })
                    }
                  >
                    Besök produktens webbplats →
                  </a>
                </Button>
              )}
              <Button
                variant={s.vendorWebsite ? "outline" : "default"}
                className="w-full h-auto min-h-10 whitespace-normal"
                onClick={() => onHelp(s)}
              >
                Få hjälp att bedöma om lösningen passar →
              </Button>
              <p className="text-xs text-muted-foreground">
                Webbplatslänken skickar inga uppgifter om er. Ber ni om hjälp går underlaget bara till d365.se, inget skickas till leverantören.
              </p>
              <Button asChild variant="ghost" className="w-full h-auto min-h-10 whitespace-normal">
                <Link to={isvPartnerDestination(solutionProducts(s)).to}>{isvPartnerDestination(solutionProducts(s)).label} →</Link>
              </Button>
            </section>
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
