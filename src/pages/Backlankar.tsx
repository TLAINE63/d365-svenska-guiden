import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BacklinkStatsSection from "@/components/BacklinkStatsSection";
import { Link2 } from "lucide-react";

export default function Backlankar() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        breadcrumbs={[{ name: "Hem", url: "/" }, { name: "Länkar till d365.se", url: "/lankar-till-d365/" }]}
        title="Länkar till d365.se | d365.se"
        description="Så många webbplatser länkar till d365.se. Siffrorna hämtas från Semrush och visar antal refererande domäner, antal länkar och auktoritetspoäng."
        canonicalPath="/lankar-till-d365"
      />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-5xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 text-primary text-sm font-medium mb-4">
            <Link2 className="h-4 w-4" /> Länkprofil
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Länkar till d365.se</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            När andra webbplatser länkar till d365.se blir innehållet lättare att hitta, både i Google och
            i AI-tjänster som hämtar sitt underlag från öppna källor. Nedan visas hur många webbplatser som
            länkar hit och hur många länkar det handlar om.
          </p>
        </div>

        <BacklinkStatsSection variant="full" />

        <section className="mt-12 text-muted-foreground leading-relaxed space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Vad siffrorna betyder</h2>
          <p>
            Antalet webbplatser som länkar hit säger mer än antalet länkar. Många länkar från en och samma
            webbplats väger lättare än enstaka länkar från många olika håll. Auktoritetspoängen är Semrush
            egen skala från 0 till 100 och bygger på länkprofilens omfattning och kvalitet.
          </p>
          <p>
            Siffrorna är uppskattningar från Semrush och uppdateras manuellt. De speglar inte antal besökare,
            som mäts separat i sajtens egen statistik.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
