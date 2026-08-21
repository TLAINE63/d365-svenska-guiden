import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Download, FileText, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { useToast } from "@/hooks/use-toast";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { newsAttributionForLead } from "@/utils/newsAttribution";
import { setPdfDelivery } from "@/lib/pdfDeliveryRegistry";
import {
  companyFromEmail,
  deriveLeadContext,
  getLeadProfile,
  saveLeadProfile,
} from "@/lib/leadContext";

type Step = "value" | "form" | "delivered";

interface Props {
  /** Name of the download, used in copy and in the funnel event metadata. */
  documentName: string;
  /** Short benefit-first headline. */
  title: string;
  /** One or two sentences on why the document is worth the e-mail. */
  intro: string;
  /** Concrete value bullets – what the reader gets. */
  benefits: string[];
  /** Generates and downloads the PDF. */
  onDeliver: () => void | Promise<void>;
  /** Stored on the lead so we can see which surface converted. */
  sourceType: string;
  /** Extra info appended to the lead message (e.g. calculator summary). */
  contextNote?: string;
  className?: string;
}

/**
 * Lead-gated PDF landing.
 *
 * Value first (step 1), then a three-field capture (step 2), then instant
 * delivery (step 3). Every step boundary is measured as an anonymous funnel
 * event so drop-off between "saw the offer", "opened the form", "submitted"
 * and "got the PDF" can be read in the admin funnel view.
 */
const GatedPdfDownload = ({
  documentName,
  title,
  intro,
  benefits,
  onDeliver,
  sourceType,
  contextNote,
  className,
}: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewedRef = useRef(false);

  const [step, setStep] = useState<Step>("value");
  const [values, setValues] = useState({ contact_name: "", company_name: "", email: "" });
  const [touchedCompany, setTouchedCompany] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [delivering, setDelivering] = useState(false);

  const baseMeta = {
    document: documentName,
    source_type: sourceType,
    page: location.pathname,
  };

  const track = (event_name: string, step_number: number, extra?: Record<string, unknown>) =>
    trackFunnelEvent({
      event_type: "pdf_download",
      event_name,
      step_number,
      metadata: { ...baseMeta, ...extra },
    });

  // Step 1 – the offer became visible.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !viewedRef.current) {
            viewedRef.current = true;
            track("gated_pdf_offer_view", 1);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentName]);

  // Returning visitors are pre-filled so the gate costs them one click.
  useEffect(() => {
    const profile = getLeadProfile();
    if (profile) {
      setValues(profile);
      if (profile.company_name) setTouchedCompany(true);
    }
  }, []);

  useEffect(() => {
    if (touchedCompany) return;
    const guess = companyFromEmail(values.email);
    if (guess) setValues((v) => ({ ...v, company_name: guess }));
  }, [values.email, touchedCompany]);

  const deliver = async () => {
    setDelivering(true);
    try {
      await onDeliver();
      track("gated_pdf_delivered", 4);
    } catch (err) {
      console.error("GatedPdfDownload deliver error", err);
      toast({
        title: "Kunde inte skapa PDF:en",
        description: "Försök igen om en liten stund.",
        variant: "destructive",
      });
    } finally {
      setDelivering(false);
    }
  };

  const openForm = () => {
    track("gated_pdf_form_open", 2);
    setStep("form");
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

    setSubmitting(true);
    const context = deriveLeadContext(location.pathname);
    try {
      const message = [
        `Nedladdning: ${documentName}`,
        context.product ? `Produktområde: ${context.product}` : null,
        context.industry ? `Bransch: ${context.industry}` : null,
        contextNote || null,
      ]
        .filter(Boolean)
        .join(" · ")
        .slice(0, 1000);

      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...newsAttributionForLead(),
          contact_name: name.slice(0, 100),
          company_name: company.slice(0, 100),
          email: email.slice(0, 255),
          selected_product: context.product ?? null,
          industry: context.industry ?? null,
          message,
          source_page: location.pathname,
          source_type: sourceType,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      saveLeadProfile({ contact_name: name, company_name: company, email });
      track("gated_pdf_lead_submitted", 3);
      setStep("delivered");
      await deliver();

      // Tack-sida med nästa steg (PDF:en kan laddas ned igen därifrån).
      const deliveryKey = `${sourceType}:${Date.now()}`;
      setPdfDelivery(deliveryKey, deliver);
      navigate("/tack-nedladdning", {
        state: {
          documentName,
          sourceType,
          deliveryKey,
          firstName: name.split(" ")[0],
          product: context.product ?? null,
          returnTo: location.pathname,
        },
      });
    } catch (err) {
      console.error("GatedPdfDownload submit error", err);
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
    <Card
      ref={containerRef}
      className={className ?? "border-[hsl(var(--cta-orange))]/30 bg-[hsl(var(--cta-orange))]/5"}
    >
      <CardContent className="p-5 sm:p-7 space-y-5">
        {step !== "delivered" && (
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[hsl(var(--cta-orange))]/10 p-2 flex-shrink-0">
              <FileText className="h-5 w-5 text-[hsl(var(--cta-orange))]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--cta-orange))]">
                {documentName}
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{intro}</p>
            </div>
          </div>
        )}

        {step === "value" && (
          <>
            <ul className="space-y-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                  <CheckCircle2
                    className="h-4 w-4 mt-0.5 text-[hsl(var(--accent))] flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button
                type="button"
                size="lg"
                onClick={openForm}
                className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground"
              >
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                Hämta PDF:en
              </Button>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                Tre fält – PDF:en levereras direkt i webbläsaren.
              </p>
            </div>
          </>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="gated-name" className="text-xs">
                  Namn
                </Label>
                <Input
                  id="gated-name"
                  autoComplete="name"
                  value={values.contact_name}
                  onChange={(e) => setValues({ ...values, contact_name: e.target.value })}
                  placeholder="Anna Andersson"
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gated-company" className="text-xs">
                  Företag
                </Label>
                <Input
                  id="gated-company"
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
                <Label htmlFor="gated-email" className="text-xs">
                  Jobbmejl
                </Label>
                <Input
                  id="gated-email"
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
                size="lg"
                disabled={submitting}
                className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground"
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {submitting ? "Skapar PDF …" : "Skicka och ladda ned"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setStep("value")}>
                Tillbaka
              </Button>
            </div>

            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
              Vi använder uppgifterna för att hjälpa dig vidare – aldrig för massutskick.
            </p>
          </form>
        )}

        {step === "delivered" && (
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="h-5 w-5 mt-0.5 text-[hsl(var(--accent))] flex-shrink-0"
              aria-hidden="true"
            />
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-foreground">
                  Tack {values.contact_name.split(" ")[0]}! {documentName} är nedladdad.
                </p>
                <p className="text-sm text-muted-foreground">
                  Startade nedladdningen inte automatiskt kan du hämta filen igen här.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  track("gated_pdf_redownload", 5);
                  void deliver();
                }}
                disabled={delivering}
              >
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                {delivering ? "Skapar PDF …" : "Ladda ned igen"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GatedPdfDownload;
