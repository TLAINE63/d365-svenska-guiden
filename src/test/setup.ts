import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// IntersectionObserver stub used by some lazy/inview hooks
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
// @ts-expect-error - assign minimal stub
window.IntersectionObserver = IO;
// @ts-expect-error - assign minimal stub
global.IntersectionObserver = IO;

// scrollTo stub
window.scrollTo = () => {};
