import { useState } from "react";
import { Play } from "lucide-react";
import { youtubeThumbnail, youtubeEmbedUrl } from "@/lib/youtube";

interface Props {
  videoId: string;
  title: string;
  className?: string;
}

/**
 * Lätt YouTube-fasad: laddar bara en thumbnail först och byter till <iframe>
 * vid klick. Undviker att blockera LCP och sparar bandbredd.
 */
const YouTubeLite = ({ videoId, title, className = "" }: Props) => {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg border border-border bg-black/5 ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      {active ? (
        <iframe
          src={youtubeEmbedUrl(videoId)}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Spela upp: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          <img
            src={youtubeThumbnail(videoId)}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--cta-orange))] shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="h-6 w-6 fill-white text-white ml-0.5" />
            </span>
          </span>
          <span className="absolute bottom-2 left-2 right-2 text-left text-xs sm:text-sm font-semibold text-white line-clamp-2 drop-shadow">
            {title}
          </span>
        </button>
      )}
    </div>
  );
};

export default YouTubeLite;
