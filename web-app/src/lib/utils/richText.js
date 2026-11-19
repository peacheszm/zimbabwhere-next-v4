import { decodeHtml } from "@/lib/utils/decodeHtml";

// The business description is a rich text (WYSIWYG) field in WordPress, so it
// comes back as HTML ("<p>Text</p>\n"). The edit form is a plain text box, so
// owners saw the tags at the start and end of their text. These two helpers
// turn the saved HTML into plain text for the box, and the typed text back
// into HTML when saving.

const NULL_VALUES = /^(null|none|n\/a)$/i;

const escapeHtml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Saved HTML -> plain text with line breaks, for a textarea. */
export function htmlToPlainText(html) {
  if (typeof html !== "string") return "";

  const text = decodeHtml(
    html
      .replace(/\r\n?/g, "\n")
      // Drop the newlines WordPress adds between tags
      .replace(/>\s*\n\s*</g, "><")
      .replace(/<br\s*\/?>\s*\n?/gi, "\n")
      .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
      .replace(/<\/(div|li|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    // Entities that were encoded twice show up as tags once decoded
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Imported listings have a literal "NULL" as their description
  return NULL_VALUES.test(text) ? "" : text;
}

/** Plain text from a textarea -> HTML paragraphs for the WYSIWYG field. */
export function plainTextToHtml(text) {
  const clean = (text || "").replace(/\r\n?/g, "\n").trim();
  if (!clean) return "";

  return clean
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />\n")}</p>`)
    .join("\n");
}
