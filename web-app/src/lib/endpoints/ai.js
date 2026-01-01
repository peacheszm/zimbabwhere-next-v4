/**
 * AI-powered search endpoint
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_WP_SITE_URL || "https://stage.justlime.com/wines/wp-json";
// test
/**
 * Search farms using Claude AI
 * @param {string} query - Natural language search query
 * @param {object} userLocation - Optional user location { latitude, longitude }
 * @returns {Promise} API response with matched farms
 */
export async function searchFarmsWithAI(query, userLocation = null) {
  try {
    const payload = { query };

    // Add location if provided
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      payload.user_location = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/wine-app/v1/ai/search-farms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search farms");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("AI Search Error:", error);
    throw error;
  }
}
