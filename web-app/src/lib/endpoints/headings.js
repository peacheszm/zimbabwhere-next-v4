// Headings (WordPress `business_cat` terms) as they are used for the public
// /headings/[slug] pages.

const REVALIDATE = 3600;

async function getAllHeadings() {
  const baseWp = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const response = await fetch(`${baseWp}/json/business_categories.json`, {
    next: { revalidate: REVALIDATE },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch headings: ${response.statusText}`);
  }

  const headings = await response.json();
  return Array.isArray(headings) ? headings : [];
}

/**
 * Find a heading by its slug. Returns null if it doesn't exist.
 */
export async function getHeadingBySlug(slug) {
  try {
    const headings = await getAllHeadings();
    return headings.find((heading) => heading.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching heading:", error);
    return null;
  }
}

/**
 * Find a heading by its WordPress term id. Returns null if it doesn't exist.
 */
export async function getHeadingById(id) {
  try {
    const headings = await getAllHeadings();
    return headings.find((heading) => String(heading.id) === String(id)) || null;
  } catch (error) {
    console.error("Error fetching heading:", error);
    return null;
  }
}

/**
 * Every heading that has at least one business listed directly under it (used
 * for the sitemap, so we don't submit thousands of empty pages). WordPress's
 * hide_empty also keeps parents that only have businesses in their sub
 * headings, so those are filtered out on count.
 */
export async function getHeadingsWithBusinesses() {
  try {
    const all = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WP_API_URL}/business_cat?per_page=100&page=${page}&hide_empty=true&_fields=id,slug,count`,
        { next: { revalidate: REVALIDATE } },
      );

      if (!response.ok) break;

      const data = await response.json();
      all.push(...data);

      totalPages = Number(response.headers.get("x-wp-totalpages")) || 1;
      page += 1;
    } while (page <= totalPages);

    return all.filter((heading) => heading.count > 0);
  } catch (error) {
    console.error("Error fetching headings with businesses:", error);
    return [];
  }
}
