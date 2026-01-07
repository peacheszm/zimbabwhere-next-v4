// ===== BUSINESS PAID LISTING API =====

export async function getCurrentUserPurchases(token) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  const response = await fetch(`${baseWp}/users/me/purchases`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer "${token}"`,
    },
  });

  if (!response.ok) {
    let errorMessage = `Failed to fetch purchases: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.text();
      errorMessage += ` - ${errorBody}`;
    } catch (e) {
      // Could not read error response body
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}

/**
 * Select business for advertisement
 */
export async function selectBusinessForAdvertisement(adData, token) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  console.log(adData);

  if (!baseWp) {
    throw new Error(
      "NEXT_PUBLIC_CUSTOM_WORDPRESS_ENDPOINT environment variable is not defined"
    );
  }

  if (!token) {
    throw new Error("Authentication token is required");
  }

  // Map all ad types to upgrade endpoints
  const rawType = String(adData?.ad_type || "").toLowerCase();
  const type = rawType.replace(/\s+/g, "_");
  const typeToSlug = {
    featured: "featured",
    home_page_logo_display: "home-display",
    home_page_billboard_display: "home-billboard-display",
    video_display_on_every_page: "video-display",
    premium_listing: "premium-listing",
  };
  const upgradeType =
    typeToSlug[type] || (type.includes("featured") ? "featured" : null);

  let response;

  if (!adData?.business_id) {
    throw new Error("Invalid payload: adData.business_id is required");
  }
  if (!upgradeType) {
    throw new Error(
      `Unsupported ad_type: ${adData?.ad_type}. Expected one of ${Object.keys(
        typeToSlug
      ).join(", ")}`
    );
  }
  response = await fetch(
    `${baseWp}/businesses/${adData.business_id}/upgrade/${upgradeType}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer "${token}"`,
      },
      // Pass through any helpful metadata (order_id etc.). Backend may ignore.
      body: JSON.stringify(adData),
    }
  );

  if (!response.ok) {
    let errorMessage = `Failed to select business for advertisement: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.text();
      errorMessage += ` - ${errorBody}`;
    } catch (e) {
      // Could not read error response body
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}
