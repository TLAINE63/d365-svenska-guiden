import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  buildResult,
  DIMENSION_CODES,
  DIMENSION_LABELS,
  type DimensionMeans,
} from "@/lib/beslutsmognadScoring";
import type { Dimension } from "@/data/beslutsmognadQuestions";

const RESULT_KEY = "beslutsmognadsindex_result";

type ResultPayload = {
  means: DimensionMeans;
  evalStage?: string;
  domain?: string;
  contactName?: string;
  company?: string;
};

const TopBar = () => (
  <header className="w-full border-b border-bm-rule">
    <div className="max-w-[1200px] mx-auto px-6 py-5 flex items-center justify-between">
      <Link to="/beslutsmognad" className="font-bm-display text-bm-ink text-lg tracking-tight">
        d365<span className="italic text-bm-accent-deep">.se</span>
      </Link>
      <span className="font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted">
        Volym 01 · Kvartal 2 · 2026
      </span>
    </div>
  </header>
);



const Bar = ({ label, code, score }: { label: string; code: string; score: number }) => {
  const pct = Math.round(score);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-bm-display text-bm-ink" style={{ fontWeight: 360 }}>
          <span className="font-bm-display italic text-bm-ink-muted mr-2 text-sm">{code}</span>
          {label}
        </p>
        <p className="font-bm-display text-bm-ink-soft text-sm" style={{ fontWeight: 320 }}>
          {pct}
        </p>
      </div>
      <div className="h-[6px] bg-bm-rule rounded-full overflow-hidden">
        <div
          className="h-full bg-bm-accent-deep transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default function BeslutsmognadResultat() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hämta payload från router-state eller sessionStorage (för reload).
  const payload: ResultPayload | null = useMemo(() => {
    const fromState = (location.state as ResultPayload | null) ?? null;
    if (fromState?.means) {
      try {
        sessionStorage.setItem(RESULT_KEY, JSON.stringify(fromState));
      } catch {
        /* ignore */
      }
      return fromState;
    }
    try {
      const raw = sessionStorage.getItem(RESULT_KEY);
      if (raw) return JSON.parse(raw) as ResultPayload;
    } catch {
      /* ignore */
    }
    return null;
  }, [location.state]);

  useEffect(() => {
    if (!payload) navigate("/beslutsmognad", { replace: true });
  }, [payload, navigate]);

  if (!payload) return null;

  const result = buildResult(payload.means, payload.evalStage, payload.domain);

  return (
    <div className="min-h-screen bg-bm-paper text-bm-ink font-bm-display font-light">
      <Helmet>
        <title>Ert resultat · Beslutsmognadsindex | d365.se</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <TopBar />

      <main className="max-w-[820px] mx-auto px-6 pt-20 pb-24">
        {/* Totalindex */}
        <p className="font-bm-display italic text-bm-ink-muted text-base mb-4 text-center">
          Ert beslutsmognadsindex
        </p>
        <h1
          className="font-bm-display text-bm-ink text-center leading-[1.05] tracking-tight mb-4"
          style={{ fontSize: "clamp(3.5rem, 9vw, 6.5rem)", fontWeight: 360 }}
        >
          {Math.round(result.total)}
          <span className="font-bm-display italic text-bm-ink-muted" style={{ fontSize: "0.45em" }}>
            {" "}
            / 100
          </span>
        </h1>
        <p
          className="text-center font-bm-display italic text-bm-accent-deep mb-12"
          style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 360 }}
        >
          {result.totalBand}
        </p>

        {/* Femdimensionsprofil */}
        <section className="border-t border-bm-rule pt-10 mb-12">
          <p className="font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted mb-6">
            Femdimensionsprofil
          </p>
          <div className="flex flex-col gap-5">
            {(Object.keys(DIMENSION_LABELS) as Dimension[]).map((d) => (
              <Bar
                key={d}
                code={DIMENSION_CODES[d]}
                label={DIMENSION_LABELS[d]}
                score={result.scores[d]}
              />
            ))}
          </div>
        </section>

        {/* Processflagga */}
        {result.flag && (
          <section className="border-t border-bm-rule pt-10 mb-12">
            <p className="font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted mb-3">
              Processläge · Flagga {result.flag.id}
            </p>
            <h2
              className="font-bm-display italic text-bm-ink mb-4"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 360 }}
            >
              {result.flag.title}
            </h2>
            <p
              className="font-bm-display text-bm-ink-soft leading-relaxed"
              style={{ fontWeight: 320, fontSize: "1.0625rem" }}
            >
              {result.flag.text}
            </p>
          </section>
        )}

        {/* Peer-jämförelse — placeholder tills datavolym finns */}
        <section className="border-t border-bm-rule pt-10 mb-12">
          <p className="font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted mb-3">
            Peer-jämförelse
          </p>
          <p
            className="font-bm-display italic text-bm-ink-soft leading-relaxed"
            style={{ fontWeight: 320 }}
          >
            Jämförelsebasen byggs upp för varje deltagande beslutsgrupp. Ni får
            peer-snittet per dimension i den personliga rapport som mailas ut
            inom 24–48 timmar.
          </p>
        </section>

        {/* Tre rekommendationer */}
        <section className="border-t border-bm-rule pt-10 mb-12">
          <p className="font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted mb-6">
            Tre rekommendationer
          </p>
          <div className="flex flex-col gap-10">
            {result.recommendations.map((r, i) => (
              <article key={r.dimension}>
                <div
                  className="font-bm-display italic text-bm-accent-deep mb-3"
                  style={{ fontSize: "2rem", fontWeight: 360, lineHeight: 1 }}
                >
                  {["I", "II", "III"][i]}
                </div>
                <h3
                  className="font-bm-display text-bm-ink mb-2 leading-snug"
                  style={{ fontSize: "1.25rem", fontWeight: 380 }}
                >
                  {r.label}{" "}
                  <span className="font-bm-display italic text-bm-ink-muted text-base">
                    · {Math.round(r.score)} · {r.band}
                  </span>
                </h3>
                <p
                  className="font-bm-display text-bm-ink-soft leading-relaxed"
                  style={{ fontWeight: 320, fontSize: "1.0625rem" }}
                >
                  {r.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Nästa steg — diagnostisk, inte säljande */}
        <section className="border-t border-bm-rule pt-10">
          <p className="font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted mb-3">
            Nästa steg
          </p>
          <p
            className="font-bm-display text-bm-ink-soft leading-relaxed mb-6"
            style={{ fontWeight: 320, fontSize: "1.0625rem" }}
          >
            Vi sammanställer er fullständiga rapport manuellt och mailar den
            inom 24–48 timmar. Rekommendationerna ovan handlar om gruppens egen
            beredskap — inte om att välja en specifik partner. När ni känner er
            beslutsklara finns en separat partnerguide att gå vidare till.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/beslutsmognad"
              className="inline-block border border-bm-ink px-6 py-3 font-bm-body uppercase tracking-[0.18em] text-[11px] text-bm-ink hover:bg-bm-ink hover:text-bm-paper transition-colors rounded-sm"
            >
              Tillbaka till start
            </Link>
            <Link
              to="/kunskapscenter"
              className="inline-block font-bm-display italic text-bm-ink-muted hover:text-bm-ink-soft text-sm self-center"
            >
              Läs Beslutsmognadsindex Q1 2026 →
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-10 text-center font-bm-body uppercase tracking-[0.18em] text-[10px] text-bm-ink-muted border-t border-bm-rule">
        Konfidentiellt · GDPR-säkert · Data används anonymiserat i aggregerad form
      </footer>
    </div>
  );
}
