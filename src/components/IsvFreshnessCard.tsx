import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InformationStatusBadge from "@/components/partner/InformationStatusBadge";
import type { FreshnessSort } from "@/lib/partnerFreshness";
import { isvFreshnessRows, type IsvFreshnessInput } from "@/lib/isvFreshness";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const SORTS: { value: FreshnessSort; label: string }[] = [
  { value: "needs_check", label: "Behöver kontroll först" },
  { value: "partner_updated_desc", label: "Leverantören uppdaterade senast" },
  { value: "partner_updated_asc", label: "Äldst leverantörsuppdatering" },
  { value: "verified_asc", label: "Äldst verifiering" },
];

/** Admin + Redaktion: när ISV-leverantören själv uppdaterade och när d365.se senast verifierade. */
export default function IsvFreshnessCard({ token, onSessionExpired }: Props) {
  const [sort, setSort] = useState<FreshnessSort>("needs_check");
  const [tab, setTab] = useState<"vendors" | "products">("vendors");
  const [vendors, setVendors] = useState<IsvFreshnessInput[]>([]);
  const [products, setProducts] = useState<IsvFreshnessInput[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-isv-solutions?action=list_freshness`, {
          headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        if (res.status === 401) return onSessionExpired();
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Kunde inte hämta");
        if (cancelled) return;
        setVendors((data.vendors || []).map((v: any) => ({ ...v, id: v.slug })));
        setProducts((data.products || []).map((p: any) => ({ ...p, id: p.solution_id })));
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const vRows = useMemo(() => isvFreshnessRows(vendors, sort), [vendors, sort]);
  const pRows = useMemo(() => isvFreshnessRows(products, sort), [products, sort]);
  const rows = tab === "vendors" ? vRows : pRows;
  const toCheck = vRows.filter((r) => r.needsCheck).length + pRows.filter((r) => r.needsCheck).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">ISV: informationsstatus och aktualitet</CardTitle>
        <CardDescription>
          {toCheck} verifierade leverantörer eller produkter har uppdaterats av leverantören efter senaste verifiering. Sätt nytt verifieringsdatum under Admin → ISV-katalogen när du kontrollerat.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={tab === "vendors" ? "default" : "outline"} onClick={() => setTab("vendors")}>Leverantörer ({vendors.length})</Button>
          <Button size="sm" variant={tab === "products" ? "default" : "outline"} onClick={() => setTab("products")}>Produkter ({products.length})</Button>
          <label className="text-sm flex items-center gap-2 ml-auto">
            Sortera
            <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={sort} onChange={(e) => setSort(e.target.value as FreshnessSort)}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="overflow-x-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tab === "vendors" ? "Leverantör" : "Produkt"}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Senast verifierad</TableHead>
                <TableHead>Leverantören uppdaterade</TableHead>
                <TableHead>Att göra</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <p className="font-medium">{r.name}</p>
                    {tab === "products" && r.vendor && <p className="text-xs text-muted-foreground">{r.vendor}</p>}
                  </TableCell>
                  <TableCell><InformationStatusBadge kind="isv" partner={{ information_status: r.status }} /></TableCell>
                  <TableCell>{r.verifiedAt ?? "–"}</TableCell>
                  <TableCell>{r.vendorUpdatedAt ?? "–"}</TableCell>
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
