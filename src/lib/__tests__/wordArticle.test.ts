import { describe, expect, it } from "vitest";
import { tidyWordHtml } from "@/lib/wordArticle";
import { slugifyArticle } from "@/components/RedaktionWordArticleDialog";

const WORD = [
  '<p><img src="https://x.test/hero.webp" alt="Bygge" /></p>',
  "<p><em>Bildtext under huvudbilden.</em></p>",
  "<p><strong>Det här är ingressen om Dynamics 365.</strong></p>",
  "<p></p>",
  "<h2>1. Första frågan</h2>",
  "<p>Brödtext — med långt tankstreck.</p>",
  '<p><img src="https://x.test/b.webp" /></p>',
  "<p><em>Andra bildtexten</em></p>",
].join("");

describe("Word-artikel till utkast", () => {
  const draft = tidyWordHtml(WORD);

  it("första bilden med kursiv text under blir huvudbild och bildtext", () => {
    expect(draft.heroImage).toBe("https://x.test/hero.webp");
    expect(draft.heroCaption).toBe("Bildtext under huvudbilden.");
    expect(draft.bodyHtml).not.toContain("hero.webp");
  });

  it("inledande fetstilt stycke blir ingress och tas bort ur texten", () => {
    expect(draft.ingress).toBe("Det här är ingressen om Dynamics\u00A0365.");
    expect(draft.bodyHtml).not.toContain("ingressen");
  });

  it("senare bild med kursiv text blir bild med bildtext", () => {
    expect(draft.bodyHtml).toContain("<figure>");
    expect(draft.bodyHtml).toContain("<figcaption>Andra bildtexten</figcaption>");
  });

  it("långa tankstreck ersätts med korta", () => {
    expect(draft.bodyHtml).toContain("Brödtext – med");
    expect(draft.bodyHtml).not.toContain("—");
  });

  it("titel från formatmallen Rubrik plockas ut och övriga H1 blir H2", () => {
    const d = tidyWordHtml('<h1 class="doc-title">Min titel</h1><h1>Avsnitt</h1><p>Text</p>');
    expect(d.title).toBe("Min titel");
    expect(d.bodyHtml).toBe("<h2>Avsnitt</h2><p>Text</p>");
  });

  it("varnar när titel saknas", () => {
    expect(draft.warnings.some((w) => w.includes("titel"))).toBe(true);
  });
});

describe("artikeladress", () => {
  it("svenska tecken blir a och o", () => {
    expect(slugifyArticle("Så väljer ni affärssystem för bygg & öppna projekt")).toBe(
      "sa-valjer-ni-affarssystem-for-bygg-oppna-projekt",
    );
  });
});
