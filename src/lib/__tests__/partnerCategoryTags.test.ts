import { describe, it, expect } from "vitest";
import { partnerCategoryKeys } from "../partnerCategoryTags";

describe("partnerCategoryKeys", () => {
  it("Finance eller Supply Chain Management ger F&SCM / Enterprise ERP", () => {
    expect(partnerCategoryKeys({ applications: ["Finance"] })).toEqual(["fscm"]);
    expect(partnerCategoryKeys({ applications: ["F&SCM"] })).toEqual(["fscm"]);
  });

  it("Business Central ger egen kategori, inte F&SCM", () => {
    expect(partnerCategoryKeys({ applications: ["Business Central"] })).toEqual(["bc"]);
  });

  it("Sales eller Customer Service ger CRM / Customer Service", () => {
    expect(partnerCategoryKeys({ applications: ["Sales"] })).toEqual(["crm"]);
    expect(partnerCategoryKeys({ applications: ["Customer Service"] })).toEqual(["crm"]);
  });

  it("Tillverkningsindustri ger Tillverkning & Industri", () => {
    expect(partnerCategoryKeys({ applications: [], industries: ["Tillverkningsindustri"] })).toEqual(["industri"]);
  });

  it("Project Operations eller Human Resources ensamt ger ingen kategori", () => {
    expect(partnerCategoryKeys({ applications: ["Project Operations", "Human Resources"] })).toEqual([]);
  });
});
