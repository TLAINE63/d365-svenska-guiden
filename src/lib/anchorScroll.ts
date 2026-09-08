/**
 * Gemensam hjälp för ankarscroll (t.ex. #partners på produkt- och branschsidor).
 *
 * Vi väntar tills allt dynamiskt innehåll ovanför målsektionen har laddats och
 * layouten slutat flytta sig innan vi scrollar, och kompenserar för den fasta
 * headern så att sektionens rubrik alltid hamnar överst i vyn.
 */

const HEADER_FALLBACK_HEIGHT = 104;
const EXTRA_GAP = 12;
const MAX_WAIT_MS = 8000;
const STABLE_FRAMES = 3;

export function getHeaderOffset(): number {
  const header = document.querySelector("[data-site-nav], header");
  const height = header instanceof HTMLElement ? header.offsetHeight : 0;
  return (height || HEADER_FALLBACK_HEIGHT) + EXTRA_GAP;
}

export function scrollElementIntoView(el: HTMLElement, behavior: ScrollBehavior = "smooth") {
  const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top: Math.max(top, 0), behavior });
}

/**
 * Scrollar till id när sidans layout är stabil. Returnerar en avbrytsfunktion.
 */
export function scrollToAnchorWhenReady(id: string): () => void {
  let cancelled = false;
  let rafId = 0;
  let timeoutId = 0;
  const start = performance.now();
  let lastTop: number | null = null;
  let lastHeight = 0;
  let stable = 0;

  const settle = (el: HTMLElement) => {
    scrollElementIntoView(el);
    timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      const again = document.getElementById(id);
      if (!again) return;
      const diff = Math.abs(again.getBoundingClientRect().top - getHeaderOffset());
      if (diff > 8) scrollElementIntoView(again, "auto");
    }, 800);
  };

  const tick = () => {
    if (cancelled) return;
    const elapsed = performance.now() - start;
    const el = document.getElementById(id);

    if (!el) {
      if (elapsed > MAX_WAIT_MS) return;
      rafId = requestAnimationFrame(tick);
      return;
    }

    const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
    const height = Math.round(document.documentElement.scrollHeight);

    if (top === lastTop && height === lastHeight) {
      stable += 1;
    } else {
      stable = 0;
      lastTop = top;
      lastHeight = height;
    }

    if (stable >= STABLE_FRAMES || elapsed > MAX_WAIT_MS) {
      settle(el);
      return;
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
    window.clearTimeout(timeoutId);
  };
}
