import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function WebinarCancel() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  useEffect(() => {
    const token = params.get("t") || "";
    if (!/^[a-f0-9]{64}$/.test(token)) { setStatus("error"); return; }
    supabase.functions.invoke("webinar-registration", { body: { action: "cancel", token } })
      .then(({ error }) => setStatus(error ? "error" : "done"));
  }, [params]);
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Avanmälan från webinar" description="Avanmälan från webinar på d365.se." canonicalPath="/webinar/avanmal" noIndex />
      <Navbar />
      <main className="pt-28 pb-16"><div className="container mx-auto max-w-2xl px-4 text-center">
        <h1 className="text-3xl font-bold mb-5">{status === "loading" ? "Avanmäler…" : status === "done" ? "Du är avanmäld" : "Länken är ogiltig"}</h1>
        <p className="text-muted-foreground mb-7">{status === "done" ? "Du får inga fler mejl om detta webinar." : status === "error" ? "Kontrollera att du använder hela länken från mejlet." : "Vänta medan avanmälan sparas."}</p>
        <Link to="/webinar/" className="text-primary hover:underline">Till webinarnas startsida</Link>
      </div></main>
      <Footer />
    </div>
  );
}
