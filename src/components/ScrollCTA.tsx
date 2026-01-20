import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";
import ContactFormDialog from "./ContactFormDialog";

const ScrollCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercent > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 animate-fade-in">
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl p-4 sm:p-5 max-w-sm mx-auto sm:mx-0 relative">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Stäng"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
        
        <div className="flex items-start gap-3 pr-6">
          <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-card-foreground text-sm sm:text-base mb-1">
              Osäker på var du ska börja?
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              Boka en kostnadsfri 15-minuters rådgivning
            </p>
            <ContactFormDialog>
              <Button size="sm" className="w-full sm:w-auto">
                Boka rådgivning
              </Button>
            </ContactFormDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollCTA;
