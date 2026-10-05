import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SourcesAndMethod from "@/components/SourcesAndMethod";
import { getArticleMicrosoftSources, safeSourceHref } from "@/lib/guideSources";
afterEach(cleanup);
describe("SourcesAndMethod", () => {
 it("separates external facts, partner evidence and editorial conclusions", () => {
  render(<MemoryRouter><SourcesAndMethod externalSources={[{name:"Microsoft licensinformation",supports:"Listpriser",href:"https://www.microsoft.com/pricing",updatedAt:"2026-06-11"}]} partnerEvidence={[{name:"D365.SE:s partnerdatabas",supports:"Registrerade uppgifter"}]} analysis="D365.SE:s slutsats" /></MemoryRouter>);
  expect(screen.getByRole("heading",{name:"Källor och metod"})).toBeTruthy();
  expect(screen.getByRole("heading",{name:"Fakta från extern källa"})).toBeTruthy();
  expect(screen.getByRole("heading",{name:"Partnerunderlag"})).toBeTruthy();
  expect(screen.getByRole("heading",{name:"Redaktionell bedömning"})).toBeTruthy();
  expect(screen.getByText("2026-06-11")).toBeTruthy();
 });
 it("discloses missing external references without inventing dates", () => {
  const {container}=render(<MemoryRouter><SourcesAndMethod /></MemoryRouter>);
  expect(screen.getByText(/Separata externa källhänvisningar är inte specificerade/)).toBeTruthy();
  expect(container.querySelector("time")).toBeNull();
  expect(screen.queryByRole("heading",{name:"Partnerunderlag"})).toBeNull();
 });
 it("never creates unsafe links or invalid dates", () => {
  const {container}=render(<MemoryRouter><SourcesAndMethod externalSources={[{name:"Unsafe",supports:"Text",href:"javascript:alert(1)",updatedAt:"2026-02-31"}]} /></MemoryRouter>);
  expect(screen.queryByRole("link",{name:"Unsafe"})).toBeNull();
  expect(container.querySelector("time")).toBeNull();
  expect(safeSourceHref("//evil.com")).toBeUndefined();
  expect(safeSourceHref("https://user:pass@example.com")).toBeUndefined();
 });
 it("only collects existing Microsoft citations and deduplicates them", () => {
  const sources=getArticleMicrosoftSources(<><p><a href="https://learn.microsoft.com/dynamics365/">Docs</a></p><a href="https://learn.microsoft.com/dynamics365/">Again</a><a href="https://partner.example/">Partner</a><a href="https://microsoft.com.evil.example/">Fake</a></>);
  expect(sources).toHaveLength(1);
  expect(sources[0].href).toBe("https://learn.microsoft.com/dynamics365/");
 });
});
