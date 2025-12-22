import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Globe, Mail, Phone, MapPin, ExternalLink, Building2 } from "lucide-react";
import { usePartner } from "@/hooks/usePartners";
import { partners as staticPartners } from "@/data/partners";
import { trackPartnerClick, buildPartnerUrl } from "@/utils/trackPartnerClick";
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

  const handleWebsiteClick = () => {
    if (partner) {
      trackPartnerClick(
        partner.name,
        partner.website,
        "partner-profile"
      );
    }
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

  const partnerUrl = buildPartnerUrl(
    partner.website,
    partner.name,
    {
      application: partner.applications[0] || "",
      industry: partner.industries[0] || ""
    }
  );

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

              <a
                href={partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWebsiteClick}
              >
                <Button size="lg" className="gap-2">
                  Besök hemsida
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Applications */}
              {partner.applications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Applikationer</CardTitle>
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
                    <CardTitle>Branscher</CardTitle>
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

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kontakt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a
                    href={partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWebsiteClick}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="h-5 w-5 shrink-0" />
                    <span className="truncate">{new URL(partner.website).hostname}</span>
                  </a>

                  {partner.email && (
                    <a
                      href={`mailto:${partner.email}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-5 w-5 shrink-0" />
                      <span className="truncate">{partner.email}</span>
                    </a>
                  )}

                  {partner.phone && (
                    <a
                      href={`tel:${partner.phone}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="h-5 w-5 shrink-0" />
                      <span>{partner.phone}</span>
                    </a>
                  )}

                  {partner.address && (
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                      <span>{partner.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Vill du komma i kontakt med {partner.name}? Besök deras hemsida eller kontakta oss så hjälper vi dig.
                  </p>
                  <Link to="/kontakt">
                    <Button variant="outline" className="w-full">
                      Kontakta oss
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerProfile;
