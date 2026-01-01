import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, CheckCircle, X } from "lucide-react";
import { generatePartnerGuide } from "@/utils/generatePartnerGuide";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Ange din e-postadress",
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
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          email,
          company_name: "Lead Magnet Download",
          contact_name: email.split("@")[0] || "Lead",
          source_page: sourcePage,
          source_type: "lead_magnet",
          message: "Laddat ner guiden 'Så väljer du rätt Dynamics 365-partner'",
          _hp: honeypot, // Honeypot field for server-side validation
        },
      });

      if (error) {
        console.error("Lead magnet error:", error);
        throw error;
      }

      console.log("Lead magnet success:", data);
      setIsSubmitted(true);
      toast({
        title: "Guiden skickas till din e-post!",
        description: "Kolla din inkorg inom några minuter.",
      });
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Något gick fel",
        description: "Kontrollera att du har angett en giltig e-postadress.",
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
                Ladda ner guiden direkt här
              </button>
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/30 p-4 sm:p-6 relative overflow-hidden">
      {onClose && (
        <button onClick={onClose} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground z-10">
          <X className="h-4 w-4" />
        </button>
      )}
      
      {/* Decorative element */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg mb-1">
            Gratis guide: Så väljer du rätt Dynamics 365-partner
          </h3>
          <p className="text-sm text-muted-foreground">
            Lär dig vilka frågor du ska ställa och vad du ska tänka på. Ange din e-post så skickar vi guiden direkt.
          </p>
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
            className="w-full sm:w-48 bg-background/80"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting} className="whitespace-nowrap">
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
