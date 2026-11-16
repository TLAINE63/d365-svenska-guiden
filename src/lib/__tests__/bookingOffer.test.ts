import { beforeEach, describe, expect, it, vi } from "vitest";
import { aggregateBookingClicks, bookingMonths } from "../../../supabase/functions/_shared/bookingStats";
import { cleanBookingSource } from "../../../supabase/functions/_shared/formContext";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

vi.mock("@/lib/siJourney", () => ({ forwardFunnelEvent: vi.fn() }));

describe("direct booking rules", () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); vi.restoreAllMocks(); });
  it("sends only placement and path, without storing an identifier", async () => {
    const sendBeacon = vi.fn((_url: string, _blob: Blob) => true);
    Object.defineProperty(navigator, "sendBeacon", { value: sendBeacon, configurable: true });
    trackFunnelEvent({ event_type: "cta_click", event_name: "booking_click", page_path: "/verksamhetsvardering/", metadata: { placement: "affarsnytta", company_domain: "not-allowed.example" } });
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const blob = sendBeacon.mock.calls[0][1] as Blob;
    const text = await new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsText(blob); });
    expect(JSON.parse(text)).toEqual({ event_type: "cta_click", event_name: "booking_click", page_path: "/verksamhetsvardering/", metadata: { placement: "affarsnytta", path: "/verksamhetsvardering/" } });
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
  it("does not send booking clicks with d365_internal=1", () => {
    const sendBeacon = vi.fn(() => true);
    Object.defineProperty(navigator, "sendBeacon", { value: sendBeacon, configurable: true });
    localStorage.setItem("d365_internal", "1");
    trackFunnelEvent({ event_type: "cta_click", event_name: "booking_click", metadata: { placement: "affarsnytta" } });
    expect(sendBeacon).not.toHaveBeenCalled();
  });
  it("keeps exactly the current and five preceding Stockholm months", () => {
    expect(bookingMonths(new Date("2026-10-31T23:30:00Z"))).toEqual(["2026-11", "2026-10", "2026-09", "2026-08", "2026-07", "2026-06"]);
  });
  it("counts clicks separately per placement and Stockholm month", () => {
    const months = bookingMonths(new Date("2026-11-16T11:10:00Z"));
    const rows = aggregateBookingClicks([
      { occurred_at: "2026-10-31T23:30:00Z", metadata: { placement: "roi-bc" } },
      { occurred_at: "2026-11-16T11:10:00Z", metadata: { placement: "roi-bc" } },
      { occurred_at: "2026-10-16T11:10:00Z", metadata: { placement: "compare" } },
      { occurred_at: "2026-05-16T11:10:00Z", metadata: { placement: "roi-bc" } },
    ], months);
    expect(rows.find((r) => r.placement === "roi-bc")?.counts).toEqual({ "2026-11": 2, "2026-10": 0, "2026-09": 0, "2026-08": 0, "2026-07": 0, "2026-06": 0 });
    expect(rows.find((r) => r.placement === "compare")?.counts["2026-10"]).toBe(1);
  });
  it("retains a safe placement in the callback source", () => {
    expect(cleanBookingSource("/verksamhetsvardering/#affarsnytta")).toBe("/verksamhetsvardering/#affarsnytta");
    expect(cleanBookingSource("/verksamhetsvardering/#someone@example.com")).toBe("/verksamhetsvardering/");
  });
});