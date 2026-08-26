import { Bookmark, BookmarkCheck } from "lucide-react";
import { useShortlist, type ShortlistEntry } from "@/contexts/ShortlistContext";

interface Props {
  entry: ShortlistEntry;
  className?: string;
  /** "full" = knapp i full bredd, "compact" = liten knapp i rad */
  variant?: "full" | "compact";
}

/**
 * "Spara till shortlist" – beslutsstödjande CTA i aktiv utvärderingsfas.
 * Shortlisten är obegränsad och lagras lokalt hos besökaren.
 */
const ShortlistButton = ({ entry, className = "", variant = "full" }: Props) => {
  const { isSaved, toggle } = useShortlist();
  const saved = isSaved(entry.slug);

  const base =
    variant === "full"
      ? "w-full px-3 py-2 text-xs"
      : "flex-1 px-2 py-1.5 text-xs";

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(entry);
      }}
      className={`flex items-center justify-center gap-1.5 rounded-md font-semibold border transition-all ${base} ${
        saved
          ? "bg-accent/10 text-accent border-accent"
          : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
      } ${className}`}
    >
      {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
      {saved ? "Sparad i shortlist" : "Spara till shortlist"}
    </button>
  );
};

export default ShortlistButton;
