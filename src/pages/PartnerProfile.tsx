import { useParams, Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, Sparkles, Target, Briefcase } from "lucide-react";
import LeadCTA from "@/components/LeadCTA";
import { usePartner } from "@/hooks/usePartners";
import { partners as staticPartners } from "@/data/partners";
import { Helmet } from "react-helmet";

const PartnerProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  
  // Get filter context from URL params
  const selectedProduct = searchParams.get("product") || undefined;
  const selectedIndustry = searchParams.get("industry") || undefined;
  const { data: dbPartner, isLoading } = usePartner(slug);
  // Fallback to static data if not in database
  const staticPartner = staticPartners.find(
    (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );

  const partner = dbPartner || (staticPartner ? {
    id: slug || "",
    slug: slug || "",
    name: staticPartner.name,
    description: staticPartner.description,
    logo_url: staticPartner.logo || null,
    website: staticPartner.website,
    email: null,
    phone: null,
    address: null,
    applications: staticPartner.applications,
    industries: staticPartner.industries,
    is_featured: false,
    created_at: "",
    updated_at: "",
  } : null);


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
            {/* Applications & Industries side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Applications */}
              {partner.applications.length > 0 && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-primary/5 overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      Kompetenser inom Dynamics 365
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex flex-wrap gap-2">
                      {partner.applications.map((app) => (
                        <Badge 
                          key={app} 
                          className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors text-sm py-1.5 px-3"
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Industries */}
              {partner.industries.length > 0 && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/5 overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2 text-accent">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Target className="w-5 h-5" />
                      </div>
                      Branscher i fokus
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex flex-wrap gap-2">
                      {partner.industries.map((ind) => (
                        <Badge 
                          key={ind} 
                          className="bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors text-sm py-1.5 px-3"
                        >
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Lead CTA */}
            <LeadCTA
              sourcePage={`partner-profile-${partner.slug}`}
              partnerName={partner.name}
              selectedProduct={selectedProduct}
              selectedProducts={selectedProduct ? undefined : partner.applications}
              selectedIndustry={selectedIndustry || partner.industries[0]}
              title="Låt oss hjälpa dig (helt kostnadsfritt) att komma i kontakt med rätt partner"
              description="Det här var ett första steg i rätt riktning, men ännu bättre om du låter oss hjälpa dig att hitta rätt partner och rätt kontaktperson. Kostnadsfritt förstås."
            />

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerProfile;
