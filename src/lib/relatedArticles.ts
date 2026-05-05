import type { BlogArticle } from "@/data/blogArticles";

/**
 * Rankar artiklar baserat på överlapp i taggar, kategori och produkter.
 * Vikter: tag=3, kategori=4, produkt=2. Tie-break: nyast publicerad först.
 */
export const getRelatedArticles = (
  current: BlogArticle,
  pool: BlogArticle[],
  limit = 3
): BlogArticle[] => {
  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));
  const currentProducts = new Set(current.products.map((p) => p.toLowerCase()));
  const currentCategory = current.category.toLowerCase();

  type Scored = { article: BlogArticle; score: number };

  const scored: Scored[] = pool
    .filter((a) => a.slug !== current.slug)
    .map((a) => {
      const tagOverlap = a.tags.filter((t) => currentTags.has(t.toLowerCase())).length;
      const productOverlap = a.products.filter((p) =>
        currentProducts.has(p.toLowerCase())
      ).length;
      const categoryMatch = a.category.toLowerCase() === currentCategory ? 1 : 0;
      const score = tagOverlap * 3 + categoryMatch * 4 + productOverlap * 2;
      return { article: a, score };
    });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.article.publishedAt.localeCompare(a.article.publishedAt);
  });

  // Säkerställ minst `limit` resultat även om inget överlapp finns – fyll på med nyast
  const picked = scored.slice(0, limit).map((s) => s.article);
  if (picked.length < limit) {
    const fallback = pool
      .filter((a) => a.slug !== current.slug && !picked.includes(a))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, limit - picked.length);
    picked.push(...fallback);
  }
  return picked;
};
