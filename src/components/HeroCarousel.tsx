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
    backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=65&w=1600",
    title: (
      <>
        Din guide inom <span className="whitespace-nowrap">Microsoft Dynamics 365</span>
      </>
    ),
    subtitle: "Upptäck möjligheterna med Microsoftplattformen",
    ctaType: "contact",
    ctaText: "Starta här med en gratis rådgivning",
    buttonColor: "bg-primary hover:bg-primary/90",
  },
  {
    id: 2,
    backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=65&w=1600",
    title: (
      <>
        Hitta rätt <span className="text-[hsl(var(--business-central))]">ERP-system</span> för ditt företag
      </>
    ),
    subtitle: "Gör vår ERP Behovsanalys och få en personlig rekommendation",
    ctaType: "link",
    ctaText: "Starta ERP Behovsanalys",
    ctaLink: "/behovsanalys",
    buttonColor: "bg-[hsl(var(--business-central))] hover:bg-[hsl(var(--business-central))]/90",
  },
  {
    id: 3,
    backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=65&w=1600",
    title: (
      <>
        Optimera din <span className="text-[hsl(var(--crm))]">kundhantering</span>
      </>
    ),
    subtitle: "Gör vår CRM Behovsanalys och upptäck vilken lösning som passar dig",
    ctaType: "link",
    ctaText: "Starta CRM Behovsanalys",
    ctaLink: "/crm-behovsanalys",
    buttonColor: "bg-[hsl(var(--crm))] hover:bg-[hsl(var(--crm))]/90",
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
    <header className="relative overflow-hidden h-[400px] sm:h-[500px] md:h-[600px]">
      {/* Background Images */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.backgroundImage}
            alt=""
            className="w-full h-full object-cover"
            width="1600"
            height="1067"
            fetchPriority={index === 0 ? "high" : "low"}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-3xl">
              <h1
                key={currentSlide}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6 animate-fade-in"
              >
                {slide.title}
              </h1>
              <p
                key={`subtitle-${currentSlide}`}
                className="text-lg sm:text-xl md:text-2xl text-white/95 mb-6 sm:mb-8 animate-fade-in"
              >
                {slide.subtitle}
              </p>

              {slide.ctaType === "contact" ? (
                <ContactFormDialog>
                  <Button
                    size="lg"
                    className={`${slide.buttonColor} text-primary-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl animate-fade-in`}
                  >
                    {slide.ctaText}
                  </Button>
                </ContactFormDialog>
              ) : (
                <Link to={slide.ctaLink || "/"}>
                  <Button
                    size="lg"
                    className={`${slide.buttonColor} text-white w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl animate-fade-in`}
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

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Gå till slide ${index + 1}`}
          />
        ))}
      </div>
    </header>
  );
};

export default HeroCarousel;
