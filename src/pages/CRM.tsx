import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FilterButtons, MultiFilterButtons } from "@/components/FilterButtons";
import LeadCTA from "@/components/LeadCTA";
import PartnerCard from "@/components/PartnerCard";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import { crmApplications, allIndustries } from "@/data/partners";
import { usePartners } from "@/hooks/usePartners";
import { filterAndSortPartners, getProductIndustries, hasProduct } from "@/hooks/usePartnerFilters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CRM = () => {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  
  // Fetch partners from database (only featured partners)
  const { data: partners = [], isLoading } = usePartners();

  const toggleApplication = (app: string) => {
    setSelectedApplications(prev => 
      prev.includes(app) 
        ? prev.filter(a => a !== app)
        : [...prev, app]
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter partners for CRM (using sales and service product keys)
  const crmPartners = useMemo(() => {
    // CRM partners have either sales or service product filters
    const filtered = partners.filter(p => hasProduct(p, 'sales') || hasProduct(p, 'service'));
    
    // Apply industry filter if selected
    if (selectedIndustry) {
      return filtered.filter(p => {
        const salesIndustries = p.product_filters?.sales?.industries || [];
        const serviceIndustries = p.product_filters?.service?.industries || [];
        return salesIndustries.includes(selectedIndustry) || serviceIndustries.includes(selectedIndustry);
      });
    }
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
  }, [partners, selectedIndustry]);

  // Get available industries for CRM partners
  const crmIndustries = useMemo(() => {
    const industries = new Set<string>();
    partners.forEach(partner => {
      partner.product_filters?.sales?.industries?.forEach(ind => industries.add(ind));
      partner.product_filters?.service?.industries?.forEach(ind => industries.add(ind));
    });
    return allIndustries.filter(ind => industries.has(ind));
  }, [partners]);
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" 
            alt="Team collaboration and CRM" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <img src={SalesIcon} alt="Sales" className="h-8 w-8 sm:h-10 sm:w-10" />
                <img src={MarketingIcon} alt="Customer Insights" className="h-8 w-8 sm:h-10 sm:w-10" />
                <img src={CustomerServiceIcon} alt="Customer Service" className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                CRM (Customer Engagement)
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-6">
                Microsoft Dynamics 365 Sales, Customer Insights/Marketing, Customer Service, Contact Center, Field Service, Project Operations m.m.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <ContactFormDialog>
                  <Button 
                    size="lg"
                    className="bg-crm hover:bg-crm/90 text-crm-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
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
              Microsoft Dynamics 365 Customer Engagement
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              För smartare kundrelationer
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground mb-4 sm:mb-6">
              Skapa starkare kundupplevelser och effektivare service – allt i en integrerad plattform.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Microsoft Dynamics 365 Customer Engagement är en samling intelligenta affärsapplikationer som hjälper företag att bygga långsiktiga kundrelationer och leverera förstklassig service. Lösningen kombinerar CRM och kundtjänst i en modern, molnbaserad plattform.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Customer Engagement
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad är Dynamics 365 Customer Engagement och vad ingår i det?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 Customer Engagement är en samling intelligenta affärsapplikationer som hjälper företag att hantera sina kundrelationer. Det inkluderar lösningar för försäljning (Sales), kundservice (Customer Service), marknadsföring (Customer Insights), kontaktcenter (Contact Center), fältservice (Field Service) och projektstyrning (Project Operations). Alla applikationer integreras sömlöst och ger en helhetsbild av varje kund.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur skiljer sig Dynamics 365 CE från andra CRM-system?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 CE sticker ut genom sin djupa integration med Microsoft-ekosystemet (Office 365, Teams, Outlook), kraftfulla AI-funktioner via Copilot, flexibel anpassning utan omfattande programmering, samt möjligheten att kombinera CRM med ERP (Business Central eller Finance & Supply Chain) för en komplett affärslösning. Systemet är också byggt för att växa med din verksamhet – från små team till globala organisationer.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur mycket kostar Dynamics 365 Customer Engagement – och vad påverkar priset?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Kostnaden varierar beroende på vilka applikationer ni väljer och hur många användare ni har. Licenspriser börjar från ca 500 kr/användare/månad för Customer Service Professional och går upp till 1 500 kr/månad för Sales Premium. Till detta kommer implementeringskostnader (100-250 tkr för en applikation, upp till 800 tkr-2M kr för en komplett lösning) samt löpande support och anpassningar. En Dynamics 365 partner hjälper er att hitta rätt paket för era behov och budget.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur snabbt kan vi komma igång med Dynamics 365 CE?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Implementeringstiden varierar beroende på omfattning och komplexitet. För en standardimplementering av en enskild applikation (t.ex. Sales) kan ni vara igång på 2-3 månader. Större implementeringar med flera applikationer och omfattande anpassningar tar normalt 4-6 månader. Det börjar ofta med en noggrann kravanalys för att säkerställa att lösningen möter era verkliga behov.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur anpassningsbart är systemet för vår verksamhet?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 CE är mycket flexibelt och kan anpassas till de flesta branscher och affärsprocesser. Via Power Platform kan ni bygga egna arbetsflöden, formulär och rapporter utan omfattande programmering. Systemet stödjer också branschspecifika lösningar för bland annat tillverkning, detaljhandel, hälsovård och professionella tjänster. Vi hjälper er att konfigurera systemet så att det passar era unika processer.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vilken partner borde passa vår verksamhet bäst?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Rätt partner beror på er bransch, företagsstorlek och vilka CRM-applikationer ni behöver. Vi rekommenderar att ni väljer en partner med erfarenhet från liknande implementeringar och som har certifieringar för de specifika Dynamics 365-applikationerna ni är intresserade av. På vår <a href="/valj-partner" className="text-crm hover:underline font-medium">partnerkatalog</a> kan ni filtrera på bransch, företagsstorlek och applikationer för att hitta partners som matchar era krav. Ni kan också använda vårt verktyg för att få personliga partnerrekommendationer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              CRM-partners
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
              Här är ett urval av partners som arbetar med Dynamics 365 Customer Engagement i Sverige. Välj de applikationer som du är mest intresserad av, vilken bransch du tillhör och din företagsstorlek (antal anställda), så filtreras listan på de Microsoftpartners som sannolikt passar dig bäst
            </p>
          </div>

          {/* Application Filter */}
          <MultiFilterButtons
            title="Filtrera på applikation"
            icon="application"
            options={crmApplications.map(app => ({ label: app, value: app }))}
            selectedValues={selectedApplications}
            onToggle={toggleApplication}
            colorScheme="crm"
          />

          {/* Industry Filter */}
          <FilterButtons
            title="Filtrera på bransch"
            icon="industry"
            options={allIndustries.map(ind => ({ label: ind, value: ind }))}
            selectedValue={selectedIndustry}
            onSelect={setSelectedIndustry}
            colorScheme="crm"
          />


          {/* Filter Results Summary */}
          {(selectedApplications.length > 0 || selectedIndustry) && (
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-semibold text-foreground">{crmPartners.length}</span> partners
                {selectedApplications.length > 0 && <> som levererar <span className="font-semibold text-crm">{selectedApplications.join(', ')}</span></>}
                {selectedApplications.length > 0 && selectedIndustry && <>,</>}
                {selectedIndustry && <> inom <span className="font-semibold text-crm">{selectedIndustry}</span></>}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedApplications([]);
                  setSelectedIndustry(null);
                }}
                className="mt-2 text-muted-foreground hover:text-foreground"
              >
                Rensa alla filter
              </Button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {crmPartners.map((partner, index) => (
              <PartnerCard
                key={index}
                partner={partner}
                profileUrl={`/partner/${partner.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                colorScheme="crm"
                productKey="crm"
                highlightedProduct={selectedApplications.length > 0 ? selectedApplications.join(', ') : undefined}
                highlightedIndustry={selectedIndustry || undefined}
              />
            ))}
          </div>

          {/* Lead CTA - shows when partners are filtered */}
          {(selectedApplications.length > 0 || selectedIndustry) && (
            <div className="max-w-xl mx-auto mt-12">
              {/* Premium Contact CTA Card - same design as PartnerProfile */}
              <article className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/25 via-transparent to-transparent" />
                
                {/* Animated orb */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/40 to-transparent rounded-full blur-3xl animate-pulse" />
                
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                      <span className="text-xl">✨</span>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        Låt oss hjälpa dig hitta rätt partner
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base">
                        Det här var ett första steg i rätt riktning. Låt oss hjälpa dig vidare – helt kostnadsfritt.
                      </p>
                    </div>
                  </div>
                  
                  {/* Filter context with glass effect */}
                  <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Din sökning
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/40 text-white border-primary/50 py-1.5 px-3 backdrop-blur-sm">
                        CRM
                      </Badge>
                      {selectedApplications.map(app => (
                        <Badge key={app} className="bg-white/20 text-white border-white/30 py-1.5 px-3 backdrop-blur-sm">
                          {app}
                        </Badge>
                      ))}
                      {selectedIndustry && (
                        <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 backdrop-blur-sm">
                          {selectedIndustry}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <LeadCTA
                    sourcePage="/crm"
                    selectedProduct="CRM"
                    selectedProducts={selectedApplications.length > 0 ? selectedApplications : undefined}
                    selectedIndustry={selectedIndustry || undefined}
                    variant="inline"
                  />
                </div>
              </article>
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/valj-partner">
                Se alla partners
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
            <ContactFormDialog>
              <Button className="bg-crm hover:bg-crm/90 text-crm-foreground h-14 sm:h-16 rounded-xl" size="lg">
                Boka in en kostnadsfri rådgivning
              </Button>
            </ContactFormDialog>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CRM;
