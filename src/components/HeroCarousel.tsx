import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import partnersHeroImg from "@/assets/partners-comparison-hero.png";

// Dynamics 365 icons
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";

// Industry images for first slide - new taxonomy (18 industries)
import tillverkningImg from "@/assets/industries/tillverkning.jpg";
import livsmedelsImg from "@/assets/industries/livsmedel.jpg";
import handelDistributionImg from "@/assets/industries/handel-distribution.jpg";
import detaljhandelImg from "@/assets/industries/detaljhandel.jpg";
import konsultforetagImg from "@/assets/industries/konsultforetag.jpg";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.jpg";
import fastigheterImg from "@/assets/industries/fastigheter.jpg";
import energiImg from "@/assets/industries/energi.jpg";
import finansForsakringImg from "@/assets/industries/finans-forsakring.jpg";
import lakemedelImg from "@/assets/industries/lakemedel-life-science.jpg";
import itTechImg from "@/assets/industries/it-tech.jpg";
import transportLogistikImg from "@/assets/industries/transport-logistik.jpg";
import mediaPublishingImg from "@/assets/industries/media-publishing.jpg";
import jordbrukSkogsbrukImg from "@/assets/industries/jordbruk-skogsbruk.jpg";
import halsaSjukvardImg from "@/assets/industries/halsa-sjukvard.jpg";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.jpg";
import utbildningImg from "@/assets/industries/utbildning.jpg";
import offentligSektorImg from "@/assets/industries/offentlig-sektor.jpg";

// Featured industries in carousel - 18 industries with new taxonomy
const featuredIndustries = [
  { name: "Tillverkning", image: tillverkningImg },
  { name: "Livsmedel", image: livsmedelsImg },
  { name: "Grossist", image: handelDistributionImg },
  { name: "Retail", image: detaljhandelImg },
  { name: "Konsult", image: konsultforetagImg },
  { name: "Bygg", image: byggEntreprenadImg },
  { name: "Fastighet", image: fastigheterImg },
  { name: "Energi", image: energiImg },
  { name: "Finans", image: finansForsakringImg },
  { name: "Life Science", image: lakemedelImg },
  { name: "Telekom & IT", image: itTechImg },
  { name: "Logistik", image: transportLogistikImg },
  { name: "Media", image: mediaPublishingImg },
  { name: "Jordbruk", image: jordbrukSkogsbrukImg },
  { name: "Sjukvård", image: halsaSjukvardImg },
  { name: "Non-profit", image: medlemsorganisationerImg },
  { name: "Utbildning", image: utbildningImg },
  { name: "Offentlig", image: offentligSektorImg },
];

interface HeroSlide {
  id: number;
  backgroundImage?: string;
  title: React.ReactNode;
  subtitle: string;
  ctaType: "contact" | "link" | "industries" | "dual-link";
  ctaText: string;
  ctaLink?: string;
  buttonColor?: string;
  heroImage?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  secondaryButtonColor?: string;
  icons?: string[];
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
    backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=50&w=1280",
    title: (
      <>
        Hitta rätt <span className="text-emerald-400">affärssystem</span>
      </>
    ),
    subtitle: "Starta här med en digital ERP-behovsanalys",
    ctaType: "link",
    ctaText: "Starta behovsanalysen",
    ctaLink: "/behovsanalys",
    buttonColor: "bg-[hsl(var(--business-central))] hover:bg-[hsl(var(--business-central))]/90",
    icons: [BusinessCentralIcon, FinanceIcon, SupplyChainIcon],
  },
  {
    id: 3,
    backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=50&w=1280",
    title: (
      <>
        Optimera din <span className="text-[hsl(var(--crm))]">kundhantering</span>
      </>
    ),
    subtitle: "Välj behovsanalys utifrån ditt fokusområde",
    ctaType: "dual-link",
    ctaText: "Starta Behovsanalysen för Sälj & Marknad",
    ctaLink: "/salj-marknad-behovsanalys",
    buttonColor: "bg-[hsl(var(--crm))] hover:bg-[hsl(var(--crm))]/90",
    secondaryCtaText: "Starta Behovsanalysen för Kundservice",
    secondaryCtaLink: "/kundservice-behovsanalys",
    secondaryButtonColor: "bg-[hsl(var(--customer-service))] hover:bg-[hsl(var(--customer-service))]/90",
    icons: [SalesIcon, MarketingIcon, CustomerServiceIcon],
  },
  {
    id: 4,
    backgroundImage: partnersHeroImg,
    title: (
      <>
        Hitta rätt <span className="text-amber-400">partner</span>
      </>
    ),
    subtitle: "Utforska vår partnerkatalog och hitta rätt partner för ditt Dynamics 365-projekt",
    ctaType: "link",
    ctaText: "Utforska partners här",
    ctaLink: "/valj-partner",
    buttonColor: "bg-amber-500 hover:bg-amber-600",
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
    <header className="relative overflow-hidden h-[450px] sm:h-[500px] md:h-[600px]" style={{ contain: 'layout size', willChange: 'auto' }}>
      {/* Background Images or Custom Content */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{ contain: 'strict' }}
        >
          {s.backgroundImage ? (
            <>
              <img
                src={s.backgroundImage}
                alt={s.id === 1 ? "Skyskrapor som symboliserar affärsvärlden och Microsoft Dynamics 365" : s.id === 2 ? "Affärsanalys och ERP-systemplanering" : s.id === 3 ? "Teamsamarbete och CRM-strategi" : "Partnerval och jämförelse av offerter"}
                className="w-full h-full object-cover"
                width={1600}
                height={1067}
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
            <div className="animate-fade-in pt-8 sm:pt-12 md:pt-16">
              <h1
                key={currentSlide}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-1 sm:mb-2"
              >
                {slide.title}
              </h1>
              <p
                key={`subtitle-${currentSlide}`}
                className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mb-3 sm:mb-4"
              >
                {slide.subtitle}
              </p>
              
              {/* Industries Grid - 18 industries in 3 rows (6 per row) */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-1.5 mb-4 sm:mb-5">
                {featuredIndustries.map((industry) => (
                  <Link
                    key={industry.name}
                    to="/branschlosningar"
                    className="group flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden mb-1 sm:mb-1.5 ring-2 ring-white/30 group-hover:ring-white/60 transition-all">
                      <img
                        src={industry.image}
                        alt={industry.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="eager"
                      />
                    </div>
                    <span className="text-[9px] sm:text-xs text-white/90 font-medium text-center leading-tight">
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
          ) : (
            // Other slides with regular layout - vertical stacking
            <div className="flex flex-col items-center text-center">
              {/* Offer bubbles for partner slide - centered above heading */}
              {slide.id === 4 && (
                <div className="hidden md:flex justify-center gap-4 mb-4 animate-fade-in">
                  <div className="bg-white rounded-xl shadow-xl p-3 border border-gray-100 min-w-[140px]">
                    <div className="text-xs font-bold text-gray-800 mb-1 text-left">Offert #1</div>
                    <div className="text-base font-bold text-emerald-600 mb-2 text-left">190 000 kr</div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">X</div>
                      <span className="text-xs text-gray-600 text-left">Partner X</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-xl p-3 border border-gray-100 min-w-[140px]" style={{ animationDelay: "0.2s" }}>
                    <div className="text-xs font-bold text-gray-800 mb-1 text-left">Offert #2</div>
                    <div className="text-base font-bold text-blue-600 mb-2 text-left">475 000 kr</div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Y</div>
                      <span className="text-xs text-gray-600 text-left">Partner Y</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-xl p-3 border border-gray-100 min-w-[140px]" style={{ animationDelay: "0.4s" }}>
                    <div className="text-xs font-bold text-gray-800 mb-1 text-left">Offert #3</div>
                    <div className="text-base font-bold text-amber-600 mb-2 text-left">450 000 kr</div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Z</div>
                      <span className="text-xs text-gray-600 text-left">Partner Z</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Dynamics 365 Icons */}
              {slide.icons && slide.icons.length > 0 && (
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 animate-fade-in">
                  {slide.icons.map((icon, index) => (
                    <img 
                      key={index}
                      src={icon} 
                      alt="" 
                      className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 drop-shadow-lg"
                    />
                  ))}
                </div>
              )}
              
              <h1
                key={currentSlide}
                className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-2 sm:mb-3 animate-fade-in"
              >
                {slide.title}
              </h1>
              <p
                key={`subtitle-${currentSlide}`}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-3 sm:mb-4 animate-fade-in max-w-2xl"
              >
                {slide.subtitle}
              </p>

              {slide.ctaType === "contact" ? (
                <ContactFormDialog>
                  <Button
                    size="lg"
                    className={`${slide.buttonColor} text-primary-foreground text-xs sm:text-sm md:text-lg h-10 sm:h-12 md:h-14 rounded-xl animate-fade-in`}
                  >
                    {slide.ctaText}
                  </Button>
                </ContactFormDialog>
              ) : slide.ctaType === "dual-link" ? (
                <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
                  <Link to={slide.ctaLink || "/"}>
                    <Button
                      size="lg"
                      className={`${slide.buttonColor} text-white text-xs sm:text-sm md:text-base h-10 sm:h-12 md:h-14 rounded-xl w-full`}
                    >
                      {slide.ctaText}
                    </Button>
                  </Link>
                  <Link to={slide.secondaryCtaLink || "/"}>
                    <Button
                      size="lg"
                      className={`${slide.secondaryButtonColor} text-white text-xs sm:text-sm md:text-base h-10 sm:h-12 md:h-14 rounded-xl w-full`}
                    >
                      {slide.secondaryCtaText}
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link to={slide.ctaLink || "/"}>
                  <Button
                    size="lg"
                    className={`${slide.buttonColor} text-white text-xs sm:text-sm md:text-lg h-10 sm:h-12 md:h-14 rounded-xl animate-fade-in`}
                  >
                    {slide.ctaText}
                  </Button>
                </Link>
              )}
              
              {/* Hero image below the button */}
              {slide.heroImage && (
                <div className="flex items-center justify-center animate-fade-in mt-4 sm:mt-6">
                  <div className="relative hover:scale-105 transition-transform duration-300">
                    <img
                      src={slide.heroImage}
                      alt={slide.id === 2 ? "ERP Behovsanalys" : "CRM Behovsanalys"}
                      className="max-h-[120px] sm:max-h-[160px] md:max-h-[200px] w-auto drop-shadow-2xl"
                    />
                    {/* Text overlay for folder images */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-emerald-600 font-bold text-sm sm:text-lg md:text-xl drop-shadow-sm">
                        {slide.id === 2 ? "ERP" : "CRM"}
                      </span>
                      <span className="text-gray-800 font-semibold text-xs sm:text-sm md:text-base drop-shadow-sm">
                        Behovsanalys
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
