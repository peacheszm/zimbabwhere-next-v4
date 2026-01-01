export async function getNearbyFarms(lat, lng, radius = 20) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_SITE_URL}/wine-app/v1/get_nearby_farms?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch nearby farms");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching nearby farms:", error);
    return [];
  }
}

export async function getFarms(filters = {}) {
  try {
    // Build query parameters for WordPress API
    const queryParams = new URLSearchParams();

    if (filters.region) {
      queryParams.append("region", filters.region);
    }
    if (filters.producerType) {
      queryParams.append("producer_type", filters.producerType);
    }
    if (filters.localFocus) {
      queryParams.append("is_local", "true");
    }

    queryParams.append("per_page", "1000");

    const url = `${
      process.env.NEXT_PUBLIC_WP_SITE_URL
    }/?rest_route=/wine-app/v1/get_farms${
      queryParams.toString() ? `&${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch farms: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching farms:", error);
    throw error;
  }
}

export async function getSiteFarmSettings() {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_SITE_URL
    }/wp-content/uploads/webapp-settings-data.json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch farms: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching farms:", error);
    throw error;
  }
}
// Test

export async function getSingleFarms(slug) {
  try {
    // const url = `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/get_single_farm/${slug}`;
    const url = `${process.env.NEXT_PUBLIC_WP_API_URL}/wine-farm/?slug=${slug}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch farms: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching farms:", error);
    throw error;
  }
}

export async function filterFarms({
  regions = [],
  activities = [],
  perPage,
} = {}) {
  try {
    const payload = {};

    if (Array.isArray(regions) && regions.length > 0) {
      payload.regions = regions;
    }

    if (Array.isArray(activities) && activities.length > 0) {
      payload.activities = activities;
    }

    if (perPage) {
      payload.per_page = perPage;
    }
    // const url = `${
    //   process.env.NEXT_PUBLIC_WP_SITE_URL
    // }/?rest_route=/wine-app/v1/get_farms${
    //   queryParams.toString() ? `&${queryParams.toString()}` : ""
    // }`;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_SITE_URL}/wine-app/v1/filters/farms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Failed to filter farms: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error filtering farms:", error);
    throw error;
  }
}
