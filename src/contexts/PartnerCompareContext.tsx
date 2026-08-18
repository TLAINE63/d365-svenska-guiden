import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

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
const MAX = 3;


const PartnerCompareContext = createContext<PartnerCompareContextValue | null>(null);

export const PartnerCompareProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<CompareEntry[]>([]);

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSelected(parsed.slice(0, MAX));
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {}
  }, [selected]);

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
  const setFilterContext = useCallback((patch: CompareFilterContext) => {
    setFilterContextState((prev) => {
      const next = { ...prev, ...patch };
      // Shallow-equal check to avoid needless re-renders
      const keys = ["product", "industry", "geography", "companySize"] as const;
      if (keys.every((k) => (prev[k] ?? null) === (next[k] ?? null))) return prev;
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
