import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SelectionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  type?: "radio" | "checkbox";
  className?: string;
}

const SelectionCard = ({ label, description, selected, onClick, type = "checkbox", className }: SelectionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={selected ? {
        borderColor: "hsl(var(--theme-accent, var(--primary)))",
        backgroundColor: "hsl(var(--theme-accent, var(--primary)) / 0.07)",
      } : undefined}
      className={cn(
        "relative flex items-center justify-between w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 text-left group overflow-hidden",
        selected
          ? "shadow-sm"
          : "border-border/70 bg-background hover:border-primary/40 hover:bg-muted/40 hover:shadow-sm",
        className
      )}
    >
      {/* Left accent bar */}
      <span
        style={selected
          ? { backgroundColor: "hsl(var(--theme-accent, var(--primary)))" }
          : undefined}
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-200 selection-card-accent-bar",
          !selected && "bg-transparent group-hover:bg-primary/25"
        )}
      />

      <div className="flex flex-col ml-2">
        <span
          style={selected ? { color: "hsl(var(--theme-accent, var(--primary)))" } : undefined}
          className={cn(
            "font-medium text-sm leading-snug transition-colors",
            !selected && "text-foreground group-hover:text-primary/80"
          )}
        >
          {label}
        </span>
        {description && (
          <span className="text-xs text-muted-foreground mt-0.5">{description}</span>
        )}
      </div>
      <div
        style={selected ? {
          borderColor: "hsl(var(--theme-accent, var(--primary)))",
          backgroundColor: "hsl(var(--theme-accent, var(--primary)))",
          color: "white",
        } : undefined}
        className={cn(
          "flex-shrink-0 flex items-center justify-center w-5 h-5 ml-3 transition-all duration-200",
          type === "radio" ? "rounded-full border-2" : "rounded border-2",
          !selected && "border-muted-foreground/30 bg-background group-hover:border-primary/50"
        )}
      >
        {selected && <Check className="w-3 h-3" />}
      </div>
    </button>
  );
};

export default SelectionCard;
