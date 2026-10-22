import { describe, expect, it } from "vitest";
import {
  AKTUELLT_CONTEXT_MAX,
  countContextualAktuellt,
  isContextuallyFresh,
  normalizeAktuelltCandidate,
  pickContextualAktuellt,
  relevanceBand,
  showsAvailability,
  type AktuelltArticle,
} from "@/lib/aktuellt";

const TODAY = new Date("2026-10-22T12:00:00Z");
let n = 0;
const art = (p: Partial<AktuelltArticle> = {}): AktuelltArticle =>
  ({
    id: `a${++n}`,
    slug: `artikel-${n}`,
    title: "Test",
    description: "Ingress",
    is_published: true,
    editorial_status: "published",
    product_keys: ["finance"],
    topic: null,
    industry: null,
    availability_status: "available",
    fact_checked_at: "2026-10-01",
    published_at: "2026-10-02T00:00:00Z",
    context_until: null,
    editorial_priority: 0,
    ...p,
  }) as AktuelltArticle;

describe("Aktuellt på andra sidor", () => {
  it("visar högst två analyser per sida", () => {
    const items = [art(), art(), art(), art()];
    expect(AKTUELLT_CONTEXT_MAX).toBe(2);
    expect(pickContextualAktuellt(items, { products: ["finance"] }, TODAY)).toHaveLength(2);
    expect(countContextualAktuellt(items, { products: ["finance"] }, TODAY)).toBe(4);
  });

  it("visar aldrig opublicerade eller ej godkända analyser", () => {
    const items = [art({ is_published: false, editorial_status: "approved" }), art({ editorial_status: "review", is_published: false })];
    expect(pickContextualAktuellt(items, { products: ["finance"] }, TODAY)).toHaveLength(0);
  });

  it("visar bara analyser som matchar sidans produkt, ämne eller bransch", () => {
    const items = [art({ product_keys: ["sales"] }), art({ product_keys: [], topic: "agenter" }), art({ product_keys: [], industry: "Tillverkningsindustri" })];
    expect(pickContextualAktuellt(items, { products: ["finance"] }, TODAY)).toHaveLength(0);
    expect(pickContextualAktuellt(items, { topics: ["agenter"] }, TODAY).map((a) => a.topic)).toEqual(["agenter"]);
    expect(pickContextualAktuellt(items, { industry: "Tillverkningsindustri" }, TODAY)).toHaveLength(1);
  });

  it("slutar visas automatiskt 180 dagar efter faktakontroll om inget slutdatum är satt", () => {
    expect(isContextuallyFresh({ fact_checked_at: "2026-04-26", published_at: null, context_until: null }, TODAY)).toBe(true);
    expect(isContextuallyFresh({ fact_checked_at: "2026-04-24", published_at: null, context_until: null }, TODAY)).toBe(false);
    expect(isContextuallyFresh({ fact_checked_at: "2025-01-01", published_at: null, context_until: "2026-10-22" }, TODAY)).toBe(true);
    expect(isContextuallyFresh({ fact_checked_at: "2026-10-20", published_at: null, context_until: "2026-10-21" }, TODAY)).toBe(false);
  });

  it("manuell prioritering går före publiceringsdatum", () => {
    const items = [art({ published_at: "2026-10-20T00:00:00Z" }), art({ published_at: "2026-09-01T00:00:00Z", editorial_priority: 5, slug: "prio" })];
    expect(pickContextualAktuellt(items, { products: ["finance"] }, TODAY)[0].slug).toBe("prio");
  });

  it("döljer status Ej relevant", () => {
    expect(showsAvailability("not_relevant")).toBe(false);
    expect(showsAvailability("preview")).toBe(true);
    expect(pickContextualAktuellt([art({ availability_status: "not_relevant" })], { products: ["finance"] }, TODAY)).toHaveLength(0);
  });
});

describe("Relevansbedömning", () => {
  it("80 och uppåt prioriteras, 60–79 bedöms, under 60 normalt ej", () => {
    expect(relevanceBand(80)).toBe("priority");
    expect(relevanceBand(79)).toBe("consider");
    expect(relevanceBand(60)).toBe("consider");
    expect(relevanceBand(59)).toBe("low");
    expect(relevanceBand(null)).toBe("unknown");
  });
});

describe("Kandidater från import eller framtida agent", () => {
  it("kan aldrig få status publicerad", () => {
    expect(normalizeAktuelltCandidate({ status: "published", title: "x" }).status).toBe("candidate");
    expect(normalizeAktuelltCandidate({ status: "approved", title: "x" }).status).toBe("candidate");
    expect(normalizeAktuelltCandidate({ status: "draft", title: "x" }).status).toBe("draft");
  });

  it("släpper produkter, ämnen och datum utanför taxonomin", () => {
    const c = normalizeAktuelltCandidate({
      products: ["finance", "power-apps", "finance"],
      topic: "okänt",
      source_published_at: "2026-02-31",
      discovered_at: "2026-10-22",
      industry: "Påhittad bransch",
      relevance_score: 140,
    });
    expect(c.products).toEqual(["finance"]);
    expect(c.topic).toBeNull();
    expect(c.source_published_at).toBeNull();
    expect(c.discovered_at).toBe("2026-10-22");
    expect(c.industry).toBeNull();
    expect(c.relevance_score).toBe(100);
  });
});
