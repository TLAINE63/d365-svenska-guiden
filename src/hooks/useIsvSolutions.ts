import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BC_ISV_SOLUTIONS, type IsvSolution } from "@/data/bcIsvSolutions";

export interface IsvOverride {
  solution_id: string;
  short_description: string | null;
  what: string | null;
  when_fits: string | null;
  use_cases: string[] | null;
  combos: string[] | null;
}

export function applyIsvOverrides(
  solutions: IsvSolution[],
  overrides: Record<string, IsvOverride>
): IsvSolution[] {
  if (!Object.keys(overrides).length) return solutions;
  return solutions.map((s) => {
    const o = overrides[s.id];
    if (!o) return s;
    return {
      ...s,
      shortDescription: o.short_description?.trim() || s.shortDescription,
      what: o.what?.trim() || s.what,
      whenFits: o.when_fits?.trim() || s.whenFits,
      useCases: o.use_cases?.length ? o.use_cases : s.useCases,
      combos: o.combos?.length ? o.combos : s.combos,
    };
  });
}

/**
 * Returnerar ISV-katalogen med eventuella admin-redigerade texter pålagda.
 * Faller alltid tillbaka på den statiska katalogen (viktigt för SSG).
 */
export function useIsvSolutions(): IsvSolution[] {
  const [overrides, setOverrides] = useState<Record<string, IsvOverride>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("isv_solution_overrides")
        .select("solution_id, short_description, what, when_fits, use_cases, combos");
      if (error || cancelled || !data) return;
      const map: Record<string, IsvOverride> = {};
      for (const row of data as IsvOverride[]) map[row.solution_id] = row;
      setOverrides(map);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => applyIsvOverrides(BC_ISV_SOLUTIONS, overrides), [overrides]);
}
