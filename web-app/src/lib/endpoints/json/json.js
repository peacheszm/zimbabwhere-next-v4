/**
 * Get business categories for filtering
 */
export async function getBusinessCategories() {
  const baseWp = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const response = await fetch(`${baseWp}/json/business_categories.json`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch business categories: ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Get quick business search data
 */
export async function getQuickBusinessSearch() {
  const baseWp = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const response = await fetch(`${baseWp}/json/business_search.json`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch quick business search: ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Get business towns/cities for filtering
 */
export async function getBusinessTowns() {
  const baseWp = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const response = await fetch(`${baseWp}/json/business_towns_city.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch business towns: ${response.statusText}`);
  }

  return await response.json();
}

export async function getBusinessSuburbs() {
  const baseWp = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const response = await fetch(`${baseWp}/json/business_suburbs.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch business towns: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Headings a user is allowed to pick in the add / edit business forms.
 *
 * business_categories.json contains every WordPress term, including the
 * top-level (parent) ones. If those are offered, someone can end up listed
 * under both "Mechanics" and one of its sub headings. The search bar never
 * offers them, because business_search.json only lists the selectable
 * headings, so we use the category rows in that file as the source of truth.
 *
 * Pass the full list from getBusinessCategories(). Keep using the full list to
 * look up headings a business already has (a business may still be on a parent
 * heading); only use the result of this for the options a user can choose from.
 * If the search data can't be loaded we return the full list unchanged rather
 * than break the form.
 */
export async function getSelectableBusinessCategories(cats = []) {
  try {
    const baseWp = process.env.NEXT_PUBLIC_WP_SITE_URL;
    const response = await fetch(`${baseWp}/json/business_search.json`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return cats;

    const searchData = await response.json();
    const selectableIds = new Set(
      (Array.isArray(searchData) ? searchData : [])
        .filter((item) => item.type === "category")
        .map((item) => String(item.id)),
    );

    if (selectableIds.size === 0) return cats;

    return cats.filter((cat) => selectableIds.has(String(cat.id ?? cat.value)));
  } catch (error) {
    console.error("Error filtering selectable categories:", error);
    return cats;
  }
}
