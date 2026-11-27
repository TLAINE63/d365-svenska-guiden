// Site-wide UX for number fields: select content on focus (easy to replace "0"),
// and stop mouse-wheel from changing values. Spinner arrows are hidden in index.css.
export function initNumberInputUx() {
  if (typeof document === "undefined") return;
  const isNum = (t: EventTarget | null): t is HTMLInputElement =>
    t instanceof HTMLInputElement && t.type === "number";
  document.addEventListener("focusin", (e) => {
    if (isNum(e.target)) {
      const el = e.target;
      requestAnimationFrame(() => { try { el.select(); } catch { /* noop */ } });
    }
  });
  document.addEventListener("wheel", (e) => {
    if (isNum(e.target) && document.activeElement === e.target) e.target.blur();
  }, { passive: true });
}
