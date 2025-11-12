import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoCardProps {
  title: string;
  description: string;
  videoId: string;
}

const VideoCard = ({ title, description, videoId }: VideoCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-hover)] border-border bg-card">
      <CardHeader className="space-y-1.5 p-4 sm:p-5">
        <CardTitle className="text-base sm:text-lg text-card-foreground">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 pt-0">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
