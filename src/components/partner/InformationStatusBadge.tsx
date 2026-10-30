import { BadgeCheck, UserCheck, FileSearch } from "lucide-react";
import { INFORMATION_STATUSES, informationStatusOf, type InformationStatus } from "@/lib/partnerInformationStatus";

const ICONS: Record<InformationStatus, typeof BadgeCheck> = {
  verified: BadgeCheck,
  partner_confirmed: UserCheck,
  compiled: FileSearch,
};

const TONE: Record<InformationStatus, string> = {
  verified: "border-accent/40 bg-accent/10 text-accent",
  partner_confirmed: "border-border bg-secondary text-secondary-foreground",
  compiled: "border-border bg-muted text-muted-foreground",
};

interface Props {
  partner: { information_status?: string | null; information_verified_at?: string | null };
  /** Visa datum för senaste verifiering (ÅÅÅÅ-MM-DD) när status är Verifierad. */
  showDate?: boolean;
  className?: string;
}

/**
 * Publik informationsstatus (Sprint 1.1). Beskriver hur uppgifterna har kontrollerats,
 * inte partnerns kvalitet eller kommersiella relation.
 */
export default function InformationStatusBadge({ partner, showDate = false, className = "" }: Props) {
  const status = informationStatusOf(partner);
  const meta = INFORMATION_STATUSES.find((s) => s.value === status)!;
  const Icon = ICONS[status];
  const date = status === "verified" && showDate ? partner.information_verified_at?.slice(0, 10) : null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-tight ${TONE[status]} ${className}`}
      title={meta.description}
      data-information-status={status}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{meta.label}</span>
      {date && <span className="font-normal opacity-80">· {date}</span>}
      <span className="sr-only">. {meta.description}</span>
    </span>
  );
}
