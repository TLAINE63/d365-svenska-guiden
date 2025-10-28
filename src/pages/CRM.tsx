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
      title: "Marketing Automation",
      description: "Skapa personliga kundresor med Microsoft Dynamics 365 Marketing",
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

  const marketingPricing = [
    {
      title: "Marketing",
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
      title: "Marketing Attach",
      description: "Tilläggslicens för befintliga användare",
      price: "7 500 kr/månad + kontakter",
      features: [
        "Alla Marketing-funktioner",
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
      <header className="bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(198,80%,45%)] to-[hsl(var(--accent))] text-primary-foreground relative overflow-hidden mt-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6TTAgMTZjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMlMwIDIyLjYyNyAwIDE2em0zNiAzNmMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyek0wIDUyYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTJTMCA1OC42MjcgMCA1MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center items-center gap-4 mb-6">
              <img src={SalesIcon} alt="Sales" className="h-16 w-16" />
              <img src={MarketingIcon} alt="Marketing" className="h-16 w-16" />
              <img src={CustomerServiceIcon} alt="Customer Service" className="h-16 w-16" />
              <img src={ContactCenterIcon} alt="Contact Center" className="h-16 w-16" />
              <img src={FieldServiceIcon} alt="Field Service" className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              CRM (Customer Engagement)
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Microsoft Dynamics 365 Sales, Marketing, Customer Service, Contact Center, Field Service
            </p>
          </div>
        </div>
      </header>

      {/* CRM Videos Section */}
      <section className="py-20 bg-background">
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
      <section id="sales-pricing" className="py-20 bg-secondary/50">
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

      {/* Marketing Pricing */}
      <section id="marketing-pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={MarketingIcon} alt="Marketing" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Marketing
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Baserat på kontaktvolym
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {marketingPricing.map((plan, index) => (
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
            <Button className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0" size="lg">
              Boka Gratis Konsultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CRM;
