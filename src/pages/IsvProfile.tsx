import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, Plus, Pencil } from "lucide-react";
import IsvProductForm, { emptyProductForm, productFormValid, toLines, type ProductFormState } from "@/components/isv/IsvProductForm";
import InformationStatusBadge from "@/components/partner/InformationStatusBadge";
import { CATEGORIES } from "@/data/bcIsvSolutions";

interface Invitation {
  solution_id: string;
  solution_name: string;
  vendor_name: string | null;
  email: string;
  status: string;
  expires_at: string;
  scope?: string;
  vendor_slug?: string | null;
}

interface VendorData {
  slug: string;
  name: string;
  website: string | null;
  description: string | null;
  logo_url: string | null;
  information_status: string | null;
  contact_name: string | null;
  contact_email: string | null;
}

type Row = Record<string, any>;

const fromSource = (src: Row | null | undefined, fallback: Partial<ProductFormState> = {}): ProductFormState => ({
  ...emptyProductForm,
  ...fallback,
  ...(src
    ? {
        short_description: src.short_description || "",
        what: src.what || "",
        when_fits: src.when_fits || "",
        use_cases: (src.use_cases || []).join("\n"),
        combos: (src.combos || []).join("\n"),
        products: src.products || [],
        industries: src.industries || src.industry_focus || [],
        partner_slugs: src.partner_slugs || [],
        vendor_website: src.vendor_website || "",
        delivery_model: src.delivery_model || src.payload?.delivery_model || "",
        geo: src.geo || src.payload?.geo || [],
        contact_name: src.contact_name || src.vendor_contact_name || fallback.contact_name || "",
        contact_email: src.contact_email || src.vendor_contact_email || fallback.contact_email || "",
        notes: src.notes || "",
      }
    : {}),
});

const formBody = (f: ProductFormState) => ({
  ...f,
  use_cases: toLines(f.use_cases),
  combos: toLines(f.combos),
});

export default function IsvProfile() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const [honeypot, setHoneypot] = useState("");
  const [done, setDone] = useState<string | null>(null);

  // Leverantörsläge
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [vendorForm, setVendorForm] = useState({ website: "", description: "", logo_url: "", contact_name: "", contact_email: "", confirm_information: false });
  const [products, setProducts] = useState<Row[]>([]);
  const [overrides, setOverrides] = useState<Record<string, Row>>({});
  const [submissions, setSubmissions] = useState<Row[]>([]);
  const [editing, setEditing] = useState<{ id: string | null; name: string } | null>(null);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isv-profile`;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const isVendor = invitation?.scope === "vendor";

  const load = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${baseUrl}?token=${encodeURIComponent(token)}`, { headers: { apikey, Authorization: `Bearer ${apikey}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Länken kunde inte öppnas");
      setInvitation(data.invitation);
      if (data.invitation?.scope === "vendor") {
        const v: VendorData | null = data.vendor;
        setVendor(v);
        setVendorForm({
          website: v?.website || "",
          description: v?.description || "",
          logo_url: v?.logo_url || "",
          contact_name: v?.contact_name || "",
          contact_email: v?.contact_email || data.invitation?.email || "",
          confirm_information: false,
        });
        setProducts(data.products || []);
        const map: Record<string, Row> = {};
        for (const o of data.overrides || []) map[o.solution_id] = o;
        setOverrides(map);
        setSubmissions(data.submissions || []);
      } else {
        const src = data.submission || data.override;
        setForm(fromSource(src, { contact_email: data.invitation?.email || "" }));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [token]);

  const post = async (body: Record<string, unknown>) => {
    if (!token) return false;
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { apikey, Authorization: `Bearer ${apikey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, company_website_hp: honeypot }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte skicka in");
      return true;
    } catch (e) {
      toast.error((e as Error).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const pendingFor = (id: string) => submissions.find((s) => s.solution_id === id && s.status === "pending");
  const pendingNew = useMemo(() => submissions.filter((s) => s.kind === "new_solution" && s.status === "pending"), [submissions]);

  const startEdit = (p: Row | null) => {
    if (!p) {
      setForm({ ...emptyProductForm, contact_name: vendorForm.contact_name, contact_email: vendorForm.contact_email });
      setEditing({ id: null, name: "" });
    } else {
      setForm(fromSource({ ...p, ...(overrides[p.solution_id] || {}) }));
      setEditing({ id: p.solution_id, name: p.name });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitProduct = async () => {
    const isNew = isVendor && editing?.id === null;
    const ok = await post({
      ...formBody(form),
      kind: isNew ? "new_solution" : "solution_update",
      solution_id: isVendor ? editing?.id : undefined,
      contact_name: isVendor ? vendorForm.contact_name : form.contact_name,
      contact_email: isVendor ? vendorForm.contact_email : form.contact_email,
    });
    if (!ok) return;
    if (isVendor) {
      toast.success("Tack, redaktionen granskar ändringen.");
      setEditing(null);
      await load();
    } else {
      setDone("Din beskrivning är inskickad och granskas av redaktionen innan den publiceras i katalogen.");
    }
  };

  const submitVendor = async () => {
    const ok = await post({ kind: "vendor_profile", ...vendorForm });
    if (ok) {
      toast.success("Tack, redaktionen granskar leverantörsprofilen.");
      await load();
    }
  };

  const honeypotInput = (
    <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden="true" />
  );

  const productEditor = (isNew: boolean, title: string) => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">
          d365.se kartlägger tillägg och ISV-lösningar för Microsoft Dynamics&nbsp;365 på den svenska marknaden. Fyll i med era egna ord, redaktionen granskar innan något publiceras.
        </p>
      </div>
      <IsvProductForm form={form} setForm={setForm} isNew={isNew} hideContact={isVendor} categories={CATEGORIES as string[]} />
      {honeypotInput}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={submitProduct} disabled={!productFormValid(form, isNew) || saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isNew ? "Skicka in produkten" : "Skicka in ändringen"}
        </Button>
        {isVendor && <Button variant="outline" onClick={() => setEditing(null)}>Tillbaka till översikten</Button>}
        {!productFormValid(form, isNew) && (
          <Badge variant="outline">{isNew ? "Ange namn, minst en produkt och en beskrivning" : "Välj minst en produkt och skriv en beskrivning"}</Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Beskriv er ISV-lösning | d365.se</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-28">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Hämtar uppgifterna…
          </div>
        )}

        {!loading && error && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" /> Länken kan inte användas
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {!loading && !error && done && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" /> Tack!
              </CardTitle>
              <CardDescription>{done}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {!loading && !error && !done && invitation && !isVendor && productEditor(false, `Beskriv ${invitation.solution_name}`)}

        {!loading && !error && !done && invitation && isVendor && editing && productEditor(editing.id === null, editing.id === null ? "Lägg till en produkt" : `Uppdatera ${editing.name}`)}

        {!loading && !error && !done && invitation && isVendor && !editing && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">{vendor?.name || invitation.solution_name} på d365.se</h1>
              <p className="text-muted-foreground">
                Granska och korrigera leverantörsprofilen, bekräfta uppgifterna, uppdatera era produkter eller lägg till nya. Leverantörsprofilen och varje produkt granskas var för sig, och inget publiceras utan redaktionens granskning. Grundprofilen är kostnadsfri.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex flex-wrap items-center gap-2">
                  Leverantörsprofil
                  <InformationStatusBadge kind="isv" partner={{ information_status: vendor?.information_status }} />
                </CardTitle>
                <CardDescription>Visas för besökare som tittar på era produkter. Kontaktuppgifterna publiceras inte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="v-desc">Om leverantören</Label>
                  <Textarea id="v-desc" rows={4} maxLength={2000} value={vendorForm.description} onChange={(e) => setVendorForm({ ...vendorForm, description: e.target.value })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="v-web">Webbplats</Label>
                    <Input id="v-web" placeholder="https://" value={vendorForm.website} onChange={(e) => setVendorForm({ ...vendorForm, website: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="v-logo">Länk till logotyp (valfritt)</Label>
                    <Input id="v-logo" placeholder="https://" value={vendorForm.logo_url} onChange={(e) => setVendorForm({ ...vendorForm, logo_url: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="v-cname">Kontaktperson</Label>
                    <Input id="v-cname" value={vendorForm.contact_name} onChange={(e) => setVendorForm({ ...vendorForm, contact_name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="v-cmail">E-post</Label>
                    <Input id="v-cmail" type="email" value={vendorForm.contact_email} onChange={(e) => setVendorForm({ ...vendorForm, contact_email: e.target.value })} />
                  </div>
                </div>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <Checkbox className="mt-0.5" checked={vendorForm.confirm_information} onCheckedChange={(v) => setVendorForm({ ...vendorForm, confirm_information: !!v })} />
                  <span>Vi bekräftar att uppgifterna om leverantören stämmer. Det gäller bara leverantörsprofilen, inte produkterna.</span>
                </label>
                {honeypotInput}
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={submitVendor} disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Skicka in leverantörsprofilen
                  </Button>
                  {pendingFor(`vendor:${vendor?.slug}`) && <Badge variant="outline">Inskickad, väntar på granskning</Badge>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Era produkter</CardTitle>
                <CardDescription>Varje produkt har egen informationsstatus. Uppdatera eller bekräfta dem var för sig.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {products.length === 0 && <p className="text-sm text-muted-foreground">Inga produkter registrerade ännu.</p>}
                {products.map((p) => (
                  <div key={p.solution_id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{p.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <InformationStatusBadge kind="isv" partner={{ information_status: p.information_status }} />
                        {!p.is_published && <Badge variant="outline">Ej publicerad</Badge>}
                        {pendingFor(p.solution_id) && <Badge variant="outline">Ändring väntar på granskning</Badge>}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                      <Pencil className="w-4 h-4 mr-1" /> Uppdatera
                    </Button>
                  </div>
                ))}
                {pendingNew.map((s) => (
                  <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border p-3">
                    <p className="font-medium text-foreground">{s.payload?.name || "Ny produkt"}</p>
                    <Badge variant="outline">Ny produkt, väntar på granskning</Badge>
                  </div>
                ))}
                <Button variant="outline" onClick={() => startEdit(null)}>
                  <Plus className="w-4 h-4 mr-1" /> Lägg till en produkt
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
