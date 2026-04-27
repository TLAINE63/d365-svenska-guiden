import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SiteTrafficStatsCard from "@/components/SiteTrafficStatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function PartnerStats() {
  return (
    <>
      <SEOHead
        title="Partnerstatistik"
        description="Sajtstatistik för d365.se – endast för partners."
        canonicalPath="/partner-statistik"
        noIndex
      />
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container max-w-5xl mx-auto px-4 space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Partnerstatistik – d365.se</h1>
            <p className="text-muted-foreground">
              Övergripande trafikstatistik för d365.se. Den här sidan är endast avsedd för partners
              och är inte länkad från sajten.
            </p>
          </header>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="w-5 h-5" />
                Om datan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>Statistiken baseras på besök loggade i d365.se:s besöksmätning.</p>
              <p>Bottar, intern trafik och partners egen trafik filtreras automatiskt bort.</p>
            </CardContent>
          </Card>

          <SiteTrafficStatsCard token={null} mode="public" />
        </div>
      </main>
      <Footer />
    </>
  );
}
