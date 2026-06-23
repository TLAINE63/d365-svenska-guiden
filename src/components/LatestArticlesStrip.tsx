import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BLOG_ARTICLES, type BlogArticle } from "@/data/blogArticles";

const formatDate = (iso: string) => iso.replace(/-/g, "/");

interface Props {
  /** Slug to exclude (e.g. the featured one shown above). */
  excludeSlug?: string;
  count?: number;
}

const getPool = (excludeSlug?: string) =>
  BLOG_ARTICLES.filter(
    (a) => a.category === "Branschguide" && a.slug !== excludeSlug,
  );

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Compact strip showing random "Branscher & Partners" (Branschguide) articles
 * from the Knowledge Center. Re-randomizes on each page load.
 */
const LatestArticlesStrip = ({ excludeSlug, count = 3 }: Props) => {
  // Stable initial pick to avoid SSG/hydration mismatch; randomize after mount.
  const [latest, setLatest] = useState<BlogArticle[]>(() =>
    getPool(excludeSlug).slice(0, count),
  );

  useEffect(() => {
    setLatest(shuffle(getPool(excludeSlug)).slice(0, count));
  }, [excludeSlug, count]);

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
