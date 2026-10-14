// Share / SEO metadata for a heading page (e.g. "Mechanic"), used by
// /headings/[slug].
const SITE_URL = process.env.SITE_URL || "https://zimbabwhere.com";

export function getHeadingPath(slug) {
  return `/headings/${slug}`;
}

/**
 * @param {{ name: string, slug: string, count?: number | null }} heading
 * count is the number of businesses listed under the heading. Pass null/undefined
 * when it couldn't be loaded, so a failed request doesn't mark the page noindex.
 */
export function headingMetadata({ name, slug, count }) {
  const path = getHeadingPath(slug);
  const title = `${name} in Zimbabwe | Zimbabwhere`;

  const description =
    typeof count === "number" && count > 0
      ? `Find ${count} ${name} listed on Zimbabwhere. View contact details, compare local businesses and get a free quote.`
      : `Looking for ${name} in Zimbabwe? Search local businesses on Zimbabwhere and get a free quote.`;

  const image = {
    url: `/og/heading/${slug}`,
    width: 1200,
    height: 630,
    alt: `${name} on Zimbabwhere`,
  };

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    // A heading with nobody listed is a thin page, keep it out of search results
    ...(count === 0 ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Zimbabwhere",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
