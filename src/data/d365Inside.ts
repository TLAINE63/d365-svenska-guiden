/**
 * d365.se INSIDE – Thomas Laines intervjuserie på YouTube.
 *
 * Kanal-URL:en är verifierad via YouTubes oEmbed (author_url) 2026-10-27.
 * Nya avsnitt läggs in via Redaktion → Videor (YouTube-länk) och visas i
 * INSIDE-sektionen när de publiceras, eftersom kanalnamnet innehåller "INSIDE".
 * Listan nedan är reservdata så att förrenderad HTML alltid visar senaste avsnittet,
 * och kopplar avsnitt till sin artikel på d365.se.
 */

export const D365_INSIDE_CHANNEL_URL = "https://www.youtube.com/@thomaslaine-d365";
export const D365_INSIDE_NAME = "d365.se INSIDE";

export interface D365InsideEpisode {
  youtubeId: string;
  title: string;
  /** ÅÅÅÅ-MM-DD */
  publishedAt: string;
  summary: string;
  /** Artikel på d365.se som bygger på samtalet. */
  articlePath?: string;
  /** Partnerprofil som medverkar i avsnittet. */
  partnerSlug?: string;
  partnerName?: string;
}

export const D365_INSIDE_EPISODES: D365InsideEpisode[] = [
  {
    youtubeId: "DitMX0anlh0",
    title: "Hur väljer bygg- och projektbolag rätt affärssystem? | d365.se INSIDE med 4PS",
    publishedAt: "2026-10-26",
    summary:
      "Thomas Laine samtalar med Anders Östby på 4PS om vad bygg-, installations- och serviceföretag bör reda ut innan de väljer nytt affärssystem.",
    articlePath: "/artiklar/affarssystem-bygg-installation/",
    partnerSlug: "4ps-sweden",
    partnerName: "4PS",
  },
];

/** Matchar videor från INSIDE-kanalen i videobiblioteket (kanalnamn från YouTube). */
export function isD365InsideChannel(channelName: string | null | undefined): boolean {
  return /inside/i.test(channelName ?? "");
}
