import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  durationMs?: number;
  suffix?: string;
  className?: string;
}

/**
 * Räknar upp ett tal från 0 till value med mjuk inbromsning när komponenten
 * syns i viewport. Respekterar prefers-reduced-motion (visar slutvärdet direkt).
 */
const CountUp = ({ value, durationMs = 1600, suffix = "", className = "" }: Props) => {
  // Keep real counts in server-rendered HTML; animation begins on visibility.
  const [display, setDisplay] = useState(value);
  const displayedValue = useRef(value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frameId: number | undefined;
    let observer: IntersectionObserver | undefined;
    const updateDisplay = (next: number) => {
      displayedValue.current = next;
      setDisplay(next);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || value <= 0 || durationMs <= 0) {
      updateDisplay(value);
      return;
    }

    const start = () => {
      const from = started.current ? displayedValue.current : 0;
      started.current = true;
      updateDisplay(from);
      const t0 = performance.now();
      const tick = (now: number) => {
        // A frame timestamp can land slightly before t0; clamp so the count never goes negative.
        const p = Math.max(0, Math.min(1, (now - t0) / durationMs));
        const eased = 1 - Math.pow(1 - p, 3);
        updateDisplay(Math.round(from + eased * (value - from)));
        if (p < 1) frameId = requestAnimationFrame(tick);
      };
      frameId = requestAnimationFrame(tick);
    };

    if (started.current || !("IntersectionObserver" in window)) {
      start();
    } else {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Already on screen: begin before the observer's first callback.
        start();
      } else {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              observer?.disconnect();
              start();
            }
          },
          { threshold: 0, rootMargin: "0px 0px -8% 0px" },
        );
        observer.observe(el);
      }
    }
    return () => {
      observer?.disconnect();
      if (frameId !== undefined) cancelAnimationFrame(frameId);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("sv-SE")}
      {suffix}
    </span>
  );
};

export default CountUp;
