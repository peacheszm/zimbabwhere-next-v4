export async function getCurrentUserBusinesses(token) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  const response = await fetch(`${baseWp}/users/me/businesses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer "${token}"`,
    },
  });

  if (!response.ok) {
    // Get more detailed error information
    let errorMessage = `Failed to get Business: ${response.status} ${response.statusText}`;
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

export async function updateCurrentUserBusinesses(
  token,
  businessId,
  updateData
) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  // Validate businessId
  if (
    !businessId ||
    (typeof businessId !== "string" && typeof businessId !== "number")
  ) {
    throw new Error(
      `Invalid business ID: ${businessId}. Expected a string or number.`
    );
  }

  const isFormData =
    typeof FormData !== "undefined" && updateData instanceof FormData;

  // Debug logging
  console.log("updateCurrentUserBusinesses - isFormData:", isFormData);
  console.log("updateCurrentUserBusinesses - updateData:", updateData);
  console.log(
    "updateCurrentUserBusinesses - updateData instanceof FormData:",
    updateData instanceof FormData
  );

  if (isFormData) {
    console.log("updateCurrentUserBusinesses - FormData entries:");
    for (let [key, value] of updateData.entries()) {
      console.log(key, value);
    }
  }

  const response = await fetch(`${baseWp}/businesses/${businessId}`, {
    method: "PUT",
    headers: isFormData
      ? {
          Authorization: `Bearer "${token}"`,
        }
      : {
          "Content-Type": "application/json",
          Authorization: `Bearer "${token}"`,
        },
    body: isFormData ? updateData : JSON.stringify(updateData),
  });

  if (!response.ok) {
    // Get more detailed error information
    let errorMessage = `Failed to update Business: ${response.status} ${response.statusText}`;
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

export async function createUsersBusinesses(token, businessData) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  const isFormData = businessData instanceof FormData;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseWp}/businesses`, {
    method: "POST",
    headers,
    body: isFormData ? businessData : JSON.stringify(businessData),
  });

  if (!response.ok) {
    // Get more detailed error information
    let errorMessage = `Failed to create Business: ${response.status} ${response.statusText}`;
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

export async function uploadBusinessLogo(token, businessId, logoFile) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  const formData = new FormData();
  formData.append("logo", logoFile);

  console.log("uploadBusinessLogo - FormData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const response = await fetch(`${baseWp}/businesses/${businessId}/logo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer "${token}"`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `Failed to upload logo: ${response.status} ${response.statusText}`;
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

export async function uploadBusinessBanner(token, businessId, bannerFile) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  const formData = new FormData();
  formData.append("business_banner", bannerFile);

  console.log("uploadBusinessBanner - FormData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const response = await fetch(`${baseWp}/businesses/${businessId}/banner`, {
    method: "POST",
    headers: {
      Authorization: `Bearer "${token}"`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `Failed to upload banner: ${response.status} ${response.statusText}`;
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

export async function uploadBusinessGallery(token, businessId, formData) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  // Validate businessId
  if (
    !businessId ||
    (typeof businessId !== "string" && typeof businessId !== "number")
  ) {
    throw new Error(
      `Invalid business ID: ${businessId}. Expected a string or number.`
    );
  }

  console.log("uploadBusinessGallery - businessId:", businessId);
  console.log("uploadBusinessGallery - formData:", formData);

  const response = await fetch(`${baseWp}/businesses/${businessId}/gallery`, {
    method: "POST",
    headers: {
      Authorization: `Bearer "${token}"`,
    },
    body: formData,
  });

  if (!response.ok) {
    // Get more detailed error information
    let errorMessage = `Failed to upload gallery files: ${response.status} ${response.statusText}`;
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
 * Get user notification preferences
 */
export async function getCurrentUserNotifications(token) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  const response = await fetch(`${baseWp}/users/me/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer "${token}"`,
    },
  });

  if (!response.ok) {
    let errorMessage = `Failed to fetch notifications: ${response.status} ${response.statusText}`;
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
 * Update user notification preferences
 */
export async function updateCurrentUserNotifications(notificationData, token) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  const response = await fetch(`${baseWp}/users/me/notifications`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer "${token}"`,
    },
    body: JSON.stringify(notificationData),
  });

  if (!response.ok) {
    let errorMessage = `Failed to update notifications: ${response.status} ${response.statusText}`;
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
