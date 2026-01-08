import { useParams, Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, Sparkles, Briefcase, CheckCircle2, Circle, ExternalLink, Phone, Globe, Mail, User } from "lucide-react";
import LeadCTA from "@/components/LeadCTA";
import { usePartner } from "@/hooks/usePartners";
import { partners as staticPartners, Partner, getCumulativeGeographyDisplay } from "@/data/partners";
import { Helmet } from "react-helmet";
import { trackPartnerClick } from "@/utils/trackPartnerClick";

// Map application names to product categories
const getProductCategory = (app: string): 'bc' | 'fsc' | 'sales' | 'service' | null => {
  if (app === "Business Central") return 'bc';
  if (app === "Finance & SCM") return 'fsc';
  if (["Sales", "Customer Insights (Marketing)"].includes(app)) return 'sales';
  if (["Customer Service", "Field Service", "Contact Center"].includes(app)) return 'service';
  return null;
};

// Get product display name
const getProductDisplayName = (category: 'bc' | 'fsc' | 'sales' | 'service'): string => {
  switch (category) {
    case 'bc': return 'Business Central';
    case 'fsc': return 'Finance & Supply Chain';
    case 'sales': return 'Sälj & Marknad';
    case 'service': return 'Kundservice';
  }
};

// Get applications for a product category
const getApplicationsForCategory = (apps: string[], category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
  return apps.filter(app => getProductCategory(app) === category);
};

const PartnerProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  
  // Get filter context from URL params
  const selectedProduct = searchParams.get("product") || undefined;
  const selectedIndustry = searchParams.get("industry") || undefined;
  const selectedCompanySize = searchParams.get("companySize") || undefined;
  const selectedGeography = searchParams.get("geography") || undefined;
  const { data: dbPartner, isLoading } = usePartner(slug);
  
  // Find static partner for productFilters
  const staticPartner = staticPartners.find((p) => {
    const generatedSlug = p.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return generatedSlug === slug;
  });

  // Use dbPartner if available, otherwise fall back to static partner data
  const partner = dbPartner ?? (staticPartner ? {
    id: slug || "",
    slug: slug || "",
    name: staticPartner.name,
    description: staticPartner.description,
    logo_url: staticPartner.logo || null,
    website: staticPartner.website,
    email: staticPartner.email || null,
    contactPerson: staticPartner.contactPerson || null,
    phone: staticPartner.phone || null,
    address: null,
    applications: staticPartner.applications,
    industries: staticPartner.industries,
    is_featured: false,
    created_at: "",
    updated_at: "",
  } : null);

  // Get product categories this partner supports
  const getProductCategories = (): ('bc' | 'fsc' | 'sales' | 'service')[] => {
    if (!partner) return [];
    const categories = new Set<'bc' | 'fsc' | 'sales' | 'service'>();
    partner.applications.forEach(app => {
      const cat = getProductCategory(app);
      if (cat) categories.add(cat);
    });
    return Array.from(categories);
  };

  // Get industries for a specific product (map sales/service to crm for productFilters lookup)
  const getIndustriesForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): { primary: string[]; secondary: string[] } => {
    // Map sales and service to 'crm' for productFilters lookup
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    
    if (!staticPartner?.productFilters?.[filterKey]) {
      // Fallback to general industries
      const allIndustries = partner?.industries || [];
      return { 
        primary: allIndustries.slice(0, 2), 
        secondary: [] 
      };
    }
    
    const productFilter = staticPartner.productFilters[filterKey];
    return {
      primary: productFilter?.industries || [],
      secondary: productFilter?.secondaryIndustries || []
    };
  };

  // Get geography for a specific product
  const getGeographyForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string | null => {
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    return staticPartner?.productFilters?.[filterKey]?.geography || staticPartner?.geography || null;
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 mt-16">
          <div className="animate-pulse text-center text-muted-foreground">
            Laddar partnerinformation...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 mt-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Partner hittades inte</h1>
          <p className="text-muted-foreground mb-8">
            Vi kunde inte hitta den partner du söker.
          </p>
          <Link to="/valj-partner">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till partnerlistan
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const productCategories = getProductCategories();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{partner.name} - Dynamics 365 Partner | Svenska D365-guiden</title>
        <meta
          name="description"
          content={partner.description?.slice(0, 160) || `${partner.name} är en Microsoft Dynamics 365-partner som hjälper företag med implementationer.`}
        />
      </Helmet>

      <Navbar />

      {/* Header with enhanced gradient */}
      <header className="relative overflow-hidden mt-16">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Link
            to="/valj-partner"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Tillbaka till partnerlistan
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo with enhanced styling */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl scale-110" />
              <div className="relative w-32 h-32 sm:w-44 sm:h-44 bg-card rounded-2xl shadow-xl border border-border/50 flex items-center justify-center p-5 shrink-0 backdrop-blur-sm">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={`${partner.name} logotyp`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              {partner.is_featured && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg mb-4">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Utvald partner
                </Badge>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                {partner.name}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                {partner.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent to-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Product-specific cards */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                Kompetenser inom Dynamics 365
              </h2>
              
              <div className="grid gap-4">
                {productCategories.map((category) => {
                  const { primary, secondary } = getIndustriesForProduct(category);
                  const apps = getApplicationsForCategory(partner.applications, category);
                  const geography = getGeographyForProduct(category);
                  
                  return (
                    <Card 
                      key={category} 
                      className="border-0 shadow-lg bg-gradient-to-br from-card to-primary/5 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-foreground">
                          {getProductDisplayName(category)}
                        </CardTitle>
                        {apps.length > 1 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {apps.map(app => (
                              <Badge 
                                key={app} 
                                variant="secondary"
                                className="text-xs bg-muted/50"
                              >
                                {app}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Primary industry */}
                          {primary.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
                                Branschfokus
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {primary.map(ind => (
                                  <Badge 
                                    key={ind}
                                    className="bg-primary text-primary-foreground border-0 py-1.5 px-3 text-sm font-medium"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                    {ind}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Secondary industries */}
                          {secondary.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
                                Erfarenhet även inom
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {secondary.map(ind => (
                                  <Badge 
                                    key={ind}
                                    variant="outline"
                                    className="border-primary/30 text-foreground py-1.5 px-3 text-sm"
                                  >
                                    <Circle className="w-3 h-3 mr-1.5 text-primary/50" />
                                    {ind}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* If no industries at all */}
                          {primary.length === 0 && secondary.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">
                              Branschoberoende
                            </p>
                          )}

                          {/* Geography */}
                          {geography && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
                                Geografisk täckning
                              </p>
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary/70" />
                                <span className="text-sm text-foreground">
                                  {getCumulativeGeographyDisplay(geography)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Contact Information Card */}
            <Card className="border-2 border-primary shadow-xl bg-gradient-to-br from-primary/15 via-primary/10 to-accent/15 overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  Kontaktuppgifter
                </h3>
                
                <div className="space-y-3 mb-6">
                  {/* Website */}
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Hemsida</p>
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => {
                          trackPartnerClick(
                            partner.name,
                            partner.website,
                            `partner-profile-${partner.slug}`,
                            {
                              product: selectedProduct,
                              industry: selectedIndustry,
                              companySize: selectedCompanySize,
                              geography: selectedGeography,
                            }
                          );
                        }}
                        className="text-primary hover:underline font-medium"
                      >
                        {partner.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </a>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Kontaktperson</p>
                      <p className="text-foreground">
                        {partner.contactPerson || <span className="text-muted-foreground italic">—</span>}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Mobilnummer</p>
                      {partner.phone ? (
                        <a href={`tel:${partner.phone}`} className="text-primary hover:underline font-medium">
                          {partner.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">—</span>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">E-post</p>
                      {partner.email ? (
                        <a href={`mailto:${partner.email}`} className="text-primary hover:underline font-medium">
                          {partner.email}
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">—</span>
                      )}
                    </div>
                  </div>
                </div>

                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackPartnerClick(
                      partner.name,
                      partner.website,
                      `partner-profile-${partner.slug}`,
                      {
                        product: selectedProduct,
                        industry: selectedIndustry,
                        companySize: selectedCompanySize,
                        geography: selectedGeography,
                      }
                    );
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  Besök {partner.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            {/* Lead CTA - Contact us */}
            <Card className="border-2 border-accent shadow-xl bg-gradient-to-br from-accent/20 via-accent/15 to-primary/10 overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-accent" />
                  Vill du ha hjälp?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Låt oss hjälpa dig helt kostnadsfritt att hitta rätt partner och rätt kontaktperson.
                </p>
                
                {/* Show filter context if available */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
                    Din sökning
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-foreground/10 text-foreground border-foreground/20 font-semibold">
                      {partner.name}
                    </Badge>
                    {selectedProduct && (
                      <Badge className="bg-primary/15 text-primary border-primary/30">
                        {selectedProduct}
                      </Badge>
                    )}
                    {selectedIndustry && (
                      <Badge variant="outline" className="border-accent/50 text-foreground">
                        {selectedIndustry}
                      </Badge>
                    )}
                    {selectedCompanySize && (
                      <Badge variant="outline" className="border-muted-foreground/50 text-foreground">
                        {selectedCompanySize}
                      </Badge>
                    )}
                    {selectedGeography && (
                      <Badge variant="outline" className="border-muted-foreground/50 text-foreground">
                        {selectedGeography}
                      </Badge>
                    )}
                    {!selectedProduct && !selectedIndustry && !selectedCompanySize && !selectedGeography && (
                      <span className="text-xs text-muted-foreground italic">Direktlänk</span>
                    )}
                  </div>
                </div>
                
                <LeadCTA
                  sourcePage={`partner-profile-${partner.slug}`}
                  partnerName={partner.name}
                  selectedProduct={selectedProduct}
                  selectedProducts={selectedProduct ? undefined : partner.applications}
                  selectedIndustry={selectedIndustry || partner.industries[0]}
                  variant="inline"
                />
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerProfile;
