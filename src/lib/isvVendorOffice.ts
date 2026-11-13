/** Leverantörens närvaro: svenskt kontor, annars nordiskt kontor, annars huvudkontor. Visas bara när ifyllt. */
const SCOPE: Record<string, string> = { se: "Kontor i Sverige", nordic: "Nordiskt kontor", hq: "Huvudkontor" };

export function vendorOfficeText(v?: { office_scope?: string | null; office_city?: string | null; office_country?: string | null } | null): string {
  if (!v?.office_scope || !SCOPE[v.office_scope]) return "";
  const place = [v.office_city, v.office_scope === "se" ? null : v.office_country].filter(Boolean).join(", ");
  return place ? `${SCOPE[v.office_scope]}: ${place}` : SCOPE[v.office_scope];
}
