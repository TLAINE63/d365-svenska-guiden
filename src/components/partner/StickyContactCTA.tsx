import { useEffect, useState } from "react";
import { Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyContactCTAProps {
  partnerName: string;
  onBookMeeting: () => void;
  onIntro: () => void;
}

/**
 * Sticky floating CTA that appears once the user scrolls past the hero area.
 * Two primary actions: book a first meeting or request an intro.
 * Hidden while the main lead-form dialog is open (parent unmounts if needed).
 */
export const StickyContactCTA = ({ partnerName, onBookMeeting, onIntro }: StickyContactCTAProps) => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      // Show after 600px scroll – user is past the hero
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Mobile: full-width bottom bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur px-3 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
        role="region"
        aria-label={`Kontakta ${partnerName}`}
      >
        <div className="flex gap-2">
          <Button
            onClick={onIntro}
            variant="outline"
            className="flex-1 h-11 text-sm font-semibold"
          >
            <MessageCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Be om intro
          </Button>
          <Button
            onClick={onBookMeeting}
            className="flex-1 h-11 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Calendar className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Boka första möte
          </Button>
        </div>
      </div>

      {/* Desktop: floating bottom-left stack to avoid overlap with AI chat bubble (bottom-right) */}
      <div className="hidden md:flex fixed bottom-6 left-6 z-40 flex-col items-start gap-2">
        {expanded && (
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
              Kontakta {partnerName}
            </p>
            <Button
              onClick={onBookMeeting}
              className="justify-start h-11 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md"
            >
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              Boka första möte
            </Button>
            <Button
              onClick={onIntro}
              variant="outline"
              className="justify-start h-11 px-4 font-semibold"
            >
              <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
              Be om introduktion
            </Button>
            <button
              onClick={() => setExpanded(false)}
              className="text-[11px] text-muted-foreground hover:text-foreground self-end px-1"
              aria-label="Minimera kontaktknappar"
            >
              Minimera
            </button>
          </div>
        )}
        {!expanded && (
          <Button
            onClick={() => setExpanded(true)}
            className="h-12 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-xl rounded-full"
            aria-label={`Kontakta ${partnerName}`}
          >
            <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
            Kontakta partner
          </Button>
        )}
      </div>
    </>
  );
};

export default StickyContactCTA;
