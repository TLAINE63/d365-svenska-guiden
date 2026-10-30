import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";
import InformationStatusBadge from "@/components/partner/InformationStatusBadge";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

type Row = Record<string, any>;

const SOURCES: [string, string][] = [
  ["d365_research", "d365.se research"],
  ["d365_ai_research", "d365.se research med AI-stöd"],
  ["vendor_submitted", "Inskickat av leverantören"],
  ["mixed", "Blandat"],
];
const CONFIRM: [string, string][] = [["not_confirmed", "Ej bekräftad"], ["confirmed", "Bekräftad"]];
const VERIFY: [string, string][] = [
  ["not_reviewed", "Ej granskad"],
  ["reviewed", "Granskad"],
  ["partially_verified", "Delvis verifierad"],
  ["verified", "Verifierad"],
  ["verification_expired", "Verifiering utgången"],
];
const PUBLICATION: [string, string][] = [["draft", "Utkast"], ["submitted", "Inskickad"], ["published", "Publicerad"], ["hidden", "Dold"]];
const BOA: [string, string][] = [["none", "Inget"], ["offered", "Erbjudet"], ["signed", "Signerat"], ["ended", "Avslutat"]];

const sel = "h-8 rounded-md border border-input bg-background px-2 text-xs";

function Select({ value, options, onChange, label }: { value: string; options: [string, string][]; onChange: (v: string) => void; label: string }) {
  return (
    <select aria-label={label} className={sel} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

/**
 * Sprint 1.9: redaktionens manuella status för ISV-leverantörer och ISV-produkter.
 * Leverantör och produkt sätts var för sig. Premium och avtal påverkar aldrig informationsstatus eller ordning.
 */
export default function AdminIsvStatusPanel({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Row[]>([]);
  const [products, setProducts] = useState<Row[]>([]);
  const [tab, setTab] = useState<"vendors" | "products">("vendors");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-isv-solutions`;
  const headers = () => ({ Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}?action=list_status`, { headers: headers() });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte hämta status");
      setVendors(data.vendors || []);
      setProducts(data.products || []);
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const save = async (kind: "vendor" | "product", key: string, fields: Record<string, unknown>) => {
    const action = kind === "vendor" ? "set_vendor_status" : "set_product_status";
    const body = kind === "vendor" ? { slug: key, ...fields } : { solution_id: key, ...fields };
    const res = await fetch(`${baseUrl}?action=${action}`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    if (res.status === 401) return onSessionExpired();
    const data = await res.json();
    if (!res.ok) {
      toast({ title: "Kunde inte spara", description: data?.error, variant: "destructive" });
      return;
    }
    await load();
  };

  const term = q.trim().toLowerCase();
  const vList = useMemo(() => vendors.filter((v) => !term || `${v.name} ${v.slug}`.toLowerCase().includes(term)), [vendors, term]);
  const pList = useMemo(() => products.filter((p) => !term || `${p.name} ${p.vendor}`.toLowerCase().includes(term)), [products, term]);

  const publishCells = (r: Row, kind: "vendor" | "product", key: string) => (
    <TableCell>
      <div className="flex flex-col gap-1 text-xs">
        {([["publish_d365", "d365.se"], ["publish_businesscentral", "businesscentral.se"], ["publish_d365guide", "d365guide.com"]] as const).map(([f, l]) => (
          <label key={f} className="flex items-center gap-1.5 whitespace-nowrap">
            <Checkbox checked={!!r[f]} onCheckedChange={(v) => save(kind, key, { [f]: !!v })} /> {l}
          </label>
        ))}
      </div>
    </TableCell>
  );

  const statusCells = (r: Row, kind: "vendor" | "product", key: string) => (
    <>
      <TableCell><InformationStatusBadge kind="isv" showDate partner={{ information_status: r.information_status, information_verified_at: r.last_verified_date }} /></TableCell>
      <TableCell><Select label="Källa" value={r[kind === "vendor" ? "profile_source" : "product_source"]} options={SOURCES} onChange={(v) => save(kind, key, { [kind === "vendor" ? "profile_source" : "product_source"]: v })} /></TableCell>
      <TableCell><Select label="Bekräftelse" value={r.confirmation_status} options={CONFIRM} onChange={(v) => save(kind, key, { confirmation_status: v })} /></TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Select label="Verifiering" value={r.verification_status} options={VERIFY} onChange={(v) => save(kind, key, { verification_status: v })} />
          <input
            type="date"
            aria-label="Senast verifierad"
            className={sel}
            value={r.last_verified_date || ""}
            onChange={(e) => save(kind, key, { last_verified_date: e.target.value || null })}
          />
        </div>
      </TableCell>
      <TableCell>
        <label className="flex items-center gap-1.5 text-xs">
          <Checkbox checked={!!r[kind === "vendor" ? "premium_vendor" : "premium_product"]} onCheckedChange={(v) => save(kind, key, { [kind === "vendor" ? "premium_vendor" : "premium_product"]: !!v })} /> Premium
        </label>
      </TableCell>
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-accent" /> Informationsstatus för leverantörer och produkter
        </CardTitle>
        <CardDescription>
          Publik status härleds automatiskt: Verifierad av d365.se kräver verifieringen Verifierad, annars visas Bekräftad av leverantören om bekräftelse finns, annars Sammanställd av d365.se.
          Leverantör och produkt sätts var för sig. Premium och avtal påverkar aldrig status eller ordning.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={tab === "vendors" ? "default" : "outline"} onClick={() => setTab("vendors")}>Leverantörer ({vendors.length})</Button>
          <Button size="sm" variant={tab === "products" ? "default" : "outline"} onClick={() => setTab("products")}>Produkter ({products.length})</Button>
          <Input className="max-w-xs h-9" placeholder="Sök…" value={q} onChange={(e) => setQ(e.target.value)} />
          {loading && <span className="text-xs text-muted-foreground">Laddar…</span>}
        </div>
        <div className="rounded-md border overflow-x-auto max-h-[70vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tab === "vendors" ? "Leverantör" : "Produkt"}</TableHead>
                <TableHead>Publik status</TableHead>
                <TableHead>Källa</TableHead>
                <TableHead>Bekräftelse</TableHead>
                <TableHead>Verifiering</TableHead>
                <TableHead>Kommersiellt</TableHead>
                {tab === "vendors" && <TableHead>Publicering / avtal</TableHead>}
                <TableHead>Visas på</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tab === "vendors"
                ? vList.map((v) => (
                    <TableRow key={v.slug}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      {statusCells(v, "vendor", v.slug)}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Select label="Publicering" value={v.publication_status} options={PUBLICATION} onChange={(x) => save("vendor", v.slug, { publication_status: x })} />
                          <Select label="Buyer Opportunity Agreement" value={v.buyer_opportunity_agreement_status} options={BOA} onChange={(x) => save("vendor", v.slug, { buyer_opportunity_agreement_status: x })} />
                        </div>
                      </TableCell>
                      {publishCells(v, "vendor", v.slug)}
                    </TableRow>
                  ))
                : pList.map((p) => (
                    <TableRow key={p.solution_id}>
                      <TableCell>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.vendor}{!p.is_published && " · ej publicerad"}</p>
                      </TableCell>
                      {statusCells(p, "product", p.solution_id)}
                      {publishCells(p, "product", p.solution_id)}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
