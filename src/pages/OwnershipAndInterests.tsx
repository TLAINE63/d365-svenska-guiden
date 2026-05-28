import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Mail, CheckCircle2, Users, Scale, BookOpen } from "lucide-react";

export default function OwnershipAndInterests() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Så fungerar partnersamarbetet på d365.se"
        description="Hur partnersamarbetet på d365.se fungerar: vilka partners som finns med, hur de presenteras, och hur vi står på köparens sida i valet av Dynamics 365-partner."
        canonicalPath="/agande-och-intressen"
      />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" /> Partnersamarbetet
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Så fungerar partnersamarbetet på d365.se
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            d365.se hjälper organisationer att välja rätt partner för Microsoft Dynamics 365.
            För att du ska kunna lita på det vi visar förklarar den här sidan hur
            partnersamarbetet fungerar – och vilka partners du faktiskt möter på sajten.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Vilka partners som finns med
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            De partners du ser på d365.se är de som valt att delta på plattformen.
            Det är alltså inte en heltäckande förteckning över samtliga Dynamics 365-partners
            i Sverige, utan ett urval av de partners som anslutit sig.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Vi är öppna med det, eftersom du ska kunna värdera våra jämförelser med rätt
            förväntan: de gäller de deltagande partnerna, presenterade på lika villkor.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" /> Hur en partner kommer med
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            En partner finns med genom att betala en fast deltagaravgift. Avgiften är densamma
            för alla partners, oavsett storlek.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" /> Hur partners presenteras och jämförs
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Ingen partner kan betala sig till en bättre placering, ett starkare omdöme eller
            en plats högre upp i en matchning.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            När vi visar eller föreslår partners utgår vi från hur väl de passar dina krav
            och ditt behov – inte från vem som betalar mest, eftersom alla betalar lika.
            Profilkort, jämförelser och prisindikationer är indikativa underlag som hjälper dig
            att kvalificera dina alternativ. Det slutliga valet, och kontakten, ligger alltid
            hos dig.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground">Vår roll – och din</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vi står på köparens sida. Vi säljer varken system eller implementation, och vi
            sluter inga avtal åt någon partner. Vår uppgift är att ge dig ett tryggt och
            försvarbart beslutsunderlag.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            När du är redo tar du själv kontakt med de partners du vill prata med, i din egen
            takt. Vi förmedlar kunskap – inte kontrakt.
          </p>
        </section>

        <section className="mb-10 rounded-lg border border-border bg-muted/30 p-6">
          <h2 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" /> Vill du som partner finnas med?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Är ni en Dynamics 365-partner som vill nå köpare tidigt i deras beslutsprocess?
            Kontakta oss på{" "}
            <a
              href="mailto:info@d365.se"
              className="text-primary hover:underline"
            >
              info@d365.se
            </a>
            .
          </p>
        </section>

        <p className="text-xs text-muted-foreground italic">
          Senast uppdaterad: 2026-05-28. d365.se är fristående från Microsoft Corporation. Dynamics 365,
          Business Central och andra Microsoft-produktnamn är varumärken som tillhör Microsoft.
        </p>
      </main>
      <Footer />
    </div>
  );
}
