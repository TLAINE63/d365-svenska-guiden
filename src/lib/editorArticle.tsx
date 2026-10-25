import type { BlogArticle } from "@/data/blogArticles";

/**
 * Helartiklar som redaktionen laddat upp från Word i /redaktion.
 * De lagras i artikelregistret (body_html) och visas på /artiklar/<adress>/
 * med samma sidmall som de kodade artiklarna.
 */
export interface EditorArticleRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  published_at: string | null;
  updated_at: string | null;
  body_html: string;
  meta_title: string | null;
  meta_description: string | null;
  hero_caption: string | null;
  article_section: string | null;
  tags: string[] | null;
  reading_time_minutes: number | null;
}

export const EDITOR_ARTICLE_PUBLIC_SELECT =
  "id,slug,title,description,image_url,published_at,updated_at,body_html,meta_title,meta_description,hero_caption,article_section,tags,reading_time_minutes";

export const EDITOR_ARTICLE_AUTHOR = {
  name: "Thomas Laine",
  role: "Grundare, d365.se",
  url: "https://d365.se/om-thomas-laine/",
};

/** Gör om en databasrad till samma form som de kodade artiklarna, så sidmallen kan återanvändas. */
export function editorRowToBlogArticle(row: EditorArticleRow): BlogArticle {
  const summary = row.description?.trim() || "";
  return {
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title?.trim() || row.title,
    metaDescription: row.meta_description?.trim() || summary,
    summary,
    category: row.article_section?.trim() || "Artikel",
    tags: row.tags ?? [],
    products: [],
    publishedAt: row.published_at || row.updated_at || new Date().toISOString(),
    author: EDITOR_ARTICLE_AUTHOR,
    heroImage: row.image_url || "",
    heroCaption: row.hero_caption || undefined,
    readingTimeMinutes: row.reading_time_minutes || 5,
    content: <div dangerouslySetInnerHTML={{ __html: row.body_html }} />,
  };
}
