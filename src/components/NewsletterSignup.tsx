import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { formContextBody, utmContextBody } from "@/lib/sessionPages";
import { NEWSLETTER_CONSENT_VERSION } from "@/lib/webinars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({ email: z.string().trim().email().max(255), consent: z.literal(true) });

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const emailError = validateBusinessEmail(email);
    if (emailError) return setError(emailError);
    const parsed = schema.safeParse({ email, consent });
    if (!parsed.success) return setError("Kryssa i att du vill få artiklar och webinarinbjudningar.");
    setPending(true);
    const { error: invokeError } = await supabase.functions.invoke("newsletter-subscription", {
      body: {
        email: parsed.data.email.toLowerCase(), consent: true,
        source_page: formContextBody().source_page,
        ...utmContextBody(),
      },
    });
    setPending(false);
    if (invokeError) return setError("Anmälan kunde inte genomföras just nu. Försök igen.");
    setDone(true);
  };

  return (
    <Card className="my-8 bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl">Få nya artiklar och webinar</CardTitle>
        <CardDescription>Högst två mejl i månaden med nya artiklar och webinarinbjudningar från d365.se.</CardDescription>
      </CardHeader>
      <CardContent>
        {done ? (
          <p className="text-sm text-foreground" role="status">Tack! Kontrollera din inkorg och klicka på bekräftelselänken. Adressen blir prenumerant först efter bekräftelsen.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label htmlFor="newsletter-email" className="sr-only">E-post</Label>
                <Input id="newsletter-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="din@jobbmejl.se" maxLength={255} required />
              </div>
              <Button type="submit" disabled={pending} className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-[hsl(var(--primary-foreground))]">{pending ? "Skickar…" : "Anmäl mig"}</Button>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="newsletter-consent" checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} />
              <Label htmlFor="newsletter-consent" className="text-sm font-normal leading-relaxed">Jag vill få nya artiklar och webinarinbjudningar från d365.se, högst två gånger i månaden.</Label>
            </div>
            <p className="text-xs text-muted-foreground">Samtyckestext: {NEWSLETTER_CONSENT_VERSION}</p>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
