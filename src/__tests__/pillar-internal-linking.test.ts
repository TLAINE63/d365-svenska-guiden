import { describe, it, expect } from "vitest";
import {
  indexRelatedPages,
  erpRelatedPages,
  bcRelatedPages,
} from "@/components/RelatedPages";

/**
 * Automatisk länkgranskning för pelarsidorna.
 *
 * 2026-06-26: /affarssystem (TOFU) konsoliderad in i /erp (pelarsidan
 * för affärssystem/ERP). Tratten är nu:
 *
 *   /  (Hub)                       Brand/discovery
 *   └─► /erp        (TOFU + MOFU)  Guide + jämförelse BC vs F&SCM
 *       └─► /businesscentral (BOFU) Produkt + pris
 *           └─► /valjdynamics365partner (Konvertering)
 */

type Link = { title: string; description: string; href: string };

const norm = (href: string) => href.replace(/\/?$/, "/");

const has = (links: Link[], targetHref: string) =>
  links.some((l) => norm(l.href) === norm(targetHref));

const findLink = (links: Link[], targetHref: string): Link | undefined =>
  links.find((l) => norm(l.href) === norm(targetHref));

describe("Pelar-intern länkstruktur (Hub → /erp → /businesscentral → konvertering)", () => {
  describe("Framåtlänkar i tratten (måste finnas)", () => {
    it("/ (Hub) länkar nedåt till /erp", () => {
      expect(has(indexRelatedPages, "/erp/")).toBe(true);
    });

    it("/erp länkar nedåt till /businesscentral (BOFU)", () => {
      expect(has(erpRelatedPages, "/businesscentral/")).toBe(true);
    });

    it("/businesscentral (BOFU) länkar till /valjdynamics365partner (Konvertering)", () => {
      expect(has(bcRelatedPages, "/valjdynamics365partner/")).toBe(true);
    });
  });

  describe("Konsolidering /affarssystem → /erp", () => {
    it("Inga pelar-länklistor pekar på den avvecklade /affarssystem-URL:n", () => {
      const all = [indexRelatedPages, erpRelatedPages, bcRelatedPages];
      for (const list of all) {
        expect(has(list, "/affarssystem/")).toBe(false);
      }
    });
  });

  describe("Ankartext-regler (förhindrar sökordskrock)", () => {
    it("/:s länk till /erp använder guide/jämförelse-formulering, inte rena nyckelordet 'ERP'", () => {
      const link = findLink(indexRelatedPages, "/erp/")!;
      expect(link).toBeDefined();
      expect(link.title.toLowerCase()).not.toBe("erp");
      expect(link.title.toLowerCase()).not.toBe("erp-översikt");
      expect(link.title).toMatch(/guide|jämför|affärssystem/i);
    });

    it("/erp:s länk till /businesscentral framhäver pris/produkt (BOFU-intent)", () => {
      const link = findLink(erpRelatedPages, "/businesscentral/")!;
      expect(link).toBeDefined();
      expect(link.title).toMatch(/pris|funktioner|licens|produkt/i);
    });
  });

  describe("Strukturell hygien", () => {
    const all: Array<[string, Link[]]> = [
      ["indexRelatedPages", indexRelatedPages],
      ["erpRelatedPages", erpRelatedPages],
      ["bcRelatedPages", bcRelatedPages],
    ];

    it.each(all)("%s har inga interna självlänkar", (_name, links) => {
      const selfMap: Record<string, string> = {
        indexRelatedPages: "/",
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
