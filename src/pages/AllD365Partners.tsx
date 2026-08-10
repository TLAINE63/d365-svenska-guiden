import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Users, CheckCircle2 } from "lucide-react";
import { usePartners } from "@/hooks/usePartners";
import TrustBanner from "@/components/TrustBanner";
import { useUnprofiledPartners } from "@/hooks/useUnprofiledPartners";
import { useAllPartnerNames } from "@/hooks/useAllPartnerNames";
import { useBasicPartners, PRODUCT_LABEL, PRODUCT_ORDER } from "@/hooks/useBasicPartners";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import partnerDataJson from "@/data/partnerData.json";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Övriga Dynamics 365-partners", url: "https://d365.se/alla-d365-partners" },
];

// Static snapshot of featured partners (built into the bundle so the
// prerendered HTML always lists every profiled partner without requiring
// client-side JavaScript or a network round-trip).
const STATIC_PROFILED = (partnerDataJson as any[])
  .filter((p) => p.is_featured !== false)
  .map((p) => ({
    id: p.id as string,
    slug: p.slug as string,
    name: p.name as string,
    logo_url: (p.logo_url ?? null) as string | null,
    applications: (p.applications ?? []) as string[],
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "sv"));

export default function AllD365Partners() {
  const { data: dbPartners } = usePartners();
  const { data: unprofiled } = useUnprofiledPartners();
  const { data: allNames } = useAllPartnerNames();
  const { data: basicPartners } = useBasicPartners();

  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState<"all" | "bc" | "fsc" | "sales" | "service">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const q = query.trim().toLowerCase();

  const productMatchTokens: Record<Exclude<typeof productFilter, "all">, string[]> = {
    bc: ["business central", "bc"],
    fsc: ["finance", "supply chain", "f&sc", "fsc", "f&o"],
    sales: ["sales", "marketing", "crm"],
    service: ["service", "field service", "contact center"],
  };

  const profiledAll = useMemo(() => {
    const live = (dbPartners || [])
      .filter((p) => p.is_featured)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        logo_url: p.logo_url || null,
        applications: p.applications ?? [],
      }));
    const source = live.length > 0 ? live : STATIC_PROFILED;
    return [...source].sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }, [dbPartners]);

  const profiled = useMemo(() => {
    return profiledAll.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (productFilter !== "all") {
        const tokens = productMatchTokens[productFilter];
        const hay = p.applications.join(" ").toLowerCase();
        if (!tokens.some((t) => hay.includes(t))) return false;
      }
      return true;
    });
  }, [profiledAll, q, productFilter]);

  const basicFiltered = useMemo(() => {
    if (verifiedOnly) return [];
    return (basicPartners || []).filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (productFilter !== "all" && !p.observed_products?.[productFilter]) return false;
      return true;
    });
  }, [basicPartners, q, productFilter, verifiedOnly]);


  const others = useMemo(() => {
    if (verifiedOnly) return [];
    const basicNames = new Set(
      (basicPartners || []).map((p) => p.name.trim().toLowerCase()),
    );
    const items: { id: string; name: string }[] = [];
    (allNames || [])
      .filter((p) => !p.is_featured)
      .filter((p) => !basicNames.has(p.name.trim().toLowerCase()))
      .forEach((p) => items.push({ id: `db-${p.id}`, name: p.name }));
    (unprofiled || [])
      .filter((p) => !basicNames.has(p.name.trim().toLowerCase()))
      .forEach((p) => items.push({ id: `up-${p.id}`, name: p.name }));
    const seen = new Set<string>();
    const deduped = items.filter((it) => {
      const key = it.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    deduped.sort((a, b) => a.name.localeCompare(b.name, "sv"));
    // Others have no product data → hidden when a specific product filter is active.
    if (productFilter !== "all") return [];
    if (q) return deduped.filter((it) => it.name.toLowerCase().includes(q));
    return deduped;
  }, [allNames, unprofiled, basicPartners, q, productFilter, verifiedOnly]);

  const totalMarket =
    profiledAll.length + (basicPartners?.length ?? 0);

  const filteredTotal = profiled.length + basicFiltered.length + others.length;
  const isFiltering = q.length > 0 || productFilter !== "all" || verifiedOnly;


  const productOptions: { key: "all" | "bc" | "fsc" | "sales" | "service"; label: string }[] = [
    { key: "all", label: "Alla produkter" },
    { key: "bc", label: "Business Central" },
    { key: "fsc", label: "Finance & Supply Chain" },
    { key: "sales", label: "Sales & Marketing" },
    { key: "service", label: "Service" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Övriga Dynamics 365-partners i Sverige"
        description="Hitta Dynamics 365-partners i Sverige. Profilerade leverantörer och övriga aktörer på d365.se – köparsidig vägledning."
        canonicalPath="/alla-d365-partners/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      <main className="pt-10">
        {/* Hero */}
        <section className="py-8 sm:py-12 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Users className="w-3.5 h-3.5" /> Marknadskarta
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Övriga Dynamics 365-partners på den svenska marknaden
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-5">
              Här hittar ni övriga Dynamics 365-partners på den svenska marknaden – både profilerade leverantörer på d365.se och andra aktörer vi känner till. Vill ni veta mer om någon eller få hjälp att smalna ner kortlistan, hör av er.
            </p>
            {totalMarket > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/10">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {profiledAll.length} profilerade partners
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  {(basicPartners?.length ?? 0)} basickort · {profiledAll.length + (basicPartners?.length ?? 0)} i marknadskartan
                </Badge>
              </div>
            )}
          </div>
        </section>

        {/* Search & filter */}
        <section className="py-6 border-b border-border bg-background sticky top-16 z-20 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Sök partner på namn…"
                  className="pl-9 pr-9 h-11"
                  aria-label="Sök partner"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Rensa sök"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {productOptions.map((opt) => {
                  const active = productFilter === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setProductFilter(opt.key)}
                      className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/40"
                      }`}
                      aria-pressed={active}
                    >
                      {opt.label}
                    </button>
                  );
                })}
                <VerifiedOnlyToggle
                  checked={verifiedOnly}
                  onChange={setVerifiedOnly}
                  count={profiled.length}
                />
                {isFiltering && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setProductFilter("all");
                      setVerifiedOnly(false);
                    }}
                    className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  >
                    Rensa filter
                  </button>
                )}
              </div>
              {isFiltering && (
                <p className="text-xs text-muted-foreground" aria-live="polite">
                  Visar {filteredTotal} träff{filteredTotal === 1 ? "" : "ar"}
                  {productFilter !== "all" && " (endast partners med produktdata visas när produktfilter är aktivt)"}
                </p>
              )}
            </div>
          </div>
        </section>





        {/* Profiled partners */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Profilerade partners på d365.se
              </h2>
              <p className="text-sm text-muted-foreground">
                Dessa partners har egna profilsidor med fördjupad info om kompetens,
                branscher, referenser och kontakt.
              </p>
            </div>
            {profiledAll.length === 0 ? (
              <p className="text-sm text-muted-foreground">Laddar…</p>
            ) : profiled.length === 0 ? (
              <p className="text-sm text-muted-foreground">Inga profilerade partners matchar filtret.</p>
            ) : (
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {profiled.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/partner/${p.slug}`}
                      aria-label={p.name}
                      className="group relative flex items-center justify-between gap-3 p-4 rounded-lg border-2 border-primary/25 bg-card shadow-sm hover:border-primary hover:shadow-md transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        {p.logo_url ? (
                          <img
                            src={p.logo_url}
                            alt={`${p.name} logotyp`}
                            loading="lazy"
                            className="h-10 max-w-[160px] object-contain mb-2"
                          />
                        ) : (
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate mb-2">
                            {p.name}
                          </div>
                        )}
                        {p.applications.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {p.applications.slice(0, 3).map((app) => (
                              <Badge
                                key={app}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 border-primary/30 text-primary bg-primary/5"
                              >
                                {app}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Basic partners: compact list linking to detail cards */}
        {basicFiltered.length > 0 && (
          <section className="py-8 sm:py-12 bg-secondary/40 border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Övriga D365-partners – Basickort
                </h2>
                <p className="text-sm text-muted-foreground max-w-3xl">
                  Dessa partners har ännu inte en egen profil på d365.se. Vi visar
                  observerad data (branscher, produktområden, orter) sammanställd
                  från publika källor – för att ge en realistisk bild av marknaden.
                  Klicka på ett namn för att se detaljer.
                </p>
              </div>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {basicFiltered.map((p) => {
                  const basicProducts = PRODUCT_ORDER.filter(
                    (k) => p.observed_products?.[k],
                  );
                  return (
                    <li key={p.id}>
                      <Link
                        to={`/basic/${p.slug}/`}
                        className="group relative flex items-center justify-between gap-3 p-4 rounded-lg border border-dashed border-border bg-card hover:border-muted-foreground/40 hover:shadow-sm transition-all"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {p.name}
                          </div>
                          {basicProducts.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {basicProducts.map((k) => (
                                <Badge
                                  key={k}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 border-accent/30 text-accent bg-accent/5"
                                >
                                  {PRODUCT_LABEL[k]}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center">
                          <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>

                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* Legacy "others" (curated names without observed data yet) */}
        {others.length > 0 && (
          <section className="py-8 sm:py-12 border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Övriga aktörer på marknaden
                </h2>
                <p className="text-sm text-muted-foreground max-w-3xl">
                  Partners vi känner till men där vi ännu inte har sammanställt
                  observerad data. Hör av dig om du vill veta mer.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
                {others.map((p) => (
                  <Badge
                    key={p.id}
                    variant="outline"
                    className="text-sm sm:text-base px-3 py-1.5 bg-card text-foreground border-border font-medium"
                  >
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Vill du ha hjälp att hitta rätt partner?
            </h2>
            <p className="text-base text-muted-foreground mb-6">
              Vi vägleder dig köparsidigt och kostnadsfritt – berätta vad du behöver
              så återkopplar vi med 2–3 lämpliga partners att jämföra.
            </p>
            <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
              <Link to="/kontakt/">
                <MessageSquare className="w-4 h-4 mr-2" />
                Kontakta oss för matchning
              </Link>
            </Button>
          </div>
        </section>
        <TrustBanner variant="compact" />

      </main>

      <Footer />
    </div>
  );
}
