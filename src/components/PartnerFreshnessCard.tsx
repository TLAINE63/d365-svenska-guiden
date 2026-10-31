import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InformationStatusBadge from "@/components/partner/InformationStatusBadge";
import { freshnessRows, type FreshnessSort } from "@/lib/partnerFreshness";

interface Props {
  partners: { id: string; name: string; slug?: string; information_status?: string | null; information_verified_at?: string | null; partner_updated_at?: string | null }[];
}

const SORTS: { value: FreshnessSort; label: string }[] = [
  { value: "needs_check", label: "Behöver kontroll först" },
  { value: "partner_updated_desc", label: "Partnern uppdaterade senast" },
  { value: "partner_updated_asc", label: "Äldst partneruppdatering" },
  { value: "verified_asc", label: "Äldst verifiering" },
];

/** Admin + Redaktion: när partnern själv uppdaterade och när d365.se senast verifierade. */
export default function PartnerFreshnessCard({ partners }: Props) {
  const [sort, setSort] = useState<FreshnessSort>("needs_check");
  const rows = useMemo(() => freshnessRows(partners, sort), [partners, sort]);
  const toCheck = rows.filter((r) => r.needsCheck).length;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Informationsstatus och aktualitet</CardTitle>
        <CardDescription>
          {toCheck} verifierade partners har uppdaterat uppgifter efter senaste verifiering. Sätt nytt verifieringsdatum i partnerredigeringen när du kontrollerat.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="text-sm flex items-center gap-2">
          Sortera
          <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={sort} onChange={(e) => setSort(e.target.value as FreshnessSort)}>
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Senast verifierad</TableHead>
                <TableHead>Partnern uppdaterade</TableHead>
                <TableHead>Att göra</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell><InformationStatusBadge partner={{ information_status: r.status }} /></TableCell>
                  <TableCell>{r.verifiedAt ?? "–"}</TableCell>
                  <TableCell>{r.partnerUpdatedAt ?? "–"}</TableCell>
                  <TableCell>{r.needsCheck ? <span className="text-xs font-semibold text-destructive">Kontrollera och verifiera på nytt</span> : ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
