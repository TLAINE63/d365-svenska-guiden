import ProductHero from "@/components/ProductHero";
import RelatedPages, { marketingRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import ApplicationPartners from "@/components/ApplicationPartners";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import { CI_ARTICLES } from "@/data/ciArticles";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const marketingBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Marknad & Sälj", url: "https://d365.se/d365sales" },
  { name: "Customer Insights (Marketing)", url: "https://d365.se/d365marketing" },
];
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Customer Insights FAQs for schema
const customerInsightsFaqs = [
  { question: "Vad kostar Dynamics 365 Customer Insights (Marketing)?", answer: "Dynamics 365 Customer Insights kostar 16 249,60 kr per månad för grundlicensen (baserat på kontaktvolym, inte per användare). För företag med minst 10 befintliga Dynamics 365-licenser finns Attach-licensen för 9 558,60 kr/mån. Implementationskostnaden varierar från 150 000 kr för en grundläggande setup upp till 1 200 000 kr för en komplett lösning med integrationer." },
  { question: "Vad är skillnaden mellan Customer Insights och det gamla Dynamics 365 Marketing?", answer: "Dynamics 365 Customer Insights är nästa generation av Dynamics 365 Marketing och ersätter det helt. Customer Insights kombinerar marknadsföringsautomation (tidigare 'Journeys'-modulen) med avancerad kunddata-analys och AI-drivna insikter. Namnbytet skedde 2023. Befintliga Marketing-kunder migreras automatiskt till Customer Insights." },
  { question: "Dynamics 365 Customer Insights vs HubSpot – vilket ska jag välja?", answer: "Dynamics 365 Customer Insights är optimalt för företag som redan använder Microsoft 365 och Dynamics 365 Sales/Customer Service, eftersom det ger djup inbyggd integration och en gemensam dataplattform. HubSpot är starkare för SMB-marknaden och har en snabbare onboarding. Customer Insights utmärker sig på AI-driven personalisering, komplex segmentering och integration med ERP-data. För Microsoftmiljöer ger Customer Insights lägre total ägandekostnad." },
  { question: "Hur fungerar kundresor i Customer Insights?", answer: "Kundresor (Customer Journeys) i Customer Insights är visuella flöden som definierar hur och när du kommunicerar med kunder baserat på deras beteende och attribut. Du kan skapa triggers som startar resan (t.ex. webbformulär, e-postöppning, köphändelse), definiera villkor och grenar, och automatiskt skicka e-post, SMS eller push-notiser vid rätt tidpunkt. Copilot AI kan föreslå optimal timing och kanalval." },
  { question: "Kan Customer Insights integreras med Dynamics 365 Sales?", answer: "Ja, Customer Insights har inbyggd integration med Dynamics 365 Sales. Leads som genereras av marknadsföringskampanjer kan automatiskt överföras till säljteamet med full historik och lead scoring. Säljare ser hela kundresan och alla marknadsinteraktioner i Sales-appen. Gemensam kunddata eliminerar gapet mellan marknad och sälj." },
  { question: "Vilka kanaler stöder Customer Insights för kampanjer?", answer: "Customer Insights stöder e-post (med avancerad personalisering och A/B-testning), SMS, push-notiser, LinkedIn-annonser, webbformulär och landningssidor, event management för fysiska och digitala evenemang, samt realtids-triggers baserade på kundbeteende på webben eller i appen." },
  { question: "Hur länge tar en Customer Insights-implementation?", answer: "En grundläggande setup med e-postmarknadsföring tar 6–8 veckor. Med kundresor och automatisering 4–6 månader. En komplett implementation med dataintegrationer, avancerad segmentering och CDP (Customer Data Platform) tar 6–10 månader. Implementationstiden beror på antalet datakällor, befintliga system och kampanjkomplexitet." },
  { question: "Vad är Customer Insights Data (CDP) och behöver jag det?", answer: "Customer Insights Data är den Customer Data Platform-del av lösningen som samlar och förenar kunddata från alla källor (CRM, ERP, webbplats, butik m.fl.) till en enhetlig kundprofil. Det är särskilt värdefullt för B2C-företag med stora kundvolymer och komplexa datakällor. B2B-företag som primärt arbetar med Dynamics 365 Sales behöver ofta bara Journeys-modulen för marknadsföringsautomation." },
];

const D365Marketing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const customerInsightsPricing = [
    {
      title: "Customer Insights",
      description: "Marknadsföringsautomation",
      price: "16 249,60 kr",
      features: [
        "E-postmarknadsföring",
        "Segmentering & målgrupper",
        "Triggers",
        "Leadgenerering",
        "Event management",
        "Kundresor",
      ],
    },
    {
      title: "Customer Insights Attach",
      description: "Tilläggslicens för befintliga användare",
      price: "9 558,60 kr",
      features: [
        "Alla Customer Insights-funktioner",
        "Kunder med minst 10 Dynamics 365-användarlicenser",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Dynamics 365 Marketing – Priser & HubSpot-alternativ | d365.se"
        description="Customer Insights (Marketing) från 9 559 kr/mån. AI-kundresor, lead scoring och CDP. Köparsidig vägledning inför val av Dynamics 365 och partner."
        canonicalPath="/d365marketing"
        keywords="Dynamics 365 Customer Insights pris, marketing automation Microsoft, HubSpot alternativ, Marketo alternativ Sverige, Dynamics 365 Marketing pris, kundresor automation, CDP customer data platform, lead scoring CRM, marknadsföringsautomation Microsoft, Customer Insights Journeys"
        ogImage="https://d365.se/og-marketing.png"
      />
      <FAQSchema faqs={customerInsightsFaqs} />
      <ServiceSchema 
        name="Microsoft Dynamics 365 Customer Insights – Marketing Automation & CDP"
        description="Molnbaserad marknadsföringsautomation med AI-drivna kundresor, Customer Data Platform (CDP), lead scoring och omnikanalskampanjer. Grundlicens från 9 559 kr/mån (Attach). Implementationstid 6 veckor till 10 månader beroende på komplexitet. Köparsidig vägledning inför val av Dynamics 365 och partner."
      />
      <BreadcrumbSchema items={marketingBreadcrumbs} />
      <Navbar />
      
      {/* Header */}
      <ProductHero
        icon={MarketingIcon}
        eyebrow="Dynamics 365 Customer Insights"
        title="Customer Insights — Journeys & Data."
        titleAccent="Två samverkande moduler. Välj partner med omsorg."
        subhead="Microsoft levererar plattformen och AI-segmenteringen. Partnern hjälper er att skapa datamodellen, integrationerna och de poängregler som faktiskt avgör om leads får rätt mejl vid rätt tid. Det är där projekt med marketing automation vinns eller förloras. Här jämför ni partners som faktiskt levererat den här typen av flöden i er typ av verksamhet."
        primary={{ label: "Generera kravspecifikation", to: "/kravspecifikation-marketing/", icon: FileText }}
        secondary={{
          label: "Jämför CI-partners",
          onClick: () => document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' }),
        }}
      />


      {/* Introduction Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Microsoft Dynamics 365 Customer Insights
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              Marknadsföringsautomation på nästa nivå
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Dynamics 365 Customer Insights (tidigare Marketing) är en kraftfull plattform för marknadsföringsautomation som hjälper dig att skapa personliga kundresor, generera kvalificerade leads och mäta kampanjresultat i realtid.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Med inbyggd AI och dataanalys kan du segmentera din kundbas, skapa riktade kampanjer och följa upp varje interaktion för att maximera konvertering och kundengagemang.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Se Dynamics 365 Customer Insights i aktion
            </h2>
            <VideoCard
              title="Dynamics 365 Customer Insights"
              description="Skapa personliga kundresor med Microsoft Dynamics 365 Customer Insights / Marketing Automation."
              videoId="41lG3EHo4Lw"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Customer Insights
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad är skillnaden mellan Customer Insights och Dynamics 365 Marketing?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 Customer Insights är den nya generationens marknadsföringsplattform som ersätter och utökar det tidigare Dynamics 365 Marketing. Den kombinerar marknadsföringsautomation med avancerad kunddata-analys och AI-drivna insikter för att ge en komplett bild av kundens resa.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur fungerar kundresor i Customer Insights?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Kundresor i Customer Insights är visuella flöden som definierar hur och när du kommunicerar med kunder baserat på deras beteende och attribut. Du kan skapa triggers som startar resan (t.ex. webbformulär), definiera villkor och grenar, och automatiskt skicka e-post, SMS eller push-notiser vid rätt tidpunkt.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Kan Customer Insights integreras med Dynamics 365 Sales?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Ja, Customer Insights har inbyggd integration med Dynamics 365 Sales. Leads som genereras genom marknadsföringskampanjer kan automatiskt överföras till säljteamet med full historik och scoring. Säljare kan se hela kundresan och alla marknadsinteraktioner direkt i Sales-appen.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad är skillnaden på licenserna?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Customer Insights-licensen är baserad på kontaktvolym snarare än användare. Grundlicensen ger tillgång till alla funktioner för ett visst antal kontakter. "Attach"-licensen är tillgänglig för kunder som redan har minst 10 Dynamics 365-användarlicenser och ger rabatterat pris.
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
              <img src={MarketingIcon} alt="Marketing" className="h-12 w-12" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Licenspriser
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Baserat på kontaktvolym
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {customerInsightsPricing.map((plan, index) => (
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
                    En typisk implementation av Customer Insights tar <strong>2-4 månader</strong> beroende på komplexitet och datakällor.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande setup:</strong> 6-8 veckor</li>
                    <li>• <strong>Med kundresor och automatisering:</strong> 4-6 månader</li>
                    <li>• <strong>Komplett implementation:</strong> 6-10 månader</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">💰 Kostnad</h3>
                  <p className="text-muted-foreground mb-4">
                    Implementationskostnaden beror på antalet datakällor, segmenteringsbehov och kampanjkomplexitet.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande:</strong> 150 000 - 300 000 kr</li>
                    <li>• <strong>Med automatisering:</strong> 300 000 - 600 000 kr</li>
                    <li>• <strong>Komplett med integrationer:</strong> 600 000 - 1 200 000 kr</li>
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
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">Utforska Dynamics 365 Customer Insights på djupet — från enhetliga kundprofiler och AI-segmentering till journey automation och GDPR-compliance.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {CI_ARTICLES.map((article) => (
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
      <ApplicationPartners applicationFilter="Customer Insights (Marketing)" pageSource="D365 Marketing" />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-marketing">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att revolutionera din marknadsföring?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Hitta din bransch och rätt partner med oss så hjälper vi dig skapa personliga kundresor som konverterar.
          </p>
          <Link to="/branscher/">
            <Button size="lg"
              className="bg-white text-marketing hover:bg-white/90 text-base sm:text-lg h-14 sm:h-16 rounded-xl"
            >
                    Hitta din bransch och rätt partner
                  </Button>
                </Link>
        </div>
      </section>

      <RelatedPages pages={marketingRelatedPages} heading="Utforska vidare" />
      <Footer />
    </div>
  );
};

export default D365Marketing;
