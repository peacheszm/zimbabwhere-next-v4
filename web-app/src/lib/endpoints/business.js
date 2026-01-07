export async function getBusinessBySlug(slug) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/business-listing?_embed&slug=${slug}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch business: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the first business if it exists
    if (data && data.length > 0) {
      return data;
    } else {
      throw new Error("Business not found");
    }
  } catch (error) {
    console.error("Error fetching business:", error);
    throw error;
  }
}

export async function getBusinessById(id) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/business-listing?_embed&include=${id}`,
      { cache: "no-store" } // optional: disable caching if you want fresh data
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch business: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the first business if it exists
    if (data && data.length > 0) {
      return data[0]; // return just the business object
    } else {
      throw new Error("Business not found");
    }
  } catch (error) {
    console.error("Error fetching business:", error);
    throw error;
  }
}

export async function getBusinessReviews(ID) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/businesses/${ID}/reviews`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch business: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching business:", error);
    throw error;
  }
}

export async function getBusinessRatings(ID) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/businesses/${ID}/ratings`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch business: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching business:", error);
    throw error;
  }
}

// /lib/endpoints/business.js
export async function createBusinessReview(business_id, formData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/businesses/${business_id}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization if needed:
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed: ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}
export async function getAllBusinesses() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/all-businesses`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed: ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all businesses:", error);
    throw error;
  }
}
