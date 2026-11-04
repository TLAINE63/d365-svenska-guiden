import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/** Mottagaren bekräftar själv att verktygsresultatet ska mejlas (dubbel bekräftelse). */
export default function BekraftaResultat() {
  const [params] = useSearchParams();
  const token = params.get("t") || "";
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setState("sending");
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("send-result-summary", { body: { action: "confirm", token } });
      if (fnErr || !data?.ok) throw new Error(data?.error || "Länken är ogiltig eller har gått ut.");
      setState("done");
    } catch (x) {
      setError(x instanceof Error ? x.message : "Det gick inte att skicka. Försök igen.");
      setState("error");
    }
  };

  return (
    <>
      <SEOHead title="Bekräfta ert resultat – d365.se" description="Bekräfta att ni vill få ert verktygsresultat mejlat från d365.se." canonicalPath="/bekrafta-resultat/" noIndexFollow />
      <Navbar />
      <main className="container mx-auto max-w-xl px-4 py-24">
        {state === "done" ? (
          <div className="space-y-4">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <CheckCircle2 className="h-6 w-6 text-accent" aria-hidden /> Resultatet är skickat
            </h1>
            <p className="text-muted-foreground">Kolla er inkorg. Inga partners har fått era uppgifter.</p>
            <Link to="/" className="text-primary underline">Till startsidan</Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Mail className="h-6 w-6 text-accent" aria-hidden /> Bekräfta att ni vill få resultatet
            </h1>
            <p className="text-muted-foreground">Klicka nedan så mejlar vi sammanställningen och tre frågor att ställa till leverantörerna.</p>
            <Button onClick={confirm} disabled={!token || state === "sending"} className="min-h-11">
              {state === "sending" ? "Skickar…" : "Skicka resultatet till mig"}
            </Button>
            {!token && <p role="alert" className="text-sm text-destructive">Länken saknar kod. Öppna länken från mejlet igen.</p>}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
