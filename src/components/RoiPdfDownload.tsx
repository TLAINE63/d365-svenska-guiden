import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, CheckCircle, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateRoiPdf, type RoiPdfData } from "@/utils/generateRoiPdf";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { newsAttributionForLead } from "@/utils/newsAttribution";
import { useCtaTracking } from "@/hooks/useCtaTracking";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

interface RoiPdfDownloadProps {
  buildPdfData: (email: string) => RoiPdfData;
  /** Identifier for the lead source, e.g. "roi-bc" / "roi-sales". */
  sourceKey: string;
  /** Human label used in toast + lead message. */
  productLabel: string;
}

export default function RoiPdfDownload({ buildPdfData, sourceKey, productLabel }: RoiPdfDownloadProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { ref: ctaRef, trackClick } = useCtaTracking<HTMLDivElement>("roi_pdf_download", { source: sourceKey });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateBusinessEmail(email);
    if (emailError) {
      toast({ title: emailError, variant: "destructive" });
      return;
    }
    if (honeypot) {
      setDone(true);
      return;
    }
    trackClick();
    setIsSubmitting(true);
    try {
      const data = buildPdfData(email);
      // Lead first – then generate PDF locally
      const res = await supabase.functions.invoke("submit-lead", {
        body: {
          ...newsAttributionForLead(),
          email,
          company_name: data.companyName || "ROI-kalkyl",
          contact_name: email.split("@")[0] || "Lead",
          source_page: `/${sourceKey}/`,
          source_type: `roi_pdf_${sourceKey}`,
          message: `Laddat ned ROI/TCO-PDF för ${productLabel}`,
          _hp: honeypot,
        },
      });
      if (res.error) throw new Error(res.error.message || "Kunde inte ansluta");
      if (res.data?.error) throw new Error(res.data.error);

      await generateRoiPdf(data);
      trackFunnelEvent({ event_type: "pdf_download", event_name: `roi_pdf_${sourceKey}`, metadata: { product: productLabel } });
      setDone(true);
      toast({
        title: "PDF laddas ned",
        description: "Kontrollera din nedladdningsmapp.",
      });
    } catch (err) {
      console.error("ROI PDF download error", err);
      toast({
        title: "Något gick fel",
        description: err instanceof Error ? err.message : "Försök igen om en stund.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="p-5 flex items-center gap-3">
          <CheckCircle className="h-7 w-7 text-emerald-500 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">Tack! PDF:en är på väg.</p>
            <p className="text-muted-foreground">
              Fick du ingen fil?{" "}
              <button
                type="button"
                onClick={() => setDone(false)}
                className="text-primary hover:underline font-medium"
              >
                Försök igen
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={ctaRef} className="bg-[hsl(var(--hero-dark))] border-[hsl(var(--line-dark))] text-white overflow-hidden">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-[hsl(var(--cta-orange))] rounded-md p-2.5 flex-shrink-0">
            <FileDown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-1">Ladda ned kalkylen som PDF</h3>
            <p className="text-sm text-white/75 max-w-xl">
              Få en snygg, delningsbar version med dina resultat och fullständiga antaganden för {productLabel} som bilaga. Perfekt att skicka vidare i ledningsgruppen.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg">
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
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.se"
            disabled={isSubmitting}
            className="flex-1 bg-white text-foreground placeholder:text-muted-foreground border-white/20"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="whitespace-nowrap bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white"
          >
            {isSubmitting ? "Förbereder…" : <><Download className="mr-2 h-4 w-4" />Ladda ned PDF</>}
          </Button>
        </form>
        <p className="text-[11px] text-white/55 mt-2">
          Kostnadsfri. Ingen prenumeration. Vi använder adressen för att kunna följa upp om du vill ha hjälp att tolka resultatet.
        </p>
      </CardContent>
    </Card>
  );
}
