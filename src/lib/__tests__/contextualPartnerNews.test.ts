import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { CONTEXTUAL_NEWS_MAX, industryMatches, pickContextualPartnerNews } from "../contextualPartnerNews";
import type { PartnerNewsItem } from "@/hooks/usePartnerNews";

const item = (id: string, news_type: PartnerNewsItem["news_type"], industry: string | null = null) =>
  ({ id, news_type, industry } as PartnerNewsItem);

describe("kontextuellt Partnernytt", () => {
  it("visar högst tre poster", () => {
    const list = ["a", "b", "c", "d", "e"].map((id) => item(id, "artikel"));
    expect(CONTEXTUAL_NEWS_MAX).toBe(3);
    expect(pickContextualPartnerNews(list).map((n) => n.id)).toEqual(["a", "b", "c"]);
  });

  it("utesluter rena partnernyheter och erbjudanden från köpsidor", () => {
    const list = [item("n", "partnernyhet"), item("o", "erbjudande"), item("k", "kundcase"), item("w", "webinar")];
    expect(pickContextualPartnerNews(list).map((n) => n.id)).toEqual(["k", "w"]);
  });

  it("returnerar inget när relevanta träffar saknas", () => {
    expect(pickContextualPartnerNews([item("x", "artikel", "Finans & Försäkring")], { industry: "Tillverkningsindustri" })).toEqual([]);
  });

  it("matchar branschvarianter på första ordet", () => {
    expect(industryMatches("Bygg & Entreprenad", "Bygg, Entreprenad & Installation")).toBe(true);
    expect(industryMatches("Tillverkningsindustri", "Tillverkning")).toBe(true);
    expect(industryMatches(null, "Tillverkningsindustri")).toBe(false);
  });

  it("startsidan har inget generellt partnernyhetsflöde", () => {
    expect(readFileSync("src/pages/Index.tsx", "utf8")).not.toContain("HomePartnerNewsSection");
  });
});
