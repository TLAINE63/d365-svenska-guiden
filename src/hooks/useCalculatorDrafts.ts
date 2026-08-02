// Lokalt sparade utkast för pris- och omfattningskalkylatorn.
// Sparas i webbläsarens localStorage – ingen data lämnar besökarens enhet.

import { useCallback, useEffect, useState } from "react";
import type { Complexity, SolutionKey } from "@/lib/implementationEstimate";

const STORAGE_KEY = "d365-kalkylator-utkast-v1";
const MAX_DRAFTS = 20;

export interface CalculatorDraftInputs {
  solutions: SolutionKey[];
  users: number;
  premiumLicense: boolean;
  complexity: Complexity;
  integrations: number;
  legalEntities: number;
  dataMigration: boolean;
  customDevelopment: boolean;
  training: boolean;
  hourlyRate: number;
}

export interface CalculatorDraft {
  id: string;
  name: string;
  savedAt: string;
  inputs: CalculatorDraftInputs;
  /** Ögonblicksbild av resultatet vid sparandet, för snabb översikt i listan. */
  summary: {
    costLow: number;
    costHigh: number;
    hours: number;
    months: number;
    licenseMonthly: number | null;
    threeYearTotal: number | null;
  };
}

function read(): CalculatorDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CalculatorDraft[]) : [];
  } catch {
    return [];
  }
}

function write(drafts: CalculatorDraft[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts.slice(0, MAX_DRAFTS)));
  } catch {
    /* localStorage kan vara blockerat – utkast sparas då bara i minnet */
  }
}

export function useCalculatorDrafts() {
  const [drafts, setDrafts] = useState<CalculatorDraft[]>([]);

  useEffect(() => {
    setDrafts(read());
  }, []);

  const saveDraft = useCallback(
    (
      name: string,
      inputs: CalculatorDraftInputs,
      summary: CalculatorDraft["summary"],
      existingId?: string,
    ): CalculatorDraft => {
      const draft: CalculatorDraft = {
        id: existingId ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim() || "Namnlöst utkast",
        savedAt: new Date().toISOString(),
        inputs,
        summary,
      };
      setDrafts((prev) => {
        const next = [draft, ...prev.filter((d) => d.id !== draft.id)].slice(0, MAX_DRAFTS);
        write(next);
        return next;
      });
      return draft;
    },
    [],
  );

  const deleteDraft = useCallback((id: string) => {
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== id);
      write(next);
      return next;
    });
  }, []);

  const renameDraft = useCallback((id: string, name: string) => {
    setDrafts((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, name: name.trim() || d.name } : d));
      write(next);
      return next;
    });
  }, []);

  return { drafts, saveDraft, deleteDraft, renameDraft, maxDrafts: MAX_DRAFTS };
}
