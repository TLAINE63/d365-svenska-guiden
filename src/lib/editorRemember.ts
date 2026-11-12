export const EDITOR_REMEMBER_MS = 30 * 24 * 60 * 60 * 1000;
export function editorRememberValid(until: string | null, now = Date.now()): boolean {
  const expiry = Number(until);
  return Number.isFinite(expiry) && expiry > now && expiry <= now + EDITOR_REMEMBER_MS;
}