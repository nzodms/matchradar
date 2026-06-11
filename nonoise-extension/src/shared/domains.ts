/** Domain helpers shared by popup, options, content and background. */

/** Hostname → registrable-ish domain ("www.lemonde.fr" → "lemonde.fr"). */
export function baseDomain(hostname: string): string {
  const parts = hostname.toLowerCase().replace(/\.$/, "").split(".");
  if (parts.length <= 2) return parts.join(".");
  // Common two-level public suffixes we care about in practice.
  const twoLevel = new Set(["co.uk", "org.uk", "ac.uk", "com.au", "com.br", "co.jp", "co.kr", "com.mx", "co.in"]);
  const lastTwo = parts.slice(-2).join(".");
  return twoLevel.has(lastTwo) ? parts.slice(-3).join(".") : lastTwo;
}

export function domainFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return baseDomain(u.hostname);
  } catch {
    return null;
  }
}

export function isCleanableUrl(url: string | undefined): boolean {
  return domainFromUrl(url) !== null;
}
