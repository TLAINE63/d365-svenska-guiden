// Frivilligt köparkonto: speglar lokalt sparad plan, kortlista och kalkyler
// till buyer_saved_state så att de finns kvar på andra enheter.
// Utan inloggning förblir allt lokalt och anonymt som tidigare.
import { supabase } from "@/integrations/supabase/client";

export const SYNCED_KEYS = [
  "d365_plan_v1",
  "d365-shortlist",
  "d365-kalkylator-utkast-v1",
  "d365_buyer_context_v1",
  "d365_buyer_profile_v1",
  "d365_systemval_context_v1",
] as const;

const PULLED_FLAG = "d365_account_pulled";

function readLocal(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of SYNCED_KEYS) {
    try {
      const v = localStorage.getItem(k);
      if (v !== null) out[k] = v;
    } catch { /* ignore */ }
  }
  return out;
}

let timer: number | null = null;
let lastPushed = "";
let currentUser: string | null = null;

async function push() {
  if (!currentUser) return;
  const data = readLocal();
  const json = JSON.stringify(data);
  if (json === lastPushed) return;
  const { error } = await supabase
    .from("buyer_saved_state")
    .upsert({ user_id: currentUser, data, updated_at: new Date().toISOString() });
  if (!error) lastPushed = json;
  else console.error("Kunde inte spara kontodata", error.message);
}

async function pullAndMerge(userId: string) {
  const { data: row, error } = await supabase
    .from("buyer_saved_state")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) { console.error("Kunde inte läsa kontodata", error.message); return; }
  const server = (row?.data ?? {}) as Record<string, string>;
  const local = readLocal();
  let changed = false;
  for (const k of SYNCED_KEYS) {
    const s = server[k];
    if (typeof s === "string" && s !== local[k]) {
      try { localStorage.setItem(k, s); changed = true; } catch { /* ignore */ }
    }
  }
  await push();
  // Lokala moduler läser vid start – ladda om en gång per inloggning när data hämtats.
  const flag = `${PULLED_FLAG}:${userId}`;
  if (changed && !sessionStorage.getItem(flag)) {
    sessionStorage.setItem(flag, "1");
    window.location.reload();
  } else {
    sessionStorage.setItem(flag, "1");
  }
}

function start(userId: string) {
  if (currentUser === userId) return;
  currentUser = userId;
  lastPushed = "";
  void pullAndMerge(userId);
  if (timer) window.clearInterval(timer);
  timer = window.setInterval(() => { void push(); }, 4000);
}

function stop() {
  currentUser = null;
  if (timer) window.clearInterval(timer);
  timer = null;
}

let initialized = false;
export function initAccountSync() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  supabase.auth.onAuthStateChange((_e, session) => {
    if (session?.user) start(session.user.id);
    else stop();
  });
  supabase.auth.getSession().then(({ data }) => {
    if (data.session?.user) start(data.session.user.id);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void push();
  });
}

export async function flushAccountSync() { await push(); }
