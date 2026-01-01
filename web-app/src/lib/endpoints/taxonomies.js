/**
 * Taxonomy API endpoints
 */

// Get all taxonomies data
export async function getAllTaxonomies(taxonomies = null) {
  try {
    let url = `${process.env.NEXT_PUBLIC_WP_SITE_URL}/wine-app/v1/taxonomies`;

    if (taxonomies && Array.isArray(taxonomies)) {
      const taxonomiesParam = taxonomies.join(",");
      url += `?taxonomies=${encodeURIComponent(taxonomiesParam)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch taxonomies: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching taxonomies:", error);
    throw error;
  }
}

// Get specific taxonomy terms
export async function getTaxonomyTerms(taxonomy, options = {}) {
  try {
    const { hide_empty = false, orderby = "name", order = "ASC" } = options;

    const params = new URLSearchParams({
      hide_empty: hide_empty.toString(),
      orderby,
      order,
    });

    const url = `${process.env.NEXT_PUBLIC_WP_SITE_URL}/wp-json/wine-app/v1/taxonomies/${taxonomy}?${params}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Taxonomy '${taxonomy}' not found`);
      }
      throw new Error(`Failed to fetch taxonomy terms: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching taxonomy terms for '${taxonomy}':`, error);
    throw error;
  }
}

// Helper function to format taxonomy data for React Select
export function formatTaxonomyForSelect(taxonomyData) {
  return Object.keys(taxonomyData).reduce((acc, taxonomyName) => {
    acc[taxonomyName] = taxonomyData[taxonomyName].map((term) => ({
      value: term.slug,
      label: term.name,
      id: term.id,
      description: term.description,
      count: term.count,
    }));
    return acc;
  }, {});
}

// Helper function to get specific taxonomy options for React Select
export function getTaxonomySelectOptions(taxonomyData, taxonomyName) {
  if (!taxonomyData[taxonomyName]) {
    return [];
  }

  return taxonomyData[taxonomyName].map((term) => ({
    value: term.slug,
    label: term.name,
    id: term.id,
    description: term.description,
    count: term.count,
  }));
}
