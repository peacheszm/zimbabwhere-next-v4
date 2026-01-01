export async function getLeaderboard() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_SITE_URL}/wine-app/v1/gamification/leaderboard`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

export async function getAllBadges() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_SITE_URL}/wine-app/v1/gamification/badges`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch badges");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching badges:", error);
    return [];
  }
}

export async function checkInToFarm(farmId, lat, lng, token) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_SITE_URL}/wine-app/v1/check-in`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          farm_id: farmId,
          lat: lat,
          lng: lng,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Check-in failed: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("Error checking in:", error);
    throw error;
  }
}
