import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: number;
  backgroundImage: string;
  title: React.ReactNode;
  subtitle: string;
  ctaType: "contact" | "link";
  ctaText: string;
  ctaLink?: string;
  buttonColor?: string;
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
    subtitle: "Upptäck möjligheterna med Microsoftplattformen",
    ctaType: "link",
    ctaText: "Starta med att välja vilken bransch du tillhör",
    ctaLink: "/branschlosningar",
    buttonColor: "bg-amber-500 hover:bg-amber-600",
  },
  {
    id: 2,
    backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=50&w=1280",
    title: (
      <>
        Hitta rätt <span className="text-emerald-400">affärssystem (ERP)</span> för ditt företag
      </>
    ),
    subtitle: "Gör vår Affärssystem (ERP) Behovsanalys och få en personlig rekommendation",
    ctaType: "link",
    ctaText: "Gör din digitala Affärssystem (ERP) Behovsanalys här",
    ctaLink: "/behovsanalys",
    buttonColor: "bg-[hsl(var(--business-central))] hover:bg-[hsl(var(--business-central))]/90",
  },
  {
    id: 3,
    backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=50&w=1280",
    title: (
      <>
        Optimera din <span className="text-[hsl(var(--crm))]">kundhantering</span>
      </>
    ),
    subtitle: "Gör vår digitala CRM Behovsanalys och upptäck vilka Dynamics 365 Applikationer som passar din verksamhet",
    ctaType: "link",
    ctaText: "Gör din digitala CRM Behovsanalys här",
    ctaLink: "/crm-behovsanalys",
    buttonColor: "bg-[hsl(var(--crm))] hover:bg-[hsl(var(--crm))]/90",
  },
  {
    id: 4,
    backgroundImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=50&w=1280",
    title: (
      <>
        Hitta rätt <span className="text-amber-400">implementationspartner</span>
      </>
    ),
    subtitle: "Utforska vår partnerkatalog och hitta den perfekta partnern för ditt Dynamics 365-projekt",
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
    <header className="relative overflow-hidden h-[400px] sm:h-[500px] md:h-[600px]" style={{ contain: 'layout size', willChange: 'auto' }}>
      {/* Background Images */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{ contain: 'strict' }}
        >
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
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-20">
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
