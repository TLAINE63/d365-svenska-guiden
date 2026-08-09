import { useEffect, useState } from "react";

interface Options {
  /** sessionStorage key so the offer only shows once per session. */
  storageKey: string;
  /** Skip entirely (e.g. user already converted). */
  disabled?: boolean;
  /** Minimum ms on page before it may trigger. */
  minTimeOnPage?: number;
}

/**
 * Exit-intent detection. Desktop: pointer leaves through the top of the
 * viewport. Mobile: fast upward scroll after having scrolled down.
 * Only ever triggers once per session per storageKey.
 */
export function useExitIntent({ storageKey, disabled, minTimeOnPage = 8000 }: Options) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (disabled || typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(storageKey) === "true") return;
    } catch {
      /* ignore */
    }

    const mountedAt = Date.now();
    let lastY = window.scrollY;
    let done = false;

    const fire = () => {
      if (done) return;
      if (Date.now() - mountedAt < minTimeOnPage) return;
      done = true;
      try {
        sessionStorage.setItem(storageKey, "true");
      } catch {
        /* ignore */
      }
      setTriggered(true);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) fire();
    };
    const onScroll = () => {
      const y = window.scrollY;
      const delta = lastY - y;
      lastY = y;
      // Fast upward flick after being well down the page (mobile exit signal)
      if (delta > 90 && y > 600) fire();
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [storageKey, disabled, minTimeOnPage]);

  const dismiss = () => setTriggered(false);

  return { triggered, dismiss };
}
