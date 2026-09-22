import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { trackPartnerEvent } from "@/utils/trackPartnerEvent";

type CompareEntry = { slug: string; name: string };

export type CompareFilterContext = {
  /** Product filter key (bc | fsc | sales | service) or comma-separated list. */
  product?: string | null;
  /** Industry name (e.g. "Tillverkning"). */
  industry?: string | null;
  /** Geography (e.g. "Sverige"). */
  geography?: string | null;
  /** Company size bucket. */
  companySize?: string | null;
  /** Revenue bucket. */
  revenue?: string | null;
};

interface PartnerCompareContextValue {
  selected: CompareEntry[];
  isSelected: (slug: string) => boolean;
  toggle: (entry: CompareEntry) => void;
  remove: (slug: string) => void;
  clear: () => void;
  max: number;
  filterContext: CompareFilterContext;
  setFilterContext: (patch: CompareFilterContext) => void;
}

const STORAGE_KEY = "partner-compare-selection";
const FILTER_STORAGE_KEY = "partner-compare-filters";
const MAX = 3;


const PartnerCompareContext = createContext<PartnerCompareContextValue | null>(null);

const readStoredSelection = (): CompareEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => e && typeof e.slug === "string")
      .slice(0, MAX) as CompareEntry[];
  } catch {
    return [];
  }
};

export const PartnerCompareProvider = ({ children }: { children: ReactNode }) => {
  // Lazy init so a page load never overwrites the stored selection with [].
  const [selected, setSelected] = useState<CompareEntry[]>(() => readStoredSelection());
  const [hydrated, setHydrated] = useState(false);

  // Hydration-safe restore: SSR/prerender starts empty, client fills in after mount.
  useEffect(() => {
    const stored = readStoredSelection();
    setSelected((prev) => (prev.length === 0 && stored.length > 0 ? stored : prev));
    setHydrated(true);
  }, []);

  // Persist (only after restore, so we never clobber the stored list)
  useEffect(() => {
    if (typeof window === "undefined" || !hydrated) return;
    try {
      const payload = JSON.stringify(selected);
      window.localStorage.setItem(STORAGE_KEY, payload);
      window.sessionStorage.setItem(STORAGE_KEY, payload);
    } catch {}
  }, [selected, hydrated]);

  const isSelected = useCallback(
    (slug: string) => selected.some((s) => s.slug === slug),
    [selected]
  );

  const toggle = useCallback((entry: CompareEntry) => {
    setSelected((prev) => {
      if (prev.some((s) => s.slug === entry.slug)) {
        return prev.filter((s) => s.slug !== entry.slug);
      }
      // Anonymous measurement: partner added to comparison (shortlist signal)
      trackFunnelEvent({
        event_type: "cta_click",
        event_name: "partner_compare_add",
        metadata: { partner_slug: entry.slug },
      });
      trackPartnerEvent({
        event: "partner_added_to_comparison",
        partnerSlug: entry.slug,
        metadata: { position: prev.length + 1 },
      });
      if (prev.length >= MAX) {
        // Replace oldest (FIFO) so user can keep switching
        return [...prev.slice(1), entry];
      }
      return [...prev, entry];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSelected((prev) => prev.filter((s) => s.slug !== slug));
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const [filterContext, setFilterContextState] = useState<CompareFilterContext>({});

  // Restore the last used filter context so it survives page reloads within the session.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(FILTER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setFilterContextState(parsed);
      }
    } catch {}
  }, []);

  const setFilterContext = useCallback((patch: CompareFilterContext) => {
    setFilterContextState((prev) => {
      const next = { ...prev, ...patch };
      // Shallow-equal check to avoid needless re-renders
      const keys = ["product", "industry", "geography", "companySize", "revenue"] as const;
      if (keys.every((k) => (prev[k] ?? null) === (next[k] ?? null))) return prev;
      try {
        sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ selected, isSelected, toggle, remove, clear, max: MAX, filterContext, setFilterContext }),
    [selected, isSelected, toggle, remove, clear, filterContext, setFilterContext]
  );

  return (
    <PartnerCompareContext.Provider value={value}>{children}</PartnerCompareContext.Provider>
  );
};

export const usePartnerCompare = () => {
  const ctx = useContext(PartnerCompareContext);
  if (!ctx) {
    // Safe no-op fallback so components don't crash if provider missing
    return {
      selected: [] as CompareEntry[],
      isSelected: () => false,
      toggle: () => {},
      remove: () => {},
      clear: () => {},
      max: MAX,
      filterContext: {},
      setFilterContext: () => {},
    } as PartnerCompareContextValue;
  }

  return ctx;
};
