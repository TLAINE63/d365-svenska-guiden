import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2, ExternalLink, Mail, HelpCircle, FileText, Users } from "lucide-react";
import { allIndustries } from "@/data/partners";
import { getSizeMatchBonus } from "@/hooks/usePartnerFilters";

// Product icons
import bcIcon from "@/assets/icons/BusinessCentral-new.webp";
import financeIcon from "@/assets/icons/Finance.svg";
import salesIcon from "@/assets/icons/Sales.svg";
import marketingIcon from "@/assets/icons/Marketing.svg";
import csIcon from "@/assets/icons/CustomerService.svg";
import fsIcon from "@/assets/icons/FieldService.svg";
import ccIcon from "@/assets/icons/ContactCenter.svg";
import poIcon from "@/assets/icons/ProjectOperations.svg";

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

// Step 2: Product options
const productOptions = [
  { value: "Business Central", label: "Business Central", desc: "ERP för små och medelstora företag", icon: bcIcon },
  { value: "Finance & SCM", label: "Finance & Supply Chain", desc: "ERP för större organisationer", icon: financeIcon },
  { value: "Sales", label: "Sales", desc: "CRM för försäljning och pipeline", icon: salesIcon },
  { value: "Customer Insights (Marketing)", label: "Marketing", desc: "Marketing automation och kunddata", icon: marketingIcon },
  { value: "Customer Service", label: "Customer Service", desc: "Ärendehantering och support", icon: csIcon },
  { value: "Field Service", label: "Field Service", desc: "Fältservice och arbetsorder", icon: fsIcon },
  { value: "Contact Center", label: "Contact Center", desc: "Omnikanal-kontaktcenter", icon: ccIcon },
  { value: "Project Operations", label: "Project Operations", desc: "Projekthantering och resursplanering", icon: poIcon },
  { value: "", label: "Vet inte ännu", desc: "Vi hjälper dig hitta rätt", icon: null },
];

// Step 3: Goal options
const goalOptions = [
  { value: "erp", label: "Införa eller byta affärssystem (ERP)" },
  { value: "sales", label: "Förbättra försäljningsprocessen" },
  { value: "marketing", label: "Införa marketing automation" },
  { value: "service", label: "Effektivisera kundservice" },
  { value: "contact-center", label: "Utvärdera Contact Center-lösningar" },
  { value: "field-service", label: "Förbättra fältservice" },
  { value: "unsure", label: "Jag är osäker – Lite av varje behöver förbättras" },
];

// Step 4: Situation options
const situationOptions = [
  { value: "new", label: "Utvärderar nytt system" },
  { value: "evaluate-partners", label: "Vill utvärdera partners" },
  { value: "improve", label: "Vill vidareutveckla befintlig lösning" },
  { value: "unsure", label: "Osäker" },
];

// Step 5: Complexity / verksamhet options (expanded)
const complexityOptions = [
  { value: "standard", label: "Relativt standardiserad verksamhet", desc: "Enklare processer inom ekonomi, order och lager" },
  { value: "growing", label: "Växande bolag med ökande krav", desc: "Behöver bättre struktur, kontroll och uppföljning" },
  { value: "multi-entity", label: "Flera bolag eller verksamheter", desc: "Koncern, flera juridiska enheter eller länder" },
  { value: "manufacturing", label: "Tillverkning eller avancerad logistik", desc: "Produktion, planering eller komplexa flöden" },
  { value: "integrations", label: "Höga krav på integrationer", desc: "Många system som behöver hänga ihop" },
  { value: "consulting", label: "Konsultverksamhet", desc: "Projektbaserad verksamhet med resurs- och uppdragshantering" },
  { value: "time-reporting", label: "Tidrapportering och debitering", desc: "Tid- och kostnadsuppföljning per projekt och kund" },
  { value: "customer-service", label: "Kundservice och ärendehantering", desc: "Support, SLA:er och ärendeflöden" },
  { value: "field-service", label: "Fältservice och arbetsorder", desc: "Mobila team, schemaläggning och arbetsorder" },
  { value: "contact-center", label: "Contact Center", desc: "Omnikanal-kommunikation och köhantering" },
  { value: "sales-crm", label: "Försäljning och CRM", desc: "Pipeline, offerter och kundhantering" },
  { value: "marketing-automation", label: "Marketing och kampanjer", desc: "Automatiserade kundresor och segmentering" },
  { value: "unsure", label: "Osäker – behöver vägledning", desc: "Vi hjälper dig välja rätt nivå" },
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
): boolean => {
  const productFilter = partner.product_filters?.[productKey];
  if (!productFilter) return false;
  if (industry && !productFilter.industries?.includes(industry)) return false;
  return true;
};

interface AiMatchResult {
  id: string;
  score: number;
  matchReason: string;
  bullets?: string[];
}

const TOTAL_STEPS = 6;

// Step 6: Company size — short, friendly labels mapped to the canonical buckets
const sizeOptions: { value: string; label: string; desc: string }[] = [
  { value: "1-49", label: "1–49 anställda", desc: "Mindre bolag" },
  { value: "50-99", label: "50–99 anställda", desc: "SMB" },
  { value: "100-249", label: "100–249 anställda", desc: "Medelstora bolag" },
  { value: "250-999", label: "250–999 anställda", desc: "Större bolag" },
  { value: "1.000-4.999", label: "1 000–4 999 anställda", desc: "Stort företag / koncern" },
  { value: ">5.000", label: "Fler än 5 000 anställda", desc: "Global koncern" },
];

const KomIgang = () => {
  const navigate = useNavigate();
  const { data: partners = [] } = usePartners();

  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedSituations, setSelectedSituations] = useState<string[]>([]);
  const [selectedComplexities, setSelectedComplexities] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [matchedPartners, setMatchedPartners] = useState<DatabasePartner[]>([]);
  const [aiMatches, setAiMatches] = useState<AiMatchResult[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const sortedIndustries = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ind of allIndustries) {
      counts[ind] = partners.filter(p => p.industries?.includes(ind)).length;
    }
    return [...allIndustries].sort((a, b) => counts[b] - counts[a]);
  }, [partners]);

  const selectedApp = selectedProduct || "";

  const stepLabels = [
    "Vilken bransch är ni verksamma inom?",
    "Vilken Dynamics 365-produkt är ni intresserade av?",
    "Vad vill du förbättra?",
    "Var befinner ni er idag?",
    "Hur ser er verksamhet ut?",
    "Hur stor är er organisation?",
  ];

  const stepSubtexts = [
    "Vi använder detta för att hitta relevanta partners",
    "Välj den produkt som passar bäst eller hoppa över om ni inte vet",
    "",
    "",
    "Detta hjälper oss avgöra vilken nivå av lösning och partner som passar",
    "Vi prioriterar partners med erfarenhet av organisationer i er storlek — hoppa över om du är osäker",
  ];

  const findPartners = async () => {
    const productKey = selectedApp ? getProductKey(selectedApp) : null;

    let result: DatabasePartner[];
    if (!productKey) {
      // "Osäker" - return all partners with any product filter, sorted by number of industries matched
      result = partners.filter(p => p.product_filters && Object.keys(p.product_filters).length > 0);
    } else {
      const MIN = 3;
      const filter = (relaxInd: boolean) =>
        partners.filter(p =>
          matchesDbProductFilter(p, productKey, relaxInd ? undefined : selectedIndustry || undefined)
        );
      result = filter(false);
      if (result.length < MIN) result = filter(true);
    }

    // Apply soft size bonus locally so partners matching the chosen size float up
    // even before AI rerank. Falls back to neutral when no size selected.
    const applyLocalSizeBonus = (list: DatabasePartner[]) => {
      if (!selectedSize || !productKey) return list;
      return [...list].sort((a, b) => {
        const ba = getSizeMatchBonus(a, productKey, selectedSize, null);
        const bb = getSizeMatchBonus(b, productKey, selectedSize, null);
        return bb - ba;
      });
    };

    result = applyLocalSizeBonus(result);

    // Limit to max 4
    setMatchedPartners(result.slice(0, 4));
    setShowResults(true);

    if (result.length > 0) {
      setIsAiLoading(true);
      try {
        const payload = result.slice(0, 8).map(p => ({
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
              application: selectedApp || "Alla",
              industry: selectedIndustry,
              companySize: selectedSize || "",
              situation: selectedSituations.map(s => situationOptions.find(o => o.value === s)?.label).filter(Boolean).join(", ") || "",
              complexity: selectedComplexities.map(c => complexityOptions.find(o => o.value === c)?.label).filter(Boolean).join(", ") || "",
            },
          },
        });

        if (!error && data?.matches) {
          const matches: AiMatchResult[] = data.matches;
          setAiMatches(matches);
          const scoreMap = new Map(matches.map(m => [m.id, m.score]));
          const sorted = [...result].sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0));
          setMatchedPartners(sorted.slice(0, 4));
        }
      } catch {
        // graceful degradation
      } finally {
        setIsAiLoading(false);
      }
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

  // Results page
  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Dina partnerförslag – d365.se" description="Anpassade partnerrekommendationer baserat på din verksamhet." canonicalPath="/kom-igang" />
        <Navbar />
        <main className="pt-16 pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {matchedPartners.length > 0 ? "Här är partners som borde passa din situation" : "Inga exakta träffar"}
                </h1>
                <p className="text-sm text-muted-foreground">Baserat på dina svar</p>
                {isAiLoading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-primary mt-3">
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
                      <div
                        key={partner.id}
                        className="relative rounded-xl border-2 p-5 transition-all border-border bg-card"
                      >

                        <div className="flex items-start gap-4">
                          {partner.logo_url && (
                            <img
                              src={partner.logo_url}
                              alt={partner.name || ""}
                              className="w-14 h-14 object-contain rounded-lg bg-white border border-border p-1 flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-foreground">{partner.name}</h3>
                            {aiMatch?.matchReason && (
                              <p className="text-sm text-muted-foreground mt-1">{aiMatch.matchReason}</p>
                            )}
                            {aiMatch?.bullets && aiMatch.bullets.length > 0 ? (
                              <ul className="mt-2 space-y-1">
                                {aiMatch.bullets.map((b, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : partner.description ? (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{partner.description}</p>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          {partner.website && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={partner.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                Besök
                              </a>
                            </Button>
                          )}
                          {partner.email && (
                            <Button size="sm" asChild>
                              <a href={`mailto:${partner.email}`}>
                                <Mail className="h-3.5 w-3.5 mr-1.5" />
                                Kontakta
                              </a>
                            </Button>
                          )}
                          {partner.slug && (
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/partner/${partner.slug}`}>Läs mer</Link>
                            </Button>
                          )}
                        </div>
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

              {/* Requirements Spec CTA */}
              {(() => {
                const specMap: Record<string, { path: string; label: string }> = {
                  sales: { path: "/kravspecifikation-sales/", label: "Skapa kravspec för Försäljning" },
                  marketing: { path: "/kravspecifikation-marketing/", label: "Skapa kravspec för Marketing" },
                  service: { path: "/kravspecifikation-kundservice/", label: "Skapa kravspec för Kundservice" },
                  "contact-center": { path: "/kravspecifikation-kundservice/", label: "Skapa kravspec för Kundservice" },
                  erp: { path: "/kravspecifikation/", label: "Skapa kravspec för ERP" },
                };
                const spec = selectedGoals.map(g => specMap[g]).find(Boolean);
                if (!spec) return null;
                return (
                  <div className="mt-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-semibold text-foreground">Vill du skapa en kravspecifikation baserat på dina svar?</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Definiera dina krav och få ett strukturerat underlag att skicka till partners.
                    </p>
                    <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                      <Link to={spec.path}>
                        <FileText className="h-4 w-4 mr-2" />
                        {spec.label}
                      </Link>
                    </Button>
                  </div>
                );
              })()}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
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
                {stepSubtexts[step - 1] && (
                  <p className="text-xs sm:text-sm text-muted-foreground">{stepSubtexts[step - 1]}</p>
                )}
              </div>

              {/* Navigation buttons above content */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  {step > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Föregående
                    </button>
                  )}
                </div>
                <div>
                  {step === 3 && (
                    <Button onClick={() => setStep(4)} disabled={selectedGoals.length === 0} size="sm" className="px-6">
                      Nästa
                    </Button>
                  )}
                  {step === 4 && (
                    <Button onClick={() => setStep(5)} disabled={selectedSituations.length === 0} size="sm" className="px-6">
                      Nästa
                    </Button>
                  )}
                  {step === 5 && (
                    <Button onClick={() => findPartners()} disabled={selectedComplexities.length === 0} size="sm" className="px-6">
                      Visa partners
                    </Button>
                  )}
                </div>
              </div>

              {step === 1 && (
                <div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {sortedIndustries.map((ind) => {
                      const isSelected = selectedIndustry === ind;
                      const img = industryImages[ind];
                      return (
                        <button
                          key={ind}
                          onClick={() => {
                            setSelectedIndustry(ind);
                            setTimeout(() => setStep(2), 250);
                          }}
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
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                          <span className="absolute bottom-0 left-0 right-0 px-1 py-1.5 text-white text-[10px] sm:text-xs font-semibold text-center leading-tight">
                            {ind}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Product */}
              {step === 2 && (
                <div className="grid grid-cols-3 gap-2">
                  {productOptions.map((opt) => {
                    const isSelected = selectedProduct === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSelectedProduct(opt.value);
                          setTimeout(() => setStep(3), 250);
                        }}
                        className={`flex flex-col items-center justify-center text-center px-3 py-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        {opt.icon ? (
                          <img src={opt.icon} alt={opt.label} className="w-10 h-10 object-contain mb-2" />
                        ) : (
                          <HelpCircle className="w-10 h-10 text-muted-foreground mb-2" />
                        )}
                        <span className="text-sm font-semibold text-foreground leading-tight">{opt.label}</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{opt.desc}</span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 3: Goal (multi-select) */}
              {step === 3 && (
                <div>
                  <div className="space-y-2">
                    {goalOptions.map((opt) => {
                      const isSelected = selectedGoals.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedGoals(prev =>
                              prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value]
                            );
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Situation (multi-select) */}
              {step === 4 && (
                <div>
                  <div className="space-y-2">
                    {situationOptions.map((opt) => {
                      const isSelected = selectedSituations.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedSituations(prev =>
                              prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value]
                            );
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Verksamhet (multi-select, two columns) */}
              {step === 5 && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {complexityOptions.map((opt) => {
                      const isSelected = selectedComplexities.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedComplexities(prev =>
                              prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value]
                            );
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-medium leading-tight block">{opt.label}</span>
                            <p className="text-xs text-muted-foreground leading-tight">{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default KomIgang;
