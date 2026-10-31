import { isvInformationStatusOf, type IsvInformationStatus } from "@/lib/isvInformationStatus";
import type { FreshnessSort } from "@/lib/partnerFreshness";

export interface IsvFreshnessInput {
  id: string;
  name: string;
  vendor?: string | null;
  information_status?: string | null;
  last_verified_date?: string | null;
  vendor_updated_at?: string | null;
}

export interface IsvFreshnessRow {
  id: string;
  name: string;
  vendor: string | null;
  status: IsvInformationStatus;
  verifiedAt: string | null;
  vendorUpdatedAt: string | null;
  /** Verifierad post som leverantören uppdaterat efter verifieringsdatumet. */
  needsCheck: boolean;
}

const day = (v?: string | null) => (v ? v.slice(0, 10) : null);

/** Samma regler som för partners: verifierad + leverantörsuppdatering efter verifieringsdatum = kontrollera. */
export function isvFreshnessRows(items: IsvFreshnessInput[], sort: FreshnessSort): IsvFreshnessRow[] {
  const rows = items.map((p) => {
    const status = isvInformationStatusOf(p.information_status);
    const verifiedAt = day(p.last_verified_date);
    const vendorUpdatedAt = day(p.vendor_updated_at);
    const needsCheck = status === "verified" && !!vendorUpdatedAt && (!verifiedAt || vendorUpdatedAt > verifiedAt);
    return { id: p.id, name: p.name, vendor: p.vendor ?? null, status, verifiedAt, vendorUpdatedAt, needsCheck };
  });
  const s = (v: string | null, fallback: string) => v ?? fallback;
  const byName = (a: IsvFreshnessRow, b: IsvFreshnessRow) => a.name.localeCompare(b.name, "sv");
  return rows.sort((a, b) => {
    if (sort === "needs_check") return Number(b.needsCheck) - Number(a.needsCheck) || s(b.vendorUpdatedAt, "").localeCompare(s(a.vendorUpdatedAt, "")) || byName(a, b);
    if (sort === "partner_updated_desc") return s(b.vendorUpdatedAt, "").localeCompare(s(a.vendorUpdatedAt, "")) || byName(a, b);
    if (sort === "partner_updated_asc") return s(a.vendorUpdatedAt, "0000").localeCompare(s(b.vendorUpdatedAt, "0000")) || byName(a, b);
    return s(a.verifiedAt, "9999").localeCompare(s(b.verifiedAt, "9999")) || byName(a, b);
  });
}
