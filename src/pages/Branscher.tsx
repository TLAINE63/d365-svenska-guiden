import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { ChevronRight, Sparkles } from "lucide-react";
import { useCoveredIndustries } from "@/hooks/useCoveredIndustries";
import { usePartners } from "@/hooks/usePartners";
import { collectPartnerIndustries } from "@/lib/partnerIndustries";
import { FilterButtons } from "@/components/FilterButtons";
import { companySizes, geographyOptions } from "@/data/partners";
import type { DatabasePartner } from "@/hooks/usePartners";
import { useBasicPartners } from "@/hooks/useBasicPartners";
import { filterBasicPartners } from "@/lib/basicPartnerMatch";

const INDUSTRY_CONTEXT: Record<string, string> = {
 "tillverkning": "MES, spårbarhet, kvalitet",
 "livsmedel-processindustri": "Batch, spårbarhet, HACCP",
 "grossist-distribution": "Lager, WMS, prissättning",
 "retail-ehandel": "POS, omnikanal, lojalitet",
 "mode-sport-textil": "Säsong, kollektion, storlek/färg",
 "konsulttjanster": "Projekt, tid, fakturering",
 "bygg-entreprenad": "Projekt, ÄTA, underentreprenörer",
 "fastighet-forvaltning": "Hyresavtal, drift, underhåll",
 "energi-utilities": "Mätvärden, fältservice, avtal",
 "finans-forsakring": "Compliance, KYC, rapportering",
 "life-science-medtech": "GxP, validering, spårbarhet",
 "telekom-it-tjanster": "Abonnemang, ärenden, SLA",
 "logistik-transport": "TMS, ruttplanering, EDI",
 "media-publishing": "Prenumerationer, rättigheter, annons",
 "jordbruk-skogsbruk": "Säsong, lager, maskinpark",
 "halsa-sjukvard": "Patientflöden, journaler, GDPR",
 "nonprofit-organisationer": "Bidrag, givare, projekt",
 "medlemsorganisationer": "Medlemmar, avgifter, event",
 "utbildning": "Kurser, deltagare, certifikat",
 "offentlig-sektor": "Upphandling, diarier, ärenden",
 "uthyrning": "Uthyrning, retur, underhåll",
};



// Industry images (same as /branschlosningar)
import tillverkningImg from "@/assets/industries/tillverkning.webp";
import livsmedelsImg from "@/assets/industries/livsmedel.webp";
import handelDistributionImg from "@/assets/industries/handel-distribution.webp";
import detaljhandelImg from "@/assets/industries/detaljhandel.webp";
import modeSportTextilImg from "@/assets/industries/mode-sport-textil.webp";
import konsultforetagImg from "@/assets/industries/konsultforetag.webp";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.webp";
import fastigheterImg from "@/assets/industries/fastigheter.webp";
import energiImg from "@/assets/industries/energi.webp";
import finansForsakringImg from "@/assets/industries/finans-forsakring.webp";
import lakemedelImg from "@/assets/industries/lakemedel-life-science.webp";
import itTechImg from "@/assets/industries/it-tech.webp";
import transportLogistikImg from "@/assets/industries/transport-logistik.webp";
import mediaPublishingImg from "@/assets/industries/media-publishing.webp";
import jordbrukImg from "@/assets/industries/jordbruk-skogsbruk.webp";
import halsaImg from "@/assets/industries/halsa-sjukvard.webp";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.webp";
import utbildningImg from "@/assets/industries/utbildning.webp";
import offentligSektorImg from "@/assets/industries/offentlig-sektor.webp";
import uthyrningImg from "@/assets/industries/uthyrning.webp";

const INDUSTRY_IMAGES: Record<string, string> = {
 "tillverkning": tillverkningImg,
 "livsmedel-processindustri": livsmedelsImg,
 "grossist-distribution": handelDistributionImg,
 "retail-ehandel": detaljhandelImg,
 "mode-sport-textil": modeSportTextilImg,
 "konsulttjanster": konsultforetagImg,
 "bygg-entreprenad": byggEntreprenadImg,
 "fastighet-forvaltning": fastigheterImg,
 "energi-utilities": energiImg,
 "finans-forsakring": finansForsakringImg,
 "life-science-medtech": lakemedelImg,
 "telekom-it-tjanster": itTechImg,
 "logistik-transport": transportLogistikImg,
 "media-publishing": mediaPublishingImg,
 "jordbruk-skogsbruk": jordbrukImg,
 "halsa-sjukvard": halsaImg,
 "nonprofit-organisationer": medlemsorganisationerImg,
 "medlemsorganisationer": medlemsorganisationerImg,
 "utbildning": utbildningImg,
 "offentlig-sektor": offentligSektorImg,
 "uthyrning": uthyrningImg,
};

const GEOGRAPHY_HIERARCHY = ["Sverige", "Norden", "Europa", "Globalt"];

const matchesGeography = (partnerGeos: string | string[], selected: string): boolean => {
  const geos = Array.isArray(partnerGeos) && partnerGeos.length > 0
    ? partnerGeos
    : typeof partnerGeos === "string" && partnerGeos
    ? [partnerGeos]
    : ["Sverige"];
  const selectedIndex = GEOGRAPHY_HIERARCHY.indexOf(selected);
  if (selectedIndex === -1) return false;
  return geos.some((geo) => GEOGRAPHY_HIERARCHY.indexOf(geo) >= selectedIndex);
};

const partnerMatchesIndustryFilters = (
  p: DatabasePartner,
  industryName: string,
  selectedGeography: string | null,
  selectedCompanySize: string | null
): boolean => {
  const pf = p.product_filters || {};
  const productKeys = ["bc", "fsc", "sales", "service", "crm"] as const;
  for (const key of productKeys) {
    const filter = pf[key as keyof typeof pf];
    if (!filter) continue;
    const industries = filter.industries || [];
    const secondary = filter.secondaryIndustries || [];
    if (!industries.includes(industryName) && !secondary.includes(industryName)) continue;
    if (selectedGeography && !matchesGeography(filter.geography, selectedGeography)) continue;
    if (selectedCompanySize && !(filter.companySize || []).includes(selectedCompanySize)) continue;
    return true;
  }
  return false;
};

const Branscher = () => {
  const { covered } = useCoveredIndustries();
  const { data: partners } = usePartners();
  const { data: basicPartners } = useBasicPartners();
  const [selectedGeography, setSelectedGeography] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);

  const visibleIndustries = STANDARD_INDUSTRIES.filter((i) => covered.has(i.name));

  const { filteredIndustries, filteredPartnerCounts, basicPartnerCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    const basicCounts: Record<string, number> = {};
    const filtered = visibleIndustries.filter((ind) => {
      const count = (partners || [])
        .filter((p) => p.is_featured === true)
        .filter((p) =>
          partnerMatchesIndustryFilters(p, ind.name, selectedGeography, selectedCompanySize)
        ).length;
      counts[ind.name] = count;
      basicCounts[ind.name] = filterBasicPartners(basicPartners || [], {
        applications: [],
        industry: ind.name,
        companySize: selectedCompanySize,
        geography: selectedGeography,
      }).length;
      return count > 0;
    });
    return {
      filteredIndustries: filtered,
      filteredPartnerCounts: counts,
      basicPartnerCounts: basicCounts,
    };
  }, [visibleIndustries, partners, basicPartners, selectedGeography, selectedCompanySize]);

  const hasActiveFilters = selectedGeography || selectedCompanySize;

 return (
 <>
 <SEOHead
 title="Microsoft Dynamics 365 per bransch – branschguide"
 description="Microsoft Dynamics 365 per bransch: processer, roller, applikationer och partners. Köparsidig branschguide för ERP- och CRM-val i Sverige."
 canonicalPath="/branscher/"
 />
 <Navbar />
 <main className="min-h-screen bg-background pt-28 md:pt-36">
        <section className="py-5 md:py-6 bg-gradient-to-b from-muted/30 to-background border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Välj bransch först – annars jämför ni Dynamics 365 på fel grunder
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-4xl">
              Dynamics 365 ser olika ut i tillverkning, handel, fastighet, service, konsultverksamhet och andra branscher. Rätt lösning beror inte bara på produktvalet, utan på processer, integrationsbehov, rapportering, regelverk och vilken typ av partner som krävs för att lyckas.
            </p>
          </div>
        </section>

        <section className="py-6 md:py-8 border-b border-border bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3">
              Varför bransch spelar roll
            </h2>
            <div className="space-y-3 text-sm md:text-[15px] text-muted-foreground max-w-4xl leading-relaxed">
              <p>
                Två företag kan välja exakt samma Dynamics 365-produkt – och ändå hamna i två helt olika projekt. Implementationen, kravspecifikationen och vilken partnerprofil som faktiskt klarar uppdraget styrs i hög grad av branschens processer, terminologi och regelverk.
              </p>
              <p>
                I flera branscher avgörs Dynamics 365-valet inte bara av Microsofts standardfunktionalitet, utan av vilka branschlösningar som krävs runt plattformen. Det kan handla om allergen- och etikettkrav i livsmedel, GMP/GxP-validering i Life Science, hyreslogik i fastighet, rental fleet management, EDI mot retailkedjor eller mobil lagerhantering.
              </p>
              <p>
                Därför är ISV-frågan också en partnerfråga. En partner som är stark på Business Central eller Finance & Supply Chain Management är inte automatiskt rätt om lösningen kräver en specifik branschapplikation, certifiering eller implementeringserfarenhet.
              </p>
              <p>
                Att börja med branschen – innan ni jämför produkter eller partners – gör att utvärderingen sker på rätt grunder: era processer, era integrationsbehov och de partners som faktiskt har levererat i er typ av verksamhet tidigare.
              </p>
            </div>
          </div>
        </section>


        <section className="py-6 md:py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {filteredIndustries.map((ind) => {
                const img = INDUSTRY_IMAGES[ind.slug];
                const context = INDUSTRY_CONTEXT[ind.slug];
                const count = filteredPartnerCounts[ind.name] || 0;
                const basicCount = basicPartnerCounts[ind.name] || 0;
                return (
                  <Link
                    key={ind.slug}
                    to={`/branscher/${ind.slug}`}
                    className="group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 transition-all"
                  >
                    {img && (
                      <div className="aspect-[16/9] overflow-hidden bg-muted relative">
                        <img
                          src={img}
                          alt={`Branschlösning för ${ind.name} i Microsoft Dynamics 365`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span
                          title="AI-assisterat branschinnehåll"
                          aria-label="AI-assisterat branschinnehåll"
                          className="absolute top-2 right-2 inline-flex items-center gap-1 rounded bg-cyan-500/95 text-white text-[10px] font-semibold px-2 py-0.5"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1 p-2.5 pr-7">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {ind.name}
                      </span>
                      {context && (
                        <span className="text-xs text-muted-foreground leading-snug">
                          {context}
                        </span>
                      )}
                      <span className="text-xs font-medium text-primary/80 mt-0.5">
                        {count > 0
                          ? `${count} ${count === 1 ? "verifierad partner" : "verifierade partners"}`
                          : "Kommer snart"}
                      </span>
                      {basicCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {basicCount} {basicCount === 1 ? "identifierad partner" : "identifierade partners"}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="absolute bottom-2.5 right-2.5 h-4 w-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
 </main>
 <Footer />
 </>
 );
};

export default Branscher;
