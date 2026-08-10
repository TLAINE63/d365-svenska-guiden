/**
 * In-memory hand-off of a PDF delivery function between the gated download
 * component and the thank-you page. Lives only for the current SPA session –
 * after a hard reload the thank-you page falls back to a link back to the tool.
 */
type Deliver = () => void | Promise<void>;

let current: { key: string; deliver: Deliver } | null = null;

export function setPdfDelivery(key: string, deliver: Deliver) {
  current = { key, deliver };
}

export function getPdfDelivery(key: string): Deliver | null {
  return current && current.key === key ? current.deliver : null;
}
