import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import type { D365Video } from "@/hooks/useD365Videos";
import { videoProductLabel, videoQuestionLabel } from "@/lib/d365VideoTaxonomy";

interface Props {
  video: D365Video;
  onPlay: (video: D365Video) => void;
}

export default function D365VideoCard({ video, onPlay }: Props) {
  const thumb = video.thumbnail_url || `https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg`;
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group text-left rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img
          src={thumb}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="rounded-full bg-background/90 p-3">
            <Play className="h-5 w-5 text-primary" />
          </span>
        </span>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2">{video.title}</h3>
        {video.summary_sv && (
          <p className="text-xs text-muted-foreground line-clamp-3">{video.summary_sv}</p>
        )}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {video.product_groups.slice(0, 2).map((p) => (
            <Badge key={p} variant="secondary" className="text-[10px]">
              {videoProductLabel(p)}
            </Badge>
          ))}
          {video.question_types.slice(0, 1).map((q) => (
            <Badge key={q} variant="outline" className="text-[10px]">
              {videoQuestionLabel(q)}
            </Badge>
          ))}
        </div>
        {video.channel_name && (
          <p className="text-[11px] text-muted-foreground pt-1">{video.channel_name}</p>
        )}
      </div>
    </button>
  );
}
