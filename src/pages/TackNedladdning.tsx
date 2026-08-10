import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, Download, Loader2, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPdfDelivery } from "@/lib/pdfDeliveryRegistry";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { useToast } from "@/hooks/use-toast";

export interface TackNedladdningState {
  documentName: string;
  sourceType: string;
  deliveryKey?: string;
  firstName?: string;
  product?: string | null;
  returnTo?: string;
}

const steps = [
  {
    num: "1",
    title: "Läs igenom underlaget",
    body: "PDF:en innehåller alla antaganden – gå igenom dem internt så att alla räknar på samma bas.",
  },
  {
    num: "2",
    title: "Skicka det till 2–3 partners",
    body: "Låt matchande partners offerera mot exakt samma underlag. Då blir svaren jämförbara.",
  },
  {
    num: "3",
    title: "Boka avstämning",
    body: "Vi hör av oss om vi ser att någon partner passar särskilt väl för er situation.",
  },
];

export default function TackNedladdning() {
  const location = useLocation();
  const { toast } = useToast();
  const state = (location.state ?? null) as TackNedladdningState | null;
  const [delivering, setDelivering] = useState(false);

  if (!state?.documentName) return <Navigate to="/" replace />;

  const deliver = getPdfDelivery(state.deliveryKey ?? "");
  const partnerLink = state.product
    ? `/valjdynamics365partner?product=${encodeURIComponent(state.product)}`
    : "/valjdynamics365partner";

  const handleRedownload = async () => {
    if (!deliver) return;
    setDelivering(true);
    try {
      trackFunnelEvent({
        event_type: "pdf_download",
        event_name: "gated_pdf_redownload",
        step_number: 5,
        metadata: { document: state.documentName, source_type: state.sourceType },
      });
      await deliver();
    } catch {
      toast({
        title: "Kunde inte skapa PDF:en",
        description: "Försök igen om en liten stund.",
        variant: "destructive",
      });
    } finally {
      setDelivering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tack – ditt underlag är på väg | d365.se</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <div className="flex items-start gap-3 mb-8">
          <CheckCircle2 className="h-7 w-7 text-[hsl(var(--accent))] flex-shrink-0" aria-hidden="true" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Tack{state.firstName ? ` ${state.firstName}` : ""}! {state.documentName} är nedladdad.
            </h1>
            <p className="text-muted-foreground mt-2">
              Filen laddades ned automatiskt i webbläsaren. Här är vad vi rekommenderar att ni gör härnäst.
            </p>
          </div>
        </div>

        <ol className="grid sm:grid-cols-3 gap-4 mb-10">
          {steps.map((s) => (
            <li key={s.num}>
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="text-[hsl(var(--cta-orange))] font-bold text-lg mb-2">{s.num}</div>
                  <h2 className="font-semibold text-foreground mb-1 text-sm">{s.title}</h2>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            size="lg"
            className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground"
          >
            <Link to={partnerLink}>
              <Users className="mr-2 h-4 w-4" aria-hidden="true" />
              Öppna matchande partners
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>

          {deliver ? (
            <Button type="button" variant="outline" size="lg" onClick={handleRedownload} disabled={delivering}>
              {delivering ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {delivering ? "Skapar PDF …" : "Ladda ned PDF igen"}
            </Button>
          ) : state.returnTo ? (
            <Button asChild variant="outline" size="lg">
              <Link to={state.returnTo}>
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                Ladda ned PDF igen
              </Link>
            </Button>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
