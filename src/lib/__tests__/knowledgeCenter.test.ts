import { describe, it, expect } from "vitest";
import { entriesFor, recommendFor, situationsFor, matchesSearch, KNOWLEDGE_ENTRIES, type KnowledgeItemLike } from "@/lib/knowledgeCenter";

const item = (p: Partial<KnowledgeItemLike> & { id: string }): KnowledgeItemLike & { date?: string | null } => ({
  type: "artikel", title: "", url: "/x/", products: [], ...p,
});

describe("Kunskapscentrets ingångar", () => {
  it("har exakt fyra ingångar", () => {
    expect(KNOWLEDGE_ENTRIES.map((e) => e.id)).toEqual(["behov", "jamfor", "planera", "partner"]);
  });

  it("kopplar kravspecifikationer till Planera och behovsanalyser till Förstå behov", () => {
    expect(entriesFor(item({ id: "a", type: "kravspecifikation", title: "Kravspec ERP" }))).toContain("planera");
    expect(entriesFor(item({ id: "b", type: "behovsanalys", title: "Behovsanalys" }))).toContain("behov");
  });

  it("kopplar INSIDE-intervjuer och partnerguider till partneringången", () => {
    expect(entriesFor(item({ id: "c", type: "intervju", title: "Samtal med 4PS" }))).toContain("partner");
    expect(entriesFor(item({ id: "tool-guide-valj-partner", type: "guide", title: "Så väljer du" }))).toContain("partner");
  });

  it("ger förvaltningsinnehåll situationen befintlig kund", () => {
    expect(situationsFor(item({ id: "d", title: "Uppgradera från NAV" }))).toContain("befintlig_kund");
  });

  it("ger olika rekommendationer per ingång", () => {
    const items = [
      item({ id: "k", type: "kravspecifikation", title: "Kravspec" }),
      item({ id: "b", type: "behovsanalys", title: "Behovsanalys" }),
      item({ id: "i", type: "intervju", title: "INSIDE" }),
      item({ id: "j", type: "branscher", title: "Bransch" }),
    ];
    const ids = (e: "behov" | "jamfor" | "planera" | "partner") => recommendFor(items, e).filter((r) => !r.related).map((r) => r.item.id);
    expect(ids("planera")).toEqual(["k"]);
    expect(ids("partner")).toEqual(["i"]);
    expect(ids("jamfor")).toEqual(["j"]);
  });

  it("fyller på med närliggande innehåll markerat som närliggande när träffarna är få", () => {
    const items = [item({ id: "k", type: "kravspecifikation", title: "Kravspec" }), item({ id: "b", type: "behovsanalys", title: "Behovsanalys" })];
    const rec = recommendFor(items, "planera");
    expect(rec.find((r) => r.item.id === "b")?.related).toBe(true);
  });

  it("söker på alla ord i titel och beskrivning", () => {
    expect(matchesSearch(item({ id: "s", title: "Business Central kostnad" }), "central kostnad")).toBe(true);
    expect(matchesSearch(item({ id: "s", title: "Business Central kostnad" }), "sales")).toBe(false);
  });
});
