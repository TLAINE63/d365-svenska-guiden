/**
 * Verifierar att alla situationskort på startsidan ("Vad stämmer bäst på er just nu?")
 * – inklusive ruta 8 ("Vi vet vad vi vill - Nu behöver vi en matchande partner") –
 * renderar både ett <img>-element och en CSS background-image på header-containern,
 * med korrekt fallback (DEFAULT_CARD_IMAGE) om kortets egen bild saknas.
 *
 * Testet kör i två lager:
 *  1. Statiskt källkodstest: säkerställer att fallback-logiken finns i Index.tsx.
 *  2. Renderingstest (jsdom): renderar <Index/> och inspekterar DOM:en.
 */
import { describe, it, expect, vi, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// --- Mocka tunga / nätverks-/sido-effektsmoduler så Index kan rendera i jsdom ---
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({ eq: () => ({ data: [], error: null }) }),
    }),
    auth: { getSession: async () => ({ data: { session: null } }) },
    functions: { invoke: async () => ({ data: null, error: null }) },
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      subscribe: () => ({ unsubscribe: () => {} }),
      unsubscribe: () => {},
    }),
  },
}));

// SEOHead/StructuredData/NoscriptSEO behöver inte testas här
vi.mock("@/components/SEOHead", () => ({ default: () => null }));
vi.mock("@/components/NoscriptSEO", () => ({ default: () => null }));
vi.mock("@/components/StructuredData", () => ({
  OrganizationSchema: () => null,
  WebSiteSchema: () => null,
  FAQSchema: () => null,
  LocalBusinessSchema: () => null,
}));
vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));

const INDEX_PATH = path.resolve(process.cwd(), "src/pages/Index.tsx");

describe("Index – situationskort renderar bild + bakgrundsbild", () => {
  describe("källkodsanalys", () => {
    let source = "";
    beforeAll(() => {
      source = fs.readFileSync(INDEX_PATH, "utf8");
    });

    it("definierar en DEFAULT_CARD_IMAGE-fallback", () => {
      expect(source).toMatch(/const\s+DEFAULT_CARD_IMAGE\s*=/);
    });

    it("löser cardImage med fallback i map-funktionen", () => {
      expect(source).toMatch(/const\s+cardImage\s*=\s*card\.image\s*\|\|\s*DEFAULT_CARD_IMAGE/);
    });

    it("renderar både backgroundImage och <img src> med samma cardImage", () => {
      expect(source).toMatch(/backgroundImage:\s*`url\(\$\{cardImage\}\)`/);
      expect(source).toMatch(/<img[\s\S]*?src=\{cardImage\}/);
    });

    it("har exakt 8 situationskort definierade", () => {
      // Räkna antalet objekt i situationCards-arrayen genom att hitta `eyebrow:`-rader.
      // (Säkrare än att räkna `{` då JSX/objekt blandas.)
      const block = source.match(/const\s+situationCards\s*=\s*\[([\s\S]*?)\n\];/);
      expect(block, "situationCards-array hittades inte").toBeTruthy();
      const eyebrows = block![1].match(/eyebrow:\s*"/g) ?? [];
      expect(eyebrows.length).toBe(8);
    });
  });

  describe("DOM-rendering", () => {
    it("renderar 8 kort där varje har <img> och background-image på headern", async () => {
      const Index = (await import("@/pages/Index")).default;

      render(
        <HelmetProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Index />
          </MemoryRouter>
        </HelmetProvider>
      );

      // Kortlänkarna pekar på kända rutter – vänta tills de finns i DOM.
      const expectedLinks = [
        "/erp/",
        "/d365sales/",
        "/d365marketing/",
        "/d365customerservice/",
        "/d365fieldservice/",
        "/d365contactcenter/",
        "/aioversikt/",
        "/valj-partner/",
      ];

      await waitFor(() => {
        for (const href of expectedLinks) {
          // Det kan finnas flera länkar till samma route – minst en räcker.
          const matches = screen.getAllByRole("link").filter((a) => a.getAttribute("href") === href);
          expect(matches.length, `saknar länk till ${href}`).toBeGreaterThan(0);
        }
      });

      // Identifiera kort-länkarna (de som ligger i situationspicker-griden).
      // Heuristik: de har klassen "min-h-[300px]" som är unik för dessa kort.
      const allLinks = screen.getAllByRole("link") as HTMLAnchorElement[];
      const cardLinks = allLinks.filter((a) => a.className.includes("min-h-[300px]"));

      expect(cardLinks.length, "förväntar 8 situationskort").toBe(8);

      cardLinks.forEach((link, idx) => {
        // 1. Header-containern (första div-barnet) ska ha background-image inline.
        const header = link.querySelector("div");
        expect(header, `kort #${idx + 1} saknar header-div`).toBeTruthy();
        const bg = (header as HTMLElement).style.backgroundImage;
        expect(bg, `kort #${idx + 1} (${link.getAttribute("href")}) saknar background-image`).toMatch(/^url\(.+\)$/);

        // 2. Headern ska innehålla ett <img> med en src som inte är tom.
        const img = header!.querySelector("img") as HTMLImageElement | null;
        expect(img, `kort #${idx + 1} saknar <img>`).toBeTruthy();
        expect(img!.getAttribute("src")).toBeTruthy();

        // 3. background-image och <img src> ska peka på samma asset (fallback-konsistens).
        const srcInBg = bg.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
        expect(srcInBg).toBe(img!.getAttribute("src"));
      });
    });
  });
});
