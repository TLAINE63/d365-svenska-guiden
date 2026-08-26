import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

export type ShortlistEntry = {
  slug: string;
  name: string;
  /** Full profile path, e.g. /partner/xxx/ eller /basic/xxx/ */
  url: string;
  /** true = verifierad partner, false = övrig partner */
  verified?: boolean;
  addedAt?: number;
};

interface ShortlistContextValue {
  items: ShortlistEntry[];
  isSaved: (slug: string) => boolean;
  toggle: (entry: ShortlistEntry) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
}

const STORAGE_KEY = "d365-shortlist";

const fallback: ShortlistContextValue = {
  items: [],
  isSaved: () => false,
  toggle: () => {},
  remove: () => {},
  clear: () => {},
  count: 0,
};

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export const ShortlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ShortlistEntry[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((e) => e && e.slug));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: ShortlistEntry[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    (entry: ShortlistEntry) => {
      setItems((prev) => {
        const exists = prev.some((e) => e.slug === entry.slug);
        const next = exists
          ? prev.filter((e) => e.slug !== entry.slug)
          : [...prev, { ...entry, addedAt: Date.now() }];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        trackFunnelEvent({
          event_type: "cta_click",
          event_name: exists ? "shortlist_remove" : "shortlist_add",
          metadata: { partner: entry.slug, size: next.length },
        });
        return next;
      });
    },
    [],
  );

  const remove = useCallback(
    (slug: string) => {
      persist(items.filter((e) => e.slug !== slug));
    },
    [items, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const value = useMemo<ShortlistContextValue>(
    () => ({
      items,
      isSaved: (slug: string) => items.some((e) => e.slug === slug),
      toggle,
      remove,
      clear,
      count: items.length,
    }),
    [items, toggle, remove, clear],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
};

/** Fungerar även utan provider (SSR/prerender) – returnerar då en tom shortlist. */
export const useShortlist = (): ShortlistContextValue =>
  useContext(ShortlistContext) ?? fallback;
