// Link preview (share) metadata: the title, text and image shown when a link
// to the site is pasted into WhatsApp, Facebook, X, iMessage, etc.
//
// Things that used to go wrong, and what handles them here:
// - The text came straight from WordPress and had "&amp;" and HTML in it.
//   -> cleanText()
// - The image was the listing's WordPress image, which can be a PDF, missing,
//   or several MB (WhatsApp won't preview big images).
//   -> pickShareImage() skips non-images, shrinks them, and falls back to the
//      Zimbabwhere card.
// - A page that sets its own openGraph throws away the site-wide image, so a
//   page with no image of its own had none at all.
//   -> every builder here always includes an image.
import { decodeHtml } from "@/lib/utils/decodeHtml";

const SITE_URL = process.env.SITE_URL || "https://zimbabwhere.com";
export const SITE_NAME = "Zimbabwhere";

// Same card the heading pages use (black, logo + zimbabwhere.com)
export const DEFAULT_SHARE_IMAGE = {
  url: "/img/placeholder.png",
  width: 800,
  height: 600,
  alt: SITE_NAME,
};

// Preview images are shown small, so there is no need to send more than this.
// Must be one of Next's allowed widths, and Next 16 only allows quality 75.
const SHARE_IMAGE_WIDTH = 750;
const SHARE_IMAGE_QUALITY = 75;

const WP_HOST = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_WP_SITE_URL || "https://admin.zimbabwhere.com",
    ).hostname;
  } catch {
    return "admin.zimbabwhere.com";
  }
})();

const IMAGE_EXTENSION = /\.(jpe?g|png|webp|gif)$/i;
const NULL_VALUES = /^(null|none|n\/a)$/i;

/**
 * Turn a WordPress text value (may contain HTML, entities, "NULL") into one
 * line of plain text that is safe to use as a title or description.
 */
export function cleanText(value, maxLength = 200) {
  if (typeof value !== "string") return "";

  const text = decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    // Entities that were encoded twice show up as tags once decoded
    .replace(/<\/?[a-z][^>]*>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text || NULL_VALUES.test(text)) return "";
  if (text.length <= maxLength) return text;

  // Cut at a word boundary so the preview doesn't end mid-word
  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:-]+$/, "")}…`;
}

const absoluteUrl = (path) => `${SITE_URL}${path}`;

// WhatsApp, Facebook and X can't show SVGs, PDFs, etc.
function isShareableImage({ url, mime }) {
  if (!url || typeof url !== "string") return false;
  if (mime) return /^image\/(jpeg|png|webp|gif)$/i.test(mime);
  try {
    return IMAGE_EXTENSION.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

// Resize through Next's image optimizer so a 4 MB upload still previews. Only
// works for hosts allowed in next.config.mjs, anything else is used as is.
function toShareImageUrl(url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return url;
  }
  if (host !== WP_HOST) return url;

  return absoluteUrl(
    `/_next/image?url=${encodeURIComponent(url)}&w=${SHARE_IMAGE_WIDTH}&q=${SHARE_IMAGE_QUALITY}`,
  );
}

/**
 * First usable image from the candidates, else the Zimbabwhere card.
 * @param {Array<{ url?: string, mime?: string, width?: number|string, height?: number|string } | null | undefined>} candidates
 * @param {string} alt
 */
export function pickShareImage(candidates, alt = SITE_NAME) {
  const found = candidates.find((candidate) => candidate && isShareableImage(candidate));
  if (!found) {
    return { ...DEFAULT_SHARE_IMAGE, url: absoluteUrl(DEFAULT_SHARE_IMAGE.url), alt };
  }

  const width = toNumber(found.width);
  const height = toNumber(found.height);
  const scale = width ? Math.min(1, SHARE_IMAGE_WIDTH / width) : undefined;

  return {
    url: toShareImageUrl(found.url),
    // Sizes help Facebook render the first share straight away
    ...(width && height
      ? { width: Math.round(width * scale), height: Math.round(height * scale) }
      : {}),
    alt,
  };
}

/**
 * The full metadata object: page title/description plus Open Graph and X tags.
 * @param {{ title: string, description: string, path: string, image?: object, type?: string, robots?: object }} options
 * path is the page's own path (e.g. "/contact"), used for the canonical url.
 */
export function shareMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  robots,
}) {
  const url = absoluteUrl(path);
  const shareImage = image || pickShareImage([]);
  // The large card only suits wide pictures, logos and portraits get cropped
  const isWide =
    shareImage.width && shareImage.height && shareImage.width / shareImage.height >= 1.6;

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(robots ? { robots } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [shareImage],
    },
    twitter: {
      card: isWide ? "summary_large_image" : "summary",
      title,
      description,
      images: [shareImage.url],
    },
  };
}

/** For plain pages (contact, premium services...) that have a fixed title/text. */
export function pageMetadata({ title, description, path, robots }) {
  return shareMetadata({ title, description, path, robots });
}

/** Share metadata for a business listing, from the WordPress REST post. */
export function businessMetadata(post, slug) {
  const acf = post?.acf || {};
  const yoast = post?.yoast_head_json || {};
  const featured = post?._embedded?.["wp:featuredmedia"]?.[0];

  const name = cleanText(post?.title?.rendered, 120) || "Business listing";
  const town = cleanText(acf.town?.name, 60);

  const title = cleanText(yoast.title, 120) || `${name} - ${SITE_NAME}`;

  // Same order the page uses for its text (description, then overview)
  const description =
    cleanText(acf.business_description) ||
    cleanText(acf.business_overview) ||
    cleanText(acf.business_motto) ||
    cleanText(yoast.og_description) ||
    `${name}${town ? ` in ${town}` : ""}. View contact details and get a free quote on ${SITE_NAME}.`;

  // Same order the page uses for the logo: featured image, then the logo field
  const image = pickShareImage(
    [
      featured && {
        url: featured.source_url,
        mime: featured.mime_type,
        width: featured.media_details?.width,
        height: featured.media_details?.height,
      },
      acf.logo && {
        url: acf.logo.url,
        mime: acf.logo.mime_type,
        width: acf.logo.width,
        height: acf.logo.height,
      },
      ...(yoast.og_image || []).map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
      })),
    ],
    name,
  );

  return shareMetadata({
    title,
    description,
    path: `/business/${slug}`,
    image,
    type: "website",
  });
}

/** Share metadata for a quote request, from the WordPress REST post. */
export function quoteMetadata(post, slug) {
  const name = cleanText(post?.title?.rendered, 120) || "Quote request";
  const town = cleanText(post?.acf?.town_city?.name, 60);
  const body = cleanText(post?.content?.rendered, 200);

  const description = body
    ? `${town ? `${town}: ` : ""}${body}`
    : `${name}${town ? ` in ${town}` : ""}. Open quote request on ${SITE_NAME}, send a quote if you can help.`;

  return shareMetadata({
    title: `${name} | Quote request | ${SITE_NAME}`,
    description,
    path: `/quotes/${slug}`,
    image: pickShareImage([], name),
  });
}
