import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Mail } from "lucide-react";

// Avtals-PDF kan laddas upp till partner-documents-bucket och länkas här.
// Lämna AGREEMENT_PDF_URL = null tills PDF finns.
const AGREEMENT_PDF_URL: string | null = null;

export default function PartnerAgreement() {
  return (
    <>
      <SEOHead
        title="Partneravtal"
        description="Avtalsvillkor för partners på d365.se."
        canonicalPath="/partner-avtal"
        noIndex
      />
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container max-w-3xl mx-auto px-4 space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Partneravtal – d365.se</h1>
            <p className="text-muted-foreground">
              Sammanfattning av villkor för partnersamarbete med d365.se. Fullständigt avtal kan
              laddas ner som PDF nedan.
            </p>
          </header>

          {AGREEMENT_PDF_URL && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Gällande partneravtal (PDF)</div>
                    <div className="text-xs text-muted-foreground">Senast uppdaterad version</div>
                  </div>
                </div>
                <Button asChild>
                  <a href={AGREEMENT_PDF_URL} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Ladda ner
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Avgift och produktområden</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                Månadsavgiften är <strong>1 990 kr per produktområde</strong> (Sales och Customer
                Service buntas som en CRM-enhet).
              </p>
              <p>Faktureras månadsvis i förskott. Priserna anges exklusive moms.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avtalstid och uppsägning</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>Avtalet löper tills vidare med en månads ömsesidig uppsägningstid.</p>
              <p>Uppsägning sker skriftligen via e-post till oss på d365.se.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vad ingår</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Egen partnerprofil med logotyp, beskrivning, kontaktuppgifter och kundexempel.</li>
                <li>Profilering på de produkt-, bransch- och kapabilitetsfilter ni valt.</li>
                <li>Möjlighet att publicera events och länka till egna landningssidor per produkt.</li>
                <li>Vidareförmedling av leads från guider, behovsanalyser och kontaktformulär som matchar er profil.</li>
                <li>Tillgång till statistik över sajtens trafik (denna URL: /partner-statistik).</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Innehåll och redaktionell kontroll</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                Partnern ansvarar för korrektheten i sin egen profil och sina events. d365.se
                förbehåller sig rätten att moderera, redigera eller avpublicera innehåll som
                bedöms vilseledande, kränkande eller på annat sätt strider mot sajtens redaktionella
                linje.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personuppgifter</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                Behandling av personuppgifter sker enligt vår{" "}
                <a href="/dataskydd/" className="underline">dataskyddspolicy</a>. Leadsdata
                vidareförmedlas endast till partners som matchar leadets profil.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="w-5 h-5" />
                Frågor om avtalet
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Kontakta oss via{" "}
              <a href="/kontakt/" className="underline text-foreground">/kontakt</a> så återkommer vi.
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
