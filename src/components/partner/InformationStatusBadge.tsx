import { BadgeCheck, FileSearch } from "lucide-react";
import { INFORMATION_STATUSES, informationStatusOf } from "@/lib/partnerInformationStatus";
import { ISV_INFORMATION_STATUSES, isvInformationStatusOf } from "@/lib/isvInformationStatus";

type Level = "verified" | "compiled";

const ICONS: Record<Level, typeof BadgeCheck> = {
  verified: BadgeCheck,
  compiled: FileSearch,
};

const TONE: Record<Level, string> = {
  verified: "border-accent/40 bg-accent/10 text-accent",
  compiled: "border-border bg-muted text-muted-foreground",
};

interface Props {
  partner: { information_status?: string | null; information_verified_at?: string | null };
  /** Visa datum för senaste verifiering (ÅÅÅÅ-MM-DD) när status är Verifierad. */
  showDate?: boolean;
  /** Visa en synlig förklaring under badgen när informationen är automatiskt sammanställd. */
  explain?: boolean;
  /** "isv" använder ISV-statusarnas texter. */
  kind?: "partner" | "isv";
  className?: string;
}

/**
 * Publik informationsstatus (Sprint 1.1, ISV Sprint 1.9). Beskriver hur uppgifterna har kontrollerats,
 * inte kvalitet eller kommersiell relation.
 */
export default function InformationStatusBadge({ partner, showDate = false, explain = false, kind = "partner", className = "" }: Props) {
  let status: string;
  let meta: { label: string; description: string };
  if (kind === "isv") {
    status = isvInformationStatusOf(partner.information_status);
    meta = ISV_INFORMATION_STATUSES.find((s) => s.value === status)!;
  } else {
    status = informationStatusOf(partner);
    meta = INFORMATION_STATUSES.find((s) => s.value === status)!;
  }
  const level: Level = status === "verified" ? "verified" : "compiled";
  const Icon = ICONS[level];
  const date = status === "verified" && showDate ? partner.information_verified_at?.slice(0, 10) : null;
  const badge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-tight ${TONE[level]} ${className}`}
      title={meta.description}
      data-information-status={status}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{meta.label}</span>
      {date && <span className="font-normal opacity-80">· {date}</span>}
      <span className="sr-only">. {meta.description}</span>
    </span>
  );
  if (!explain || level !== "compiled") return badge;
  return (
    <span className="flex flex-col items-start gap-1">
      {badge}
      <span className="max-w-prose text-xs leading-snug text-muted-foreground">{meta.description}</span>
    </span>
  );
}
