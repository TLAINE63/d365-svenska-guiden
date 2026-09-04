/**
 * Anonym mätning av köparverktygen (behovsanalys, kravspecifikation, jämförelsevy).
 * Ingen persondata, ingen fritext – bara verktyg, status, produkt/bransch/storlek
 * samt vilka partner-id:n som matchades. Sessionsnyckeln hashas serverside.
 */

export type BuyerTool = "behovsanalys" | "kravspecifikation" | "jamforelse";
export type BuyerToolStatus = "paborjad" | "slutford" | "avbruten";

export interface BuyerToolEvent {
  tool: BuyerTool;
  status: BuyerToolStatus;
  product_key?: string | null;
  industry?: string | null;
  company_size?: string | null;
  matched_partner_ids?: string[];
}

function getSessionId(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const key = "visitor_session_id";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function trackBuyerToolEvent(event: BuyerToolEvent): void {
  try {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/admin")) return;

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-buyer-tool-event`;
    const body = JSON.stringify({ ...event, session_id: getSessionId() });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  } catch {
    /* swallow */
  }
}

/**
 * Registrerar "påbörjad" och markerar automatiskt "avbruten" om besökaren
 * lämnar sidan utan att körningen hunnit rapporteras som slutförd.
 * Returnerar en cleanup-funktion (för useEffect) plus en markComplete-hook.
 */
export function startBuyerToolRun(
  tool: BuyerTool,
  context: Omit<BuyerToolEvent, "tool" | "status"> = {},
): { cleanup: () => void; markCompleted: () => void } {
  let completed = false;
  trackBuyerToolEvent({ ...context, tool, status: "paborjad" });

  const abandon = () => {
    if (completed) return;
    completed = true;
    trackBuyerToolEvent({ ...context, tool, status: "avbruten" });
  };

  if (typeof window !== "undefined") {
    window.addEventListener("pagehide", abandon);
  }

  return {
    cleanup: () => {
      if (typeof window !== "undefined") window.removeEventListener("pagehide", abandon);
      abandon();
    },
    markCompleted: () => {
      completed = true;
    },
  };
}
