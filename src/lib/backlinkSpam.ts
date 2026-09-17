// Enkla regler för att flagga uppenbara skräpdomäner bland backlänkar.
const SPAM_HOST_PATTERNS = [
  "blogspot.",
  "wordpress.com",
  "weebly.com",
  "wixsite.com",
  "tumblr.com",
  "medium.com/@",
  "over-blog",
  "livejournal.com",
  "webnode.",
  "jimdosite.com",
];

const SPAM_TLDS = [
  ".sbs",
  ".xyz",
  ".top",
  ".buzz",
  ".icu",
  ".cyou",
  ".click",
  ".rest",
  ".monster",
  ".quest",
  ".shop",
  ".bond",
  ".cfd",
  ".lol",
  ".sbs.",
];

export function isLikelySpamDomain(
  domain: string,
  authority: number | null | undefined,
  backlinks: number | null | undefined,
): boolean {
  const d = String(domain || "").toLowerCase().trim();
  if (!d) return false;
  const a = typeof authority === "number" ? authority : null;
  const b = typeof backlinks === "number" ? backlinks : 0;

  if (SPAM_HOST_PATTERNS.some((p) => d.includes(p))) return true;
  if (SPAM_TLDS.some((t) => d.endsWith(t))) return true;
  if (a !== null && a < 5) return true;
  if (a !== null && a < 10 && b > 20) return true;
  return false;
}
