import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, PackagePlus } from "lucide-react";
import { ISV_PRODUCTS, ISV_INDUSTRIES } from "@/data/isvProfileOptions";
import IsvPartnerPicker from "@/components/IsvPartnerPicker";
import type { IsvSolutionRow } from "@/hooks/useIsvSolutions";
import { CATEGORIES as CATALOG_CATEGORIES, DELIVERY_MODELS } from "@/data/bcIsvSolutions";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
  onChanged?: () => void;
}

const CATEGORIES = [...CATALOG_CATEGORIES];

/** Leveransform – produktneutral, ersätter tidigare fritextfältet "typ". */
const DELIVERY_LABELS: Record<string, string> = {
  native_isv: "Native (ISV) – byggd i Dynamics 365",
  external_saas: "Externt system (SaaS) med integration",
  integration_layer: "Integrationslager / iPaaS",
  industry_solution: "Branschlösning",
};

const RELEVANCE_OPTIONS = [
  { value: "", label: "– ej angivet –" },
  { value: "yes", label: "Ja" },
  { value: "partial", label: "Delvis" },
  { value: "no", label: "Nej" },
];

const emptyForm = {
  solution_id: "",
  name: "",
  vendor: "",
  vendor_website: "",
  short_description: "",
  category: CATEGORIES[0] as string,
  subcategory: "",
  delivery_model: "native_isv",
  type: "BC-native (ISV)",
  tier: "Tier 2",
  what: "",
  when_fits: "",
  best_for: "",
  considerations: "",
  source_url: "",
  verified_at: "",
  finance_relevance: "",
  supply_chain_relevance: "",
  sales_relevance: "",
  customer_insights_relevance: "",
  customer_service_relevance: "",
  field_service_relevance: "",
  contact_center_relevance: "",
  source_status: "",
  editorial_tier: "",
  nordic_relevance: "",
  publication_wave: "",
  tags: "",
  use_cases: "",
  combos: "",
  products: [] as string[],
  industry_focus: [] as string[],
  partner_slugs: [] as string[],
  is_published: true,
  sort_order: 0,
};

type Form = typeof emptyForm;


const slugify = (v: string) =>
  v.toLowerCase().replace(/[åä]/g, "a").replace(/ö/g, "o").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Admin: lägg till och underhåll ISV-lösningar direkt i databasen. */
export default function AdminIsvNewSolutions({ token, onSessionExpired, onChanged }: Props) {
  const { toast } = useToast();
  const [rows, setRows] = useState<IsvSolutionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  const [isNew, setIsNew] = useState(true);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-isv-solutions`;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
    apikey,
    "Content-Type": "application/json",
  });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}?action=list_solutions`, { headers: authHeaders() });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte hämta lösningar");
      setRows((data.solutions || []) as IsvSolutionRow[]);
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const openNew = () => { setForm({ ...emptyForm }); setIsNew(true); };
  const openEdit = (r: IsvSolutionRow) => {
    setIsNew(false);
    setForm({
      solution_id: r.solution_id,
      name: r.name,
      vendor: r.vendor,
      vendor_website: r.vendor_website || "",
      short_description: r.short_description || "",
      category: r.category,
      subcategory: r.subcategory || "",
      delivery_model: r.delivery_model || "native_isv",
      type: r.type,
      tier: r.tier,
      what: r.what || "",
      when_fits: r.when_fits || "",
      best_for: r.best_for || "",
      considerations: r.considerations || "",
      source_url: r.source_url || "",
      verified_at: (r.verified_at || "").slice(0, 10),
      finance_relevance: r.finance_relevance || "",
      supply_chain_relevance: r.supply_chain_relevance || "",
      sales_relevance: r.sales_relevance || "",
      customer_insights_relevance: r.customer_insights_relevance || "",
      customer_service_relevance: r.customer_service_relevance || "",
      field_service_relevance: r.field_service_relevance || "",
      contact_center_relevance: r.contact_center_relevance || "",
      source_status: r.source_status || "",
      editorial_tier: r.editorial_tier || "",
      nordic_relevance: r.nordic_relevance || "",
      publication_wave: r.publication_wave || "",
      tags: (r.tags || []).join(", "),
      use_cases: (r.use_cases || []).join("\n"),
      combos: (r.combos || []).join("\n"),
      products: r.products || [],
      industry_focus: r.industry_focus || [],
      partner_slugs: r.partner_slugs || [],
      is_published: r.is_published !== false,
      sort_order: r.sort_order ?? 0,
    });

  };

  const toggleList = (key: "products" | "industry_focus", value: string) =>
    setForm((p) =>
      p
        ? { ...p, [key]: p[key].includes(value) ? p[key].filter((v) => v !== value) : [...p[key], value] }
        : p
    );

  const save = async () => {
    if (!form) return;
    if (!form.name.trim() || !form.vendor.trim()) {
      toast({ title: "Fyll i namn och leverantör", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}?action=${isNew ? "create_solution" : "update_solution"}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          ...form,
          solution_id: form.solution_id.trim() || slugify(`${form.vendor}-${form.name}`),
          tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
          use_cases: form.use_cases.split("\n").map((s) => s.trim()).filter(Boolean),
          combos: form.combos.split("\n").map((s) => s.trim()).filter(Boolean),
          verified_at: form.verified_at || null,
        }),
      });

      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte spara");
      toast({ title: "Sparat", description: form.name });
      setForm(null);
      await load();
      onChanged?.();
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (r: IsvSolutionRow) => {
    try {
      const res = await fetch(`${baseUrl}?action=toggle_solution`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ solution_id: r.solution_id, is_published: r.is_published === false }),
      });
      if (res.status === 401) return onSessionExpired();
      if (!res.ok) throw new Error((await res.json())?.error || "Kunde inte uppdatera");
      await load();
      onChanged?.();
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    }
  };

  const remove = async (r: IsvSolutionRow) => {
    if (!confirm(`Ta bort "${r.name}" ur katalogen?`)) return;
    try {
      const res = await fetch(
        `${baseUrl}?action=delete_solution&solution_id=${encodeURIComponent(r.solution_id)}`,
        { method: "DELETE", headers: authHeaders() }
      );
      if (res.status === 401) return onSessionExpired();
      if (!res.ok) throw new Error((await res.json())?.error || "Kunde inte ta bort");
      toast({ title: "Borttagen", description: r.name });
      await load();
      onChanged?.();
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5 text-[hsl(var(--cta-orange))]" />
            Nya lösningar i tilläggskatalogen
          </CardTitle>
          <CardDescription>
            Lägg till lösningar som inte finns i kodkatalogen – för alla Dynamics 365-produkter. De visas
            i tilläggskatalogen tillsammans med övriga lösningar och grupperas per leverantör.
          </CardDescription>
        </div>
        <Button onClick={openNew} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" /> Ny lösning
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Laddar…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Inga egna lösningar tillagda ännu.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lösning</TableHead>
                  <TableHead>Leverantör</TableHead>
                  <TableHead>Produkter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Åtgärd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.solution_id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.vendor}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {(r.products || []).join(", ") || "–"}
                    </TableCell>
                    <TableCell>
                      <button onClick={() => togglePublished(r)}>
                        <Badge variant={r.is_published === false ? "outline" : "default"}>
                          {r.is_published === false ? "Dold" : "Publicerad"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" onClick={() => openEdit(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(r)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? "Ny lösning" : `Redigera ${form?.name}`}</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Lösningens namn *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label>Leverantör *</Label>
                  <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
                </div>
                <div>
                  <Label>Leverantörens webbplats</Label>
                  <Input
                    value={form.vendor_website}
                    onChange={(e) => setForm({ ...form, vendor_website: e.target.value })}
                    placeholder="https://…"
                  />
                </div>
                <div>
                  <Label>Kategori</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Underkategori</Label>
                  <Input
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    placeholder="t.ex. Anläggningsunderhåll"
                  />
                </div>
                <div>
                  <Label>Leveransform</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.delivery_model}
                    onChange={(e) => setForm({ ...form, delivery_model: e.target.value })}
                  >
                    {DELIVERY_MODELS.map((d) => (
                      <option key={d} value={d}>{DELIVERY_LABELS[d]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Relevans Finance</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.finance_relevance}
                    onChange={(e) => setForm({ ...form, finance_relevance: e.target.value })}
                  >
                    {RELEVANCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Relevans Supply Chain</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.supply_chain_relevance}
                    onChange={(e) => setForm({ ...form, supply_chain_relevance: e.target.value })}
                  >
                    {RELEVANCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Relevans Sales</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.sales_relevance}
                    onChange={(e) => setForm({ ...form, sales_relevance: e.target.value })}
                  >
                    {RELEVANCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Relevans Customer Insights</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.customer_insights_relevance}
                    onChange={(e) => setForm({ ...form, customer_insights_relevance: e.target.value })}
                  >
                    {RELEVANCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Relevans Customer Service</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.customer_service_relevance}
                    onChange={(e) => setForm({ ...form, customer_service_relevance: e.target.value })}
                  >
                    {RELEVANCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Relevans Field Service</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.field_service_relevance}
                    onChange={(e) => setForm({ ...form, field_service_relevance: e.target.value })}
                  >
                    {RELEVANCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Relevans Contact Center</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.contact_center_relevance}
                    onChange={(e) => setForm({ ...form, contact_center_relevance: e.target.value })}
                  >
                    {RELEVANCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Källstatus (intern)</Label>
                  <Input
                    value={form.source_status}
                    onChange={(e) => setForm({ ...form, source_status: e.target.value })}
                    placeholder="Verifierad / Verifiera före publicering"
                  />
                </div>
                <div>
                  <Label>Källa (URL)</Label>
                  <Input
                    value={form.source_url}
                    onChange={(e) => setForm({ ...form, source_url: e.target.value })}
                    placeholder="https://…"
                  />
                </div>
                <div>
                  <Label>Kontrollerad datum</Label>
                  <Input
                    type="date"
                    value={form.verified_at}
                    onChange={(e) => setForm({ ...form, verified_at: e.target.value })}
                  />
                </div>

                <div>
                  <Label>ID (lämna tomt för automatiskt)</Label>
                  <Input
                    value={form.solution_id}
                    disabled={!isNew}
                    onChange={(e) => setForm({ ...form, solution_id: e.target.value })}
                    placeholder={slugify(`${form.vendor}-${form.name}`)}
                  />
                </div>
              </div>

              <div>
                <Label>Kort beskrivning</Label>
                <Textarea
                  rows={2}
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                />
              </div>
              <div>
                <Label>Vad lösningen gör</Label>
                <Textarea rows={3} value={form.what} onChange={(e) => setForm({ ...form, what: e.target.value })} />
              </div>
              <div>
                <Label>När den passar</Label>
                <Textarea rows={2} value={form.when_fits} onChange={(e) => setForm({ ...form, when_fits: e.target.value })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Passar bäst för</Label>
                  <Textarea rows={2} value={form.best_for} onChange={(e) => setForm({ ...form, best_for: e.target.value })} />
                </div>
                <div>
                  <Label>Tänk på</Label>
                  <Textarea rows={2} value={form.considerations} onChange={(e) => setForm({ ...form, considerations: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Taggar (kommaseparerade)</Label>
                <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="rounded-md border border-dashed border-border p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Endast redaktionellt – visas aldrig för besökare
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <Label>Redaktionell nivå</Label>
                    <Input value={form.editorial_tier} onChange={(e) => setForm({ ...form, editorial_tier: e.target.value })} />
                  </div>
                  <div>
                    <Label>Nordisk relevans</Label>
                    <Input value={form.nordic_relevance} onChange={(e) => setForm({ ...form, nordic_relevance: e.target.value })} />
                  </div>
                  <div>
                    <Label>Publiceringsvåg</Label>
                    <Input value={form.publication_wave} onChange={(e) => setForm({ ...form, publication_wave: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Användningsfall (ett per rad)</Label>
                  <Textarea rows={4} value={form.use_cases} onChange={(e) => setForm({ ...form, use_cases: e.target.value })} />
                </div>
                <div>
                  <Label>Vanliga kombinationer (en per rad)</Label>
                  <Textarea rows={4} value={form.combos} onChange={(e) => setForm({ ...form, combos: e.target.value })} />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Dynamics 365-produkter</Label>
                <div className="flex flex-wrap gap-3">
                  {ISV_PRODUCTS.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={form.products.includes(p)} onCheckedChange={() => toggleList("products", p)} />
                      {p}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Branscher</Label>
                <div className="flex flex-wrap gap-3">
                  {ISV_INDUSTRIES.map((i) => (
                    <label key={i} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={form.industry_focus.includes(i)}
                        onCheckedChange={() => toggleList("industry_focus", i)}
                      />
                      {i}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Återförsäljare / partners</Label>
                <IsvPartnerPicker
                  value={form.partner_slugs}
                  onChange={(slugs) => setForm({ ...form, partner_slugs: slugs })}
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.is_published}
                  onCheckedChange={(c) => setForm({ ...form, is_published: c === true })}
                />
                Publicerad i katalogen
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setForm(null)}>Avbryt</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
