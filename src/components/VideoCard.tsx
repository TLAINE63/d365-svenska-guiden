import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

interface VideoCardProps {
  title: string;
  description: string;
  videoId: string;
}

const VideoCard = ({ title, description, videoId }: VideoCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = () => {
    setIsLoaded(true);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-hover)] border-border bg-card">
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
                loading="lazy"
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
      </CardContent>
    </Card>
  );
};

export default VideoCard;
