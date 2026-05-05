import { useEffect, useState } from "react";
import { BLOG_ARTICLES, type BlogArticle } from "@/data/blogArticles";
import FeaturedArticleBannerView from "@/components/FeaturedArticleBannerView";

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
    <div className="mb-6 sm:mb-8">
      <FeaturedArticleBannerView article={article} />
    </div>
  );
};

export default FeaturedArticleBanner;

