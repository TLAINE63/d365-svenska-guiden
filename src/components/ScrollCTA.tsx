import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";
import ContactFormDialog from "./ContactFormDialog";

const DISMISS_KEY = "scroll-cta-dismissed";

const isHiddenRoute = (pathname: string) => {
  if (pathname.startsWith("/admin")) return true;
  // Partner profile has its own StickyContactCTA in bottom-left
  if (/^\/partners\/[^/]+\/?$/.test(pathname)) return true;
  // Thank-you / result flows – user is already converting
  if (pathname.startsWith("/beslutsmognad-tack")) return true;
  if (pathname.startsWith("/dataskydd")) return true;
  return false;
};

const ScrollCTA = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Load dismissed state per session
  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "true") setIsDismissed(true);
    } catch {}
  }, []);

  // Reset visibility on route change
  useEffect(() => {
    setIsVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isDismissed) return;
    if (isHiddenRoute(location.pathname)) return;

    const handleScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height <= 0) return;
      const scrollPercent = (window.scrollY / height) * 100;
      setIsVisible(scrollPercent > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed, location.pathname]);

  const dismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "true");
    } catch {}
  };

  if (isHiddenRoute(location.pathname)) return null;
  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:bottom-6 z-40 animate-fade-in pointer-events-none">
      <div className="bg-card/95 backdrop-blur border border-border shadow-xl rounded-lg p-4 sm:p-5 max-w-sm mx-auto sm:mx-0 relative pointer-events-auto">
        <button
          onClick={dismiss}
          className="absolute top-2 right-2 p-1 rounded hover:bg-muted transition-colors"
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
              <Button
                size="sm"
                className="w-full sm:w-auto bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground"
              >
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
