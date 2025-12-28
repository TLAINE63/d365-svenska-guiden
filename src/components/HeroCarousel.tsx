import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PartnerComparisonHero from "@/components/PartnerComparisonHero";
import ERPAnalysisHero from "@/components/ERPAnalysisHero";
import CRMAnalysisHero from "@/components/CRMAnalysisHero";

// Industry images for first slide
import tillverkningImg from "@/assets/industries/tillverkning.jpg";
import handelDistributionImg from "@/assets/industries/handel-distribution.jpg";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.jpg";
import transportLogistikImg from "@/assets/industries/transport-logistik.jpg";
import fastigheterImg from "@/assets/industries/fastigheter.jpg";
import serviceUnderhallImg from "@/assets/industries/service-underhall.jpg";
import konsultforetagImg from "@/assets/industries/konsultforetag.jpg";
import detaljhandelImg from "@/assets/industries/detaljhandel.jpg";
import energiImg from "@/assets/industries/energi.jpg";
import itTechImg from "@/assets/industries/it-tech.jpg";
import lakemedelImg from "@/assets/industries/lakemedel-life-science.jpg";
import livsmedelsImg from "@/assets/industries/livsmedel.jpg";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.jpg";
import miljoAtervinningImg from "@/assets/industries/miljo-atervinning.jpg";
import partiAgenturhandelImg from "@/assets/industries/parti-agenturhandel.jpg";

const featuredIndustries = [
  { name: "Tillverkning", image: tillverkningImg },
  { name: "Handel", image: handelDistributionImg },
  { name: "Bygg", image: byggEntreprenadImg },
  { name: "Transport", image: transportLogistikImg },
  { name: "Fastigheter", image: fastigheterImg },
  { name: "Service", image: serviceUnderhallImg },
  { name: "Konsult", image: konsultforetagImg },
  { name: "Detaljhandel", image: detaljhandelImg },
  { name: "Energi", image: energiImg },
  { name: "IT & Tech", image: itTechImg },
  { name: "Life Science", image: lakemedelImg },
  { name: "Livsmedel", image: livsmedelsImg },
  { name: "Föreningar", image: medlemsorganisationerImg },
  { name: "Miljö", image: miljoAtervinningImg },
  { name: "Partihandel", image: partiAgenturhandelImg },
];

interface HeroSlide {
  id: number;
  backgroundImage?: string;
  title: React.ReactNode;
  subtitle: string;
  ctaType: "contact" | "link" | "industries";
  ctaText: string;
  ctaLink?: string;
  buttonColor?: string;
  customContent?: "erp" | "crm" | "partners" | boolean;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=50&w=1280",
    title: (
      <>
        Din guide inom <span className="whitespace-nowrap">Microsoft Dynamics 365</span>
      </>
    ),
    subtitle: "Välj den bransch du tillhör, så kan vi guida dig rätt",
    ctaType: "industries",
    ctaText: "Se alla branscher",
    ctaLink: "/branschlosningar",
    buttonColor: "bg-amber-500 hover:bg-amber-600",
  },
  {
    id: 2,
    title: (
      <>
        Hitta rätt <span className="text-emerald-400">affärssystem</span>
      </>
    ),
    subtitle: "Gör vår digitala ERP-behovsanalys och få en personlig rekommendation",
    ctaType: "link",
    ctaText: "Starta behovsanalysen",
    ctaLink: "/behovsanalys",
    buttonColor: "bg-[hsl(var(--business-central))] hover:bg-[hsl(var(--business-central))]/90",
    customContent: "erp",
  },
  {
    id: 3,
    title: (
      <>
        Optimera din <span className="text-[hsl(var(--crm))]">kundhantering</span>
      </>
    ),
    subtitle: "Gör vår CRM-behovsanalys och hitta rätt Dynamics 365-applikationer",
    ctaType: "link",
    ctaText: "Starta CRM-analysen",
    ctaLink: "/crm-behovsanalys",
    buttonColor: "bg-[hsl(var(--crm))] hover:bg-[hsl(var(--crm))]/90",
    customContent: "crm",
  },
  {
    id: 4,
    title: (
      <>
        Hitta rätt <span className="text-amber-400">implementationspartner</span>
      </>
    ),
    subtitle: "Utforska vår partnerkatalog och hitta rätt partner för ditt Dynamics 365-projekt",
    ctaType: "link",
    ctaText: "Utforska partners här",
    ctaLink: "/valj-partner",
    buttonColor: "bg-amber-500 hover:bg-amber-600",
    customContent: "partners",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <header className="relative overflow-hidden h-[400px] sm:h-[500px] md:h-[600px]" style={{ contain: 'layout size', willChange: 'auto' }}>
      {/* Background Images or Custom Content */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{ contain: 'strict' }}
        >
          {s.customContent ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </>
          ) : s.backgroundImage ? (
            <>
              <img
                src={s.backgroundImage}
                alt=""
                className="w-full h-full object-cover"
                width="1600"
                height="1067"
                fetchPriority={index === 0 ? "high" : "low"}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            </>
          ) : null}
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          {slide.ctaType === "industries" ? (
            // First slide with industries grid
            <div className="animate-fade-in">
              <h1
                key={currentSlide}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 sm:mb-3 md:mb-4"
              >
                {slide.title}
              </h1>
              <p
                key={`subtitle-${currentSlide}`}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 sm:mb-5 md:mb-6"
              >
                {slide.subtitle}
              </p>
              
              {/* Industries Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                {featuredIndustries.map((industry) => (
                  <Link
                    key={industry.name}
                    to="/branschlosningar"
                    className="group flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden mb-1 ring-2 ring-white/30 group-hover:ring-white/60 transition-all">
                      <img
                        src={industry.image}
                        alt={industry.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="eager"
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-white/90 font-medium text-center leading-tight">
                      {industry.name}
                    </span>
                  </Link>
                ))}
              </div>
              
              <Link to={slide.ctaLink || "/"}>
                <Button
                  size="lg"
                  className={`${slide.buttonColor} text-white text-xs sm:text-sm md:text-base h-10 sm:h-12 md:h-14 rounded-xl`}
                >
                  {slide.ctaText}
                </Button>
              </Link>
            </div>
          ) : slide.customContent ? (
            // Custom content slides (ERP analysis or Partner comparison)
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center h-full">
              <div className="max-w-xl">
                <h1
                  key={currentSlide}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4 md:mb-6 animate-fade-in"
                >
                  {slide.title}
                </h1>
                <p
                  key={`subtitle-${currentSlide}`}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-6 md:mb-8 animate-fade-in"
                >
                  {slide.subtitle}
                </p>

                <Link to={slide.ctaLink || "/"}>
                  <Button
                    size="lg"
                    className={`${slide.buttonColor} text-white w-full sm:w-auto text-sm sm:text-base md:text-lg h-12 sm:h-14 md:h-16 rounded-xl animate-fade-in`}
                  >
                    {slide.ctaText}
                  </Button>
                </Link>
              </div>
              
              {/* Custom hero content based on type */}
              <div className="hidden lg:flex items-center justify-center animate-fade-in">
                {slide.customContent === "erp" && <ERPAnalysisHero />}
                {slide.customContent === "crm" && <CRMAnalysisHero />}
                {slide.customContent === "partners" && <PartnerComparisonHero />}
              </div>
            </div>
          ) : (
            // Other slides with regular layout
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="max-w-3xl">
                <h1
                  key={currentSlide}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4 md:mb-6 animate-fade-in"
                >
                  {slide.title}
                </h1>
                <p
                  key={`subtitle-${currentSlide}`}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-6 md:mb-8 animate-fade-in"
                >
                  {slide.subtitle}
                </p>

                {slide.ctaType === "contact" ? (
                  <ContactFormDialog>
                    <Button
                      size="lg"
                      className={`${slide.buttonColor} text-primary-foreground w-full sm:w-auto text-sm sm:text-base md:text-lg h-12 sm:h-14 md:h-16 rounded-xl animate-fade-in`}
                    >
                      {slide.ctaText}
                    </Button>
                  </ContactFormDialog>
                ) : (
                  <Link to={slide.ctaLink || "/"}>
                    <Button
                      size="lg"
                      className={`${slide.buttonColor} text-white w-full sm:w-auto text-sm sm:text-base md:text-lg h-12 sm:h-14 md:h-16 rounded-xl animate-fade-in`}
                    >
                      {slide.ctaText}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          prevSlide();
          setIsAutoPlaying(false);
          setTimeout(() => setIsAutoPlaying(true), 10000);
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all"
        aria-label="Föregående slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
      <button
        onClick={() => {
          nextSlide();
          setIsAutoPlaying(false);
          setTimeout(() => setIsAutoPlaying(true), 10000);
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all"
        aria-label="Nästa slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Dots Indicator - using padding to meet 24px touch target while keeping visual dot small */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-0">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="p-2 group"
            aria-label={`Gå till slide ${index + 1}`}
          >
            <span
              className={`block rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white w-8 h-3"
                  : "bg-white/50 group-hover:bg-white/70 w-3 h-3"
              }`}
            />
          </button>
        ))}
      </div>
    </header>
  );
};

export default HeroCarousel;
