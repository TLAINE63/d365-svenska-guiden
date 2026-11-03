import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { trackToolCompleted, type DEMAND_TOOL_OBJECTS } from "@/lib/demandEvents";

interface Options {
  /** Verktygets ursprungliga sökväg, t.ex. "/kostnad". */
  base: string;
  /** Sant när resultatvyn visas. */
  hasResult: boolean;
  /** Objekt för anonym tool_completed. Utelämnas när databasen själv skapar händelsen. */
  object?: (typeof DEMAND_TOOL_OBJECTS)[number];
}

const norm = (p: string) => p.replace(/\/+$/, "");

/** Pure: resultatadressen för ett verktyg. */
export function resultPath(base: string): string {
  return `${norm(base)}/resultat/`;
}

/**
 * Signaladress för verktygsresultat (Demand Engine, steg 2, 1.1 och 3B.4):
 * - när resultatet räknas fram byter adressen till {base}/resultat/ (push) och tool_completed skickas en gång;
 * - öppnas /resultat/ utan svar går vi tillbaka till verktygets startvy (replace);
 * - ett resultat som redan visas vid sidladdning (omladdning, sparad progress) ger ingen ny händelse.
 */
export function useToolResultSignal({ base, hasResult, object }: Options) {
  const location = useLocation();
  const navigate = useNavigate();
  const onResultUrl = norm(location.pathname) === norm(resultPath(base));
  const prev = useRef<boolean | null>(null);
  const latest = useRef(hasResult);
  latest.current = hasResult;
  // Resultat som dyker upp utan att besökaren gjort något (återställd progress, hydrering) räknas inte.
  const interacted = useRef(false);
  useEffect(() => {
    const mark = () => { interacted.current = true; };
    window.addEventListener("pointerdown", mark, true);
    window.addEventListener("keydown", mark, true);
    return () => {
      window.removeEventListener("pointerdown", mark, true);
      window.removeEventListener("keydown", mark, true);
    };
  }, []);

  useEffect(() => {
    const was = prev.current;
    prev.current = hasResult;
    if (was === null) {
      // Första render: /resultat/ utan svar visar aldrig resultat. Kontrollen väntar ett varv så att
      // sparad progress hinner återställas innan vi skickar besökaren till startvyn.
      if (onResultUrl && !hasResult) {
        const t = window.setTimeout(() => {
          if (!latest.current) navigate(`${norm(base)}/${location.search}`, { replace: true });
        }, 0);
        return () => window.clearTimeout(t);
      }
      return;
    }
    if (!was && hasResult && !interacted.current) return;
    if (!was && hasResult) {
      if (object) trackToolCompleted(object, resultPath(base));
      if (!onResultUrl) navigate(`${resultPath(base)}${location.search}`, { state: location.state });
    } else if (was && !hasResult && onResultUrl) {
      // Besökaren börjar om: tillbaka till startadressen.
      navigate(`${norm(base)}/${location.search}`, { replace: true });
    }
  }, [hasResult]); // eslint-disable-line react-hooks/exhaustive-deps
}
