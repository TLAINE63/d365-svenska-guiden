import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import FitModel from "../FitModel";
import ShortAnswer from "../ShortAnswer";
import { fitModels, type FitModelKey } from "@/data/fitModels";

describe("Human-first buyer guide presentation", () => {
  it("keeps the short answer and existing next step without a decorative frame", () => {
    const html = renderToStaticMarkup(<MemoryRouter><ShortAnswer cta={{ label: "Nästa steg", to: "/kom-igang/" }}>Dynamics 365 hjälper er utvärdera valet.</ShortAnswer></MemoryRouter>);
    expect(html).toContain("<h2");
    expect(html).toContain("Kort svar");
    expect(html).toContain('href="/kom-igang/"');
    expect(html).toContain("whitespace-nowrap");
    expect(html).not.toContain("<svg");
    expect(html).not.toContain("style=");
  });

  it.each(["partner", "erp", "crm"] as FitModelKey[])("keeps the %s matrix in HTML behind native disclosure", (model) => {
    const html = renderToStaticMarkup(<MemoryRouter><FitModel model={model} heading="Vad avgör valet?" /></MemoryRouter>);
    expect(html).toContain(`<section id="d365-${model}-fit-model"`);
    expect(html).toContain(fitModels[model].name);
    expect(html).toContain("<details");
    expect(html).not.toContain("<details open");
    expect(html).toContain("<summary");
    expect(html).toContain("Visa bedömningsunderlaget");
    expect(html).toContain("<table");
    expect(html).toContain('scope="col"');
    expect(html).toContain('scope="row"');
    const text = html.replace(/<[^>]+>/g, "");
    for (const row of fitModels[model].dimensions) expect(text).toContain(row.dimension);
  });
});