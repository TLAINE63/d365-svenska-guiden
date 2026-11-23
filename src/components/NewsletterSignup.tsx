import { useId, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { formContextBody, utmContextBody } from "@/lib/sessionPages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({ email: z.string().trim().email().max(255), first_name: z.string().trim().max(100), company: z.string().trim().max(200) });
export default function NewsletterSignup({ placement = "article" }: { placement?: "article" | "footer" | "download" }) {
  const id = useId();
  const [form, setForm] = useState({ email: "", first_name: "", company: "" });
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(null);
    const emailError = validateBusinessEmail(form.email);
    if (emailError) return setError(emailError);
    const parsed = schema.safeParse(form);
    if (!parsed.success) return setError("Kontrollera uppgifterna och ange en giltig e-postadress.");
    setPending(true);
    try {
      const { error: invokeError } = await supabase.functions.invoke("newsletter-subscribe", { body: { ...parsed.data, email: parsed.data.email.toLowerCase(), source_page: formContextBody().source_page, consent_text_version: "nl-2026-11", ...utmContextBody() } });
      if (invokeError) setError("Anmälan kunde inte genomföras just nu. Försök igen.");
      else setDone(true);
    } catch { setError("Anmälan kunde inte genomföras just nu. Försök igen."); }
    finally { setPending(false); }
  };
  return (
    <section data-newsletter-signup={placement} className="bg-card text-card-foreground border-y border-border py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-xl font-semibold mb-2">Månadsbrevet från d365.se</h2>
        <p className="text-sm text-muted-foreground mb-5">Nya guider, marknadsläget och frågor från andra köpare.</p>
        {done ? <p role="status">Tack. Kontrollera din inkorg och klicka på bekräftelselänken.</p> : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {([['email', 'E-post', 'email'], ['first_name', 'Förnamn (frivilligt)', 'given-name'], ['company', 'Företag (frivilligt)', 'organization']] as const).map(([key, label, complete]) => (
                <div key={key} className="min-w-0 space-y-1.5"><Label htmlFor={`${id}-${key}`}>{label}</Label><Input id={`${id}-${key}`} autoComplete={complete} type={key === 'email' ? 'email' : 'text'} required={key === 'email'} maxLength={key === 'email' ? 255 : key === 'first_name' ? 100 : 200} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /></div>
              ))}
            </div>
            <Button type="submit" disabled={pending}>{pending ? "Skickar…" : "Prenumerera"}</Button>
            <p className="text-sm text-muted-foreground leading-relaxed">Jag vill få månadsbrevet från d365.se: nya guider, marknadsläget för Dynamics{"\u00a0"}365 och vad andra köpare frågar om. Du kan avregistrera dig när som helst.</p>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
