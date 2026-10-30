import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { GUIDE_CONTENT } from "@/data/partnerGuideContent";
import {
  BUDGET_CTA_BUYERS,
  BUDGET_CTA_PARTNERS,
  BUDGET_GUIDE_PATH,
  BUDGET_GUIDE_SEO,
} from "@/data/budgetPlanningGuide";
import { BC_CATEGORY_PAGES } from "@/data/bcIsvCategoryPages";

const PAGE = readFileSync(resolve(process.cwd(), "src/pages/BudgetPrognosPlanering.tsx"), "utf-8");

describe("Guiden om budget, prognos och säljplanering", () => {
  it("ligger på den beslutade adressen med beslutad titel", () => {
    expect(BUDGET_GUIDE_PATH).toBe("/guider/budget-prognos-planering-dynamics-365/");
    expect(BUDGET_GUIDE_SEO.title).toBe("Budget, prognos och säljplanering i Dynamics 365 | d365.se");
  });

  it("påstår inget ägarintresse i Aimplan och nämner inte Cloud Ahead", () => {
    expect(PAGE).not.toContain("AIMPLAN_DISCLOSURE");
    const all = JSON.stringify(guide);
    expect(all).not.toContain("ägarintresse");
    expect(all).not.toContain("Cloud Ahead");
  });

  it("CTA-boxarna leder köpare till partnerväljaren och partners till fpaa.se", () => {
    expect(BUDGET_CTA_BUYERS.button.to).toBe("/valjdynamics365partner/");
    expect(BUDGET_CTA_BUYERS.secondary.href).toBe("https://fpaa.se");
    expect(BUDGET_CTA_PARTNERS.button.href).toBe("https://fpaa.se/ekosystem/bli-partner/");
  });

  it.each(["valja-business-central-partner", "valja-finance-supply-chain-partner", "valja-dynamics-365-sales-partner"])(
    "%s har kravpunkten om Power BI och planering med länk till guiden",
    (slug) => {
      const hit = GUIDE_CONTENT[slug].blocks.find(
        (b) => b.type === "callout" && b.link?.to === BUDGET_GUIDE_PATH,
      );
      expect(hit).toBeDefined();
    },
  );

  it("FP&A-sidan för Business Central länkar till guiden", () => {
    expect(BC_CATEGORY_PAGES.find((p) => p.slug === "rapportering-fpa")?.guideLink?.to).toBe(BUDGET_GUIDE_PATH);
  });
});
