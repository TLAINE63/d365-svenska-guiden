import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/** Köparen bekräftar själv att förfrågan får skickas till partnerna (dubbel bekräftelse). */
export default function BekraftaForfragan() {
  const [params] = useSearchParams();
  const token = params.get("t") || "";
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setState("sending");
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("submit-lead", { body: { action: "confirm_partner_request", token } });
      if (fnErr || !data?.success) throw new Error(data?.error || "Länken är ogiltig eller har gått ut.");
      setState("done");
    } catch (x) {
      setError(x instanceof Error ? x.message : "Det gick inte att skicka. Försök igen.");
      setState("error");
    }
  };

  return (
    <>
      <SEOHead title="Bekräfta er förfrågan – d365.se" description="Bekräfta att er förfrågan får skickas till de partners ni valt." canonicalPath="/bekrafta-forfragan/" noIndexFollow />
      <Navbar />
      <main className="container mx-auto max-w-xl px-4 py-24">
        {state === "done" ? (
          <div className="space-y-4">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <CheckCircle2 className="h-6 w-6 text-accent" aria-hidden /> Förfrågan är skickad
            </h1>
            <p className="text-muted-foreground">Partnerna har fått er förfrågan och ni får en bekräftelse på e-post. d365.se är kopierad för uppföljning.</p>
            <Link to="/" className="text-primary underline">Till startsidan</Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Mail className="h-6 w-6 text-accent" aria-hidden /> Bekräfta er förfrågan
            </h1>
            <p className="text-muted-foreground">Klicka nedan så skickas förfrågan till de partners ni valde. Inget skickas förrän ni bekräftar.</p>
            <Button onClick={confirm} disabled={!token || state === "sending"} className="min-h-11">
              {state === "sending" ? "Skickar…" : "Bekräfta och skicka förfrågan"}
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
