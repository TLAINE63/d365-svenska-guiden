import { useEffect, useState } from "react";
import { BLOG_ARTICLES, type BlogArticle } from "@/data/blogArticles";
import FeaturedArticleBannerView from "@/components/FeaturedArticleBannerView";

const getBranschArticles = (): BlogArticle[] =>
  BLOG_ARTICLES.filter((a) => a.category === "Branschguide");

const pickRandomBransch = (): BlogArticle | undefined => {
  const pool = getBranschArticles();
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)];
};

const FeaturedArticleBanner = () => {
  // Start with a stable pick to avoid SSG/hydration mismatch; randomize after mount.
  const [article, setArticle] = useState<BlogArticle | undefined>(
    () => getBranschArticles()[0] ?? BLOG_ARTICLES[0]
  );

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
        const slug = res.ok ? ((await res.json())?.value ?? "").trim() : "";
        if (cancelled) return;
        if (slug) {
          const found = BLOG_ARTICLES.find((a) => a.slug === slug);
          if (found) {
            setArticle(found);
            return;
          }
        }
        // No admin override → randomize a Branschguide article on each visit.
        const picked = pickRandomBransch();
        if (picked) setArticle(picked);
      } catch {
        const picked = pickRandomBransch();
        if (!cancelled && picked) setArticle(picked);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!article) return null;

  return (
    <div className="mb-6 sm:mb-8">
      <FeaturedArticleBannerView article={article} />
    </div>
  );
};

export default FeaturedArticleBanner;
