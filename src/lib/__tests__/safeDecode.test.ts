import { describe, it, expect } from "vitest";
import { safeDecode } from "@/lib/safeDecode";

describe("safeDecode", () => {
  it("avkodar vanliga adressdelar", () => {
    expect(safeDecode("partners")).toBe("partners");
    expect(safeDecode("%C3%B6ppna")).toBe("öppna");
    expect(safeDecode("a%2Fb")).toBe("a/b");
  });
  it("trasig procentkodning returneras i stället för att kasta", () => {
    for (const s of ["rabatt-50%", "foo%zz", "%", "%2", "50% off"]) expect(safeDecode(s)).toBe(s);
  });
});
