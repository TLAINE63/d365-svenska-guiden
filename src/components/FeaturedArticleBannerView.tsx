import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import type { BlogArticle } from "@/data/blogArticles";

const formatDate = (iso: string) => iso.replace(/-/g, "/");

interface Props {
  article: BlogArticle;
  /** When true, links are inert (used in admin preview). */
  preview?: boolean;
}

/**
 * Presentational banner. Used by FeaturedArticleBanner (live data) and the
 * admin responsive preview. Keeping it presentational means the visual layout
 * stays identical across both contexts.
 */
const FeaturedArticleBannerView = ({ article, preview = false }: Props) => {
  const targetUrl = `/artiklar/${article.slug}/?ref=kc-banner`;

  const trackClick = (placement: "card" | "cta") => {
    if (preview) return;
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
      // best-effort
    }
  };

  const linkProps = preview
    ? {
        onClick: (e: React.MouseEvent) => e.preventDefault(),
        tabIndex: -1,
        "aria-disabled": true as const,
      }
    : {};

  return (
    <article
      className="group relative rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden focus-within:ring-2 focus-within:ring-[hsl(var(--cta-orange))] focus-within:ring-offset-2 focus-within:ring-offset-background"
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
              <Link
                to={targetUrl}
                onClick={(e) => {
                  if (preview) {
                    e.preventDefault();
                    return;
                  }
                  trackClick("card");
                }}
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
                if (preview) {
                  e.preventDefault();
                  return;
                }
                e.stopPropagation();
                trackClick("cta");
              }}
              {...linkProps}
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

export default FeaturedArticleBannerView;
