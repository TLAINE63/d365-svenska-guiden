import { describe, expect, it } from "vitest";
import { cleanSelection, productsInText, selectedNeed, selectedProducts } from "./helpRequests";

describe("hjälpvägarnas ärenden", () => {
  it("visar behovsguidens valda verksamhetsbehov med sin etikett", () => {
    expect(selectedNeed({ need: "ekonomi" })).toBe("Ekonomi och rapportering");
  });

  it("visar befintlig kunds val och kostnadsfrågans ämne", () => {
    expect(selectedNeed({ option: "ai" })).toBe("Utforska AI och nya möjligheter");
    expect(selectedNeed({ subject: "Granska en offert" })).toBe("Granska en offert");
  });

  it("saknar behov när hjälpvägen inte frågar efter något", () => {
    expect(selectedNeed({ initial_intent: "IsvRequirement" })).toBeNull();
  });

  it("tar besökarens uttryckliga produktval före underlaget", () => {
    expect(selectedProducts({ product: "Sales" }, { x: ["Byggd för: Business Central"] })).toEqual(["Sales"]);
  });

  it("läser produkten ur tilläggets underlag", () => {
    expect(selectedProducts({}, { "Lösningen ni tittar på": ["Lösning: X", "Byggd för: Finance & Supply Chain Management"] }))
      .toEqual(["Finance & Supply Chain Management"]);
  });

  it("räknar inte Finance & Supply Chain Management även som Finance", () => {
    expect(productsInText("Finance & Supply Chain Management och Sales")).toEqual(["Finance & Supply Chain Management", "Sales"]);
  });

  it("sparar bara korta uppräknade värden", () => {
    expect(cleanSelection({ need: "ekonomi", "Bad Key": "x", n: 3, obj: { a: 1 }, empty: "" })).toEqual({ need: "ekonomi", n: 3 });
  });
});
