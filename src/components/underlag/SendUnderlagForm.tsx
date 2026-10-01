import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getBuyerId, type BuyerProfile } from "@/lib/buyerProfile";
import { trackUnderlagEvent } from "@/utils/trackUnderlagEvent";

export default function SendUnderlagForm({ text, profile }: { text: string; profile: BuyerProfile }) {
  const { toast } = useToast();
  const [f, setF] = useState({ name: "", company: "", email: "", phone: "", consent: false, _hp: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.consent) return toast({ title: "Samtycke krävs för att skicka underlaget", variant: "destructive" });
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-underlag", {
        body: { ...f, buyer_id: getBuyerId() ?? undefined, underlag_text: text, profile },
      });
      if (error || data?.error) throw new Error(data?.error || "Kunde inte skicka underlaget");
      trackUnderlagEvent("underlag_sent");
      setDone(true);
    } catch (err) {
      toast({ title: "Något gick fel", description: err instanceof Error ? err.message : "Försök igen.", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return <p className="rounded-lg border border-accent/40 bg-accent/5 p-4 text-sm">Tack! Underlaget är skickat till er e-post, och vi har fått en kopia.</p>;
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" value={f._hp} onChange={(e) => setF({ ...f, _hp: e.target.value })} />
      <div><Label htmlFor="u-name">Namn</Label><Input id="u-name" required maxLength={100} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div><Label htmlFor="u-company">Företag</Label><Input id="u-company" required maxLength={150} value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></div>
      <div><Label htmlFor="u-email">E-post</Label><Input id="u-email" type="email" required maxLength={255} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <div><Label htmlFor="u-phone">Telefon (valfritt)</Label><Input id="u-phone" type="tel" maxLength={40} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
      <label className="sm:col-span-2 flex items-start gap-2 text-sm">
        <Checkbox checked={f.consent} onCheckedChange={(v) => setF({ ...f, consent: v === true })} className="mt-0.5" />
        <span>
          Jag samtycker till att Dynamic Factory, personuppgiftsansvarig för d365.se, sparar mina uppgifter för att skicka underlaget och följa upp min förfrågan. Läs mer i{" "}
          <Link to="/dataskydd" className="text-primary underline">dataskyddspolicyn</Link>.
        </span>
      </label>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={busy} className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-primary-foreground">
          {busy ? "Skickar…" : <>Skicka ert Dynamics&nbsp;365-underlag</>}
        </Button>
      </div>
    </form>
  );
}
