import { useMemo, useState } from "react";
import { SWEDEN_PATHS, SWEDEN_VIEWBOX, CITY_POINTS } from "@/data/swedenMap";
import { usePartners } from "@/hooks/usePartners";

interface CityDot {
  city: string;
  x: number;
  y: number;
  partners: string[];
}

const normalize = (raw: string) =>
  raw
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

const CITY_LOOKUP: Record<string, { name: string; point: [number, number] }> = Object.fromEntries(
  Object.entries(CITY_POINTS).map(([name, point]) => [normalize(name), { name, point }]),
);

// Delar upp fritextfält som "Västerås och Örebro" eller "Malmö / Lund"
const splitCities = (value: string): string[] =>
  value
    .split(/,|\/|;|\soch\s|&/i)
    .map((c) => c.trim())
    .filter(Boolean);

interface SwedenOfficeMapProps {
  className?: string;
  /** Visa en lista med orter under kartan */
  showLegend?: boolean;
}

export default function SwedenOfficeMap({ className = "", showLegend = true }: SwedenOfficeMapProps) {
  const { data: partners } = usePartners();
  const [active, setActive] = useState<CityDot | null>(null);

  const dots = useMemo<CityDot[]>(() => {
    const map = new Map<string, CityDot>();
    (partners || []).forEach((p) => {
      const cities = (p.office_cities || []).flatMap(splitCities);
      const seen = new Set<string>();
      cities.forEach((raw) => {
        const hit = CITY_LOOKUP[normalize(raw)];
        if (!hit || seen.has(hit.name)) return;
        seen.add(hit.name);
        const existing = map.get(hit.name);
        if (existing) {
          if (!existing.partners.includes(p.name)) existing.partners.push(p.name);
        } else {
          map.set(hit.name, {
            city: hit.name,
            x: hit.point[0],
            y: hit.point[1],
            partners: [p.name],
          });
        }
      });
    });
    return [...map.values()].sort((a, b) => b.partners.length - a.partners.length);
  }, [partners]);

  const maxCount = Math.max(1, ...dots.map((d) => d.partners.length));
  const totalOffices = dots.reduce((sum, d) => sum + d.partners.length, 0);

  return (
    <div className={className}>
      <div className="relative rounded-xl border border-border bg-card p-3">
        <svg
          viewBox={`0 0 ${SWEDEN_VIEWBOX.width} ${SWEDEN_VIEWBOX.height}`}
          className="w-full h-auto"
          role="img"
          aria-label={`Karta över Sverige med ${dots.length} orter där Dynamics 365-partners har kontor`}
        >
          {SWEDEN_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              className="fill-secondary stroke-border"
              strokeWidth={2}
              strokeLinejoin="round"
            />
          ))}
          {dots.map((dot) => {
            const r = 6 + (dot.partners.length / maxCount) * 12;
            const isActive = active?.city === dot.city;
            return (
              <g
                key={dot.city}
                tabIndex={0}
                role="button"
                aria-label={`${dot.city}: ${dot.partners.length} partnerkontor`}
                onMouseEnter={() => setActive(dot)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(dot)}
                onBlur={() => setActive(null)}
                className="cursor-pointer focus:outline-none"
              >
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={r + 6}
                  className="fill-accent/15"
                />
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={r}
                  className={isActive ? "fill-primary" : "fill-accent"}
                  stroke="white"
                  strokeWidth={2}
                />
                {dot.partners.length > 1 && (
                  <text
                    x={dot.x}
                    y={dot.y + 5}
                    textAnchor="middle"
                    className="fill-white font-bold pointer-events-none"
                    fontSize={14}
                  >
                    {dot.partners.length}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {active && (
          <div className="absolute left-3 right-3 bottom-3 rounded-lg border border-border bg-background/95 backdrop-blur px-3 py-2 shadow-lg">
            <p className="text-sm font-semibold text-foreground">
              {active.city} · {active.partners.length}{" "}
              {active.partners.length === 1 ? "partner" : "partners"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-3">
              {active.partners.join(", ")}
            </p>
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-muted-foreground text-center">
        {totalOffices} kontor på {dots.length} orter. Hovra eller tabba till en punkt för att se
        vilka partners som finns där.
      </p>

      {showLegend && dots.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5 justify-center">
          {dots.slice(0, 12).map((d) => (
            <li
              key={d.city}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
            >
              {d.city} <span className="font-semibold text-foreground">{d.partners.length}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
