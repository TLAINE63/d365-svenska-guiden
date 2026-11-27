import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function NewsletterTokenAction({ mode }: { mode: "confirm" | "unsubscribe" }) {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const confirm = mode === "confirm";
  const [optout, setOptout] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved" | "error">("idle");
  async function saveOptout() {
    setSaved("saving");
    const { error } = await supabase.functions.invoke("newsletter-unsubscribe", { body: { token: params.get("t") || "", optout: true } });
    setSaved(error ? "error" : "saved");
  }
  useEffect(() => {
    const token = params.get("t") || "";
    if (!/^[a-f0-9]{64}$/.test(token)) { setStatus("error"); return; }
    supabase.functions.invoke(`newsletter-${mode}`, { body: { token } })
      .then(({ error }) => setStatus(error ? "error" : "done"));
  }, [mode, params]);
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={confirm ? "Bekräfta nyhetsbrev" : "Avregistrera nyhetsbrev"} description="Hantera din prenumeration på d365.se." canonicalPath={confirm ? "/nyhetsbrev/bekrafta" : "/nyhetsbrev/avregistrera"} noIndex />
      <Navbar />
      <main className="pt-28 pb-16"><div className="container mx-auto max-w-6xl px-4 text-center">
        <h1 className="text-3xl font-bold mb-5">{status === "loading" ? "Sparar…" : status === "done" ? (confirm ? "Prenumerationen är bekräftad" : "Du är avregistrerad") : "Länken är ogiltig"}</h1>
        <p className="text-muted-foreground mb-7">{status === "done" ? (confirm ? "Tack. Du får månadsbrevet från d365.se." : "Du får inga fler utskick av det här brevet.") : status === "error" ? "Kontrollera att du använder hela länken från mejlet." : "Vänta medan ditt val sparas."}</p>
        {!confirm && status === "done" && (
          <div className="mx-auto mb-8 max-w-md rounded-md border border-border bg-card p-5 text-left">
            {saved === "saved" ? <p className="font-medium">Sparat. Vi kontaktar dig inte.</p> : (
              <>
                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" className="mt-1" checked={optout} onChange={(e) => setOptout(e.target.checked)} />
                  <span>Kontakta mig inte heller på annat sätt, till exempel med mejl eller meddelanden från d365.se.</span>
                </label>
                <button type="button" disabled={!optout || saved === "saving"} onClick={saveOptout}
                  className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">Spara</button>
                {saved === "error" && <p className="mt-2 text-sm text-destructive">Det gick inte att spara. Försök igen.</p>}
              </>
            )}
          </div>
        )}
        <Link to="/kunskapscenter/" className="text-primary hover:underline">Till Kunskapscentret</Link>
      </div></main>
      <Footer />
    </div>
  );
}
