import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

interface Props {
  to: string;
  source: string;
  buttonLabel?: string;
}

/**
 * Diskret sticky CTA: högerkolumn på desktop, bottenrad på mobil.
 * Visas när besökaren scrollat cirka 25 % av sidan.
 */
const StickyPartnerCTA = ({ to, source, buttonLabel = "Visa partnerlista" }: Props) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(total > 0 && window.scrollY / total > 0.25);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const track = () =>
    trackFunnelEvent({
      event_type: "cta_click",
      event_name: "guide_sticky_cta_click",
      metadata: { source, target: to },
    });

  if (!visible || dismissed) return null;

  return (
    <>
      {/* Desktop: diskret högerkolumn */}
      <aside className="hidden xl:block fixed right-6 top-32 z-30 w-64 print:hidden">
        <div className="relative rounded-lg border border-border bg-card p-4 shadow-lg">
          <button
            onClick={() => setDismissed(true)}
            aria-label="Stäng"
            className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="pr-5 text-sm font-bold leading-snug">Jämför Dynamics 365-partners</p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Filtrera på produktområde, bransch och storlek.
          </p>
          <Link
            to={to}
            onClick={track}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[hsl(var(--cta-orange))] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[hsl(var(--cta-orange-hover))]"
          >
            {buttonLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* Mobil: sticky footer */}
      <div className="xl:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 py-2 backdrop-blur print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDismissed(true)}
            aria-label="Stäng"
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <Link
            to={to}
            onClick={track}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[hsl(var(--cta-orange))] px-4 py-3 text-sm font-bold text-white"
          >
            {buttonLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default StickyPartnerCTA;
