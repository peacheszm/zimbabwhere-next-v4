export async function getUserProfile(userId, token) {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_WP_SITE_URL
    }/?rest_route=/wine-app/v1/users/${userId}/profile`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(userId, profileData, token) {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_WP_SITE_URL
    }/?rest_route=/wine-app/v1/users/${userId}/profile`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function getCurrentUserProfile(userId, token) {
  try {
    if (!userId || !token) {
      throw new Error("User ID and token are required");
    }

    return await getUserProfile(userId, token);
  } catch (error) {
    console.error("Error getting current user profile:", error);
    throw error;
  }
}

export async function updateCurrentUserProfile(userId, profileData, token) {
  try {
    if (!userId || !token) {
      throw new Error("User ID and token are required");
    }

    return await updateUserProfile(userId, profileData, token);
  } catch (error) {
    console.error("Error updating current user profile:", error);
    throw error;
  }
}

export async function updateUserAvatar(userId, file, token) {
  try {
    if (!userId || !token || !file) {
      throw new Error("User ID, token, and file are required");
    }

    const url = `${
      process.env.NEXT_PUBLIC_WP_SITE_URL
    }/?rest_route=/wine-app/v1/users/${userId}/profile`;

    const formData = new FormData();
    formData.append("profile_image", file);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update user avatar: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user avatar:", error);
    throw error;
  }
}

export async function updateUserPassword(userId, newPassword, token) {
  try {
    if (!userId || !token || !newPassword) {
      throw new Error("User ID, token, and new password are required");
    }

    const url = `${
      process.env.NEXT_PUBLIC_WP_SITE_URL
    }/?rest_route=/wine-app/v1/users/${userId}/password`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.data?.message ||
          errorData.message ||
          `Failed to update password: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
}
