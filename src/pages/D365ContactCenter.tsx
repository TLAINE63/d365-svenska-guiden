import ProductHero from "@/components/ProductHero";
import RelatedPages, { contactCenterRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import ApplicationPartners from "@/components/ApplicationPartners";
import { ArrowRight, FileText } from "lucide-react";
import { useEffect } from "react";
import ContactCenterIcon from "@/assets/icons/ContactCenter.svg";
import { CC_ARTICLES } from "@/data/ccArticles";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const contactCenterBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kundservice", url: "https://d365.se/d365customerservice" },
  { name: "Dynamics 365 Contact Center", url: "https://d365.se/d365contactcenter" },
];
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Contact Center FAQs for schema
const contactCenterFaqs = [
  { question: "Vad kostar Dynamics 365 Contact Center?", answer: "Dynamics 365 Contact Center kostar från 1 051,40 kr per agent och månad (Microsofts officiella prislista). Priset inkluderar omnichannel-stöd, intelligent routing och AI-assistans. Implementationskostnaden varierar från 250 000 kr för grundläggande telefoni upp till 2 000 000 kr för en fullständig omnichannel-lösning med AI-botar." },
  { question: "Vad är skillnaden mellan Dynamics 365 Contact Center och Customer Service?", answer: "Dynamics 365 Contact Center är specifikt designat för högvolym-kontaktcenter med avancerade telefoni-funktioner (ACD, IVR), intelligent routing, virtuella agenter och real-time övervakning av agentprestanda. Customer Service fokuserar mer på ärendehantering och kunskapsdatabaser. De kan kombineras för en komplett lösning – Contact Center hanterar den inkommande kommunikationen, Customer Service hanterar ärendets livscykel." },
  { question: "Hur fungerar AI-drivna virtuella agenter i Contact Center?", answer: "Virtuella agenter i Contact Center använder Copilot AI och naturlig språkförståelse för att automatiskt hantera 30–60% av vanliga kundförfrågningar via chatt eller telefon. De kan svara på frågor, guida kunder genom processer och vid behov eskalera till mänskliga agenter med full konversationshistorik. Detta minskar väntetider, sänker kostnad per kontakt och frigör agenter för komplexa ärenden." },
  { question: "Vilka kanaler stöds i Dynamics 365 Contact Center?", answer: "Contact Center stöder alla viktiga kommunikationskanaler: telefon (inkommande och utgående med ACD/IVR), live-chatt på webbplats, e-post, SMS, sociala medier (Facebook Messenger, Twitter/X, WhatsApp) och Microsoft Teams. Alla kanaler samlas i ett enhetligt agentgränssnitt så att agenter kan hantera alla interaktioner från samma plats och kunder kan byta kanal utan att förlora kontext." },
  { question: "Hur fungerar intelligent routing i Contact Center?", answer: "Intelligent routing i Dynamics 365 Contact Center matchar automatiskt inkommande ärenden med rätt agent baserat på kompetens, tillgänglighet, kundhistorik, ärendets prioritet och SLA-krav. Copilot AI analyserar ärendets innehåll och rekommenderar den bäst lämpade agenten. Detta minskar genomsnittlig handläggningstid (AHT) och ökar first contact resolution." },
  { question: "Hur länge tar en Contact Center-implementation?", answer: "En grundläggande telefoni-implementation tar 2–3 månader. Med chatt och e-post 5–7 månader. En fullständig omnichannel-lösning med AI-botar och djupintegrationer tar 8–12 månader. Implementationstiden beror på antal agenter, antal kanaler, befintliga system att integrera med och specifika anpassningsbehov." },
  { question: "Dynamics 365 Contact Center vs Genesys/Avaya – vilket ska jag välja?", answer: "Dynamics 365 Contact Center är optimalt för organisationer som redan använder Microsoft 365 och Dynamics 365 CRM, då det ger djup inbyggd integration med Teams, Outlook och kunddata. Genesys är en stark konkurrent för mycket stora kontaktcenter med extremt avancerade routing-behov. Avaya passar organisationer med befintlig Avaya-infrastruktur. Dynamics 365 Contact Center utmärker sig på AI-integration, Microsoft-ekosystemet och lägre total ägandekostnad för Microsoftmiljöer." },
  { question: "Kan Dynamics 365 Contact Center integreras med befintliga system?", answer: "Ja, Contact Center integreras med Dynamics 365 Customer Service och Sales, Microsoft Teams, ERP-system via Power Automate, och externa system via öppna API:er. Det finns även färdiga kopplingar till populära CRM-system, e-handelssystem och ärendehanteringssystem. Integration med telefonibärare sker via Azure Communication Services eller befintliga SIP-trunkar." },
];

const D365ContactCenter = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactCenterPricing = [
    {
      title: "Contact Center",
      description: "Modern kontaktcenterlösning",
      price: "Från 1 051,40 kr",
      features: [
        "Omnichannel-stöd (telefon, chatt, e-post)",
        "AI-driven samtalsassistent",
        "Real-time analytics",
        "Intelligent routing",
        "Integration med Teams",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Dynamics 365 Contact Center – Priser & guide | d365.se"
        description="Dynamics 365 Contact Center från 1 051 kr/agent/mån. AI-agenter, routing och omnichannel. Oberoende vägledning inför val av Dynamics 365 och partner."
        canonicalPath="/d365contactcenter"
        keywords="Dynamics 365 Contact Center pris, contact center Microsoft, omnichannel kontaktcenter, virtuella agenter AI, intelligent routing, Genesys alternativ, Avaya alternativ Microsoft, kontaktcenter system Sverige, Teams kontaktcenter, contact center molntjänst"
        ogImage="https://d365.se/og-contact-center.png"
      />
      <FAQSchema faqs={contactCenterFaqs} />
      <ServiceSchema 
        name="Microsoft Dynamics 365 Contact Center – Omnichannel & AI-kontaktcenter"
        description="Molnbaserat contact center med omnichannel-stöd (telefon, chatt, e-post, SMS, sociala medier), AI-drivna virtuella agenter och intelligent routing. Licenspris från 1 051 kr per agent och månad. Implementationstid 2–12 månader. Oberoende vägledning inför val av Dynamics 365 och partner."
      />
      <BreadcrumbSchema items={contactCenterBreadcrumbs} />
      <Navbar />
      
      {/* Header */}
      <ProductHero
        icon={ContactCenterIcon}
        eyebrow="Dynamics 365 Contact Center"
        title="Contact Center."
        titleAccent="Omnichannel är inte plug-and-play. Partner-valet avgör projektet."
        subhead="Telefoni, chatt, routing och AI som faktiskt fungerar tillsammans kräver en partner som har gjort det förut — inte en som vill öva på er. Här jämför ni på det som spelar roll."
        primary={{ label: "Generera kravspecifikation", to: "/kravspecifikation-kundservice/", icon: FileText }}
        secondary={{
          label: "Jämför CC-partners",
          onClick: () => document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' }),
        }}
      />


      {/* Introduction Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Microsoft Dynamics 365 Contact Center
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              Nästa generations kontaktcenter
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Dynamics 365 Contact Center är en modern, AI-driven kontaktcenterlösning som samlar alla kundkommunikationskanaler i ett enhetligt gränssnitt. Med intelligent routing, realtidsanalys och sömlös integration med Microsoft Teams får ditt team verktyg för att leverera exceptionell service.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Lösningen inkluderar virtuella agenter som kan hantera enkla ärenden automatiskt, frigör mänskliga agenter för mer komplexa interaktioner, och ger chefer insyn i prestanda och kundnöjdhet i realtid.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Se Dynamics 365 Contact Center i aktion
            </h2>
            <VideoCard
              title="Dynamics 365 Contact Center"
              description="Modern och innovativ kontaktcenterlösning med Omnichannel, AI och automation."
              videoId="MYl0lN5_-L8"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Contact Center
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad är skillnaden mellan Contact Center och Customer Service?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 Contact Center är specifikt designat för högvolym-kontaktcenter med avancerade telefoni-funktioner, intelligent routing, virtuella agenter och real-time övervakning. Customer Service fokuserar mer på ärendehantering och kunskapsdatabaser. Contact Center kan användas tillsammans med Customer Service för en komplett lösning.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur fungerar virtuella agenter?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Virtuella agenter i Contact Center använder AI och naturlig språkförståelse för att automatiskt hantera vanliga kundförfrågningar via chatt eller telefon. De kan svara på frågor, guida kunder genom processer och vid behov eskalera till mänskliga agenter med full konversationshistorik. Detta minskar väntetider och frigör agenter för mer komplexa ärenden.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vilka kanaler stöds?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Contact Center stöder telefon (inkommande och utgående), chatt, e-post, SMS, sociala medier (Facebook, Twitter) och Microsoft Teams. Alla kanaler samlas i ett enhetligt gränssnitt så att agenter kan hantera alla interaktioner från samma plats och kunder kan byta kanal utan att förlora kontext.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur fungerar integration med Microsoft Teams?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Contact Center integreras djupt med Microsoft Teams, vilket gör det möjligt att hantera kundsamtal direkt i Teams-gränssnittet. Agenter kan enkelt konsultera kollegor eller experter via Teams under pågående kundsamtal, och övervakning och rapportering kan göras via Teams-kanaler.
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
              <img src={ContactCenterIcon} alt="Contact Center" className="h-12 w-12" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Licenspriser
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {contactCenterPricing.map((plan, index) => (
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
                    En typisk implementation av Contact Center tar <strong>3-6 månader</strong> beroende på kanaler och integrationer.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande telefoni:</strong> 2-3 månader</li>
                    <li>• <strong>Med chatt och e-post:</strong> 5-7 månader</li>
                    <li>• <strong>Full omnikanal med AI:</strong> 8-12 månader</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">💰 Kostnad</h3>
                  <p className="text-muted-foreground mb-4">
                    Implementationskostnaden beror på antal agenter, kanaler och AI-funktionalitet.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande:</strong> 250 000 - 500 000 kr</li>
                    <li>• <strong>Med fler kanaler:</strong> 500 000 - 900 000 kr</li>
                    <li>• <strong>Komplett med AI-bots:</strong> 900 000 - 2 000 000 kr</li>
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

      {/* Deep-dive articles */}
      <section className="py-12 sm:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">Fördjupningsartiklar</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">Utforska Dynamics 365 Contact Center på djupet — från AI-drivna voicebots och intelligent routing till compliance och conversational intelligence.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {CC_ARTICLES.map((article) => (
              <Link
                key={article.slug}
                to={`/kunskapscenter/${article.productSlug}/${article.slug}/`}
                className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/40 transition-all group"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-16 h-16 rounded object-contain bg-secondary/50 p-1 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {article.headerLabel || article.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <ApplicationPartners applicationFilter="Contact Center" pageSource="D365 Contact Center" />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-contact-center">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att modernisera ditt kontaktcenter?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Hitta din bransch och rätt partner med oss så hjälper vi dig bygga ett framtidssäkert kontaktcenter.
          </p>
          <Link to="/branscher/">
            <Button size="lg"
              className="bg-white text-contact-center hover:bg-white/90 text-base sm:text-lg h-14 sm:h-16 rounded-xl"
            >
                    Hitta din bransch och rätt partner
                  </Button>
                </Link>
        </div>
      </section>

      <RelatedPages pages={contactCenterRelatedPages} heading="Utforska vidare" />
      <Footer />
    </div>
  );
};

export default D365ContactCenter;
