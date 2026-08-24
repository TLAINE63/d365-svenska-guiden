import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, CheckCircle, X } from "lucide-react";
import { generatePartnerGuide } from "@/utils/generatePartnerGuide";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { newsAttributionForLead } from "@/utils/newsAttribution";

interface LeadMagnetBannerProps {
  sourcePage: string;
  onClose?: () => void;
}

export const LeadMagnetBanner = ({ sourcePage, onClose }: LeadMagnetBannerProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hasViewedRef = useRef(false);

  useEffect(() => {
    if (!cardRef.current || hasViewedRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !hasViewedRef.current) {
            hasViewedRef.current = true;
            trackFunnelEvent({
              event_type: "cta_view",
              event_name: "lead_magnet_banner",
              metadata: { source_page: sourcePage },
            });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, [sourcePage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackFunnelEvent({
      event_type: "cta_click",
      event_name: "lead_magnet_banner",
      metadata: { source_page: sourcePage },
    });

    const emailError = validateBusinessEmail(email);
    if (emailError) {
      toast({
        title: emailError,
        variant: "destructive",
      });
      return;
    }

    // Honeypot check - if filled, silently "succeed" to fool bots
    if (honeypot) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate PDF as base64 for email attachment
      const pdfBase64 = await generatePartnerGuide(true);
      
      const response = await supabase.functions.invoke("submit-lead", {
        body: {
          ...newsAttributionForLead(),
          email,
          company_name: "Lead Magnet Download",
          contact_name: email.split("@")[0] || "Lead",
          source_page: sourcePage,
          source_type: "lead_magnet",
          message: "Laddat ner guiden 'Så väljer du rätt Dynamics 365-partner'",
          _hp: honeypot, // Honeypot field for server-side validation
          pdfBase64: pdfBase64,
          pdfFilename: "valj-ratt-dynamics-365-partner",
        },
      });

      // Handle function invocation error (network, CORS, etc.)
      if (response.error) {
        console.error("Lead magnet invocation error:", response.error);
        throw new Error(response.error.message || "Kunde inte ansluta till servern");
      }

      // Handle application-level error returned from the edge function
      if (response.data?.error) {
        console.error("Lead magnet data error:", response.data.error);
        throw new Error(response.data.error);
      }

      console.log("Lead magnet success:", response.data);
      
      // Also save PDF locally for the user
      await generatePartnerGuide(false);
      
      setIsSubmitted(true);
      toast({
        title: "Guiden skickas till din e-post!",
        description: "Guiden laddas också ner automatiskt.",
      });
    } catch (error: unknown) {
      console.error("Error submitting lead:", error);
      const errorMessage = error instanceof Error ? error.message : "Ett oväntat fel uppstod";
      toast({
        title: "Något gick fel",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 p-4 sm:p-6 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Tack! Guiden är på väg</h3>
            <p className="text-sm text-muted-foreground">
              Kolla din inkorg om några minuter. Kommer inte mailet fram?{" "}
              <button 
                onClick={() => generatePartnerGuide()}
                className="text-primary hover:underline font-medium"
              >
                Ladda ner partnerguiden som PDF
              </button>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Nästa steg:{" "}
              <a
                href="/valjdynamics365partner/"
                onClick={() =>
                  trackFunnelEvent({
                    event_type: "cta_click",
                    event_name: "lead_magnet_next_step",
                    metadata: { source_page: sourcePage },
                  })
                }
                className="text-primary hover:underline font-medium"
              >
                låt oss skicka ditt underlag till 2–5 matchande partners
              </a>
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card ref={cardRef} className="bg-[hsl(var(--hero-dark))] border-[hsl(var(--line-dark))] text-white p-4 sm:p-6 relative overflow-hidden rounded">
      {onClose && (
        <button onClick={onClose} className="absolute top-2 right-2 text-white/60 hover:text-white z-10">
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Decorative accent */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-[hsl(var(--cta-orange))]/15 rounded-full pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cta-orange))]/20 flex items-center justify-center">
            <FileText className="h-6 w-6 text-[hsl(var(--cta-orange))]" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded bg-[hsl(var(--cta-orange))] text-white text-sm font-bold uppercase tracking-wide">
              Gratis guide
            </span>
            <span className="text-white">Så väljer du rätt Dynamics 365-partner</span>
          </h3>
          <p className="text-sm text-white/75">
            Lär dig vilka frågor du ska ställa och vad du ska tänka på. Ange din e-post så skickar vi guiden direkt.
          </p>
          <ul className="mt-2 grid gap-1 text-xs text-white/70 sm:grid-cols-2">
            <li>1. De 12 frågorna du bör ställa varje partner</li>
            <li>2. Så jämför du offerter rättvist</li>
            <li>3. Varningssignaler i upphandlingen</li>
            <li>4. Checklista inför beslut</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          {/* Honeypot field - hidden from humans, visible to bots */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute -left-[9999px] opacity-0 pointer-events-none"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.se"
            className="w-full sm:w-48 bg-white text-foreground placeholder:text-muted-foreground border-white/20"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting} className="whitespace-nowrap bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white transition-all duration-200">
            {isSubmitting ? (
              "Skickar..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Ladda ner
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default LeadMagnetBanner;
