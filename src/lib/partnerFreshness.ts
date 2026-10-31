import { informationStatusOf, type InformationStatus } from "@/lib/partnerInformationStatus";

export type FreshnessSort = "needs_check" | "partner_updated_desc" | "partner_updated_asc" | "verified_asc";

export interface FreshnessRow {
  id: string;
  name: string;
  status: InformationStatus;
  verifiedAt: string | null;
  partnerUpdatedAt: string | null;
  /** Verifierad partner som uppdaterat själv efter verifieringsdatumet. */
  needsCheck: boolean;
}

const day = (v?: string | null) => (v ? v.slice(0, 10) : null);

export function freshnessRows(
  partners: { id: string; name: string; information_status?: string | null; information_verified_at?: string | null; partner_updated_at?: string | null }[],
  sort: FreshnessSort,
): FreshnessRow[] {
  const rows = partners.map((p) => {
    const status = informationStatusOf(p);
    const verifiedAt = day(p.information_verified_at);
    const partnerUpdatedAt = day(p.partner_updated_at);
    const needsCheck = status === "verified" && !!partnerUpdatedAt && (!verifiedAt || partnerUpdatedAt > verifiedAt);
    return { id: p.id, name: p.name, status, verifiedAt, partnerUpdatedAt, needsCheck };
  });
  const s = (v: string | null, fallback: string) => v ?? fallback;
  return rows.sort((a, b) => {
    if (sort === "needs_check") return Number(b.needsCheck) - Number(a.needsCheck) || s(b.partnerUpdatedAt, "").localeCompare(s(a.partnerUpdatedAt, "")) || a.name.localeCompare(b.name, "sv");
    if (sort === "partner_updated_desc") return s(b.partnerUpdatedAt, "").localeCompare(s(a.partnerUpdatedAt, "")) || a.name.localeCompare(b.name, "sv");
    if (sort === "partner_updated_asc") return s(a.partnerUpdatedAt, "0000").localeCompare(s(b.partnerUpdatedAt, "0000")) || a.name.localeCompare(b.name, "sv");
    return s(a.verifiedAt, "9999").localeCompare(s(b.verifiedAt, "9999")) || a.name.localeCompare(b.name, "sv");
  });
}
