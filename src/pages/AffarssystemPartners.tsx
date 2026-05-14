import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterButtons } from "@/components/FilterButtons";
import PartnerCard from "@/components/PartnerCard";
import LeadCTA from "@/components/LeadCTA";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { allIndustries, companySizes, geographyOptions } from "@/data/partners";
import { usePartners, type DatabasePartner } from "@/hooks/usePartners";

type SystemKey = "all" | "bc" | "fsc";

const systemOptions: { label: string; value: SystemKey }[] = [
  { label: "Alla affärssystem", value: "all" },
  { label: "Business Central", value: "bc" },
  { label: "Finance & SCM", value: "fsc" },
];

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Affärssystem", url: "https://d365.se/affarssystem" },
  { name: "Partners", url: "https://d365.se/affarssystem/partners" },
];

const geoHierarchy = ["Sverige", "Norden", "Europa", "Övriga världen", "Internationellt"];

const AffarssystemPartners = () => {
  const { data: dbPartners, isLoading } = usePartners();

  const [selectedSystem, setSelectedSystem] = useState<SystemKey>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGeography, setSelectedGeography] = useState<string | null>(null);

  const partners = useMemo(
    () => (dbPartners || []).filter((p) => p.is_featured === true),
    [dbPartners]
  );

  const sessionSeed = useMemo(() => Math.floor(Math.random() * 1_000_000), []);

  const matches = (partner: DatabasePartner, key: "bc" | "fsc"): boolean => {
    const pf = partner.product_filters?.[key];
    if (!pf) return false;
    if (selectedIndustry && !pf.industries?.includes(selectedIndustry)) return false;
    if (selectedSize && pf.companySize?.length && !pf.companySize.includes(selectedSize)) return false;
    if (selectedGeography) {
      const partnerGeo = Array.isArray(pf.geography) && pf.geography.length
        ? pf.geography
        : ["Sverige"];
      const selIdx = geoHierarchy.indexOf(selectedGeography);
      const maxPartnerIdx = Math.max(...partnerGeo.map((g) => geoHierarchy.indexOf(g)));
      if (maxPartnerIdx < selIdx) return false;
    }
    return true;
  };

  const filteredPartners = useMemo(() => {
    const keys: ("bc" | "fsc")[] =
      selectedSystem === "bc" ? ["bc"] : selectedSystem === "fsc" ? ["fsc"] : ["bc", "fsc"];

    const result = partners.filter((p) => keys.some((k) => matches(p, k)));

    // Seeded shuffle for fair exposure
    const shuffled = [...result];
    let seed = sessionSeed;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partners, selectedSystem, selectedIndustry, selectedSize, selectedGeography, sessionSeed]);

  const productKeyForCard = (partner: DatabasePartner): "bc" | "fsc" =>
    selectedSystem === "fsc" ? "fsc" : selectedSystem === "bc" ? "bc" : matches(partner, "bc") ? "bc" : "fsc";

  const productLabel = (k: "bc" | "fsc") => (k === "bc" ? "Business Central" : "Finance & SCM");

  const hasActiveFilter = selectedIndustry || selectedSize || selectedGeography || selectedSystem !== "all";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Affärssystem-partners – jämför certifierade Microsoft-partners | d365.se"
        description="Hitta rätt Business Central- eller Finance & SCM-partner. Filtrera på bransch, företagsstorlek och geografi. Neutralt och kostnadsfritt."
        canonicalUrl="https://d365.se/affarssystem/partners/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-10 sm:pt-28 sm:pb-14 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="text-xs text-muted-foreground mb-4" aria-label="Brödsmulor">
            <Link to="/" className="hover:text-foreground">Hem</Link>
            <span className="mx-2">/</span>
            <Link to="/affarssystem/" className="hover:text-foreground">Affärssystem</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Partners</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Affärssystem-partners
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
            Certifierade Microsoft-partners för <strong>Business Central</strong> och{" "}
            <strong>Finance & Supply Chain Management</strong>. Filtrera på bransch, företagsstorlek
            och geografi – och gå rakt in på varje partners profil. Ingen sortering är köpt.
          </p>
        </div>
      </section>

      {/* Filters + results */}
      <section className="py-10 sm:py-14 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6">
          <FilterButtons
            title="Affärssystem"
            icon="application"
            options={systemOptions.map((s) => ({ label: s.label, value: s.value }))}
            selectedValue={selectedSystem}
            onSelect={(v) => setSelectedSystem((v as SystemKey) || "all")}
            colorScheme="erp"
          />

          <FilterButtons
            title="Filtrera på bransch"
            icon="industry"
            options={allIndustries.map((i) => ({ label: i, value: i }))}
            selectedValue={selectedIndustry}
            onSelect={setSelectedIndustry}
            colorScheme="erp"
          />

          <FilterButtons
            title="Filtrera på företagsstorlek (antal anställda)"
            icon="employees"
            options={companySizes.map((s) => ({ label: s, value: s }))}
            selectedValue={selectedSize}
            onSelect={setSelectedSize}
            colorScheme="erp"
          />

          <FilterButtons
            title="Geografisk räckvidd"
            icon="geography"
            options={geographyOptions
              .filter((g) => geoHierarchy.includes(g))
              .map((g) => ({ label: g, value: g }))}
            selectedValue={selectedGeography}
            onSelect={setSelectedGeography}
            colorScheme="erp"
          />

          {hasActiveFilter && (
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-semibold text-foreground">{filteredPartners.length}</span> partners
                {selectedSystem !== "all" && (
                  <> för <span className="font-semibold text-foreground">{selectedSystem === "bc" ? "Business Central" : "Finance & SCM"}</span></>
                )}
                {selectedIndustry && <> inom <span className="font-semibold text-foreground">{selectedIndustry}</span></>}
                {selectedSize && <> · storlek <span className="font-semibold text-foreground">{selectedSize}</span></>}
                {selectedGeography && <> · täckning <span className="font-semibold text-foreground">{selectedGeography}</span></>}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedSystem("all");
                  setSelectedIndustry(null);
                  setSelectedSize(null);
                  setSelectedGeography(null);
                }}
                className="mt-2 text-muted-foreground hover:text-foreground"
              >
                Rensa alla filter
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => {
                  const pk = productKeyForCard(partner);
                  const params = new URLSearchParams();
                  params.set("product", productLabel(pk));
                  if (selectedIndustry) params.set("industry", selectedIndustry);
                  if (selectedGeography) params.set("geography", selectedGeography);
                  const profileUrl = `/partner/${partner.slug}?${params.toString()}`;

                  return (
                    <PartnerCard
                      key={partner.id}
                      partner={partner}
                      profileUrl={profileUrl}
                      colorScheme="erp"
                      productKey={pk}
                      highlightedProduct={productLabel(pk)}
                      highlightedIndustry={selectedIndustry || undefined}
                      highlightedGeography={selectedGeography || undefined}
                      showRandomIndicator={true}
                    />
                  );
                })}
              </div>

              {filteredPartners.length === 0 && (
                <div className="text-center py-10">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Inga partners matchar din kombination
                  </h3>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Testa att rensa något filter, eller kontakta oss så hjälper vi dig att
                    handplocka 2–3 partners som passar din verksamhet.
                  </p>
                </div>
              )}
            </>
          )}

          {hasActiveFilter && filteredPartners.length > 0 && (
            <div className="max-w-xl mx-auto mt-12">
              <article className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
                <div className="relative p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Vill du att vi handplockar 2–3 partners åt dig?
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base mb-5">
                    Helt kostnadsfritt och utan säljpress. Vi tar inte betalt av dig som söker.
                  </p>
                  <div className="mb-5 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">
                      Din sökning
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/40 text-white border-primary/50 py-1.5 px-3">
                        {selectedSystem === "all" ? "Affärssystem" : selectedSystem === "bc" ? "Business Central" : "Finance & SCM"}
                      </Badge>
                      {selectedIndustry && (
                        <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3">{selectedIndustry}</Badge>
                      )}
                      {selectedSize && (
                        <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3">{selectedSize} anst.</Badge>
                      )}
                      {selectedGeography && (
                        <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3">{selectedGeography}</Badge>
                      )}
                    </div>
                  </div>
                  <LeadCTA
                    sourcePage="affarssystem-partners"
                    selectedProduct={selectedSystem === "fsc" ? "Finance & SCM" : "Business Central"}
                    selectedIndustry={selectedIndustry || undefined}
                    variant="inline"
                  />
                </div>
              </article>
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/valj-partner/">
                Se alla D365-partners (alla applikationer)
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AffarssystemPartners;
