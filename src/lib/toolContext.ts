/**
 * Verktygskontext för CRM-exporten: senaste inmatning och resultat från kalkylatorer och guider
 * under besöket (sessionStorage). Skickas bara med när besökaren själv skickar ett formulär.
 * Inga personuppgifter: företagsnamn och fritext sparas aldrig här.
 */
import { useEffect } from "react";
import { isInternalTraffic } from "@/lib/sessionPages";

export const TOOL_CONTEXT_KEY = "d365_tool_context";
const MAX_TOOLS = 8;
const MAX_VALUES = 12;

export interface ToolEntry {
  tool: string;
  label: string;
  at: string;
  industry?: string;
  users?: number;
  values: Record<string, string>;
}

const s = (v: unknown, n = 120) => (typeof v === "string" ? v.trim().slice(0, n) : "");

/** Ren funktion: ersätter verktygets tidigare post och håller de senaste MAX_TOOLS. */
export function upsertTool(list: ToolEntry[], entry: ToolEntry): ToolEntry[] {
  const clean: ToolEntry = {
    tool: s(entry.tool, 40), label: s(entry.label, 80), at: s(entry.at, 30),
    ...(s(entry.industry) ? { industry: s(entry.industry) } : {}),
    ...(Number.isFinite(entry.users) && (entry.users as number) > 0 ? { users: Math.round(entry.users as number) } : {}),
    values: Object.fromEntries(Object.entries(entry.values || {}).filter(([k, v]) => s(k) && s(v)).slice(0, MAX_VALUES).map(([k, v]) => [s(k, 60), s(v)])),
  };
  return [...list.filter((t) => t.tool !== clean.tool), clean].slice(-MAX_TOOLS);
}

export function readToolContext(): ToolEntry[] {
  try {
    const v = JSON.parse(window.sessionStorage.getItem(TOOL_CONTEXT_KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => x && typeof x.tool === "string").slice(-MAX_TOOLS) : [];
  } catch { return []; }
}

export function recordTool(entry: Omit<ToolEntry, "at">): void {
  if (typeof window === "undefined" || isInternalTraffic()) return;
  try {
    const next = upsertTool(readToolContext(), { ...entry, at: new Date().toISOString() });
    window.sessionStorage.setItem(TOOL_CONTEXT_KEY, JSON.stringify(next));
  } catch { /* formuläret skickas utan verktygskontext */ }
}

/** Sparar verktygets läge efter att besökaren slutat ändra (debounce), aldrig vid första render. */
export function useRecordTool(entry: Omit<ToolEntry, "at">, enabled = true): void {
  const key = JSON.stringify(entry);
  useEffect(() => {
    if (!enabled) return;
    const t = window.setTimeout(() => recordTool(JSON.parse(key)), 1200);
    return () => window.clearTimeout(t);
  }, [key, enabled]);
}

export const kr = (n: number | null | undefined) =>
  n == null || !Number.isFinite(n) ? "" : `${Math.round(n / 1000).toLocaleString("sv-SE").replace(/\u00A0/g, " ")} tkr`;
export const months = (n: number | null | undefined) => (n == null || !Number.isFinite(n) ? "ej återbetald" : `${Math.round(n)} mån`);
export const pct = (n: number | null | undefined) => (n == null || !Number.isFinite(n) ? "" : `${Math.round(n)} %`);
