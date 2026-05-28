import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { ChevronRight } from "lucide-react";
import { useCoveredIndustries } from "@/hooks/useCoveredIndustries";
import { usePartners } from "@/hooks/usePartners";

const PRODUCT_KEYS = ["bc", "fsc", "sales", "service"] as const;

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

const Branscher = () => {
  const { covered } = useCoveredIndustries();
  const { data: partners } = usePartners();
  const visibleIndustries = STANDARD_INDUSTRIES.filter((i) => covered.has(i.name));

  const partnerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (partners || [])
      .filter((p) => p.is_featured === true)
      .forEach((p) => {
        const inds = new Set<string>();
        PRODUCT_KEYS.forEach((k) => {
          (p.product_filters?.[k]?.industries || []).forEach((i: string) => inds.add(i));
        });
        inds.forEach((name) => {
          counts[name] = (counts[name] || 0) + 1;
        });
      });
    return counts;
  }, [partners]);

  return (
    <>
      <SEOHead
        title="Branschöversikt – Microsoft Dynamics 365 i Sverige"
        description="Branschguider för Dynamics 365: processer, roller och vilka applikationer som passar din bransch. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
        canonicalPath="/branscher"
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        <section className="py-5 md:py-6 bg-gradient-to-b from-muted/30 to-background border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Branschöversikt
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-4xl">
              Upptäck hur Microsoft Dynamics 365 kan förändra din bransch – från smidigare affärsprocesser och tydligare roller till lösningar på de utmaningar som verkligen betyder något. Välj din bransch nedan för konkreta insikter, vägledning och rätt applikationer för att driva din verksamhet framåt.
            </p>
          </div>
        </section>

        <section className="py-6 md:py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {visibleIndustries.map((ind) => {
                const img = INDUSTRY_IMAGES[ind.slug];
                const context = INDUSTRY_CONTEXT[ind.slug];
                const count = partnerCounts[ind.name] || 0;
                return (
                  <Link
                    key={ind.slug}
                    to={`/branscher/${ind.slug}`}
                    className="group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    {img && (
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={img}
                          alt={ind.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-1 p-3 pr-8">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {ind.name}
                      </span>
                      {context && (
                        <span className="text-xs text-muted-foreground leading-snug">
                          {context}
                        </span>
                      )}
                      <span className="text-xs font-medium text-primary/80 mt-0.5">
                        {count > 0 ? `${count} ${count === 1 ? "partner" : "partners"} listade` : "Kommer snart"}
                      </span>
                    </div>
                    <ChevronRight className="absolute bottom-3 right-3 h-4 w-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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
