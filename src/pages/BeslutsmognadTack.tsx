import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const TopBar = () => (
  <header className="w-full border-b border-bm-rule">
    <div className="max-w-[1200px] mx-auto px-6 py-5 flex items-center justify-between">
      <Link to="/" className="font-bm-display text-bm-ink text-lg tracking-tight">
        d365<span className="italic text-bm-accent-deep">.se</span>
      </Link>
      <span className="font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted">
        Volym 01 · Kvartal 2 · 2026
      </span>
    </div>
  </header>
);

export default function BeslutsmognadTack() {
  return (
    <div className="min-h-screen bg-bm-paper text-bm-ink font-bm-display font-light">
      <Helmet>
        <title>Tack · Beslutsmognadsindex | d365.se</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <TopBar />

      <main className="max-w-[720px] mx-auto px-6 pt-24 pb-16 text-center">
        <p className="font-bm-display italic text-bm-ink-muted text-base mb-6">Tack.</p>
        <h1
          className="font-bm-display text-bm-ink leading-tight tracking-tight mb-8"
          style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", fontWeight: 360 }}
        >
          Er sammanställning <em className="italic text-bm-accent-deep" style={{ fontWeight: 360 }}>är hos oss</em>.
        </h1>
        <p
          className="font-bm-display italic text-bm-ink-soft leading-relaxed max-w-[560px] mx-auto"
          style={{ fontSize: "1.125rem", fontWeight: 320 }}
        >
          Vi går igenom era svar manuellt innan vi skickar er den personliga
          rapporten. Det tar normalt 24–48 timmar och säkerställer att
          kommentarerna är meningsfulla och inte bara genererade.
        </p>

        <div className="border-t border-bm-rule-strong my-16" />

        <p className="font-bm-display italic text-bm-ink-soft text-base mb-10">Under tiden</p>
        <div className="grid md:grid-cols-3 gap-10 text-left">
          {[
            {
              num: "I",
              title: "Beslutsmognadsindex Q1 2026",
              body: "Läs förra kvartalets tvärsnittsrapport.",
              to: "/kunskapscenter",
            },
            {
              num: "II",
              title: "Beslutsmognadens fem dimensioner",
              body: "Fördjupning i ramverket.",
              to: "/kunskapscenter",
            },
            {
              num: "III",
              title: "Andra frågor?",
              body: "Hör av er direkt.",
              to: "mailto:hej@d365.se",
              external: true,
            },
          ].map((c) => {
            const Inner = (
              <>
                <div
                  className="font-bm-display italic text-bm-accent-deep mb-4"
                  style={{ fontSize: "2.25rem", fontWeight: 360, lineHeight: 1 }}
                >
                  {c.num}
                </div>
                <h3
                  className="font-bm-display text-bm-ink mb-2 leading-snug"
                  style={{ fontSize: "1.05rem", fontWeight: 380 }}
                >
                  {c.title}
                </h3>
                <p
                  className="font-bm-display text-bm-ink-soft leading-relaxed text-sm"
                  style={{ fontWeight: 320 }}
                >
                  {c.body}
                </p>
              </>
            );
            return c.external ? (
              <a key={c.num} href={c.to} className="block hover:opacity-80 transition-opacity">
                {Inner}
              </a>
            ) : (
              <Link key={c.num} to={c.to} className="block hover:opacity-80 transition-opacity">
                {Inner}
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="py-10 text-center font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted">
        Konfidentiellt · GDPR-säkert · Data används anonymiserat i aggregerad form
      </footer>
    </div>
  );
}
