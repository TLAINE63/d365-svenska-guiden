import type { BlogArticle } from "@/data/blogArticles";
import YouTubeLite from "@/components/YouTubeLite";
import { splitArticleVideos } from "@/lib/articleVideoEmbeds";
import { sanitizeArticleHtml } from "@/lib/sanitizeArticleHtml";
import { D365_INSIDE_CHANNEL_URL } from "@/data/d365Inside";

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
  source_url?: string | null;
  source_name?: string | null;
}

export const EDITOR_ARTICLE_PUBLIC_SELECT =
  "id,slug,title,description,image_url,published_at,updated_at,body_html,meta_title,meta_description,hero_caption,article_section,tags,reading_time_minutes,source_url,source_name";

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
    content: (
      <div>
        {splitArticleVideos(row.body_html).map((part, i) =>
          part.type === "video" ? (
            <figure key={i} className="my-6 not-prose">
              <YouTubeLite videoId={part.id} title={`Videoklipp: ${row.title}`} />
              <figcaption className="mt-2 text-sm text-muted-foreground">
                Klipp från d365.se INSIDE.{" "}
                <a href={D365_INSIDE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="underline">
                  Se alla samtal på YouTube
                </a>
              </figcaption>
            </figure>
          ) : (
            <div key={i} dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(part.html) }} />
          )
        )}
      </div>
    ),
  };
}

/** Primärkälla (t.ex. Microsofts originalartikel) plus Microsoft-länkar i Word-texten, för SourcesAndMethod. */
export function editorArticleSources(row: EditorArticleRow): import("@/lib/guideSources").GuideSource[] {
  const out = new Map<string, import("@/lib/guideSources").GuideSource>();
  // Känd primärkälla för Ignite 2026-analysen om redaktören inte angett källadress.
  const IGNITE_2026 = /flyttar in i copilot|ignite[- ]2026/i.test(`${row.title} ${row.slug}`);
  const primary = row.source_url?.trim() || (IGNITE_2026 ? "https://www.microsoft.com/en-us/dynamics-365/blog/business-leader/2026/11/17/microsoft-ignite-2026-introducing-dynamics-365-in-copilot/" : "");
  if (IGNITE_2026 && !row.source_name) row = { ...row, source_name: "Microsoft Ignite 2026: Introducing Dynamics\u00A0365 in Copilot" };
  if (primary && /^https:\/\//.test(primary)) {
    out.set(primary, { name: `Primärkälla: ${row.source_name?.trim() || "Microsofts originalartikel"}`, href: primary, supports: "Originalkällan som artikeln analyserar. Läs vår svenska analys först och gå sedan vidare till originalet." });
  }
  for (const m of (row.body_html || "").matchAll(/href="(https:\/\/[^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    try {
      const host = new URL(href).hostname;
      if ((host === "microsoft.com" || host.endsWith(".microsoft.com")) && !out.has(href)) out.set(href, { name: host === "learn.microsoft.com" ? "Microsoft produktdokumentation" : "Microsofts publicerade information", href, supports: "Extern hänvisning i artikeln. Källan stöder inte automatiskt d365.se:s slutsatser." });
    } catch { /* ogiltig länk */ }
  }
  return [...out.values()];
}
