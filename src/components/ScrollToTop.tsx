import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hanterar scrollposition vid navigering.
 *
 * Vid ankarlänkar (t.ex. /business-central#partners) väntar vi tills allt
 * dynamiskt innehåll ovanför målsektionen har laddats och layouten slutat
 * flytta sig. Först därefter scrollar vi fram sektionen, med marginal för
 * den fasta headern, så att rubriken alltid hamnar överst i vyn.
 */

const HEADER_FALLBACK_HEIGHT = 72;
const EXTRA_GAP = 12;
const MAX_WAIT_MS = 6000;
const STABLE_FRAMES = 3;

function headerOffset(): number {
  const header = document.querySelector("[data-site-nav], header");
  const height = header instanceof HTMLElement ? header.offsetHeight : 0;
  return (height || HEADER_FALLBACK_HEIGHT) + EXTRA_GAP;
}

function scrollToElement(el: HTMLElement) {
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
}

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = decodeURIComponent(hash.replace("#", ""));
    let cancelled = false;
    let rafId = 0;
    const start = performance.now();
    let lastTop: number | null = null;
    let lastHeight = 0;
    let stableCount = 0;

    const tick = () => {
      if (cancelled) return;

      const el = document.getElementById(id);
      const elapsed = performance.now() - start;

      if (!el) {
        if (elapsed > MAX_WAIT_MS) return;
        rafId = requestAnimationFrame(tick);
        return;
      }

      const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
      const height = Math.round(document.documentElement.scrollHeight);

      // Layouten räknas som stabil när målets position och sidans höjd
      // är oförändrade några frames i rad – då är innehållet ovanför klart.
      if (top === lastTop && height === lastHeight) {
        stableCount += 1;
      } else {
        stableCount = 0;
        lastTop = top;
        lastHeight = height;
      }

      if (stableCount >= STABLE_FRAMES || elapsed > MAX_WAIT_MS) {
        scrollToElement(el);
        // Kontrollscroll efter eventuella sena bild-/innehållsladdningar.
        window.setTimeout(() => {
          if (cancelled) return;
          const again = document.getElementById(id);
          if (!again) return;
          const diff = Math.abs(again.getBoundingClientRect().top - headerOffset());
          if (diff > 8) scrollToElement(again);
        }, 700);
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
