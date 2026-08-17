import ProductIsvSection from "@/components/ProductIsvSection";
import ProductDeepDiveLink from "@/components/ProductDeepDiveLink";
import ProductHero from "@/components/ProductHero";
import StandardProductSections from "@/components/product/StandardProductSections";
import { PRODUCT_STANDARD_SECTIONS } from "@/data/productStandardSections";
import RelatedPages, { fieldServiceRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import ProductPartnerNewsSection from "@/components/ProductPartnerNewsSection";
import ContactFormDialog from "@/components/ContactFormDialog";
import ApplicationPartners from "@/components/ApplicationPartners";
import BuyerManual from "@/components/BuyerManual";
import CostBreakdown from "@/components/CostBreakdown";
import ComparisonQuickLinks from "@/components/ComparisonQuickLinks";
import ProductRoiCta from "@/components/ProductRoiCta";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import FieldServiceIcon from "@/assets/icons/FieldService.svg";
import { FS_ARTICLES } from "@/data/fsArticles";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { resolvePriceTokens } from "@/lib/productPriceFormat";

// Breadcrumb items
const fieldServiceBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kundservice", url: "https://d365.se/d365customerservice" },
  { name: "Dynamics 365 Field Service", url: "https://d365.se/d365fieldservice" },
];
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Field Service FAQs for schema – priser hämtas från product_prices via resolvePriceTokens
const fieldServiceFaqsRaw = [
  { question: "Vad kostar Dynamics 365 Field Service?", answer: "Dynamics 365 Field Service kostar {{price:field-service:exact}} (Microsofts officiella prislista). Priset inkluderar schemaläggning, mobilapp och IoT-grundfunktioner. Implementationskostnaden varierar från 200 000 kr för en enklare driftsättning upp till 1 800 000 kr för en fullständig IoT-integration med Resource Scheduling Optimization." },
  { question: "Hur fungerar intelligent schemaläggning i Field Service?", answer: "Resource Scheduling Optimization (RSO) analyserar automatiskt teknikernas kompetens, geografisk position, restid, prioritet och SLA-krav för att skapa optimala scheman. Systemet kan omplanera i realtid vid akuta arbetsorder eller förseningar och maximerar antalet slutförda besök per dag – typiskt 15–25% fler serviceuppdrag." },
  { question: "Vad innebär IoT-integration i Field Service?", answer: "Med IoT Connected Field Service kan sensorer på maskiner och utrustning automatiskt rapportera status och skapa arbetsorder när något avviker. Detta möjliggör prediktivt underhåll – problem identifieras och åtgärdas innan de orsakar driftstopp. Resultatet är lägre underhållskostnader och nöjdare kunder." },
  { question: "Hur fungerar mobilappen för fälttekniker?", answer: "Field Service Mobile-appen ger tekniker tillgång till arbetsorder, kundinformation, utrustningshistorik, reservdelslagerstatus och kunskapsartiklar – även offline utan internetuppkoppling. De kan uppdatera arbetsstatus, ta bilder, inhämta kundsignaturer och registrera tid och material direkt i appen." },
  { question: "Kan Dynamics 365 Field Service integreras med Customer Service?", answer: "Ja, Field Service integreras sömlöst med Dynamics 365 Customer Service. Ärenden som kräver platsbesök kan eskaleras till arbetsorder med ett klick, och kundserviceagenter ser schemalagda och utförda fältbesök i realtid. Copilot AI hjälper agenter att skapa optimala arbetsorder baserat på tillgängliga tekniker och SLA." },
  { question: "Hur lång tid tar en Field Service-implementation?", answer: "En grundläggande implementation med 10–20 tekniker tar typiskt 2–3 månader. Med schemaoptimering (RSO) 5–7 månader. En komplett lösning med IoT-integration och prediktivt underhåll tar 8–12 månader. Implementationstiden beror på antal tekniker, geografisk spridning, ERP-integrationer och specifika anpassningsbehov." },
  { question: "Vilket underhållshanteringssystem är bäst – Dynamics 365 Field Service eller IFS/SAP?", answer: "Dynamics 365 Field Service är optimalt för organisationer som redan använder Microsoft 365 och Dynamics 365. Det ger inbyggd integration med Teams, Outlook och Power BI. IFS är starkt inom tillverkning och försvar, SAP PM för tunga processindustrier. Dynamics 365 Field Service utmärker sig på AI-driven schemaläggning, mobil användarupplevelse och låg total ägandekostnad i Microsoft-miljöer." },
  { question: "Vilka branscher passar Dynamics 365 Field Service för?", answer: "Field Service passar särskilt väl för: serviceföretag med fälttekniker (hissar, ventilation, säkerhet), tillverkare med eftermarknadstjänster, energi- och nätbolag, medicinsk utrustning och life science, telekom och IT-infrastruktur samt fastighetsförvaltning. Alla branscher som behöver strukturerad schemaläggning, SLA-uppföljning och mobila fälttekniker gynnas av lösningen." },
];
const fieldServiceFaqs = fieldServiceFaqsRaw.map((f) => ({ ...f, answer: resolvePriceTokens(f.answer) }));

const D365FieldService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fieldServicePricing = [
    {
      title: "Field Service",
      description: "Fältservicehantering",
      price: "1 003,70 kr",
      features: [
        "Schemaläggning och resursoptimering",
        "Mobil arbetsorder-app",
        "IoT-integration",
        "Lagerhantering",
        "Kundsignatur och fakturering",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Field Service – fältservice, schemaläggning & IoT"
        description={resolvePriceTokens("System för fältservice och underhåll: intelligent schemaläggning, IoT-baserat prediktivt underhåll och mobilapp. Pris från {{price:field-service:short}}.")}
        canonicalPath="/d365fieldservice"
        keywords="Dynamics 365 Field Service pris, fältservice system, underhållshantering Microsoft, Field Service mobilapp, IoT fältservice, schemaläggning fälttekniker, prediktivt underhåll, Microsoft Field Service Sverige, fältservicehantering, Resource Scheduling Optimization"
        ogImage="https://d365.se/og-field-service.png"
      />
      <FAQSchema faqs={fieldServiceFaqs} />
      <ServiceSchema 
        name="Microsoft Dynamics 365 Field Service – Fältservice & Underhållshantering"
        description={resolvePriceTokens("Molnbaserat fältservicesystem med intelligent schemaläggning (RSO), IoT-integration för prediktivt underhåll och mobilapp för fälttekniker. Licenspris från {{price:field-service}}. Implementationstid 2–12 månader beroende på komplexitet. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner.")}
      />
      <BreadcrumbSchema items={fieldServiceBreadcrumbs} />
      <Navbar />
      
      {/* Header */}
      <ProductHero
        icon={FieldServiceIcon}
        eyebrow="Dynamics 365 Field Service"
        title="Dynamics 365 Field Service – planering, mobilitet och integration med ERP"
        subhead="Microsoft levererar plattformen och mobilappen. Partnern bygger schemaläggningsreglerna, kompetensmatchningen och IoT-integrationerna som kan höja andelen lösta ärenden vid första besök och sänker körtiden. Det är där fältprojekt vinns. Här jämför ni partners som faktiskt levererat Field Service i er bransch."
        primary={{
          label: "Jämför FS-partners",
          onClick: () => document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' }),
        }}
        secondary={{ label: "Generera en kravspecifikation", to: "/kravspecifikation-kundservice/", icon: FileText }}
        tertiary={{
          label: "Gör en estimerad TCO/ROI-kalkyl",
          to: "/d365fieldservice/roi-kalkylator/",
        }}
      />

      <ShortAnswer title="Vad är Dynamics 365 Field Service">
        <p>
          Dynamics 365 Field Service är Microsofts kompletta lösning för serviceorganisationer som har tekniker, montörer eller installatörer ute hos kund – från VVS, fastighet och energi till tillverkningsindustri, medicinteknik och telekom.
        </p>
        <p>
          Plattformen täcker hela kedjan: arbetsorderhantering, AI-driven schemaläggning och dispatch som matchar rätt tekniker med rätt kompetens till rätt jobb, optimerade körrutter, mobilapp för fält med offline-stöd, digitala checklistor och bildbevis, samt fjärrassistans via Dynamics 365 Remote Assist och HoloLens där en senior tekniker kan guida en juniorkollega i realtid.
        </p>
        <p>
          Med inbyggt IoT-stöd kan uppkopplade maskiner själva larma och boka in förebyggande service innan de havererar, och Copilot samt autonoma fältagenter sammanfattar ärenden, föreslår reservdelar och förbereder rapporter automatiskt. Field Service är djupt integrerat med Dynamics 365 Customer Service, Sales, Business Central och Finance & Supply Chain Management, vilket gör att fakturering, lager och kundhistorik hänger ihop utan dubbelregistrering.
        </p>
        <p>
          Resultatet är högre andel ärenden lösta vid första besöket, mindre körtid, lägre kostnad per ärende och en kundupplevelse som matchar det allra bästa i branschen – förutsatt att partnern bygger schemaläggningsregler, kompetensmatris och integrationer rätt från start.
        </p>
      </ShortAnswer>


      {/* Introduction Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-background">

      <StandardProductSections productName="Field Service" data={PRODUCT_STANDARD_SECTIONS["field-service"]} />

        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Microsoft Dynamics 365 Field Service
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              Intelligent fältservicehantering
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Dynamics 365 Field Service hjälper organisationer att leverera proaktiv service på plats genom intelligent schemaläggning, resursoptimering och mobila verktyg för fälttekniker.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Med IoT-integration kan du övergå från reaktiv till prediktiv service – identifiera och lösa problem innan de uppstår. Fälttekniker får all information de behöver i mobilen, inklusive arbetsorder, kundhistorik och kunskapsartiklar.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Se Dynamics 365 Field Service i aktion
            </h2>
            <VideoCard
              title="Dynamics 365 Field Service"
              description="Optimera fältservice med intelligent schemaläggning och mobilitet."
              videoId="OujvbnyGqDY"
              uploadDate="2024-08-09"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Field Service
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur fungerar intelligent schemaläggning?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Resource Scheduling Optimization (RSO) analyserar automatiskt faktorer som teknikernas kompetens, geografisk position, restid, prioritet och SLA-krav för att skapa optimala scheman. Systemet kan omplanera i realtid vid förändringar och maximerar antalet slutförda arbetsorder per dag.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad innebär IoT-integration?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Med IoT Connected Field Service kan sensorer på utrustning automatiskt rapportera status och skapa arbetsorder när något avviker från det normala. Detta möjliggör prediktivt underhåll – du kan åtgärda problem innan de orsakar driftstopp, vilket sparar tid och pengar för både dig och kunden.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur fungerar mobilappen för fälttekniker?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Field Service Mobile-appen ger tekniker tillgång till arbetsorder, kundinformation, utrustningshistorik, reservdelslagerstatus och kunskapsartiklar – även offline. De kan uppdatera arbetsstatus, ta bilder, inhämta kundsignaturer och registrera tid och material direkt i appen.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Kan Field Service integreras med Customer Service?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Ja, Dynamics 365 Field Service integreras sömlöst med Customer Service. Ärenden som kräver platsbesök kan enkelt eskaleras till arbetsorder, och kundserviceagenter har full insyn i schemalagda och utförda fältbesök. Detta ger en komplett bild av kundinteraktioner oavsett kanal.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-8 sm:py-12 md:py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={FieldServiceIcon} alt="Field Service" className="h-12 w-12" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Licenspriser
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {fieldServicePricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>

      {/* Implementation Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Hur lång tid tar en implementation och vad ligger kostnaden på?
            </h2>
            <div className="bg-card rounded p-6 sm:p-8 border border-border ">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">⏱️ Tidsåtgång</h3>
                  <p className="text-muted-foreground mb-4">
                    En typisk implementation av Field Service tar <strong>3-5 månader</strong> beroende på antal tekniker och mobila krav.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande (10-20 tekniker):</strong> 2-3 månader</li>
                    <li>• <strong>Med schemaoptimering:</strong> 5-7 månader</li>
                    <li>• <strong>Komplett med IoT:</strong> 8-12 månader</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">💰 Kostnad</h3>
                  <p className="text-muted-foreground mb-4">
                    Implementationskostnaden beror på antal tekniker, mobilapp-anpassningar och IoT-integrationer.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande:</strong> 200 000 - 400 000 kr</li>
                    <li>• <strong>Med schemaoptimering:</strong> 400 000 - 800 000 kr</li>
                    <li>• <strong>Komplett med IoT:</strong> 800 000 - 1 800 000 kr</li>
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
      <BuyerManual product="field-service" />
      <CostBreakdown product="field-service" />
      <ComparisonQuickLinks productKeys="field-service" />

      <ProductRoiCta productKey="field-service" />

      <ProductDeepDiveLink product="Dynamics 365 Field Service" label="Field Service" />

      <ProductPartnerNewsSection productArea="crm-service" productLabel="Field Service" />

      <ApplicationPartners applicationFilter="Field Service" pageSource="D365 Field Service" />

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-field-service">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att optimera din fältservice?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Hitta din bransch och rätt partner med oss så hjälper vi dig effektivisera din fältserviceverksamhet.
          </p>
          <Link to="/branscher/">
            <Button size="lg"
              className="bg-white text-field-service hover:bg-white/90 text-base sm:text-lg h-14 sm:h-16 rounded"
            >
                    Hitta din bransch och rätt partner
                  </Button>
                </Link>
        </div>
      </section>

      <RelatedPages pages={fieldServiceRelatedPages} heading="Utforska vidare" />
      <ProductIsvSection product="Field Service" />

      <Footer />
    </div>
  );
};

export default D365FieldService;
