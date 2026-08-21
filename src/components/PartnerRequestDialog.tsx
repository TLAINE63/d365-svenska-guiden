import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { AlertCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { newsAttributionForLead } from "@/utils/newsAttribution";

interface PartnerRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerSlug: string;
  partnerName: string;
  selectedProduct?: string;
  industry?: string;
  geography?: string;
  companySize?: string;
  revenue?: string;
  onSubmitting?: (submitting: boolean) => void;
  mode?: "contact" | "demo" | "quote";
  /** When set with 2+ entries, sends the same lead to every recipient (multi-mode). */
  recipients?: Array<{ slug: string; name: string }>;
}

const MODE_CONFIG = {
  contact: {
    title: (name: string) => `Ställ en fråga till ${name}`,
    description: (name: string, product?: string, industry?: string) =>
      `Låg tröskel – beskriv kort vad du undrar över${product ? ` inom ${product}` : ""}${industry ? ` (${industry})` : ""}. ${name} svarar dig direkt, d365.se får kopia för uppföljning.`,
    sourceType: "partner_contact_request",
    messagePrefix: (name: string) => `Fråga till ${name}.`,
    toastTitle: "Frågan är skickad",
    toastDescription: (name: string) => `${name} får din fråga direkt. Du får en kopia och d365.se är kopierad för uppföljning.`,
    submitLabel: "Skicka fråga till partnern",
  },
  demo: {
    title: (name: string) => `Boka Demo/Genomgång med ${name}`,
    description: (name: string, product?: string, industry?: string) =>
      `De flesta seriösa partners vill förstå behovet innan de visar system. Beskriv kort vad du vill se eller diskutera${product ? ` inom ${product}` : ""}${industry ? ` (${industry})` : ""}, så återkommer ${name} med förslag på upplägg.`,
    sourceType: "partner_demo_request",
    messagePrefix: (name: string) => `Genomgång/demo – förfrågan till ${name}.`,
    toastTitle: "Förfrågan skickad",
    toastDescription: (name: string) => `${name} återkommer med förslag på tid för genomgång eller demo.`,
    submitLabel: "Be partnern föreslå tid",
  },
  quote: {
    title: (name: string) => `Få en uppskattning av tid och kostnad från ${name}`,
    description: (name: string, product?: string, industry?: string) =>
      `En exakt offert kräver normalt fördjupad avstämning – men ${name} kan ge en första uppskattning av tid och kostnad${product ? ` för ${product}` : ""}${industry ? ` (${industry})` : ""} utifrån ditt underlag.`,
    sourceType: "partner_quote_request",
    messagePrefix: (name: string) => `Prisindikation – förfrågan till ${name}.`,
    toastTitle: "Förfrågan skickad",
    toastDescription: (name: string) => `${name} återkommer med första uppskattning av tid och kostnad.`,
    submitLabel: "Begär första uppskattning",
  },
};

type FormState = {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string;
  // Quote-specific
  quote_users: string;
  quote_features: string;
  // Demo-specific
  demo_audience: string;
  demo_features: string;
  demo_timing: string;
  _hp: string;
};

type FieldErrors = Partial<Record<
  "company_name" | "contact_name" | "email" | "phone" | "message"
  | "quote_users" | "quote_features"
  | "demo_audience" | "demo_features" | "demo_timing",
  string
>>;

const PHONE_REGEX = /^[+0-9\s\-()./]{6,20}$/;
const MAX_DETAIL = 600;

const validateForm = (form: FormState, mode: "contact" | "demo" | "quote"): FieldErrors => {
  const errors: FieldErrors = {};

  if (!form.company_name.trim()) {
    errors.company_name = "Ange företagsnamn.";
  } else if (form.company_name.trim().length < 2) {
    errors.company_name = "Företagsnamn måste vara minst 2 tecken.";
  } else if (form.company_name.length > 100) {
    errors.company_name = "Max 100 tecken.";
  }

  if (!form.contact_name.trim()) {
    errors.contact_name = "Ange ditt namn.";
  } else if (!form.contact_name.trim().includes(" ")) {
    errors.contact_name = "Ange både för- och efternamn.";
  } else if (form.contact_name.length > 100) {
    errors.contact_name = "Max 100 tecken.";
  }

  if (!form.email.trim()) {
    errors.email = "Ange din jobbmejl.";
  } else {
    const emailErr = validateBusinessEmail(form.email);
    if (emailErr) errors.email = emailErr;
  }

  if (form.phone.trim() && !PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = "Ogiltigt telefonnummer.";
  }

  if (form.message.length > 1000) {
    errors.message = "Max 1000 tecken.";
  }

  if (mode === "quote") {
    if (!form.quote_users.trim()) {
      errors.quote_users = "Ange ungefärligt antal användare.";
    } else if (form.quote_users.length > 60) {
      errors.quote_users = "Max 60 tecken.";
    }
    if (!form.quote_features.trim()) {
      errors.quote_features = "Beskriv kort viktigaste funktionerna eller behovet.";
    } else if (form.quote_features.length > MAX_DETAIL) {
      errors.quote_features = `Max ${MAX_DETAIL} tecken.`;
    }
  }

  if (mode === "demo") {
    if (!form.demo_audience.trim()) {
      errors.demo_audience = "Ange för vem/vilka roller demon är.";
    } else if (form.demo_audience.length > 200) {
      errors.demo_audience = "Max 200 tecken.";
    }
    if (!form.demo_features.trim()) {
      errors.demo_features = "Ange vilka funktioner du vill se.";
    } else if (form.demo_features.length > MAX_DETAIL) {
      errors.demo_features = `Max ${MAX_DETAIL} tecken.`;
    }
    if (!form.demo_timing.trim()) {
      errors.demo_timing = "Ange ungefärlig tidshorisont.";
    } else if (form.demo_timing.length > 100) {
      errors.demo_timing = "Max 100 tecken.";
    }
  }

  return errors;
};

const EMPTY_FORM: FormState = {
  company_name: "",
  contact_name: "",
  email: "",
  phone: "",
  message: "",
  quote_users: "",
  quote_features: "",
  demo_audience: "",
  demo_features: "",
  demo_timing: "",
  _hp: "",
};

const PartnerRequestDialog = ({
  open,
  onOpenChange,
  partnerSlug,
  partnerName,
  selectedProduct,
  industry,
  geography,
  companySize,
  revenue,
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

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const errors = useMemo(() => validateForm(form, mode), [form, mode]);
  const showError = (field: keyof FieldErrors) => (touched[field] || attemptedSubmit) && !!errors[field];
  const errorCount = Object.keys(errors).length;

  const reset = () => {
    setForm(EMPTY_FORM);
    setTouched({});
    setAttemptedSubmit(false);
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (errorCount > 0) {
      const firstError = Object.values(errors)[0];
      toast({
        title: errorCount === 1 ? "Ett fält behöver justeras" : `${errorCount} fält behöver justeras`,
        description: firstError,
        variant: "destructive",
      });
      // Focus first invalid field
      const firstField = Object.keys(errors)[0];
      const el = document.getElementById(`prq-${firstField.replace("_", "-")}`);
      el?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const targets = multi
        ? recipients!
        : [{ slug: partnerSlug, name: partnerName }];

      const detailLines: string[] = [];
      if (mode === "quote") {
        if (form.quote_users.trim()) detailLines.push(`Antal användare: ${form.quote_users.trim()}`);
        if (form.quote_features.trim()) detailLines.push(`Viktigaste funktioner/behov:\n${form.quote_features.trim()}`);
      }
      if (mode === "demo") {
        if (form.demo_audience.trim()) detailLines.push(`Målgrupp/roller: ${form.demo_audience.trim()}`);
        if (form.demo_features.trim()) detailLines.push(`Fokus i demon:\n${form.demo_features.trim()}`);
        if (form.demo_timing.trim()) detailLines.push(`Tidshorisont: ${form.demo_timing.trim()}`);
      }

      const composedMessage = [
        config.messagePrefix(displayName),
        multi ? `Förfrågan skickas till: ${targets.map((t) => t.name).join(", ")}.` : "",
        selectedProduct ? `Produkt: ${selectedProduct}.` : "",
        industry ? `Bransch: ${industry}.` : "",
        geography ? `Geografi: ${geography}.` : "",
        companySize ? `Företagsstorlek: ${companySize} anställda.` : "",
        revenue ? `Omsättning: ${revenue}.` : "",
        detailLines.length ? `\n${detailLines.join("\n")}` : "",
        form.message.trim() ? `\nMeddelande:\n${form.message.trim()}` : "",
      ].filter(Boolean).join(" ");

      const sourcePage = typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "/partner";

      const results = await Promise.allSettled(
        targets.map((t) =>
          supabase.functions.invoke("submit-lead", {
            body: {
              ...newsAttributionForLead(),
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
      if (failed.length === targets.length) {
        const first = failed[0];
        const errMsg = first.status === "rejected"
          ? (first.reason as any)?.message
          : ((first.value as any)?.error?.message);
        throw new Error(errMsg || "Kunde inte skicka förfrågan.");
      }

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
      const message = err instanceof Error && err.message
        ? err.message
        : "Försök igen om en stund eller mejla info@d365.se.";
      toast({
        title: "Något gick fel",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (field: keyof FieldErrors) =>
    cn(showError(field) && "border-destructive focus-visible:ring-destructive");

  const ErrorText = ({ field }: { field: keyof FieldErrors }) =>
    showError(field) ? (
      <p
        id={`prq-${field.replace("_", "-")}-error`}
        className="text-xs text-destructive flex items-start gap-1 mt-1"
        role="alert"
      >
        <AlertCircle className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
        <span>{errors[field]}</span>
      </p>
    ) : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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

        {(selectedProduct || industry || geography || companySize || revenue) && (
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs">
            <p className="font-semibold text-foreground mb-1.5">Din förfrågan avser:</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedProduct && (
                <span className="inline-flex items-center rounded-md bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 font-medium">
                  {selectedProduct}
                </span>
              )}
              {industry && (
                <span className="inline-flex items-center rounded-md bg-background text-foreground border border-border px-2 py-0.5">
                  {industry}
                </span>
              )}
              {geography && (
                <span className="inline-flex items-center rounded-md bg-background text-foreground border border-border px-2 py-0.5">
                  {geography}
                </span>
              )}
              {companySize && (
                <span className="inline-flex items-center rounded-md bg-background text-foreground border border-border px-2 py-0.5">
                  {companySize} anställda
                </span>
              )}
              {revenue && (
                <span className="inline-flex items-center rounded-md bg-background text-foreground border border-border px-2 py-0.5">
                  {revenue}
                </span>
              )}
            </div>
          </div>
        )}

        {attemptedSubmit && errorCount > 0 && (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">
                {errorCount === 1
                  ? "Ett fält behöver justeras innan vi kan skicka."
                  : `${errorCount} fält behöver justeras innan vi kan skicka.`}
              </p>
              <p className="text-xs opacity-80 mt-0.5">Se markerade fält nedan.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
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
              <Label htmlFor="prq-company-name">Företag *</Label>
              <Input
                id="prq-company-name"
                value={form.company_name}
                onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, company_name: true }))}
                maxLength={100}
                required
                aria-invalid={showError("company_name")}
                aria-describedby={showError("company_name") ? "prq-company-name-error" : undefined}
                className={fieldClass("company_name")}
              />
              <ErrorText field="company_name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prq-contact-name">Namn *</Label>
              <Input
                id="prq-contact-name"
                value={form.contact_name}
                onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, contact_name: true }))}
                maxLength={100}
                required
                aria-invalid={showError("contact_name")}
                aria-describedby={showError("contact_name") ? "prq-contact-name-error" : undefined}
                className={fieldClass("contact_name")}
              />
              <ErrorText field="contact_name" />
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
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                maxLength={255}
                required
                aria-invalid={showError("email")}
                aria-describedby={showError("email") ? "prq-email-error" : "prq-email-hint"}
                className={fieldClass("email")}
              />
              {!showError("email") && (
                <p id="prq-email-hint" className="text-xs text-muted-foreground">
                  Vi accepterar endast jobbmejl (ej Gmail/Hotmail).
                </p>
              )}
              <ErrorText field="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prq-phone">Telefon</Label>
              <Input
                id="prq-phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                maxLength={20}
                aria-invalid={showError("phone")}
                aria-describedby={showError("phone") ? "prq-phone-error" : undefined}
                className={fieldClass("phone")}
              />
              <ErrorText field="phone" />
            </div>
          </div>

          {mode === "quote" && (
            <div className="space-y-3 rounded-md border border-border bg-secondary/30 p-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Ge partnern grund för dialog
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="prq-quote-users">Antal användare *</Label>
                <Input
                  id="prq-quote-users"
                  value={form.quote_users}
                  onChange={(e) => setForm((f) => ({ ...f, quote_users: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, quote_users: true }))}
                  maxLength={60}
                  placeholder="T.ex. ca 25 användare"
                  required
                  aria-invalid={showError("quote_users")}
                  className={fieldClass("quote_users")}
                />
                <ErrorText field="quote_users" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="prq-quote-features">Viktigaste funktioner/behov *</Label>
                  <span className={cn(
                    "text-xs",
                    form.quote_features.length > MAX_DETAIL - 60 ? "text-amber-600" : "text-muted-foreground",
                    form.quote_features.length > MAX_DETAIL && "text-destructive"
                  )}>
                    {form.quote_features.length}/{MAX_DETAIL}
                  </span>
                </div>
                <Textarea
                  id="prq-quote-features"
                  value={form.quote_features}
                  onChange={(e) => setForm((f) => ({ ...f, quote_features: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, quote_features: true }))}
                  maxLength={MAX_DETAIL}
                  rows={3}
                  placeholder="T.ex. ekonomi + lager, integration mot vårt CRM, e-fakturering, projektredovisning."
                  required
                  aria-invalid={showError("quote_features")}
                  className={fieldClass("quote_features")}
                />
                <ErrorText field="quote_features" />
              </div>
            </div>
          )}

          {mode === "demo" && (
            <div className="space-y-3 rounded-md border border-border bg-secondary/30 p-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Hjälp partnern skräddarsy demon
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="prq-demo-audience">För vem/vilka roller *</Label>
                <Input
                  id="prq-demo-audience"
                  value={form.demo_audience}
                  onChange={(e) => setForm((f) => ({ ...f, demo_audience: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, demo_audience: true }))}
                  maxLength={200}
                  placeholder="T.ex. CFO + ekonomichef + 2 controllers"
                  required
                  aria-invalid={showError("demo_audience")}
                  className={fieldClass("demo_audience")}
                />
                <ErrorText field="demo_audience" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="prq-demo-features">Vad vill du se i demon? *</Label>
                  <span className={cn(
                    "text-xs",
                    form.demo_features.length > MAX_DETAIL - 60 ? "text-amber-600" : "text-muted-foreground",
                    form.demo_features.length > MAX_DETAIL && "text-destructive"
                  )}>
                    {form.demo_features.length}/{MAX_DETAIL}
                  </span>
                </div>
                <Textarea
                  id="prq-demo-features"
                  value={form.demo_features}
                  onChange={(e) => setForm((f) => ({ ...f, demo_features: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, demo_features: true }))}
                  maxLength={MAX_DETAIL}
                  rows={3}
                  placeholder="T.ex. månadsbokslut, likviditetsprognos, Copilot-flöden, godkännande av leverantörsfakturor."
                  required
                  aria-invalid={showError("demo_features")}
                  className={fieldClass("demo_features")}
                />
                <ErrorText field="demo_features" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prq-demo-timing">När är det aktuellt? *</Label>
                <Input
                  id="prq-demo-timing"
                  value={form.demo_timing}
                  onChange={(e) => setForm((f) => ({ ...f, demo_timing: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, demo_timing: true }))}
                  maxLength={100}
                  placeholder="T.ex. inom 2–4 veckor, eller Q2 2026"
                  required
                  aria-invalid={showError("demo_timing")}
                  className={fieldClass("demo_timing")}
                />
                <ErrorText field="demo_timing" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="prq-message">Kort om behovet (valfritt)</Label>
              <span className={cn(
                "text-xs",
                form.message.length > 900 ? "text-amber-600" : "text-muted-foreground",
                form.message.length > 1000 && "text-destructive"
              )}>
                {form.message.length}/1000
              </span>
            </div>
            <Textarea
              id="prq-message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              onBlur={() => setTouched((t) => ({ ...t, message: true }))}
              maxLength={1000}
              rows={4}
              placeholder="T.ex. nuläge, tidplan, antal användare, integrationer."
              aria-invalid={showError("message")}
              aria-describedby={showError("message") ? "prq-message-error" : undefined}
              className={fieldClass("message")}
            />
            <ErrorText field="message" />
          </div>

          <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
            Kostnadsfritt. Du väljer själv vilka partners som kontaktas. Varje partner kontaktas separat – aldrig i samma tråd. d365.se säljer inte implementationer; förfrågan går direkt till partnern med kopia till dig och d365.se.
          </p>


          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={submitting}>
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
