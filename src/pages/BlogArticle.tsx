import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BLOG_ARTICLES, getBlogArticleBySlug } from "@/data/blogArticles";

const formatDateSv = (iso: string) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

const BlogArticle = () => {
  const { slug } = useParams();
  const article = slug ? getBlogArticleBySlug(slug) : undefined;

  if (!article) {
    return <Navigate to="/kunskapscenter/" replace />;
  }

  const canonicalPath = `/artiklar/${article.slug}`;
  const canonicalUrl = `https://d365.se${canonicalPath}/`;
  const ogImage = `https://d365.se${article.heroImage.startsWith("/") ? article.heroImage : "/og-erp.png"}`;

  // Schema.org Article with author
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: ogImage,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    inLanguage: "sv-SE",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
      ...(article.author.url ? { url: article.author.url } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "d365.se",
      logo: {
        "@type": "ImageObject",
        url: "https://www.d365.se/d365guide-logo.png",
      },
    },
    keywords: article.tags.join(", "),
    articleSection: article.category,
  };

  // Find related articles (other than current)
  const related = BLOG_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <SEOHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonicalPath={canonicalPath}
        keywords={article.tags.join(", ")}
        ogImage={ogImage}
        ogType="article"
      />
      <Helmet>
        <meta name="author" content={article.author.name} />
        <meta property="article:author" content={article.author.name} />
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:section" content={article.category} />
        {article.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Kunskapscenter", url: "https://d365.se/kunskapscenter/" },
          { name: "Artiklar", url: "https://d365.se/kunskapscenter/?kategori=artikel" },
          { name: article.title, url: canonicalUrl },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        {/* Header */}
        <section className="border-b border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/kunskapscenter/" className="hover:text-primary transition-colors">
                Kunskapscenter
              </Link>
              <span>/</span>
              <span className="text-foreground">Artikel</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-secondary text-secondary-foreground border-border hover:bg-secondary">
                Artikel
              </Badge>
              <Badge variant="outline" className="border-primary/40 text-primary">
                {article.category}
              </Badge>
            </div>

            <h1 className="text-xl md:text-3xl font-bold text-foreground leading-tight tracking-tight text-balance">
              {article.title}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl text-base md:text-lg leading-relaxed">
              {article.summary}
            </p>

            {/* Meta row */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="text-foreground font-medium">{article.author.name}</span>
                <span className="text-muted-foreground">— {article.author.role}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDateSv(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readingTimeMinutes} min läsning
              </span>
            </div>
          </div>
        </section>

        {/* Hero image */}
        {article.heroImage && (
          <section className="border-b border-border">
            <div className="container mx-auto px-4 max-w-4xl py-6">
              <img
                src={article.heroImage}
                alt={article.title}
                className="w-full rounded-xl shadow-md aspect-[2/1] object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </section>
        )}

        {/* Article content */}
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-3xl">
            <article
              className="
                article-body max-w-none
                text-[1.0625rem] md:text-[1.125rem] leading-[1.75] text-foreground/90
                [&_p]:mb-5 [&_p]:leading-[1.75]
                [&_h2]:font-bold [&_h2]:text-[1.6rem] md:[&_h2]:text-[1.875rem] [&_h2]:tracking-tight [&_h2]:text-[#1F4E79] [&_h2]:mt-12 [&_h2]:mb-5
                [&_h3]:font-semibold [&_h3]:text-[1.25rem] md:[&_h3]:text-[1.375rem] [&_h3]:text-[#1F4E79] [&_h3]:mt-9 [&_h3]:mb-3
                [&_ul]:my-6 [&_ul]:pl-7 [&_ul]:space-y-2 [&_ul>li]:list-disc [&_ul>li]:marker:text-[#1F4E79] [&_ul>li]:pl-2
                [&_ol]:my-6 [&_ol]:pl-7 [&_ol]:space-y-2 [&_ol>li]:list-decimal
                [&_strong]:text-foreground [&_strong]:font-semibold
                [&_em]:italic
                [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80
              "
            >
              {article.content}
            </article>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-border">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author card */}
            <div className="mt-10 p-6 rounded-xl border border-border bg-card">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Om författaren
              </p>
              <p className="text-lg font-semibold text-foreground">{article.author.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{article.author.role}</p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Thomas Laine arbetar med både CRM och ERP, med särskilt fokus på Microsoft
                Dynamics 365, och har över 30 års erfarenhet i branschen. Artiklarna
                publiceras via d365.se, en oberoende kunskapsplattform om ERP, CRM och
                partnerval.
              </p>
              <Link
                to="/kontakt/"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 mt-4 font-medium"
              >
                Kontakta Thomas →
              </Link>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-border bg-secondary/20 py-10">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-lg font-semibold text-foreground mb-4">Fler artiklar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/artiklar/${r.slug}/`}
                    className="group block p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                      {r.category}
                    </p>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary line-clamp-3">
                      {r.title}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Link
                  to="/kunskapscenter/"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Tillbaka till Kunskapscenter
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default BlogArticle;
