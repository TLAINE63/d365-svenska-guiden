import { useParams, Link, Navigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, ArticleSchema } from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedPages, { articleRelatedPages } from "@/components/RelatedPages";
import { ALL_DEEP_DIVE_ARTICLES } from "@/data/bcArticles";
import { ArrowLeft, BookOpen, Calendar, RefreshCw } from "lucide-react";
import { KNOWLEDGE_CENTER_LAST_REVIEWED, formatLongDateSv } from "@/lib/contentFreshness";

// Map legacy productSlugs (used in old indexed URLs) to current hub slugs
const LEGACY_PRODUCT_SLUG_MAP: Record<string, string> = {
  "d365-sales": "sales",
  "d365-customer-service": "customer-service",
  "d365-marketing": "sales",
  "d365-field-service": "customer-service",
  "d365-contact-center": "customer-service",
  "d365-copilot": "copilot",
  "business-central": "business-central",
  "finance-supply-chain": "finance-supply-chain",
};

const KNOWN_HUB_SLUGS = new Set([
  "business-central",
  "finance-supply-chain",
  "sales",
  "customer-service",
  "copilot",
  "upphandling",
  "partners",
]);

const DeepDiveArticle = () => {
  const { productSlug, articleSlug } = useParams();

  const article = ALL_DEEP_DIVE_ARTICLES.find(
    (a) => a.productSlug === productSlug && a.slug === articleSlug
  );

  if (!article) {
    // 301-liknande redirect till närmaste relevanta hub (bevara ranking-signaler)
    const mapped = productSlug ? LEGACY_PRODUCT_SLUG_MAP[productSlug] : undefined;
    const hub = mapped ?? (productSlug && KNOWN_HUB_SLUGS.has(productSlug) ? productSlug : null);
    return <Navigate to={hub ? `/kunskapscenter/${hub}/` : "/kunskapscenter/"} replace />;
  }

  // Find sibling articles for navigation
  const siblings = ALL_DEEP_DIVE_ARTICLES.filter(
    (a) => a.productSlug === productSlug
  );
  const currentIndex = siblings.findIndex((a) => a.slug === articleSlug);
  const prevArticle = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextArticle = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  const articleUrl = `https://d365.se/kunskapscenter/${article.productSlug}/${article.slug}/`;
  const articleImage = article.bannerImage || article.image;
  const fallbackPublished = "2024-01-01T00:00:00+01:00";
  const lastReviewed = KNOWLEDGE_CENTER_LAST_REVIEWED;
  const publishedAt = article.publishedAt ?? fallbackPublished;
  const modifiedAt = article.modifiedAt ?? lastReviewed;

  return (
    <>
      <SEOHead
        title={article.seoTitle ?? `${article.title} | d365.se`}
        description={article.seoDescription ?? article.description}
        canonicalPath={`/kunskapscenter/${article.productSlug}/${article.slug}`}
        ogType="article"
        ogImage={articleImage || "https://d365.se/og-erp.png"}
        ogImageAlt={article.title}
        articlePublishedTime={publishedAt}
        articleModifiedTime={modifiedAt}
        articleAuthor="Thomas Laine"
        articleSection={article.product}
      />
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Kunskapscenter", url: "https://d365.se/kunskapscenter/" },
          { name: article.product, url: `https://d365.se/kunskapscenter/${article.productSlug}/` },
          { name: article.title, url: articleUrl },
        ]}
      />
      <ArticleSchema
        headline={article.title}
        description={article.description}
        url={articleUrl}
        image={articleImage}
        section={article.product}
        datePublished={publishedAt}
        dateModified={modifiedAt}
      />


      <Navbar />
      <main className="min-h-screen bg-background pt-12 lg:pt-28">
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Publicerad: <time dateTime={fallbackPublished}>{formatLongDateSv(fallbackPublished)}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                Senast uppdaterad: <time dateTime={lastReviewed} className="font-medium text-foreground">{formatLongDateSv(lastReviewed)}</time>
              </span>
            </div>
          </div>
        </section>


        {/* Banner image */}
        {(article.bannerImage || (article.image && !article.image.endsWith('.svg'))) && (
          <section className="border-b border-border">
            <div className="container mx-auto px-4 max-w-4xl">
              <img
                src={article.bannerImage || article.image}
                alt={article.title}
                className="w-full rounded-lg "
                loading="eager"
              />
            </div>
          </section>
        )}

        {/* Article content */}
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-4xl">
            {article.productSlug === "copilot" && (
              <aside
                aria-label="Uppdateringsstatus"
                className="mb-8 p-5 rounded border-l-4 border-[hsl(var(--signature))] bg-[hsl(var(--signature))]/5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--signature))] mb-2">
                  Uppdateringsstatus
                </p>
                <p className="text-sm md:text-base leading-relaxed text-foreground/90">
                  Den här artikeln beskriver tidigare Copilot-funktioner i Dynamics 365. Copilot, agenter och AI-landskapet har förändrats snabbt sedan publicering. För en aktuell 2026-vy, se vår översikt om{" "}
                  <Link to="/aioversikt/" className="text-[hsl(var(--signature))] font-semibold hover:underline">
                    Copilot, agenter och AI i Dynamics 365
                  </Link>
                  {" "}– samt fördjupningarna{" "}
                  <Link to="/kunskapscenter/copilot/ai-skiftet-dynamics-365-build-2026/" className="text-[hsl(var(--signature))] font-semibold hover:underline">
                    AI-skiftet (Build 2026)
                  </Link>
                  ,{" "}
                  <Link to="/kunskapscenter/copilot/copilot-cowork-dynamics-365/" className="text-[hsl(var(--signature))] font-semibold hover:underline">
                    Copilot Cowork
                  </Link>
                  {" "}och{" "}
                  <Link to="/agents/" className="text-[hsl(var(--signature))] font-semibold hover:underline">
                    Microsoft Agenter
                  </Link>
                  .
                </p>
              </aside>
            )}
            {article.description && (
              <aside
                aria-label="Sammanfattning"
                className="mb-8 p-5 rounded border-l-4 border-primary bg-primary/5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  Sammanfattning
                </p>
                <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                  {article.description}
                </p>
              </aside>
            )}
            <article className={
              article.slug?.startsWith("tillagg-")
                ? "prose prose-slate dark:prose-invert max-w-[68ch] prose-headings:text-foreground prose-p:text-foreground/85 prose-p:leading-[1.9] prose-p:text-[1.0625rem] prose-li:text-foreground/85 prose-li:leading-[1.8] prose-li:text-[1.0625rem] prose-strong:text-foreground prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-5 prose-h3:mt-10 prose-h3:mb-3 prose-p:mb-7 prose-ul:my-7 prose-li:my-2.5 prose-ul:pl-6"
                : "prose prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-li:leading-relaxed prose-strong:text-foreground prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:mb-5 prose-ul:my-6 prose-li:my-1"
            }>
              {article.content}
            </article>

            {/* Authoritative external sources (Microsoft Learn) */}
            {(() => {
              const learnLinks: Record<string, { label: string; url: string }[]> = {
                "businesscentral": [
                  { label: "Microsoft Learn: Dynamics 365 Business Central", url: "https://learn.microsoft.com/dynamics365/business-central/" },
                  { label: "Microsoft Docs: BC produktöversikt", url: "https://learn.microsoft.com/dynamics365/business-central/across-business-functionality" },
                ],
                "finance": [
                  { label: "Microsoft Learn: Dynamics 365 Finance", url: "https://learn.microsoft.com/dynamics365/finance/" },
                ],
                "supply-chain": [
                  { label: "Microsoft Learn: Dynamics 365 Supply Chain Management", url: "https://learn.microsoft.com/dynamics365/supply-chain/" },
                ],
                "d365sales": [
                  { label: "Microsoft Learn: Dynamics 365 Sales", url: "https://learn.microsoft.com/dynamics365/sales/" },
                ],
                "d365customerservice": [
                  { label: "Microsoft Learn: Dynamics 365 Customer Service", url: "https://learn.microsoft.com/dynamics365/customer-service/" },
                ],
                "d365fieldservice": [
                  { label: "Microsoft Learn: Dynamics 365 Field Service", url: "https://learn.microsoft.com/dynamics365/field-service/" },
                ],
                "d365contactcenter": [
                  { label: "Microsoft Learn: Dynamics 365 Contact Center", url: "https://learn.microsoft.com/dynamics365/contact-center/" },
                ],
                "customer-insights": [
                  { label: "Microsoft Learn: Dynamics 365 Customer Insights", url: "https://learn.microsoft.com/dynamics365/customer-insights/" },
                ],
                "copilot": [
                  { label: "Microsoft Learn: Copilot för Dynamics 365", url: "https://learn.microsoft.com/dynamics365/guidance/develop/" },
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
                  className="mt-10 p-5 rounded border border-border bg-secondary/30"
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
                    Innehållet här är en redaktionell sammanfattning. För fullständig och alltid uppdaterad dokumentation, se Microsofts officiella resurser ovan.
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
                  className="flex-1 group p-4 rounded-lg border border-border hover:border-primary/50  transition-all bg-card"
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
                  className="flex-1 group p-4 rounded-lg border border-border hover:border-primary/50  transition-all bg-card text-right"
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
      <RelatedPages heading="Utforska Dynamics 365" pages={articleRelatedPages} />
      <Footer />
    </>
  );
};

export default DeepDiveArticle;
