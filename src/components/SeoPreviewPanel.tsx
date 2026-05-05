import { useEffect, useState } from "react";
import { META_DESCRIPTION_MAX, META_DESCRIPTION_MIN } from "@/lib/metaDescription";

interface Props {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: { url: string; alt: string; width: number; height: number };
  siteName?: string;
  descriptionStatus?: "ok" | "truncated" | "too-short" | "fallback";
  descriptionWarnings?: string[];
}

/**
 * Flytande SEO-snippet-preview. Aktiveras via ?seo-preview=1 eller
 * localStorage.setItem('seo-preview','1'). Renderas aldrig i produktionsbygget
 * utan explicit aktivering.
 */
const SeoPreviewPanel = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  siteName = "d365.se",
}: Props) => {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrl = new URLSearchParams(window.location.search).get("seo-preview");
    if (fromUrl === "1") {
      localStorage.setItem("seo-preview", "1");
      setEnabled(true);
    } else if (fromUrl === "0") {
      localStorage.removeItem("seo-preview");
      setEnabled(false);
    } else {
      setEnabled(localStorage.getItem("seo-preview") === "1");
    }
  }, []);

  if (!enabled) return null;

  const displayUrl = canonicalUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const titleLen = title.length;
  const descLen = description.length;

  const Stat = ({ n, max, warn }: { n: number; max: number; warn: number }) => {
    const color = n > max ? "text-red-600" : n > warn ? "text-amber-600" : "text-emerald-600";
    return <span className={`font-mono ${color}`}>{n}/{max}</span>;
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card shadow-2xl text-foreground text-xs">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/40 rounded-t-xl">
        <span className="font-semibold">SEO-förhandsvisning</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Växla panel"
          >
            {open ? "−" : "+"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("seo-preview");
              setEnabled(false);
            }}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Stäng"
            title="Stäng (lägg till ?seo-preview=1 igen för att öppna)"
          >
            ×
          </button>
        </div>
      </div>

      {open && (
        <div className="p-3 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Google snippet */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Google</p>
            <div className="rounded-md border border-border p-2 bg-background">
              <p className="text-[11px] text-emerald-700 truncate">{displayUrl}</p>
              <p className="text-[14px] text-blue-700 leading-snug line-clamp-2 mt-0.5">{title}</p>
              <p className="text-[12px] text-muted-foreground leading-snug line-clamp-3 mt-0.5">
                {description}
              </p>
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-[10.5px]">
              <span>Title <Stat n={titleLen} warn={55} max={60} /></span>
              <span>Desc <Stat n={descLen} warn={150} max={160} /></span>
            </div>
          </div>

          {/* Open Graph / social */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
              Open Graph / Twitter
            </p>
            <div className="rounded-md border border-border overflow-hidden bg-background">
              <div
                className="aspect-[1200/630] bg-cover bg-center bg-muted"
                style={{ backgroundImage: `url(${ogImage.url})` }}
                role="img"
                aria-label={ogImage.alt}
              />
              <div className="p-2 border-t border-border">
                <p className="text-[10px] uppercase text-muted-foreground truncate">{displayUrl}</p>
                <p className="text-[12px] font-semibold leading-snug line-clamp-2 mt-0.5">{title}</p>
                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">
                  {description}
                </p>
              </div>
            </div>
            <ul className="mt-1.5 space-y-0.5 text-[10.5px] font-mono text-muted-foreground">
              <li className="truncate">img: {ogImage.url.replace(/^https?:\/\//, "")}</li>
              <li>dim: {ogImage.width}×{ogImage.height}</li>
              <li className="truncate">alt: {ogImage.alt || "(saknas)"}</li>
              <li>site: {siteName}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoPreviewPanel;
