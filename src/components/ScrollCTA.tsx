import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, MessageCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { useToast } from "@/hooks/use-toast";

const DISMISS_KEY = "scroll-cta-dismissed";

const ScrollCTA = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ contact_name: "", company_name: "", email: "" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contact_name || !form.company_name || !form.email) {
      toast({ title: "Fyll i alla fält", variant: "destructive" });
      return;
    }
    const emailError = validateBusinessEmail(form.email);
    if (emailError) {
      toast({ title: "Ogiltig e-postadress", description: emailError, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          contact_name: form.contact_name,
          company_name: form.company_name,
          email: form.email,
          message: "Bokning: kostnadsfri 15-min rådgivning (via ScrollCTA)",
          source_page: location.pathname,
          source_type: "scroll_cta_advisory",
        },
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Tack!", description: "Vi hör av oss inom kort för att boka in tid." });
    } catch (err) {
      console.error("ScrollCTA submit error", err);
      toast({ title: "Något gick fel", description: "Försök igen senare.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:bottom-6 z-40 animate-fade-in pointer-events-none">
      <div className="bg-card/95 backdrop-blur border border-border shadow-xl rounded-lg p-4 sm:p-5 max-w-sm mx-auto sm:mx-0 relative pointer-events-auto">
        <button
          onClick={dismiss}
          className="absolute top-2 right-2 p-1 rounded hover:bg-muted transition-colors"
          aria-label="Stäng"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        {submitted ? (
          <div className="flex items-start gap-3 pr-6 py-1">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-0.5">Tack!</p>
              <p className="text-xs text-muted-foreground">
                Vi återkommer inom kort för att boka in en tid.
              </p>
            </div>
          </div>
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
                Boka en kostnadsfri 15-minuters rådgivning
              </p>
              <Button
                size="sm"
                onClick={() => setExpanded(true)}
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
              placeholder="Namn"
              value={form.contact_name}
              onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
              maxLength={100}
              required
              className="h-9"
            />
            <Input
              placeholder="Företag"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              maxLength={100}
              required
              className="h-9"
            />
            <Input
              type="email"
              placeholder="jobb-epost@foretag.se"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
              required
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
