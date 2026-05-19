export async function getPagesBySlug(slug) {
  const baseWp = process.env.NEXT_PUBLIC_WP_API_URL;

  try {
    const response = await fetch(`${baseWp}/pages?_embed&slug=${slug}`);
    if (!response.ok) {
      console.error(`Failed to fetch page by slug ${slug}: ${response.statusText}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching page by slug ${slug}:`, error);
    return [];
  }
}
