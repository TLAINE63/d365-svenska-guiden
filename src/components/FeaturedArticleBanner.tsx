import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { BLOG_ARTICLES, type BlogArticle } from "@/data/blogArticles";

const formatDate = (iso: string) => iso.replace(/-/g, "/");

const pickDefault = (): BlogArticle | undefined =>
  BLOG_ARTICLES.find((a) => a.featured) ??
  [...BLOG_ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];

const FeaturedArticleBanner = () => {
  const [article, setArticle] = useState<BlogArticle | undefined>(pickDefault);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-public-setting&key=featured_article_slug`;
        const res = await fetch(url, {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        const slug = (data?.value ?? "").trim();
        if (cancelled) return;
        if (slug) {
          const found = BLOG_ARTICLES.find((a) => a.slug === slug);
          if (found) setArticle(found);
        } else {
          // explicit "auto" — newest by date
          setArticle(
            [...BLOG_ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0]
          );
        }
      } catch {
        // keep default
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!article) return null;

  return (
    <Link
      to={`/artiklar/${article.slug}/?ref=kc-banner`}
      aria-label={`Nytt i Kunskapscentret: ${article.title} – läs artikeln`}
      title={article.title}
      className="group block mb-10 sm:mb-12 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-stretch">
        <div
          className="w-full sm:w-48 md:w-56 h-32 sm:h-auto bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${article.heroImage})` }}
          aria-hidden="true"
        />
        <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--cta-orange))]">
                <Sparkles className="w-3.5 h-3.5" />
                Nytt i Kunskapscentret
              </span>
              <span className="text-[11px] text-muted-foreground">
                {formatDate(article.publishedAt)}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-primary shrink-0 sm:pl-2">
            Läs artikeln
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedArticleBanner;
