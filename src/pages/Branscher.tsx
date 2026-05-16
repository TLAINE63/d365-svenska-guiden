import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { ArrowRight } from "lucide-react";
import { useCoveredIndustries } from "@/hooks/useCoveredIndustries";

// Industry images (same as /branschlosningar)
import tillverkningImg from "@/assets/industries/tillverkning.webp";
import livsmedelsImg from "@/assets/industries/livsmedel.webp";
import handelDistributionImg from "@/assets/industries/handel-distribution.webp";
import detaljhandelImg from "@/assets/industries/detaljhandel.webp";
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
  const visibleIndustries = STANDARD_INDUSTRIES.filter((i) => covered.has(i.name));
  return (
    <>
      <SEOHead
        title="Branscher – Microsoft Dynamics 365 i Sverige"
        description="Branschguider för Microsoft Dynamics 365: affärsprocesser, utmaningar, roller och vilka D365-applikationer som passar din bransch."
        canonicalPath="/branscher"
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Branscher
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              Hur Microsoft Dynamics 365 används i din bransch – affärsprocesser,
              utmaningar, roller och rätt partners.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleIndustries.map((ind) => {
                const img = INDUSTRY_IMAGES[ind.slug];
                return (
                  <Link
                    key={ind.slug}
                    to={`/branscher/${ind.slug}`}
                    className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    {img && (
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <img
                          src={img}
                          alt={ind.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5 p-4">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {ind.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Processer, utmaningar, roller och partners.
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Öppna <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
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
