import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, MessageCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { useToast } from "@/hooks/use-toast";
import { newsAttributionForLead } from "@/utils/newsAttribution";
import { useCtaTracking } from "@/hooks/useCtaTracking";

const DISMISS_KEY = "scroll-cta-dismissed";

const ScrollCTA = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState({ contact_name: "", company_name: "" });
  const [detailsSaved, setDetailsSaved] = useState(false);
  const { ref, trackClick } = useCtaTracking<HTMLDivElement>("scroll_cta_advisory", {
    page: location.pathname,
  });

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "true") setIsDismissed(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (isDismissed) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h <= 0) return;
      setIsVisible((window.scrollY / h) * 100 > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDismissed]);

  const dismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "true");
    } catch {}
  };

  // Steg 1: bara jobb-e-post – lägsta möjliga tröskel.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateBusinessEmail(email);
    if (emailError) {
      toast({ title: "Ogiltig e-postadress", description: emailError, variant: "destructive" });
      return;
    }
    trackClick({ step: "email" });
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...newsAttributionForLead(),
          contact_name: email.split("@")[0] || "Lead",
          company_name: "Okänt företag",
          email,
          message: "Bokning: kostnadsfri 15-min rådgivning (via ScrollCTA)",
          source_page: location.pathname,
          source_type: "scroll_cta_advisory",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (typeof data?.id === "string" && data.id !== "blocked") setLeadId(data.id);
      setSubmitted(true);
      toast({ title: "Tack!", description: "Vi hör av oss inom kort för att boka in tid." });
    } catch (err) {
      console.error("ScrollCTA submit error", err);
      toast({ title: "Något gick fel", description: "Försök igen senare.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Steg 2: frivillig komplettering efter att leadet redan är sparat.
  const handleDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId) return;
    setSubmitting(true);
    try {
      await supabase.functions.invoke("enrich-lead", {
        body: { lead_id: leadId, ...details },
      });
      setDetailsSaved(true);
    } catch (err) {
      console.error("ScrollCTA enrich error", err);
      setDetailsSaved(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:bottom-6 z-40 animate-fade-in pointer-events-none">
      <div
        ref={ref}
        className="bg-card/95 backdrop-blur border border-border shadow-xl rounded-lg p-4 sm:p-5 max-w-sm mx-auto sm:mx-0 relative pointer-events-auto"
      >
        <button
          onClick={dismiss}
          className="absolute top-2 right-2 p-1 rounded hover:bg-muted transition-colors"
          aria-label="Stäng"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        {submitted ? (
          detailsSaved || !leadId ? (
            <div className="flex items-start gap-3 pr-6 py-1">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm mb-0.5">Tack!</p>
                <p className="text-xs text-muted-foreground">
                  Vi återkommer inom kort för att boka in en tid.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDetails} className="space-y-2 pr-6">
              <p className="font-semibold text-sm">Tack! Vi hör av oss.</p>
              <p className="text-xs text-muted-foreground">
                Vill du att vi förbereder oss? Fyll i namn och företag (frivilligt).
              </p>
              <Input
                placeholder="Namn"
                value={details.contact_name}
                onChange={(e) => setDetails({ ...details, contact_name: e.target.value })}
                maxLength={100}
                className="h-9"
              />
              <Input
                placeholder="Företag"
                value={details.company_name}
                onChange={(e) => setDetails({ ...details, company_name: e.target.value })}
                maxLength={100}
                className="h-9"
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="flex-1 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground"
                >
                  {submitting ? "Sparar..." : "Spara"}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setDetailsSaved(true)}>
                  Hoppa över
                </Button>
              </div>
            </form>
          )
        ) : !expanded ? (
          <div className="flex items-start gap-3 pr-6">
            <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-card-foreground text-sm sm:text-base mb-1">
                Osäker på var du ska börja?
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                Boka en kostnadsfri 15-minuters rådgivning – bara din jobb-e-post behövs
              </p>
              <Button
                size="sm"
                onClick={() => {
                  trackClick({ step: "expand" });
                  setExpanded(true);
                }}
                className="w-full sm:w-auto bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground"
              >
                Boka en rådgivning
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2 pr-6">
            <p className="font-semibold text-sm mb-1">Boka en rådgivning</p>
            <Input
              type="email"
              placeholder="jobb-epost@foretag.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              required
              autoFocus
              className="h-9"
            />
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="w-full bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground"
            >
              {submitting ? "Skickar..." : "Skicka förfrågan"}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              Endast jobb-e-post. Se{" "}
              <a href="/dataskydd/" className="underline">integritetspolicy</a>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ScrollCTA;
