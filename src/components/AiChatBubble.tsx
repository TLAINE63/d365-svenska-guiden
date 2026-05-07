import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare, X } from "lucide-react";
import AiChatPanel from "./AiChatPanel";

const HIDDEN_PATHS = ["/admin", "/partner-update", "/partner-events", "/avtalssida", "/partner-avtal", "/partnerstatistik", "/partner-statistik", "/fraga-ai"];

export default function AiChatBubble() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Hide on admin/partner-internal pages and on the dedicated chat page
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Stäng AI-chat" : "Öppna AI-chat"}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform flex items-center justify-center group"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cta-orange animate-pulse" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(92vw,400px)] h-[min(70vh,560px)] rounded-2xl bg-background border border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
            <div>
              <p className="font-semibold text-sm">Fråga AI om Dynamics 365</p>
              <p className="text-[11px] text-muted-foreground">Oberoende rådgivning från d365.se</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Stäng" className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <AiChatPanel className="flex-1" compact />
        </div>
      )}
    </>
  );
}
