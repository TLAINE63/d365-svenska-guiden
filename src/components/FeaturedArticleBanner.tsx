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

  const targetUrl = `/artiklar/${article.slug}/?ref=kc-banner`;

  const trackClick = (placement: "card" | "cta") => {
    try {
      const w = window as unknown as {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
      };
      const payload = {
        event_category: "kunskapscenter_banner",
        event_label: article.slug,
        article_title: article.title,
        placement,
      };
      if (typeof w.gtag === "function") {
        w.gtag("event", "kc_banner_click", payload);
      } else if (Array.isArray(w.dataLayer)) {
        w.dataLayer.push({ event: "kc_banner_click", ...payload });
      }
    } catch {
      // tracking is best-effort
    }
  };

  return (
    <article
      className="group relative mb-10 sm:mb-12 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden focus-within:ring-2 focus-within:ring-[hsl(var(--cta-orange))] focus-within:ring-offset-2 focus-within:ring-offset-background"
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
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Nytt i Kunskapscentret
              </span>
              <span className="text-[11px] text-muted-foreground">
                {formatDate(article.publishedAt)}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors">
              {/* Stretched link makes the whole card clickable while keeping CTA the primary focusable element */}
              <Link
                to={targetUrl}
                onClick={() => trackClick("card")}
                aria-label={`Nytt i Kunskapscentret: ${article.title} – läs artikeln`}
                title={article.title}
                tabIndex={-1}
                className="before:absolute before:inset-0 before:content-[''] before:rounded-2xl outline-none"
              >
                {article.title}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          </div>
          <div className="shrink-0 sm:pl-2">
            <Link
              to={targetUrl}
              onClick={(e) => {
                e.stopPropagation();
                trackClick("cta");
              }}
              aria-label={`Läs artikeln: ${article.title}`}
              data-cta="kc-banner"
              className="relative z-10 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--cta-orange))] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cta-orange))] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Läs artikeln
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticleBanner;
