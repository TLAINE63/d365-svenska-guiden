import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import ApplicationPartners from "@/components/ApplicationPartners";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import SalesIcon from "@/assets/icons/Sales.svg";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const salesBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Marknad & Sälj", url: "https://d365.se/d365-sales" },
  { name: "Dynamics 365 Sales", url: "https://d365.se/d365-sales" },
];
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Sales FAQs for schema
const salesFaqs = [
  { question: "Vad kostar Dynamics 365 Sales?", answer: "Dynamics 365 Sales finns i tre licensnivåer: Sales Professional kostar 718 kr/användare/mån, Sales Enterprise 1 160 kr/mån och Sales Premium 1 658 kr/mån. Implementeringskostnad för ett standardprojekt med 10–30 användare ligger typiskt på 150 000–400 000 kr." },
  { question: "Vad är Dynamics 365 Sales och vad används det till?", answer: "Microsoft Dynamics 365 Sales är ett molnbaserat CRM-system (Customer Relationship Management) för säljteam. Det hjälper företag hantera leads, affärsmöjligheter, kundkonton och prognoser – med inbyggd AI via Microsoft Copilot som rekommenderar nästa steg och analyserar kunddata i realtid." },
  { question: "Hur jämför sig Dynamics 365 Sales mot Salesforce?", answer: "Dynamics 365 Sales och Salesforce är de två ledande CRM-systemen. Dynamics 365 Sales sticker ut med djup Microsoft 365-integration (Outlook, Teams, Excel), inbyggd Copilot AI utan extrakostnad i Enterprise-planen, och möjligheten att koppla CRM direkt med Microsoft ERP-system som Business Central. Salesforce har ett bredare ekosystem av tredjepartsappar men kräver ofta mer anpassning och har högre total ägandekostnad." },
  { question: "Vad är skillnaden mellan Sales Professional och Sales Enterprise?", answer: "Sales Professional (718 kr/mån) är grundlicensen med lead- och affärshantering, kontakthantering och Microsoft 365-integration. Sales Enterprise (1 160 kr/mån) lägger till inbyggd Copilot AI, förutsägande poängsättning av leads, avancerad försäljningsanalys och anpassningsbar automatisering via Power Automate." },
  { question: "Hur fungerar Microsoft Copilot AI i Dynamics 365 Sales?", answer: "Microsoft Copilot i Dynamics 365 Sales analyserar kunddata och ger realtidsrekommendationer för säljare. Det sammanfattar e-postkonversationer, föreslår nästa bästa åtgärd, prioriterar leads baserat på konverteringssannolikhet och kan skriva uppföljningsmail automatiskt. Copilot ingår i Sales Enterprise och Premium utan extra licensavgift." },
  { question: "Kan Dynamics 365 Sales integreras med vårt ERP-system?", answer: "Ja. Dynamics 365 Sales integreras nativt med Microsoft Business Central och Finance & Supply Chain Management, vilket ger säljarna tillgång till lagerdata, orderstatus och kundreskontro direkt i CRM-systemet. Integration med tredjepartsERP-system görs via Power Platform eller Microsofts standardkopplingar." },
  { question: "Hur lång tid tar det att implementera Dynamics 365 Sales?", answer: "En standardimplementering för 10–30 användare tar normalt 2–3 månader. Större implementeringar med anpassade säljprocesser, systemintegrationer och multipla säljteam tar 4–6 månader. Valet av erfaren Microsoft-partner är avgörande för att hålla tid och budget." },
  { question: "Behöver vi en Microsoft-partner för att implementera Dynamics 365 Sales?", answer: "Ja, Dynamics 365 Sales implementeras via certifierade Microsoft-partners med CRM-specialistkompetens. En bra partner tar fram rätt konfiguration, utbildar säljteamet och säkerställer adoption. På d365.se kan du filtrera och jämföra certifierade Dynamics 365 Sales-partners i Sverige." },
];

const D365Sales = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const salesPricing = [
    {
      title: "Sales Professional",
      description: "För försäljningsteam",
      price: "718,30 kr",
      features: [
        "Lead- och affärshantering",
        "Kontakt- och kontohantering",
        "E-postintegration",
        "Grundläggande rapporter",
        "Microsoft 365-integration",
      ],
    },
    {
      title: "Sales Enterprise",
      description: "Avancerad försäljning",
      price: "1 160,30 kr",
      features: [
        "Allt i Professional",
        "Integrerad Copilot",
        "Förutsägande insikter med AI",
        "Avancerad analys",
        "Anpassningsbar automatisering",
      ],
    },
    {
      title: "Sales Premium",
      description: "Premium försäljning",
      price: "1 657,60 kr",
      features: [
        "Allt i Enterprise",
        "Conversation Intelligence",
        "Relationship scoring",
        "Avancerad försäljningsanalys",
        "Försäljningsplanering",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Dynamics 365 Sales – CRM för Sälj | Priser & Salesforce-alternativ | d365.se"
        description="Guide till Microsoft Dynamics 365 Sales – det ledande Microsoft CRM-systemet för säljteam. Priser från 718 kr/mån, Copilot AI inbyggt, och jämförelse mot Salesforce. Hitta certifierad partner i Sverige."
        canonicalPath="/d365-sales"
        keywords="Dynamics 365 Sales pris, Dynamics 365 Sales licens, CRM för sälj, Microsoft CRM system, Salesforce alternativ Sverige, Dynamics 365 Sales vs Salesforce, CRM system säljteam, Dynamics 365 Sales implementering, Sales Enterprise Copilot, Microsoft CRM partner Sverige"
        ogImage="https://d365.se/og-sales.png"
      />
      <FAQSchema faqs={salesFaqs} />
      <ServiceSchema 
        name="Microsoft Dynamics 365 Sales – CRM för Säljteam"
        description="Molnbaserat CRM-system för moderna säljteam med inbyggd Copilot AI, förutsägande leadpoängsättning och sömlös Microsoft 365-integration. Licenspriser från 718 kr/användare/mån."
      />
      <BreadcrumbSchema items={salesBreadcrumbs} />
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" 
            alt="Sales team collaboration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <img src={SalesIcon} alt="Sales" className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Dynamics 365 Sales
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-6">
                Maximera dina försäljningsresultat med intelligent CRM och AI-drivna insikter
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <ContactFormDialog>
                  <Button 
                    size="lg"
                    className="bg-sales hover:bg-sales/90 text-sales-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
                  >
                    Boka en kostnadsfri rådgivning
                  </Button>
                </ContactFormDialog>
                <Button 
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
                  onClick={() => document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Hitta rätt partner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Microsoft Dynamics 365 Sales
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              Intelligent CRM för moderna säljteam
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Dynamics 365 Sales hjälper ditt säljteam att bygga starkare kundrelationer, öka produktiviteten och stänga fler affärer snabbare. Med AI-drivna insikter via Microsoft Copilot får säljarna vägledning i rätt tid för att prioritera rätt leads och möjligheter.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Plattformen integreras sömlöst med Microsoft 365, Teams och Outlook, vilket gör det enkelt för säljare att arbeta effektivt utan att byta mellan olika system.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Se Dynamics 365 Sales i aktion
            </h2>
            <VideoCard
              title="Dynamics 365 Sales"
              description="Maximera dina försäljningsresultat med intelligent CRM"
              videoId="TMdY77b1TTg"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Sales
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad är skillnaden mellan Sales Professional och Sales Enterprise?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Sales Professional är grundlicensen som inkluderar lead- och affärshantering, kontakthantering och e-postintegration. Sales Enterprise lägger till avancerade funktioner som AI-drivna insikter via Copilot, förutsägande analys och anpassningsbara automatiseringsflöden. Enterprise passar bättre för organisationer som behöver djupare kundinsikter och mer avancerad säljstyrning.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur fungerar AI och Copilot i Dynamics 365 Sales?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Microsoft Copilot i Dynamics 365 Sales analyserar kunddata och interaktioner för att ge säljarna realtidsrekommendationer. Det kan sammanfatta möten, föreslå nästa steg, identifiera risker i affärer och prioritera leads baserat på sannolikhet att konvertera. Copilot hjälper också till att skriva e-postmeddelanden och förbereda kundmöten.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Kan Dynamics 365 Sales integreras med vårt befintliga ERP-system?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Ja, Dynamics 365 Sales kan integreras med de flesta ERP-system, både Microsofts egna (Business Central, Finance & Supply Chain) och mängder av andra moderna ERP-system. Inbyggd integration med Business Central är enkel att konfigurera, medan integrationer med andra system ofta kräver anpassade lösningar via Power Platform eller standardkopplingar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur lång tid tar det att implementera Dynamics 365 Sales?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  En standardimplementering av Dynamics 365 Sales för 10-30 användare tar normalt 2-4 månader. Tiden kan variera beroende på om ni har möjlighet att lägga den interna tiden som ofta krävs och om ni har en god bild över hur ni vill att säljprocessen skall se ut. Detta inkluderar grundkonfiguration, datamigrering, användarutbildning och integrationer. Större implementeringar för en större verksamhet och med mer omfattande anpassningar kan ta 6-12 månader eller mer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={SalesIcon} alt="Sales" className="h-12 w-12" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Licenspriser
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {salesPricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>

      {/* Implementation Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Hur lång tid tar en implementation och vad ligger kostnaden på?
            </h2>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">⏱️ Tidsåtgång</h3>
                  <p className="text-muted-foreground mb-4">
                    En typisk implementation av Dynamics 365 Sales tar <strong>2-4 månader</strong> beroende på komplexitet och antal användare.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Liten implementation (5-15 användare):</strong> 6-10 veckor</li>
                    <li>• <strong>Medelstor (15-50 användare):</strong> 4-8 månader</li>
                    <li>• <strong>Stor (50+ användare):</strong> 7-15 månader</li>
                    <li>• <strong>Omfattande (Många användare, flera verksamhetsområden/bolag/länder och rikligt med integrationer):</strong> 12-24 månader</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">💰 Kostnad</h3>
                  <p className="text-muted-foreground mb-4">
                    Implementationskostnaden varierar beroende på anpassningar, integrationer och datamigrering.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Liten implementation:</strong> 100 000 - 250 000 kr</li>
                    <li>• <strong>Medelstor:</strong> 250 000 - 600 000 kr</li>
                    <li>• <strong>Stor med anpassningar:</strong> 600 000 - 1 500 000 kr</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-6 italic">
                * Priserna är uppskattningar och varierar beroende på partner, omfattning och specifika krav. Kontakta en partner för en exakt offert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <ApplicationPartners applicationFilter="Sales" pageSource="D365 Sales" />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-sales">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att ta din försäljning till nästa nivå?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Boka en kostnadsfri rådgivning med oss så hjälper vi dig hitta rätt CRM-lösning för ditt företag.
          </p>
          <ContactFormDialog>
            <Button 
              size="lg"
              className="bg-white text-sales hover:bg-white/90 text-base sm:text-lg h-14 sm:h-16 rounded-xl"
            >
              Boka en kostnadsfri rådgivning
            </Button>
          </ContactFormDialog>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default D365Sales;
