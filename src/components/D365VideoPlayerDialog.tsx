import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { D365Video } from "@/hooks/useD365Videos";

interface Props {
  video: D365Video | null;
  onOpenChange: (open: boolean) => void;
}

export default function D365VideoPlayerDialog({ video, onOpenChange }: Props) {
  return (
    <Dialog open={!!video} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-base pr-6">{video?.title}</DialogTitle>
        </DialogHeader>
        {video && (
          <div className="space-y-3">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${video.youtube_id}?autoplay=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            {video.summary_sv && <p className="text-sm text-muted-foreground">{video.summary_sv}</p>}
            <a
              href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline"
            >
              Öppna på YouTube
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
