import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { formContextBody, utmContextBody } from "@/lib/sessionPages";
import { WEBINAR_CONSENT_VERSION, type PublicWebinar } from "@/lib/webinars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

const schema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  company: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(255),
  consent_reminder: z.literal(true),
  consent_followup: z.boolean(),
});

const initial = { first_name: "", last_name: "", company: "", title: "", email: "", consent_reminder: false, consent_followup: false };

export default function WebinarRegistrationForm({ webinar }: { webinar: PublicWebinar }) {
  const [form, setForm] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const set = (key: keyof typeof initial, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const emailError = validateBusinessEmail(form.email);
    if (emailError) return setError(emailError);
    const parsed = schema.safeParse({ ...form, email: form.email.toLowerCase(), consent_reminder: form.consent_reminder });
    if (!parsed.success) return setError("Fyll i alla obligatoriska fält och kryssa i att du vill få länk och påminnelse.");
    setPending(true);
    const { data, error: invokeError } = await supabase.functions.invoke("webinar-registration", {
      body: { slug: webinar.slug, ...parsed.data, ...formContextBody(), ...utmContextBody(), consent_text_version: WEBINAR_CONSENT_VERSION },
    });
    setPending(false);
    if (invokeError || data?.error) return setError(data?.error || "Anmälan kunde inte genomföras just nu. Försök igen.");
    try { window.sessionStorage.setItem("d365_webinar_email", parsed.data.email); } catch { /* no storage */ }
    navigate(`/tack/webinar/${webinar.slug}/`, { state: { email: parsed.data.email } });
  };

  const field = (key: "first_name" | "last_name" | "company" | "title" | "email", label: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={`webinar-${key}`}>{label} *</Label>
      <Input id={`webinar-${key}`} type={type} autoComplete={key === "email" ? "email" : key === "company" ? "organization" : key === "title" ? "organization-title" : key === "first_name" ? "given-name" : "family-name"} value={form[key]} onChange={(event) => set(key, event.target.value)} maxLength={key === "email" ? 255 : 200} required />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-5" aria-label={`Anmälan till ${webinar.title}`}>
      <div className="grid sm:grid-cols-2 gap-4">{field("first_name", "Förnamn")}{field("last_name", "Efternamn")}</div>
      <div className="grid sm:grid-cols-2 gap-4">{field("company", "Företag")}{field("title", "Roll")}</div>
      {field("email", "E-post", "email")}
      <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <Checkbox id="webinar-reminder" checked={form.consent_reminder} onCheckedChange={(checked) => set("consent_reminder", checked === true)} required />
          <Label htmlFor="webinar-reminder" className="text-sm font-normal leading-relaxed">Jag vill få länk och påminnelse till webinaret. *</Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox id="webinar-followup" checked={form.consent_followup} onCheckedChange={(checked) => set("consent_followup", checked === true)} />
          <Label htmlFor="webinar-followup" className="text-sm font-normal leading-relaxed">d365.se får kontakta mig efter webinaret om mitt Dynamics{"\u00A0"}365-projekt.</Label>
        </div>
        <p className="text-xs text-muted-foreground">Uppgifterna används för webinaret och sparas i 24 månader. Läs mer i <Link to="/dataskydd/" className="text-primary underline">integritetspolicyn</Link>.</p>
        <p className="text-xs text-muted-foreground">Samtyckestext: {WEBINAR_CONSENT_VERSION}</p>
      </div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-[hsl(var(--primary-foreground))]">{pending ? "Anmäler…" : "Anmäl dig kostnadsfritt"}</Button>
    </form>
  );
}
