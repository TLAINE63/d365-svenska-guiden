import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { newsAttributionForLead } from "@/utils/newsAttribution";

interface ComparePartner {
  slug: string;
  name: string;
}

interface CompareStickyCTAProps {
  partners: ComparePartner[];
  selectedProduct?: string;
  selectedIndustry?: string;
  sourcePage?: string;
}

const DISMISS_KEY_PREFIX = "compare-cta-dismissed:";

/**
 * Sticky discrete CTA for the compare-partners page.
 * Captures partner context (which partners the user is comparing) + business email.
 */
const CompareStickyCTA = ({
  partners,
  selectedProduct,
  selectedIndustry,
  sourcePage = "compare-partners",
}: CompareStickyCTAProps) => {
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const dismissKey =
    DISMISS_KEY_PREFIX + partners.map((p) => p.slug).sort().join("|");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(dismissKey) === "true") setDismissed(true);
      else setDismissed(false);
    } catch {}
  }, [dismissKey]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(dismissKey, "true");
    } catch {}
  };

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
      toast({
        title: "Ogiltig e-postadress",
        description: emailError,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const partnerNames = partners.map((p) => p.name).join(", ");
      const composedMessage = [
        `Jämför partners: ${partnerNames}`,
        form.message ? `\nMeddelande: ${form.message}` : "",
      ].join("");

      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...newsAttributionForLead(),
          ...form,
          message: composedMessage,
          industry: selectedIndustry,
          selected_product: selectedProduct,
          source_page: sourcePage,
          source_type: "compare_partners_intro",
          assigned_partners: partners.map((p) => p.slug),
        },
      });
      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Tack! Vi återkommer",
        description: `${partnerNames} kommer att kontakta dig inom kort.`,
      });
    } catch (err) {
      console.error("compare CTA submit error", err);
      toast({
        title: "Något gick fel",
        description: "Försök igen senare.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (partners.length < 2 || !visible || dismissed) return null;

  const partnerLabel =
    partners.length === 2
      ? `${partners[0].name} & ${partners[1].name}`
      : `${partners.length} partners`;

  return (
    <>
      {/* Mobile: full-width bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur px-3 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2">
          <button
            onClick={dismiss}
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label="Stäng"
          >
            <X className="h-4 w-4" />
          </button>
          <Button
            onClick={() => setOpen(true)}
            className="flex-1 h-11 text-sm font-semibold bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground"
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            Be om intro till {partners.length === 2 ? "båda" : "alla"}
          </Button>
        </div>
      </div>

      {/* Desktop: floating bottom-left stack (AI chat is bottom-right) */}
      <div className="hidden md:flex fixed bottom-6 left-6 z-40 flex-col items-start gap-2 max-w-sm">
        {expanded ? (
          <div className="rounded-lg border border-border bg-card p-4 shadow-xl animate-in fade-in slide-in-from-bottom-2 relative">
            <button
              onClick={dismiss}
              className="absolute top-2 right-2 p-1 rounded hover:bg-muted"
              aria-label="Stäng"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Jämför du dessa partners?
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3 pr-6">
              {partners.map((p) => (
                <Badge key={p.slug} variant="secondary" className="text-xs">
                  {p.name}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Vi kan förmedla en introduktion – utan att du behöver kontakta dem var för sig.
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="w-full justify-between h-11 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground font-semibold"
            >
              Be om introduktion
              <ArrowRight className="w-4 h-4" />
            </Button>
            <button
              onClick={() => setExpanded(false)}
              className="text-[11px] text-muted-foreground hover:text-foreground mt-2"
            >
              Minimera
            </button>
          </div>
        ) : (
          <Button
            onClick={() => setExpanded(true)}
            className="h-12 px-5 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground font-semibold shadow-xl rounded-full"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Be om intro
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={(o) => (submitted ? (setOpen(o), setSubmitted(false)) : setOpen(o))}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Be om introduktion till {partnerLabel}</DialogTitle>
            <DialogDescription>
              Vi förmedlar din förfrågan direkt till de partners du jämför. Ingen kostnad, inga förpliktelser.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-6 text-center space-y-2">
              <p className="font-semibold">Tack för din förfrågan!</p>
              <p className="text-sm text-muted-foreground">
                {partners.map((p) => p.name).join(", ")} har fått dina uppgifter och återkommer inom kort.
              </p>
              <Button variant="outline" onClick={() => setOpen(false)} className="mt-3">
                Stäng
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {partners.map((p) => (
                  <Badge key={p.slug} className="text-xs bg-primary text-primary-foreground">
                    {p.name}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cmp-company">Företag *</Label>
                  <Input
                    id="cmp-company"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cmp-name">Kontaktperson *</Label>
                  <Input
                    id="cmp-name"
                    value={form.contact_name}
                    onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cmp-email">Jobb-e-post *</Label>
                  <Input
                    id="cmp-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="namn@foretag.se"
                    maxLength={255}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cmp-phone">Telefon</Label>
                  <Input
                    id="cmp-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    maxLength={20}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="cmp-message">Meddelande (valfritt)</Label>
                <Textarea
                  id="cmp-message"
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
                {submitting ? "Skickar..." : `Skicka till ${partnerLabel}`}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center">
                Partnern/erna svarar direkt till din e-post. d365.se är kopierat (CC/BCC) för uppföljning.
              </p>

              <p className="text-[11px] text-muted-foreground text-center">
                Genom att skicka godkänner du vår{" "}
                <a href="/dataskydd/" className="underline">integritetspolicy</a>. Endast jobb-e-post accepteras.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompareStickyCTA;
