import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

type CompareEntry = { slug: string; name: string };

interface PartnerCompareContextValue {
  selected: CompareEntry[];
  isSelected: (slug: string) => boolean;
  toggle: (entry: CompareEntry) => void;
  remove: (slug: string) => void;
  clear: () => void;
  max: number;
}

const STORAGE_KEY = "partner-compare-selection";
const MAX = 2;

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

  const value = useMemo(
    () => ({ selected, isSelected, toggle, remove, clear, max: MAX }),
    [selected, isSelected, toggle, remove, clear]
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
    } as PartnerCompareContextValue;
  }
  return ctx;
};
