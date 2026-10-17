import { act, cleanup, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CountUp from "../CountUp";

describe("CountUp", () => {
  let frames: Map<number, FrameRequestCallback>;
  let nextFrame: number;
  let reveal: () => void;

  beforeEach(() => {
    frames = new Map();
    nextFrame = 0;
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback) {
        reveal = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      observe() {}
      disconnect() {}
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const tick = (time: number) => act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(time));
  });

  it("renders the supplied count before client animation (including server HTML)", () => {
    expect(renderToString(<CountUp value={72} />)).toContain("72");
  });

  it("never counts below zero when the first frame timestamp precedes the start", () => {
    const { container } = render(<CountUp value={60} durationMs={1000} />);
    act(() => reveal());
    tick(-5);
    expect(container.textContent).toBe("0");
  });

  it("starts at once when the number is already on screen", () => {
    const rect = { top: 120, bottom: 150 } as DOMRect;
    const spy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect);
    const { container } = render(<CountUp value={60} durationMs={1000} />);
    expect(frames.size).toBe(1);
    tick(500);
    expect(container.textContent).toBe("45");
    spy.mockRestore();
  });


  it("reaches a new catalog count received during the initial animation", () => {
    const { container, rerender } = render(<CountUp value={60} durationMs={1000} />);
    act(() => reveal());
    tick(300);
    rerender(<CountUp value={72} durationMs={1000} />);
    tick(1000);
    expect(container.textContent).toBe("72");
    expect(frames.size).toBe(0);
  });

  it("updates after an animation has finished, including decreasing counts", () => {
    const { container, rerender } = render(<CountUp value={60} durationMs={1000} />);
    act(() => reveal());
    tick(1000);
    rerender(<CountUp value={72} durationMs={1000} />);
    tick(1000);
    expect(container.textContent).toBe("72");
    rerender(<CountUp value={65} durationMs={1000} />);
    tick(1000);
    expect(container.textContent).toBe("65");
  });

  it("shows new counts immediately with reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    const { container, rerender } = render(<CountUp value={60} />);
    rerender(<CountUp value={72} />);
    expect(container.textContent).toBe("72");
    expect(frames.size).toBe(0);
  });

  it("cancels pending animation on unmount", () => {
    const { unmount } = render(<CountUp value={60} />);
    act(() => reveal());
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
  });
});