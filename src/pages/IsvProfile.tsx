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
import { Loader2, CheckCircle2, AlertCircle, Package, Building2 } from "lucide-react";
import { ISV_PRODUCTS, ISV_INDUSTRIES } from "@/data/isvProfileOptions";

interface Invitation {
  solution_id: string;
  solution_name: string;
  vendor_name: string | null;
  email: string;
  status: string;
  expires_at: string;
}

interface FormState {
  short_description: string;
  what: string;
  when_fits: string;
  use_cases: string;
  combos: string;
  products: string[];
  industries: string[];
  vendor_website: string;
  contact_name: string;
  contact_email: string;
  notes: string;
}

const emptyForm: FormState = {
  short_description: "",
  what: "",
  when_fits: "",
  use_cases: "",
  combos: "",
  products: [],
  industries: [],
  vendor_website: "",
  contact_name: "",
  contact_email: "",
  notes: "",
};

const toLines = (v: string) => v.split("\n").map((x) => x.trim()).filter(Boolean);

export default function IsvProfile() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [honeypot, setHoneypot] = useState("");
  const [done, setDone] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isv-profile`;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const res = await fetch(`${baseUrl}?token=${encodeURIComponent(token)}`, {
          headers: { apikey, Authorization: `Bearer ${apikey}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Länken kunde inte öppnas");
        setInvitation(data.invitation);
        const src = data.submission || data.override;
        if (src) {
          setForm({
            short_description: src.short_description || "",
            what: src.what || "",
            when_fits: src.when_fits || "",
            use_cases: (src.use_cases || []).join("\n"),
            combos: (src.combos || []).join("\n"),
            products: src.products || [],
            industries: src.industries || [],
            vendor_website: src.vendor_website || "",
            contact_name: src.contact_name || src.vendor_contact_name || "",
            contact_email: src.contact_email || src.vendor_contact_email || data.invitation?.email || "",
            notes: src.notes || "",
          });
        } else {
          setForm((f) => ({ ...f, contact_email: data.invitation?.email || "" }));
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const toggle = (key: "products" | "industries", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const canSubmit = useMemo(
    () => form.products.length > 0 && (form.short_description.trim() || form.what.trim()),
    [form]
  );

  const submit = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { apikey, Authorization: `Bearer ${apikey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          use_cases: toLines(form.use_cases),
          combos: toLines(form.combos),
          company_website_hp: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte skicka in");
      setDone(true);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

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
            <Loader2 className="w-4 h-4 animate-spin" /> Hämtar er lösning…
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
              <CardDescription>
                Er beskrivning är inskickad och granskas av redaktionen innan den publiceras i katalogen.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {!loading && !error && !done && invitation && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Beskriv {invitation.solution_name}
              </h1>
              <p className="text-muted-foreground">
                d365.se kartlägger tillägg och ISV-lösningar för Microsoft Dynamics 365 på den svenska
                marknaden. Fyll i era egna ord nedan – redaktionen granskar innan publicering.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-4 h-4" /> Produktinriktning
                </CardTitle>
                <CardDescription>
                  Vilka Dynamics 365-applikationer är lösningen byggd för? (minst en)
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-2">
                {ISV_PRODUCTS.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.products.includes(p)}
                      onCheckedChange={() => toggle("products", p)}
                    />
                    {p}
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="w-4 h-4" /> Branschinriktning
                </CardTitle>
                <CardDescription>
                  Om lösningen är branschinriktad – kryssa i de branscher den passar för. Lämna tomt om
                  den är generell.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-2">
                {ISV_INDUSTRIES.map((i) => (
                  <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.industries.includes(i)}
                      onCheckedChange={() => toggle("industries", i)}
                    />
                    {i}
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Beskrivning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Kort beskrivning (en rad, visas på kortet)</Label>
                  <Input
                    value={form.short_description}
                    maxLength={400}
                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Vad lösningen är</Label>
                  <Textarea
                    rows={4}
                    value={form.what}
                    onChange={(e) => setForm({ ...form, what: e.target.value })}
                  />
                </div>
                <div>
                  <Label>När den passar</Label>
                  <Textarea
                    rows={3}
                    value={form.when_fits}
                    onChange={(e) => setForm({ ...form, when_fits: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Vad den används till (en per rad)</Label>
                  <Textarea
                    rows={4}
                    value={form.use_cases}
                    onChange={(e) => setForm({ ...form, use_cases: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Vanliga kombinationer (en per rad)</Label>
                  <Textarea
                    rows={3}
                    value={form.combos}
                    onChange={(e) => setForm({ ...form, combos: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kontakt</CardTitle>
                <CardDescription>Publiceras inte – används av redaktionen vid frågor.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Kontaktperson</Label>
                    <Input
                      value={form.contact_name}
                      onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>E-post</Label>
                    <Input
                      type="email"
                      value={form.contact_email}
                      onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Webbplats för lösningen</Label>
                  <Input
                    placeholder="https://"
                    value={form.vendor_website}
                    onChange={(e) => setForm({ ...form, vendor_website: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Övrigt till redaktionen</Label>
                  <Textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />
              </CardContent>
            </Card>

            <div className="flex items-center gap-3">
              <Button onClick={submit} disabled={!canSubmit || saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Skicka in beskrivning
              </Button>
              {!canSubmit && (
                <Badge variant="outline">Välj minst en produkt och skriv en beskrivning</Badge>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
