/**
 * Anonymt köparunderlag (ingen inloggning, inga personuppgifter).
 * buyer_id sparas i localStorage; profilen cachas lokalt och sparas via
 * serverfunktionen buyer-profile. Varje svar sparas direkt.
 */
import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { updateBuyerContext } from "@/lib/buyerContext";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";

export const SECTIONS = ["company", "current_erp", "scope", "fscm", "crm", "contact_center", "integrations", "project", "assessment"] as const;
export type SectionKey = (typeof SECTIONS)[number];
export type ProfileValue = string | number | boolean | string[];
export type BuyerProfile = Record<SectionKey, Record<string, ProfileValue>>;

const ID_KEY = "d365_buyer_id";
const CACHE_KEY = "d365_buyer_profile_v1";

export const emptyProfile = (): BuyerProfile =>
  Object.fromEntries(SECTIONS.map((s) => [s, {}])) as BuyerProfile;

const isBrowser = () => typeof window !== "undefined";

export function getBuyerId(): string | null {
  if (!isBrowser()) return null;
  try {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

let state: BuyerProfile = emptyProfile();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || !isBrowser()) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = emptyProfile();
      for (const section of SECTIONS) {
        const values = parsed?.[section];
        if (values && typeof values === "object" && !Array.isArray(values)) state[section] = values;
      }
    }
  } catch {
    /* ignore */
  }
}

function emit() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
const EMPTY = emptyProfile();
function getSnapshot() {
  load();
  return state;
}

export function useBuyerProfile(): BuyerProfile {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function getBuyerProfile(): BuyerProfile {
  load();
  return state;
}

/** Sparar en eller flera sektioner. null tar bort ett svar. */
export function saveProfile(patch: Partial<Record<SectionKey, Record<string, ProfileValue | null>>>): void {
  load();
  const next = { ...state };
  for (const [sec, vals] of Object.entries(patch) as [SectionKey, Record<string, ProfileValue | null>][]) {
    const merged = { ...next[sec] };
    for (const [k, v] of Object.entries(vals)) {
      if (v === null || (Array.isArray(v) && v.length === 0)) delete merged[k];
      else merged[k] = v;
    }
    next[sec] = merged;
  }
  state = next;
  emit();
  if (patch.company) {
    const industry = patch.company.industry;
    updateBuyerContext({
      industry: typeof industry === "string" ? STANDARD_INDUSTRIES.find((i) => i.slug === industry)?.name || industry : industry === null ? null : undefined,
      size: typeof patch.company.employees === "string" ? patch.company.employees : patch.company.employees === null ? null : undefined,
    });
  }
  const buyer_id = getBuyerId();
  if (!buyer_id) return;
  void supabase.functions.invoke("buyer-profile", { body: { action: "save", buyer_id, patch } }).catch(() => {});
}

export function setAnswer(section: SectionKey, key: string, value: ProfileValue | null) {
  saveProfile({ [section]: { [key]: value } });
}

export function clearProfile() {
  const buyer_id = getBuyerId();
  state = emptyProfile();
  emit();
  if (buyer_id) void supabase.functions.invoke("buyer-profile", { body: { action: "clear", buyer_id } }).catch(() => {});
}

export function hasAnyAnswer(p: BuyerProfile): boolean {
  return SECTIONS.some((s) => Object.keys(p[s] || {}).length > 0);
}

/** Lägger till applikationer i scope utan att ta bort befintliga. */
export function addScopeApps(apps: string[]) {
  const cur = (getBuyerProfile().scope.apps as string[]) || [];
  const next = Array.from(new Set([...cur, ...apps]));
  if (next.length !== cur.length) setAnswer("scope", "apps", next);
}
