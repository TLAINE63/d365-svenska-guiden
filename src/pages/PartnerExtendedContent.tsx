import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { usePartner } from "@/hooks/usePartners";
import { buildMetaTitle } from "@/lib/metaTitle";
import { buildMetaDescription } from "@/lib/metaDescription";

/**
 * Public per-partner deep-dive page.
 *
 * Fills the SEO/AIO surface area for each partner with ~500 words of
 * long-form editorial content that the admin fills in themselves via
 * the admin dashboard (extended_content on partners). Also read by the
 * on-site AI search / matching prompts as background knowledge.
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
        ogImageAlt={`${partner.name} – fördjupning`}
        ogType="article"
      />

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
                  Fördjupning · Microsoft Dynamics 365-partner
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Om {partner.name}
                </h1>
              </div>
            </div>
            {partner.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {partner.description}
              </p>
            )}
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
          </div>

          {updatedAt && (
            <p className="mt-10 text-xs text-muted-foreground">
              Senast uppdaterad:{" "}
              {new Date(updatedAt).toLocaleDateString("sv-SE").replace(/-/g, "/")}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to={`/partner/${partner.slug}/`}
              className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              Se {partner.name}s partnerprofil
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
