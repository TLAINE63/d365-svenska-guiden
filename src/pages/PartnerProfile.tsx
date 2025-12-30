import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2 } from "lucide-react";
import LeadCTA from "@/components/LeadCTA";
import { usePartner } from "@/hooks/usePartners";
import { partners as staticPartners } from "@/data/partners";
import { Helmet } from "react-helmet";

const PartnerProfile = () => {
  const { slug } = useParams<{ slug: string }>();
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

  // Find related partners based on shared applications or industries
  // IMPORTANT: This hook must be called before any early returns
  const relatedPartners = useMemo(() => {
    if (!partner) return [];
    
    return staticPartners
      .filter(p => {
        // Exclude current partner
        const pSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        if (pSlug === slug) return false;
        
        // Check for shared applications or industries
        const hasSharedApp = p.applications.some(app => partner.applications.includes(app));
        const hasSharedIndustry = p.industries.some(ind => partner.industries.includes(ind));
        
        return hasSharedApp || hasSharedIndustry;
      })
      .slice(0, 6); // Limit to 6 related partners
  }, [partner, slug]);

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

      {/* Header */}
      <header className="relative overflow-hidden mt-16 bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <Link
            to="/valj-partner"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till partnerlistan
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-card rounded-2xl shadow-lg flex items-center justify-center p-4 shrink-0">
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

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {partner.is_featured && (
                  <Badge className="bg-amber-500 text-white">Utvald partner</Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                {partner.name}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mb-6">
                {partner.description}
              </p>

            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Applications & Industries side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Applications */}
              {partner.applications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Kompetens inom Dynamics 365</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {partner.applications.map((app) => (
                        <Badge key={app} variant="secondary" className="text-sm">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Industries */}
              {partner.industries.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Branscher i fokus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {partner.industries.map((ind) => (
                        <Badge key={ind} variant="outline" className="text-sm">
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
              selectedProducts={partner.applications}
              selectedIndustry={partner.industries[0]}
              title="Låt oss hjälpa dig (helt kostnadsfritt) att hitta rätt partner"
              description="Det här var ett första steg i rätt riktning, men ännu bättre om du låter oss hjälpa dig att hitta rätt partner och rätt kontaktperson. Kostnadsfritt förstås."
            />

            {/* Related Partners */}
            {relatedPartners.length > 0 && (
              <div className="pt-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Andra partners med liknande kompetens
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedPartners.map((relatedPartner) => {
                    const relatedSlug = relatedPartner.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <Link
                        key={relatedPartner.name}
                        to={`/partner/${relatedSlug}`}
                        className="block"
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow border-border hover:border-primary/30">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                                {relatedPartner.logo ? (
                                  <img
                                    src={relatedPartner.logo}
                                    alt={relatedPartner.name}
                                    className="max-w-full max-h-full object-contain p-1"
                                  />
                                ) : (
                                  <Building2 className="w-6 h-6 text-muted-foreground" />
                                )}
                              </div>
                              <h3 className="font-semibold text-foreground line-clamp-2">
                                {relatedPartner.name}
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {relatedPartner.applications.slice(0, 2).map((app) => (
                                <Badge key={app} variant="secondary" className="text-xs">
                                  {app}
                                </Badge>
                              ))}
                              {relatedPartner.applications.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{relatedPartner.applications.length - 2}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerProfile;
