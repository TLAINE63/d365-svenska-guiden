import { Button } from "@/components/ui/button";
import { X, Building2, Users, AppWindow, DollarSign, Globe } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterButtonsProps {
  title: string;
  icon: "industry" | "employees" | "application" | "revenue" | "geography";
  options: FilterOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  colorScheme?: "primary" | "business-central" | "crm" | "finance-supply" | "amber";
}

interface MultiFilterButtonsProps {
  title: string;
  icon: "industry" | "employees" | "application" | "revenue" | "geography";
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  colorScheme?: "primary" | "business-central" | "crm" | "finance-supply" | "amber";
}

const iconMap = {
  industry: Building2,
  employees: Users,
  application: AppWindow,
  revenue: DollarSign,
  geography: Globe,
};

const colorSchemes = {
  primary: {
    selected: "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30",
    unselected: "bg-card border-border hover:border-primary/50 hover:bg-primary/5 text-foreground hover:text-foreground",
  },
  "business-central": {
    selected: "bg-business-central text-white border-business-central shadow-lg shadow-business-central/30",
    unselected: "bg-card border-border hover:border-business-central/50 hover:bg-business-central/5 text-foreground hover:text-foreground",
  },
  crm: {
    selected: "bg-crm text-white border-crm shadow-lg shadow-crm/30",
    unselected: "bg-card border-border hover:border-crm/50 hover:bg-crm/5 text-foreground hover:text-foreground",
  },
  "finance-supply": {
    selected: "bg-finance-supply text-white border-finance-supply shadow-lg shadow-finance-supply/30",
    unselected: "bg-card border-border hover:border-finance-supply/50 hover:bg-finance-supply/5 text-foreground hover:text-foreground",
  },
  amber: {
    selected: "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/30",
    unselected: "bg-card border-border hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-foreground hover:text-foreground",
  },
};

export function FilterButtons({
  title,
  icon,
  options,
  selectedValue,
  onSelect,
  colorScheme = "primary",
}: FilterButtonsProps) {
  const Icon = iconMap[icon];
  const colors = colorSchemes[colorScheme];

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <Button
              key={option.value}
              variant="outline"
              size="sm"
              onClick={() => onSelect(isSelected ? null : option.value)}
              className={`
                transition-all duration-200 rounded-lg px-4 py-2 h-auto font-medium
                border-2
                ${isSelected ? colors.selected : colors.unselected}
                ${isSelected ? "scale-[1.02]" : "hover:scale-[1.02]"}
              `}
            >
              <span className="flex items-center gap-2">
                {option.label}
                {isSelected && (
                  <X className="h-3.5 w-3.5 opacity-70" />
                )}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function MultiFilterButtons({
  title,
  icon,
  options,
  selectedValues,
  onToggle,
  colorScheme = "primary",
}: MultiFilterButtonsProps) {
  const Icon = iconMap[icon];
  const colors = colorSchemes[colorScheme];

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <Button
              key={option.value}
              variant="outline"
              size="sm"
              onClick={() => onToggle(option.value)}
              className={`
                transition-all duration-200 rounded-lg px-4 py-2 h-auto font-medium
                border-2
                ${isSelected ? colors.selected : colors.unselected}
                ${isSelected ? "scale-[1.02]" : "hover:scale-[1.02]"}
              `}
            >
              <span className="flex items-center gap-2">
                {option.label}
                {isSelected && (
                  <X className="h-3.5 w-3.5 opacity-70" />
                )}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
