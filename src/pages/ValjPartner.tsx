import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, ArrowRight, Calendar, MessageSquare, Mail, Building2, Award, Target, Shield } from "lucide-react";
import thomasLainePhoto from "@/assets/thomas-laine.jpg";
import PartnerGuideDialog from "@/components/PartnerGuideDialog";

export interface Partner {
  name: string;
  logo: string;
  description: string;
  applications: string[];
  industries: string[];
  companySize: string[];
}

const partners: Partner[] = [
  {
    name: "Exempelpartner 1",
    logo: "https://via.placeholder.com/150x60?text=Partner+1",
    description: "En ledande Dynamics 365-partner med fokus på tillverkningsindustrin. Över 15 års erfarenhet av ERP-implementationer.",
    applications: ["Business Central", "Finance & SCM"],
    industries: ["Tillverkning", "Distribution"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Exempelpartner 2",
    logo: "https://via.placeholder.com/150x60?text=Partner+2",
    description: "Specialister på CRM-lösningar med stark kompetens inom försäljning och kundservice. Certifierade Microsoft Gold-partner.",
    applications: ["Sales", "Customer Service"],
    industries: ["Tjänsteföretag", "Retail"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Exempelpartner 3",
    logo: "https://via.placeholder.com/150x60?text=Partner+3",
    description: "Helhetsleverantör med bred kompetens inom hela Dynamics 365-portföljen. Erfarna projektledare och konsulter.",
    applications: ["Business Central", "Sales", "Marketing"],
    industries: ["Alla branscher"],
    companySize: ["Små", "Medelstora", "Stora"]
  },
  {
    name: "Exempelpartner 4",
    logo: "https://via.placeholder.com/150x60?text=Partner+4",
    description: "Nischad partner för offentlig sektor med djup kunskap om upphandlingsprocesser och regelverk.",
    applications: ["Finance & SCM", "Customer Service"],
    industries: ["Offentlig sektor"],
    companySize: ["Stora"]
  },
  {
    name: "Exempelpartner 5",
    logo: "https://via.placeholder.com/150x60?text=Partner+5",
    description: "Experter på Field Service och fältserviceoptimering. Stark mobilkompetens och IoT-integrationer.",
    applications: ["Field Service", "Customer Service"],
    industries: ["Fastighet", "Energi", "Underhåll"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Exempelpartner 6",
    logo: "https://via.placeholder.com/150x60?text=Partner+6",
    description: "Startup-fokuserad partner med snabba implementationer och flexibla prismodeller för växande företag.",
    applications: ["Business Central", "Sales"],
    industries: ["Tech", "Startup"],
    companySize: ["Små"]
  },
  {
    name: "Exempelpartner 7",
    logo: "https://via.placeholder.com/150x60?text=Partner+7",
    description: "Internationell partner med närvaro i Norden, Europa och USA. Erfarenhet av globala utrullningar.",
    applications: ["Finance & SCM", "Business Central"],
    industries: ["Tillverkning", "Logistik"],
    companySize: ["Stora"]
  },
  {
    name: "Exempelpartner 8",
    logo: "https://via.placeholder.com/150x60?text=Partner+8",
    description: "Marketing Automation-specialister med fokus på kundresor och leadgenerering i Dynamics 365.",
    applications: ["Marketing", "Customer Insights"],
    industries: ["B2B", "E-handel"],
    companySize: ["Medelstora"]
  },
  {
    name: "Exempelpartner 9",
    logo: "https://via.placeholder.com/150x60?text=Partner+9",
    description: "Partner med stark kompetens inom integration och anpassningar. Utvecklar egna tilläggslösningar.",
    applications: ["Business Central", "Finance & SCM"],
    industries: ["Alla branscher"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Exempelpartner 10",
    logo: "https://via.placeholder.com/150x60?text=Partner+10",
    description: "Fokus på detaljhandel och e-handel med Dynamics 365 Commerce och integrerade lösningar.",
    applications: ["Business Central", "Commerce"],
    industries: ["Retail", "E-handel"],
    companySize: ["Medelstora"]
  },
  {
    name: "Exempelpartner 11",
    logo: "https://via.placeholder.com/150x60?text=Partner+11",
    description: "Konsultbolag med bas i Stockholm och kontor i hela Norden. Stark projektledningskompetens.",
    applications: ["Finance & SCM", "Sales"],
    industries: ["Tillverkning", "Distribution"],
    companySize: ["Stora"]
  },
  {
    name: "Exempelpartner 12",
    logo: "https://via.placeholder.com/150x60?text=Partner+12",
    description: "AI och Copilot-specialister som hjälper företag att maximera värdet av Microsoft AI i Dynamics 365.",
    applications: ["Copilot", "Sales", "Customer Service"],
    industries: ["Tech", "Finans"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Exempelpartner 13",
    logo: "https://via.placeholder.com/150x60?text=Partner+13",
    description: "Erfaren partner inom bygg- och fastighetsbranschen med branschspecifika lösningar.",
    applications: ["Business Central", "Field Service"],
    industries: ["Bygg", "Fastighet"],
    companySize: ["Medelstora"]
  },
  {
    name: "Exempelpartner 14",
    logo: "https://via.placeholder.com/150x60?text=Partner+14",
    description: "Partner med fokus på livsmedels- och processindustrin. Experter på spårbarhet och kvalitet.",
    applications: ["Finance & SCM", "Business Central"],
    industries: ["Livsmedel", "Process"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Exempelpartner 15",
    logo: "https://via.placeholder.com/150x60?text=Partner+15",
    description: "Snabbväxande partner med modern approach och agila implementationsmetoder.",
    applications: ["Business Central", "Sales"],
    industries: ["Tjänsteföretag", "Konsult"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Exempelpartner 16",
    logo: "https://via.placeholder.com/150x60?text=Partner+16",
    description: "Specialister på finanssektorn med djup kunskap om regelverk och compliance-krav.",
    applications: ["Finance & SCM", "Customer Service"],
    industries: ["Bank", "Försäkring", "Finans"],
    companySize: ["Stora"]
  },
  {
    name: "Exempelpartner 17",
    logo: "https://via.placeholder.com/150x60?text=Partner+17",
    description: "Partner med stark kompetens inom hälso- och sjukvårdssektorn samt life science.",
    applications: ["Customer Service", "Field Service"],
    industries: ["Hälsa", "Life Science"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Exempelpartner 18",
    logo: "https://via.placeholder.com/150x60?text=Partner+18",
    description: "Erfaren leverantör av molnmigrationer och uppgraderingar från äldre Dynamics-versioner.",
    applications: ["Business Central", "Finance & SCM"],
    industries: ["Alla branscher"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Exempelpartner 19",
    logo: "https://via.placeholder.com/150x60?text=Partner+19",
    description: "Boutiquekonsultbolag med högseniora konsulter och personlig service.",
    applications: ["Business Central", "Sales"],
    industries: ["Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Exempelpartner 20",
    logo: "https://via.placeholder.com/150x60?text=Partner+20",
    description: "Stor internationell systemintegratör med omfattande resurser och global räckvidd.",
    applications: ["Finance & SCM", "Sales", "Customer Service"],
    industries: ["Enterprise", "Multinationella"],
    companySize: ["Stora"]
  }
];

const ValjPartner = () => {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Partner Guide Dialog */}
      <PartnerGuideDialog 
        open={guideOpen} 
        onOpenChange={setGuideOpen} 
        partners={partners}
      />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" 
            alt="Teamwork and partnership selection" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Välj Partner
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-6 sm:mb-8">
                Hitta rätt implementationspartner för din Dynamics 365-resa
              </p>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto text-lg sm:text-xl h-16 sm:h-20 px-8 sm:px-12 font-bold shadow-lg hover:shadow-xl transition-all rounded-xl"
                onClick={() => setGuideOpen(true)}
              >
                <span>Få hjälp att välja rätt partner</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Varför är partnerval så viktigt?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8">
              Valet av implementationspartner är ofta den viktigaste faktorn för en lyckad Dynamics 365-implementation. 
              En bra partner kan vara skillnaden mellan ett framgångsrikt projekt och ett som kostar mer tid och pengar än planerat.
            </p>
          </div>
        </div>
      </section>

      {/* Key Factors Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Viktiga faktorer vid partnerval
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-2">
                Här är de viktigaste aspekterna att överväga när du väljer din Dynamics 365-partner
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Building2 className="h-6 w-6 text-primary" />
                    Branscherfarenhet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    En partner med erfarenhet inom din bransch förstår dina unika utmaningar och kan snabbare leverera värde.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Award className="h-6 w-6 text-primary" />
                    Microsoft-certifieringar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Kontrollera att partnern har rätt Microsoft-kompetenser och certifieringar för de produkter du behöver.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="h-6 w-6 text-primary" />
                    Implementationsmetodik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    En beprövad projektmetodik säkerställer att projektet levereras i tid och inom budget.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Shield className="h-6 w-6 text-primary" />
                    Support & Förvaltning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Eftermarknadsstöd är avgörande för långsiktig framgång. Säkerställ att partnern erbjuder bra supportavtal.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Dynamics 365-partners
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Här är ett urval av partners som arbetar med Microsoft Dynamics 365 i Sverige
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="border border-border hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="h-16 flex items-center justify-center mb-3">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logotyp`}
                      className="max-h-12 max-w-full object-contain"
                    />
                  </div>
                  <CardTitle className="text-lg text-center">{partner.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {partner.description}
                  </p>
                  
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Applikationer:</p>
                    <div className="flex flex-wrap gap-1">
                      {partner.applications.map((app, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Branscher:</p>
                    <div className="flex flex-wrap gap-1">
                      {partner.industries.map((industry, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Företagsstorlek:</p>
                    <div className="flex flex-wrap gap-1">
                      {partner.companySize.map((size, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-primary/10">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              <div className="flex-shrink-0">
                <img 
                  src={thomasLainePhoto} 
                  alt="Thomas Laine" 
                  className="w-48 h-48 rounded-full object-cover object-[50%_15%] border-4 border-primary/20"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Behöver du vägledning?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Med vår breda erfarenhet av Dynamics 365-marknaden kan vi hjälpa dig att hitta rätt partner för just dina behov och förutsättningar.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl">
                <Link to="/kontakt">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Kontakta oss
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                onClick={() => window.open('https://outlook.office.com/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&ep=mlink', '_blank')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Boka möte
              </Button>
              <Button asChild size="lg" className="bg-muted hover:bg-muted/80 text-muted-foreground h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl border border-border">
                <a href="mailto:thomas.laine@dynamicfactory.se">
                  <Mail className="w-5 h-5 mr-2" />
                  Emaila mig
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ValjPartner;