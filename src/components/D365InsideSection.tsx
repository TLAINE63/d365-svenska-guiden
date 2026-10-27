import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import YouTubeLite from "@/components/YouTubeLite";
import insideBanner from "@/assets/d365-inside-banner.webp.asset.json";
import {
  D365_INSIDE_CHANNEL_URL,
  D365_INSIDE_EPISODES,
  D365_INSIDE_NAME,
  type D365InsideEpisode,
} from "@/data/d365Inside";

interface Props {
  /** Rubriknivå för sektionsrubriken, så sidans rubrikordning hålls. */
  headingLevel?: "h2" | "h3";
  className?: string;
}

const channelLink = `${D365_INSIDE_CHANNEL_URL}?utm_source=d365.se&utm_medium=referral&utm_campaign=d365-inside`;

/**
 * Sektion för d365.se INSIDE: senaste avsnittet, tidigare avsnitt och länk till
 * YouTube-kanalen. Publicerade avsnitt i videobiblioteket (kanalnamn med "INSIDE")
 * slås ihop med reservlistan så att nya avsnitt dyker upp utan kodändring.
 */
export default function D365InsideSection({ headingLevel = "h2", className = "" }: Props) {
  const [dbEpisodes, setDbEpisodes] = useState<D365InsideEpisode[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("d365_videos")
        .select("youtube_id, title, published_at, summary_sv")
        .eq("status", "published")
        .ilike("channel_name", "%inside%")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(12);
      if (!active || !data) return;
      setDbEpisodes(
        data.map((v) => ({
          youtubeId: v.youtube_id,
          title: v.title,
          publishedAt: (v.published_at ?? "").slice(0, 10),
          summary: v.summary_sv ?? "",
        })),
      );
    })();
    return () => {
      active = false;
    };
  }, []);

  const episodes = useMemo(() => {
    const byId = new Map<string, D365InsideEpisode>();
    for (const e of D365_INSIDE_EPISODES) byId.set(e.youtubeId, e);
    for (const e of dbEpisodes) {
      const known = byId.get(e.youtubeId);
      byId.set(e.youtubeId, known ? { ...e, ...known } : e);
    }
    return [...byId.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [dbEpisodes]);

  const [latest, ...earlier] = episodes;
  const Heading = headingLevel;
  const SubHeading = headingLevel === "h2" ? "h3" : "h4";

  return (
    <section
      aria-labelledby="d365-inside-heading"
      className={`overflow-hidden rounded-xl border border-border bg-[hsl(var(--hero-dark))] text-primary-foreground shadow-lg ${className}`}
    >
      <img
        src={insideBanner.url}
        alt="d365.se INSIDE med Thomas Laine"
        width={1600}
        height={640}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--accent-dark-zone))]">
            <Youtube className="h-4 w-4" aria-hidden="true" /> Intervjuserie på YouTube
          </p>
          <Heading id="d365-inside-heading" className="mt-2 text-2xl md:text-3xl font-bold">
            {D365_INSIDE_NAME}
          </Heading>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-primary-foreground/80">
            I {D365_INSIDE_NAME} möter Thomas Laine företag och personer i
            Dynamics&nbsp;365-ekosystemet för att komma närmare lösningarna, erfarenheterna och
            människorna bakom dem. Varje avsnitt har en artikel på d365.se med de viktigaste
            frågorna från samtalet.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={channelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Till YouTube-kanalen <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            {latest?.articlePath && (
              <Link
                to={latest.articlePath}
                className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10"
              >
                Läs artikeln <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        {latest && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
              Senaste avsnittet · {latest.publishedAt}
            </p>
            <YouTubeLite videoId={latest.youtubeId} title={latest.title} className="mt-2 border-primary-foreground/20" />
            <SubHeading className="mt-3 text-base font-semibold leading-snug">{latest.title}</SubHeading>
            {latest.summary && (
              <p className="mt-1 text-sm text-primary-foreground/75">{latest.summary}</p>
            )}
            {latest.partnerSlug && latest.partnerName && (
              <Link
                to={`/partners/${latest.partnerSlug}`}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--accent-dark-zone))] hover:underline"
              >
                Se partnerprofilen för {latest.partnerName} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </div>

      {earlier.length > 0 && (
        <div className="border-t border-primary-foreground/15 px-6 py-6 md:px-8">
          <SubHeading className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
            Tidigare avsnitt
          </SubHeading>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {earlier.map((e) => (
              <li key={e.youtubeId}>
                <YouTubeLite videoId={e.youtubeId} title={e.title} className="border-primary-foreground/20" />
                <p className="mt-2 text-xs text-primary-foreground/60">{e.publishedAt}</p>
                {e.articlePath && (
                  <Link to={e.articlePath} className="text-sm font-medium text-[hsl(var(--accent-dark-zone))] hover:underline">
                    Läs artikeln
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
