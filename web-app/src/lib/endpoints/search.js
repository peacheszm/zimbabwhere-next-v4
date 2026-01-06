export async function getBusinessesSearch(params = {}) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  if (!baseWp) {
    throw new Error(
      "NEXT_PUBLIC_WORDPRESS_ENDPOINT environment variable is not defined"
    );
  }

  // Convert parameters to match the old API format
  const searchParams = {};

  if (params.search) searchParams.search_term = params.search;
  if (params.category) searchParams.category_filter = params.category;
  if (params.area || params.town)
    searchParams.location_filter = params.area || params.town;

  const queryString = new URLSearchParams(searchParams).toString();

  const response = await fetch(`${baseWp}/businesses?${queryString}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch businesses: ${response.statusText}`);
  }

  // Return in the exact format expected by components (featured/normal structure)
  return response.json();
}
