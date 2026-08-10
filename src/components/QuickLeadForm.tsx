import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { useToast } from "@/hooks/use-toast";
import { useCtaTracking } from "@/hooks/useCtaTracking";
import { newsAttributionForLead } from "@/utils/newsAttribution";
import {
  companyFromEmail,
  deriveLeadContext,
  getLeadProfile,
  saveLeadProfile,
} from "@/lib/leadContext";

export type QuickLeadDestination =
  | { type: "pdf"; run: () => void | Promise<void>; label?: string }
  | { type: "partner"; slug: string; name?: string; label?: string }
  | { type: "route"; to: string; label?: string };

interface Props {
  /** Short heading above the form. */
  title?: string;
  /** One-line explanation of what happens after submit. */
  description?: string;
  /** Where the visitor is taken once the form is submitted. */
  destination: QuickLeadDestination;
  /** Stored on the lead so we can see which surface converted. */
  sourceType: string;
  /** Extra info appended to the lead message (e.g. calculator summary). */
  contextNote?: string;
  className?: string;
}

/**
 * Short three-field lead form (name, company, work e-mail).
 *
 * Pre-fills from the page's own context (product area / industry) and from a
 * locally remembered profile, then hands the visitor over to the requested
 * destination – a partner profile or a PDF – as soon as the form is sent.
 */
const QuickLeadForm = ({
  title = "Få underlaget – fyll i tre fält",
  description,
  destination,
  sourceType,
  contextNote,
  className,
}: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const context = useMemo(() => deriveLeadContext(location.pathname), [location.pathname]);
  const { ref, trackClick } = useCtaTracking<HTMLDivElement>("quick_lead_form", {
    page: location.pathname,
    source_type: sourceType,
    destination: destination.type,
  });

  const [values, setValues] = useState({ contact_name: "", company_name: "", email: "" });
  const [touchedCompany, setTouchedCompany] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Autofill from a previously remembered profile.
  useEffect(() => {
    const profile = getLeadProfile();
    if (profile) {
      setValues(profile);
      if (profile.company_name) setTouchedCompany(true);
    }
  }, []);

  // Autofill company from the work e-mail domain until the visitor edits it.
  useEffect(() => {
    if (touchedCompany) return;
    const guess = companyFromEmail(values.email);
    if (guess) setValues((v) => ({ ...v, company_name: guess }));
  }, [values.email, touchedCompany]);

  const defaultLabel =
    destination.type === "pdf"
      ? "Ladda ned PDF"
      : destination.type === "partner"
        ? `Till ${destination.name ?? "partnerprofilen"}`
        : "Fortsätt";

  const goToDestination = async () => {
    if (destination.type === "pdf") {
      await destination.run();
      return;
    }
    if (destination.type === "partner") {
      navigate(`/partner/${destination.slug}/`);
      return;
    }
    navigate(destination.to);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = values.contact_name.trim();
    const company = values.company_name.trim();
    const email = values.email.trim();

    if (name.length < 2) {
      toast({ title: "Ange ditt namn", variant: "destructive" });
      return;
    }
    if (company.length < 2) {
      toast({ title: "Ange företagsnamn", variant: "destructive" });
      return;
    }
    const emailError = validateBusinessEmail(email);
    if (emailError) {
      toast({ title: "Ogiltig e-postadress", description: emailError, variant: "destructive" });
      return;
    }

    trackClick({ destination: destination.type });
    setSubmitting(true);
    try {
      const messageParts = [
        `Skickat från ${location.pathname}`,
        context.product ? `Produktområde: ${context.product}` : null,
        context.industry ? `Bransch: ${context.industry}` : null,
        destination.type === "partner" ? `Vidare till partner: ${destination.slug}` : null,
        destination.type === "pdf" ? "Vidare till: PDF-nedladdning" : null,
        contextNote || null,
      ].filter(Boolean);

      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...newsAttributionForLead(),
          contact_name: name.slice(0, 100),
          company_name: company.slice(0, 100),
          email: email.slice(0, 255),
          selected_product: context.product ?? null,
          industry: context.industry ?? null,
          message: messageParts.join(" · ").slice(0, 1000),
          source_page: location.pathname,
          source_type: sourceType,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      saveLeadProfile({ contact_name: name, company_name: company, email });
      setDone(true);
      await goToDestination();
    } catch (err) {
      console.error("QuickLeadForm submit error", err);
      toast({
        title: "Något gick fel",
        description: "Försök igen om en liten stund.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card ref={ref} className={className}>
      <CardContent className="p-5 sm:p-6">
        {done ? (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--accent))] mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-foreground">Tack {values.contact_name}!</p>
                <p className="text-sm text-muted-foreground">
                  {destination.type === "pdf"
                    ? "PDF:en är på väg – startar den inte automatiskt kan du hämta den här."
                    : "Vi tar dig vidare direkt."}
                </p>
              </div>
              <Button
                type="button"
                onClick={goToDestination}
                className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground"
              >
                {destination.type === "pdf" ? (
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                ) : null}
                {destination.label ?? defaultLabel}
                {destination.type !== "pdf" && (
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {description ??
                  (destination.type === "pdf"
                    ? "Fyll i uppgifterna så startar nedladdningen direkt."
                    : "Fyll i uppgifterna så tar vi dig vidare direkt.")}
              </p>
              {(context.product || context.industry) && (
                <p className="text-xs text-muted-foreground mt-2">
                  Vi kopplar förfrågan till{" "}
                  {[context.product, context.industry].filter(Boolean).join(" · ")}.
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="quicklead-name" className="text-xs">
                  Namn
                </Label>
                <Input
                  id="quicklead-name"
                  autoComplete="name"
                  value={values.contact_name}
                  onChange={(e) => setValues({ ...values, contact_name: e.target.value })}
                  placeholder="Anna Andersson"
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="quicklead-company" className="text-xs">
                  Företag
                </Label>
                <Input
                  id="quicklead-company"
                  autoComplete="organization"
                  value={values.company_name}
                  onChange={(e) => {
                    setTouchedCompany(true);
                    setValues({ ...values, company_name: e.target.value });
                  }}
                  placeholder="Företaget AB"
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="quicklead-email" className="text-xs">
                  Jobbmejl
                </Label>
                <Input
                  id="quicklead-email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  placeholder="anna@foretaget.se"
                  maxLength={255}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground"
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : destination.type === "pdf" ? (
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                ) : null}
                {submitting ? "Skickar …" : (destination.label ?? defaultLabel)}
              </Button>
              <p className="text-xs text-muted-foreground">
                Vi använder uppgifterna för att hjälpa er vidare – aldrig för massutskick.
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickLeadForm;
