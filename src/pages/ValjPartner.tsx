import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, ArrowRight, Calendar, MessageSquare, Mail, Building2, Award, Target, Shield, Filter, X, ExternalLink } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import thomasLainePhoto from "@/assets/thomas-laine.jpg";
import PartnerGuideDialog from "@/components/PartnerGuideDialog";
import { partners, Partner } from "@/data/partners";
import { trackPartnerClick } from "@/utils/trackPartnerClick";

// All available Dynamics 365 applications for filtering
const allApplications = [
  "Business Central",
  "Finance & SCM",
  "Sales",
  "Customer Service",
  "Customer Insights (Marketing)",
  "Field Service",
  "Contact Center",
  "Project Operations",
  "Commerce",
  "Human Resources"
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

// Company size filter options with mapping to partner data values
const companySizeFilters = [
  { label: "Småföretag (1-49 anställda)", values: ["Små"] },
  { label: "Mindre/Mellanstora företag (50-199)", values: ["Små", "Medelstora"] },
  { label: "Medelstora/Större företag (200-999)", values: ["Medelstora", "Stora"] },
  { label: "Större företag (1.000-5.000)", values: ["Stora"] },
  { label: "Enterprisebolag (+5.000 anställda)", values: ["Stora", "Enterprise"] }
];

const ValjPartner = () => {
  const [guideOpen, setGuideOpen] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);

  const toggleApplication = (app: string) => {
    setSelectedApplications(prev => 
      prev.includes(app) 
        ? prev.filter(a => a !== app)
        : [...prev, app]
    );
  };

  // Filter and sort partners alphabetically
  const filteredPartners = useMemo(() => {
    let result = [...partners];
    
    if (selectedApplications.length > 0) {
      result = result.filter(partner => 
        selectedApplications.some(app => partner.applications.includes(app))
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

    if (selectedCompanySize) {
      const sizeFilter = companySizeFilters.find(f => f.label === selectedCompanySize);
      if (sizeFilter) {
        result = result.filter(partner => 
          partner.companySize.some(size => sizeFilter.values.includes(size))
        );
      }
    }
    
    // Sort alphabetically by name
    return result.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
  }, [selectedApplications, selectedIndustry, selectedCompanySize]);

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
                className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto text-lg sm:text-xl h-16 sm:h-20 px-8 sm:px-12 font-bold shadow-lg hover:shadow-xl transition-all rounded-xl"
                onClick={() => setGuideOpen(true)}
              >
                <span>Få hjälp att välja rätt partner</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Fem viktiga frågor Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Fem viktiga frågor vid val av implementationspartner
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-2 mb-4">
                Valet av implementationspartner är ofta den viktigaste faktorn för en lyckad Dynamics 365-implementation. 
                En bra partner kan vara skillnaden mellan ett framgångsrikt projekt och ett som kostar mer tid och pengar än planerat.
              </p>
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
            <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
              Här är ett urval av partners som arbetar med Microsoft Dynamics 365 i Sverige. Välj de applikationer som du är mest intresserad av, vilken bransch du tillhör och din företagsstorlek (antal anställda), så filtreras listan på de Microsoftpartners som sannolikt passar dig bäst
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
                  variant={selectedApplications.includes(app) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleApplication(app)}
                  className={`transition-all rounded-full px-4 ${
                    selectedApplications.includes(app) 
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                      : "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 hover:scale-105"
                  }`}
                >
                  {app}
                  {selectedApplications.includes(app) && (
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

          {/* Company Size Filter */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Hur många anställda finns på ert företag?</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {companySizeFilters.map((sizeOption) => (
                <Button
                  key={sizeOption.label}
                  variant={selectedCompanySize === sizeOption.label ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCompanySize(selectedCompanySize === sizeOption.label ? null : sizeOption.label)}
                  className={`transition-all rounded-full px-4 ${
                    selectedCompanySize === sizeOption.label 
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                      : "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 hover:scale-105"
                  }`}
                >
                  {sizeOption.label}
                  {selectedCompanySize === sizeOption.label && (
                    <X className="ml-2 h-3 w-3" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Filter Results Summary */}
          {(selectedApplications.length > 0 || selectedIndustry || selectedCompanySize) && (
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-semibold text-foreground">{filteredPartners.length}</span> partners
                {selectedApplications.length > 0 && <> som levererar <span className="font-semibold text-primary">{selectedApplications.join(', ')}</span></>}
                {selectedApplications.length > 0 && (selectedIndustry || selectedCompanySize) && <>,</>}
                {selectedIndustry && <> inom <span className="font-semibold text-accent">{selectedIndustry}</span></>}
                {selectedIndustry && selectedCompanySize && <> och</>}
                {selectedCompanySize && <> för <span className="font-semibold text-primary">{selectedCompanySize}</span></>}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedApplications([]);
                  setSelectedIndustry(null);
                  setSelectedCompanySize(null);
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
                className="group relative border border-border/50 bg-card hover:bg-accent/5 transition-all duration-300 flex flex-col shadow-md hover:shadow-xl transform hover:-translate-y-1"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-t-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl sm:text-2xl text-center font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {partner.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col pt-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {partner.description}
                  </p>
                  
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                    <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Applikationer</p>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.applications.map((app, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-0 font-medium">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-accent/5 rounded-lg p-3 border border-accent/10">
                    <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Branscher</p>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.industries.map((industry, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-accent/40 text-muted-foreground bg-transparent">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
                    <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Företagsstorlek</p>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.companySize.map((size, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-secondary border-primary/20 text-foreground font-medium">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/50">
                    <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90">
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => trackPartnerClick(partner.name, partner.website, "Välj Partner")}
                      >
                        Besök hemsida
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
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