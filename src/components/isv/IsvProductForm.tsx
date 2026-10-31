import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Building2, Handshake } from "lucide-react";
import { ISV_PRODUCTS, ISV_INDUSTRIES } from "@/data/isvProfileOptions";
import IsvPartnerPicker from "@/components/IsvPartnerPicker";

export const DELIVERY_OPTIONS: { value: string; label: string }[] = [
  { value: "native_isv", label: "Inbyggd i Dynamics 365 (app/tillägg)" },
  { value: "external_saas", label: "Externt system med integration" },
  { value: "integration_layer", label: "Integrationsplattform/koppling" },
  { value: "industry_solution", label: "Branschlösning" },
];
export const GEO_OPTIONS = ["Sverige", "Norden", "Europa", "Global"];

export interface ProductFormState {
  name: string;
  category: string;
  short_description: string;
  what: string;
  when_fits: string;
  use_cases: string;
  combos: string;
  products: string[];
  industries: string[];
  partner_slugs: string[];
  vendor_website: string;
  delivery_model: string;
  geo: string[];
  contact_name: string;
  contact_email: string;
  notes: string;
  confirm_information: boolean;
  request_publication: boolean;
}

export const emptyProductForm: ProductFormState = {
  name: "",
  category: "",
  short_description: "",
  what: "",
  when_fits: "",
  use_cases: "",
  combos: "",
  products: [],
  industries: [],
  partner_slugs: [],
  vendor_website: "",
  delivery_model: "",
  geo: [],
  contact_name: "",
  contact_email: "",
  notes: "",
  confirm_information: false,
  request_publication: false,
};

export const toLines = (v: string) => v.split("\n").map((x) => x.trim()).filter(Boolean);

export const productFormValid = (f: ProductFormState, isNew: boolean) =>
  f.products.length > 0 && !!(f.short_description.trim() || f.what.trim()) && (!isNew || !!f.name.trim());

interface Props {
  form: ProductFormState;
  setForm: (f: ProductFormState) => void;
  /** Ny produkt: visar namn, kategori och "skicka för publicering". */
  isNew?: boolean;
  /** Dölj kontaktkortet (leverantörsläget har kontakt i leverantörsprofilen). */
  hideContact?: boolean;
  categories?: string[];
}

/** Produktformuläret i leverantörens självservice. Inget publiceras utan redaktionens granskning. */
export default function IsvProductForm({ form, setForm, isNew = false, hideContact = false, categories = [] }: Props) {
  const toggle = (key: "products" | "industries" | "geo", value: string) =>
    setForm({ ...form, [key]: form[key].includes(value) ? form[key].filter((v) => v !== value) : [...form[key], value] });
  const sel = "w-full h-10 rounded-md border border-input bg-background px-3 text-sm";

  return (
    <div className="space-y-6">
      {isNew && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ny produkt</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="isv-new-name">Produktens namn</Label>
              <Input id="isv-new-name" value={form.name} maxLength={200} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="isv-new-cat">Kategori</Label>
              <select id="isv-new-cat" className={sel} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Välj kategori</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="w-4 h-4" /> Produktinriktning
          </CardTitle>
          <CardDescription>Vilka Dynamics 365-applikationer är lösningen byggd för? (minst en)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-2">
            {ISV_PRODUCTS.map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.products.includes(p)} onCheckedChange={() => toggle("products", p)} />
                {p}
              </label>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="isv-delivery">Integrationstyp</Label>
              <select id="isv-delivery" className={sel} value={form.delivery_model} onChange={(e) => setForm({ ...form, delivery_model: e.target.value })}>
                <option value="">Välj (valfritt)</option>
                {DELIVERY_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <span className="text-sm font-medium leading-none">Tillgänglig i</span>
              <div className="flex flex-wrap gap-3 mt-2">
                {GEO_OPTIONS.map((g) => (
                  <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={form.geo.includes(g)} onCheckedChange={() => toggle("geo", g)} />
                    {g}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-4 h-4" /> Branschinriktning
          </CardTitle>
          <CardDescription>Kryssa i de branscher lösningen passar för. Lämna tomt om den är generell.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2">
          {ISV_INDUSTRIES.map((i) => (
            <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={form.industries.includes(i)} onCheckedChange={() => toggle("industries", i)} />
              {i}
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Handshake className="w-4 h-4" /> Återförsäljare / partners
          </CardTitle>
          <CardDescription>Vilka svenska Dynamics 365-partners säljer eller implementerar lösningen?</CardDescription>
        </CardHeader>
        <CardContent>
          <IsvPartnerPicker value={form.partner_slugs} onChange={(partner_slugs) => setForm({ ...form, partner_slugs })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Beskrivning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="isv-short">Kort beskrivning (en rad, visas på kortet)</Label>
            <Input id="isv-short" value={form.short_description} maxLength={400} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="isv-what">Vad lösningen är</Label>
            <Textarea id="isv-what" rows={4} value={form.what} onChange={(e) => setForm({ ...form, what: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="isv-when">När den passar</Label>
            <Textarea id="isv-when" rows={3} value={form.when_fits} onChange={(e) => setForm({ ...form, when_fits: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="isv-use">Vad den används till (en per rad)</Label>
            <Textarea id="isv-use" rows={4} value={form.use_cases} onChange={(e) => setForm({ ...form, use_cases: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="isv-combos">Vanliga kombinationer (en per rad)</Label>
            <Textarea id="isv-combos" rows={3} value={form.combos} onChange={(e) => setForm({ ...form, combos: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="isv-web">Produktens webbplats</Label>
            <Input id="isv-web" placeholder="https://" value={form.vendor_website} onChange={(e) => setForm({ ...form, vendor_website: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {!hideContact && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kontakt</CardTitle>
            <CardDescription>Publiceras inte, används av redaktionen vid frågor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="isv-cname">Kontaktperson</Label>
                <Input id="isv-cname" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="isv-cmail">E-post</Label>
                <Input id="isv-cmail" type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="isv-notes">Övrigt till redaktionen</Label>
            <Textarea id="isv-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <Checkbox className="mt-0.5" checked={form.confirm_information} onCheckedChange={(v) => setForm({ ...form, confirm_information: !!v })} />
            <span>Vi bekräftar att uppgifterna om produkten stämmer. Redaktionen granskar uppgifterna innan de kan visas som Verifierad av d365.se.</span>
          </label>
          {isNew && (
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <Checkbox className="mt-0.5" checked={form.request_publication} onCheckedChange={(v) => setForm({ ...form, request_publication: !!v })} />
              <span>Skicka produkten för publicering. Redaktionen granskar innan den visas i katalogen.</span>
            </label>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
