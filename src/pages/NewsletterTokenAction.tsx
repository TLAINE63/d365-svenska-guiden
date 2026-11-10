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
  useEffect(() => {
    const token = params.get("t") || "";
    if (!/^[a-f0-9]{64}$/.test(token)) { setStatus("error"); return; }
    supabase.functions.invoke("newsletter-subscription", { body: { action: mode, token } })
      .then(({ error }) => setStatus(error ? "error" : "done"));
  }, [mode, params]);
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={confirm ? "Bekräfta nyhetsbrev" : "Avregistrera nyhetsbrev"} description="Hantera din prenumeration på d365.se." canonicalPath={confirm ? "/nyhetsbrev/bekrafta" : "/nyhetsbrev/avregistrera"} noIndex />
      <Navbar />
      <main className="pt-28 pb-16"><div className="container mx-auto max-w-2xl px-4 text-center">
        <h1 className="text-3xl font-bold mb-5">{status === "loading" ? "Sparar…" : status === "done" ? (confirm ? "Prenumerationen är bekräftad" : "Du är avregistrerad") : "Länken är ogiltig"}</h1>
        <p className="text-muted-foreground mb-7">{status === "done" ? (confirm ? "Du får nya artiklar och webinarinbjudningar, högst två gånger i månaden." : "Adressen ingår inte längre i nyhetsbrevslistan.") : status === "error" ? "Kontrollera att du använder hela länken från mejlet." : "Vänta medan ditt val sparas."}</p>
        <Link to="/kunskapscenter/" className="text-primary hover:underline">Till Kunskapscentret</Link>
      </div></main>
      <Footer />
    </div>
  );
}
