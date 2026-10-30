/**
 * Källhänvisning vid kopiering: när en besökare kopierar ett längre textstycke från en publik sida
 * läggs en kort källrad med länk till sidan sist i urklippet. Formulär, fält och interna sidor
 * påverkas aldrig, och korta kopieringar (t.ex. ett namn eller ett pris) lämnas orörda.
 */
export const COPY_ATTRIBUTION_MIN_CHARS = 150;

const INTERNAL_PREFIXES = ["/admin", "/redaktion", "/partner-admin", "/lead-admin", "/partner-update", "/partner-events", "/partnerstatistik", "/partner-statistik", "/avtalssida", "/partner-avtal", "/konto"];

export function isAttributionPath(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return !INTERNAL_PREFIXES.some((x) => p === x || p.startsWith(`${x}/`));
}

/** Kanonisk adress för sidan: alltid d365.se, utan frågesträng eller ankare. */
export function attributionUrl(pathname: string): string {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `https://d365.se${path}`;
}

export function attributionText(pathname: string): string {
  return `Källa: D365.SE Köpguide, ${attributionUrl(pathname)}`;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Returnerar urklippets text och html med källrad, eller null om kopieringen ska lämnas orörd. */
export function withAttribution(selectedText: string, selectedHtml: string, pathname: string): { text: string; html: string } | null {
  if (!isAttributionPath(pathname)) return null;
  if (selectedText.trim().length <= COPY_ATTRIBUTION_MIN_CHARS) return null;
  const url = attributionUrl(pathname);
  return {
    text: `${selectedText}\n\n${attributionText(pathname)}`,
    html: `${selectedHtml}<p>Källa: <a href="${esc(url)}">D365.SE Köpguide</a>, ${esc(url)}</p>`,
  };
}

function isEditable(node: Node | null): boolean {
  const el = node instanceof Element ? node : node?.parentElement ?? null;
  return !!el?.closest("input, textarea, select, [contenteditable=''], [contenteditable='true'], [data-no-copy-attribution]");
}

/** Lyssnare som installeras en gång i appens ram. Returnerar en funktion som tar bort den. */
export function installCopyAttribution(): () => void {
  const onCopy = (e: ClipboardEvent) => {
    try {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !e.clipboardData) return;
      if (isEditable(sel.anchorNode) || isEditable(sel.focusNode)) return;
      const text = sel.toString();
      const box = document.createElement("div");
      for (let i = 0; i < sel.rangeCount; i++) box.appendChild(sel.getRangeAt(i).cloneContents());
      const out = withAttribution(text, box.innerHTML, window.location.pathname);
      if (!out) return;
      e.clipboardData.setData("text/plain", out.text);
      e.clipboardData.setData("text/html", out.html);
      e.preventDefault();
    } catch { /* kopieringen fungerar som vanligt vid fel */ }
  };
  document.addEventListener("copy", onCopy);
  return () => document.removeEventListener("copy", onCopy);
}
