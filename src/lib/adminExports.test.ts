import { afterEach, describe, expect, it } from "vitest";
import { CRM_LAST_DOWNLOAD_KEY, crmFromDate, crmLastDownload } from "./adminExports";

afterEach(() => localStorage.clear());

describe("CRM export dates", () => {
  it("uses the last package download as From date", () => {
    localStorage.setItem("crm_paket_senast", "2026-11-10");
    expect(CRM_LAST_DOWNLOAD_KEY).toBe("crm_paket_senast");
    expect(crmFromDate(new Date("2026-11-17T10:00:00Z"))).toBe("2026-11-10");
  });
  it("preserves the 35-day fallback before the first download", () => {
    expect(crmLastDownload()).toBeNull();
    expect(crmFromDate(new Date("2026-11-17T10:00:00Z"))).toBe("2026-10-13");
  });
  it("uses Stockholm's date across UTC midnight", () => {
    expect(crmFromDate(new Date("2026-11-17T23:30:00Z"))).toBe("2026-10-14");
  });
  it("ignores invalid stored dates", () => {
    localStorage.setItem(CRM_LAST_DOWNLOAD_KEY, "not-a-date");
    expect(crmLastDownload()).toBeNull();
    expect(crmFromDate(new Date("2026-11-17T10:00:00Z"))).toBe("2026-10-13");
  });
});