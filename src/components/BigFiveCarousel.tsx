import { useState, useEffect } from "react";
import { DollarSign, AlertCircle, GitCompare, Star, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const bigFiveItems = [
  {
    icon: DollarSign,
    title: "Licenspriser och Projektkostnader",
    description: <>Förklaringar och exempel på licenser- och projektpriser</>,
    link: "/qa#priser",
  },
  {
    icon: AlertCircle,
    title: "Utmaningar och Risker",
    description: <>Vanliga utmaningar och hur vi löser dem</>,
    link: "/qa#utmaningar",
  },
  {
    icon: GitCompare,
    title: "Jämförelser",
    description: <><span className='whitespace-nowrap'>Microsoft Dynamics 365</span> vs andra CRM/ERP-system på marknaden</>,
    link: "/qa#jamforelser",
  },
  {
    icon: Star,
    title: "Recensioner",
    description: <>Vad kunder säger om <span className='whitespace-nowrap'>Microsoft Dynamics 365</span></>,
    link: "/qa#recensioner",
  },
  {
    icon: Award,
    title: "Bäst i Klassen",
    description: <>Varför <span className='whitespace-nowrap'>Microsoft Dynamics 365</span> är branschledande</>,
    link: "/qa#bast",
  },
];

const BigFiveCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bigFiveItems.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + bigFiveItems.length) % bigFiveItems.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bigFiveItems.length);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Fem vanliga frågor om Microsoft Dynamics 365
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Vi svarar ärligt på alla frågor du har om Microsoft Dynamics 365
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto" style={{ contain: 'layout' }}>
          <div className="overflow-hidden" style={{ contain: 'strict' }}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)`, willChange: 'transform' }}
            >
              {bigFiveItems.map((item, index) => (
                <div key={index} className="min-w-full px-2 sm:px-4">
                  <Link to={item.link}>
                    <div className="bg-card p-6 sm:p-8 md:p-12 rounded-lg border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer group">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                          <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                        </div>
                        <h3 className="font-bold text-xl sm:text-2xl mb-3 sm:mb-4 text-card-foreground">{item.title}</h3>
                        <p className="text-base sm:text-lg text-muted-foreground">{item.description}</p>
                        <div className="mt-4 sm:mt-6 text-primary font-semibold group-hover:underline">
                          Läs mer →
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background/80 backdrop-blur-sm"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background/80 backdrop-blur-sm"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-3 mt-8">
            {bigFiveItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-6 h-6 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-12"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BigFiveCarousel;
