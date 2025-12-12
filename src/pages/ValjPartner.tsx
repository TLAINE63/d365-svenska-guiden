import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, ArrowRight, Calendar, MessageSquare, Mail, Building2, Award, Target, Shield, Filter, X } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import thomasLainePhoto from "@/assets/thomas-laine.jpg";
import PartnerGuideDialog from "@/components/PartnerGuideDialog";

// All available Dynamics 365 applications for filtering
const allApplications = [
  "Business Central",
  "Finance & SCM",
  "Sales",
  "Customer Service",
  "Customer Insights (Marketing)",
  "Field Service",
  "Contact Center",
  "Project Operations"
];

// All available industries for filtering
const allIndustries = [
  "Tillverkning",
  "Grossist",
  "Tjänsteföretag",
  "Retail",
  "E-handel",
  "Offentlig sektor",
  "Bank & Finans",
  "Energisektorn",
  "Bygg & Entreprenad"
];

export interface Partner {
  name: string;
  logo: string;
  website: string;
  description: string;
  applications: string[];
  industries: string[];
  companySize: string[];
}

const partners: Partner[] = [
  {
    name: "Absfront",
    logo: "https://absfront.se/wp-content/uploads/2020/11/absfront-logo.svg",
    website: "https://absfront.se",
    description: "Specialister på CRM och Customer Experience inom Dynamics 365, Power Platform och Data. Fokus på kundupplevelser utan gränser.",
    applications: ["Sales", "Customer Service", "Customer Insights (Marketing)"],
    industries: ["Tjänsteföretag", "B2B", "Alla branscher"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Accigo",
    logo: "https://accigo.se/wp-content/uploads/2023/01/Accigo-logo.svg",
    website: "https://accigo.se",
    description: "Microsoft Dynamics 365 Partner of The Year 2024. Smart digital transformation med fokus på Customer Engagement och Power Platform.",
    applications: ["Sales", "Customer Service", "Customer Insights (Marketing)"],
    industries: ["Tjänsteföretag", "B2B", "Finans"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Azets",
    logo: "https://www.azets.se/globalassets/azets-logo.svg",
    website: "https://www.azets.se",
    description: "Nordisk leverantör av affärssystem och redovisningstjänster med stark Dynamics 365 Business Central-kompetens. Kombinerar systemleverans med ekonomitjänster.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Handel", "Alla branscher"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "BE-terna",
    logo: "https://www.be-terna.com/hubfs/BE-terna%20Logo.svg",
    website: "https://www.be-terna.com/sv",
    description: "Internationell partner med fokus på digital framtid. Del av Telefónica Tech med stark kompetens inom ERP, CRM och dataanalys.",
    applications: ["Finance & SCM", "Business Central"],
    industries: ["Tillverkning", "Retail", "Distribution"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Capgemini",
    logo: "https://www.capgemini.com/wp-content/themes/capgemini2020/assets/images/logo.svg",
    website: "https://www.capgemini.com/se-en/",
    description: "Global konsultjätte med omfattande Dynamics 365-praktik. Fokus på stora transformationsprojekt och enterprise-kunder.",
    applications: ["Finance & SCM", "Sales", "Customer Service"],
    industries: ["Finans", "Retail", "Energi"],
    companySize: ["Stora"]
  },
  {
    name: "Cepheo",
    logo: "https://cepheo.com/wp-content/uploads/2022/01/cepheo-logo.svg",
    website: "https://cepheo.com",
    description: "Erfaren nordisk Dynamics 365-partner med över 39 års erfarenhet. Digital Empowerment för medelstora och stora företag.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Service"],
    industries: ["Tillverkning", "Distribution", "Tjänsteföretag"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "CGI",
    logo: "https://www.cgi.com/sites/default/files/2019-12/cgi-logo.svg",
    website: "https://www.cgi.com/se",
    description: "Global IT-konsult med omfattande Dynamics 365-kompetens. Erbjuder helhetslösningar för stora organisationer och offentlig sektor.",
    applications: ["Finance & SCM", "Sales", "Customer Service"],
    industries: ["Offentlig sektor", "Finans", "Energi"],
    companySize: ["Stora"]
  },
  {
    name: "Columbus",
    logo: "https://www.columbusglobal.com/hubfs/columbus-logo-black.svg",
    website: "https://www.columbusglobal.com/sv",
    description: "Global Dynamics 365-partner med stark nordisk närvaro. Digital Value. Human Intelligence - helhetslösningar inom ERP och CRM.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Service"],
    industries: ["Tillverkning", "Retail", "Distribution"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Cosmo Consult",
    logo: "https://www.cosmoconsult.com/fileadmin/_processed_/5/8/csm_COSMO_CONSULT_Logo_RGB_b35e8c5f3e.png",
    website: "https://www.cosmoconsult.com/sv-se/",
    description: "Internationell Dynamics 365-partner med stark närvaro i Norden. Specialister på Business Central med egna branschlösningar.",
    applications: ["Business Central", "Finance & SCM"],
    industries: ["Tillverkning", "Projektföretag", "Distribution"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "CRM Konsulterna",
    logo: "https://crmkonsulterna.se/wp-content/uploads/2023/01/crmk-logo.svg",
    website: "https://crmkonsulterna.se",
    description: "Vi placerar kunden i centrum. Specialister på Dynamics 365 Customer Engagement, CRM och Power Platform.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service"],
    industries: ["B2B", "Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Dizparc",
    logo: "https://dizparc.com/wp-content/uploads/2023/01/dizparc-logo-white.svg",
    website: "https://dizparc.com",
    description: "Förverkliga din digitala potential. Lokala verksamheter på flera orter som hjälper dig skapa hållbara digitala lösningar.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Distribution", "Handel"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "ECIT",
    logo: "https://www.ecit.com/wp-content/uploads/2021/08/ecit-logo.svg",
    website: "https://www.ecit.com/se/",
    description: "Din partner - nu och i framtiden. Nordisk IT-partner med bred kompetens inom ekonomi, IT och affärslösningar.",
    applications: ["Business Central", "Finance & SCM"],
    industries: ["Tjänsteföretag", "Handel", "Distribution"],
    companySize: ["Små", "Medelstora", "Stora"]
  },
  {
    name: "Engage Group",
    logo: "https://engagegroup.se/wp-content/uploads/2022/01/engage-group-logo.svg",
    website: "https://engagegroup.se",
    description: "Experts In Dynamics 365. Your Local Partner With Global Reach. Fokus på CRM och Customer Engagement.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Field Service"],
    industries: ["Tjänsteföretag", "B2B"],
    companySize: ["Medelstora"]
  },
  {
    name: "Evidi (fd. Navipro)",
    logo: "https://navipro.se/wp-content/uploads/2024/01/evidi-logo.svg",
    website: "https://navipro.se",
    description: "From NaviPro to Evidi - A New Era of Possibilities. Nordisk Microsoft-partner med djup expertis inom hela Microsoft-plattformen.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Handel"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Fellowmind",
    logo: "https://www.fellowmind.com/globalassets/images/fellowmind-logo.svg",
    website: "https://www.fellowmind.com/sv-se/",
    description: "Microsoft EMEA Channel Partner of the Year 2025. En av Nordens största Dynamics 365-partners med bred kompetens inom ERP och CRM.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Service"],
    industries: ["Alla branscher"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "Goodfellows",
    logo: "https://goodfellows.se/wp-content/uploads/2021/03/goodfellows-logo.svg",
    website: "https://goodfellows.se",
    description: "Goodfellows IT, support & drift blir en del av Upheads. Välkommen till det goda livet med personlig IT-service.",
    applications: ["Sales", "Customer Service", "Customer Insights (Marketing)"],
    industries: ["Tjänsteföretag", "B2B"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Implema",
    logo: "https://www.implema.se/wp-content/uploads/2021/03/implema-logo.svg",
    website: "https://www.implema.se",
    description: "Snabbt, säkert och redo för framtiden. Accelerera din affär med SAP och Microsoft Dynamics.",
    applications: ["Finance & SCM", "Business Central"],
    industries: ["Tillverkning", "Process", "Distribution"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "InBiz",
    logo: "https://www.inbiz.se/wp-content/uploads/2021/08/inbiz-logo.png",
    website: "https://www.inbiz.se",
    description: "Din trygga partner för Microsoft Dynamics. Sedan 2005 har vi hjälpt våra kunder att få det bästa ur sitt affärssystem.",
    applications: ["Business Central"],
    industries: ["Tjänsteföretag", "Handel"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "NAB Solutions",
    logo: "https://www.nabsolutions.se/wp-content/uploads/2021/03/nab-logo.png",
    website: "https://www.nabsolutions.se",
    description: "Specialister på Dynamics 365 Business Central med lång erfarenhet av implementationer för svenska företag. Fokus på tillverkning och distribution.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Distribution", "Handel"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Navcite",
    logo: "https://navcite.se/wp-content/uploads/2022/01/navcite-logo.svg",
    website: "https://navcite.se",
    description: "Small company feeling - Big company experience. Affärssystem med Infor M3 och Microsoft Business Central.",
    applications: ["Business Central"],
    industries: ["Tillverkning", "Distribution"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Navet",
    logo: "https://navet.se/wp-content/uploads/2020/12/navet-logo.svg",
    website: "https://navet.se",
    description: "Vi skapar bättre affärer tillsammans. Vi förstår verksamheter, teknik och relationer. Del av Addovation Group.",
    applications: ["Business Central"],
    industries: ["Handel", "Tjänsteföretag"],
    companySize: ["Små", "Medelstora"]
  },
  {
    name: "Sogeti",
    logo: "https://www.sogeti.se/globalassets/sogeti-logo.svg",
    website: "https://www.sogeti.se",
    description: "Vi är Valuemakers. Del av Capgemini-gruppen med fokus på teknisk implementation, utveckling och Power Platform.",
    applications: ["Business Central", "Sales"],
    industries: ["Alla branscher"],
    companySize: ["Medelstora", "Stora"]
  },
  {
    name: "TietoEvry",
    logo: "https://www.tietoevry.com/siteassets/company/images/logos/tietoevry_logo.svg",
    website: "https://www.tietoevry.com/sv",
    description: "Nordisk teknologijätte med bred Dynamics 365-kompetens. Stark inom offentlig sektor, finans och stora enterprise-kunder.",
    applications: ["Finance & SCM", "Sales", "Customer Service"],
    industries: ["Offentlig sektor", "Finans", "Bank"],
    companySize: ["Stora"]
  },
  {
    name: "Two i Sverige",
    logo: "https://two.se/wp-content/uploads/2023/01/two-logo.svg",
    website: "https://two.se",
    description: "We are CombinedX. Experter på affärssystem och business intelligence. Minut för minut ser vi till att det gör det.",
    applications: ["Business Central", "Finance & SCM"],
    industries: ["Tillverkning", "Distribution", "Handel"],
    companySize: ["Medelstora", "Stora"]
  }
];

const ValjPartner = () => {
  const [guideOpen, setGuideOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // Filter partners based on selected application and industry
  const filteredPartners = useMemo(() => {
    let result = partners;
    
    if (selectedApplication) {
      result = result.filter(partner => 
        partner.applications.includes(selectedApplication)
      );
    }
    
    if (selectedIndustry) {
      result = result.filter(partner => 
        partner.industries.some(ind => 
          ind.toLowerCase().includes(selectedIndustry.toLowerCase()) ||
          selectedIndustry.toLowerCase().includes(ind.toLowerCase()) ||
          ind === "Alla branscher"
        )
      );
    }
    
    return result;
  }, [selectedApplication, selectedIndustry]);

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

      {/* Fem viktiga frågor Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Fem viktiga frågor vid val av implementationspartner
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-2">
                Här är fem viktiga frågor du (eller din organisation) bör ställa er själva inför valet av implementationspartner för Dynamics 365
              </p>
            </div>

            <div className="space-y-6">
              {/* Fråga 1 */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                    <span className="text-2xl">✅</span>
                    Har partnern erfarenhet av vår bransch och våra processer?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Har de genomfört liknande projekt tidigare?</li>
                    <li>• Förstår de våra specifika krav inom t.ex. tillverkning, tjänster, handel eller offentlig sektor?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 2 */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                    <span className="text-2xl">✅</span>
                    Hur ser deras implementationsmetodik ut?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Arbetar de enligt en beprövad metod (t.ex. Microsoft's Success by Design)?</li>
                    <li>• Hur hanterar de projektledning, förändringsledning och utbildning?</li>
                    <li>• Erbjuder de en snabbstart eller paketerad lösning?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 3 */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                    <span className="text-2xl">✅</span>
                    Vilken typ av support och förvaltning erbjuder de efter implementationen?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Finns det en tydlig plan för support, uppgraderingar och vidareutveckling?</li>
                    <li>• Har de en dedikerad supportorganisation?</li>
                    <li>• Erbjuder de SLA:er och proaktiv förvaltning?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 4 */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                    <span className="text-2xl">✅</span>
                    Hur transparenta är de med kostnader och tidsplan?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Får vi en tydlig offert med alla kostnader specificerade?</li>
                    <li>• Hur hanterar de förändringar i omfattning?</li>
                    <li>• Har de referensprojekt med liknande budget och tidsram?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 5 */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                    <span className="text-2xl">✅</span>
                    Hur väl passar de vår organisationskultur och arbetssätt?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Är de lyhörda, pedagogiska och samarbetsvilliga?</li>
                    <li>• Känns de som en långsiktig partner snarare än bara en leverantör?</li>
                    <li>• Har vi god personkemi med deras team?</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Selection Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Att välja rätt partner
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Valet av implementationspartner är avgörande för projektets framgång. Här diskuterar vi de viktigaste faktorerna att tänka på när du väljer din Dynamics 365-partner.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoCard
              title="Så väljer du rätt implementationspartner"
              description="Viktiga överväganden och frågor att ställa"
              videoId=""
            />
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              Lägg in ditt YouTube video-ID för att visa videon
            </p>
          </div>
        </div>
      </section>

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

          {/* Application Filter */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filtrera på applikation:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {allApplications.map((app) => (
                <Button
                  key={app}
                  variant={selectedApplication === app ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedApplication(selectedApplication === app ? null : app)}
                  className={`transition-all rounded-full px-4 ${
                    selectedApplication === app 
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                      : "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 hover:scale-105"
                  }`}
                >
                  {app}
                  {selectedApplication === app && (
                    <X className="ml-2 h-3 w-3" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Industry Filter */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filtrera på bransch:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {allIndustries.map((industry) => (
                <Button
                  key={industry}
                  variant={selectedIndustry === industry ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedIndustry(selectedIndustry === industry ? null : industry)}
                  className={`transition-all rounded-full px-4 ${
                    selectedIndustry === industry 
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                      : "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 hover:scale-105"
                  }`}
                >
                  {industry}
                  {selectedIndustry === industry && (
                    <X className="ml-2 h-3 w-3" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Filter Results Summary */}
          {(selectedApplication || selectedIndustry) && (
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-semibold text-foreground">{filteredPartners.length}</span> partners
                {selectedApplication && <> som levererar <span className="font-semibold text-primary">{selectedApplication}</span></>}
                {selectedApplication && selectedIndustry && <> och</>}
                {selectedIndustry && <> inom <span className="font-semibold text-accent">{selectedIndustry}</span></>}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedApplication(null);
                  setSelectedIndustry(null);
                }}
                className="mt-2 text-muted-foreground hover:text-foreground"
              >
                Rensa alla filter
              </Button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPartners.map((partner, index) => (
              <Card 
                key={index} 
                className="group relative border-0 bg-gradient-to-br from-card via-card to-muted/30 hover:from-primary/5 hover:via-card hover:to-accent/5 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2 hover:scale-[1.02]"
                style={{
                  boxShadow: '0 4px 20px -4px hsl(var(--primary) / 0.1), 0 8px 16px -8px hsl(var(--muted) / 0.3)'
                }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-t-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader className="pb-3 pt-5">
                  <CardTitle className="text-lg text-center font-bold text-foreground group-hover:text-primary transition-colors">
                    {partner.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {partner.description}
                  </p>
                  
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs font-semibold text-foreground mb-2">Applikationer:</p>
                    <div className="flex flex-wrap gap-1">
                      {partner.applications.map((app, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-foreground mb-2">Branscher:</p>
                    <div className="flex flex-wrap gap-1">
                      {partner.industries.map((industry, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-accent/30 text-muted-foreground">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-foreground mb-2">Företagsstorlek:</p>
                    <div className="flex flex-wrap gap-1">
                      {partner.companySize.map((size, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-accent/10 border-accent/30 text-accent-foreground">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    <a 
                      href={partner.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 group/link"
                    >
                      Besök hemsida
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </a>
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