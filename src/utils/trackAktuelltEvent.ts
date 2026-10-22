import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { setNewsAttribution } from "@/utils/newsAttribution";

/** Var ett klick till en Aktuellt-artikel kom ifrån. */
export type AktuelltClickSource = "aktuellt_list" | "contextual" | "related";

/** Anonym mätning via befintlig funnel-händelsestruktur. Inga personuppgifter. */
export function trackAktuelltView(article: { id: string; slug: string | null; product_keys?: string[]; topic?: string | null }) {
  setNewsAttribution({ news_id: `aktuellt:${article.id}`, editorial_title: article.slug, partner_slug: null, source: "aktuellt" });
  trackFunnelEvent({
    event_type: "content_view",
    event_name: "aktuellt_view",
    metadata: { aktuellt_id: article.id, slug: article.slug, product_keys: article.product_keys ?? [], topic: article.topic ?? null },
  });
}

export function trackAktuelltOpen(article: { id: string; slug: string | null }, source: AktuelltClickSource, pagePath?: string) {
  trackFunnelEvent({
    event_type: "cta_click",
    event_name: source === "contextual" ? "aktuellt_contextual_click" : "aktuellt_list_click",
    metadata: { aktuellt_id: article.id, slug: article.slug, source, from_path: pagePath ?? null },
  });
}

/** Klick från en artikel vidare: primär CTA, produktsida, behovsguide, partnerlista m.m. */
export function trackAktuelltOutbound(
  article: { id: string; slug: string | null },
  kind: "primary_cta" | "product_page" | "needs_guide" | "partners" | "source",
  destination: string,
) {
  trackFunnelEvent({
    event_type: "cta_click",
    event_name: `aktuellt_${kind}_click`,
    metadata: { aktuellt_id: article.id, slug: article.slug, cta_destination: destination },
  });
}
