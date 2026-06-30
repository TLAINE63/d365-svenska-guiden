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
  mode?: "contact" | "demo" | "quote";
  /** When set with 2+ entries, sends the same lead to every recipient (multi-mode). */
  recipients?: Array<{ slug: string; name: string }>;
}

const MODE_CONFIG = {
  contact: {
    title: (name: string) => `Få kontakt med ${name}`,
    description: (name: string, product?: string, industry?: string) =>
      `Lämna dina uppgifter så förmedlar d365.se en kontaktförfrågan till ${name}${product ? ` avseende ${product}` : ""}${industry ? ` inom ${industry}` : ""}.`,
    sourceType: "partner_contact_request",
    messagePrefix: (name: string) => `Kontaktförfrågan till ${name}.`,
    toastTitle: "Kontaktförfrågan skickad",
    toastDescription: (name: string) => `Vi förmedlar din förfrågan till ${name} och återkopplar inom kort.`,
    submitLabel: "Skicka kontaktförfrågan",
  },
  demo: {
    title: (name: string) => `Gör en intresseförfrågan om demo från ${name}`,
    description: (name: string, product?: string, industry?: string) =>
      `Vill du se ${product || "lösningen"} i en demo? Lämna dina uppgifter så förmedlar d365.se din demoförfrågan till ${name}${industry ? ` inom ${industry}` : ""}.`,
    sourceType: "partner_demo_request",
    messagePrefix: (name: string) => `Demointresse för ${name}.`,
    toastTitle: "Demoförfrågan skickad",
    toastDescription: (name: string) => `Vi förmedlar din demoförfrågan till ${name} och återkopplar inom kort.`,
    submitLabel: "Skicka demoförfrågan",
  },
  quote: {
    title: (name: string) => `Begär offert från ${name}`,
    description: (name: string, product?: string, industry?: string) =>
      `${product ? `Avser ${product}` : `d365.se förmedlar förfrågan till ${name}`}${industry ? ` · ${industry}` : ""}.`,
    sourceType: "partner_quote_request",
    messagePrefix: (name: string) => `Begär offert/kontakt från ${name}.`,
    toastTitle: "Förfrågan skickad",
    toastDescription: (name: string) => `Vi förmedlar din förfrågan till ${name} och återkopplar inom kort.`,
    submitLabel: "Skicka offertförfrågan",
  },
};

const PartnerRequestDialog = ({
  open,
  onOpenChange,
  partnerSlug,
  partnerName,
  selectedProduct,
  industry,
  onSubmitting,
  mode = "quote",
  recipients,
}: PartnerRequestDialogProps) => {
  const config = MODE_CONFIG[mode];
  const multi = Array.isArray(recipients) && recipients.length > 1;
  const displayName = multi
    ? `${recipients!.length} partners`
    : partnerName;
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
      const targets = multi
        ? recipients!
        : [{ slug: partnerSlug, name: partnerName }];

      const composedMessage = [
        config.messagePrefix(displayName),
        multi ? `Förfrågan skickas till: ${targets.map((t) => t.name).join(", ")}.` : "",
        selectedProduct ? `Produkt: ${selectedProduct}.` : "",
        industry ? `Bransch: ${industry}.` : "",
        form.message.trim() ? `\nMeddelande:\n${form.message.trim()}` : "",
      ].filter(Boolean).join(" ");

      const sourcePage = typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "/partner";

      const results = await Promise.allSettled(
        targets.map((t) =>
          supabase.functions.invoke("submit-lead", {
            body: {
              company_name: form.company_name.trim(),
              contact_name: form.contact_name.trim(),
              email: form.email.trim(),
              phone: form.phone.trim() || undefined,
              industry: industry || undefined,
              selected_product: selectedProduct || undefined,
              source_page: sourcePage,
              source_type: multi ? "partner_multi_quote_request" : config.sourceType,
              message: composedMessage,
              assigned_partners: [t.slug],
              _hp: form._hp,
            },
          })
        )
      );

      const failed = results.filter(
        (r) => r.status === "rejected" || (r.status === "fulfilled" && (r.value as any)?.error)
      );
      if (failed.length === targets.length) throw failed[0];

      toast({
        title: config.toastTitle,
        description:
          failed.length > 0
            ? `Skickad till ${targets.length - failed.length} av ${targets.length} partners. Vi följer upp de övriga manuellt.`
            : config.toastDescription(displayName),
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
          <DialogTitle>{config.title(displayName)}</DialogTitle>
          <DialogDescription>{config.description(displayName, selectedProduct, industry)}</DialogDescription>
        </DialogHeader>

        {multi && (
          <div className="rounded-md border border-border bg-secondary/40 p-3 text-xs text-foreground">
            <p className="font-semibold mb-1">Din förfrågan skickas till:</p>
            <p className="text-muted-foreground leading-relaxed">
              {recipients!.map((r) => r.name).join(" · ")}
            </p>
          </div>
        )}

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
              {submitting ? "Skickar…" : config.submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerRequestDialog;
