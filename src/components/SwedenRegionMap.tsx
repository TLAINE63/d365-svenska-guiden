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

const regionData: { id: SwedishRegion; label: string; shortLabel: string }[] = [
  { id: "Norr", label: "Norr", shortLabel: "Norr" },
  { id: "Mellansverige", label: "Mellansverige", shortLabel: "Mellan" },
  { id: "Storstockholm / Mälardalen", label: "Storstockholm / Mälardalen", shortLabel: "Stockholm" },
  { id: "Väst", label: "Väst", shortLabel: "Väst" },
  { id: "Sydost", label: "Sydost", shortLabel: "Sydost" },
  { id: "Syd / Sydväst", label: "Syd / Sydväst", shortLabel: "Syd" },
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

// SVG paths for Sweden's six regions
const regionPaths: Record<SwedishRegion, string> = {
  // Norr - Norrland (Norrbotten, Västerbotten, Jämtland, Västernorrland)
  "Norr": `
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
  // Mellansverige - Gävleborg, Dalarna, Värmland
  "Mellansverige": `
    M 55 185
    L 48 192
    C 42 198, 38 206, 36 216
    L 34 228
    C 32 238, 33 248, 36 258
    L 42 270
    C 48 280, 56 288, 66 294
    L 80 298
    C 92 300, 104 298, 115 294
    L 128 288
    C 138 282, 146 274, 152 264
    L 158 252
    C 162 240, 164 226, 162 212
    L 158 198
    C 154 190, 148 184, 140 180
    L 128 176
    C 116 174, 104 174, 92 176
    L 76 180
    L 55 185
    Z
  `,
  // Storstockholm / Mälardalen - Stockholm, Uppsala, Södermanland, Västmanland, Örebro
  "Storstockholm / Mälardalen": `
    M 118 294
    L 130 290
    C 142 286, 152 280, 160 272
    L 170 260
    C 178 248, 184 234, 186 218
    L 188 202
    C 190 188, 192 176, 198 166
    L 206 158
    C 212 152, 220 148, 228 148
    L 238 150
    C 246 154, 252 160, 256 168
    L 260 180
    C 264 194, 264 210, 260 226
    L 254 242
    C 248 256, 240 268, 228 278
    L 214 288
    C 200 296, 184 302, 166 304
    L 148 306
    C 136 306, 126 302, 118 294
    Z
  `,
  // Väst - Västra Götaland, Halland
  "Väst": `
    M 42 272
    L 36 284
    C 30 296, 26 310, 24 326
    L 22 344
    C 20 362, 22 380, 28 396
    L 36 410
    C 44 422, 54 432, 66 438
    L 82 444
    C 96 448, 110 448, 124 444
    L 138 438
    C 150 432, 160 424, 168 414
    L 174 400
    C 178 386, 178 370, 174 354
    L 168 340
    C 162 328, 154 318, 144 310
    L 130 304
    C 118 300, 104 298, 90 298
    L 74 300
    C 62 302, 52 298, 46 290
    L 42 272
    Z
  `,
  // Sydost - Östergötland, Jönköping, Kalmar, Gotland
  "Sydost": `
    M 144 310
    L 158 316
    C 172 322, 184 330, 194 340
    L 206 354
    C 216 368, 224 384, 228 402
    L 230 420
    C 232 438, 230 456, 224 472
    L 216 486
    C 206 498, 194 506, 180 510
    L 164 514
    C 148 516, 132 514, 118 508
    L 104 500
    C 92 492, 82 482, 76 470
    L 70 456
    C 66 442, 66 428, 70 414
    L 76 400
    C 82 388, 90 378, 100 370
    L 114 362
    C 126 356, 138 348, 146 338
    L 152 324
    L 144 310
    Z
    
    M 215 360
    C 220 365, 224 372, 226 380
    L 228 392
    C 229 402, 228 412, 224 420
    L 218 428
    C 212 435, 204 440, 195 442
    L 185 444
    C 175 445, 166 444, 158 440
    L 150 435
    C 144 430, 140 423, 138 415
    L 136 405
    C 135 395, 136 385, 140 377
    L 146 370
    C 152 364, 160 360, 170 358
    L 182 357
    C 193 357, 204 358, 215 360
    Z
  `,
  // Syd / Sydväst - Skåne, Blekinge, Kronoberg
  "Syd / Sydväst": `
    M 66 442
    L 56 456
    C 46 470, 38 486, 34 504
    L 30 524
    C 26 544, 28 564, 36 582
    L 48 598
    C 60 612, 76 622, 94 628
    L 114 632
    C 134 634, 154 632, 172 624
    L 188 614
    C 202 604, 214 590, 222 574
    L 228 556
    C 234 538, 236 518, 232 498
    L 226 480
    C 220 464, 210 450, 198 440
    L 182 432
    C 168 426, 152 424, 136 426
    L 118 430
    C 102 434, 88 438, 76 444
    L 66 442
    Z
  `,
};

// Label positions for each region
const labelPositions: Record<SwedishRegion, { x: number; y: number }> = {
  "Norr": { x: 105, y: 105 },
  "Mellansverige": { x: 100, y: 235 },
  "Storstockholm / Mälardalen": { x: 200, y: 220 },
  "Väst": { x: 85, y: 365 },
  "Sydost": { x: 165, y: 420 },
  "Syd / Sydväst": { x: 130, y: 545 },
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

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {regionData.map((region) => {
          const selected = isSelected(region.id);
          return (
            <button
              key={region.id}
              onClick={() => onToggleRegion(region.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 transition-all duration-200 text-left group",
                selected
                  ? `${colors.badge} border-transparent shadow-lg scale-[1.02]`
                  : "bg-card border-border hover:border-primary/50 hover:bg-primary/5 text-foreground hover:scale-[1.02]"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0",
                  selected 
                    ? "bg-white/20 border-white/50" 
                    : "border-muted-foreground/40 group-hover:border-primary/60"
                )}
              >
                {selected && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              </div>
              <span className="font-medium text-sm sm:text-base leading-tight">{region.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Clear selection hint */}
      {selectedRegions.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Klicka igen för att avmarkera
        </p>
      )}

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
