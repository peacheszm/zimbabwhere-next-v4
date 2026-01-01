// ===== ADVERTISEMENT API =====

/**
 * Get active billboard advertisements
 */
export async function getBillboardAds() {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  const response = await fetch(`${baseWp}/ads/billboard`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ads: ${response.statusText}`);
  }
  return await response.json();
}

// /**
//  * Get active featured logo advertisements
//  */
export async function getFeaturedLogoAds() {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  const response = await fetch(`${baseWp}/ads/featured-logos`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ads: ${response.statusText}`);
  }
  return await response.json();
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
