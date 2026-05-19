// ===== ADVERTISEMENT API =====

/**
 * Get active billboard advertisements
 */
export async function getBillboardAds() {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  try {
    const response = await fetch(`${baseWp}/ads/billboard`);
    if (!response.ok) {
      console.error(`Failed to fetch billboard ads: ${response.statusText}`);
      return { data: [] };
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching billboard ads:", error);
    return { data: [] };
  }
}

// /**
//  * Get active featured logo advertisements
//  */
export async function getFeaturedLogoAds() {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  try {
    const response = await fetch(`${baseWp}/ads/featured-logos`);
    if (!response.ok) {
      console.error(`Failed to fetch featured logo ads: ${response.statusText}`);
      return { data: [] };
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching featured logo ads:", error);
    return { data: [] };
  }
}

// /**
//  * Get active video display advertisements
//  */
// export async function getVideoDisplayAds() {
//   return this.request("/ads/video-display");
// }

// /**
//  * Get active premium listings
//  */
// export async function getPremiumListings() {
//   return this.request("/ads/premium-listings");
// }
