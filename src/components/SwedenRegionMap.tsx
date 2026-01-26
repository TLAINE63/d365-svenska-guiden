import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { SwedishRegion } from "@/hooks/usePartners";

// Re-export for convenience
export type { SwedishRegion } from "@/hooks/usePartners";

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
    selected: "fill-primary/80 stroke-primary",
    unselected: "fill-muted/60 hover:fill-primary/20 stroke-border",
    badge: "bg-primary text-primary-foreground",
    checkBg: "bg-primary",
  },
  "business-central": {
    selected: "fill-business-central/80 stroke-business-central",
    unselected: "fill-muted/60 hover:fill-business-central/20 stroke-border",
    badge: "bg-business-central text-white",
    checkBg: "bg-business-central",
  },
  crm: {
    selected: "fill-crm/80 stroke-crm",
    unselected: "fill-muted/60 hover:fill-crm/20 stroke-border",
    badge: "bg-crm text-white",
    checkBg: "bg-crm",
  },
  "finance-supply": {
    selected: "fill-finance-supply/80 stroke-finance-supply",
    unselected: "fill-muted/60 hover:fill-finance-supply/20 stroke-border",
    badge: "bg-finance-supply text-white",
    checkBg: "bg-finance-supply",
  },
  amber: {
    selected: "fill-amber-500/80 stroke-amber-500",
    unselected: "fill-muted/60 hover:fill-amber-200 stroke-border",
    badge: "bg-amber-500 text-white",
    checkBg: "bg-amber-500",
  },
};

// More realistic SVG paths for Sweden's three regions
// Based on simplified actual geographic boundaries
const regionPaths = {
  // Norrland - Northern Sweden (Norrbotten, Västerbotten, Jämtland, Västernorrland, Gävleborg, parts of Dalarna)
  Norrland: `
    M 95 8
    C 88 10, 82 14, 78 20
    C 72 28, 68 38, 65 50
    L 58 55
    C 52 58, 48 62, 45 68
    L 42 75
    C 38 82, 35 90, 33 100
    C 30 115, 28 130, 30 145
    L 35 155
    C 38 162, 42 168, 48 172
    L 55 178
    L 62 182
    C 70 185, 80 188, 92 190
    L 108 192
    C 118 193, 128 192, 138 188
    L 150 182
    C 158 177, 164 170, 168 162
    L 172 152
    C 175 140, 176 126, 174 112
    L 170 95
    C 166 78, 160 62, 152 48
    L 145 38
    C 138 28, 128 20, 118 14
    C 110 10, 102 8, 95 8
    Z
  `,
  // Svealand - Central Sweden (Stockholm, Uppsala, Södermanland, Västmanland, Örebro, Värmland)
  Svealand: `
    M 55 182
    L 48 188
    C 42 194, 38 202, 36 212
    L 34 225
    C 32 238, 32 250, 35 262
    L 40 275
    C 44 284, 50 292, 58 298
    L 68 304
    L 78 308
    C 88 312, 100 314, 115 314
    L 132 312
    C 145 310, 156 305, 165 298
    L 175 288
    C 182 280, 186 270, 188 258
    L 190 245
    C 191 232, 190 218, 186 205
    L 180 192
    C 175 185, 168 180, 160 176
    L 150 173
    C 140 170, 128 168, 115 168
    L 100 170
    C 88 172, 76 175, 66 180
    L 55 182
    Z
  `,
  // Götaland - Southern Sweden (Skåne, Blekinge, Småland, Halland, Västra Götaland, Östergötland, Gotland)
  Götaland: `
    M 58 302
    L 48 310
    C 40 318, 34 328, 30 340
    L 26 355
    C 22 372, 22 390, 28 406
    L 35 420
    C 42 432, 52 442, 65 450
    L 80 458
    C 95 465, 112 470, 130 472
    L 148 472
    C 165 470, 180 465, 192 456
    L 205 445
    C 215 434, 222 420, 226 405
    L 228 388
    C 230 370, 228 352, 222 336
    L 215 322
    C 208 312, 198 304, 186 298
    L 172 292
    C 158 288, 142 286, 125 286
    L 105 288
    C 88 290, 72 295, 58 302
    Z
    
    M 195 340
    C 200 345, 204 352, 206 360
    L 208 372
    C 209 382, 208 392, 204 400
    L 198 408
    C 192 415, 184 420, 175 422
    L 165 424
    C 155 425, 146 424, 138 420
    L 130 415
    C 124 410, 120 403, 118 395
    L 116 385
    C 115 375, 116 365, 120 357
    L 126 350
    C 132 344, 140 340, 150 338
    L 162 337
    C 173 337, 184 338, 195 340
    Z
  `,
};

// Label positions for each region
const labelPositions = {
  Norrland: { x: 105, y: 105 },
  Svealand: { x: 115, y: 245 },
  Götaland: { x: 125, y: 380 },
};

export function SwedenRegionMap({
  selectedRegions,
  onToggleRegion,
  colorScheme = "primary",
}: SwedenRegionMapProps) {
  const colors = colorSchemes[colorScheme];

  const isSelected = (region: SwedishRegion) => selectedRegions.includes(region);

  return (
    <div className="mb-8 sm:mb-10 animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="text-sm font-semibold text-foreground">Välj region i Sverige (valfritt)</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
        {/* SVG Map of Sweden */}
        <div className="relative w-56 h-[420px] sm:w-64 sm:h-[480px]">
          <svg
            viewBox="0 0 260 500"
            className="w-full h-full drop-shadow-lg"
            aria-label="Karta över Sverige indelad i landsdelar"
          >
            {/* Background shadow/glow effect */}
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.2"/>
              </filter>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Render regions */}
            {(["Norrland", "Svealand", "Götaland"] as const).map((region) => {
              const selected = isSelected(region);
              return (
                <g key={region} filter={selected ? "url(#glow)" : "url(#shadow)"}>
                  <path
                    d={regionPaths[region]}
                    className={cn(
                      "cursor-pointer transition-all duration-300 stroke-[1.5]",
                      selected ? colors.selected : colors.unselected
                    )}
                    onClick={() => onToggleRegion(region)}
                  />
                  {/* Region label */}
                  <text
                    x={labelPositions[region].x}
                    y={labelPositions[region].y}
                    textAnchor="middle"
                    className={cn(
                      "text-[11px] font-semibold pointer-events-none select-none transition-colors duration-300",
                      selected ? "fill-white" : "fill-foreground"
                    )}
                  >
                    {region}
                  </text>
                  {/* Checkmark when selected */}
                  {selected && (
                    <g transform={`translate(${labelPositions[region].x - 8}, ${labelPositions[region].y + 8})`}>
                      <circle cx="8" cy="8" r="10" className="fill-white/90" />
                      <path
                        d="M5 8 L7 10 L11 6"
                        className="stroke-current stroke-2 fill-none"
                        style={{ color: 'var(--primary)' }}
                      />
                    </g>
                  )}
                </g>
              );
            })}
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
                  "flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left min-w-[200px] group",
                  selected
                    ? `${colors.badge} border-transparent shadow-lg scale-[1.02]`
                    : "bg-card border-border hover:border-primary/50 hover:bg-primary/5 text-foreground hover:scale-[1.02]"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                    selected 
                      ? "bg-white/20 border-white/50" 
                      : "border-muted-foreground/40 group-hover:border-primary/60"
                  )}
                >
                  {selected && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div className="font-semibold">{region.label}</div>
                  <div className={cn("text-xs", selected ? "text-white/80" : "text-muted-foreground")}>
                    {region.description}
                  </div>
                </div>
              </button>
            );
          })}
          
          {/* Clear selection hint */}
          {selectedRegions.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Klicka igen för att avmarkera
            </p>
          )}
        </div>
      </div>

      {/* Selected regions summary */}
      {selectedRegions.length > 0 && (
        <div className="flex justify-center mt-4">
          <div className="bg-muted/50 px-4 py-2 rounded-full">
            <p className="text-sm text-muted-foreground">
              Visar partners i: <span className="font-semibold text-foreground">{selectedRegions.join(", ")}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SwedenRegionMap;
