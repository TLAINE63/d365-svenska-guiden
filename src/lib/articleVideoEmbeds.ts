import { extractYouTubeId } from "./youtube";

/**
 * Delar artikel-HTML vid stycken som bara innehåller en YouTube-länk, så att
 * klippet kan visas som spelare just där redaktören placerat det i Word.
 * Länkar mitt i löpande text lämnas orörda. Ren strängfunktion (SSR-säker).
 */
export type ArticlePart = { type: "html"; html: string } | { type: "video"; id: string };

const YT = String.raw`https?:\/\/(?:www\.|m\.)?(?:youtu\.be|youtube\.com)\/[^\s"'<>]+`;
const STANDALONE = new RegExp(
  String.raw`<p[^>]*>\s*(?:<a[^>]*href=["'](${YT})["'][^>]*>[\s\S]*?<\/a>|(${YT}))\s*<\/p>`,
  "gi"
);

const decode = (s: string) => s.replace(/&amp;/g, "&");

export function splitArticleVideos(html: string): ArticlePart[] {
  const parts: ArticlePart[] = [];
  let last = 0;
  for (const m of html.matchAll(STANDALONE)) {
    const id = extractYouTubeId(decode(m[1] || m[2] || ""));
    if (!id || !/youtu/i.test(m[1] || m[2] || "")) continue;
    if (m.index! > last) parts.push({ type: "html", html: html.slice(last, m.index) });
    parts.push({ type: "video", id });
    last = m.index! + m[0].length;
  }
  if (last < html.length) parts.push({ type: "html", html: html.slice(last) });
  return parts;
}
