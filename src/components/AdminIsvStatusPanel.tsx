import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const BC_USE_CASES: [string, string][] = [
  ["", "Härled från kategori"], ["wms", "Lager och WMS"], ["scanning", "Scanning och mobilt"], ["manufacturing", "Tillverkning"],
  ["planning", "Planering"], ["edi", "EDI och e-faktura"], ["ap-automation", "Leverantörsfakturor (AP)"], ["expense", "Utlägg"],
  ["payroll", "Lön och HR"], ["banking", "Bank och betalningar"], ["tax", "Skatt och moms"], ["document-management", "Dokumenthantering"],
  ["e-commerce", "E-handel"], ["shipping", "Frakt och logistik"], ["reporting-bi", "Rapportering och BI"], ["integration", "Integration"],
  ["localization", "Svensk lokalisering"], ["industry", "Branschlösning"], ["other", "Övrigt"],
];
const emptyBc = { bc_slug: "", bc_intro: "", bc_seo_title: "", bc_seo_description: "", bc_editorial_context: "", bc_use_case: "" };

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
  const [bcEdit, setBcEdit] = useState<{ id: string; name: string; form: typeof emptyBc } | null>(null);

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

  const saveBc = async () => {
    if (!bcEdit) return;
    const res = await fetch(`${baseUrl}?action=set_bc_presentation`, { method: "POST", headers: headers(), body: JSON.stringify({ solution_id: bcEdit.id, ...bcEdit.form }) });
    if (res.status === 401) return onSessionExpired();
    const data = await res.json();
    if (!res.ok) {
      toast({ title: "Kunde inte spara", description: data?.error, variant: "destructive" });
      return;
    }
    toast({ title: "Sparat för businesscentral.se" });
    setBcEdit(null);
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
          Publik status härleds automatiskt: Verifierad av d365.se kräver verifieringen Verifierad, annars visas Bekräftad av leverantören om bekräftelse finns, annars Automatiskt sammanställd.
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
                        {p.publish_businesscentral && (
                          <button
                            type="button"
                            className="text-xs text-primary hover:underline mt-1"
                            onClick={() => setBcEdit({ id: p.solution_id, name: p.name, form: { ...emptyBc, ...Object.fromEntries(Object.entries(p.bc_presentation || {}).filter(([k]) => k in emptyBc).map(([k, v]) => [k, v ?? ""])) } })}
                          >
                            Text för businesscentral.se{p.information_status !== "verified" ? " (visas först när produkten är verifierad)" : ""}
                          </button>
                        )}
                      </TableCell>
                      {statusCells(p, "product", p.solution_id)}
                      {publishCells(p, "product", p.solution_id)}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={!!bcEdit} onOpenChange={(o) => !o && setBcEdit(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{bcEdit?.name} på businesscentral.se</DialogTitle>
          </DialogHeader>
          {bcEdit && (
            <div className="space-y-3 text-sm">
              <p className="text-xs text-muted-foreground">
                Bara presentationen på businesscentral.se. Produktdata, kompatibilitet och status hämtas från samma produkt som på d365.se.
              </p>
              <div>
                <Label htmlFor="bc-slug">Adress (lämna tomt för produktens id)</Label>
                <Input id="bc-slug" value={bcEdit.form.bc_slug} onChange={(e) => setBcEdit({ ...bcEdit, form: { ...bcEdit.form, bc_slug: e.target.value } })} />
              </div>
              <div>
                <Label htmlFor="bc-use">Use case</Label>
                <select id="bc-use" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={bcEdit.form.bc_use_case} onChange={(e) => setBcEdit({ ...bcEdit, form: { ...bcEdit.form, bc_use_case: e.target.value } })}>
                  {BC_USE_CASES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="bc-intro">Ingress</Label>
                <Textarea id="bc-intro" rows={3} maxLength={1000} value={bcEdit.form.bc_intro} onChange={(e) => setBcEdit({ ...bcEdit, form: { ...bcEdit.form, bc_intro: e.target.value } })} />
              </div>
              <div>
                <Label htmlFor="bc-title">SEO-titel ({bcEdit.form.bc_seo_title.length}/60)</Label>
                <Input id="bc-title" maxLength={70} value={bcEdit.form.bc_seo_title} onChange={(e) => setBcEdit({ ...bcEdit, form: { ...bcEdit.form, bc_seo_title: e.target.value } })} />
              </div>
              <div>
                <Label htmlFor="bc-desc">Metabeskrivning ({bcEdit.form.bc_seo_description.length}/160)</Label>
                <Textarea id="bc-desc" rows={2} maxLength={160} value={bcEdit.form.bc_seo_description} onChange={(e) => setBcEdit({ ...bcEdit, form: { ...bcEdit.form, bc_seo_description: e.target.value } })} />
              </div>
              <div>
                <Label htmlFor="bc-ctx">Redaktionell kontext</Label>
                <Textarea id="bc-ctx" rows={5} maxLength={4000} value={bcEdit.form.bc_editorial_context} onChange={(e) => setBcEdit({ ...bcEdit, form: { ...bcEdit.form, bc_editorial_context: e.target.value } })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBcEdit(null)}>Avbryt</Button>
            <Button onClick={saveBc}>Spara</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
