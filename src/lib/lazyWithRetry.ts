import { lazy, type ComponentType } from "react";

const CHUNK_ERROR_PATTERNS = [
  "Failed to fetch dynamically imported module",
  "Importing a module script failed",
  "error loading dynamically imported module",
  "Loading chunk",
  "Loading CSS chunk",
  "Unable to preload CSS",
  "ChunkLoadError",
];

const isChunkError = (error: unknown): boolean => {
  const err = error as Error | undefined;
  const msg = err?.message ?? String(error ?? "");
  return CHUNK_ERROR_PATTERNS.some((p) => msg.includes(p) || err?.name === p);
};

const RELOAD_KEY = "lazy-chunk-reload";
const RELOAD_COOLDOWN_MS = 30_000;

/**
 * Triggers one guarded full-page reload so the browser fetches fresh chunk URLs.
 * Guarded via sessionStorage + cooldown to avoid reload loops if the failure persists.
 */
export const reloadForStaleChunk = (): void => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    const now = Date.now();
    if (!last || now - last > RELOAD_COOLDOWN_MS) {
      sessionStorage.setItem(RELOAD_KEY, String(now));
      const url = new URL(window.location.href);
      url.searchParams.set("_r", String(now));
      window.location.replace(url.toString());
    }
  } catch {
    window.location.reload();
  }
};

/**
 * React.lazy wrapper that recovers from stale chunk errors (new deploy changed
 * JS file hashes while the tab was open) by forcing a guarded reload instead of
 * silently rendering the Suspense fallback forever.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(() =>
    factory().catch((error: unknown) => {
      if (isChunkError(error) && typeof window !== "undefined") {
        reloadForStaleChunk();
        // Keep the promise pending while the page reloads.
        return new Promise<{ default: T }>(() => {});
      }
      throw error;
    })
  );
}
