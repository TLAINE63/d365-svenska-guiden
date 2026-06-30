import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { Send } from "lucide-react";

interface PartnerRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerSlug: string;
  partnerName: string;
  selectedProduct?: string;
  industry?: string;
  onSubmitting?: (submitting: boolean) => void;
}

const PartnerRequestDialog = ({
  open,
  onOpenChange,
  partnerSlug,
  partnerName,
  selectedProduct,
  industry,
  onSubmitting,
}: PartnerRequestDialogProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    onSubmitting?.(submitting);
  }, [submitting, onSubmitting]);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    message: "",
    _hp: "",
  });

  const reset = () =>
    setForm({ company_name: "", contact_name: "", email: "", phone: "", message: "", _hp: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name.trim() || !form.contact_name.trim() || !form.email.trim()) {
      toast({ title: "Fyll i obligatoriska fält", description: "Företag, namn och jobbmejl krävs.", variant: "destructive" });
      return;
    }
    const emailErr = validateBusinessEmail(form.email);
    if (emailErr) {
      toast({ title: "Ogiltig e-post", description: emailErr, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const composedMessage = [
        `Begär offert/kontakt från ${partnerName}.`,
        selectedProduct ? `Produkt: ${selectedProduct}.` : "",
        industry ? `Bransch: ${industry}.` : "",
        form.message.trim() ? `\nMeddelande:\n${form.message.trim()}` : "",
      ].filter(Boolean).join(" ");

      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          company_name: form.company_name.trim(),
          contact_name: form.contact_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          industry: industry || undefined,
          selected_product: selectedProduct || undefined,
          source_page: typeof window !== "undefined" ? window.location.pathname + window.location.search : "/jamfor-partners",
          source_type: "partner_quote_request",
          message: composedMessage,
          assigned_partners: [partnerSlug],
          _hp: form._hp,
        },
      });

      if (error) throw error;

      toast({
        title: "Förfrågan skickad",
        description: `Vi förmedlar din förfrågan till ${partnerName} och återkopplar inom kort.`,
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Något gick fel",
        description: "Försök igen om en stund eller mejla info@d365.se.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Begär offert från {partnerName}</DialogTitle>
          <DialogDescription>
            {selectedProduct
              ? `Avser ${selectedProduct}${industry ? ` · ${industry}` : ""}. d365.se förmedlar förfrågan vidare.`
              : `d365.se förmedlar förfrågan vidare till ${partnerName}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Honeypot */}
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={form._hp}
            onChange={(e) => setForm((f) => ({ ...f, _hp: e.target.value }))}
            className="absolute opacity-0 pointer-events-none h-0 w-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prq-company">Företag *</Label>
              <Input
                id="prq-company"
                value={form.company_name}
                onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prq-name">Namn *</Label>
              <Input
                id="prq-name"
                value={form.contact_name}
                onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
                maxLength={100}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prq-email">Jobbmejl *</Label>
              <Input
                id="prq-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                maxLength={255}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prq-phone">Telefon</Label>
              <Input
                id="prq-phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                maxLength={20}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prq-message">Kort om behovet (valfritt)</Label>
            <Textarea
              id="prq-message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              maxLength={1000}
              rows={4}
              placeholder="T.ex. nuläge, tidplan, antal användare, integrationer."
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90"
            >
              <Send className="w-4 h-4 mr-1.5" />
              {submitting ? "Skickar…" : "Skicka förfrågan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerRequestDialog;
