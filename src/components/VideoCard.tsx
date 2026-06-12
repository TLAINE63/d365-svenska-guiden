import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

interface VideoCardProps {
  title: string;
  description: string;
  videoId: string;
  /** ISO 8601 upload/production date, e.g. "2025-01-23" or full datetime */
  uploadDate?: string;
}

const formatDateSv = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

const VideoCard = ({ title, description, videoId, uploadDate }: VideoCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = () => {
    setIsLoaded(true);
  };

  const videoSchema = uploadDate
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title,
        description,
        thumbnailUrl: [
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        ],
        uploadDate,
        contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      }
    : null;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-hover)] border-border bg-card">
      {videoSchema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
        </Helmet>
      )}
      <CardHeader className="space-y-1.5 p-4 sm:p-5">
        <CardTitle className="text-base sm:text-lg text-card-foreground">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 pt-0">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          {isLoaded ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
              title={title}
              width="1280"
              height="720"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={handleClick}
              className="absolute inset-0 w-full h-full cursor-pointer group"
              aria-label={`Spela video: ${title}`}
            >
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={title}
                className="w-full h-full object-cover"
                width="1280"
                height="720"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />

              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-destructive rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-destructive-foreground ml-1" fill="currentColor" />
                </div>
              </div>
            </button>
          )}
        </div>
        {uploadDate && (
          <p className="mt-3 text-xs text-muted-foreground">
            Publicerad: <time dateTime={uploadDate}>{formatDateSv(uploadDate)}</time>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoCard;
