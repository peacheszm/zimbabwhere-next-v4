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
