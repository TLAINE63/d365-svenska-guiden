import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === null) {
      // Small delay to avoid layout shift on initial load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                Vi värnar om din integritet
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Vi använder cookies för att förbättra din upplevelse på vår webbplats. 
                Vi använder också B2B-besökaridentifiering för att förstå vilka företag 
                som besöker oss – detta identifierar endast företag, inte individer.
              </p>
              <p className="text-sm text-muted-foreground">
                Läs mer i vår{" "}
                <Link 
                  to="/dataskydd" 
                  className="text-primary hover:underline font-medium"
                >
                  dataskyddspolicy
                </Link>
                .
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDecline}
                className="order-2 sm:order-1"
              >
                Endast nödvändiga
              </Button>
              <Button 
                size="sm" 
                onClick={handleAccept}
                className="order-1 sm:order-2"
              >
                Acceptera alla
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDecline}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors sm:hidden"
            aria-label="Stäng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
