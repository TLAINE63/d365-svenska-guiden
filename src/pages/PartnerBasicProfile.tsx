import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useBasicPartner } from "@/hooks/useBasicPartners";
import PartnerBasicCard from "@/components/partner/PartnerBasicCard";

export default function PartnerBasicProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: partner, isLoading } = useBasicPartner(slug);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={
          partner
            ? `${partner.name} – observerad D365-partner`
            : "D365-partner – observerad data"
        }
        description="Basickort med observerad data om en Microsoft Dynamics 365-partner som ännu inte har egen profil på d365.se."
        canonicalPath={`/basic/${slug}/`}
        noIndex
      />
      <Navbar />
      <main className="pt-10">
        <section className="py-8 sm:py-12">
          <div className="container mx-auto max-w-2xl px-4 sm:px-6">
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="mb-6 border border-border font-medium hover:bg-muted/80"
            >
              <Link to="/alla-d365-partners/">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Alla D365-partners
              </Link>
            </Button>

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Laddar…</p>
            ) : !partner ? (
              <p className="text-sm text-muted-foreground">
                Kunde inte hitta partnern.
              </p>
            ) : (
              <PartnerBasicCard partner={partner} variant="standalone" />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

