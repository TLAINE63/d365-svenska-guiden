import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useBasicPartner, PRODUCT_LABEL, PRODUCT_ORDER, type BasicPartner } from "@/hooks/useBasicPartners";
import PartnerBasicCard from "@/components/partner/PartnerBasicCard";

function excerpt(text: string | null | undefined, max = 155): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

export default function PartnerBasicProfile({
  initialData = null,
}: {
  /** Prerender/SSR fallback so crawlers get real content without JS. */
  initialData?: BasicPartner | null;
}) {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading: queryLoading } = useBasicPartner(slug);
  const partner = data ?? initialData;
  const isLoading = queryLoading && !initialData;

  const observedApps = partner
    ? PRODUCT_ORDER.filter((k) => partner.observed_products?.[k]).map(
        (k) => PRODUCT_LABEL[k],
      )
    : [];

  const seoTitle = partner
    ? `${partner.name} – Microsoft Dynamics 365-partner i Sverige`
    : "D365-partner – observerad data";

  const seoDescription = partner
    ? excerpt(partner.extended_content) ||
      `${partner.name} är en Microsoft Dynamics 365-partner. Översikt av observerade produktområden${
        observedApps.length ? ` (${observedApps.join(", ")})` : ""
      }, branscher och geografisk täckning – sammanställt av d365.se från publika källor.`
    : "Basickort med observerad data om en Microsoft Dynamics 365-partner som ännu inte har egen profil på d365.se.";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath={`/basic/${slug}/`}
      />
      {partner && (
        <>
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: partner.name,
                url: `https://d365.se/basic/${partner.slug}/`,
                mainEntityOfPage: `https://d365.se/basic/${partner.slug}/`,
                ...(partner.website ? { sameAs: [partner.website] } : {}),
                ...(excerpt(partner.extended_content, 300)
                  ? { description: excerpt(partner.extended_content, 300) }
                  : {}),
                areaServed: { "@type": "Country", name: "Sweden" },
                ...(observedApps.length
                  ? { knowsAbout: ["Microsoft Dynamics 365", ...observedApps] }
                  : {}),
              })}
            </script>
          </Helmet>
          <BreadcrumbSchema
            items={[
              { name: "Hem", url: "https://d365.se/" },
              {
                name: "Alla D365-partners",
                url: "https://d365.se/alla-d365-partners/",
              },
              {
                name: partner.name,
                url: `https://d365.se/basic/${partner.slug}/`,
              },
            ]}
          />
        </>
      )}
      <Navbar />
      <main className="pt-10">
        <section className="py-8 sm:py-12">
          <div className="container mx-auto max-w-2xl px-4 sm:px-6">
            <Button
              asChild
              variant="default"
              size="sm"
              className="mt-4 mb-6 font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Link to="/alla-d365-partners/">
                <ArrowLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
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
