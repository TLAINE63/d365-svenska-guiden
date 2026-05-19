import { describe, it, expect } from "vitest";
import {
  indexRelatedPages,
  affarssystemRelatedPages,
  erpRelatedPages,
  bcRelatedPages,
} from "@/components/RelatedPages";

/**
 * Automatisk länkgranskning för pelarsidorna.
 *
 * Bevakar TOFU → MOFU → BOFU → Konvertering-tratten enligt
 * mem://seo/pillar-internal-linking-sv:
 *
 *   /  (Hub)                       Brand/discovery
 *   └─► /affarssystem   (TOFU)     Utbildning, "vad är ett affärssystem"
 *       └─► /erp        (MOFU)     Teknisk jämförelse BC vs F&SCM
 *           └─► /businesscentral (BOFU) Produkt + pris
 *               └─► /valjdynamics365partner (Konvertering)
 *
 * Reglerna existerar för att förhindra sökordskannibalisering
 * mellan de fyra pelarsidorna. Vid varje förändring av
 * `RelatedPages.tsx` körs detta test automatiskt.
 */

type Link = { title: string; description: string; href: string };

const norm = (href: string) => href.replace(/\/?$/, "/");

const has = (links: Link[], targetHref: string) =>
  links.some((l) => norm(l.href) === norm(targetHref));

const findLink = (links: Link[], targetHref: string): Link | undefined =>
  links.find((l) => norm(l.href) === norm(targetHref));

describe("Pelar-intern länkstruktur (TOFU → MOFU → BOFU)", () => {
  describe("Framåtlänkar i tratten (måste finnas)", () => {
    it("/ (Hub) länkar nedåt till /affarssystem (TOFU)", () => {
      expect(has(indexRelatedPages, "/affarssystem/")).toBe(true);
    });

    it("/ (Hub) länkar nedåt till /erp (MOFU)", () => {
      expect(has(indexRelatedPages, "/erp/")).toBe(true);
    });

    it("/affarssystem (TOFU) länkar nedåt till /erp (MOFU)", () => {
      expect(has(affarssystemRelatedPages, "/erp/")).toBe(true);
    });

    it("/affarssystem (TOFU) länkar nedåt till /businesscentral (BOFU)", () => {
      expect(has(affarssystemRelatedPages, "/businesscentral/")).toBe(true);
    });

    it("/erp (MOFU) länkar nedåt till /businesscentral (BOFU)", () => {
      expect(has(erpRelatedPages, "/businesscentral/")).toBe(true);
    });

    it("/businesscentral (BOFU) länkar till /valjdynamics365partner (Konvertering)", () => {
      expect(has(bcRelatedPages, "/valjdynamics365partner/")).toBe(true);
    });
  });

  describe("Bakåtlänkar i tratten (förbjudna – anti-kannibalisering)", () => {
    it("/erp (MOFU) länkar INTE bakåt till /affarssystem (TOFU)", () => {
      // En köpmogen MOFU-besökare ska inte skickas tillbaka till TOFU-utbildning.
      expect(has(erpRelatedPages, "/affarssystem/")).toBe(false);
    });

    it("/businesscentral (BOFU) länkar INTE bakåt till /affarssystem (TOFU)", () => {
      // BOFU-trafik ska konvertera, inte återgå till utbildningssteget.
      expect(has(bcRelatedPages, "/affarssystem/")).toBe(false);
    });
  });

  describe("Ankartext-regler (förhindrar sökordskrock)", () => {
    it("/:s länk till /affarssystem använder TOFU-formulering, inte rena nyckelordet 'Affärssystem'", () => {
      const link = findLink(indexRelatedPages, "/affarssystem/")!;
      expect(link).toBeDefined();
      // Får inte vara exakt "Affärssystem" – då konkurrerar / med /affarssystem
      // om samma SERP. TOFU-frågeform ("Vad är ett affärssystem?") är OK.
      expect(link.title.toLowerCase()).not.toBe("affärssystem");
      expect(link.title).toMatch(/vad är|guide|utbildning|introduktion/i);
    });

    it("/:s länk till /erp använder MOFU-jämförelse, inte rena nyckelordet 'ERP'", () => {
      const link = findLink(indexRelatedPages, "/erp/")!;
      expect(link).toBeDefined();
      // Får inte vara exakt "ERP" eller "ERP-översikt" på Hub-sidan – då
      // krockar / med /erp:s primära sökord.
      expect(link.title.toLowerCase()).not.toBe("erp");
      expect(link.title.toLowerCase()).not.toBe("erp-översikt");
      expect(link.title).toMatch(/jämför|business central.*finance|finance.*business central/i);
    });

    it("/affarssystem:s länk till /erp använder jämförelse-formulering, inte rena ordet 'ERP'", () => {
      const link = findLink(affarssystemRelatedPages, "/erp/")!;
      expect(link).toBeDefined();
      // TOFU-sidan får inte ranka sig själv för "ERP" via intern ankartext.
      expect(link.title.toLowerCase()).not.toBe("erp");
      expect(link.title.toLowerCase()).not.toBe("erp-översikt");
      expect(link.title).toMatch(/jämför/i);
    });

    it("/erp:s länk till /businesscentral framhäver pris/produkt (BOFU-intent)", () => {
      const link = findLink(erpRelatedPages, "/businesscentral/")!;
      expect(link).toBeDefined();
      // MOFU → BOFU ska driva köpsignal, inte återanvända allmän
      // "Business Central"-anchor som krockar med BC:s egen H1.
      expect(link.title).toMatch(/pris|funktioner|licens|produkt/i);
    });
  });

  describe("Strukturell hygien", () => {
    const all: Array<[string, Link[]]> = [
      ["indexRelatedPages", indexRelatedPages],
      ["affarssystemRelatedPages", affarssystemRelatedPages],
      ["erpRelatedPages", erpRelatedPages],
      ["bcRelatedPages", bcRelatedPages],
    ];

    it.each(all)("%s har inga interna självlänkar", (_name, links) => {
      // En sida får inte länka till sig själv via RelatedPages.
      const selfMap: Record<string, string> = {
        indexRelatedPages: "/",
        affarssystemRelatedPages: "/affarssystem/",
        erpRelatedPages: "/erp/",
        bcRelatedPages: "/businesscentral/",
      };
      const self = selfMap[_name];
      expect(links.find((l) => norm(l.href) === norm(self))).toBeUndefined();
    });

    it.each(all)("%s har inga duplicerade href:s", (_name, links) => {
      const seen = new Set<string>();
      const dupes: string[] = [];
      for (const l of links) {
        const key = norm(l.href);
        if (seen.has(key)) dupes.push(key);
        seen.add(key);
      }
      expect(dupes).toEqual([]);
    });

    it.each(all)("%s: alla länkar har trailing slash (kanonisk URL)", (_name, links) => {
      const offenders = links.filter((l) => !l.href.endsWith("/"));
      expect(offenders.map((l) => l.href)).toEqual([]);
    });
  });
});
