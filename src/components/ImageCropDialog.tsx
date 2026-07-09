import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Props {
  open: boolean;
  imageSrc: string | null;
  aspect?: number;
  onCancel: () => void;
  onCropped: (blob: Blob) => void;
}

async function getCroppedBlob(imageSrc: string, area: Area, mime: string): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });
  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Kunde inte skapa bild"))), mime, 0.92);
  });
}

export default function ImageCropDialog({ open, imageSrc, aspect = 16 / 9, onCancel, onCropped }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);

  const handleSave = async () => {
    if (!imageSrc || !area) return;
    setBusy(true);
    try {
      const mime = imageSrc.startsWith("data:image/png") ? "image/png" : "image/jpeg";
      const blob = await getCroppedBlob(imageSrc, area, mime);
      onCropped(blob);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Beskär bild (16:9)</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[360px] bg-muted rounded-md overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onComplete}
            />
          )}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm text-muted-foreground w-16">Zoom</span>
          <Slider value={[zoom]} min={1} max={4} step={0.05} onValueChange={(v) => setZoom(v[0])} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={busy}>Avbryt</Button>
          <Button onClick={handleSave} disabled={busy || !area}>{busy ? "Bearbetar…" : "Använd beskärning"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
