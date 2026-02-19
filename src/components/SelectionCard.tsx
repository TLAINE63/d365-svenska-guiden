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
      className={cn(
        "relative flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all duration-200 text-left group",
        selected
          ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm",
        className
      )}
    >
      <div className="flex flex-col">
        <span className={cn(
          "font-medium transition-colors",
          selected ? "text-primary" : "text-foreground group-hover:text-primary"
        )}>
          {label}
        </span>
        {description && (
          <span className="text-xs text-muted-foreground mt-0.5">{description}</span>
        )}
      </div>
      <div className={cn(
        "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200",
        type === "radio" ? "rounded-full" : "rounded-md",
        selected 
          ? "border-primary bg-primary text-primary-foreground scale-110" 
          : "border-muted-foreground/30 bg-background group-hover:border-primary/50"
      )}>
        {selected && <Check className="w-4 h-4" />}
      </div>
    </button>
  );
};

export default SelectionCard;
