// lib/seo.js
export function yoastToMetadata(yoast, path) {
  if (!yoast) return {};
  return {
    title: yoast.title,
    description: yoast.description,
    alternates: {
      canonical: `${process.env.SITE_URL}${path}`,
    },
    openGraph: {
      title: yoast.og_title,
      description: yoast.og_description,
      url: `${process.env.SITE_URL}${path}`,
      images: yoast.og_image?.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
      })),
    },
    twitter: {
      title: yoast.twitter_title,
      description: yoast.twitter_description,
    },
  };
}
