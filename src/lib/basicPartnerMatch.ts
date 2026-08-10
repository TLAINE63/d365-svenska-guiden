import type { BasicPartner, ProductKey } from "@/hooks/useBasicPartners";

/**
 * Matchning av Basic-partners (observerad data från publika källor) mot samma
 * filter som används för verifierade partners på /valjdynamics365partner.
 *
 * Basic-partners saknar självrapporterad profil – matchningen bygger enbart på
 * observed_* fälten och är därför medvetet mjukare på storlek/omsättning/geografi.
 */

const GEO_HIERARCHY = ["Sverige", "Norden", "Europa", "Globalt"];

/** Produkter som inte finns i observed_* och därför inte kan matchas för Basic. */
export const SPECIALTY_APPS = ["Project Operations", "Commerce", "Human Resources"];

export function appToObservedKeys(app: string): ProductKey[] {
  switch (app) {
    case "Business Central":
      return ["bc"];
    case "Finance & SCM":
      return ["fsc"];
    case "Sales":
    case "Customer Insights (Marketing)":
      return ["sales"];
    case "Customer Service":
    case "Field Service":
    case "Contact Center":
      return ["service"];
    default:
      return [];
  }
}

export function appsToObservedKeys(apps: string[]): ProductKey[] {
  const keys = new Set<ProductKey>();
  apps.forEach((a) => appToObservedKeys(a).forEach((k) => keys.add(k)));
  return Array.from(keys);
}

/** Har partnern någon observerad data alls för produktområdet? */
export function hasObservedProduct(p: BasicPartner, key: ProductKey): boolean {
  return (
    !!p.observed_products?.[key] ||
    !!p.observed_industries?.[key]?.length ||
    !!p.observed_company_sizes?.[key]?.length ||
    !!p.observed_revenue?.[key]?.length ||
    !!p.observed_delivery_geo?.[key]?.length
  );
}

function matchesSoftList(values: string[] | undefined, selected: string | null): boolean {
  if (!selected) return true;
  if (!values || values.length === 0) return true; // ingen observerad data = filtrera inte bort
  return values.includes(selected);
}

function matchesGeo(values: string[] | undefined, selected: string | null): boolean {
  if (!selected) return true;
  if (!values || values.length === 0) return true;
  const selectedIdx = GEO_HIERARCHY.indexOf(selected);
  const maxIdx = Math.max(...values.map((g) => GEO_HIERARCHY.indexOf(g)));
  return maxIdx >= selectedIdx;
}

export interface BasicFilterCriteria {
  applications: string[];
  industry?: string | null;
  companySize?: string | null;
  revenue?: string | null;
  geography?: string | null;
}

export function filterBasicPartners(
  partners: BasicPartner[],
  { applications, industry = null, companySize = null, revenue = null, geography = null }: BasicFilterCriteria,
): BasicPartner[] {
  const keys = appsToObservedKeys(applications);
  const onlySpecialty =
    applications.length > 0 &&
    keys.length === 0 &&
    applications.every((a) => SPECIALTY_APPS.includes(a));

  // Basic-data täcker inte specialprodukter – då visas inga Basic-profiler.
  if (onlySpecialty) return [];

  const relevantKeys: ProductKey[] = keys.length > 0 ? keys : ["bc", "fsc", "sales", "service"];

  return partners
    .filter((p) => relevantKeys.some((k) => hasObservedProduct(p, k)))
    .filter((p) =>
      relevantKeys.some((k) => {
        if (!hasObservedProduct(p, k)) return false;
        // Bransch är hårt filter när det valts – kräver observerad branschdata.
        if (industry) {
          const inds = p.observed_industries?.[k] || [];
          if (!inds.includes(industry)) return false;
        }
        if (!matchesSoftList(p.observed_company_sizes?.[k], companySize)) return false;
        if (!matchesSoftList(p.observed_revenue?.[k], revenue)) return false;
        if (!matchesGeo(p.observed_delivery_geo?.[k], geography)) return false;
        return true;
      }),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));
}
