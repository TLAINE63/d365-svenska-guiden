import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { newsAttributionForLead } from "@/utils/newsAttribution";
import { Send } from "lucide-react";

interface BasicPartnerInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerName: string;
  partnerSlug: string;
  selectedProduct?: string;
  selectedIndustry?: string;
  sourcePage?: string;
}

export const BasicPartnerInquiryDialog = ({
  open,
  onOpenChange,
  partnerName,
  partnerSlug,
  selectedProduct,
  selectedIndustry,
  sourcePage = "compare-partners",
}: BasicPartnerInquiryDialogProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setForm({ company_name: "", contact_name: "", email: "", phone: "", message: "" });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name || !form.contact_name || !form.email) {
      toast({
        title: "Fyll i obligatoriska fält",
        description: "Företag, namn och e-post är obligatoriska.",
        variant: "destructive",
      });
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
          ...newsAttributionForLead(),
          ...form,
          message: [
            `Intresse av partner: ${partnerName} (${partnerSlug})`,
            form.message ? `\nMeddelande: ${form.message}` : "",
          ].join(""),
          selected_product: selectedProduct,
          industry: selectedIndustry,
          source_page: sourcePage,
          source_type: "basic_partner_inquiry",
          interest_partner: partnerSlug,
        },
      });
      if (error) throw error;
      setSubmitted(true);
      toast({
        title: "Tack!",
        description: `d365.se återkommer med vägledning kring ${partnerName}.`,
      });
    } catch (err) {
      console.error("basic partner inquiry error", err);
      toast({
        title: "Något gick fel",
        description: "Försök igen senare eller mejla info@d365.se.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (submitted ? (onOpenChange(o), setSubmitted(false)) : onOpenChange(o))}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Kontakta d365.se om {partnerName}</DialogTitle>
          <DialogDescription>
            Denna partner har en Basic-profil och kontaktvägen via d365.se är inte aktiverad. Fyll i dina uppgifter så hjälper d365.se dig att hitta rätt kontakt.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <p className="font-semibold">Tack för din förfrågan!</p>
            <p className="text-sm text-muted-foreground">
              d365.se återkommer inom kort med vägledning kring {partnerName}.
            </p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-3">
              Stäng
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="basic-company">Företag *</Label>
                <Input
                  id="basic-company"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="basic-name">Kontaktperson *</Label>
                <Input
                  id="basic-name"
                  value={form.contact_name}
                  onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="basic-email">Jobb-e-post *</Label>
                <Input
                  id="basic-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="namn@foretag.se"
                  maxLength={255}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="basic-phone">Telefon</Label>
                <Input
                  id="basic-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={20}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="basic-message">Meddelande (valfritt)</Label>
              <Textarea
                id="basic-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                maxLength={1000}
                placeholder="Kort om vad ni söker hjälp med..."
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground font-semibold"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Skickar..." : "Skicka till d365.se"}
            </Button>

            <p className="text-[11px] text-muted-foreground text-center">
              Genom att skicka godkänner du vår{" "}
              <a href="/dataskydd/" className="underline">integritetspolicy</a>. Endast jobb-e-post accepteras.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BasicPartnerInquiryDialog;
