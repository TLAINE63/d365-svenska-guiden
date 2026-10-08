import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

type Mode = "partner" | "buyer";
const call = async (body: unknown) => {
  const r = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/inquiry-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    body: JSON.stringify(body),
  });
  return r.ok;
};

/** /partnersvar/:token?s=… (partner) och /forfragan/svar/:token?svar=… (köpare). Visar aldrig kunduppgifter. */
export default function InquiryResponse({ mode }: { mode: Mode }) {
  const { token = "" } = useParams();
  const [params] = useSearchParams();
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const body = mode === "partner"
      ? { action: "partner_status", token, s: params.get("s") }
      : { action: "buyer_reply", token, answer: params.get("svar") };
    call(body).then((ok) => setState(ok ? "ok" : "error")).catch(() => setState("error"));
  }, [mode, token, params]);

  const okText = mode === "partner"
    ? "Tack, statusen är registrerad."
    : params.get("svar") === "nej"
      ? "Tack för ert svar. Vi hör av oss och hjälper er vidare."
      : "Tack för ert svar.";

  return (
    <main className="container mx-auto px-4 py-24 max-w-xl text-center">
      <Helmet><title>Tack | D365.SE</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <h1 className="text-2xl font-semibold text-foreground">
        {state === "loading" ? "Registrerar…" : state === "ok" ? okText : "Länken kunde inte användas"}
      </h1>
      {state === "error" && (
        <p className="mt-4 text-muted-foreground">Länken är ogiltig eller ofullständig. Kontakta info@d365.se om problemet kvarstår.</p>
      )}
    </main>
  );
}
