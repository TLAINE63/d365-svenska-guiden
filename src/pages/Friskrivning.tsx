import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  AlertTriangle,
  Info,
  ShieldCheck,
  Users,
  FileText,
  Calculator,
  Scale,
  BookOpen,
  Mail,
} from "lucide-react";

export default function Friskrivning() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Friskrivning & tolkningar | d365.se"
        description="Samlade friskrivningar för d365.se: information, behovsanalyser, kravspecifikationer, ROI-kalkyler, jämförelser och hur partnerinformation presenteras och tolkas."
        canonicalPath="/friskrivning"
      />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-12 max-w-3xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" /> Friskrivning
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Friskrivning, tolkningar och presentation av partnerinformation
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Den här sidan samlar de friskrivningar som finns i sidfoten, i våra verktyg
            och på partnerprofiler. Syftet är att du som besökare ska förstå vad
            informationen på d365.se är – och vad den <em>inte</em> är.
          </p>
        </div>

        {/* Allmänt om information */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <Info className="h-6 w-6 text-primary" /> Allmän information på sajten
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Information på d365.se har ambitionen att ge en rättvisande bild av
            Microsoft Dynamics 365-marknaden. Utvecklingen går fort och funktioner,
            priser och licensvillkor kan ändras. Kontrollera alltid senaste nytt i
            detaljerna innan du fattar beslut, och stäm av med relevanta partners eller
            direkt med Microsoft.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            d365.se är fristående från Microsoft Corporation. Vi är inte anslutna till,
            sponsrade av eller godkända av Microsoft. Dynamics 365, Business Central
            och andra Microsoft-produktnamn är varumärken som tillhör Microsoft.
          </p>
        </section>

        {/* Behovsanalyser */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Behovsanalyser och AI Readiness
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Våra behovsanalyser (ERP, Sälj & Marknad, Kundservice och AI Readiness)
            är <strong>vägledande analyser – inte kravspecifikationer</strong>. De ger
            en indikation på riktning, mognad och tänkbara lösningsspår, men ersätter
            inte en formell analys tillsammans med en partner.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            PDF-rapporter formulerar en preliminär lösningshypotes som utgångspunkt
            för samtal – inte som ett bindande underlag.
          </p>
        </section>

        {/* Kravspecifikationer */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Kravspecifikationer
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Kravspecifikationerna på d365.se startar från ett tomt underlag och
            genereras med hjälp av AI utifrån dina val. De är <strong>vägledande</strong>
            och behöver alltid valideras av dig och en eller flera partners innan de
            används i en upphandling.
          </p>
        </section>

        {/* ROI-kalkyler */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" /> ROI-kalkyler och prisindikationer
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            ROI-kalkyler (Business Central, Sales, produkt-ROI) är <strong>förenklade
            uppskattningar</strong> avsedda som beslutsstöd. Använd dem för att skapa
            en storleksordning och validera antaganden med två–tre relevanta partners
            innan investeringsbeslut.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Angivna licenspriser är riktvärden och kan ändras av Microsoft. Slutgiltiga
            priser sätts av din partner och din licensavtalspart.
          </p>
        </section>

        {/* Jämförelser */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" /> Jämförelser mellan system och partners
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Priser, licensvillkor och funktionalitet kan ändras över tid. Våra
            jämförelser är <strong>köparsidiga vägledningar, inte garantier</strong>.
            De ger en strukturerad utgångspunkt för dina egna samtal med Microsoft och
            partners.
          </p>
        </section>

        {/* Partnerinformation */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Presentation av partnerinformation
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Partners presenteras på två sätt på d365.se:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-muted-foreground leading-relaxed">
            <li>
              <strong>Anslutna partners</strong> har själva bekräftat sina uppgifter
              (kompetenser, branscher, geografi, kontaktvägar) via vår partnerportal
              och kan kontaktas via plattformens förmedlade leadflöde.
            </li>
            <li>
              <strong>Basickort</strong> är översikter som är sammanställda av d365.se
              utifrån publika källor. Informationen är begränsad och kontakt via
              d365.se är ännu inte aktiverad för dessa partners. Uppgifter kan vara
              inaktuella eller ofullständiga – vill partnern justera bilden kan de
              komplettera profilen.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Observerade branscher, storlekar, omsättning och geografi bygger på öppen
            information (partnerns egna webbsidor, Microsoft AppSource, offentliga
            referenser). De är tolkningar och kan skilja sig från partnerns egen
            positionering.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Matchningar och rangordningar är indikativa beslutsunderlag. Ingen partner
            kan betala sig till bättre placering – alla anslutna partners betalar
            samma avgift. Läs mer i{" "}
            <Link
              to="/agande-och-intressen/"
              className="text-primary underline hover:no-underline"
            >
              Så fungerar partnersamarbetet
            </Link>{" "}
            och i vår redovisning av{" "}
            <Link
              to="/agande-och-intressen/"
              className="text-primary underline hover:no-underline"
            >
              ägande och intressen
            </Link>
            .
          </p>
        </section>

        {/* AI-tolkningar */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" /> AI-genererat innehåll
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Delar av innehållet – kravspecifikationer, sammanfattningar,
            matchningsförklaringar och vissa rekommendationer – genereras eller
            bearbetas av AI. AI kan ha fel eller sakna kontext. Innehållet ska
            läsas som ett underlag att kvalificera, inte som en slutlig sanning.
          </p>
        </section>

        {/* Ansvar */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" /> Ansvarsbegränsning
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            d365.se ansvarar inte för beslut som fattas enbart utifrån innehållet på
            sajten, eller för skada som uppstår vid användning av information,
            analyser, kalkyler eller partnerpresentationer. Verifiera alltid
            avgörande antaganden med Microsoft och relevanta partners innan avtal
            tecknas.
          </p>
        </section>

        {/* Kontakt */}
        <section className="mb-4">
          <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" /> Rättelser och frågor
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Ser du något som är fel eller missvisande? Hör av dig så uppdaterar vi.
            Kontakta oss via{" "}
            <Link to="/kontakt/" className="text-primary underline hover:no-underline">
              kontaktsidan
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
