import { useParams, Link, Navigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, ArticleSchema } from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALL_DEEP_DIVE_ARTICLES } from "@/data/bcArticles";
import { ArrowLeft, BookOpen } from "lucide-react";

const DeepDiveArticle = () => {
  const { productSlug, articleSlug } = useParams();

  const article = ALL_DEEP_DIVE_ARTICLES.find(
    (a) => a.productSlug === productSlug && a.slug === articleSlug
  );

  if (!article) {
    return <Navigate to="/kunskapscenter/" replace />;
  }

  // Find sibling articles for navigation
  const siblings = ALL_DEEP_DIVE_ARTICLES.filter(
    (a) => a.productSlug === productSlug
  );
  const currentIndex = siblings.findIndex((a) => a.slug === articleSlug);
  const prevArticle = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextArticle = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  return (
    <>
      <SEOHead
        title={`${article.title} | d365.se`}
        description={article.description}
      />
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Kunskapscenter", url: "https://d365.se/kunskapscenter/" },
          { name: article.product, url: `https://d365.se/kunskapscenter/${article.productSlug}/` },
          { name: article.title, url: `https://d365.se/kunskapscenter/${article.productSlug}/${article.slug}/` },
        ]}
      />
      <ArticleSchema
        headline={article.title}
        description={article.description}
        url={`https://d365.se/kunskapscenter/${article.productSlug}/${article.slug}/`}
        image={article.bannerImage || article.image}
        section={article.product}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        {/* Header */}
        <section className="border-b border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link
                to="/kunskapscenter/"
                className="hover:text-primary transition-colors"
              >
                Kunskapscenter
              </Link>
              <span>/</span>
              <Link
                to={article.parentPath}
                className="hover:text-primary transition-colors"
              >
                {article.parentLabel}
              </Link>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {article.headerLabel || `Fördjupning – ${article.product}`}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {article.title}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {article.description}
            </p>
          </div>
        </section>

        {/* Banner image */}
        {(article.bannerImage || (article.image && !article.image.endsWith('.svg'))) && (
          <section className="border-b border-border">
            <div className="container mx-auto px-4 max-w-4xl">
              <img
                src={article.bannerImage || article.image}
                alt={article.title}
                className="w-full rounded-lg shadow-md"
                loading="eager"
              />
            </div>
          </section>
        )}

        {/* Article content */}
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-4xl">
            {article.description && (
              <aside
                aria-label="Sammanfattning"
                className="mb-8 p-5 rounded-xl border-l-4 border-primary bg-primary/5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  Sammanfattning
                </p>
                <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                  {article.description}
                </p>
              </aside>
            )}
            <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-li:leading-relaxed prose-strong:text-foreground prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:mb-5 prose-ul:my-6 prose-li:my-1">
              {article.content}
            </article>

            {/* Authoritative external sources (Microsoft Learn) */}
            {(() => {
              const learnLinks: Record<string, { label: string; url: string }[]> = {
                "business-central": [
                  { label: "Microsoft Learn: Dynamics 365 Business Central", url: "https://learn.microsoft.com/dynamics365/business-central/" },
                  { label: "Microsoft Docs: BC produktöversikt", url: "https://learn.microsoft.com/dynamics365/business-central/across-business-functionality" },
                ],
                "finance": [
                  { label: "Microsoft Learn: Dynamics 365 Finance", url: "https://learn.microsoft.com/dynamics365/finance/" },
                ],
                "supply-chain": [
                  { label: "Microsoft Learn: Dynamics 365 Supply Chain Management", url: "https://learn.microsoft.com/dynamics365/supply-chain/" },
                ],
                "d365-sales": [
                  { label: "Microsoft Learn: Dynamics 365 Sales", url: "https://learn.microsoft.com/dynamics365/sales/" },
                ],
                "d365-customer-service": [
                  { label: "Microsoft Learn: Dynamics 365 Customer Service", url: "https://learn.microsoft.com/dynamics365/customer-service/" },
                ],
                "d365-field-service": [
                  { label: "Microsoft Learn: Dynamics 365 Field Service", url: "https://learn.microsoft.com/dynamics365/field-service/" },
                ],
                "d365-contact-center": [
                  { label: "Microsoft Learn: Dynamics 365 Contact Center", url: "https://learn.microsoft.com/dynamics365/contact-center/" },
                ],
                "customer-insights": [
                  { label: "Microsoft Learn: Dynamics 365 Customer Insights", url: "https://learn.microsoft.com/dynamics365/customer-insights/" },
                ],
                "copilot": [
                  { label: "Microsoft Learn: Copilot för Dynamics 365", url: "https://learn.microsoft.com/dynamics365/guidance/develop/copilot-overview" },
                ],
                "agents": [
                  { label: "Microsoft Learn: Copilot Studio agents", url: "https://learn.microsoft.com/microsoft-copilot-studio/" },
                ],
              };
              const links = learnLinks[article.productSlug];
              if (!links?.length) return null;
              return (
                <aside
                  aria-label="Officiella källor"
                  className="mt-10 p-5 rounded-xl border border-border bg-secondary/30"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                    Officiella källor från Microsoft
                  </p>
                  <ul className="space-y-2 text-sm">
                    {links.map((l) => (
                      <li key={l.url}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {l.label} →
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Innehållet här är en oberoende sammanfattning. För fullständig och alltid uppdaterad dokumentation, se Microsofts officiella resurser ovan.
                  </p>
                </aside>
              );
            })()}
          </div>
        </section>

        {/* Navigation between articles */}
        <section className="border-t border-border bg-secondary/20">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row items-stretch gap-4">
              {prevArticle ? (
                <Link
                  to={`/kunskapscenter/${prevArticle.productSlug}/${prevArticle.slug}/`}
                  className="flex-1 group p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all bg-card"
                >
                  <span className="text-xs text-muted-foreground">← Föregående</span>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary mt-1 line-clamp-2">
                    {prevArticle.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextArticle ? (
                <Link
                  to={`/kunskapscenter/${nextArticle.productSlug}/${nextArticle.slug}/`}
                  className="flex-1 group p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all bg-card text-right"
                >
                  <span className="text-xs text-muted-foreground">Nästa →</span>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary mt-1 line-clamp-2">
                    {nextArticle.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={article.parentPath}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {article.parentLabel}
              </Link>
              <span className="hidden sm:inline text-muted-foreground">|</span>
              <Link
                to="/kunskapscenter/"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Tillbaka till Kunskapscenter
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DeepDiveArticle;
