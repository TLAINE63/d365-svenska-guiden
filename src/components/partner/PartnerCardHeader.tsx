import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";
import { optimizedLogo } from "@/lib/optimizedLogo";
import VerifiedPartnerBadge from "@/components/VerifiedPartnerBadge";

interface Props {
  partner: { name: string; logo_url?: string | null; logo_dark_bg?: boolean | null; is_featured?: boolean | null };
  to: string;
  verified?: boolean;
  compact?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
  children?: ReactNode;
}

/** One native link covers the name, badge, logo and space between them. */
export default function PartnerCardHeader({ partner, to, verified = partner.is_featured === true, compact = false, onClick, className = "", children }: Props) {
  return (
    <Link to={to} onClick={onClick} aria-label={`Visa ${partner.name}s partnerprofil`}
      data-partner-card-header
      className={`group/header flex w-full items-start justify-between gap-4 text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${className}`}>
      <div className="min-w-0 flex-1">
        <h3 className={`${compact ? "text-base" : "text-xl"} break-words font-bold leading-tight group-hover/header:text-primary`}>{partner.name}</h3>
        {verified && <div className="mt-3"><VerifiedPartnerBadge logoDarkBg={partner.logo_dark_bg} /></div>}
        {children}
      </div>
      <div className={`${compact ? "h-12 w-16" : "h-20 w-24"} flex shrink-0 items-center justify-center rounded-md border border-border p-2 ${partner.logo_dark_bg ? "bg-foreground" : "bg-background"}`}>
        {partner.logo_url ? <img src={optimizedLogo(partner.logo_url)} alt={`${partner.name} logotyp`} loading="lazy" className="max-h-full max-w-full object-contain" /> : <span className="text-xs font-semibold text-muted-foreground">{partner.name.slice(0, 2).toUpperCase()}</span>}
      </div>
    </Link>
  );
}