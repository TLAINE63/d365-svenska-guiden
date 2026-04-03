import { useParams, Link, Navigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
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
                Fördjupning – {article.product}
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

        {/* Article content */}
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-li:leading-relaxed prose-strong:text-foreground prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:mb-5 prose-ul:my-6 prose-li:my-1">
              {article.content}
            </article>
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

            <div className="mt-6 text-center">
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
