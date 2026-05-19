import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface PartnerVideoModalProps {
  videoId: string | null;
  partnerName: string;
  onClose: () => void;
}

const PartnerVideoModal = ({ videoId, partnerName, onClose }: PartnerVideoModalProps) => {
  return (
    <Dialog open={!!videoId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-0">
        <VisuallyHidden>
          <DialogTitle>Video från {partnerName}</DialogTitle>
        </VisuallyHidden>
        {videoId && (
          <div className="aspect-video w-full">
            <iframe
              src={youtubeEmbedUrl(videoId)}
              title={`Video från ${partnerName}`}
              className="w-full h-full"
              width="1280"
              height="720"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PartnerVideoModal;
