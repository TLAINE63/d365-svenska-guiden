import { useState, useEffect } from "react";

/**
 * Defers mounting of non-critical components until after the browser is idle.
 * This removes them from the critical network dependency chain.
 */
export function useDeferredLoad(delayMs = 0): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: delayMs || 4000 });
      return () => cancelIdleCallback(id);
    } else {
      const t = setTimeout(() => setReady(true), delayMs || 3000);
      return () => clearTimeout(t);
    }
  }, [delayMs]);

  return ready;
}
