import { useEffect, useState } from "react";
import { usePlanMeta } from "@/lib/d365Plan";
import { readToolContext } from "@/lib/toolContext";
import { buyerScope, resolveBuyerAction, type BuyerState } from "@/lib/buyerNextAction";
import type { SourceTemplate } from "@/lib/nextSteps";

export function useBuyerAction(path: string, template?: SourceTemplate) {
  const plan = usePlanMeta();
  const scope = buyerScope(path);
  const [tools, setTools] = useState(readToolContext);
  const [selected, setSelected] = useState<{ scope: string; state: BuyerState }>();
  useEffect(() => {
    const refresh = () => setTools(readToolContext());
    refresh();
    window.addEventListener("d365-tool-context", refresh);
    window.addEventListener("storage", refresh);
    try {
      const state = sessionStorage.getItem(`d365_next_step:${scope}`);
      setSelected(state && ["EXPLORE", "FRAME", "DECIDE", "ACT", "EVOLVE"].includes(state) ? { scope, state: state as BuyerState } : undefined);
    } catch { setSelected(undefined); }
    return () => { window.removeEventListener("d365-tool-context", refresh); window.removeEventListener("storage", refresh); };
  }, [scope]);
  const choose = (state: BuyerState) => {
    setSelected({ scope, state });
    try { sessionStorage.setItem(`d365_next_step:${scope}`, state); } catch { /* local fallback */ }
  };
  return { action: resolveBuyerAction({ path, template, plan, tools, choice: selected?.scope === scope ? selected.state : undefined }), choose };
}