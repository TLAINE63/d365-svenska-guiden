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
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || value <= 0) {
      setDisplay(value);
      return;
    }

    const start = () => {
      if (started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / durationMs);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * value));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            obs.disconnect();
            start();
          }
        },
        { threshold: 0.4 },
      );
      obs.observe(el);
      return () => obs.disconnect();
    }
    start();
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("sv-SE")}
      {suffix}
    </span>
  );
};

export default CountUp;
