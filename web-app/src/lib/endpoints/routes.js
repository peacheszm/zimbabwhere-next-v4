export async function getRoutes(filters = {}) {
  const query = new URLSearchParams();
  if (filters.page) query.append("page", String(filters.page));
  if (filters.per_page) query.append("per_page", String(filters.per_page));
  if (filters.duration) query.append("duration", filters.duration);
  if (filters.category) query.append("category", filters.category);
  if (filters.region) query.append("region", filters.region);

  const base = process.env.NEXT_PUBLIC_WP_SITE_URL;
  // const url = `${base}/?rest_route=/wine-app/v1/routes${
  //   query.toString() ? `&${query.toString()}` : ""
  // }`;

  const url = `${base}/?rest_route=/wine-app/v1/routes`;

  const res = await fetch(url, { method: "GET", cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch routes: ${res.statusText}`);
  return res.json();
}

export async function getRouteBySlug(slug) {
  const base = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const url = `${base}/?rest_route=/wine-app/v1/routes/${encodeURIComponent(
    slug
  )}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch route: ${res.statusText}`);
  return res.json();
}

export async function createRoute(payload, token) {
  const base = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const url = `${base}/?rest_route=/wine-app/v1/routes`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // no quotes!
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to create route");
  return data;
}

export async function updateRoute(id, payload, token) {
  const base = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const res = await fetch(`${base}/?rest_route=/wine-app/v1/routes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to update route");
  return data;
}

export async function deleteRoute(id, token) {
  const base = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const res = await fetch(`${base}/?rest_route=/wine-app/v1/routes/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete route");
  return data;
}

export async function addRouteStop(
  id,
  { farm_id, recommended_activities, notes },
  token
) {
  const base = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const url = `${base}/?rest_route=/wine-app/v1/routes/${id}/stops`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ farm_id, recommended_activities, notes }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to add route stop");
  return data;
}

// lib/getUserRoutes.js
export async function getUserRoutes(userId, options = {}, token) {
  if (!token) throw new Error("Token is required to fetch user routes");

  const base = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const query = new URLSearchParams({
    ...(options.page && { page: options.page }),
    ...(options.per_page && { per_page: options.per_page }),
  });

  const url = `${base}/?rest_route=/wine-app/v1/users/${userId}/routes${
    query.toString() ? `&${query.toString()}` : ""
  }`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // no quotes!
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      throw new Error("Unauthorized: Invalid or expired token");
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch user routes: ${res.statusText}`);
    }

    return res.json(); // will return {routes: [], total: 0, ...}
  } catch (err) {
    console.error("Error fetching user routes:", err);
    throw err;
  }
}

// export async function getMyRoutes(token) {
//   const base = process.env.NEXT_PUBLIC_WP_SITE_URL;
//   const url = `${base}/?rest_route=/wine-app/v1/routes/my`;
//   const res = await fetch(url, {
//     headers: {
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     cache: "no-store",
//   });
//   if (!res.ok) throw new Error(`Failed to fetch my routes: ${res.statusText}`);
//   return res.json();
// }

export async function interactRoute(routeId, interactionType, token) {
  const base = process.env.NEXT_PUBLIC_WP_SITE_URL;
  const res = await fetch(
    `${base}/?rest_route=/wine-app/v1/routes/${routeId}/interact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ interaction_type: interactionType }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to record interaction");
  return data;
}
