import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { BLOG_ARTICLES } from "@/data/blogArticles";

const formatDate = (iso: string) => iso.replaceAll("-", "/");

const FeaturedArticleBanner = () => {
  const featured =
    BLOG_ARTICLES.find((a) => a.featured) ??
    [...BLOG_ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];

  if (!featured) return null;

  return (
    <Link
      to={`/artiklar/${featured.slug}/`}
      className="group block mb-10 sm:mb-12 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-stretch">
        <div
          className="w-full sm:w-48 md:w-56 h-32 sm:h-auto bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${featured.heroImage})` }}
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
                {formatDate(featured.publishedAt)}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors">
              {featured.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {featured.summary}
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
