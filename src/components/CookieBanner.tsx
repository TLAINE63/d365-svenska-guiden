import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

/**
 * Granulär cookie-samtyckesbanner enligt LEK/ePrivacy + GDPR.
 *
 * - Inga icke-nödvändiga cookies sätts förrän användaren aktivt samtyckt.
 * - Google Consent Mode v2 (se index.html) läser 'cookie-consent-v2' synkront
 *   och defaultar till 'denied' tills användaren valt.
 * - Bakåtkompatibilitet: skriver även 'cookie-consent-accepted' = "true"/"false"
 *   så att existerande tracking (Snitcher, klickanalys, visitor tracking)
 *   fortsätter att gates korrekt på marketing-samtycke.
 */

const CONSENT_KEY_V2 = "cookie-consent-v2";
const CONSENT_KEY_LEGACY = "cookie-consent-accepted";

type ConsentState = {
  necessary: true; // alltid
  statistics: boolean; // GA4
  marketing: boolean; // Google Ads, Snitcher, klickanalys
  timestamp: string;
};

function loadConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY_V2);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveConsent(state: ConsentState) {
  localStorage.setItem(CONSENT_KEY_V2, JSON.stringify(state));
  // Bakåtkompat: existerande lyssnare kräver "true" för spårning
  const allOptedIn = state.statistics && state.marketing;
  localStorage.setItem(CONSENT_KEY_LEGACY, allOptedIn ? "true" : "false");
  window.dispatchEvent(new Event("cookie-consent-changed"));
}

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = loadConsent();
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 4000);
      return () => clearTimeout(timer);
    }

    const handleOpen = () => {
      const existing = loadConsent();
      if (existing) {
        setStatistics(existing.statistics);
        setMarketing(existing.marketing);
        setShowDetails(true);
      }
      setIsVisible(true);
    };
    window.addEventListener("open-cookie-settings", handleOpen);
    return () => window.removeEventListener("open-cookie-settings", handleOpen);
  }, []);

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      statistics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
    setIsVisible(false);
  };

  const onlyNecessary = () => {
    saveConsent({
      necessary: true,
      statistics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
    setIsVisible(false);
  };

  const saveCustom = () => {
    saveConsent({
      necessary: true,
      statistics,
      marketing,
      timestamp: new Date().toISOString(),
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-300"
      data-nosnippet
      aria-live="polite"
      role="dialog"
      aria-label="Cookie-samtycke"
    >
      <div className="container mx-auto max-w-4xl">
        <div
          className="relative bg-card border border-border rounded-lg shadow-lg p-4 sm:p-6"
          style={{ contentVisibility: "auto", containIntrinsicSize: "0 200px" }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Vi värnar om din integritet
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Vi använder nödvändiga cookies för att webbplatsen ska fungera. Med ditt samtycke
                använder vi även cookies för statistik (Google Analytics) och marknadsföring
                (Google Ads, B2B-besökaridentifiering via Snitcher). Du kan när som helst ändra
                ditt val.
              </p>
              <p className="text-sm text-muted-foreground">
                Läs mer i vår{" "}
                <Link to="/dataskydd/" className="text-primary hover:underline font-medium">
                  dataskyddspolicy
                </Link>
                .
              </p>
            </div>

            {showDetails && (
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-1 h-4 w-4 rounded border-border accent-primary"
                    aria-label="Nödvändiga cookies (alltid på)"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground">
                      Nödvändiga <span className="text-xs text-muted-foreground">(alltid på)</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Krävs för att webbplatsen ska fungera — sessionshantering, säkerhet och
                      sparat samtycke.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    id="consent-statistics"
                    type="checkbox"
                    checked={statistics}
                    onChange={(e) => setStatistics(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border accent-primary cursor-pointer"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="consent-statistics"
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      Statistik
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Google Analytics 4 med anonymiserad IP — hjälper oss förstå vilka sidor
                      som används.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    id="consent-marketing"
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border accent-primary cursor-pointer"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="consent-marketing"
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      Marknadsföring
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Google Ads-konvertering, B2B-besökaridentifiering (Snitcher — identifierar
                      företag, inte individer) och klickstatistik på partnerlänkar.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              {!showDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                  className="sm:mr-auto"
                >
                  Anpassa
                </Button>
              )}
              {showDetails ? (
                <Button variant="outline" size="sm" onClick={saveCustom}>
                  Spara mitt val
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={onlyNecessary}>
                  Endast nödvändiga
                </Button>
              )}
              <Button size="sm" onClick={acceptAll}>
                Acceptera alla
              </Button>
            </div>
          </div>

          <button
            onClick={onlyNecessary}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors sm:hidden"
            aria-label="Stäng (endast nödvändiga)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
