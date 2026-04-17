import * as React from "react";
import { ChevronDown, CheckCircle2, Circle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionAccent =
  | "primary"
  | "business-central"
  | "crm"
  | "finance-supply"
  | "copilot"
  | "agents"
  | "customer-service"
  | "amber";

const accentMap: Record<
  SectionAccent,
  { headerBg: string; iconBg: string; iconText: string; ring: string; bar: string }
> = {
  primary: {
    headerBg: "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
    iconBg: "bg-primary/15",
    iconText: "text-primary",
    ring: "ring-primary/20",
    bar: "bg-primary",
  },
  "business-central": {
    headerBg: "bg-gradient-to-r from-business-central/10 via-business-central/5 to-transparent",
    iconBg: "bg-business-central/15",
    iconText: "text-business-central",
    ring: "ring-business-central/20",
    bar: "bg-business-central",
  },
  crm: {
    headerBg: "bg-gradient-to-r from-crm/10 via-crm/5 to-transparent",
    iconBg: "bg-crm/15",
    iconText: "text-crm",
    ring: "ring-crm/20",
    bar: "bg-crm",
  },
  "finance-supply": {
    headerBg: "bg-gradient-to-r from-finance-supply/10 via-finance-supply/5 to-transparent",
    iconBg: "bg-finance-supply/15",
    iconText: "text-finance-supply",
    ring: "ring-finance-supply/20",
    bar: "bg-finance-supply",
  },
  copilot: {
    headerBg: "bg-gradient-to-r from-copilot/10 via-copilot/5 to-transparent",
    iconBg: "bg-copilot/15",
    iconText: "text-copilot",
    ring: "ring-copilot/20",
    bar: "bg-copilot",
  },
  agents: {
    headerBg: "bg-gradient-to-r from-agents/10 via-agents/5 to-transparent",
    iconBg: "bg-agents/15",
    iconText: "text-agents",
    ring: "ring-agents/20",
    bar: "bg-agents",
  },
  "customer-service": {
    headerBg: "bg-gradient-to-r from-customer-service/10 via-customer-service/5 to-transparent",
    iconBg: "bg-customer-service/15",
    iconText: "text-customer-service",
    ring: "ring-customer-service/20",
    bar: "bg-customer-service",
  },
  amber: {
    headerBg: "bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-600",
    ring: "ring-amber-500/20",
    bar: "bg-amber-500",
  },
};

interface PremiumCollapsibleSectionProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  accent?: SectionAccent;
  status?: "complete" | "partial" | "empty";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

export const PremiumCollapsibleSection: React.FC<PremiumCollapsibleSectionProps> = ({
  title,
  description,
  icon: Icon,
  accent = "primary",
  status = "empty",
  open,
  onOpenChange,
  sectionRef,
  children,
  badge,
}) => {
  const a = accentMap[accent];

  return (
    <div
      ref={sectionRef}
      className={cn(
        "scroll-mt-4 rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden transition-all",
        open && "shadow-md ring-1",
        open && a.ring,
      )}
    >
      {/* Accent bar */}
      <div className={cn("h-1 w-full", a.bar)} />

      {/* Header (clickable) */}
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40",
          a.headerBg,
        )}
        aria-expanded={open}
      >
        <div
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-lg shrink-0",
            a.iconBg,
            a.iconText,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {status === "complete" && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Komplett
              </span>
            )}
            {status === "partial" && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                <Circle className="h-3 w-3 fill-amber-500 text-amber-500" />
                Påbörjad
              </span>
            )}
            {badge}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Content */}
      {open && <div className="px-5 py-5 space-y-4 border-t border-border/60 bg-background/50">{children}</div>}
    </div>
  );
};
