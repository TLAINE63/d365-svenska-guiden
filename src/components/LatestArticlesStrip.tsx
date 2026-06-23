import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BLOG_ARTICLES } from "@/data/blogArticles";

const formatDate = (iso: string) => iso.replace(/-/g, "/");

interface Props {
  /** Slug to exclude (e.g. the featured one shown above). */
  excludeSlug?: string;
  count?: number;
}

/**
 * Compact strip showing the most recent blog articles to signal that the
 * site is actively maintained. Designed to sit directly below the featured
 * article banner on the homepage.
 */
const LatestArticlesStrip = ({ excludeSlug, count = 3 }: Props) => {
  const latest = [...BLOG_ARTICLES]
    .filter((a) => a.slug !== excludeSlug)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, count);

  if (latest.length === 0) return null;

  return (
    <div className="mt-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Senaste artiklarna
        </h3>
        <Link
          to="/kunskapscenter/"
          className="text-xs font-semibold text-primary hover:underline"
        >
          Alla artiklar →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {latest.map((a) => (
          <Link
            key={a.slug}
            to={`/artiklar/${a.slug}/`}
            className="group flex flex-col bg-card border border-border rounded p-4 hover:border-primary/50 hover:-translate-y-0.5 transition-all"
          >
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--signature))] mb-1.5">
              {a.category}
            </span>
            <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary line-clamp-2 mb-2">
              {a.title}
            </h4>
            <div className="mt-auto flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{formatDate(a.publishedAt)}</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestArticlesStrip;
