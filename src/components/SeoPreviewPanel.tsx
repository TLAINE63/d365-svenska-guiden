import { useEffect, useState } from "react";
import { META_DESCRIPTION_MAX, META_DESCRIPTION_MIN } from "@/lib/metaDescription";
import { META_TITLE_MAX, META_TITLE_MIN } from "@/lib/metaTitle";

interface Props {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: { url: string; alt: string; width: number; height: number };
  siteName?: string;
  titleStatus?: "ok" | "padded" | "truncated" | "missing-keyword";
  titleWarnings?: string[];
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
  titleStatus,
  titleWarnings,
  descriptionStatus,
  descriptionWarnings,
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
              <span>
                Title{" "}
                <span
                  className={`font-mono ${
                    titleLen > META_TITLE_MAX
                      ? "text-red-600"
                      : titleLen < META_TITLE_MIN
                        ? "text-amber-600"
                        : "text-emerald-600"
                  }`}
                  title={`Mål: ${META_TITLE_MIN}–${META_TITLE_MAX} tecken`}
                >
                  {titleLen}/{META_TITLE_MAX}
                </span>
                {titleStatus && titleStatus !== "ok" && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      titleStatus === "missing-keyword"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {titleStatus === "missing-keyword"
                      ? "saknar sökord"
                      : titleStatus === "truncated"
                        ? "trunkerad"
                        : "för kort"}
                  </span>
                )}
              </span>
              <span>
                Desc{" "}
                <span
                  className={`font-mono ${
                    descLen > META_DESCRIPTION_MAX
                      ? "text-red-600"
                      : descLen < META_DESCRIPTION_MIN
                        ? "text-amber-600"
                        : "text-emerald-600"
                  }`}
                  title={`Mål: ${META_DESCRIPTION_MIN}–${META_DESCRIPTION_MAX} tecken`}
                >
                  {descLen}/{META_DESCRIPTION_MAX}
                </span>
              </span>
              {descriptionStatus && descriptionStatus !== "ok" && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    descriptionStatus === "truncated"
                      ? "bg-amber-100 text-amber-800"
                      : descriptionStatus === "too-short"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {descriptionStatus === "truncated"
                    ? "trunkerad"
                    : descriptionStatus === "too-short"
                      ? "för kort"
                      : "fallback"}
                </span>
              )}
            </div>
            {descriptionWarnings && descriptionWarnings.length > 0 && (
              <ul className="mt-1.5 space-y-0.5 text-[10px] text-amber-700 list-disc pl-4">
                {descriptionWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
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
