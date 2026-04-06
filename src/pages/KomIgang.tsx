import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Search, Check, Users, Loader2 } from "lucide-react";
import { allIndustries } from "@/data/partners";

// Industry images
import tillverkningImg from "@/assets/industries/tillverkning.webp";
import livsmedelsImg from "@/assets/industries/livsmedel.webp";
import handelDistributionImg from "@/assets/industries/handel-distribution.webp";
import detaljhandelImg from "@/assets/industries/detaljhandel.webp";
import konsultforetagImg from "@/assets/industries/konsultforetag.webp";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.webp";
import fastigheterImg from "@/assets/industries/fastigheter.webp";
import energiImg from "@/assets/industries/energi.webp";
import finansForsakringImg from "@/assets/industries/finans-forsakring.webp";
import lakemedelLifeScienceImg from "@/assets/industries/lakemedel-life-science.webp";
import itTechImg from "@/assets/industries/it-tech.webp";
import transportLogistikImg from "@/assets/industries/transport-logistik.webp";
import mediaPublishingImg from "@/assets/industries/media-publishing.webp";
import jordbrukSkogsbrukImg from "@/assets/industries/jordbruk-skogsbruk.webp";
import halsaSjukvardImg from "@/assets/industries/halsa-sjukvard.webp";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.webp";
import utbildningImg from "@/assets/industries/utbildning.webp";
import offentligSektorImg from "@/assets/industries/offentlig-sektor.webp";
import uthyrningImg from "@/assets/industries/uthyrning.webp";

const industryImages: Record<string, string> = {
  "Tillverkningsindustri": tillverkningImg,
  "Livsmedel & Processindustri": livsmedelsImg,
  "Grossist & Distribution": handelDistributionImg,
  "Retail & E-handel": detaljhandelImg,
  "Konsulttjänster": konsultforetagImg,
  "Bygg & Entreprenad": byggEntreprenadImg,
  "Fastighet & Förvaltning": fastigheterImg,
  "Energi & Utilities": energiImg,
  "Finans & Försäkring": finansForsakringImg,
  "Life Science / Medtech": lakemedelLifeScienceImg,
  "Telekom & IT-tjänster": itTechImg,
  "Logistik & Transport": transportLogistikImg,
  "Media & Publishing": mediaPublishingImg,
  "Jordbruk & Skogsbruk": jordbrukSkogsbrukImg,
  "Hälsa- & sjukvård": halsaSjukvardImg,
  "Non-profit / Organisationer": medlemsorganisationerImg,
  "Medlemsorganisationer": medlemsorganisationerImg,
  "Utbildning": utbildningImg,
  "Offentlig sektor": offentligSektorImg,
  "Uthyrningsverksamhet": uthyrningImg,
};
import { usePartners, DatabasePartner } from "@/hooks/usePartners";
import { supabase } from "@/integrations/supabase/client";
import PartnerCard from "@/components/PartnerCard";

// Step data
const applicationOptions = [
  { value: "Business Central", label: "Business Central", desc: "Komplett ERP för SMB (10–300 anställda)" },
  { value: "Finance & SCM", label: "Finance & Supply Chain", desc: "Enterprise ERP för globala koncerner" },
  { value: "Sales", label: "Sales (CRM)", desc: "Pipeline, leads och kundrelationer" },
  { value: "Customer Insights (Marketing)", label: "Marketing / Customer Insights", desc: "Kampanjer, segmentering och kunddata" },
  { value: "Customer Service", label: "Customer Service", desc: "Ärenden, SLA och supportflöden" },
  { value: "Field Service", label: "Field Service", desc: "Fälttekniker och arbetsorder" },
];

const geographyOptions = [
  { value: "Sverige", label: "Sverige" },
  { value: "Norden", label: "Norden" },
  { value: "Europa", label: "Europa" },
  { value: "Övriga världen", label: "Internationellt" },
];

const sizeOptions = [
  { value: "1-49", label: "1–49 anställda" },
  { value: "50-99", label: "50–99 anställda" },
  { value: "100-249", label: "100–249 anställda" },
  { value: "250-999", label: "250–999 anställda" },
  { value: "1.000-4.999", label: "1 000–4 999 anställda" },
  { value: ">5.000", label: "Mer än 5 000 anställda" },
];

type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

const getProductKey = (app: string): ProductKey | null => {
  if (app === "Business Central") return 'bc';
  if (app === "Finance & SCM") return 'fsc';
  if (["Sales", "Customer Insights (Marketing)"].includes(app)) return 'sales';
  if (["Customer Service", "Field Service", "Contact Center"].includes(app)) return 'service';
  return null;
};

const matchesDbProductFilter = (
  partner: DatabasePartner,
  productKey: ProductKey,
  industry?: string,
  companySize?: string,
  geography?: string
): boolean => {
  const productFilter = partner.product_filters?.[productKey];
  if (!productFilter) return false;
  if (industry && !productFilter.industries?.includes(industry)) return false;
  if (companySize && productFilter.companySize && !productFilter.companySize.includes(companySize)) return false;
  if (geography) {
    const partnerGeo = Array.isArray(productFilter.geography) ? productFilter.geography : (productFilter.geography ? [productFilter.geography] : ["Sverige"]);
    const hierarchy = ["Sverige", "Norden", "Europa", "Övriga världen", "Internationellt"];
    const selIdx = hierarchy.indexOf(geography);
    const maxIdx = Math.max(...partnerGeo.map((g: string) => hierarchy.indexOf(g)));
    if (maxIdx < selIdx) return false;
  }
  return true;
};

interface AiMatchResult {
  id: string;
  score: number;
  matchReason: string;
}

const TOTAL_STEPS = 4;

const KomIgang = () => {
  const navigate = useNavigate();
  const { data: partners = [], isLoading: partnersLoading } = usePartners();
  
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedApp, setSelectedApp] = useState("");
  const [selectedGeo, setSelectedGeo] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [matchedPartners, setMatchedPartners] = useState<DatabasePartner[]>([]);
  const [aiMatches, setAiMatches] = useState<AiMatchResult[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sort industries by number of partners (desc), then filter by search
  const sortedIndustries = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ind of allIndustries) {
      counts[ind] = partners.filter(p => p.industries?.includes(ind)).length;
    }
    return [...allIndustries].sort((a, b) => counts[b] - counts[a]);
  }, [partners]);

  const filteredIndustries = useMemo(() => {
    if (!industrySearch) return sortedIndustries;
    const q = industrySearch.toLowerCase();
    return sortedIndustries.filter(i => i.toLowerCase().includes(q));
  }, [industrySearch, sortedIndustries]);

  const canProceed = () => {
    if (step === 1) return !!selectedIndustry;
    if (step === 2) return !!selectedApp;
    if (step === 3) return !!selectedGeo;
    if (step === 4) return !!selectedSize;
    return false;
  };

  const stepLabels = [
    "Vilken bransch är ni verksamma inom?",
    "Vilken typ av lösning söker ni?",
    "Var är ni verksamma?",
    "Hur stort är ert företag?",
  ];

  const stepSubtexts = [
    "Vi använder detta för att hitta relevanta partners",
    "Vi matchar er med partners som är specialiserade på rätt applikation",
    "Vi filtrerar partners med lokal närvaro i ert område",
    "Vi föreslår partners som är vana vid er företagsstorlek",
  ];

  const findPartners = async () => {
    const productKey = getProductKey(selectedApp);
    if (!productKey) {
      setMatchedPartners([]);
      setShowResults(true);
      return;
    }

    const MIN = 3;
    const filter = (relaxInd: boolean, relaxGeo: boolean) =>
      partners.filter(p =>
        matchesDbProductFilter(
          p,
          productKey,
          relaxInd ? undefined : selectedIndustry || undefined,
          undefined,
          relaxGeo ? undefined : selectedGeo || undefined
        )
      );

    let result = filter(false, false);
    if (result.length < MIN) result = filter(true, false);
    if (result.length < MIN) result = filter(true, true);

    setMatchedPartners(result);
    setShowResults(true);

    // AI ranking
    if (result.length > 0) {
      setIsAiLoading(true);
      try {
        const payload = result.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          applications: p.applications || [],
          industries: p.industries || [],
          geography: p.geography || [],
          product_filters: p.product_filters || {},
        }));

        const { data, error } = await supabase.functions.invoke('match-partners', {
          body: {
            partners: payload,
            criteria: {
              application: selectedApp,
              productKey,
              industry: selectedIndustry,
              geography: selectedGeo,
              companySize: selectedSize,
            },
          },
        });

        if (!error && data?.matches) {
          const matches: AiMatchResult[] = data.matches;
          setAiMatches(matches);
          const scoreMap = new Map(matches.map(m => [m.id, m.score]));
          const sorted = [...result].sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0));
          setMatchedPartners(sorted);
        }
      } catch {
        // graceful degradation
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      findPartners();
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      setStep(TOTAL_STEPS);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const getAiMatch = (id: string) => aiMatches.find(m => m.id === id);

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Dina partnerförslag – d365.se" description="Anpassade partnerrekommendationer baserat på din verksamhet." canonicalPath="/kom-igang" />
        <Navbar />
        <main className="pt-16 pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {matchedPartners.length > 0 ? "Här är partners som matchar er" : "Inga exakta träffar"}
                </h1>
                <p className="text-muted-foreground mb-2">
                  {selectedApp} · {selectedIndustry} · {selectedGeo} · {selectedSize}
                </p>
                {isAiLoading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-primary mt-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI rangordnar partners...</span>
                  </div>
                )}
              </div>

              {matchedPartners.length > 0 ? (
                <div className="space-y-4">
                  {matchedPartners.map((partner, idx) => {
                    const aiMatch = getAiMatch(partner.id);
                    return (
                      <div key={partner.id} className="relative">
                        {aiMatch && aiMatch.score >= 50 && (
                          <div className="absolute -top-2 right-4 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                            {aiMatch.score}% match
                          </div>
                        )}
                        <PartnerCard partner={partner} profileUrl={`/partner/${partner.slug}`} highlightedProduct={selectedApp} highlightedIndustry={selectedIndustry} highlightedCompanySize={selectedSize} highlightedGeography={selectedGeo} />
                        {aiMatch?.matchReason && (
                          <p className="text-xs text-muted-foreground mt-1 ml-4 italic">{aiMatch.matchReason}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-6">Vi hittade inga partners som matchar exakt. Prova att bredda sökningen.</p>
                  <Button onClick={handleBack}>Ändra dina val</Button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Ändra urval
                </Button>
                <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                  <Link to="/kontakt/">Vill du ha hjälp? Kontakta oss</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Kom igång – Hitta rätt Dynamics 365-partner | d365.se"
        description="Besvara fyra snabba frågor och få matchade partnerrekommendationer för din Dynamics 365-implementation."
        canonicalPath="/kom-igang"
      />
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="relative pt-14 pb-4 sm:pt-16 sm:pb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-muted/80" />
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">
              Kom igång
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Vi ställer några snabba frågor och visar vilka partners som passar dig.</p>
          </div>
        </section>

        {/* Wizard */}
        <section className="flex-1 py-4 sm:py-6">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-sm font-semibold text-foreground">Steg {step}</span>
                <span className="text-sm text-muted-foreground">av {TOTAL_STEPS}</span>
                <div className="flex gap-1.5 ml-3">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        i + 1 === step ? "bg-primary" : i + 1 < step ? "bg-primary/50" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step heading */}
              <div className="text-center mb-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                  {stepLabels[step - 1]}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">{stepSubtexts[step - 1]}</p>
              </div>

              {/* Step 1: Industry */}
              {step === 1 && (
                <div>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Sök bransch..."
                      value={industrySearch}
                      onChange={(e) => setIndustrySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {filteredIndustries.map((ind) => {
                      const isSelected = selectedIndustry === ind;
                      const img = industryImages[ind];
                      return (
                        <button
                          key={ind}
                          onClick={() => setSelectedIndustry(ind)}
                          className={`relative group rounded-lg overflow-hidden border-2 transition-all aspect-[5/4] ${
                            isSelected
                              ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          {img && (
                            <img
                              src={img}
                              alt={ind}
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                          <div className={`absolute inset-0 transition-colors ${
                            isSelected ? "bg-primary/40" : "bg-black/45 group-hover:bg-black/35"
                          }`} />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-primary-foreground" />
                            </div>
                          )}
                          <span className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs sm:text-sm font-semibold text-center leading-tight">
                            {ind}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Application */}
              {step === 2 && (
                <div className="space-y-2">
                  {applicationOptions.map((app) => (
                    <button
                      key={app.value}
                      onClick={() => setSelectedApp(app.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                        selectedApp === app.value
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/30"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 ${
                        selectedApp === app.value ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}>
                        {selectedApp === app.value && <Check className="h-4 w-4" />}
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-medium">{app.label}</span>
                        <p className="text-xs text-muted-foreground">{app.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Geography */}
              {step === 3 && (
                <div className="space-y-2">
                  {geographyOptions.map((geo) => (
                    <button
                      key={geo.value}
                      onClick={() => setSelectedGeo(geo.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                        selectedGeo === geo.value
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/30"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 ${
                        selectedGeo === geo.value ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}>
                        {selectedGeo === geo.value && <Check className="h-4 w-4" />}
                      </div>
                      <span className="text-sm sm:text-base">{geo.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: Company size */}
              {step === 4 && (
                <div className="space-y-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                        selectedSize === size.value
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/30"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 ${
                        selectedSize === size.value ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}>
                        {selectedSize === size.value && <Check className="h-4 w-4" />}
                      </div>
                      <span className="text-sm sm:text-base">{size.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bottom navigation */}
        <div className="border-t border-border bg-background py-4">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Tillbaka
              </button>

              {step < TOTAL_STEPS && (
                <span className="text-sm text-primary">
                  steg {step + 1} väntar... <ArrowRight className="inline h-3 w-3" />
                </span>
              )}
            </div>
            <div className="max-w-2xl mx-auto mt-4 text-center">
              <Button
                onClick={handleNext}
                disabled={!canProceed() || partnersLoading}
                size="lg"
                className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white text-base h-12 px-10 rounded-lg shadow-lg disabled:opacity-50"
              >
                {step === TOTAL_STEPS ? (
                  partnersLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Laddar...</>
                  ) : (
                    "Visa partners"
                  )
                ) : (
                  <>Kom igång <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default KomIgang;
