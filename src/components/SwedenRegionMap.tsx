import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type SwedishRegion = "Norrland" | "Svealand" | "Götaland";

interface SwedenRegionMapProps {
  selectedRegions: SwedishRegion[];
  onToggleRegion: (region: SwedishRegion) => void;
  colorScheme?: "primary" | "business-central" | "crm" | "finance-supply" | "amber";
}

const regionData: { id: SwedishRegion; label: string; description: string }[] = [
  { id: "Norrland", label: "Norrland", description: "Norra Sverige" },
  { id: "Svealand", label: "Svealand", description: "Mellersta Sverige" },
  { id: "Götaland", label: "Götaland", description: "Södra Sverige" },
];

const colorSchemes = {
  primary: {
    selected: "fill-primary stroke-primary-foreground",
    unselected: "fill-muted hover:fill-primary/30 stroke-border",
    badge: "bg-primary text-primary-foreground",
  },
  "business-central": {
    selected: "fill-business-central stroke-white",
    unselected: "fill-muted hover:fill-business-central/30 stroke-border",
    badge: "bg-business-central text-white",
  },
  crm: {
    selected: "fill-crm stroke-white",
    unselected: "fill-muted hover:fill-crm/30 stroke-border",
    badge: "bg-crm text-white",
  },
  "finance-supply": {
    selected: "fill-finance-supply stroke-white",
    unselected: "fill-muted hover:fill-finance-supply/30 stroke-border",
    badge: "bg-finance-supply text-white",
  },
  amber: {
    selected: "fill-amber-500 stroke-white",
    unselected: "fill-muted hover:fill-amber-200 stroke-border",
    badge: "bg-amber-500 text-white",
  },
};

export function SwedenRegionMap({
  selectedRegions,
  onToggleRegion,
  colorScheme = "primary",
}: SwedenRegionMapProps) {
  const colors = colorSchemes[colorScheme];

  const isSelected = (region: SwedishRegion) => selectedRegions.includes(region);

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="text-sm font-semibold text-foreground">Välj region i Sverige (valfritt)</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
        {/* SVG Map of Sweden */}
        <div className="relative w-48 h-80 sm:w-56 sm:h-96">
          <svg
            viewBox="0 0 200 400"
            className="w-full h-full"
            aria-label="Karta över Sverige indelad i landsdelar"
          >
            {/* Norrland - Northern Sweden */}
            <path
              d={`
                M 100 10
                C 60 15, 45 40, 40 80
                C 35 100, 30 120, 35 145
                L 45 150
                L 165 150
                C 170 125, 165 100, 160 80
                C 155 50, 140 20, 100 10
              `}
              className={cn(
                "cursor-pointer transition-all duration-200 stroke-2",
                isSelected("Norrland") ? colors.selected : colors.unselected
              )}
              onClick={() => onToggleRegion("Norrland")}
            />
            <text
              x="100"
              y="90"
              textAnchor="middle"
              className="text-xs font-medium fill-foreground pointer-events-none select-none"
            >
              Norrland
            </text>

            {/* Svealand - Central Sweden */}
            <path
              d={`
                M 45 155
                L 35 155
                C 25 180, 20 210, 30 240
                L 40 250
                L 160 250
                C 175 225, 180 195, 170 165
                L 165 155
                L 45 155
              `}
              className={cn(
                "cursor-pointer transition-all duration-200 stroke-2",
                isSelected("Svealand") ? colors.selected : colors.unselected
              )}
              onClick={() => onToggleRegion("Svealand")}
            />
            <text
              x="100"
              y="205"
              textAnchor="middle"
              className="text-xs font-medium fill-foreground pointer-events-none select-none"
            >
              Svealand
            </text>

            {/* Götaland - Southern Sweden */}
            <path
              d={`
                M 40 255
                L 30 260
                C 20 290, 25 330, 50 360
                C 75 385, 125 390, 150 365
                C 175 340, 180 300, 165 265
                L 160 255
                L 40 255
              `}
              className={cn(
                "cursor-pointer transition-all duration-200 stroke-2",
                isSelected("Götaland") ? colors.selected : colors.unselected
              )}
              onClick={() => onToggleRegion("Götaland")}
            />
            <text
              x="100"
              y="320"
              textAnchor="middle"
              className="text-xs font-medium fill-foreground pointer-events-none select-none"
            >
              Götaland
            </text>
          </svg>
        </div>

        {/* Region buttons/legend */}
        <div className="flex flex-col gap-3">
          {regionData.map((region) => {
            const selected = isSelected(region.id);
            return (
              <button
                key={region.id}
                onClick={() => onToggleRegion(region.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 text-left min-w-[180px]",
                  selected
                    ? `${colors.badge} border-transparent shadow-lg scale-[1.02]`
                    : "bg-card border-border hover:border-primary/50 hover:bg-primary/5 text-foreground hover:scale-[1.02]"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors",
                    selected ? "bg-white/20 border-white/50" : "border-muted-foreground/50"
                  )}
                >
                  {selected && <X className="w-3 h-3" />}
                </div>
                <div>
                  <div className="font-medium">{region.label}</div>
                  <div className={cn("text-xs", selected ? "text-white/80" : "text-muted-foreground")}>
                    {region.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected regions summary */}
      {selectedRegions.length > 0 && (
        <div className="flex justify-center mt-4">
          <p className="text-sm text-muted-foreground">
            Valt: <span className="font-semibold text-foreground">{selectedRegions.join(", ")}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default SwedenRegionMap;
