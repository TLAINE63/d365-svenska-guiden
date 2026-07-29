import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { usePartner } from "@/hooks/usePartners";
import { buildMetaTitle } from "@/lib/metaTitle";
import { buildMetaDescription } from "@/lib/metaDescription";

/**
 * Per-partner deep-dive page.
 *
 * The `extended_content` text is an AI-aggregated research summary from
 * public sources. It is used internally by the on-site AI matching and
 * is exposed to search engines / AI crawlers via JSON-LD structured
 * data (articleBody) for SEO/AIO purposes only – it is NOT rendered
 * as visible body text to users.
 */
const PartnerExtendedContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: partner, isLoading } = usePartner(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Laddar...</div>
      </div>
    );
  }

  if (!partner) {
    return <Navigate to="/alla-d365-partners/" replace />;
  }

  const extended = ((partner as any).extended_content as string | null) || "";
  const updatedAt = (partner as any).extended_content_updated_at as string | null;

  // No content yet → send crawlers/users back to the main profile
  if (!extended.trim()) {
    return <Navigate to={`/partner/${partner.slug}/`} replace />;
  }

  const paragraphs = extended
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const seoTitle = buildMetaTitle({
    baseTitle: `${partner.name} – fördjupning & bakgrund`,
    primaryKeyword: "Dynamics 365 partner",
  }).value;

  const firstSentence = extended.split(/(?<=[.!?])\s/)[0] || extended.slice(0, 160);
  const seoDescription = buildMetaDescription([
    firstSentence,
    `Fördjupning om ${partner.name} som Microsoft Dynamics 365-partner: bakgrund, styrkor, arbetssätt och referenser.`,
  ]);

  const canonicalUrl = `https://d365.se/partner/${partner.slug}/fordjupning/`;
  const publishedIso = updatedAt || new Date().toISOString();
  const partnerWebsite = (partner as any).website as string | undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${partner.name} – fördjupning & bakgrund`,
    description: seoDescription,
    articleBody: extended,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    url: canonicalUrl,
    inLanguage: "sv-SE",
    datePublished: publishedIso,
    dateModified: publishedIso,
    image: partner.logo_url || "https://d365.se/og-erp.png",
    author: { "@type": "Organization", name: "d365.se" },
    publisher: {
      "@type": "Organization",
      name: "d365.se",
      logo: { "@type": "ImageObject", url: "https://d365.se/d365-logo.svg" },
    },
    about: {
      "@type": "Organization",
      name: partner.name,
      ...(partner.logo_url ? { logo: partner.logo_url } : {}),
      ...(partnerWebsite ? { url: partnerWebsite } : {}),
    },
    keywords: [
      partner.name,
      "Dynamics 365 partner",
      "Microsoft Dynamics 365",
      ...(partner.applications || []),
    ].join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: "https://d365.se/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Alla D365-partners",
        item: "https://d365.se/alla-d365-partners/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: partner.name,
        item: `https://d365.se/partner/${partner.slug}/`,
      },
      { "@type": "ListItem", position: 4, name: "Fördjupning", item: canonicalUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath={`/partner/${partner.slug}/fordjupning/`}
        keywords={[
          partner.name,
          "Dynamics 365",
          "Microsoft partner",
          "fördjupning",
          ...(partner.applications || []),
        ].join(", ")}
        ogImage={partner.logo_url || undefined}
        ogImageAlt={`${partner.name} – fördjupning om Microsoft Dynamics 365-partner`}
        ogType="article"
        articlePublishedTime={publishedIso}
        articleModifiedTime={publishedIso}
        articleAuthor="d365.se"
        articleSection="Partnerfördjupning"
        articleTags={[
          partner.name,
          "Dynamics 365 partner",
          ...(partner.applications || []),
        ]}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-16 max-w-3xl">
        <Link
          to={`/partner/${partner.slug}/`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka till {partner.name}
        </Link>

        <article>
          <header className="mb-8 border-b pb-6">
            <div className="flex items-center gap-4 mb-4">
              {partner.logo_url && (
                <img
                  src={partner.logo_url}
                  alt={`${partner.name} logotyp`}
                  className="w-16 h-16 object-contain rounded-lg bg-white border p-2"
                  loading="eager"
                />
              )}
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Microsoft Dynamics 365-partner
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {partner.name}
                </h1>
              </div>
            </div>
            {partner.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {partner.description}
              </p>
            )}
          </header>

          <p className="text-base text-foreground/90 leading-relaxed">
            Se {partner.name}s fullständiga partnerprofil för kompetenser,
            branscher, referenser och kontaktvägar.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/partner/${partner.slug}/`}
              className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              Till {partner.name}s partnerprofil
            </Link>
            <Link
              to="/valjdynamics365partner/"
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Jämför fler D365-partners
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerExtendedContent;
