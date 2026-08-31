import { ALL_DEEP_DIVE_ARTICLES } from "./bcArticles";
import { BLOG_ARTICLES } from "./blogArticles";
import { KNOWLEDGE_VIDEOS } from "./knowledgeVideos";
import { ERP_COMPARISONS } from "./erpComparisons";
import industryPages from "./industryPages.json";

/**
 * Totalt antal publicerade kunskapsresurser som visas i Kunskapscenter
 * och relaterade navigeringsytor: bloggartiklar, produktfördjupningar,
 * videos, branschguider/industrisidor och jämförelseguider.
 *
 * Talet är byggt statiskt vid byggtid så att startsidan kan förrenderas
 * (SSG). Dynamiska kunskapsartiklar från databasen hanteras separat i
 * Kunskapscenter för att undvika dubbletträkning med statiskt innehåll.
 */
export const KNOWLEDGE_CONTENT_COUNT =
  BLOG_ARTICLES.length +
  ALL_DEEP_DIVE_ARTICLES.length +
  KNOWLEDGE_VIDEOS.length +
  industryPages.length +
  ERP_COMPARISONS.length;
