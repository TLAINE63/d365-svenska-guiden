import { useEffect, useMemo, useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { DatabasePartner } from "@/hooks/usePartners";
import { PRODUCT_FILTER_GROUP } from "@/lib/productFilterGroup";
import { labelForCapability } from "@/lib/aiProfile";

type Insights = {
  summary: string;
  differences: { partner: string; points: string[] }[];
  bestFitFor: { partner: string; text: string }[];
};

const CACHE_PREFIX = "compare-ai-insights:v3:";

const buildKey = (
  slugs: string[],
  productFilters: string[],
  industry: string,
) =>
  CACHE_PREFIX +
  JSON.stringify({
    p: [...slugs].sort(),
    pf: [...productFilters].sort(),
    ind: industry || "",
  });

const pickProductText = (
  p: DatabasePartner,
  productFilters: string[],
): { productDescription?: string; whyChoose?: string; keyPoints?: string[] } => {
  const pf: any = (p as any).product_filters || {};
  const keys: string[] =
    productFilters.length > 0
      ? productFilters
      : (Object.keys(pf) as string[]);
  const desc: string[] = [];
  const why: string[] = [];
  const kp: string[] = [];
  for (const k of keys) {
    const entry = pf[k];
    if (!entry) continue;
    if (entry.description) desc.push(String(entry.description));
    if (entry.whyChoose) why.push(String(entry.whyChoose));
    if (Array.isArray(entry.keyPoints)) kp.push(...entry.keyPoints.map(String));
  }
  return {
    productDescription: desc.join(" ") || undefined,
    whyChoose: why.join(" ") || undefined,
    keyPoints: kp.length ? kp.slice(0, 8) : undefined,
  };
};

const buildPartnerPayload = (
  p: DatabasePartner,
  productFilters: string[],
) => {
  const { productDescription, whyChoose, keyPoints } = pickProductText(p, productFilters);
  const aiProfile: any = (p as any).ai_profile || {};
  const aiCaps: string[] = Array.isArray(aiProfile.capabilities)
    ? aiProfile.capabilities
        .map((c: any) => (typeof c === "string" ? labelForCapability(c) : String(c?.label || c)))
        .filter(Boolean)
    : [];
  const industryApps: string[] = Array.isArray((p as any).industry_apps)
    ? (p as any).industry_apps
        .map((ia: any) => [ia?.name, ia?.industry].filter(Boolean).join(" – "))
        .filter(Boolean)
    : [];
  const geography: string[] = Array.isArray(p.geography)
    ? (p.geography as any[]).map(String)
    : p.geography
      ? [String(p.geography)]
      : [];
  return {
    name: p.name,
    slug: p.slug,
    positioning: (p as any).positioning_statement || undefined,
    notAFit: (p as any).not_a_fit || undefined,
    description: p.description || undefined,
    productDescription,
    whyChoose,
    keyPoints,
    applications: (p.applications || []) as string[],
    industries: Array.from(
      new Set([...(p.industries || []), ...((p as any).secondary_industries || [])]),
    ) as string[],
    industryApps,
    geography,
    aiCapabilities: aiCaps,
    aiProjects: aiProfile?.projectsCompleted || aiProfile?.projects || undefined,
    extendedContent: ((p as any).extended_content as string | null)?.trim() || undefined,
  };
};

interface ColumnSlot {
  name: string;
  slug: string;
  basic?: boolean;
}

interface Props {
  partners: DatabasePartner[]; // 2 or 3 partners in display order
  productFilters: string[];
  industry: string;
  /** Alla valda kolumner i samma ordning som rubrikerna högst upp (inkl. Basic-profiler). */
  columnSlots?: ColumnSlot[];
}

const productLabel = (keys: string[]) =>
  keys.map((k) => (PRODUCT_FILTER_GROUP as any)[k]?.label || k).join(" / ");

const AiCompareInsights = ({ partners, productFilters, industry, columnSlots }: Props) => {
  const slugs = useMemo(() => partners.map((p) => p.slug), [partners]);
  const cacheKey = useMemo(
    () => buildKey(slugs, productFilters, industry),
    [slugs, productFilters, industry],
  );

  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (partners.length < 2) return;
    // Try cache first
    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (raw) {
        setData(JSON.parse(raw));
        setError(null);
        return;
      }
    } catch {}
    setData(null);
    setError(null);
    setLoading(true);
    const payload = {
      product: productFilters.length ? productLabel(productFilters) : null,
      industry: industry || null,
      partners: partners.map((p) => buildPartnerPayload(p, productFilters)),
    };
    supabase.functions
      .invoke("compare-partners-insights", { body: payload })
      .then(({ data: res, error: err }) => {
        if (err) {
          setError(err.message || "Kunde inte hämta AI-insikter.");
          return;
        }
        if ((res as any)?.error) {
          setError((res as any).error);
          return;
        }
        setData(res as Insights);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(res));
        } catch {}
      })
      .catch((e) => setError(e?.message || "Okänt fel"))
      .finally(() => setLoading(false));
  }, [cacheKey, partners, productFilters, industry]);

  if (partners.length < 2) return null;

  const slots: ColumnSlot[] =
    columnSlots && columnSlots.length > 0
      ? columnSlots
      : partners.map((p) => ({ name: p.name, slug: p.slug }));

  const gridCols =
    slots.length >= 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2";

  const matchFor = <T extends { partner: string }>(list: T[], slot: ColumnSlot) =>
    list.find(
      (d) => (d.partner || "").trim().toLowerCase() === slot.name.trim().toLowerCase(),
    );

  return (
    <section className="mb-6 space-y-4">
      {/* AI-insikter */}
      <div className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            AI-insikter baserat på ditt val
          </h2>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyserar partnernas positionering…
          </div>
        )}
        {error && !loading && (
          <div className="flex items-start gap-2 text-sm text-amber-700">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {data && !loading && (
          <>
            <p className="text-sm md:text-base leading-relaxed text-foreground/90">
              {data.summary}
            </p>

            {data.differences?.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Vad skiljer partnerna åt?
                </h3>
                <div className={`grid gap-4 ${gridCols}`}>
                  {slots.map((slot) => {
                    const d = matchFor(data.differences, slot);
                    return (
                      <div
                        key={slot.slug}
                        className={
                          d
                            ? "rounded-md border border-border bg-card p-4"
                            : "rounded-md border border-dashed border-border bg-muted/30 p-4"
                        }
                      >
                        <div className="font-semibold text-foreground mb-2">{slot.name}</div>
                        {d ? (
                          <ul className="space-y-1.5 text-sm text-foreground/85 list-disc pl-4">
                            {d.points.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Grundprofil – ej partnerverifierad. Underlag saknas för AI-jämförelse.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {data.bestFitFor?.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Passar bäst för
                </h3>
                <div className={`grid gap-3 ${gridCols}`}>
                  {slots.map((slot) => {
                    const d = matchFor(data.bestFitFor, slot);
                    return (
                      <div
                        key={slot.slug}
                        className={
                          d
                            ? "rounded-md border border-accent/30 bg-accent/5 p-4"
                            : "rounded-md border border-dashed border-border bg-muted/30 p-4"
                        }
                      >
                        <div className="font-semibold text-foreground mb-1">{slot.name}</div>
                        <p className="text-sm text-foreground/85">
                          {d ? d.text : (
                          <span className="text-muted-foreground">
                            Grundprofil – ej partnerverifierad. Ingen partnerbekräftad information.
                          </span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="mt-4 text-[11px] text-muted-foreground italic">
              AI-genererad sammanfattning utifrån partnernas egen profilinformation.
              Neutral vägledning – ingen rangordning.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default AiCompareInsights;
