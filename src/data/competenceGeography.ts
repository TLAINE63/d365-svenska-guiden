/**
 * Geografi för "Hitta rätt Dynamics 365-kompetens".
 *
 * Geografin beskriver var en konsult kan arbeta PÅ PLATS hos kunden,
 * inte var partnern har kontor.
 *
 * Datamodellen lagrar ORTER (onsite_cities) samt en markering för distans
 * (remote_available). I MVP:n filtrerar användaren endast på region, men
 * eftersom orterna finns i databasen kan ett ortsfilter läggas till senare
 * utan att strukturen behöver ändras.
 */

export const COMPETENCE_REGIONS = [
  "Stockholm / Mälardalen",
  "Göteborg / Väst",
  "Malmö / Syd",
  "Öst",
  "Norr",
] as const;

export type CompetenceRegion = (typeof COMPETENCE_REGIONS)[number];

/** Orter per region. Listan kan utökas utan schemaändring. */
export const CITIES_BY_REGION: Record<CompetenceRegion, string[]> = {
  "Stockholm / Mälardalen": [
    "Stockholm",
    "Solna",
    "Sundbyberg",
    "Kista",
    "Södertälje",
    "Uppsala",
    "Västerås",
    "Eskilstuna",
    "Enköping",
    "Nyköping",
    "Strängnäs",
    "Norrtälje",
  ],
  "Göteborg / Väst": [
    "Göteborg",
    "Mölndal",
    "Borås",
    "Trollhättan",
    "Uddevalla",
    "Skövde",
    "Alingsås",
    "Varberg",
    "Halmstad",
    "Kungsbacka",
  ],
  "Malmö / Syd": [
    "Malmö",
    "Lund",
    "Helsingborg",
    "Kristianstad",
    "Ystad",
    "Landskrona",
    "Hässleholm",
    "Växjö",
    "Karlskrona",
    "Kalmar",
  ],
  "Öst": [
    "Linköping",
    "Norrköping",
    "Jönköping",
    "Motala",
    "Örebro",
    "Karlstad",
    "Västervik",
    "Visby",
    "Falun",
    "Borlänge",
    "Gävle",
  ],
  "Norr": [
    "Sundsvall",
    "Östersund",
    "Umeå",
    "Skellefteå",
    "Luleå",
    "Piteå",
    "Örnsköldsvik",
    "Kiruna",
    "Härnösand",
  ],
};

export const ALL_CITIES: string[] = Object.values(CITIES_BY_REGION)
  .flat()
  .sort((a, b) => a.localeCompare(b, "sv"));

const CITY_TO_REGION: Record<string, CompetenceRegion> = Object.entries(
  CITIES_BY_REGION,
).reduce((acc, [region, cities]) => {
  cities.forEach((c) => {
    acc[c.toLowerCase()] = region as CompetenceRegion;
  });
  return acc;
}, {} as Record<string, CompetenceRegion>);

export const regionForCity = (city: string): CompetenceRegion | undefined =>
  CITY_TO_REGION[city?.trim().toLowerCase()];

/** Regioner som täcks av en uppsättning orter. */
export const regionsForCities = (cities: string[] | null | undefined): CompetenceRegion[] => {
  const set = new Set<CompetenceRegion>();
  (cities || []).forEach((c) => {
    const r = regionForCity(c);
    if (r) set.add(r);
  });
  return COMPETENCE_REGIONS.filter((r) => set.has(r));
};

/** Kort text om var konsulten kan vara på plats. */
export const onsiteSummary = (cities: string[] | null | undefined, max = 4): string => {
  const list = (cities || []).filter(Boolean);
  if (list.length === 0) return "";
  if (list.length <= max) return list.join(", ");
  return `${list.slice(0, max).join(", ")} med flera`;
};
