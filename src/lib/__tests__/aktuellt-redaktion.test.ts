import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  AKTUELLT_PLACEMENTS,
  aktuelltNeedsFactConfirmation,
  aktuelltPlacementsFor,
  aktuelltPublishBlockers,
} from "@/lib/aktuellt";

const ready = {
  source_url: "https://learn.microsoft.com/x",
  description: "Ingress",
  slug: "x",
  analysis: { what_happened: "Något hände" },
  fact_checked_at: "2026-10-22",
  needs_verification: false,
};

describe("Aktuellt: publicering från godkännandekön", () => {
  it("en komplett, faktakontrollerad artikel kan publiceras direkt", () => {
    expect(aktuelltPublishBlockers(ready)).toEqual([]);
  });

  it("utan faktakontroll krävs redaktörens intygande", () => {
    const a = { ...ready, fact_checked_at: null, needs_verification: true };
    expect(aktuelltNeedsFactConfirmation(a)).toBe(true);
    expect(aktuelltPublishBlockers(a)).toEqual([
      "datum för senaste faktakontroll",
      "bocka ur Behöver verifieras efter kontroll",
    ]);
    expect(aktuelltPublishBlockers(a, true)).toEqual([]);
  });

  it("intygande ersätter aldrig primärkälla eller innehåll", () => {
    const a = { ...ready, source_url: "", description: "", analysis: {} };
    expect(aktuelltPublishBlockers(a, true)).toEqual(["primärkälla", "ingress", "Vad har hänt?"]);
  });
});

describe("Aktuellt: automatisk spridning", () => {
  it("en Finance-artikel om AI visas på Finance, affärssystem och AI-sidorna", () => {
    const p = aktuelltPlacementsFor({ product_keys: ["finance"], topic: "ai-copilot", industry: null });
    expect(p).toContain("Finance & Supply Chain Management (/finance-supply-chain/)");
    expect(p).toContain("Affärssystem (ERP) (/affarssystem/)");
    expect(p).toContain("Copilot (/copilot/)");
    expect(p).toContain("AI-översikt (/aioversikt/)");
    expect(p).not.toContain("Sales (/d365sales/)");
  });

  it("licensartiklar visas på prissidan och bransch läggs till när den finns", () => {
    const p = aktuelltPlacementsFor({ product_keys: [], topic: "licensiering", industry: "Tillverkning" });
    expect(p).toEqual(["Priser och licenser (/priser/)", "Branschsidan för tillverkning"]);
  });

  it("varje registrerad placering används av en sida", () => {
    const pages = [
      "BusinessCentral", "FinanceSupplyChain", "ERPOverview", "CRM", "D365Sales", "D365CustomerService",
      "D365FieldService", "D365ContactCenter", "D365Marketing", "Copilot", "Agents", "AIOverview", "Priser",
    ].map((f) => readFileSync(resolve(__dirname, `../../pages/${f}.tsx`), "utf-8")).join("\n");
    for (const key of Object.keys(AKTUELLT_PLACEMENTS)) {
      expect(pages, key).toContain(`placement="${key}"`);
    }
  });
});
