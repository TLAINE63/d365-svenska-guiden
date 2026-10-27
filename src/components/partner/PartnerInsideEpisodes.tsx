import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Youtube } from "lucide-react";
import YouTubeLite from "@/components/YouTubeLite";
import { D365_INSIDE_CHANNEL_URL, D365_INSIDE_NAME, episodesForPartner } from "@/data/d365Inside";
import { formatDateYYYYMMDD } from "@/lib/utils";

interface Props {
  partnerSlug: string;
  partnerName: string;
}

const channelLink = `${D365_INSIDE_CHANNEL_URL}?utm_source=d365.se&utm_medium=referral&utm_campaign=d365-inside-partnerprofil`;

/**
 * Avsnitt av d365.se INSIDE där partnern medverkar. Kopplingen sätts uttryckligen
 * per avsnitt i d365Inside.ts (partnerSlug), så den är statisk och SSG-säker.
 * Visas bara när partnern har minst ett avsnitt.
 */
export default function PartnerInsideEpisodes({ partnerSlug, partnerName }: Props) {
  const episodes = episodesForPartner(partnerSlug);
  if (episodes.length === 0) return null;

  return (
    <section className="py-8" aria-labelledby="partner-inside-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-primary/10 text-primary">
            <Youtube className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 id="partner-inside-heading" className="text-xl font-bold text-foreground tracking-tight">
            {partnerName} i {D365_INSIDE_NAME}
          </h2>
        </div>
        <ul className="grid gap-6">
          {episodes.map((e) => (
            <li key={e.youtubeId} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <YouTubeLite videoId={e.youtubeId} title={e.title} />
              <div className="space-y-2 p-4">
                <h3 className="text-base font-semibold leading-snug text-foreground">{e.title}</h3>
                {e.summary && <p className="text-sm leading-relaxed text-muted-foreground">{e.summary}</p>}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm">
                  {e.publishedAt && (
                    <span className="text-xs text-muted-foreground">{formatDateYYYYMMDD(e.publishedAt)}</span>
                  )}
                  {e.articlePath && (
                    <Link to={e.articlePath} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                      Läs artikeln om samtalet <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  )}
                  <a
                    href={channelLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    Fler samtal på YouTube <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
