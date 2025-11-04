import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import ContactCenterIcon from "@/assets/icons/ContactCenter.svg";
import FieldServiceIcon from "@/assets/icons/FieldService.svg";

const CRM = () => {
  const ceVideos = [
    {
      title: "Dynamics 365 Sales",
      description: "Maximera dina försäljningsresultat med intelligent CRM",
      videoId: "TMdY77b1TTg",
    },
    {
      title: "Customer Insights Automation",
      description: "Skapa personliga kundresor med Microsoft Dynamics 365 Customer Insights",
      videoId: "41lG3EHo4Lw",
    },
    {
      title: "Customer Service och Support",
      description: "Leverera exceptionell kundservice med AI-drivna insikter",
      videoId: "ewtCAkM55Fc",
    },
    {
      title: "Dynamics 365 Contact Center",
      description: "Modern och innovativ kontaktcenterlösning med Omnichannel, AI och automation",
      videoId: "MYl0lN5_-L8",
    },
    {
      title: "Dynamics 365 Field Service",
      description: "Optimera fältservice med intelligent schemaläggning och mobilitet",
      videoId: "OujvbnyGqDY",
    },
    {
      title: "Dynamics 365 Project Operations",
      description: "Hantera projekt effektivt från försäljning till leverans",
      videoId: "U4fj051TZ90",
    },
  ];

  const salesPricing = [
    {
      title: "Sales Professional",
      description: "För försäljningsteam",
      price: "700 kr",
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
      price: "1 000 kr",
      features: [
        "Allt i Professional",
        "Förutsägande insikter med AI",
        "Avancerad analys",
        "Anpassningsbar automatisering",
        "LinkedIn Sales Navigator",
      ],
    },
    {
      title: "Sales Premium",
      description: "Premium försäljning",
      price: "1 500 kr",
      features: [
        "Allt i Enterprise",
        "Conversation Intelligence",
        "Samtalsinspelning & analys",
        "Avancerad försäljningsanalys",
        "Försäljningsplanering",
      ],
    },
  ];

  const servicePricing = [
    {
      title: "Customer Service Professional",
      description: "Grundläggande kundservice",
      price: "500 kr",
      features: [
        "Ärendehantering",
        "Kunskapsdatabas",
        "Service Level Agreements (SLA)",
        "E-post och chatt",
        "Självbetjäningsportal",
      ],
    },
    {
      title: "Customer Service Enterprise",
      description: "Avancerad kundservice",
      price: "950 kr",
      features: [
        "Allt i Professional",
        "Omnichannel routing",
        "AI-drivna insikter",
        "Resursstyrning",
        "Avancerad rapportering",
      ],
    },
  ];

  const customerInsightsPricing = [
    {
      title: "Customer Insights",
      description: "Marknadsföringsautomation",
      price: "15 000 kr/månad + kontakter",
      features: [
        "E-postmarknadsföring",
        "Segmentering & målgrupper",
        "Leadgenerering",
        "Event management",
        "Resebyggare (customer journey)",
      ],
    },
    {
      title: "Customer Insights Attach",
      description: "Tilläggslicens för befintliga användare",
      price: "7 500 kr/månad + kontakter",
      features: [
        "Alla Customer Insights-funktioner",
        "För användare med annan Dynamics 365-licens",
        "E-postmarknadsföring",
        "Segmentering & målgrupper",
        "Leadgenerering och event management",
      ],
    },
  ];

  const contactCenterPricing = [
    {
      title: "Contact Center",
      description: "Modern kontaktcenterlösning",
      price: "Från 1 000 kr",
      features: [
        "Omnichannel-stöd (telefon, chatt, e-post)",
        "AI-driven samtalsassistent",
        "Real-time analytics",
        "Intelligent routing",
        "Integration med Teams",
      ],
    },
  ];

  const fieldServicePricing = [
    {
      title: "Field Service",
      description: "Fältservicehantering",
      price: "Från 950 kr",
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
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" 
            alt="Team collaboration and CRM" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <img src={SalesIcon} alt="Sales" className="h-10 w-10" />
                <img src={MarketingIcon} alt="Customer Insights" className="h-10 w-10" />
                <img src={CustomerServiceIcon} alt="Customer Service" className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                CRM (Customer Engagement)
              </h1>
              <p className="text-xl md:text-2xl text-white/95 mb-6">
                Microsoft Dynamics 365 Sales, Customer Insights, Service
              </p>
              
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link to="/kontakt">Boka gratis rådgivning</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Dynamics 365 Customer Engagement – För smartare kundrelationer
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Skapa starkare kundupplevelser och effektivare service – allt i en integrerad plattform.
            </p>
            <p className="text-lg text-muted-foreground">
              Microsoft Dynamics 365 Customer Engagement är en samling intelligenta affärsapplikationer som hjälper företag att bygga långsiktiga kundrelationer och leverera förstklassig service. Lösningen kombinerar CRM och kundtjänst i en modern, molnbaserad plattform.
            </p>
          </div>
        </div>
      </section>

      {/* CRM Videos Section */}
      <section id="videos" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Videoguider
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upptäck hur Dynamics 365 CRM kan transformera din kundhantering
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ceVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>

      {/* Sales Pricing */}
      <section id="pricing" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={SalesIcon} alt="Sales" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Sales
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {salesPricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Insights Pricing */}
      <section id="customer-insights-pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={MarketingIcon} alt="Customer Insights" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Customer Insights
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Baserat på kontaktvolym
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {customerInsightsPricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Service Pricing */}
      <section id="service-pricing" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={CustomerServiceIcon} alt="Customer Service" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Customer Service
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {servicePricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Center Pricing */}
      <section id="contact-center-pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={ContactCenterIcon} alt="Contact Center" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Contact Center
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {contactCenterPricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Field Service Pricing */}
      <section id="field-service-pricing" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={FieldServiceIcon} alt="Field Service" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Field Service
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {fieldServicePricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Project Cost Section */}
      <section id="project-cost" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Vad kostar ett CRM-projekt?
              </h2>
              <p className="text-lg text-muted-foreground">
                Ungefärliga kostnader för implementering och drift av Dynamics 365 CRM
              </p>
            </div>
            
            <div className="grid gap-8">
              {/* Implementation Costs */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">Implementeringskostnader</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">En modul (t.ex. Sales)</p>
                      <p className="text-sm text-muted-foreground">10-30 användare, standardfunktioner</p>
                    </div>
                    <p className="text-primary font-bold">100-250k kr</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">Flera moduler</p>
                      <p className="text-sm text-muted-foreground">Sales + Customer Insights + Service, 30-100 användare</p>
                    </div>
                    <p className="text-primary font-bold">400-800k kr</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3">
                    <div>
                      <p className="font-semibold text-card-foreground">Komplett lösning</p>
                      <p className="text-sm text-muted-foreground">Alla moduler, 100+ användare, integrationer</p>
                    </div>
                    <p className="text-primary font-bold">800k-2M kr</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Inkluderar:</strong> Implementering, konfiguration, datamigration, utbildning och projektledning
                  </p>
                </div>
              </div>

              {/* Ongoing Costs */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">Löpande kostnader</h3>
                
                <div className="space-y-4">
                  <div className="pb-3 border-b border-border">
                    <p className="font-semibold text-card-foreground mb-2">Licensavgifter</p>
                    <p className="text-sm text-muted-foreground mb-2">500-1 500 kr/användare/månad</p>
                    <p className="text-xs text-muted-foreground">Beroende på modul och funktioner</p>
                  </div>
                  
                  <div className="pb-3 border-b border-border">
                    <p className="font-semibold text-card-foreground mb-2">Support & underhåll</p>
                    <p className="text-sm text-muted-foreground mb-2">5-15% av licenskostnaden</p>
                    <p className="text-xs text-muted-foreground">Teknisk support och systemuppdateringar</p>
                  </div>
                  
                  <div className="pb-3 border-b border-border">
                    <p className="font-semibold text-card-foreground mb-2">Anpassningar & tillägg</p>
                    <p className="text-sm text-muted-foreground mb-2">Efter behov</p>
                    <p className="text-xs text-muted-foreground">Nya funktioner och integrationer</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-card-foreground mb-2">Kontinuerlig utbildning</p>
                    <p className="text-sm text-muted-foreground mb-2">Efter behov</p>
                    <p className="text-xs text-muted-foreground">För nya användare och funktioner</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tips:</strong> CRM-projekt har ofta kortare implementationstid (2-6 månader) och snabbare ROI än ERP-projekt
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Redo att förbättra din kundhantering?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss för en kostnadsfri konsultation
            </p>
            <Button asChild className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0" size="lg">
              <Link to="/kontakt">Boka Gratis Konsultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CRM;
