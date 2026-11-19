// Business websites come from a free text field. Imported listings have the
// literal text "NULL" in it, and owners often type "www.example.co.zw" without
// "https://". An href like that is treated as a path on our own site, which is
// why those "Visit Website" links ended up on our 404 page.

const EMPTY_VALUES = /^(null|none|n\/a|na|undefined|-+)$/i;

/**
 * Turn whatever was saved as a business website into a safe absolute URL.
 * Returns "" when there is nothing usable, so callers can hide the link.
 */
export function cleanWebsiteUrl(value) {
  if (typeof value !== "string") return "";

  let url = value.trim();
  if (!url || EMPTY_VALUES.test(url)) return "";

  // "http:www.example.com" / "https:/www.example.com" -> proper "://"
  url = url.replace(/^(https?):\/{0,2}(?=[^/])/i, "$1://");

  // No scheme at all ("www.example.com", "example.co.zw/shop")
  if (!/^https?:\/\//i.test(url)) {
    // Something like "mailto:" or "javascript:" is not a website
    if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return "";
    url = `https://${url.replace(/^\/+/, "")}`;
  }

  try {
    const parsed = new URL(url);
    // Needs a real host name, not just "https://NULL"
    if (!parsed.hostname.includes(".") || /\s/.test(parsed.hostname)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}
