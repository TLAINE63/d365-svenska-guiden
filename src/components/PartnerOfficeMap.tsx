import { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePartners } from "@/hooks/usePartners";

// Known coordinates for Nordic cities where partners have offices.
// Add new cities here as partners expand.
const CITY_COORDS: Record<string, [number, number]> = {
  "Alingsås": [57.9303, 12.5336],
  "Borås": [57.7210, 12.9401],
  "Borlänge": [60.4858, 15.4371],
  "Eskilstuna": [59.3717, 16.5089],
  "Gävle": [60.6749, 17.1413],
  "Göteborg": [57.7089, 11.9746],
  "Halmstad": [56.6745, 12.8578],
  "Helsingborg": [56.0465, 12.6945],
  "Jönköping": [57.7826, 14.1618],
  "Karlskrona": [56.1612, 15.5869],
  "Karlstad": [59.3793, 13.5036],
  "Köpenhamn": [55.6761, 12.5683],
  "Lidköping": [58.5050, 13.1577],
  "Linköping": [58.4108, 15.6214],
  "Luleå": [65.5848, 22.1547],
  "Lund": [55.7047, 13.1910],
  "Malmö": [55.6050, 13.0038],
  "Norrköping": [58.5877, 16.1924],
  "Örebro": [59.2741, 15.2066],
  "Oslo": [59.9139, 10.7522],
  "Östersund": [63.1792, 14.6357],
  "Skellefteå": [64.7507, 20.9528],
  "Skövde": [58.3911, 13.8454],
  "Stockholm": [59.3293, 18.0686],
  "Sundsvall": [62.3908, 17.3069],
  "Umeå": [63.8258, 20.2630],
  "Uppsala": [59.8586, 17.6389],
  "Västerås": [59.6099, 16.5448],
  "Växjö": [56.8777, 14.8094],
};

// Normalise free-text city entries into a list of canonical city names.
function normaliseCities(rawCities: string[] | null | undefined): string[] {
  if (!rawCities) return [];
  const out: string[] = [];
  for (const raw of rawCities) {
    if (!raw) continue;
    // Skip free-text noise
    if (/\d/.test(raw) && !CITY_COORDS[raw]) continue;
    // Split combined entries like "Stockholm och Göteborg" or "Västerås och Örebro"
    const parts = raw.split(/\s+och\s+|\s*,\s*|\s*\/\s*/i);
    for (const part of parts) {
      const trimmed = part.trim();
      if (CITY_COORDS[trimmed]) out.push(trimmed);
    }
  }
  return out;
}

interface CityMarker {
  city: string;
  coords: [number, number];
  partners: { name: string; slug: string }[];
}

const PartnerOfficeMap = () => {
  const { data: partners } = usePartners();

  // Fix Leaflet default icon paths (we use CircleMarker so icons aren't strictly needed,
  // but this prevents warnings if any default markers get used).
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const cityMarkers = useMemo<CityMarker[]>(() => {
    if (!partners) return [];
    const map = new Map<string, CityMarker>();
    for (const p of partners) {
      const cities = normaliseCities(p.office_cities);
      for (const city of cities) {
        const existing = map.get(city);
        const partnerInfo = { name: p.name, slug: p.slug };
        if (existing) {
          if (!existing.partners.find(x => x.slug === p.slug)) {
            existing.partners.push(partnerInfo);
          }
        } else {
          map.set(city, {
            city,
            coords: CITY_COORDS[city],
            partners: [partnerInfo],
          });
        }
      }
    }
    return Array.from(map.values());
  }, [partners]);

  // Center on Sweden, fit Nordic region
  const center: [number, number] = [60.5, 15.0];

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-lg bg-card">
      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", minHeight: "320px" }}
        className="h-[320px] md:h-[400px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cityMarkers.map(({ city, coords, partners }) => {
          const radius = Math.min(6 + partners.length * 1.5, 16);
          return (
            <CircleMarker
              key={city}
              center={coords}
              radius={radius}
              pathOptions={{
                color: "hsl(var(--cta-orange))",
                fillColor: "hsl(var(--cta-orange))",
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={1}>
                <strong>{city}</strong> – {partners.length} partner{partners.length > 1 ? "s" : ""}
              </Tooltip>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold mb-1">{city}</div>
                  <ul className="space-y-0.5">
                    {partners.map(p => (
                      <li key={p.slug}>
                        <a
                          href={`/partner/${p.slug}`}
                          className="text-primary hover:underline"
                        >
                          {p.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PartnerOfficeMap;
