import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

const TopBar = () => (
  <header className="w-full border-b border-bm-rule">
    <div className="max-w-[1200px] mx-auto px-6 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bm-display text-bm-ink text-lg tracking-tight">
          d365<span className="italic text-bm-accent-deep">.se</span>
        </Link>
        <span className="h-5 w-px bg-bm-rule-strong" />
        <span className="font-bm-display italic text-bm-ink-soft text-sm hidden sm:inline">
          Oberoende vägledning vid val av Dynamics 365-partner
        </span>
      </div>
      <span className="font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted">
        Volym 01 · Kvartal 2 · 2026
      </span>
    </div>
  </header>
);

const TrustBand = () => (
  <div className="border-t border-bm-rule-strong">
    <p className="max-w-[760px] mx-auto px-6 py-8 text-center font-bm-display italic text-bm-ink-soft text-base leading-relaxed">
      Beslutsmognadsindex publiceras kvartalsvis av d365.se. Tvärsnittet omfattar
      tillverkning, distribution, tjänsteföretag och offentlig sektor.
    </p>
  </div>
);

const FooterBand = () => (
  <footer className="py-10 text-center font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted">
    Konfidentiellt · GDPR-säkert · Data används anonymiserat i aggregerad form
  </footer>
);

export default function Beslutsmognadsindex() {
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("beslutsmognadsindex_draft");
      if (!raw) return;
      const draft = JSON.parse(raw);
      const ageMs = Date.now() - (draft.savedAt ?? 0);
      if (ageMs < 7 * 24 * 60 * 60 * 1000) setHasDraft(true);
    } catch {
      /* ignore */
    }
  }, []);

  const clearDraft = () => {
    localStorage.removeItem("beslutsmognadsindex_draft");
    setHasDraft(false);
  };

  return (
    <div className="min-h-screen bg-bm-paper text-bm-ink font-bm-display font-light">
      <Helmet>
        <title>Beslutsmognadsindex — diagnostik inför partnerval | d365.se</title>
        <meta
          name="description"
          content="En diagnostik för svenska beslutsgrupper inför partnerval för ERP och CRM. 8–10 minuter, 25 frågor, konfidentiell sammanställning."
        />
        <link rel="canonical" href="https://d365.se/beslutsmognad" />
        <meta property="og:title" content="Beslutsmognadsindex — d365.se" />
        <meta
          property="og:description"
          content="En diagnostik för svenska beslutsgrupper inför partnerval för ERP och CRM."
        />
        <meta property="og:url" content="https://d365.se/beslutsmognad" />
      </Helmet>

      <TopBar />

      <main>
        {/* Hero */}
        <section className="max-w-[720px] mx-auto px-6 pt-24 pb-12 text-center">
          <p className="font-bm-display italic text-bm-ink-muted text-base mb-6">
            En studie från d365.se
          </p>
          <h1
            className="font-bm-display text-bm-ink leading-[1.05] tracking-tight mb-8"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 360 }}
          >
            Beslutsmognads<em className="italic text-bm-accent-deep" style={{ fontWeight: 360 }}>index</em>.
          </h1>
          <p
            className="font-bm-display italic text-bm-ink-soft leading-snug mb-10"
            style={{ fontSize: "clamp(1.125rem, 2vw, 1.5rem)", fontWeight: 320 }}
          >
            En diagnostik för svenska beslutsgrupper inför partnerval för ERP och CRM.
          </p>
          <p className="font-bm-body uppercase tracking-[0.18em] text-[11px] text-bm-ink-muted">
            8–10 minuter · 25 frågor · konfidentiell sammanställning
          </p>
        </section>

        {/* CTA */}
        <section className="px-6 pb-16 text-center">
          {hasDraft && (
            <div className="max-w-[560px] mx-auto mb-8 border-t border-b border-bm-rule py-5">
              <p className="font-bm-display italic text-bm-ink-soft text-base mb-4">
                Ni har en påbörjad diagnostik. Vill ni fortsätta där ni slutade?
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  to="/beslutsmognadsindex/diagnostik"
                  className="inline-block border border-bm-ink px-6 py-3 font-bm-body uppercase tracking-[0.18em] text-[11px] text-bm-ink hover:bg-bm-ink hover:text-bm-paper transition-colors rounded-sm"
                >
                  Fortsätt
                </Link>
                <button
                  onClick={clearDraft}
                  className="font-bm-display italic text-bm-ink-muted text-sm hover:text-bm-ink-soft"
                >
                  Börja om
                </button>
              </div>
            </div>
          )}
          <Link
            to="/beslutsmognadsindex/diagnostik"
            className="inline-block bg-bm-ink text-bm-paper px-10 py-4 font-bm-body uppercase tracking-[0.2em] text-xs hover:bg-bm-accent-deep transition-colors rounded-sm"
          >
            Starta diagnostiken
          </Link>
          <p className="mt-5 font-bm-display italic text-bm-ink-muted text-sm">
            Inga svar sparas innan ni väljer att skicka in.
          </p>
        </section>

        {/* What you get */}
        <section className="max-w-[920px] mx-auto px-6 py-16 border-t border-bm-rule">
          <div className="grid md:grid-cols-3 gap-12 md:gap-10">
            {[
              {
                num: "I",
                title: "En personlig mognadsprofil",
                body: "Er position på fem dimensioner: behovsbild, intern samsyn, riskinsikt, partnermarknad, beslutsstruktur.",
              },
              {
                num: "II",
                title: "En peer benchmark",
                body: "Jämförelse mot 347 svenska beslutsgrupper inom samma branschsegment och storleksklass.",
              },
              {
                num: "III",
                title: "Tre konkreta rekommendationer",
                body: "Inriktade på där hävstången är störst i ert nuvarande skede — inte på era svagheter.",
              },
            ].map((c) => (
              <div key={c.num}>
                <div
                  className="font-bm-display italic text-bm-accent-deep mb-6"
                  style={{ fontSize: "3rem", fontWeight: 360, lineHeight: 1 }}
                >
                  {c.num}
                </div>
                <h2
                  className="font-bm-display text-bm-ink mb-3 leading-snug"
                  style={{ fontSize: "1.25rem", fontWeight: 380 }}
                >
                  {c.title}
                </h2>
                <p
                  className="font-bm-display text-bm-ink-soft leading-relaxed"
                  style={{ fontWeight: 320 }}
                >
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <TrustBand />
        <FooterBand />
      </main>
    </div>
  );
}
